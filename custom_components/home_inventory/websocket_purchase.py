"""Websocket commands for the receipt import: read the OCR text with the AI, book the reviewed items."""

from __future__ import annotations

from functools import partial

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant

from . import ai, inventory
from .inventory.purchase import MAX_ITEMS, MAX_TEXT
from .websocket_stock import _NEW_PRODUCT
from .ws_common import run
from .ws_validate import ID, NAME, NULL_ID, PACKAGES, text

_ITEM = {
    vol.Optional("text"): vol.Any(None, NAME),
    vol.Required("packages"): PACKAGES,
    vol.Optional("expires_on"): vol.Any(None, text(32)),
    vol.Optional("location_id"): NULL_ID,
}
_ITEMS = vol.All(
    [
        vol.Any(
            {**_ITEM, vol.Required("product_id"): ID},
            {**_ITEM, vol.Required("product"): _NEW_PRODUCT},
        )
    ],
    vol.Length(min=1, max=MAX_ITEMS),
)


def async_register(hass: HomeAssistant) -> None:
    for command in (ws_receipt_read, ws_receipt_book):
        websocket_api.async_register_command(hass, command)


@websocket_api.websocket_command(
    {vol.Required("type"): "home_inventory/receipt_read", vol.Required("text"): text(MAX_TEXT)}
)
@websocket_api.async_response
async def ws_receipt_read(hass: HomeAssistant, connection, msg: dict) -> None:
    """OCR text -> {store, items} for review (needs the AI from the options)."""
    connection.send_result(msg["id"], await ai.async_read_receipt(hass, msg["text"]))


@websocket_api.websocket_command(
    {
        vol.Required("type"): "home_inventory/receipt_book",
        vol.Optional("store"): vol.Any(None, text(100)),
        vol.Required("items"): _ITEMS,
    }
)
@websocket_api.async_response
async def ws_receipt_book(hass: HomeAssistant, connection, msg: dict) -> None:
    """Book the reviewed items in, one transaction; any user, like booking."""
    fn = partial(inventory.book_receipt, user_id=connection.user.id)
    connection.send_result(msg["id"], await run(hass, fn, msg.get("store") or "", msg["items"]))
