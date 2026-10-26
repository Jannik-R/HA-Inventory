"""Booking history: the log as actions (everything one write call booked) and undoing a whole action."""

from __future__ import annotations

import sqlite3

from .booking import _add, _booking, _stock_of, _take
from .common import InventoryError
from .corrections import put_back
from .frozen import undo_frozen
from .opened import undo_open

PAGE = 100
ROWS = 20
# Hidden: undo rows and the -n half of a transfer pair (freeze, thaw, level change show once).
_VISIBLE = (
    "k.reverts_id IS NULL AND NOT (k.kind IN ('freeze', 'thaw', 'remaining') AND k.packages < 0)"
)
_ACTION = "coalesce(k.action_id, k.id)"


def _in_action(n: int) -> str:
    """Rows of n actions, written so the booking_action index is used (NULL = its own action)."""
    q = ",".join("?" * n)
    return f"(k.action_id IN ({q}) OR (k.action_id IS NULL AND k.id IN ({q})))"


_JOINS = "FROM booking k JOIN batch b ON b.id = k.batch_id JOIN product p ON p.id = b.product_id"


def history(
    conn: sqlite3.Connection,
    name: str | None = None,
    user_id: str | None = None,
    ts_from: str | None = None,
    ts_to: str | None = None,
    offset: int = 0,
) -> dict:
    """Newest actions first: {actions: [...], more}. Filters pick the actions; each shows all its rows."""
    where, args = [_VISIBLE], []
    for sql, value in (
        ("instr(fold(p.name), fold(?)) > 0", name or None),
        ("k.user_id = ?", user_id),
        ("k.ts >= ?", ts_from),
        ("k.ts < ?", ts_to),
    ):
        if value is not None:
            where.append(sql)
            args.append(value)
    ids = [
        r[0]
        for r in conn.execute(
            f"SELECT {_ACTION} AS a {_JOINS} WHERE {' AND '.join(where)}"
            f" GROUP BY a ORDER BY a DESC LIMIT {PAGE + 1} OFFSET ?",
            (*args, offset),
        )
    ]
    more = len(ids) > PAGE
    ids = ids[:PAGE]
    rows = conn.execute(
        "SELECT k.id, k.ts, k.kind, k.packages, k.source, k.user_id,"
        f" {_ACTION} AS action_id, p.id AS product_id, p.name,"
        " l.name AS location, t.name AS to_location, u.ts AS undone_at, u.user_id AS undone_by "
        f"{_JOINS}"
        # a transfer's +n row is written right after its -n row (see frozen.transfer)
        " LEFT JOIN booking m ON k.kind IN ('freeze', 'thaw', 'remaining') AND m.id = k.id - 1"
        " AND m.kind = k.kind AND m.packages = -k.packages"
        " LEFT JOIN location l ON l.id = coalesce(m.location_id, k.location_id)"
        " LEFT JOIN location t ON t.id = CASE WHEN m.id IS NULL THEN k.to_location_id ELSE k.location_id END"
        " LEFT JOIN booking u ON u.reverts_id = k.id"
        f" WHERE {_VISIBLE} AND {_in_action(len(ids))} ORDER BY k.id",
        ids * 2,
    ).fetchall()
    groups: dict[int, list[sqlite3.Row]] = {}
    for r in rows:
        groups.setdefault(r["action_id"], []).append(r)
    out = []
    for aid in sorted(groups, reverse=True):
        rs = groups[aid]
        undone = [r for r in rs if r["undone_at"]]
        last = max(undone, key=lambda r: r["undone_at"], default=None)
        full = len(undone) == len(rs)
        # shortcut: a big action (import, stocktake) shows its first ROWS rows; undo still takes all
        out.append(
            {
                "action_id": aid, "ts": rs[0]["ts"], "user_id": rs[0]["user_id"],
                "source": rs[0]["source"], "more_rows": max(0, len(rs) - ROWS),
                "undone_at": last["undone_at"] if full else None,
                "undone_by": last["undone_by"] if full else None,
                "partly": bool(undone) and not full,
                "rows": [
                    {
                        "id": r["id"], "kind": r["kind"], "packages": r["packages"],
                        "product_id": r["product_id"], "name": r["name"],
                        "location": r["location"], "undone_at": r["undone_at"],
                        "to_location": r["to_location"] if r["to_location"] != r["location"] else None,
                    }
                    for r in rs[:ROWS]
                ],
            }
        )  # fmt: skip
    return {"actions": out, "more": more}


def _need(conn, batch_id: int, location_id: int, n: int) -> None:
    available = _stock_of(conn, batch_id, location_id)
    if available < n:
        raise InventoryError("not_enough_stock", available=available)


def _undo_row(conn: sqlite3.Connection, booking_id: int, user_id: str | None) -> None:
    """Reverse one booking row with a compensating row (source 'undo', reverts_id)."""
    row = conn.execute("SELECT * FROM booking WHERE id = ?", (booking_id,)).fetchone()
    if not row or row["reverts_id"] is not None or row["location_id"] is None:
        raise InventoryError("not_found")
    if conn.execute("SELECT 1 FROM booking WHERE reverts_id = ?", (booking_id,)).fetchone():
        raise InventoryError("already_undone")
    kind, n, batch, loc = row["kind"], row["packages"], row["batch_id"], row["location_id"]
    if kind == "out":
        put_back(conn, [booking_id], user_id=user_id)
    elif kind == "open":
        undo_open(conn, booking_id, user_id)
    elif kind in ("freeze", "thaw", "remaining"):
        undo_frozen(conn, booking_id, user_id, (kind,))
    elif kind == "in":
        _need(conn, batch, loc, n)
        _take(conn, batch, loc, n)
        _booking(conn, "out", batch, loc, n, "undo", user_id, reverts_id=booking_id)
    elif kind == "move":
        to = row["to_location_id"]
        _need(conn, batch, to, n)
        conn.execute("UPDATE location SET active = 1 WHERE id = ?", (loc,))
        _take(conn, batch, to, n)
        _add(conn, batch, loc, n)
        _booking(conn, "move", batch, to, n, "undo", user_id, loc, reverts_id=booking_id)
    elif kind == "correct":  # n is the signed difference
        if n > 0:
            _need(conn, batch, loc, n)
            _take(conn, batch, loc, n)
        else:
            conn.execute("UPDATE location SET active = 1 WHERE id = ?", (loc,))
            _add(conn, batch, loc, -n)
        _booking(conn, "correct", batch, loc, -n, "undo", user_id, reverts_id=booking_id)
    else:
        raise InventoryError("invalid_value")


def undo_action(conn: sqlite3.Connection, action_id: int, user_id: str | None = None) -> None:
    """Undo every not yet undone row of an action, newest first; all or nothing (the caller rolls back)."""
    where = f"{_VISIBLE} AND {_in_action(1)}"
    rows = conn.execute(
        f"SELECT k.id, p.name {_JOINS} WHERE {where}"
        " AND NOT EXISTS (SELECT 1 FROM booking u WHERE u.reverts_id = k.id) ORDER BY k.id DESC",
        (action_id, action_id),
    ).fetchall()
    if not rows:
        known = conn.execute(f"SELECT 1 {_JOINS} WHERE {where}", (action_id, action_id)).fetchone()
        raise InventoryError("already_undone" if known else "not_found")
    for r in rows:
        try:
            _undo_row(conn, r["id"], user_id)
        except InventoryError as err:
            raise InventoryError("undo_blocked", name=r["name"]) from err
