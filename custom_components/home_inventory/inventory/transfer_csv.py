"""CSV transfer: export products and stock, read a CSV file into rows (see transfer_apply)."""

from __future__ import annotations

import csv
import io
import sqlite3
from datetime import date

from .canning import charge
from .common import InventoryError
from .inherit import _categories, _path

MAX_ROWS = 5000
PRODUCT_COLS = (
    "name", "brand", "category", "ean", "content_amount", "content_unit", "location",
    "expiry_type", "warn_days", "shelf_days", "opened_days", "frozen_days", "min_packages",
    "diet", "allergens",
)  # fmt: skip
STOCK_COLS = (
    "name", "brand", "location", "packages", "expires_on", "opened_on", "frozen_on", "remaining",
    "charge",
)  # fmt: skip
NO_ALLERGENS = "none"  # own value '' (none of the 14) as a cell; an empty cell means inherited


_FORMULA = "=+-@"
_TEXT = ("name", "brand", "category")  # columns that get the formula guard


def _safe(value: object) -> object:
    """Spreadsheets run text starting with = + - @ as a formula: export it with a leading '."""
    return "'" + value if isinstance(value, str) and value[:1] and value[0] in _FORMULA else value


def _cell(value: object) -> str:
    if value is None:
        return ""
    if isinstance(value, float):
        return str(int(value) if value.is_integer() else value).replace(".", ",")
    return str(value)


def _write(cols: tuple[str, ...], rows: list[list]) -> str:
    """`;`, CRLF, decimal comma; the panel adds the BOM when it saves the file."""
    out = io.StringIO(newline="")
    w = csv.writer(out, delimiter=";", lineterminator="\r\n")
    w.writerow(cols)
    w.writerows([_cell(v) for v in row] for row in rows)
    return out.getvalue()


def export_products(conn: sqlite3.Connection) -> str:
    """Only the product's own values: an empty cell is inherited (or not set)."""
    cats = _categories(conn)
    units = {r["id"]: r["name"] for r in conn.execute("SELECT id, name FROM unit")}
    locs = {r["id"]: r["name"] for r in conn.execute("SELECT id, name FROM location")}
    rows = []
    for p in conn.execute("SELECT * FROM product ORDER BY name, id"):
        allergens = NO_ALLERGENS if p["allergens"] == "" else p["allergens"]
        rows.append(
            [_safe(p["name"]), _safe(p["brand"]), _safe(" > ".join(_path(cats, p["category_id"]))), p["ean"],
             p["content_amount"], units.get(p["content_unit_id"]), locs.get(p["default_location_id"]),
             p["expiry_type"], p["warn_days"], p["shelf_days"], p["opened_days"], p["frozen_days"],
             p["min_packages"], p["diet"], allergens]
        )  # fmt: skip
    return _write(PRODUCT_COLS, rows)


def export_stock(conn: sqlite3.Connection) -> str:
    rows = conn.execute(
        "SELECT p.name, p.brand, l.name AS loc, s.packages, b.expires_on, b.opened_on, b.frozen_on,"
        " b.remaining, c.made_on, c.seq FROM stock s JOIN batch b ON b.id = s.batch_id"
        " JOIN product p ON p.id = b.product_id JOIN location l ON l.id = s.location_id"
        " LEFT JOIN canning c ON c.id = b.canning_id ORDER BY p.name, l.name, b.expires_on, b.id"
    )
    return _write(
        STOCK_COLS,
        [
            [_safe(r["name"]), _safe(r["brand"]), r["loc"], r["packages"], r["expires_on"], r["opened_on"],
             r["frozen_on"], None if r["remaining"] == 1 else r["remaining"],
             charge(r["made_on"], r["seq"]) if r["made_on"] else None]
            for r in rows
        ],
    )  # fmt: skip


def parse_csv(text: str, required: tuple[str, ...]) -> list[dict]:
    """Rows as dicts (header names lower case, values stripped, `_line` = file line).

    The delimiter is the one of `;` `,` tab that occurs most in the header; unknown columns
    stay in the dicts (callers ignore them); blank lines are skipped."""
    text = text.removeprefix("﻿")
    head = text.split("\n", 1)[0]
    delimiter = max(";,\t", key=head.count)  # ties: ";"
    reader = csv.reader(io.StringIO(text, newline=""), delimiter=delimiter)
    try:
        header = [h.strip().casefold() for h in next(reader, [])]
        for column in required:
            if column not in header:
                raise InventoryError("csv_header", column=column)
        rows = []
        for cells in reader:
            if not any(c.strip() for c in cells):
                continue
            if len(rows) >= MAX_ROWS:
                raise InventoryError("csv_rows", max=MAX_ROWS)
            row = dict(zip(header, (c.strip() for c in cells), strict=False))
            for key in _TEXT:  # undo the export's formula guard (only where it was added)
                if row.get(key, "")[1:2] and row[key][0] == "'" and row[key][1] in _FORMULA:
                    row[key] = row[key][1:]
            rows.append({**row, "_line": reader.line_num})
    except csv.Error:
        raise InventoryError("invalid_value") from None
    return rows


def num(value: str | None) -> float | None:
    """Number with decimal comma or point; empty -> None."""
    if not value or not value.strip():
        return None
    try:
        out = float(value.strip().replace(",", "."))
    except ValueError:
        raise InventoryError("invalid_value") from None
    if out != out or out in (float("inf"), float("-inf")):
        raise InventoryError("invalid_value")
    return out


def day(value: str | None) -> str | None:
    """YYYY-MM-DD or DD.MM.YYYY -> ISO; empty -> None."""
    if not value or not value.strip():
        return None
    v = value.strip()
    try:
        if "." in v:
            d, m, y = v.split(".")
            return date(int(y), int(m), int(d)).isoformat()
        return date.fromisoformat(v).isoformat()
    except ValueError:
        raise InventoryError("invalid_date") from None
