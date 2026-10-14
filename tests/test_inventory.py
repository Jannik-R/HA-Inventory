"""Inventory logic on an in-memory database (seed included), no HA needed."""

from datetime import date

import pytest

from custom_components.pantry import db
from custom_components.pantry import inventory as inv


def cat(conn, name):
    return conn.execute("SELECT id FROM category WHERE name = ?", (name,)).fetchone()[
        "id"
    ]


def unit(conn, name):
    return conn.execute("SELECT id FROM unit WHERE name = ?", (name,)).fetchone()["id"]


def loc(conn, name="Kühlschrank"):
    return conn.execute("SELECT id FROM location WHERE name = ?", (name,)).fetchone()[
        "id"
    ]


def product(conn, name="Spaghetti", category="Nudeln", **kw):
    return inv.save(
        conn, "product", {"name": name, "category_id": cat(conn, category), **kw}
    )


def stock(conn):
    return {
        (r["batch_id"], r["location_id"]): r["packages"]
        for r in conn.execute("SELECT * FROM stock")
    }


def test_migrate_idempotent(conn):
    version = conn.execute("PRAGMA user_version").fetchone()[0]
    count = conn.execute("SELECT COUNT(*) FROM category").fetchone()[0]
    db.migrate(conn)
    assert (
        conn.execute("PRAGMA user_version").fetchone()[0]
        == version
        == len(db.MIGRATIONS)
    )
    assert conn.execute("SELECT COUNT(*) FROM category").fetchone()[0] == count > 0


def test_book_in_merges_batches(conn):
    p = product(conn)
    a = inv.book_in(conn, p, 1, "2027-01-01", location_id=loc(conn))
    b = inv.book_in(conn, p, 2, date(2027, 1, 1), location_id=loc(conn))
    assert a == b
    assert stock(conn) == {(a, loc(conn)): 3}
    with pytest.raises(inv.InventoryError, match="location_required"):
        inv.book_in(conn, p, 1)


def test_book_out_fefo_across_batches_and_locations(conn):
    p = product(conn)
    late = inv.book_in(conn, p, 2, "2027-06-01", location_id=loc(conn))
    none = inv.book_in(conn, p, 1, None, location_id=loc(conn))
    early = inv.book_in(
        conn, p, 1, "2027-01-01", location_id=loc(conn, "Vorratsschrank")
    )
    taken = inv.book_out(conn, p, 4)
    assert [(t["batch_id"], t["packages"]) for t in taken] == [
        (early, 1),
        (late, 2),
        (none, 1),
    ]
    assert stock(conn) == {}


def test_not_enough_stock_changes_nothing(conn):
    p = product(conn)
    inv.book_in(conn, p, 2, "2027-01-01", location_id=loc(conn))
    before = stock(conn)
    with pytest.raises(inv.InventoryError) as err:
        inv.book_out(conn, p, 3)
    assert err.value.translation_key == "not_enough_stock"
    assert err.value.placeholders == {"available": 2}
    assert stock(conn) == before


def test_correct_to_zero_deletes_row(conn):
    p = product(conn)
    b = inv.book_in(conn, p, 2, "2027-01-01", location_id=loc(conn))
    inv.correct(conn, b, loc(conn), 0)
    assert stock(conn) == {}
    last = conn.execute(
        "SELECT kind, packages FROM booking ORDER BY id DESC"
    ).fetchone()
    assert (last["kind"], last["packages"]) == ("correct", -2)


def test_move(conn):
    p = product(conn)
    b = inv.book_in(conn, p, 2, "2027-01-01", location_id=loc(conn))
    inv.move(conn, b, loc(conn), loc(conn, "Vorratsschrank"), 1)
    assert stock(conn) == {(b, loc(conn)): 1, (b, loc(conn, "Vorratsschrank")): 1}


def test_effective_sources(conn):
    milk = cat(conn, "Milch")
    dairy = cat(conn, "Milchprodukte & Eier")
    p = product(conn, "Hafermilch", "Milch", warn_days=5)
    e = inv.effective(conn, p)
    assert e["warn_days"] == {"value": 5, "source": "own"}
    assert e["expiry_type"] == {"value": "use_by", "source": dairy}  # from parent
    inv.save(conn, "category", {"id": milk, "warn_days": 4})
    assert inv.effective(conn, category_id=milk)["warn_days"] == {
        "value": 4,
        "source": "own",
    }
    e = inv.effective(conn, product(conn, "Vollmilch", "Milch"))
    assert e["warn_days"] == {"value": 4, "source": milk}
    assert (
        inv.effective(conn, category_id=cat(conn, "Nudeln"))["warn_days"]["source"]
        == "default"
    )


def test_expiring_with_and_without_override(conn):
    p = product(conn, category="Gemüse")  # warn 2 d from Obst & Gemüse
    inv.book_in(conn, p, 1, "2026-10-12", location_id=loc(conn))  # expired
    inv.book_in(conn, p, 1, "2026-10-16", location_id=loc(conn))  # 2 days
    inv.book_in(conn, p, 1, "2026-10-20", location_id=loc(conn))  # 6 days
    today = date(2026, 10, 14)
    got = inv.expiring(conn, today)
    assert [(r["status"], r["days_left"]) for r in got] == [
        ("expired", -2),
        ("soon", 2),
    ]
    assert len(inv.expiring(conn, today, days=10)) == 3


def test_shopping_list_nested_min_stock(conn):
    kg, g = unit(conn, "kg"), unit(conn, "g")
    nudeln, reis, parent = (
        cat(conn, "Nudeln"),
        cat(conn, "Reis"),
        cat(conn, "Nudeln, Reis & Getreide"),
    )
    inv.save(conn, "category", {"id": nudeln, "min_stock": 1})
    inv.save(conn, "category", {"id": reis, "min_stock": 500, "unit_id": g})
    inv.save(conn, "category", {"id": parent, "min_stock": 2})
    for name, category, grams in (
        ("Spaghetti", "Nudeln", 500),
        ("Couscous", "Couscous", 300),
    ):
        p = product(conn, name, category, content_amount=grams, content_unit_id=g)
        inv.book_in(conn, p, 1, location_id=loc(conn))
    items = {i["name"]: i for i in inv.shopping_list(conn)}
    assert items["Nudeln"]["missing"] == pytest.approx(0.5)
    assert items["Nudeln"]["unit_id"] == kg
    assert items["Reis"]["missing"] == pytest.approx(500)
    top = items["Nudeln, Reis & Getreide"]
    assert top["missing"] == pytest.approx(0.2)
    assert top["any_of_subtree"] and not items["Nudeln"]["any_of_subtree"]


def test_delete_product_with_stock_is_in_use(conn):
    p = product(conn)
    inv.book_in(conn, p, 1, location_id=loc(conn))
    with pytest.raises(inv.InventoryError, match="in_use"):
        inv.delete(conn, "product", p)


def test_category_parent_must_not_be_in_own_subtree(conn):
    parent, child = cat(conn, "Nudeln, Reis & Getreide"), cat(conn, "Nudeln")
    with pytest.raises(inv.InventoryError, match="invalid_parent"):
        inv.save(conn, "category", {"id": parent, "parent_id": child})


def test_book_in_rejects_bad_date_and_unknown_location(conn):
    p = product(conn)
    with pytest.raises(inv.InventoryError, match="invalid_date"):
        inv.book_in(conn, p, 1, "31.12.2027", location_id=loc(conn))
    with pytest.raises(inv.InventoryError, match="not_found"):
        inv.book_in(conn, p, 1, location_id=999)


def test_unit_base_rules(conn):
    g, kg = unit(conn, "g"), unit(conn, "kg")
    with pytest.raises(inv.InventoryError, match="invalid_unit"):
        inv.save(
            conn, "unit", {"name": "x", "symbol": "x", "base_unit_id": kg, "factor": 1}
        )
    with pytest.raises(inv.InventoryError, match="invalid_unit"):
        inv.save(
            conn, "unit", {"id": g, "base_unit_id": unit(conn, "ml")}
        )  # g is a base already
    with pytest.raises(inv.InventoryError, match="invalid_unit"):
        inv.save(conn, "unit", {"name": "y", "symbol": "y"})  # factor required
