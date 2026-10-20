"""Freezing fresh products: a batch of a freezable product at a freezer location is frozen.

Frozen = its own batch with frozen_on and the date frozen_on + frozen_days (a guide value). Thawed =
an opened batch (opened_on = thaw day) dated thaw day + opened_days (1 day without). Freezing and
thawing write two bookings of their kind: -n on the source batch, then +n on the target batch.
"""

from __future__ import annotations

import sqlite3
from datetime import date, timedelta

from .booking import _add, _batch, _booking, _level_batch, _stock_of, _take
from .common import InventoryError, _exists, _packages
from .inherit import effective


def is_freezer(conn: sqlite3.Connection, location_id: int) -> bool:
    row = conn.execute("SELECT freezer FROM location WHERE id = ?", (location_id,)).fetchone()
    return bool(row and row["freezer"])


def frozen_days(conn: sqlite3.Connection, product_id: int) -> int | None:
    """Days the product keeps frozen; None = not freezable (module off, non-food, frozen goods,
    no value). Module off: no freezing at all, also not by the freezer rule (dates stay)."""
    if not getattr(conn, "freezing", True):
        return None
    eff = effective(conn, product_id)
    if eff["food"]["value"] == 0 or eff["frozen_goods"]["value"] == 1:
        return None
    return eff["frozen_days"]["value"]


def frozen_batch(conn, product_id: int, canning_id, days: int, today: date) -> int:
    return _batch(
        conn, product_id, today + timedelta(days=days), None, canning_id, True, today.isoformat()
    )


def _thawed_batch(conn, product_id: int, canning_id, today: date) -> int:
    days = effective(conn, product_id)["opened_days"]["value"] or 1
    return _batch(
        conn, product_id, today + timedelta(days=days), today.isoformat(), canning_id, True
    )


def transfer(
    conn, kind: str, batch_id: int, location_id: int, target: int, to_location_id: int,
    packages: int, source: str, user_id: str | None,
) -> int:  # fmt: skip
    """Move packages from one batch/location to another; returns the id of the +n booking."""
    available = _stock_of(conn, batch_id, location_id)
    if available < packages:
        raise InventoryError("not_enough_stock", available=available)
    _take(conn, batch_id, location_id, packages)
    _add(conn, target, to_location_id, packages)
    _booking(conn, kind, batch_id, location_id, -packages, source, user_id)
    return _booking(conn, kind, target, to_location_id, packages, source, user_id)


def _carry(conn, batch_id: int, target: int) -> int:
    """The target for a transfer: a partly used package keeps its level in a new batch."""
    level = conn.execute("SELECT remaining FROM batch WHERE id = ?", (batch_id,)).fetchone()[0]
    # the full target row may stay empty; harmless.
    return target if level == 1 else _level_batch(conn, target, level)


def on_move(
    conn, batch_id: int, from_location_id: int, to_location_id: int, packages: int,
    source: str, user_id: str | None, today: date | None = None,
) -> bool:  # fmt: skip
    """A move into or out of a freezer freezes / thaws the packages; False = a plain move."""
    row = conn.execute(
        "SELECT product_id, canning_id, frozen_on FROM batch WHERE id = ?", (batch_id,)
    ).fetchone()
    today = today or date.today()
    into, out_of = is_freezer(conn, to_location_id), is_freezer(conn, from_location_id)
    if into and not row["frozen_on"] and (days := frozen_days(conn, row["product_id"])):
        target = frozen_batch(conn, row["product_id"], row["canning_id"], days, today)
        kind = "freeze"
    elif out_of and not into and row["frozen_on"]:
        target = _thawed_batch(conn, row["product_id"], row["canning_id"], today)
        kind = "thaw"
    else:
        return False
    target = _carry(conn, batch_id, target)
    transfer(
        conn, kind, batch_id, from_location_id, target, to_location_id, packages, source, user_id
    )
    return True


def _source(conn, product_id, batch_id, location_id, frozen: bool) -> sqlite3.Row:
    """The stock row to freeze / thaw: earliest date first (or of that batch / location)."""
    sql = (
        "SELECT s.batch_id, s.location_id, s.packages FROM stock s"
        " JOIN batch b ON b.id = s.batch_id JOIN location l ON l.id = s.location_id"
        f" WHERE b.product_id = ? AND b.frozen_on IS {'NOT ' if frozen else ''}NULL"
        f" AND l.freezer = {int(frozen)}"
    )
    args: list = [product_id]
    if batch_id is not None:
        sql += " AND s.batch_id = ?"
        args.append(batch_id)
    if location_id is not None:
        sql += " AND s.location_id = ?"
        args.append(location_id)
    row = conn.execute(
        sql
        + " ORDER BY b.expires_on IS NULL, b.expires_on, b.remaining DESC, s.location_id LIMIT 1",
        args,
    ).fetchone()
    if not row:
        raise InventoryError("not_enough_stock", available=0)
    return row


def _result(conn, product_id: int, target: int, location_id: int, booking_id: int) -> dict:
    return {
        "batch_id": target,
        "location_id": location_id,
        "booking_id": booking_id,
        "expires_on": conn.execute(
            "SELECT expires_on FROM batch WHERE id = ?", (target,)
        ).fetchone()[0],
        "name": conn.execute("SELECT name FROM product WHERE id = ?", (product_id,)).fetchone()[0],
        "location": conn.execute(
            "SELECT name FROM location WHERE id = ?", (location_id,)
        ).fetchone()[0],
    }


def freeze(
    conn: sqlite3.Connection,
    product_id: int,
    packages: int = 1,
    batch_id: int | None = None,
    location_id: int | None = None,
    to_location_id: int | None = None,
    today: date | None = None,
    source: str = "manual",
    user_id: str | None = None,
) -> dict:
    """Freeze packages of an unfrozen batch (earliest first); target: that or the first freezer.

    Returns {batch_id (frozen), location_id, booking_id, expires_on, name, location}."""
    _packages(packages)
    _exists(conn, "product", product_id)
    _exists(conn, "location", location_id)
    if not (days := frozen_days(conn, product_id)):
        raise InventoryError("not_freezable")
    if to_location_id is None:
        row = conn.execute(
            "SELECT id FROM location WHERE freezer = 1 AND active = 1 ORDER BY sort, id LIMIT 1"
        ).fetchone()
        if not row:
            raise InventoryError("no_freezer")
        to_location_id = row["id"]
    elif not is_freezer(conn, to_location_id):
        raise InventoryError("no_freezer")
    src = _source(conn, product_id, batch_id, location_id, frozen=False)
    canning_id = conn.execute(
        "SELECT canning_id FROM batch WHERE id = ?", (src["batch_id"],)
    ).fetchone()[0]
    target = _carry(
        conn,
        src["batch_id"],
        frozen_batch(conn, product_id, canning_id, days, today or date.today()),
    )
    booking_id = transfer(
        conn, "freeze", src["batch_id"], src["location_id"], target, to_location_id, packages,
        source, user_id,
    )  # fmt: skip
    return _result(conn, product_id, target, to_location_id, booking_id)


def thaw(
    conn: sqlite3.Connection,
    product_id: int,
    packages: int = 1,
    batch_id: int | None = None,
    location_id: int | None = None,
    to_location_id: int | None = None,
    today: date | None = None,
    source: str = "manual",
    user_id: str | None = None,
) -> dict:
    """Thaw packages of a frozen batch to that location or the product's default location."""
    _packages(packages)
    _exists(conn, "product", product_id)
    _exists(conn, "location", location_id)
    to_location_id = to_location_id or effective(conn, product_id)["default_location_id"]["value"]
    if to_location_id is None or is_freezer(conn, to_location_id):
        raise InventoryError("location_required")
    _exists(conn, "location", to_location_id)
    src = _source(conn, product_id, batch_id, location_id, frozen=True)
    canning_id = conn.execute(
        "SELECT canning_id FROM batch WHERE id = ?", (src["batch_id"],)
    ).fetchone()[0]
    target = _carry(
        conn, src["batch_id"], _thawed_batch(conn, product_id, canning_id, today or date.today())
    )
    booking_id = transfer(
        conn, "thaw", src["batch_id"], src["location_id"], target, to_location_id, packages,
        source, user_id,
    )  # fmt: skip
    return _result(conn, product_id, target, to_location_id, booking_id)


def undo_frozen(
    conn: sqlite3.Connection,
    booking_id: int,
    user_id: str | None = None,
    kinds: tuple[str, ...] = ("freeze", "thaw"),
) -> None:
    """Undo a transfer (freeze, thaw, level change) once: the packages go back to the source batch and location."""
    plus = conn.execute(
        f"SELECT * FROM booking WHERE id = ? AND kind IN ({', '.join('?' * len(kinds))})"
        " AND packages > 0",
        (booking_id, *kinds),
    ).fetchone()
    # transfer() writes the -n row right before the +n row (one connection, one lock)
    minus = conn.execute(
        "SELECT * FROM booking WHERE id = ? AND kind = ? AND packages = ?",
        (booking_id - 1, plus["kind"] if plus else "", -plus["packages"] if plus else 0),
    ).fetchone()
    if not plus or not minus:
        raise InventoryError("not_found")
    if conn.execute("SELECT 1 FROM booking WHERE reverts_id = ?", (booking_id,)).fetchone():
        raise InventoryError("already_undone")
    n = plus["packages"]
    if _stock_of(conn, plus["batch_id"], plus["location_id"]) < n:
        raise InventoryError("not_enough_stock", available=0)
    conn.execute("UPDATE location SET active = 1 WHERE id = ?", (minus["location_id"],))
    _take(conn, plus["batch_id"], plus["location_id"], n)
    _add(conn, minus["batch_id"], minus["location_id"], n)
    kind = plus["kind"]
    _booking(
        conn,
        kind,
        plus["batch_id"],
        plus["location_id"],
        -n,
        "undo",
        user_id,
        reverts_id=plus["id"],
    )
    _booking(
        conn,
        kind,
        minus["batch_id"],
        minus["location_id"],
        n,
        "undo",
        user_id,
        reverts_id=minus["id"],
    )
