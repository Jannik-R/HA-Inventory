"""Remaining amount of opened packages (migration 28): a partly used package is its own batch."""

import sqlite3
from datetime import date

import pytest

from custom_components.home_inventory import db
from custom_components.home_inventory import inventory as inv
from custom_components.home_inventory.inventory import InventoryError

from .test_inventory import loc, product, stock
from .test_websocket import by_name, master, ws  # noqa: F401

TODAY = date(2026, 10, 20)


def err(call) -> str:
    with pytest.raises(InventoryError) as e:
        call()
    return e.value.translation_key


def opened(conn, n=2, rest=0, name="Spaghetti", category="Nudeln"):
    """n opened packages (one batch) and `rest` unopened ones -> (product, opened batch)."""
    p = product(conn, name, category)
    b = inv.book_in(conn, p, n + rest, "2027-01-01", loc(conn))
    for _ in range(n):
        batch = inv.open_package(conn, p, b, today=TODAY)["batch_id"]
    return p, batch


def levels(conn, p):
    """(remaining, packages) of every batch of p with stock, by id."""
    return [
        (r["remaining"], r["packages"])
        for r in conn.execute(
            "SELECT b.remaining, SUM(s.packages) AS packages FROM stock s JOIN batch b"
            " ON b.id = s.batch_id WHERE b.product_id = ? GROUP BY b.id ORDER BY b.id",
            (p,),
        )
    ]


def part(conn, p):
    """Ids of the partly used batches of p with stock, lowest level first."""
    return [
        r[0]
        for r in conn.execute(
            "SELECT b.id FROM batch b WHERE b.product_id = ? AND b.remaining < 1"
            " AND EXISTS (SELECT 1 FROM stock s WHERE s.batch_id = b.id) ORDER BY b.remaining",
            (p,),
        )
    ]


def last_booking(conn):
    return conn.execute("SELECT MAX(id) FROM booking").fetchone()[0]


def test_migration_28(monkeypatch):
    c = db.connect(":memory:")
    with monkeypatch.context() as m:  # seeded DB of version 27
        m.setattr(db, "MIGRATIONS", db.MIGRATIONS[:27])
        db.migrate(c)
    cat = c.execute("SELECT id FROM category LIMIT 1").fetchone()[0]
    c.executescript(
        f"INSERT INTO product (id, name, category_id, updated_at) VALUES (1, 'Reis', {cat}, 't');"
        "INSERT INTO batch (id, product_id, opened_on, created_at) VALUES (1, 1, '2026-10-01', 't');"
        "INSERT INTO booking (ts, kind, batch_id, packages, source) VALUES ('t', 'open', 1, 1, 'x');"
    )
    db.migrate(c)
    assert c.execute("PRAGMA user_version").fetchone()[0] == len(db.MIGRATIONS)
    assert c.execute("SELECT remaining FROM batch").fetchone()[0] == 1
    c.execute(
        "INSERT INTO booking (ts, kind, batch_id, packages, source) VALUES ('t', 'remaining', 1, 1, 'x')"
    )
    new = "INSERT INTO batch (product_id, opened_on, remaining, created_at) VALUES (1, '2026-10-01', ?, 't')"
    c.execute(new, (0.5,))
    c.execute(new, (0.5,))  # partly used batches never merge
    with pytest.raises(sqlite3.IntegrityError):
        c.execute(new, (1,))  # a second full batch of the key does not exist
    assert c.execute("PRAGMA foreign_key_check").fetchall() == []


def test_level_moves_one_package_to_its_own_batch(conn):
    p, b = opened(conn, 3)
    res = inv.set_remaining(conn, b, 0.5)
    rows = conn.execute("SELECT * FROM booking ORDER BY id DESC LIMIT 2").fetchall()
    assert [(r["kind"], r["packages"]) for r in rows] == [("remaining", 1), ("remaining", -1)]
    assert rows[0]["id"] == res["booking_id"]
    assert levels(conn, p) == [(1, 2), (0.5, 1)]
    assert len(inv.stock_list(conn)) == 2
    assert inv.set_remaining(conn, part(conn, p)[0], 0.5)["booking_id"] is None  # no change


def test_level_of_a_partial_and_undo(conn):
    p, b = opened(conn, 1)
    inv.set_remaining(conn, b, 0.5)
    (first,) = part(conn, p)
    quarter = inv.set_remaining(conn, first, 0.25)
    (second,) = part(conn, p)
    assert second != first and levels(conn, p) == [(0.25, 1)]  # the old batch is empty
    inv.undo_remaining(conn, quarter["booking_id"])
    assert part(conn, p) == [first] and levels(conn, p) == [(0.5, 1)]
    assert err(lambda: inv.undo_remaining(conn, quarter["booking_id"])) == "already_undone"


def test_full_package_splits_and_voll_merges_back(conn):
    p, b = opened(conn, 1)
    inv.set_remaining(conn, b, 0.5)  # a single full opened package splits
    inv.set_remaining(conn, part(conn, p)[0], 1)
    assert stock(conn) == {(b, loc(conn)): 1} and levels(conn, p) == [(1, 1)]


def test_partials_never_merge_and_a_new_open_goes_into_the_full_batch(conn):
    p, b = opened(conn, 2, rest=1)
    inv.set_remaining(conn, b, 0.5)
    inv.set_remaining(conn, b, 0.25)
    assert sorted(levels(conn, p)) == [(0.25, 1), (0.5, 1), (1, 1)]  # + the unopened one
    inv.open_package(conn, p, today=TODAY)
    assert stock(conn)[(b, loc(conn))] == 1  # the third opened package is full again


def test_empty_books_out_and_put_back_restores_the_batch(conn):
    p, b = opened(conn, 1)
    inv.set_remaining(conn, b, 0.5)
    (batch,) = part(conn, p)
    res = inv.set_remaining(conn, batch, 0)
    assert res["kind"] == "out" and stock(conn) == {}
    inv.put_back(conn, [res["taken"][0]["booking_id"]])
    assert stock(conn) == {(batch, loc(conn)): 1} and part(conn, p) == [batch]


def test_move_keeps_batch_and_level(conn):
    p, b = opened(conn, 1)
    inv.set_remaining(conn, b, 0.5)
    (batch,) = part(conn, p)
    other = loc(conn, "Vorratsschrank")
    inv.move(conn, batch, loc(conn), other, 1)
    assert stock(conn) == {(batch, other): 1} and levels(conn, p) == [(0.5, 1)]


def test_freeze_and_thaw_carry_the_level(conn):
    p, b = opened(conn, 1, name="Rinderhack", category="Hackfleisch")
    inv.set_remaining(conn, b, 0.5)
    (source,) = part(conn, p)
    freezer = loc(conn, "Gefrierschrank")
    inv.move(conn, source, loc(conn), freezer, 1)
    (frozen,) = part(conn, p)
    row = conn.execute("SELECT * FROM batch WHERE id = ?", (frozen,)).fetchone()
    assert (row["remaining"], row["frozen_on"] is not None) == (0.5, True)
    freeze_id = last_booking(conn)
    inv.move(conn, frozen, freezer, loc(conn), 1)
    (thawed,) = part(conn, p)
    row = conn.execute("SELECT * FROM batch WHERE id = ?", (thawed,)).fetchone()
    assert (row["remaining"], row["opened_on"] is not None, row["frozen_on"]) == (0.5, True, None)
    inv.undo_frozen(conn, last_booking(conn))  # the thaw
    assert part(conn, p) == [frozen]
    inv.undo_frozen(conn, freeze_id)
    assert part(conn, p) == [source]


def test_level_of_a_frozen_batch_and_errors(conn):
    meat = product(conn, "Rinderhack", "Hackfleisch")
    where = loc(conn)
    fresh = inv.book_in(conn, meat, 2, "2026-10-22", where)
    frozen = inv.freeze(conn, meat, 2, today=TODAY)["batch_id"]
    inv.set_remaining(conn, frozen, 0.5)
    (half,) = part(conn, meat)
    assert levels(conn, meat) == [(1, 1), (0.5, 1)] and half != frozen
    assert err(lambda: inv.set_remaining(conn, fresh, 0.5)) == "not_found"  # unopened, unfrozen
    for value in (1.5, -1):
        assert err(lambda value=value: inv.set_remaining(conn, frozen, value)) == "invalid_value"


def test_a_partial_batch_holds_exactly_one_package(conn):
    p, b = opened(conn, 1)
    inv.set_remaining(conn, b, 0.5)
    (batch,) = part(conn, p)
    assert err(lambda: inv.correct(conn, batch, loc(conn), 2)) == "partial_one_package"
    other = loc(conn, "Vorratsschrank")
    assert err(lambda: inv.correct(conn, batch, other, 1)) == "partial_one_package"
    counts = [{"batch_id": batch, "packages": 2}]  # a stocktake count of 2 is refused too
    assert err(lambda: inv.stocktake_apply(conn, loc(conn), counts, [])) == "partial_one_package"


def test_toggling_levels_reuses_the_emptied_partial_batch(conn):
    p, b = opened(conn, 1)
    inv.set_remaining(conn, b, 0.5)
    (half,) = part(conn, p)
    inv.set_remaining(conn, half, 0.25)
    (quarter,) = part(conn, p)
    inv.set_remaining(conn, quarter, 0.5)
    assert part(conn, p) == [half]  # back in the first one
    n = conn.execute("SELECT COUNT(*) FROM batch WHERE product_id = ? AND remaining < 1", (p,))
    assert n.fetchone()[0] == 2


def test_edit_stock_date_on_a_partial_and_full_batches_still_merge(conn):
    p, b = opened(conn, 1)
    inv.set_remaining(conn, b, 0.5)
    (batch,) = part(conn, p)
    assert inv.edit_stock(conn, batch, loc(conn), "2027-02-02", 1) == batch
    row = conn.execute("SELECT * FROM batch WHERE id = ?", (batch,)).fetchone()
    assert (row["expires_on"], row["remaining"]) == ("2027-02-02", 0.5)
    q = product(conn, "Penne")
    where = loc(conn)
    u1, u2 = (
        inv.book_in(conn, q, 1, "2027-01-01", where),
        inv.book_in(conn, q, 1, "2027-06-01", where),
    )
    b1 = inv.open_package(conn, q, u1, today=TODAY)["batch_id"]
    b2 = inv.open_package(conn, q, u2, today=TODAY)["batch_id"]
    assert inv.edit_stock(conn, b1, where, "2030-01-01", 1) == inv.edit_stock(
        conn, b2, where, "2030-01-01", 1
    )


def test_book_out_takes_partial_packages_first(conn):
    p = product(conn)
    where = loc(conn)
    early = inv.book_in(conn, p, 1, "2026-11-01", where)
    late = inv.book_in(conn, p, 2, "2027-01-01", where)
    inv.book_in(conn, p, 1, "2026-10-25", where)  # unopened, earlier than all opened ones
    b0 = inv.open_package(conn, p, early, today=TODAY)["batch_id"]
    b = inv.open_package(conn, p, late, today=TODAY)["batch_id"]
    inv.open_package(conn, p, late, today=TODAY)
    inv.set_remaining(conn, b0, 0.75)
    inv.set_remaining(conn, b, 0.5)
    inv.set_remaining(conn, b, 0.25)
    p0, p1, p2 = (next(r for r in part_rows(conn, p) if r[1] == lv)[0] for lv in (0.75, 0.5, 0.25))
    order = [inv.book_out(conn, p, 1)[0]["batch_id"] for _ in range(3)]
    assert order == [p0, p2, p1]  # earliest date, then the smaller remainder


def part_rows(conn, p):
    return [
        (r["id"], r["remaining"])
        for r in conn.execute("SELECT id, remaining FROM batch WHERE product_id = ?", (p,))
    ]


def test_a_frozen_partial_does_not_jump_the_queue(conn):
    meat = product(conn, "Rinderhack", "Hackfleisch")
    fresh = inv.book_in(conn, meat, 1, "2000-01-01", loc(conn))
    freezer = loc(conn, "Gefrierschrank")
    frozen = inv.book_in(conn, meat, 1, None, freezer)
    inv.set_remaining(conn, frozen, 0.5)
    assert inv.book_out(conn, meat, 1)[0]["batch_id"] == fresh


def test_book_out_code_takes_the_partial_first(conn):
    p, b = opened(conn, 2)
    inv.set_remaining(conn, b, 0.5)
    (batch,) = part(conn, p)
    res = inv.book_out_code(conn, inv.label_info(conn, b)["code"].removeprefix("PTRY:"))
    assert res["taken"][0]["batch_id"] == batch


async def test_websocket_remaining(ws) -> None:  # noqa: F811
    data = await master(ws)
    fridge = by_name(data["locations"], "Kühlschrank")["id"]
    cat_id = by_name(data["categories"], "Nudeln")["id"]
    res = await ws.call(
        {"type": "home_inventory/book_in", "packages": 2, "location_id": fridge,
         "expires_on": "2027-01-01", "product": {"name": "Pegel-Nudeln", "category_id": cat_id}}
    )  # fmt: skip
    pid, batch = res["result"]["product_id"], res["result"]["batch_id"]
    op = await ws.call(
        {"type": "home_inventory/open_package", "product_id": pid, "batch_id": batch}
    )
    msg = {"type": "home_inventory/remaining", "location_id": fridge}
    opened_batch = op["result"]["batch_id"]
    half = await ws.call({**msg, "batch_id": opened_batch, "remaining": 0.5})
    assert half["result"]["kind"] == "remaining" and half["result"]["booking_id"]
    rows = (await ws.call({"type": "home_inventory/stock", "product_id": pid}))["result"]
    own = next(r for r in rows if r["remaining"] == 0.5)
    empty = await ws.call({**msg, "batch_id": own["batch_id"], "remaining": 0})
    assert empty["result"]["kind"] == "out" and empty["result"]["taken"][0]["packages"] == 1
    assert (await ws.call({**msg, "batch_id": opened_batch, "remaining": 2}))["success"] is False
