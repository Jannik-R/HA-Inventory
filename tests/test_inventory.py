"""Inventory logic on an in-memory database (seed included), no HA needed."""

import sqlite3
from datetime import date

import pytest

from custom_components.pantry import db
from custom_components.pantry import inventory as inv
from custom_components.pantry.inventory.inherit import category_tags, set_tags


def cat(conn, name):
    return conn.execute("SELECT id FROM category WHERE name = ?", (name,)).fetchone()["id"]


def unit(conn, name):
    return conn.execute("SELECT id FROM unit WHERE name = ?", (name,)).fetchone()["id"]


def loc(conn, name="Kühlschrank"):
    return conn.execute("SELECT id FROM location WHERE name = ?", (name,)).fetchone()["id"]


def product(conn, name="Spaghetti", category="Nudeln", **kw):
    return inv.save(conn, "product", {"name": name, "category_id": cat(conn, category), **kw})


def stock(conn):
    return {
        (r["batch_id"], r["location_id"]): r["packages"]
        for r in conn.execute("SELECT * FROM stock")
    }


def test_migrate_idempotent(conn):
    version = conn.execute("PRAGMA user_version").fetchone()[0]
    count = conn.execute("SELECT COUNT(*) FROM category").fetchone()[0]
    db.migrate(conn)
    assert conn.execute("PRAGMA user_version").fetchone()[0] == version == len(db.MIGRATIONS)
    assert conn.execute("SELECT COUNT(*) FROM category").fetchone()[0] == count > 0


def test_book_in_merges_batches(conn):
    p = product(conn)
    a = inv.book_in(conn, p, 1, "2027-01-01", location_id=loc(conn))
    b = inv.book_in(conn, p, 2, date(2027, 1, 1), location_id=loc(conn))
    assert a == b
    assert stock(conn) == {(a, loc(conn)): 3}
    inv.book_in(conn, p, 1)  # location from the category (seed: Vorratsschrank)
    inv.save(conn, "category", {"name": "Ohne Ort"})
    nowhere = product(conn, name="Irgendwas", category="Ohne Ort")
    with pytest.raises(inv.InventoryError, match="location_required"):
        inv.book_in(conn, nowhere, 1)


def test_book_out_fefo_across_batches_and_locations(conn):
    p = product(conn)
    late = inv.book_in(conn, p, 2, "2027-06-01", location_id=loc(conn))
    none = inv.book_in(conn, p, 1, None, location_id=loc(conn))
    early = inv.book_in(conn, p, 1, "2027-01-01", location_id=loc(conn, "Vorratsschrank"))
    taken = inv.book_out(conn, p, 4)
    assert [(t["batch_id"], t["packages"]) for t in taken] == [
        (early, 1),
        (late, 2),
        (none, 1),
    ]
    assert stock(conn) == {}


def ids(taken):
    return [t["booking_id"] for t in taken]


def test_put_back_undoes_book_out_once(conn):
    p = product(conn)
    inv.book_in(conn, p, 2, "2027-06-01", location_id=loc(conn))
    inv.book_in(conn, p, 1, "2027-01-01", location_id=loc(conn, "Vorratsschrank"))
    before = stock(conn)
    taken = inv.book_out(conn, p, 2)  # spans both batches; one is gone meanwhile
    assert all(t["booking_id"] for t in taken)
    inv.put_back(conn, ids(taken))
    assert stock(conn) == before
    kinds = [r[0] for r in conn.execute("SELECT kind FROM booking ORDER BY id")]
    assert kinds == ["in", "in", "out", "out", "in", "in"]
    assert (
        conn.execute("SELECT COUNT(*) FROM booking WHERE reverts_id IS NOT NULL").fetchone()[0] == 2
    )
    for bad, key in (
        (ids(taken), "already_undone"),
        ([999], "not_found"),
        ([1], "not_found"),
    ):  # 1 is an 'in'
        with pytest.raises(inv.InventoryError) as err:
            inv.put_back(conn, bad)
        assert err.value.translation_key == key
    assert stock(conn) == before


def test_put_back_all_or_nothing_and_deactivated_location(conn):
    p, fridge = product(conn), loc(conn)
    inv.book_in(conn, p, 1, "2027-01-01", location_id=fridge)
    a = inv.book_out(conn, p, 1)
    inv.delete(conn, "location", fridge)  # empty now: deactivated
    b = inv.book_in(conn, p, 1, location_id=loc(conn, "Vorratsschrank"))
    inv.put_back(conn, ids(a))  # restores into the deactivated location, which is active again
    assert stock(conn)[(a[0]["batch_id"], fridge)] == 1
    assert fridge in [r["id"] for r in inv.list_rows(conn, "location")]
    with pytest.raises(inv.InventoryError):  # second id fails: the first is not applied either
        conn.execute("SAVEPOINT t")
        try:
            inv.put_back(conn, [*ids(inv.book_out(conn, p, 1)), ids(a)[0]])
        finally:
            conn.execute("ROLLBACK TO t")
    assert sum(stock(conn).values()) == 2 and b


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
    last = conn.execute("SELECT kind, packages FROM booking ORDER BY id DESC").fetchone()
    assert (last["kind"], last["packages"]) == ("correct", -2)


def test_move(conn):
    p = product(conn)
    b = inv.book_in(conn, p, 2, "2027-01-01", location_id=loc(conn))
    inv.move(conn, b, loc(conn), loc(conn, "Vorratsschrank"), 1)
    assert stock(conn) == {(b, loc(conn)): 1, (b, loc(conn, "Vorratsschrank")): 1}


def test_edit_stock_date_count_and_merge(conn):
    p, fridge, shelf = product(conn), loc(conn), loc(conn, "Vorratsschrank")
    wrong = inv.book_in(conn, p, 2, "2072-01-01", location_id=fridge)
    inv.book_in(conn, p, 1, "2072-01-01", location_id=shelf)
    right = inv.book_in(conn, p, 1, "2027-01-01", location_id=fridge)
    # Date fix at one location: merges into the existing batch there, other location keeps its batch.
    assert inv.edit_stock(conn, wrong, fridge, "2027-01-01", 2) == right
    assert stock(conn) == {(wrong, shelf): 1, (right, fridge): 3}
    # Same batch: only the count changes.
    assert inv.edit_stock(conn, right, fridge, "2027-01-01", 1) == right
    assert stock(conn) == {(wrong, shelf): 1, (right, fridge): 1}
    with pytest.raises(inv.InventoryError, match="not_found"):
        inv.edit_stock(conn, wrong, fridge, None, 1)  # row is gone
    with pytest.raises(inv.InventoryError, match="invalid_date"):
        inv.edit_stock(conn, right, fridge, "2027-13-01", 1)


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
    assert inv.effective(conn, category_id=cat(conn, "Nudeln"))["warn_days"]["source"] == "default"


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
    kg, g, pkg = unit(conn, "kg"), unit(conn, "g"), unit(conn, "Packung")
    nudeln, reis, parent = (
        cat(conn, "Nudeln"),
        cat(conn, "Reis"),
        cat(conn, "Nudeln, Reis & Getreide"),
    )
    inv.save(conn, "category", {"id": nudeln, "min_stock": 1, "min_stock_unit_id": kg})
    inv.save(conn, "category", {"id": reis, "min_stock": 500, "min_stock_unit_id": g})
    inv.save(conn, "category", {"id": parent, "min_stock": 2, "min_stock_unit_id": kg})
    for name, category, grams in (
        ("Spaghetti", "Nudeln", 500),
        ("Couscous", "Couscous", 300),
    ):
        p = product(conn, name, category, content_amount=grams, content_unit_id=g)
        inv.book_in(conn, p, 1, location_id=loc(conn))
    items = {i["name"]: i for i in inv.shopping_list(conn)}
    assert items["Nudeln"]["amount"]["missing"] == pytest.approx(0.5)
    assert items["Nudeln"]["amount"]["unit_id"] == kg
    assert items["Nudeln"]["packages"] is None
    assert items["Reis"]["amount"]["missing"] == pytest.approx(500)
    top = items["Nudeln, Reis & Getreide"]
    assert top["amount"]["missing"] == pytest.approx(0.2)
    assert top["any_of_subtree"] and not items["Nudeln"]["any_of_subtree"]
    # The minimum keeps its unit when the category's (inherited) unit changes.
    inv.save(conn, "category", {"id": nudeln, "unit_id": pkg})
    assert {i["name"]: i for i in inv.shopping_list(conn)}["Nudeln"]["amount"]["unit_id"] == kg


def test_shopping_list_packages_apart_from_amount(conn):
    g = unit(conn, "g")
    nudeln, parent = cat(conn, "Nudeln"), cat(conn, "Nudeln, Reis & Getreide")
    inv.save(conn, "category", {"id": nudeln, "min_packages": 3})
    inv.save(
        conn, "category",
        {"id": parent, "min_packages": 5, "min_stock": 1000, "min_stock_unit_id": g},
    )  # fmt: skip
    p = product(conn, content_amount=500, content_unit_id=g)
    inv.book_in(conn, p, 1, location_id=loc(conn))
    inv.book_in(conn, product(conn, "Reis lose", "Reis"), 1, location_id=loc(conn))  # no content
    items = {i["name"]: i for i in inv.shopping_list(conn)}
    assert items["Nudeln"]["packages"] == 2 and items["Nudeln"]["amount"] is None
    # packages: 5 - 2 in stock - 2 missing below; amount: Nudeln has none, so no subtraction
    top = items["Nudeln, Reis & Getreide"]
    assert top["packages"] == 1
    assert top["amount"]["missing"] == pytest.approx(500)
    assert top["amount"]["unknown_products"] == 1


def test_shopping_done_holds_until_shortage_changes(conn):
    nudeln = cat(conn, "Nudeln")
    inv.save(conn, "category", {"id": nudeln, "min_packages": 3})
    inv.set_shopping_done(conn, nudeln, True)
    assert inv.shopping_list(conn)[0]["done"]
    inv.book_in(conn, product(conn), 1, location_id=loc(conn))
    assert not inv.shopping_list(conn)[0]["done"]  # 2 instead of 3 missing: open again
    inv.set_shopping_done(conn, nudeln, True)
    inv.set_shopping_done(conn, nudeln, False)
    assert not inv.shopping_list(conn)[0]["done"]


def test_shopping_product_min_packages(conn):
    g = unit(conn, "g")
    nudeln = cat(conn, "Nudeln")
    p = product(conn, "Barilla", content_amount=500, content_unit_id=g, min_packages=3)
    inv.book_in(conn, p, 1, location_id=loc(conn))
    (item,) = inv.shopping_list(conn)
    assert (item["product_id"], item["name"], item["packages"]) == (p, "Barilla", 2)
    # Its shortfall counts toward the category: 4 packages / 2 kg minus 1 in stock, 2 missing below.
    inv.save(conn, "category", {"id": nudeln, "min_packages": 4, "min_stock": 2000,
                                "min_stock_unit_id": g})  # fmt: skip
    cat_item = next(i for i in inv.shopping_list(conn) if i["product_id"] is None)
    assert cat_item["packages"] == 1 and cat_item["amount"]["missing"] == pytest.approx(500)
    assert cat_item["any_of_subtree"]
    # Checks are kept apart for product and category.
    inv.set_shopping_done(conn, None, True, product_id=p)
    done = {i["product_id"]: i["done"] for i in inv.shopping_list(conn)}
    assert done == {p: True, None: False}
    inv.book_in(conn, p, 1, location_id=loc(conn))  # shortage changes: open again
    assert not any(i["done"] for i in inv.shopping_list(conn))
    inv.book_in(conn, p, 1, location_id=loc(conn))
    assert all(i["product_id"] is None for i in inv.shopping_list(conn))


def test_delete_product_removes_stock_batches_and_bookings(conn):
    p, keep = product(conn), product(conn, name="Andere")
    inv.book_in(conn, p, 2, location_id=loc(conn))
    inv.book_out(conn, p, 1)
    inv.book_in(conn, keep, 1, location_id=loc(conn))
    inv.delete(conn, "product", p)
    count = lambda sql: conn.execute(sql).fetchone()[0]  # noqa: E731
    assert count("SELECT count(*) FROM batch") == 1
    assert count("SELECT count(*) FROM stock") == 1
    assert count("SELECT count(*) FROM booking WHERE batch_id NOT IN (SELECT id FROM batch)") == 0
    assert count("SELECT count(*) FROM booking") == 1
    with pytest.raises(inv.InventoryError, match="not_found"):
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
        inv.save(conn, "unit", {"name": "x", "symbol": "x", "base_unit_id": kg, "factor": 1})
    with pytest.raises(inv.InventoryError, match="invalid_unit"):
        inv.save(conn, "unit", {"id": g, "base_unit_id": unit(conn, "ml")})  # g is a base already
    with pytest.raises(inv.InventoryError, match="invalid_unit"):
        inv.save(conn, "unit", {"name": "y", "symbol": "y"})  # factor required


def test_stock_list_product_filter(conn):
    a, b = product(conn), product(conn, "Penne")
    inv.book_in(conn, a, 1, location_id=loc(conn))
    inv.book_in(conn, b, 1, location_id=loc(conn))
    assert [r["product_id"] for r in inv.stock_list(conn, product_id=b)] == [b]
    assert inv.stock_list(conn, product_id=b, location_id=loc(conn, "Vorratsschrank")) == []


def test_seed_gives_every_category_a_location(conn):
    md = inv.master_data(conn)
    names = {loc["id"]: loc["name"] for loc in md["locations"]}
    where = {
        c["name"]: names.get(c["effective"]["default_location_id"]["value"])
        for c in md["categories"]
    }
    assert None not in where.values()
    assert (where["Gemüse"], where["Obst"], where["Nudeln"], where["Eis"]) == (
        "Kühlschrank",
        "Vorratsschrank",
        "Vorratsschrank",
        "Gefrierschrank",
    )


def test_migration_2_merges_batches_by_date_only():
    """Batches that differed only by date type become one; stock summed, bookings repointed."""
    c = db.connect(":memory:")
    c.executescript(f"BEGIN;{db.MIGRATIONS[0]}PRAGMA user_version=1;COMMIT;")
    c.executescript(
        """
        INSERT INTO location (id, name) VALUES (1, 'L1');
        INSERT INTO category (id, name) VALUES (1, 'C1');
        INSERT INTO product (id, name, category_id, updated_at) VALUES (1, 'P', 1, 'x');
        INSERT INTO batch (id, product_id, expires_on, expiry_type, created_at) VALUES
            (1, 1, '2027-01-01', 'best_before', 'a'), (2, 1, '2027-01-01', 'use_by', 'b'),
            (3, 1, NULL, 'best_before', 'c');
        INSERT INTO stock VALUES (1, 1, 2), (2, 1, 3), (3, 1, 1);
        INSERT INTO booking (ts, kind, batch_id, location_id, packages, source)
            VALUES ('t', 'in', 2, 1, 3, 'test');
        """
    )
    db.migrate(c)
    assert [tuple(r) for r in c.execute("SELECT id, expires_on FROM batch ORDER BY id")] == [
        (1, "2027-01-01"),
        (3, None),
    ]
    assert stock(c) == {(1, 1): 5, (3, 1): 1}
    assert c.execute("SELECT batch_id FROM booking").fetchone()[0] == 1
    assert "expiry_type" not in [r[1] for r in c.execute("PRAGMA table_info(batch)")]
    assert c.execute("PRAGMA foreign_key_check").fetchall() == []


def test_migration_3_normalizes_and_cleans_up():
    """OFF tags move to their own tables (each tag once), bad rows are fixed, defaults filled."""
    c = db.connect(":memory:")
    c.executescript(f"BEGIN;{db.MIGRATIONS[0]}{db.MIGRATIONS[1]}PRAGMA user_version=2;COMMIT;")
    c.executescript(
        """
        INSERT INTO unit (id, name, symbol, is_count) VALUES (1, 'Gramm', 'g', 0), (2, 'Packung', 'Pkg.', 5);
        INSERT INTO location (id, name) VALUES (1, 'L1');
        INSERT INTO category (id, name, off_tags) VALUES (1, 'A', '["en:x", "en:y"]'), (2, 'B', '["en:y"]');
        INSERT INTO product (id, name, category_id, content_amount, updated_at) VALUES (1, 'P', 1, 500, 'x');
        INSERT INTO batch (id, product_id, created_at) VALUES (1, 1, 'x');
        INSERT INTO booking (ts, kind, batch_id, location_id, packages, source) VALUES
            ('t', 'in', 1, 1, 1, 's'), ('t', 'in', 1, 9, 1, 's'), ('t', 'in', 7, 1, 1, 's');
        """
    )
    db.migrate(c)
    assert c.execute("SELECT COUNT(*) FROM off_tag").fetchone()[0] == 2  # en:y only once
    assert category_tags(c) == {1: ["en:x", "en:y"], 2: ["en:y"]}
    assert tuple(c.execute("SELECT is_count FROM unit WHERE id = 2").fetchone()) == (1,)
    assert tuple(c.execute("SELECT content_amount, content_unit_id FROM product").fetchone()) == (
        None,
        None,
    )
    # Booking of an unknown batch is gone, an unknown location is cleared.
    assert [r[0] for r in c.execute("SELECT location_id FROM booking ORDER BY id")] == [1, None]
    assert inv.defaults(c) == {
        "unit_id": 2, "default_location_id": None, "expiry_type": "best_before", "warn_days": 7
    }  # fmt: skip
    with pytest.raises(sqlite3.IntegrityError):
        c.execute("UPDATE unit SET is_count = 2")


def test_shopping_items_by_hand(conn):
    nudeln = cat(conn, "Nudeln")
    inv.save(conn, "category", {"id": nudeln, "min_packages": 1})
    p = inv.add_shopping_item(conn, 2, product={"name": "Penne", "category_id": nudeln})
    assert (
        inv.add_shopping_item(conn, 1, product_id=inv.search_products(conn, "penne")[0]["id"]) == p
    )
    reis = inv.add_shopping_by_name(conn, "reis")  # category by name, any case
    items = inv.shopping_list(conn)
    # The min stock item first, then the items by hand of that category.
    assert [(i["name"], i["manual"], i["packages"]) for i in items] == [
        ("Nudeln", False, 1), ("Penne", True, 3), ("Reis", True, 1)
    ]  # fmt: skip
    inv.update_shopping_item(conn, p, done=True)
    inv.set_shopping_done(conn, nudeln, True)  # same category, other kind: separate
    assert [i["done"] for i in inv.shopping_list(conn)] == [True, True, False]
    inv.add_shopping_item(conn, 2, category={"name": "Gewürze neu", "parent_id": None})
    inv.add_shopping_item(conn, 5, product_id=inv.shopping_list(conn)[1]["product_id"])
    assert inv.shopping_list(conn)[1]["packages"] == 5  # checked item starts again
    inv.delete_shopping_item(conn, reis)
    with pytest.raises(inv.InventoryError, match="shopping_unknown"):
        inv.add_shopping_by_name(conn, "Gibtsnicht")
    with pytest.raises(inv.InventoryError, match="not_found"):
        inv.update_shopping_item(conn, reis, packages=2)
    assert len(inv.shopping_list(conn)) == 3


def test_force_delete_category_with_subtree(conn):
    parent = cat(conn, "Nudeln, Reis & Getreide")
    sub = inv.save(conn, "category", {"name": "Vollkorn", "parent_id": cat(conn, "Nudeln")})
    p = product(conn, "Dinkelnudeln", "Vollkorn")
    inv.book_in(conn, p, 2, location_id=loc(conn))
    inv.add_shopping_item(conn, 1, category_id=sub)
    with pytest.raises(inv.InventoryError, match="in_use"):
        inv.delete(conn, "category", parent)
    impact = inv.delete_impact(conn, "category", parent)
    groups = {g["kind"]: g for g in impact["groups"]}
    assert impact["blocked"] is None
    assert {"Nudeln", "Vollkorn"} <= set(groups["delete.category"]["names"])
    assert groups["delete.product"]["names"] == ["Dinkelnudeln"]
    assert groups["delete.stock"]["packages"] == 2
    assert groups["delete.booking"]["count"] == 1
    # The dry run catches cascades nobody listed by hand, and changes nothing.
    assert groups["delete.shopping_item"]["names"] == ["Vollkorn"]
    assert conn.execute("SELECT count(*) FROM product").fetchone()[0] == 1
    inv.force_delete(conn, "category", parent)
    assert (
        conn.execute("SELECT 1 FROM category WHERE name IN ('Nudeln', 'Vollkorn')").fetchone()
        is None
    )
    assert conn.execute("SELECT count(*) FROM product").fetchone()[0] == 0
    assert conn.execute("SELECT count(*) FROM booking").fetchone()[0] == 0
    assert inv.shopping_list(conn) == []


def test_force_delete_unit_clears_references(conn):
    g, kg = unit(conn, "g"), unit(conn, "kg")
    nudeln = cat(conn, "Nudeln")
    inv.save(
        conn, "category", {"id": nudeln, "unit_id": kg, "min_stock": 1, "min_stock_unit_id": kg}
    )
    p = product(conn, content_amount=500, content_unit_id=g)
    impact = inv.delete_impact(conn, "unit", g)
    names = {g_["kind"]: g_["names"] for g_ in impact["groups"]}
    assert names["delete.unit"] == ["Handvoll", "Messerspitze", "Prise", "kg"] and names[
        "change.product"
    ] == ["Spaghetti"]
    assert "Nudeln" in names["change.category"]  # seed categories use g / kg as well
    inv.force_delete(conn, "unit", g)
    row = conn.execute("SELECT unit_id, min_stock FROM category WHERE id = ?", (nudeln,)).fetchone()
    assert tuple(row) == (None, None)
    assert (
        conn.execute("SELECT content_unit_id FROM product WHERE id = ?", (p,)).fetchone()[0] is None
    )
    assert conn.execute("SELECT 1 FROM unit WHERE id IN (?, ?)", (g, kg)).fetchone() is None
    default = inv.defaults(conn)["unit_id"]
    assert inv.delete_impact(conn, "unit", default)["blocked"] == "unit_is_default"
    with pytest.raises(inv.InventoryError, match="unit_is_default"):
        inv.force_delete(conn, "unit", default)


def test_force_delete_location_moves_or_removes_stock(conn):
    fridge, freezer, shelf = loc(conn), loc(conn, "Gefrierschrank"), loc(conn, "Vorratsschrank")
    p = product(conn)
    batch = inv.book_in(conn, p, 3, location_id=fridge)
    groups = {g["kind"]: g for g in inv.delete_impact(conn, "location", fridge)["groups"]}
    assert groups["delete.stock"] == {
        "kind": "delete.stock", "count": 1, "names": ["Spaghetti"], "packages": 3
    }  # fmt: skip
    assert "Milchprodukte & Eier" in groups["change.category"]["names"]  # default location cleared
    inv.force_delete(conn, "location", fridge, move_to=freezer)
    assert stock(conn) == {(batch, freezer): 3}
    inv.force_delete(conn, "location", freezer)  # no target: booked out as a correction
    assert stock(conn) == {}
    kinds = [r[0] for r in conn.execute("SELECT kind FROM booking ORDER BY id")]
    assert kinds == ["in", "move", "correct"]
    assert shelf in [r["id"] for r in inv.list_rows(conn, "location")]
    assert fridge not in [r["id"] for r in inv.list_rows(conn, "location")]


def test_migration_4_min_stock_gets_its_effective_unit():
    """Existing minimums keep the unit they meant (own, inherited or default)."""
    c = db.connect(":memory:")
    c.executescript(f"BEGIN;{''.join(db.MIGRATIONS[:3])}PRAGMA user_version=3;COMMIT;")
    c.executescript(
        """
        INSERT INTO unit (id, name, symbol) VALUES (1, 'Gramm', 'g'), (2, 'Stück', 'St.');
        UPDATE defaults SET unit_id = 2;
        INSERT INTO defaults (id, unit_id, expiry_type, warn_days) VALUES (1, 2, 'best_before', 7)
            ON CONFLICT DO NOTHING;
        INSERT INTO category (id, parent_id, name, unit_id, min_stock) VALUES
            (1, NULL, 'A', 1, NULL), (2, 1, 'B', NULL, 5), (3, NULL, 'C', NULL, 2), (4, 3, 'D', NULL, NULL);
        INSERT INTO product (name, category_id, updated_at) VALUES ('P', 4, 'x');
        """
    )
    db.migrate(c)
    rows = c.execute("SELECT id, min_stock_unit_id FROM category ORDER BY id").fetchall()
    assert [tuple(r) for r in rows] == [(1, None), (2, 1), (3, 2), (4, None)]
    assert c.execute("PRAGMA foreign_key_check").fetchall() == []
    with pytest.raises(sqlite3.IntegrityError):
        c.execute("UPDATE category SET min_stock = 1 WHERE id = 4")


def test_tags_are_shared_and_replaced(conn):
    a, b = cat(conn, "Nudeln"), cat(conn, "Reis")
    set_tags(conn, a, ["en:test-tag"])
    set_tags(conn, b, ["en:test-tag", "en:other"])
    count = "SELECT COUNT(*) FROM off_tag WHERE tag = 'en:test-tag'"
    assert conn.execute(count).fetchone()[0] == 1
    assert category_tags(conn)[a] == ["en:test-tag"]


def test_location_is_deactivated_not_deleted(conn):
    fridge, p = loc(conn), product(conn)
    inv.save(conn, "category", {"id": cat(conn, "Nudeln"), "default_location_id": fridge})
    b = inv.book_in(conn, p, 1, "2027-01-01", location_id=fridge)
    with pytest.raises(inv.InventoryError, match="location_has_stock"):
        inv.delete(conn, "location", fridge)
    inv.book_out(conn, p, 1)
    inv.delete(conn, "location", fridge)
    md = inv.master_data(conn)
    assert fridge not in [x["id"] for x in md["locations"]]
    assert next(c for c in md["categories"] if c["name"] == "Nudeln")["default_location_id"] is None
    assert (
        conn.execute("SELECT COUNT(*) FROM booking WHERE location_id = ?", (fridge,)).fetchone()[0]
        == 2
    )
    with pytest.raises(inv.InventoryError, match="not_found"):
        inv.book_in(conn, p, 1, location_id=fridge)
    # Adding the name again brings the same location back.
    assert inv.save(conn, "location", {"name": "Kühlschrank"}) == fridge
    assert inv.book_in(conn, p, 1, "2027-01-01", location_id=fridge) == b


def test_defaults_are_editable(conn):
    old = inv.defaults(conn)
    with pytest.raises(inv.InventoryError, match="invalid_value"):
        inv.save_defaults(conn, {**old, "warn_days": None})
    inv.save_defaults(conn, {**old, "warn_days": 3})
    assert inv.defaults(conn)["warn_days"] == 3
    top = inv.save(conn, "category", {"name": "Ohne Werte"})
    assert inv.effective(conn, category_id=top)["warn_days"] == {"value": 3, "source": "default"}


def test_shopping_done_stale_check_is_dropped(conn):
    nudeln = cat(conn, "Nudeln")
    inv.save(conn, "category", {"id": nudeln, "min_packages": 3})
    inv.set_shopping_done(conn, nudeln, True)
    p = product(conn)
    inv.book_in(conn, p, 3, location_id=loc(conn))  # shortage gone
    assert inv.shopping_list(conn) == []
    inv.book_out(conn, p, 3)  # the same shortage again: must not show as checked
    assert [i["done"] for i in inv.shopping_list(conn)] == [False]
    assert conn.execute("SELECT COUNT(*) FROM shopping_done").fetchone()[0] == 0


def test_inventory_all_resolves():
    assert all(hasattr(inv, name) for name in inv.__all__)
    assert {"book_out_code", "label_info", "put_back"} <= set(inv.__all__)


def test_ean_validation(conn):
    for bad in ("123", "1234567", "123456789012345", "12345678a", "١٢٣٤٥٦٧٨", 12345678):
        with pytest.raises(inv.InventoryError, match="invalid_ean"):
            product(conn, ean=bad)
    pid = product(conn, ean=" 4006040053026 ")
    assert inv.find_ean(conn, "4006040053026")["id"] == pid
    inv.save(conn, "product", {"id": pid, "ean": "  "})  # blank: no EAN
    assert conn.execute("SELECT ean FROM product WHERE id = ?", (pid,)).fetchone()[0] is None


def test_root_category_names_are_unique(conn):
    inv.save(conn, "category", {"name": "Wurzel"})
    with pytest.raises(inv.InventoryError, match="duplicate"):
        inv.save(conn, "category", {"name": "Wurzel"})
    parent = inv.save(conn, "category", {"name": "Anders"})
    inv.save(
        conn, "category", {"name": "Wurzel", "parent_id": parent}
    )  # same name below another parent


def test_migration_6_dedupes_roots_and_nodate_batches():
    c = db.connect(":memory:")
    c.executescript(f"BEGIN;{''.join(db.MIGRATIONS[:5])}PRAGMA user_version=5;COMMIT;")
    c.executescript(
        """
        INSERT INTO location (id, name) VALUES (1, 'L1'), (2, 'L2');
        INSERT INTO category (id, name) VALUES (1, 'A'), (2, 'A'), (3, 'A'), (4, 'B');
        INSERT INTO category (id, parent_id, name) VALUES (5, 1, 'A');
        INSERT INTO product (id, name, category_id, updated_at) VALUES (1, 'P', 1, 'x'), (2, 'Q', 4, 'x');
        INSERT INTO batch (id, product_id, expires_on, created_at) VALUES
            (1, 1, NULL, 'a'), (2, 1, NULL, 'b'), (3, 1, '2027-01-01', 'c'), (4, 1, NULL, 'd'), (5, 2, NULL, 'e');
        INSERT INTO stock VALUES (1, 1, 1), (2, 1, 2), (2, 2, 5), (3, 1, 7), (4, 2, 1), (5, 1, 4);
        INSERT INTO booking (ts, kind, batch_id, location_id, packages, source) VALUES ('t', 'in', 4, 2, 1, 'x');
        """
    )
    db.migrate(c)
    names = [r[0] for r in c.execute("SELECT name FROM category WHERE id <= 5 ORDER BY id")]
    assert names == ["A", "A (2)", "A (3)", "B", "A"]
    assert [r[0] for r in c.execute("SELECT id FROM batch ORDER BY id")] == [1, 3, 5]
    assert stock(c) == {(1, 1): 3, (1, 2): 6, (3, 1): 7, (5, 1): 4}
    assert c.execute("SELECT batch_id FROM booking").fetchone()[0] == 1
    assert c.execute("PRAGMA foreign_key_check").fetchall() == []
    with pytest.raises(sqlite3.IntegrityError):
        c.execute("INSERT INTO batch (product_id, created_at) VALUES (1, 'z')")
    with pytest.raises(sqlite3.IntegrityError):
        c.execute("INSERT INTO category (name) VALUES ('B')")
    assert "reverts_id" in [r[1] for r in c.execute("PRAGMA table_info(booking)")]


def test_migrate_rolls_back_a_failing_step(monkeypatch):
    """A step that leaves a foreign key violation is undone, user_version stays."""
    c = db.connect(":memory:")
    c.executescript(f"BEGIN;{''.join(db.MIGRATIONS[:5])}PRAGMA user_version=5;COMMIT;")
    bad = "INSERT INTO stock VALUES (99, 99, 1);" + db.MIGRATIONS[5]
    monkeypatch.setattr(db, "MIGRATIONS", [*db.MIGRATIONS[:5], bad])
    with pytest.raises(sqlite3.IntegrityError, match="migration 6"):
        db.migrate(c)
    assert c.execute("PRAGMA user_version").fetchone()[0] == 5
    assert c.execute("SELECT COUNT(*) FROM stock").fetchone()[0] == 0
    assert "reverts_id" not in [r[1] for r in c.execute("PRAGMA table_info(booking)")]
    assert c.execute("PRAGMA foreign_keys").fetchone()[0] == 1


def test_delete_impact_logs_only_touched_rows(conn):
    parent = cat(conn, "Nudeln, Reis & Getreide")
    sub = inv.save(conn, "category", {"name": "Vollkorn", "parent_id": cat(conn, "Nudeln")})
    product(conn, "Dinkelnudeln", "Vollkorn")
    other = product(conn, "Milch", "Milchprodukte & Eier")
    for _ in range(200):  # unrelated history must not matter
        inv.book_in(conn, other, 1, location_id=loc(conn))
    inv.add_shopping_item(conn, 1, category_id=sub)
    groups = {g["kind"]: g for g in inv.delete_impact(conn, "category", parent)["groups"]}
    assert groups["delete.product"]["names"] == ["Dinkelnudeln"]
    assert groups["delete.shopping_item"]["names"] == ["Vollkorn"]
    assert "delete.stock" not in groups and "delete.booking" not in groups
    assert "delete.category" in groups and "delete.batch" not in groups
    # nothing left behind: no temp objects, no open savepoint
    assert conn.execute("SELECT count(*) FROM sqlite_temp_master").fetchone()[0] == 0
    assert (
        conn.execute("SELECT count(*) FROM product WHERE name = 'Dinkelnudeln'").fetchone()[0] == 1
    )
    # blocked path cleans up too
    default = inv.defaults(conn)["unit_id"]
    assert inv.delete_impact(conn, "unit", default)["blocked"] == "unit_is_default"
    assert conn.execute("SELECT count(*) FROM sqlite_temp_master").fetchone()[0] == 0


def test_min_stock_count_unit_uses_package_content(conn):
    """A 10-pack of eggs counts 10 Stück; a product without convertible content counts packages."""
    stk, nudeln = unit(conn, "Stück"), cat(conn, "Nudeln")
    inv.save(conn, "category", {"id": nudeln, "min_stock": 12, "min_stock_unit_id": stk})
    eggs = product(conn, "Eier", content_amount=10, content_unit_id=stk)
    inv.book_in(conn, eggs, 1, location_id=loc(conn))
    item = {i["name"]: i for i in inv.shopping_list(conn)}["Nudeln"]
    assert item["amount"]["missing"] == pytest.approx(2)
    inv.book_in(conn, product(conn, "Lose"), 1, location_id=loc(conn))  # no content: 1 package
    item = {i["name"]: i for i in inv.shopping_list(conn)}["Nudeln"]
    assert item["amount"]["missing"] == pytest.approx(1)
