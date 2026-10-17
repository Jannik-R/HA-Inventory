"""Recipes on the shopping list: demand minus stock, egg rule, checks, API, migration."""

import pytest

from custom_components.pantry import db
from custom_components.pantry import inventory as inv

from .test_inventory import cat, loc, product, unit
from .test_recipes import ing, recipe


def listed(conn):
    """(name, missing, unit symbol, recipes) of the recipe items."""
    return [
        (
            i["name"],
            i["amount"] and i["amount"]["missing"],
            i["amount"] and i["amount"]["unit_symbol"],
            [(u["no"], u["name"], u["amount"]) for u in i["recipes"]],
        )
        for i in inv.shopping_list(conn)
        if i.get("key")
    ]


def test_demand_adds_up_and_scales(conn):
    a = recipe(conn, [ing(conn, "Nudeln", 500, "g")], servings=2, name="A")
    b = recipe(conn, [ing(conn, "Nudeln", 1, "kg")], servings=4, name="B")
    inv.set_shopping_recipe(conn, a, 4)  # 1000 g
    inv.set_shopping_recipe(conn, b, 2)  # 500 g = 0.5 kg
    assert listed(conn) == [("Nudeln", 1500, "g", [(1, "A", 1000), (2, "B", 500)])]
    item = next(i for i in inv.shopping_list(conn) if i.get("key"))
    assert item["key"] == f"r{cat(conn, 'Nudeln')}-{unit(conn, 'g')}" and item["manual"] is False
    p = product(conn, content_amount=1, content_unit_id=unit(conn, "kg"))
    inv.book_in(conn, p, 1, location_id=loc(conn))
    assert listed(conn)[0][1] == 500


def test_exclusions_and_optional(conn):
    r = recipe(
        conn,
        [
            ing(conn, "Nudeln", 100, "g"),
            ing(conn, "Salz", 5, "g", skip_stock=True),
            ing(conn, None, 1, "g", text="Mystery"),
            ing(conn, "Mehl", 50, "g", optional=True),
        ],
    )
    inv.set_shopping_recipe(conn, r, 2)
    assert [x[0] for x in listed(conn)] == ["Nudeln"]
    (opt,) = [i["id"] for i in inv.recipes(conn)[0]["ingredients"] if i["optional"]]
    inv.set_shopping_recipe(conn, r, 2, [opt])
    assert sorted(x[0] for x in listed(conn)) == ["Mehl", "Nudeln"]
    saved = inv.recipes(conn)[0]  # editing the recipe re-inserts its ingredients: choice kept
    inv.save_recipe(conn, {"id": r, "name": saved["name"], "ingredients": saved["ingredients"]})
    assert sorted(x[0] for x in listed(conn)) == ["Mehl", "Nudeln"]
    inv.set_shopping_recipe(conn, r, 2)  # upsert replaces the choice
    assert [x[0] for x in listed(conn)] == ["Nudeln"]
    other = recipe(conn, [ing(conn, "Mehl", 1, "g", optional=True)], name="Other")
    with pytest.raises(inv.InventoryError) as e:
        inv.set_shopping_recipe(conn, r, 2, [inv.recipes(conn)[1]["ingredients"][0]["id"]])
    assert e.value.translation_key == "invalid_value"
    assert other


def test_egg_rule(conn):
    eggs = [
        ing(conn, "Eier", 2, "Stück"),
        ing(conn, "Eier", 1, "Stück", note="Eigelb, getrennt"),
        ing(conn, "Eier", 2, "Stück", note="Eiweiß"),
    ]
    r = recipe(conn, eggs, servings=2)
    inv.set_shopping_recipe(conn, r, 2)
    assert listed(conn)[0][1] == 4
    inv.set_shopping_recipe(conn, r, 3)  # 1.5 x (2 + 2) = 6
    assert listed(conn)[0][1] == 6
    r2 = recipe(conn, [ing(conn, "Eier", 1, "Stück", note="Eigelb")], servings=2, name="E")
    inv.remove_shopping_recipe(conn, r)
    inv.set_shopping_recipe(conn, r2, 3)  # 1.5 -> 2
    assert listed(conn)[0][1] == 2


def test_units_any_and_unknown(conn):
    r = recipe(
        conn,
        [
            ing(conn, "Milch", 200, "ml"),
            ing(conn, "Milch", 1, "Stück"),
            ing(conn, "Kräuter"),
            ing(conn, "Mehl"),
            ing(conn, "Mehl", 100, "g"),
        ],
    )
    inv.set_shopping_recipe(conn, r, 2)
    got = {(n, m, s) for n, m, s, _ in listed(conn)}
    assert got == {
        ("Milch", 200, "ml"),
        ("Milch", 1, "Stk"),
        ("Kräuter", None, None),
        ("Mehl", 100, "g"),
    }
    p = product(conn, "Kraut", "Kräuter")
    inv.book_in(conn, p, 1, location_id=loc(conn))
    assert "Kräuter" not in [x[0] for x in listed(conn)]
    q = product(conn, "Mehl1", "Mehl")  # no content: weight unknown
    inv.book_in(conn, q, 1, location_id=loc(conn))
    item = next(i for i in inv.shopping_list(conn) if i["name"] == "Mehl")
    assert item["amount"]["unknown_products"] == 1


def test_check_holds_until_shortage_changes(conn):
    r = recipe(conn, [ing(conn, "Nudeln", 100, "g")], servings=1)
    inv.set_shopping_recipe(conn, r, 1)
    key = inv.shopping_list(conn)[0]["key"]
    inv.set_recipe_done(conn, key, True)
    assert inv.shopping_list(conn)[0]["done"]
    inv.set_shopping_recipe(conn, r, 2)
    assert not inv.shopping_list(conn)[0]["done"]
    assert conn.execute("SELECT COUNT(*) FROM shopping_done_recipe").fetchone()[0] == 0  # purged
    inv.set_recipe_done(conn, key, True)
    inv.remove_shopping_recipe(conn, r)
    assert inv.shopping_list(conn) == []
    assert conn.execute("SELECT COUNT(*) FROM shopping_done_recipe").fetchone()[0] == 0


def test_with_min_stock_and_remove(conn):
    n = cat(conn, "Nudeln")
    inv.save(conn, "category", {"id": n, "min_packages": 1})
    r = recipe(conn, [ing(conn, "Nudeln", 100, "g")])
    inv.set_shopping_recipe(conn, r, 2)
    assert sorted(bool(i.get("key")) for i in inv.shopping_list(conn)) == [False, True]
    assert inv.shopping_recipes(conn) == [
        {"recipe_id": r, "name": "Pasta", "servings": 2, "optional": [], "no": 1}
    ]
    assert inv.recipes(conn)[0]["shopping_servings"] == 2
    inv.remove_shopping_recipe(conn, r)
    with pytest.raises(inv.InventoryError):
        inv.remove_shopping_recipe(conn, r)
    for opt in ((), (5,)):  # unknown recipe is always not_found, even with a bad optional
        with pytest.raises(inv.InventoryError) as e:
            inv.set_shopping_recipe(conn, 999, 2, opt)
        assert e.value.translation_key == "not_found"
    with pytest.raises(inv.InventoryError) as e:
        inv.set_recipe_done(conn, "r1-2", True)  # stale key
    assert e.value.translation_key == "not_found"


def test_recipe_delete_cascades(conn):
    r = recipe(conn, [ing(conn, "Nudeln", 100, "g")])
    inv.set_shopping_recipe(conn, r, 2)
    conn.execute("DELETE FROM recipe WHERE id = ?", (r,))
    assert inv.shopping_recipes(conn) == []


def test_migration_12_upgrade(monkeypatch):
    c = db.connect(":memory:")
    with monkeypatch.context() as m:  # steps 8 and 9 are functions: let migrate() run up to 11
        m.setattr(db, "MIGRATIONS", db.MIGRATIONS[:11])
        m.setattr(db, "mark_recipe_only", lambda c: None)  # seeds before the column exists
        db.migrate(c)
    assert c.execute("PRAGMA user_version").fetchone()[0] == 11
    db.migrate(c)
    assert c.execute("PRAGMA user_version").fetchone()[0] == len(db.MIGRATIONS)
    assert c.execute("SELECT COUNT(*) FROM shopping_recipe").fetchone()[0] == 0
    assert c.execute("PRAGMA foreign_key_check").fetchall() == []


def test_group_key_ignores_row_order(conn):
    a = recipe(conn, [ing(conn, "Mehl", 1, "kg"), ing(conn, "Mehl", 200, "g")], name="A")
    inv.set_shopping_recipe(conn, a, 2)
    (key,) = [i["key"] for i in inv.shopping_list(conn) if i.get("key")]
    assert key == f"r{cat(conn, 'Mehl')}-{unit(conn, 'g')}"  # base unit, not the first row's
    b = recipe(conn, [ing(conn, "Mehl", 1, "g"), ing(conn, "Mehl", 1, "kg")], name="B")
    inv.set_shopping_recipe(conn, b, 2)
    assert [i["key"] for i in inv.shopping_list(conn) if i.get("key")] == [key]


def test_dropped_any_group_keeps_its_refs(conn):
    a = recipe(conn, [ing(conn, "Kräuter", 2, "Bund")], name="A")
    b = recipe(conn, [ing(conn, "Kräuter")], name="B")
    inv.set_shopping_recipe(conn, a, 2)
    inv.set_shopping_recipe(conn, b, 2)
    assert listed(conn) == [("Kräuter", 2, "Bund", [(1, "A", 2), (2, "B", None)])]


def test_migration_13_keeps_used_units():
    c = db.connect(":memory:")
    with pytest.MonkeyPatch.context() as m:
        m.setattr(db, "MIGRATIONS", db.MIGRATIONS[:12])
        m.setattr(db, "mark_recipe_only", lambda c: None)
        db.migrate(c)
    zehe, tl = (
        c.execute("SELECT id FROM unit WHERE name = ?", (n,)).fetchone()[0]
        for n in ("Zehe", "Teelöffel")
    )
    c.execute(
        "INSERT INTO product (name, category_id, content_amount, content_unit_id, updated_at)"
        " VALUES ('Knoblauch', (SELECT MIN(id) FROM category), 1, ?, 'x')",
        (zehe,),
    )
    c.commit()
    db.migrate(c)
    flags = dict(c.execute("SELECT name, recipe_only FROM unit WHERE id IN (?, ?)", (zehe, tl)))
    assert flags == {"Zehe": 0, "Teelöffel": 1}
    assert c.execute("SELECT base_unit_id FROM unit WHERE id = ?", (zehe,)).fetchone()[0] is None
