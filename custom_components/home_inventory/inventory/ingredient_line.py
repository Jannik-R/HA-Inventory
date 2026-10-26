"""Parse one German ingredient line ("1 ½ Tassen Mehl, gesiebt") and match/add units. Pure sqlite."""

from __future__ import annotations

import html
import re
import sqlite3
from fractions import Fraction

from .common import _SUFFIX, InventoryError, unit_key

_PLURAL_SUFFIX = re.compile(r"(?<=\w)\((?:e|n|en|s|se|er|nen)\)")  # Zwiebel(n), Ei(er): no note
_SIZE = re.compile(
    r"(klein(?:e[nrs]?)?|kl\.|(?:m\.-?|mittel)?(?:groß(?:e[nrs]?)?|gr\.)|mittlere[nrs]?)\s+", re.I
)
# Chefkoch: "1 TL, gestr. Salz" - qualifier after the unit
_UNIT_QUALIFIER = re.compile(
    r",\s*(gestr(?:ichen(?:e[nrs]?)?|\.)|gehäuft(?:e[nrs]?)?|knapp(?:e[nrs]?)?|voll|reichlich|"
    r"leicht gehäuft(?:e[nrs]?)?)\s+",
    re.I,
)
_FOR_CLAUSE = re.compile(r"(.+?)\s+((?:für|zum|zur)\s.*)", re.I)  # "Mehl für die Form"
_EGG_PART = re.compile(r"(eigelb|eidotter|eiweiß|eiweiss|eiklar)e?s?", re.I)  # not a product
# alias -> unit name it stands for (used only when that unit exists)
_ALIASES = {
    "stück": "Stück", "stk": "Stück", "pck": "Packung", "pkg": "Packung", "pkt": "Packung",
    "päckchen": "Packung", "packung": "Packung", "gramm": "g", "kilogramm": "kg", "kilo": "kg",
    "liter": "l", "milliliter": "ml", "gläser": "Glas", "blätter": "Blatt", "bünde": "Bund",
    "msp": "Messerspitze", "tüte": "Packung", "tüten": "Packung", "stängel": "Stiel",
    "fläschchen": "Flasche",
    "pcs": "piece", "pack": "package", "packet": "package", "gram": "g", "kilogram": "kg",
    "litre": "l", "millilitre": "ml", "lbs": "pound", "tbs": "tablespoon", "tbl": "tablespoon",
    "leaves": "leaf", "floz": "fluid ounce",
}  # fmt: skip
_FL_OZ = re.compile(r"\bfl(?:uid)?\.?\s*(?:oz|ounces?)\b\.?", re.I)  # "fl oz" -> one word
_FRACTIONS = {"½": " 1/2", "¼": " 1/4", "¾": " 3/4", "⅓": " 1/3", "⅔": " 2/3", "⅛": " 1/8"}
_NUM = r"\d+/\d+|\d+(?:[.,]\d+)?(?:\s+\d+/\d+)?"
_AMOUNT = re.compile(rf"(?:ca\.\s*)?({_NUM})(?:\s*[-–]\s*({_NUM}))?", re.I)
_OPTIONAL = re.compile(r"(?:evtl\.|eventuell|optional)\s*", re.I)
_VAGUE = re.compile(r"(?:n\.\s*B\.|nach Belieben|etwas|einige|ein paar|wenig)(?=\s|$)", re.I)
_TOKEN = re.compile(r"[^\W\d_][^\s,(]*")


def _parens(s: str) -> tuple[str, list[str]]:
    """(s without its top-level parentheses, their contents); nested ones stay in the content."""
    out, groups, depth, start = "", [], 0, 0
    for i, c in enumerate(s):
        if c == "(":
            depth += 1
            start = i + 1 if depth == 1 else start
        elif c == ")" and depth:
            depth -= 1
            if not depth:
                groups.append(s[start:i])
        elif not depth:
            out += c
    if depth:  # unclosed: keep its text as a note
        groups.append(s[start:])
    return out, groups


def unit_lookup(conn: sqlite3.Connection) -> dict[str, int]:
    """unit_key of every unit name and symbol (plus aliases for existing units) -> unit id."""
    rows = conn.execute("SELECT id, name, symbol FROM unit").fetchall()
    keys = {unit_key(v): r["id"] for r in rows for v in (r["name"], r["symbol"])}
    for r in rows:  # English plurals the German stripping does not reach: cloves, tablespoons
        for v in (r["name"], r["symbol"]):
            for plural in (v + "s", v + "es") if len(v) > 2 else ():
                keys.setdefault(unit_key(plural), r["id"])
    ids = {r["name"]: r["id"] for r in rows}
    for alias, target in _ALIASES.items():
        if target in ids:
            keys.setdefault(unit_key(alias), ids[target])
    return keys


def unit_add(conn: sqlite3.Connection, name: str, symbol: str | None = None) -> int:
    """New count unit (recipe-only), or the id of an existing one with the same unit_key (Tasse = Tassen)."""
    name, symbol = name.strip(), (symbol or "").strip() or name.strip()
    if not name or len(name) > 200 or len(symbol) > 50:
        raise InventoryError("invalid_value")
    keys = unit_lookup(conn)
    if found := keys.get(unit_key(name)) or keys.get(unit_key(symbol)):
        return found
    return conn.execute(
        "INSERT INTO unit (name, symbol, is_count, factor, recipe_only) VALUES (?, ?, 1, 1, 1)",
        (name, symbol),
    ).lastrowid


def _value(s: str) -> float:
    return round(float(sum(Fraction(p.replace(",", ".")) for p in s.split())), 6)


def _hint(token: str) -> str:
    """Proposed unit name from an unknown token: Tassen -> Tasse."""
    token = _SUFFIX.sub("", token.rstrip(".")).strip()
    if token.endswith("en") and len(token) >= 5 and not token.endswith("chen"):
        token = token[:-1]
    return token[:1].upper() + token[1:]


def parse_ingredient(line: str, units: dict[str, int], piece_id: int | None) -> dict:
    """{text, amount, unit_id, unit_hint, note, optional, line} for one recipe ingredient line."""
    original = line.strip()[:200]
    for char, repl in _FRACTIONS.items():
        line = line.replace(char, repl)
    line = _FL_OZ.sub("floz", line)
    rest = _PLURAL_SUFFIX.sub("", " ".join(html.unescape(line).split()))
    notes: list[str] = []
    optional = bool(m := _OPTIONAL.match(rest))
    rest = rest[m.end() :] if m else rest
    amount = unit_id = unit_hint = unit_word = None
    lead: list[str] = []
    if m := _VAGUE.match(rest):
        notes.append(m[0])
        rest = rest[m.end() :].strip()
    elif m := _AMOUNT.match(rest):
        try:
            amount = _value(m[2] or m[1]) or None
        except (ZeroDivisionError, ValueError):
            amount = None
        rest = rest[m.end() :].strip()
        if m := _SIZE.match(rest):  # before the unit: "1 gr. Dose Pfirsiche"
            notes.append(m[1])
            rest = rest[m.end() :]
        if amount:
            token = _TOKEN.match(rest)
            word = token[0] if token else ""
            after = _parens(rest[len(word) :])[0].split(",")[0].strip() if token else ""
            if token and unit_key(word) in units:
                unit_id, rest = units[unit_key(word)], rest[len(word) :].strip()
                if m := _UNIT_QUALIFIER.match(rest):
                    lead.append(m[1])
                    rest = rest[m.end() :]
            # recipe_import reverts this when the word is itself an ingredient ("2 Zwiebeln rot")
            elif token and word[0].isupper() and after and not _EGG_PART.fullmatch(word):
                unit_hint, unit_word, rest = _hint(word), word, rest[len(word) :].strip()
            else:
                unit_id = piece_id
                amount = amount if piece_id else None
    outside, parens = _parens(rest)
    name, _, after = outside.partition(",")
    name = " ".join(name.split())
    if m := _FOR_CLAUSE.fullmatch(name):
        name, notes = m[1], [m[2], *notes]
    if _EGG_PART.fullmatch(name):  # "2 Eigelb" = 2 eggs, note says which part
        part = "Eigelb" if name.casefold().startswith(("eigelb", "eidotter")) else "Eiweiß"
        name = "Ei"
        lead.append(part)
    notes = [*lead, after.strip(), *parens, *notes]
    return {
        "text": (name or original)[:200],
        "amount": amount,
        "unit_id": unit_id,
        "unit_hint": unit_hint,
        "unit_word": unit_word,  # as written; recipe_import pops it
        "note": ", ".join(n.strip() for n in notes if n.strip())[:200] or None,
        "optional": optional,
        "line": original,
    }
