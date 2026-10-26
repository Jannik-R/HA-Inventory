"""Websocket commands for the CSV / Grocy transfer (settings; admins only)."""

from __future__ import annotations

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant

from . import inventory
from .ws_common import db_of, translated
from .ws_validate import text

MAX_CHARS = 3_000_000
KIND = vol.In(("products", "stock"))


def async_register(hass: HomeAssistant) -> None:
    for command in (ws_export_csv, ws_import_csv, ws_import_grocy):
        websocket_api.async_register_command(hass, command)


async def _import(hass: HomeAssistant, connection, msg: dict, fn) -> None:
    """The preview is a dry run (rolled back, nothing announced); the real run fires no booked events."""
    with translated():
        report = await db_of(hass).run(fn, write=msg["apply"], events=False)
    connection.send_result(msg["id"], report)


@websocket_api.websocket_command(
    {vol.Required("type"): "home_inventory/export_csv", vol.Required("kind"): KIND}
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_export_csv(hass: HomeAssistant, connection, msg: dict) -> None:
    export = inventory.export_products if msg["kind"] == "products" else inventory.export_stock
    with translated():
        csv_text = await db_of(hass).run(export, write=False)
    connection.send_result(msg["id"], {"csv": csv_text})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "home_inventory/import_csv",
        vol.Required("kind"): KIND,
        vol.Required("text"): text(MAX_CHARS),
        vol.Required("apply"): bool,
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_import_csv(hass: HomeAssistant, connection, msg: dict) -> None:
    user = connection.user.id
    await _import(
        hass,
        connection,
        msg,
        lambda conn: inventory.import_csv(conn, msg["kind"], msg["text"], msg["apply"], user),
    )


@websocket_api.websocket_command(
    {
        vol.Required("type"): "home_inventory/import_grocy",
        vol.Required("files"): vol.All([text(MAX_CHARS)], vol.Length(min=1, max=6)),
        vol.Required("apply"): bool,
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_import_grocy(hass: HomeAssistant, connection, msg: dict) -> None:
    if sum(map(len, msg["files"])) > MAX_CHARS:
        connection.send_error(msg["id"], "invalid_format", "files too large")
        return
    user = connection.user.id
    await _import(
        hass,
        connection,
        msg,
        lambda conn: inventory.import_grocy(conn, msg["files"], msg["apply"], user),
    )
