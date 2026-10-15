"""Sensors: packages expiring soon / expired (by each product's effective warn days)."""

from __future__ import annotations

import logging
from typing import TYPE_CHECKING

from homeassistant.components.sensor import SensorEntity, SensorStateClass
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.device_registry import DeviceEntryType, DeviceInfo
from homeassistant.helpers.dispatcher import async_dispatcher_connect
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback
from homeassistant.helpers.event import async_track_time_change
from homeassistant.helpers.update_coordinator import (
    CoordinatorEntity,
    DataUpdateCoordinator,
)
from homeassistant.util import dt as dt_util

from . import inventory
from .const import DOMAIN, SIGNAL_CHANGED

if TYPE_CHECKING:
    from . import PantryConfigEntry

STATUSES = ("expired", "soon")


async def async_setup_entry(
    hass: HomeAssistant,
    entry: PantryConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    db = entry.runtime_data

    async def update() -> list[dict]:
        return await db.run(inventory.expiring, dt_util.now().date())

    # No polling: refresh after every DB write and right after midnight (days left change).
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
        hass.async_create_task(coordinator.async_request_refresh())

    entry.async_on_unload(async_dispatcher_connect(hass, SIGNAL_CHANGED, refresh))
    entry.async_on_unload(async_track_time_change(hass, refresh, 0, 0, 1))
    async_add_entities(ExpirySensor(coordinator, entry, s) for s in STATUSES)


class ExpirySensor(CoordinatorEntity[DataUpdateCoordinator[list[dict]]], SensorEntity):
    """Number of packages with this expiry status; the batches as attribute for automations."""

    _attr_has_entity_name = True
    _attr_state_class = SensorStateClass.MEASUREMENT
    _unrecorded_attributes = frozenset({"items"})

    def __init__(self, coordinator, entry: PantryConfigEntry, status: str) -> None:
        super().__init__(coordinator)
        self._status = status
        self._attr_translation_key = status
        self._attr_unique_id = f"{entry.entry_id}_{status}"
        self._attr_device_info = DeviceInfo(
            identifiers={(DOMAIN, entry.entry_id)},
            # shortcut: German like the sidebar title; translate when needed.
            name="Vorrat",
            entry_type=DeviceEntryType.SERVICE,
        )

    @property
    def _rows(self) -> list[dict]:
        return [r for r in self.coordinator.data if r["status"] == self._status]

    @property
    def native_value(self) -> int:
        return sum(r["packages"] for r in self._rows)

    @property
    def extra_state_attributes(self) -> dict:
        return {
            "items": [
                {
                    k: r[k]
                    for k in ("name", "expires_on", "days_left", "packages", "location")
                }
                for r in self._rows
            ]
        }
