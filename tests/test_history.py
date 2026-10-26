"""Booking history: action stamp, history view, undo of a whole action."""

from datetime import date
from functools import partial

import pytest

from custom_components.home_inventory import db
from custom_components.home_inventory import inventory as inv
from custom_components.home_inventory.inventory import InventoryError

from .test_cooked import pasta
from .test_inventory import loc, product, stock
from .test_websocket import ws  # noqa: F401

TODAY = date(2026, 10, 20)


def act(conn, fn, *args, **kw):
    """One write call the way Database.run does it (commit + action stamp)."""
    d = db.Database(None, "")
    d._conn = conn
    return d._run(partial(fn, **kw) if kw else fn, args)[0]


def actions(conn, **kw):
    return inv.history(conn, **kw)["actions"]


def test_migration_31_backfills_action_id(monkeypatch) -> None:
    c = db.connect(":memory:")
    with monkeypatch.context() as m:  # seeded DB of version 30
        m.setattr(db, "MIGRATIONS", db.MIGRATIONS[:30])
        db.migrate(c)
    inv.book_in(c, product(c), 1, None, loc(c))
    inv.book_in(c, product(c), 1, None, loc(c))
    c.commit()
    db.migrate(c)
    assert c.execute("SELECT count(*) FROM booking WHERE action_id = id").fetchone()[0] == 2


def test_stamp_groups_one_call(conn) -> None:
    p = pasta(conn)
    b = act(conn, inv.book_in, p, 3, "2027-01-01", loc(conn))
    item = {"product_id": p, "packages": 1, "action": "out", "open": 1, "remaining": 0.8}
    act(conn, inv.book_cooked, [item], today=TODAY)
    rows = conn.execute("SELECT id, action_id FROM booking ORDER BY id").fetchall()
    assert rows[0]["action_id"] == b and len(rows) >= 4  # in; out + open + level
    cooked = {r["action_id"] for r in rows[1:]}
    assert cooked == {rows[1]["id"]}  # one action id: its first row


def test_history_hides_helper_rows_and_marks_undone(conn) -> None:
    p = product(conn)
    fridge, shelf = loc(conn), loc(conn, "Vorratsschrank")
    b = act(conn, inv.book_in, p, 2, "2027-01-01", fridge, user_id="u1")
    act(conn, inv.move, b, fridge, shelf, 1)
    (newest, first) = actions(conn)
    assert (first["user_id"], len(first["rows"])) == ("u1", 1)
    row = newest["rows"][0]
    assert (row["kind"], row["location"], row["to_location"]) == (
        "move",
        "Kühlschrank",
        "Vorratsschrank",
    )
    act(conn, inv.undo_action, newest["action_id"], user_id="u2")
    (newest, _) = actions(conn)  # undo rows stay hidden
    assert (newest["undone_by"], newest["partly"], newest["rows"][0]["undone_at"]) == (
        "u2", False, newest["undone_at"],
    )  # fmt: skip
    assert stock(conn) == {(b, fridge): 2}
    with pytest.raises(InventoryError, match="already_undone"):
        inv.undo_action(conn, newest["action_id"])


def test_partly_undone_and_rest(conn) -> None:
    p = product(conn)
    inv.book_in(conn, p, 1, "2027-01-01", loc(conn))
    b2 = inv.book_in(conn, p, 1, "2027-03-03", loc(conn))
    act(conn, inv.book_out, p, 2)  # two batches: two 'out' rows in one action
    last = actions(conn)[0]
    assert len(last["rows"]) == 2
    act(conn, inv.put_back, [last["rows"][0]["id"]])
    last = actions(conn)[0]
    assert last["partly"] and last["undone_at"] is None
    act(conn, inv.undo_action, last["action_id"])  # only the rest
    assert actions(conn)[0]["undone_at"] and not actions(conn)[0]["partly"]
    assert stock(conn)[(b2, loc(conn))] == 1


def test_blocked_undo_changes_nothing(conn) -> None:
    p = product(conn, "Reis", "Reis")
    act(conn, inv.book_in, p, 2, "2027-01-01", loc(conn))
    act(conn, inv.book_out, p, 2)
    book_in = actions(conn)[1]["action_id"]
    before = stock(conn)
    with pytest.raises(InventoryError, match="undo_blocked") as err:
        act(conn, inv.undo_action, book_in)  # nothing left to take back
    assert err.value.placeholders == {"name": "Reis"}
    assert stock(conn) == before


def test_cooked_and_edit_stock_undo(conn) -> None:
    p = pasta(conn)
    b = inv.book_in(conn, p, 3, "2027-01-01", loc(conn))
    inv.open_package(conn, p, b, today=TODAY)
    before = stock(conn)
    item = {"product_id": p, "packages": 1, "action": "out", "open": 1, "remaining": 0.8}
    res = act(conn, inv.book_cooked, [item], today=TODAY)
    act(conn, inv.undo_action, actions(conn)[0]["action_id"])
    assert stock(conn) == before
    with pytest.raises(InventoryError):  # the old cooked undo is now already undone
        inv.undo_cooked(conn, res["out_ids"], res["open_ids"], remaining_ids=res["remaining_ids"])
    # edit stock with a date change
    q = product(conn, "Reis", "Reis")
    rb = inv.book_in(conn, q, 2, "2027-01-01", loc(conn))
    before = stock(conn)
    act(conn, inv.edit_stock, rb, loc(conn), "2028-01-01", 3)
    assert stock(conn) != before
    act(conn, inv.undo_action, actions(conn)[0]["action_id"])
    assert stock(conn) == before


def test_stocktake_and_import_undo(conn) -> None:
    p = product(conn)
    shelf = loc(conn, "Vorratsschrank")
    x = inv.book_in(conn, p, 2, "2027-01-01", shelf)
    y = inv.book_in(conn, p, 3, "2027-06-01", shelf)
    before = stock(conn)
    act(
        conn,
        inv.stocktake_apply,
        shelf,
        [{"batch_id": x, "packages": 1}, {"batch_id": y, "packages": 5}],
        [],
    )
    a = actions(conn)[0]
    assert len(a["rows"]) == 2
    act(conn, inv.undo_action, a["action_id"])
    assert stock(conn) == before
    act(
        conn, inv.import_csv, "stock", "name;location;packages\r\nSpaghetti;Kühlschrank;2\r\n", True
    )
    assert stock(conn) != before
    act(conn, inv.undo_action, actions(conn)[0]["action_id"])
    assert stock(conn) == before


def test_filters_and_paging(conn) -> None:
    a, r = product(conn), product(conn, "Reis", "Reis")
    act(conn, inv.book_in, a, 1, None, loc(conn), user_id="u1")
    act(conn, inv.book_in, r, 1, None, loc(conn), user_id="u2")
    assert [x["rows"][0]["name"] for x in actions(conn, name="rei")] == ["Reis"]
    assert [x["user_id"] for x in actions(conn, user_id="u1")] == ["u1"]
    assert actions(conn, ts_from="9999-01-01") == [] and len(actions(conn, ts_to="9999-01-01")) == 2
    for _ in range(100):
        act(conn, inv.book_in, a, 1, None, loc(conn))
    page = inv.history(conn)
    assert (len(page["actions"]), page["more"]) == (100, True)
    assert len(inv.history(conn, offset=100)["actions"]) == 2


async def test_websocket(ws) -> None:  # noqa: F811
    book = {"type": "home_inventory/book_in", "packages": 1, "location_id": 1}
    product = {"name": "Spaghetti", "category_id": 1}
    pid = (await ws.call({**book, "product": product}))["result"]["product_id"]
    res = (await ws.call({"type": "home_inventory/history", "name": "spag"}))["result"]
    assert [a["rows"][0]["name"] for a in res["actions"]] == ["Spaghetti"] and res["users"]
    msg = {"type": "home_inventory/history_undo", "action_id": res["actions"][0]["action_id"]}
    assert (await ws.call(msg))["success"]
    assert (await ws.call(msg))["error"]["translation_key"] == "already_undone"
    stock = (await ws.call({"type": "home_inventory/stock", "product_id": pid}))["result"]
    assert stock == []
    res = (await ws.call({"type": "home_inventory/history", "date_from": "2020-01-01"}))["result"]
    assert res["actions"][0]["undone_at"]
