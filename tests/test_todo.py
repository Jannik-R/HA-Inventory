"""Shopping list todo entity: items from min stock, checking holds until the shortage changes."""

from datetime import timedelta
from pathlib import Path

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
    # The test config dir is shared within a run: start without stock from other tests.
    Path(hass.config.path("pantry.db")).unlink(missing_ok=True)
    entry = MockConfigEntry(domain=DOMAIN)
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    entity_id = er.async_get(hass).async_get_entity_id(
        "todo", DOMAIN, f"{entry.entry_id}_shopping"
    )
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
