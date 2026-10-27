"""Data language of the AI prompts: the seed language of the DB (instructions stay English)."""

from __future__ import annotations

import sqlite3

from ..seed_en import lang


def language(conn: sqlite3.Connection) -> str:
    """'de' or 'en' (every other seed language is English)."""
    return "de" if lang(conn) == "de" else "en"


def localized(task: str, words: dict[str, dict[str, str]], language: str) -> str:
    """The prompt template with its `@key@` words of this language filled in (stable per language)."""
    for key, value in words[language].items():
        task = task.replace(f"@{key}@", value)
    return task
