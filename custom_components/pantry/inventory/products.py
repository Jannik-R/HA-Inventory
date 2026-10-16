"""Products: lookup, list, search, draft from Open Food Facts, add."""

from __future__ import annotations

import json
import sqlite3
from itertools import islice

from .common import COLUMNS, unit_key
from .ingredient_line import unit_lookup
from .inherit import category_tags, set_tags
from .master import save
from .suggest import suggest, suggest_category


def find_ean(conn: sqlite3.Connection, ean: str) -> dict | None:
    row = conn.execute("SELECT * FROM product WHERE ean = ?", (ean,)).fetchone()
    return dict(row) if row else None


def list_products(conn: sqlite3.Connection) -> list[dict]:
    """All products (without the large off_json) with their packages in stock."""
    cols = ", ".join(f"p.{c}" for c in ("id", *COLUMNS["product"]) if c != "off_json")
    rows = conn.execute(
        f"SELECT {cols}, coalesce(sum(s.packages), 0) AS packages FROM product p"
        " LEFT JOIN batch b ON b.product_id = p.id LEFT JOIN stock s ON s.batch_id = b.id"
        " GROUP BY p.id ORDER BY p.name"
    )
    return [dict(r) for r in rows]


def search_products(conn: sqlite3.Connection, query: str, limit: int = 20) -> list[dict]:
    """Local products whose name, brand or EAN contains query (Unicode case-insensitive)."""
    q = query.strip().casefold()
    if not q:
        return []
    # shortcut: filters in Python (SQLite LIKE folds ASCII only, "müsli" != "Müsli"); use FTS5 if the catalog gets large.
    rows = conn.execute("SELECT * FROM product ORDER BY name")
    hits = (r for r in rows if any(q in (r[k] or "").casefold() for k in ("name", "brand", "ean")))
    return [dict(r) for r in islice(hits, limit)]


def product_draft(conn: sqlite3.Connection, off: dict) -> dict:
    """Normalized OFF data (see off.normalize) -> unsaved product with suggested category."""
    amount = unit_id = None
    if off["quantity"]:
        if unit_id := unit_lookup(conn).get(unit_key(off["quantity"][1])):
            amount = off["quantity"][0]
    return {
        "ean": off["ean"],
        "name": off["name"],
        "brand": off["brand"],
        "category_id": suggest(conn, off["off_tags"], off["name"]),
        "content_amount": amount,
        "content_unit_id": unit_id,
        "image_url": off["image_url"],
        "off_json": off["off_json"],
    }


def add_product(conn: sqlite3.Connection, data: dict) -> int:
    """Save a new product. If its OFF tags matched no category, teach the chosen category
    the most specific tag so the next similar product is assigned automatically."""
    try:
        tags = json.loads(data.get("off_json") or "{}").get("categories_tags")
    except (ValueError, AttributeError):
        tags = None
    learn = (
        isinstance(tags, list)
        and bool(tags)
        and data.get("category_id") is not None
        and suggest_category(conn, tags) is None
    )
    product_id = save(conn, "product", data)
    if learn:
        cid = data["category_id"]
        set_tags(conn, cid, [*category_tags(conn).get(cid, []), tags[-1]])
    return product_id
