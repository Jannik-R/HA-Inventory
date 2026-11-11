"""Recipe pictures stored in HA: downloaded once (background), shrunk, served to logged-in users."""

from __future__ import annotations

import io
import logging
import os
from datetime import timedelta
from functools import partial
from pathlib import Path

from aiohttp import web
from homeassistant.components.http import HomeAssistantView
from homeassistant.components.http.auth import async_sign_path
from homeassistant.core import HomeAssistant
from PIL import Image, ImageOps

from . import inventory, recipe_fetch
from .ws_common import db_of, external_on

_LOGGER = logging.getLogger(__name__)
MAX_BYTES = 10_000_000
MAX_SIDE = 1200
MAX_PIXELS = 25_000_000  # decompression bomb guard, checked on the header before decoding
URL = "/api/home_inventory/recipe_image/{recipe_id}"
_running: set[tuple[int, str]] = set()
_failed: set[tuple[int, str]] = set()  # tried once per HA run


def _file(hass: HomeAssistant, recipe_id: int) -> Path:
    return Path(hass.config.path("home_inventory", "recipe_images", f"{recipe_id}.jpg"))


def _save(path: Path, body: bytes) -> None:
    with Image.open(io.BytesIO(body)) as img:
        if img.width * img.height > MAX_PIXELS:
            raise ValueError("picture too large")
        img.draft("RGB", (MAX_SIDE, MAX_SIDE))  # JPEG: decode at reduced size
        img = ImageOps.exif_transpose(img).convert("RGB")
    img.thumbnail((MAX_SIDE, MAX_SIDE))
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_name(path.name + ".tmp")
    img.save(tmp, "JPEG", quality=85)
    os.replace(tmp, path)


def _store(path: Path, body: bytes, url: str, recipe_id: int, conn) -> None:
    """Runs on the DB thread: write only while the recipe still has this picture URL."""
    if inventory.recipe_image_url(conn, recipe_id) == url:
        _save(path, body)


async def _download(hass: HomeAssistant, recipe_id: int, url: str) -> None:
    try:
        # public_only always: the URL may come from any user, the picture is shown to all
        content_type, _, body = await recipe_fetch.async_get(hass, url, MAX_BYTES, True)
        if not content_type.startswith("image/") or body is None:
            raise ValueError(f"not a usable picture ({content_type})")
        store = partial(_store, _file(hass, recipe_id), body, url, recipe_id)
        await db_of(hass).run(store, write=False)
    except Exception as err:
        _failed.add((recipe_id, url))
        _LOGGER.warning("Recipe picture %s not stored: %s", url, err)
    finally:
        _running.discard((recipe_id, url))


def fetch(hass: HomeAssistant, recipe_id: int, url: str) -> None:
    """Store the picture in the background (nothing leaves HA when the switch is off)."""
    key = (recipe_id, url)
    if external_on(hass, "recipe_images") and key not in _running and key not in _failed:
        _running.add(key)
        hass.async_create_background_task(
            _download(hass, recipe_id, url), "home_inventory recipe picture"
        )


async def async_delete(hass: HomeAssistant, recipe_id: int) -> None:
    await hass.async_add_executor_job(_file(hass, recipe_id).unlink, True)  # missing_ok


async def async_saved(
    hass: HomeAssistant, recipe_id: int, old: str | None, url: str | None
) -> None:
    """After a recipe save: a changed or removed picture drops the stored file; a new URL or a
    missing file starts the download."""
    if url != old:
        await async_delete(hass, recipe_id)
    if url and not await hass.async_add_executor_job(_file(hass, recipe_id).is_file):
        fetch(hass, recipe_id, url)


def _sweep(folder: Path, ids: set[int]) -> set[str]:
    """Delete pictures (and leftover temp files) of recipes that no longer exist; the names kept."""
    if not folder.is_dir():
        return set()
    keep = set()
    for name in os.listdir(folder):
        if name.removesuffix(".jpg").isdigit() and name.endswith(".jpg") and int(name[:-4]) in ids:
            keep.add(name)
        else:
            (folder / name).unlink(missing_ok=True)
    return keep


async def async_attach(hass: HomeAssistant, recipes: list[dict]) -> None:
    """Add `image_path` (signed, local) to recipes with a stored picture; start the download
    for those that only have an image_url. Pictures of deleted recipes are removed."""
    ids = {r["id"] for r in recipes}
    have = await hass.async_add_executor_job(_sweep, _file(hass, 0).parent, ids)
    for r in recipes:
        if f"{r['id']}.jpg" in have:
            r["image_path"] = async_sign_path(
                hass, URL.format(recipe_id=r["id"]), timedelta(days=7)
            )
        elif r.get("image_url"):
            fetch(hass, r["id"], r["image_url"])


class RecipeImageView(HomeAssistantView):
    url = URL.replace("{recipe_id}", "{recipe_id:\\d+}")
    name = "api:home_inventory:recipe_image"
    requires_auth = True  # also satisfied by a signed path, which an <img> needs

    async def get(self, request: web.Request, recipe_id: str) -> web.StreamResponse:
        path = _file(request.app["hass"], int(recipe_id))
        if not await request.app["hass"].async_add_executor_job(path.is_file):
            return web.Response(status=404)
        return web.FileResponse(path, headers={"Cache-Control": "private, max-age=86400"})
