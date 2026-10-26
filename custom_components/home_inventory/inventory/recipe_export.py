"""Recipes as schema.org Recipe JSON-LD (download); our own import reads it back."""

from __future__ import annotations

import sqlite3

from .recipe_print import recipe_sheet


def _line(i: dict) -> str:
    amount = f"{i['amount']:g}" if i["amount"] is not None else ""
    what = " ".join(p for p in (amount, i["unit"] if amount else "", i["name"]) if p)
    # shortcut: schema.org has no optional flag, so it is not exported; upgrade = a language marker
    return f"{what} ({i['note']})" if i["note"] else what


def _instructions(steps: list[dict], legacy: str | None) -> list[dict]:
    """HowToStep list; a step with a section starts a HowToSection that takes the steps after it."""
    out: list[dict] = []
    for s in steps:
        step = {"@type": "HowToStep", "text": s["text"]}
        if s["section"]:
            out.append({"@type": "HowToSection", "name": s["section"], "itemListElement": [step]})
        elif out and out[-1]["@type"] == "HowToSection":
            out[-1]["itemListElement"].append(step)
        else:
            out.append(step)
    if not steps:  # a recipe saved before steps existed
        out = [{"@type": "HowToStep", "text": p} for p in (legacy or "").splitlines() if p.strip()]
    return out


def recipe_jsonld(conn: sqlite3.Connection, recipe_id: int) -> dict:
    sheet = recipe_sheet(conn, recipe_id)
    r = conn.execute(
        "SELECT source_url, image_url FROM recipe WHERE id = ?", (recipe_id,)
    ).fetchone()
    data = {
        "@context": "https://schema.org",
        "@type": "Recipe",
        "name": sheet["name"],
        "recipeYield": str(sheet["servings"]),
        "recipeIngredient": [_line(i) for i in sheet["ingredients"]],
        "recipeInstructions": _instructions(sheet["steps"], sheet["instructions"]),
        "image": r["image_url"],
        "isBasedOn": r["source_url"],
    }
    return {k: v for k, v in data.items() if v}


def recipes_jsonld(conn: sqlite3.Connection) -> list[dict]:
    """All recipes except canning / drying protocols (jars, not servings)."""
    rows = conn.execute("SELECT id FROM recipe WHERE canning_product_id IS NULL ORDER BY name")
    return [recipe_jsonld(conn, r["id"]) for r in rows.fetchall()]
