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
DELAY = 1.0  # seconds between two requests (tests set 0)
_FIELDS = "code,allergens_tags,ingredients_analysis_tags"


async def async_reload_chunk(hass: HomeAssistant, db: Database, after: int) -> dict:
    """Fetch the next chunk after product id `after` -> {done, total, checked, filled, last}.
    An OFF failure raises (`off_unavailable`) and stops the run."""
    if not external_on(hass, "off_lookup"):
        raise inventory.InventoryError("external_off")
    todo = await db.run(inventory.reload_candidates, after, CHUNK, write=False)
    filled, last = 0, after
    for n, p in enumerate(todo["products"]):
        if n:
            await asyncio.sleep(DELAY)
        data = await _get(hass, f"/api/v2/product/{p['ean']}", {"fields": _FIELDS})
        last = p["id"]
        if data.get("status") == 1 and isinstance(data.get("product"), dict):
            fetched = {k: v for k, v in data["product"].items() if k != "code"}
            filled += await db.run(inventory.store_off, p["id"], fetched)
    checked = len(todo["products"])
    return {
        "done": checked < CHUNK or todo["total"] <= checked,
        "total": todo["total"],
        "checked": checked,
        "filled": filled,
        "last": last,
    }
