"""Websocket commands for stocktaking a location (any user, like booking; panel only: corrections)."""

from __future__ import annotations

from functools import partial

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

from . import inventory
from .websocket_plan import DAY
from .ws_common import run
from .ws_validate import CODE, ID, PACKAGES, PACKAGES_OR_ZERO


def async_register(hass: HomeAssistant) -> None:
    for command in (ws_stocktake_scan, ws_stocktake_apply):
        websocket_api.async_register_command(hass, command)


@websocket_api.websocket_command(
    {
        vol.Required("type"): "home_inventory/stocktake_scan",
        vol.Required("location_id"): ID,
        vol.Required("code"): CODE,
    }
)
@websocket_api.async_response
async def ws_stocktake_scan(hass: HomeAssistant, connection, msg: dict) -> None:
    """The product a scan names and its batches at the location (see inventory.stocktake_scan)."""
    fn = partial(inventory.stocktake_scan, today=dt_util.now().date())
    connection.send_result(msg["id"], await run(hass, fn, msg["location_id"], msg["code"]))


@websocket_api.websocket_command(
    {
        vol.Required("type"): "home_inventory/stocktake_apply",
        vol.Required("location_id"): ID,
        vol.Required("counts"): vol.All(
            [{vol.Required("batch_id"): ID, vol.Required("packages"): PACKAGES_OR_ZERO}],
            vol.Length(max=5000),
        ),
        vol.Required("extra"): vol.All(
            [
                {
                    vol.Required("product_id"): ID,
                    vol.Required("packages"): PACKAGES,
                    vol.Optional("expires_on"): vol.Any(None, DAY),
                }
            ],
            vol.Length(max=1000),
        ),
    }
)
@websocket_api.async_response
async def ws_stocktake_apply(hass: HomeAssistant, connection, msg: dict) -> None:
    """Book the differences as corrections; returns {corrections}."""
    fn = partial(
        inventory.stocktake_apply,
        today=dt_util.now().date(),
        user_id=connection.user.id,
    )
    done = await run(hass, fn, msg["location_id"], msg["counts"], msg["extra"])
    connection.send_result(msg["id"], {"corrections": done})
