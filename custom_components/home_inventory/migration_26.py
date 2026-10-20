"""Migration 26 (kept out of migrations.py for size): drying beside canning.

- canning.kind ('canning' | 'drying'): a drying protocol is a canning protocol of that kind (same
  charge numbering, batch, labels).
- recipe.canning_kind: which tab a process recipe (canning_product_id set) belongs to; ignored on
  dish recipes.
- Seeded root Gedörrtes (food, guide date, shelf 180 days) with its product types.
"""

from __future__ import annotations

import sqlite3

from .seed_general import _child, _id

SCHEMA_26 = """
ALTER TABLE canning ADD COLUMN kind TEXT NOT NULL DEFAULT 'canning'
    CHECK (kind IN ('canning', 'drying'));
ALTER TABLE recipe ADD COLUMN canning_kind TEXT NOT NULL DEFAULT 'canning'
    CHECK (canning_kind IN ('canning', 'drying'))
"""

_DRIED = ["Trockenobst", "Gemüsechips", "Getrocknete Kräuter", "Getrocknete Pilze", "Jerky"]


def add_dried(conn: sqlite3.Connection) -> None:
    """Root Gedörrtes with its types unless a root of that name exists; also after a new seed."""
    if not conn.execute("SELECT 1 FROM unit").fetchone():
        return  # new DB (migrations run before the seed): migrate() calls this after the seed
    if "canning_kind" not in {r[1] for r in conn.execute("PRAGMA table_info(recipe)")}:
        return  # a DB seeded at an older version (upgrade tests): migration 26 calls it later
    if conn.execute(
        "SELECT 1 FROM category WHERE parent_id IS NULL AND name = 'Gedörrtes'"
    ).fetchone():
        return
    sort = conn.execute(
        "SELECT ifnull(max(sort), 0) + 1 FROM category WHERE parent_id IS NULL"
    ).fetchone()[0]
    root = conn.execute(
        "INSERT INTO category (name, sort, default_location_id, expiry_type, warn_days, shelf_days)"
        " VALUES ('Gedörrtes', ?, ?, 'guide', 14, 180)",
        (sort, _id(conn, "location", "Vorratsschrank")),
    ).lastrowid
    for i, name in enumerate(_DRIED):
        _child(conn, root, name, i)


def drying(conn: sqlite3.Connection) -> None:
    for statement in SCHEMA_26.split(";"):  # executescript would commit the step's transaction
        if statement.strip():
            conn.execute(statement)
    add_dried(conn)
