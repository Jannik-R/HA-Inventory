"""Services: booking by code and location name, label printing (label.send is always patched)."""

from functools import partial
from unittest.mock import AsyncMock, patch

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import ServiceValidationError
from homeassistant.setup import async_setup_component
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.pantry import inventory as inv
from custom_components.pantry.const import DOMAIN
from custom_components.pantry.inventory import InventoryError
from tests.test_inventory import loc, product, stock

EAN = "4006040053026"


def test_book_in_and_out_by_code(conn):
    p = product(conn, ean=EAN)
    shelf = loc(conn, "Vorratsschrank")
    res = inv.book_in_by_code(conn, f" {EAN} ", 3, "2027-01-31", " kühlSCHRANK ")
    assert res == {"product_id": p, "batch_id": res["batch_id"], "name": "Spaghetti"}
    no_date = inv.book_in_by_code(conn, EAN, 1, None, "Vorratsschrank")["batch_id"]
    assert conn.execute("SELECT source FROM booking").fetchone()[0] == "service"

    out = inv.book_out_by_code(conn, EAN, 2, "Kühlschrank")
    assert [t["packages"] for t in out["taken"]] == [2] and out["name"] == "Spaghetti"
    assert inv.book_out_by_code(conn, f"ptry:{EAN}:2027-01-31")["location"] == "Kühlschrank"
    assert stock(conn) == {(no_date, shelf): 1}  # fridge emptied: 2 by EAN + 1 by label

    for call, key in (
        (lambda: inv.book_in_by_code(conn, "12345678", 1), "product_unknown"),
        (lambda: inv.book_in_by_code(conn, EAN, 1, None, "Keller"), "location_unknown"),
        (lambda: inv.book_out_by_code(conn, f"PTRY:{EAN}:", 2), "invalid_value"),
        (lambda: inv.book_out_by_code(conn, f"PTRY:{EAN}:", 1, "Kühlschrank"), "invalid_value"),
        (lambda: inv.book_out_by_code(conn, EAN, 5), "not_enough_stock"),
    ):
        with pytest.raises(InventoryError) as err:
            call()
        assert err.value.translation_key == key


@pytest.fixture
async def entry(hass: HomeAssistant) -> MockConfigEntry:
    assert await async_setup_component(hass, "http", {})
    entry = MockConfigEntry(domain=DOMAIN)
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await entry.runtime_data.run(partial(product, ean=EAN))
    return entry


async def call(hass: HomeAssistant, service: str, **data) -> dict:
    return await hass.services.async_call(
        DOMAIN, service, data, blocking=True, return_response=True
    )


async def test_services(hass: HomeAssistant, entry: MockConfigEntry) -> None:
    # YAML gives a scanned EAN as a number
    res = await call(hass, "book_in", code=int(EAN), packages="2", location="Kühlschrank")
    # Empty template values = left out: no date (same batch), the product's default location
    again = await call(hass, "book_in", code=EAN, expires_on="", location="")
    assert again["batch_id"] == res["batch_id"]
    assert res["name"] == "Spaghetti"
    assert len((await call(hass, "book_out", code=EAN))["taken"]) == 1

    with pytest.raises(ServiceValidationError) as err:
        await call(hass, "book_out", code="12345678")
    assert err.value.translation_key == "product_unknown"

    # Browser-only setup: a service cannot print
    with pytest.raises(ServiceValidationError) as err:
        await call(hass, "print_labels", batch_id=res["batch_id"])
    assert err.value.translation_key == "no_label_printer"

    hass.config_entries.async_update_entry(
        entry, options={"label_printer": "dymo_lw4xx", "label_printer_host": "10.0.0.5"}
    )
    with patch("custom_components.pantry.label.send", new=AsyncMock()) as send:
        assert await call(hass, "print_labels", batch_id=res["batch_id"], count=2) == {"printed": 2}
    assert send.await_args.args[0] == "10.0.0.5"
