"""Migration 27 (kept out of migrations.py for size): emergency stock (Notvorrat).

- category.emergency_group: the BBK food group a category counts for (inherited down the tree, NULL =
  inherit, NULL at the root = no group, 'none' = explicitly not part of the emergency stock).
  Seeded by name where the name is unique.
"""

from __future__ import annotations

import sqlite3

_SEEDED = {
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
    """Seed the groups; also run after the seed of a new DB (migrate)."""
    if not conn.execute("SELECT 1 FROM unit").fetchone():
        return  # new DB (migrations run before the seed): migrate() calls this after the seed
    if "emergency_group" not in {r[1] for r in conn.execute("PRAGMA table_info(category)")}:
        return  # a DB seeded at an older version (upgrade tests): migration 27 calls it later
    for group, names in _SEEDED.items():
        for name in names:
            conn.execute(
                "UPDATE category SET emergency_group = ifnull(emergency_group, ?)"
                " WHERE name = ? AND (SELECT count(*) FROM category WHERE name = ?) = 1",
                (group, name, name),
            )


def emergency_stock(conn: sqlite3.Connection) -> None:
    # The CHECK list is fixed now: a new group needs a new migration.
    conn.execute(
        "ALTER TABLE category ADD COLUMN emergency_group TEXT CHECK (emergency_group IN"
        " ('drinks', 'grains', 'vegetables', 'fruit_nuts', 'dairy', 'meat_fish_eggs', 'fats', 'none'))"
    )
    set_emergency(conn)
