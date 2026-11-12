"""Schema baseline 1.0.0: a new file gets it, 0.x files are refused untouched, a failing step rolls back."""

import sqlite3

import pytest
from homeassistant.exceptions import ConfigEntryError

from custom_components.home_inventory import db


def version(c) -> int:
    return c.execute("PRAGMA user_version").fetchone()[0]


def test_new_db_gets_the_baseline():
    c = db.connect(":memory:")
    db.migrate(c)
    assert version(c) == db.BASELINE + len(db.MIGRATIONS)
    assert c.execute("PRAGMA foreign_key_check").fetchall() == []


@pytest.mark.parametrize(
    "old", [5, 32, 33]
)  # 33: a local dev file has the baseline version but no marker
def test_0x_file_is_refused_untouched(tmp_path, old):
    path = tmp_path / "home_inventory.db"
    raw = sqlite3.connect(path)
    raw.executescript(f"CREATE TABLE unit (id INTEGER); PRAGMA user_version={old};")
    raw.close()
    before = path.read_bytes()
    c = db.connect(str(path))
    with pytest.raises(ConfigEntryError) as err:
        db.migrate(c)
    assert err.value.translation_key == "old_database"
    assert str(path) in err.value.translation_placeholders["path"]
    c.close()
    assert path.read_bytes() == before


def test_existing_baseline_file_is_not_reseeded(tmp_path):
    path = str(tmp_path / "home_inventory.db")
    c = db.connect(path)
    db.migrate(c)
    c.execute("UPDATE category SET name = 'Eigene' WHERE id = 1")
    c.commit()
    count = c.execute("SELECT COUNT(*) FROM category").fetchone()[0]
    c.close()
    c = db.connect(path)
    db.migrate(c)
    assert c.execute("SELECT COUNT(*) FROM category").fetchone()[0] == count
    assert c.execute("SELECT name FROM category WHERE id = 1").fetchone()[0] == "Eigene"


def test_migrate_rolls_back_a_failing_step(monkeypatch):
    """A step that leaves a foreign key violation is undone, user_version stays."""
    c = db.connect(":memory:")
    db.migrate(c)
    base = version(c)
    monkeypatch.setattr(db, "MIGRATIONS", [*db.MIGRATIONS, "INSERT INTO stock VALUES (99, 99, 1);"])
    with pytest.raises(sqlite3.IntegrityError, match=f"migration {base + 1}"):
        db.migrate(c)
    assert version(c) == base
    assert c.execute("SELECT COUNT(*) FROM stock").fetchone()[0] == 0
    assert c.execute("PRAGMA foreign_keys").fetchone()[0] == 1
