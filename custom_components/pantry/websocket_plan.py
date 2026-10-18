"""Websocket commands for the week planner (any user) and the meal start times (saving: admin)."""

from __future__ import annotations

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant

from . import inventory
from .const import CONF_HOUSEHOLD_SERVINGS, DEFAULT_SERVINGS, DOMAIN
from .websocket_recipe import SERVINGS
from .ws_common import run
from .ws_validate import ID, NULL_ID, text

DAY = vol.Datetime(format="%Y-%m-%d")
SLOT = vol.All(int, vol.Range(min=0, max=4))
CLOCK = vol.All(str, vol.Match(r"^([01][0-9]|2[0-3]):[0-5][0-9]$"))


def async_register(hass: HomeAssistant) -> None:
    for command in (
        ws_meal_plan,
        ws_meal_save,
        ws_meal_delete,
        ws_meal_shift,
        ws_meal_times,
        ws_meal_times_save,
    ):
        websocket_api.async_register_command(hass, command)


@websocket_api.websocket_command(
    {vol.Required("type"): "pantry/meal_plan", vol.Required("start"): DAY, vol.Required("end"): DAY}
)
@websocket_api.async_response
async def ws_meal_plan(hass: HomeAssistant, connection, msg: dict) -> None:
    """Dishes of start <= day < end plus the household's default servings."""
    meals = await run(hass, inventory.meals, msg["start"], msg["end"])  # raises when not loaded
    options = hass.config_entries.async_loaded_entries(DOMAIN)[0].options
    servings = options.get(CONF_HOUSEHOLD_SERVINGS, DEFAULT_SERVINGS)
    connection.send_result(msg["id"], {"household_servings": servings, "meals": meals})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "pantry/meal_save",
        vol.Required("data"): {
            vol.Optional("id"): ID,
            vol.Required("day"): DAY,
            vol.Required("recipe_id"): NULL_ID,
            vol.Required("text"): text(200),
            vol.Required("slot"): SLOT,
            vol.Required("servings"): SERVINGS,
        },
    }
)
@websocket_api.async_response
async def ws_meal_save(hass: HomeAssistant, connection, msg: dict) -> None:
    connection.send_result(msg["id"], {"id": await run(hass, inventory.save_meal, msg["data"])})


@websocket_api.websocket_command(
    {vol.Required("type"): "pantry/meal_delete", vol.Required("meal_id"): ID}
)
@websocket_api.async_response
async def ws_meal_delete(hass: HomeAssistant, connection, msg: dict) -> None:
    await run(hass, inventory.delete_meal, msg["meal_id"])
    connection.send_result(msg["id"])


@websocket_api.websocket_command(
    {
        vol.Required("type"): "pantry/meal_shift",
        vol.Required("day"): DAY,
        vol.Required("slot"): SLOT,
        vol.Required("apply"): bool,
    }
)
@websocket_api.async_response
async def ws_meal_shift(hass: HomeAssistant, connection, msg: dict) -> None:
    """Move the slot's dishes a day later up to the first gap; returns them as they were."""
    meals = await run(hass, inventory.shift_meals, msg["day"], msg["slot"], msg["apply"])
    connection.send_result(msg["id"], {"meals": meals})


@websocket_api.websocket_command({vol.Required("type"): "pantry/meal_times"})
@websocket_api.async_response
async def ws_meal_times(hass: HomeAssistant, connection, msg: dict) -> None:
    connection.send_result(msg["id"], await run(hass, inventory.meal_times))


@websocket_api.websocket_command(
    {
        vol.Required("type"): "pantry/meal_times_save",
        vol.Required("starts"): vol.All([CLOCK], vol.Length(min=5, max=5)),
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_meal_times_save(hass: HomeAssistant, connection, msg: dict) -> None:
    """Start time per meal slot 0..4 (settings, admin)."""
    await run(hass, inventory.save_meal_times, msg["starts"])
    connection.send_result(msg["id"])
