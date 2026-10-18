"""Week planner: save / update / validation, range, delete, recipe delete keeps the entry."""

from datetime import date, time

import pytest

from custom_components.pantry import inventory


def recipe(conn, name="Pasta") -> int:
    return inventory.save_recipe(conn, {"name": name, "servings": 2, "ingredients": []})


def meal(**kw) -> dict:
    return {"day": "2026-10-19", "recipe_id": None, "text": "Pizza", "slot": 1, "servings": 3, **kw}


def test_save_free_text_and_recipe(conn) -> None:
    free = inventory.save_meal(conn, meal(text="  Pizza "))
    rid = recipe(conn)
    linked = inventory.save_meal(conn, meal(recipe_id=rid, text="ignored", servings=4))
    rows = inventory.meals(conn, "2026-10-19", "2026-10-20")
    assert [(r["id"], r["name"], r["recipe_id"], r["servings"]) for r in rows] == [
        (free, "Pizza", None, 3),
        (linked, "Pasta", rid, 4),
    ]


def test_update(conn) -> None:
    mid = inventory.save_meal(conn, meal())
    inventory.save_meal(conn, meal(id=mid, day="2026-10-21", text="Suppe", servings=1))
    assert inventory.meals(conn, "2026-10-21", "2026-10-22")[0]["name"] == "Suppe"
    assert inventory.meals(conn, "2026-10-19", "2026-10-21") == []


@pytest.mark.parametrize(
    ("data", "error"),
    [
        ({"day": "2026-13-01"}, "invalid_value"),
        ({"day": None}, "invalid_value"),
        ({"text": "  "}, "invalid_value"),
        ({"servings": 0}, "invalid_value"),
        ({"slot": 5}, "invalid_value"),
        ({"slot": -1}, "invalid_value"),
        ({"recipe_id": 999}, "not_found"),
        ({"id": 999}, "not_found"),
    ],
)
def test_errors(conn, data, error) -> None:
    with pytest.raises(inventory.InventoryError) as err:
        inventory.save_meal(conn, meal(**data))
    assert err.value.translation_key == error


def test_range_and_order(conn) -> None:
    ids = [inventory.save_meal(conn, meal(day=d, text=d)) for d in ("2026-10-21", "2026-10-19")]
    ids.append(inventory.save_meal(conn, meal(day="2026-10-19", text="b", slot=0)))
    inventory.save_meal(conn, meal(day="2026-10-26", text="end"))  # end is exclusive
    rows = inventory.meals(conn, "2026-10-19", "2026-10-26")
    assert [r["id"] for r in rows] == [ids[2], ids[1], ids[0]]  # day, then slot


def test_delete(conn) -> None:
    mid = inventory.save_meal(conn, meal())
    inventory.delete_meal(conn, mid)
    with pytest.raises(inventory.InventoryError):
        inventory.delete_meal(conn, mid)


def test_recipe_delete_keeps_entry(conn) -> None:
    rid = recipe(conn)
    mid = inventory.save_meal(conn, meal(recipe_id=rid))
    impact = inventory.delete_impact(conn, "recipe", rid)
    assert {"kind": "change.meal_plan", "count": 1, "names": ["Pasta"]} in impact["groups"]
    inventory.force_delete(conn, "recipe", rid)
    row = inventory.meals(conn, "2026-10-19", "2026-10-20")[0]
    assert (row["id"], row["recipe_id"], row["name"]) == (mid, None, "Pasta")


def test_shift_meals(conn) -> None:
    def add(day: str, slot: int, text: str) -> int:
        return inventory.save_meal(conn, meal(day=day, slot=slot, text=text))

    a = add("2026-10-19", 3, "a")
    b = add("2026-10-19", 3, "b")  # same day and slot: moves together
    add("2026-10-19", 1, "lunch")  # other slot stays
    c = add("2026-10-20", 3, "c")
    add("2026-10-22", 3, "after gap")  # 21st is empty: chain stops

    plan = inventory.shift_meals(conn, "2026-10-19", 3, False)
    assert [(m["id"], m["day"], m["slot"], m["name"]) for m in plan] == [
        (a, "2026-10-19", 3, "a"),
        (b, "2026-10-19", 3, "b"),
        (c, "2026-10-20", 3, "c"),
    ]
    days = lambda: {m["name"]: m["day"] for m in inventory.meals(conn, "2026-10-19", "2026-10-30")}  # noqa: E731
    before = days()
    assert inventory.shift_meals(conn, "2026-10-19", 3, False) == plan and days() == before

    assert inventory.shift_meals(conn, "2026-10-19", 3, True) == plan
    assert days() == {
        **before,
        "a": "2026-10-20",
        "b": "2026-10-20",
        "c": "2026-10-21",
    }
    assert days()["lunch"] == "2026-10-19"


@pytest.mark.parametrize(("day", "slot"), [("2026-10-19", 2), ("2026-10-25", 1)])
def test_shift_meals_not_found(conn, day, slot) -> None:
    inventory.save_meal(conn, meal())
    with pytest.raises(inventory.InventoryError) as err:
        inventory.shift_meals(conn, day, slot, True)
    assert err.value.translation_key == "not_found"


def test_meal_times_pick_the_current_meal(conn):
    assert [t["start"] for t in inventory.meal_times(conn)] == [
        "05:00",
        "11:00",
        "14:30",
        "17:00",
        "20:30",
    ]
    assert inventory.meal_at(conn, time(4, 59)) == 4  # after midnight: still the late snack
    assert inventory.meal_at(conn, time(5, 0)) == 0
    assert inventory.meal_at(conn, time(12, 30)) == 1
    assert inventory.meal_at(conn, time(18, 0)) == 3
    inventory.save_meal_times(conn, ["06:00", "12:00", "15:00", "18:30", "22:00"])
    assert inventory.meal_at(conn, time(18, 0)) == 2
    for bad in (["06:00"] * 4, ["6:00", "12:00", "15:00", "18:30", "22:00"]):
        with pytest.raises(inventory.InventoryError, match="invalid_value"):
            inventory.save_meal_times(conn, bad)


def test_planned_recipes_skip_free_text(conn):
    pasta = recipe(conn)
    inventory.save_meal(conn, meal(slot=3, recipe_id=pasta, servings=4))
    inventory.save_meal(conn, meal(slot=3, text="Pizza vom Lieferdienst"))
    inventory.save_meal(conn, meal(slot=1, recipe_id=pasta))
    assert inventory.planned_recipes(conn, date(2026, 10, 19), 3) == [
        {"recipe_id": pasta, "servings": 4}
    ]
    assert inventory.planned_recipes(conn, date(2026, 10, 20), 3) == []
