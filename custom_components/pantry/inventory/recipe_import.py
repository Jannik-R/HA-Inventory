"""Recipe import: schema.org Recipe from a page's JSON-LD -> an unsaved recipe draft. Pure, no I/O."""

from __future__ import annotations

import html
import json
import re
import sqlite3
from collections.abc import Iterator

from .common import InventoryError
from .ingredient_line import parse_ingredient, unit_lookup
from .suggest import suggest, suggest_type

_LD_JSON = re.compile(
    r"<script[^>]*type\s*=\s*[\"']application/ld\+json[\"'][^>]*>(.*?)</script>", re.S | re.I
)
_TAGS = re.compile(r"<[^>]+>")
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


def extract_recipe(page: str) -> dict | None:
    """The first schema.org Recipe object in the page's JSON-LD blocks."""
    for block in _LD_JSON.findall(page):
        try:
            data = json.loads(block, strict=False)
        except ValueError:
            continue
        if found := next((n for n in _walk(data) if _is_recipe(n)), None):
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


def _steps(node: object) -> list[str]:
    if isinstance(node, str):
        return [_text(node)]
    if isinstance(node, list):
        return [s for child in node for s in _steps(child)]
    if isinstance(node, dict):
        if "itemListElement" in node:
            return [_text(node.get("name")), *_steps(node["itemListElement"])]
        return [_text(node.get("text"))]
    return []


def _instructions(value: object) -> str | None:
    return "\n\n".join(s for s in _steps(value) if s)[:20000] or None


def _image(value: object) -> str | None:
    if isinstance(value, list):
        value = next((v for v in value if _image(v)), None)
    if isinstance(value, dict):
        value = value.get("url") or value.get("contentUrl")
    ok = isinstance(value, str) and len(value) <= 2000 and re.match(r"https?://", value)
    return value if ok else None


def recipe_import(conn: sqlite3.Connection, page: str, url: str) -> dict:
    """Draft {name, servings, instructions, source_url, image_url, ingredients}; nothing is saved."""
    recipe = extract_recipe(page)
    if recipe is None:
        raise InventoryError("recipe_not_found")
    units = unit_lookup(conn)
    piece = conn.execute("SELECT id FROM unit WHERE name = 'Stück'").fetchone()
    lines = recipe.get("recipeIngredient") or recipe.get("ingredients") or []
    ingredients = []
    for line in [x for x in lines if isinstance(x, str) and x.strip()][:100]:
        row = parse_ingredient(line, units, piece["id"] if piece else None)
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
            ingredients.append({**row, "text": part, "category_id": suggest(conn, [], part)})
    ingredients = ingredients[:100]
    return {
        "name": (_text(recipe.get("name")) or url)[:200],
        "servings": _servings(recipe.get("recipeYield")),
        "instructions": _instructions(recipe.get("recipeInstructions")),
        "source_url": url,
        "image_url": _image(recipe.get("image")),
        "ingredients": ingredients,
    }
