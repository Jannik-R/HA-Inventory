"""Recipes: save, availability against the stock, delete behaviour."""

import pytest

from custom_components.pantry import db
from custom_components.pantry import inventory as inv
from custom_components.pantry.seed import seed

from .test_inventory import cat, loc, product, unit


def ing(conn, category, amount=None, unit_name=None, **kw):
    return {
        "category_id": cat(conn, category) if category else None,
        "amount": amount,
        "unit_id": unit(conn, unit_name) if unit_name else None,
        "text": kw.pop("text", ""),
        **kw,
    }


def recipe(conn, ingredients, servings=2, **kw):
    return inv.save_recipe(
        conn, {"name": "Pasta", "servings": servings, "ingredients": ingredients, **kw}
    )


def status(conn, recipe_id, servings):
    return [i["status"] for i in inv.recipe_availability(conn, recipe_id, servings)]


def test_migration_7_upgrade():
    c = db.connect(":memory:")
    c.executescript(f"BEGIN;{''.join(db.MIGRATIONS[:6])}PRAGMA user_version=6;COMMIT;")
    db.migrate(c)
    assert c.execute("PRAGMA user_version").fetchone()[0] == len(db.MIGRATIONS)
    assert c.execute("SELECT COUNT(*) FROM recipe").fetchone()[0] == 0
    assert c.execute("PRAGMA foreign_key_check").fetchall() == []


def test_save_keeps_order_and_replaces(conn):
    rid = recipe(conn, [ing(conn, "Nudeln", text="Spaghetti"), ing(conn, "Reis", text="")])
    rows = inv.recipes(conn)[0]["ingredients"]
    assert [i["text"] for i in rows] == [
        "Nudeln",
        "Reis",
    ]  # category set: its name, client text ignored
    inv.save_recipe(
        conn,
        {"id": rid, "name": "Pasta 2", "servings": 4, "ingredients": [ing(conn, "Reis", 1, "kg")]},
    )
    (r,) = inv.recipes(conn)
    assert (r["name"], r["servings"], len(r["ingredients"])) == ("Pasta 2", 4, 1)
    assert conn.execute("SELECT COUNT(*) FROM recipe_ingredient").fetchone()[0] == 1


def test_save_invalid(conn):
    with pytest.raises(inv.InventoryError, match="invalid_value"):
        recipe(conn, [ing(conn, None, text="")])  # no text, no category
    with pytest.raises(inv.InventoryError, match="invalid_value"):
        recipe(conn, [ing(conn, "Nudeln", amount=1)])  # amount without unit
    with pytest.raises(inv.InventoryError, match="not_found"):
        recipe(conn, [{**ing(conn, "Nudeln", text="x"), "category_id": 9999}])


def test_note_and_unmatched_text(conn):
    recipe(conn, [ing(conn, "Reis", note="  fein  "), ing(conn, None, text=" Salz ", note=" ")])
    a, b = inv.recipes(conn)[0]["ingredients"]
    assert (a["note"], b["text"], b["note"]) == ("fein", "Salz", None)


def test_product_types_seed_and_migration_8():
    def types(c):
        return {
            r[0]
            for r in c.execute(
                "SELECT name FROM category WHERE parent_id IN (SELECT id FROM category WHERE parent_id IS NOT NULL)"
            )
        }

    fresh = db.connect(":memory:")
    db.migrate(fresh)
    n = len(types(fresh))
    assert (
        n > 150
        and fresh.execute("SELECT COUNT(*) FROM category WHERE name = 'Tomatenmark'").fetchone()[0]
        == 1
    )
    # upgrade from 7: a renamed parent gets no types, a deleted type stays deleted
    up = db.connect(":memory:")
    up.executescript(f"BEGIN;{''.join(db.MIGRATIONS[:7])}PRAGMA user_version=7;COMMIT;")
    seed(up, "de")
    up.execute(
        "DELETE FROM category WHERE parent_id IN (SELECT id FROM category WHERE parent_id IS NOT NULL)"
    )
    up.execute("UPDATE category SET name = 'Teigwaren' WHERE name = 'Nudeln'")
    up.execute("DELETE FROM category WHERE name = 'Reis'")
    up.commit()
    db.migrate(up)
    got = types(up)
    assert "Tomatenmark" in got and "Spaghetti" not in got and "Basmatireis" not in got
    assert len(got) < n and up.execute("PRAGMA foreign_key_check").fetchall() == []
    assert up.execute("PRAGMA user_version").fetchone()[0] == len(db.MIGRATIONS)


def test_default_units(conn):
    def unit_of(c, name):
        return c.execute(
            "SELECT u.name FROM category c LEFT JOIN unit u ON u.id = c.unit_id WHERE c.name = ?",
            (name,),
        ).fetchone()[0]

    assert [unit_of(conn, n) for n in ("Milch", "Sahne", "Käse", "Vollmilch", "Spaghetti")] == [
        "l", "ml", "g", None, None,  # Vollmilch inherits l from Milch, Spaghetti kg from its main category
    ]  # fmt: skip
    # Upgrade: a category without own unit gets it, a unit the user chose stays.
    conn.execute("UPDATE category SET unit_id = NULL WHERE name = 'Milch'")
    conn.execute(
        "UPDATE category SET unit_id = (SELECT id FROM unit WHERE name = 'kg') WHERE name = 'Käse'"
    )
    from custom_components.pantry.seed_types import add_seed_extras

    add_seed_extras(conn)
    assert (unit_of(conn, "Milch"), unit_of(conn, "Käse")) == ("l", "kg")


def test_suggest_lands_on_product_type(conn):
    assert inv.suggest(conn, [], "Mutti Tomatenmark") == cat(conn, "Tomatenmark")


def test_availability_subtree_units_and_scaling(conn):
    g = unit(conn, "g")
    parent = "Nudeln, Reis & Getreide"
    rid = recipe(conn, [ing(conn, parent, 1, "kg")], servings=2)
    assert status(conn, rid, 2) == ["missing"]
    inv.book_in(conn, product(conn, "Spaghetti", content_amount=500, content_unit_id=g), 1,
                location_id=loc(conn))  # fmt: skip
    (i,) = inv.recipe_availability(conn, rid, 2)
    assert (i["status"], i["need"], i["have"], i["missing"], i["unit_symbol"]) == (
        "partial", 1, 0.5, 0.5, "kg"
    )  # fmt: skip
    assert status(conn, rid, 1) == ["available"]  # half the servings need 0.5 kg
    assert inv.recipe_availability(conn, rid, 4)[0]["need"] == 2
    inv.book_in(conn, product(conn, "Loser Reis", "Reis"), 1, location_id=loc(conn))
    (i,) = inv.recipe_availability(conn, rid, 2)
    assert i["status"] == "partial" and i["unknown_products"] == 1


def test_availability_unknown_unmatched_no_amount_optional(conn):
    inv.book_in(conn, product(conn, "Loser Reis", "Reis"), 1, location_id=loc(conn))
    rid = recipe(conn, [
        ing(conn, "Reis", 200, "g"),                  # only unknown content
        ing(conn, "Nudeln", text="Pasta"),            # no amount, no stock
        ing(conn, "Reis", text="Reis"),               # no amount, in stock
        ing(conn, None, text="Salz"),                 # unmatched
        ing(conn, "Nudeln", 1, "g", optional=True),   # optional: not in the summary
    ])  # fmt: skip
    assert status(conn, rid, 2) == ["unknown", "missing", "available", "unmatched", "missing"]
    (r,) = inv.recipes(conn)
    assert r["summary"] == {"available": 1, "total": 4}


def test_recipe_removal(conn):
    g = unit(conn, "g")
    rid = recipe(conn, [ing(conn, "Reis", 1, "g", text="Reis")])
    impact = inv.delete_impact(conn, "category", cat(conn, "Reis"))
    group = next(x for x in impact["groups"] if x["kind"] == "change.recipe_ingredient")
    assert group["names"] == ["Pasta"]
    inv.force_delete(conn, "category", cat(conn, "Reis"))
    row = conn.execute("SELECT category_id, text FROM recipe_ingredient").fetchone()
    assert (row["category_id"], row["text"]) == (None, "Reis")
    # a unit goes: amount and unit are cleared together
    rid2 = recipe(conn, [ing(conn, "Nudeln", 1, "g")])
    inv.force_delete(conn, "unit", g)
    rows = conn.execute(
        "SELECT amount, unit_id FROM recipe_ingredient WHERE recipe_id = ?", (rid2,)
    )
    assert tuple(rows.fetchone()) == (None, None)
    # deleting a recipe lists nothing and cascades the ingredients
    assert inv.delete_impact(conn, "recipe", rid)["groups"] == []
    inv.delete(conn, "recipe", rid)
    assert (
        conn.execute(
            "SELECT COUNT(*) FROM recipe_ingredient WHERE recipe_id = ?", (rid,)
        ).fetchone()[0]
        == 0
    )
