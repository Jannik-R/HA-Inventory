"""SQLite storage: connection, migrations, and an executor-backed wrapper."""

from __future__ import annotations

import sqlite3
import threading
from collections.abc import Callable
from typing import TYPE_CHECKING, Any

from homeassistant.helpers.dispatcher import async_dispatcher_send

from .const import SIGNAL_CHANGED
from .seed import seed

if TYPE_CHECKING:
    from homeassistant.core import HomeAssistant

# Never edit an existing step; append a new one.
MIGRATIONS: list[str] = [
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
    conn.execute(
        "PRAGMA foreign_keys=OFF"
    )  # no effect inside a transaction, so set it here
    try:
        for i in range(start, len(MIGRATIONS)):
            conn.executescript(f"BEGIN;{MIGRATIONS[i]}PRAGMA user_version={i + 1};")
            if bad := conn.execute("PRAGMA foreign_key_check").fetchall():
                conn.rollback()
                raise sqlite3.IntegrityError(
                    f"migration {i + 1}: foreign key violations {bad[:5]}"
                )
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

    def _open(self) -> sqlite3.Connection:
        conn = connect(self._path)
        migrate(conn)
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

    async def run(self, fn: Callable[..., Any], *args: Any) -> Any:
        """Run an inventory function in the executor; commit on success, roll back on error.

        Any write sends SIGNAL_CHANGED, so entities refresh whatever the entry point was.
        """
        result, changed = await self._hass.async_add_executor_job(self._run, fn, args)
        if changed:
            async_dispatcher_send(self._hass, SIGNAL_CHANGED)
        return result

    def _close(self) -> None:
        with self.lock:
            self._conn.close()

    async def async_close(self) -> None:
        await self._hass.async_add_executor_job(self._close)
