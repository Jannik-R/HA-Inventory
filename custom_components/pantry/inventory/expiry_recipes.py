"""Recipe suggestions for expiring stock: recipes ranked by how many ingredients they use up."""

from __future__ import annotations

import sqlite3
from datetime import date

from .inherit import _categories, children, is_food
from .queries import expiring
from .recipes import _subtree, recipes


def expiring_recipes(conn: sqlite3.Connection, today: date, days: int | None = None) -> list[dict]:
    """Recipes using expiring (or expired) food, same threshold as `expiring` (`days` overrides).

    An ingredient is used up when an expiring product sits in its category subtree (the match of
    recipe availability); optional and skipped ingredients and non-food stock never count. Ranked
    by used-up ingredients, then by how many required ingredients are in stock, then by name.
    """
    cats = _categories(conn)
    kids = children(cats)
    food = {}  # category id -> is_food, one lookup per category
    names: dict[int, set[str]] = {}  # expiring food category -> product names
    for r in expiring(conn, today, days):
        cid = r["category_id"]
        if r["packages"] > 0 and food.setdefault(cid, is_food(conn, cid)):
            names.setdefault(cid, set()).add(r["name"])
    out = []
    for rec in recipes(conn):
        used, products = 0, set()
        for ing in rec["ingredients"]:
            if ing["optional"] or ing["skip_stock"] or ing["category_id"] not in cats:
                continue
            hit = [n for c in _subtree(kids, ing["category_id"]) for n in names.get(c, ())]
            used += bool(hit)
            products.update(hit)
        if used:
            out.append(
                {
                    "recipe_id": rec["id"],
                    "name": rec["name"],
                    "used": used,
                    "products": sorted(products, key=str.casefold),
                    **rec["summary"],
                }
            )
    return sorted(
        out, key=lambda r: (-r["used"], -r["available"] / max(r["total"], 1), r["name"].casefold())
    )
