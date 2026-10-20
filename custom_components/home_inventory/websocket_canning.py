"""Websocket commands for canning protocols (any user; deleting goes through home_inventory/delete, admin)."""

from __future__ import annotations

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant

from . import inventory
from .websocket_plan import DAY
from .websocket_stock import _NEW_PRODUCT
from .ws_common import run
from .ws_validate import CANNING_MINUTES, CANNING_TEMP, ID, NULL_ID, PACKAGES, text

_PROCESS = {
    vol.Optional("recipe_id"): NULL_ID,
    vol.Optional("temp"): vol.Any(None, CANNING_TEMP),
    vol.Optional("minutes"): vol.Any(None, CANNING_MINUTES),
    vol.Optional("notes"): vol.Any(None, text(2000)),
    vol.Optional("expires_on"): vol.Any(None, DAY),
}


def async_register(hass: HomeAssistant) -> None:
    for command in (ws_cannings, ws_canning_save):
        websocket_api.async_register_command(hass, command)


@websocket_api.websocket_command({vol.Required("type"): "home_inventory/cannings"})
@websocket_api.async_response
async def ws_cannings(hass: HomeAssistant, connection, msg: dict) -> None:
    connection.send_result(msg["id"], await run(hass, inventory.cannings))


@websocket_api.websocket_command(
    {
        vol.Required("type"): "home_inventory/canning_save",
        # new: made_on, jars, location and a canning recipe or a product (existing or new); edit: id + process data
        vol.Required("data"): vol.Any(
            {vol.Required("id"): ID, **_PROCESS},
            {
                vol.Required("made_on"): DAY,
                vol.Required("jars"): PACKAGES,
                vol.Optional("kind", default="canning"): vol.In(("canning", "drying")),
                vol.Optional("location_id"): NULL_ID,
                vol.Exclusive("product_id", "product"): ID,
                vol.Exclusive("product", "product"): _NEW_PRODUCT,
                **_PROCESS,
            },
        ),
    }
)
@websocket_api.async_response
async def ws_canning_save(hass: HomeAssistant, connection, msg: dict) -> None:
    """Returns {id, batch_id, charge}; a new protocol books its jars in as a new charge."""
    result = await run(hass, inventory.save_canning, msg["data"], connection.user.id)
    connection.send_result(msg["id"], result)
