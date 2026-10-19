"""Open Food Facts parsing, category suggestion and lookup (HTTP mocked)."""

import json
from unittest.mock import AsyncMock, patch

import pytest
from homeassistant.core import HomeAssistant

from custom_components.home_inventory import inventory as inv
from custom_components.home_inventory import off
from custom_components.home_inventory.const import CONF_OFF
from custom_components.home_inventory.db import Database
from custom_components.home_inventory.inventory.inherit import category_tags

from .test_inventory import cat, product

SPAGHETTI = {
    "code": "8076800195057",
    "brands": "Barilla",
    "categories_tags": [
        "en:plant-based-foods-and-beverages",
        "en:cereals-and-potatoes",
        "en:pastas",
        "en:spaghetti",
    ],
    "image_front_small_url": "https://images.example/spaghetti.jpg",
    "product_name": "Spaghetti Nº5",
    "product_name_de": "Spaghetti No. 5",
    "product_quantity": 500,
    "product_quantity_unit": "g",
    "quantity": "500 g",
}


@pytest.mark.parametrize(
    ("amount", "unit", "text", "expected"),
    [
        (500, "g", "500 g", (500, "g")),
        ("1.5", "L", None, (1.5, "l")),
        (None, None, "6 x 1,5 l", (9, "l")),
        (None, None, "33 cl", (330, "ml")),
        (None, None, "250mg", (0.25, "g")),
        (0, "g", "4 Stück", None),
        (None, None, None, None),
        (670, "g", "670g/370g", (370, "g")),
        (400, "g", "400 g (Abtropfgewicht: 240 g)", (240, "g")),
        (None, None, "Füllmenge 0,5 kg, égoutté 0,3 kg", (300, "g")),
        (1000, "g", "500g/1kg", (1000, "g")),
    ],
)
def test_parse_quantity(amount, unit, text, expected):
    assert off.parse_quantity(amount, unit, text) == expected


def test_normalize_prefers_language_name():
    n = off.normalize({**SPAGHETTI, "brands": "Barilla, Barilla G. e R."}, "de")
    assert (n["name"], n["brand"], n["quantity"]) == (
        "Spaghetti No. 5",
        "Barilla",
        (500, "g"),
    )
    assert off.normalize({"code": "1", "product_name": " X "}, "de")["name"] == "X"


def test_suggest_category(conn):
    assert inv.suggest_category(conn, SPAGHETTI["categories_tags"]) == cat(conn, "Nudeln")
    assert inv.suggest_category(conn, ["en:beverages", "en:colas"]) == cat(conn, "Getränke")
    # Same depth: the more specific (later) OFF tag wins.
    tags = ["en:meals", "en:durum-wheat-semolinas-for-couscous"]
    assert inv.suggest_category(conn, tags) == cat(conn, "Couscous")
    assert inv.suggest_category(conn, ["en:unknown"]) is None


@pytest.mark.parametrize(
    ("word", "keyword", "expected"),
    [
        ("cornichons", "cornichon", 19),  # whole word incl. plural
        ("tomatensauce", "sauce", 10),  # compound head
        ("tomatensauce", "tomate", 8),  # compound start
        ("weißwein", "eis", None),  # inside a word: no match
    ],
)
def test_keyword_score(word, keyword, expected):
    assert inv.keyword_score(word, keyword) == expected


@pytest.mark.parametrize(
    ("name", "category"),
    [
        ("Cornichons", "Gemüsekonserven"),
        ("Feine Gewürzgurken", "Gewürzgurken"),
        ("Tomatensauce Basilikum", "Tomatensauce"),
        ("Erdbeerkonfitüre extra", "Marmelade"),
        ("Milchreis", "Milchreis"),
        ("Joghurt Erdbeere", "Joghurt"),
        ("Erdnussbutter crunchy", "Erdnussbutter"),
        ("Weißlack trocken", None),
        ("Chiliflocken", "Chiliflocken"),
        ("Pfifferlinge", "Pfifferlinge"),
        ("Cointreau", "Cointreau"),
        ("Baileys Irish Cream", "Baileys Irish Cream"),
        ("Tabasco", "Tabasco"),
        ("Rumpsteak", "Rumpsteak"),  # not Rum
        ("Schweinebauch", "Schweinebauch"),  # not Wein
        ("Ginger Ale", "Ginger Ale"),  # not Gin
    ],
)
def test_suggest_by_keywords(conn, name, category):
    expected = cat(conn, category) if category else None
    assert inv.suggest_by_keywords(conn, name) == expected


def test_suggest_falls_back_to_similar_names(conn):
    assert inv.suggest(conn, [], "Viva las tapas") is None
    inv.save(
        conn,
        "product",
        {"name": "Tapas Mix", "category_id": cat(conn, "Fertiggerichte")},
    )
    assert inv.suggest(conn, [], "Viva las tapas") == cat(conn, "Fertiggerichte")
    # OFF tags and keywords come first.
    assert inv.suggest(conn, ["en:pastas"], "Tapas") == cat(conn, "Nudeln")
    assert inv.suggest(conn, [], "Tapas Oliven") == cat(conn, "Oliven")


def test_product_draft(conn):
    draft = inv.product_draft(conn, off.normalize(SPAGHETTI, "de"))
    g = conn.execute("SELECT id FROM unit WHERE symbol = 'g'").fetchone()["id"]
    assert draft["category_id"] == cat(conn, "Nudeln")
    assert (draft["content_amount"], draft["content_unit_id"]) == (500, g)
    assert inv.find_ean(conn, SPAGHETTI["code"]) is None  # draft is not saved


def test_add_product_learns_tag(conn):
    raw = {"categories_tags": ["en:foods", "nl:kimchi"]}
    data = {
        "name": "Kimchi",
        "category_id": cat(conn, "Gemüse"),
        "off_json": json.dumps(raw),
    }
    inv.add_product(conn, data)
    assert inv.suggest_category(conn, raw["categories_tags"]) == cat(conn, "Gemüse")
    # A matching product does not add tags.
    before = category_tags(conn)
    inv.add_product(
        conn,
        {
            "name": "S",
            "category_id": cat(conn, "Nudeln"),
            "off_json": json.dumps(SPAGHETTI),
        },
    )
    assert category_tags(conn) == before


def test_search_products(conn):
    product(conn, "Spaghetti", brand="Barilla", ean="12345678")
    product(conn, "100% Saft", category="Saft")
    assert [p["name"] for p in inv.search_products(conn, "bari")] == ["Spaghetti"]
    assert [p["name"] for p in inv.search_products(conn, "%")] == ["100% Saft"]
    assert inv.search_products(conn, "_") == []
    assert inv.search_products(conn, " ") == []
    product(conn, "Früchte-Müsli", category="Müsli")
    assert [p["name"] for p in inv.search_products(conn, "MÜSLI")] == ["Früchte-Müsli"]


def test_add_product_without_learnable_data(conn):
    inv.add_product(conn, {"name": "A", "category_id": cat(conn, "Obst"), "off_json": "x"})
    inv.add_product(conn, {"name": "B", "category_id": cat(conn, "Obst"), "off_json": "[]"})
    assert inv.search_products(conn, "a")[0]["name"] == "A"


async def test_async_lookup(hass: HomeAssistant, aioclient_mock, tmp_path) -> None:
    hass.config.language = "de"
    database = Database(hass, str(tmp_path / "home_inventory.db"))
    await database.async_open()
    url = f"{off.BASE}/api/v2/product/"
    aioclient_mock.get(url + "8076800195057", json={"status": 1, "product": SPAGHETTI})
    aioclient_mock.get(url + "40400000", status=404, json={"status": 0})
    aioclient_mock.get(url + "50000000", status=500)
    other = "product found with a different product type: product"
    aioclient_mock.get(
        url + "4005900512178", status=404, json={"status": 0, "status_verbose": other}
    )
    lotion = {"code": "4005900512178", "product_name": "Body Lotion", "brands": "Nivea"}
    aioclient_mock.get(
        f"{off.SITES['product']}/api/v2/product/4005900512178",
        json={"status": 1, "product": lotion},
    )

    draft = await off.async_lookup(hass, database, "8076800195057")
    assert draft["name"] == "Spaghetti No. 5" and "id" not in draft
    assert await off.async_lookup(hass, database, "40400000") is None
    assert (await off.async_lookup(hass, database, "4005900512178"))["name"] == "Body Lotion"
    with pytest.raises(inv.InventoryError, match="off_unavailable"):
        await off.async_lookup(hass, database, "50000000")
    for bad in ("123", "../../x", "12345678?a=b"):
        with pytest.raises(inv.InventoryError, match="invalid_ean"):
            await off.async_lookup(hass, database, bad)

    await database.run(inv.add_product, draft)
    calls = aioclient_mock.call_count
    assert (await off.async_lookup(hass, database, "8076800195057"))["id"]
    assert aioclient_mock.call_count == calls  # local hit, no request
    with patch.object(off, "options_of", return_value={CONF_OFF: False}):
        assert await off.async_lookup(hass, database, "40400000") is None
        assert await off.async_search(hass, "Spaghetti") == []
    assert aioclient_mock.call_count == calls  # lookup off: nothing sent
    await database.async_close()


async def test_async_search(hass: HomeAssistant, aioclient_mock) -> None:
    products = [
        {"code": "1", "product_name": "A"},
        {"code": "2"},
        {"product_name": "C"},
    ]
    aioclient_mock.get(f"{off.BASE}/cgi/search.pl", json={"products": products})
    beauty = [{"code": "9", "product_name": "Duschgel"}, {"code": "1", "product_name": "A2"}]
    aioclient_mock.get(f"{off.SITES['beauty']}/cgi/search.pl", json={"products": beauty})
    aioclient_mock.get(f"{off.SITES['product']}/cgi/search.pl", status=500)  # left out
    aioclient_mock.get(f"{off.SITES['petfood']}/cgi/search.pl", json={})
    assert await off.async_search(hass, "  ") == []
    assert aioclient_mock.call_count == 0
    with patch.object(off, "asyncio") as aio:  # only off's asyncio, not HA's loop
        sleep = aio.sleep = AsyncMock()
        hits = await off.async_search(hass, "a")
        await off.async_search(hass, "b")  # right after: waits for its slot
    assert [h["ean"] for h in hits] == ["1", "9"]  # food first, duplicates once
    assert sleep.call_args_list[-1].args[0] > off.SEARCH_INTERVAL - 1


def test_normalize_survives_odd_fields():
    p = {"code": 4006040053026, "product_name": 5, "product_name_de": None, "generic_name_de": " Brot ",
         "brands": ["a"], "categories_tags": "en:x", "image_front_small_url": {}}  # fmt: skip
    out = off.normalize(p, "de")
    assert out["name"] == "Brot" and out["brand"] is None and out["ean"] == "4006040053026"
    assert out["off_tags"] == [] and out["image_url"] is None
    assert off.normalize({"categories_tags": ["en:a", 3]}, "de")["off_tags"] == ["en:a"]
