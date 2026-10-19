"""LLM API: tools per access level, registration with the entry, tool results (read tools on the
inventory, write tools through the services)."""

from functools import partial

import pytest
from homeassistant.core import Context, HomeAssistant
from homeassistant.exceptions import ServiceValidationError
from homeassistant.helpers import llm
from homeassistant.setup import async_setup_component
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.home_inventory import inventory as inv
from custom_components.home_inventory.const import CONF_LLM_ACCESS, DOMAIN
from custom_components.home_inventory.llm_api import tools_for
from tests.test_inventory import cat, product, unit

READ = {
    "get_stock",
    "get_expiring",
    "get_recipes",
    "get_recipe",
    "get_shopping_list",
    "get_meal_plan",
}
PLAN = READ | {"add_to_shopping_list", "add_recipe_to_shopping_list", "plan_meal"}
ALL = PLAN | {"book_in", "book_out", "open_package"}


def test_tools_per_level():
    assert {t.name for t in tools_for("read")} == READ
    assert {t.name for t in tools_for("plan")} == PLAN
    assert {t.name for t in tools_for("all")} == ALL
    assert {t.name for t in tools_for("bogus")} == PLAN  # unknown = default
    assert all(t.annotations.read_only for t in tools_for("read"))
    assert not any(t.annotations.read_only for t in tools_for("all") if t.name not in READ)


def test_product_by_name(conn):
    product(conn, ean="4006040053026")
    res = inv.book_in_by_code(conn, " spaghetti ", 2)
    assert res["name"] == "Spaghetti"
    assert inv.book_out_by_code(conn, "SPAGHETTI")["taken"][0]["packages"] == 1
    with pytest.raises(inv.InventoryError):
        inv.book_in_by_code(conn, "Penne", 1)


@pytest.fixture
async def entry(hass: HomeAssistant) -> MockConfigEntry:
    assert await async_setup_component(hass, "http", {})
    entry = MockConfigEntry(domain=DOMAIN, options={CONF_LLM_ACCESS: "all"})
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await entry.runtime_data.run(partial(product, ean="4006040053026"))
    return entry


async def api(hass: HomeAssistant) -> llm.APIInstance:
    ctx = llm.LLMContext(
        platform="test", context=Context(), language="de", assistant="conversation", device_id=None
    )
    return await llm.async_get_api(hass, DOMAIN, ctx)


async def call(instance: llm.APIInstance, tool: str, **args):
    res = await instance.async_call_tool(llm.ToolInput(tool_name=tool, tool_args=args))
    return res.data["result"]


async def test_registered_per_level(hass: HomeAssistant, entry: MockConfigEntry) -> None:
    assert {t.name for t in (await api(hass)).tools} == ALL
    hass.config_entries.async_update_entry(entry, options={CONF_LLM_ACCESS: "read"})
    await hass.config_entries.async_reload(entry.entry_id)
    await hass.async_block_till_done()
    assert {t.name for t in (await api(hass)).tools} == READ
    await hass.config_entries.async_unload(entry.entry_id)
    assert DOMAIN not in {a.id for a in llm.async_get_apis(hass)}


async def test_tool_results(hass: HomeAssistant, entry: MockConfigEntry) -> None:
    db, instance = entry.runtime_data, await api(hass)
    booked = await call(
        instance, "book_in", product="spaghetti", packages=3, expires_on="2020-01-01"
    )
    assert booked["name"] == "Spaghetti"
    rows = await call(instance, "get_stock", search="nudel")
    assert rows == [
        {
            "name": "Spaghetti",
            "brand": None,
            "category": rows[0]["category"],
            "packages": 3,
            "location": rows[0]["location"],
            "expires_on": "2020-01-01",
            "opened": False,
        }
    ]
    assert "Nudeln" in rows[0]["category"]
    assert (await call(instance, "get_expiring"))[0]["status"] == "expired"
    opened = await call(instance, "open_package", product="Spaghetti")
    assert opened["name"] == "Spaghetti"
    assert len((await call(instance, "book_out", product="Spaghetti", packages=2))["taken"]) >= 1

    recipe = {
        "name": "Nudeln mit Soße",
        "servings": 2,
        "ingredients": [
            {
                "category_id": await db.run(cat, "Nudeln"),
                "amount": 100,
                "unit_id": await db.run(unit, "g"),
                "text": "Nudeln",
            }
        ],
        "steps": [{"text": "Kochen."}],
    }
    await db.run(inv.save_recipe, recipe)
    listed = await call(instance, "get_recipes", search="soße")
    assert listed[0]["name"] == "Nudeln mit Soße" and listed[0]["ingredients_required"] == 1
    detail = await call(instance, "get_recipe", recipe="nudeln mit soße", servings=4)
    assert detail["servings"] == 4 and detail["ingredients"][0]["amount"] == 200
    assert detail["ingredients"][0]["stock"] in ("available", "partial", "missing", "unknown")
    assert detail["steps"] == [{"section": None, "text": "Kochen."}]

    await call(instance, "plan_meal", recipe="Nudeln mit Soße", day="2026-10-19", meal="lunch")
    plan = await call(instance, "get_meal_plan", start="2026-10-19", days=1)
    assert plan == [
        {"day": "2026-10-19", "meal": "lunch", "dish": "Nudeln mit Soße", "servings": 3}
    ]
    await call(instance, "add_to_shopping_list", name="spaghetti")
    await call(instance, "add_recipe_to_shopping_list", recipe="Nudeln mit Soße", servings=2)
    items = await call(instance, "get_shopping_list")
    assert any(i["item"].startswith("Spaghetti") for i in items)

    with pytest.raises(ServiceValidationError) as err:
        await call(instance, "book_out", product="Penne")
    assert err.value.translation_key == "product_unknown"
