"""Cooked: book out what a recipe used. A proposal per ingredient (product, batch, packages, open
or out) the user can change, then one transaction books the checked rows.

shortcut: two ingredients of the same category are proposed independently, and the same product
in two rows is not summed: the second may find too few packages and the whole booking fails
(all-or-nothing). Frozen batches count as stock for "out", not for opening.
"""

from __future__ import annotations

import sqlite3
from datetime import date

from .amounts import _amount, _stock_amount
from .booking import book_out
from .codes import _recipe
from .common import InventoryError, opened_until
from .corrections import put_back
from .inherit import effective
from .opened import open_package, set_remaining, undo_open, undo_remaining
from .recipes import _ctx, _ingredients, _subtree

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


def _plan(need: float | None, per: float | None, batches: list[dict]) -> dict:
    """What to book of one product for `need` (in the ingredient's unit), `per` = package content
    in that unit. The partly used packages are used up first, then full ones go out, the remainder
    opens one package at a level (`remaining`, None = unchanged). Unknown amounts: one package,
    not checked (`sure` False). A reduce books `packages` out first, then lowers `batch_id`."""
    total = sum(b["packages"] for b in batches)
    fresh = [b for b in batches if not b["opened"] and not b["frozen"]]  # can be opened
    if need is None or per is None:
        return {"action": "out", "packages": 1, "open": 0, "batch_id": batches[0]["batch_id"]
                if batches[0]["packages"] >= 1 else None, "sure": False, "remaining": None}  # fmt: skip
    parts, k, used = _parts(batches), 0, 0.0
    while k < len(parts) and used + parts[k]["remaining"] * per <= need + 1e-6 * per:
        used += parts[k]["remaining"] * per
        k += 1
    rest = need - used
    if k < len(parts) and rest > 1e-6 * per:  # the next partly used package covers the rest
        return {"action": "reduce", "packages": k, "open": 0, "batch_id": parts[k]["batch_id"],
                "sure": True, "remaining": max(0.0, round(parts[k]["remaining"] - rest / per, 3))}  # fmt: skip
    full = int(rest / per + 1e-9)
    tail = rest - full * per
    n = full + k  # the used up packages go out first
    extra = 1 if tail > 1e-6 * per else 0
    sure = True
    if n > total:
        n, sure = total, False  # not enough stock: the row is not checked
    # shortcut: FEFO may take the full packages from other opened batches, then fewer fresh ones remain.
    if sum(b["packages"] for b in fresh) - full < 1:
        extra = 0
    remaining = max(0.1, round(1 - tail / per, 3)) if extra else None  # 0.1 = fast leer
    if n == 0 and extra:
        return {"action": "open", "packages": 1, "open": 0, "batch_id": fresh[0]["batch_id"],
                "sure": sure, "remaining": remaining}  # fmt: skip
    if n == 0:
        return {"action": "skip", "packages": 0, "open": 0, "batch_id": batches[0]["batch_id"],
                "sure": False, "remaining": None}  # fmt: skip
    # the k used up partly used packages are booked by batch id, FEFO takes the rest
    return {"action": "out", "packages": n, "open": extra, "used_up": min(k, n),
            "batch_id": batches[0]["batch_id"] if not k and batches[0]["packages"] >= n else None,
            "sure": sure, "remaining": remaining}  # fmt: skip


def cooked_proposal(conn: sqlite3.Connection, recipe_id: int, servings: int) -> list[dict]:
    """Per ingredient with stock: candidates (products of its category's subtree) and the default
    pick. Left out: skip_stock, no category, nothing in stock."""
    row = conn.execute("SELECT servings FROM recipe WHERE id = ?", (recipe_id,)).fetchone()
    if row is None:
        raise InventoryError("not_found")
    factor = servings / row["servings"]
    cats, units, stock, kids, dflt = _ctx(conn)
    rows = []
    for ing in _ingredients(conn, recipe_id):
        cid = ing["category_id"]
        if ing["skip_stock"] or cid not in cats:
            continue
        amount, unit_id = _stock_amount(units, cats, dflt, cid, ing["amount"], ing["unit_id"])
        need = None if amount is None else round(amount * factor, 6)
        cands = []
        for p in (p for c in _subtree(kids, cid) for p in stock.get(c, []) if p["packages"]):
            batches = _batches(conn, p["id"])
            per = None
            if unit_id is not None:
                per = _amount(units, 1, p["content_amount"], p["content_unit_id"], unit_id)
            cands.append({
                "product_id": p["id"],
                "name": p["name"],
                "brand": p["brand"],
                "batches": batches,
                "used_up": 0,
                **_plan(need, per, batches),
            })  # fmt: skip
        if not cands:
            continue
        # default product: the one whose first batch expires first
        cands.sort(key=lambda c: (c["batches"][0]["expires_on"] is None,
                                  c["batches"][0]["expires_on"] or ""))  # fmt: skip
        best = cands[0]
        rows.append({
            "ingredient_id": ing["id"],
            "text": ing["text"],
            "amount": None if ing["amount"] is None else round(ing["amount"] * factor, 6),
            "unit_symbol": units[ing["unit_id"]]["symbol"] if ing["unit_id"] else None,
            "optional": ing["optional"],
            "candidates": cands,
            "product_id": best["product_id"],
            "checked": not ing["optional"] and best["sure"] and best["action"] != "skip",
        })  # fmt: skip
    return rows


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


def cooked_by_name(
    conn: sqlite3.Connection,
    recipe: str,
    servings: int | None,
    user_id: str | None = None,
    today: date | None = None,
) -> dict:
    """Service: book the default proposal (checked rows) of a recipe, by name."""
    row = _recipe(conn, recipe)
    items = []
    for r in cooked_proposal(conn, row["id"], servings or row["servings"]):
        if r["checked"]:
            c = next(c for c in r["candidates"] if c["product_id"] == r["product_id"])
            items.append(
                {
                    k: c[k]
                    for k in (
                        "product_id",
                        "batch_id",
                        "packages",
                        "action",
                        "open",
                        "remaining",
                        "used_up",
                    )
                }
            )
    return book_cooked(conn, items, user_id, today) | {"recipe_id": row["id"]}
