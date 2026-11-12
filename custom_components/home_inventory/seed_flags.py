"""Seeded values set by category name after the base seed: date kind guide, freezing, emergency stock groups.

Names are the German seed names (`to_english` renames afterwards, ids stay).
"""

from __future__ import annotations

import sqlite3

# Seeded types below Obst & Gemüse sold in jars keep a printed best before date.
_JARS = ("Schattenmorellen", "Preiselbeeren")


def set_guide(conn: sqlite3.Connection) -> None:
    """Fresh produce gets the date kind guide (Richtwert: no printed date), jars best before."""
    conn.execute(
        "UPDATE category SET expiry_type = 'guide' WHERE parent_id IS NULL AND name = 'Obst & Gemüse'"
    )
    conn.execute(
        f"UPDATE category SET expiry_type = ifnull(expiry_type, 'best_before')"
        f" WHERE name IN ({', '.join('?' * len(_JARS))})",
        _JARS,
    )


# Seeded days frozen by category name (only where the name is unique and nothing is set).
_FROZEN_DAYS = {
    "Fleisch": 180,
    "Hackfleisch": 90,
    "Fisch": 120,
    "Brot & Backwaren": 90,
    "Obst": 300,
    "Gemüse": 300,
}


def set_frozen(conn: sqlite3.Connection) -> None:
    """Seed values for freezing: 90 days by default, the freezer location, frozen goods, days by category."""
    conn.execute("UPDATE defaults SET frozen_days = ifnull(frozen_days, 90)")
    conn.execute("UPDATE location SET freezer = 1 WHERE name = 'Gefrierschrank'")
    conn.execute(
        "UPDATE category SET frozen_goods = 1 WHERE parent_id IS NULL AND name = 'Tiefkühlkost'"
    )
    for name, days in _FROZEN_DAYS.items():
        conn.execute(
            "UPDATE category SET frozen_days = ifnull(frozen_days, ?)"
            " WHERE name = ? AND (SELECT count(*) FROM category WHERE name = ?) = 1",
            (days, name, name),
        )


_EMERGENCY = {
    "grains": [
        "Brot & Backwaren", "Nudeln, Reis & Getreide", "Kartoffeln", "Müsli", "Mehl",
    ],
    "vegetables": [
        "Gemüse", "Gemüsekonserven", "Tomaten", "Gemüse TK", "Gemüse & Eingelegtes",
        "Getrocknete Pilze", "Rote Linsen", "Berglinsen", "Tellerlinsen", "Gelbe Erbsen",
        "Schwarze Bohnen", "Mungbohnen", "Edamame",
    ],
    "fruit_nuts": [
        "Obst", "Nüsse", "Obst & Kompott", "Trockenobst", "Sonnenblumenkerne", "Kürbiskerne",
        "Pinienkerne",
    ],
    "dairy": ["Milchprodukte & Eier"],
    "meat_fish_eggs": [
        "Eier", "Fleisch, Wurst & Fisch", "Fleisch", "Fleisch & Fisch TK", "Fleisch & Wurst", "Jerky",
    ],
    "fats": ["Butter", "Öl"],
    "drinks": ["Getränke"],
    "none": ["Kaffee", "Tee", "Alkohol"],
}  # fmt: skip


def set_emergency(conn: sqlite3.Connection) -> None:
    """Seed the BBK food groups by category name."""
    for group, names in _EMERGENCY.items():
        for name in names:
            conn.execute(
                "UPDATE category SET emergency_group = ifnull(emergency_group, ?)"
                " WHERE name = ? AND (SELECT count(*) FROM category WHERE name = ?) = 1",
                (group, name, name),
            )
