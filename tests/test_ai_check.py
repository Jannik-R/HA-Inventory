"""AI check of recipe imports: prompt, answer validation, learned categories, websocket."""

import json
from types import SimpleNamespace
from unittest.mock import AsyncMock, patch

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.setup import async_setup_component
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.home_inventory import inventory as inv
from custom_components.home_inventory.const import CONF_AI_TASK, DOMAIN
from custom_components.home_inventory.inventory.learned import learned

from .test_inventory import cat, unit
from .test_off import SPAGHETTI


def draft(conn, **kw):
    return {
        "name": "Gelee",
        "servings": 4,
        "steps": [{"text": "Alles kochen. Dann abfüllen.", "section": None}],
        "ingredients": [
            {"text": "Zucker", "line": "500 g Zucker", "category_id": cat(conn, "Zucker")},
            {"text": "Wasser", "line": "1 l Wasser", "category_id": None, "learned": True},
        ],
        **kw,
    }


def test_prompt_puts_the_fixed_part_first_and_only_food(conn):
    text = inv.ai_prompt(conn, draft(conn))
    head, body = text.split("Recipe draft:\n")
    assert f"{cat(conn, 'Zucker')} Zucker" in head
    assert "Batterien" not in head  # non-food tree left out
    recipe = json.loads(body)
    assert recipe["ingredients"][0]["category"] == "Zucker"
    assert recipe["ingredients"][1] == {
        "index": 1,
        "line": "1 l Wasser",
        "amount": None,
        "unit": None,
        "note": None,
        "category_id": 0,
        "category": None,
        "learned": True,
    }
    # the fixed part does not depend on the draft (prompt caching)
    assert inv.ai_prompt(conn, draft(conn, name="Anders")).startswith(head)


def test_changes_keep_only_valid_real_ones(conn):
    d = draft(conn)
    fine = inv.ai_changes(conn, d, {"ok": True})
    assert fine == {"ok": True}
    answer = {
        "ok": False,
        "ingredients": [
            {"index": 0, "category_id": cat(conn, "Zucker")},  # no change
            {"index": 1, "category_id": cat(conn, "Haushaltszucker"), "reason": "Zucker"},
            {"index": 1, "category_id": 1},  # second answer for the same row
            {"index": 7, "category_id": cat(conn, "Zucker")},  # no such row
            {"index": 0, "category_id": 999999},  # not in the tree
        ],
        "steps": [
            {"text": "Alles kochen.", "section": "Kochen"},
            {"text": " Dann abfüllen. ", "section": "Kochen"},
            {"text": " "},
        ],
    }
    assert inv.ai_changes(conn, d, answer) == {
        "ok": False,
        "ingredients": [
            {"index": 1, "category_id": cat(conn, "Haushaltszucker"), "reason": "Zucker"}
        ],
        # one section for everything is no section
        "steps": [
            {"text": "Alles kochen.", "section": None},
            {"text": "Dann abfüllen.", "section": None},
        ],
    }
    batteries = cat(conn, "Batterien")
    assert inv.ai_changes(
        conn, d, {"ok": False, "ingredients": [{"index": 0, "category_id": batteries}]}
    ) == {"ok": True}
    sections = [
        {"text": "a", "section": "Teig"},
        {"text": "b", "section": "Teig"},
        {"text": "c", "section": "Füllung"},
    ]
    got = inv.ai_changes(conn, d, {"ok": False, "steps": sections})["steps"]
    assert [s["section"] for s in got] == ["Teig", None, "Füllung"]
    assert inv.ai_changes(conn, d, "nonsense") == {"ok": True}


def test_changes_propose_new_product_types(conn):
    d = draft(conn)
    spices, batteries = cat(conn, "Gewürze"), cat(conn, "Batterien")

    def new(name, parent):
        answer = {"index": 1, "category_id": 0, "new_type": {"name": name, "parent_id": parent}}
        return inv.ai_changes(conn, d, {"ok": False, "ingredients": [answer | {"reason": "r"}]})

    assert new(" Testgewürz ", spices)["ingredients"] == [
        {
            "index": 1,
            "category_id": None,
            "new_type": {"name": "Testgewürz", "parent_id": spices},
            "reason": "r",
        }
    ]
    # a type the tree has already is linked instead
    assert new("sumach", spices)["ingredients"][0]["category_id"] == cat(conn, "Sumach")
    assert "new_type" not in new("sumach", spices)["ingredients"][0]
    # unknown or non-food parent, empty or overlong name: dropped (row 1 has no category)
    for name, parent in [("X", 999999), ("X", batteries), (" ", spices), ("x" * 61, spices)]:
        assert new(name, parent) == {"ok": True}


def test_changes_fix_units(conn):
    d = draft(conn)
    d["ingredients"][0]["unit_id"] = unit(conn, "g")
    head = inv.ai_prompt(conn, d).split("Recipe draft:")[0]
    assert f"{unit(conn, 'Messerspitze')} Msp. (Messerspitze)" in head

    def fix(**c):
        answer = {"ok": False, "ingredients": [{"index": 0, "reason": "r", **c}]}
        return inv.ai_changes(conn, d, answer)["ingredients"][0] if c else None

    prise = unit(conn, "Prise")
    assert fix(unit_id=prise) == {"index": 0, "unit_id": prise, "reason": "r"}
    # a proposed unit the units know is linked; an unknown one is proposed as new
    assert fix(new_unit={"name": "prisen"})["unit_id"] == prise
    assert fix(new_unit={"name": " Knolle "})["new_unit"] == {"name": "Knolle"}
    # same unit, unknown id, empty or overlong name: no change
    for c in [
        {"unit_id": unit(conn, "g")},
        {"unit_id": 999999},
        {"new_unit": {"name": " "}},
        {"new_unit": {"name": "x" * 51}},
        {"new_unit": "Knolle"},
    ]:
        assert inv.ai_changes(conn, d, {"ok": False, "ingredients": [{"index": 0, **c}]}) == {
            "ok": True
        }
    both = fix(category_id=cat(conn, "Haushaltszucker"), unit_id=prise)
    assert both["category_id"] == cat(conn, "Haushaltszucker") and both["unit_id"] == prise


def product(conn, **kw):
    return {
        "name": "Barilla Spaghetti n.5 500g",
        "brand": "Barilla",
        "category_id": None,
        "content_amount": None,
        "content_unit_id": None,
        "off_json": json.dumps({**SPAGHETTI, "quantity": "4 x 125 g", "huge": "x" * 9000}),
        **kw,
    }


def test_product_prompt(conn):
    text = inv.ai_product_prompt(conn, product(conn))
    head, body = text.split("Product draft:\n")
    assert "Batterien" in head  # non-food too: products can be anything
    off = json.loads(body)["open_food_facts"]
    assert off["quantity"] == "4 x 125 g" and off["product_name_de"] == "Spaghetti No. 5"
    assert "huge" not in off  # only the useful fields
    assert inv.ai_product_prompt(conn, product(conn, name="Anders")).startswith(head)


def test_product_changes(conn):
    d = product(conn)
    g, spaghetti = unit(conn, "g"), cat(conn, "Spaghetti")
    assert inv.ai_product_changes(conn, d, {"ok": True}) == {"ok": True}
    answer = {
        "ok": False,
        "name": " Spaghetti n.5 ",
        "category_id": spaghetti,
        "content_amount": 500,
        "content_unit_id": g,
        "reason": "r",
    }
    assert inv.ai_product_changes(conn, d, answer) == {
        "ok": False,
        "name": "Spaghetti n.5",
        "category_id": spaghetti,
        "content_amount": 500,
        "content_unit_id": g,
        "reason": "r",
    }
    same = product(conn, name="Spaghetti n.5", category_id=spaghetti, content_amount=500)
    assert inv.ai_product_changes(conn, {**same, "content_unit_id": g}, answer) == {"ok": True}
    bad = {"ok": False, "category_id": 999999, "content_amount": -1, "content_unit_id": g}
    assert inv.ai_product_changes(conn, d, bad) == {"ok": True}
    assert inv.ai_product_changes(conn, d, {"content_amount": 5, "content_unit_id": 999999}) == {
        "ok": True
    }
    assert inv.ai_product_changes(conn, d, "nonsense") == {"ok": True}


def test_product_changes_propose_new_product_types(conn):
    d = product(conn)
    batteries = cat(conn, "Batterien")

    def new(name, parent):
        answer = {"ok": False, "new_type": {"name": name, "parent_id": parent}, "reason": "r"}
        return inv.ai_product_changes(conn, d, answer)

    # non-food parents too: products can be anything
    assert new(" Knopfzelle Test ", batteries) == {
        "ok": False,
        "category_id": None,
        "new_type": {"name": "Knopfzelle Test", "parent_id": batteries},
        "reason": "r",
    }
    # a category the tree has already is linked instead
    assert new("spaghetti", cat(conn, "Nudeln")) == {
        "ok": False,
        "category_id": cat(conn, "Spaghetti"),
        "reason": "r",
    }
    for name, parent in [("X", 999999), (" ", batteries), ("x" * 61, batteries), ("X", "1")]:
        assert new(name, parent) == {"ok": True}


def test_save_adds_the_proposed_product_type(conn):
    spices = cat(conn, "Gewürze")
    ing = {"category_id": None, "new_type": {"name": "Testgewürz", "parent_id": spices}}
    recipe_id = inv.save_recipe(
        conn, {"name": "R", "servings": 1, "ingredients": [ing, {**ing, "source_text": "Tg"}]}
    )
    rows = conn.execute(
        "SELECT category_id, text FROM recipe_ingredient WHERE recipe_id = ?", (recipe_id,)
    ).fetchall()
    new = cat(conn, "Testgewürz")
    assert [tuple(r) for r in rows] == [(new, "Testgewürz"), (new, "Testgewürz")]
    parent = conn.execute("SELECT parent_id FROM category WHERE id = ?", (new,)).fetchone()[0]
    assert parent == spices
    assert learned(conn, "ingredient", "Tg") == new
    bad = {"category_id": None, "new_type": {"name": "Y", "parent_id": cat(conn, "Batterien")}}
    with pytest.raises(inv.InventoryError):
        inv.save_recipe(conn, {"name": "R2", "servings": 1, "ingredients": [bad]})


def test_import_choice_is_learned(conn):
    zucker = cat(conn, "Haushaltszucker")
    data = {
        "name": "R",
        "servings": 1,
        "ingredients": [{"category_id": zucker, "source_text": "Zucker, weiß"}],
    }
    inv.save_recipe(conn, data)
    assert learned(conn, "ingredient", "zucker weiß") == zucker


def test_corrected_off_suggestion_is_learned(conn):
    tags = SPAGHETTI["categories_tags"]
    suggested = inv.suggest_category(conn, tags)
    other = cat(conn, "Reis")
    assert suggested not in (None, other)
    inv.add_product(conn, {"name": "S", "category_id": other, "off_json": json.dumps(SPAGHETTI)})
    assert inv.suggest_category(conn, tags) == other


async def test_websocket_check(hass: HomeAssistant, hass_ws_client) -> None:
    assert await async_setup_component(hass, "http", {})
    entry = MockConfigEntry(domain=DOMAIN)
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    client = await hass_ws_client(hass)
    d = {
        "name": "Gelee",
        "servings": 4,
        "steps": [{"text": "Kochen."}],
        "ingredients": [{"text": "Wasser"}],
    }
    await client.send_json_auto_id({"type": "home_inventory/recipe_ai_check", "draft": d})
    assert (await client.receive_json())["result"] == {"status": "off"}

    hass.config_entries.async_update_entry(entry, options={CONF_AI_TASK: "ai_task.test"})
    hass.config.components.add("ai_task")
    answer = SimpleNamespace(data={"ok": False, "steps": [{"text": "Kochen."}, {"text": "Essen."}]})
    with patch(
        "custom_components.home_inventory.ai._generate", new=AsyncMock(return_value=answer)
    ) as gen:
        await client.send_json_auto_id({"type": "home_inventory/recipe_ai_check", "draft": d})
        res = (await client.receive_json())["result"]
    assert res["status"] == "changes" and len(res["steps"]) == 2
    assert gen.await_args.kwargs["entity_id"] == "ai_task.test"
    assert "Recipe draft:" in gen.await_args.kwargs["instructions"]
    assert gen.await_args.kwargs["instructions"].endswith('Write every "reason" in English.\n')
    with patch(
        "custom_components.home_inventory.ai._generate", new=AsyncMock(return_value=answer)
    ) as gen:
        msg = {"type": "home_inventory/recipe_ai_check", "draft": d, "language": "de-DE"}
        await client.send_json_auto_id(msg)
        await client.receive_json()
    assert gen.await_args.kwargs["instructions"].endswith('Write every "reason" in German.\n')

    p = {"name": "Spaghetti", "category_id": None, "off_json": "{}", "ean": "8076800195057"}
    answer = SimpleNamespace(data={"ok": False, "name": "Spaghetti n.5", "reason": "r"})
    with patch("custom_components.home_inventory.ai._generate", new=AsyncMock(return_value=answer)):
        await client.send_json_auto_id({"type": "home_inventory/product_ai_check", "draft": p})
        res = (await client.receive_json())["result"]
    assert res == {"status": "changes", "name": "Spaghetti n.5", "reason": "r"}

    options = {CONF_AI_TASK: "ai_task.test", "ai_product_check": False, "ai_recipe_check": False}
    hass.config_entries.async_update_entry(entry, options=options)
    await client.send_json_auto_id({"type": "home_inventory/product_ai_check", "draft": p})
    assert (await client.receive_json())["result"] == {"status": "off"}
    await client.send_json_auto_id({"type": "home_inventory/recipe_ai_check", "draft": d})
    assert (await client.receive_json())["result"] == {"status": "off"}


def test_prompts_follow_the_seed_language(conn):
    from custom_components.home_inventory.inventory import ai_import, purchase

    def texts():
        return [
            inv.ai_prompt(conn, draft(conn)),
            inv.ai_product_prompt(conn, product(conn)),
            ai_import.prompt({}, inv.ai_language(conn)),
            purchase.prompt(conn, "MILK 1,00"),
        ]

    assert all("German" in t for t in texts())
    assert not any("@" in t for t in texts())  # every @word@ filled in
    conn.execute("UPDATE defaults SET seed_lang = 'en'")
    en = texts()
    assert not any("German" in t for t in en)
    assert not any("@" in t for t in en)
    assert "Sumac" in en[0] and "Sumac" in en[1] and "1 tsp salt" in en[2] and "TESCO" in en[3]
