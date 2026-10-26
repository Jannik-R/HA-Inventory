"""Reload of diet / allergens from Open Food Facts for existing products (admin, in small chunks)."""

from __future__ import annotations

import json
import sqlite3

from .diet import off_diet

_OPEN = "ean IS NOT NULL AND diet IS NULL AND allergens IS NULL AND id > ?"


def reload_candidates(conn: sqlite3.Connection, after: int, limit: int) -> dict:
    """The next `limit` products with an EAN and no diet / allergens, after id `after`, and how
    many such products are left (the chunk included)."""
    rows = conn.execute(
        f"SELECT id, ean FROM product WHERE {_OPEN} ORDER BY id LIMIT ?", (after, limit)
    ).fetchall()
    total = conn.execute(f"SELECT count(*) FROM product WHERE {_OPEN}", (after,)).fetchone()[0]
    return {"products": [dict(r) for r in rows], "total": total}


def store_off(conn: sqlite3.Connection, product_id: int, fetched: dict) -> bool:
    """Keep the fetched tags in off_json and fill what is still NULL (own values stay); True if
    OFF knew a diet or allergens."""
    row = conn.execute("SELECT off_json FROM product WHERE id = ?", (product_id,)).fetchone()
    if row is None:
        return False
    try:
        stored = json.loads(row["off_json"] or "{}")
    except ValueError:
        stored = {}
    stored = {**stored, **fetched} if isinstance(stored, dict) else fetched
    diet, allergens = off_diet(fetched)
    conn.execute(
        "UPDATE product SET off_json = ?, diet = ifnull(diet, ?), allergens = ifnull(allergens, ?)"
        " WHERE id = ?",
        (json.dumps(stored, ensure_ascii=False), diet, allergens, product_id),
    )
    return diet is not None or allergens is not None
