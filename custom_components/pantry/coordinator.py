"""Shared by the entity platforms: a coordinator refreshed by DB writes (no polling), the device."""

from __future__ import annotations

import logging
from collections.abc import Awaitable, Callable
from typing import TYPE_CHECKING, Any

from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.device_registry import DeviceEntryType, DeviceInfo
from homeassistant.helpers.dispatcher import async_dispatcher_connect
from homeassistant.helpers.event import async_track_time_change
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator

from .const import DOMAIN, SIGNAL_CHANGED

if TYPE_CHECKING:
    from . import PantryConfigEntry


async def async_coordinator(
    hass: HomeAssistant,
    entry: PantryConfigEntry,
    update: Callable[[], Awaitable[Any]],
    midnight: bool = False,
) -> DataUpdateCoordinator:
    """Refresh after every DB write and, with `midnight`, right after midnight (days left change)."""
    coordinator = DataUpdateCoordinator(
        hass,
        logging.getLogger(__name__),
        config_entry=entry,
        name=DOMAIN,
        update_method=update,
    )
    await coordinator.async_config_entry_first_refresh()

    @callback
    def refresh(*_) -> None:
        entry.async_create_background_task(
            hass, coordinator.async_request_refresh(), f"{DOMAIN} refresh"
        )

    entry.async_on_unload(async_dispatcher_connect(hass, SIGNAL_CHANGED, refresh))
    if midnight:
        entry.async_on_unload(async_track_time_change(hass, refresh, 0, 0, 1))
    return coordinator


def device_info(entry: PantryConfigEntry) -> DeviceInfo:
    return DeviceInfo(
        identifiers={(DOMAIN, entry.entry_id)},
        # shortcut: German like the sidebar title; translate when needed.
        name="Vorrat",
        entry_type=DeviceEntryType.SERVICE,
    )
