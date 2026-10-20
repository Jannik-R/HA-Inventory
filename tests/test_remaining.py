"""Remaining amount of opened packages (migration 28): levels, undo, book-out, migration, websocket."""

from datetime import date

import pytest

from custom_components.home_inventory import db
from custom_components.home_inventory import inventory as inv
from custom_components.home_inventory.inventory import InventoryError

from .test_inventory import loc, product, stock
from .test_websocket import by_name, master, ws  # noqa: F401

TODAY = date(2026, 10, 20)


def opened(conn, packages=2):
    """An opened batch of a product (packages in stock incl. the opened one) -> (product, batch)."""
    p = product(conn)
    b = inv.book_in(conn, p, packages, "2027-01-01", loc(conn))
    return p, inv.open_package(conn, p, b, today=TODAY)["batch_id"]


def level(conn, batch):
    return conn.execute("SELECT remaining FROM batch WHERE id = ?", (batch,)).fetchone()[0]


def test_set_same_level_and_undo(conn):
    _, b = opened(conn)
    res = inv.set_remaining(conn, b, 0.5)
    row = conn.execute("SELECT * FROM booking WHERE id = ?", (res["booking_id"],)).fetchone()
    assert (level(conn, b), row["kind"], row["packages"], row["remaining"]) == (
        0.5,
        "remaining",
        0,
        1,
    )
    assert inv.set_remaining(conn, b, 0.5)["booking_id"] is None  # nothing changed, nothing logged
    inv.undo_remaining(conn, res["booking_id"])
    assert level(conn, b) == 1
    with pytest.raises(InventoryError) as e:
        inv.undo_remaining(conn, res["booking_id"])
    assert e.value.translation_key == "already_undone"


def test_empty_books_out_and_put_back_restores_level(conn):
    _p, b = opened(conn, 3)  # 1 opened + 2 unopened
    inv.set_remaining(conn, b, 0.5)
    before = stock(conn)
    res = inv.set_remaining(conn, b, 0)
    assert res["kind"] == "out" and level(conn, b) == 1
    assert sum(stock(conn).values()) == sum(before.values()) - 1
    inv.put_back(conn, [res["taken"][0]["booking_id"]])
    assert stock(conn) == before and level(conn, b) == 0.5


def test_one_partly_used_package_the_rest_stay_full(conn):
    p, b = opened(conn, 3)
    inv.book_in(conn, p, 1, "2027-01-01", loc(conn))
    inv.open_package(conn, p, today=TODAY)  # same day: merges, the level stays
    inv.set_remaining(conn, b, 0.5)
    inv.set_remaining(conn, b, 0)
    assert level(conn, b) == 1 and sum(stock(conn).values()) == 3  # one left package counts as full


def test_book_out_takes_the_partly_used_package_first(conn):
    p, b = opened(conn, 2)
    inv.set_remaining(conn, b, 0.25)
    (taken,) = inv.book_out(conn, p, 1)
    assert taken["batch_id"] == b and level(conn, b) == 1  # not the earlier unopened batch


def test_errors_and_stale_level(conn):
    p, b = opened(conn, 2)
    unopened = inv.book_in(conn, p, 1, "2028-01-01", loc(conn))
    for batch, value, key in (
        (unopened, 0.5, "not_found"),
        (b, 1.5, "invalid_value"),
        (b, -1, "invalid_value"),
    ):
        with pytest.raises(InventoryError) as e:
            inv.set_remaining(conn, batch, value)
        assert e.value.translation_key == key
    inv.set_remaining(conn, b, 0.5)
    conn.execute("DELETE FROM stock WHERE batch_id = ?", (b,))  # emptied by other means
    inv.open_package(conn, p, today=TODAY)
    assert level(conn, b) == 1


def test_edit_stock_and_move_keep_the_level(conn):
    _p, b = opened(conn, 2)
    inv.set_remaining(conn, b, 0.5)
    other = loc(conn, "Vorratsschrank")
    inv.move(conn, b, loc(conn), other, 1)
    assert level(conn, b) == 0.5
    target = inv.edit_stock(conn, b, other, "2027-02-02", 1)
    assert target != b and level(conn, target) == 0.5


def test_edit_stock_into_an_empty_batch_copies_the_level_not_a_stale_one(conn):
    p = product(conn)
    where = loc(conn)
    u1 = inv.book_in(conn, p, 1, "2027-01-01", where)
    u2 = inv.book_in(conn, p, 1, "2027-06-01", where)
    b1 = inv.open_package(conn, p, u1, today=TODAY)["batch_id"]
    b2 = inv.open_package(conn, p, u2, today=TODAY)["batch_id"]
    inv.set_remaining(conn, b1, 0.5)
    target = inv.edit_stock(conn, b1, where, "2030-01-01", 1)
    inv.set_remaining(conn, target, 0.25)
    inv.correct(conn, target, where, 0)  # empty, keeps a stale level
    assert inv.edit_stock(conn, b2, where, "2030-01-01", 1) == target
    assert level(conn, target) == 1


def test_migration_28(monkeypatch):
    c = db.connect(":memory:")
    with monkeypatch.context() as m:  # seeded DB of version 27
        m.setattr(db, "MIGRATIONS", db.MIGRATIONS[:27])
        db.migrate(c)
    cat = c.execute("SELECT id FROM category LIMIT 1").fetchone()[0]
    c.executescript(  # old shape: no remaining columns
        f"INSERT INTO product (id, name, category_id, updated_at) VALUES (1, 'Reis', {cat}, 't');"
        "INSERT INTO batch (id, product_id, created_at) VALUES (1, 1, 't');"
        "INSERT INTO booking (ts, kind, batch_id, packages, source) VALUES ('t', 'in', 1, 1, 'x');"
    )
    db.migrate(c)
    assert c.execute("PRAGMA user_version").fetchone()[0] == len(db.MIGRATIONS)
    assert c.execute("SELECT remaining FROM batch").fetchone()[0] == 1
    assert c.execute("SELECT remaining FROM booking").fetchone()[0] is None
    c.execute(
        "INSERT INTO booking (ts, kind, batch_id, packages, source, remaining)"
        " VALUES ('t', 'remaining', 1, 0, 'x', 0.5)"
    )
    assert c.execute("PRAGMA foreign_key_check").fetchall() == []


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
    msg = {
        "type": "home_inventory/remaining",
        "batch_id": op["result"]["batch_id"],
        "location_id": fridge,
    }
    half = await ws.call({**msg, "remaining": 0.5})
    assert half["result"]["kind"] == "remaining" and half["result"]["booking_id"]
    empty = await ws.call({**msg, "remaining": 0})
    assert empty["result"]["kind"] == "out" and empty["result"]["taken"][0]["packages"] == 1
    assert (await ws.call({**msg, "remaining": 2}))["success"] is False
