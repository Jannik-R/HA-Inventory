"""Recipes: ingredients keyed on category nodes, availability against the stock."""

from __future__ import annotations

import json
import sqlite3

from .amounts import _demand, _have, _stock_amount, _stock_by_category, _units, egg_part
from .common import InventoryError, _exists
from .diet import diet_index, recipe_diet
from .inherit import _categories, _resolve, children, defaults, food_named, is_food
from .inherit import subtree as _subtree  # alias: other modules import it from here
from .learned import learn
from .master import save
from .products import add_product
from .steps import MAX_STEPS, timers


def _with_new_type(conn: sqlite3.Connection, ing: dict) -> dict:
    """An ingredient whose new_type {name, parent_id} (proposed by the AI check) becomes a product
    type below that parent; one that exists already (any food category of that name) is used."""
    new = ing.get("new_type")
    if not new or ing.get("category_id") is not None:
        return ing
    _exists(conn, "category", new["parent_id"])
    if not is_food(conn, new["parent_id"]):
        raise InventoryError("not_food")
    cid = food_named(conn, new["name"].strip()) or save(
        conn, "category", {"name": new["name"], "parent_id": new["parent_id"]}
    )
    return {**ing, "category_id": cid}


def save_recipe(conn: sqlite3.Connection, data: dict) -> int:
    """Insert / update a recipe; its ingredients are replaced by `data["ingredients"]` (in order).

    `steps` ([{text, section}]) replace the recipe's steps and its old instructions text.
    """
    data = dict(data)
    ingredients = data.pop("ingredients")
    steps = data.pop("steps", None)
    if steps is not None:
        data["instructions"] = None  # the editor turned the old text into steps
    if new_product := data.pop("canning_product", None):  # a canning recipe's new product
        data["canning_product_id"] = add_product(conn, new_product)
    _exists(conn, "product", data.get("canning_product_id"))
    recipe_id = save(conn, "recipe", data)
    ingredients = [_with_new_type(conn, ing) for ing in ingredients]
    names = {r["id"]: r["name"] for r in conn.execute("SELECT id, name FROM category")}
    cats = _categories(conn)
    # optional ingredients chosen for the shopping list survive the re-insert (matched by text)
    # shortcut: renaming such an ingredient loses the choice; upgrade = keep ingredient ids on save
    chosen = {
        r["text"]
        for r in conn.execute(
            "SELECT i.text FROM shopping_recipe_optional o"
            " JOIN recipe_ingredient i ON i.id = o.ingredient_id WHERE o.recipe_id = ?",
            (recipe_id,),
        )
    }
    conn.execute("DELETE FROM recipe_ingredient WHERE recipe_id = ?", (recipe_id,))
    try:
        for ing in ingredients:
            cid = ing.get("category_id")
            if cid is not None and cid not in names:
                raise InventoryError("not_found")
            if cid is not None and _resolve(cats, None, cid, {})["food"]["value"] == 0:
                raise InventoryError("not_food")
            # text is a name snapshot: the category's name; typed only for unmatched ingredients
            text = names[cid] if cid is not None else (ing.get("text") or "").strip()
            note = (ing.get("note") or "").strip()[:200] or None
            if not text:
                raise InventoryError("invalid_value")
            if cid is not None and (source := ing.get("source_text")):
                learn(conn, "ingredient", source, cid)  # an imported line: remember the choice
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
        if chosen:
            conn.execute(
                "INSERT INTO shopping_recipe_optional (recipe_id, ingredient_id)"
                " SELECT recipe_id, id FROM recipe_ingredient WHERE recipe_id = ? AND optional = 1"
                " AND text IN (SELECT value FROM json_each(?))",
                (recipe_id, json.dumps(sorted(chosen))),
            )
        if steps is not None:
            _save_steps(conn, recipe_id, steps)
    except sqlite3.IntegrityError as err:
        raise InventoryError("not_found" if "FOREIGN" in str(err) else "invalid_value") from err
    return recipe_id


def _save_steps(conn: sqlite3.Connection, recipe_id: int, steps: list[dict]) -> None:
    if len(steps) > MAX_STEPS:
        raise InventoryError("invalid_value")
    conn.execute("DELETE FROM recipe_step WHERE recipe_id = ?", (recipe_id,))
    conn.executemany(
        "INSERT INTO recipe_step (recipe_id, pos, section, text) VALUES (?, ?, ?, ?)",
        [
            (
                recipe_id,
                pos,
                (s.get("section") or "").strip() or None,
                (s.get("text") or "").strip(),
            )
            for pos, s in enumerate(steps)
        ],
    )


def _steps(conn: sqlite3.Connection) -> dict[int, list[dict]]:
    """Steps per recipe with the timers read from their text."""
    out: dict[int, list[dict]] = {}
    for r in conn.execute(
        "SELECT recipe_id, section, text FROM recipe_step ORDER BY recipe_id, pos"
    ):
        out.setdefault(r["recipe_id"], []).append(
            {"section": r["section"], "text": r["text"], "timers": timers(r["text"])}
        )
    return out


def _ctx(conn: sqlite3.Connection) -> tuple:
    cats = _categories(conn)
    return cats, _units(conn), _stock_by_category(conn), children(cats), defaults(conn)


def _availability(ctx: tuple, ingredients: list[dict], factor: float) -> list[dict]:
    cats, units, stock, kids, dflt = ctx
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
        amount, unit_id = _stock_amount(units, cats, dflt, cid, ing["amount"], ing["unit_id"])
        if amount is None:
            out.append({
                **ing,
                "status": "available" if products else "missing",
                "packages": sum(p["packages"] for p in products),
            })  # fmt: skip
            continue
        have, unknown = _have(units, products, unit_id)
        need = round(amount * factor, 6)
        if egg_part(ing["note"]) and units[unit_id]["is_count"]:
            # a yolk / white row needs the recipe's eggs as a whole (whole eggs + max(yolks, whites))
            group = [
                {**i, "amount": a * factor, "unit_id": u}
                for i in ingredients
                if i["category_id"] == cid
                and not i["skip_stock"]
                and i["optional"] == ing["optional"]
                for a, u in [_stock_amount(units, cats, dflt, cid, i["amount"], i["unit_id"])]
                if u == unit_id
            ]
            need = _demand(units, unit_id, group)
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
    out, ctx, steps = [], _ctx(conn), _steps(conn)
    value = diet_index(conn) if getattr(conn, "diet", True) else None
    # shortcut: instructions travel with the list; split into a detail call if the list gets slow
    for r in map(
        dict,
        conn.execute(
            "SELECT r.*, s.servings AS shopping_servings, p.name AS canning_product FROM recipe r"
            " LEFT JOIN shopping_recipe s ON s.recipe_id = r.id"
            " LEFT JOIN product p ON p.id = r.canning_product_id"
        ),
    ):
        ingredients = _availability(ctx, _ingredients(conn, r["id"]), 1.0)
        required = [i for i in ingredients if not i["optional"] and not i["skip_stock"]]
        r["ingredients"] = ingredients
        r["steps"] = steps.get(r["id"], [])
        if value:
            r["diet"] = recipe_diet(value, ingredients)
        r["summary"] = {
            "available": sum(i["status"] == "available" for i in required),
            "total": len(required),
        }
        out.append(r)
    return sorted(out, key=lambda r: r["name"].casefold())
