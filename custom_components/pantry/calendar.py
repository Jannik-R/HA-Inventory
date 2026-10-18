"""Meal plan as a read-only calendar: one all-day event per planned dish (edit in the panel)."""

from __future__ import annotations

from datetime import date, datetime, timedelta
from typing import TYPE_CHECKING

from homeassistant.components.calendar import CalendarEntity, CalendarEvent
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback
from homeassistant.helpers.update_coordinator import (
    CoordinatorEntity,
    DataUpdateCoordinator,
)
from homeassistant.util import dt as dt_util

from . import inventory
from .coordinator import async_coordinator

if TYPE_CHECKING:
    from . import PantryConfigEntry

SERVINGS = {"de": "{n} Portionen", "en": "{n} servings"}  # other languages get English
SLOT_NAMES = {
    "de": ["Frühstück", "Mittag", "Kaffee", "Abendessen", "Snack"],
    "en": ["Breakfast", "Lunch", "Coffee", "Dinner", "Snack"],
}
LOOKAHEAD = 8  # days loaded for `event`


async def async_setup_entry(
    hass: HomeAssistant,
    entry: PantryConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    db = entry.runtime_data

    async def update() -> list[dict]:
        today = dt_util.now().date()
        return await db.run(
            inventory.meals, today.isoformat(), (today + timedelta(LOOKAHEAD)).isoformat()
        )

    coordinator = await async_coordinator(hass, entry, update, midnight=True)
    async_add_entities([MealPlan(coordinator, entry)])


class MealPlan(CoordinatorEntity[DataUpdateCoordinator[list[dict]]], CalendarEntity):
    # no device: the name is "Speiseplan" alone, not "Vorrat Speiseplan"
    _attr_has_entity_name = True
    _attr_translation_key = "meal_plan"

    def __init__(self, coordinator, entry: PantryConfigEntry) -> None:
        super().__init__(coordinator)
        self._db = entry.runtime_data
        self._attr_unique_id = f"{entry.entry_id}_meal_plan"

    def _event(self, meal: dict) -> CalendarEvent:
        lang = self.hass.config.language.split("-")[0]
        day = date.fromisoformat(meal["day"])
        return CalendarEvent(
            start=day,
            end=day + timedelta(days=1),
            summary=f"{SLOT_NAMES.get(lang, SLOT_NAMES['en'])[meal['slot']]}: {meal['name']}",
            description=SERVINGS.get(lang, SERVINGS["en"]).format(n=meal["servings"]),
            uid=str(meal["id"]),
        )

    @property
    def event(self) -> CalendarEvent | None:
        # shortcut: the next event looks 7 days ahead; upgrade when a longer lookahead matters.
        return self._event(self.coordinator.data[0]) if self.coordinator.data else None

    async def async_get_events(
        self, hass: HomeAssistant, start_date: datetime, end_date: datetime
    ) -> list[CalendarEvent]:
        """Dishes on the local dates from start through end (end day included)."""
        first = dt_util.as_local(start_date).date()
        last = dt_util.as_local(end_date).date() + timedelta(days=1)
        meals = await self._db.run(inventory.meals, first.isoformat(), last.isoformat())
        return [self._event(m) for m in meals]
