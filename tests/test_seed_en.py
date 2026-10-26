"""English seed (phase 38): German seed renamed by dict, ids kept (seed_en.py)."""

from datetime import date
from types import SimpleNamespace

import pytest

from custom_components.home_inventory import db
from custom_components.home_inventory import inventory as inv
from custom_components.home_inventory.inventory import suggest_by_keywords
from custom_components.home_inventory.inventory.ingredient_line import parse_ingredient, unit_lookup
from custom_components.home_inventory.migration_30 import _SEEDED as DIET
from custom_components.home_inventory.seed_en import CATEGORIES, lang, seeded
from custom_components.home_inventory.seed_en_names import EN_LOCATIONS, EN_UNITS


@pytest.fixture(scope="module")
def pair():
    de, en = db.connect(":memory:"), db.connect(":memory:")
    db.migrate(de)
    db.migrate(en, "en")
    return de, en


def names(c, table):
    return {r["id"]: r["name"] for r in c.execute(f"SELECT id, name FROM {table}")}


def test_dicts_cover_a_german_db(conn):
    for table, known in (("category", CATEGORIES), ("unit", EN_UNITS), ("location", EN_LOCATIONS)):
        missing = sorted(set(names(conn, table).values()) - set(known))
        assert not missing, f"{table}: no English entry for {missing}"


def test_dicts_are_consistent(conn):
    cats = {r["id"]: r for r in conn.execute("SELECT id, parent_id, name FROM category")}
    seen = {}
    for c in cats.values():
        en = CATEGORIES[c["name"]]
        if en is None:
            assert all(o["parent_id"] != c["id"] for o in cats.values())  # leaves only
        else:
            assert (c["parent_id"], en) not in seen, f"sibling clash: {en}"
            seen[c["parent_id"], en] = 1
    units = [u[0] for u in EN_UNITS.values()]
    assert len(units) == len(set(units))
    others = {**EN_LOCATIONS, **{k: v[0] for k, v in EN_UNITS.items()}}
    assert all(CATEGORIES[k] == v for k, v in others.items() if k in CATEGORIES), "name clash"


def test_german_and_english_db_equal_by_id(pair):
    de, en = pair
    assert lang(de) == "de" and lang(en) == "en"
    gone = {k for k, v in CATEGORIES.items() if v is None}
    cat = "SELECT * FROM category ORDER BY id"
    rows = [dict(r) for r in de.execute(cat) if r["name"] not in gone]
    for a, b in zip(rows, [dict(r) for r in en.execute(cat)], strict=True):
        assert (a | {"name": 0}) == (b | {"name": 0})
        assert CATEGORIES[a["name"]] == b["name"]
    for table in ("location", "unit"):
        a, b = (list(c.execute(f"SELECT * FROM {table} ORDER BY id")) for c in (de, en))
        assert [r["id"] for r in a] == [r["id"] for r in b][: len(a)]
        for x, y in zip(a, b, strict=False):
            skip = {"name", "symbol", "factor"}
            assert {k: x[k] for k in x.keys() if k not in skip} == {
                k: y[k] for k in x.keys() if k not in skip
            }
    assert en.execute("SELECT factor FROM unit WHERE name = 'cup'").fetchone()[0] == 240
    assert en.execute("PRAGMA foreign_key_check").fetchall() == []


def test_setters_carry_over(pair):
    en = pair[1]

    def one(sql, *args):
        return en.execute(sql, args).fetchone()

    assert (
        one("SELECT expiry_type FROM category WHERE name = ?", CATEGORIES["Obst & Gemüse"])[0]
        == "guide"
    )
    assert one("SELECT freezer FROM location WHERE name = 'Freezer'")[0] == 1
    assert (
        one("SELECT frozen_goods FROM category WHERE name = ?", CATEGORIES["Tiefkühlkost"])[0] == 1
    )
    dried = one("SELECT id FROM category WHERE name = ?", CATEGORIES["Gedörrtes"])[0]
    assert one("SELECT count(*) FROM category WHERE parent_id = ?", dried)[0] > 0
    assert (
        one("SELECT emergency_group FROM category WHERE name = ?", CATEGORIES["Eier"])[0] != "none"
    )
    root = one(
        "SELECT d.name FROM category c JOIN location d ON d.id = c.default_location_id"
        " WHERE c.name = 'Leftovers' AND c.parent_id IS NULL"
    )
    assert root[0] == "Fridge"
    name, (diet, _) = next(iter(DIET.items()))
    assert one("SELECT diet FROM category WHERE name = ?", CATEGORIES[name])[0] == diet


def test_leftover_name_and_seeded(pair, conn):
    en = pair[1]
    assert (
        inv.store_leftovers(en, 1, date(2026, 10, 20), dish="Chili")["name"] == "Leftovers: Chili"
    )
    assert seeded(en, "Reste") == "Leftovers" and seeded(en, "Stück") == "piece"
    assert seeded(conn, "Reste") == "Reste"
    old = db.connect(":memory:")  # DB below step 32: no seed_lang column
    old.executescript("CREATE TABLE defaults (id INTEGER)")
    assert lang(old) == "de" and seeded(old, "Reste") == "Reste"


def test_seed_lang_of_hass(monkeypatch):
    monkeypatch.undo()  # the autouse fixture makes tests German

    def of(code):
        return db.seed_lang(SimpleNamespace(config=SimpleNamespace(language=code)))

    assert (of("de"), of("de-CH"), of("en-GB"), of("fr")) == ("de", "de", "en", "en")


@pytest.mark.parametrize(
    ("line", "amount", "unit", "text"),
    [
        ("2 cups flour", 2, "cup", "flour"),
        ("1 tbsp oil", 1, "tablespoon", "oil"),
        ("2 tablespoons sugar", 2, "tablespoon", "sugar"),
        ("3 cloves garlic", 3, "clove", "garlic"),
        ("8 oz cheese", 8, "ounce", "cheese"),
        ("2 lbs beef", 2, "pound", "beef"),
        ("4 fl oz milk", 4, "fluid ounce", "milk"),
        ("2 eggs", 2, "piece", "eggs"),
    ],
)
def test_parse_english(pair, line, amount, unit, text):
    en = pair[1]
    units = unit_lookup(en)
    piece = en.execute("SELECT id FROM unit WHERE name = 'piece'").fetchone()[0]
    row = parse_ingredient(line, units, piece)
    got = en.execute("SELECT name FROM unit WHERE id = ?", (row["unit_id"],)).fetchone()[0]
    assert (row["amount"], got, row["text"]) == (amount, unit, text)


@pytest.mark.parametrize(
    ("name", "category"),
    [
        ("Strawberry yogurt", "Joghurt"),
        ("Peanut butter", None),
        ("Spaghetti", None),
        ("Tomato sauce", None),
    ],
)
def test_suggest_english(pair, name, category):
    en = pair[1]
    cid = suggest_by_keywords(en, name)
    assert cid, name
    got = en.execute("SELECT name FROM category WHERE id = ?", (cid,)).fetchone()[0]
    if category:
        assert got == CATEGORIES[category]


def test_migration_32_fixes_elderberry_unit(monkeypatch):
    c = db.connect(":memory:")
    with monkeypatch.context() as m:
        m.setattr(db, "MIGRATIONS", db.MIGRATIONS[:31])
        db.migrate(c)
    c.execute("UPDATE category SET unit_id = NULL WHERE name = 'Holunderbeeren'")
    c.commit()
    db.migrate(c)
    sql = "SELECT u.name FROM category c JOIN unit u ON u.id = c.unit_id WHERE c.name = 'Holunderbeeren'"
    assert c.execute(sql).fetchone()[0] == "g" and lang(c) == "de"
