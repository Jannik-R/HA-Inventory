"""Seeded product types (Produktarten): the lowest category level, brand-independent.

Single source for a new DB (seed.py) and for existing DBs (migration 8). Types inherit everything
from their sub-category except the units in `_DE_UNITS` (also set on sub-categories). No OFF tags on purpose; the name keywords in
suggest.py match type names directly.
"""

import sqlite3

# parent sub-category name -> types. Type names are unique across the tree (see add_seed_extras).
_DE_TYPES: dict[str, list[str]] = {
    "Obst": [
        "Äpfel", "Birnen", "Bananen", "Orangen", "Zitronen", "Limetten", "Mandarinen",
        "Trauben", "Erdbeeren", "Himbeeren", "Heidelbeeren", "Kiwi", "Ananas", "Mango",
        "Melone", "Pfirsiche", "Kirschen", "Pflaumen", "Avocado",
    ],
    "Gemüse": [
        "Frische Tomaten", "Zwiebeln", "Knoblauch", "Paprika", "Gurken", "Karotten",
        "Zucchini", "Brokkoli", "Blumenkohl", "Salat", "Spinat", "Champignons", "Lauch",
        "Auberginen", "Sellerie", "Kohlrabi", "Rotkohl", "Weißkohl", "Spargel", "Radieschen",
        "Rote Bete", "Fenchel", "Ingwer", "Süßkartoffeln", "Kürbis",
    ],
    "Kräuter": [
        "Petersilie", "Basilikum", "Schnittlauch", "Dill", "Koriander", "Thymian",
        "Rosmarin", "Minze", "Salbei",
    ],
    "Kartoffeln": ["Festkochende Kartoffeln", "Mehligkochende Kartoffeln"],
    "Brot": ["Vollkornbrot", "Toastbrot", "Mischbrot", "Weißbrot", "Dinkelbrot", "Tortillas"],
    "Brötchen": ["Weizenbrötchen", "Laugenbrötchen", "Baguette", "Croissants", "Aufbackbrötchen"],
    "Milch": [
        "Vollmilch", "H-Milch", "Frischmilch", "Laktosefreie Milch", "Hafermilch", "Sojamilch",
        "Mandelmilch", "Buttermilch", "Kondensmilch", "Sahne", "Schlagsahne", "Kochsahne",
        "Saure Sahne", "Crème fraîche", "Schmand",
    ],
    "Joghurt": ["Naturjoghurt", "Fruchtjoghurt", "Griechischer Joghurt", "Skyr", "Quark", "Magerquark"],
    "Käse": [
        "Gouda", "Emmentaler", "Mozzarella", "Parmesan", "Feta", "Camembert", "Frischkäse",
        "Reibekäse", "Schmelzkäse", "Mascarpone", "Ricotta", "Halloumi",
    ],
    "Butter": ["Süßrahmbutter", "Margarine"],
    "Fleisch": [
        "Hackfleisch", "Hähnchenbrust", "Hähnchenschenkel", "Putenbrust", "Schweineschnitzel",
        "Schweinefilet", "Rindersteak", "Rinderbraten", "Gulasch", "Lammfleisch",
    ],
    "Aufschnitt": [
        "Salami", "Kochschinken", "Lachsschinken", "Leberwurst", "Bratwurst",
        "Wiener Würstchen", "Speck", "Mortadella", "Fleischwurst",
    ],
    "Fisch": ["Lachs", "Räucherlachs", "Thunfisch", "Forelle", "Garnelen", "Seelachs", "Hering"],
    "Nudeln": [
        "Spaghetti", "Penne", "Fusilli", "Farfalle", "Makkaroni", "Tagliatelle",
        "Lasagneplatten", "Spätzle", "Tortellini", "Suppennudeln", "Gnocchi",
    ],
    "Reis": ["Basmatireis", "Jasminreis", "Langkornreis", "Risottoreis", "Milchreis", "Vollkornreis"],
    "Couscous": ["Bulgur", "Quinoa", "Hirse", "Polenta"],
    "Haferflocken": ["Zarte Haferflocken", "Kernige Haferflocken"],
    "Mehl": [
        "Weizenmehl", "Dinkelmehl", "Vollkornmehl", "Roggenmehl", "Speisestärke", "Grieß",
        "Semmelbrösel",
    ],
    "Zucker": ["Haushaltszucker", "Puderzucker", "Brauner Zucker", "Vanillezucker"],
    "Backmischungen": [
        "Backpulver", "Natron", "Puddingpulver", "Tortenguss", "Gelatine", "Kakaopulver",
        "Kuvertüre", "Backaroma", "Kuchenbackmischung",
    ],
    "Hefe": ["Trockenhefe", "Frischhefe"],
    "Gemüsekonserven": [
        "Mais", "Erbsen", "Kidneybohnen", "Weiße Bohnen", "Kichererbsen", "Linsen",
        "Gewürzgurken", "Sauerkraut", "Oliven", "Kapern", "Kokosmilch",
    ],
    "Tomaten": [
        "Tomatenmark", "Passierte Tomaten", "Gehackte Tomaten", "Geschälte Tomaten",
        "Getrocknete Tomaten",
    ],
    "Suppen": ["Tomatensuppe", "Hühnersuppe", "Linsensuppe", "Gulaschsuppe", "Erbsensuppe"],
    "Fertiggerichte": ["Ravioli", "Chili con Carne", "Eintopf", "Instantnudeln", "Kartoffelpüree", "Knödel"],
    "Öl": ["Olivenöl", "Rapsöl", "Sonnenblumenöl", "Kokosöl", "Sesamöl", "Butterschmalz"],
    "Essig": ["Balsamico", "Apfelessig", "Weißweinessig", "Rotweinessig"],
    "Saucen": [
        "Ketchup", "Mayonnaise", "Senf", "Sojasauce", "Pesto", "Tomatensauce", "Grillsauce",
        "Worcestersauce", "Chilisauce", "Salatdressing",
    ],
    "Gewürze": [
        "Salz", "Pfeffer", "Paprikapulver", "Curry", "Zimt", "Oregano", "Muskat", "Kümmel",
        "Chilipulver", "Kurkuma", "Knoblauchpulver", "Lorbeer", "Vanille", "Majoran",
    ],
    "Brühe": ["Gemüsebrühe", "Hühnerbrühe", "Rinderbrühe", "Fond"],
    "Müsli": ["Knuspermüsli", "Cornflakes", "Granola", "Porridge"],
    "Marmelade": [
        "Erdbeermarmelade", "Aprikosenmarmelade", "Kirschmarmelade", "Orangenmarmelade",
        "Himbeermarmelade",
    ],
    "Honig": ["Blütenhonig", "Waldhonig", "Ahornsirup"],
    "Nussaufstrich": ["Nuss-Nougat-Creme", "Erdnussbutter", "Mandelmus"],
    "Schokolade": [
        "Vollmilchschokolade", "Zartbitterschokolade", "Weiße Schokolade", "Schokoriegel", "Pralinen",
    ],
    "Kekse": ["Butterkekse", "Schokokekse", "Lebkuchen", "Gummibärchen", "Cracker", "Salzstangen"],
    "Chips": ["Kartoffelchips", "Paprikachips", "Popcorn"],
    "Nüsse": [
        "Mandeln", "Walnüsse", "Haselnüsse", "Erdnüsse", "Cashewkerne", "Pistazien",
        "Studentenfutter", "Rosinen",
    ],
    "Wasser": ["Mineralwasser", "Sprudel", "Stilles Wasser"],
    "Saft": ["Apfelsaft", "Orangensaft", "Multivitaminsaft", "Traubensaft", "Apfelschorle", "Limonade", "Cola"],
    "Kaffee": ["Kaffeebohnen", "Gemahlener Kaffee", "Kaffeekapseln", "Instantkaffee"],
    "Tee": ["Schwarztee", "Grüntee", "Kräutertee", "Früchtetee", "Kamillentee", "Pfefferminztee"],
    "Gemüse TK": ["Blattspinat", "Erbsen und Möhren", "Gemüsemischung", "Pommes frites", "Rosenkohl", "Beerenmischung"],
    "Fleisch & Fisch TK": ["Fischstäbchen", "Hähnchen-Nuggets", "Backfisch", "Hackbällchen"],
    "Pizza": ["Salamipizza", "Pizza Margherita", "Flammkuchen"],
    "Eis": ["Vanilleeis", "Schokoladeneis", "Eis am Stiel", "Sorbet"],
    "Spülmittel": ["Handspülmittel", "Spülmaschinentabs", "Klarspüler", "Spülmaschinensalz"],
    "Papier": ["Toilettenpapier", "Küchenrolle", "Taschentücher", "Servietten", "Backpapier"],
}  # fmt: skip

# Recipe units: (name, symbol, base unit name, factor, is_count). Count units without a base count
# packages ("1 Bund Petersilie", "1 Dose Tomaten"); EL/TL convert to ml and otherwise count packages
# too ("1 TL Salz" = any salt in stock).
_DE_RECIPE_UNITS = [
    ("Bund", "Bund", None, 1, 1),
    ("Prise", "Prise", None, 1, 1),
    ("Messerspitze", "Msp.", None, 1, 1),
    ("Esslöffel", "EL", "ml", 15, 1),
    ("Teelöffel", "TL", "ml", 5, 1),
    ("Zehe", "Zehe", None, 1, 1),
    ("Scheibe", "Scheibe", None, 1, 1),
    ("Stange", "Stange", None, 1, 1),
    ("Blatt", "Blatt", None, 1, 1),
    ("Dose", "Dose", None, 1, 1),
    ("Glas", "Glas", None, 1, 1),
    ("Becher", "Becher", None, 1, 1),
]

# Seeded category -> unit (names), where the inherited unit does not fit (default: Stück).
# Recipes show kg/l in their base unit (g/ml). Set only where a category has no own unit yet.
_DE_UNITS: dict[str, str] = {
    # sub-categories
    "Kräuter": "Bund", "Kartoffeln": "kg", "Milch": "l", "Joghurt": "g", "Käse": "g", "Butter": "g",
    "Fleisch": "g", "Aufschnitt": "g", "Fisch": "g", "Backmischungen": "Packung", "Hefe": "g",
    "Gemüsekonserven": "g", "Tomaten": "g", "Suppen": "ml", "Fertiggerichte": "Packung",
    "Öl": "l", "Essig": "l", "Saucen": "ml", "Gewürze": "g", "Brühe": "g", "Müsli": "g",
    "Marmelade": "g", "Honig": "g", "Nussaufstrich": "g", "Schokolade": "g", "Kekse": "g",
    "Chips": "g", "Nüsse": "g", "Kaffee": "g", "Tee": "Packung", "Gemüse TK": "g",
    "Fleisch & Fisch TK": "g", "Eis": "ml", "Haushalt & Drogerie": "Packung",
    # product types that differ from their sub-category
    "Erdbeeren": "g", "Himbeeren": "g", "Heidelbeeren": "g", "Trauben": "g", "Kirschen": "g",
    "Champignons": "g", "Spinat": "g", "Ingwer": "g",
    "Sahne": "ml", "Schlagsahne": "ml", "Kochsahne": "ml", "Kondensmilch": "g",
    "Saure Sahne": "g", "Crème fraîche": "g", "Schmand": "g",
    "Bratwurst": "Stück", "Wiener Würstchen": "Stück",
    "Vanillezucker": "Packung", "Kakaopulver": "g", "Kuvertüre": "g", "Trockenhefe": "Packung",
    "Kokosmilch": "ml", "Butterschmalz": "g", "Senf": "g", "Mayonnaise": "g", "Pesto": "g",
    "Lorbeer": "Blatt", "Gelatine": "Blatt", "Vanille": "Stück", "Fond": "ml", "Ahornsirup": "ml",
    "Schokoriegel": "Stück", "Kaffeekapseln": "Stück", "Pizza": "Stück", "Eis am Stiel": "Stück",
    "Handspülmittel": "ml", "Klarspüler": "ml", "Spülmaschinentabs": "Stück",
    "Spülmaschinensalz": "kg",
}  # fmt: skip


def add_seed_extras(conn: sqlite3.Connection) -> None:
    """Insert the recipe units and product types missing in this DB, then the default units
    (`_DE_UNITS`); the caller commits.

    Only under a parent that exists by exact name, and only when no category has the type's
    name yet, so renames and deletions by the user are respected and nothing is added twice.
    """
    if not conn.execute("SELECT 1 FROM unit").fetchone():
        return  # new DB (migration 8 runs before the seed): seed() calls this after the base data
    for name, symbol, base, factor, is_count in _DE_RECIPE_UNITS:
        conn.execute(
            "INSERT INTO unit (name, symbol, base_unit_id, factor, is_count)"
            " SELECT ?, ?, (SELECT id FROM unit WHERE name = ?), ?, ?"
            " WHERE NOT EXISTS (SELECT 1 FROM unit WHERE name = ?)",
            (name, symbol, base, factor, is_count, name),
        )
    for parent, names in _DE_TYPES.items():
        row = conn.execute(
            "SELECT id FROM category WHERE name = ? ORDER BY id", (parent,)
        ).fetchone()
        if row is None:
            continue
        for sort, name in enumerate(names):
            if not conn.execute("SELECT 1 FROM category WHERE name = ?", (name,)).fetchone():
                conn.execute(
                    "INSERT INTO category (parent_id, name, sort) VALUES (?, ?, ?)",
                    (row[0], name, sort),
                )
    for name, unit in _DE_UNITS.items():  # only where no own unit is set yet
        conn.execute(
            "UPDATE category SET unit_id = (SELECT id FROM unit WHERE name = ?)"
            " WHERE name = ? AND unit_id IS NULL AND EXISTS (SELECT 1 FROM unit WHERE name = ?)",
            (unit, name, unit),
        )
