"""Booking by barcode / label code and location name, for services and automations (no ids)."""

from __future__ import annotations

import sqlite3
from datetime import date

from .booking import book_in, book_out
from .common import InventoryError
from .labels import book_out_code
from .master import list_rows
from .products import find_ean


def _product(conn: sqlite3.Connection, ean: str) -> dict:
    """Local product by EAN; unknown ones are created in the panel (category needs a human)."""
    if not (product := find_ean(conn, ean.strip())):
        raise InventoryError("product_unknown", code=ean.strip())
    return product


def _location(conn: sqlite3.Connection, name: str | None) -> int | None:
    if name is None:
        return None
    key = name.strip().casefold()
    for row in list_rows(conn, "location"):  # active ones only
        if row["name"].casefold() == key:
            return row["id"]
    raise InventoryError("location_unknown", name=name)


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
