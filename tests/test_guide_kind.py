"""Date kind 'guide' (Richtwert, migration 24): fresh produce, label "ca.", ids kept by the rebuild."""

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
