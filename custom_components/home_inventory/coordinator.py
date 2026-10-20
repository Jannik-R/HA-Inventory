"""Shared by the entity platforms: a coordinator refreshed by DB writes (no polling), the device."""

from __future__ import annotations

import logging
from collections.abc import Awaitable, Callable
from typing import TYPE_CHECKING, Any

from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers.device_registry import DeviceEntryType, DeviceInfo
from homeassistant.helpers.dispatcher import async_dispatcher_connect
from homeassistant.helpers.event import async_track_time_change
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator

from .const import DOMAIN, SIGNAL_CHANGED, modules_of

if TYPE_CHECKING:
    from . import HomeInventoryConfigEntry


@callback
def module_off(
    hass: HomeAssistant,
    entry: HomeInventoryConfigEntry,
    module: str,
    platform: str,
    unique_id: str | None = None,
) -> bool:
    """True when `module` is turned off; then its entities (only the one `unique_id`, if given) leave
    the registry (no "unavailable" ghost)."""
    if module in modules_of(entry.options):
        return False
    reg = er.async_get(hass)
    for e in er.async_entries_for_config_entry(reg, entry.entry_id):
        if e.domain == platform and unique_id in (None, e.unique_id):
            reg.async_remove(e.entity_id)
    return True


async def async_coordinator(
    hass: HomeAssistant,
    entry: HomeInventoryConfigEntry,
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


def device_info(entry: HomeInventoryConfigEntry) -> DeviceInfo:
    return DeviceInfo(
        identifiers={(DOMAIN, entry.entry_id)},
        translation_key="inventory",  # name in the system language (strings: device.inventory)
        entry_type=DeviceEntryType.SERVICE,
    )
