"""Sensors: packages expiring soon / expired (by each product's effective warn days)."""

from __future__ import annotations

from typing import TYPE_CHECKING

from homeassistant.components.sensor import SensorEntity, SensorStateClass
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback
from homeassistant.helpers.update_coordinator import (
    CoordinatorEntity,
    DataUpdateCoordinator,
)
from homeassistant.util import dt as dt_util

from . import inventory
from .coordinator import async_coordinator, device_info

if TYPE_CHECKING:
    from . import HomeInventoryConfigEntry

STATUSES = ("expired", "soon")


async def async_setup_entry(
    hass: HomeAssistant,
    entry: HomeInventoryConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    db = entry.runtime_data

    async def update() -> list[dict]:
        return await db.run(inventory.expiring, dt_util.now().date())

    coordinator = await async_coordinator(hass, entry, update, midnight=True)
    async_add_entities(ExpirySensor(coordinator, entry, s) for s in STATUSES)


class ExpirySensor(CoordinatorEntity[DataUpdateCoordinator[list[dict]]], SensorEntity):
    """Number of packages with this expiry status; the batches as attribute for automations."""

    _attr_has_entity_name = True
    _attr_state_class = SensorStateClass.MEASUREMENT
    _unrecorded_attributes = frozenset({"items"})

    def __init__(self, coordinator, entry: HomeInventoryConfigEntry, status: str) -> None:
        super().__init__(coordinator)
        self._status = status
        self._attr_translation_key = status
        self._attr_unique_id = f"{entry.entry_id}_{status}"
        self._attr_device_info = device_info(entry)

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
                {k: r[k] for k in ("name", "expires_on", "days_left", "packages", "location")}
                for r in self._rows
            ]
        }
