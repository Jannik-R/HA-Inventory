"""Websocket commands for "cooked": the book-out proposal of a recipe, booking it, undo."""

from __future__ import annotations

from functools import partial

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

from . import inventory
from .ws_common import run
from .ws_validate import ID, NULL_ID, PACKAGES_OR_ZERO, REMAINING

SERVINGS = vol.All(int, vol.Range(min=1, max=99))
ITEM = {
    vol.Required("product_id"): ID,
    vol.Optional("batch_id"): NULL_ID,
    vol.Required("packages"): PACKAGES_OR_ZERO,
    vol.Required("action"): vol.In(["out", "open", "reduce"]),
    vol.Optional("open", default=0): PACKAGES_OR_ZERO,
    vol.Optional("used_up", default=0): PACKAGES_OR_ZERO,
    vol.Optional("remaining"): vol.Any(None, REMAINING),
}
IDS = vol.All([ID], vol.Length(max=500))


def async_register(hass: HomeAssistant) -> None:
    for command in (ws_proposal, ws_book, ws_undo):
        websocket_api.async_register_command(hass, command)


@websocket_api.websocket_command(
    {
        vol.Required("type"): "home_inventory/cooked_proposal",
        vol.Required("recipe_id"): ID,
        vol.Required("servings"): SERVINGS,
    }
)
@websocket_api.async_response
async def ws_proposal(hass: HomeAssistant, connection, msg: dict) -> None:
    """Book-out rows for the ingredients of a recipe (nothing is changed)."""
    result = await run(hass, inventory.cooked_proposal, msg["recipe_id"], msg["servings"])
    connection.send_result(msg["id"], result)


@websocket_api.websocket_command(
    {
        vol.Required("type"): "home_inventory/cooked_book",
        vol.Required("items"): vol.All([ITEM], vol.Length(min=1, max=200)),
    }
)
@websocket_api.async_response
async def ws_book(hass: HomeAssistant, connection, msg: dict) -> None:
    """Book the rows in one transaction (all or nothing); any user, like booking."""
    fn = partial(inventory.book_cooked, user_id=connection.user.id, today=dt_util.now().date())
    connection.send_result(msg["id"], await run(hass, fn, msg["items"]))


@websocket_api.websocket_command(
    {
        vol.Required("type"): "home_inventory/cooked_undo",
        vol.Required("out_ids"): IDS,
        vol.Required("open_ids"): IDS,
        vol.Optional("remaining_ids", default=[]): IDS,
    }
)
@websocket_api.async_response
async def ws_undo(hass: HomeAssistant, connection, msg: dict) -> None:
    """Undo a `cooked_book` by the booking ids it returned (once)."""
    fn = partial(
        inventory.undo_cooked, user_id=connection.user.id, remaining_ids=msg["remaining_ids"]
    )
    await run(hass, fn, msg["out_ids"], msg["open_ids"])
    connection.send_result(msg["id"])
