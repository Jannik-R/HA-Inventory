"""Label codes, booking out by code, rendering and the printer stream (no printer is contacted)."""

import asyncio
import socket

import pytest
from homeassistant.exceptions import HomeAssistantError

from custom_components.pantry import inventory as inv
from custom_components.pantry import label
from custom_components.pantry.inventory import InventoryError
from custom_components.pantry.label_printers import MODELS, printer_of
from tests.test_inventory import loc, product, stock


def setup(conn, packages=2, date="2027-01-31"):
    p = product(conn, ean="4006040053026")
    fridge = loc(conn)
    return p, inv.book_in(conn, p, packages, date, location_id=fridge), fridge


def test_code_format_and_book_out(conn):
    _, batch, fridge = setup(conn, 2)
    ean = "4006040053026"
    info = inv.label_info(conn, batch)
    assert info["code"] == f"PTRY:{ean}:2027-01-31" and info["name"] == "Spaghetti"
    assert inv.book_out_code(conn, f" {info['code'][5:].lower()} ")["name"] == "Spaghetti"
    assert stock(conn) == {(batch, fridge): 1}
    assert conn.execute("SELECT source FROM booking WHERE kind = 'out'").fetchone()[0] == "label"
    # The package moved: it is taken from where the batch is now.
    shelf = loc(conn, "Vorratsschrank")
    inv.move(conn, batch, fridge, shelf, 1)
    assert inv.book_out_code(conn, info["code"][5:])["location"] == "Vorratsschrank"
    for code, key in ((info["code"][5:], "not_enough_stock"), ("123:", "not_found"),
                      (f"{ean}:2030-01-01", "not_found"), ("P99999:", "not_found"),
                      ("nonsense", "invalid_value"), (f"{ean}", "invalid_value")):  # fmt: skip
        with pytest.raises(InventoryError) as err:
            inv.book_out_code(conn, code)
        assert err.value.translation_key == key


def test_no_ean_and_no_date(conn):
    p = product(conn)
    fridge = loc(conn)
    batch = inv.book_in(conn, p, 1, None, location_id=fridge)
    code = inv.label_info(conn, batch)["code"]
    assert code == f"PTRY:P{p}:"
    assert inv.book_out_code(conn, code[5:])["location"]
    assert stock(conn) == {}


def test_render_and_encode():
    info = {
        "code": "PTRY:4006040053026:2027-01-31",
        "name": "Sehr langer Produktname mit Haferflocken kernig",
        "brand": "Marke",
        "expires_on": "2027-01-31",
    }
    img = label.render(info, 57, 32)
    assert img.size == (673, 378) and img.mode == "1"
    assert img.getpixel((label.MARGIN, label.MARGIN)) == 0  # QR finder pattern corner is black
    data = MODELS["dymo_lw4xx"].encode(
        [img, label.render({**info, "expires_on": None, "brand": None}, 57, 32)]
    )
    assert len(data) == 14 + 2 * (378 * 85 + 2)
    assert data.startswith(b"\x1be\x1bL") and data.endswith(b"\x1bE")
    assert label.png_data_urls([img])[0].startswith("data:image/png;base64,")


def test_label_qr_is_regular_qr() -> None:
    """Short codes must not become a Micro QR (phones cannot read those)."""
    import segno

    assert not segno.make_qr("PTRY:P42:", error="m", boost_error=False).is_micro


def test_printer_of_branches():
    assert printer_of({}) == ("browser", "")
    assert printer_of({"label_printer": "nonsense", "label_printer_host": "x"}) == ("browser", "x")
    assert printer_of({"label_printer": "dymo_lw4xx", "label_printer_host": " 10.0.0.5 "}) == (
        "dymo_lw4xx",
        "10.0.0.5",
    )
    assert printer_of({"label_printer": "dymo_lw4xx", "label_printer_host": None}) == (
        "dymo_lw4xx",
        "",
    )
    assert printer_of({"printer": "10.0.0.5"}) == ("browser", "")  # the pre-release key is gone


@pytest.mark.parametrize(
    ("text", "want"),
    [
        ("10.0.0.5", ("10.0.0.5", 9100)),
        (" printer.local:9101 ", ("printer.local", 9101)),
        ("[::1]:9100", ("::1", 9100)),
        ("[::1]", ("::1", 9100)),
        ("::1", ("::1", 9100)),
        ("fe80::1234:5678", ("fe80::1234:5678", 9100)),
    ],
)
def test_split_host(text, want):
    assert label.split_host(text, 9100) == want


@pytest.mark.parametrize(
    "text", ["", ":9100", "h:abc", "h:0", "h:99999", "h:-1", "[::1]:x", "[::1]x"]
)
def test_split_host_bad(text):
    with pytest.raises(ValueError):
        label.split_host(text, 9100)


async def test_send_to_a_local_server(socket_enabled):
    got, done = bytearray(), asyncio.Event()

    async def handle(reader, writer):
        got.extend(await reader.read())
        writer.close()
        done.set()

    server = await asyncio.start_server(handle, "127.0.0.1", 0)
    port = server.sockets[0].getsockname()[1]
    async with server:
        await label.send(f"127.0.0.1:{port}", b"label-data")
        await asyncio.wait_for(done.wait(), 5)
    assert got == b"label-data"


async def test_send_errors_are_printer_unreachable(socket_enabled):
    with socket.socket() as s:  # a port nobody listens on
        s.bind(("127.0.0.1", 0))
        closed = s.getsockname()[1]
    for target in (f"127.0.0.1:{closed}", "127.0.0.1:abc", "127.0.0.1:99999", ""):
        with pytest.raises(HomeAssistantError) as err:
            await label.send(target, b"x")
        assert err.value.translation_key == "printer_unreachable", target
