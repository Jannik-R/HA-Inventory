"""Learned category choices: an ingredient text or an OFF tag -> the category a human (or the
checked AI answer a human saved) chose. Asked before the rule based suggestion."""

from __future__ import annotations

import re
import sqlite3


def learned_key(text: str) -> str:
    """Letters only, lower case, single spaces: "Zwiebel, rot" and "zwiebel rot" are one key."""
    return " ".join(re.findall(r"[^\W\d_]+", text.casefold()))[:200]


def learned(conn: sqlite3.Connection, kind: str, text: str) -> int | None:
    row = conn.execute(
        "SELECT category_id FROM learned_category WHERE kind = ? AND key = ?",
        (kind, learned_key(text)),
    ).fetchone()
    return row[0] if row else None


def learn(conn: sqlite3.Connection, kind: str, text: str, category_id: int) -> None:
    if key := learned_key(text):
        conn.execute(
            "INSERT INTO learned_category (kind, key, category_id) VALUES (?, ?, ?)"
            " ON CONFLICT (kind, key) DO UPDATE SET category_id = excluded.category_id",
            (kind, key, category_id),
        )
