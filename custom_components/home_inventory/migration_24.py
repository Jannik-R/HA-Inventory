"""Migration 24 (kept out of migrations.py for size): date kind 'guide' (Richtwert).

expiry_type gets a third value for things without a printed date (fresh produce, dried, frozen):
the date is an estimate from the shelf life. Only the CHECK of defaults, category and product
changes, so each table is rebuilt from its own stored SQL with the wider CHECK (ids kept).
"""

from __future__ import annotations

import re
import sqlite3

_OLD = "expiry_type IN ('best_before', 'use_by')"
_NEW = "expiry_type IN ('best_before', 'use_by', 'guide')"

# Seeded types below Obst & Gemüse sold in jars keep a printed best before date.
_JARS = ("Schattenmorellen", "Preiselbeeren")


def _widen(conn: sqlite3.Connection, table: str) -> None:
    sql = conn.execute(
        "SELECT sql FROM sqlite_master WHERE type = 'table' AND name = ?", (table,)
    ).fetchone()[0]
    assert _OLD in sql, table
    indexes = [
        r[0]
        for r in conn.execute(
            "SELECT sql FROM sqlite_master WHERE type = 'index' AND tbl_name = ? AND sql IS NOT NULL",
            (table,),
        )
    ]
    cols = ", ".join(r[1] for r in conn.execute(f"PRAGMA table_info({table})"))
    # earlier rebuilds stored the name quoted ('CREATE TABLE "category"')
    new_sql = re.sub(
        rf'^CREATE TABLE "?{table}"?', f"CREATE TABLE {table}_new", sql.replace(_OLD, _NEW)
    )
    assert f"{table}_new" in new_sql, table
    conn.execute(new_sql)
    conn.execute(f"INSERT INTO {table}_new ({cols}) SELECT {cols} FROM {table}")
    conn.execute(f"DROP TABLE {table}")
    conn.execute(f"ALTER TABLE {table}_new RENAME TO {table}")
    for index in indexes:
        conn.execute(index)


def set_guide(conn: sqlite3.Connection) -> None:
    """Fresh produce gets the date kind guide (always, also over a changed value), jars best before."""
    if not conn.execute("SELECT 1 FROM unit").fetchone():
        return  # new DB (migrations run before the seed): migrate() calls this after the seed
    if _OLD in conn.execute("SELECT sql FROM sqlite_master WHERE name = 'category'").fetchone()[0]:
        return  # a DB seeded at an older version (upgrade tests): migration 24 calls it later
    conn.execute(
        "UPDATE category SET expiry_type = 'guide' WHERE parent_id IS NULL AND name = 'Obst & Gemüse'"
    )
    conn.execute(
        f"UPDATE category SET expiry_type = ifnull(expiry_type, 'best_before')"
        f" WHERE name IN ({', '.join('?' * len(_JARS))})",
        _JARS,
    )


def guide_kind(conn: sqlite3.Connection) -> None:
    for table in ("defaults", "category", "product"):
        _widen(conn, table)
    set_guide(conn)
