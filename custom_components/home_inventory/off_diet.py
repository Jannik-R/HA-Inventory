"""Admin reload of diet / allergens from Open Food Facts: one small chunk per call, one request per
second (OFF allows 100 product requests per minute), the panel calls again until `done`."""

from __future__ import annotations

import asyncio

from homeassistant.core import HomeAssistant

from . import inventory
from .db import Database
from .off import _get
from .ws_common import external_on

CHUNK = 10
_LOCK = asyncio.Lock()  # one run at a time, also across browser tabs
DELAY = 1.0  # seconds between two requests (tests set 0)
_FIELDS = "code,allergens_tags,ingredients_analysis_tags"


async def async_reload_chunk(hass: HomeAssistant, db: Database, after: int) -> dict:
    """Fetch the next chunk after product id `after` -> {done, total, checked, filled, last}.
    An OFF failure raises (`off_unavailable`) and stops the run."""
    if not external_on(hass, "off_lookup"):
        raise inventory.InventoryError("external_off")
    if _LOCK.locked():
        raise inventory.InventoryError("diet_reload_busy")
    async with _LOCK:
        todo = await db.run(inventory.reload_candidates, after, CHUNK, write=False)
        filled = checked = 0
        last, error = after, False
        for n, p in enumerate(todo["products"]):
            if n:
                await asyncio.sleep(DELAY)
            try:
                data = await _get(hass, f"/api/v2/product/{p['ean']}", {"fields": _FIELDS})
            except inventory.InventoryError:  # 429, timeout, OFF down: stop here, keep what is done
                error = True
                break
            product = data.get("product") if data.get("status") == 1 else None
            fetched = (
                {k: v for k, v in product.items() if k != "code"}
                if isinstance(product, dict)
                else {}
            )
            filled += await db.run(
                inventory.store_off, p["id"], fetched
            )  # also "not found": asked once
            last, checked = p["id"], checked + 1
        return {
            "done": not error
            and (len(todo["products"]) < CHUNK or todo["total"] <= len(todo["products"])),
            "total": todo["total"],
            "checked": checked,
            "filled": filled,
            "last": last,
            "error": error,
        }
