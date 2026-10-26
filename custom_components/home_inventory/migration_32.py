"""Migration 32: defaults.seed_lang, the language the seeded names are in (see seed_en.py).

Existing DBs are German. Also fixes the unit of Holunderbeeren (seed typo "Holundeebeeren" never
applied; only while the category has no own unit).
"""

from __future__ import annotations

import sqlite3

from .seed_types import add_seed_extras


def seed_lang(conn: sqlite3.Connection) -> None:
    conn.execute(
        "ALTER TABLE defaults ADD COLUMN seed_lang TEXT NOT NULL DEFAULT 'de'"
        " CHECK (seed_lang IN ('de', 'en'))"
    )
    add_seed_extras(conn, only={"Holunderbeeren"})
