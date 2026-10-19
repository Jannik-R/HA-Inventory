"""Stock amounts in a chosen unit (shared by the shopping list and recipe availability)."""

from __future__ import annotations

import sqlite3

from .inherit import _resolve


def _units(conn: sqlite3.Connection) -> dict[int, sqlite3.Row]:
    return {r["id"]: r for r in conn.execute("SELECT * FROM unit")}


def _convert(units: dict, value: float, from_id: int, to_id: int) -> float | None:
    if from_id == to_id:
        return value
    a, b = units[from_id], units[to_id]
    base_a, base_b = a["base_unit_id"] or a["id"], b["base_unit_id"] or b["id"]
    if base_a != base_b:
        return None
    return value * a["factor"] / b["factor"]


def _stock_amount(
    units: dict, cats: dict, dflt: dict, category_id: int, amount, unit_id
) -> tuple[float | None, int | None]:
    """A recipe amount as counted against the stock: own unit unless it is recipe-only; a
    recipe-only one becomes its base (EL -> ml) when that converts to the category's unit, else
    (None, None) = any stock covers it.
    shortcut: no density, volume never becomes weight (EL Mehl = any Mehl)."""
    if unit_id is None or not units[unit_id]["recipe_only"]:
        return amount, unit_id
    base = units[unit_id]["base_unit_id"]
    cat_unit = _resolve(cats, None, category_id, dflt)["unit_id"]["value"]
    if base and cat_unit and _convert(units, 1, base, cat_unit) is not None:
        return _convert(units, amount, unit_id, base), base
    return None, None


def _amount(
    units: dict, packages: int, content_amount, content_unit_id, unit_id: int
) -> float | None:
    """Stock in `unit_id`: package content when it converts (a 10-pack of eggs is 10 Stück),
    else for a count unit the number of packages; None when unknown."""
    if content_amount is not None and content_unit_id is not None:
        converted = _convert(units, packages * content_amount, content_unit_id, unit_id)
        if converted is not None:
            return converted
    return packages if units[unit_id]["is_count"] else None


def _have(units: dict, products, unit_id: int) -> tuple[float, int]:
    """Stock of `products` in `unit_id` and how many of them have no known amount."""
    each = [
        _amount(units, p["packages"], p["content_amount"], p["content_unit_id"], unit_id)
        for p in products
    ]
    return round(sum(h for h in each if h is not None), 6), each.count(None)


# Rows that are only part of an egg (note's first comma part): eggs = whole + max(yolks, whites).
_PARTS = {"eigelb": "yolk", "eiweiss": "white"}  # casefold turns ß into ss


def egg_part(note: str | None) -> str | None:
    return _PARTS.get((note or "").split(",")[0].strip().casefold())


def _demand(units: dict, group_unit: int, rows: list[dict]) -> float:
    """Needed amount in the group's unit; for a count unit the egg rule applies.
    shortcut: the shopping item's total applies the rule across all recipes (yolks of one and
    whites of another share eggs) while each ref applies it per recipe, so refs may sum to more
    than the total; upgrade = distribute the total over the refs."""
    whole, parts = 0.0, {"yolk": 0.0, "white": 0.0}
    for r in rows:
        value = _convert(units, r["amount"], r["unit_id"], group_unit)
        part = egg_part(r["note"])
        if part and units[group_unit]["is_count"]:
            parts[part] += value
        else:
            whole += value
    return round(whole + max(parts.values()), 6)


def _stock_by_category(conn: sqlite3.Connection) -> dict[int, list[sqlite3.Row]]:
    """Products (with their package count, 0 when out of stock) per category id."""
    products: dict[int, list[sqlite3.Row]] = {}
    for p in conn.execute(
        "SELECT p.id, p.name, p.brand, p.min_packages, p.category_id, p.content_amount, p.content_unit_id,"
        " COALESCE(SUM(s.packages), 0) AS packages FROM product p"
        " LEFT JOIN batch b ON b.product_id = p.id LEFT JOIN stock s ON s.batch_id = b.id GROUP BY p.id"
    ):
        products.setdefault(p["category_id"], []).append(p)
    return products
