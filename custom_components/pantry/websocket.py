"""Websocket commands for the panel. Thin: validate input, call inventory.py, return the result."""

from __future__ import annotations

from typing import Any

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import HomeAssistantError

from . import inventory
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


def async_register(hass: HomeAssistant) -> None:
    for command in (ws_master_data, ws_save, ws_delete):
        websocket_api.async_register_command(hass, command)


async def _run(hass: HomeAssistant, fn, *args: Any) -> Any:
    """Run an inventory function on the loaded entry's DB; InventoryError -> translated error."""
    entries = hass.config_entries.async_loaded_entries(DOMAIN)
    if not entries:
        raise HomeAssistantError(
            translation_domain=DOMAIN, translation_key="not_loaded"
        )
    try:
        return await entries[0].runtime_data.run(fn, *args)
    except InventoryError as err:
        raise HomeAssistantError(
            translation_domain=DOMAIN,
            translation_key=err.translation_key,
            translation_placeholders={k: str(v) for k, v in err.placeholders.items()},
        ) from err


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
        vol.Required("table"): vol.In(MASTER_SCHEMAS),
        vol.Required("row_id"): int,
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_delete(hass: HomeAssistant, connection, msg: dict) -> None:
    await _run(hass, inventory.delete, msg["table"], msg["row_id"])
    connection.send_result(msg["id"])
