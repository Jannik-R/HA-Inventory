"""Canning websocket commands."""

from .test_websocket import by_name, master, ws  # noqa: F401


async def test_round_trip(ws, hass_admin_user) -> None:  # noqa: F811
    md = await master(ws)
    cat = by_name(md["categories"], "Marmelade & Gelee")
    assert cat["effective"]["shelf_days"]["value"] == 365
    new = {
        "made_on": "2026-10-18",
        "jars": 5,
        "product": {"name": "Erdbeermarmelade", "category_id": cat["id"]},
        "temp": 80,
        "minutes": 10,
        "expires_on": "2027-10-18",
    }
    recipe = {
        "name": "Marmelade",
        "servings": 5,
        "canning_product": new["product"],
        "canning_temp": 80,
        "canning_minutes": 10,
        "ingredients": [],
    }
    rid = (await ws.call({"type": "home_inventory/recipe_save", "data": recipe}))["result"]["id"]
    new = {k: v for k, v in new.items() if k != "product"} | {"recipe_id": rid}
    save = {"type": "home_inventory/canning_save"}
    res = (await ws.call({**save, "data": new}))["result"]
    assert res["charge"] == "20261018-1"
    no_product = {k: v for k, v in new.items() if k != "recipe_id"}
    assert not (await ws.call({**save, "data": no_product}))["success"]
    edit = {"id": res["id"], "notes": "alle zu", "expires_on": "2027-11-01"}
    assert (await ws.call({**save, "data": edit}))["success"]
    (row,) = (await ws.call({"type": "home_inventory/cannings"}))["result"]
    assert (row["in_stock"], row["notes"], row["expires_on"]) == (5, "alle zu", "2027-11-01")
    hass_admin_user.groups = []  # deleting is admin only
    delete = {
        "type": "home_inventory/delete",
        "table": "canning",
        "row_id": res["id"],
        "force": True,
    }
    assert (await ws.call(delete))["error"]["code"] == "unauthorized"
