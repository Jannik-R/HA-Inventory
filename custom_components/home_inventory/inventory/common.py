"""Shared constants, the user-facing error and small helpers."""

from __future__ import annotations

import re
import sqlite3
from datetime import UTC, date, datetime, timedelta

INHERITED = (
    "unit_id", "default_location_id", "expiry_type", "warn_days", "shelf_days", "opened_days",
    "frozen_days",
)  # fmt: skip
# Inherited down the category tree only (no product or defaults column); NULL at the root = food,
# not frozen goods, no emergency group.
CATEGORY_INHERITED = ("food", "frozen_goods", "emergency_group")


# Column whitelist per table (id and product.updated_at are handled by save()).
COLUMNS = {
    "unit": ("name", "symbol", "base_unit_id", "factor", "is_count", "recipe_only"),
    "location": ("name", "sort", "freezer"),
    "category": (
        "parent_id", "name", "sort", "unit_id", "default_location_id",
        "expiry_type", "warn_days", "min_stock", "min_stock_unit_id", "min_packages",
        "shelf_days", "food", "opened_days", "frozen_goods", "frozen_days",
        "emergency_group",
    ),
    "product": (
        "ean", "name", "brand", "category_id", "content_amount", "content_unit_id",
        "default_location_id", "expiry_type", "warn_days", "image_url", "off_json", "min_packages",
        "shelf_days", "opened_days", "frozen_days",
    ),
    "recipe": (
        "name", "servings", "instructions", "source_url", "image_url", "canning_product_id",
        "canning_temp", "canning_minutes", "canning_kind",
    ),
    "canning": (
        "made_on", "seq", "product_id", "recipe_id", "jars", "temp", "minutes", "notes", "kind",
    ),
}  # fmt: skip


class InventoryError(Exception):
    """User-facing error; translation_key maps to strings.json -> exceptions."""

    def __init__(self, translation_key: str, **placeholders: object) -> None:
        super().__init__(translation_key)
        self.translation_key = translation_key
        self.placeholders = placeholders


_SUFFIX = re.compile(r"(?:/\w+|\(\w+\))$")  # Chefkoch plural hint: Tasse/n, Tasse(n)
_PLURALS = ("en", "n", "e", "s")


def unit_key(s: str) -> str:
    """Normal form for matching units: Tasse, Tassen, tasse and Tasse/n are the same."""
    s = _SUFFIX.sub("", s.casefold().strip().rstrip(".")).strip()
    for end in _PLURALS:
        if s.endswith(end) and len(s) - len(end) >= 3:
            return s[: -len(end)]
    return s


def id_by_name(rows, name: str) -> int | None:
    """Id of the first row whose name equals `name`, ignoring case and outer spaces."""
    key = name.strip().casefold()
    return next((r["id"] for r in rows if r["name"].casefold() == key), None)


def opened_until(expires_on: str | None, opened_on: str | None, days: int | None) -> str | None:
    """Effective expiry: the batch date, or earlier when opened (opened_on + days)."""
    if not opened_on or not days:
        return expires_on
    until = (date.fromisoformat(opened_on) + timedelta(days=days)).isoformat()
    return min(until, expires_on) if expires_on else until


def _now() -> str:
    return datetime.now(UTC).isoformat(timespec="seconds")


def _exists(conn: sqlite3.Connection, table: str, row_id: int | None) -> None:
    """Row exists (None passes); a location must also be active (deactivated ones take no stock)."""
    active = " AND active" if table == "location" else ""
    if (
        row_id is not None
        and not conn.execute(f"SELECT 1 FROM {table} WHERE id = ?{active}", (row_id,)).fetchone()
    ):
        raise InventoryError("not_found")


def check_ean(ean: object) -> str | None:
    """None / blank -> no EAN; otherwise 8 to 14 ASCII digits."""
    if ean is None or (isinstance(ean, str) and not ean.strip()):
        return None
    if not (
        isinstance(ean, str)
        and (ean := ean.strip()).isascii()
        and ean.isdigit()
        and 8 <= len(ean) <= 14
    ):
        raise InventoryError("invalid_ean")
    return ean


def _packages(packages: int, minimum: int = 1) -> None:
    if packages < minimum:
        raise InventoryError("invalid_value")
