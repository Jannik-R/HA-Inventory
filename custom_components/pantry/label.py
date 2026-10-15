"""Label drawing and sending (no database): QR code + text as a 1-bit image, PNG data urls, raw TCP."""

from __future__ import annotations

import asyncio
import base64
import io
from datetime import date
from pathlib import Path

import segno
from homeassistant.exceptions import HomeAssistantError
from PIL import Image, ImageDraw, ImageFont

from .const import DOMAIN

DPI = 300
FONTS = Path(__file__).parent / "fonts"  # DejaVu: Pillow's default font has no umlauts
MARGIN = round(2 / 25.4 * DPI)  # the printer cuts about 1.5 mm at the edges


def _font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    name = "DejaVu-Sans-Condensed-Bold.ttf" if bold else "DejaVu-Sans-Condensed.ttf"
    return ImageFont.truetype(FONTS / name, size)


def _dots(mm: float) -> int:
    return round(mm / 25.4 * DPI)


def _wrap(draw: ImageDraw.ImageDraw, text: str, font, width: int) -> list[str]:
    """Greedy word wrap; a word wider than the line is broken by characters."""
    lines: list[str] = []
    line = ""
    for word in text.split():
        for part in _split_long(draw, word, font, width):
            test = f"{line} {part}".strip()
            if line and draw.textlength(test, font=font) > width:
                lines.append(line)
                test = part
            line = test
    return [*lines, line] if line else lines


def _split_long(draw, word: str, font, width: int) -> list[str]:
    parts, cur = [], ""
    for ch in word:
        if cur and draw.textlength(cur + ch, font=font) > width:
            parts.append(cur)
            cur = ""
        cur += ch
    return [*parts, cur]


def render(info: dict, width_mm: float, height_mm: float, reserve_mm: float = 0) -> Image.Image:
    """One label (mode 1, black on white): QR code left, texts right; `reserve_mm` stays blank at the bottom."""
    w, h = _dots(width_mm), _dots(height_mm)
    margin_bottom = MARGIN + _dots(reserve_mm)
    img = Image.new("1", (w, h), 1)
    draw = ImageDraw.Draw(img)
    # make_qr: segno.make picks a Micro QR for short data, which phones and most scanners cannot read.
    matrix = segno.make_qr(info["code"], error="m", boost_error=False).matrix
    scale = max(1, (h - MARGIN - margin_bottom) // len(matrix))
    for y, row in enumerate(matrix):
        for x, bit in enumerate(row):
            if bit:
                px, py = MARGIN + x * scale, MARGIN + y * scale
                draw.rectangle((px, py, px + scale - 1, py + scale - 1), fill=0)
    left = MARGIN + len(matrix) * scale + max(MARGIN, 3 * scale)  # quiet zone before the text
    text_w = w - MARGIN - left
    small = _font(h // 14)
    # Bottom: expiry (big, only with a date); the name uses the rest above.
    bottom = h - margin_bottom
    if info.get("expires_on"):
        big = _font(h // 9, bold=True)
        draw.text(
            (left, bottom), date.fromisoformat(info["expires_on"]).strftime("%d.%m.%Y"),
            font=big, fill=0, anchor="ld",
        )  # fmt: skip
        bottom -= h // 8
    brand_h = 0
    if info.get("brand"):
        brand_h = h // 12
        draw.text((left, bottom), info["brand"], font=small, fill=0, anchor="ld")
    avail = bottom - brand_h - MARGIN
    # Biggest font where the name fits in 3 lines; below the minimum size it is cut with "…".
    for size in range(h // 7, h // 16, -2):
        font = _font(size, bold=True)
        lines = _wrap(draw, info["name"], font, text_w)
        if len(lines) <= 3 and len(lines) * size * 1.2 <= avail:
            break
    if len(lines) > 3:
        lines[2] = lines[2].rstrip() + "…"
        while len(lines[2]) > 1 and draw.textlength(lines[2], font=font) > text_w:
            lines[2] = lines[2][:-2] + "…"
    for i, line in enumerate(lines[:3]):
        draw.text((left, MARGIN + i * size * 1.2), line, font=font, fill=0)
    return img


def png_data_urls(images: list[Image.Image]) -> list[str]:
    urls = []
    for img in images:
        buf = io.BytesIO()
        img.save(buf, "PNG")
        urls.append(
            "data:image/png;base64," + base64.b64encode(buf.getvalue()).decode()
        )
    return urls


async def send(host_port: str, data: bytes, default_port: int = 9100) -> None:
    """Raw TCP to the print server ("host" or "host:port")."""
    host, _, port = host_port.strip().partition(":")
    try:
        async with asyncio.timeout(10):
            _, writer = await asyncio.open_connection(host, int(port or default_port))
            writer.write(data)
            await writer.drain()
            writer.close()
            await writer.wait_closed()
    except (OSError, TimeoutError, ValueError) as err:
        raise HomeAssistantError(
            translation_domain=DOMAIN, translation_key="printer_unreachable"
        ) from err
