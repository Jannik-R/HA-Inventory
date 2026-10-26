"""Grocy import: its JSON object lists (/api/objects/<entity>) become the rows of transfer_apply.

Field names: Grocy's openapi spec and its migrations (products, stock, locations, quantity_units,
product_groups, product_barcodes)."""

from __future__ import annotations

import json
import math
import sqlite3

from .common import InventoryError, check_ean, unit_key
from .ingredient_line import unit_lookup
from .transfer_apply import import_rows
from .transfer_csv import MAX_ROWS, num

_NEVER = "2999-12-31"  # Grocy's "does not expire"


def _kind(item: dict) -> str:
    """Which object list a file is, by the keys of its first object."""
    for key, kind in (
        ("qu_id_stock", "products"),
        ("barcode", "barcodes"),
        ("is_freezer", "locations"),
        ("name_plural", "units"),
    ):
        if key in item:
            return kind
    if "stock_id" in item and "best_before_date" in item:
        return "stock"
    if "id" in item and "name" in item:
        return "groups"
    raise InventoryError("grocy_file")


def _n(value: object) -> float:
    """Grocy sends numbers as numbers or as strings."""
    try:
        return num(str(value)) or 0.0
    except InventoryError:
        return 0.0


def _read(files: list[str]) -> dict[str, list[dict]]:
    data: dict[str, list[dict]] = {}
    for text in files:
        try:
            items = json.loads(text)
        except ValueError:
            raise InventoryError("grocy_file") from None
        if not isinstance(items, list) or not all(isinstance(i, dict) for i in items):
            raise InventoryError("grocy_file")
        if items:
            data[_kind(items[0])] = items
    if "products" not in data:
        raise InventoryError("grocy_products")
    if len(data["products"]) > MAX_ROWS or len(data.get("stock", ())) > MAX_ROWS:
        raise InventoryError("csv_rows", max=MAX_ROWS)
    return data


def _ean(codes: list[dict], product_id: object) -> str:
    for c in codes:
        if str(c.get("product_id")) == str(product_id):
            try:
                if ean := check_ean(str(c.get("barcode", ""))):
                    return ean
            except InventoryError:
                continue
    return ""


def grocy_rows(conn: sqlite3.Connection, files: list[str]) -> tuple[list[dict], list[dict]]:
    """JSON file contents -> (product rows, stock rows)."""
    data = _read(files)
    groups = {str(g.get("id")): g.get("name", "") for g in data.get("groups", [])}
    places = {str(p.get("id")): p for p in data.get("locations", [])}
    ours = {r["id"]: r["is_count"] for r in conn.execute("SELECT id, is_count FROM unit")}
    lookup = unit_lookup(conn)
    units = {}  # Grocy unit id -> our unit id
    for u in data.get("units", []):
        for name in (u.get("name"), u.get("name_plural")):
            if name and (hit := lookup.get(unit_key(name))):
                units[str(u.get("id"))] = hit
                break

    def place(location_id: object) -> tuple[str, bool]:
        p = places.get(str(location_id), {})
        return p.get("name", ""), str(p.get("is_freezer")) in ("1", "True", "true")

    products, by_id = [], {}
    for i, p in enumerate(data["products"], 1):
        name, freezer = place(p.get("location_id"))
        unit = units.get(str(p.get("qu_id_stock")))
        row = {
            "_line": i,
            "name": p.get("name", ""),
            "category": groups.get(str(p.get("product_group_id")), ""),
            "ean": _ean(data.get("barcodes", []), p.get("id")),
            "location": name,
            "_freezer": freezer,
        }
        for column, key in (
            ("shelf_days", "default_best_before_days"),
            ("opened_days", "default_best_before_days_after_open"),
            ("frozen_days", "default_best_before_days_after_freezing"),
        ):
            row[column] = str(int(_n(p.get(key)))) if _n(p.get(key)) > 0 else ""
        if _n(p.get("min_stock_amount")) > 0 and unit and ours[unit]:
            row["min_packages"] = str(math.ceil(_n(p["min_stock_amount"])))
        products.append(row)
        by_id[str(p.get("id"))] = (row, unit is not None and bool(ours[unit]))

    stock = []
    for i, e in enumerate(data.get("stock", []), 1):
        row, counted = by_id.get(
            str(e.get("product_id")), ({"name": f"#{e.get('product_id')}"}, False)
        )
        name, freezer = (
            place(e.get("location_id"))
            if e.get("location_id")
            else (row.get("location", ""), row.get("_freezer"))
        )
        best = str(e.get("best_before_date") or "")[:10]
        stock.append(
            {
                "_line": i,
                "name": row["name"],
                # one package per entry, unless the unit is a known count unit
                "packages": str(max(math.ceil(_n(e.get("amount"))), 0) if counted else 1),
                "expires_on": "" if best == _NEVER else best,
                "opened_on": str(e.get("opened_date") or "")[:10]
                if str(e.get("open")) == "1"
                else "",
                "location": name,
                "_freezer": freezer,
            }
        )
    return products, stock


def import_grocy(
    conn: sqlite3.Connection, files: list[str], apply: bool, user_id: str | None = None
) -> dict:
    """Products first, then stock, in one report."""
    products, stock = grocy_rows(conn, files)
    return import_rows(conn, products, stock, apply, user_id)
