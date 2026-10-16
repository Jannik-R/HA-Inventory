"""Language-specific seed data (units, locations, categories). Data only."""

import sqlite3

from .inventory.inherit import set_tags
from .seed_types import add_seed_extras

# Category: (name, off_tags, defaults, [(sub-category, off_tags[, location]), ...]).
# defaults keys: warn_days, expiry_type, location, unit (names resolved at seed time).
# Every main category has a location; a sub-category names one only where it differs.
_DE_CATEGORIES = [
    (
        "Obst & Gemüse",
        ["en:fruits-and-vegetables-based-foods"],
        {"warn_days": 2, "location": "Kühlschrank"},
        [
            ("Obst", ["en:fruits"], "Vorratsschrank"),
            ("Gemüse", ["en:vegetables"]),
            ("Kräuter", ["en:herbs"]),
            ("Kartoffeln", ["en:potatoes"], "Vorratsschrank"),
        ],
    ),
    (
        "Brot & Backwaren",
        ["en:breads", "en:bakery-products"],
        {"warn_days": 2, "location": "Vorratsschrank"},
        [
            ("Brot", ["en:breads"]),
            ("Brötchen", ["en:bread-rolls"]),
            ("Knäckebrot", ["en:crispbreads"]),
        ],
    ),
    (
        "Milchprodukte & Eier",
        ["en:dairies"],
        {"expiry_type": "use_by", "warn_days": 3, "location": "Kühlschrank"},
        [
            ("Milch", ["en:milks"]),
            ("Joghurt", ["en:yogurts"]),
            ("Käse", ["en:cheeses"]),
            ("Butter", ["en:butters"]),
            ("Eier", ["en:eggs"]),
        ],
    ),
    (
        "Fleisch, Wurst & Fisch",
        ["en:meats-and-their-products", "en:fishes"],
        {"expiry_type": "use_by", "warn_days": 1, "location": "Kühlschrank"},
        [
            ("Fleisch", ["en:meats"]),
            ("Aufschnitt", ["en:sausages", "en:hams"]),
            ("Fisch", ["en:fishes"]),
        ],
    ),
    (
        "Nudeln, Reis & Getreide",
        ["en:cereals-and-potatoes"],
        {"unit": "kg", "location": "Vorratsschrank"},
        [
            ("Nudeln", ["en:pastas"]),
            ("Reis", ["en:rices"]),
            ("Couscous", ["en:durum-wheat-semolinas-for-couscous"]),
            ("Haferflocken", ["en:rolled-oats"]),
        ],
    ),
    (
        "Backen",
        ["en:pastry-helpers"],
        {"unit": "kg", "location": "Vorratsschrank"},
        [
            ("Mehl", ["en:flours"]),
            ("Zucker", ["en:sugars"]),
            ("Backmischungen", ["en:baking-mixes"]),
            ("Hefe", ["en:yeast"]),
        ],
    ),
    (
        "Konserven & Fertiggerichte",
        ["en:canned-foods", "en:meals"],
        {"location": "Vorratsschrank"},
        [
            ("Gemüsekonserven", ["en:canned-vegetables"]),
            ("Tomaten", ["en:canned-tomatoes", "en:tomatoes-and-their-products"]),
            ("Suppen", ["en:soups"]),
            ("Fertiggerichte", ["en:meals"]),
        ],
    ),
    (
        "Öle, Saucen & Gewürze",
        ["en:condiments"],
        {"location": "Vorratsschrank"},
        [
            ("Öl", ["en:vegetable-oils"]),
            ("Essig", ["en:vinegars"]),
            ("Saucen", ["en:sauces"]),
            ("Gewürze", ["en:spices"]),
            ("Brühe", ["en:broths"]),
        ],
    ),
    (
        "Frühstück & Aufstriche",
        ["en:breakfasts", "en:spreads"],
        {"location": "Vorratsschrank"},
        [
            ("Müsli", ["en:mueslis"]),
            ("Marmelade", ["en:jams"]),
            ("Honig", ["en:honeys"]),
            ("Nussaufstrich", ["en:hazelnut-spreads", "en:nut-butters"]),
        ],
    ),
    (
        "Süßes & Snacks",
        ["en:snacks"],
        {"location": "Vorratsschrank"},
        [
            ("Schokolade", ["en:chocolates"]),
            ("Kekse", ["en:biscuits"]),
            ("Chips", ["en:chips-and-fries", "en:crisps"]),
            ("Nüsse", ["en:nuts"]),
        ],
    ),
    (
        "Getränke",
        ["en:beverages"],
        {"unit": "l", "location": "Vorratsschrank"},
        [
            ("Wasser", ["en:waters"]),
            ("Saft", ["en:fruit-juices"]),
            ("Kaffee", ["en:coffees"]),
            ("Tee", ["en:teas"]),
            ("Alkohol", ["en:alcoholic-beverages"]),
        ],
    ),
    (
        "Tiefkühlkost",
        ["en:frozen-foods"],
        {"warn_days": 30, "location": "Gefrierschrank"},
        [
            ("Gemüse TK", ["en:frozen-vegetables"]),
            ("Fleisch & Fisch TK", ["en:frozen-meats", "en:frozen-fishes"]),
            ("Pizza", ["en:frozen-pizzas"]),
            ("Eis", ["en:ice-creams"]),
        ],
    ),
    # No expiry tracking in the plan; the schema has no flag for it yet.
    (
        "Haushalt & Drogerie",
        [],
        {"location": "Vorratsschrank"},
        [
            ("Spülmittel", []),
            ("Papier", []),
        ],
    ),
]

SEED = {
    "de": {
        # (name, symbol, base unit name, factor, is_count)
        "units": [
            ("Stück", "Stk", None, 1, 1),
            ("Packung", "Pkg", None, 1, 1),
            ("g", "g", None, 1, 0),
            ("kg", "kg", "g", 1000, 0),
            ("ml", "ml", None, 1, 0),
            ("l", "l", "ml", 1000, 0),
        ],
        "locations": ["Kühlschrank", "Gefrierschrank", "Vorratsschrank"],
        "categories": _DE_CATEGORIES,
    }
}


def seed(conn: sqlite3.Connection, lang: str) -> None:
    """Insert units, defaults, locations and categories; the caller commits."""
    data = SEED[lang]
    units: dict[str, int] = {}
    for name, symbol, base, factor, is_count in data["units"]:
        units[name] = conn.execute(
            "INSERT INTO unit (name, symbol, base_unit_id, factor, is_count) VALUES (?, ?, ?, ?, ?)",
            (name, symbol, units.get(base), factor, is_count),
        ).lastrowid
    # Root of inheritance: counted in packages, best before, warn 7 days (editable in the settings).
    conn.execute(
        "INSERT INTO defaults (id, unit_id, expiry_type, warn_days)"
        " SELECT 1, id, 'best_before', 7 FROM unit ORDER BY is_count DESC, id LIMIT 1"
    )
    locations: dict[str, int] = {}
    for i, name in enumerate(data["locations"]):
        locations[name] = conn.execute(
            "INSERT INTO location (name, sort) VALUES (?, ?)", (name, i)
        ).lastrowid
    for i, (name, tags, dflt, children) in enumerate(data["categories"]):
        parent = conn.execute(
            "INSERT INTO category (name, sort, unit_id, default_location_id,"
            " expiry_type, warn_days) VALUES (?, ?, ?, ?, ?, ?)",
            (
                name,
                i,
                units.get(dflt.get("unit")),
                locations.get(dflt.get("location")),
                dflt.get("expiry_type"),
                dflt.get("warn_days"),
            ),
        ).lastrowid
        set_tags(conn, parent, tags)
        for j, (child, child_tags, *location) in enumerate(children):
            child_id = conn.execute(
                "INSERT INTO category (parent_id, name, sort, default_location_id) VALUES (?, ?, ?, ?)",
                (parent, child, j, locations.get(next(iter(location), None))),
            ).lastrowid
            set_tags(conn, child_id, child_tags)
    add_seed_extras(conn)
