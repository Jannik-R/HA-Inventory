"""Typical shelf life (days from purchase) and days after opening for seeded categories. Data only.

shelf_days guesses an expiry date that was not entered (today + days); opened_days shortens it
once a package is opened. Values go on the highest level that fits; product types only where
they differ from their sub-category (H-Milch vs. Frischmilch). No value: no guess / opening
changes nothing (dry goods, non-food, medicine always has a printed date).
"""

import sqlite3

# category name -> (shelf_days, opened_days); None leaves the column alone.
_DE_DAYS: dict[str, tuple[int | None, int | None]] = {
    # Obst & Gemüse
    "Obst & Gemüse": (7, None),
    "Kräuter": (5, None),
    "Kartoffeln": (30, None),
    "Äpfel": (30, None),
    "Birnen": (14, None),
    "Orangen": (14, None),
    "Mandarinen": (14, None),
    "Zitronen": (21, None),
    "Limetten": (21, None),
    "Bananen": (5, None),
    "Avocado": (5, None),
    "Erdbeeren": (3, None),
    "Himbeeren": (3, None),
    "Heidelbeeren": (5, None),
    "Schattenmorellen": (365, 7),
    "Preiselbeeren": (365, 21),
    "Zwiebeln": (30, None),
    "Schalotten": (30, None),
    "Knoblauch": (30, None),
    "Karotten": (14, None),
    "Rote Bete": (14, None),
    "Rotkohl": (21, None),
    "Weißkohl": (21, None),
    "Kürbis": (60, None),
    "Süßkartoffeln": (21, None),
    "Ingwer": (21, None),
    "Salat": (4, None),
    "Spinat": (3, None),
    "Champignons": (4, None),
    # Brot & Backwaren
    "Brot & Backwaren": (5, None),
    "Brötchen": (2, None),
    "Knäckebrot": (180, 30),
    "Toastbrot": (7, None),
    "Tortillas": (30, 5),
    "Aufbackbrötchen": (30, None),
    # Milchprodukte & Eier
    "Milchprodukte & Eier": (10, 3),
    "H-Milch": (90, 3),
    "Hafermilch": (180, 5),
    "Sojamilch": (180, 5),
    "Mandelmilch": (180, 5),
    "Kondensmilch": (180, 7),
    "Sahne": (14, 3),
    "Schlagsahne": (14, 3),
    "Kochsahne": (90, 4),
    "Saure Sahne": (21, 5),
    "Crème fraîche": (21, 5),
    "Schmand": (21, 5),
    "Joghurt": (21, 5),
    "Quark": (21, 4),
    "Magerquark": (21, 4),
    "Käse": (30, 14),
    "Mozzarella": (21, 2),
    "Frischkäse": (30, 7),
    "Mascarpone": (21, 3),
    "Ricotta": (14, 3),
    "Feta": (60, 5),
    "Halloumi": (90, 5),
    "Camembert": (21, 7),
    "Reibekäse": (30, 7),
    "Schmelzkäse": (120, 14),
    "Parmesan": (90, 30),
    "Butter": (60, 21),
    "Margarine": (60, 30),
    "Eier": (21, None),
    # Fleisch, Wurst & Fisch
    "Fleisch, Wurst & Fisch": (3, 1),
    "Hackfleisch": (1, 1),
    "Aufschnitt": (14, 4),
    "Salami": (30, 14),
    "Speck": (30, 7),
    "Bratwurst": (7, 2),
    "Fisch": (2, 1),
    "Räucherlachs": (14, 2),
    "Thunfisch": (730, 2),
    # Nudeln, Reis & Getreide (dry: opening changes nothing)
    "Nudeln, Reis & Getreide": (365, None),
    "Nudeln": (730, None),
    "Reis": (730, None),
    "Tortellini": (21, 2),
    "Gnocchi": (21, 2),
    "Spätzle": (21, 2),
    # Backen
    "Backen": (365, None),
    "Zucker": (1095, None),
    "Speisestärke": (730, None),
    "Frischhefe": (14, None),
    "Blätterteig": (21, 1),
    # Konserven & Fertiggerichte
    "Konserven & Fertiggerichte": (730, None),
    "Gemüsekonserven": (730, 3),
    "Gewürzgurken": (730, 30),
    "Sauerkraut": (365, 7),
    "Oliven": (730, 14),
    "Kapern": (730, 60),
    "Tomaten": (730, 5),
    "Tomatenmark": (730, 7),
    "Getrocknete Tomaten": (365, 14),
    "Suppen": (730, 3),
    "Fertiggerichte": (365, None),
    "Ravioli": (730, 3),
    "Chili con Carne": (730, 3),
    "Eintopf": (730, 3),
    # Öle, Saucen & Gewürze
    "Öle, Saucen & Gewürze": (365, None),
    "Öl": (365, 90),
    "Essig": (1095, None),
    "Saucen": (365, 30),
    "Gewürze": (730, None),
    # Frühstück & Aufstriche
    "Frühstück & Aufstriche": (365, None),
    "Müsli": (365, 90),
    "Marmelade": (365, 28),
    "Honig": (730, None),
    "Nussaufstrich": (365, 90),
    # Süßes & Snacks
    "Süßes & Snacks": (180, None),
    "Schokolade": (365, None),
    "Kekse": (180, 30),
    "Chips": (120, 7),
    "Nüsse": (270, 60),
    # Getränke
    "Getränke": (365, None),
    "Wasser": (365, 3),
    "Saft": (365, 5),
    "Kaffee": (365, 60),
    "Tee": (730, None),
    "Alkohol": (1095, None),
    # Tiefkühlkost
    "Tiefkühlkost": (180, None),
    "Eis": (365, None),
    # Eingekochtes (shelf_days 365 comes from seed_general)
    "Obst & Kompott": (None, 7),
    "Marmelade & Gelee": (None, 28),
    "Gemüse & Eingelegtes": (None, 14),
    "Soßen & Suppen": (None, 4),
    "Fleisch & Wurst": (None, 3),
}


def fill_days(conn: sqlite3.Connection) -> None:
    """Set the values above where a category of that name is unique and has none of its own."""
    for name, (shelf, opened) in _DE_DAYS.items():
        conn.execute(
            "UPDATE category SET shelf_days = ifnull(shelf_days, ?),"
            " opened_days = ifnull(opened_days, ?)"
            " WHERE name = ? AND (SELECT count(*) FROM category WHERE name = ?) = 1",
            (shelf, opened, name, name),
        )
