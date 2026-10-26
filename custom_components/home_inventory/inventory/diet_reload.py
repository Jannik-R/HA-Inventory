"""Reload of diet / allergens from Open Food Facts for existing products (admin, in small chunks)."""

from __future__ import annotations

import json
import sqlite3

from .diet import off_diet
from .inherit import _categories, _resolve

# Not asked yet: OFF's answer (also "not found") is remembered as off_json "diet_checked".
_OPEN = (
    "ean IS NOT NULL AND diet IS NULL AND allergens IS NULL AND id > ?"
    " AND (off_json IS NULL OR off_json NOT LIKE '%\"diet_checked\"%')"
)


def reload_candidates(conn: sqlite3.Connection, after: int, limit: int) -> dict:
    """The next `limit` products with an EAN, no diet / allergens and no earlier answer, after id
    `after` (not in a non-food category), and how many such products are left (the chunk included)."""
    cats = _categories(conn)
    rows = [
        r
        for r in conn.execute(
            f"SELECT id, ean, category_id FROM product WHERE {_OPEN} ORDER BY id", (after,)
        )
        if _resolve(cats, None, r["category_id"], {})["food"]["value"] != 0
    ]
    return {
        "products": [{"id": r["id"], "ean": r["ean"]} for r in rows[:limit]],
        "total": len(rows),
    }


def store_off(conn: sqlite3.Connection, product_id: int, fetched: dict) -> bool:
    """Keep the fetched tags in off_json, mark the product as asked, and fill what is still NULL (own values stay); True if
    OFF knew a diet or allergens."""
    row = conn.execute("SELECT off_json FROM product WHERE id = ?", (product_id,)).fetchone()
    if row is None:
        return False
    try:
        stored = json.loads(row["off_json"] or "{}")
    except ValueError:
        stored = {}
    stored = {**(stored if isinstance(stored, dict) else {}), **fetched, "diet_checked": 1}
    diet, allergens = off_diet(fetched)
    conn.execute(
        "UPDATE product SET off_json = ?, diet = ifnull(diet, ?), allergens = ifnull(allergens, ?)"
        " WHERE id = ?",
        (json.dumps(stored, ensure_ascii=False), diet, allergens, product_id),
    )
    return diet is not None or allergens is not None
