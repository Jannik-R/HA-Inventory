"""Stocktaking: scan resolves product and batches at a location; apply books the differences."""

from datetime import date

import pytest

from custom_components.home_inventory import inventory as inv
from custom_components.home_inventory.inventory import InventoryError
from tests.test_inventory import loc, product, stock

EAN = "4006040053026"


def test_scan_and_apply(conn) -> None:
    pasta = product(conn, ean=EAN)
    fridge, shelf = loc(conn), loc(conn, "Vorratsschrank")
    early = inv.book_in(conn, pasta, 2, "2027-01-01", shelf)
    late = inv.book_in(conn, pasta, 3, "2027-06-01", shelf)
    elsewhere = inv.book_in(conn, pasta, 1, "2027-03-01", fridge)
    # an EAN names all batches of the product at that location, earliest first
    res = inv.stocktake_scan(conn, shelf, EAN, today=date(2026, 10, 20))
    assert [b["batch_id"] for b in res["batches"]] == [early, late]
    assert res["batches"][0]["packages"] == 2
    # a label names its batch, also where it is not
    code = inv.label_info(conn, elsewhere)["code"]
    res = inv.stocktake_scan(conn, shelf, code)
    assert [(b["batch_id"], b["packages"]) for b in res["batches"]] == [(elsewhere, 0)]
    with pytest.raises(InventoryError, match="product_unknown"):
        inv.stocktake_scan(conn, shelf, "12345678")
    # counted: early 2 (same), late 1 (2 missing); 1 extra of a product not there
    rice = product(conn, "Reis", "Reis")
    done = inv.stocktake_apply(
        conn, shelf,
        [{"batch_id": early, "packages": 2}, {"batch_id": late, "packages": 1}],
        [{"product_id": rice, "packages": 2, "expires_on": "2028-01-01"}],
    )  # fmt: skip
    assert done == 2
    rice_batch = conn.execute("SELECT id FROM batch WHERE product_id = ?", (rice,)).fetchone()[0]
    assert stock(conn) == {(early, shelf): 2, (late, shelf): 1, (elsewhere, fridge): 1,
                           (rice_batch, shelf): 2}  # fmt: skip
    rows = conn.execute("SELECT kind, source, packages FROM booking ORDER BY id DESC LIMIT 2")
    assert [tuple(r) for r in rows] == [("correct", "stocktake", 2), ("correct", "stocktake", -2)]
    with pytest.raises(InventoryError, match="invalid_value"):
        inv.stocktake_apply(conn, shelf, [], [{"product_id": rice, "packages": 0}])
