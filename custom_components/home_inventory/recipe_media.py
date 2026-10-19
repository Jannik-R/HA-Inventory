"""Media for the AI recipe import: the video and caption of a post (yt-dlp), an image by URL, and
the hidden folder in HA's media directory through which ai_task takes files (attachments must
resolve through media_source)."""

from __future__ import annotations

import logging
import mimetypes
import shutil
import tempfile
import uuid
from collections.abc import AsyncIterator, Callable
from contextlib import asynccontextmanager
from pathlib import Path

import aiohttp
from homeassistant.core import HomeAssistant
from homeassistant.helpers.aiohttp_client import async_get_clientsession

from .recipe_fetch import HEADERS, TIMEOUT

_LOGGER = logging.getLogger(__name__)
MAX_VIDEO = 50_000_000  # bytes; a 3 min reel at 720p is about 15 MB
MAX_SECONDS = 900  # longer videos are no recipe clip; only their caption is used
MAX_IMAGE = 5_000_000
VIDEO_TIMEOUT = 120  # s, metadata + download
IMAGE_TYPES = ("image/jpeg", "image/png", "image/webp")
FOLDER = ".home_inventory_import"  # dot: hidden from the media browser search


class _YtLog:
    """yt-dlp warns a lot (impersonation, formats); only our own failure line goes to the log."""

    def debug(self, msg: str) -> None:
        _LOGGER.debug("yt-dlp: %s", msg)

    info = warning = error = debug


def video(url: str, folder: Path) -> dict | None:
    """{title, description, thumbnail, file} of a video post (blocking: executor). file is None
    when the clip is too long or too big; None when yt-dlp does not know the page or the platform
    refuses it (e.g. Instagram without login)."""
    import yt_dlp  # big; only loaded when an import needs it

    opts = {
        "quiet": True,
        "no_warnings": True,
        "noprogress": True,
        "noplaylist": True,
        "logger": _YtLog(),
        # one file with audio (no merging), small enough for the AI; on-screen text stays readable
        "format": "best[ext=mp4][height<=720]/best[height<=720]/best",
        "max_filesize": MAX_VIDEO,
        "outtmpl": str(folder / "video.%(ext)s"),
        "socket_timeout": 15,
        "retries": 1,
    }
    with yt_dlp.YoutubeDL(opts) as ydl:
        try:
            info = ydl.extract_info(url, download=False)
        except (yt_dlp.utils.YoutubeDLError, OSError) as err:
            _LOGGER.debug("No video post at %s: %s", url, err)
            return None
        if info and info.get("_type") == "playlist":  # carousel: the first clip
            info = next(iter(info.get("entries") or []), None)
        if not info:
            return None
        if (info.get("duration") or 0) <= MAX_SECONDS:
            try:
                ydl.process_ie_result(info, download=True)
            except (yt_dlp.utils.YoutubeDLError, OSError) as err:
                _LOGGER.info("Video of %s not downloaded: %s", url, err)
    thumb = info.get("thumbnail")
    return {
        "title": info.get("title") or "",
        "description": info.get("description") or "",
        "thumbnail": thumb if isinstance(thumb, str) and thumb.startswith("http") else None,
        "file": next(folder.glob("video.*"), None),
    }


async def async_image(hass: HomeAssistant, url: str, folder: Path) -> Path | None:
    """Download an image (max 5 MB, JPEG/PNG/WebP) into `folder`; None when that fails."""
    try:
        async with async_get_clientsession(hass).get(url, headers=HEADERS, timeout=TIMEOUT) as resp:
            if resp.status != 200 or resp.content_type not in IMAGE_TYPES:
                return None
            body = bytearray()
            async for chunk in resp.content.iter_chunked(65536):
                body += chunk
                if len(body) > MAX_IMAGE:
                    return None
            ext = mimetypes.guess_extension(resp.content_type) or ".jpg"
    except (aiohttp.ClientError, TimeoutError):
        return None
    path = folder / f"image{ext}"
    await hass.async_add_executor_job(path.write_bytes, bytes(body))
    return path


@asynccontextmanager
async def async_folder(
    hass: HomeAssistant,
) -> AsyncIterator[tuple[Path, Callable[[Path], str | None]]]:
    """A fresh folder for one import and `media_id(path)` (the media-source id ai_task resolves;
    None without a media directory: then only text goes to the AI). Deleted afterwards."""
    dirs = hass.config.media_dirs
    key = next(iter(dirs), None)

    def make() -> Path:
        if key is None:
            return Path(tempfile.mkdtemp(prefix="home_inventory_import_"))
        path = Path(dirs[key], FOLDER, uuid.uuid4().hex)
        path.mkdir(parents=True)
        return path

    folder = await hass.async_add_executor_job(make)

    def media_id(path: Path) -> str | None:
        if key is None:
            return None
        return f"media-source://media_source/{key}/{path.relative_to(dirs[key]).as_posix()}"

    try:
        yield folder, media_id
    finally:
        # shortcut: a yt-dlp thread past its timeout may still write; ignore_errors covers that
        await hass.async_add_executor_job(shutil.rmtree, folder, True)
