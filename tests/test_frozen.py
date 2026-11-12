"""Freezing (migration 25): freeze / thaw, the freezer rule on book-in and move, undo, labels."""

from datetime import date

import pytest

from custom_components.home_inventory import inventory as inv
from custom_components.home_inventory.inventory import InventoryError
from tests.test_inventory import cat, loc, product, stock

TODAY = date(2026, 10, 20)


def err_key(call) -> str:
    with pytest.raises(InventoryError) as err:
        call()
    return err.value.translation_key


def freezer(conn) -> int:
    return loc(conn, "Gefrierschrank")


def batch(conn, batch_id: int) -> dict:
    return dict(conn.execute("SELECT * FROM batch WHERE id = ?", (batch_id,)).fetchone())


def test_seed(conn) -> None:
    assert conn.execute("SELECT freezer FROM location WHERE name = 'Gefrierschrank'").fetchone()[0]
    meat = product(conn, "Rinderhack", "Hackfleisch")
    eff = inv.effective(conn, meat)
    assert (eff["frozen_days"]["value"], eff["frozen_goods"]["value"]) == (90, None)
    assert inv.effective(conn, product(conn, "Pizza X", "Pizza"))["frozen_goods"]["value"] == 1
    assert inv.effective(conn, product(conn))["frozen_days"]["value"] == 90  # defaults


def test_freeze_thaw_and_undo(conn) -> None:
    meat = product(conn, "Rinderhack", "Hackfleisch")
    fridge = loc(conn)
    fresh = inv.book_in(conn, meat, 3, "2026-10-22", fridge)
    res = inv.freeze(conn, meat, today=TODAY)  # 1 package, first freezer
    frozen = res["batch_id"]
    assert (res["expires_on"], res["location"]) == ("2027-01-18", "Gefrierschrank")
    assert batch(conn, frozen)["frozen_on"] == "2026-10-20"
    assert stock(conn) == {(fresh, fridge): 2, (frozen, freezer(conn)): 1}
    kinds = conn.execute("SELECT kind, packages FROM booking ORDER BY id DESC LIMIT 2").fetchall()
    assert [tuple(r) for r in kinds] == [("freeze", 1), ("freeze", -1)]
    row = inv.stock_list(conn, product_id=meat)
    assert {r["batch_id"]: r["expiry_type"] for r in row}[frozen] == "guide"
    assert inv.label_info(conn, frozen)["approx"] is True
    # a frozen package is not opened; thawed = opened today, keeps opened_days (else 1 day)
    assert err_key(lambda: inv.open_package(conn, meat, frozen)) == "frozen"
    inv.save(conn, "category", {"id": cat(conn, "Hackfleisch"), "opened_days": 2})
    t = inv.thaw(conn, meat, today=date(2026, 12, 1))
    assert (t["location"], t["expires_on"]) == ("Kühlschrank", "2026-12-03")
    assert batch(conn, t["batch_id"])["opened_on"] == "2026-12-01"
    assert stock(conn)[(t["batch_id"], fridge)] == 1
    # undo once: back into the freezer batch
    inv.undo_frozen(conn, t["booking_id"])
    assert stock(conn)[(frozen, freezer(conn))] == 1
    assert err_key(lambda: inv.undo_frozen(conn, t["booking_id"])) == "already_undone"
    assert err_key(lambda: inv.undo_frozen(conn, 99999)) == "not_found"


def test_freezer_rule_on_book_in_and_move(conn) -> None:
    bread = product(conn, "Vollkornbrot", "Brot")
    b = inv.book_in(conn, bread, 2, "2026-10-25", freezer(conn), today=TODAY)
    assert (
        batch(conn, b)["frozen_on"] == "2026-10-20" and batch(conn, b)["expires_on"] == "2027-01-18"
    )
    # moving a fresh batch into the freezer freezes it, moving it out thaws it
    shelf = loc(conn, "Vorratsschrank")
    fresh = inv.book_in(conn, bread, 1, "2026-10-25", shelf)
    inv.move(conn, fresh, shelf, freezer(conn), 1)
    assert fresh not in {k[0] for k in stock(conn)}
    inv.move(conn, b, freezer(conn), shelf, 1)
    thawed = [k for k in stock(conn) if k[1] == shelf]
    assert len(thawed) == 1 and batch(conn, thawed[0][0])["opened_on"] is not None
    # frozen goods keep their printed date in the freezer
    pizza = product(conn, "Pizza X", "Pizza")
    p = inv.book_in(conn, pizza, 1, "2027-05-01", freezer(conn))
    assert batch(conn, p)["frozen_on"] is None and batch(conn, p)["expires_on"] == "2027-05-01"
    assert err_key(lambda: inv.freeze(conn, pizza)) == "not_freezable"
    battery = product(conn, "AA", "Batterien")
    assert err_key(lambda: inv.freeze(conn, battery)) == "not_freezable"


def test_no_freezer(conn) -> None:
    conn.execute("UPDATE location SET freezer = 0")
    meat = product(conn, "Rinderhack", "Hackfleisch")
    inv.book_in(conn, meat, 1, "2026-10-22", loc(conn))
    assert err_key(lambda: inv.freeze(conn, meat)) == "no_freezer"
    assert err_key(lambda: inv.freeze(conn, meat, to_location_id=loc(conn))) == "no_freezer"


def test_module_off_changes_no_date(conn) -> None:
    conn.freezing = False  # module Einfrieren off
    meat = product(conn, "Rinderhack", "Hackfleisch")
    b = inv.book_in(conn, meat, 2, "2026-10-22", freezer(conn), today=TODAY)
    assert batch(conn, b)["frozen_on"] is None and batch(conn, b)["expires_on"] == "2026-10-22"
    fresh = inv.book_in(conn, meat, 1, "2026-10-23", loc(conn))
    inv.move(conn, fresh, loc(conn), freezer(conn), 1)
    assert stock(conn)[(fresh, freezer(conn))] == 1  # a plain move
    assert err_key(lambda: inv.freeze(conn, meat)) == "not_freezable"


def test_freeze_scan(conn) -> None:
    meat = product(conn, "Rinderhack", "Hackfleisch", ean="4006040053026")
    fridge = loc(conn)
    fresh = inv.book_in(conn, meat, 2, "2026-10-22", fridge)
    res = inv.freeze_scan(conn, "4006040053026", TODAY)  # EAN: earliest fresh one
    assert (res["thaw"], res["location"]) == (False, "Gefrierschrank")
    # the frozen batch's label thaws it; a scanned location that is no freezer is the target
    code = inv.label_info(conn, res["batch_id"])["code"]
    back = inv.freeze_scan(conn, code, TODAY, location_id=loc(conn, "Vorratsschrank"))
    assert (back["thaw"], back["location"]) == (True, "Vorratsschrank")
    # a fresh batch's label freezes that batch
    again = inv.freeze_scan(conn, inv.label_info(conn, fresh)["code"], TODAY, freezer(conn))
    assert (again["thaw"], again["location"]) == (False, "Gefrierschrank")
    assert (fresh, fridge) not in stock(conn)


def test_freeze_scan_picked_product(conn) -> None:
    """A product picked in the panel goes by id, also when its name is shared."""
    a = product(conn, "Rinderhack", "Hackfleisch", brand="A")
    b = product(conn, "Rinderhack", "Hackfleisch", brand="B")
    inv.book_in(conn, a, 1, "2026-10-22", loc(conn))
    inv.book_in(conn, b, 1, "2026-10-22", loc(conn))
    with pytest.raises(InventoryError) as err:
        inv.freeze_scan(conn, "Rinderhack", TODAY)
    assert err.value.translation_key == "product_not_unique"
    res = inv.freeze_scan(conn, None, TODAY, product_id=b)
    assert res["location"] == "Gefrierschrank"
    assert [
        r[0] for r in conn.execute("SELECT product_id FROM batch WHERE frozen_on IS NOT NULL")
    ] == [b]
