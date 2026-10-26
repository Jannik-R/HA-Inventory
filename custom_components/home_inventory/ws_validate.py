"""Shared input validators for the websocket schemas (trust boundary: sizes, ranges, finite numbers)."""

from __future__ import annotations

import math

import voluptuous as vol

from .inventory.diet import DIETS, check_allergens

ID = vol.All(int, vol.Range(min=1, max=2**31))
NULL_ID = vol.Any(None, ID)
PACKAGES = vol.All(int, vol.Range(min=1, max=9999))
PACKAGES_OR_ZERO = vol.All(int, vol.Range(min=0, max=9999))
DAYS = vol.All(int, vol.Range(min=0, max=2**31))
SHELF_DAYS = vol.Any(None, vol.All(int, vol.Range(min=1, max=36500)))


def _finite(value: float) -> float:
    if not math.isfinite(value):
        raise vol.Invalid("must be a finite number")
    return value


# A float > 0 ("inf" and "nan" strings are rejected as well).
POSITIVE = vol.All(vol.Coerce(float), _finite, vol.Range(min=0, min_included=False))


# Level of a partly used package: 0 (empty) to 1 (full).
REMAINING = vol.All(vol.Coerce(float), _finite, vol.Range(min=0, max=1))


def text(limit: int) -> vol.All:
    return vol.All(str, vol.Length(max=limit))


NAME = text(200)
EAN = text(32)
OFF_JSON = text(100_000)
QUERY = text(200)
CODE = text(64)
HTTP_URL = vol.All(text(2000), vol.Match(r"^https?://", msg="must be an http(s) URL"))
DIET = vol.Any(None, vol.In(DIETS))


def _allergens(value: object) -> str:
    try:
        return check_allergens(value)
    except ValueError as err:
        raise vol.Invalid("unknown allergen") from err


ALLERGEN_SET = vol.Any(None, _allergens)  # canonical comma list; '' = none of the 14
CANNING_TEMP = vol.All(int, vol.Range(min=1, max=200))  # °C
CANNING_MINUTES = vol.All(int, vol.Range(min=1, max=1440))
