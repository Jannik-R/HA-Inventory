"""Labels: the QR code PTRY:<key>:<date>[:<charge>] names a batch (product EAN or P<id>, expiry
date, canning charge YYYYMMDD-n)."""

from __future__ import annotations

import re
import sqlite3
from datetime import date

from .booking import book_out
from .canning import charge
from .common import InventoryError, opened_until
from .inherit import effective
from .opened import open_package

_CODE = re.compile(r"(P?)(\d+):(\d{4}-\d{2}-\d{2})?(?::(\d{4})(\d{2})(\d{2})-(\d+))?")


def label_info(conn: sqlite3.Connection, batch_id: int) -> dict:
    """What the printer needs to draw a label of this batch, incl. the QR payload.

    An opened batch prints its effective expiry; the code keeps the batch key (product, date, charge)."""
    row = conn.execute(
        "SELECT p.id, p.name, p.brand, p.ean, b.expires_on, b.opened_on, c.made_on, c.seq"
        " FROM batch b JOIN product p ON p.id = b.product_id LEFT JOIN canning c ON c.id = b.canning_id"
        " WHERE b.id = ?",
        (batch_id,),
    ).fetchone()
    if not row:
        raise InventoryError("not_found")
    key = row["ean"] or f"P{row['id']}"
    code = f"PTRY:{key}:{row['expires_on'] or ''}"
    brand = row["brand"]
    if row["made_on"]:  # a canning charge: printed in the brand line, part of the code
        lot = charge(row["made_on"], row["seq"])
        code += f":{lot}"
        brand = " · ".join(filter(None, (brand, lot)))
    days = effective(conn, row["id"])["opened_days"]["value"]
    expires_on = opened_until(row["expires_on"], row["opened_on"], days)
    return {"name": row["name"], "brand": brand, "expires_on": expires_on, "code": code}


def _label_batch(conn: sqlite3.Connection, code: str, unopened: bool = False) -> tuple:
    """(product, batch id) a scanned label names (the part after PTRY:). Its batches of that key:
    one in stock first, opened first (shortcut: a closed package's label then takes the opened
    one; a label does not tell them apart); `unopened`: only the unopened batch."""
    m = _CODE.fullmatch(code.strip().upper())
    if not m:
        raise InventoryError("invalid_value")
    by_id, key, expires_on, y, mo, d, seq = m.groups()
    product = conn.execute(
        "SELECT id, name FROM product WHERE " + ("id" if by_id else "ean") + " = ?", (key,)
    ).fetchone()
    if not product:
        raise InventoryError("not_found")
    # a charge names its batches alone (its date may have been changed since printing)
    where, args = (
        ("b.canning_id = (SELECT id FROM canning WHERE made_on = ? AND seq = ?)", [f"{y}-{mo}-{d}", int(seq)])
        if seq
        else ("b.expires_on IS ? AND b.canning_id IS NULL", [expires_on])
    )  # fmt: skip
    if unopened:
        where += " AND b.opened_on IS NULL"
    batch = conn.execute(
        f"SELECT b.id FROM batch b WHERE b.product_id = ? AND {where}"
        " ORDER BY NOT EXISTS (SELECT 1 FROM stock s WHERE s.batch_id = b.id),"
        " b.opened_on IS NULL, b.opened_on LIMIT 1",
        [product["id"], *args],
    ).fetchone()
    if not batch:
        raise InventoryError("not_found")
    return product, batch["id"]


def book_out_code(conn: sqlite3.Connection, code: str, user_id: str | None = None) -> dict:
    """Book out one package of the batch a scanned label names (the part after PTRY:)."""
    product, batch_id = _label_batch(conn, code)
    taken = book_out(conn, product["id"], 1, batch_id, source="label", user_id=user_id)
    return {
        "taken": taken,
        "name": product["name"],
        "location": conn.execute(
            "SELECT name FROM location WHERE id = ?", (taken[0]["location_id"],)
        ).fetchone()[0],
    }


def open_code(
    conn: sqlite3.Connection,
    code: str,
    today: date | None = None,
    user_id: str | None = None,
    source: str = "label",
) -> dict:
    """Open one package of the batch a scanned label names (see open_package)."""
    product, batch_id = _label_batch(conn, code, unopened=True)
    return open_package(conn, product["id"], batch_id, today=today, source=source, user_id=user_id)
