"""Opened packages: one package moves to its own batch with opened_on (same product, date, charge).

The booking is kind 'open' on the opened batch (+1); undo writes 'open' -1 naming it (reverts_id).
"""

from __future__ import annotations

import sqlite3
from datetime import date

from .booking import _add, _batch, _booking, _stock_of, _take
from .common import InventoryError, _exists, opened_until
from .inherit import effective


def open_package(
    conn: sqlite3.Connection,
    product_id: int,
    batch_id: int | None = None,
    location_id: int | None = None,
    today: date | None = None,
    source: str = "manual",
    user_id: str | None = None,
) -> dict:
    """Open one unopened package, earliest expiry first (or of that batch / location).

    Returns {batch_id (the opened batch), location_id, booking_id, expires_on (effective), name,
    location}."""
    _exists(conn, "product", product_id)
    _exists(conn, "location", location_id)
    if batch_id is not None:
        row = conn.execute(
            "SELECT opened_on FROM batch WHERE id = ? AND product_id = ?", (batch_id, product_id)
        ).fetchone()
        if not row:
            raise InventoryError("not_found")
        if row["opened_on"]:
            raise InventoryError("already_opened")
    sql = (
        "SELECT s.batch_id, s.location_id, b.expires_on, b.canning_id, l.name AS location"
        " FROM stock s JOIN batch b ON b.id = s.batch_id JOIN location l ON l.id = s.location_id"
        " WHERE b.product_id = ? AND b.opened_on IS NULL"
    )
    args: list = [product_id]
    if batch_id is not None:
        sql += " AND s.batch_id = ?"
        args.append(batch_id)
    if location_id is not None:
        sql += " AND s.location_id = ?"
        args.append(location_id)
    src = conn.execute(
        sql + " ORDER BY b.expires_on IS NULL, b.expires_on, s.location_id LIMIT 1", args
    ).fetchone()
    if not src:
        raise InventoryError("not_enough_stock", available=0)
    opened_on = (today or date.today()).isoformat()
    target = _batch(conn, product_id, src["expires_on"], opened_on, src["canning_id"])
    _take(conn, src["batch_id"], src["location_id"], 1)
    _add(conn, target, src["location_id"], 1)
    eff = effective(conn, product_id)
    return {
        "batch_id": target,
        "location_id": src["location_id"],
        "booking_id": _booking(conn, "open", target, src["location_id"], 1, source, user_id),
        "expires_on": opened_until(src["expires_on"], opened_on, eff["opened_days"]["value"]),
        "name": conn.execute("SELECT name FROM product WHERE id = ?", (product_id,)).fetchone()[0],
        "location": src["location"],
    }


def undo_open(conn: sqlite3.Connection, booking_id: int, user_id: str | None = None) -> None:
    """Close the package an 'open' booking opened again (once; it must still be in stock)."""
    row = conn.execute(
        "SELECT o.batch_id, o.location_id, b.product_id, b.expires_on, b.canning_id"
        " FROM booking o JOIN batch b ON b.id = o.batch_id"
        " WHERE o.id = ? AND o.kind = 'open' AND o.packages > 0",
        (booking_id,),
    ).fetchone()
    if not row or row["location_id"] is None:
        raise InventoryError("not_found")
    if conn.execute("SELECT 1 FROM booking WHERE reverts_id = ?", (booking_id,)).fetchone():
        raise InventoryError("already_undone")
    if not _stock_of(conn, row["batch_id"], row["location_id"]):
        raise InventoryError("not_enough_stock", available=0)
    closed = _batch(conn, row["product_id"], row["expires_on"], None, row["canning_id"])
    _take(conn, row["batch_id"], row["location_id"], 1)
    _add(conn, closed, row["location_id"], 1)
    _booking(
        conn, "open", row["batch_id"], row["location_id"], -1, "undo", user_id,
        reverts_id=booking_id,
    )  # fmt: skip
