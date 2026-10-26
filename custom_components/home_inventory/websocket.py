"""Websocket commands for the panel. Thin: validate input, call inventory, return the result.

Master data, defaults, delete and product lookup here; more in websocket_stock / _label / _recipe."""

from __future__ import annotations

from functools import partial

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant

from . import inventory, off
from .ws_common import db_of, run, translated
from .ws_validate import CODE, DAYS, ID, NAME, NULL_ID, PACKAGES, POSITIVE, QUERY, SHELF_DAYS

# Typed columns per table; inventory.save and DB constraints check the rest (cycles, unit rules).
MASTER_SCHEMAS = {
    table: vol.Schema({vol.Optional("id"): ID, vol.Optional("name"): NAME, **cols})
    for table, cols in {
        "unit": {
            vol.Optional("symbol"): NAME,
            vol.Optional("base_unit_id"): NULL_ID,
            vol.Optional("factor"): POSITIVE,
            vol.Optional("is_count"): vol.All(vol.Coerce(int), vol.In((0, 1))),
            vol.Optional("recipe_only"): vol.All(vol.Coerce(int), vol.In((0, 1))),
        },
        "location": {vol.Optional("freezer"): vol.All(vol.Coerce(int), vol.In((0, 1)))},
        "category": {
            vol.Optional("parent_id"): NULL_ID,
            vol.Optional("unit_id"): NULL_ID,
            vol.Optional("default_location_id"): NULL_ID,
            vol.Optional("expiry_type"): vol.Any(None, vol.In(("best_before", "use_by", "guide"))),
            vol.Optional("warn_days"): vol.Any(None, DAYS),
            vol.Optional("shelf_days"): SHELF_DAYS,
            vol.Optional("opened_days"): SHELF_DAYS,
            vol.Optional("food"): vol.Any(None, vol.In((0, 1))),
            vol.Optional("frozen_goods"): vol.Any(None, vol.In((0, 1))),
            vol.Optional("frozen_days"): SHELF_DAYS,
            vol.Optional("emergency_group"): vol.Any(
                None, vol.In((*inventory.EMERGENCY_GROUPS, "none"))
            ),
            # amount and its unit only together (DB CHECK as well)
            vol.Inclusive("min_stock", "min_stock"): vol.Any(None, POSITIVE),
            vol.Inclusive("min_stock_unit_id", "min_stock"): NULL_ID,
            vol.Optional("min_packages"): vol.Any(None, PACKAGES),
        },
    }.items()
}


def async_register(hass: HomeAssistant) -> None:
    for command in (
        ws_master_data,
        ws_save,
        ws_defaults_save,
        ws_delete,
        ws_delete_impact,
        ws_move_location,
        ws_lookup,
        ws_search,
    ):
        websocket_api.async_register_command(hass, command)


@websocket_api.websocket_command({vol.Required("type"): "home_inventory/master_data"})
@websocket_api.async_response
async def ws_master_data(hass: HomeAssistant, connection, msg: dict) -> None:
    def data(conn):
        return {
            **inventory.master_data(conn),
            "leftover_category_id": inventory.leftover_category(conn),
        }

    connection.send_result(msg["id"], await run(hass, data))


@websocket_api.websocket_command(
    {
        vol.Required("type"): "home_inventory/save",
        vol.Required("table"): vol.In(MASTER_SCHEMAS),
        vol.Required("data"): dict,
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_save(hass: HomeAssistant, connection, msg: dict) -> None:
    try:
        data = MASTER_SCHEMAS[msg["table"]](msg["data"])
        row_id = await run(hass, inventory.save, msg["table"], data)
    except (
        vol.Invalid,
        ValueError,
    ) as err:  # wrong type / unknown column: a client bug
        connection.send_error(msg["id"], websocket_api.ERR_INVALID_FORMAT, str(err))
        return
    connection.send_result(msg["id"], {"id": row_id})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "home_inventory/defaults_save",
        vol.Required("data"): {
            vol.Required("unit_id"): ID,
            vol.Required("default_location_id"): NULL_ID,
            vol.Required("expiry_type"): vol.In(("best_before", "use_by", "guide")),
            vol.Required("warn_days"): DAYS,
            vol.Required("shelf_days"): SHELF_DAYS,
            vol.Required("opened_days"): SHELF_DAYS,
            vol.Required("frozen_days"): SHELF_DAYS,
        },
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_defaults_save(hass: HomeAssistant, connection, msg: dict) -> None:
    """Integration-wide defaults (root of inheritance)."""
    await run(hass, inventory.save_defaults, msg["data"])
    connection.send_result(msg["id"])


@websocket_api.websocket_command(
    {
        vol.Required("type"): "home_inventory/delete",
        vol.Required("table"): vol.In((*MASTER_SCHEMAS, "product", "recipe", "canning")),
        vol.Required("row_id"): ID,
        # also delete what uses it (see home_inventory/delete_impact); locations: move the stock there
        vol.Optional("force", default=False): bool,
        vol.Optional("move_to"): NULL_ID,
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_delete(hass: HomeAssistant, connection, msg: dict) -> None:
    if msg["force"]:
        await run(
            hass,
            partial(inventory.force_delete, move_to=msg.get("move_to"), user_id=connection.user.id),
            msg["table"],
            msg["row_id"],
        )
    else:
        await run(hass, inventory.delete, msg["table"], msg["row_id"])
    connection.send_result(msg["id"])


@websocket_api.websocket_command(
    {
        vol.Required("type"): "home_inventory/move_location",
        vol.Required("location_id"): ID,
        vol.Required("move_to"): ID,
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_move_location(hass: HomeAssistant, connection, msg: dict) -> None:
    """Move all stock of a location to another one; the location stays."""
    await run(
        hass,
        partial(inventory.move_location, user_id=connection.user.id),
        msg["location_id"],
        msg["move_to"],
    )
    connection.send_result(msg["id"])


@websocket_api.websocket_command(
    {
        vol.Required("type"): "home_inventory/delete_impact",
        vol.Required("table"): vol.In((*MASTER_SCHEMAS, "product", "recipe", "canning")),
        vol.Required("row_id"): ID,
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_delete_impact(hass: HomeAssistant, connection, msg: dict) -> None:
    """What deleting a row would take with it, for the question before deleting."""
    with translated():  # rolled back: write=False, so no entity refresh
        result = await db_of(hass).run(
            inventory.delete_impact, msg["table"], msg["row_id"], write=False
        )
    connection.send_result(msg["id"], result)


@websocket_api.websocket_command(
    {vol.Required("type"): "home_inventory/lookup", vol.Required("code"): CODE}
)
@websocket_api.async_response
async def ws_lookup(hass: HomeAssistant, connection, msg: dict) -> None:
    """Local product (has "id") or an unsaved OFF draft (no "id") by EAN."""
    db = db_of(hass)
    with translated():
        product = await off.async_lookup(hass, db, msg["code"])
    connection.send_result(msg["id"], {"product": product})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "home_inventory/search",
        vol.Required("query"): QUERY,
        vol.Optional("online", default=False): bool,
    }
)
@websocket_api.async_response
async def ws_search(hass: HomeAssistant, connection, msg: dict) -> None:
    if msg["online"]:
        with translated():
            result = await off.async_search(hass, msg["query"])
    else:
        result = await run(hass, inventory.search_products, msg["query"])
    connection.send_result(msg["id"], result)
