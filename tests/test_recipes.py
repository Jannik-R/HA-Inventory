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


def test_migration_10_skip_stock_defaults_to_off():
    c = db.connect(":memory:")
    c.executescript(f"BEGIN;{''.join(db.MIGRATIONS[:7])}PRAGMA user_version=7;COMMIT;")
    c.execute("INSERT INTO recipe (name, servings) VALUES ('R', 2)")
    c.execute("INSERT INTO recipe_ingredient (recipe_id, text) VALUES (1, 'Salz')")
    c.commit()
    db.migrate(c)
    assert c.execute("SELECT skip_stock FROM recipe_ingredient").fetchone()[0] == 0


def test_upgrade_from_7_keeps_user_data():
    """A 0.0.x DB with stock, a recipe and user edits goes through every later migration."""
    c = db.connect(":memory:")
    c.executescript(f"BEGIN;{''.join(db.MIGRATIONS[:7])}PRAGMA user_version=7;COMMIT;")
    seed(c, "de")
    c.execute("UPDATE category SET name = 'Teigwaren' WHERE name = 'Nudeln'")
    c.commit()
    p = inv.save(c, "product", {"name": "Penne", "category_id": cat(c, "Teigwaren")})
    inv.book_in(c, p, 2, location_id=loc(c))
    c.execute(
        "INSERT INTO recipe (name, servings) VALUES ('R', 2)"
    )  # today's code needs skip_stock
    c.execute("INSERT INTO recipe_ingredient (recipe_id, category_id, text) VALUES (1, ?, 'x')",
              (cat(c, "Teigwaren"),))  # fmt: skip
    c.commit()
    db.migrate(c)
    assert c.execute("PRAGMA user_version").fetchone()[0] == len(db.MIGRATIONS)
    assert c.execute("PRAGMA foreign_key_check").fetchall() == []
    assert c.execute("SELECT min_packages FROM product").fetchone()[0] is None
    assert inv.recipe_availability(c, 1, 2)[0]["status"] == "available"
    inv.save(c, "product", {"id": p, "min_packages": 3})
    assert [i["name"] for i in inv.shopping_list(c)] == ["Penne"]


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


def test_migration_9_adds_only_new_items():
    up = db.connect(":memory:")
    up.executescript(f"BEGIN;{''.join(db.MIGRATIONS[:7])}PRAGMA user_version=7;COMMIT;")
    seed(up, "de")
    for name in (
        "Blätterteig",
        "Maronen",
        "Schattenmorellen",
        "Schweineschmalz",
        "Spaghetti",
        "Pak Choi",
    ):
        up.execute("DELETE FROM category WHERE name = ?", (name,))
    up.execute(
        "DELETE FROM category WHERE parent_id = (SELECT id FROM category WHERE name = 'Alkohol')"
    )
    up.execute(
        "DELETE FROM category WHERE name = 'Alkohol'"
    )  # as an older DB without the sub-category
    up.execute("DELETE FROM unit WHERE name IN ('cl', 'dl', 'Tasse')")
    up.execute("PRAGMA user_version=8")  # as a 0.1.0 DB: a user also deleted Spaghetti
    up.commit()
    db.migrate(up)
    names = {r[0] for r in up.execute("SELECT name FROM category")}
    assert {"Blätterteig", "Maronen", "Schattenmorellen", "Schweineschmalz"} <= names
    assert {"Pak Choi", "Rum", "Alkohol"} <= names and "Spaghetti" not in names
    assert tuple(
        up.execute(
            "SELECT a.name, u.name FROM category c JOIN category a ON a.id = c.parent_id"
            " LEFT JOIN unit u ON u.id = a.unit_id WHERE c.name = 'Rum'"
        ).fetchone()
    ) == ("Alkohol", "ml")
    assert up.execute("SELECT 1 FROM unit WHERE name = 'Tasse'").fetchone()
    assert (
        up.execute("SELECT base_unit_id, factor FROM unit WHERE name = 'dl'").fetchone()[1] == 100
    )
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
    for name, expected in {
        "Ei": "Eier",
        "Kirsche": "Kirschen",
        "Marone": "Maronen",
        "Schalotte": "Schalotten",
        "Pak Choi": "Pak Choi",
        "Joghurt Erdbeere": "Joghurt",
        "Fett": "Öl",
        "Crème fraîche": "Crème fraîche",
        "Schweineschmalz": "Schweineschmalz",
    }.items():
        assert inv.suggest(conn, [], name) == cat(conn, expected), name


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
        ing(conn, "Nudeln", 1, "g", skip_stock=True), # skipped: no lookup, not in the summary
    ])  # fmt: skip
    assert status(conn, rid, 2) == [
        "unknown", "missing", "available", "unmatched", "missing", "skipped"
    ]  # fmt: skip
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
