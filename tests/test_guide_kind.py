"""Date kind 'guide' (Richtwert, migration 24): fresh produce, label "ca.", ids kept by the rebuild."""

from custom_components.home_inventory import db
from custom_components.home_inventory import inventory as inv
from tests.test_inventory import loc, product


def kind(c, name: str):
    return c.execute("SELECT expiry_type FROM category WHERE name = ?", (name,)).fetchone()[0]


def test_new_db_seeds_guide(conn) -> None:
    assert kind(conn, "Obst & Gemüse") == "guide"
    assert kind(conn, "Schattenmorellen") == "best_before"
    apple = product(conn, "Elstar", "Äpfel")
    assert inv.effective(conn, apple)["expiry_type"]["value"] == "guide"
    batch = inv.book_in(conn, apple, 1, "2030-01-02", loc(conn))
    assert inv.label_info(conn, batch)["approx"] is True
    pasta = inv.book_in(conn, product(conn), 1, "2030-01-02", loc(conn))
    assert inv.label_info(conn, pasta)["approx"] is False
    inv.save(conn, "product", {"id": apple, "expiry_type": "use_by"})  # editable like the others


def test_migration_24_widens_check_and_switches_produce(monkeypatch) -> None:
    c = db.connect(":memory:")
    with monkeypatch.context() as m:  # seeded DB of version 23
        m.setattr(db, "MIGRATIONS", db.MIGRATIONS[:23])
        m.setattr(db, "set_guide", lambda conn: None)
        db.migrate(c)
    c.execute("UPDATE category SET expiry_type = 'use_by' WHERE name = 'Obst & Gemüse'")
    apple = product(c, "Elstar", "Äpfel", expiry_type="use_by")
    batch = inv.book_in(c, apple, 2, "2030-01-02", loc(c))
    c.commit()
    db.migrate(c)
    assert c.execute("PRAGMA user_version").fetchone()[0] == len(db.MIGRATIONS)
    assert kind(c, "Obst & Gemüse") == "guide"  # always switched, also over a changed value
    assert (
        c.execute("SELECT expiry_type FROM product WHERE id = ?", (apple,)).fetchone()[0]
        == "use_by"
    )
    assert c.execute("SELECT packages FROM stock WHERE batch_id = ?", (batch,)).fetchone()[0] == 2
    assert c.execute("PRAGMA foreign_key_check").fetchall() == []
    c.execute("UPDATE defaults SET expiry_type = 'guide'")
    c.execute("UPDATE product SET expiry_type = 'guide'")
    # indexes survived the rebuild
    names = {r[0] for r in c.execute("SELECT name FROM sqlite_master WHERE type = 'index'")}
    before = db.connect(":memory:")
    with monkeypatch.context() as m:
        m.setattr(db, "MIGRATIONS", db.MIGRATIONS[:23])
        db.migrate(before)
    assert {
        r[0] for r in before.execute("SELECT name FROM sqlite_master WHERE type = 'index'")
    } <= names
