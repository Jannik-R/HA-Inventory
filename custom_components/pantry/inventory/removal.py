"""Deleting rows that are still in use: a dry run shows what it affects, then delete anyway."""

from __future__ import annotations

import json
import sqlite3

from .booking import correct, move
from .canning import charge
from .common import InventoryError
from .master import _deactivate_location, delete

_SUBTREE = (
    "WITH RECURSIVE sub(id, depth) AS (SELECT ?, 0 UNION ALL"
    " SELECT c.id, sub.depth + 1 FROM category c JOIN sub ON c.parent_id = sub.id)"
)
# Shown in this order; tables not listed here still show (after these), so nothing is hidden.
_ORDER = (
    "category",
    "product",
    "canning",
    "stock",
    "booking",
    "shopping_item",
    "recipe_ingredient",
    "meal_plan",
    "unit",
    "location",
    "defaults",
)
# Bookkeeping that the question would only clutter: batches go with products / stock, OFF tag
# links with their category, check marks with their shopping item.
_HIDDEN = {
    "batch",
    "category_off_tag",
    "off_tag",
    "recipe_step",
    "shopping_done",
    "shopping_done_product",
    "shopping_done_recipe",
    "shopping_recipe",
    "shopping_recipe_optional",
}


def _unit_ids(conn: sqlite3.Connection, unit_id: int) -> list[int]:
    """The unit and the units defined on it (they lose their meaning with it)."""
    rows = conn.execute("SELECT id FROM unit WHERE base_unit_id = ?", (unit_id,))
    return [unit_id, *(r[0] for r in rows)]


def force_delete(
    conn: sqlite3.Connection,
    table: str,
    row_id: int,
    move_to: int | None = None,
    user_id: str | None = None,
) -> None:
    """Delete with everything that uses the row (one transaction).

    Category: subcategories and their products (with stock and bookings) go too.
    Unit: units defined on it go; categories / products only lose the reference.
    Location: its stock moves to `move_to`, or is booked out as a correction.
    """
    if table == "category":
        cats = conn.execute(f"{_SUBTREE} SELECT id FROM sub ORDER BY depth DESC", (row_id,))
        ids = [r[0] for r in cats]
        marks = ", ".join("?" * len(ids))
        conn.execute(f"DELETE FROM product WHERE category_id IN ({marks})", ids)
        for cid in ids[:-1]:  # deepest first: parents are RESTRICT
            conn.execute("DELETE FROM category WHERE id = ?", (cid,))
    elif table == "unit":
        ids = _unit_ids(conn, row_id)
        marks = ", ".join("?" * len(ids))
        if conn.execute(f"SELECT 1 FROM defaults WHERE unit_id IN ({marks})", ids).fetchone():
            raise InventoryError("unit_is_default")
        conn.execute(f"UPDATE category SET unit_id = NULL WHERE unit_id IN ({marks})", ids)
        conn.execute(
            "UPDATE category SET min_stock = NULL, min_stock_unit_id = NULL"
            f" WHERE min_stock_unit_id IN ({marks})",
            ids,
        )
        conn.execute(
            "UPDATE product SET content_amount = NULL, content_unit_id = NULL"
            f" WHERE content_unit_id IN ({marks})",
            ids,
        )
        conn.execute(
            f"UPDATE recipe_ingredient SET amount = NULL, unit_id = NULL WHERE unit_id IN ({marks})",
            ids,
        )
        conn.execute("DELETE FROM unit WHERE base_unit_id = ?", (row_id,))
    elif table == "location":
        if move_to == row_id:
            raise InventoryError("invalid_value")
        rows = conn.execute(
            "SELECT batch_id, packages FROM stock WHERE location_id = ?", (row_id,)
        ).fetchall()
        for r in rows:
            if move_to is None:
                correct(conn, r["batch_id"], row_id, 0, user_id=user_id)
            else:
                move(conn, r["batch_id"], row_id, move_to, r["packages"], user_id=user_id)
        _deactivate_location(conn, row_id)
        return
    delete(conn, table, row_id)


def _watch(conn: sqlite3.Connection) -> None:
    """TEMP triggers that log OLD of every deleted / actually changed row (cascades included)."""
    conn.execute("CREATE TEMP TABLE _dry_log(tbl TEXT, rid INTEGER, action TEXT, row TEXT)")
    tables = conn.execute(
        "SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%'"
    ).fetchall()
    for (t,) in tables:
        cols = [r["name"] for r in conn.execute(f'PRAGMA table_info("{t}")')]
        old = ", ".join(f"'{c}', OLD.\"{c}\"" for c in cols)
        changed = " OR ".join(f'OLD."{c}" IS NOT NEW."{c}"' for c in cols)
        for action, event, cond in (
            ("delete", "DELETE", ""),
            ("change", "UPDATE", f" WHEN {changed}"),
        ):
            conn.execute(
                f'CREATE TEMP TRIGGER "_dry_{action}_{t}" AFTER {event} ON main."{t}"{cond}'
                f" BEGIN INSERT INTO _dry_log VALUES ('{t}', OLD.rowid, '{action}',"
                f" json_object({old})); END"
            )


def _label(conn: sqlite3.Connection, table: str, row: dict) -> str | None:
    """Readable name of a row (looked up after the rollback); None when it has none."""
    if "name" in row:
        return row["name"]
    if table == "stock":
        r = conn.execute(
            "SELECT p.name FROM batch b JOIN product p ON p.id = b.product_id WHERE b.id = ?",
            (row["batch_id"],),
        ).fetchone()
    elif table == "shopping_item":
        ref = (
            ("product", row["product_id"])
            if row["product_id"]
            else ("category", row["category_id"])
        )
        r = conn.execute(f"SELECT name FROM {ref[0]} WHERE id = ?", (ref[1],)).fetchone()
    elif table == "meal_plan":
        return row["text"]
    elif table == "canning":
        return charge(row["made_on"], row["seq"])
    elif table == "recipe_ingredient":
        r = conn.execute("SELECT name FROM recipe WHERE id = ?", (row["recipe_id"],)).fetchone()
    else:
        return None
    return r[0] if r else None


def delete_impact(conn: sqlite3.Connection, table: str, row_id: int) -> dict:
    """Dry run of `force_delete` (rolled back): every row it deletes or changes, by table.

    `blocked`: error key when it cannot be deleted at all. `groups`: one per table and action
    ("delete" / "change"; rows added, e.g. bookings of a correction, are not listed), with the
    rows' names (distinct, sorted) or only a count, and the packages for stock.
    The row itself is not listed. Triggers log only touched rows, so the cost does not grow
    with the size of the database.
    """
    conn.execute("SAVEPOINT dry_run")
    try:
        _watch(conn)
        force_delete(conn, table, row_id)
        log = conn.execute("SELECT tbl, rid, action, row FROM _dry_log").fetchall()
    except InventoryError as err:
        return {"blocked": err.translation_key, "groups": []}
    finally:  # also drops the temp triggers / table created inside the savepoint
        conn.execute("ROLLBACK TO dry_run")
        conn.execute("RELEASE dry_run")
    deleted = {(t, rid) for t, rid, action, _ in log if action == "delete"}
    found: dict[tuple[str, str], dict[int, dict]] = {}
    for t, rid, action, row in log:
        if (
            t in _HIDDEN
            or (t == "recipe_ingredient" and action == "delete")
            or (action == "change" and (t, rid) in deleted)
        ):
            continue
        r = json.loads(row)
        if t == table and r.get("id") == row_id:
            continue
        found.setdefault((t, action), {}).setdefault(rid, r)  # first state = original
    groups = []
    for (t, action), rows in sorted(
        found.items(),
        key=lambda kv: (
            _ORDER.index(kv[0][0]) if kv[0][0] in _ORDER else len(_ORDER),
            kv[0][0],
            kv[0][1] != "delete",
        ),
    ):
        names = sorted({n for r in rows.values() if (n := _label(conn, t, r))})
        group = {"kind": f"{action}.{t}", "count": len(rows), "names": names}
        if t == "stock":
            group["packages"] = sum(r["packages"] for r in rows.values())
        groups.append(group)
    return {"blocked": None, "groups": groups}
