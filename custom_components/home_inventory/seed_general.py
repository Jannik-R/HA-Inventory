"""Seeded main categories beyond food (and home-canned food, dried food, leftovers); data plus the
insert. `db.migrate` adds them after the base seed."""

import sqlite3

from .seed_en import seeded

# (root name, root values, {sub-category: [product types]}); location / unit by name.
_DE_GENERAL = [
    (
        "Haustechnik",
        {"food": 0, "warn_days": 90, "location": "Vorratsschrank", "unit": "Stück"},
        {
            "Batterien": [
                "AA (Mignon)",
                "AAA (Micro)",
                "C (Baby)",
                "D (Mono)",
                "9V (Block)",
                "Knopfzelle CR2032",
                "Knopfzelle CR2025",
                "Knopfzelle CR2016",
                "Knopfzelle LR44",
            ],
            "Akkus": ["AA-Akku", "AAA-Akku", "9V-Akku"],
            "Leuchtmittel": [
                "Sockel E27",
                "Sockel E14",
                "Sockel GU10",
                "Sockel GU5.3",
                "Sockel G9",
                "Sockel G4",
                "Sockel R7s",
            ],
        },
    ),
    (
        "Hausapotheke",
        {"food": 0, "expiry_type": "use_by", "warn_days": 30, "location": "Vorratsschrank"},
        {
            "Schmerzmittel": [],
            "Erkältung": [],
            "Verbandsmaterial": ["Pflaster", "Mullbinden"],
            "Desinfektion": [],
        },
    ),
    (
        "Tierbedarf",
        {"food": 0, "location": "Vorratsschrank"},
        {"Tierfutter": ["Hundefutter", "Katzenfutter"], "Katzenstreu": []},
    ),
    (
        "Eingekochtes",
        {"shelf_days": 365, "warn_days": 30, "location": "Vorratsschrank", "unit": "Stück"},
        {
            "Obst & Kompott": [],
            "Marmelade & Gelee": [],
            "Gemüse & Eingelegtes": [],
            "Soßen & Suppen": [],
            "Fleisch & Wurst": [],
        },
    ),
]
# Existing root marked as not a food.
_HOUSEHOLD = "Haushalt & Drogerie"


def _id(conn: sqlite3.Connection, table: str, name: str | None) -> int | None:
    row = conn.execute(f"SELECT id FROM {table} WHERE name = ?", (name,)).fetchone()
    return row[0] if row else None


def _child(conn: sqlite3.Connection, parent: int, name: str, sort: int) -> int | None:
    """Insert a category unless one with this name exists anywhere (user renames stay);
    one already under this parent (moved there) is returned."""
    row = conn.execute("SELECT id, parent_id FROM category WHERE name = ?", (name,)).fetchone()
    if row is not None:
        return row[0] if row[1] == parent else None
    return conn.execute(
        "INSERT INTO category (parent_id, name, sort) VALUES (?, ?, ?)", (parent, name, sort)
    ).lastrowid


def add_general(conn: sqlite3.Connection) -> None:
    """Insert the roots above where no root of that name exists; mark household as non-food."""
    sort = conn.execute("SELECT ifnull(max(sort), 0) FROM category WHERE parent_id IS NULL")
    sort = sort.fetchone()[0]
    for name, v, subs in _DE_GENERAL:
        if conn.execute(
            "SELECT 1 FROM category WHERE parent_id IS NULL AND name = ?", (name,)
        ).fetchone():
            continue
        sort += 1
        root = conn.execute(
            "INSERT INTO category (name, sort, unit_id, default_location_id, expiry_type,"
            " warn_days, shelf_days, food) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            (
                name,
                sort,
                _id(conn, "unit", v.get("unit")),
                _id(conn, "location", v.get("location")),
                v.get("expiry_type"),
                v.get("warn_days"),
                v.get("shelf_days"),
                v.get("food"),
            ),
        ).lastrowid
        for i, (sub, types) in enumerate(subs.items()):
            sub_id = _child(conn, root, sub, i)
            for j, t in enumerate(types):
                if sub_id is not None:
                    _child(conn, sub_id, t, j)
    household = conn.execute(
        "SELECT id FROM category WHERE parent_id IS NULL AND name = ?", (_HOUSEHOLD,)
    ).fetchone()
    if household:
        conn.execute("UPDATE category SET food = 0 WHERE id = ? AND food IS NULL", (household[0],))


_DRIED = ["Trockenobst", "Gemüsechips", "Getrocknete Kräuter", "Getrocknete Pilze", "Jerky"]


def add_dried(conn: sqlite3.Connection) -> None:
    """Root Gedörrtes (guide date, shelf 180 days) with its types unless a root of that name exists."""
    if conn.execute(
        "SELECT 1 FROM category WHERE parent_id IS NULL AND name = 'Gedörrtes'"
    ).fetchone():
        return
    sort = conn.execute(
        "SELECT ifnull(max(sort), 0) + 1 FROM category WHERE parent_id IS NULL"
    ).fetchone()[0]
    root = conn.execute(
        "INSERT INTO category (name, sort, default_location_id, expiry_type, warn_days, shelf_days)"
        " VALUES ('Gedörrtes', ?, ?, 'guide', 14, 180)",
        (sort, _id(conn, "location", "Vorratsschrank")),
    ).lastrowid
    for i, name in enumerate(_DRIED):
        _child(conn, root, name, i)


LEFTOVERS = "Reste"


def add_leftovers(conn: sqlite3.Connection) -> None:
    """Root Reste (guide date, 3 days, fridge) unless a root of that name exists; also on first use.

    The products "Reste: <dish>" are created by inventory/leftovers.py. Names via `seeded`
    (English in an English DB: "Leftovers: <dish>").
    """
    if conn.execute(
        "SELECT 1 FROM category WHERE parent_id IS NULL AND name = ?", (seeded(conn, LEFTOVERS),)
    ).fetchone():
        return
    sort = conn.execute(
        "SELECT ifnull(max(sort), 0) + 1 FROM category WHERE parent_id IS NULL"
    ).fetchone()[0]
    conn.execute(
        "INSERT INTO category (name, sort, default_location_id, expiry_type, warn_days, shelf_days,"
        " emergency_group) VALUES (?, ?, ?, 'guide', 1, 3, 'none')",
        (seeded(conn, LEFTOVERS), sort, _id(conn, "location", seeded(conn, "Kühlschrank"))),
    )
