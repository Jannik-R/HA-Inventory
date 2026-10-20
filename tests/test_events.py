"""HA events: one per booking row, a minimum newly undercut, a batch expired at midnight."""

from datetime import timedelta

from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import (
    MockConfigEntry,
    async_capture_events,
    async_fire_time_changed,
)

from custom_components.home_inventory import inventory as inv
from tests.test_services import EAN, call, entry  # noqa: F401 (fixture)


async def test_booked_and_below_min(hass: HomeAssistant, entry: MockConfigEntry) -> None:  # noqa: F811
    booked = async_capture_events(hass, "home_inventory_booked")
    below = async_capture_events(hass, "home_inventory_below_min")
    db = entry.runtime_data
    pid = (await db.run(inv.find_ean, EAN))["id"]
    await db.run(inv.save, "product", {"id": pid, "min_packages": 2})
    await hass.async_block_till_done(wait_background_tasks=True)
    assert [e.data["name"] for e in below] == ["Spaghetti"]  # 0 of 2: below now
    await call(hass, "book_in", code=EAN, packages=3, location="Kühlschrank")
    await hass.async_block_till_done(wait_background_tasks=True)
    e = booked[-1].data
    assert (e["kind"], e["packages"], e["name"], e["location"], e["source"]) == (
        "in", 3, "Spaghetti", "Kühlschrank", "service",
    )  # fmt: skip
    await call(hass, "book_out", code=EAN)  # 2 left: not below
    await call(hass, "book_out", code=EAN)  # 1 left: below again, once
    await call(hass, "book_out", code=EAN)  # still below: no new event
    await hass.async_block_till_done(wait_background_tasks=True)
    assert len(below) == 2 and below[-1].data["packages"] == 1
    assert [e.data["kind"] for e in booked[-3:]] == ["out"] * 3


async def test_expired_at_midnight(hass: HomeAssistant, entry: MockConfigEntry) -> None:  # noqa: F811
    expired = async_capture_events(hass, "home_inventory_expired")
    yesterday = (dt_util.now().date() - timedelta(days=1)).isoformat()
    await call(hass, "book_in", code=EAN, packages=2, expires_on=yesterday, location="Kühlschrank")
    await call(hass, "book_in", code=EAN, packages=1, expires_on="2099-01-01")
    async_fire_time_changed(
        hass, dt_util.now().replace(hour=0, minute=0, second=1) + timedelta(days=1)
    )
    await hass.async_block_till_done(wait_background_tasks=True)
    assert [(e.data["name"], e.data["packages"], e.data["expires_on"]) for e in expired] == [
        ("Spaghetti", 2, yesterday)
    ]
