"""Grocy import: file detection, field mapping, packages of measured units, preview = apply."""

from pathlib import Path

import pytest

from custom_components.home_inventory import inventory as inv
from custom_components.home_inventory.inventory import InventoryError

DIR = Path(__file__).parent / "fixtures" / "grocy"


def files(*names):
    return [(DIR / f"{n}.json").read_text(encoding="utf-8") for n in names]


ALL = ("products", "product_groups", "locations", "quantity_units", "product_barcodes", "stock")


def row(conn, name):
    return conn.execute("SELECT * FROM product WHERE name = ?", (name,)).fetchone()


def test_mapping(conn) -> None:
    preview = inv.import_grocy(conn, files(*ALL), False)
    assert not row(conn, "Spaghetti")
    report = inv.import_grocy(conn, files(*ALL), True)
    assert report == preview
    spag, flour = row(conn, "Spaghetti"), row(conn, "Mehl")
    assert (spag["ean"], spag["shelf_days"], spag["opened_days"], spag["min_packages"]) == (
        "4006040053026", 365, 5, 2,
    )  # fmt: skip
    assert (flour["shelf_days"], flour["frozen_days"], flour["min_packages"]) == (None, 180, None)
    assert row(conn, "Reis")["ean"] is None  # "123" is no EAN
    assert (
        conn.execute("SELECT freezer FROM location WHERE name = 'Gefrierfach'").fetchone()[0] == 1
    )
    assert conn.execute("SELECT freezer FROM location WHERE name = 'Keller'").fetchone()[0] == 0
    assert ("category", "Backzutaten") in {(r["kind"], r["name"]) for r in report["rows"]}
    errors = [(r["name"], r["reason"]) for r in report["rows"] if r["action"] == "error"]
    assert errors == [("Quatsch", "category_required")]
    packs = dict(
        conn.execute(
            "SELECT p.name, sum(s.packages) FROM stock s JOIN batch b ON b.id = s.batch_id"
            " JOIN product p ON p.id = b.product_id GROUP BY p.name"
        ).fetchall()
    )
    assert packs == {"Spaghetti": 4, "Mehl": 2, "Reis": 1}  # grams: one package per entry
    assert conn.execute("SELECT count(*) FROM batch WHERE expires_on IS NULL").fetchone()[0] == 1
    assert (
        conn.execute("SELECT opened_on FROM batch WHERE opened_on IS NOT NULL").fetchone()[0]
        == "2026-10-01"
    )
    assert inv.import_grocy(conn, files(*ALL), True)["rows"] == [
        r for r in report["rows"] if r["action"] == "error"
    ]  # second run: only the unchanged error row is left


def test_files(conn) -> None:
    with pytest.raises(InventoryError, match="grocy_products"):
        inv.import_grocy(conn, files("stock"), False)
    with pytest.raises(InventoryError, match="grocy_file"):
        inv.import_grocy(conn, ["[]", '[{"x": 1}]'], False)
    with pytest.raises(InventoryError, match="grocy_file"):
        inv.import_grocy(conn, ["not json"], False)
    # only the products file: names and shelf life, no stock
    assert inv.import_grocy(conn, [*files("products"), "[]"], False)["counts"]["create"] >= 3


def test_unknown_unit_is_one_package_per_entry(conn) -> None:
    # without quantity_units.json the unit of "Spaghetti" is unknown: 3 + 1 entries = 2 packages
    inv.import_grocy(conn, files("products", "product_groups", "locations", "stock"), True)
    n = conn.execute(
        "SELECT sum(s.packages) FROM stock s JOIN batch b ON b.id = s.batch_id"
        " JOIN product p ON p.id = b.product_id WHERE p.name = 'Spaghetti'"
    ).fetchone()[0]
    assert n == 2
    with pytest.raises(InventoryError, match="grocy_file"):
        inv.import_grocy(conn, [*files("products"), '[{"name": "no id"}]'], False)
