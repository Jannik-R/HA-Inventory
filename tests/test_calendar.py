"""Meal plan calendar entity: all-day events in id order, state follows the plan."""

from datetime import timedelta

from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import (
    MockConfigEntry,
    async_fire_time_changed,
)

from custom_components.pantry import inventory
from custom_components.pantry.const import DOMAIN


async def test_meal_plan_calendar(hass: HomeAssistant) -> None:
    hass.config.language = "de"
    entry = MockConfigEntry(domain=DOMAIN)
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    entity_id = er.async_get(hass).async_get_entity_id(
        "calendar", DOMAIN, f"{entry.entry_id}_meal_plan"
    )
    assert hass.states.get(entity_id).state == "off"

    today = dt_util.now().date()
    for text, slot in (("Brot", 3), ("Suppe", 1)):  # slot order beats insert order
        await entry.runtime_data.run(
            inventory.save_meal,
            {
                "day": today.isoformat(),
                "recipe_id": None,
                "text": text,
                "slot": slot,
                "servings": 2,
            },
        )
    async_fire_time_changed(hass, dt_util.utcnow() + timedelta(seconds=11))
    await hass.async_block_till_done()
    state = hass.states.get(entity_id)
    assert state.state == "on" and state.attributes["message"] == "Mittag: Suppe"

    start = dt_util.start_of_local_day(today)
    entity = hass.data["calendar"].get_entity(entity_id)
    events = await entity.async_get_events(hass, start, start + timedelta(days=1))
    tomorrow = today + timedelta(days=1)
    assert [(e.summary, e.start, e.end, e.description) for e in events] == [
        ("Mittag: Suppe", today, tomorrow, "2 Portionen"),
        ("Abendessen: Brot", today, tomorrow, "2 Portionen"),
    ]
