"""Fill an EMPTY dev database with a small demo household (dev only, never shipped).

Goes through the `inventory` business layer, so it breaks (and tests/test_demo_data.py with it)
when a signature changes. Stop the dev HA first (it caches the data), start it again afterwards:
see README.md, Development.

    python dev/demo_data.py [path/to/home_inventory.db]
"""

from __future__ import annotations

import sqlite3
import sys
from datetime import date, timedelta
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

from custom_components.home_inventory import inventory as inv  # noqa: E402
from custom_components.home_inventory.db import connect  # noqa: E402

# name, brand, category, (content, unit), min packages, location, packages, days until expiry
# (None: no date). Names avoid the products that frontend/e2e/screenshots.docs.ts creates itself.
K, V, G = "Kühlschrank", "Vorratsschrank", "Gefrierschrank"
PRODUCTS = [
    ("Landmilch 3,5 %", "Hofglück", "Milch", (1, "l"), 2, K, 3, 6),
    ("Süßrahmbutter", "Hofglück", "Butter", (250, "g"), None, K, 2, 25),
    ("Eier Freiland", "Hofglück", "Eier", (10, "Stück"), 1, K, 1, 12),
    ("Griechischer Joghurt", "Hofglück", "Naturjoghurt", (500, "g"), None, K, 1, -3),
    ("Gemüsewurst", "Metzgerei Müller", "Fleisch", (200, "g"), None, K, 1, 2),
    ("Hackfleisch gemischt", "Metzgerei Müller", "Fleisch", (500, "g"), None, K, 2, 3),
    ("Rahmspinat", "Frostfix", "Gemüse TK", (450, "g"), None, G, 2, 200),
    ("Penne rigate", "Pastaro", "Spaghetti", (500, "g"), 2, V, 4, 500),
    ("Langkornreis", "Reisfeld", "Basmatireis", (1, "kg"), None, V, 2, 600),
    ("Rote Linsen", "Hülsenhof", "Rote Linsen", (500, "g"), None, V, 3, 450),
    ("Haferflocken zart", "Mühlenkorn", "Müsli", (500, "g"), None, V, 4, 300),
    ("Weizenmehl Type 405", "Mühlenkorn", "Mehl", (1, "kg"), None, V, 2, 240),
    ("Sonnenblumenöl", "Ölmühle", "Öl", (1, "l"), None, V, 2, 400),
    ("Mineralwasser still", "Quellfrisch", "Mineralwasser", (1.5, "l"), 6, V, 12, 700),
    ("Kidneybohnen", "Hülsenhof", "Gemüsekonserven", (400, "g"), None, V, 4, 800),
    ("Gehackte Tomaten", "Sonnenfeld", "Tomaten", (400, "g"), None, V, 6, 30),
    ("Zwiebeln", None, "Zwiebeln", (1, "kg"), None, V, 1, 20),
    ("Kartoffeln festkochend", None, "Kartoffeln", (2.5, "kg"), None, V, 1, 14),
    ("Walnusskerne", "Nusshain", "Nüsse", (200, "g"), None, V, 3, 200),
    ("Batterien AA", "Powerzelle", "Batterien", (4, "Stück"), 2, V, 1, None),
]
# name, servings, ingredients (category, amount, unit, note), steps
RECIPES = [
    (
        "Spaghetti mit Tomatensoße",
        2,
        [
            ("Spaghetti", 250, "g", None),
            ("Tomaten", 400, "g", None),
            ("Zwiebeln", 1, "Stück", "fein gewürfelt"),
            ("Knoblauch", 2, "Zehe", None),
        ],
        [
            "Spaghetti in Salzwasser 10 Minuten kochen.",
            "Zwiebel und Knoblauch dünsten, Tomaten dazugeben.",
            "Die Soße 15 Minuten köcheln lassen und mit den Nudeln servieren.",
        ],
    ),
    (
        "Linsen-Dal mit Reis",
        4,
        [
            ("Rote Linsen", 250, "g", None),
            ("Zwiebeln", 1, "Stück", None),
            ("Kartoffeln", 300, "g", None),
        ],
        [
            "Zwiebel und Kartoffeln würfeln und andünsten.",
            "Linsen und 1 l Wasser dazugeben, 20 Minuten kochen.",
        ],
    ),
    (
        "Haferbrei",
        2,
        [("Müsli", 100, "g", None), ("Milch", 400, "ml", None)],
        ["Milch erhitzen, Haferflocken einrühren und 5 Minuten quellen lassen."],
    ),
    (
        "Rührei",
        2,
        [("Eier", 4, "Stück", None), ("Butter", 20, "g", None)],
        ["Eier verquirlen, in Butter stocken lassen."],
    ),
    (
        "Gebratener Reis",
        2,
        [
            ("Basmatireis", 200, "g", None),
            ("Eier", 2, "Stück", None),
            ("Zwiebeln", 1, "Stück", None),
        ],
        [
            "Reis 12 Minuten kochen und abkühlen lassen.",
            "Zwiebel anbraten, Reis und Eier unterrühren.",
        ],
    ),
]
# day of the week (0 = Monday), slot (0 breakfast, 1 lunch, 3 dinner), recipe or free text
PLAN = [(0, 3, "Spaghetti mit Tomatensoße"), (1, 0, "Haferbrei"), (1, 3, "Linsen-Dal mit Reis"),
        (2, 3, "Gebratener Reis"), (3, 0, "Rührei"), (4, 3, "Brotzeit"), (5, 1, "Essen bei Oma")]  # fmt: skip


def _ean(body: str) -> str:
    """EAN-13 with check digit from 12 digits (the 200-299 range is for in-store use)."""
    return body + str(
        (10 - sum(int(c) * (3 if i % 2 else 1) for i, c in enumerate(body)) % 10) % 10
    )


def fill(conn: sqlite3.Connection, today: date | None = None) -> None:
    """Create the demo household in an empty DB; raises SystemExit when it already holds data."""
    if conn.execute("SELECT 1 FROM product UNION SELECT 1 FROM batch").fetchone():
        raise SystemExit(
            "The database already has products or stock; demo data needs an empty one."
        )
    today = today or date.today()
    day = lambda n: today + timedelta(days=n)  # noqa: E731
    row = lambda sql, name: conn.execute(sql, (name,)).fetchone()[0]  # noqa: E731
    cat = lambda n: row("SELECT id FROM category WHERE name = ?", n)  # noqa: E731
    unit = lambda n: row("SELECT id FROM unit WHERE name = ?", n)  # noqa: E731
    loc = lambda n: row("SELECT id FROM location WHERE name = ?", n)  # noqa: E731
    ids: dict[str, int] = {}
    for i, (name, brand, category, (amount, u), min_pk, where, pk, exp) in enumerate(PRODUCTS):
        product = {"name": name, "brand": brand, "category_id": cat(category),
                   "content_amount": amount, "content_unit_id": unit(u), "min_packages": min_pk,
                   "ean": _ean(f"200{i:09d}")}  # fmt: skip
        ids[name] = inv.book_in_new(conn, product, pk, location_id=loc(where),
                                    expires_on=day(exp) if exp is not None else None, today=today)["product_id"]  # fmt: skip
    # states: one opened package, one frozen, one below the minimum (Batterien AA: 1 of 2)
    inv.open_package(conn, ids["Landmilch 3,5 %"], today=today)
    inv.freeze(conn, ids["Hackfleisch gemischt"], 1, today=today)
    recipe_ids = {}
    for name, servings, ingredients, steps in RECIPES:
        recipe_ids[name] = inv.save_recipe(conn, {"name": name, "servings": servings,
            "ingredients": [{"category_id": cat(c), "amount": a, "unit_id": unit(u), "note": n}
                            for c, a, u, n in ingredients],
            "steps": [{"text": s} for s in steps]})  # fmt: skip
    monday = today - timedelta(days=today.weekday())
    for offset, slot, text in PLAN:
        inv.save_meal(conn, {"day": day((monday - today).days + offset).isoformat(), "slot": slot,
            "servings": 2, "recipe_id": recipe_ids.get(text), "text": "" if text in recipe_ids else text})  # fmt: skip
    inv.add_shopping_item(conn, 2, product_id=ids["Batterien AA"])
    inv.add_shopping_item(conn, 1, product_id=ids["Landmilch 3,5 %"])
    inv.add_shopping_item(conn, 3, category_id=cat("Obst"))
    inv.save_canning(conn, {"made_on": day(-30), "jars": 6, "location_id": loc(V), "temp": 90,
        "minutes": 25, "expires_on": day(330),
        "product": {"name": "Pflaumenmus", "category_id": cat("Marmelade & Gelee")}})  # fmt: skip
    # history looks lived in, and the guide screenshot "only today's bookings" stays small
    conn.execute("UPDATE booking SET ts = strftime('%Y-%m-%dT%H:%M:%S+00:00', ts, '-2 days')")
    conn.commit()


if __name__ == "__main__":
    path = sys.argv[1] if len(sys.argv) > 1 else str(ROOT / "dev/config/home_inventory.db")
    if not Path(path).exists():
        sys.exit(f"{path} not found: start the dev HA once so it creates the database.")
    fill(connect(path))
    print(f"Demo data written to {path}. Start the dev HA again.")
