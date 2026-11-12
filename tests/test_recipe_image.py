"""Recipe pictures: stored locally on save, shrunk, served signed, removed with the recipe."""

import io
from unittest.mock import AsyncMock, patch

import pytest
from homeassistant.core import HomeAssistant
from PIL import Image

from custom_components.home_inventory import recipe_fetch, recipe_image
from custom_components.home_inventory.const import DOMAIN
from custom_components.home_inventory.inventory.recipe_import import _image

from .test_websocket import ws  # noqa: F401  (fixture)

URL = "https://x.test/big.png"


@pytest.fixture(autouse=True)
def _clean():
    recipe_image._failed.clear()
    recipe_image._running.clear()


def png(size=(2400, 1200)) -> bytes:
    out = io.BytesIO()
    Image.new("RGBA", size, (200, 10, 10, 255)).save(out, "PNG")
    return out.getvalue()


def recipe(**extra) -> dict:
    return {
        "type": "home_inventory/recipe_save",
        "data": {"name": "Suppe", "servings": 2, "ingredients": [], **extra},
    }


def test_largest_image_chosen():
    big = {"url": "https://x.test/big.jpg", "width": 1200, "height": 800}
    small = {"url": "https://x.test/s.jpg", "width": "100", "height": "50"}
    assert _image([small, big]) == "https://x.test/big.jpg"
    assert _image(["https://x.test/a.jpg", "https://x.test/b.jpg"]) == ("https://x.test/a.jpg")
    assert _image({"url": "ftp://x"}) is None


async def test_save_stores_resized_and_deletes_with_recipe(hass: HomeAssistant, ws) -> None:  # noqa: F811
    get = AsyncMock(return_value=("image/png", None, png()))
    with patch.object(recipe_fetch, "async_get", get):
        rid = (await ws.call(recipe(image_url=URL)))["result"]["id"]
        await hass.async_block_till_done(wait_background_tasks=True)
    path = recipe_image._file(hass, rid)
    assert Image.open(path).size == (1200, 600)

    recipes = (await ws.call({"type": "home_inventory/recipes"}))["result"]
    assert recipes[0]["image_path"].startswith(f"/api/home_inventory/recipe_image/{rid}?authSig=")
    assert recipes[0]["image_url"] == URL  # the origin stays

    # saved again with the same URL and a file present: no second download
    with patch.object(recipe_fetch, "async_get", get):
        await ws.call(recipe(id=rid, image_url=URL))
        await hass.async_block_till_done(wait_background_tasks=True)
    assert get.await_count == 1

    await ws.call({"type": "home_inventory/delete", "table": "recipe", "row_id": rid})
    assert not path.exists()


async def test_switch_off_downloads_nothing(hass: HomeAssistant, ws) -> None:  # noqa: F811
    entry = hass.config_entries.async_entries(DOMAIN)[0]
    hass.config_entries.async_update_entry(entry, options={"recipe_images": False})
    get = AsyncMock(return_value=("image/png", None, png()))
    with patch.object(recipe_fetch, "async_get", get):
        await ws.call(recipe(image_url=URL))
        await hass.async_block_till_done(wait_background_tasks=True)
    get.assert_not_called()


async def test_bad_download_does_not_fail_the_save(hass: HomeAssistant, ws) -> None:  # noqa: F811
    get = AsyncMock(return_value=("text/html", None, b"<html>"))
    with patch.object(recipe_fetch, "async_get", get):
        msg = await ws.call(recipe(image_url=URL))
        await hass.async_block_till_done(wait_background_tasks=True)
    assert msg["success"]
    assert not recipe_image._file(hass, msg["result"]["id"]).exists()


async def test_url_changed_during_download_writes_nothing(hass: HomeAssistant, ws) -> None:  # noqa: F811
    """Always the public-only fetch; a picture whose URL changed meanwhile is not written."""
    calls = []

    async def fetch(hass_, url, max_bytes, public_only):
        calls.append((url, public_only))
        if len(calls) == 1:  # the user edits the URL while the first one is downloading
            await ws.call(recipe(id=1, image_url="https://x.test/other.png"))
            return "image/png", None, png()
        raise OSError("down")  # the new URL is broken

    with patch.object(recipe_fetch, "async_get", fetch):
        rid = (await ws.call(recipe(image_url=URL)))["result"]["id"]
        await hass.async_block_till_done(wait_background_tasks=True)
        await hass.async_block_till_done(
            wait_background_tasks=True
        )  # the task the first one started
        assert not recipe_image._file(hass, rid).exists()
        for _ in range(2):  # a broken URL is tried once, not on every list load
            await ws.call({"type": "home_inventory/recipes"})
            await hass.async_block_till_done(wait_background_tasks=True)
    assert calls == [(URL, True), ("https://x.test/other.png", True)]


async def test_orphan_pictures_are_swept(hass: HomeAssistant, ws) -> None:  # noqa: F811
    orphan = recipe_image._file(hass, 9999)
    orphan.parent.mkdir(parents=True, exist_ok=True)
    orphan.write_bytes(b"x")
    await ws.call({"type": "home_inventory/recipes"})
    assert not orphan.exists()
