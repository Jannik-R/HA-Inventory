"""Recipes: ingredients keyed on category nodes, availability against the stock."""

from __future__ import annotations

import sqlite3

from .amounts import _amount, _stock_by_category, _units
from .common import InventoryError
from .inherit import _categories, children
from .master import save


def save_recipe(conn: sqlite3.Connection, data: dict) -> int:
    """Insert / update a recipe; its ingredients are replaced by `data["ingredients"]` (in order)."""
    data = dict(data)
    ingredients = data.pop("ingredients")
    recipe_id = save(conn, "recipe", data)
    names = {r["id"]: r["name"] for r in conn.execute("SELECT id, name FROM category")}
    conn.execute("DELETE FROM recipe_ingredient WHERE recipe_id = ?", (recipe_id,))
    try:
        for ing in ingredients:
            cid = ing.get("category_id")
            if cid is not None and cid not in names:
                raise InventoryError("not_found")
            # text is a name snapshot: the category's name; typed only for unmatched ingredients
            text = names[cid] if cid is not None else (ing.get("text") or "").strip()
            note = (ing.get("note") or "").strip()[:200] or None
            if not text:
                raise InventoryError("invalid_value")
            conn.execute(
                "INSERT INTO recipe_ingredient"
                " (recipe_id, category_id, amount, unit_id, text, note, optional, skip_stock)"
                " VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                (
                    recipe_id,
                    ing.get("category_id"),
                    ing.get("amount"),
                    ing.get("unit_id"),
                    text,
                    note,
                    int(bool(ing.get("optional"))),
                    int(bool(ing.get("skip_stock"))),
                ),
            )
    except sqlite3.IntegrityError as err:
        raise InventoryError("not_found" if "FOREIGN" in str(err) else "invalid_value") from err
    return recipe_id


def _subtree(kids: dict, category_id: int) -> set[int]:
    """The node and all its descendants."""
    out, todo = set(), [category_id]
    while todo:
        cid = todo.pop()
        out.add(cid)
        todo += kids.get(cid, [])
    return out


def _ctx(conn: sqlite3.Connection) -> tuple:
    cats = _categories(conn)
    return cats, _units(conn), _stock_by_category(conn), children(cats)


def _availability(ctx: tuple, ingredients: list[dict], factor: float) -> list[dict]:
    cats, units, stock, kids = ctx
    out = []
    for ing in ingredients:
        cid = ing["category_id"]
        if ing["skip_stock"]:  # e.g. salt, water: never checked against the stock
            out.append({**ing, "status": "skipped"})
            continue
        if cid is None or cid not in cats:
            out.append({**ing, "status": "unmatched"})
            continue
        products = [p for c in _subtree(kids, cid) for p in stock.get(c, []) if p["packages"]]
        if ing["amount"] is None:
            out.append({
                **ing,
                "status": "available" if products else "missing",
                "packages": sum(p["packages"] for p in products),
            })  # fmt: skip
            continue
        unit_id = ing["unit_id"]
        have_each = [
            _amount(units, p["packages"], p["content_amount"], p["content_unit_id"], unit_id)
            for p in products
        ]
        have = round(sum(h for h in have_each if h is not None), 6)  # float noise from g <-> kg
        unknown = have_each.count(None)
        need = round(ing["amount"] * factor, 6)
        if have >= need:
            status = "available"
        elif have > 0:
            status = "partial"
        else:
            status = "unknown" if unknown else "missing"
        out.append({
            **ing,
            "status": status,
            "need": need,
            "have": have,
            "missing": round(max(0.0, need - have), 6),
            "unit_symbol": units[unit_id]["symbol"],
            "unknown_products": unknown,
        })  # fmt: skip
    return out


def _ingredients(conn: sqlite3.Connection, recipe_id: int) -> list[dict]:
    rows = conn.execute(
        "SELECT * FROM recipe_ingredient WHERE recipe_id = ? ORDER BY id", (recipe_id,)
    )
    return [
        {**r, "optional": bool(r["optional"]), "skip_stock": bool(r["skip_stock"])}
        for r in map(dict, rows)
    ]


def recipe_availability(conn: sqlite3.Connection, recipe_id: int, servings: int) -> list[dict]:
    """The recipe's ingredients with availability for `servings`."""
    row = conn.execute("SELECT servings FROM recipe WHERE id = ?", (recipe_id,)).fetchone()
    if row is None:
        raise InventoryError("not_found")
    return _availability(_ctx(conn), _ingredients(conn, recipe_id), servings / row["servings"])


def recipes(conn: sqlite3.Connection) -> list[dict]:
    """All recipes by name with ingredients, availability at their own servings and a summary
    (available / total over the ingredients that are neither optional nor skipped)."""
    out, ctx = [], _ctx(conn)
    # shortcut: instructions travel with the list; split into a detail call if the list gets slow
    for r in map(dict, conn.execute("SELECT * FROM recipe")):
        ingredients = _availability(ctx, _ingredients(conn, r["id"]), 1.0)
        required = [i for i in ingredients if not i["optional"] and not i["skip_stock"]]
        r["ingredients"] = ingredients
        r["summary"] = {
            "available": sum(i["status"] == "available" for i in required),
            "total": len(required),
        }
        out.append(r)
    return sorted(out, key=lambda r: r["name"].casefold())
