"""Schema migrations: one step per schema version (`PRAGMA user_version`), applied by `db.migrate`."""

from __future__ import annotations

import sqlite3
from collections.abc import Callable
from functools import partial

from .migration_15 import SCHEMA_15
from .migration_20 import SCHEMA_20
from .migration_24 import guide_kind
from .migration_25 import freezing
from .migration_26 import drying
from .migration_27 import emergency_stock
from .migration_28 import remaining_amount
from .migration_29 import leftovers
from .migration_30 import allergens_diet
from .seed_days import fill_days
from .seed_general import add_general
from .seed_types import NEW_IN_9, add_seed_extras, mark_recipe_only


def _add_recipe_only(conn: sqlite3.Connection) -> None:
    conn.execute(
        "ALTER TABLE unit ADD COLUMN recipe_only INTEGER NOT NULL DEFAULT 0"
        " CHECK (recipe_only IN (0, 1))"
    )
    mark_recipe_only(conn)


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
    # 12: recipes on the shopping list (servings to shop for), chosen optional ingredients,
    # checks of their items (uid 'r<category id>-<unit id or empty>', like shopping_done).
    """
    CREATE TABLE shopping_recipe (
        recipe_id INTEGER PRIMARY KEY REFERENCES recipe(id) ON DELETE CASCADE,
        servings INTEGER NOT NULL CHECK (servings > 0)
    );
    CREATE TABLE shopping_recipe_optional (
        recipe_id INTEGER NOT NULL REFERENCES shopping_recipe(recipe_id) ON DELETE CASCADE,
        ingredient_id INTEGER NOT NULL REFERENCES recipe_ingredient(id) ON DELETE CASCADE,
        PRIMARY KEY (recipe_id, ingredient_id)
    );
    CREATE TABLE shopping_done_recipe (
        uid TEXT PRIMARY KEY,
        missing TEXT NOT NULL
    );
    """,
    # 13: units only offered in recipes (spoons, pinch, ...); base unit/factor say where they convert.
    _add_recipe_only,
    # 14: week planner, one row per dish (a day's order = slot, then id); slot: 0 breakfast,
    # 1 lunch, 2 coffee, 3 dinner, 4 snack; text = recipe name snapshot or
    # free text, so the entry survives deleting the recipe.
    """
    CREATE TABLE meal_plan (
        id INTEGER PRIMARY KEY,
        day TEXT NOT NULL CHECK (date(day) IS day),
        recipe_id INTEGER REFERENCES recipe(id) ON DELETE SET NULL,
        text TEXT NOT NULL CHECK (trim(text) <> ''),
        slot INTEGER NOT NULL CHECK (slot BETWEEN 0 AND 4),
        servings INTEGER NOT NULL CHECK (servings > 0)
    );
    CREATE INDEX meal_plan_day ON meal_plan (day);
    """,
    # 15: non-food categories, shelf life, canning recipes, protocol and charges (see migration_15).
    SCHEMA_15,
    # 16: seeded non-food roots and Eingekochtes for existing DBs (a new DB gets them from the seed).
    add_general,
    # 17: numbered recipe steps; section = heading before this step (first step of a section).
    # Old recipes keep their text in recipe.instructions until they are edited (no conversion).
    """
    CREATE TABLE recipe_step (
        id INTEGER PRIMARY KEY,
        recipe_id INTEGER NOT NULL REFERENCES recipe(id) ON DELETE CASCADE,
        pos INTEGER NOT NULL,
        section TEXT CHECK (section IS NULL OR length(section) BETWEEN 1 AND 100),
        text TEXT NOT NULL CHECK (trim(text) <> '' AND length(text) <= 2000),
        UNIQUE (recipe_id, pos)
    );
    """,
    # 18: learned category choices (inventory/learned.py): kind 'ingredient' (recipe import text)
    # or 'off_tag' (most specific OFF tag of a new product) -> the category chosen for it.
    """
    CREATE TABLE learned_category (
        kind TEXT NOT NULL CHECK (kind IN ('ingredient', 'off_tag')),
        key TEXT NOT NULL CHECK (key <> ''),
        category_id INTEGER NOT NULL REFERENCES category(id) ON DELETE CASCADE,
        PRIMARY KEY (kind, key)
    );
    """,
    # 19: start time per meal slot (meal_plan.slot 0..4), for "the current meal" (e.g. print the
    # planned recipe): the slot with the latest start <= now; before the first start the last one.
    """
    CREATE TABLE meal_time (
        slot INTEGER PRIMARY KEY CHECK (slot BETWEEN 0 AND 4),
        start TEXT NOT NULL CHECK (start GLOB '[0-2][0-9]:[0-5][0-9]' AND start < '24:00')
    );
    INSERT INTO meal_time (slot, start)
        VALUES (0, '05:00'), (1, '11:00'), (2, '14:30'), (3, '17:00'), (4, '20:30');
    """,
    # 20: opened packages: inheritable opened_days, batch.opened_on, booking kind 'open' (see migration_20).
    SCHEMA_20,
    # 21: typical shelf life and days after opening for seeded categories, only where empty (seed_days).
    fill_days,
    # 22: the batch date was guessed at book-in (today + shelf life) because none was entered;
    # a typed date for the same batch clears it.
    """
    ALTER TABLE batch ADD COLUMN expiry_guessed INTEGER NOT NULL DEFAULT 0
        CHECK (expiry_guessed IN (0, 1));
    """,
    # 23: receipt import (inventory/purchase.py): a receipt line of a store -> the product a human
    # booked it as; store '' = not recognized. Keys are purchase.line_key of the texts.
    """
    CREATE TABLE receipt_line (
        store TEXT NOT NULL,
        key TEXT NOT NULL CHECK (key <> ''),
        product_id INTEGER NOT NULL REFERENCES product(id) ON DELETE CASCADE,
        PRIMARY KEY (store, key)
    );
    """,
    # 24: date kind 'guide' (Richtwert) for things without a printed date; fresh produce uses it
    # (see migration_24).
    guide_kind,
    # 25: freezing fresh products: location.freezer, category.frozen_goods, frozen_days,
    # batch.frozen_on, booking kinds 'freeze' / 'thaw' (see migration_25).
    freezing,
    # 26: drying beside canning: canning.kind, recipe.canning_kind, seeded root Gedörrtes
    # (see migration_26).
    drying,
    # 27: emergency stock: category.emergency_group (see migration_27).
    emergency_stock,
    # 28: remaining amount of opened packages: batch.remaining, batch_key only for full batches,
    # booking kind 'remaining' (see migration_28).
    remaining_amount,
    # 29: leftovers: canning.kind 'leftover', seeded root Reste (see migration_29).
    leftovers,
    # 30: allergens and diet: diet / allergens on category and product (see migration_30).
    allergens_diet,
    # 31: booking history: action_id groups the rows one write call booked (the id of the first
    # row); old rows are their own action. Rows written outside Database.run stay NULL
    # (queries use coalesce(action_id, id)).
    """
    ALTER TABLE booking ADD COLUMN action_id INTEGER;
    UPDATE booking SET action_id = id;
    CREATE INDEX booking_action ON booking (action_id);
    """,
]
