"""Seeded allergens and diet of categories by name (category.diet, category.allergens; None = inherit)."""

from __future__ import annotations

import sqlite3

# name -> (diet, allergens); None = leave to the parent / unknown
_DIET = {
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
    """Seed the values where a category of that name is unique."""
    for name, (diet, allergens) in _DIET.items():
        conn.execute(
            "UPDATE category SET diet = ifnull(diet, ?), allergens = ifnull(allergens, ?)"
            " WHERE name = ? AND (SELECT count(*) FROM category WHERE name = ?) = 1",
            (diet, allergens, name, name),
        )
