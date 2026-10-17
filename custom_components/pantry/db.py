"""SQLite storage: connection, migrations, and an executor-backed wrapper."""

from __future__ import annotations

import asyncio
import sqlite3
import threading
from collections.abc import Callable
from functools import partial
from typing import TYPE_CHECKING, Any

from homeassistant.helpers.dispatcher import async_dispatcher_send

from .const import SIGNAL_CHANGED
from .seed import seed
from .seed_types import NEW_IN_9, add_seed_extras

if TYPE_CHECKING:
    from homeassistant.core import HomeAssistant

# Never edit an existing step; append a new one.
# A step is an SQL script or a callable(conn) run in the same transaction.
MIGRATIONS: list[str | Callable[[sqlite3.Connection], None]] = [
    """
    CREATE TABLE unit (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        symbol TEXT NOT NULL,
        base_unit_id INTEGER REFERENCES unit(id),
        factor REAL NOT NULL DEFAULT 1,
        is_count INTEGER NOT NULL DEFAULT 0
    );
    CREATE TABLE location (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        sort INTEGER NOT NULL DEFAULT 0
    );
    CREATE TABLE category (
        id INTEGER PRIMARY KEY,
        parent_id INTEGER REFERENCES category(id) ON DELETE RESTRICT,
        name TEXT NOT NULL,
        sort INTEGER NOT NULL DEFAULT 0,
        off_tags TEXT NOT NULL DEFAULT '[]',
        unit_id INTEGER REFERENCES unit(id),
        default_location_id INTEGER REFERENCES location(id),
        expiry_type TEXT CHECK (expiry_type IN ('best_before', 'use_by')),
        warn_days INTEGER CHECK (warn_days >= 0),
        min_stock REAL CHECK (min_stock > 0),
        UNIQUE (parent_id, name)
    );
    CREATE TABLE product (
        id INTEGER PRIMARY KEY,
        ean TEXT UNIQUE,
        name TEXT NOT NULL,
        brand TEXT,
        category_id INTEGER NOT NULL REFERENCES category(id) ON DELETE RESTRICT,
        content_amount REAL CHECK (content_amount > 0),
        content_unit_id INTEGER REFERENCES unit(id),
        default_location_id INTEGER REFERENCES location(id),
        expiry_type TEXT CHECK (expiry_type IN ('best_before', 'use_by')),
        warn_days INTEGER CHECK (warn_days >= 0),
        image_url TEXT,
        off_json TEXT,
        updated_at TEXT NOT NULL
    );
    CREATE TABLE batch (
        id INTEGER PRIMARY KEY,
        product_id INTEGER NOT NULL REFERENCES product(id) ON DELETE CASCADE,
        expires_on TEXT,
        expiry_type TEXT NOT NULL CHECK (expiry_type IN ('best_before', 'use_by')),
        created_at TEXT NOT NULL,
        UNIQUE (product_id, expires_on, expiry_type)
    );
    CREATE TABLE stock (
        batch_id INTEGER NOT NULL REFERENCES batch(id) ON DELETE CASCADE,
        location_id INTEGER NOT NULL REFERENCES location(id) ON DELETE RESTRICT,
        packages INTEGER NOT NULL CHECK (packages > 0),
        PRIMARY KEY (batch_id, location_id)
    );
    -- packages is always positive; kind gives the direction ('correct': signed difference).
    -- 'move' is one row: location_id = source, to_location_id = target.
    CREATE TABLE booking (
        id INTEGER PRIMARY KEY,
        ts TEXT NOT NULL,
        kind TEXT NOT NULL CHECK (kind IN ('in', 'out', 'move', 'correct')),
        batch_id INTEGER,
        location_id INTEGER,
        to_location_id INTEGER,
        packages INTEGER NOT NULL,
        source TEXT NOT NULL,
        user_id TEXT
    );
    """,
    # 2: the date type belongs to the product (own or inherited), not to a batch.
    # Batches that differed only by type merge (lowest id wins; stock summed, bookings repointed).
    # The new tables reference each other before the renames, so dropping the old ones cascades nothing.
    """
    CREATE TABLE batch_new (
        id INTEGER PRIMARY KEY,
        product_id INTEGER NOT NULL REFERENCES product(id) ON DELETE CASCADE,
        expires_on TEXT,
        created_at TEXT NOT NULL,
        UNIQUE (product_id, expires_on)
    );
    INSERT INTO batch_new (id, product_id, expires_on, created_at)
        SELECT MIN(id), product_id, expires_on, MIN(created_at) FROM batch GROUP BY product_id, expires_on;
    CREATE TEMP TABLE batch_map AS
        SELECT b.id AS old_id, k.id AS new_id FROM batch b
        JOIN batch_new k ON k.product_id = b.product_id AND k.expires_on IS b.expires_on;
    CREATE TABLE stock_new (
        batch_id INTEGER NOT NULL REFERENCES batch_new(id) ON DELETE CASCADE,
        location_id INTEGER NOT NULL REFERENCES location(id) ON DELETE RESTRICT,
        packages INTEGER NOT NULL CHECK (packages > 0),
        PRIMARY KEY (batch_id, location_id)
    );
    INSERT INTO stock_new (batch_id, location_id, packages)
        SELECT m.new_id, s.location_id, SUM(s.packages) FROM stock s
        JOIN batch_map m ON m.old_id = s.batch_id GROUP BY m.new_id, s.location_id;
    UPDATE booking SET batch_id = (SELECT new_id FROM batch_map WHERE old_id = booking.batch_id)
        WHERE batch_id IN (SELECT old_id FROM batch_map);
    DROP TABLE stock;
    DROP TABLE batch;
    DROP TABLE batch_map;
    ALTER TABLE batch_new RENAME TO batch;
    ALTER TABLE stock_new RENAME TO stock;
    """,
    # 3: normalization and integrity. Runs with foreign keys off (see migrate), so tables can be
    # rebuilt; the foreign key check before the commit catches anything left dangling.
    # - OFF tags in their own table (each tag once), linked to categories (n:m)
    # - unit.is_count / factor and product content pair as CHECKs
    # - locations are deactivated instead of deleted, so bookings can reference them (FKs)
    # - integration-wide defaults in a one-row table (editable in the settings)
    """
    CREATE TABLE off_tag (
        id INTEGER PRIMARY KEY,
        tag TEXT NOT NULL UNIQUE
    );
    CREATE TABLE category_off_tag (
        category_id INTEGER NOT NULL REFERENCES category(id) ON DELETE CASCADE,
        off_tag_id INTEGER NOT NULL REFERENCES off_tag(id) ON DELETE CASCADE,
        PRIMARY KEY (category_id, off_tag_id)
    );
    INSERT OR IGNORE INTO off_tag (tag)
        SELECT DISTINCT j.value FROM category c, json_each(c.off_tags) j;
    INSERT OR IGNORE INTO category_off_tag (category_id, off_tag_id)
        SELECT c.id, t.id FROM category c, json_each(c.off_tags) j JOIN off_tag t ON t.tag = j.value;
    ALTER TABLE category DROP COLUMN off_tags;

    UPDATE unit SET is_count = (is_count <> 0);
    CREATE TABLE unit_new (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        symbol TEXT NOT NULL,
        base_unit_id INTEGER REFERENCES unit(id),
        factor REAL NOT NULL DEFAULT 1 CHECK (factor > 0),
        is_count INTEGER NOT NULL DEFAULT 0 CHECK (is_count IN (0, 1))
    );
    INSERT INTO unit_new (id, name, symbol, base_unit_id, factor, is_count)
        SELECT id, name, symbol, base_unit_id, factor, is_count FROM unit;
    DROP TABLE unit;
    ALTER TABLE unit_new RENAME TO unit;

    UPDATE product SET content_amount = NULL, content_unit_id = NULL
        WHERE (content_amount IS NULL) <> (content_unit_id IS NULL);
    CREATE TABLE product_new (
        id INTEGER PRIMARY KEY,
        ean TEXT UNIQUE,
        name TEXT NOT NULL,
        brand TEXT,
        category_id INTEGER NOT NULL REFERENCES category(id) ON DELETE RESTRICT,
        content_amount REAL CHECK (content_amount > 0),
        content_unit_id INTEGER REFERENCES unit(id),
        default_location_id INTEGER REFERENCES location(id),
        expiry_type TEXT CHECK (expiry_type IN ('best_before', 'use_by')),
        warn_days INTEGER CHECK (warn_days >= 0),
        image_url TEXT,
        off_json TEXT,
        updated_at TEXT NOT NULL,
        CHECK ((content_amount IS NULL) = (content_unit_id IS NULL))
    );
    INSERT INTO product_new SELECT id, ean, name, brand, category_id, content_amount, content_unit_id,
        default_location_id, expiry_type, warn_days, image_url, off_json, updated_at FROM product;
    DROP TABLE product;
    ALTER TABLE product_new RENAME TO product;

    ALTER TABLE location ADD COLUMN active INTEGER NOT NULL DEFAULT 1 CHECK (active IN (0, 1));

    -- Bookings of deleted batches / locations cannot be kept with foreign keys.
    DELETE FROM booking WHERE batch_id IS NULL OR batch_id NOT IN (SELECT id FROM batch);
    UPDATE booking SET location_id = NULL WHERE location_id NOT IN (SELECT id FROM location);
    UPDATE booking SET to_location_id = NULL WHERE to_location_id NOT IN (SELECT id FROM location);
    CREATE TABLE booking_new (
        id INTEGER PRIMARY KEY,
        ts TEXT NOT NULL,
        kind TEXT NOT NULL CHECK (kind IN ('in', 'out', 'move', 'correct')),
        batch_id INTEGER NOT NULL REFERENCES batch(id) ON DELETE CASCADE,
        location_id INTEGER REFERENCES location(id),
        to_location_id INTEGER REFERENCES location(id),
        packages INTEGER NOT NULL,
        source TEXT NOT NULL,
        user_id TEXT
    );
    INSERT INTO booking_new SELECT id, ts, kind, batch_id, location_id, to_location_id, packages,
        source, user_id FROM booking;
    DROP TABLE booking;
    ALTER TABLE booking_new RENAME TO booking;
    CREATE INDEX booking_batch ON booking (batch_id);

    CREATE TABLE defaults (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        unit_id INTEGER NOT NULL REFERENCES unit(id),
        default_location_id INTEGER REFERENCES location(id),
        expiry_type TEXT NOT NULL CHECK (expiry_type IN ('best_before', 'use_by')),
        warn_days INTEGER NOT NULL CHECK (warn_days >= 0)
    );
    -- Same values as the former hard-coded ones; a new DB gets its row from the seed.
    INSERT INTO defaults (id, unit_id, expiry_type, warn_days)
        SELECT 1, id, 'best_before', 7 FROM unit ORDER BY is_count DESC, id LIMIT 1;
    """,
    # 4: min stock keeps its own unit (an inherited unit changing higher up silently changed its
    # meaning), plus a minimum package count. Existing minimums get the unit they had in effect.
    # shopping_done: checked shopping items; `missing` is the shortage when checked, so the item
    # comes back once its shortage changes.
    """
    CREATE TEMP TABLE min_unit AS
        WITH RECURSIVE up(cid, parent_id, unit_id) AS (
            SELECT id, parent_id, unit_id FROM category WHERE min_stock IS NOT NULL
            UNION ALL
            SELECT up.cid, c.parent_id, c.unit_id FROM up JOIN category c ON c.id = up.parent_id
                WHERE up.unit_id IS NULL
        )
        SELECT cid, COALESCE(MAX(unit_id), (SELECT unit_id FROM defaults WHERE id = 1)) AS unit_id
        FROM up GROUP BY cid;
    CREATE TABLE category_new (
        id INTEGER PRIMARY KEY,
        parent_id INTEGER REFERENCES category(id) ON DELETE RESTRICT,
        name TEXT NOT NULL,
        sort INTEGER NOT NULL DEFAULT 0,
        unit_id INTEGER REFERENCES unit(id),
        default_location_id INTEGER REFERENCES location(id),
        expiry_type TEXT CHECK (expiry_type IN ('best_before', 'use_by')),
        warn_days INTEGER CHECK (warn_days >= 0),
        min_stock REAL CHECK (min_stock > 0),
        min_stock_unit_id INTEGER REFERENCES unit(id),
        min_packages INTEGER CHECK (min_packages > 0),
        UNIQUE (parent_id, name),
        CHECK ((min_stock IS NULL) = (min_stock_unit_id IS NULL))
    );
    INSERT INTO category_new SELECT c.id, c.parent_id, c.name, c.sort, c.unit_id,
        c.default_location_id, c.expiry_type, c.warn_days, c.min_stock, m.unit_id, NULL
        FROM category c LEFT JOIN min_unit m ON m.cid = c.id;
    DROP TABLE min_unit;
    DROP TABLE category;
    ALTER TABLE category_new RENAME TO category;
    CREATE TABLE shopping_done (
        category_id INTEGER PRIMARY KEY REFERENCES category(id) ON DELETE CASCADE,
        missing TEXT NOT NULL
    );
    """,
    # 5: items put on the shopping list by hand: a product or a whole category (any of it).
    # Adding the same again adds to the packages (see inventory.add_shopping_item).
    """
    CREATE TABLE shopping_item (
        id INTEGER PRIMARY KEY,
        product_id INTEGER UNIQUE REFERENCES product(id) ON DELETE CASCADE,
        category_id INTEGER UNIQUE REFERENCES category(id) ON DELETE CASCADE,
        packages INTEGER NOT NULL DEFAULT 1 CHECK (packages > 0),
        done INTEGER NOT NULL DEFAULT 0 CHECK (done IN (0, 1)),
        created_at TEXT NOT NULL,
        CHECK ((product_id IS NULL) <> (category_id IS NULL))
    );
    """,
    # 6: integrity the app relied on but SQLite did not enforce (NULLs are distinct in UNIQUE):
    # - root categories have unique names; duplicates get " (2)", " (3)" ... (lowest id keeps its name;
    #   shortcut: a root already named "X (2)" would still collide, rename it by hand then)
    # - one batch without a date per product; duplicates merge into the lowest id (stock summed,
    #   bookings repointed)
    # - booking.reverts_id: an 'in' booking written by an undo names the 'out' booking it reverses
    #   (unique, so a book-out can be undone once)
    """
    CREATE TEMP TABLE cat_dup AS
        SELECT id, ROW_NUMBER() OVER (PARTITION BY name ORDER BY id) AS n FROM category
        WHERE parent_id IS NULL;
    UPDATE category SET name = name || ' (' || (SELECT n FROM cat_dup WHERE cat_dup.id = category.id) || ')'
        WHERE id IN (SELECT id FROM cat_dup WHERE n > 1);
    DROP TABLE cat_dup;
    CREATE UNIQUE INDEX category_root_name ON category (name) WHERE parent_id IS NULL;

    CREATE TEMP TABLE batch_map AS
        SELECT b.id AS old_id,
            (SELECT MIN(k.id) FROM batch k WHERE k.product_id = b.product_id AND k.expires_on IS NULL) AS new_id
        FROM batch b WHERE b.expires_on IS NULL;
    DELETE FROM batch_map WHERE old_id = new_id;
    INSERT INTO stock (batch_id, location_id, packages)
        SELECT m.new_id, s.location_id, SUM(s.packages) FROM stock s
        JOIN batch_map m ON m.old_id = s.batch_id WHERE true GROUP BY m.new_id, s.location_id
        ON CONFLICT (batch_id, location_id) DO UPDATE SET packages = packages + excluded.packages;
    DELETE FROM stock WHERE batch_id IN (SELECT old_id FROM batch_map);
    UPDATE booking SET batch_id = (SELECT new_id FROM batch_map WHERE old_id = booking.batch_id)
        WHERE batch_id IN (SELECT old_id FROM batch_map);
    DELETE FROM batch WHERE id IN (SELECT old_id FROM batch_map);
    DROP TABLE batch_map;
    CREATE UNIQUE INDEX batch_no_date ON batch (product_id) WHERE expires_on IS NULL;

    ALTER TABLE booking ADD COLUMN reverts_id INTEGER REFERENCES booking(id);
    CREATE UNIQUE INDEX booking_reverts ON booking (reverts_id);
    """,
    # 7: recipes. An ingredient keys on a category node (any product in its subtree counts; the
    # lowest level is the "Produktart"). `text` is a name snapshot: the category's name while it is
    # set, the typed name when unmatched (kept when the category is deleted); `note` is a free hint.
    # force_delete of a unit clears amount + unit together (both or none).
    # Ingredient order = id order (save replaces them all).
    """
    CREATE TABLE recipe (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        servings INTEGER NOT NULL CHECK (servings > 0),
        instructions TEXT,
        source_url TEXT,
        image_url TEXT
    );
    CREATE TABLE recipe_ingredient (
        id INTEGER PRIMARY KEY,
        recipe_id INTEGER NOT NULL REFERENCES recipe(id) ON DELETE CASCADE,
        category_id INTEGER REFERENCES category(id) ON DELETE SET NULL,
        amount REAL CHECK (amount > 0),
        unit_id INTEGER REFERENCES unit(id),
        text TEXT NOT NULL,
        note TEXT,
        optional INTEGER NOT NULL DEFAULT 0 CHECK (optional IN (0, 1)),
        CHECK ((amount IS NULL) = (unit_id IS NULL))
    );
    CREATE INDEX recipe_ingredient_recipe ON recipe_ingredient (recipe_id);
    """,
    # 8: seeded product types for existing DBs (a new DB gets them from the seed).
    add_seed_extras,
    # 9: units cl/dl and a few product types for existing DBs (only those, deleted ones stay gone).
    partial(add_seed_extras, only=NEW_IN_9),
    # 10: ingredient never checked against the stock (salt, water): no status, not on the shopping list.
    "ALTER TABLE recipe_ingredient ADD COLUMN skip_stock INTEGER NOT NULL DEFAULT 0"
    " CHECK (skip_stock IN (0, 1));",
    # 11: min packages per product (counts toward its categories' minimums); its checked
    # shopping items, like shopping_done for categories.
    """
    ALTER TABLE product ADD COLUMN min_packages INTEGER CHECK (min_packages > 0);
    CREATE TABLE shopping_done_product (
        product_id INTEGER PRIMARY KEY REFERENCES product(id) ON DELETE CASCADE,
        missing TEXT NOT NULL
    );
    """,
]


def connect(path: str) -> sqlite3.Connection:
    """Open a connection usable from executor threads (callers serialize access)."""
    conn = sqlite3.connect(path, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys=ON")
    return conn


def migrate(conn: sqlite3.Connection) -> None:
    """Apply missing steps, one transaction each; seed while there are no units.

    Foreign keys are off during a step (SQLite's way to rebuild a referenced table) and
    checked before its commit; a violation rolls the step back.
    """
    start = conn.execute("PRAGMA user_version").fetchone()[0]
    conn.execute("PRAGMA foreign_keys=OFF")  # no effect inside a transaction, so set it here
    try:
        for i in range(start, len(MIGRATIONS)):
            step = MIGRATIONS[i]
            if callable(step):
                conn.execute("BEGIN")
                step(conn)
                conn.execute(f"PRAGMA user_version={i + 1}")
            else:
                conn.executescript(f"BEGIN;{step}PRAGMA user_version={i + 1};")
            if bad := conn.execute("PRAGMA foreign_key_check").fetchall():
                conn.rollback()
                raise sqlite3.IntegrityError(f"migration {i + 1}: foreign key violations {bad[:5]}")
            conn.commit()
    finally:
        conn.execute("PRAGMA foreign_keys=ON")
    if conn.execute("SELECT 1 FROM unit").fetchone() is None:
        seed(conn, "de")
        conn.commit()


class Database:
    """One connection plus a global lock."""

    # shortcut: one connection + global lock, fine for a household; per-request connections if it ever contends.
    def __init__(self, hass: HomeAssistant, path: str) -> None:
        self._hass = hass
        self._path = path
        self._conn: sqlite3.Connection | None = None
        self.lock = threading.Lock()
        # Held by every run() while it works and by a backup: writes wait on the event loop,
        # not in an executor thread.
        self.gate = asyncio.Lock()

    def _open(self) -> sqlite3.Connection:
        conn = connect(self._path)
        try:
            migrate(conn)
        except BaseException:
            conn.close()
            raise
        return conn

    async def async_open(self) -> None:
        self._conn = await self._hass.async_add_executor_job(self._open)

    def _run(self, fn: Callable[..., Any], args: tuple) -> tuple[Any, bool]:
        with self.lock:
            before = self._conn.total_changes
            try:
                result = fn(self._conn, *args)
                self._conn.commit()
            except BaseException:
                self._conn.rollback()
                raise
            return result, self._conn.total_changes != before

    async def run(self, fn: Callable[..., Any], *args: Any, write: bool = True) -> Any:
        """Run an inventory function in the executor; commit on success, roll back on error.

        Any write sends SIGNAL_CHANGED, so entities refresh whatever the entry point was
        (`write=False`: a dry run that is rolled back, nothing to announce).
        """
        async with self.gate:
            result, changed = await self._hass.async_add_executor_job(self._run, fn, args)
        if changed and write:
            async_dispatcher_send(self._hass, SIGNAL_CHANGED)
        return result

    def _close(self) -> None:
        with self.lock:
            self._conn.close()

    async def async_close(self) -> None:
        await self._hass.async_add_executor_job(self._close)
