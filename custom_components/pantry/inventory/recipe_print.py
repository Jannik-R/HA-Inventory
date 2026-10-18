"""A recipe as plain data for printing (receipt printer): scaled amounts, names, steps."""

from __future__ import annotations

import sqlite3

from .common import InventoryError


def recipe_sheet(conn: sqlite3.Connection, recipe_id: int, servings: int | None = None) -> dict:
    """{name, servings, canning, ingredients: [{amount, unit, name, note, optional}], steps,
    instructions}; amounts scaled to `servings` (default: the recipe's own)."""
    r = conn.execute("SELECT * FROM recipe WHERE id = ?", (recipe_id,)).fetchone()
    if r is None:
        raise InventoryError("not_found")
    servings = servings or r["servings"]
    factor = servings / r["servings"]
    units = {u["id"]: u["symbol"] or u["name"] for u in conn.execute("SELECT * FROM unit")}
    names = {c["id"]: c["name"] for c in conn.execute("SELECT id, name FROM category")}
    rows = conn.execute(
        "SELECT * FROM recipe_ingredient WHERE recipe_id = ? ORDER BY id", (recipe_id,)
    )
    return {
        "name": r["name"],
        "servings": servings,
        "canning": r["canning_product_id"] is not None,
        "ingredients": [
            {
                "amount": round(i["amount"] * factor, 2) if i["amount"] is not None else None,
                "unit": units.get(i["unit_id"]),
                "name": names.get(i["category_id"]) or i["text"],
                "note": i["note"],
                "optional": bool(i["optional"]),
            }
            for i in rows
        ],
        "steps": [
            dict(s)
            for s in conn.execute(
                "SELECT section, text FROM recipe_step WHERE recipe_id = ? ORDER BY pos",
                (recipe_id,),
            )
        ],
        "instructions": r["instructions"],
    }
