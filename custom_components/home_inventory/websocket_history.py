"""Websocket commands for the booking history (any user, like booking; panel only)."""

from __future__ import annotations

from datetime import date, timedelta
from functools import partial

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

from . import inventory
from .websocket_plan import DAY
from .ws_common import run
from .ws_validate import ID, text


def async_register(hass: HomeAssistant) -> None:
    for command in (ws_history, ws_history_undo):
        websocket_api.async_register_command(hass, command)


def _utc(day: str, plus: int = 0) -> str:
    """Start of a local day as a UTC timestamp (the booking ts format)."""
    start = dt_util.start_of_local_day(date.fromisoformat(day) + timedelta(days=plus))
    return dt_util.as_utc(start).isoformat(timespec="seconds")


@websocket_api.websocket_command(
    {
        vol.Required("type"): "home_inventory/history",
        vol.Optional("name"): text(64),
        vol.Optional("user_id"): text(64),
        vol.Optional("date_from"): DAY,
        vol.Optional("date_to"): DAY,
        vol.Optional("offset", default=0): vol.All(int, vol.Range(min=0, max=10**6)),
    }
)
@websocket_api.async_response
async def ws_history(hass: HomeAssistant, connection, msg: dict) -> None:
    """The actions (newest first) and the users for the filter."""
    fn = partial(
        inventory.history,
        name=msg.get("name"),
        user_id=msg.get("user_id"),
        ts_from=_utc(msg["date_from"]) if "date_from" in msg else None,
        ts_to=_utc(msg["date_to"], 1) if "date_to" in msg else None,
        offset=msg["offset"],
    )
    result = await run(hass, fn)
    users = await hass.auth.async_get_users()
    result["users"] = [{"id": u.id, "name": u.name} for u in users if not u.system_generated]
    connection.send_result(msg["id"], result)


@websocket_api.websocket_command(
    {vol.Required("type"): "home_inventory/history_undo", vol.Required("action_id"): ID}
)
@websocket_api.async_response
async def ws_history_undo(hass: HomeAssistant, connection, msg: dict) -> None:
    """Undo a whole action (all or nothing)."""
    fn = partial(inventory.undo_action, user_id=connection.user.id)
    await run(hass, fn, msg["action_id"])
    connection.send_result(msg["id"])
