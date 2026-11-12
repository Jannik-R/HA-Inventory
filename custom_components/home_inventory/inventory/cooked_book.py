"""Cooked, booking side: book the rows of a proposal in one transaction, and undo them."""

from __future__ import annotations

import sqlite3
from datetime import date

from .booking import book_out
from .common import InventoryError, opened_until
from .corrections import put_back
from .inherit import effective
from .opened import open_package, set_remaining, undo_open, undo_remaining

SOURCE = "cooked"
_BATCHES = (
    "SELECT s.batch_id, b.expires_on, b.opened_on, b.frozen_on, b.remaining, SUM(s.packages) AS packages,"
    " GROUP_CONCAT(l.name, ', ') AS location FROM stock s JOIN batch b ON b.id = s.batch_id"
    " JOIN location l ON l.id = s.location_id WHERE b.product_id = ? GROUP BY s.batch_id"
)


def _batches(conn: sqlite3.Connection, product_id: int) -> list[dict]:
    """The product's batches in stock, earliest effective date first (FEFO as `book_out`)."""
    days = effective(conn, product_id)["opened_days"]["value"]
    out = [
        {
            "batch_id": r["batch_id"],
            "location": r["location"],
            "expires_on": opened_until(r["expires_on"], r["opened_on"], days),
            "packages": r["packages"],
            "opened": bool(r["opened_on"]),
            "remaining": r["remaining"],
            "frozen": bool(r["frozen_on"]),
        }
        for r in conn.execute(_BATCHES, (product_id,))
    ]
    return sorted(out, key=lambda b: (b["expires_on"] is None, b["expires_on"] or ""))


def _parts(batches: list[dict]) -> list[dict]:
    """The opened batches to use up first: the partly used ones (a batch each), else the first full one."""
    opened = [b for b in batches if b["opened"]]
    parts = sorted(
        (b for b in opened if b["remaining"] < 1),
        key=lambda b: (b["expires_on"] is None, b["expires_on"] or "", b["remaining"]),
    )
    return parts or opened[:1]


def _open(
    conn: sqlite3.Connection,
    pid: int,
    batch_id: int | None,
    today: date | None,
    user_id: str | None,
) -> dict:
    return open_package(conn, pid, batch_id, None, today, SOURCE, user_id)


def _used_up(conn, pid: int, k: int, skip: int | None = None) -> list[int]:
    """Batch ids of the k partly used packages to use up first (`_parts` order, never `skip`)."""
    ids = [b["batch_id"] for b in _parts(_batches(conn, pid)) if b["batch_id"] != skip][:k]
    if len(ids) < k:
        raise InventoryError("invalid_value")
    return ids


def _out(conn, pid, ids, rest, batch, user_id, out_ids) -> None:
    """Book one package out of each batch in `ids`, then `rest` packages FEFO (or of `batch`)."""
    for i in ids:
        out_ids += [t["booking_id"] for t in book_out(conn, pid, 1, i, None, SOURCE, user_id)]
    if rest:
        out_ids += [
            t["booking_id"] for t in book_out(conn, pid, rest, batch, None, SOURCE, user_id)
        ]


def _level(conn, batch_id, location_id, remaining, user_id, out_ids, remaining_ids) -> None:
    """Set a level; 0 books the package out (its id goes to out_ids)."""
    res = set_remaining(conn, batch_id, remaining, location_id, SOURCE, user_id)
    if res["kind"] == "out":
        out_ids.append(res["taken"][0]["booking_id"])
    elif res["booking_id"]:
        remaining_ids.append(res["booking_id"])


def book_cooked(
    conn: sqlite3.Connection,
    items: list[dict],
    user_id: str | None = None,
    today: date | None = None,
) -> dict:
    """Book items {product_id, batch_id (None = FEFO), packages, action out|open|reduce, open
    (extra packages to open after taking), used_up (partly used packages of the n booked out first
    by batch id), remaining (level of the opened or reduced package
    afterwards)}. The caller's transaction makes it all or nothing.

    Returns {bookings: [{product_id, name, packages, action}], out_ids, open_ids, remaining_ids}
    for `undo_cooked`."""
    out_ids, open_ids, remaining_ids, bookings = [], [], [], []
    for it in items:
        pid, batch, n, extra = (
            it["product_id"],
            it.get("batch_id"),
            it["packages"],
            it.get("open", 0),
        )
        rem = it.get("remaining")
        name = conn.execute("SELECT name FROM product WHERE id = ?", (pid,)).fetchone()
        if name is None:
            raise InventoryError("not_found")
        entry = {"product_id": pid, "name": name[0]}
        if it["action"] == "reduce":
            parts = [b["batch_id"] for b in _parts(_batches(conn, pid))]
            ids = _used_up(conn, pid, n, batch)  # the used up partly used packages go out first
            batch = batch or (parts[n] if len(parts) > n else None)
            if batch is None or rem is None:
                raise InventoryError("invalid_value")
            _out(conn, pid, ids, 0, None, user_id, out_ids)
            if n:
                bookings.append(entry | {"packages": n, "action": "out"})
            _level(conn, batch, None, rem, user_id, out_ids, remaining_ids)
            bookings.append(entry | {"packages": 0, "action": "reduce"})
            continue
        opened = []
        if it["action"] == "open":
            opened = [_open(conn, pid, batch, today, user_id) for _ in range(n)]
            bookings.append(entry | {"packages": n, "action": "open"})
        elif it["action"] == "out":
            if n:
                u = min(it.get("used_up", 0), n)
                _out(conn, pid, _used_up(conn, pid, u), n - u, batch, user_id, out_ids)
                bookings.append(entry | {"packages": n, "action": "out"})
            if extra:
                opened = [_open(conn, pid, None, today, user_id) for _ in range(extra)]
                bookings.append(entry | {"packages": extra, "action": "open"})
        else:
            raise InventoryError("invalid_value")
        open_ids += [o["booking_id"] for o in opened]
        if opened and rem is not None:
            last = opened[-1]
            _level(
                conn, last["batch_id"], last["location_id"], rem, user_id, out_ids, remaining_ids
            )
    return {
        "bookings": bookings, "out_ids": out_ids, "open_ids": open_ids, "remaining_ids": remaining_ids,
    }  # fmt: skip


def undo_cooked(
    conn: sqlite3.Connection,
    out_ids: list[int],
    open_ids: list[int],
    user_id: str | None = None,
    remaining_ids: list[int] | tuple = (),
) -> None:
    """Reverse `book_cooked` (levels first, then openings: they were booked last)."""
    for i in reversed(remaining_ids):
        undo_remaining(conn, i, user_id)
    for i in reversed(open_ids):
        undo_open(conn, i, user_id)
    put_back(conn, out_ids, user_id=user_id)
