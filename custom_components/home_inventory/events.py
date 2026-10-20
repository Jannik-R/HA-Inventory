"""HA events beside the booked one (fired in db.py): a minimum stock newly undercut, and batches
that expired today (at the midnight run, once per batch)."""

from __future__ import annotations

import asyncio
from datetime import timedelta
from typing import TYPE_CHECKING

from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.dispatcher import async_dispatcher_connect
from homeassistant.helpers.event import async_track_time_change
from homeassistant.util import dt as dt_util

from . import inventory
from .const import DOMAIN, EVENT_BELOW_MIN, EVENT_EXPIRED, SIGNAL_CHANGED

if TYPE_CHECKING:
    from . import HomeInventoryConfigEntry


async def async_setup(hass: HomeAssistant, entry: HomeInventoryConfigEntry) -> None:
    db = entry.runtime_data
    # shortfalls known at startup are not "new": only crossing below the minimum fires
    below = await db.run(inventory.below_min, write=False)
    lock = asyncio.Lock()  # quick writes in a row: compare one after the other, fire once

    async def check() -> None:
        nonlocal below
        async with lock:
            now = await db.run(inventory.below_min, write=False)
            for key in now.keys() - below.keys():
                hass.bus.async_fire(EVENT_BELOW_MIN, {"key": key, **now[key]})
            below = now

    async def expired(_now=None) -> None:
        # date = yesterday: from today on it is past (a best-before day itself is still fine)
        day = (dt_util.now().date() - timedelta(days=1)).isoformat()
        for row in await db.run(inventory.expired_on, day, write=False):
            hass.bus.async_fire(EVENT_EXPIRED, row)

    @callback
    def changed(*_) -> None:
        entry.async_create_background_task(hass, check(), f"{DOMAIN} below min")

    @callback
    def midnight(*_) -> None:
        entry.async_create_background_task(hass, expired(), f"{DOMAIN} expired")

    entry.async_on_unload(async_dispatcher_connect(hass, SIGNAL_CHANGED, changed))
    entry.async_on_unload(async_track_time_change(hass, midnight, 0, 0, 1))
