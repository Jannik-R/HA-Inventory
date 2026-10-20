"""Websocket commands for opened and frozen packages: open (batch row, product, label code),
freeze, thaw, and undo them."""

from __future__ import annotations

from functools import partial

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

from . import inventory
from .ws_common import run
from .ws_validate import CODE, ID, PACKAGES


def async_register(hass: HomeAssistant) -> None:
    for command in (ws_open_package, ws_open_label, ws_open_undo, ws_freeze, ws_frozen_undo):
        websocket_api.async_register_command(hass, command)


@websocket_api.websocket_command(
    {
        vol.Required("type"): "home_inventory/open_package",
        vol.Required("product_id"): ID,
        vol.Optional("batch_id"): ID,
        vol.Optional("location_id"): ID,
    }
)
@websocket_api.async_response
async def ws_open_package(hass: HomeAssistant, connection, msg: dict) -> None:
    """Open one package (of that batch / location, else earliest expiry first); any user."""
    fn = partial(
        inventory.open_package,
        batch_id=msg.get("batch_id"),
        location_id=msg.get("location_id"),
        today=dt_util.now().date(),
        source="panel",
        user_id=connection.user.id,
    )
    connection.send_result(msg["id"], await run(hass, fn, msg["product_id"]))


@websocket_api.websocket_command(
    {vol.Required("type"): "home_inventory/open_label", vol.Required("code"): CODE}
)
@websocket_api.async_response
async def ws_open_label(hass: HomeAssistant, connection, msg: dict) -> None:
    """Open one package of the batch a scanned label names (code without PTRY:)."""
    fn = partial(inventory.open_code, today=dt_util.now().date(), user_id=connection.user.id)
    connection.send_result(msg["id"], await run(hass, fn, msg["code"]))


@websocket_api.websocket_command(
    {vol.Required("type"): "home_inventory/open_undo", vol.Required("booking_id"): ID}
)
@websocket_api.async_response
async def ws_open_undo(hass: HomeAssistant, connection, msg: dict) -> None:
    """Undo an opening by its booking id (once)."""
    await run(hass, partial(inventory.undo_open, user_id=connection.user.id), msg["booking_id"])
    connection.send_result(msg["id"])


@websocket_api.websocket_command(
    {
        vol.Required("type"): "home_inventory/freeze",
        vol.Required("thaw"): bool,
        vol.Required("product_id"): ID,
        vol.Optional("packages", default=1): PACKAGES,
        vol.Optional("batch_id"): ID,
        vol.Optional("location_id"): ID,
        vol.Optional("to_location_id"): ID,
    }
)
@websocket_api.async_response
async def ws_freeze(hass: HomeAssistant, connection, msg: dict) -> None:
    """Freeze (thaw: false) or thaw packages of a batch / product; any user, like booking."""
    fn = partial(
        inventory.thaw if msg["thaw"] else inventory.freeze,
        packages=msg["packages"],
        batch_id=msg.get("batch_id"),
        location_id=msg.get("location_id"),
        to_location_id=msg.get("to_location_id"),
        today=dt_util.now().date(),
        source="panel",
        user_id=connection.user.id,
    )
    connection.send_result(msg["id"], await run(hass, fn, msg["product_id"]))


@websocket_api.websocket_command(
    {vol.Required("type"): "home_inventory/frozen_undo", vol.Required("booking_id"): ID}
)
@websocket_api.async_response
async def ws_frozen_undo(hass: HomeAssistant, connection, msg: dict) -> None:
    """Undo a freeze / thaw by the booking id it returned (once)."""
    await run(hass, partial(inventory.undo_frozen, user_id=connection.user.id), msg["booking_id"])
    connection.send_result(msg["id"])
