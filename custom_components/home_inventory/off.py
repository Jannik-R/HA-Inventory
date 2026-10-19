"""Open Food Facts client: fetch by EAN or name and normalize the fields we use.

Non-food lives in sister databases with the same API (beauty, pet food, other products)."""

from __future__ import annotations

import asyncio
import json
import re
import time
from asyncio import gather

import aiohttp
from homeassistant.core import HomeAssistant
from homeassistant.helpers.aiohttp_client import async_get_clientsession

from . import inventory
from .const import CONF_OFF
from .db import Database
from .inventory import InventoryError
from .ws_common import options_of

BASE = "https://world.openfoodfacts.org"
# OFF's product_type -> database; for a non-food EAN OFF answers "found with a different product type: x".
SITES = {
    "food": BASE,
    "beauty": "https://world.openbeautyfacts.org",
    "petfood": "https://world.openpetfoodfacts.org",
    "product": "https://world.openproductsfacts.org",
}
_OTHER_TYPE = re.compile(r"different product type: (\w+)")
FIELDS = (
    "code,product_name,product_name_{lang},generic_name_{lang},brands,categories_tags,"
    "product_quantity,product_quantity_unit,quantity,image_front_small_url"
)
SEARCH_FIELDS = "code,product_name,product_name_{lang},brands,quantity"
TIMEOUT = aiohttp.ClientTimeout(total=10)
# OFF asks for an identifying User-Agent: app (contact); no version, so it never goes stale.
HEADERS = {"User-Agent": "HA-Inventory (https://github.com/Jannik-R/HA-Inventory)"}

# Unit symbol -> (target symbol, factor); target symbols match the seeded units.
_UNITS = {
    "mg": ("g", 0.001), "g": ("g", 1), "kg": ("kg", 1),
    "ml": ("ml", 1), "cl": ("ml", 10), "dl": ("ml", 100), "l": ("l", 1),
}  # fmt: skip
_QUANTITY = re.compile(
    r"(?:(\d+)\s*[x×]\s*)?(\d+(?:[.,]\d+)?)\s*(mg|kg|g|ml|cl|dl|l)\b", re.IGNORECASE
)
# Drained weight: "Abtropfgewicht 370 g", "égoutté: 370g", or "670g/370g" (second weight smaller).
_DRAINED = re.compile(
    r"(?:abtropf|égoutt|egoutt|drained)\D{0,25}?(\d+(?:[.,]\d+)?)\s*(kg|g)\b", re.IGNORECASE
)
_SLASH = re.compile(r"(\d+(?:[.,]\d+)?)\s*(kg|g)\s*/\s*(\d+(?:[.,]\d+)?)\s*(kg|g)\b", re.IGNORECASE)


def _grams(number: str, unit: str) -> float:
    return float(number.replace(",", ".")) * (1000 if unit.lower() == "kg" else 1)


def _drained(text: object) -> tuple[float, str] | None:
    """Drained weight in g from the free-text quantity, if it states one."""
    if not isinstance(text, str):
        return None
    if m := _DRAINED.search(text):
        return round(_grams(*m.groups()), 6), "g"
    if (m := _SLASH.search(text)) and (d := _grams(m[3], m[4])) < _grams(m[1], m[2]):
        return round(d, 6), "g"
    return None


def parse_quantity(amount: object, unit: object, text: object) -> tuple[float, str] | None:
    """Package content: drained weight if stated (canned/jarred food), else product_quantity(+_unit),
    else a string like '6 x 1,5 l'."""
    if drained := _drained(text):
        return drained
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


def _str(value: object) -> str:
    """OFF fields are not always strings (null, numbers, lists): anything else counts as empty."""
    return value if isinstance(value, str) else ""


def _image(value: object) -> str | None:
    """Only http(s) URLs the product schema accepts (`HTTP_URL`); anything else is dropped."""
    url = _str(value)
    return url if re.match(r"https?://", url) and len(url) <= 2000 else None


def normalize(p: dict, lang: str) -> dict:
    """OFF product -> {ean, name, brand, quantity, off_tags, image_url, off_json}."""
    name = next(
        (
            s
            for k in (f"product_name_{lang}", "product_name", f"generic_name_{lang}")
            if (s := _str(p.get(k)).strip())
        ),
        "",
    )
    tags = p.get("categories_tags")
    code = p.get("code")
    return {
        "ean": str(code) if isinstance(code, (str, int)) and code != "" else None,
        "name": name,
        "brand": _str(p.get("brands")).split(",")[0].strip() or None,
        "quantity": parse_quantity(
            p.get("product_quantity"), p.get("product_quantity_unit"), p.get("quantity")
        ),
        "off_tags": [t for t in tags if isinstance(t, str)] if isinstance(tags, list) else [],
        "image_url": _image(p.get("image_front_small_url")),
        "off_json": json.dumps(p, ensure_ascii=False),
    }


async def _get(hass: HomeAssistant, path: str, params: dict, base: str = BASE) -> dict:
    session = async_get_clientsession(hass)
    try:
        async with session.get(
            base + path, params=params, headers=HEADERS, timeout=TIMEOUT
        ) as resp:
            if resp.status == 404:  # unknown EAN; the JSON body may name another product type
                try:
                    data = await resp.json(content_type=None)
                except ValueError:
                    return {}
                return data if isinstance(data, dict) else {}
            resp.raise_for_status()
            data = await resp.json(content_type=None)
    except (aiohttp.ClientError, TimeoutError, ValueError) as err:
        raise InventoryError("off_unavailable") from err
    if not isinstance(data, dict):
        raise InventoryError("off_unavailable")
    return data


async def async_lookup(hass: HomeAssistant, db: Database, ean: str) -> dict | None:
    """Local product by EAN, else an OFF-based draft (not saved), else None."""
    if not (ean := inventory.check_ean(ean)):  # also keeps the URL path safe
        raise InventoryError("invalid_ean")
    if local := await db.run(inventory.find_ean, ean):
        return local
    if not options_of(hass).get(CONF_OFF, True):
        return None
    lang = hass.config.language.split("-")[0]
    path, params = f"/api/v2/product/{ean}", {"fields": FIELDS.format(lang=lang), "lc": lang}
    data = await _get(hass, path, params)
    other = _OTHER_TYPE.search(str(data.get("status_verbose", "")))
    if data.get("status") != 1 and other and (base := SITES.get(other[1])) and base != BASE:
        data = await _get(hass, path, params, base)
    if data.get("status") != 1 or not data.get("product"):
        return None
    return await db.run(inventory.product_draft, normalize(data["product"], lang))


# OFF allows 10 searches/min per IP: space them out, so no user can get HA's IP blocked.
SEARCH_INTERVAL = 6.0
_last_search = -SEARCH_INTERVAL  # monotonic time of the latest search slot handed out


async def async_search(hass: HomeAssistant, query: str) -> list[dict]:
    """Full-text search by name in OFF and its sister databases, food first (call on explicit user
    action only; spaced, see above). A failing sister database is left out, a failing OFF raises."""
    global _last_search
    if not query.strip() or not options_of(hass).get(CONF_OFF, True):
        return []
    # Reserve the next free slot before waiting, so concurrent calls queue up (one event loop).
    now = time.monotonic()
    wait = max(0.0, _last_search + SEARCH_INTERVAL - now)
    _last_search = now + wait
    await asyncio.sleep(wait)
    lang = hass.config.language.split("-")[0]
    params = {
        "search_terms": query,
        "json": 1,
        "page_size": 20,
        "lc": lang,
        "fields": SEARCH_FIELDS.format(lang=lang),
    }
    results = await gather(
        *(_get(hass, "/cgi/search.pl", params, base) for base in SITES.values()),
        return_exceptions=True,
    )
    if isinstance(results[0], BaseException):  # SITES starts with OFF
        raise results[0]
    hits = (
        normalize(p, lang)
        for data in results
        if isinstance(data, dict)
        for p in data.get("products", [])
    )
    seen: set[str] = set()
    return [
        {k: h[k] for k in ("ean", "name", "brand", "quantity")}
        for h in hits
        if h["ean"] and h["name"] and not (h["ean"] in seen or seen.add(h["ean"]))
    ]
