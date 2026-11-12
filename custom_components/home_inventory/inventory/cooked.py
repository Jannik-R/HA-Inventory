"""Cooked: book out what a recipe used. A proposal per ingredient (product, batch, packages, open
or out) the user can change, then one transaction books the checked rows (`cooked_book.py`).

The ingredients are planned in recipe order on the real tables inside a SAVEPOINT that is always
rolled back: every row that is checked by default is really booked there (with `book_cooked`), so
the next row is planned on what is left and the proposal books as returned. Frozen batches count
as stock for "out", not for opening.

shortcut: a row the user changes in the dialog (other product, checked optional row) is not
re-planned against the others; the backend still validates in one transaction, an overlap fails it.
"""

from __future__ import annotations

import sqlite3
from datetime import date

from .amounts import _amount, _stock_amount
from .codes import _recipe
from .common import InventoryError
from .cooked_book import _batches, _parts, book_cooked
from .recipes import _ctx, _ingredients, _subtree

_ITEM = ("product_id", "batch_id", "packages", "action", "open", "remaining", "used_up")


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


def _item(row: dict) -> dict:
    """The `book_cooked` item of a proposal row (its chosen product's candidate)."""
    c = next(c for c in row["candidates"] if c["product_id"] == row["product_id"])
    return {k: c[k] for k in _ITEM}


def cooked_proposal(conn: sqlite3.Connection, recipe_id: int, servings: int) -> list[dict]:
    """Per ingredient with stock: candidates (products of its category's subtree) and the default
    pick. Left out: skip_stock, no category, nothing in stock."""
    row = conn.execute("SELECT servings FROM recipe WHERE id = ?", (recipe_id,)).fetchone()
    if row is None:
        raise InventoryError("not_found")
    factor = servings / row["servings"]
    cats, units, stock, kids, dflt = _ctx(conn)
    real = {r[0] for r in conn.execute("SELECT id FROM batch")}  # ids that survive the rollback
    rows = []
    conn.execute("SAVEPOINT cooked_plan")
    try:
        for ing in _ingredients(conn, recipe_id):
            cid = ing["category_id"]
            if ing["skip_stock"] or cid not in cats:
                continue
            amount, unit_id = _stock_amount(units, cats, dflt, cid, ing["amount"], ing["unit_id"])
            need = None if amount is None else round(amount * factor, 6)
            cands = []
            for p in (p for c in _subtree(kids, cid) for p in stock.get(c, []) if p["packages"]):
                batches = _batches(conn, p["id"])  # what is left after the rows before
                if not batches:
                    continue
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
            # a batch made inside the savepoint is gone afterwards: FEFO / n-th part
            for c in cands:
                c["batch_id"] = c["batch_id"] if c["batch_id"] in real else None
                c["batches"] = [b for b in c["batches"] if b["batch_id"] in real]
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
            if rows[-1]["checked"]:  # book it for real here, the next row sees the rest
                conn.execute("SAVEPOINT cooked_row")
                try:
                    book_cooked(conn, [_item(rows[-1])])
                except InventoryError:
                    conn.execute("ROLLBACK TO cooked_row")
                    rows[-1]["checked"] = False
                conn.execute("RELEASE cooked_row")
    finally:
        conn.execute("ROLLBACK TO cooked_plan")
        conn.execute("RELEASE cooked_plan")
    return rows


def cooked_by_name(
    conn: sqlite3.Connection,
    recipe: str,
    servings: int | None,
    user_id: str | None = None,
    today: date | None = None,
) -> dict:
    """Service: book the default proposal (checked rows) of a recipe, by name."""
    row = _recipe(conn, recipe)
    items = [
        _item(r)
        for r in cooked_proposal(conn, row["id"], servings or row["servings"])
        if r["checked"]
    ]
    return book_cooked(conn, items, user_id, today) | {"recipe_id": row["id"]}
