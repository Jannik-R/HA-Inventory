"""Receipt printer: ESC/POS bytes, device write, options step, shopping list print. Never prints:
the device write and the TCP send are patched (or go to a temp file)."""

from unittest.mock import AsyncMock, patch

from homeassistant.core import HomeAssistant
from homeassistant.data_entry_flow import FlowResultType
from homeassistant.setup import async_setup_component
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.pantry import inventory, receipt
from custom_components.pantry.const import DOMAIN

from .test_websocket import ws  # noqa: F401  (fixture)

WRITE = "custom_components.pantry.receipt.write_device"


def test_escpos_bands_and_cut():
    img = receipt.render(
        "Einkaufsliste", [("head", "Obst"), ("item", "Äpfel – 2 Pkg. fehlen")], 384
    )
    assert img.width == 384 and img.height > 34 * 3
    big = img.resize((384, 600))
    data = receipt.escpos(big, cut=True)
    assert data.startswith(b"\x1b@") and data.endswith(b"\x1bd\x05\x1dV\x01")
    # 600 rows in bands of 256: 3 raster commands, 48 bytes per row
    assert data.count(b"\x1dv0\x00") == 3
    assert len(data) == 2 + 3 * 8 + 48 * 600 + 3 + 3
    assert not receipt.escpos(big, cut=False).endswith(b"\x1dV\x01")


def test_write_device_to_a_plain_file(tmp_path):
    out = tmp_path / "lp0"
    out.touch()
    receipt.write_device(str(out), b"\x1b@abc", 9600)  # not a tty: no serial setup
    assert out.read_bytes() == b"\x1b@abc"


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


async def test_options_receipt_step_keeps_label_options(hass: HomeAssistant) -> None:
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
    assert host == "10.0.0.9" and data.startswith(b"\x1b@") and b"\x1dv0\x00\x30\x00" in data
    assert send.await_count == 2
