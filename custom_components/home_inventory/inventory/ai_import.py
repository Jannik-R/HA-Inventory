"""AI recipe import (no JSON-LD, social media, pasted text, photo): the prompt, the text sources of
a page (Open Graph tags, visible text) and the answer as a schema.org-like Recipe that
`recipe_import.recipe_draft` turns into the usual draft. Pure, no HA: ai.py / recipe_ai.py call it."""

from __future__ import annotations

import html
import re

from .ai_lang import localized
from .steps import MAX_SECTION, MAX_STEPS, MAX_TEXT

MAX_PAGE_TEXT = 15_000  # visible text of a page sent to the AI (characters)
MAX_PASTE = 20_000  # pasted text (also the websocket limit)
MAX_CAPTION = 5_000

_META = re.compile(r"<meta\s[^<>]*>", re.I)
_ATTR = re.compile(r"""([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+))""")
_TAGS = re.compile(r"<[^<>]+>")
_HIDDEN = ("script", "style", "noscript", "svg", "template")

_TASK = """You read a recipe for "Vorrat", a household inventory app, from the sources below and
the attached files (a video with its spoken words and on-screen text, or photos, e.g. of a
cookbook page). The recipe may be in the caption, spoken, shown on screen or in a photo; combine
what they say.

Answer with JSON only.
- No recipe in the sources: {"found": false}
- Otherwise {"found": true, "name": <dish name>, "servings": <number; 4 if not stated>,
  "ingredients": [<one line per ingredient>],
  "steps": [{"text": <one action-sized step>, "section": <only for real sub-parts, e.g. "@dough@">}]}
Write everything in @lang@ (translate if needed). Ingredient lines as in a @lang@ cookbook:
amount, unit, name, then a comma and a note: @lines@. Metric units (@units@); convert cups and
ounces: liquids to ml, solids to g or pieces (never ml for onions, flour or cheese). Do not invent ingredients, amounts or steps; leave out what is not part of the recipe
(hashtags, ads, greetings, links).
"""


_WORDS = {
    "de": {
        "lang": "German",
        "lines": '"200 g Mehl", "1 TL Salz", "2 Zwiebeln, fein gewürfelt", "Pfeffer"',
        "units": "g, kg, ml, l, EL, TL, Prise, Stück",
        "dough": "Teig",
    },
    "en": {
        "lang": "English",
        "lines": '"200 g flour", "1 tsp salt", "2 onions, finely diced", "pepper"',
        "units": "g, kg, ml, l, tbsp, tsp, pinch, piece",
        "dough": "Dough",
    },
}


def _hidden_removed(page: str) -> str:
    """The page without script/style/... blocks, in one pass (a lazy regex backtracks on hostile pages)."""
    low, out, pos = page.lower(), [], 0
    found = {tag: low.find(f"<{tag}") for tag in _HIDDEN}  # next start per tag, -1 = none left
    while True:
        for tag, i in found.items():
            if -1 < i < pos:  # inside the block just skipped: look again after it
                found[tag] = low.find(f"<{tag}", pos)
        starts = [(i, tag) for tag, i in found.items() if i != -1]
        if not starts:
            out.append(page[pos:])
            return "".join(out)
        start, tag = min(starts)
        out.append(page[pos:start])
        end = low.find(f"</{tag}", start)
        if end == -1:
            return "".join(out)
        pos = low.find(">", end) + 1 or len(page)


def _clean(text: str) -> str:
    return " ".join(html.unescape(_TAGS.sub(" ", text)).split())


def page_sources(page: str) -> dict:
    """{title, description, image, text} of a page: Open Graph / meta tags and the visible text."""
    meta: dict[str, str] = {}
    for tag in _META.findall(page):
        attrs = {m[1].lower(): m[2] or m[3] or m[4] for m in _ATTR.finditer(tag)}
        key = (attrs.get("property") or attrs.get("name") or "").lower()
        if key and "content" in attrs and key not in meta:
            meta[key] = html.unescape(attrs["content"]).strip()
    image = meta.get("og:image") or meta.get("twitter:image")
    return {
        "title": (meta.get("og:title") or meta.get("twitter:title") or "")[:500],
        "description": (meta.get("og:description") or meta.get("description") or "")[:MAX_CAPTION],
        "image": image if image and re.match(r"https?://", image) and len(image) <= 2000 else None,
        "text": _clean(_hidden_removed(page))[:MAX_PAGE_TEXT],
    }


def prompt(sources: dict, language: str = "de") -> str:
    """The instructions for ai_task: the task, then each non-empty text source."""
    labels = (
        ("title", "Title"),
        ("description", "Caption / description"),
        ("text", "Text"),
    )
    parts = [f"{label}:\n{sources[key]}" for key, label in labels if sources.get(key)]
    return (
        localized(_TASK, _WORDS, language)
        + "\nSources:\n"
        + ("\n\n".join(parts) or "(only the attached files)")
        + "\n"
    )


def to_recipe(answer: object, image: str | None = None) -> dict | None:
    """The AI answer as a schema.org Recipe dict (bounded), or None when it found no recipe."""
    if not isinstance(answer, dict) or not answer.get("found"):
        return None
    lines = [str(x).strip()[:500] for x in answer.get("ingredients") or [] if str(x).strip()]
    steps = [
        s
        for s in answer.get("steps") or []
        if isinstance(s, dict) and str(s.get("text") or "").strip()
    ][:MAX_STEPS]
    if not lines and not steps:
        return None
    # one HowToSection per run of the same section, so import_steps keeps the headings
    instructions: list[dict] = []
    for s in steps:
        section = str(s.get("section") or "").strip()[:MAX_SECTION]
        step = {"@type": "HowToStep", "text": str(s["text"]).strip()[:MAX_TEXT]}
        if instructions and instructions[-1]["name"] == section:
            instructions[-1]["itemListElement"].append(step)
        else:
            instructions.append({"name": section, "itemListElement": [step]})
    servings = answer.get("servings")
    return {
        "@type": "Recipe",
        "name": str(answer.get("name") or "").strip()[:200],
        "recipeYield": servings if isinstance(servings, int) and servings > 0 else 4,
        "recipeIngredient": lines[:100],
        "recipeInstructions": instructions,
        "image": image,
    }
