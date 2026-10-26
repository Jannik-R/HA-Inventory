"""Migration 30 (kept out of migrations.py for size): allergens and diet.

- category.diet / product.diet: 'vegan' | 'vegetarian' | 'none' (NULL = inherit, unknown at the root).
- category.allergens / product.allergens: comma list of the contained major allergens (inventory/diet.py;
  '' = none of the 14, NULL = inherit).
Products are filled from the stored `off_json` (old ones usually lack the tags: then nothing is
found, the admin reload in the settings fetches them); categories are seeded by name where unique.
"""

from __future__ import annotations

import json
import sqlite3

from .inventory.diet import off_diet

# name -> (diet, allergens); None = leave to the parent / unknown
_SEEDED = {
    "Obst & Gemüse": ("vegan", None),
    **dict.fromkeys(["Obst", "Gemüse", "Kräuter", "Kartoffeln"], (None, "")),
    **dict.fromkeys(["Sellerie", "Staudensellerie", "Schnittsellerie", "Suppengrün"], (None, "celery")),
    **dict.fromkeys(["Sojabohnenkeimlinge", "Sojasprossen"], (None, "soybeans")),
    "Milchprodukte & Eier": ("vegetarian", None),
    "Honig": ("vegetarian", ""),
    "Eier": (None, "eggs"),
    **dict.fromkeys(
        ["Käse", "Vollmilch", "H-Milch", "Frischmilch", "Sahne", "Schlagsahne", "Süßrahmbutter"],
        (None, "milk"),
    ),
    **dict.fromkeys(
        ["Fleisch, Wurst & Fisch", "Fleisch & Fisch TK", "Fleisch & Wurst", "Jerky"], ("none", None)
    ),
    **dict.fromkeys(
        [
            "Basmatireis", "Jasminreis", "Langkornreis", "Risottoreis", "Vollkornreis", "Salz",
            "Jodsalz", "Meersalz", "Pfeffer", "Pfeffer schwarz", "Haushaltszucker", "Puderzucker",
            "Brauner Zucker", "Olivenöl", "Rapsöl", "Sonnenblumenöl", "Wasser",
        ],
        ("vegan", ""),
    ),
    **dict.fromkeys(["Weizenmehl", "Dinkelmehl", "Roggenmehl", "Vollkornmehl"], ("vegan", "gluten")),
}  # fmt: skip


def set_diet(conn: sqlite3.Connection) -> None:
    """Seed the values; also run after the seed of a new DB (migrate)."""
    if not conn.execute("SELECT 1 FROM unit").fetchone():
        return  # new DB (migrations run before the seed): migrate() calls this after the seed
    if "diet" not in {r[1] for r in conn.execute("PRAGMA table_info(category)")}:
        return  # a DB seeded at an older version (upgrade tests): migration 30 calls it later
    for name, (diet, allergens) in _SEEDED.items():
        conn.execute(
            "UPDATE category SET diet = ifnull(diet, ?), allergens = ifnull(allergens, ?)"
            " WHERE name = ? AND (SELECT count(*) FROM category WHERE name = ?) = 1",
            (diet, allergens, name, name),
        )


def allergens_diet(conn: sqlite3.Connection) -> None:
    for table in ("category", "product"):
        conn.execute(
            f"ALTER TABLE {table} ADD COLUMN diet TEXT CHECK (diet IN ('vegan', 'vegetarian', 'none'))"
        )
        conn.execute(f"ALTER TABLE {table} ADD COLUMN allergens TEXT")
    for pid, raw in conn.execute(
        "SELECT id, off_json FROM product WHERE off_json IS NOT NULL"
    ).fetchall():
        try:
            diet, allergens = off_diet(json.loads(raw))
        except ValueError:
            continue  # unreadable stored JSON: leave the product unknown
        if diet is not None or allergens is not None:
            conn.execute(
                "UPDATE product SET diet = ?, allergens = ? WHERE id = ?", (diet, allergens, pid)
            )
    set_diet(conn)
