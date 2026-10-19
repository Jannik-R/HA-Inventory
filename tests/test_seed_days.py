"""Seeded shelf life / days after opening (seed_days): every name exists, migration 21 keeps own values."""

from custom_components.pantry import db
from custom_components.pantry.seed_days import _DE_DAYS


def days(c, name: str) -> tuple:
    row = c.execute(
        "SELECT shelf_days, opened_days FROM category WHERE name = ?", (name,)
    ).fetchone()
    return tuple(row)


def test_every_name_is_a_unique_seeded_category(conn) -> None:
    for name in _DE_DAYS:
        assert (
            conn.execute("SELECT count(*) FROM category WHERE name = ?", (name,)).fetchone()[0] == 1
        ), name
    assert days(conn, "H-Milch") == (90, 3)
    assert days(conn, "Eingekochtes") == (365, None)
    assert days(conn, "Marmelade & Gelee") == (None, 28)


def test_migration_21_fills_only_empty_values(monkeypatch) -> None:
    c = db.connect(":memory:")
    with monkeypatch.context() as m:  # seeded DB of version 20
        m.setattr(db, "MIGRATIONS", db.MIGRATIONS[:20])
        m.setattr(db, "fill_days", lambda conn: None)
        db.migrate(c)
    assert days(c, "Joghurt") == (None, None)
    c.execute("UPDATE category SET shelf_days = 4 WHERE name = 'H-Milch'")
    c.execute("UPDATE category SET opened_days = 9 WHERE name = 'Käse'")
    c.commit()
    db.migrate(c)
    assert c.execute("PRAGMA user_version").fetchone()[0] == 21
    assert days(c, "H-Milch") == (4, 3)
    assert days(c, "Käse") == (30, 9)
    assert days(c, "Joghurt") == (21, 5)
