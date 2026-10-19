"""Fetch a recipe page over HTTP and turn it into a recipe draft."""

from __future__ import annotations

import ipaddress
from urllib.parse import urlsplit

import aiohttp
from homeassistant.core import HomeAssistant
from homeassistant.helpers.aiohttp_client import async_get_clientsession

from .inventory import InventoryError

MAX_BYTES = 5_000_000
TIMEOUT = aiohttp.ClientTimeout(total=15)
HEADERS = {"User-Agent": "HA-Inventory (https://github.com/Jannik-R/HA-Inventory)"}


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


async def async_private(hass: HomeAssistant, url: str) -> bool:
    """The link points into the local network: a private, loopback or link-local address, also
    by name (e.g. nas.lan). Such links are for admins only (the AI would read the page back).
    shortcut: redirects and DNS answers that change after this check are not covered."""
    host = (urlsplit(url).hostname or "").split("%")[0]
    try:
        addresses = [ipaddress.ip_address(host)]
    except ValueError:
        try:
            infos = await hass.loop.getaddrinfo(host, None)
        except OSError:
            return False  # not resolvable: the fetch fails anyway
        addresses = [ipaddress.ip_address(i[4][0].split("%")[0]) for i in infos]
    return any(not a.is_global for a in addresses)
