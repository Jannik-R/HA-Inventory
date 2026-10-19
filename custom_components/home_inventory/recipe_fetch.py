"""Fetch a recipe page over HTTP and turn it into a recipe draft."""

from __future__ import annotations

import ipaddress
import socket
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager
from urllib.parse import urlsplit

import aiohttp
from homeassistant.core import HomeAssistant
from homeassistant.helpers.aiohttp_client import async_get_clientsession
from yarl import URL

from .inventory import InventoryError

MAX_BYTES = 5_000_000
MAX_REDIRECTS = 5
TIMEOUT = aiohttp.ClientTimeout(total=15)
HEADERS = {"User-Agent": "HA-Inventory (https://github.com/Jannik-R/HA-Inventory)"}
_REDIRECT = (301, 302, 303, 307, 308)


class NotPublic(OSError):
    """A host in the local network (private, loopback, link-local): admins only."""


def _public(host: str) -> bool:
    return ipaddress.ip_address(host.split("%")[0]).is_global


def _not_public(err: BaseException) -> bool:
    """The error is (or wraps, as aiohttp's connector errors do) a refused local address."""
    return isinstance(err, NotPublic) or isinstance(getattr(err, "os_error", None), NotPublic)


class _PublicResolver(aiohttp.ThreadedResolver):
    """Resolves like aiohttp but refuses local addresses, at connect time: a DNS answer that
    changes after a check, or a redirect to a name in the LAN, cannot get through."""

    async def resolve(self, host: str, port: int = 0, family: int = socket.AF_INET) -> list:
        hosts = await super().resolve(host, port, family)
        if not all(_public(h["host"]) for h in hosts):
            raise NotPublic(f"{host} is in the local network")
        return hosts


def _public_session(hass: HomeAssistant) -> aiohttp.ClientSession:
    """Session that only reaches the internet (tests replace it with a mocked one)."""
    return aiohttp.ClientSession(connector=aiohttp.TCPConnector(resolver=_PublicResolver()))


@asynccontextmanager
async def _session(hass: HomeAssistant, public_only: bool) -> AsyncIterator[aiohttp.ClientSession]:
    if not public_only:
        yield async_get_clientsession(hass)
        return
    session = _public_session(hass)
    try:
        yield session
    finally:
        await session.close()


async def async_get(
    hass: HomeAssistant, url: str, max_bytes: int, public_only: bool = False
) -> tuple[str, str | None, bytes | None]:
    """GET with a size limit: (content type, charset, body); body None when over max_bytes.
    public_only (users who are no admin): redirects are followed here and every hop must be on
    the internet; an IP literal is checked here, a name by the resolver. Raises NotPublic."""
    async with _session(hass, public_only) as session:
        for _ in range(MAX_REDIRECTS + 1):
            host = urlsplit(url).hostname or ""
            try:
                literal = not _public(host)
            except ValueError:  # a name: the resolver checks it
                literal = False
            if public_only and literal:
                raise NotPublic(f"{host} is in the local network")
            async with session.get(
                url, headers=HEADERS, timeout=TIMEOUT, allow_redirects=not public_only
            ) as resp:
                location = resp.headers.get("Location")
                if public_only and resp.status in _REDIRECT and location:
                    url = str(resp.url.join(URL(location)))
                    continue
                resp.raise_for_status()
                body = bytearray()
                async for chunk in resp.content.iter_chunked(65536):
                    body += chunk
                    if len(body) > max_bytes:
                        return resp.content_type, resp.charset, None
                return resp.content_type, resp.charset, bytes(body)
    raise aiohttp.ClientError("too many redirects")


async def async_fetch(hass: HomeAssistant, url: str, public_only: bool = False) -> str:
    """The HTML page at `url` (max 5 MB); InventoryError when it is no HTML, not loadable or (for
    public_only) in the local network."""
    try:
        content_type, charset, body = await async_get(hass, url, MAX_BYTES, public_only)
        if "html" not in content_type:
            raise InventoryError("recipe_not_found")
        if body is None:
            raise InventoryError("recipe_unreachable")
        # shortcut: <meta charset> is ignored; most recipe sites send UTF-8 in the header
        return body.decode(charset or "utf-8", errors="replace")
    except (aiohttp.ClientError, OSError, TimeoutError, LookupError) as err:
        key = "url_private" if _not_public(err) else "recipe_unreachable"
        raise InventoryError(key) from err
