"""Leftovers of a cooked dish as a charge: the product "Reste: <dish>" in the root Reste, one
package per serving, booked in by a protocol of kind 'leftover' (charge, label, freezer rule)."""

from __future__ import annotations

import sqlite3
from datetime import date, timedelta

from ..migration_29 import PREFIX, ROOT, add_leftovers
from .canning import save_canning
from .codes import _location, _recipe
from .common import InventoryError, _exists
from .inherit import effective
from .products import add_product


def _root(conn: sqlite3.Connection) -> int | None:
    sql = "SELECT id FROM category WHERE parent_id IS NULL AND name = ?"
    return (row := conn.execute(sql, (ROOT,)).fetchone()) and row[0]


def leftover_category(conn: sqlite3.Connection) -> int | None:
    """The root category of the leftovers (None if it was deleted; the next use creates it)."""
    return _root(conn)


def store_leftovers(
    conn: sqlite3.Connection,
    servings: int,
    made_on: date,
    recipe_id: int | None = None,
    dish: str | None = None,
    location_id: int | None = None,
    expires_on: date | str | None = None,
    notes: str | None = None,
    user_id: str | None = None,
    source: str = "manual",
) -> dict:
    """Book `servings` leftovers of a dish in as a new charge; the product is found or created.
    The dish is a dish recipe (its name) or a free name. Returns {id, batch_id, charge, name, expires_on}."""
    if recipe_id is not None:
        row = conn.execute(
            "SELECT name, canning_product_id FROM recipe WHERE id = ?", (recipe_id,)
        ).fetchone()
        if row is None:
            raise InventoryError("not_found")
        if row["canning_product_id"] is not None:
            raise InventoryError("invalid_value")
        dish = row["name"]
    dish = (dish or "").strip()
    if not dish:
        raise InventoryError("invalid_value")
    _exists(conn, "location", location_id)
    name = PREFIX + dish
    found = conn.execute(
        "SELECT id FROM product WHERE name = ? ORDER BY id LIMIT 1", (name,)
    ).fetchone()
    if found:
        product_id = found[0]
    else:
        if _root(conn) is None:
            add_leftovers(
                conn
            )  # shortcut: found by name; a renamed root is created again on next use
        product_id = add_product(conn, {"name": name, "category_id": _root(conn)})
    if expires_on is None and (days := effective(conn, product_id)["shelf_days"]["value"]):
        expires_on = made_on + timedelta(days=days)
    result = save_canning(
        conn,
        {
            "made_on": made_on,
            "jars": servings,
            "kind": "leftover",
            "recipe_id": recipe_id,
            "product_id": product_id,
            "location_id": location_id,
            "expires_on": expires_on,
            "notes": notes,
        },
        user_id,
        source,
    )
    stored = conn.execute(
        "SELECT expires_on FROM batch WHERE id = ?", (result["batch_id"],)
    ).fetchone()
    return {**result, "name": name, "expires_on": stored[0]}


def leftovers_by_name(
    conn: sqlite3.Connection,
    recipe: str,
    servings: int,
    made_on: date,
    location: str | None = None,
    notes: str | None = None,
    user_id: str | None = None,
) -> dict:
    """Service form of store_leftovers: dish recipe and location by name."""
    return store_leftovers(
        conn,
        servings,
        made_on,
        _recipe(conn, recipe)["id"],
        None,
        _location(conn, location),
        None,
        notes,
        user_id,
        "service",
    )
