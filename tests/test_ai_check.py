"""AI check of recipe imports: prompt, answer validation, learned categories, websocket."""

import json
from types import SimpleNamespace
from unittest.mock import AsyncMock, patch

from homeassistant.core import HomeAssistant
from homeassistant.setup import async_setup_component
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.pantry import inventory as inv
from custom_components.pantry.const import CONF_AI_TASK, DOMAIN
from custom_components.pantry.inventory.learned import learned

from .test_inventory import cat
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
    await client.send_json_auto_id({"type": "pantry/recipe_ai_check", "draft": d})
    assert (await client.receive_json())["result"] == {"status": "off"}

    hass.config_entries.async_update_entry(entry, options={CONF_AI_TASK: "ai_task.test"})
    hass.config.components.add("ai_task")
    answer = SimpleNamespace(data={"ok": False, "steps": [{"text": "Kochen."}, {"text": "Essen."}]})
    with patch(
        "homeassistant.components.ai_task.async_generate_data", new=AsyncMock(return_value=answer)
    ) as gen:
        await client.send_json_auto_id({"type": "pantry/recipe_ai_check", "draft": d})
        res = (await client.receive_json())["result"]
    assert res["status"] == "changes" and len(res["steps"]) == 2
    assert gen.await_args.kwargs["entity_id"] == "ai_task.test"
    assert "Recipe draft:" in gen.await_args.kwargs["instructions"]
