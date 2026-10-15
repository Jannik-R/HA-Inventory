"""Label codes, booking out by code, rendering and the printer stream (no printer is contacted)."""

import pytest

from custom_components.pantry import label
from custom_components.pantry.label_printers import MODELS
from custom_components.pantry import inventory as inv
from custom_components.pantry.inventory import InventoryError
from tests.test_inventory import loc, product, stock


def setup(conn, packages=2, date="2027-01-31"):
    p = product(conn, ean="4006040053026")
    fridge = loc(conn)
    return p, inv.book_in(conn, p, packages, date, location_id=fridge), fridge


def test_code_format_and_book_out(conn):
    p, batch, fridge = setup(conn, 2)
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
    info = {"code": "PTRY:4006040053026:2027-01-31", "name": "Sehr langer Produktname mit Haferflocken kernig", "brand": "Marke", "expires_on": "2027-01-31"}
    img = label.render(info, 57, 32)
    assert img.size == (673, 378) and img.mode == "1"
    assert img.getpixel((label.MARGIN, label.MARGIN)) == 0  # QR finder pattern corner is black
    data = MODELS["dymo_lw4xx"].encode([img, label.render({**info, "expires_on": None, "brand": None}, 57, 32)])
    assert len(data) == 14 + 2 * (378 * 85 + 2)
    assert data.startswith(b"\x1be\x1bL") and data.endswith(b"\x1bE")
    assert label.png_data_urls([img])[0].startswith("data:image/png;base64,")


def test_label_qr_is_regular_qr() -> None:
    """Short codes must not become a Micro QR (phones cannot read those)."""
    import segno

    assert not segno.make_qr("PTRY:P42:", error="m", boost_error=False).is_micro
