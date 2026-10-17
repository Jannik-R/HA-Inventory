"""Shopping list todo entity: items from min stock, checking holds until the shortage changes."""

from datetime import timedelta

import pytest
from homeassistant.components.todo import DOMAIN as TODO_DOMAIN
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import ServiceValidationError
from homeassistant.helpers import entity_registry as er
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import (
    MockConfigEntry,
    async_fire_time_changed,
)

from custom_components.pantry import inventory
from custom_components.pantry.const import DOMAIN


async def refreshed(hass: HomeAssistant, seconds: int) -> None:
    """Coordinator refreshes after the first are debounced (cooldown 10 s)."""
    async_fire_time_changed(hass, dt_util.utcnow() + timedelta(seconds=seconds))
    await hass.async_block_till_done()


async def test_shopping_todo(hass: HomeAssistant) -> None:
    hass.config.language = "de"
    entry = MockConfigEntry(domain=DOMAIN)
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    entity_id = er.async_get(hass).async_get_entity_id("todo", DOMAIN, f"{entry.entry_id}_shopping")
    assert hass.states.get(entity_id).state == "0"

    db = entry.runtime_data
    md = await db.run(inventory.master_data)
    cat = next(c["id"] for c in md["categories"] if c["name"] == "Nudeln")
    await db.run(inventory.save, "category", {"id": cat, "min_packages": 2})
    async_fire_time_changed(hass, dt_util.utcnow() + timedelta(seconds=11))
    await hass.async_block_till_done()
    assert hass.states.get(entity_id).state == "1"

    items = await hass.services.async_call(
        TODO_DOMAIN, "get_items", {}, target={"entity_id": entity_id},
        blocking=True, return_response=True,
    )  # fmt: skip
    assert items[entity_id]["items"][0]["summary"] == "Nudeln – 2 Packungen fehlen"

    await hass.services.async_call(
        TODO_DOMAIN, "update_item",
        {"item": "Nudeln – 2 Packungen fehlen", "status": "completed"},
        target={"entity_id": entity_id}, blocking=True,
    )  # fmt: skip
    async_fire_time_changed(hass, dt_util.utcnow() + timedelta(seconds=22))
    await hass.async_block_till_done()
    assert hass.states.get(entity_id).state == "0"
    assert (await db.run(inventory.shopping_list))[0]["done"]

    # By hand: a category by its name; clearing checked items deletes only those added by hand.
    await hass.services.async_call(
        TODO_DOMAIN, "add_item", {"item": "reis"}, target={"entity_id": entity_id}, blocking=True
    )
    await refreshed(hass, 33)
    await hass.services.async_call(
        TODO_DOMAIN, "update_item", {"item": "Reis", "status": "completed"},
        target={"entity_id": entity_id}, blocking=True,
    )  # fmt: skip
    await refreshed(hass, 44)
    await hass.services.async_call(
        TODO_DOMAIN, "remove_completed_items", {}, target={"entity_id": entity_id}, blocking=True
    )
    rows = await db.run(inventory.shopping_list)
    assert [(i["name"], i["manual"]) for i in rows] == [("Nudeln", False)]
    with pytest.raises(ServiceValidationError):
        await hass.services.async_call(
            TODO_DOMAIN, "add_item", {"item": "Gibtsnicht"},
            target={"entity_id": entity_id}, blocking=True,
        )  # fmt: skip

    assert await hass.config_entries.async_unload(entry.entry_id)


def test_uid_kinds() -> None:
    from custom_components.pantry.todo import uid

    base = {"id": None, "manual": False, "product_id": None, "category_id": 4}
    assert uid(base) == "c4"
    assert uid({**base, "product_id": 7}) == "p7"
    assert uid({**base, "id": 3, "manual": True, "product_id": 7}) == "m3"


def test_summary_languages() -> None:
    from custom_components.pantry.todo import summary

    item = {"manual": False, "packages": 2, "product_id": 7, "brand": "Barilla",
            "name": "Spaghetti", "any_of_subtree": False, "amount": None}  # fmt: skip
    assert summary(item) == "Spaghetti (Barilla) – 2 Packungen fehlen"
    more = {**item, "product_id": None, "packages": 1, "any_of_subtree": True, "name": "Nudeln",
            "amount": {"missing": 0.5, "unit_symbol": "kg"}}  # fmt: skip
    assert summary(more, "en") == "Nudeln – 0.5 kg and 1 package more missing"
    assert summary(more, "fr") == summary(more, "en")
    assert summary(more, "de") == "Nudeln – weitere 0,5 kg und 1 Packung fehlen"
