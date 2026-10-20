"""Cooked: proposal (scaling, FEFO, partial -> open, opened package, unchecked rows), booking,
undo, all-or-nothing, service."""

from datetime import date

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

from custom_components.home_inventory import inventory as inv
from custom_components.home_inventory.inventory import InventoryError

from .test_inventory import loc, product, stock, unit
from .test_recipes import ing, recipe
from .test_services import call, entry  # noqa: F401

TODAY = date(2026, 10, 20)


def pasta(conn, name="Spaghetti", **kw):
    return product(conn, name, content_amount=500, content_unit_id=unit(conn, "g"), **kw)


def rows(conn, ingredients, servings=2, cook=2):
    return inv.cooked_proposal(conn, recipe(conn, ingredients, servings=servings), cook)


def test_scales_and_opens_the_remainder(conn):
    p = pasta(conn)
    inv.book_in(conn, p, 3, "2027-01-01", loc(conn))
    (row,) = rows(conn, [ing(conn, "Nudeln", 400, "g")], servings=2, cook=4)  # 800 g
    c = row["candidates"][0]
    assert (row["amount"], row["checked"], row["product_id"]) == (800, True, p)
    assert (c["action"], c["packages"], c["open"]) == ("out", 1, 1)  # 500 out, 300 of an opened one


def test_existing_opened_package_is_used(conn):
    p = pasta(conn)
    b = inv.book_in(conn, p, 2, "2027-01-01", loc(conn))
    opened = inv.open_package(conn, p, b, today=TODAY)["batch_id"]
    (row,) = rows(conn, [ing(conn, "Nudeln", 200, "g")], cook=2)  # less than the opened package
    c = row["candidates"][0]
    assert (c["action"], c["batch_id"], c["remaining"], row["checked"]) == (
        "reduce", opened, 0.6, True,
    )  # fmt: skip
    (row,) = rows(conn, [ing(conn, "Nudeln", 600, "g")], cook=2)  # opened one out, 100 of a new one
    c = row["candidates"][0]
    assert (c["action"], c["packages"], c["open"], c["remaining"]) == ("out", 1, 1, 0.8)


def test_open_level_is_at_least_almost_empty(conn):
    p = pasta(conn)
    inv.book_in(conn, p, 1, "2027-01-01", loc(conn))
    (row,) = rows(conn, [ing(conn, "Nudeln", 499.9, "g")], cook=2)  # 0.9998 of a package
    c = row["candidates"][0]
    assert (c["action"], c["remaining"]) == ("open", 0.1)  # not rounded to 0 (= empty)


def test_reduce_empty_and_out_with_level_and_undo(conn):
    p = pasta(conn)
    b = inv.book_in(conn, p, 3, "2027-01-01", loc(conn))
    opened = inv.open_package(conn, p, b, today=TODAY)["batch_id"]
    before = stock(conn)
    lv = lambda: conn.execute("SELECT remaining FROM batch WHERE id = ?", (opened,)).fetchone()[0]  # noqa: E731
    res = inv.book_cooked(
        conn, [{"product_id": p, "packages": 0, "action": "reduce", "remaining": 0.6}]
    )
    assert (lv(), len(res["remaining_ids"]), res["bookings"][0]["action"]) == (0.6, 1, "reduce")
    inv.undo_cooked(conn, res["out_ids"], res["open_ids"], remaining_ids=res["remaining_ids"])
    assert lv() == 1
    inv.set_remaining(conn, opened, 0.4)
    res = inv.book_cooked(
        conn, [{"product_id": p, "packages": 0, "action": "reduce", "remaining": 0}]
    )
    assert len(res["out_ids"]) == 1 and sum(stock(conn).values()) == sum(before.values()) - 1
    inv.undo_cooked(conn, res["out_ids"], res["open_ids"], remaining_ids=res["remaining_ids"])
    assert lv() == 0.4 and stock(conn) == before
    inv.set_remaining(conn, opened, 1)
    item = {"product_id": p, "packages": 1, "action": "out", "open": 1, "remaining": 0.8}
    res = inv.book_cooked(conn, [item], today=TODAY)  # the opened one out, a new one opened at 0.8
    assert len(res["remaining_ids"]) == 1 and lv() == 0.8
    inv.undo_cooked(conn, res["out_ids"], res["open_ids"], remaining_ids=res["remaining_ids"])
    assert stock(conn) == before and lv() == 1
    with pytest.raises(InventoryError):  # reduce needs a level and an opened batch
        inv.book_cooked(conn, [{"product_id": p, "packages": 0, "action": "reduce"}])


def test_fefo_default_product_and_batch(conn):
    late, soon = pasta(conn, "Late"), pasta(conn, "Soon")
    inv.book_in(conn, late, 1, "2028-01-01", loc(conn))
    inv.book_in(conn, soon, 1, "2027-01-01", loc(conn))
    inv.book_in(conn, soon, 1, "2026-12-01", loc(conn))
    (row,) = rows(conn, [ing(conn, "Nudeln", 500, "g")])
    assert row["product_id"] == soon and len(row["candidates"]) == 2
    c = next(c for c in row["candidates"] if c["product_id"] == soon)
    assert [b["expires_on"] for b in c["batches"]] == ["2026-12-01", "2027-01-01"]
    assert c["batch_id"] == c["batches"][0]["batch_id"]


def test_unchecked_and_left_out_rows(conn):
    inv.book_in(conn, pasta(conn), 1, None, loc(conn))
    inv.book_in(conn, product(conn, "Mehl1", "Mehl"), 1, None, loc(conn))  # no content
    got = rows(
        conn,
        [
            ing(conn, "Nudeln", 100, "g", optional=True),
            ing(conn, "Mehl", 100, "g"),  # unit not convertible: one package
            ing(conn, "Salz", 5, "g", skip_stock=True),
            ing(conn, "Zucker", 5, "g"),  # nothing in stock
            ing(conn, None, 1, "g", text="Mystery"),
        ],
    )
    assert [(r["optional"], r["checked"]) for r in got] == [(True, False), (False, False)]
    assert got[1]["candidates"][0]["packages"] == 1


def test_book_undo_and_all_or_nothing(conn):
    p = pasta(conn)
    inv.book_in(conn, p, 3, "2027-01-01", loc(conn))
    before = stock(conn)
    item = {"product_id": p, "packages": 1, "action": "out", "open": 1}
    res = inv.book_cooked(conn, [item], "u", TODAY)
    assert [(b["action"], b["packages"]) for b in res["bookings"]] == [("out", 1), ("open", 1)]
    assert sum(stock(conn).values()) == 2
    assert {r[0] for r in conn.execute("SELECT source FROM booking WHERE kind != 'in'")} == {
        "cooked"
    }
    inv.undo_cooked(conn, res["out_ids"], res["open_ids"])
    assert stock(conn) == before
    with pytest.raises(InventoryError):
        inv.book_cooked(conn, [{**item, "open": 0}, {**item, "packages": 9}])


async def test_service_and_all_or_nothing_under_run(hass: HomeAssistant, entry) -> None:  # noqa: F811
    db = entry.runtime_data

    def setup(conn):
        p = pasta(conn, "Penne")
        inv.book_in(conn, p, 3, "2027-01-01", loc(conn))
        recipe(conn, [ing(conn, "Nudeln", 500, "g")], name="Pasta")
        return p

    p = await db.run(setup)
    before = await db.run(stock)
    ok = {"product_id": p, "packages": 1, "action": "out"}
    with pytest.raises(InventoryError):  # the second row fails: the first is rolled back
        await db.run(inv.book_cooked, [ok, {**ok, "packages": 9}])
    assert await db.run(stock) == before
    res = await call(hass, "cooked", recipe="pasta", servings=4)  # 1000 g: 2 packages
    assert [(b["name"], b["packages"], b["action"]) for b in res["bookings"]] == [
        ("Penne", 2, "out")
    ]
    assert sum((await db.run(stock)).values()) == sum(before.values()) - 2


def test_open_skips_frozen_and_count_units_open_the_remainder(conn):
    p = pasta(conn)
    frozen = inv.book_in(conn, p, 1, "2026-12-01", loc(conn))
    fresh = inv.book_in(conn, p, 1, "2027-01-01", loc(conn))
    conn.execute("UPDATE batch SET frozen_on = '2026-10-01' WHERE id = ?", (frozen,))
    (row,) = rows(conn, [ing(conn, "Nudeln", 200, "g")])
    c = row["candidates"][0]
    assert (c["action"], c["batch_id"]) == ("open", fresh)  # never the frozen batch
    assert [b["frozen"] for b in c["batches"]] == [True, False]

    q = product(conn, "Eier", "Nudeln", content_amount=10, content_unit_id=unit(conn, "Stück"))
    inv.book_in(conn, q, 2, None, loc(conn))
    conn.execute(
        "UPDATE product SET category_id = ? WHERE id = ?",
        (conn.execute("SELECT id FROM category WHERE name = 'Mehl'").fetchone()[0], q),
    )
    (row,) = rows(conn, [ing(conn, "Mehl", 3, "Stück")])  # 3 of a 10-pack: open one, not take 1
    c = row["candidates"][0]
    assert (c["action"], c["packages"], row["checked"]) == ("open", 1, True)


def test_not_enough_stock_is_unchecked_and_no_open_without_a_spare_package(conn):
    p = pasta(conn)
    inv.book_in(conn, p, 1, None, loc(conn))
    (row,) = rows(conn, [ing(conn, "Nudeln", 2000, "g")])  # 4 needed, 1 there
    c = row["candidates"][0]
    assert (c["packages"], c["open"], row["checked"]) == (1, 0, False)
    (row,) = rows(conn, [ing(conn, "Nudeln", 700, "g")])  # 1 out, no package left to open
    c = row["candidates"][0]
    assert (c["packages"], c["open"]) == (1, 0)


async def test_service_opens_with_todays_date(hass: HomeAssistant, entry) -> None:  # noqa: F811
    db = entry.runtime_data

    def setup(conn):
        inv.book_in(conn, pasta(conn, "Fusilli"), 2, "2027-01-01", loc(conn))
        recipe(conn, [ing(conn, "Nudeln", 200, "g")], name="Wenig")

    await db.run(setup)
    res = await call(hass, "cooked", recipe="wenig")
    assert [(b["packages"], b["action"]) for b in res["bookings"]] == [(1, "open")]
    (on,) = await db.run(
        lambda c: [
            r[0] for r in c.execute("SELECT opened_on FROM batch WHERE opened_on IS NOT NULL")
        ]
    )
    assert on == dt_util.now().date().isoformat()
