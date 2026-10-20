"""Services and automations: booking by barcode / label code, recipes and locations by name (no ids)."""

from __future__ import annotations

import sqlite3
from datetime import date, timedelta

from .booking import book_in, book_out
from .canning import save_canning
from .common import InventoryError, id_by_name
from .frozen import freeze, is_freezer, thaw
from .inherit import effective
from .labels import _label_batch, book_out_code, open_code
from .master import list_rows
from .meal_plan import save_meal
from .opened import open_package
from .products import find_ean
from .shopping_recipes import set_shopping_recipe


def _product(conn: sqlite3.Connection, ean: str) -> dict:
    """Local product by EAN, else by name (voice, AI); unknown ones are created in the panel
    (category needs a human)."""
    if product := find_ean(conn, ean.strip()):
        return product
    # shortcut: two products with the same name (other brand) -> the oldest; add brand matching if it bites
    rows = conn.execute("SELECT * FROM product ORDER BY id").fetchall()
    if (found := id_by_name(rows, ean)) is None:
        raise InventoryError("product_unknown", code=ean.strip())
    return dict(next(r for r in rows if r["id"] == found))


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
    today: date | None = None,
) -> dict:
    product = _product(conn, code)
    batch_id = book_in(
        conn, product["id"], packages, expires_on, _location(conn, location), "service", user_id,
        today,
    )  # fmt: skip
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


def open_by_code(
    conn: sqlite3.Connection,
    code: str,
    today: date,
    location: str | None = None,
    user_id: str | None = None,
) -> dict:
    """Open one package. EAN: earliest expiry first (at `location` if given). Label code: its batch."""
    if code.strip().upper().startswith("PTRY:"):
        if location is not None:  # the label names the batch; it is opened where it is
            raise InventoryError("invalid_value")
        return open_code(conn, code.strip()[5:], today, user_id, "service")
    product = _product(conn, code)
    return open_package(
        conn, product["id"], location_id=_location(conn, location), today=today,
        source="service", user_id=user_id,
    )  # fmt: skip


def frozen_by_code(
    conn: sqlite3.Connection,
    code: str,
    today: date,
    thawing: bool = False,
    packages: int = 1,
    location: str | None = None,
    to_location: str | None = None,
    user_id: str | None = None,
) -> dict:
    """Freeze (or thaw) packages. EAN / name: earliest date first (from `location` if given), to
    `to_location` (default: first freezer / the product's location). Label code: its batch."""
    batch_id = None
    if code.strip().upper().startswith("PTRY:"):
        product, batch_id = _label_batch(conn, code.strip()[5:])
    else:
        product = _product(conn, code)
    return (thaw if thawing else freeze)(
        conn, product["id"], packages, batch_id, _location(conn, location),
        _location(conn, to_location), today, "service", user_id,
    )  # fmt: skip


def freeze_scan(
    conn: sqlite3.Connection,
    code: str,
    today: date,
    location_id: int | None = None,
    user_id: str | None = None,
) -> dict:
    """Scan mode Einfrieren: one package. A label of a frozen batch thaws it, any other label
    freezes its batch; EAN / name freezes the earliest fresh one. `location_id` (a scanned
    location): the target when it is a freezer, else where the package comes from.
    Returns the freeze / thaw result plus `thaw`."""
    batch_id, thawing = None, False
    if code.strip().upper().startswith("PTRY:"):
        product, batch_id = _label_batch(conn, code.strip()[5:])
        thawing = bool(
            conn.execute("SELECT frozen_on FROM batch WHERE id = ?", (batch_id,)).fetchone()[0]
        )
    else:
        product = _product(conn, code)
    into = location_id is not None and is_freezer(conn, location_id)
    from_id, to_id = (None, location_id) if into != thawing else (location_id, None)
    fn = thaw if thawing else freeze
    res = fn(conn, product["id"], 1, batch_id, from_id, to_id, today, "panel", user_id)
    return {**res, "thaw": thawing}


def _recipe(conn: sqlite3.Connection, name: str, canning: str | None = None) -> sqlite3.Row:
    """Dish recipe or (canning: 'canning' / 'drying') process recipe of that kind by name,
    ignoring case."""
    rows = conn.execute(
        "SELECT * FROM recipe WHERE (canning_product_id IS NOT NULL) = ?"
        " AND (? IS NULL OR canning_kind = ?) ORDER BY id",
        (canning is not None, canning, canning),
    ).fetchall()
    if (found := id_by_name(rows, name)) is None:
        raise InventoryError("recipe_unknown", name=name)
    return next(r for r in rows if r["id"] == found)


def recipe_by_name(conn: sqlite3.Connection, recipe: str) -> int:
    """Any recipe (dish first, then canning recipe) by name, for printing."""
    try:
        return _recipe(conn, recipe)["id"]
    except InventoryError:
        try:
            return _recipe(conn, recipe, canning="canning")["id"]
        except InventoryError:
            return _recipe(conn, recipe, canning="drying")["id"]


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
    kind: str = "canning",
) -> dict:
    """Protocol from a canning (or drying) recipe: its product, jars (default: its yield),
    temperature and minutes; best-before = made-on date + shelf life unless given.
    Returns {id, batch_id, charge}."""
    r = _recipe(conn, recipe, canning=kind)
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
