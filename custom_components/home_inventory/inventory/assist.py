"""Read-only views for AI tools (LLM API): names instead of ids, only the fields an assistant needs
(fewer tokens). Pure, no HA."""

from __future__ import annotations

import sqlite3
from datetime import date, timedelta

from .codes import recipe_by_name
from .meal_plan import MEALS, meals
from .queries import expiring, stock_list
from .recipe_print import recipe_sheet
from .recipes import recipe_availability, recipes

MAX_ROWS = 200  # per answer; a household has fewer, a runaway search stays bounded


def _stock_row(r: dict) -> dict:
    return {
        "name": r["name"],
        "brand": r["brand"],
        "category": " > ".join(r["category_path"]),
        "packages": r["packages"],
        "location": r["location"],
        "expires_on": r["expires_on"],
        "opened": r["opened_on"] is not None,
    }


def stock(conn: sqlite3.Connection, search: str | None = None) -> list[dict]:
    """Stock per batch and location; `search` matches name, brand, EAN, location and category."""
    return [_stock_row(r) for r in stock_list(conn, search or None)][:MAX_ROWS]


def expiring_stock(conn: sqlite3.Connection, today: date, days: int | None = None) -> list[dict]:
    return [
        {**_stock_row(r), "days_left": r["days_left"], "status": r["status"]}
        for r in expiring(conn, today, days)
    ][:MAX_ROWS]


def _diet(r: dict) -> dict:
    """Diet fields of a recipe row (none while the module diet is off)."""
    d = r.get("diet")
    return (
        {
            "diet": d["diet"],
            "allergens_known": d["allergens_known"],
            "contains_allergens": d["contains"],
        }
        if d
        else {}
    )


def recipe_list(conn: sqlite3.Connection, search: str | None = None) -> list[dict]:
    """Recipes by name with how many required ingredients are in stock."""
    needle = (search or "").strip().casefold()
    return [
        {
            "name": r["name"],
            "servings": r["servings"],
            "canning": r["canning_product_id"] is not None,
            "ingredients_in_stock": r["summary"]["available"],
            "ingredients_required": r["summary"]["total"],
            "on_shopping_list": r["shopping_servings"] is not None,
            **_diet(r),
        }
        for r in recipes(conn)
        if needle in r["name"].casefold()
    ][:MAX_ROWS]


def recipe(conn: sqlite3.Connection, name: str, servings: int | None = None) -> dict:
    """One recipe by name: scaled ingredients with their stock status, steps."""
    recipe_id = recipe_by_name(conn, name)
    sheet = recipe_sheet(conn, recipe_id, servings)
    status = recipe_availability(conn, recipe_id, sheet["servings"])
    for ing, avail in zip(sheet["ingredients"], status, strict=True):
        ing["stock"] = avail["status"]
    return sheet


def meal_plan(conn: sqlite3.Connection, start: date, days: int) -> list[dict]:
    end = start + timedelta(days=days)
    return [
        {"day": m["day"], "meal": MEALS[m["slot"]], "dish": m["name"], "servings": m["servings"]}
        for m in meals(conn, start.isoformat(), end.isoformat())
    ][:MAX_ROWS]
