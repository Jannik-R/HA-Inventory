"""Receipt printer (ESC/POS): the shopping list, a recipe or the meal plan as one raster image,
cut at the end.

Sent to a device file on the HA host (USB printer, also USB-serial like the TPG A799) or as raw TCP
to host[:port]. Raster instead of text mode: umlauts and fonts work on every ESC/POS printer.
"""

from __future__ import annotations

import asyncio
from datetime import date, timedelta

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

DOTS = {58: 384, 80: 576}  # printable dots per line at 203 dpi (common 58 / 80 mm printers)
BAUDS = (9600, 19200, 38400, 57600, 115200)
_PAD = 8  # dots left and right
_BAND = 24  # rows per ESC * line (24-dot mode)


def target_of(options) -> str:
    """Device path or host[:port]; "" = no receipt printer."""
    return (options.get(CONF_RECEIPT_PRINTER) or "").strip()


def render(title: str, lines: list[tuple[str, str]], width_dots: int) -> Image.Image:
    """Title, then (kind, text) lines: "head" (bold heading after a blank line), "item" (box +
    text), "step" ("3. text": the number stands out, the text wraps under itself), "text"."""
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
        prefix = {"item": box, "step": text.split(" ", 1)[0] + " "}.get(kind, "")
        body = text[len(prefix) :] if kind == "step" else text
        indent = round(scratch.textlength(prefix, font=font))
        for n, part in enumerate(label._wrap(scratch, body, font, width - indent)):
            rows.append(((prefix if n == 0 else "") + part, font, _PAD + (0 if n == 0 else indent)))
    line_h = 34
    img = Image.new("1", (width_dots, line_h * len(rows) + 2 * _PAD), 1)
    draw = ImageDraw.Draw(img)
    for n, (text, f, x) in enumerate(rows):
        draw.text((x, _PAD + n * line_h), text, font=f, fill=0)
    return img


def escpos(img: Image.Image, cut: bool) -> bytes:
    """ESC @, the image as ESC * bit-image lines (24 dots high, line spacing 24 dots), feed, and a
    partial cut (GS V 1) if wanted. ESC * instead of the newer GS v 0 raster command: older
    printers (TPG A799) print GS v 0 data as text."""
    data = bytearray(b"\x1b@\x1b3" + bytes([_BAND]))
    for top in range(0, img.height, _BAND):
        band = Image.new("1", (img.width, _BAND), 1)  # white padding below the last rows
        band.paste(img.crop((0, top, img.width, min(top + _BAND, img.height))), (0, 0))
        # transposed, each image column is a row of 24 bits = the 3 bytes ESC * wants, top bit first
        cols = band.transpose(Image.Transpose.TRANSPOSE).tobytes()
        data += b"\x1b*\x21" + img.width.to_bytes(2, "little")  # mode 33: 24-dot double density
        data += bytes(b ^ 0xFF for b in cols) + b"\n"  # PIL: 1 = white, printer: 1 = black
    # default line spacing, feed 7 lines: past the cutter plus a bottom margin about as large as the
    # top one (the blank paper between print head and cutter, fixed by the printer)
    data += b"\x1b2\x1bd\x07"
    if cut:
        data += b"\x1dV\x01"
    return bytes(data)


_lock = asyncio.Lock()  # one print at a time: two jobs must not interleave on the printer


async def async_send(hass: HomeAssistant, options, data: bytes) -> None:
    async with _lock:
        await _send(hass, options, data)


async def _send(hass: HomeAssistant, options, data: bytes) -> None:
    target = target_of(options)
    if not target:
        raise HomeAssistantError(translation_domain=DOMAIN, translation_key="no_receipt_printer")
    await label.send(target, data, baud=int(options.get(CONF_RECEIPT_BAUD, 9600)))


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
    lines = shopping_lines(items, lambda i: summary(i, lang, short=True))
    if not lines:
        raise ServiceValidationError(translation_domain=DOMAIN, translation_key="nothing_to_print")
    title = TEXT.get(lang, TEXT["en"])["title"].format(date=dt_util.now().date())
    width = DOTS[int(options.get(CONF_RECEIPT_WIDTH, 80))]
    img = await hass.async_add_executor_job(render, title, lines, width)
    await async_send(hass, options, escpos(img, options.get(CONF_RECEIPT_CUT, True)))
    return {"printed": sum(1 for kind, _ in lines if kind == "item")}


# Recipe texts per HA language, like todo.TEXT; other languages get English.
RECIPE_TEXT = {
    "de": {"servings": "{n} Portionen", "jars": "Ergibt {n} Gläser", "ingredients": "Zutaten",
           "steps": "Zubereitung", "optional": "optional", "decimal": ","},
    "en": {"servings": "{n} servings", "jars": "Makes {n} jars", "ingredients": "Ingredients",
           "steps": "Preparation", "optional": "optional", "decimal": "."},
}  # fmt: skip


def recipe_lines(sheet: dict, lang: str) -> list[tuple[str, str]]:
    """Servings, ingredients as boxes (scaled amounts), numbered steps under their sections."""
    txt = RECIPE_TEXT.get(lang, RECIPE_TEXT["en"])
    lines = [("text", txt["jars" if sheet["canning"] else "servings"].format(n=sheet["servings"]))]
    if sheet["ingredients"]:
        lines.append(("head", txt["ingredients"]))
    for i in sheet["ingredients"]:
        amount = f"{i['amount']:g}".replace(".", txt["decimal"]) if i["amount"] is not None else ""
        what = " ".join(p for p in (amount, i["unit"] if amount else "", i["name"]) if p)
        extra = [x for x in (i["note"], txt["optional"] if i["optional"] else None) if x]
        lines.append(("item", f"{what} ({', '.join(extra)})" if extra else what))
    if sheet["steps"] or sheet["instructions"]:
        lines.append(("head", txt["steps"]))
    for n, step in enumerate(sheet["steps"], 1):
        if step["section"]:
            lines.append(("head", step["section"]))
        lines.append(("step", f"{n}. {step['text']}"))
    if not sheet["steps"]:  # a recipe saved before steps existed: its text, paragraph by line
        lines += [("text", p) for p in (sheet["instructions"] or "").splitlines() if p.strip()]
    return lines


async def async_print_recipe(hass: HomeAssistant, options, sheet: dict) -> dict:
    """Print a recipe (from inventory.recipe_sheet); returns {"printed": 1}."""
    lines = recipe_lines(sheet, hass.config.language.split("-")[0])
    width = DOTS[int(options.get(CONF_RECEIPT_WIDTH, 80))]
    img = await hass.async_add_executor_job(render, sheet["name"], lines, width)
    await async_send(hass, options, escpos(img, options.get(CONF_RECEIPT_CUT, True)))
    return {"printed": 1}


# Meal plan texts per HA language; meals in meal_plan.slot order.
PLAN_TEXT = {
    "de": {"title": "Speiseplan", "for": "für {n}", "none": "–",
           "meals": ["Frühstück", "Mittag", "Kaffee", "Abendessen", "Snack"],
           "days": ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"],
           "date": "{d:%d.%m.%Y}", "short": "{d:%d.%m.}"},
    "en": {"title": "Meal plan", "for": "for {n}", "none": "–",
           "meals": ["Breakfast", "Lunch", "Coffee", "Dinner", "Snack"],
           "days": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
           "date": "{d:%Y-%m-%d}", "short": "{d:%m-%d}"},
}  # fmt: skip


def plan_lines(meals: list[dict], start: date, days: int, lang: str) -> tuple[str, list]:
    """Title and lines: per day a heading, then "Meal: dish (for n)"; an empty day shows "–"."""
    txt = PLAN_TEXT.get(lang, PLAN_TEXT["en"])
    end = start + timedelta(days=days - 1)
    span = txt["date"].format(d=end)
    if days > 1:
        span = f"{txt['short'].format(d=start)} – {span}"
    lines: list[tuple[str, str]] = []
    for n in range(days):
        day = start + timedelta(days=n)
        lines.append(("head", f"{txt['days'][day.weekday()]}, {txt['date'].format(d=day)}"))
        dishes = [m for m in meals if m["day"] == day.isoformat()]
        lines += [
            (
                "text",
                f"{txt['meals'][m['slot']]}: {m['name']} ({txt['for'].format(n=m['servings'])})",
            )
            for m in dishes
        ] or [("text", txt["none"])]
    return f"{txt['title']} {span}", lines


async def async_print_plan(
    hass: HomeAssistant, options, meals: list, start: date, days: int
) -> dict:
    """Print the meal plan of `days` days from `start`; returns {"printed": number of dishes}."""
    if not meals:
        raise ServiceValidationError(translation_domain=DOMAIN, translation_key="plan_empty")
    title, lines = plan_lines(meals, start, days, hass.config.language.split("-")[0])
    width = DOTS[int(options.get(CONF_RECEIPT_WIDTH, 80))]
    img = await hass.async_add_executor_job(render, title, lines, width)
    await async_send(hass, options, escpos(img, options.get(CONF_RECEIPT_CUT, True)))
    return {"printed": len(meals)}
