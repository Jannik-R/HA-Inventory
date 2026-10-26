"""Category suggestion for new products (OFF tags, keywords, similar names)."""

from __future__ import annotations

import re
import sqlite3

from ..keywords import KEYWORDS
from ..keywords_en import KEYWORDS_EN
from ..seed_en import lang
from .common import unit_key
from .inherit import _categories, _chain, category_tags, is_type
from .learned import learned


def suggest_category(conn: sqlite3.Connection, tags: list[str]) -> int | None:
    """A learned choice for the most specific tag, else the deepest category whose off_tags meet
    the product's OFF tags; tie: more specific tag."""
    if tags and (cid := learned(conn, "off_tag", tags[-1])):
        return cid
    pos = {t: i for i, t in enumerate(tags)}
    cats = _categories(conn)
    found = [
        ((len(_chain(cats, cid)), max(hits)), cid)
        for cid, tags_of in category_tags(conn).items()
        if (hits := [pos[t] for t in tags_of if t in pos])
    ]
    return max(found)[1] if found else None


# Word endings that still count as the same word ("Gurke" -> "Gurken", "Ei" -> "Eier").
_ENDINGS = ("", "e", "n", "en", "s", "er", "es")


_KEYWORDS = [(kw, tag) for tag, kws in KEYWORDS.items() for kw in kws]
_KEYWORDS_EN = [(kw, tag) for tag, kws in KEYWORDS_EN.items() for kw in kws]


_MIN_SCORE = 5


def _words(text: str) -> list[str]:
    return re.findall(r"[^\W\d_]+", text.casefold())


def keyword_score(word: str, keyword: str) -> int | None:
    """How well a keyword matches one word of a product name; None = no match.

    Longer keywords are more specific; whole word > end of a compound (the German head:
    "Tomatensauce" is a sauce) > start of a compound. Matches inside a word do not count.
    """
    if word in (keyword + e for e in _ENDINGS):
        bonus = 10
    # short keywords ("ei", "öl") as a compound end only without ending: "Weißwein" is no "ei"+"n"
    elif any(word.endswith(keyword + e) for e in (_ENDINGS if len(keyword) > 2 else ("",))):
        bonus = 5
    elif word.startswith(keyword):
        bonus = 2
    else:
        return None
    return len(keyword) + bonus


def _type_stems(cats: dict) -> list[tuple[tuple[str, ...], int]]:
    """(plural-insensitive words, id) of every product type: "Schalotte" meets Schalotten."""
    return [
        (tuple(map(unit_key, _words(c["name"]))), cid)
        for cid, c in cats.items()
        if is_type(cats, cid)
    ]


def _type_at(types: list, stems: list[str], i: int) -> int | None:
    """Longest product type whose whole name (any word count) starts at word i."""
    found = [(len(t), cid) for t, cid in types if tuple(stems[i : i + len(t)]) == t]
    return max(found)[1] if found else None


def suggest_type(conn: sqlite3.Connection, name: str) -> int | None:
    """Product type that `name` starts with, by whole name ("Pak Choi", "Crème fraîche")."""
    return _type_at(_type_stems(_categories(conn)), [unit_key(w) for w in _words(name)], 0)


def suggest_by_keywords(conn: sqlite3.Connection, name: str) -> int | None:
    """Category from name keywords (keywords.py). German: the first name word with a match
    decides (names put the product before the variety: "Joghurt Erdbeere", "Tomatensauce
    Basilikum"); within it the best score wins, then the deeper category. English (head noun
    last: "Strawberry yogurt" is a yogurt): the first position where a product type matches,
    else the last word with a match."""
    cats = _categories(conn)
    # Single-word product types (third level) match by their own name, e.g. "Tomatenmark".
    types = [
        (c["name"].casefold(), cid)
        for cid, c in cats.items()
        if is_type(cats, cid) and " " not in c["name"]
    ]
    tag_cats: dict[str, list[int]] = {}
    for cid, tags in category_tags(conn).items():
        for tag in tags:
            tag_cats.setdefault(tag, []).append(cid)
    words = _words(name)
    stems, phrases = [unit_key(w) for w in words], _type_stems(cats)
    keywords = _KEYWORDS_EN if lang(conn) == "en" else _KEYWORDS

    def best(word: str) -> int | None:
        found = [
            (score, len(_chain(cats, cid)), cid)
            for kw, tag in keywords
            if (score := keyword_score(word, kw)) is not None and score >= _MIN_SCORE
            for cid in tag_cats.get(tag, [])
        ] + [
            (score, len(_chain(cats, cid)), cid)
            for kw, cid in types
            if (score := keyword_score(word, kw)) is not None and score >= _MIN_SCORE
        ]
        return max(found)[2] if found else None

    if keywords is _KEYWORDS_EN:
        exact = (_type_at(phrases, stems, i) for i in range(len(words)))
        return next(filter(None, exact), None) or next(filter(None, map(best, words[::-1])), None)
    for i, word in enumerate(words):
        if exact := _type_at(phrases, stems, i):
            return exact
        if found := best(word):
            return found
    return None


def suggest_by_name(conn: sqlite3.Connection, name: str) -> int | None:
    """Category of the saved product sharing the most name words (longer words weigh more)."""
    words = {w for w in _words(name) if len(w) >= 4}
    found = [
        (sum(map(len, shared)), r["updated_at"], r["category_id"])
        for r in conn.execute("SELECT name, category_id, updated_at FROM product")
        if (shared := words & set(_words(r["name"])))
    ]
    return max(found)[2] if found else None


def suggest(conn: sqlite3.Connection, tags: list[str], name: str) -> int | None:
    """OFF tags first, then keywords in the name, then similar saved products."""
    return (
        suggest_category(conn, tags)
        or suggest_by_keywords(conn, name)
        or suggest_by_name(conn, name)
    )
