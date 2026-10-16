"""Stock amounts in a chosen unit (shared by the shopping list and recipe availability)."""

from __future__ import annotations

import sqlite3


def _units(conn: sqlite3.Connection) -> dict[int, sqlite3.Row]:
    return {r["id"]: r for r in conn.execute("SELECT * FROM unit")}


def _convert(units: dict, value: float, from_id: int, to_id: int) -> float | None:
    if from_id == to_id:
        return value
    a, b = units[from_id], units[to_id]
    base_a, base_b = a["base_unit_id"] or a["id"], b["base_unit_id"] or b["id"]
    if base_a != base_b:
        return None
    return value * a["factor"] / b["factor"]


def _amount(
    units: dict, packages: int, content_amount, content_unit_id, unit_id: int
) -> float | None:
    """Stock in `unit_id`: package content when it converts (a 10-pack of eggs is 10 Stück),
    else for a count unit the number of packages; None when unknown."""
    if content_amount is not None and content_unit_id is not None:
        converted = _convert(units, packages * content_amount, content_unit_id, unit_id)
        if converted is not None:
            return converted
    return packages if units[unit_id]["is_count"] else None


def _stock_by_category(conn: sqlite3.Connection) -> dict[int, list[sqlite3.Row]]:
    """Products (with their package count, 0 when out of stock) per category id."""
    products: dict[int, list[sqlite3.Row]] = {}
    for p in conn.execute(
        "SELECT p.id, p.category_id, p.content_amount, p.content_unit_id,"
        " COALESCE(SUM(s.packages), 0) AS packages FROM product p"
        " LEFT JOIN batch b ON b.product_id = p.id LEFT JOIN stock s ON s.batch_id = b.id GROUP BY p.id"
    ):
        products.setdefault(p["category_id"], []).append(p)
    return products
