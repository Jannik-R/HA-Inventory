"""Websocket commands for stock, booking, products and the shopping list."""

from __future__ import annotations

from functools import partial

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import Unauthorized
from homeassistant.util import dt as dt_util

from . import inventory
from .ws_common import run
from .ws_validate import (
    DAYS,
    EAN,
    HTTP_URL,
    ID,
    NAME,
    NULL_ID,
    OFF_JSON,
    PACKAGES,
    PACKAGES_OR_ZERO,
    POSITIVE,
    QUERY,
    SHELF_DAYS,
    text,
)

_EXPIRY_TYPE = vol.Any(None, vol.In(("best_before", "use_by", "guide")))
_NEW_PRODUCT = vol.Schema(
    {
        vol.Required("name"): NAME,
        vol.Required("category_id"): ID,
        vol.Optional("ean"): vol.Any(None, EAN),
        vol.Optional("brand"): vol.Any(None, NAME),
        vol.Optional("content_amount"): vol.Any(None, POSITIVE),
        vol.Optional("content_unit_id"): NULL_ID,
        vol.Optional("image_url"): vol.Any(None, HTTP_URL),
        vol.Optional("off_json"): vol.Any(None, OFF_JSON),
        vol.Optional("default_location_id"): NULL_ID,
        vol.Optional("min_packages"): vol.Any(None, PACKAGES),
    }
)

# Product edits (creation happens on book in); any user, like booking.
_PRODUCT = vol.Schema(
    {
        vol.Required("id"): ID,
        **{vol.Optional(str(k)): v for k, v in _NEW_PRODUCT.schema.items()},
        vol.Optional("expiry_type"): _EXPIRY_TYPE,
        vol.Optional("warn_days"): vol.Any(None, DAYS),
        vol.Optional("shelf_days"): SHELF_DAYS,
        vol.Optional("opened_days"): SHELF_DAYS,
    }
)


def async_register(hass: HomeAssistant) -> None:
    for command in (
        ws_book_in,
        ws_book_out,
        ws_put_back,
        ws_stock_edit,
        ws_stock,
        ws_products,
        ws_product_save,
        ws_shopping,
        ws_shopping_done,
        ws_shopping_add,
        ws_shopping_item,
        ws_shopping_item_delete,
    ):
        websocket_api.async_register_command(hass, command)


@websocket_api.websocket_command(
    {
        vol.Required("type"): "home_inventory/book_in",
        vol.Required("packages"): PACKAGES,
        vol.Optional("expires_on"): vol.Any(None, text(32)),
        vol.Optional("location_id"): NULL_ID,
        vol.Exclusive("product_id", "product"): ID,
        vol.Exclusive("product", "product"): _NEW_PRODUCT,
    }
)
@websocket_api.async_response
async def ws_book_in(hass: HomeAssistant, connection, msg: dict) -> None:
    """Book in an existing product (product_id) or save a new one and book it in (product)."""
    if ("product_id" in msg) == ("product" in msg):
        connection.send_error(
            msg["id"], websocket_api.ERR_INVALID_FORMAT, "need product_id or product"
        )
        return
    opts = {k: msg[k] for k in ("expires_on", "location_id") if k in msg} | {
        "source": "panel",
        "user_id": connection.user.id,
        "today": dt_util.now().date(),
    }
    try:
        if "product_id" in msg:
            batch_id = await run(
                hass,
                partial(inventory.book_in, **opts),
                msg["product_id"],
                msg["packages"],
            )
            result = {"product_id": msg["product_id"], "batch_id": batch_id}
        else:
            result = await run(
                hass,
                partial(inventory.book_in_new, **opts),
                msg["product"],
                msg["packages"],
            )
    except ValueError as err:  # unknown column: a client bug
        connection.send_error(msg["id"], websocket_api.ERR_INVALID_FORMAT, str(err))
        return
    connection.send_result(msg["id"], result)


@websocket_api.websocket_command(
    {
        vol.Required("type"): "home_inventory/book_out",
        vol.Required("product_id"): ID,
        vol.Required("packages"): PACKAGES,
        vol.Optional("batch_id"): ID,
        vol.Optional("location_id"): ID,
    }
)
@websocket_api.async_response
async def ws_book_out(hass: HomeAssistant, connection, msg: dict) -> None:
    taken = await run(
        hass,
        partial(
            inventory.book_out,
            batch_id=msg.get("batch_id"),
            location_id=msg.get("location_id"),
            source="panel",
            user_id=connection.user.id,
        ),
        msg["product_id"],
        msg["packages"],
    )
    connection.send_result(msg["id"], {"taken": taken})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "home_inventory/put_back",
        vol.Required("booking_ids"): vol.All([ID], vol.Length(min=1, max=50)),
    }
)
@websocket_api.async_response
async def ws_put_back(hass: HomeAssistant, connection, msg: dict) -> None:
    """Undo book-outs by the `booking_id`s of the `taken` rows; each can be undone once."""
    await run(hass, partial(inventory.put_back, user_id=connection.user.id), msg["booking_ids"])
    connection.send_result(msg["id"])


@websocket_api.websocket_command(
    {
        vol.Required("type"): "home_inventory/stock_edit",
        vol.Required("batch_id"): ID,
        vol.Required("location_id"): ID,
        vol.Required("expires_on"): vol.Any(None, text(32)),
        vol.Required("packages"): PACKAGES_OR_ZERO,
    }
)
@websocket_api.async_response
async def ws_stock_edit(hass: HomeAssistant, connection, msg: dict) -> None:
    """Fix a stock row (wrong date or count); any user, like booking."""
    batch_id = await run(
        hass,
        partial(inventory.edit_stock, source="panel", user_id=connection.user.id),
        msg["batch_id"],
        msg["location_id"],
        msg["expires_on"],
        msg["packages"],
    )
    connection.send_result(msg["id"], {"batch_id": batch_id})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "home_inventory/stock",
        vol.Optional("product_id"): ID,
        vol.Optional("search"): QUERY,
        vol.Optional("location_id"): ID,
    }
)
@websocket_api.async_response
async def ws_stock(hass: HomeAssistant, connection, msg: dict) -> None:
    rows = await run(
        hass,
        partial(
            inventory.stock_list,
            search=msg.get("search"),
            location_id=msg.get("location_id"),
            product_id=msg.get("product_id"),
        ),
    )
    connection.send_result(msg["id"], rows)


@websocket_api.websocket_command({vol.Required("type"): "home_inventory/products"})
@websocket_api.async_response
async def ws_products(hass: HomeAssistant, connection, msg: dict) -> None:
    connection.send_result(msg["id"], await run(hass, inventory.list_products))


@websocket_api.websocket_command(
    {vol.Required("type"): "home_inventory/product_save", vol.Required("data"): _PRODUCT}
)
@websocket_api.async_response
async def ws_product_save(hass: HomeAssistant, connection, msg: dict) -> None:
    try:
        row_id = await run(hass, inventory.save, "product", msg["data"])
    except ValueError as err:  # e.g. only an id: a client bug
        connection.send_error(msg["id"], websocket_api.ERR_INVALID_FORMAT, str(err))
        return
    connection.send_result(msg["id"], {"id": row_id})


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
