"""Recipe steps: split an imported schema.org instruction into steps, read timers from a step's text."""

from __future__ import annotations

import html
import re
from collections.abc import Iterator

MAX_STEPS = 100
MAX_TEXT = 2000
MAX_SECTION = 100

_TAGS = re.compile(r"<[^<>]+>")
_SPACE_PUNCT = re.compile(r"\s+([.,;:!?])")
_LINES = re.compile(r"<br\s*/?>|\r?\n", re.I)
# "1.", "2)", "Schritt 3:" at the start of a step: the list numbers it already
_LEADING_NO = re.compile(r"^(?:schritt\s*)?\d{1,2}\s*[.):]\s*|^schritt\s*\d{1,2}\s*-?\s*", re.I)
# numbering inside one text block, each after a sentence end: "1. Zwiebeln schälen. 2. Anbraten."
_INLINE_NO = re.compile(r"(?:^|(?<=[.!?:]\s))(\d{1,2})[.)]\s+(?=[A-ZÄÖÜ])")
_NUM = r"\d+(?:[.,]\d+)?|½"
_DURATION = re.compile(
    rf"({_NUM})(?:\s*(?:-|–|bis)\s*({_NUM}))?\s*"
    r"(Sekunden?|Sek\.?|Minuten?|Min\.?|Stunden?|Std\.?|h)(?![a-zäöüß])",
    re.I,
)
_WORDS = (
    (re.compile(r"\b(?:eine[rn]?\s+)?Dreiviertelstunde\b", re.I), 2700),
    (re.compile(r"\b(?:eine[rn]?\s+)?Viertelstunde\b", re.I), 900),
    (re.compile(r"\b(?:eine[rn]?\s+)?halbe[nr]?\s+Stunde\b", re.I), 1800),
    (re.compile(r"\beine[rn]?\s+Stunde\b", re.I), 3600),
)
_MAX_TIMER = 48 * 3600


def _text(value: str) -> str:
    """Plain text: tags out, spaces collapsed, none before punctuation ("<b>a</b>." -> "a.")."""
    return _SPACE_PUNCT.sub(r"\1", " ".join(html.unescape(_TAGS.sub(" ", value)).split()))


def _flat(node: object, section: str | None = None) -> Iterator[tuple[str | None, str]]:
    """(section, raw text) per HowToStep / string, in order."""
    if isinstance(node, str):
        yield section, node
    elif isinstance(node, list):
        for child in node:
            yield from _flat(child, section)
    elif isinstance(node, dict):
        if "itemListElement" in node:  # HowToSection
            name = node.get("name")
            yield from _flat(
                node["itemListElement"], _text(name) if isinstance(name, str) else None
            )
        elif isinstance(node.get("text"), str):
            yield section, node["text"]


def _split_block(raw: str) -> list[str]:
    """One text block: its lines, else its own numbering (1., 2., … in order), else itself."""
    lines = [line for line in (_text(x) for x in _LINES.split(raw)) if line]
    if len(lines) > 1:
        return lines
    flat = _text(raw)
    starts, expected = [], 1
    for m in _INLINE_NO.finditer(flat):
        if int(m[1]) == expected:
            starts.append(m.start(1))
            expected += 1
    if len(starts) < 2:
        return [flat] if flat else []
    starts[0] = 0  # text before "1." belongs to the first step
    return [flat[a:b].strip() for a, b in zip(starts, [*starts[1:], len(flat)], strict=True)]


def import_steps(value: object) -> list[dict]:
    """schema.org recipeInstructions -> [{section, text}]; a section name only on the first step
    of each section, and only when there is more than one section."""
    raw = [(s, t) for s, t in _flat(value) if t.strip()]
    if len(raw) == 1:  # one block: split it by lines or its own numbering
        raw = [(raw[0][0], part) for part in _split_block(raw[0][1])]
    rows = [(s, _LEADING_NO.sub("", _text(t)).strip()) for s, t in raw]
    rows = [(s, t) for s, t in rows if t]
    several = len({s for s, _ in rows}) > 1
    steps, last = [], None
    for section, text in rows[:MAX_STEPS]:
        head = section if several and section != last else None
        steps.append({"section": head[:MAX_SECTION] if head else None, "text": text[:MAX_TEXT]})
        last = section
    return steps


def _number(value: str) -> float:
    return 0.5 if value == "½" else float(value.replace(",", "."))


def timers(text: str) -> list[dict]:
    """Durations in a step's text, in order: [{seconds, label}]; a range uses its upper value."""
    found: list[tuple[int, int, str]] = []
    for m in _DURATION.finditer(text):
        word = m[3].lower()
        unit = 1 if word.startswith("sek") else 3600 if word.startswith(("st", "h")) else 60
        seconds = round(_number(m[2] or m[1]) * unit)
        if 0 < seconds <= _MAX_TIMER:
            found.append((m.start(), seconds, m[0]))
    taken = [(m.start(), m.end()) for m in _DURATION.finditer(text)]
    for pattern, seconds in _WORDS:
        for m in pattern.finditer(text):
            if not any(a < m.end() and m.start() < b for a, b in taken):
                taken.append((m.start(), m.end()))
                found.append((m.start(), seconds, m[0]))
    return [{"seconds": s, "label": label} for _, s, label in sorted(found)]
