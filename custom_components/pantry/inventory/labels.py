"""Labels: the QR code PTRY:<key>:<date>[:<charge>] names a batch (product EAN or P<id>, expiry
date, canning charge YYYYMMDD-n)."""

from __future__ import annotations

import re
import sqlite3

from .booking import book_out
from .canning import charge
from .common import InventoryError

_CODE = re.compile(r"(P?)(\d+):(\d{4}-\d{2}-\d{2})?(?::(\d{4})(\d{2})(\d{2})-(\d+))?")


def label_info(conn: sqlite3.Connection, batch_id: int) -> dict:
    """What the printer needs to draw a label of this batch, incl. the QR payload."""
    row = conn.execute(
        "SELECT p.id, p.name, p.brand, p.ean, b.expires_on, c.made_on, c.seq FROM batch b"
        " JOIN product p ON p.id = b.product_id LEFT JOIN canning c ON c.id = b.canning_id"
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
    return {"name": row["name"], "brand": brand, "expires_on": row["expires_on"], "code": code}


def book_out_code(conn: sqlite3.Connection, code: str, user_id: str | None = None) -> dict:
    """Book out one package of the batch a scanned label names (the part after PTRY:)."""
    m = _CODE.fullmatch(code.strip().upper())
    if not m:
        raise InventoryError("invalid_value")
    by_id, key, expires_on, y, mo, d, seq = m.groups()
    product = conn.execute(
        "SELECT id, name FROM product WHERE " + ("id" if by_id else "ean") + " = ?", (key,)
    ).fetchone()
    # a charge names its batch alone (its date may have been changed since printing)
    batch = product and (
        conn.execute(
            "SELECT b.id FROM batch b JOIN canning c ON c.id = b.canning_id"
            " WHERE b.product_id = ? AND c.made_on = ? AND c.seq = ?",
            (product["id"], f"{y}-{mo}-{d}", int(seq)),
        ).fetchone()
        if seq
        else conn.execute(
            "SELECT id FROM batch WHERE product_id = ? AND expires_on IS ? AND canning_id IS NULL",
            (product["id"], expires_on),
        ).fetchone()
    )
    if not batch:
        raise InventoryError("not_found")
    taken = book_out(conn, product["id"], 1, batch["id"], source="label", user_id=user_id)
    return {
        "taken": taken,
        "name": product["name"],
        "location": conn.execute(
            "SELECT name FROM location WHERE id = ?", (taken[0]["location_id"],)
        ).fetchone()[0],
    }
