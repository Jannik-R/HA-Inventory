"""Stocktaking per location: scan what is there, then the differences become corrections.

Not scanned = missing (corrected to the counted number, 0 if none), scanned but not in stock =
too many (booked in as a correction into the batch book_in would use). Source 'stocktake'.
"""

from __future__ import annotations

import sqlite3
from datetime import date, timedelta

from .booking import _stock_of, in_batch
from .canning import charge
from .codes import _product
from .common import InventoryError, _exists
from .corrections import correct
from .inherit import effective
from .labels import _label_batch


def _rows(conn: sqlite3.Connection, location_id: int, product_id: int, batch_id=None) -> list:
    sql = (
        "SELECT b.id AS batch_id, b.expires_on, b.opened_on, b.frozen_on, c.made_on, c.seq,"
        " ifnull(s.packages, 0) AS packages FROM batch b"
        " LEFT JOIN stock s ON s.batch_id = b.id AND s.location_id = ?"
        " LEFT JOIN canning c ON c.id = b.canning_id WHERE b.product_id = ?"
    )
    args: list = [location_id, product_id]
    if batch_id is None:
        sql += " AND s.packages IS NOT NULL"
    else:
        sql += " AND b.id = ?"
        args.append(batch_id)
    out = []
    for r in conn.execute(sql + " ORDER BY b.expires_on IS NULL, b.expires_on", args):
        row = dict(r)
        made_on, seq = row.pop("made_on"), row.pop("seq")
        row["charge"] = made_on and charge(made_on, seq)
        out.append(row)
    return out


def stocktake_scan(
    conn: sqlite3.Connection, location_id: int, code: str, today: date | None = None
) -> dict:
    """What a scan names at this location: the product and its batches there (a label code: its
    batch, also when it is not there). `shelf_date`: the date a new batch would get (today + shelf
    life), for scanned packages that are not in stock."""
    _exists(conn, "location", location_id)
    batch_id = None
    if code.strip().upper().startswith("PTRY:"):
        product, batch_id = _label_batch(conn, code.strip()[5:])
        product = dict(product)
    else:
        product = _product(conn, code)
    days = effective(conn, product["id"])["shelf_days"]["value"]
    return {
        "product_id": product["id"],
        "name": product["name"],
        "batches": _rows(conn, location_id, product["id"], batch_id),
        "shelf_date": days and ((today or date.today()) + timedelta(days=days)).isoformat(),
    }


def stocktake_apply(
    conn: sqlite3.Connection,
    location_id: int,
    counts: list[dict],
    extra: list[dict],
    today: date | None = None,
    user_id: str | None = None,
) -> int:
    """Set each listed batch at the location to its counted packages (0 = missing) and book in
    the extra packages; one transaction. Returns the number of corrections."""
    _exists(conn, "location", location_id)
    done = 0
    for c in counts:
        _exists(conn, "batch", c["batch_id"])
        if _stock_of(conn, c["batch_id"], location_id) != c["packages"]:
            correct(conn, c["batch_id"], location_id, c["packages"], "stocktake", user_id)
            done += 1
    for e in extra:
        _exists(conn, "product", e["product_id"])
        if e["packages"] < 1:
            raise InventoryError("invalid_value")
        batch = in_batch(conn, e["product_id"], e.get("expires_on"), location_id, today)
        have = _stock_of(conn, batch, location_id)
        correct(conn, batch, location_id, have + e["packages"], "stocktake", user_id)
        done += 1
    return done
