"""AI check of a new product from Open Food Facts: the prompt (fixed context first, then the draft
as JSON) and the validation of the answer. Pure, no HA: ai.py sends the prompt via ai_task."""

from __future__ import annotations

import json
import sqlite3

from .ai_check import MAX_TYPE_NAME, category_tree, unit_list

MAX_NAME = 200
MAX_AMOUNT = 1_000_000

# Fixed part first and byte-identical between calls (prompt prefix caching, see ai_check).
_TASK = """You check a new product for "Vorrat", a household inventory in Home Assistant. It comes
from Open Food Facts (a barcode scan); the app filled the draft below from that data.
Check:
- "name": the short German product name as on the package, without brand and package size
  (e.g. "Spaghetti n.5", not "Barilla Spaghetti n.5 500g"). Keep a name that is fine.
- "category_id": the most specific category from the tree that fits (food or non-food; a
  product type on the lowest level when one fits). When no product type fits but the product is a
  distinct kind people keep (e.g. "Sumach" with no such type below "Gewürze"), propose one:
  "new_type" {"name": <singular German name>, "parent_id": <the most specific category it
  belongs below>} instead of "category_id". Never one the tree already has.
- "content_amount" with "content_unit_id": the content of one package in a unit from the unit
  list (e.g. "4 x 125 g" = 500 g; canned or jarred food: the drained weight when stated).

Answer with JSON only.
- Everything fine: {"ok": true}
- Otherwise {"ok": false} with only the fields that change and "reason" (a few words, German).

Categories (id name; indentation = level below the parent):
"""


def _off(off_json: str | None) -> dict:
    """The Open Food Facts fields that help the check (the full JSON is far too long)."""
    try:
        p = json.loads(off_json or "{}")
    except ValueError:
        return {}
    if not isinstance(p, dict):
        return {}
    keys = ("quantity", "product_quantity", "product_quantity_unit", "brands")
    out = {k: p[k] for k in keys if isinstance(p.get(k), (str, int, float))}
    names = {k: v for k, v in p.items() if k.startswith(("product_name", "generic_name"))}
    out.update({k: v[:200] for k, v in names.items() if isinstance(v, str) and v})
    if isinstance(tags := p.get("categories_tags"), list):
        out["categories_tags"] = [t for t in tags if isinstance(t, str)][-8:]
    return out


def prompt(conn: sqlite3.Connection, draft: dict) -> str:
    """The instructions for ai_task: task, all categories and units first, then the draft."""
    product = {
        "name": draft.get("name"),
        "brand": draft.get("brand"),
        "category_id": draft.get("category_id") or 0,
        "content_amount": draft.get("content_amount"),
        "content_unit_id": draft.get("content_unit_id"),
        "open_food_facts": _off(draft.get("off_json")),
    }
    body = json.dumps(product, ensure_ascii=False, separators=(",", ":"))
    tree, units = category_tree(conn, food_only=False), unit_list(conn)
    return f"{_TASK}{tree}\n\nUnits (id symbol (name)):\n{units}\n\nProduct draft:\n{body}\n"


def _named(conn: sqlite3.Connection, name: str) -> int | None:
    """A category with this name (any level, case ignored), else None."""
    rows = conn.execute("SELECT id, name FROM category WHERE name LIKE ?", (name,))
    return next((r["id"] for r in rows if r["name"].casefold() == name.casefold()), None)


def _new_type(conn: sqlite3.Connection, new: object) -> dict | None:
    """A proposed product type {name, parent_id} below an existing category, else None."""
    if not isinstance(new, dict):
        return None
    name, parent = str(new.get("name") or "").strip(), new.get("parent_id")
    known = conn.execute("SELECT 1 FROM category WHERE id = ?", (parent,)).fetchone()
    if not name or len(name) > MAX_TYPE_NAME or type(parent) is not int or not known:
        return None
    return {"name": name, "parent_id": parent}


def changes(conn: sqlite3.Connection, draft: dict, answer: object) -> dict:
    """The AI answer, checked: {ok: true} or {ok: false, name?, category_id?, new_type?,
    content_amount?, content_unit_id?, reason}; a field is there only when it changes to a valid
    value. new_type {name, parent_id} (category_id None) is a product type the panel adds on book
    in."""
    if not isinstance(answer, dict):
        return {"ok": True}
    out: dict = {}
    name = str(answer.get("name") or "").strip()
    if name and len(name) <= MAX_NAME and name != (draft.get("name") or "").strip():
        out["name"] = name
    cid, new = answer.get("category_id"), _new_type(conn, answer.get("new_type"))
    if new and not (cid := _named(conn, new["name"])):
        out |= {"category_id": None, "new_type": new}
    known = conn.execute("SELECT 1 FROM category WHERE id = ?", (cid,)).fetchone()
    if not new and type(cid) is int and known and cid != draft.get("category_id"):
        out["category_id"] = cid
    elif new and cid and cid != draft.get("category_id"):
        out["category_id"] = cid  # the tree has it after all
    amount = answer.get("content_amount", draft.get("content_amount"))
    unit = answer.get("content_unit_id", draft.get("content_unit_id"))
    valid = type(amount) in (int, float) and 0 < amount <= MAX_AMOUNT
    if valid and conn.execute("SELECT 1 FROM unit WHERE id = ?", (unit,)).fetchone():
        if (amount, unit) != (draft.get("content_amount"), draft.get("content_unit_id")):
            out |= {"content_amount": amount, "content_unit_id": unit}
    if not out:
        return {"ok": True}
    return {"ok": False, **out, "reason": str(answer.get("reason") or "")[:200]}
