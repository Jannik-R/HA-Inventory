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
from .booking import book_out, put_back
from .codes import _recipe
from .common import InventoryError, opened_until
from .inherit import effective
from .opened import open_package, undo_open
from .recipes import _ctx, _ingredients, _subtree

SOURCE = "cooked"
_BATCHES = (
    "SELECT s.batch_id, b.expires_on, b.opened_on, b.frozen_on, SUM(s.packages) AS packages,"
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
            "frozen": bool(r["frozen_on"]),
        }
        for r in conn.execute(_BATCHES, (product_id,))
    ]
    return sorted(out, key=lambda b: (b["expires_on"] is None, b["expires_on"] or ""))


def _plan(need: float | None, per: float | None, batches: list[dict]) -> dict:
    """What to book of one product for `need` (in the ingredient's unit), `per` = package content
    in that unit. Stock is whole packages: full ones go out, the remainder opens one package
    unless an opened one exists. Unknown amounts: one package, not checked (`sure` False)."""
    total = sum(b["packages"] for b in batches)
    fresh = [b for b in batches if not b["opened"] and not b["frozen"]]  # can be opened
    sure = True
    known = need is not None and per is not None
    small = known and need < per
    batches = sorted(batches, key=lambda b: not (small and b["opened"]))  # stable: opened first
    opened = any(b["opened"] for b in batches)
    n, extra = 1, 0
    if known:
        n = int(need / per + 1e-9)
        extra = 0 if opened or need - n * per < 1e-6 * per else 1
        if n > total:
            n, sure = total, False  # not enough stock: the row is not checked
        if sum(b["packages"] for b in fresh) - n < 1:
            extra = 0
    first = batches[0]
    if n == 0 and extra:
        return {"action": "open", "packages": 1, "open": 0, "batch_id": fresh[0]["batch_id"],
                "sure": sure}  # fmt: skip
    if n == 0:  # the opened package covers it
        return {"action": "skip", "packages": 0, "open": 0, "batch_id": first["batch_id"],
                "sure": False}  # fmt: skip
    return {
        "action": "out",
        "packages": n,
        "open": extra,
        "batch_id": first["batch_id"] if first["packages"] >= n else None,
        "sure": known and sure,
    }


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
) -> int:
    return open_package(conn, pid, batch_id, None, today, SOURCE, user_id)["booking_id"]


def book_cooked(
    conn: sqlite3.Connection,
    items: list[dict],
    user_id: str | None = None,
    today: date | None = None,
) -> dict:
    """Book items {product_id, batch_id (None = FEFO), packages, action out|open, open (extra
    packages to open after taking)}. The caller's transaction makes it all or nothing.

    Returns {bookings: [{product_id, name, packages, action}], out_ids, open_ids} for `undo_cooked`."""
    out_ids, open_ids, bookings = [], [], []
    for it in items:
        pid, batch, n, extra = (
            it["product_id"],
            it.get("batch_id"),
            it["packages"],
            it.get("open", 0),
        )
        name = conn.execute("SELECT name FROM product WHERE id = ?", (pid,)).fetchone()
        if name is None:
            raise InventoryError("not_found")
        if it["action"] == "open":
            open_ids += [_open(conn, pid, batch, today, user_id) for _ in range(n)]
            bookings.append({"product_id": pid, "name": name[0], "packages": n, "action": "open"})
            continue
        if it["action"] != "out":
            raise InventoryError("invalid_value")
        if n:
            taken = book_out(conn, pid, n, batch, None, SOURCE, user_id)
            out_ids += [t["booking_id"] for t in taken]
            bookings.append({"product_id": pid, "name": name[0], "packages": n, "action": "out"})
        if extra:
            open_ids += [_open(conn, pid, None, today, user_id) for _ in range(extra)]
            bookings.append(
                {"product_id": pid, "name": name[0], "packages": extra, "action": "open"}
            )
    return {"bookings": bookings, "out_ids": out_ids, "open_ids": open_ids}


def undo_cooked(
    conn: sqlite3.Connection, out_ids: list[int], open_ids: list[int], user_id: str | None = None
) -> None:
    """Reverse `book_cooked` (openings first: they were booked last)."""
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
                {k: c[k] for k in ("product_id", "batch_id", "packages", "action", "open")}
            )
    return book_cooked(conn, items, user_id, today) | {"recipe_id": row["id"]}
