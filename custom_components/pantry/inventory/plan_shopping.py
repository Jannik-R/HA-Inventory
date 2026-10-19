"""Shopping list from the meal plan: the recipes planned in a date range go on the list."""

from __future__ import annotations

import sqlite3
from datetime import date

from .common import InventoryError
from .shopping_recipes import set_shopping_recipe

MAX_DAYS = 366


def plan_to_shopping_list(conn: sqlite3.Connection, start: date, end: date) -> dict:
    """Put the recipes planned from `start` to `end` (both included) on the shopping list.

    Servings per recipe = sum over its planned meals; a recipe already on the list keeps
    the larger servings (so running it twice changes nothing) and its optional choices.
    Free-text meals have no ingredients and are only counted in `skipped`.
    shortcut: no consumption forecast (planned dishes only); upgrade = rate from `booking`.
    """
    if end < start or (end - start).days >= MAX_DAYS:
        raise InventoryError("invalid_value")
    rows = conn.execute(
        "SELECT m.recipe_id, r.name, SUM(m.servings) AS planned, COALESCE(s.servings, 0) AS listed"
        " FROM meal_plan m JOIN recipe r ON r.id = m.recipe_id"
        " LEFT JOIN shopping_recipe s ON s.recipe_id = m.recipe_id"
        " WHERE m.day BETWEEN ? AND ? GROUP BY m.recipe_id ORDER BY r.name COLLATE NOCASE",
        (start.isoformat(), end.isoformat()),
    ).fetchall()
    for r in rows:
        keep = conn.execute(
            "SELECT ingredient_id FROM shopping_recipe_optional WHERE recipe_id = ?",
            (r["recipe_id"],),
        )
        set_shopping_recipe(
            conn, r["recipe_id"], max(r["planned"], r["listed"]), [k[0] for k in keep]
        )
    skipped = conn.execute(
        "SELECT COUNT(*) FROM meal_plan WHERE day BETWEEN ? AND ? AND recipe_id IS NULL",
        (start.isoformat(), end.isoformat()),
    ).fetchone()[0]
    return {
        "recipes": [
            {
                "recipe_id": r["recipe_id"],
                "name": r["name"],
                "servings": max(r["planned"], r["listed"]),
            }
            for r in rows
        ],
        "skipped": skipped,
    }
