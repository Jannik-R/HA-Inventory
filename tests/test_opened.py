"""Opened packages: own batch with opened_on, effective expiry (inherited opened_days), FEFO,
labels, undo, service by code; migration 20 keeps batches and bookings."""

import sqlite3
from datetime import date

import pytest

from custom_components.home_inventory import db
from custom_components.home_inventory import inventory as inv
from custom_components.home_inventory.inventory import InventoryError
from tests.test_inventory import cat, loc, product, stock

TODAY = date(2026, 10, 18)
EAN = "4006040053026"


def err_key(call) -> str:
    with pytest.raises(InventoryError) as err:
        call()
    return err.value.translation_key


def test_open_moves_one_package_to_an_opened_batch(conn) -> None:
    milk = product(conn, "Milch", "Milch", ean=EAN)
    inv.save(conn, "category", {"id": cat(conn, "Milch"), "opened_days": 3})
    b = inv.book_in(conn, milk, 3, "2026-11-30", loc(conn))
    res = inv.open_package(conn, milk, b, loc(conn), today=TODAY)
    assert (res["expires_on"], res["name"], res["location"]) == (
        "2026-10-21",
        "Milch",
        "Kühlschrank",
    )
    opened = res["batch_id"]
    assert stock(conn) == {(b, loc(conn)): 2, (opened, loc(conn)): 1}
    row = conn.execute("SELECT * FROM booking ORDER BY id DESC").fetchone()
    assert (row["kind"], row["batch_id"], row["packages"]) == ("open", opened, 1)
    # a second one the same day joins the opened batch; an opened one cannot be opened again
    assert inv.open_package(conn, milk, today=TODAY)["batch_id"] == opened
    assert err_key(lambda: inv.open_package(conn, milk, opened, today=TODAY)) == "already_opened"
    rows = {r["batch_id"]: r for r in inv.stock_list(conn)}
    assert (rows[opened]["expires_on"], rows[opened]["batch_expires_on"]) == (
        "2026-10-21",
        "2026-11-30",
    )
    assert rows[opened]["opened_on"] == "2026-10-18" and rows[b]["opened_on"] is None
    # opened packages count toward the stock; book-in never merges into them
    assert inv.book_in(conn, milk, 1, "2026-11-30", loc(conn)) == b
    assert inv.expiring(conn, TODAY)[0]["batch_id"] == opened  # 3 days left <= warn days
    # the earlier effective date goes first, although the batch date is the same
    assert inv.book_out(conn, milk, 1)[0]["batch_id"] == opened


def test_effective_expiry_inherits_and_keeps_the_earlier_date(conn) -> None:
    pasta = product(conn)  # Nudeln: no opened_days, opening changes nothing
    b = inv.book_in(conn, pasta, 2, "2027-01-01", loc(conn))
    assert inv.open_package(conn, pasta, b, today=TODAY)["expires_on"] == "2027-01-01"
    inv.save(conn, "product", {"id": pasta, "opened_days": 30})  # own value, computed on read
    assert {r["expires_on"] for r in inv.stock_list(conn)} == {"2027-01-01", "2026-11-17"}
    inv.save(conn, "product", {"id": pasta, "opened_days": 365})  # never later than the batch
    assert {r["expires_on"] for r in inv.stock_list(conn)} == {"2027-01-01"}
    jam = product(conn, "Marmelade ohne Datum", "Marmelade & Gelee", opened_days=28)
    inv.book_in(conn, jam, 1, None, loc(conn))
    assert inv.open_package(conn, jam, today=TODAY)["expires_on"] == "2026-11-15"
    assert inv.effective(conn, jam)["opened_days"] == {"value": 28, "source": "own"}


def test_undo_open_closes_it_once(conn) -> None:
    milk = product(conn, "Milch", "Milch")
    b = inv.book_in(conn, milk, 1, "2026-11-30", loc(conn))
    res = inv.open_package(conn, milk, today=TODAY)
    inv.undo_open(conn, res["booking_id"])
    assert stock(conn) == {(b, loc(conn)): 1}
    last = conn.execute("SELECT * FROM booking ORDER BY id DESC").fetchone()
    assert (last["kind"], last["packages"], last["reverts_id"]) == ("open", -1, res["booking_id"])
    assert err_key(lambda: inv.undo_open(conn, res["booking_id"])) == "already_undone"
    again = inv.open_package(conn, milk, today=TODAY)
    inv.book_out(conn, milk, 1)  # used up meanwhile: nothing to close
    assert err_key(lambda: inv.undo_open(conn, again["booking_id"])) == "not_enough_stock"
    assert err_key(lambda: inv.open_package(conn, milk, today=TODAY)) == "not_enough_stock"


def test_labels_and_codes(conn) -> None:
    milk = product(conn, "Milch", "Milch", ean=EAN, opened_days=3)
    b = inv.book_in(conn, milk, 2, "2026-11-30", loc(conn))
    res = inv.open_code(conn, f"{EAN}:2026-11-30", TODAY)
    info = inv.label_info(conn, res["batch_id"])
    # the new label prints the effective date; the code keeps the batch key
    assert (info["expires_on"], info["code"]) == ("2026-10-21", f"PTRY:{EAN}:2026-11-30")
    # a scan takes the opened package of that key first
    assert inv.book_out_code(conn, info["code"][5:])["taken"][0]["batch_id"] == res["batch_id"]
    assert inv.book_out_code(conn, info["code"][5:])["taken"][0]["batch_id"] == b
    assert err_key(lambda: inv.open_code(conn, f"{EAN}:2026-11-30", TODAY)) == "not_enough_stock"
    assert err_key(lambda: inv.open_code(conn, f"{EAN}:2030-01-01", TODAY)) == "not_found"
    # service: EAN (earliest expiry first, location by name) or label code
    inv.book_in(conn, milk, 1, "2026-12-31", loc(conn, "Vorratsschrank"))
    res = inv.open_by_code(conn, EAN, TODAY, "vorratsschrank", "u1")
    assert res["location"] == "Vorratsschrank"
    row = conn.execute("SELECT source, user_id FROM booking ORDER BY id DESC").fetchone()
    assert tuple(row) == ("service", "u1")
    assert (
        err_key(lambda: inv.open_by_code(conn, f"PTRY:{EAN}:", TODAY, "Keller")) == "invalid_value"
    )
    assert err_key(lambda: inv.open_by_code(conn, "12345678", TODAY)) == "product_unknown"


def test_opened_jar_of_a_charge(conn) -> None:
    pid = product(conn, "Apfelmus", "Obst & Kompott", opened_days=14)
    c = inv.save_canning(
        conn,
        {"made_on": "2026-10-01", "jars": 3, "expires_on": "2027-10-01", "product_id": pid},
    )
    code = inv.label_info(conn, c["batch_id"])["code"][5:]
    opened = inv.open_code(conn, code, TODAY)
    assert opened["expires_on"] == "2026-11-01"
    rows = inv.cannings(conn)
    assert [(r["batch_id"], r["in_stock"]) for r in rows] == [(c["batch_id"], 3)]
    assert inv.label_info(conn, opened["batch_id"])["code"] == f"PTRY:{code}"
    # editing the charge date moves its opened jar too; the opened jar stays opened
    inv.edit_stock(conn, opened["batch_id"], opened["location_id"], "2027-12-01", 1)
    dates = {r["batch_id"]: r["batch_expires_on"] for r in inv.stock_list(conn)}
    assert dates == {c["batch_id"]: "2027-12-01", opened["batch_id"]: "2027-12-01"}
    assert inv.book_out_code(conn, code)["taken"][0]["batch_id"] == opened["batch_id"]


def test_edit_stock_keeps_an_opened_package_opened(conn) -> None:
    milk = product(conn, "Milch", "Milch")
    inv.book_in(conn, milk, 1, "2026-11-30", loc(conn))
    opened = inv.open_package(conn, milk, today=TODAY)["batch_id"]
    target = inv.edit_stock(conn, opened, loc(conn), "2026-12-05", 1)
    assert conn.execute("SELECT opened_on FROM batch WHERE id = ?", (target,)).fetchone()[0] == (
        "2026-10-18"
    )


def test_defaults_take_opened_days(conn) -> None:
    d = inv.defaults(conn)
    inv.save_defaults(conn, {**d, "opened_days": 5})
    assert inv.effective(conn, product(conn))["opened_days"] == {"value": 5, "source": "default"}


def test_migration_20_keeps_batches_and_bookings(tmp_path, monkeypatch) -> None:
    full = db.MIGRATIONS
    monkeypatch.setattr(db, "MIGRATIONS", full[:19])
    monkeypatch.setattr(db, "fill_days", lambda conn: None)  # no opened_days column yet
    c = db.connect(str(tmp_path / "old.db"))
    db.migrate(c)
    c.executescript(
        """
        INSERT INTO product (id, name, category_id, updated_at) VALUES (1, 'Apfelmus', 1, 'x');
        INSERT INTO canning (id, made_on, seq, product_id, jars) VALUES (1, '2026-10-01', 1, 1, 2);
        INSERT INTO batch (id, product_id, expires_on, created_at, canning_id)
            VALUES (7, 1, '2027-10-01', 'x', 1), (8, 1, NULL, 'x', NULL);
        INSERT INTO stock (batch_id, location_id, packages) VALUES (7, 1, 2), (8, 1, 1);
        INSERT INTO booking (id, ts, kind, batch_id, location_id, packages, source)
            VALUES (1, 'x', 'out', 8, 1, 1, 'panel');
        INSERT INTO booking (id, ts, kind, batch_id, location_id, packages, source, reverts_id)
            VALUES (2, 'x', 'in', 8, 1, 1, 'undo', 1);
        """
    )
    c.commit()
    monkeypatch.setattr(db, "MIGRATIONS", full)
    db.migrate(c)
    assert c.execute("PRAGMA user_version").fetchone()[0] == len(full)
    assert c.execute("PRAGMA foreign_key_check").fetchall() == []
    batches = [tuple(r) for r in c.execute("SELECT id, canning_id, opened_on FROM batch")]
    assert batches == [(7, 1, None), (8, None, None)]
    assert [tuple(r) for r in c.execute("SELECT id, reverts_id FROM booking")] == [
        (1, None),
        (2, 1),
    ]
    opened = inv.open_package(c, 1, 7, today=TODAY)  # a charge may now have a second batch
    assert opened["batch_id"] not in (7, 8)
    with pytest.raises(sqlite3.IntegrityError):  # still undone once only
        c.execute(
            "INSERT INTO booking (ts, kind, batch_id, packages, source, reverts_id)"
            " VALUES ('x', 'in', 8, 1, 'undo', 1)"
        )
