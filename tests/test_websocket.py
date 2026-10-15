"""Websocket commands: master data round trip, validation and translated errors."""

from unittest.mock import AsyncMock, patch

import pytest
from homeassistant.core import HomeAssistant, callback
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers.dispatcher import async_dispatcher_connect
from homeassistant.setup import async_setup_component
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.pantry.const import DOMAIN, SIGNAL_CHANGED


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

    msg = await ws.call({"type": "pantry/save", "table": "location", "data": {"name": " Keller "}})
    loc_id = msg["result"]["id"]
    assert (await master(ws))["locations"][-1]["name"] == "Keller"

    msg = await ws.call({"type": "pantry/save", "table": "location", "data": {"name": "Keller"}})
    assert not msg["success"] and msg["error"]["translation_key"] == "duplicate"

    msg = await ws.call({"type": "pantry/delete", "table": "location", "row_id": loc_id})
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
    msg = await ws.call({"type": "pantry/save", "table": "location", "data": {"name": "Z"}})
    assert msg["error"]["code"] == "unauthorized"
    assert (await ws.call({"type": "pantry/master_data"}))["success"]


async def test_not_loaded(hass: HomeAssistant, hass_ws_client) -> None:
    assert await async_setup_component(hass, DOMAIN, {})
    client = await hass_ws_client(hass)
    await client.send_json_auto_id({"type": "pantry/master_data"})
    assert (await client.receive_json())["error"]["translation_key"] == "not_loaded"


async def test_booking_flow(ws) -> None:
    md = await master(ws)
    cat_id = by_name(md["categories"], "Nudeln")["id"]
    loc_id = by_name(md["locations"], "Kühlschrank")["id"]
    new = {"name": "Spaghetti", "category_id": cat_id, "ean": "4001234567890"}
    book = {"type": "pantry/book_in", "location_id": loc_id}

    msg = await ws.call({**book, "product": new, "packages": 2, "expires_on": "2027-06-01"})
    pid = msg["result"]["product_id"]
    msg = await ws.call({**book, "product_id": pid, "packages": 1, "expires_on": "2027-01-01"})
    early = msg["result"]["batch_id"]
    assert msg["result"]["product_id"] == pid

    rows = (await ws.call({"type": "pantry/stock", "product_id": pid}))["result"]
    assert [r["packages"] for r in rows] == [1, 2]  # FEFO order
    other = await ws.call({"type": "pantry/stock", "product_id": pid + 1})
    assert other["result"] == []

    out = {"type": "pantry/book_out", "product_id": pid}
    taken = (await ws.call({**out, "packages": 2}))["result"]["taken"]
    assert (taken[0]["batch_id"], taken[0]["packages"]) == (early, 1)
    msg = await ws.call({**out, "packages": 5})
    assert msg["error"]["translation_key"] == "not_enough_stock"

    delete = {"type": "pantry/delete", "table": "product", "row_id": pid}
    assert (await ws.call(delete))["success"]  # with stock: stock, batches, bookings go too
    assert (await ws.call({"type": "pantry/stock", "product_id": pid}))["result"] == []


async def test_lookup_and_search(ws) -> None:
    cat_id = by_name((await master(ws))["categories"], "Nudeln")["id"]
    ean = "4001234567890"
    product = {"name": "Spaghetti", "category_id": cat_id, "ean": ean}
    pid = (
        await ws.call(
            {"type": "pantry/book_in", "product": product, "packages": 1, "location_id": 1}
        )
    )["result"]["product_id"]

    msg = await ws.call({"type": "pantry/search", "query": "SPAGHE"})
    assert [r["id"] for r in msg["result"]] == [pid]
    msg = await ws.call({"type": "pantry/lookup", "code": ean})
    assert msg["result"]["product"]["id"] == pid  # local first, no HTTP
    msg = await ws.call({"type": "pantry/lookup", "code": "abc"})
    assert msg["error"]["translation_key"] == "invalid_ean"


async def test_book_in_needs_exactly_one_product(ws) -> None:
    cat_id = by_name((await master(ws))["categories"], "Nudeln")["id"]
    new = {"name": "X", "category_id": cat_id}
    for extra in ({}, {"product_id": 1, "product": new}):
        msg = await ws.call({"type": "pantry/book_in", "packages": 1, **extra})
        assert msg["error"]["code"] == "invalid_format"


async def test_everyday_use_needs_no_admin(ws, hass_admin_user) -> None:
    md = await master(ws)
    hass_admin_user.groups = []
    product = {"name": "Y", "category_id": by_name(md["categories"], "Nudeln")["id"]}
    msg = await ws.call(
        {
            "type": "pantry/book_in",
            "product": product,
            "packages": 1,
            "location_id": md["locations"][0]["id"],
        }
    )
    assert msg["success"]


async def test_products_list_and_edit(ws, hass_admin_user) -> None:
    hass_admin_user.groups = []  # editing products is everyday use, no admin needed
    nudeln = by_name((await master(ws))["categories"], "Nudeln")["id"]
    msg = await ws.call(
        {
            "type": "pantry/book_in",
            "packages": 2,
            "location_id": (await master(ws))["locations"][0]["id"],
            "product": {
                "name": "Penne",
                "category_id": nudeln,
                "ean": "4000000000001",
                "off_json": "{}",
            },
        }
    )
    pid = msg["result"]["product_id"]
    rows = (await ws.call({"type": "pantry/products"}))["result"]
    row = by_name(rows, "Penne")
    assert row["packages"] == 2 and "off_json" not in row

    msg = await ws.call(
        {"type": "pantry/product_save", "data": {"id": pid, "name": "Penne Rigate", "warn_days": 5}}
    )
    assert msg["success"]
    row = by_name((await ws.call({"type": "pantry/products"}))["result"], "Penne Rigate")
    assert row["warn_days"] == 5 and row["ean"] == "4000000000001"

    msg = await ws.call({"type": "pantry/product_save", "data": {"id": pid, "bogus": 1}})
    assert msg["error"]["code"] == "invalid_format"


async def test_stock_edit(ws, hass_admin_user) -> None:
    hass_admin_user.groups = []  # any user may fix stock, like booking
    md = await master(ws)
    cat_id = by_name(md["categories"], "Nudeln")["id"]
    loc_id = by_name(md["locations"], "Kühlschrank")["id"]
    res = await ws.call(
        {
            "type": "pantry/book_in",
            "product": {"name": "Penne", "category_id": cat_id},
            "packages": 2,
            "expires_on": "2072-01-01",
            "location_id": loc_id,
        }
    )
    pid, batch = res["result"]["product_id"], res["result"]["batch_id"]
    edit = {"type": "pantry/stock_edit", "batch_id": batch, "location_id": loc_id}
    msg = await ws.call({**edit, "expires_on": "2027-01-01", "packages": 3})
    assert msg["result"]["batch_id"] != batch
    rows = (await ws.call({"type": "pantry/stock", "product_id": pid}))["result"]
    assert [(r["expires_on"], r["expiry_type"], r["packages"]) for r in rows] == [
        ("2027-01-01", "best_before", 3)  # the product's type, inherited
    ]
    msg = await ws.call({**edit, "expires_on": None, "packages": 1})
    assert msg["error"]["translation_key"] == "not_found"


async def test_defaults_save(ws, hass_admin_user) -> None:
    dflt = (await master(ws))["defaults"]
    msg = await ws.call({"type": "pantry/defaults_save", "data": {**dflt, "warn_days": 5}})
    assert msg["success"]
    assert (await master(ws))["defaults"]["warn_days"] == 5
    hass_admin_user.groups = []
    msg = await ws.call({"type": "pantry/defaults_save", "data": dflt})
    assert msg["error"]["code"] == "unauthorized"


async def test_shopping(ws, hass_admin_user) -> None:
    md = await master(ws)
    cat_id = by_name(md["categories"], "Nudeln")["id"]
    kg = by_name(md["units"], "kg")["id"]
    save = {"type": "pantry/save", "table": "category"}
    msg = await ws.call({**save, "data": {"id": cat_id, "min_stock": 1}})
    assert not msg["success"]  # amount without its unit
    msg = await ws.call({**save, "data": {"id": cat_id, "min_stock": 1, "min_stock_unit_id": kg}})
    assert msg["success"]
    items = [i for i in (await ws.call({"type": "pantry/shopping"}))["result"] if not i["manual"]]
    assert [(i["name"], i["amount"]["missing"], i["done"]) for i in items] == [("Nudeln", 1, False)]
    hass_admin_user.groups = []  # any user may check items
    msg = await ws.call({"type": "pantry/shopping_done", "category_id": cat_id, "done": True})
    assert msg["success"]
    assert (await ws.call({"type": "pantry/shopping"}))["result"][0]["done"]


async def test_shopping_add(ws, hass_admin_user) -> None:
    md = await master(ws)
    cat_id = by_name(md["categories"], "Nudeln")["id"]
    add = {"type": "pantry/shopping_add"}
    msg = await ws.call({**add, "category": {"name": "WS Neu"}, "packages": 2})
    item_id = msg["result"]["id"]
    msg = await ws.call({**add, "category_id": cat_id, "product_id": 1})
    assert not msg["success"]  # one thing only
    hass_admin_user.groups = []  # any user: existing things and new products
    msg = await ws.call({**add, "category": {"name": "WS Neu 2"}})
    assert msg["error"]["code"] == "unauthorized"
    msg = await ws.call({**add, "product": {"name": "WS Penne", "category_id": cat_id}})
    assert msg["success"]
    await ws.call({"type": "pantry/shopping_item", "item_id": item_id, "packages": 4})
    items = (await ws.call({"type": "pantry/shopping"}))["result"]
    assert by_name(items, "WS Neu")["packages"] == 4
    msg = await ws.call({"type": "pantry/shopping_item_delete", "item_id": item_id})
    assert msg["success"]


async def test_delete_impact_and_force(ws, hass_admin_user) -> None:
    msg = await ws.call({"type": "pantry/save", "table": "category", "data": {"name": "WS Weg"}})
    parent = msg["result"]["id"]
    await ws.call(
        {
            "type": "pantry/save",
            "table": "category",
            "data": {"name": "WS Kind", "parent_id": parent},
        }
    )
    delete = {"type": "pantry/delete", "table": "category", "row_id": parent}
    assert (await ws.call(delete))["error"]["translation_key"] == "in_use"
    impact = (
        await ws.call({"type": "pantry/delete_impact", "table": "category", "row_id": parent})
    )["result"]
    assert impact == {
        "blocked": None, "groups": [{"kind": "delete.category", "count": 1, "names": ["WS Kind"]}]
    }  # fmt: skip
    assert (await ws.call({**delete, "force": True}))["success"]


async def test_print_labels_and_book_out(hass: HomeAssistant, ws) -> None:
    """Without a printer the images come back; with one the raw stream is sent. Scanning books out."""
    data = await master(ws)
    cat_id = by_name(data["categories"], "Nudeln")["id"]
    loc_id = data["locations"][0]["id"]
    res = await ws.call(
        {
            "type": "pantry/book_in",
            "packages": 2,
            "location_id": loc_id,
            "product": {"name": "Etikett-Nudeln", "category_id": cat_id},
        }
    )
    batch_id = res["result"]["batch_id"]
    msg = {"type": "pantry/print_labels", "batch_id": batch_id, "count": 2}

    cfg = (await ws.call({"type": "pantry/label_config"}))["result"]
    assert cfg == {"printer": False, "print_on_book_in": True, "width_mm": 57, "height_mm": 32}
    out = (await ws.call(msg))["result"]
    assert (
        out["image"].startswith("data:image/png;base64,")
        and out["count"] == 2
        and out["width_mm"] == 57
    )
    assert "images" not in out

    hass.config_entries.async_update_entry(
        hass.config_entries.async_entries(DOMAIN)[0],
        options={"label_printer": "dymo_lw4xx", "label_printer_host": "10.0.0.5"},
    )
    with patch("custom_components.pantry.label.send", new=AsyncMock()) as send:
        out = (await ws.call({**msg, "count": 3}))["result"]
    assert out == {"printed": 3}
    assert send.await_args.args[0] == "10.0.0.5" and send.await_args.args[2] == 9100
    assert (await ws.call({"type": "pantry/label_config"}))["result"]["printer"] is True

    with patch("custom_components.pantry.label.send", side_effect=HomeAssistantError("x")):
        assert (await ws.call(msg))["success"] is False

    hass.config_entries.async_update_entry(  # network model without a host: no silent browser fallback
        hass.config_entries.async_entries(DOMAIN)[0], options={"label_printer": "dymo_lw4xx"}
    )
    no_host = await ws.call(msg)
    assert no_host["error"]["translation_key"] == "printer_unreachable"

    for bad in (0, 100):
        assert (await ws.call({**msg, "count": bad}))["success"] is False
    pid = res["result"]["product_id"]  # no EAN, no date
    out = await ws.call({"type": "pantry/book_out_label", "code": f"P{pid}:"})
    assert out["result"]["name"] == "Etikett-Nudeln"
    assert (await ws.call({"type": "pantry/book_out_label", "code": "x"}))["success"] is False


async def test_undo_book_out_by_booking_id(ws) -> None:
    data = await master(ws)
    cat_id = by_name(data["categories"], "Nudeln")["id"]
    loc_id = data["locations"][0]["id"]
    res = await ws.call(
        {"type": "pantry/book_in", "packages": 2, "location_id": loc_id,
         "product": {"name": "Undo-Nudeln", "category_id": cat_id}}
    )  # fmt: skip
    out = await ws.call(
        {"type": "pantry/book_out", "product_id": res["result"]["product_id"], "packages": 2}
    )
    (taken,) = out["result"]["taken"]
    assert set(taken) == {"batch_id", "location_id", "packages", "booking_id"}
    undo = {"type": "pantry/put_back", "booking_ids": [taken["booking_id"]]}
    assert (await ws.call(undo))["success"]
    assert (await ws.call(undo))["error"]["translation_key"] == "already_undone"
    for bad in ([], list(range(1, 52)), [0]):
        assert (await ws.call({**undo, "booking_ids": bad}))["success"] is False


async def test_input_validation(ws) -> None:
    data = await master(ws)
    cat_id = by_name(data["categories"], "Nudeln")["id"]
    unit = {"type": "pantry/save", "table": "unit"}
    for factor in ("inf", "nan", "-inf", 0):
        msg = await ws.call({**unit, "data": {"name": "Zzz", "symbol": "z", "factor": factor}})
        assert msg["error"]["code"] == "invalid_format", factor
    msg = await ws.call({**unit, "data": {"name": "x" * 201, "symbol": "z", "factor": 1}})
    assert msg["error"]["code"] == "invalid_format"
    cat = {"type": "pantry/save", "table": "category"}
    msg = await ws.call({**cat, "data": {"id": cat_id, "min_stock": "nan", "min_stock_unit_id": 1}})
    assert msg["error"]["code"] == "invalid_format"
    prod = {"name": "Val", "category_id": cat_id}
    book_in = {"type": "pantry/book_in", "packages": 1, "product": prod}
    for extra in ({"packages": 10000}, {"product": {**prod, "image_url": "javascript:alert(1)"}},
                  {"product": {**prod, "ean": "1" * 33}}, {"product": {**prod, "off_json": "x" * 100_001}},
                  {"product": {**prod, "category_id": 0}}, {"location_id": 2**31 + 1}):  # fmt: skip
        assert (await ws.call({**book_in, **extra}))["error"]["code"] == "invalid_format", extra
    msg = await ws.call({**book_in, "product": {**prod, "ean": "12345"}})
    assert msg["error"]["translation_key"] == "invalid_ean"
    for bad in ({"type": "pantry/search", "query": "q" * 201}, {"type": "pantry/lookup", "code": "1" * 65},
                {"type": "pantry/shopping_add", "packages": 10000, "category_id": cat_id},
                {"type": "pantry/book_out", "product_id": 1, "packages": 10000}):  # fmt: skip
        assert (await ws.call(bad))["error"]["code"] == "invalid_format", bad
    res = await ws.call({**book_in, "product": {**prod, "image_url": "https://example.org/a.png"}})
    assert res["success"]
    msg = await ws.call(
        {"type": "pantry/product_save", "data": {"id": res["result"]["product_id"]}}
    )
    assert msg["error"]["code"] == "invalid_format"  # only an id: a clean validation error


async def test_delete_impact_is_silent(hass: HomeAssistant, ws) -> None:
    """A dry run is rolled back and must not make the entities refresh."""
    calls = []
    # @callback: a plain lambda runs in the executor, so a count could lag behind the reply
    unsub = async_dispatcher_connect(hass, SIGNAL_CHANGED, callback(lambda: calls.append(1)))
    msg = await ws.call({"type": "pantry/save", "table": "category", "data": {"name": "Dry"}})
    parent = msg["result"]["id"]
    await ws.call(
        {
            "type": "pantry/save",
            "table": "category",
            "data": {"name": "Dry kid", "parent_id": parent},
        }
    )
    n = len(calls)
    assert n >= 2
    impact = {"type": "pantry/delete_impact", "table": "category", "row_id": parent}
    assert (await ws.call(impact))["result"]["groups"]
    assert len(calls) == n
    unsub()
