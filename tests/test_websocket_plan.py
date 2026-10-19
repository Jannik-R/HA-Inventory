"""Week planner websocket commands."""

from .test_websocket import ws  # noqa: F401


async def test_round_trip(ws, hass) -> None:  # noqa: F811
    window = {"type": "home_inventory/meal_plan", "start": "2026-10-19", "end": "2026-10-26"}
    assert (await ws.call(window))["result"] == {"household_servings": 3, "meals": []}
    entry = hass.config_entries.async_entries("home_inventory")[0]
    hass.config_entries.async_update_entry(entry, options={"household_servings": 5})
    data = {"day": "2026-10-19", "recipe_id": None, "text": "Pizza", "slot": 1, "servings": 2}
    mid = (await ws.call({"type": "home_inventory/meal_save", "data": data}))["result"]["id"]
    meal = {
        "id": mid,
        "day": "2026-10-19",
        "recipe_id": None,
        "name": "Pizza",
        "slot": 1,
        "servings": 2,
    }
    assert (await ws.call(window))["result"] == {"household_servings": 5, "meals": [meal]}
    bad = await ws.call({"type": "home_inventory/meal_save", "data": {**data, "servings": 0}})
    assert not bad["success"]
    assert not (await ws.call({"type": "home_inventory/meal_save", "data": {**data, "slot": 5}}))[
        "success"
    ]
    shift = {"type": "home_inventory/meal_shift", "day": "2026-10-19", "slot": 1, "apply": True}
    moved = (await ws.call(shift))["result"]["meals"]
    assert moved == [{"id": mid, "day": "2026-10-19", "slot": 1, "name": "Pizza"}]
    assert (await ws.call(window))["result"]["meals"][0]["day"] == "2026-10-20"
    assert (await ws.call({"type": "home_inventory/meal_delete", "meal_id": mid}))["success"]
    assert not (await ws.call({"type": "home_inventory/meal_delete", "meal_id": mid}))["success"]
