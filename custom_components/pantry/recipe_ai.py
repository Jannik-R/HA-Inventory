"""Recipe import with the AI as fallback: a URL first goes through the schema.org import; without
recipe data the AI reads the post (video + caption via yt-dlp, else Open Graph, page text and
image). Pasted text and photos always go to the AI. Result: the usual draft, nothing saved."""

from __future__ import annotations

import asyncio
import base64
import binascii
import logging
import mimetypes
from pathlib import Path

import probatio
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import HomeAssistantError

from . import ai, inventory, recipe_fetch, recipe_media
from .inventory import InventoryError
from .ws_common import db_of

_LOGGER = logging.getLogger(__name__)
_TIMEOUT = 180  # s; the AI provider processes an uploaded video first
MAX_PHOTO = 3_000_000  # bytes after base64 decoding (the panel sends a scaled JPEG)

# Gemini wants plain types (no nullables), as in ai.ANSWER.
ANSWER = probatio.Schema(
    {
        probatio.Required("found"): bool,
        probatio.Optional("name"): str,
        probatio.Optional("servings"): int,
        probatio.Optional("ingredients"): [str],
        probatio.Optional("steps"): [
            {probatio.Required("text"): str, probatio.Optional("section"): str}
        ],
    }
)


def _attachments_ok(hass: HomeAssistant, entity_id: str) -> bool:
    from homeassistant.components.ai_task import AITaskEntityFeature

    state = hass.states.get(entity_id)
    features = state.attributes.get("supported_features", 0) if state else 0
    return bool(features & AITaskEntityFeature.SUPPORT_ATTACHMENTS)


async def _extract(
    hass: HomeAssistant, entity_id: str, sources: dict, files: list[Path], media_id, url
) -> dict:
    attachments = []
    if files and _attachments_ok(hass, entity_id):
        attachments = [
            {"media_content_id": mid, "media_content_type": mimetypes.guess_type(f)[0]}
            for f in files
            if (mid := media_id(f))
        ]
    if not attachments and not any(sources.get(k) for k in ("title", "description", "text")):
        raise InventoryError("recipe_not_found")
    try:
        async with asyncio.timeout(_TIMEOUT):
            result = await ai._generate(
                hass,
                task_name="Vorrat: Rezept auslesen",
                entity_id=entity_id,
                instructions=inventory.ai_import_prompt(sources),
                structure=ANSWER,
                attachments=attachments or None,
            )
    except (HomeAssistantError, TimeoutError) as err:
        _LOGGER.warning("AI reading of a recipe failed: %s", err)
        raise InventoryError("ai_import_failed") from err
    recipe = inventory.ai_recipe(result.data, sources.get("image"))
    if recipe is None:
        raise InventoryError("recipe_not_found")
    return await db_of(hass).run(inventory.recipe_draft, recipe, url, write=False)


async def async_import_url(hass: HomeAssistant, url: str) -> dict:
    """Draft from a URL: schema.org data, else (with an AI set up) what the AI reads there."""
    db, page, error = db_of(hass), None, None
    try:
        page = await recipe_fetch.async_fetch(hass, url)
        return await db.run(inventory.recipe_import, page, url, write=False)
    except InventoryError as err:  # no recipe data, no HTML or not loadable (Instagram: often)
        error = err
    if not (entity_id := ai.entity_of(hass)):
        raise error
    sources = await hass.async_add_executor_job(inventory.ai_page_sources, page) if page else {}
    async with recipe_media.async_folder(hass) as (folder, media_id):
        try:
            async with asyncio.timeout(recipe_media.VIDEO_TIMEOUT):
                post = await hass.async_add_executor_job(recipe_media.video, url, folder)
        except TimeoutError:
            post = None
        files = []
        if post:
            sources = {
                "title": post["title"] or sources.get("title"),
                "description": post["description"] or sources.get("description"),
                "image": sources.get("image") or post["thumbnail"],
                # a video platform's page text is boilerplate once the caption is known
                "text": None if post["description"] else sources.get("text"),
            }
            files = [post["file"]] if post["file"] else []
        if not files and sources.get("image"):
            image = await recipe_media.async_image(hass, sources["image"], folder)
            files = [image] if image else []
        return await _extract(hass, entity_id, sources, files, media_id, url)


async def async_import_input(
    hass: HomeAssistant, text: str | None = None, image: str | None = None
) -> dict:
    """Draft from pasted text or a photo (data URL); needs an AI."""
    if not (entity_id := ai.entity_of(hass)):
        raise InventoryError("ai_off")
    if image and not _attachments_ok(hass, entity_id):
        raise InventoryError("ai_no_files")
    async with recipe_media.async_folder(hass) as (folder, media_id):
        files = []
        if image:
            head, _, data = image.partition(",")
            try:
                raw = base64.b64decode(data, validate=True)
            except binascii.Error as err:
                raise InventoryError("invalid_value") from err
            if len(raw) > MAX_PHOTO:
                raise InventoryError("invalid_value")
            ext = mimetypes.guess_extension(head.removeprefix("data:").split(";")[0]) or ".jpg"
            files = [folder / f"photo{ext}"]
            await hass.async_add_executor_job(files[0].write_bytes, raw)
        return await _extract(hass, entity_id, {"text": text}, files, media_id, None)
