"""Websocket commands for the panel. Thin: validate input, call inventory, return the result."""

from __future__ import annotations

from collections.abc import Iterator
from contextlib import contextmanager
from functools import partial
from typing import Any

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import HomeAssistantError, Unauthorized

from . import inventory, off
from .const import DOMAIN
from .inventory import InventoryError
from .ws_validate import (
    CODE,
    DAYS,
    EAN,
    ID,
    IMAGE_URL,
    NAME,
    NULL_ID,
    OFF_JSON,
    PACKAGES,
    PACKAGES_OR_ZERO,
    POSITIVE,
    QUERY,
    text,
)

# Typed columns per table; inventory.save and DB constraints check the rest (cycles, unit rules).
MASTER_SCHEMAS = {
    table: vol.Schema({vol.Optional("id"): ID, vol.Optional("name"): NAME, **cols})
    for table, cols in {
        "unit": {
            vol.Optional("symbol"): NAME,
            vol.Optional("base_unit_id"): NULL_ID,
            vol.Optional("factor"): POSITIVE,
            vol.Optional("is_count"): vol.All(vol.Coerce(int), vol.In((0, 1))),
        },
        "location": {},
        "category": {
            vol.Optional("parent_id"): NULL_ID,
            vol.Optional("unit_id"): NULL_ID,
            vol.Optional("default_location_id"): NULL_ID,
            vol.Optional("expiry_type"): vol.Any(None, vol.In(("best_before", "use_by"))),
            vol.Optional("warn_days"): vol.Any(None, DAYS),
            # amount and its unit only together (DB CHECK as well)
            vol.Inclusive("min_stock", "min_stock"): vol.Any(None, POSITIVE),
            vol.Inclusive("min_stock_unit_id", "min_stock"): NULL_ID,
            vol.Optional("min_packages"): vol.Any(None, PACKAGES),
        },
    }.items()
}
_EXPIRY_TYPE = vol.Any(None, vol.In(("best_before", "use_by")))
_NEW_PRODUCT = vol.Schema(
    {
        vol.Required("name"): NAME,
        vol.Required("category_id"): ID,
        vol.Optional("ean"): vol.Any(None, EAN),
        vol.Optional("brand"): vol.Any(None, NAME),
        vol.Optional("content_amount"): vol.Any(None, POSITIVE),
        vol.Optional("content_unit_id"): NULL_ID,
        vol.Optional("image_url"): vol.Any(None, IMAGE_URL),
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
    }
)


def async_register(hass: HomeAssistant) -> None:
    for command in (
        ws_master_data,
        ws_save,
        ws_defaults_save,
        ws_delete,
        ws_delete_impact,
        ws_lookup,
        ws_search,
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


def _db(hass: HomeAssistant):
    entries = hass.config_entries.async_loaded_entries(DOMAIN)
    if not entries:
        raise HomeAssistantError(translation_domain=DOMAIN, translation_key="not_loaded")
    return entries[0].runtime_data


@contextmanager
def _translated(cls: type[HomeAssistantError] = HomeAssistantError) -> Iterator[None]:
    """InventoryError -> HomeAssistantError (services: ServiceValidationError) with translation."""
    try:
        yield
    except InventoryError as err:
        raise cls(
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
        vol.Required("type"): "pantry/defaults_save",
        vol.Required("data"): {
            vol.Required("unit_id"): ID,
            vol.Required("default_location_id"): NULL_ID,
            vol.Required("expiry_type"): vol.In(("best_before", "use_by")),
            vol.Required("warn_days"): DAYS,
        },
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_defaults_save(hass: HomeAssistant, connection, msg: dict) -> None:
    """Integration-wide defaults (root of inheritance)."""
    await _run(hass, inventory.save_defaults, msg["data"])
    connection.send_result(msg["id"])


@websocket_api.websocket_command(
    {
        vol.Required("type"): "pantry/delete",
        vol.Required("table"): vol.In((*MASTER_SCHEMAS, "product", "recipe")),
        vol.Required("row_id"): ID,
        # also delete what uses it (see pantry/delete_impact); locations: move the stock there
        vol.Optional("force", default=False): bool,
        vol.Optional("move_to"): NULL_ID,
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_delete(hass: HomeAssistant, connection, msg: dict) -> None:
    if msg["force"]:
        await _run(
            hass,
            partial(inventory.force_delete, move_to=msg.get("move_to"), user_id=connection.user.id),
            msg["table"],
            msg["row_id"],
        )
    else:
        await _run(hass, inventory.delete, msg["table"], msg["row_id"])
    connection.send_result(msg["id"])


@websocket_api.websocket_command(
    {
        vol.Required("type"): "pantry/delete_impact",
        vol.Required("table"): vol.In((*MASTER_SCHEMAS, "product", "recipe")),
        vol.Required("row_id"): ID,
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_delete_impact(hass: HomeAssistant, connection, msg: dict) -> None:
    """What deleting a row would take with it, for the question before deleting."""
    with _translated():  # rolled back: write=False, so no entity refresh
        result = await _db(hass).run(
            inventory.delete_impact, msg["table"], msg["row_id"], write=False
        )
    connection.send_result(msg["id"], result)


@websocket_api.websocket_command(
    {vol.Required("type"): "pantry/lookup", vol.Required("code"): CODE}
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
        vol.Required("query"): QUERY,
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
    }
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
        vol.Required("product_id"): ID,
        vol.Required("packages"): PACKAGES,
        vol.Optional("batch_id"): ID,
        vol.Optional("location_id"): ID,
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
        vol.Required("type"): "pantry/put_back",
        vol.Required("booking_ids"): vol.All([ID], vol.Length(min=1, max=50)),
    }
)
@websocket_api.async_response
async def ws_put_back(hass: HomeAssistant, connection, msg: dict) -> None:
    """Undo book-outs by the `booking_id`s of the `taken` rows; each can be undone once."""
    await _run(hass, partial(inventory.put_back, user_id=connection.user.id), msg["booking_ids"])
    connection.send_result(msg["id"])


@websocket_api.websocket_command(
    {
        vol.Required("type"): "pantry/stock_edit",
        vol.Required("batch_id"): ID,
        vol.Required("location_id"): ID,
        vol.Required("expires_on"): vol.Any(None, text(32)),
        vol.Required("packages"): PACKAGES_OR_ZERO,
    }
)
@websocket_api.async_response
async def ws_stock_edit(hass: HomeAssistant, connection, msg: dict) -> None:
    """Fix a stock row (wrong date or count); any user, like booking."""
    batch_id = await _run(
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
        vol.Required("type"): "pantry/stock",
        vol.Optional("product_id"): ID,
        vol.Optional("search"): QUERY,
        vol.Optional("location_id"): ID,
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
    try:
        row_id = await _run(hass, inventory.save, "product", msg["data"])
    except ValueError as err:  # e.g. only an id: a client bug
        connection.send_error(msg["id"], websocket_api.ERR_INVALID_FORMAT, str(err))
        return
    connection.send_result(msg["id"], {"id": row_id})


@websocket_api.websocket_command({vol.Required("type"): "pantry/shopping"})
@websocket_api.async_response
async def ws_shopping(hass: HomeAssistant, connection, msg: dict) -> None:
    connection.send_result(msg["id"], await _run(hass, inventory.shopping_list))


@websocket_api.websocket_command(
    {
        vol.Required("type"): "pantry/shopping_done",
        vol.Exclusive("category_id", "what"): ID,
        vol.Exclusive("product_id", "what"): ID,
        vol.Required("done"): bool,
    }
)
@websocket_api.async_response
async def ws_shopping_done(hass: HomeAssistant, connection, msg: dict) -> None:
    """Check / uncheck a shopping item; any user."""
    await _run(
        hass,
        partial(inventory.set_shopping_done, product_id=msg.get("product_id")),
        msg.get("category_id"),
        msg["done"],
    )
    connection.send_result(msg["id"])


@websocket_api.websocket_command(
    {
        vol.Required("type"): "pantry/shopping_add",
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
    item_id = await _run(
        hass,
        partial(inventory.add_shopping_item, **{k: msg[k] for k in keys if k in msg}),
        msg["packages"],
    )
    connection.send_result(msg["id"], {"id": item_id})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "pantry/shopping_item",
        vol.Required("item_id"): ID,
        vol.Optional("packages"): PACKAGES,
        vol.Optional("done"): bool,
    }
)
@websocket_api.async_response
async def ws_shopping_item(hass: HomeAssistant, connection, msg: dict) -> None:
    await _run(
        hass,
        partial(inventory.update_shopping_item, packages=msg.get("packages"), done=msg.get("done")),
        msg["item_id"],
    )
    connection.send_result(msg["id"])


@websocket_api.websocket_command(
    {vol.Required("type"): "pantry/shopping_item_delete", vol.Required("item_id"): ID}
)
@websocket_api.async_response
async def ws_shopping_item_delete(hass: HomeAssistant, connection, msg: dict) -> None:
    await _run(hass, inventory.delete_shopping_item, msg["item_id"])
    connection.send_result(msg["id"])
