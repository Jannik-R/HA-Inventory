"""Master data: units, locations, categories (save, delete, lists)."""

from __future__ import annotations

import sqlite3

from .common import COLUMNS, INHERITED, InventoryError, _exists, _now
from .inherit import _categories, _resolve, category_tags, defaults, set_tags


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
    tags = data.pop("off_tags", None)  # stored in off_tag / category_off_tag
    if tags is not None and not (isinstance(tags, list) and all(isinstance(x, str) for x in tags)):
        raise ValueError("off_tags must be a list of strings")
    if "name" in data:
        if not isinstance(data["name"], str) or not data["name"].strip():
            raise InventoryError("invalid_value")
        data["name"] = data["name"].strip()
    if table == "product" and "ean" in data:
        data["ean"] = _check_ean(data["ean"])
    if table == "unit":
        _check_unit(conn, row_id, data)
    if table == "category" and row_id is not None:
        _check_parent(conn, row_id, data.get("parent_id"))
    if table == "product":
        data["updated_at"] = _now()
    if row_id is None and "sort" in cols and "sort" not in data:  # new rows go last
        data["sort"] = conn.execute(f"SELECT coalesce(max(sort), 0) + 1 FROM {table}").fetchone()[0]
    if table == "location" and row_id is None and (old := _inactive_location(conn, data)):
        row_id = old  # adding a deactivated name brings that location back
        data["active"] = 1
    names = list(data)
    try:
        if row_id is None:
            row_id = conn.execute(
                f"INSERT INTO {table} ({', '.join(names)}) VALUES ({', '.join('?' * len(names))})",
                list(data.values()),
            ).lastrowid
        elif names and not conn.execute(
            f"UPDATE {table} SET {', '.join(f'{n} = ?' for n in names)} WHERE id = ?",
            [*data.values(), row_id],
        ).rowcount:
            raise InventoryError("not_found")
    except sqlite3.IntegrityError as err:
        raise InventoryError("duplicate" if "UNIQUE" in str(err) else "invalid_value") from err
    if tags is not None:
        if table != "category":
            raise ValueError("off_tags only for categories")
        set_tags(conn, row_id, tags)
    return row_id


def _check_ean(ean: object) -> str | None:
    """None / blank -> no EAN; otherwise 8 to 14 ASCII digits."""
    if ean is None or (isinstance(ean, str) and not ean.strip()):
        return None
    if not (isinstance(ean, str) and (ean := ean.strip()).isascii() and ean.isdigit() and 8 <= len(ean) <= 14):
        raise InventoryError("invalid_ean")
    return ean


def _inactive_location(conn: sqlite3.Connection, data: dict) -> int | None:
    row = conn.execute(
        "SELECT id FROM location WHERE name = ? AND NOT active", (data.get("name"),)
    ).fetchone()
    return row["id"] if row else None


def save_defaults(conn: sqlite3.Connection, data: dict) -> None:
    """Change the integration-wide defaults (root of inheritance); all four are given."""
    if set(data) != set(INHERITED):
        raise ValueError(f"defaults need exactly {INHERITED}")
    if data["unit_id"] is None or data["expiry_type"] is None or data["warn_days"] is None:
        raise InventoryError("invalid_value")
    if data["default_location_id"] is not None:
        _exists(conn, "location", data["default_location_id"])
    try:
        conn.execute(
            f"INSERT INTO defaults (id, {', '.join(INHERITED)}) VALUES (1, ?, ?, ?, ?)"
            f" ON CONFLICT (id) DO UPDATE SET {', '.join(f'{k} = excluded.{k}' for k in INHERITED)}",
            [data[k] for k in INHERITED],
        )
    except sqlite3.IntegrityError as err:
        raise InventoryError("invalid_value") from err


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
    """Delete a row. A product goes with its batches, stock and bookings (FK cascade).
    A location is only deactivated (bookings keep referring to it); it must be empty."""
    _table(table)
    if table == "location":
        _deactivate_location(conn, row_id)
        return
    try:
        cur = conn.execute(f"DELETE FROM {table} WHERE id = ?", (row_id,))
    except sqlite3.IntegrityError as err:
        raise InventoryError("in_use") from err
    if not cur.rowcount:
        raise InventoryError("not_found")


def _deactivate_location(conn: sqlite3.Connection, location_id: int) -> None:
    """Hide a location everywhere; defaults pointing to it fall back to inheritance."""
    _exists(conn, "location", location_id)
    if conn.execute("SELECT 1 FROM stock WHERE location_id = ?", (location_id,)).fetchone():
        raise InventoryError("location_has_stock")
    conn.execute("UPDATE location SET active = 0 WHERE id = ?", (location_id,))
    for table in ("category", "product", "defaults"):
        conn.execute(
            f"UPDATE {table} SET default_location_id = NULL WHERE default_location_id = ?",
            (location_id,),
        )


def master_data(conn: sqlite3.Connection) -> dict:
    """Units, active locations and categories (with effective values) for the settings view."""
    cats, dflt, tags = _categories(conn), defaults(conn), category_tags(conn)
    return {
        "units": list_rows(conn, "unit"),
        "locations": list_rows(conn, "location"),
        "categories": [
            {**c, "off_tags": tags.get(c["id"], []), "effective": _resolve(cats, None, c["id"], dflt)}
            for c in list_rows(conn, "category")
        ],
        "defaults": dflt,
    }


def list_rows(conn: sqlite3.Connection, table: str) -> list[dict]:
    _table(table)
    order = "sort, id" if table in ("location", "category") else "id"
    where = " WHERE active" if table == "location" else ""
    return [dict(r) for r in conn.execute(f"SELECT * FROM {table}{where} ORDER BY {order}")]
