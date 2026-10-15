"""Bookings: book in/out, move, correct. Every change writes a booking row."""

from __future__ import annotations

import sqlite3
from datetime import date

from .common import InventoryError, _now
from .inherit import effective
from .products import add_product


def _booking(
    conn, kind, batch_id, location_id, packages, source, user_id, to_location_id=None
):
    conn.execute(
        "INSERT INTO booking (ts, kind, batch_id, location_id, to_location_id, packages, source, user_id)"
        " VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        (_now(), kind, batch_id, location_id, to_location_id, packages, source, user_id),
    )  # fmt: skip


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


def _exists(conn, table: str, row_id: int | None) -> None:
    if row_id is not None and not conn.execute(f"SELECT 1 FROM {table} WHERE id = ?", (row_id,)).fetchone():
        raise InventoryError("not_found")


def _positive(packages: int) -> None:
    if packages < 1:
        raise ValueError("packages must be >= 1")


def book_in(
    conn: sqlite3.Connection,
    product_id: int,
    packages: int,
    expires_on: date | str | None = None,
    expiry_type: str | None = None,
    location_id: int | None = None,
    source: str = "manual",
    user_id: str | None = None,
) -> int:
    """Book packages in; the same product+date+type merges into one batch. Returns batch id."""
    _positive(packages)
    eff = effective(conn, product_id)  # raises not_found
    expiry_type = expiry_type or eff["expiry_type"]["value"]
    if expiry_type not in ("best_before", "use_by"):
        raise InventoryError("invalid_value")
    location_id = location_id or eff["default_location_id"]["value"]
    if location_id is None:
        raise InventoryError("location_required")
    _exists(conn, "location", location_id)
    if expires_on:
        try:
            expires_on = date.fromisoformat(str(expires_on)).isoformat()
        except ValueError:
            raise InventoryError("invalid_date") from None
    else:
        expires_on = None
    row = conn.execute(
        "SELECT id FROM batch WHERE product_id = ? AND expiry_type = ? AND expires_on IS ?",
        (product_id, expiry_type, expires_on),
    ).fetchone()
    if row:
        batch_id = row["id"]
    else:
        batch_id = conn.execute(
            "INSERT INTO batch (product_id, expires_on, expiry_type, created_at) VALUES (?, ?, ?, ?)",
            (product_id, expires_on, expiry_type, _now()),
        ).lastrowid
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
    """Take packages, earliest expiry first (no date last). Nothing changes if too few."""
    _positive(packages)
    _exists(conn, "product", product_id)
    _exists(conn, "batch", batch_id)
    _exists(conn, "location", location_id)
    sql = (
        "SELECT s.batch_id, s.location_id, s.packages FROM stock s JOIN batch b ON b.id = s.batch_id"
        " WHERE b.product_id = ?"
    )
    args: list = [product_id]
    if batch_id is not None:
        sql += " AND s.batch_id = ?"
        args.append(batch_id)
    if location_id is not None:
        sql += " AND s.location_id = ?"
        args.append(location_id)
    rows = conn.execute(
        sql + " ORDER BY b.expires_on IS NULL, b.expires_on, s.location_id", args
    ).fetchall()
    available = sum(r["packages"] for r in rows)
    if available < packages:
        raise InventoryError("not_enough_stock", available=available)
    taken, left = [], packages
    for r in rows:
        n = min(left, r["packages"])
        _take(conn, r["batch_id"], r["location_id"], n)
        _booking(conn, "out", r["batch_id"], r["location_id"], n, source, user_id)
        taken.append(
            {"batch_id": r["batch_id"], "location_id": r["location_id"], "packages": n}
        )
        left -= n
        if not left:
            break
    return taken


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
    _positive(packages)
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
    if packages < 0:
        raise ValueError("packages must be >= 0")
    _exists(conn, "batch", batch_id)
    _exists(conn, "location", location_id)
    diff = packages - _stock_of(conn, batch_id, location_id)
    if not diff:
        return
    if packages:
        conn.execute(
            "INSERT INTO stock (batch_id, location_id, packages) VALUES (?, ?, ?)"
            " ON CONFLICT (batch_id, location_id) DO UPDATE SET packages = excluded.packages",
            (batch_id, location_id, packages),
        )
    else:
        conn.execute(
            "DELETE FROM stock WHERE batch_id = ? AND location_id = ?",
            (batch_id, location_id),
        )
    _booking(conn, "correct", batch_id, location_id, diff, source, user_id)
