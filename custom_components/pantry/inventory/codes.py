"""Services and automations: booking by barcode / label code, recipes and locations by name (no ids)."""

from __future__ import annotations

import sqlite3
from datetime import date, timedelta

from .booking import book_in, book_out
from .canning import save_canning
from .common import InventoryError, id_by_name
from .inherit import effective
from .labels import book_out_code
from .master import list_rows
from .meal_plan import save_meal
from .products import find_ean
from .shopping_recipes import set_shopping_recipe


def _product(conn: sqlite3.Connection, ean: str) -> dict:
    """Local product by EAN; unknown ones are created in the panel (category needs a human)."""
    if not (product := find_ean(conn, ean.strip())):
        raise InventoryError("product_unknown", code=ean.strip())
    return product


def _location(conn: sqlite3.Connection, name: str | None) -> int | None:
    if name is None:
        return None
    if (found := id_by_name(list_rows(conn, "location"), name)) is None:  # active ones only
        raise InventoryError("location_unknown", name=name)
    return found


def book_in_by_code(
    conn: sqlite3.Connection,
    code: str,
    packages: int,
    expires_on: date | str | None = None,
    location: str | None = None,
    user_id: str | None = None,
) -> dict:
    product = _product(conn, code)
    batch_id = book_in(
        conn, product["id"], packages, expires_on, _location(conn, location), "service", user_id
    )
    return {"product_id": product["id"], "batch_id": batch_id, "name": product["name"]}


def book_out_by_code(
    conn: sqlite3.Connection,
    code: str,
    packages: int = 1,
    location: str | None = None,
    user_id: str | None = None,
) -> dict:
    """EAN: `packages`, earliest expiry first. Label code (PTRY:...): exactly one package of its batch."""
    if code.strip().upper().startswith("PTRY:"):
        if (
            packages != 1 or location is not None
        ):  # the label names the batch; it is taken where it is
            raise InventoryError("invalid_value")
        return book_out_code(conn, code.strip()[5:], user_id)
    product = _product(conn, code)
    taken = book_out(
        conn,
        product["id"],
        packages,
        location_id=_location(conn, location),
        source="service",
        user_id=user_id,
    )
    return {"taken": taken, "name": product["name"]}


def _recipe(conn: sqlite3.Connection, name: str, canning: bool = False) -> sqlite3.Row:
    """Dish recipe or (canning) canning recipe by name, ignoring case."""
    rows = conn.execute(
        "SELECT * FROM recipe WHERE (canning_product_id IS NOT NULL) = ? ORDER BY id", (canning,)
    ).fetchall()
    if (found := id_by_name(rows, name)) is None:
        raise InventoryError("recipe_unknown", name=name)
    return next(r for r in rows if r["id"] == found)


def recipe_by_name(conn: sqlite3.Connection, recipe: str) -> int:
    """Any recipe (dish first, then canning recipe) by name, for printing."""
    try:
        return _recipe(conn, recipe)["id"]
    except InventoryError:
        return _recipe(conn, recipe, canning=True)["id"]


def shop_recipe_by_name(conn: sqlite3.Connection, recipe: str, servings: int) -> dict:
    """Put a recipe on the shopping list (again: its servings change, optional ones are dropped)."""
    recipe_id = _recipe(conn, recipe)["id"]
    set_shopping_recipe(conn, recipe_id, servings)
    return {"recipe_id": recipe_id}


def plan_meal_by_name(
    conn: sqlite3.Connection,
    day: date,
    slot: int,
    servings: int,
    recipe: str | None = None,
    text: str | None = None,
) -> dict:
    """Plan a recipe (by name) or free text."""
    recipe_id = _recipe(conn, recipe)["id"] if recipe else None
    data = {"day": day.isoformat(), "recipe_id": recipe_id, "text": text or "", "slot": slot}
    return {"meal_id": save_meal(conn, data | {"servings": servings})}


def canning_by_name(
    conn: sqlite3.Connection,
    recipe: str,
    made_on: date,
    jars: int | None = None,
    location: str | None = None,
    expires_on: date | None = None,
    notes: str | None = None,
    user_id: str | None = None,
) -> dict:
    """Protocol from a canning recipe: its product, jars (default: its yield), temperature and
    minutes; best-before = made-on date + shelf life unless given. Returns {id, batch_id, charge}."""
    r = _recipe(conn, recipe, canning=True)
    if expires_on is None and (
        days := effective(conn, r["canning_product_id"])["shelf_days"]["value"]
    ):
        expires_on = made_on + timedelta(days=days)
    data = {
        "made_on": made_on.isoformat(),
        "jars": jars or r["servings"],
        "recipe_id": r["id"],
        "location_id": _location(conn, location),
        "temp": r["canning_temp"],
        "minutes": r["canning_minutes"],
        "notes": notes,
        "expires_on": expires_on.isoformat() if expires_on else None,
    }
    return save_canning(conn, data, user_id, "service")
