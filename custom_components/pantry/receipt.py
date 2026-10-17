"""Receipt printer (ESC/POS): the shopping list as one raster image, cut at the end.

Sent to a device file on the HA host (USB printer, also USB-serial like the TPG A799) or as raw TCP
to host[:port]. Raster instead of text mode: umlauts and fonts work on every ESC/POS printer.
"""

from __future__ import annotations

import asyncio
import logging
import os

from homeassistant.core import HomeAssistant
from homeassistant.exceptions import HomeAssistantError, ServiceValidationError
from homeassistant.util import dt as dt_util
from PIL import Image, ImageDraw

from . import label
from .const import (
    CONF_RECEIPT_BAUD,
    CONF_RECEIPT_CUT,
    CONF_RECEIPT_PRINTER,
    CONF_RECEIPT_WIDTH,
    DOMAIN,
)

_LOGGER = logging.getLogger(__name__)
DOTS = {58: 384, 80: 576}  # printable dots per line at 203 dpi (common 58 / 80 mm printers)
BAUDS = (9600, 19200, 38400, 57600, 115200)
_PAD = 8  # dots left and right
_BAND = 256  # rows per raster command: some printers limit one command's height


def target_of(options) -> str:
    """Device path or host[:port]; "" = no receipt printer."""
    return (options.get(CONF_RECEIPT_PRINTER) or "").strip()


def render(title: str, lines: list[tuple[str, str]], width_dots: int) -> Image.Image:
    """Title, then (kind, text) lines: kind "head" (bold group heading) or "item" (box + text)."""
    title_font, head_font, font = label._font(34, True), label._font(26, True), label._font(26)
    box = "☐ "
    scratch = ImageDraw.Draw(Image.new("1", (1, 1)))
    width = width_dots - 2 * _PAD
    rows: list[tuple[str, object, int]] = []  # text, font, x
    for part in label._wrap(scratch, title, title_font, width):
        rows.append((part, title_font, _PAD))
    for kind, text in lines:
        if kind == "head":
            rows.append(("", font, 0))  # blank line before a group
            rows += [(p, head_font, _PAD) for p in label._wrap(scratch, text, head_font, width)]
            continue
        indent = round(scratch.textlength(box, font=font))
        for n, part in enumerate(label._wrap(scratch, text, font, width - indent)):
            rows.append(((box if n == 0 else "") + part, font, _PAD + (0 if n == 0 else indent)))
    line_h = 34
    img = Image.new("1", (width_dots, line_h * len(rows) + 2 * _PAD), 1)
    draw = ImageDraw.Draw(img)
    for n, (text, f, x) in enumerate(rows):
        draw.text((x, _PAD + n * line_h), text, font=f, fill=0)
    return img


def escpos(img: Image.Image, cut: bool) -> bytes:
    """ESC @, the image as GS v 0 raster bands, feed, and a partial cut (GS V 1) if wanted."""
    width_bytes = (img.width + 7) // 8
    data = bytearray(b"\x1b@")
    for top in range(0, img.height, _BAND):
        band = img.crop((0, top, width_bytes * 8, min(top + _BAND, img.height)))
        raw = bytes(b ^ 0xFF for b in band.tobytes())  # PIL: 1 = white, printer: 1 = black
        data += (
            b"\x1dv0\x00" + width_bytes.to_bytes(2, "little") + band.height.to_bytes(2, "little")
        )
        data += raw
    data += b"\x1bd\x05"  # feed 5 lines past the cutter
    if cut:
        data += b"\x1dV\x01"
    return bytes(data)


def write_device(path: str, data: bytes, baud: int) -> None:
    """Blocking write to a device file; a serial port is set raw (no newline translation) at `baud`."""
    fd = os.open(path, os.O_WRONLY | os.O_NOCTTY)
    try:
        if os.isatty(fd):
            import termios  # Linux only (HA runs there); local, so the module loads elsewhere
            import tty

            tty.setraw(fd)
            attrs = termios.tcgetattr(fd)
            attrs[4] = attrs[5] = getattr(termios, f"B{baud}")
            termios.tcsetattr(fd, termios.TCSANOW, attrs)
        view = memoryview(data)
        while view:
            view = view[os.write(fd, view) :]
        if os.isatty(fd):
            termios.tcdrain(fd)
    finally:
        os.close(fd)


_lock = asyncio.Lock()  # one print at a time: two jobs must not interleave on the printer


async def async_send(hass: HomeAssistant, options, data: bytes) -> None:
    async with _lock:
        await _send(hass, options, data)


async def _send(hass: HomeAssistant, options, data: bytes) -> None:
    target = target_of(options)
    if not target:
        raise HomeAssistantError(translation_domain=DOMAIN, translation_key="no_receipt_printer")
    if not target.startswith("/"):
        await label.send(target, data)  # raw TCP, port 9100 by default
        return
    baud = int(options.get(CONF_RECEIPT_BAUD, 9600))
    try:
        await hass.async_add_executor_job(write_device, target, data, baud)
    except OSError as err:
        # the form only says "not reachable"; the reason (busy, offline, missing) goes to the log
        _LOGGER.warning("Receipt printer %s: %s", target, err)
        raise HomeAssistantError(
            translation_domain=DOMAIN, translation_key="printer_unreachable"
        ) from err


def shopping_lines(items: list[dict], summary) -> list[tuple[str, str]]:
    """Open (unchecked) items, grouped under their main category in list order."""
    lines: list[tuple[str, str]] = []
    group = None
    for item in items:
        if item["done"]:
            continue
        if item["path"][0] != group:
            group = item["path"][0]
            lines.append(("head", group))
        lines.append(("item", summary(item)))
    return lines


async def async_print_shopping_list(hass: HomeAssistant, options, items: list[dict]) -> dict:
    """Print the open shopping list items; returns {"printed": number of items}."""
    from .todo import TEXT, summary  # todo imports the entity platform: load it only here

    lang = hass.config.language.split("-")[0]
    lines = shopping_lines(items, lambda i: summary(i, lang))
    if not lines:
        raise ServiceValidationError(translation_domain=DOMAIN, translation_key="nothing_to_print")
    title = TEXT.get(lang, TEXT["en"])["title"].format(date=dt_util.now().date())
    width = DOTS[int(options.get(CONF_RECEIPT_WIDTH, 80))]
    img = await hass.async_add_executor_job(render, title, lines, width)
    await async_send(hass, options, escpos(img, options.get(CONF_RECEIPT_CUT, True)))
    return {"printed": sum(1 for kind, _ in lines if kind == "item")}
