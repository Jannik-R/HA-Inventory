"""Allergens and diet (migration 30): OFF values, inheritance, strict recipe diet, admin reload."""

import json
from unittest.mock import patch

from custom_components.home_inventory import db, off_diet
from custom_components.home_inventory import inventory as inv
from custom_components.home_inventory.const import DEFAULT_MODULES, modules_of
from custom_components.home_inventory.inventory.diet import (
    check_allergens,
    diet_index,
    recipe_diet,
)
from custom_components.home_inventory.inventory.diet import off_diet as parse
from custom_components.home_inventory.migration_30 import _SEEDED

from .test_inventory import cat, product
from .test_websocket import master, ws  # noqa: F401


def setdiet(conn, name, diet=None, allergens=None):
    inv.save(conn, "category", {"id": cat(conn, name), "diet": diet, "allergens": allergens})


def diet_of(conn, ings):
    return recipe_diet(diet_index(conn), [{"optional": False, **i} for i in ings])


def ing(conn, name, **kw):
    return {"category_id": cat(conn, name), "text": name, **kw}


def test_off_diet():
    assert parse({"ingredients_analysis_tags": ["en:non-vegetarian"]}) == ("none", None)
    assert parse({"ingredients_analysis_tags": ["en:vegan"], "allergens_tags": []}) == ("vegan", "")
    both = {"ingredients_analysis_tags": ["en:vegetarian", "en:non-vegan"]}
    assert parse(both) == ("vegetarian", "")
    tags = {"allergens_tags": ["en:soybeans", "en:gluten", "en:xx"]}
    assert parse(tags) == (None, "gluten,soybeans")
    assert parse({"allergens_tags": []}) == (None, None)  # nothing said = unknown, never guessed
    assert parse(None) == (None, None)
    assert check_allergens("milk, gluten,milk") == "gluten,milk" and check_allergens("") == ""


def test_module_default_off():
    assert "diet" not in DEFAULT_MODULES and modules_of({}) == DEFAULT_MODULES
    assert "diet" in modules_of({"modules": ["diet"]})


def test_seeded_names_exist_once_and_are_filled(conn):
    for name in _SEEDED:
        sql = "SELECT count(*) FROM category WHERE name = ?"
        assert conn.execute(sql, (name,)).fetchone()[0] == 1, name
    row = conn.execute("SELECT diet, allergens FROM category WHERE name = 'Weizenmehl'").fetchone()
    assert tuple(row) == ("vegan", "gluten")


def test_migration_30_fills_product_from_off_json(monkeypatch):
    c = db.connect(":memory:")
    with monkeypatch.context() as m:  # seeded DB of version 29
        m.setattr(db, "MIGRATIONS", db.MIGRATIONS[:29])
        m.setattr(db, "set_diet", lambda conn: None)
        db.migrate(c)
    tags = json.dumps(
        {"allergens_tags": ["en:milk"], "ingredients_analysis_tags": ["en:vegetarian"]}
    )
    cid = c.execute("SELECT id FROM category WHERE name = 'Nudeln'").fetchone()[0]
    for i, raw in enumerate([tags, "not json", None], 1):
        c.execute(
            "INSERT INTO product (id, name, category_id, updated_at, off_json)"
            " VALUES (?, 'P', ?, 'x', ?)",
            (i, cid, raw),
        )
    c.commit()
    db.migrate(c)
    rows = [tuple(r) for r in c.execute("SELECT diet, allergens FROM product ORDER BY id")]
    assert rows == [("vegetarian", "milk"), (None, None), (None, None)]
    got = c.execute("SELECT diet FROM category WHERE name = 'Weizenmehl'").fetchone()
    assert got[0] == "vegan"
    assert c.execute("PRAGMA foreign_key_check").fetchall() == []


def test_inheritance_and_product_own_value(conn):
    setdiet(conn, "Nudeln", "vegetarian", "milk")
    pid = product(conn, "Spaghetti", "Nudeln")
    assert inv.effective(conn, product_id=pid)["allergens"]["value"] == "milk"
    inv.save(conn, "product", {"id": pid, "allergens": ""})  # own: none of the 14
    assert inv.effective(conn, product_id=pid)["allergens"] == {"value": "", "source": "own"}
    inv.save(conn, "product", {"id": pid, "allergens": None})  # reset
    assert inv.effective(conn, product_id=pid)["allergens"]["value"] == "milk"


def test_strict_recipe_diet(conn):
    setdiet(conn, "Nudeln", "vegan", "gluten")
    setdiet(conn, "Tomaten", "vegan", "")
    r = diet_of(conn, [ing(conn, "Nudeln"), ing(conn, "Tomaten")])
    assert (r["diet"], r["contains"], r["allergens_known"]) == ("vegan", ["gluten"], True)
    r = diet_of(conn, [ing(conn, "Nudeln"), {"category_id": None, "text": "Zeug"}])
    assert r["diet"] is None and r["unknown"] == ["Zeug"] and not r["allergens_known"]
    setdiet(conn, "Eier", "vegetarian", "eggs")
    setdiet(conn, "Fleisch", "none", None)
    r = diet_of(conn, [ing(conn, "Eier"), ing(conn, "Fleisch"), {"category_id": None, "text": "x"}])
    assert r["diet"] == "none" and r["contains"] == ["eggs"]
    assert diet_of(conn, [ing(conn, "Eier"), ing(conn, "Nudeln")])["diet"] == "vegetarian"
    assert diet_of(conn, [])["diet"] is None


def test_optional_not_counted_but_listed(conn):
    setdiet(conn, "Tomaten", "vegan", "")
    setdiet(conn, "Fleisch", "none", None)
    setdiet(conn, "Eier", "vegetarian", "eggs")
    r = diet_of(
        conn,
        [
            ing(conn, "Tomaten"),
            ing(conn, "Fleisch", optional=True),
            ing(conn, "Eier", optional=True),
        ],
    )
    assert r["diet"] == "vegan" and r["contains"] == [] and r["allergens_known"]
    assert r["optional"] == [
        {"text": "Fleisch", "diet": "none", "contains": []},
        {"text": "Eier", "diet": "vegetarian", "contains": ["eggs"]},
    ]


def test_subtree_aggregates_products(conn):
    setdiet(conn, "Nudeln", "vegan", "gluten")
    product(conn, "Eiernudeln", "Nudeln", diet="vegetarian", allergens="eggs,gluten")
    r = diet_of(conn, [ing(conn, "Nudeln")])
    assert r["diet"] == "vegetarian" and r["contains"] == ["gluten", "eggs"]


def test_add_product_fills_from_off_json_own_wins(conn):
    tags = {"allergens_tags": ["en:milk"], "ingredients_analysis_tags": ["en:vegetarian"]}
    base = {"category_id": cat(conn, "Nudeln"), "off_json": json.dumps(tags)}
    a = inv.add_product(conn, {"name": "A", **base})
    b = inv.add_product(conn, {"name": "B", **base, "diet": "vegan"})

    def get(i):
        return tuple(
            conn.execute("SELECT diet, allergens FROM product WHERE id = ?", (i,)).fetchone()
        )

    assert get(a) == ("vegetarian", "milk") and get(b) == ("vegan", "milk")


async def test_ws_allergens_validation(ws):  # noqa: F811
    nudeln = next(c for c in (await master(ws))["categories"] if c["name"] == "Nudeln")
    save = {"type": "home_inventory/save", "table": "category"}
    for bad in ({"allergens": "milk,foo"}, {"diet": "meaty"}):
        assert not (await ws.call({**save, "data": {"id": nudeln["id"], **bad}}))["success"]
    ok = {"id": nudeln["id"], "allergens": "milk,gluten"}
    assert (await ws.call({**save, "data": ok}))["success"]
    got = next(c for c in (await master(ws))["categories"] if c["id"] == nudeln["id"])
    assert got["allergens"] == "gluten,milk"


async def test_ws_reload_chunk(ws, hass, hass_admin_user):  # noqa: F811
    db_ = hass.config_entries.async_entries("home_inventory")[0].runtime_data

    def seed():
        return [
            db_._conn.execute(
                "INSERT INTO product (name, category_id, ean, diet, updated_at)"
                " VALUES (?, 1, ?, ?, 'x')",
                (f"P{i}", f"1234567{i}", d),
            ).lastrowid
            for i, d in enumerate([None, None, "vegan", None])
        ]

    ids = await hass.async_add_executor_job(seed)
    served = {"12345670": {"status": 1, "product": {"code": "x", "allergens_tags": ["en:milk"]}}}

    async def fake(hass_, path, params, base=None):
        return served.get(path.rsplit("/", 1)[1], {"status": 0})

    msg = {"type": "home_inventory/diet_reload", "after": 0}
    with patch.object(off_diet, "DELAY", 0), patch.object(off_diet, "_get", fake):
        r = (await ws.call(msg))["result"]
        assert r == {"done": True, "total": 3, "checked": 3, "filled": 1, "last": ids[3]}
        assert (await ws.call({**msg, "after": ids[3]}))["result"]["checked"] == 0
        hass_admin_user.groups = []
        assert not (await ws.call(msg))["success"]

    def read():
        sql = "SELECT allergens, diet, off_json FROM product WHERE id = ?"
        return tuple(db_._conn.execute(sql, (ids[0],)).fetchone())

    row = await hass.async_add_executor_job(read)
    assert row[0] == "milk" and row[1] is None and "allergens_tags" in row[2]
