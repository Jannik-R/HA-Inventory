"""Migration 29 (kept out of migrations.py for size): leftovers as a charge.

- canning.kind 'leftover' (same charge numbering, batch, labels; 1 package = 1 serving).
- Seeded root Reste (food, guide date, 3 days, fridge); the products "Reste: <dish>" are created
  on first use by inventory/leftovers.py. Names via `seeded` (English in an English DB: "Leftovers: <dish>").
"""

from __future__ import annotations

import sqlite3

from .migration_24 import widen_check
from .seed_en import seeded
from .seed_general import _id

ROOT = "Reste"


def add_leftovers(conn: sqlite3.Connection) -> None:
    """Root Reste unless a root of that name exists; also after a new seed and on first use."""
    if not conn.execute("SELECT 1 FROM unit").fetchone():
        return  # new DB (migrations run before the seed): migrate() calls this after the seed
    row = conn.execute("SELECT sql FROM sqlite_master WHERE name = 'canning'").fetchone()
    if not row or "'leftover'" not in row[0]:
        return  # a DB seeded at an older version (upgrade tests): migration 29 calls it later
    if conn.execute(
        "SELECT 1 FROM category WHERE parent_id IS NULL AND name = ?", (seeded(conn, ROOT),)
    ).fetchone():
        return
    sort = conn.execute(
        "SELECT ifnull(max(sort), 0) + 1 FROM category WHERE parent_id IS NULL"
    ).fetchone()[0]
    conn.execute(
        "INSERT INTO category (name, sort, default_location_id, expiry_type, warn_days, shelf_days,"
        " emergency_group) VALUES (?, ?, ?, 'guide', 1, 3, 'none')",
        (seeded(conn, ROOT), sort, _id(conn, "location", seeded(conn, "Kühlschrank"))),
    )


def leftovers(conn: sqlite3.Connection) -> None:
    widen_check(
        conn,
        "canning",
        "kind IN ('canning', 'drying')",
        "kind IN ('canning', 'drying', 'leftover')",
    )
    add_leftovers(conn)
