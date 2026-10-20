"""Drying (migration 26): protocols and recipes of kind 'drying' beside canning, seeded Gedörrtes."""

from datetime import date

from custom_components.home_inventory import db
from custom_components.home_inventory import inventory as inv
from tests.test_inventory import cat, loc


def test_seeded_root(conn) -> None:
    root = cat(conn, "Gedörrtes")
    eff = inv.effective(conn, category_id=root)
    assert (eff["expiry_type"]["value"], eff["shelf_days"]["value"]) == ("guide", 180)
    assert inv.effective(conn, category_id=cat(conn, "Jerky"))["shelf_days"]["value"] == 180


def test_drying_recipe_makes_a_drying_protocol(conn) -> None:
    apples = {"name": "Apfelchips", "category_id": cat(conn, "Trockenobst")}
    rid = inv.save_recipe(
        conn,
        {"name": "Apfelchips dörren", "servings": 3, "ingredients": [], "canning_product": apples,
         "canning_temp": 60, "canning_minutes": 480, "canning_kind": "drying"},
    )  # fmt: skip
    # the recipe sets the kind; the shared numbering of the day goes on
    first = inv.save_canning(conn, {"made_on": "2026-10-20", "product_id": None, "recipe_id": rid,
                                    "jars": 3, "location_id": loc(conn)})  # fmt: skip
    jam = inv.save_canning(
        conn, {"made_on": "2026-10-20", "jars": 2, "location_id": loc(conn),
               "product": {"name": "Marmelade", "category_id": cat(conn, "Marmelade & Gelee")}},
    )  # fmt: skip
    assert (first["charge"], jam["charge"]) == ("20261020-1", "20261020-2")
    kinds = {r["charge"]: r["kind"] for r in inv.cannings(conn)}
    assert kinds == {"20261020-1": "drying", "20261020-2": "canning"}
    # a new protocol without a recipe takes the given kind
    own = inv.save_canning(
        conn, {"made_on": "2026-10-21", "jars": 1, "location_id": loc(conn), "kind": "drying",
               "product": {"name": "Pilze", "category_id": cat(conn, "Getrocknete Pilze")}},
    )  # fmt: skip
    assert {r["charge"]: r["kind"] for r in inv.cannings(conn)}[own["charge"]] == "drying"
    # by name: only a drying recipe of that name, expiry from the shelf life
    res = inv.canning_by_name(conn, "Apfelchips dörren", date(2026, 10, 22), kind="drying")
    row = conn.execute("SELECT expires_on FROM batch WHERE id = ?", (res["batch_id"],)).fetchone()
    assert row[0] == "2027-04-20"
    assert inv.recipe_by_name(conn, "Apfelchips dörren") == rid


def test_migration_26(monkeypatch) -> None:
    c = db.connect(":memory:")
    with monkeypatch.context() as m:  # seeded DB of version 25
        m.setattr(db, "MIGRATIONS", db.MIGRATIONS[:25])
        m.setattr(db, "add_dried", lambda conn: None)
        db.migrate(c)
    assert c.execute("SELECT 1 FROM category WHERE name = 'Gedörrtes'").fetchone() is None
    db.migrate(c)
    assert c.execute("PRAGMA user_version").fetchone()[0] == len(db.MIGRATIONS)
    assert c.execute("SELECT 1 FROM category WHERE name = 'Gedörrtes'").fetchone()
    assert c.execute("PRAGMA foreign_key_check").fetchall() == []
