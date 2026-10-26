"""Allergens and diet: values from Open Food Facts, resolved up the category tree, per recipe.

Storage: `diet` ('vegan' | 'vegetarian' | 'none') and `allergens` (comma list of the contained
keys of ALLERGENS in that order; '' = none of the 14; NULL = inherit, at the root unknown) on
category and product. A product's own value wins, else the nearest category up the tree.
Traces ("may contain") are not considered.
"""

from __future__ import annotations

import sqlite3

from .inherit import _categories, children, subtree

# Open Food Facts allergen tags without the "en:" prefix, in the order they are stored and shown.
ALLERGENS = (
    "gluten", "crustaceans", "eggs", "fish", "peanuts", "soybeans", "milk", "nuts", "celery",
    "mustard", "sesame-seeds", "sulphur-dioxide-and-sulphites", "lupin", "molluscs",
)  # fmt: skip
DIETS = ("vegan", "vegetarian", "none")  # strictest last
_KNOWN_ANALYSIS = {"en:vegan", "en:non-vegan", "en:maybe-vegan"}


def _tags(value: object) -> set[str]:
    return {t for t in value if isinstance(t, str)} if isinstance(value, list) else set()


def off_diet(p: object) -> tuple[str | None, str | None]:
    """(diet, allergens) of an OFF product; None where OFF says nothing (never guessed)."""
    if not isinstance(p, dict):
        return None, None
    analysis = _tags(p.get("ingredients_analysis_tags"))
    diet = next(
        (d for tag, d in (("non-vegetarian", "none"), ("vegan", "vegan"), ("vegetarian", "vegetarian"))
         if f"en:{tag}" in analysis),
        None,
    )  # fmt: skip
    found = {t[3:] for t in _tags(p.get("allergens_tags")) if t.startswith("en:")}
    known = bool(found & set(ALLERGENS)) or bool(analysis & _KNOWN_ANALYSIS)
    return diet, ",".join(a for a in ALLERGENS if a in found) if known else None


def check_allergens(value: object) -> str:
    """Canonical allergen list (known keys, no duplicates, fixed order); ValueError otherwise."""
    if not isinstance(value, str):
        raise ValueError("allergens")
    keys = {k.strip() for k in value.split(",") if k.strip()}
    if keys - set(ALLERGENS):
        raise ValueError("allergens")
    return ",".join(a for a in ALLERGENS if a in keys)


# One part (product, ingredient): (diet | None, allergens it contains, allergens known).
Part = tuple[str | None, set[str], bool]


def _combine(items: list[Part]) -> Part:
    """Strict: any 'none' wins, else any unknown diet is unknown, else the weakest; allergens are
    the union of the known parts and known only when every part is."""
    diets = [d for d, _, _ in items]
    if "none" in diets:
        diet = "none"
    elif None in diets:
        diet = None
    else:
        diet = max(diets, key=DIETS.index, default=None)
    return diet, set().union(*(a for _, a, _ in items)), bool(items) and all(k for *_, k in items)


def _part(diet: str | None, allergens: str | None) -> Part:
    return diet, {a for a in (allergens or "").split(",") if a}, allergens is not None


def diet_index(conn: sqlite3.Connection):
    """-> value(category_id) = Part of an ingredient category: all products in its subtree, or the
    category's own resolved value when there are none."""
    cats, memo = _categories(conn), {}
    kids = children(cats)

    def resolved(cid: int) -> tuple[str | None, str | None]:
        if cid not in memo:
            row = cats[cid]
            parent = resolved(row["parent_id"]) if row["parent_id"] is not None else (None, None)
            memo[cid] = (
                row["diet"] if row["diet"] is not None else parent[0],
                row["allergens"] if row["allergens"] is not None else parent[1],
            )
        return memo[cid]

    by_cat: dict[int, list[Part]] = {}
    for r in conn.execute("SELECT category_id, diet, allergens FROM product"):
        d, a = resolved(r["category_id"])
        by_cat.setdefault(r["category_id"], []).append(
            _part(r["diet"] if r["diet"] is not None else d,
                  r["allergens"] if r["allergens"] is not None else a)
        )  # fmt: skip

    def value(cid: int | None) -> Part:
        if cid is None or cid not in cats:
            return None, set(), False
        items = [v for c in subtree(kids, cid) for v in by_cat.get(c, [])]
        return _combine(items or [_part(*resolved(cid))])

    return value


def recipe_diet(value, ingredients: list[dict]) -> dict:
    """Diet of a recipe from its ingredients. Optional ones do not count (the dish can be cooked
    without them) but are listed in `optional` when they are worse than the recipe."""
    mine = [(i, value(i["category_id"])) for i in ingredients]
    required = [p for i, p in mine if not i["optional"]]
    diet, have, known = _combine(required)
    unknown = [i["text"] for i, (d, _, k) in mine if not i["optional"] and not (d and k)]
    optional = []
    for ing, (d, a, _) in mine:
        if not ing["optional"]:
            continue
        worse = diet is not None and (d is None or DIETS.index(d) > DIETS.index(diet))
        extra = sorted(a - have, key=ALLERGENS.index) if known else []
        if worse or extra:
            optional.append({"text": ing["text"], "diet": d, "contains": extra})
    return {
        "diet": diet,
        "contains": sorted(have, key=ALLERGENS.index),
        "allergens_known": known,
        "unknown": unknown,
        "optional": optional,
    }
