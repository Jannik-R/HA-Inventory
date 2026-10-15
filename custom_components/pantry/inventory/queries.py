"""Read-only queries: stock list, expiring batches, shopping list."""

from __future__ import annotations

import sqlite3
from datetime import date

from .inherit import _categories, _chain, _path, _resolve, defaults


def stock_list(
    conn: sqlite3.Connection,
    search: str | None = None,
    location_id: int | None = None,
    product_id: int | None = None,
) -> list[dict]:
    """One row per batch and location; expiry_type is the product's (own or inherited)."""
    cats, dflt = _categories(conn), defaults(conn)
    sql = (
        "SELECT s.batch_id, s.location_id, s.packages, l.name AS location, b.expires_on,"
        " p.id AS product_id, p.name, p.brand, p.ean, p.category_id, p.expiry_type"
        " FROM stock s JOIN batch b ON b.id = s.batch_id JOIN product p ON p.id = b.product_id"
        " JOIN location l ON l.id = s.location_id"
    )
    where, args = [], []
    if location_id is not None:
        where.append("s.location_id = ?")
        args.append(location_id)
    if product_id is not None:
        where.append("p.id = ?")
        args.append(product_id)
    if where:
        sql += " WHERE " + " AND ".join(where)
    rows = []
    for r in conn.execute(
        sql + " ORDER BY p.name, b.expires_on IS NULL, b.expires_on", args
    ):
        row = dict(r)
        row["category_path"] = _path(cats, r["category_id"])
        row["expiry_type"] = _resolve(cats, row, r["category_id"], dflt)["expiry_type"]["value"]
        rows.append(row)
    if search:
        needle = search.casefold()
        rows = [
            r for r in rows
            if needle in " ".join(
                [r["name"], r["brand"] or "", r["ean"] or "", r["location"], *r["category_path"]]
            ).casefold()
        ]  # fmt: skip
    return rows


def expiring(
    conn: sqlite3.Connection, today: date, days: int | None = None
) -> list[dict]:
    """Stock rows expiring within the product's warn_days, or within `days` if given."""
    dflt, cats = defaults(conn), _categories(conn)
    products = {
        r["id"]: dict(r) for r in conn.execute("SELECT id, category_id, warn_days FROM product")
    }
    out = []
    for r in stock_list(conn):
        if r["expires_on"] is None:
            continue
        if days is None:
            p = products[r["product_id"]]
            limit = _resolve(cats, p, p["category_id"], dflt)["warn_days"]["value"]
        else:
            limit = days
        days_left = (date.fromisoformat(r["expires_on"]) - today).days
        if days_left <= limit:
            out.append(
                {
                    **r,
                    "days_left": days_left,
                    "status": "expired" if days_left < 0 else "soon",
                }
            )
    return sorted(out, key=lambda r: r["expires_on"])


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
    if units[unit_id]["is_count"]:
        return packages
    if content_amount is None or content_unit_id is None:
        return None
    return _convert(units, packages * content_amount, content_unit_id, unit_id)


def shopping_list(conn: sqlite3.Connection) -> list[dict]:
    """Missing amounts from nested min stock, bottom-up (see docs/PLAN.md)."""
    dflt = defaults(conn)
    cats, units = _categories(conn), _units(conn)
    children: dict[int | None, list[int]] = {}
    for c in cats.values():
        children.setdefault(c["parent_id"], []).append(c["id"])
    products: dict[int, list[sqlite3.Row]] = {}
    for p in conn.execute(
        "SELECT p.id, p.category_id, p.content_amount, p.content_unit_id,"
        " COALESCE(SUM(s.packages), 0) AS packages FROM product p"
        " LEFT JOIN batch b ON b.product_id = p.id LEFT JOIN stock s ON s.batch_id = b.id GROUP BY p.id"
    ):
        products.setdefault(p["category_id"], []).append(p)
    unit_of = {cid: _resolve(cats, None, cid, dflt)["unit_id"]["value"] for cid in cats}
    items: list[dict] = []

    def walk(cid: int) -> tuple[list, float, bool]:
        """Returns (products in subtree, shortfall in this node's unit, any min stock below)."""
        unit_id = unit_of[cid]
        subtree, short, any_min = list(products.get(cid, [])), 0.0, False
        for child in children.get(cid, []):
            c_products, c_missing, c_any = walk(child)
            subtree += c_products
            any_min = any_min or c_any
            # children not convertible to this unit are not subtracted
            short += _convert(units, c_missing, unit_of[child], unit_id) or 0.0
        amounts = [
            _amount(
                units, p["packages"], p["content_amount"], p["content_unit_id"], unit_id
            )
            for p in subtree
            if p["packages"]
        ]
        stock = sum(a for a in amounts if a is not None)
        unknown = amounts.count(None)
        minimum = cats[cid]["min_stock"]
        if minimum is None:
            return (
                subtree,
                short,
                any_min,
            )  # no own minimum: pass children's shortfall up
        missing = round(max(0.0, minimum - stock - short), 6)  # float residue
        if missing:
            items.append({
                "category_id": cid,
                "name": cats[cid]["name"],
                "path": _path(cats, cid),
                "missing": missing,
                "unit_id": unit_id,
                "unit_symbol": units[unit_id]["symbol"],
                "unknown_products": unknown,
                "any_of_subtree": any_min,
            })  # fmt: skip
        return subtree, missing, True

    for root in children.get(None, []):
        walk(root)

    def key(item: dict) -> list:
        return [
            (cats[c]["sort"], cats[c]["name"])
            for c in _chain(cats, item["category_id"])
        ]

    return sorted(items, key=key)
