"""Recipes: save, availability against the stock, delete behaviour."""

from datetime import date

import pytest

from custom_components.home_inventory import inventory as inv

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


def test_product_types_seed(conn):
    n = conn.execute(
        "SELECT COUNT(*) FROM category WHERE parent_id IN"
        " (SELECT id FROM category WHERE parent_id IS NOT NULL)"
    ).fetchone()[0]
    assert n > 150
    assert (
        conn.execute("SELECT COUNT(*) FROM category WHERE name = 'Tomatenmark'").fetchone()[0] == 1
    )


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
    from custom_components.home_inventory.seed_types import add_seed_extras

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


def test_egg_parts_count_together(conn):
    r = recipe(
        conn,
        [
            ing(conn, "Eier", 3, "Stück", note="Eigelb"),
            ing(conn, "Eier", 3, "Stück", note="Eiweiß"),
        ],
    )
    p = product(conn, "Ei", "Eier")
    inv.book_in(conn, p, 3, location_id=loc(conn))
    assert status(conn, r, 2) == ["available", "available"]
    inv.save_recipe(
        conn,
        {
            "id": r,
            "name": "Pasta",
            "servings": 2,
            "ingredients": [
                ing(conn, "Eier", 2, "Stück"),
                ing(conn, "Eier", 3, "Stück", note="Eigelb"),
                ing(conn, "Eier", 3, "Stück", note="Eiweiß"),
            ],
        },
    )  # 2 whole + 3 eggs' parts = 5 > 3: the parts rows report the shortage
    got = inv.recipe_availability(conn, r, 2)
    assert [(i["status"], i["need"]) for i in got] == [
        ("available", 2),
        ("partial", 5),
        ("partial", 5),
    ]


def test_expiring_recipes_ranking(conn):
    today = date(2026, 1, 1)
    where = loc(conn)
    for name, cat_name, exp in (("N", "Nudeln", "2025-12-31"), ("R", "Reis", "2026-01-02")):
        pid = product(conn, name, cat_name)
        inv.book_in(conn, pid, 1, exp, where)
    late = product(conn, "Mehl", "Mehl")
    inv.book_in(conn, late, 1, "2030-01-01", where)  # not expiring
    both = recipe(conn, [ing(conn, "Nudeln"), ing(conn, "Reis")], name="Beides")
    one = recipe(conn, [ing(conn, "Nudeln"), ing(conn, "Mehl")], name="Eins")
    optional = recipe(conn, [ing(conn, "Reis", optional=True), ing(conn, "Mehl")], name="Opt")
    got = inv.expiring_recipes(conn, today)
    assert [r["recipe_id"] for r in got] == [both, one]
    assert got[0]["used"] == 2 and got[0]["products"] == ["N", "R"]
    assert optional not in [r["recipe_id"] for r in got]
    assert [r["recipe_id"] for r in inv.expiring_recipes(conn, today, days=0)] == [both, one]
