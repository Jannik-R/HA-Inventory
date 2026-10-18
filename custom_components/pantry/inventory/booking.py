"""Bookings: book in/out, move, correct, edit a stock row. Every change writes a booking row."""

from __future__ import annotations

import sqlite3
from datetime import date

from .common import InventoryError, _exists, _now, _packages, opened_until
from .inherit import effective
from .products import add_product


def _booking(
    conn,
    kind,
    batch_id,
    location_id,
    packages,
    source,
    user_id,
    to_location_id=None,
    reverts_id=None,
) -> int:
    """Write the log row; returns its id."""
    return conn.execute(
        "INSERT INTO booking (ts, kind, batch_id, location_id, to_location_id, packages, source, user_id,"
        " reverts_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        (_now(), kind, batch_id, location_id, to_location_id, packages, source, user_id, reverts_id),
    ).lastrowid  # fmt: skip


def _add(conn, batch_id: int, location_id: int, packages: int) -> None:
    conn.execute(
        "INSERT INTO stock (batch_id, location_id, packages) VALUES (?, ?, ?)"
        " ON CONFLICT (batch_id, location_id) DO UPDATE SET packages = packages + excluded.packages",
        (batch_id, location_id, packages),
    )


def _take(conn, batch_id: int, location_id: int, packages: int) -> None:
    """Remove packages from a stock row (caller checked availability); empty rows are deleted."""
    if _stock_of(conn, batch_id, location_id) == packages:
        conn.execute(
            "DELETE FROM stock WHERE batch_id = ? AND location_id = ?",
            (batch_id, location_id),
        )
    else:
        conn.execute(
            "UPDATE stock SET packages = packages - ? WHERE batch_id = ? AND location_id = ?",
            (packages, batch_id, location_id),
        )


def _iso(expires_on: date | str | None) -> str | None:
    """ISO date or None; anything else raises invalid_date."""
    if not expires_on:
        return None
    try:
        return date.fromisoformat(str(expires_on)).isoformat()
    except ValueError:
        raise InventoryError("invalid_date") from None


def _batch(
    conn, product_id: int, expires_on: date | str | None, opened_on=None, canning_id=None
) -> int:
    """Id of the batch with this key (default: unopened, no canning charge); created if missing."""
    key = (product_id, _iso(expires_on), canning_id, opened_on)
    row = conn.execute(
        "SELECT id FROM batch WHERE product_id = ? AND expires_on IS ? AND canning_id IS ?"
        " AND opened_on IS ?",
        key,
    ).fetchone()
    if row:
        return row["id"]
    return conn.execute(
        "INSERT INTO batch (product_id, expires_on, canning_id, opened_on, created_at)"
        " VALUES (?, ?, ?, ?, ?)",
        (*key, _now()),
    ).lastrowid


def book_in(
    conn: sqlite3.Connection,
    product_id: int,
    packages: int,
    expires_on: date | str | None = None,
    location_id: int | None = None,
    source: str = "manual",
    user_id: str | None = None,
) -> int:
    """Book packages in; the same product+date merges into one batch. Returns batch id."""
    _packages(packages)
    eff = effective(conn, product_id)  # raises not_found
    location_id = location_id or eff["default_location_id"]["value"]
    if location_id is None:
        raise InventoryError("location_required")
    _exists(conn, "location", location_id)
    batch_id = _batch(conn, product_id, expires_on)
    _add(conn, batch_id, location_id, packages)
    _booking(conn, "in", batch_id, location_id, packages, source, user_id)
    return batch_id


def book_in_new(conn, product: dict, packages: int, **kwargs) -> dict:
    """Save a new product (add_product, learns OFF tags) and book it in, in one transaction."""
    product_id = add_product(conn, product)
    return {"product_id": product_id, "batch_id": book_in(conn, product_id, packages, **kwargs)}


def book_out(
    conn: sqlite3.Connection,
    product_id: int,
    packages: int,
    batch_id: int | None = None,
    location_id: int | None = None,
    source: str = "manual",
    user_id: str | None = None,
) -> list[dict]:
    """Take packages, earliest (effective) expiry first, no date last. Nothing changes if too few.

    Returns the taken rows {batch_id, location_id, packages, booking_id}; `put_back` takes the booking ids."""
    _packages(packages)
    _exists(conn, "product", product_id)
    _exists(conn, "batch", batch_id)
    _exists(conn, "location", location_id)
    sql = (
        "SELECT s.batch_id, s.location_id, s.packages, b.expires_on, b.opened_on FROM stock s"
        " JOIN batch b ON b.id = s.batch_id WHERE b.product_id = ?"
    )
    args: list = [product_id]
    if batch_id is not None:
        sql += " AND s.batch_id = ?"
        args.append(batch_id)
    if location_id is not None:
        sql += " AND s.location_id = ?"
        args.append(location_id)
    days = effective(conn, product_id)["opened_days"]["value"]
    rows = conn.execute(sql + " ORDER BY s.location_id", args).fetchall()
    until = {r["batch_id"]: opened_until(r["expires_on"], r["opened_on"], days) for r in rows}
    rows.sort(key=lambda r: (until[r["batch_id"]] is None, until[r["batch_id"]] or ""))
    available = sum(r["packages"] for r in rows)
    if available < packages:
        raise InventoryError("not_enough_stock", available=available)
    taken, left = [], packages
    for r in rows:
        n = min(left, r["packages"])
        _take(conn, r["batch_id"], r["location_id"], n)
        booking_id = _booking(conn, "out", r["batch_id"], r["location_id"], n, source, user_id)
        taken.append(
            {
                "batch_id": r["batch_id"],
                "location_id": r["location_id"],
                "packages": n,
                "booking_id": booking_id,
            }
        )
        left -= n
        if not left:
            break
    return taken


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


def _stock_of(conn, batch_id: int, location_id: int) -> int:
    row = conn.execute(
        "SELECT packages FROM stock WHERE batch_id = ? AND location_id = ?",
        (batch_id, location_id),
    ).fetchone()
    return row["packages"] if row else 0


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
        "SELECT product_id, canning_id, opened_on FROM batch WHERE id = ?", (batch_id,)
    ).fetchone()
    if not row or not _stock_of(conn, batch_id, location_id):
        raise InventoryError("not_found")
    if row["canning_id"] is not None:  # a charge keeps its batch: the date moves the whole charge
        conn.execute(  # incl. its opened batches
            "UPDATE batch SET expires_on = ? WHERE canning_id = ?",
            (_iso(expires_on), row["canning_id"]),
        )
        target = batch_id
    else:  # an opened package stays opened
        target = _batch(conn, row["product_id"], expires_on, row["opened_on"])
    if target != batch_id:
        correct(conn, batch_id, location_id, 0, source, user_id)
        packages += _stock_of(conn, target, location_id)  # merge into what is already there
    correct(conn, target, location_id, packages, source, user_id)
    return target
