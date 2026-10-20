"""Emergency stock (Notvorrat): how many days the stock lasts against the BBK recommendation."""

from __future__ import annotations

import sqlite3
from datetime import date
from math import floor

from .amounts import _amount, _units
from .inherit import _categories, _resolve, defaults
from .queries import stock_list

DAYS = 10  # BBK: a supply for ten days
# group -> (unit, need per person for DAYS days)
GROUPS = {
    "drinks": ("l", 20.0),
    "grains": ("kg", 3.5),
    "vegetables": ("kg", 4.0),
    "fruit_nuts": ("kg", 2.5),
    "dairy": ("kg", 2.6),
    "meat_fish_eggs": ("kg", 1.5),
    "fats": ("kg", 0.357),
}
# shortcut: piece weight only estimated for eggs (60 g, size M), per-product weight if needed.
PIECE_KG = {"meat_fish_eggs": 0.06}


def supply(conn: sqlite3.Connection, persons: int, today: date) -> dict:
    """Need, stock and supply days per group. 1 l counts as 1 kg; expired packages do not count."""
    persons = max(1, persons)
    units = _units(conn)
    by_name = {u["name"]: u["id"] for u in units.values()}  # shortcut: kg / l / Stück found by name
    kg, litre, piece = by_name.get("kg"), by_name.get("l"), by_name.get("Stück")  # None: renamed
    cats, dflt = _categories(conn), defaults(conn)
    products = {r["id"]: r for r in conn.execute("SELECT * FROM product")}
    packages: dict[int, int] = {}
    for r in stock_list(conn):
        if r["expires_on"] is None or r["expires_on"] >= today.isoformat():
            packages[r["product_id"]] = packages.get(r["product_id"], 0) + r["packages"]
    have = dict.fromkeys(GROUPS, 0.0)
    unknown = dict.fromkeys(GROUPS, 0)
    group_of: dict[int, str | None] = {}  # per category
    for pid, count in packages.items():
        p = products[pid]
        if p["category_id"] not in group_of:
            group_of[p["category_id"]] = _resolve(cats, None, p["category_id"], dflt)[
                "emergency_group"
            ]["value"]
        key = group_of[p["category_id"]]
        if key not in GROUPS:
            continue
        first, second = (litre, kg) if GROUPS[key][0] == "l" else (kg, litre)
        value = None
        for target in (first, second):
            if value is None and target is not None:  # a missing kg / l unit: counts as unknown
                value = _amount(units, count, p["content_amount"], p["content_unit_id"], target)
        if (
            value is None
            and piece is not None
            and p["content_unit_id"] == piece
            and p["content_amount"]
            and key in PIECE_KG
        ):
            value = count * p["content_amount"] * PIECE_KG[key]
        if value is None:
            unknown[key] += count
        else:
            have[key] += value
    rows = []
    for key, (unit, per_person) in GROUPS.items():
        need = per_person * persons
        rows.append(
            {
                "key": key,
                "unit": unit,
                "need": round(need, 3),
                "have": round(have[key], 3),
                "unknown": unknown[key],
                "days": floor(have[key] / (need / DAYS) + 1e-9),
            }
        )
    return {
        "persons": persons,
        "days": DAYS,
        "supply_days": min(r["days"] for r in rows),
        "groups": rows,
    }
