"""Seeded main categories beyond food (and home-canned food); data plus the insert. Migration 16
adds them to existing DBs, db.migrate after the seed to a new one."""

import sqlite3

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
# Old seeded types under Spülmittel (seed_types_more before migration 16): Batterien becomes the
# battery category; Glühbirnen goes when unused, else moves to Leuchtmittel (products stay).
_OLD_PARENT = "Spülmittel"


def _id(conn: sqlite3.Connection, table: str, name: str | None) -> int | None:
    row = conn.execute(f"SELECT id FROM {table} WHERE name = ?", (name,)).fetchone()
    return row[0] if row else None


def _old_type(conn: sqlite3.Connection, name: str) -> int | None:
    """Id of a type the old seed put under Spülmittel, if it is still there."""
    row = conn.execute(
        "SELECT c.id FROM category c JOIN category p ON p.id = c.parent_id"
        " WHERE c.name = ? AND p.name = ?",
        (name, _OLD_PARENT),
    ).fetchone()
    return row[0] if row else None


def _used(conn: sqlite3.Connection, category_id: int) -> bool:
    return any(
        conn.execute(f"SELECT 1 FROM {table} WHERE {col} = ?", (category_id,)).fetchone()
        for table, col in (
            ("category", "parent_id"),
            ("product", "category_id"),
            ("recipe_ingredient", "category_id"),
            ("shopping_item", "category_id"),
        )
    )


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
    if not conn.execute("SELECT 1 FROM unit").fetchone():
        return  # new DB (migrations run before the seed): migrate() calls this after the seed
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
        if (old := _old_type(conn, "Batterien")) is not None:
            conn.execute("UPDATE category SET parent_id = ? WHERE id = ?", (root, old))
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
    if (bulbs := _old_type(conn, "Glühbirnen")) is not None:
        if _used(conn, bulbs):
            conn.execute(
                "UPDATE category SET parent_id = (SELECT id FROM category WHERE name = 'Leuchtmittel')"
                " WHERE id = ? AND EXISTS (SELECT 1 FROM category WHERE name = 'Leuchtmittel')",
                (bulbs,),
            )
        else:
            conn.execute("DELETE FROM category WHERE id = ?", (bulbs,))
