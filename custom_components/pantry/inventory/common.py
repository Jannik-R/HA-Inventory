"""Shared constants, the user-facing error and small helpers."""

from __future__ import annotations

from datetime import UTC, datetime


INHERITED = ("unit_id", "default_location_id", "expiry_type", "warn_days")


# Column whitelist per table (id and product.updated_at are handled by save()).
COLUMNS = {
    "unit": ("name", "symbol", "base_unit_id", "factor", "is_count"),
    "location": ("name", "sort"),
    "category": (
        "parent_id", "name", "sort", "off_tags", "unit_id", "default_location_id",
        "expiry_type", "warn_days", "min_stock", "min_stock_unit_id", "min_packages",
    ),
    "product": (
        "ean", "name", "brand", "category_id", "content_amount", "content_unit_id",
        "default_location_id", "expiry_type", "warn_days", "image_url", "off_json",
    ),
}  # fmt: skip


class InventoryError(Exception):
    """User-facing error; translation_key maps to strings.json -> exceptions."""

    def __init__(self, translation_key: str, **placeholders: object) -> None:
        super().__init__(translation_key)
        self.translation_key = translation_key
        self.placeholders = placeholders


def _now() -> str:
    return datetime.now(UTC).isoformat(timespec="seconds")
