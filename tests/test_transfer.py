"""CSV transfer: parser, export -> import round trip, preview = apply, stock targets, events."""

import pytest
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import async_capture_events

from custom_components.home_inventory import db
from custom_components.home_inventory import inventory as inv
from custom_components.home_inventory.inventory import InventoryError
from custom_components.home_inventory.inventory.transfer_csv import day, num, parse_csv
from tests.test_inventory import loc, product, stock
from tests.test_websocket import ws  # noqa: F401 (fixture)

HEAD = "name;brand;category;ean;content_amount;content_unit;location;expiry_type;shelf_days\r\n"


def run(conn, kind, text, apply=True):
    return inv.import_csv(conn, kind, text, apply)


def reasons(report):
    return {(r["name"], r["reason"]) for r in report["rows"] if r["reason"]}


def test_parser() -> None:
    rows = parse_csv('﻿Name,Packages\n Reis ,"1,5"\n\n', ("name", "packages"))
    assert rows == [{"name": "Reis", "packages": "1,5", "_line": 2}]
    assert parse_csv("name\tpackages\nA\t2", ("name",))[0]["packages"] == "2"
    with pytest.raises(InventoryError) as err:
        parse_csv("name;brand\nA;B", ("name", "packages"))
    assert (err.value.translation_key, err.value.placeholders) == (
        "csv_header",
        {"column": "packages"},
    )
    assert (num("1,5"), num("1.5"), num(""), day("24.12.2026"), day("2026-12-24")) == (
        1.5, 1.5, None, "2026-12-24", "2026-12-24",
    )  # fmt: skip
    with pytest.raises(InventoryError, match="invalid_date"):
        day("31.02.2026")


def test_products_roundtrip_and_preview(conn) -> None:
    text = (
        HEAD
        + "Spaghetti;Barilla;Nudeln, Reis & Getreide > Nudeln;4006040053026;500;g;Vorratsschrank;best_before;365\r\n"
        + "Quark;;Nudeln;;;;Kühlschrank;use_by;\r\n"
    )
    before = conn.execute("SELECT count(*) FROM product").fetchone()[0]
    preview = run(conn, "products", text, apply=False)
    assert conn.execute("SELECT count(*) FROM product").fetchone()[0] == before  # rolled back
    assert preview["counts"]["create"] == 2
    done = run(conn, "products", text)
    assert done == preview
    assert run(conn, "products", text)["rows"] == []  # re-import: nothing to do
    # export -> import into a fresh database gives the same product rows
    exported = inv.export_products(conn)
    other = db.connect(":memory:")
    db.migrate(other)
    run(other, "products", exported)
    assert inv.export_products(other) == exported
    assert run(other, "products", exported)["counts"] == {
        "create": 0,
        "update": 0,
        "skip": 2,
        "error": 0,
    }


def test_products_matching_and_errors(conn) -> None:
    inv.save(
        conn,
        "product",
        {"name": "Spaghetti", "brand": "A", "category_id": 1, "ean": "4006040053026"},
    )
    inv.save(conn, "product", {"name": "Spaghetti", "brand": "B", "category_id": 1})
    inv.save(conn, "product", {"name": "Reis", "category_id": 1, "shelf_days": 100})
    report = run(
        conn,
        "products",
        HEAD
        + "spaghetti;;Nudeln;;;;;;\r\n"  # two matches without brand match
        + "Nudel;;Nudeln;;1;Lichtjahr;;;\r\n"
        + "Nudel;;Nudeln;12345;;;;;\r\n"
        + "Nudel;;Nudeln;4006040053026;;;;;\r\n"  # EAN taken
        + "Nudel;;Nudeln;;5;;;;\r\n"  # amount without unit
        + "Zzzzz;;;;;;;;\r\n"  # no category can be found
        + "Reis;;;;;;;;\r\n",  # empty cells keep the value
    )
    assert reasons(report) == {
        ("Nudel", "unknown_unit"),
        ("Nudel", "invalid_ean"),
        ("Nudel", "duplicate"),
        ("Nudel", "invalid_value"),
        ("Zzzzz", "category_required"),
    }
    assert report["counts"]["error"] == 5
    assert conn.execute("SELECT shelf_days FROM product WHERE name = 'Reis'").fetchone()[0] == 100
    assert not conn.execute("SELECT 1 FROM product WHERE name = 'Nudel'").fetchone()


def test_categories_locations(conn) -> None:
    text = HEAD + "Dinkel;;Nudeln, Reis & Getreide > Urgetreide > Urkorn;;;;Speisekammer;;\r\n"
    report = run(conn, "products", text)
    kinds = [(r["kind"], r["name"]) for r in report["rows"]]
    assert ("category", "Urgetreide") in kinds and ("category", "Urkorn") in kinds
    assert ("location", "Speisekammer") in kinds
    # a single name finds the one category called so (no new one)
    run(conn, "products", HEAD + "Hafer;;Dinkel;;;;;;\r\n")
    assert conn.execute("SELECT count(*) FROM category WHERE name = 'Dinkel'").fetchone()[0] == 1
    assert run(conn, "products", HEAD + "Hafer;;Dinkel;;;;;;\r\n")["rows"] == []


def test_stock_targets(conn) -> None:
    conn.execute("UPDATE category SET default_location_id = NULL")
    pasta = product(conn, default_location_id=loc(conn, "Vorratsschrank"))
    product(conn, "Reis", "Reis")  # no location anywhere
    head = "name;location;packages;expires_on;opened_on;frozen_on;remaining;charge\r\n"
    text = head + "Spaghetti;;2;2027-01-01;;;;\r\nSpaghetti;Kühlschrank;1;01.02.2027;;;;\r\n"
    report = run(conn, "stock", text)
    assert report["counts"]["create"] == 2
    assert sum(stock(conn).values()) == 3
    rows = conn.execute("SELECT kind, source, packages FROM booking ORDER BY id").fetchall()
    assert [tuple(r) for r in rows] == [("in", "import", 2), ("in", "import", 1)]
    assert run(conn, "stock", text)["rows"] == []  # re-import: nothing booked
    # a target of 5: only the 3 missing at the shelf are booked; a lower one never books out
    more = run(
        conn,
        "stock",
        head + "Spaghetti;;5;2027-01-01;;;;\r\nSpaghetti;Kühlschrank;0;01.02.2027;;;;\r\n",
    )
    assert [r["action"] for r in more["rows"]] == ["update", "skip"]
    assert more["rows"][1]["reason"] == "more_in_stock"
    assert sum(stock(conn).values()) == 6
    bad = run(
        conn,
        "stock",
        head
        + "Reis;;1;;;;;\r\n"  # location_required
        + "Spaghetti;;1;;;;0,5;\r\n"  # partly used package
        + "Spaghetti;;1;;;;;20260101-1\r\n"  # canning charge
        + "Nope;;1;;;;;\r\n"
        + "Spaghetti;;1;2027-05-05;2026-10-01;2026-09-01;;\r\n",  # opened and frozen
    )
    assert reasons(bad) == {
        ("Reis", "location_required"),
        ("Spaghetti", "partial_skipped"),
        ("Spaghetti", "charge_skipped"),
        ("Nope", "not_found"),
    }
    batch = conn.execute(
        "SELECT opened_on, frozen_on FROM batch WHERE product_id = ? AND expires_on = '2027-05-05'",
        (pasta,),
    ).fetchone()
    assert tuple(batch) == ("2026-10-01", "2026-09-01")
    # stock export -> import is a no-op
    assert run(conn, "stock", inv.export_stock(conn))["counts"]["create"] == 0


async def test_import_fires_no_booked_events(hass: HomeAssistant, ws, hass_admin_user) -> None:  # noqa: F811
    booked = async_capture_events(hass, "home_inventory_booked")
    text = HEAD + "ImportTest;;Nudeln;;;;;;\r\n"
    res = await ws.call(
        {"type": "home_inventory/import_csv", "kind": "products", "text": text, "apply": False}
    )
    assert res["result"]["counts"]["create"] == 1
    assert (
        await ws.call(
            {"type": "home_inventory/import_csv", "kind": "products", "text": text, "apply": True}
        )
    )["success"]
    stock_csv = "name;location;packages\r\nImportTest;Kühlschrank;2\r\n"
    res = await ws.call(
        {"type": "home_inventory/import_csv", "kind": "stock", "text": stock_csv, "apply": True}
    )
    assert res["result"]["counts"]["create"] == 1
    await hass.async_block_till_done()
    assert booked == []  # the booking rows are in the log, but no event
    out = await ws.call({"type": "home_inventory/export_csv", "kind": "stock"})
    assert "ImportTest;;Kühlschrank;2" in out["result"]["csv"]
    big = await ws.call(
        {
            "type": "home_inventory/import_csv",
            "kind": "stock",
            "text": "x" * 3_000_001,
            "apply": False,
        }
    )
    assert not big["success"]
    hass_admin_user.groups = []
    denied = await ws.call({"type": "home_inventory/export_csv", "kind": "products"})
    assert denied["error"]["code"] == "unauthorized"
