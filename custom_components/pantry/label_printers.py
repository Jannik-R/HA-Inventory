"""Label printer models: size limits and behaviour per model (the options flow and printing read this)."""

from __future__ import annotations

from collections.abc import Callable
from dataclasses import dataclass
from typing import Any

from PIL import Image

from .const import CONF_LABEL_PRINTER, CONF_LABEL_PRINTER_HOST


@dataclass(frozen=True)
class Model:
    max_width: int  # mm; the minimum is 10 for all models
    max_height: int
    default_width: int
    default_height: int
    network: bool = False  # sent as a raw TCP stream; otherwise printed by the browser
    port: int = 9100
    bottom_reserve_mm: float = 0  # extra blank space at the bottom the printer never prints
    encode: Callable[[list[Image.Image]], bytes] | None = None


_HEAD_DOTS = 672  # LabelWriter 450 print head: 57 mm at 300 dpi
_LINE_BYTES = _HEAD_DOTS // 8


def _dymo_lw4xx(images: list[Image.Image]) -> bytes:
    """LabelWriter 450 stream: header once, per label one SYN + 84 bytes per dot row, then ESC E."""
    height = images[0].height
    data = bytearray(b"\x1be")  # density normal
    data += b"\x1bL" + (height + round(10 / 25.4 * 300)).to_bytes(
        2, "big"
    )  # label length + tolerance
    data += b"\x1bh\x1bB\x00\x1bD" + bytes([_LINE_BYTES])  # 300x300, dot tab 0, bytes per line
    for img in images:
        page = Image.new("1", (_HEAD_DOTS, height), 1)
        page.paste(img, (0, 0))  # narrow labels sit at the left edge of the head (verified)
        raw = bytes(b ^ 0xFF for b in page.tobytes())  # PIL: 1 = white, printer: 1 = black
        for y in range(height):
            data += b"\x16" + raw[y * _LINE_BYTES : (y + 1) * _LINE_BYTES]
        data += b"\x1bE"
    return bytes(data)


MODELS: dict[str, Model] = {
    "browser": Model(200, 200, 57, 32),
    # The 450 never prints the last ~3 mm of a 57x32 label (tested).
    "dymo_lw4xx": Model(57, 200, 57, 32, True, 9100, 3, _dymo_lw4xx),
}


def printer_of(options: Any) -> tuple[str, str]:
    """(model key, host) from the options; an unknown or missing model is the browser."""
    key = options.get(CONF_LABEL_PRINTER)
    return (key if key in MODELS else "browser"), (
        options.get(CONF_LABEL_PRINTER_HOST) or ""
    ).strip()
