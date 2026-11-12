"""Websocket commands for the shopping list."""

from __future__ import annotations

from functools import partial

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import Unauthorized

from . import inventory
from .websocket_stock import _NEW_PRODUCT
from .ws_common import run
from .ws_validate import ID, NAME, NULL_ID, PACKAGES


def async_register(hass: HomeAssistant) -> None:
    for command in (
        ws_shopping,
        ws_shopping_done,
        ws_shopping_add,
        ws_shopping_item,
        ws_shopping_item_delete,
    ):
        websocket_api.async_register_command(hass, command)


@websocket_api.websocket_command({vol.Required("type"): "home_inventory/shopping"})
@websocket_api.async_response
async def ws_shopping(hass: HomeAssistant, connection, msg: dict) -> None:
    connection.send_result(msg["id"], await run(hass, inventory.shopping_list))


@websocket_api.websocket_command(
    {
        vol.Required("type"): "home_inventory/shopping_done",
        vol.Exclusive("category_id", "what"): ID,
        vol.Exclusive("product_id", "what"): ID,
        vol.Required("done"): bool,
    }
)
@websocket_api.async_response
async def ws_shopping_done(hass: HomeAssistant, connection, msg: dict) -> None:
    """Check / uncheck a shopping item; any user."""
    await run(
        hass,
        partial(inventory.set_shopping_done, product_id=msg.get("product_id")),
        msg.get("category_id"),
        msg["done"],
    )
    connection.send_result(msg["id"])


@websocket_api.websocket_command(
    {
        vol.Required("type"): "home_inventory/shopping_add",
        vol.Optional("packages", default=1): PACKAGES,
        vol.Exclusive("product_id", "what"): ID,
        vol.Exclusive("category_id", "what"): ID,
        vol.Exclusive("product", "what"): _NEW_PRODUCT,
        vol.Exclusive("category", "what"): vol.Schema(
            {vol.Required("name"): NAME, vol.Optional("parent_id"): NULL_ID}
        ),
    }
)
@websocket_api.async_response
async def ws_shopping_add(hass: HomeAssistant, connection, msg: dict) -> None:
    """Put a product or category on the list by hand (a new product: any user; a new category: admin)."""
    if "category" in msg and not connection.user.is_admin:
        raise Unauthorized
    keys = ("product_id", "category_id", "product", "category")
    item_id = await run(
        hass,
        partial(inventory.add_shopping_item, **{k: msg[k] for k in keys if k in msg}),
        msg["packages"],
    )
    connection.send_result(msg["id"], {"id": item_id})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "home_inventory/shopping_item",
        vol.Required("item_id"): ID,
        vol.Optional("packages"): PACKAGES,
        vol.Optional("done"): bool,
    }
)
@websocket_api.async_response
async def ws_shopping_item(hass: HomeAssistant, connection, msg: dict) -> None:
    await run(
        hass,
        partial(inventory.update_shopping_item, packages=msg.get("packages"), done=msg.get("done")),
        msg["item_id"],
    )
    connection.send_result(msg["id"])


@websocket_api.websocket_command(
    {vol.Required("type"): "home_inventory/shopping_item_delete", vol.Required("item_id"): ID}
)
@websocket_api.async_response
async def ws_shopping_item_delete(hass: HomeAssistant, connection, msg: dict) -> None:
    await run(hass, inventory.delete_shopping_item, msg["item_id"])
    connection.send_result(msg["id"])
