"""Leftovers as a charge (migration 29, inventory/leftovers.py)."""

from datetime import date

import pytest
from homeassistant.core import HomeAssistant

from custom_components.home_inventory import db
from custom_components.home_inventory import inventory as inv
from custom_components.home_inventory.inventory import InventoryError

from .test_inventory import loc
from .test_services import call, entry  # noqa: F401
from .test_websocket import by_name, master, ws  # noqa: F401

DAY = date(2026, 10, 20)


def dish(conn, name="Linsensuppe"):
    return inv.save_recipe(conn, {"name": name, "servings": 4, "ingredients": []})


def test_root_and_upgrade(conn, monkeypatch):
    root = conn.execute("SELECT * FROM category WHERE name = 'Reste'").fetchone()
    got = (root["expiry_type"], root["shelf_days"], root["warn_days"], root["emergency_group"])
    assert got == ("guide", 3, 1, "none")
    assert root["default_location_id"] == loc(conn)
    old = db.connect(":memory:")
    with monkeypatch.context() as m:
        m.setattr(db, "MIGRATIONS", db.MIGRATIONS[:28])
        db.migrate(old)
    assert old.execute("SELECT 1 FROM category WHERE name = 'Reste'").fetchone() is None
    db.migrate(old)
    assert old.execute("SELECT 1 FROM category WHERE name = 'Reste'").fetchone()
    assert old.execute("PRAGMA foreign_key_check").fetchall() == []
    assert inv.store_leftovers(old, 1, DAY, dish=" X ")["name"] == "Reste: X"


def test_store(conn):
    rid = dish(conn)
    first = inv.store_leftovers(conn, 2, DAY, recipe_id=rid)
    assert (first["name"], first["charge"], first["expires_on"]) == (
        "Reste: Linsensuppe",
        "20261020-1",
        "2026-10-23",
    )
    second = inv.store_leftovers(conn, 1, DAY, dish="Linsensuppe")  # same product, next charge
    assert second["charge"] == "20261020-2"
    assert conn.execute("SELECT count(*) FROM product WHERE name LIKE 'Reste:%'").fetchone()[0] == 1
    inv.save_canning(  # the charge numbering is shared with canning
        conn,
        {
            "made_on": DAY,
            "jars": 1,
            "product": {"name": "Eis", "category_id": inv.leftover_category(conn)},
        },
    )
    assert inv.store_leftovers(conn, 1, DAY, dish="Z")["charge"] == "20261020-4"
    (row,) = [r for r in inv.cannings(conn) if r["id"] == first["id"]]
    assert (row["kind"], row["recipe"], row["in_stock"]) == ("leftover", "Linsensuppe", 2)


def test_freezer_rule(conn):
    frozen = inv.store_leftovers(conn, 1, DAY, dish="A", location_id=loc(conn, "Gefrierschrank"))
    assert frozen["expires_on"] == "2027-01-18"  # made-on + 90 days
    b = conn.execute("SELECT frozen_on FROM batch WHERE id = ?", (frozen["batch_id"],)).fetchone()
    assert b[0] == "2026-10-20"
    conn.freezing = False
    plain = inv.store_leftovers(conn, 1, DAY, dish="B", location_id=loc(conn, "Gefrierschrank"))
    b = conn.execute("SELECT frozen_on FROM batch WHERE id = ?", (plain["batch_id"],)).fetchone()
    assert (b[0], plain["expires_on"]) == (None, "2026-10-23")


def test_refused_and_recreated(conn):
    canning = inv.save_recipe(
        conn,
        {
            "name": "Jam",
            "servings": 1,
            "canning_product": {"name": "Jam", "category_id": 1},
            "ingredients": [],
        },
    )
    for kw in ({"recipe_id": canning}, {"dish": "  "}, {}):
        with pytest.raises(InventoryError) as e:
            inv.store_leftovers(conn, 1, DAY, **kw)
        assert e.value.translation_key == "invalid_value"
    with pytest.raises(InventoryError):
        inv.store_leftovers(conn, 1, DAY, recipe_id=9999)
    rid = dish(conn)
    res = inv.store_leftovers(conn, 1, DAY, recipe_id=rid)
    inv.delete(conn, "recipe", rid)  # the protocol stays
    assert (
        conn.execute("SELECT recipe_id FROM canning WHERE id = ?", (res["id"],)).fetchone()[0]
        is None
    )
    conn.execute("DELETE FROM product WHERE name LIKE 'Reste:%'")
    conn.execute("DELETE FROM category WHERE name = 'Reste'")
    assert inv.leftover_category(conn) is None
    inv.store_leftovers(conn, 1, DAY, dish="New")
    assert inv.leftover_category(conn)


def test_cannings_one_row_when_part_is_frozen(conn):
    res = inv.store_leftovers(conn, 2, DAY, dish="C")
    pid = conn.execute("SELECT product_id FROM batch WHERE id = ?", (res["batch_id"],)).fetchone()[
        0
    ]
    inv.freeze(conn, pid, 1, today=DAY)
    assert len([r for r in inv.cannings(conn) if r["id"] == res["id"]]) == 1
    assert inv.save_canning(conn, {"id": res["id"], "notes": "x"})["batch_id"] == res["batch_id"]


async def test_websocket(ws) -> None:  # noqa: F811
    md = await master(ws)
    assert md["leftover_category_id"] == by_name(md["categories"], "Reste")["id"]
    store = {"type": "home_inventory/leftover_store", "servings": 2}
    res = (await ws.call({**store, "dish": "Gulasch", "made_on": "2026-10-20"}))["result"]
    assert (res["name"], res["charge"]) == ("Reste: Gulasch", "20261020-1")
    assert not (await ws.call(store))["success"]  # neither dish nor recipe
    assert not (await ws.call({**store, "dish": "a", "recipe_id": 1}))["success"]


async def test_service(hass: HomeAssistant, entry) -> None:  # noqa: F811
    await entry.runtime_data.run(dish, "Eintopf")
    res = await call(hass, "store_leftovers", recipe="eintopf", servings=3, made_on="2026-10-20")
    assert (res["name"], res["charge"], res["expires_on"]) == (
        "Reste: Eintopf",
        "20261020-1",
        "2026-10-23",
    )
