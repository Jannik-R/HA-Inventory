"""Services: booking by code and location name, recipes by name (shopping list, meal plan, canning),
label printing (label.send is always patched)."""

from datetime import date
from functools import partial
from unittest.mock import AsyncMock, patch

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import ServiceValidationError
from homeassistant.setup import async_setup_component
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.home_inventory import inventory as inv
from custom_components.home_inventory.const import DOMAIN
from custom_components.home_inventory.inventory import InventoryError
from tests.test_inventory import loc, product, stock

EAN = "4006040053026"


def test_book_in_and_out_by_code(conn):
    p = product(conn, ean=EAN)
    shelf = loc(conn, "Vorratsschrank")
    res = inv.book_in_by_code(conn, f" {EAN} ", 3, "2027-01-31", " kühlSCHRANK ")
    assert res == {"product_id": p, "batch_id": res["batch_id"], "name": "Spaghetti"}
    no_date = inv.book_in_by_code(conn, EAN, 1, None, "Vorratsschrank")["batch_id"]
    assert conn.execute("SELECT source FROM booking").fetchone()[0] == "service"

    out = inv.book_out_by_code(conn, EAN, 2, "Kühlschrank")
    assert [t["packages"] for t in out["taken"]] == [2] and out["name"] == "Spaghetti"
    assert inv.book_out_by_code(conn, f"ptry:{EAN}:2027-01-31")["location"] == "Kühlschrank"
    assert stock(conn) == {(no_date, shelf): 1}  # fridge emptied: 2 by EAN + 1 by label

    for call, key in (
        (lambda: inv.book_in_by_code(conn, "12345678", 1), "product_unknown"),
        (lambda: inv.book_in_by_code(conn, EAN, 1, None, "Keller"), "location_unknown"),
        (lambda: inv.book_out_by_code(conn, f"PTRY:{EAN}:", 2), "invalid_value"),
        (lambda: inv.book_out_by_code(conn, f"PTRY:{EAN}:", 1, "Kühlschrank"), "invalid_value"),
        (lambda: inv.book_out_by_code(conn, EAN, 5), "not_enough_stock"),
    ):
        with pytest.raises(InventoryError) as err:
            call()
        assert err.value.translation_key == key


def key_of(fn) -> InventoryError:
    with pytest.raises(InventoryError) as err:
        fn()
    return err.value


def test_ambiguous_product_name(conn):
    product(conn, brand="Barilla")
    own = product(conn, brand="Rewe")
    err = key_of(lambda: inv.book_in_by_code(conn, "spaghetti", 1))
    assert err.translation_key == "product_not_unique"
    assert err.placeholders == {"name": "spaghetti", "brands": "Barilla, Rewe"}
    assert not conn.execute("SELECT 1 FROM booking").fetchone()  # nothing booked

    res = inv.book_in_by_code(conn, "spaghetti", 2, brand=" REWE ")
    assert res["product_id"] == own
    assert inv.book_out_by_code(conn, "Spaghetti", 1, brand="rewe")["name"] == "Spaghetti"
    assert key_of(
        lambda: inv.book_out_by_code(conn, "Spaghetti", brand="Birkel")
    ).translation_key == ("product_unknown")
    assert {r[0] for r in conn.execute("SELECT product_id FROM batch")} == {own}
    # an empty brand is no brand
    assert (
        key_of(
            lambda: inv.open_by_code(conn, "Spaghetti", date(2026, 10, 1), brand="")
        ).translation_key
        == "product_not_unique"
    )


def test_ambiguous_name_with_unbranded(conn):
    product(conn, brand="Barilla")
    product(conn)
    err = key_of(lambda: inv.book_in_by_code(conn, "Spaghetti", 1))
    assert err.translation_key == "product_not_unique_blank"
    assert err.placeholders["brands"] == "Barilla"
    # the unbranded one is not reachable by name once the brand narrows to the other
    assert inv.book_in_by_code(conn, "Spaghetti", 1, brand="barilla")["name"] == "Spaghetti"


def test_shopping_by_ambiguous_name(conn):
    first = product(conn, "Reis", brand="A")
    second = product(conn, "Reis", brand="B")
    item = lambda i: conn.execute(  # noqa: E731
        "SELECT product_id, category_id FROM shopping_item WHERE id = ?", (i,)
    ).fetchone()
    # a category named like the products wins; the brand picks a product
    assert item(inv.add_shopping_by_name(conn, "reis"))["product_id"] is None
    assert item(inv.add_shopping_by_name(conn, "reis", "b"))["product_id"] == second
    conn.execute("DELETE FROM shopping_item")
    conn.execute("UPDATE category SET name = 'Getreide' WHERE name = 'Reis'")
    # no such category: the oldest product, never an error
    assert item(inv.add_shopping_by_name(conn, "reis"))["product_id"] == first


def test_recipes_by_name(conn):
    dish = inv.save_recipe(conn, {"name": "Lasagne", "servings": 4, "ingredients": []})
    cat = conn.execute("SELECT id FROM category WHERE name = 'Marmelade & Gelee'").fetchone()[0]
    jam = inv.save_recipe(
        conn,
        {
            "name": "Erdbeermarmelade",
            "servings": 5,
            "canning_product": {"name": "Erdbeermarmelade", "category_id": cat},
            "canning_temp": 80,
            "canning_minutes": 10,
            "ingredients": [],
        },
    )
    assert inv.shop_recipe_by_name(conn, " lasagne ", 3) == {"recipe_id": dish}
    assert tuple(conn.execute("SELECT recipe_id, servings FROM shopping_recipe").fetchone()) == (
        dish,
        3,
    )

    inv.plan_meal_by_name(conn, date(2026, 10, 19), 3, 2, recipe="LASAGNE")
    inv.plan_meal_by_name(conn, date(2026, 10, 19), 0, 2, text="Müsli")
    plan = inv.meals(conn, "2026-10-19", "2026-10-20")
    assert {(m["slot"], m["recipe_id"], m["name"]) for m in plan} == {
        (3, dish, "Lasagne"),
        (0, None, "Müsli"),
    }

    # the canning recipe sets product, jars, temperature, minutes; shelf life 365 days
    res = inv.canning_by_name(conn, "erdbeermarmelade", date(2026, 10, 18))
    (row,) = inv.cannings(conn)
    assert res["charge"] == "20261018-1"
    assert (row["recipe_id"], row["jars"], row["temp"], row["minutes"]) == (jam, 5, 80, 10)
    assert row["expires_on"] == "2027-10-18"
    assert conn.execute("SELECT source FROM booking").fetchone()[0] == "service"

    for call in (
        lambda: inv.shop_recipe_by_name(conn, "Erdbeermarmelade", 2),  # canning recipe: no dish
        lambda: inv.plan_meal_by_name(conn, date(2026, 10, 19), 3, 2, recipe="Pizza"),
        lambda: inv.canning_by_name(conn, "Lasagne", date(2026, 10, 18)),  # no canning recipe
    ):
        with pytest.raises(InventoryError, match="recipe_unknown"):
            call()


@pytest.fixture
async def entry(hass: HomeAssistant) -> MockConfigEntry:
    assert await async_setup_component(hass, "http", {})
    entry = MockConfigEntry(domain=DOMAIN)
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await entry.runtime_data.run(partial(product, ean=EAN))
    return entry


async def call(hass: HomeAssistant, service: str, **data) -> dict:
    return await hass.services.async_call(
        DOMAIN, service, data, blocking=True, return_response=True
    )


async def test_services(hass: HomeAssistant, entry: MockConfigEntry) -> None:
    # YAML gives a scanned EAN as a number
    res = await call(hass, "book_in", code=int(EAN), packages="2", location="Kühlschrank")
    # Empty template values = left out: no date (same batch), the product's default location
    again = await call(hass, "book_in", code=EAN, expires_on="", location="")
    assert again["batch_id"] == res["batch_id"]
    assert res["name"] == "Spaghetti"
    assert len((await call(hass, "book_out", code=EAN))["taken"]) == 1
    opened = await call(hass, "open_package", code=EAN, location="")
    assert (opened["name"], opened["location"]) == ("Spaghetti", "Kühlschrank")
    with pytest.raises(ServiceValidationError) as err:
        await call(hass, "open_package", code=EAN, location="Keller")
    assert err.value.translation_key == "location_unknown"
    frozen = await call(hass, "freeze_package", code=EAN, location="Kühlschrank")
    assert frozen["location"] == "Gefrierschrank"
    thawed = await call(hass, "thaw_package", code=EAN, packages=1, to_location="Vorratsschrank")
    assert thawed["location"] == "Vorratsschrank"

    with pytest.raises(ServiceValidationError) as err:
        await call(hass, "book_out", code="12345678")
    assert err.value.translation_key == "product_unknown"

    # Recipes by name; servings default to the household size
    recipe = {"name": "Lasagne", "servings": 4, "ingredients": []}
    await entry.runtime_data.run(inv.save_recipe, recipe)
    await call(hass, "shop_recipe", recipe="Lasagne")
    planned = await call(hass, "plan_meal", text="Pizza", day="2026-10-19", meal="lunch")
    rows = await entry.runtime_data.run(inv.meals, "2026-10-19", "2026-10-20")
    assert [(m["id"], m["slot"], m["servings"]) for m in rows] == [(planned["meal_id"], 1, 3)]
    shop = await call(hass, "plan_to_shopping_list", start="2026-10-19", days=2)
    assert shop == {"recipes": [], "skipped": 1}  # only the free-text dish is planned
    with pytest.raises(ServiceValidationError) as err:
        await call(hass, "plan_meal")
    assert err.value.translation_key == "dish_required"
    with pytest.raises(ServiceValidationError) as err:
        await call(hass, "canning", recipe="Lasagne")
    assert err.value.translation_key == "recipe_unknown"

    # Browser-only setup: a service cannot print
    with pytest.raises(ServiceValidationError) as err:
        await call(hass, "print_labels", batch_id=res["batch_id"])
    assert err.value.translation_key == "no_label_printer"

    hass.config_entries.async_update_entry(
        entry, options={"label_printer": "dymo_lw4xx", "label_printer_host": "10.0.0.5"}
    )
    with patch("custom_components.home_inventory.label.send", new=AsyncMock()) as send:
        assert await call(hass, "print_labels", batch_id=res["batch_id"], count=2) == {"printed": 2}
    assert send.await_args.args[0] == "10.0.0.5"


async def test_service_brand(hass: HomeAssistant, entry: MockConfigEntry) -> None:
    await entry.runtime_data.run(partial(product, brand="Barilla"))  # same name as the EAN one
    with pytest.raises(ServiceValidationError) as err:
        await call(hass, "open_package", code="Spaghetti")
    assert err.value.translation_key == "product_not_unique_blank"
    await call(hass, "book_in", code="Spaghetti", brand="Barilla", location="Kühlschrank")
    opened = await call(hass, "open_package", code="spaghetti", brand="barilla")
    assert opened["name"] == "Spaghetti"
