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


def partials(conn, p):
    """(remaining, batch id) of the partly used packages in stock, lowest level first."""
    return [
        (r["remaining"], r["id"])
        for r in conn.execute(
            "SELECT id, remaining FROM batch WHERE product_id = ? AND remaining < 1"
            " AND EXISTS (SELECT 1 FROM stock WHERE batch_id = batch.id) ORDER BY remaining",
            (p,),
        )
    ]


def undo(conn, res):
    inv.undo_cooked(conn, res["out_ids"], res["open_ids"], remaining_ids=res["remaining_ids"])


def test_partial_package_is_reduced(conn):
    p = pasta(conn)
    b = inv.book_in(conn, p, 2, "2027-01-01", loc(conn))
    opened = inv.open_package(conn, p, b, today=TODAY)["batch_id"]
    inv.set_remaining(conn, opened, 0.8)
    (row,) = rows(conn, [ing(conn, "Nudeln", 100, "g")], cook=2)  # 0.2 of a package
    c = row["candidates"][0]
    assert (c["action"], c["packages"], c["remaining"], row["checked"]) == ("reduce", 0, 0.6, True)


def test_two_partial_packages_use_up_one_and_reduce_the_other(conn):
    p = pasta(conn)
    b = inv.book_in(conn, p, 2, "2027-01-01", loc(conn))
    opened = inv.open_package(conn, p, b, today=TODAY)["batch_id"]
    inv.open_package(conn, p, b, today=TODAY)
    inv.set_remaining(conn, opened, 0.25)
    inv.set_remaining(conn, opened, 0.75)
    before = stock(conn)
    (row,) = rows(conn, [ing(conn, "Nudeln", 250, "g")], cook=2)  # half a package
    c = row["candidates"][0]
    three_quarters = partials(conn, p)[1][1]
    assert (c["action"], c["packages"], c["batch_id"], c["remaining"]) == (
        "reduce", 1, three_quarters, 0.5,
    )  # fmt: skip
    item = {k: c[k] for k in ("product_id", "batch_id", "packages", "action", "remaining")}
    res = inv.book_cooked(conn, [item])
    assert (len(res["out_ids"]), len(res["remaining_ids"])) == (1, 1)
    assert [lv for lv, _ in partials(conn, p)] == [0.5]
    undo(conn, res)
    assert [lv for lv, _ in partials(conn, p)] == [0.25, 0.75] and stock(conn) == before


def two_partials(conn):
    """Partly used 1/4 and 3/4 (opened, dated 2027-01-01) and 4 unopened packages dated earlier."""
    p = pasta(conn)
    where = loc(conn)
    inv.book_in(conn, p, 4, "2026-12-01", where)
    b = inv.book_in(conn, p, 2, "2027-01-01", where)
    opened = inv.open_package(conn, p, b, today=TODAY)["batch_id"]
    inv.open_package(conn, p, b, today=TODAY)
    inv.set_remaining(conn, opened, 0.25)
    inv.set_remaining(conn, opened, 0.75)
    return p


def test_used_up_partials_are_booked_by_batch_before_fefo(conn):
    p = two_partials(conn)
    old = {i for _, i in partials(conn, p)}
    (row,) = rows(conn, [ing(conn, "Nudeln", 625, "g")], cook=2)  # 1/4 + 3/4 + 1/4 of a new one
    c = row["candidates"][0]
    assert (c["action"], c["packages"], c["used_up"], c["open"], c["batch_id"]) == (
        "out", 2, 2, 1, None,
    )  # fmt: skip
    item = {k: c[k] for k in ("product_id", "batch_id", "packages", "action", "open", "used_up")}
    res = inv.book_cooked(conn, [item | {"remaining": c["remaining"]}], today=TODAY)
    assert not old & {i for _, i in partials(conn, p)}  # the earlier unopened ones were not taken
    assert [lv for lv, _ in partials(conn, p)] == [0.75]
    undo(conn, res)
    assert {i for _, i in partials(conn, p)} == old


def test_exact_cover_is_out_without_reduce(conn):
    two_partials(conn)
    (row,) = rows(conn, [ing(conn, "Nudeln", 500, "g")], cook=2)  # 1/4 + 3/4
    c = row["candidates"][0]
    assert (c["action"], c["packages"], c["used_up"], c["open"]) == ("out", 2, 2, 0)


def test_reduce_of_a_hand_picked_batch_skips_it_in_the_used_up(conn):
    p = two_partials(conn)
    quarter, three = (i for _, i in partials(conn, p))
    item = {"product_id": p, "batch_id": quarter, "packages": 1, "action": "reduce", "remaining": 0}
    res = inv.book_cooked(conn, [item])  # the 3/4 goes out, then the picked 1/4 is emptied
    assert len(res["out_ids"]) == 2 and partials(conn, p) == []
    undo(conn, res)
    assert {i for _, i in partials(conn, p)} == {quarter, three}
    with pytest.raises(InventoryError):  # only one other part
        inv.book_cooked(conn, [item | {"packages": 2}])


def test_out_and_open_at_a_level_and_undo(conn):
    p = pasta(conn)
    b = inv.book_in(conn, p, 3, "2027-01-01", loc(conn))
    inv.open_package(conn, p, b, today=TODAY)
    before = stock(conn)
    item = {"product_id": p, "packages": 1, "action": "out", "open": 1, "remaining": 0.8}
    res = inv.book_cooked(conn, [item], today=TODAY)  # the opened one out, a new one opened at 0.8
    assert len(res["remaining_ids"]) == 1 and [lv for lv, _ in partials(conn, p)] == [0.8]
    undo(conn, res)
    assert stock(conn) == before and partials(conn, p) == []


def test_reduce_to_empty_books_out_and_undo_restores(conn):
    p = pasta(conn)
    b = inv.book_in(conn, p, 2, "2027-01-01", loc(conn))
    opened = inv.open_package(conn, p, b, today=TODAY)["batch_id"]
    inv.set_remaining(conn, opened, 0.4)
    before = stock(conn)
    res = inv.book_cooked(
        conn, [{"product_id": p, "packages": 0, "action": "reduce", "remaining": 0}]
    )
    assert len(res["out_ids"]) == 1 and sum(stock(conn).values()) == sum(before.values()) - 1
    undo(conn, res)
    assert stock(conn) == before and partials(conn, p)[0][0] == 0.4
    with pytest.raises(InventoryError):  # reduce needs a level
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
            r[0]
            for r in c.execute("SELECT DISTINCT opened_on FROM batch WHERE opened_on IS NOT NULL")
        ]
    )
    assert on == dt_util.now().date().isoformat()


async def test_service_reduces_a_partial_package(hass: HomeAssistant, entry) -> None:  # noqa: F811
    db = entry.runtime_data

    def setup(conn):
        p = pasta(conn, "Penne")
        b = inv.book_in(conn, p, 2, "2027-01-01", loc(conn))
        inv.set_remaining(conn, inv.open_package(conn, p, b, today=TODAY)["batch_id"], 0.8)
        recipe(conn, [ing(conn, "Nudeln", 100, "g")], name="Wenig")

    await db.run(setup)
    res = await call(hass, "cooked", recipe="wenig")
    assert [(b["packages"], b["action"]) for b in res["bookings"]] == [(0, "reduce")]
    assert len(res["remaining_ids"]) == 1


KEYS = ("product_id", "batch_id", "packages", "action", "open", "remaining", "used_up")
NUDELN = ("Nudeln", 500, "g"), ("Nudeln", 1000, "g")  # 1 + 2 packages of 500 g


def booked_as_returned(conn, prop):
    """Book the checked rows of a proposal unchanged; the number of packages touched."""
    items = [
        {k: c[k] for k in KEYS}
        for r in prop
        if r["checked"]
        for c in r["candidates"]
        if c["product_id"] == r["product_id"]
    ]
    return sum(b["packages"] for b in inv.book_cooked(conn, items, "u", TODAY)["bookings"])


def two_batches(conn):
    p = pasta(conn)
    inv.book_in(conn, p, 2, "2027-01-01", loc(conn))
    inv.book_in(conn, p, 1, "2027-02-01", loc(conn))
    return p


def test_same_category_rows_share_the_stock(conn):
    two_batches(conn)
    prop = rows(conn, [ing(conn, *a) for a in NUDELN], cook=2)
    assert [r["checked"] for r in prop] == [True, True]
    assert booked_as_returned(conn, prop) == 3
    assert sum(stock(conn).values()) == 0


def test_too_little_for_the_second_row_is_short_but_books(conn):
    p = pasta(conn)
    inv.book_in(conn, p, 2, "2027-01-01", loc(conn))
    prop = rows(conn, [ing(conn, *a) for a in NUDELN], cook=2)
    assert (prop[1]["checked"], prop[1]["candidates"][0]["packages"]) == (False, 1)  # 2 of 1 left
    assert booked_as_returned(conn, prop) == 1


def test_everything_taken_leaves_the_row_out(conn):
    inv.book_in(conn, pasta(conn), 1, "2027-01-01", loc(conn))
    assert len(rows(conn, [ing(conn, *a) for a in (NUDELN[0], NUDELN[0])], cook=2)) == 1


def test_fully_opened_batch_of_several_packages_serves_both_rows(conn):
    p = pasta(conn)
    inv.book_in(conn, p, 2, "2027-01-01", loc(conn))
    conn.execute("UPDATE batch SET opened_on = '2026-10-01'")
    prop = rows(conn, [ing(conn, *NUDELN[0]), ing(conn, *NUDELN[0])], cook=2)
    assert [r["checked"] for r in prop] == [True, True]
    assert booked_as_returned(conn, prop) == 2


def test_second_row_uses_the_rest_of_the_package_the_first_opened(conn):
    inv.book_in(conn, pasta(conn), 1, "2027-01-01", loc(conn))
    prop = rows(conn, [ing(conn, "Nudeln", 200, "g"), ing(conn, "Nudeln", 200, "g")], cook=2)
    assert [r["candidates"][0]["action"] for r in prop] == ["open", "reduce"]
    assert all(b is None or b in {x[0] for x in conn.execute("SELECT id FROM batch")}
               for r in prop for b in [r["candidates"][0]["batch_id"]])  # fmt: skip
    booked_as_returned(conn, prop)
    assert sum(stock(conn).values()) == 1  # one package left, at level 0.2


def test_unchecked_row_takes_nothing_from_the_next(conn):
    inv.book_in(conn, pasta(conn), 1, "2027-01-01", loc(conn))
    prop = rows(conn, [ing(conn, "Nudeln", 2, "Stück"), ing(conn, *NUDELN[0])], cook=2)
    assert [r["checked"] for r in prop] == [False, True]
    assert booked_as_returned(conn, prop) == 1


async def test_proposal_changes_nothing_and_fires_no_event(hass: HomeAssistant, entry) -> None:  # noqa: F811
    db = entry.runtime_data
    seen = []
    hass.bus.async_listen("home_inventory_booked", seen.append)

    def setup(conn):
        two_batches(conn)
        return recipe(conn, [ing(conn, *a) for a in NUDELN], name="Doppelt")

    rid = await db.run(setup)
    await hass.async_block_till_done()
    seen.clear()  # the setup's own stock-in events
    snap = lambda c: (stock(c), c.execute("SELECT count(*), max(id) FROM booking").fetchone()[:])  # noqa: E731
    before = await db.run(snap, write=False)
    prop = await db.run(inv.cooked_proposal, rid, 2)  # a normal write run: still nothing announced
    await hass.async_block_till_done()
    assert (len(prop), seen, await db.run(snap, write=False)) == (2, [], before)


async def test_service_shares_the_stock_between_ingredients(hass: HomeAssistant, entry) -> None:  # noqa: F811
    db = entry.runtime_data

    def setup(conn):
        two_batches(conn)
        recipe(conn, [ing(conn, *a) for a in NUDELN], name="Doppelt")

    await db.run(setup)
    res = await call(hass, "cooked", recipe="doppelt")
    assert sum(b["packages"] for b in res["bookings"]) == 3
    assert sum((await db.run(stock)).values()) == 0
