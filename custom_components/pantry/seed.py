"""Language-specific seed data (units, locations, categories). Data only."""

import json
import sqlite3

# Category: (name, off_tags, defaults, [(sub-category, off_tags), ...]).
# defaults keys: warn_days, expiry_type, location, unit (names resolved at seed time).
_DE_CATEGORIES = [
    (
        "Obst & Gemüse",
        ["en:fruits-and-vegetables-based-foods"],
        {"warn_days": 2},
        [
            ("Obst", ["en:fruits"]),
            ("Gemüse", ["en:vegetables"]),
            ("Kräuter", ["en:herbs"]),
            ("Kartoffeln", ["en:potatoes"]),
        ],
    ),
    (
        "Brot & Backwaren",
        ["en:breads", "en:bakery-products"],
        {"warn_days": 2},
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
            ("Aufschnitt", ["en:cold-cuts", "en:sausages"]),
            ("Fisch", ["en:fishes"]),
        ],
    ),
    (
        "Nudeln, Reis & Getreide",
        ["en:cereals-and-potatoes"],
        {"unit": "kg"},
        [
            ("Nudeln", ["en:pastas"]),
            ("Reis", ["en:rices"]),
            ("Couscous", ["en:couscous"]),
            ("Haferflocken", ["en:rolled-oats"]),
        ],
    ),
    (
        "Backen",
        ["en:baking-aids"],
        {"unit": "kg"},
        [
            ("Mehl", ["en:flours"]),
            ("Zucker", ["en:sugars"]),
            ("Backmischungen", ["en:baking-mixes"]),
            ("Hefe", ["en:yeasts"]),
        ],
    ),
    (
        "Konserven & Fertiggerichte",
        ["en:canned-foods", "en:meals"],
        {},
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
        {},
        [
            ("Öl", ["en:oils"]),
            ("Essig", ["en:vinegars"]),
            ("Saucen", ["en:sauces"]),
            ("Gewürze", ["en:spices"]),
            ("Brühe", ["en:broths", "en:bouillons"]),
        ],
    ),
    (
        "Frühstück & Aufstriche",
        ["en:breakfasts", "en:spreads"],
        {},
        [
            ("Müsli", ["en:muesli"]),
            ("Marmelade", ["en:jams"]),
            ("Honig", ["en:honeys"]),
            ("Nussaufstrich", ["en:nut-spreads"]),
        ],
    ),
    (
        "Süßes & Snacks",
        ["en:snacks"],
        {},
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
        {"unit": "l"},
        [
            ("Wasser", ["en:waters"]),
            ("Saft", ["en:fruit-juices"]),
            ("Kaffee", ["en:coffees"]),
            ("Tee", ["en:teas"]),
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
        {},
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
    """Insert units, locations and categories; the caller commits."""
    data = SEED[lang]
    units: dict[str, int] = {}
    for name, symbol, base, factor, is_count in data["units"]:
        units[name] = conn.execute(
            "INSERT INTO unit (name, symbol, base_unit_id, factor, is_count) VALUES (?, ?, ?, ?, ?)",
            (name, symbol, units.get(base), factor, is_count),
        ).lastrowid
    locations: dict[str, int] = {}
    for i, name in enumerate(data["locations"]):
        locations[name] = conn.execute(
            "INSERT INTO location (name, sort) VALUES (?, ?)", (name, i)
        ).lastrowid
    for i, (name, tags, dflt, children) in enumerate(data["categories"]):
        parent = conn.execute(
            "INSERT INTO category (name, sort, off_tags, unit_id, default_location_id,"
            " expiry_type, warn_days) VALUES (?, ?, ?, ?, ?, ?, ?)",
            (
                name,
                i,
                json.dumps(tags),
                units.get(dflt.get("unit")),
                locations.get(dflt.get("location")),
                dflt.get("expiry_type"),
                dflt.get("warn_days"),
            ),
        ).lastrowid
        for j, (child, child_tags) in enumerate(children):
            conn.execute(
                "INSERT INTO category (parent_id, name, sort, off_tags) VALUES (?, ?, ?, ?)",
                (parent, child, j, json.dumps(child_tags)),
            )
