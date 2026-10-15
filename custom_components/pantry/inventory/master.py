"""Master data: units, locations, categories (save, delete, lists)."""

from __future__ import annotations

import json
import sqlite3

from .common import COLUMNS, InventoryError, _now
from .inherit import _categories, _resolve, defaults


def _table(table: str) -> tuple[str, ...]:
    if table not in COLUMNS:
        raise ValueError(f"unknown table {table}")
    return COLUMNS[table]


def save(conn: sqlite3.Connection, table: str, data: dict) -> int:
    """Insert (no id) or update (id) a row; returns the id."""
    cols = _table(table)
    data = dict(data)
    row_id = data.pop("id", None)
    if not data:
        raise ValueError("no data")
    if unknown := set(data) - set(cols):
        raise ValueError(f"unknown columns for {table}: {sorted(unknown)}")
    if isinstance(data.get("off_tags"), list):
        data["off_tags"] = json.dumps(data["off_tags"])
    if "name" in data:
        if not isinstance(data["name"], str) or not data["name"].strip():
            raise InventoryError("invalid_value")
        data["name"] = data["name"].strip()
    if table == "unit":
        _check_unit(conn, row_id, data)
    if table == "category" and row_id is not None:
        _check_parent(conn, row_id, data.get("parent_id"))
    if table == "product":
        data["updated_at"] = _now()
    if row_id is None and "sort" in cols and "sort" not in data:  # new rows go last
        data["sort"] = conn.execute(f"SELECT coalesce(max(sort), 0) + 1 FROM {table}").fetchone()[0]
    names = list(data)
    try:
        if row_id is None:
            cur = conn.execute(
                f"INSERT INTO {table} ({', '.join(names)}) VALUES ({', '.join('?' * len(names))})",
                list(data.values()),
            )
            return cur.lastrowid
        cur = conn.execute(
            f"UPDATE {table} SET {', '.join(f'{n} = ?' for n in names)} WHERE id = ?",
            [*data.values(), row_id],
        )
    except sqlite3.IntegrityError as err:
        raise InventoryError("duplicate" if "UNIQUE" in str(err) else "invalid_value") from err
    if not cur.rowcount:
        raise InventoryError("not_found")
    return row_id


def _check_unit(conn: sqlite3.Connection, unit_id: int | None, data: dict) -> None:
    """Factor > 0; a base unit has no base itself, and a unit used as base cannot get one."""
    if ("factor" in data or unit_id is None) and not (data.get("factor") or 0) > 0:
        raise InventoryError("invalid_unit")
    base_id = data.get("base_unit_id")
    if base_id is None:
        return
    base = conn.execute("SELECT base_unit_id FROM unit WHERE id = ?", (base_id,)).fetchone()
    used_as_base = unit_id is not None and conn.execute(
        "SELECT 1 FROM unit WHERE base_unit_id = ?", (unit_id,)
    ).fetchone()
    if base is None or base_id == unit_id or base["base_unit_id"] is not None or used_as_base:
        raise InventoryError("invalid_unit")


def _check_parent(conn: sqlite3.Connection, category_id: int, parent_id: int | None) -> None:
    """The parent must not be the category itself or in its subtree."""
    cats = _categories(conn)
    while parent_id is not None and parent_id in cats:
        if parent_id == category_id:
            raise InventoryError("invalid_parent")
        parent_id = cats[parent_id]["parent_id"]


def delete(conn: sqlite3.Connection, table: str, row_id: int) -> None:
    """Delete a row. A product goes with its batches and stock (FK cascade) and their bookings."""
    _table(table)
    if table == "product":
        # booking.batch_id has no FK (the log outlives stock rows), so clean it up explicitly.
        conn.execute(
            "DELETE FROM booking WHERE batch_id IN (SELECT id FROM batch WHERE product_id = ?)", (row_id,)
        )
    try:
        cur = conn.execute(f"DELETE FROM {table} WHERE id = ?", (row_id,))
    except sqlite3.IntegrityError as err:
        raise InventoryError("in_use") from err
    if not cur.rowcount:
        raise InventoryError("not_found")


def master_data(conn: sqlite3.Connection) -> dict:
    """Units, locations and categories (with effective values) for the settings view."""
    cats, dflt = _categories(conn), defaults(conn)
    return {
        "units": list_rows(conn, "unit"),
        "locations": list_rows(conn, "location"),
        "categories": [
            {**c, "off_tags": json.loads(c["off_tags"]), "effective": _resolve(cats, None, c["id"], dflt)}
            for c in list_rows(conn, "category")
        ],
        "defaults": dflt,
    }


def list_rows(conn: sqlite3.Connection, table: str) -> list[dict]:
    _table(table)
    order = "sort, id" if table in ("location", "category") else "id"
    return [dict(r) for r in conn.execute(f"SELECT * FROM {table} ORDER BY {order}")]
