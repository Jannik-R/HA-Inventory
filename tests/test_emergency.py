"""Emergency stock (migration 27): BBK groups, supply days, expired packages do not count."""

from datetime import date

from custom_components.home_inventory import db
from custom_components.home_inventory import inventory as inv
from tests.test_inventory import cat, loc, unit

TODAY = date(2026, 10, 20)


def add(conn, name, category, amount, unit_name, packages, expires="2027-01-01"):
    pid = inv.save(
        conn, "product",
        {"name": name, "category_id": cat(conn, category), "content_amount": amount,
         "content_unit_id": unit(conn, unit_name)},
    )  # fmt: skip
    inv.book_in(conn, pid, packages, expires_on=expires, location_id=loc(conn))


def groups(conn, persons=1):
    return {g["key"]: g for g in inv.emergency_supply(conn, persons, TODAY)["groups"]}


def test_groups_units_and_exclusions(conn) -> None:
    add(conn, "Milch", "Milchprodukte & Eier", 1, "l", 3)
    add(conn, "Wasser", "Getränke", 1.5, "l", 6)
    add(conn, "Spaghetti", "Nudeln", 500, "g", 2)
    add(conn, "Eier", "Eier", 10, "Stück", 1)
    add(conn, "Abgelaufen", "Nudeln", 1, "kg", 5, expires="2026-10-19")
    add(conn, "Espresso", "Kaffee", 1, "kg", 2)
    add(conn, "Pflaster", "Hausapotheke", 1, "kg", 2)
    g = groups(conn)
    assert g["dairy"]["have"] == 3.0
    assert g["drinks"]["have"] == 9.0 and g["drinks"]["unit"] == "l"
    assert g["grains"]["have"] == 1.0  # the expired kg does not count
    assert g["meat_fish_eggs"]["have"] == 0.6
    assert all(g[k]["have"] == 0 for k in ("fats", "vegetables"))
    assert inv.emergency_supply(conn, 1, TODAY)["supply_days"] == 0  # an empty group


def test_persons_floor_and_own_value(conn) -> None:
    add(conn, "Milch", "Milchprodukte & Eier", 1, "l", 3)  # 3 kg of 2.6 kg per person
    assert groups(conn, 1)["dairy"]["days"] == 11
    assert groups(conn, 2)["dairy"]["days"] == 5  # floor(3 / 0.52)
    # a child's own value beats the root's: Nudeln moved out of grains
    add(conn, "Spaghetti", "Nudeln", 1, "kg", 1)
    assert groups(conn)["grains"]["have"] == 1.0
    inv.save(conn, "category", {"id": cat(conn, "Nudeln"), "emergency_group": "none"})
    assert groups(conn)["grains"]["have"] == 0


def test_unknown_amount(conn) -> None:
    pid = inv.save(conn, "product", {"name": "Speiseöl", "category_id": cat(conn, "Öl")})
    inv.book_in(conn, pid, 2, expires_on="2027-01-01", location_id=loc(conn))
    assert groups(conn)["fats"]["unknown"] == 2


def test_partly_used_package_counts_by_level(conn) -> None:
    add(conn, "Reis", "Nudeln", 1, "kg", 2)
    pid = conn.execute("SELECT id FROM product WHERE name = 'Reis'").fetchone()[0]
    inv.set_remaining(conn, inv.open_package(conn, pid, today=TODAY)["batch_id"], 0.5)
    assert groups(conn)["grains"]["have"] == 1.5
    pid = inv.save(conn, "product", {"name": "Speiseöl", "category_id": cat(conn, "Öl")})
    inv.book_in(conn, pid, 2, expires_on="2027-01-01", location_id=loc(conn))
    inv.set_remaining(conn, inv.open_package(conn, pid, today=TODAY)["batch_id"], 0.5)
    assert groups(conn)["fats"]["unknown"] == 2  # unknown amounts stay whole packages


def test_frozen_partly_used_package_counts_by_level(conn) -> None:
    pid = inv.save(
        conn, "product",
        {"name": "Reis", "category_id": cat(conn, "Nudeln"), "content_amount": 1,
         "content_unit_id": unit(conn, "kg"), "frozen_days": 30},
    )  # fmt: skip
    batch = inv.book_in(conn, pid, 1, location_id=loc(conn, "Gefrierschrank"))
    inv.set_remaining(conn, batch, 0.5)
    assert groups(conn)["grains"]["have"] == 0.5


def test_migration_27(monkeypatch) -> None:
    c = db.connect(":memory:")
    with monkeypatch.context() as m:  # seeded DB of version 26
        m.setattr(db, "MIGRATIONS", db.MIGRATIONS[:26])
        m.setattr(db, "set_emergency", lambda conn: None)
        db.migrate(c)
    assert "emergency_group" not in [r[1] for r in c.execute("PRAGMA table_info(category)")]
    db.migrate(c)
    assert c.execute("PRAGMA user_version").fetchone()[0] == len(db.MIGRATIONS)
    got = c.execute("SELECT emergency_group FROM category WHERE name = 'Getränke'").fetchone()
    assert got[0] == "drinks"
    assert c.execute("PRAGMA foreign_key_check").fetchall() == []


def test_missing_units_do_not_break(conn) -> None:
    add(conn, "Milch", "Milchprodukte & Eier", 1, "l", 3)
    add(conn, "Eier", "Eier", 10, "Stück", 1)
    conn.execute("UPDATE unit SET name = 'Liter' WHERE name = 'l'")
    conn.execute("UPDATE unit SET name = 'Stk' WHERE name = 'Stück'")
    g = groups(conn)  # no l unit found: the milk is unknown; no Stück: no egg rule
    assert (g["dairy"]["unknown"], g["meat_fish_eggs"]["unknown"]) == (3, 1)
    conn.execute("UPDATE unit SET name = 'Kilo' WHERE name = 'kg'")
    assert groups(conn)["grains"]["have"] == 0
