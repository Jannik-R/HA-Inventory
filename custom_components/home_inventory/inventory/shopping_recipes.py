"""Recipes on the shopping list: what the chosen recipes need beyond the stock."""

from __future__ import annotations

import math
import sqlite3

from .amounts import _convert, _demand, _have, _stock_amount
from .common import InventoryError
from .inherit import defaults
from .recipes import _subtree


def set_shopping_recipe(
    conn: sqlite3.Connection, recipe_id: int, servings: int, optional: tuple[int, ...] | list = ()
) -> None:
    """Put a recipe on the list (or change its servings); `optional` are the optional
    ingredients to shop for as well (replaces the earlier choice)."""
    if not conn.execute("SELECT 1 FROM recipe WHERE id = ?", (recipe_id,)).fetchone():
        raise InventoryError("not_found")
    valid = {
        r[0]
        for r in conn.execute(
            "SELECT id FROM recipe_ingredient WHERE recipe_id = ? AND optional = 1", (recipe_id,)
        )
    }
    if not set(optional) <= valid:
        raise InventoryError("invalid_value")
    try:
        conn.execute(
            "INSERT INTO shopping_recipe (recipe_id, servings) VALUES (?, ?)"
            " ON CONFLICT(recipe_id) DO UPDATE SET servings = excluded.servings",
            (recipe_id, servings),
        )
    except sqlite3.IntegrityError as err:
        raise InventoryError("not_found" if "FOREIGN" in str(err) else "invalid_value") from err
    conn.execute("DELETE FROM shopping_recipe_optional WHERE recipe_id = ?", (recipe_id,))
    conn.executemany(
        "INSERT INTO shopping_recipe_optional (recipe_id, ingredient_id) VALUES (?, ?)",
        [(recipe_id, i) for i in set(optional)],
    )


def remove_shopping_recipe(conn: sqlite3.Connection, recipe_id: int) -> None:
    if not conn.execute("DELETE FROM shopping_recipe WHERE recipe_id = ?", (recipe_id,)).rowcount:
        raise InventoryError("not_found")


def shopping_recipes(conn: sqlite3.Connection) -> list[dict]:
    rows = conn.execute(
        "SELECT s.recipe_id, r.name, s.servings FROM shopping_recipe s"
        " JOIN recipe r ON r.id = s.recipe_id"
    )
    out = [
        {
            **r,
            "optional": [
                o[0]
                for o in conn.execute(
                    "SELECT ingredient_id FROM shopping_recipe_optional"
                    " WHERE recipe_id = ? ORDER BY ingredient_id",
                    (r["recipe_id"],),
                )
            ],
        }
        for r in map(dict, rows)
    ]
    out.sort(key=lambda r: r["name"].casefold())
    for no, r in enumerate(out, 1):
        r["no"] = no  # short reference on the list items ("1: 300 g")
    return out


def _written(units: dict, rows: list[dict]) -> tuple[float, int] | None:
    """The rows' need as written in the recipes, in a unit fit for shopping where there is one:
    a recipe-only unit becomes its base (2 EL -> 30 ml), one without a base stays as written
    (3 Scheiben: an estimate beats no amount); None when a row has no amount or units differ."""

    def shop_unit(unit_id: int | None) -> int | None:
        if unit_id is None or not units[unit_id]["recipe_only"]:
            return unit_id
        return units[unit_id]["base_unit_id"] or unit_id

    target = shop_unit(rows[0]["recipe_unit"])
    if target is None or any(shop_unit(r["recipe_unit"]) is None for r in rows):
        return None
    parts = [_convert(units, r["recipe_amount"], r["recipe_unit"], target) for r in rows]
    return None if None in parts else (round(sum(parts), 6), target)


def _use(units: dict, unit_id: int | None, no: int, rows: list[dict]) -> dict:
    """One recipe's need: in the group's unit, or for "any" items as in `_written`."""
    if unit_id:
        amount, symbol = _demand(units, unit_id, rows), units[unit_id]["symbol"]
    elif w := _written(units, rows):
        amount, symbol = w[0], units[w[1]]["symbol"]
    else:
        amount = symbol = None
    return {"no": no, "name": rows[0]["name"], "amount": amount, "unit_symbol": symbol}


def _as_written(units: dict, rows: list[dict]) -> dict | None:
    """For an "any" item (nothing in stock): the whole need of the recipes (capers counted in
    pieces: "30 ml" for 2 EL), see `_written`."""
    if not (w := _written(units, rows)):
        return None
    missing = math.ceil(w[0]) if units[w[1]]["is_count"] else w[0]  # 0.3 Bund -> 1
    return {"missing": missing, "unit_id": w[1], "unit_symbol": units[w[1]]["symbol"],
            "unknown_products": 0}  # fmt: skip


def _by_recipe(rows: list[dict]) -> dict[int, list[dict]]:
    out: dict[int, list[dict]] = {}
    for r in rows:
        out.setdefault(r["recipe_id"], []).append(r)
    return out


def _uses(
    units: dict, unit_id: int | None, rows: list[dict], numbers: dict, anyrows: list[dict]
) -> list[dict]:
    """Per recipe (ordered by number): number, name, amount and unit symbol. `anyrows` are the
    rows without amount dropped from this category: their recipes still show as refs."""
    by_recipe = _by_recipe(rows)
    uses = [_use(units, unit_id, numbers[rid], rs) for rid, rs in by_recipe.items()]
    uses += [
        _use(units, None, numbers[rid], rs)
        for rid, rs in _by_recipe(anyrows).items()
        if rid not in by_recipe
    ]
    return sorted(uses, key=lambda u: u["no"])


def recipe_items(conn: sqlite3.Connection, cats: dict, units: dict, stock: dict, kids: dict):
    """One shopping item per category and unit: demand of all listed recipes minus the stock.

    shortcut: recipe demand and min stock are independent (no reservation), and categories
    are flat: overlapping ones (Nudeln vs Spaghetti) are not netted; upgrade = the min stock
    bottom-up formula with the subtree's demand as the minimum.
    """
    rows = conn.execute(
        "SELECT i.category_id, i.amount, i.unit_id, i.note, r.id AS recipe_id, r.name,"
        " i.amount * s.servings / r.servings AS need FROM shopping_recipe s"
        " JOIN recipe r ON r.id = s.recipe_id JOIN recipe_ingredient i ON i.recipe_id = r.id"
        " WHERE i.skip_stock = 0 AND (i.optional = 0 OR i.id IN"
        " (SELECT ingredient_id FROM shopping_recipe_optional WHERE recipe_id = r.id))"
        " ORDER BY r.id, i.id"
    )
    numbers = {r["recipe_id"]: r["no"] for r in shopping_recipes(conn)}
    dflt = defaults(conn)
    by_cat: dict[int, list[dict]] = {}
    for r in map(dict, rows):
        if r["category_id"] in cats:
            r["recipe_amount"], r["recipe_unit"] = r.pop("need"), r["unit_id"]
            r["amount"], r["unit_id"] = _stock_amount(
                units, cats, dflt, r["category_id"], r["recipe_amount"], r["unit_id"]
            )
            by_cat.setdefault(r["category_id"], []).append(r)
    items = []
    for cid, ings in by_cat.items():
        # groups of convertible units, keyed by the base unit (stable whatever the row order);
        # None = no amount
        groups: dict[int | None, list[dict]] = {}
        for r in ings:
            u = units[r["unit_id"]] if r["unit_id"] else None
            groups.setdefault(u and (u["base_unit_id"] or u["id"]), []).append(r)
        anyrows = groups.pop(None, []) if len(groups) > 1 else []  # covered by "2 Bund parsley"
        products = [p for c in _subtree(kids, cid) for p in stock.get(c, []) if p["packages"]]
        for base, rs in groups.items():
            unit_id = rs[0]["unit_id"]  # shown in the first row's unit (1 l, not 1000 ml)
            if base is None:
                if products:
                    continue
                amount = _as_written(units, rs)
                packages = None if amount else 1  # "Salz" without amount: one package
            else:
                packages = None
                have, unknown = _have(units, products, unit_id)
                missing = round(max(0.0, _demand(units, unit_id, rs) - have), 6)
                if units[unit_id]["is_count"]:
                    missing = math.ceil(missing)
                if not missing:
                    continue
                amount = {
                    "missing": missing,
                    "unit_id": unit_id,
                    "unit_symbol": units[unit_id]["symbol"],
                    "unknown_products": unknown,
                }
            items.append({
                "id": None,
                "manual": False,
                "product_id": None,
                "brand": None,
                "category_id": cid,
                "name": cats[cid]["name"],
                "amount": amount,
                "packages": packages,
                "any_of_subtree": False,
                "recipes": _uses(units, unit_id, rs, numbers, anyrows),
                "key": f"r{cid}-{base or ''}",  # base unit: the same whatever the row order
            })  # fmt: skip
    return items
