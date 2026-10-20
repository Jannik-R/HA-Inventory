"""Opened packages: one package moves to its own batch with opened_on (same product, date, charge).

The booking is kind 'open' on the opened batch (+1); undo writes 'open' -1 naming it (reverts_id).
"""

from __future__ import annotations

import sqlite3
from datetime import date

from .booking import _add, _batch, _booking, _stock_of, _take, book_out
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
            "SELECT opened_on, frozen_on FROM batch WHERE id = ? AND product_id = ?",
            (batch_id, product_id),
        ).fetchone()
        if not row:
            raise InventoryError("not_found")
        if row["opened_on"]:
            raise InventoryError("already_opened")
        if row["frozen_on"]:
            raise InventoryError("frozen")
    sql = (
        "SELECT s.batch_id, s.location_id, b.expires_on, b.canning_id, b.expiry_guessed,"
        " l.name AS location"
        " FROM stock s JOIN batch b ON b.id = s.batch_id JOIN location l ON l.id = s.location_id"
        " WHERE b.product_id = ? AND b.opened_on IS NULL AND b.frozen_on IS NULL"
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
    target = _batch(
        conn, product_id, src["expires_on"], opened_on, src["canning_id"], src["expiry_guessed"]
    )
    _take(conn, src["batch_id"], src["location_id"], 1)
    conn.execute(  # an emptied opened batch may keep a stale level
        "UPDATE batch SET remaining = 1 WHERE id = ? AND NOT EXISTS"
        " (SELECT 1 FROM stock WHERE batch_id = ?)",
        (target, target),
    )
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
        "SELECT o.batch_id, o.location_id, b.product_id, b.expires_on, b.canning_id, b.expiry_guessed"
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
    closed = _batch(
        conn, row["product_id"], row["expires_on"], None, row["canning_id"], row["expiry_guessed"]
    )
    _take(conn, row["batch_id"], row["location_id"], 1)
    _add(conn, closed, row["location_id"], 1)
    _booking(
        conn, "open", row["batch_id"], row["location_id"], -1, "undo", user_id,
        reverts_id=booking_id,
    )  # fmt: skip


def set_remaining(
    conn: sqlite3.Connection,
    batch_id: int,
    remaining: float,
    location_id: int | None = None,
    source: str = "manual",
    user_id: str | None = None,
) -> dict:
    """Set the level (0..1) of the partly used package of an opened batch.

    0 = empty: books one package out ({kind: out, taken}). Else {kind: remaining, booking_id}
    (None when the level did not change)."""
    remaining = round(remaining, 3)
    if not 0 <= remaining <= 1:
        raise InventoryError("invalid_value")
    sql = (
        "SELECT s.location_id, b.product_id, b.remaining FROM stock s JOIN batch b ON b.id = s.batch_id"
        " WHERE s.batch_id = ? AND b.opened_on IS NOT NULL"
    )
    args: list = [batch_id]
    if location_id is not None:
        sql += " AND s.location_id = ?"
        args.append(location_id)
    row = conn.execute(sql + " ORDER BY s.location_id LIMIT 1", args).fetchone()
    if not row:
        raise InventoryError("not_found")
    if remaining == 0:
        taken = book_out(conn, row["product_id"], 1, batch_id, row["location_id"], source, user_id)
        return {"kind": "out", "taken": taken}
    if remaining == row["remaining"]:
        return {"kind": "remaining", "booking_id": None}
    conn.execute("UPDATE batch SET remaining = ? WHERE id = ?", (remaining, batch_id))
    booking_id = _booking(
        conn, "remaining", batch_id, row["location_id"], 0, source, user_id,
        remaining=row["remaining"],
    )  # fmt: skip
    return {"kind": "remaining", "booking_id": booking_id}


def undo_remaining(conn: sqlite3.Connection, booking_id: int, user_id: str | None = None) -> None:
    """Restore the level a 'remaining' booking changed (once)."""
    row = conn.execute(
        "SELECT o.batch_id, o.location_id, o.remaining, b.remaining AS now FROM booking o"
        " JOIN batch b ON b.id = o.batch_id"
        " WHERE o.id = ? AND o.kind = 'remaining' AND o.reverts_id IS NULL",
        (booking_id,),
    ).fetchone()
    if not row:
        raise InventoryError("not_found")
    if conn.execute("SELECT 1 FROM booking WHERE reverts_id = ?", (booking_id,)).fetchone():
        raise InventoryError("already_undone")
    conn.execute("UPDATE batch SET remaining = ? WHERE id = ?", (row["remaining"], row["batch_id"]))
    _booking(
        conn, "remaining", row["batch_id"], row["location_id"], 0, "undo", user_id,
        reverts_id=booking_id, remaining=row["now"],
    )  # fmt: skip
