"""AI check of a recipe import: the prompt (fixed context first, then the draft as JSON) and the
validation of the answer. Pure, no HA: the HA side (ai.py) sends the prompt via ai_task."""

from __future__ import annotations

import json
import sqlite3

from .inherit import _categories, children, is_food
from .steps import MAX_SECTION, MAX_STEPS, MAX_TEXT

# The fixed part stays byte-identical between calls (only the category tree changes it), so
# providers that cache prompt prefixes (Gemini implicitly, Claude) only bill it once in a while.
_TASK = """You check a recipe import for "Vorrat", a household inventory in Home Assistant.
Each recipe ingredient is linked to one food category from the tree below; the app checks the
stock of that category and its subcategories. The best category is the most specific one that
fits the ingredient (a product type on the lowest level when one fits); a more general category
only when the recipe accepts any kind of it (e.g. "Nudeln"). Things nobody keeps in stock
(water, ice cubes) may have no category (category_id 0).
Steps: one action-sized step each, in the recipe's order and wording. Split a long block into
steps, do not invent or drop content. A section name only for real sub-parts (e.g. "Teig",
"Füllung"); one section for the whole recipe is no section.

Answer with JSON only.
- Everything fine: {"ok": true}
- Otherwise {"ok": false} with only what changes:
  "ingredients": [{"index": <index from the draft>, "category_id": <id from the tree, 0 = none>,
  "reason": <a few words, German>}] for ingredients whose category is wrong or missing;
  "steps": the complete new step list [{"text": ..., "section": ...}] only if the steps need
  splitting or fixing.
Ingredients with "learned": true were confirmed by the user before: change them only when
clearly wrong. Keep the recipe's language (German).

Food categories (id name; indentation = level below the parent):
"""


def category_tree(conn: sqlite3.Connection) -> str:
    """Food categories as `id name` lines, children indented under their parent, by name."""
    cats = _categories(conn)
    kids = children(cats)
    lines: list[str] = []

    def walk(parent: int | None, depth: int) -> None:
        for cid in sorted(kids.get(parent, []), key=lambda c: cats[c]["name"].casefold()):
            if cats[cid]["food"] == 0:
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
    return f"{_TASK}{category_tree(conn)}\n\nRecipe draft:\n{body}\n"


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


def changes(conn: sqlite3.Connection, draft: dict, answer: object) -> dict:
    """The AI answer, checked: only real changes to existing food categories and valid steps.
    Returns {ok: true} or {ok: false, ingredients: [{index, category_id|None, reason}], steps?}."""
    if not isinstance(answer, dict):
        return {"ok": True}
    rows = draft.get("ingredients") or []
    names = {r["id"] for r in conn.execute("SELECT id FROM category")}
    picked: dict[int, dict] = {}
    for c in answer.get("ingredients") or []:
        if not isinstance(c, dict):
            continue
        n, cid = c.get("index"), c.get("category_id") or None
        if not isinstance(n, int) or not 0 <= n < len(rows) or n in picked:
            continue
        if cid is not None and (cid not in names or not is_food(conn, cid)):
            continue  # an id the tree does not have (or non-food): ignore, never guess
        if cid == rows[n].get("category_id"):
            continue
        reason = str(c.get("reason") or "")[:200]
        picked[n] = {"index": n, "category_id": cid, "reason": reason}
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
