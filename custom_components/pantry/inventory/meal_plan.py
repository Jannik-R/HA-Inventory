"""Week planner: dishes per day, from a recipe or free text; start times of the meals."""

from __future__ import annotations

import sqlite3
from datetime import date, time, timedelta

from .common import InventoryError


def meals(conn: sqlite3.Connection, start: str, end: str) -> list[dict]:
    """Dishes of the days start <= day < end (ISO dates), by day, slot, then entry order."""
    rows = conn.execute(
        "SELECT m.id, m.day, m.recipe_id, COALESCE(r.name, m.text) AS name, m.slot, m.servings"
        " FROM meal_plan m LEFT JOIN recipe r ON r.id = m.recipe_id"
        " WHERE m.day >= ? AND m.day < ? ORDER BY m.day, m.slot, m.id",
        (start, end),
    )
    return [dict(r) for r in rows]


def save_meal(conn: sqlite3.Connection, data: dict) -> int:
    """Insert / update a dish (`id` given = update); returns the id."""
    try:
        day = date.fromisoformat(data["day"]).isoformat()
    except (ValueError, TypeError) as err:
        raise InventoryError("invalid_value") from err
    if (recipe_id := data.get("recipe_id")) is not None:
        row = conn.execute("SELECT name FROM recipe WHERE id = ?", (recipe_id,)).fetchone()
        if not row:
            raise InventoryError("not_found")
        text = row["name"]
    elif not (text := (data.get("text") or "").strip()):
        raise InventoryError("invalid_value")
    values = (day, recipe_id, text, data["slot"], data["servings"])
    try:
        if (meal_id := data.get("id")) is None:
            return conn.execute(
                "INSERT INTO meal_plan (day, recipe_id, text, slot, servings) VALUES (?, ?, ?, ?, ?)",
                values,
            ).lastrowid
        cur = conn.execute(
            "UPDATE meal_plan SET day = ?, recipe_id = ?, text = ?, slot = ?, servings = ? WHERE id = ?",
            (*values, meal_id),
        )
    except sqlite3.IntegrityError as err:
        raise InventoryError("invalid_value") from err
    if not cur.rowcount:
        raise InventoryError("not_found")
    return meal_id


def delete_meal(conn: sqlite3.Connection, meal_id: int) -> None:
    if not conn.execute("DELETE FROM meal_plan WHERE id = ?", (meal_id,)).rowcount:
        raise InventoryError("not_found")


def shift_meals(conn: sqlite3.Connection, day: str, slot: int, apply: bool) -> list[dict]:
    """Dishes of `slot` from `day` on up to the first day without one; apply = move each a day later."""
    found: list[dict] = []
    current = date.fromisoformat(day)
    while rows := conn.execute(
        "SELECT id, day, slot, text AS name FROM meal_plan WHERE day = ? AND slot = ? ORDER BY id",
        (current.isoformat(), slot),
    ).fetchall():
        found += [dict(r) for r in rows]
        current += timedelta(days=1)
    if not found:
        raise InventoryError("not_found")
    if apply:  # one UPDATE per row; day has no unique constraint, so order does not matter
        conn.executemany(
            "UPDATE meal_plan SET day = date(day, '+1 day') WHERE id = ?",
            [(m["id"],) for m in found],
        )
    return found


def meal_times(conn: sqlite3.Connection) -> list[dict]:
    """Start time ("HH:MM") per meal slot 0..4."""
    return [dict(r) for r in conn.execute("SELECT slot, start FROM meal_time ORDER BY slot")]


def save_meal_times(conn: sqlite3.Connection, starts: list[str]) -> None:
    """Five start times, slot 0..4 in order."""
    if len(starts) != 5:
        raise InventoryError("invalid_value")
    try:
        conn.executemany(
            "UPDATE meal_time SET start = ? WHERE slot = ?", [(s, n) for n, s in enumerate(starts)]
        )
    except sqlite3.IntegrityError as err:
        raise InventoryError("invalid_value") from err


def meal_at(conn: sqlite3.Connection, now: time) -> int:
    """The current meal: latest start <= now; before the first start of the day the last one
    (a late snack after midnight)."""
    clock = now.strftime("%H:%M")
    times = sorted((r["start"], r["slot"]) for r in meal_times(conn))
    past = [slot for start, slot in times if start <= clock]
    return past[-1] if past else times[-1][1]


def planned_recipes(conn: sqlite3.Connection, day: date, slot: int) -> list[dict]:
    """Dishes of that day and meal that are recipes: [{recipe_id, servings}] in plan order."""
    rows = conn.execute(
        "SELECT recipe_id, servings FROM meal_plan WHERE day = ? AND slot = ?"
        " AND recipe_id IS NOT NULL ORDER BY id",
        (day.isoformat(), slot),
    )
    return [dict(r) for r in rows]
