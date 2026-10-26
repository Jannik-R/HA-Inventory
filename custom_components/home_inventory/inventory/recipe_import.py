"""Recipe import: schema.org Recipe from a page's JSON-LD -> an unsaved recipe draft. Pure, no I/O."""

from __future__ import annotations

import html
import json
import re
import sqlite3
from collections.abc import Iterator

from ..seed_en import seeded
from .common import InventoryError
from .ingredient_line import parse_ingredient, unit_lookup
from .inherit import is_food
from .learned import learned
from .steps import import_steps
from .suggest import suggest, suggest_type

_LD_TYPE = re.compile(r"type\s*=\s*[\"']?application/ld\+json")
# `[^<>]`: a page full of "<" stays linear (`[^>]+` rescans to the end from every "<")
_TAGS = re.compile(r"<[^<>]+>")
_AND = re.compile(r"\s+(?:und|&)\s+")


def _walk(node: object) -> Iterator[dict]:
    if isinstance(node, dict):
        yield node
        node = list(node.values())
    if isinstance(node, list):
        for child in node:
            yield from _walk(child)


def _is_recipe(node: dict) -> bool:
    kind = node.get("@type")
    return kind == "Recipe" or (isinstance(kind, list) and "Recipe" in kind)


def _ld_blocks(page: str) -> Iterator[str]:
    """Contents of the <script type="application/ld+json"> tags, in one pass over the page
    (a regex with a lazy body backtracks quadratically on hostile pages)."""
    low, pos = page.lower(), 0
    while (start := low.find("<script", pos)) != -1:
        open_end = low.find(">", start)
        close = low.find("</script", open_end)
        if open_end == -1 or close == -1:
            return
        if _LD_TYPE.search(low, start, open_end):
            yield page[open_end + 1 : close]
        pos = close


def extract_recipe(page: str) -> dict | None:
    """The first schema.org Recipe object in the page's JSON-LD blocks."""
    for block in _ld_blocks(page):
        try:
            data = json.loads(block, strict=False)
            found = next((n for n in _walk(data) if _is_recipe(n)), None)
        except (ValueError, RecursionError):  # broken or absurdly nested JSON-LD
            continue
        if found:
            ref = (found.get("image") or {}) if isinstance(found.get("image"), dict) else {}
            if "url" not in ref and isinstance(ref.get("@id"), str):  # Chefkoch: image by @id
                nodes = {n.get("@id"): n for n in _walk(data) if len(n) > 1}
                found = {**found, "image": nodes.get(ref["@id"])}
            return found
    return None


def _text(value: object) -> str:
    return " ".join(html.unescape(_TAGS.sub(" ", value)).split()) if isinstance(value, str) else ""


def _servings(value: object) -> int:
    if isinstance(value, list):
        value = value[0] if value else None
    match = re.search(r"\d+", str(value))
    return min(max(int(match[0]), 1), 99) if match else 4


def _image(value: object) -> str | None:
    if isinstance(value, list):
        value = next((v for v in value if _image(v)), None)
    if isinstance(value, dict):
        value = value.get("url") or value.get("contentUrl")
    ok = isinstance(value, str) and len(value) <= 2000 and re.match(r"https?://", value)
    return value if ok else None


def recipe_import(conn: sqlite3.Connection, page: str, url: str) -> dict:
    """Draft from the page's JSON-LD; nothing is saved."""
    recipe = extract_recipe(page)
    if recipe is None:
        raise InventoryError("recipe_not_found")
    return recipe_draft(conn, recipe, url)


def recipe_draft(conn: sqlite3.Connection, recipe: dict, url: str | None) -> dict:
    """schema.org Recipe dict (JSON-LD or the AI's answer) -> draft {name, servings, steps,
    source_url, image_url, ingredients}; nothing is saved."""
    units = unit_lookup(conn)
    piece = conn.execute("SELECT id FROM unit WHERE name = ?", (seeded(conn, "Stück"),)).fetchone()
    lines = recipe.get("recipeIngredient") or recipe.get("ingredients") or []
    ingredients = []
    for line in [x for x in lines if isinstance(x, str) and x.strip()][:100]:
        row = parse_ingredient(line[:500], units, piece["id"] if piece else None)
        word = row.pop("unit_word")
        hint = row["unit_hint"]
        # an unknown word that is itself an ingredient ("Zwiebeln rot", "Pak Choi") is no unit
        if (
            hint
            and piece
            and (suggest(conn, [], hint) or suggest_type(conn, f"{word} {row['text']}"))
        ):
            row.update(unit_id=piece["id"], unit_hint=None, text=f"{word} {row['text']}"[:200])
        # no amount: "Salz und Pfeffer" is two ingredients
        parts = _AND.split(row["text"]) if row["amount"] is None else [row["text"]]
        for part in parts:
            known = learned(conn, "ingredient", part)
            cid = known or suggest(conn, [], part)
            if cid is not None and not is_food(conn, cid):
                cid = None  # never suggest a non-food category (the save refuses it)
            # source_text: the save learns the category finally chosen for this text
            row_out = {**row, "text": part, "category_id": cid, "source_text": part}
            ingredients.append(row_out | {"learned": known is not None and cid == known})
    ingredients = ingredients[:100]
    return {
        "name": (_text(recipe.get("name")) or url or "")[:200],
        "servings": _servings(recipe.get("recipeYield")),
        "steps": import_steps(recipe.get("recipeInstructions")),
        "source_url": url,
        "image_url": _image(recipe.get("image")),
        "ingredients": ingredients,
    }
