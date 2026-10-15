"""Inheritance of category values (unit, location, expiry type, warn days)."""

from __future__ import annotations

import sqlite3

from .common import INHERITED, InventoryError


def defaults(conn: sqlite3.Connection) -> dict:
    """Integration-wide defaults (options come later)."""
    unit = conn.execute(
        "SELECT id FROM unit ORDER BY is_count DESC, id LIMIT 1"
    ).fetchone()
    return {
        "warn_days": 7,
        "expiry_type": "best_before",
        "unit_id": unit["id"] if unit else None,
        "default_location_id": None,
    }


def _categories(conn: sqlite3.Connection) -> dict[int, sqlite3.Row]:
    return {r["id"]: r for r in conn.execute("SELECT * FROM category")}


def _resolve(
    cats: dict, product: dict | None, category_id: int | None, dflt: dict
) -> dict:
    out = {}
    for key in INHERITED:
        if product is not None and product.get(key) is not None:
            out[key] = {"value": product[key], "source": "own"}
            continue
        cid, result = category_id, {"value": dflt.get(key), "source": "default"}
        while cid is not None:
            row = cats[cid]
            if row[key] is not None:
                own = product is None and cid == category_id
                result = {"value": row[key], "source": "own" if own else cid}
                break
            cid = row["parent_id"]
        out[key] = result
    return out


def effective(
    conn: sqlite3.Connection,
    product_id: int | None = None,
    category_id: int | None = None,
) -> dict:
    """Effective inheritable values with their source: "own", a category id or "default"."""
    product = None
    if product_id is not None:
        row = conn.execute(
            "SELECT * FROM product WHERE id = ?", (product_id,)
        ).fetchone()
        if row is None:
            raise InventoryError("not_found")
        product, category_id = dict(row), row["category_id"]
        product.pop(
            "unit_id", None
        )  # products inherit the unit; content has its own unit
    return _resolve(_categories(conn), product, category_id, defaults(conn))


def _chain(cats: dict, category_id: int | None) -> list[int]:
    """Category ids from the root down to category_id."""
    ids = []
    while category_id is not None:
        ids.append(category_id)
        category_id = cats[category_id]["parent_id"]
    return ids[::-1]


def _path(cats: dict, category_id: int) -> list[str]:
    return [cats[c]["name"] for c in _chain(cats, category_id)]
