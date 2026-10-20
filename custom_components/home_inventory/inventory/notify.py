"""Read views for the HA events (events.py): new bookings, minimum stock shortfalls, expired batches."""

from __future__ import annotations

import sqlite3
from collections import defaultdict

from .queries import stock_list
from .shopping import shopping_list


def last_booking(conn: sqlite3.Connection) -> int:
    return conn.execute("SELECT ifnull(max(id), 0) FROM booking").fetchone()[0]


def bookings_since(conn: sqlite3.Connection, booking_id: int) -> list[dict]:
    """Booking rows after `booking_id`, with product and location names."""
    rows = conn.execute(
        "SELECT k.id AS booking_id, k.kind, k.packages, k.source, k.user_id, k.batch_id,"
        " p.id AS product_id, p.name, b.expires_on, l.name AS location, t.name AS to_location"
        " FROM booking k JOIN batch b ON b.id = k.batch_id JOIN product p ON p.id = b.product_id"
        " LEFT JOIN location l ON l.id = k.location_id LEFT JOIN location t ON t.id = k.to_location_id"
        " WHERE k.id > ? ORDER BY k.id",
        (booking_id,),
    )
    return [dict(r) for r in rows]


def below_min(conn: sqlite3.Connection) -> dict[str, dict]:
    """Min stock shortfalls by key (`p<product id>` / `c<category id>`); recipes and items by hand
    are left out. Note: shopping_list drops stale checks (a write)."""
    out = {}
    for i in shopping_list(conn):
        if i["manual"] or "key" in i:
            continue
        key = f"p{i['product_id']}" if i["product_id"] else f"c{i['category_id']}"
        out[key] = {
            "name": i["name"],
            "product_id": i["product_id"],
            "category_id": i["category_id"],
            "packages": i["packages"],
            "amount": i["amount"] and i["amount"]["missing"],
            "unit": i["amount"] and i["amount"]["unit_symbol"],
        }
    return out


def expired_on(conn: sqlite3.Connection, day: str) -> list[dict]:
    """Batches in stock whose (effective) date is `day`: they are expired from the next day on."""
    by_batch: dict[int, dict] = {}
    locations = defaultdict(list)
    for r in stock_list(conn):
        if r["expires_on"] != day:
            continue
        b = by_batch.setdefault(
            r["batch_id"],
            {
                "batch_id": r["batch_id"],
                "product_id": r["product_id"],
                "name": r["name"],
                "expires_on": day,
                "expiry_type": r["expiry_type"],
                "packages": 0,
            },
        )
        b["packages"] += r["packages"]
        locations[r["batch_id"]].append(r["location"])
    return [{**b, "locations": locations[k]} for k, b in by_batch.items()]
