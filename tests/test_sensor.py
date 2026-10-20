"""Expiry sensors: counts by status, refreshed after DB writes."""

from datetime import timedelta
from functools import partial

from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import (
    MockConfigEntry,
    async_fire_time_changed,
)

from custom_components.home_inventory import inventory
from custom_components.home_inventory.const import DOMAIN


async def test_expiry_sensors(hass: HomeAssistant) -> None:
    entry = MockConfigEntry(domain=DOMAIN)
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    ids = {
        k: er.async_get(hass).async_get_entity_id("sensor", DOMAIN, f"{entry.entry_id}_{k}")
        for k in ("expired", "soon")
    }
    assert hass.states.get(ids["expired"]).state == "0"

    db, today = entry.runtime_data, dt_util.now().date()
    md = await db.run(inventory.master_data)
    cat = next(c["id"] for c in md["categories"] if c["name"] == "Nudeln")
    loc = md["locations"][0]["id"]
    for name, packages, days in (("Alt", 2, -1), ("Bald", 1, 0), ("Später", 1, 400)):
        book = partial(
            inventory.book_in_new,
            location_id=loc,
            expires_on=today + timedelta(days=days),
        )
        await db.run(book, {"name": name, "category_id": cat}, packages)
    # Refreshes after the first are debounced (coordinator cooldown).
    async_fire_time_changed(hass, dt_util.utcnow() + timedelta(seconds=11))
    await hass.async_block_till_done()

    expired = hass.states.get(ids["expired"])
    assert expired.state == "2"
    assert expired.attributes["items"][0]["name"] == "Alt"
    assert expired.attributes["items"][0]["days_left"] == -1
    assert hass.states.get(ids["soon"]).state == "1"

    assert await hass.config_entries.async_unload(entry.entry_id)


async def test_emergency_sensor(hass: HomeAssistant) -> None:
    async def ids(options) -> tuple:
        entry = MockConfigEntry(domain=DOMAIN, options=options)
        entry.add_to_hass(hass)
        assert await hass.config_entries.async_setup(entry.entry_id)
        await hass.async_block_till_done()
        reg = er.async_get(hass)
        found = tuple(
            reg.async_get_entity_id("sensor", DOMAIN, f"{entry.entry_id}_{k}")
            for k in ("emergency", "expired")
        )
        state = found[0] and hass.states.get(found[0]).state
        assert await hass.config_entries.async_unload(entry.entry_id)
        return (state, found[1])

    emergency, expired = await ids({})
    assert emergency == "0" and expired
    emergency, expired = await ids({"modules": ["shopping"]})
    assert emergency is None and expired  # the expiry sensors stay
