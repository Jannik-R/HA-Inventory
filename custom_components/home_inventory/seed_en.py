"""English seed (phase 38): a new DB is seeded in German, then renamed in one pass by `to_english`.

Ids stay, so everything the post-seed setters wrote carries over. `seeded` is for by-name
seeders that also run on existing DBs (a later migration, first use): wrap the German name in it.
"""

from __future__ import annotations

import sqlite3

from .seed_en_more import EN_MORE
from .seed_en_names import EN_LOCATIONS, EN_NAMES, EN_UNITS

CATEGORIES: dict[str, str | None] = {**EN_NAMES, **EN_MORE}  # None = German synonym
# All German seeded names (categories, locations, units) -> English, for `seeded`.
NAMES: dict[str, str | None] = {
    **CATEGORIES,
    **EN_LOCATIONS,
    **{de: en[0] for de, en in EN_UNITS.items()},
}
# (name, symbol, base unit, factor): recipe-only units of an English DB
NEW_UNITS = [
    ("ounce", "oz", "g", 28.3495),
    ("pound", "lb", "g", 453.592),
    ("fluid ounce", "fl oz", "ml", 29.5735),
]
CUP_ML = 240  # US cup (the German seed has 250 ml)


def lang(conn: sqlite3.Connection) -> str:
    """Seed language of this DB; 'de' for a DB before migration 32."""
    try:
        row = conn.execute("SELECT seed_lang FROM defaults WHERE id = 1").fetchone()
    except sqlite3.OperationalError:
        return "de"
    return row[0] if row else "de"


def seeded(conn: sqlite3.Connection, name: str) -> str:
    """The seeded German `name` as it is called in this DB."""
    return name if lang(conn) != "en" else NAMES.get(name) or name


def _rename(conn: sqlite3.Connection, table: str, pairs: dict[str, str]) -> None:
    """Rename by name; via a suffix, so an English name equal to a German sibling cannot collide."""
    pairs = {de: en for de, en in pairs.items() if de != en}
    sql = f"UPDATE {table} SET name = ? WHERE name = ?"
    conn.executemany(sql, [(de + "\0", de) for de in pairs])
    conn.executemany(sql, [(en, de + "\0") for de, en in pairs.items()])


def to_english(conn: sqlite3.Connection) -> None:
    """Rename a fresh German-seeded DB; the caller commits."""
    conn.executemany(
        "DELETE FROM category WHERE name = ?", [(k,) for k, v in CATEGORIES.items() if v is None]
    )
    _rename(conn, "category", {k: v for k, v in CATEGORIES.items() if v})
    _rename(conn, "location", EN_LOCATIONS)
    _rename(conn, "unit", {de: en[0] for de, en in EN_UNITS.items()})
    conn.executemany(
        "UPDATE unit SET symbol = ? WHERE name = ?", [(s, n) for n, s in EN_UNITS.values()]
    )
    conn.execute("UPDATE unit SET factor = ? WHERE name = 'cup'", (CUP_ML,))
    for name, symbol, base, factor in NEW_UNITS:
        conn.execute(
            "INSERT INTO unit (name, symbol, base_unit_id, factor, is_count, recipe_only)"
            " VALUES (?, ?, (SELECT id FROM unit WHERE name = ?), ?, 0, 1)",
            (name, symbol, base, factor),
        )
    conn.execute("UPDATE defaults SET seed_lang = 'en'")
