"""Recipe export as schema.org JSON-LD: fields, steps, legacy text, round trip through the import."""

import json

from custom_components.home_inventory import inventory as inv

from .test_websocket import ws  # noqa: F401  (fixture)


def _make(conn, **extra):
    g = conn.execute("SELECT id FROM unit WHERE symbol = 'g'").fetchone()["id"]
    nudeln = conn.execute("SELECT id FROM category WHERE name = 'Nudeln'").fetchone()["id"]
    data = {
        "name": "Pasta",
        "servings": 2,
        "source_url": "https://example.com/pasta",
        "ingredients": [
            {"category_id": nudeln, "amount": 250, "unit_id": g, "note": "dünne"},
            {"text": "Salz", "optional": True},
        ],
        "steps": [
            {"text": "Wasser kochen."},
            {"section": "Soße", "text": "Rühren."},
            {"text": "Servieren."},
        ],
    }
    return inv.save_recipe(conn, data | extra)


def test_export_fields_and_round_trip(conn):
    ld = inv.recipe_jsonld(conn, _make(conn))
    assert ld["@type"] == "Recipe" and ld["name"] == "Pasta" and ld["recipeYield"] == "2"
    assert ld["isBasedOn"] == "https://example.com/pasta"
    assert ld["recipeIngredient"] == ["250 g Nudeln (dünne)", "Salz (optional)"]
    assert [s["@type"] for s in ld["recipeInstructions"]] == ["HowToStep", "HowToSection"]
    assert len(ld["recipeInstructions"][1]["itemListElement"]) == 2
    page = f'<script type="application/ld+json">{json.dumps(ld)}</script>'
    draft = inv.recipe_import(conn, page, "https://example.com/back")
    assert draft["name"] == "Pasta" and draft["servings"] == 2
    assert [(s["section"], s["text"]) for s in draft["steps"]] == [
        (None, "Wasser kochen."), ("Soße", "Rühren."), (None, "Servieren."),
    ]  # fmt: skip
    first = draft["ingredients"][0]
    assert first["amount"] == 250 and first["note"] == "dünne"


def test_legacy_instructions_and_all(conn):
    rid = inv.save_recipe(conn, {"name": "Alt", "servings": 1, "ingredients": []})
    conn.execute("UPDATE recipe SET instructions = 'Eins\nZwei' WHERE id = ?", (rid,))
    ld = inv.recipe_jsonld(conn, rid)
    assert [s["text"] for s in ld["recipeInstructions"]] == ["Eins", "Zwei"]
    _make(conn)
    assert [r["name"] for r in inv.recipes_jsonld(conn)] == ["Alt", "Pasta"]


async def test_ws_export(hass, ws):  # noqa: F811
    entry = hass.config_entries.async_entries("home_inventory")[0]
    rid = await entry.runtime_data.run(
        inv.save_recipe, {"name": "X", "servings": 2, "ingredients": []}
    )
    one = await ws.call({"type": "home_inventory/recipe_export", "recipe_id": rid})
    assert one["result"]["name"] == "X"
    assert len((await ws.call({"type": "home_inventory/recipe_export"}))["result"]) == 1
