"""CSV / Grocy import: add or update products, raise stock to the counted target.

One code path for the preview and the real run: the preview runs it inside a SAVEPOINT that is
always rolled back (like delete_impact). Every row has its own savepoint, so a bad row is an
`error` row of the report and the others still apply. Stock is only ever booked in."""

from __future__ import annotations

import sqlite3

from .booking import _add, _batch, _booking
from .common import InventoryError, check_ean
from .diet import DIETS, check_allergens
from .inherit import effective
from .master import save
from .suggest import suggest
from .transfer_csv import NO_ALLERGENS, day, num, parse_csv
from .transfer_ctx import Ctx

_INTS = ("warn_days", "shelf_days", "opened_days", "frozen_days", "min_packages")
_FIELD = {
    "category_id": "category",
    "content_unit_id": "content_unit",
    "default_location_id": "location",
}


def _int(value: str) -> int:
    n = num(value)
    if n != int(n) or n < 0:
        raise InventoryError("invalid_value")
    return int(n)


def _row(ctx: Ctx, row: dict, kind: str, fn) -> None:
    """Run one row in its own savepoint; an InventoryError becomes an error row."""
    ctx.line, count = row.get("_line", 0), len(ctx.rows)
    ctx.conn.execute("SAVEPOINT row")
    try:
        fn(ctx, row)
    except InventoryError as err:
        ctx.conn.execute("ROLLBACK TO row")
        del ctx.rows[count:]
        label = ctx.label(row.get("name", ""), row.get("brand"))
        ctx.add("error", kind, label, reason=err.translation_key)
    ctx.conn.execute("RELEASE row")


def _show(ctx: Ctx, column: str, value):
    if value is None:
        return None
    if column == "category_id":
        return ctx.category_path(value)
    table = {"content_unit_id": "unit", "default_location_id": "location"}.get(column)
    if table:
        return ctx.conn.execute(f"SELECT name FROM {table} WHERE id = ?", (value,)).fetchone()[0]
    return value


def _values(ctx: Ctx, row: dict, creating: bool) -> dict:
    """Column values of the non-empty cells of a products row."""
    new: dict = {}

    def get(key: str) -> str:
        return row.get(key) or ""

    if get("category"):
        new["category_id"] = ctx.category(row["category"])
    elif creating:
        if (cid := suggest(ctx.conn, [], row["name"])) is None:
            raise InventoryError("category_required")
        new["category_id"] = cid
    if get("ean"):
        new["ean"] = check_ean(row["ean"])
    if get("content_amount"):
        new["content_amount"] = num(row["content_amount"])
    if get("content_unit"):
        new["content_unit_id"] = ctx.unit(row["content_unit"])
    if get("location"):
        new["default_location_id"] = ctx.location(row["location"], bool(row.get("_freezer")))
    if get("expiry_type"):
        new["expiry_type"] = row["expiry_type"]  # the DB constraint rejects unknown values
    new |= {c: _int(row[c]) for c in _INTS if get(c)}
    if get("diet"):
        if row["diet"] not in DIETS:
            raise InventoryError("invalid_value")
        new["diet"] = row["diet"]
    if get("allergens"):
        try:  # an empty cell is "inherited"; the own value "none of the 14" is written `none`
            own = row["allergens"]
            new["allergens"] = "" if own == NO_ALLERGENS else check_allergens(own)
        except ValueError:
            raise InventoryError("invalid_value") from None
    return new


def _product(ctx: Ctx, row: dict) -> None:
    name, brand = row.get("name", ""), row["brand"] if "brand" in row else None
    if not name:
        raise InventoryError("invalid_value")
    found = ctx.products(name, brand)
    if len(found) > 1:
        raise InventoryError("ambiguous")
    old = found[0] if found else None
    new = _values(ctx, row, old is None)
    if old is not None:
        new = {k: v for k, v in new.items() if old[k] != v}
        if not new:
            ctx.quiet += 1
            return
    merged = {**(dict(old) if old else {}), **new}
    if (merged.get("content_amount") is None) != (merged.get("content_unit_id") is None):
        raise InventoryError("invalid_value")
    changes = [
        {
            "field": _FIELD.get(k, k),
            "old": _show(ctx, k, old[k] if old else None),
            "new": _show(ctx, k, v),
        }
        for k, v in new.items()
    ]
    if old is None:
        data = {"name": name, **({"brand": brand} if brand else {}), **new}
        ctx.created(name, save(ctx.conn, "product", data))
    else:
        save(ctx.conn, "product", {"id": old["id"], **new})
    ctx.add("update" if old else "create", "product", ctx.label(name, brand), changes)


def import_products(ctx: Ctx, rows: list[dict]) -> None:
    for row in rows:
        _row(ctx, row, "product", _product)


def _collect(ctx: Ctx, row: dict, groups: dict) -> None:
    """Check one stock row and add its target count to its (product, place, dates) group."""
    name, brand = row.get("name", ""), row["brand"] if "brand" in row else None
    found = ctx.products(name, brand) if name else []
    if len(found) > 1:
        raise InventoryError("ambiguous")
    if not found:
        raise InventoryError("not_found")
    product = found[0]
    label = ctx.label(product["name"], product["brand"])
    n = num(row.get("packages"))
    if n is None or n != int(n) or n < 0:
        raise InventoryError("invalid_value")
    level = num(row.get("remaining"))
    skip = "charge_skipped" if row.get("charge") else "partial_skipped"
    if row.get("charge") or (level is not None and level < 1):
        ctx.add("skip", "stock", label, reason=skip)
        return
    place = row.get("location")
    if place:  # an unknown location is created only when the group is booked (_book)
        location_id = ctx.find_location(place) or place.casefold()
    elif (
        location_id := effective(ctx.conn, product["id"])["default_location_id"]["value"]
    ) is None:
        raise InventoryError("location_required")
    key = (
        product["id"],
        location_id,
        day(row.get("expires_on")),
        day(row.get("opened_on")),
        day(row.get("frozen_on")),
    )
    group = groups.setdefault(key, [ctx.line, label, 0, place, bool(row.get("_freezer"))])
    group[2] += int(n)


def _book(ctx: Ctx, key: tuple, group: list) -> None:
    (product_id, location_id, expires, opened, frozen), (_, label, target, place, freezer) = (
        key,
        group,
    )
    conn = ctx.conn
    if isinstance(location_id, str):
        if target == 0:
            ctx.quiet += 1
            return
        location_id = ctx.location(place, freezer)
    have = conn.execute(
        "SELECT coalesce(sum(s.packages), 0) FROM stock s JOIN batch b ON b.id = s.batch_id"
        " WHERE b.product_id = ? AND b.expires_on IS ? AND b.opened_on IS ? AND b.frozen_on IS ?"
        " AND b.canning_id IS NULL AND b.remaining = 1 AND s.location_id = ?",
        (product_id, expires, opened, frozen, location_id),
    ).fetchone()[0]
    if target == have:
        ctx.quiet += 1
    elif target < have:
        ctx.add("skip", "stock", label, reason="more_in_stock")
    else:
        batch_id = _batch(conn, product_id, expires, opened_on=opened, frozen_on=frozen)
        _add(conn, batch_id, location_id, target - have)
        _booking(conn, "in", batch_id, location_id, target - have, "import", ctx.user_id)
        place = _show(ctx, "default_location_id", location_id)
        changes = [
            {"field": "packages", "old": have, "new": target},
            {"field": "location", "old": None, "new": place},
        ]
        for field, value in (("expires_on", expires), ("opened_on", opened), ("frozen_on", frozen)):
            if value:
                changes.append({"field": field, "old": None, "new": value})
        ctx.add("update" if have else "create", "stock", label, changes)


def import_stock(ctx: Ctx, rows: list[dict]) -> None:
    groups: dict[tuple, list] = {}
    for row in rows:
        _row(ctx, row, "stock", lambda c, r: _collect(c, r, groups))
    for key, group in groups.items():
        row = {"_line": group[0], "name": group[1], "_key": key, "_group": group}
        _row(ctx, row, "stock", lambda c, r: _book(c, r["_key"], r["_group"]))


def import_rows(
    conn: sqlite3.Connection,
    products: list[dict],
    stock: list[dict],
    apply: bool,
    user_id: str | None = None,
) -> dict:
    """Products first, then stock. Returns the report; nothing is kept unless `apply`."""
    ctx = Ctx(conn, user_id)
    conn.execute("SAVEPOINT import")
    try:
        import_products(ctx, products)
        import_stock(ctx, stock)
    finally:
        if not apply:
            conn.execute("ROLLBACK TO import")
        conn.execute("RELEASE import")
    return ctx.report()


def import_csv(
    conn: sqlite3.Connection, kind: str, text: str, apply: bool, user_id: str | None = None
) -> dict:
    """`kind`: "products" or "stock"."""
    if kind == "products":
        return import_rows(conn, parse_csv(text, ("name",)), [], apply, user_id)
    return import_rows(conn, [], parse_csv(text, ("name", "packages")), apply, user_id)
