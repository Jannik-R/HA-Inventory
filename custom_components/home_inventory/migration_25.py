"""Migration 25 (kept out of migrations.py for size): freezing fresh products.

- location.freezer: a freezer location. A batch of a freezable product there is frozen.
- category.frozen_goods (inherited down the tree like food, NULL = inherit, root = no): bought frozen;
  such products keep their printed date at a freezer location. Seeded on Tiefkühlkost.
- frozen_days (inheritable like shelf_days; defaults 90): how long a product keeps frozen. A frozen
  batch stores frozen_on + frozen_days as its date (guide value), so FEFO, sensors and labels work as is.
- batch.frozen_on: a frozen batch is its own batch (part of the unique key).
- booking kinds 'freeze' / 'thaw': two rows each (-n on the source batch, +n on the target batch).
"""

from __future__ import annotations

import sqlite3

from .migration_24 import widen_check

SCHEMA_25 = """
ALTER TABLE location ADD COLUMN freezer INTEGER NOT NULL DEFAULT 0 CHECK (freezer IN (0, 1));
ALTER TABLE category ADD COLUMN frozen_goods INTEGER CHECK (frozen_goods IN (0, 1));
ALTER TABLE defaults ADD COLUMN frozen_days INTEGER CHECK (frozen_days > 0);
ALTER TABLE category ADD COLUMN frozen_days INTEGER CHECK (frozen_days > 0);
ALTER TABLE product ADD COLUMN frozen_days INTEGER CHECK (frozen_days > 0);
ALTER TABLE batch ADD COLUMN frozen_on TEXT CHECK (frozen_on IS NULL OR date(frozen_on) IS frozen_on);
DROP INDEX batch_key;
CREATE UNIQUE INDEX batch_key ON batch (product_id, ifnull(expires_on, ''), ifnull(canning_id, 0),
    ifnull(opened_on, ''), ifnull(frozen_on, ''));
"""

# Seeded days frozen by category name (only where the name is unique and nothing is set).
_FROZEN_DAYS = {
    "Fleisch": 180,
    "Hackfleisch": 90,
    "Fisch": 120,
    "Brot & Backwaren": 90,
    "Obst": 300,
    "Gemüse": 300,
}


def set_frozen(conn: sqlite3.Connection) -> None:
    """Seed values for freezing; also run after the seed of a new DB (migrate)."""
    if not conn.execute("SELECT 1 FROM unit").fetchone():
        return  # new DB (migrations run before the seed): migrate() calls this after the seed
    if "frozen_days" not in {r[1] for r in conn.execute("PRAGMA table_info(defaults)")}:
        return  # a DB seeded at an older version (upgrade tests): migration 25 calls it later
    conn.execute("UPDATE defaults SET frozen_days = ifnull(frozen_days, 90)")
    conn.execute("UPDATE location SET freezer = 1 WHERE name = 'Gefrierschrank'")
    conn.execute(
        "UPDATE category SET frozen_goods = 1 WHERE parent_id IS NULL AND name = 'Tiefkühlkost'"
    )
    for name, days in _FROZEN_DAYS.items():
        conn.execute(
            "UPDATE category SET frozen_days = ifnull(frozen_days, ?)"
            " WHERE name = ? AND (SELECT count(*) FROM category WHERE name = ?) = 1",
            (days, name, name),
        )


def freezing(conn: sqlite3.Connection) -> None:
    for statement in SCHEMA_25.split(";"):  # executescript would commit the step's transaction
        if statement.strip():
            conn.execute(statement)
    widen_check(
        conn, "booking",
        "kind IN ('in', 'out', 'move', 'correct', 'open')",
        "kind IN ('in', 'out', 'move', 'correct', 'open', 'freeze', 'thaw')",
    )  # fmt: skip
    set_frozen(conn)
