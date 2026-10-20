"""Corrections of bookings: undo a book-out, move, set an absolute count, fix a stock row."""

from __future__ import annotations

import sqlite3
from datetime import date

from .booking import _add, _batch, _booking, _iso, _stock_of, _take
from .common import InventoryError, _exists, _packages


def put_back(
    conn, booking_ids: list[int], source: str = "undo", user_id: str | None = None
) -> None:
    """Undo book-outs: each 'out' booking is reversed once (an 'in' booking that names it).

    A location deactivated meanwhile is reactivated, so undo never fails on that."""
    for booking_id in booking_ids:
        out = conn.execute(
            "SELECT batch_id, location_id, packages FROM booking WHERE id = ? AND kind = 'out'",
            (booking_id,),
        ).fetchone()
        if not out or out["location_id"] is None:
            raise InventoryError("not_found")
        if conn.execute("SELECT 1 FROM booking WHERE reverts_id = ?", (booking_id,)).fetchone():
            raise InventoryError("already_undone")
        conn.execute("UPDATE location SET active = 1 WHERE id = ?", (out["location_id"],))
        _add(conn, out["batch_id"], out["location_id"], out["packages"])
        _booking(
            conn, "in", out["batch_id"], out["location_id"], out["packages"], source, user_id,
            reverts_id=booking_id,
        )  # fmt: skip


def move(
    conn: sqlite3.Connection,
    batch_id: int,
    from_location_id: int,
    to_location_id: int,
    packages: int,
    source: str = "manual",
    user_id: str | None = None,
) -> None:
    _packages(packages)
    if from_location_id == to_location_id:
        raise InventoryError("invalid_value")
    _exists(conn, "batch", batch_id)
    _exists(conn, "location", from_location_id)
    _exists(conn, "location", to_location_id)
    available = _stock_of(conn, batch_id, from_location_id)
    if available < packages:
        raise InventoryError("not_enough_stock", available=available)
    from .frozen import on_move  # frozen imports this module

    if on_move(conn, batch_id, from_location_id, to_location_id, packages, source, user_id):
        return  # into a freezer = freeze, out of it = thaw
    _take(conn, batch_id, from_location_id, packages)
    _add(conn, batch_id, to_location_id, packages)
    _booking(
        conn,
        "move",
        batch_id,
        from_location_id,
        packages,
        source,
        user_id,
        to_location_id,
    )


def correct(
    conn: sqlite3.Connection,
    batch_id: int,
    location_id: int,
    packages: int,
    source: str = "manual",
    user_id: str | None = None,
) -> None:
    """Set the absolute count (0 deletes the row); the booking stores the signed difference."""
    _packages(packages, 0)
    _exists(conn, "batch", batch_id)
    _exists(conn, "location", location_id)
    diff = packages - _stock_of(conn, batch_id, location_id)
    if not diff:
        return
    if diff > 0:
        _add(conn, batch_id, location_id, diff)
    else:
        _take(conn, batch_id, location_id, -diff)
    _booking(conn, "correct", batch_id, location_id, diff, source, user_id)


def edit_stock(
    conn: sqlite3.Connection,
    batch_id: int,
    location_id: int,
    expires_on: date | str | None,
    packages: int,
    source: str = "manual",
    user_id: str | None = None,
) -> int:
    """Fix one stock row (batch at a location): date and count. Returns its batch id.

    Another date moves the packages to that batch (merging with an existing one); the log gets a 'correct' out of the
    old and into the new batch. Other locations keep the old batch.
    """
    _packages(packages, 0)
    row = conn.execute(
        "SELECT product_id, canning_id, opened_on, frozen_on, remaining FROM batch WHERE id = ?",
        (batch_id,),
    ).fetchone()
    if not row or not _stock_of(conn, batch_id, location_id):
        raise InventoryError("not_found")
    if row["canning_id"] is not None:  # a charge keeps its batch: the date moves the whole charge
        conn.execute(  # incl. its opened batches
            "UPDATE batch SET expires_on = ? WHERE canning_id = ?",
            (_iso(expires_on), row["canning_id"]),
        )
        target = batch_id
    # a partly used package is its own batch: it takes the new date itself
    elif row["remaining"] < 1:
        conn.execute(
            "UPDATE batch SET expires_on = ?, expiry_guessed = 0 WHERE id = ?",
            (_iso(expires_on), batch_id),
        )
        target = batch_id
    else:  # an opened package stays opened, a frozen one frozen
        target = _batch(
            conn, row["product_id"], expires_on, row["opened_on"], frozen_on=row["frozen_on"]
        )
    if target != batch_id:
        correct(conn, batch_id, location_id, 0, source, user_id)
        packages += _stock_of(conn, target, location_id)  # merge into what is already there
    correct(conn, target, location_id, packages, source, user_id)
    return target
