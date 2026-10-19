"""Fetch a recipe page over HTTP and turn it into a recipe draft."""

from __future__ import annotations

import aiohttp
from homeassistant.core import HomeAssistant
from homeassistant.helpers.aiohttp_client import async_get_clientsession

from . import inventory
from .db import Database
from .inventory import InventoryError

MAX_BYTES = 5_000_000
TIMEOUT = aiohttp.ClientTimeout(total=15)
HEADERS = {"User-Agent": "HA-Inventory (https://github.com/Jannik-R/HA-Inventory)"}


async def async_import(hass: HomeAssistant, db: Database, url: str) -> dict:
    """Recipe draft (not saved) from the schema.org data of the page at `url`."""
    return await db.run(inventory.recipe_import, await async_fetch(hass, url), url, write=False)


async def async_fetch(hass: HomeAssistant, url: str) -> str:
    """The HTML page at `url` (max 5 MB); InventoryError when it is no HTML or not loadable."""
    try:
        async with async_get_clientsession(hass).get(url, headers=HEADERS, timeout=TIMEOUT) as resp:
            resp.raise_for_status()
            if "html" not in resp.content_type:
                raise InventoryError("recipe_not_found")
            body = bytearray()
            async for chunk in resp.content.iter_chunked(65536):
                body += chunk
                if len(body) > MAX_BYTES:
                    raise InventoryError("recipe_unreachable")
            # shortcut: <meta charset> is ignored; most recipe sites send UTF-8 in the header
            return body.decode(resp.charset or "utf-8", errors="replace")
    except (aiohttp.ClientError, TimeoutError, LookupError) as err:
        raise InventoryError("recipe_unreachable") from err
