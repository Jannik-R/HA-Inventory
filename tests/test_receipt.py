"""Receipt printer: ESC/POS bytes, device write, options step, shopping list and recipe print. Never prints:
the device write and the TCP send are patched (or go to a temp file)."""

from datetime import date
from unittest.mock import AsyncMock, patch

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.data_entry_flow import FlowResultType
from homeassistant.exceptions import ServiceValidationError
from homeassistant.setup import async_setup_component
from PIL import Image
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.pantry import inventory, receipt
from custom_components.pantry.const import DOMAIN

from .test_websocket import ws  # noqa: F401  (fixture)

WRITE = "custom_components.pantry.label.write_device"


def test_escpos_bands_and_cut():
    img = receipt.render(
        "Einkaufsliste", [("head", "Obst"), ("item", "Äpfel – 2 Pkg. fehlen")], 384
    )
    assert img.width == 384 and img.height > 34 * 3
    big = img.resize((384, 600))
    data = receipt.escpos(big, cut=True)
    assert data.startswith(b"\x1b@\x1b3\x18") and data.endswith(b"\x1b2\x1bd\x07\x1dV\x01")
    # 600 rows = 25 lines of 24 dots: ESC * 33, 384 columns of 3 bytes, LF
    assert data.count(b"\x1b*\x21\x80\x01") == 25
    assert len(data) == 5 + 25 * (5 + 384 * 3 + 1) + 5 + 3
    assert not receipt.escpos(big, cut=False).endswith(b"\x1dV\x01")


def test_escpos_bit_order():
    """ESC *: per column 3 bytes, top dot = highest bit; black = 1."""
    img = Image.new("1", (2, 24), 1)
    img.putpixel((0, 0), 0)  # top left
    img.putpixel((1, 23), 0)  # bottom of the second column
    line = receipt.escpos(img, cut=False)[5 : 5 + 5 + 6]
    assert line == b"\x1b*\x21\x02\x00" + bytes([0x80, 0, 0, 0, 0, 0x01])


def test_shopping_lines_group_and_skip_done():
    items = [
        {"done": False, "path": ["Obst"], "name": "Äpfel"},
        {"done": True, "path": ["Obst"], "name": "Birnen"},
        {"done": False, "path": ["Obst", "Beeren"], "name": "Erdbeeren"},
        {"done": False, "path": ["Milch"], "name": "Milch"},
    ]
    assert receipt.shopping_lines(items, lambda i: i["name"]) == [
        ("head", "Obst"), ("item", "Äpfel"), ("item", "Erdbeeren"),
        ("head", "Milch"), ("item", "Milch"),
    ]  # fmt: skip


async def _entry(hass: HomeAssistant, **options) -> MockConfigEntry:
    assert await async_setup_component(hass, "http", {})
    entry = MockConfigEntry(domain=DOMAIN, options=options)
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    return entry


async def test_options_receipt_step_keeps_label_options(hass: HomeAssistant, caplog) -> None:
    entry = await _entry(hass, label_printer="browser", label_width=57)
    flow = await hass.config_entries.options.async_init(entry.entry_id)
    flow = await hass.config_entries.options.async_configure(
        flow["flow_id"], {"next_step_id": "receipt"}
    )
    form = {"receipt_printer": " /dev/ttyUSB0 ", "receipt_width": "80", "receipt_cut": True,
            "receipt_baud": "115200"}  # fmt: skip
    with patch(WRITE, side_effect=OSError("no device")):
        result = await hass.config_entries.options.async_configure(
            flow["flow_id"], {**form, "test_print": True}
        )
    assert result["errors"] == {"base": "printer_unreachable"}
    assert result["data_schema"]({})["test_print"] is True  # a retry tests again
    assert "/dev/ttyUSB0: no device" in caplog.text  # the reason is logged
    with patch(WRITE) as write:
        result = await hass.config_entries.options.async_configure(
            flow["flow_id"], {**form, "test_print": True}
        )
    assert result["type"] is FlowResultType.CREATE_ENTRY
    path, data, baud = write.call_args.args
    assert (path, baud) == ("/dev/ttyUSB0", 115200) and data.endswith(b"\x1dV\x01")
    assert entry.options == {
        "label_printer": "browser", "label_width": 57, "receipt_printer": "/dev/ttyUSB0",
        "receipt_width": 80, "receipt_cut": True, "receipt_baud": 115200,
    }  # fmt: skip


async def test_print_shopping_list(hass: HomeAssistant, ws) -> None:  # noqa: F811
    msg = {"type": "pantry/print_shopping_list"}
    assert (await ws.call(msg))["error"]["translation_key"] == "no_receipt_printer"
    assert (await ws.call({"type": "pantry/label_config"}))["result"]["receipt"] is False

    entry = hass.config_entries.async_entries(DOMAIN)[0]
    hass.config_entries.async_update_entry(
        entry, options={"receipt_printer": "10.0.0.9", "receipt_width": 58}
    )
    # nothing open: no empty receipt
    assert (await ws.call(msg))["error"]["translation_key"] == "nothing_to_print"
    db = entry.runtime_data
    md = await db.run(inventory.master_data)
    nudeln = next(c["id"] for c in md["categories"] if c["name"] == "Nudeln")
    await db.run(inventory.save, "category", {"id": nudeln, "min_packages": 2})
    with patch("custom_components.pantry.label.send", new=AsyncMock()) as send:
        result = (await ws.call(msg))["result"]
        assert result == {"printed": 1}
        await hass.services.async_call(DOMAIN, "print_shopping_list", {}, blocking=True)
    host, data = send.await_args_list[0].args[:2]
    assert (
        host == "10.0.0.9" and data.startswith(b"\x1b@") and b"\x1b*\x21\x80\x01" in data
    )  # 58 mm: 384 columns
    assert send.await_count == 2


def test_recipe_lines(conn):
    g = conn.execute("SELECT id FROM unit WHERE symbol = 'g'").fetchone()["id"]
    nudeln = conn.execute("SELECT id FROM category WHERE name = 'Nudeln'").fetchone()["id"]
    data = {
        "name": "Pasta",
        "servings": 2,
        "ingredients": [
            {"category_id": nudeln, "amount": 250, "unit_id": g, "note": "dünne"},
            {"text": "Salz", "optional": True},
        ],
        "steps": [{"text": "Kochen."}, {"section": "Soße", "text": "Rühren, 5 Min."}],
    }
    rid = inventory.save_recipe(conn, data)
    sheet = inventory.recipe_sheet(conn, rid, 3)
    assert receipt.recipe_lines(sheet, "de") == [
        ("text", "3 Portionen"),
        ("head", "Zutaten"),
        ("item", "375 g Nudeln (dünne)"),
        ("item", "Salz (optional)"),
        ("head", "Zubereitung"),
        ("step", "1. Kochen."),
        ("head", "Soße"),
        ("step", "2. Rühren, 5 Min."),
    ]
    # the step text wraps under itself, not under its number
    img = receipt.render("Pasta", [("step", "12. " + "lang " * 40)], 384)
    assert img.width == 384 and img.height > 3 * 34


async def test_print_recipe(hass: HomeAssistant, ws) -> None:  # noqa: F811
    entry = hass.config_entries.async_entries(DOMAIN)[0]
    rid = await entry.runtime_data.run(
        inventory.save_recipe, {"name": "Pasta", "servings": 2, "ingredients": []}
    )
    msg = {"type": "pantry/print_recipe", "recipe_id": rid, "servings": 4}
    assert (await ws.call(msg))["error"]["translation_key"] == "no_receipt_printer"
    hass.config_entries.async_update_entry(entry, options={"receipt_printer": "10.0.0.9"})
    with patch("custom_components.pantry.label.send", new=AsyncMock()) as send:
        assert (await ws.call(msg))["result"] == {"printed": 1}
        await hass.services.async_call(
            DOMAIN, "print_recipe", {"recipe": "pasta"}, blocking=True, return_response=True
        )
    assert send.await_count == 2


async def test_print_planned(hass: HomeAssistant, ws) -> None:  # noqa: F811
    entry = hass.config_entries.async_entries(DOMAIN)[0]
    hass.config_entries.async_update_entry(entry, options={"receipt_printer": "10.0.0.9"})
    db = entry.runtime_data
    rid = await db.run(inventory.save_recipe, {"name": "Pasta", "servings": 2, "ingredients": []})
    day = "2026-10-19"
    dish = {"day": day, "recipe_id": rid, "text": "", "slot": 3, "servings": 4}
    await db.run(inventory.save_meal, dish)
    call = {"day": day, "meal": "dinner"}
    with patch("custom_components.pantry.label.send", new=AsyncMock()) as send:
        res = await hass.services.async_call(
            DOMAIN, "print_planned", call, blocking=True, return_response=True
        )
        assert res == {"printed": 1, "day": day, "meal": "dinner"}
        with pytest.raises(ServiceValidationError) as err:
            await hass.services.async_call(
                DOMAIN, "print_planned", {**call, "meal": "lunch"}, blocking=True
            )
    assert err.value.translation_key == "nothing_planned"
    assert send.await_count == 1
    assert (await ws.call({"type": "pantry/meal_times"}))["result"][3] == {
        "slot": 3,
        "start": "17:00",
    }
    save = {"type": "pantry/meal_times_save", "starts": ["6:00"] * 5}
    assert not (await ws.call(save))["success"]  # HH:MM only


def test_plan_lines():
    meals = [
        {"day": "2026-10-19", "slot": 3, "name": "Lasagne", "servings": 4},
        {"day": "2026-10-19", "slot": 0, "name": "Müsli", "servings": 2},
    ]
    title, lines = receipt.plan_lines(meals, date(2026, 10, 19), 2, "de")
    assert title == "Speiseplan 19.10. – 20.10.2026"
    assert lines == [
        ("head", "Montag, 19.10.2026"),
        ("text", "Abendessen: Lasagne (für 4)"),
        ("text", "Frühstück: Müsli (für 2)"),
        ("head", "Dienstag, 20.10.2026"),
        ("text", "–"),
    ]


async def test_print_plan(hass: HomeAssistant, ws) -> None:  # noqa: F811
    entry = hass.config_entries.async_entries(DOMAIN)[0]
    hass.config_entries.async_update_entry(entry, options={"receipt_printer": "10.0.0.9"})
    msg = {"type": "pantry/print_plan", "start": "2026-10-19", "days": 7}
    assert (await ws.call(msg))["error"]["translation_key"] == "plan_empty"
    dish = {"day": "2026-10-21", "recipe_id": None, "text": "Pizza", "slot": 3, "servings": 2}
    await entry.runtime_data.run(inventory.save_meal, dish)
    with patch("custom_components.pantry.label.send", new=AsyncMock()) as send:
        assert (await ws.call(msg))["result"] == {"printed": 1}
        res = await hass.services.async_call(
            DOMAIN,
            "print_plan",
            {"day": "2026-10-24", "period": "week"},  # Saturday: the week from Monday 19th
            blocking=True,
            return_response=True,
        )
    assert res == {"printed": 1}
    assert send.await_count == 2
