"""AI check of a recipe import: the prompt (fixed context first, then the draft as JSON) and the
validation of the answer. Pure, no HA: the HA side (ai.py) sends the prompt via ai_task."""

from __future__ import annotations

import json
import sqlite3

from .ai_lang import language, localized
from .common import unit_key
from .ingredient_line import unit_lookup
from .inherit import _categories, children, food_named, is_food
from .steps import MAX_SECTION, MAX_STEPS, MAX_TEXT

MAX_TYPE_NAME = 60
MAX_UNIT_NAME = 50

# The fixed part stays byte-identical between calls (only the trees and units change it), so
# providers that cache prompt prefixes (Gemini implicitly, Claude) only bill it once in a while.
_TASK = """You check a recipe import for "Vorrat", a household inventory in Home Assistant.
Each recipe ingredient is linked to one food category from the tree below; the app checks the
stock of that category and its subcategories. The best category is the most specific one that
fits the ingredient (a product type on the lowest level when one fits); a more general category
only when the recipe accepts any kind of it (e.g. "@pasta@"). Things nobody keeps in stock
(water, ice cubes) may have no category (category_id 0).
When no product type in the tree fits but the ingredient is a distinct food that people keep in
stock (e.g. "@sumac@" with no such type below "@spices@"), propose a new product type: "new_type"
{"name": <singular @lang@ name>, "parent_id": <the most specific category it belongs below>}.
Only a product type, never a new intermediate category; never one the tree already has.
Each ingredient's amount has a unit from the unit list below. "unit" null with a "line" that
names a unit means the app did not know the word: pick the matching unit ("unit_id", e.g.
@tip@), or, when none fits, propose a new count unit "new_unit"
{"name": <singular @lang@ name, e.g. "@bulb@">}. Also fix a unit that does not fit the line.
Steps: one action-sized step each, in the recipe's order and wording. Split a long block into
steps, do not invent or drop content. A section name only for real sub-parts (e.g. "@dough@",
"@filling@"); one section for the whole recipe is no section.

Answer with JSON only.
- Everything fine: {"ok": true}
- Otherwise {"ok": false} with only what changes:
  "ingredients": [{"index": <index from the draft>, "category_id": <id from the tree, 0 = none;
  only when it changes>, "new_type": <only when proposing one>, "unit_id": <id from the unit
  list; only when it changes>, "new_unit": <only when proposing one>, "reason": <a few words,
  in the language named at the end>}] for ingredients whose category or unit is wrong or missing;
  "steps": the complete new step list [{"text": ..., "section": ...}] only if the steps need
  splitting or fixing.
Ingredients with "learned": true were confirmed by the user before: change them only when
clearly wrong. Keep the recipe's language (@lang@).

Food categories (id name; indentation = level below the parent):
"""


_WORDS = {
    "de": {
        "lang": "German",
        "pasta": "Nudeln",
        "sumac": "Sumach",
        "spices": "Gewürze",
        "tip": '"Msp." = "Messerspitze"',
        "bulb": "Knolle",
        "dough": "Teig",
        "filling": "Füllung",
    },
    "en": {
        "lang": "English",
        "pasta": "Pasta",
        "sumac": "Sumac",
        "spices": "Spices",
        "tip": '"tip" = "knife tip"',
        "bulb": "bulb",
        "dough": "Dough",
        "filling": "Filling",
    },
}


def unit_list(conn: sqlite3.Connection) -> str:
    """Units as `id symbol (name)` lines, by id."""
    rows = conn.execute("SELECT id, name, symbol FROM unit ORDER BY id")
    return "\n".join(f"{r['id']} {r['symbol']} ({r['name']})" for r in rows)


def category_tree(conn: sqlite3.Connection, food_only: bool = True) -> str:
    """Categories as `id name` lines, children indented under their parent, by name."""
    cats = _categories(conn)
    kids = children(cats)
    lines: list[str] = []

    def walk(parent: int | None, depth: int) -> None:
        for cid in sorted(kids.get(parent, []), key=lambda c: cats[c]["name"].casefold()):
            if food_only and cats[cid]["food"] == 0:
                continue  # non-food subtree: never an ingredient
            lines.append(f"{' ' * depth}{cid} {cats[cid]['name']}")
            walk(cid, depth + 1)

    walk(None, 0)
    return "\n".join(lines)


def prompt(conn: sqlite3.Connection, draft: dict) -> str:
    """The instructions for ai_task: task and category tree first, then the draft."""
    units = {r["id"]: r["symbol"] or r["name"] for r in conn.execute("SELECT * FROM unit")}
    names = {r["id"]: r["name"] for r in conn.execute("SELECT id, name FROM category")}
    recipe = {
        "name": draft.get("name"),
        "servings": draft.get("servings"),
        "steps": [
            {"text": s.get("text"), **({"section": s["section"]} if s.get("section") else {})}
            for s in draft.get("steps") or []
        ],
        "ingredients": [
            {
                "index": n,
                "line": i.get("line") or i.get("text"),
                "amount": i.get("amount"),
                "unit": units.get(i.get("unit_id")),
                "note": i.get("note"),
                "category_id": i.get("category_id") or 0,
                "category": names.get(i.get("category_id")),
                **({"learned": True} if i.get("learned") else {}),
            }
            for n, i in enumerate(draft.get("ingredients") or [])
        ],
    }
    body = json.dumps(recipe, ensure_ascii=False, separators=(",", ":"))
    tree, unit_lines = category_tree(conn), unit_list(conn)
    task = localized(_TASK, _WORDS, language(conn))
    return f"{task}{tree}\n\nUnits (id symbol (name)):\n{unit_lines}\n\nRecipe draft:\n{body}\n"


def _headings(steps: list[dict]) -> list[dict]:
    """Sections as the app stores them: only on the first step of a run, none when the whole
    recipe is one section (AIs tend to repeat the section on every step)."""
    if len({s["section"] for s in steps}) <= 1:
        return [{**s, "section": None} for s in steps]
    last, out = None, []
    for s in steps:
        out.append({**s, "section": s["section"] if s["section"] != last else None})
        last = s["section"] if s["section"] is not None else last
    return out


def _new_type(conn: sqlite3.Connection, new: object, ids: set[int]) -> dict | None:
    """A proposed product type {name, parent_id} below an existing food category, else None."""
    if not isinstance(new, dict):
        return None
    name, parent = str(new.get("name") or "").strip(), new.get("parent_id")
    if not name or len(name) > MAX_TYPE_NAME or parent not in ids or not is_food(conn, parent):
        return None
    return {"name": name, "parent_id": parent}


def _unit(conn: sqlite3.Connection, c: dict, row: dict, units: set[int]) -> dict:
    """The unit change of one answer row: {unit_id} (existing unit) or {new_unit} (a name; added
    in the dialog), {} when none or invalid. A proposed name the units know becomes its id."""
    uid, new = c.get("unit_id") or None, c.get("new_unit")
    name = str(new.get("name") or "").strip() if isinstance(new, dict) else ""
    if name and len(name) <= MAX_UNIT_NAME:
        uid = unit_lookup(conn).get(unit_key(name)) or uid
        if uid is None:
            return {"new_unit": {"name": name}}
    if uid in units and uid != row.get("unit_id"):
        return {"unit_id": uid}
    return {}


def _category(conn: sqlite3.Connection, c: dict, row: dict, ids: set[int]) -> dict:
    """The category change of one answer row: {category_id} or {category_id: None, new_type}, {}
    when unchanged or invalid (an id the tree does not have, or non-food: never guess)."""
    new = _new_type(conn, c.get("new_type"), ids)
    if new and not (same := food_named(conn, new["name"])):
        return {"category_id": None, "new_type": new}
    if new:
        cid = same  # the tree has it after all
    elif "category_id" in c:
        cid = c["category_id"] or None
    else:
        return {}
    if cid is not None and (cid not in ids or not is_food(conn, cid)):
        return {}
    return {} if cid == row.get("category_id") else {"category_id": cid}


def changes(conn: sqlite3.Connection, draft: dict, answer: object) -> dict:
    """The AI answer, checked: only real changes to existing food categories and units, and valid
    steps. Returns {ok: true} or {ok: false, ingredients: [{index, category_id?, new_type?,
    unit_id?, new_unit?, reason}], steps?}; a key is there only when it changes. new_type {name,
    parent_id} is a product type to add on save (category_id None); new_unit {name} a unit the
    user adds in the dialog."""
    if not isinstance(answer, dict):
        return {"ok": True}
    rows = draft.get("ingredients") or []
    names = {r["id"] for r in conn.execute("SELECT id FROM category")}
    units = {r["id"] for r in conn.execute("SELECT id FROM unit")}
    picked: dict[int, dict] = {}
    for c in answer.get("ingredients") or []:
        if not isinstance(c, dict):
            continue
        n = c.get("index")
        if not isinstance(n, int) or not 0 <= n < len(rows) or n in picked:
            continue
        found = {**_category(conn, c, rows[n], names), **_unit(conn, c, rows[n], units)}
        if found:
            picked[n] = {"index": n, **found, "reason": str(c.get("reason") or "")[:200]}
    out: dict = {"ok": True}
    if picked:
        out = {"ok": False, "ingredients": sorted(picked.values(), key=lambda c: c["index"])}
    steps = [
        {
            "text": str(s.get("text") or "").strip()[:MAX_TEXT],
            "section": str(s.get("section") or "").strip()[:MAX_SECTION] or None,
        }
        for s in answer.get("steps") or []
        if isinstance(s, dict)
    ][:MAX_STEPS]
    steps = _headings([s for s in steps if s["text"]])
    old = [
        {"text": s.get("text"), "section": s.get("section") or None}
        for s in draft.get("steps") or []
    ]
    if steps and steps != old:
        out = {**out, "ok": False, "steps": steps}
        out.setdefault("ingredients", [])
    return out
