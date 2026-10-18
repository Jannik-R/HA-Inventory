"""Read-only queries: stock list, expiring batches."""

from __future__ import annotations

import sqlite3
from datetime import date

from .canning import charge
from .common import opened_until
from .inherit import _categories, _path, _resolve, defaults


def stock_list(
    conn: sqlite3.Connection,
    search: str | None = None,
    location_id: int | None = None,
    product_id: int | None = None,
) -> list[dict]:
    """One row per batch and location; expiry_type is the product's (own or inherited), expires_on
    the effective expiry (earlier when opened), batch_expires_on the batch's own date."""
    cats, dflt = _categories(conn), defaults(conn)
    sql = (
        "SELECT s.batch_id, s.location_id, s.packages, l.name AS location, b.expires_on, b.opened_on,"
        " p.id AS product_id, p.name, p.brand, p.ean, p.category_id, p.expiry_type, p.opened_days,"
        " c.made_on, c.seq"
        " FROM stock s JOIN batch b ON b.id = s.batch_id JOIN product p ON p.id = b.product_id"
        " JOIN location l ON l.id = s.location_id LEFT JOIN canning c ON c.id = b.canning_id"
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
    for r in conn.execute(sql + " ORDER BY p.name", args):
        row = dict(r)
        made_on, seq = row.pop("made_on"), row.pop("seq")
        row["charge"] = made_on and charge(made_on, seq)
        row["category_path"] = _path(cats, r["category_id"])
        eff = _resolve(cats, row, r["category_id"], dflt)
        del row["opened_days"]
        row["expiry_type"] = eff["expiry_type"]["value"]
        row["batch_expires_on"] = r["expires_on"]
        row["expires_on"] = opened_until(
            r["expires_on"], r["opened_on"], eff["opened_days"]["value"]
        )
        rows.append(row)
    rows.sort(key=lambda r: (r["name"], r["expires_on"] is None, r["expires_on"] or ""))
    if search:
        needle = search.casefold()
        rows = [
            r for r in rows
            if needle in " ".join(
                [r["name"], r["brand"] or "", r["ean"] or "", r["location"], *r["category_path"]]
            ).casefold()
        ]  # fmt: skip
    return rows


def expiring(conn: sqlite3.Connection, today: date, days: int | None = None) -> list[dict]:
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
