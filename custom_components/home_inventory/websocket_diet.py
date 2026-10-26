"""Websocket command for the admin reload of allergens / diet from Open Food Facts."""

from __future__ import annotations

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant

from . import off_diet
from .ws_common import db_of, translated
from .ws_validate import ID


def async_register(hass: HomeAssistant) -> None:
    websocket_api.async_register_command(hass, ws_diet_reload)


@websocket_api.websocket_command(
    {
        vol.Required("type"): "home_inventory/diet_reload",
        vol.Optional("after", default=0): vol.Any(0, ID),
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_diet_reload(hass: HomeAssistant, connection, msg: dict) -> None:
    """One chunk of products (see off_diet); the panel repeats with `after` = result `last`."""
    with translated():
        result = await off_diet.async_reload_chunk(hass, db_of(hass), msg["after"])
    connection.send_result(msg["id"], result)
