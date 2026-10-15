"""Websocket commands for the panel. Thin: validate input, call inventory, return the result."""

from __future__ import annotations

from collections.abc import Iterator
from contextlib import contextmanager
from functools import partial
from typing import Any

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import HomeAssistantError

from . import inventory, off
from .const import DOMAIN
from .inventory import InventoryError

_ID = vol.Any(None, int)
_POSITIVE = vol.All(vol.Coerce(float), vol.Range(min=0, min_included=False))
# Typed columns per table; inventory.save and DB constraints check the rest (cycles, unit rules).
MASTER_SCHEMAS = {
    table: vol.Schema({vol.Optional("id"): int, vol.Optional("name"): str, **cols})
    for table, cols in {
        "unit": {
            vol.Optional("symbol"): str,
            vol.Optional("base_unit_id"): _ID,
            vol.Optional("factor"): _POSITIVE,
            vol.Optional("is_count"): vol.All(vol.Coerce(int), vol.In((0, 1))),
        },
        "location": {},
        "category": {
            vol.Optional("parent_id"): _ID,
            vol.Optional("unit_id"): _ID,
            vol.Optional("default_location_id"): _ID,
            vol.Optional("expiry_type"): vol.Any(
                None, vol.In(("best_before", "use_by"))
            ),
            vol.Optional("warn_days"): vol.Any(None, vol.All(int, vol.Range(min=0))),
            vol.Optional("min_stock"): vol.Any(None, _POSITIVE),
        },
    }.items()
}
_EXPIRY_TYPE = vol.Any(None, vol.In(("best_before", "use_by")))
_NEW_PRODUCT = vol.Schema(
    {
        vol.Required("name"): str,
        vol.Required("category_id"): int,
        vol.Optional("ean"): vol.Any(None, str),
        vol.Optional("brand"): vol.Any(None, str),
        vol.Optional("content_amount"): vol.Any(None, _POSITIVE),
        vol.Optional("content_unit_id"): _ID,
        vol.Optional("image_url"): vol.Any(None, str),
        vol.Optional("off_json"): vol.Any(None, str),
        vol.Optional("default_location_id"): _ID,
    }
)

# Product edits (creation happens on book in); any user, like booking.
_PRODUCT = vol.Schema(
    {
        vol.Required("id"): int,
        **{vol.Optional(str(k)): v for k, v in _NEW_PRODUCT.schema.items()},
        vol.Optional("expiry_type"): _EXPIRY_TYPE,
        vol.Optional("warn_days"): vol.Any(None, vol.All(int, vol.Range(min=0))),
    }
)


def async_register(hass: HomeAssistant) -> None:
    for command in (
        ws_master_data,
        ws_save,
        ws_delete,
        ws_lookup,
        ws_search,
        ws_book_in,
        ws_book_out,
        ws_stock,
        ws_products,
        ws_product_save,
    ):
        websocket_api.async_register_command(hass, command)


def _db(hass: HomeAssistant):
    entries = hass.config_entries.async_loaded_entries(DOMAIN)
    if not entries:
        raise HomeAssistantError(
            translation_domain=DOMAIN, translation_key="not_loaded"
        )
    return entries[0].runtime_data


@contextmanager
def _translated() -> Iterator[None]:
    """InventoryError -> HomeAssistantError with translation."""
    try:
        yield
    except InventoryError as err:
        raise HomeAssistantError(
            translation_domain=DOMAIN,
            translation_key=err.translation_key,
            translation_placeholders={k: str(v) for k, v in err.placeholders.items()},
        ) from err


async def _run(hass: HomeAssistant, fn, *args: Any) -> Any:
    """Run an inventory function on the loaded entry's DB."""
    db = _db(hass)
    with _translated():
        return await db.run(fn, *args)


@websocket_api.websocket_command({vol.Required("type"): "pantry/master_data"})
@websocket_api.async_response
async def ws_master_data(hass: HomeAssistant, connection, msg: dict) -> None:
    connection.send_result(msg["id"], await _run(hass, inventory.master_data))


@websocket_api.websocket_command(
    {
        vol.Required("type"): "pantry/save",
        vol.Required("table"): vol.In(MASTER_SCHEMAS),
        vol.Required("data"): dict,
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_save(hass: HomeAssistant, connection, msg: dict) -> None:
    try:
        data = MASTER_SCHEMAS[msg["table"]](msg["data"])
        row_id = await _run(hass, inventory.save, msg["table"], data)
    except (
        vol.Invalid,
        ValueError,
    ) as err:  # wrong type / unknown column: a client bug
        connection.send_error(msg["id"], websocket_api.ERR_INVALID_FORMAT, str(err))
        return
    connection.send_result(msg["id"], {"id": row_id})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "pantry/delete",
        vol.Required("table"): vol.In((*MASTER_SCHEMAS, "product")),
        vol.Required("row_id"): int,
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_delete(hass: HomeAssistant, connection, msg: dict) -> None:
    await _run(hass, inventory.delete, msg["table"], msg["row_id"])
    connection.send_result(msg["id"])


@websocket_api.websocket_command(
    {vol.Required("type"): "pantry/lookup", vol.Required("code"): str}
)
@websocket_api.async_response
async def ws_lookup(hass: HomeAssistant, connection, msg: dict) -> None:
    """Local product (has "id") or an unsaved OFF draft (no "id") by EAN."""
    db = _db(hass)
    with _translated():
        product = await off.async_lookup(hass, db, msg["code"])
    connection.send_result(msg["id"], {"product": product})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "pantry/search",
        vol.Required("query"): str,
        vol.Optional("online", default=False): bool,
    }
)
@websocket_api.async_response
async def ws_search(hass: HomeAssistant, connection, msg: dict) -> None:
    if msg["online"]:
        with _translated():
            result = await off.async_search(hass, msg["query"])
    else:
        result = await _run(hass, inventory.search_products, msg["query"])
    connection.send_result(msg["id"], result)


@websocket_api.websocket_command(
    {
        vol.Required("type"): "pantry/book_in",
        vol.Required("packages"): vol.All(int, vol.Range(min=1)),
        vol.Optional("expires_on"): vol.Any(None, str),
        vol.Optional("expiry_type"): _EXPIRY_TYPE,
        vol.Optional("location_id"): _ID,
        vol.Exclusive("product_id", "product"): int,
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
    opts = {
        k: msg[k] for k in ("expires_on", "expiry_type", "location_id") if k in msg
    } | {"source": "panel", "user_id": connection.user.id}
    try:
        if "product_id" in msg:
            batch_id = await _run(
                hass,
                partial(inventory.book_in, **opts),
                msg["product_id"],
                msg["packages"],
            )
            result = {"product_id": msg["product_id"], "batch_id": batch_id}
        else:
            result = await _run(
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
        vol.Required("type"): "pantry/book_out",
        vol.Required("product_id"): int,
        vol.Required("packages"): vol.All(int, vol.Range(min=1)),
        vol.Optional("batch_id"): int,
        vol.Optional("location_id"): int,
    }
)
@websocket_api.async_response
async def ws_book_out(hass: HomeAssistant, connection, msg: dict) -> None:
    taken = await _run(
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
        vol.Required("type"): "pantry/stock",
        vol.Optional("product_id"): int,
        vol.Optional("search"): str,
        vol.Optional("location_id"): int,
    }
)
@websocket_api.async_response
async def ws_stock(hass: HomeAssistant, connection, msg: dict) -> None:
    rows = await _run(
        hass,
        partial(
            inventory.stock_list,
            search=msg.get("search"),
            location_id=msg.get("location_id"),
            product_id=msg.get("product_id"),
        ),
    )
    connection.send_result(msg["id"], rows)


@websocket_api.websocket_command({vol.Required("type"): "pantry/products"})
@websocket_api.async_response
async def ws_products(hass: HomeAssistant, connection, msg: dict) -> None:
    connection.send_result(msg["id"], await _run(hass, inventory.list_products))


@websocket_api.websocket_command(
    {vol.Required("type"): "pantry/product_save", vol.Required("data"): _PRODUCT}
)
@websocket_api.async_response
async def ws_product_save(hass: HomeAssistant, connection, msg: dict) -> None:
    row_id = await _run(hass, inventory.save, "product", msg["data"])
    connection.send_result(msg["id"], {"id": row_id})
