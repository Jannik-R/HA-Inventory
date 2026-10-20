"""Websocket command for the emergency stock (Notvorrat), any user."""

from __future__ import annotations

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

from . import inventory
from .const import CONF_HOUSEHOLD_SERVINGS, DEFAULT_SERVINGS
from .ws_common import options_of, run


def async_register(hass: HomeAssistant) -> None:
    websocket_api.async_register_command(hass, ws_emergency)


@websocket_api.websocket_command({vol.Required("type"): "home_inventory/emergency"})
@websocket_api.async_response
async def ws_emergency(hass: HomeAssistant, connection, msg: dict) -> None:
    """Need, stock and supply days per food group for the household's persons."""
    persons = options_of(hass).get(CONF_HOUSEHOLD_SERVINGS, DEFAULT_SERVINGS)
    connection.send_result(
        msg["id"], await run(hass, inventory.emergency_supply, persons, dt_util.now().date())
    )
