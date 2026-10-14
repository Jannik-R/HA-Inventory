"""Open Food Facts client: fetch by EAN or name and normalize the fields we use."""

from __future__ import annotations

import json
import re

import aiohttp
from homeassistant.core import HomeAssistant
from homeassistant.helpers.aiohttp_client import async_get_clientsession

from . import inventory
from .db import Database
from .inventory import InventoryError

BASE = "https://world.openfoodfacts.org"
FIELDS = (
    "code,product_name,product_name_{lang},generic_name_{lang},brands,categories_tags,"
    "product_quantity,product_quantity_unit,quantity,image_front_small_url"
)
SEARCH_FIELDS = "code,product_name,product_name_{lang},brands,quantity"
TIMEOUT = aiohttp.ClientTimeout(total=10)
# OFF asks for an identifying User-Agent: app/version (contact).
HEADERS = {"User-Agent": "HA-Pantry/0.1 (https://github.com/Jannik-R/HA-Inventory)"}

# Unit symbol -> (target symbol, factor); target symbols match the seeded units.
_UNITS = {
    "mg": ("g", 0.001), "g": ("g", 1), "kg": ("kg", 1),
    "ml": ("ml", 1), "cl": ("ml", 10), "dl": ("ml", 100), "l": ("l", 1),
}  # fmt: skip
_QUANTITY = re.compile(
    r"(?:(\d+)\s*[x×]\s*)?(\d+(?:[.,]\d+)?)\s*(mg|kg|g|ml|cl|dl|l)\b", re.IGNORECASE
)


def parse_quantity(
    amount: object, unit: object, text: object
) -> tuple[float, str] | None:
    """Package content from product_quantity(+_unit), else from a string like '6 x 1,5 l'."""
    try:
        value = float(amount)  # type: ignore[arg-type]
    except (TypeError, ValueError):
        value = 0
    if value > 0 and str(unit).lower() in _UNITS:
        symbol, factor = _UNITS[str(unit).lower()]
        return round(value * factor, 6), symbol
    if not isinstance(text, str) or not (m := _QUANTITY.search(text)):
        return None
    count, number, sym = m.groups()
    symbol, factor = _UNITS[sym.lower()]
    total = int(count or 1) * float(number.replace(",", ".")) * factor
    return (round(total, 6), symbol) if total > 0 else None


def normalize(p: dict, lang: str) -> dict:
    """OFF product -> {ean, name, brand, quantity, off_tags, image_url, off_json}."""
    name = (
        p.get(f"product_name_{lang}")
        or p.get("product_name")
        or p.get(f"generic_name_{lang}")
        or ""
    )
    return {
        "ean": p.get("code"),
        "name": name.strip(),
        "brand": (p.get("brands") or "").split(",")[0].strip() or None,
        "quantity": parse_quantity(
            p.get("product_quantity"), p.get("product_quantity_unit"), p.get("quantity")
        ),
        "off_tags": p.get("categories_tags") or [],
        "image_url": p.get("image_front_small_url"),
        "off_json": json.dumps(p, ensure_ascii=False),
    }


async def _get(hass: HomeAssistant, path: str, params: dict) -> dict:
    session = async_get_clientsession(hass)
    try:
        async with session.get(
            BASE + path, params=params, headers=HEADERS, timeout=TIMEOUT
        ) as resp:
            if resp.status == 404:  # unknown EAN (body may be JSON with status 0)
                return {}
            resp.raise_for_status()
            data = await resp.json(content_type=None)
    except (aiohttp.ClientError, TimeoutError, ValueError) as err:
        raise InventoryError("off_unavailable") from err
    if not isinstance(data, dict):
        raise InventoryError("off_unavailable")
    return data


async def async_lookup(hass: HomeAssistant, db: Database, ean: str) -> dict | None:
    """Local product by EAN, else an OFF-based draft (not saved), else None."""
    ean = ean.strip()
    if not (ean.isdigit() and 8 <= len(ean) <= 14):  # also keeps the URL path safe
        raise InventoryError("invalid_ean")
    if local := await db.run(inventory.find_ean, ean):
        return local
    lang = hass.config.language.split("-")[0]
    data = await _get(
        hass, f"/api/v2/product/{ean}", {"fields": FIELDS.format(lang=lang), "lc": lang}
    )
    if data.get("status") != 1 or not data.get("product"):
        return None
    return await db.run(inventory.product_draft, normalize(data["product"], lang))


async def async_search(hass: HomeAssistant, query: str) -> list[dict]:
    """OFF full-text search by name (rate limit 10/min: call on explicit user action only)."""
    if not query.strip():
        return []
    lang = hass.config.language.split("-")[0]
    data = await _get(
        hass,
        "/cgi/search.pl",
        {
            "search_terms": query,
            "json": 1,
            "page_size": 20,
            "lc": lang,
            "fields": SEARCH_FIELDS.format(lang=lang),
        },
    )
    hits = (normalize(p, lang) for p in data.get("products", []))
    return [
        {k: h[k] for k in ("ean", "name", "brand", "quantity")}
        for h in hits
        if h["ean"] and h["name"]
    ]
