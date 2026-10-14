"""Websocket commands: master data round trip, validation and translated errors."""

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.setup import async_setup_component
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.pantry.const import DOMAIN


@pytest.fixture
async def ws(hass: HomeAssistant, hass_ws_client):
    """Websocket client with the integration loaded; ws.call(msg) returns the response."""
    assert await async_setup_component(hass, "http", {})
    entry = MockConfigEntry(domain=DOMAIN)
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    client = await hass_ws_client(hass)

    async def call(msg: dict) -> dict:
        await client.send_json_auto_id(msg)
        return await client.receive_json()

    client.call = call
    return client


async def master(ws) -> dict:
    return (await ws.call({"type": "pantry/master_data"}))["result"]


def by_name(rows: list, name: str) -> dict:
    return next(r for r in rows if r["name"] == name)


async def test_master_data_save_delete(ws) -> None:
    data = await master(ws)
    assert {"units", "locations", "categories", "defaults"} <= set(data)
    nudeln = by_name(data["categories"], "Nudeln")
    assert nudeln["effective"]["unit_id"]["source"] == nudeln["parent_id"]
    assert isinstance(nudeln["off_tags"], list)

    msg = await ws.call(
        {"type": "pantry/save", "table": "location", "data": {"name": " Keller "}}
    )
    loc_id = msg["result"]["id"]
    assert (await master(ws))["locations"][-1]["name"] == "Keller"

    msg = await ws.call(
        {"type": "pantry/save", "table": "location", "data": {"name": "Keller"}}
    )
    assert not msg["success"] and msg["error"]["translation_key"] == "duplicate"

    msg = await ws.call(
        {"type": "pantry/delete", "table": "location", "row_id": loc_id}
    )
    assert msg["success"]


@pytest.mark.parametrize(
    ("table", "data", "error"),
    [
        ("location", {"bogus": 1}, "invalid_format"),
        ("category", {"name": "X", "off_tags": "en:x"}, "invalid_format"),
        ("category", {"name": "X", "warn_days": "3"}, "invalid_format"),
        ("unit", {"name": "X", "symbol": "x", "factor": "abc"}, "invalid_format"),
        ("unit", {"name": "X", "symbol": "x", "factor": 0}, "invalid_format"),
        ("location", {"name": "  "}, "invalid_value"),
        ("location", {"id": 9999, "name": "Y"}, "not_found"),
        ("unit", {"name": "X", "symbol": "x", "base_unit_id": "kg"}, "invalid_unit"),
        ("category", {"id": "main", "parent_id": "Nudeln"}, "invalid_parent"),
    ],
)
async def test_save_errors(ws, table: str, data: dict, error: str) -> None:
    md = await master(ws)
    # Names in id fields are resolved to seeded ids.
    names = {
        "kg": by_name(md["units"], "kg")["id"],
        "Nudeln": by_name(md["categories"], "Nudeln")["id"],
    }
    names["main"] = by_name(md["categories"], "Nudeln")["parent_id"]
    data = {k: names.get(v, v) if k.endswith("id") else v for k, v in data.items()}
    msg = await ws.call({"type": "pantry/save", "table": table, "data": data})
    assert not msg["success"]
    assert error in (msg["error"]["code"], msg["error"].get("translation_key"))


async def test_delete_errors(ws) -> None:
    main = by_name((await master(ws))["categories"], "Nudeln")["parent_id"]
    msg = await ws.call({"type": "pantry/delete", "table": "category", "row_id": main})
    assert msg["error"]["translation_key"] == "in_use"
    msg = await ws.call({"type": "pantry/delete", "table": "location", "row_id": 9999})
    assert msg["error"]["translation_key"] == "not_found"


async def test_writes_need_admin(ws, hass_admin_user) -> None:
    hass_admin_user.groups = []
    msg = await ws.call(
        {"type": "pantry/save", "table": "location", "data": {"name": "Z"}}
    )
    assert msg["error"]["code"] == "unauthorized"
    assert (await ws.call({"type": "pantry/master_data"}))["success"]


async def test_not_loaded(hass: HomeAssistant, hass_ws_client) -> None:
    assert await async_setup_component(hass, DOMAIN, {})
    client = await hass_ws_client(hass)
    await client.send_json_auto_id({"type": "pantry/master_data"})
    assert (await client.receive_json())["error"]["translation_key"] == "not_loaded"
