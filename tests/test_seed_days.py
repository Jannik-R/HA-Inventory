"""Seeded shelf life / days after opening (seed_days): every name exists, migration 21 keeps own values."""

from custom_components.home_inventory.seed_days import _DE_DAYS


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


def test_book_in_without_date_guesses_from_shelf_life(conn) -> None:
    from datetime import date, timedelta

    from custom_components.home_inventory import inventory as inv
    from tests.test_inventory import loc, product

    milk = product(conn, "H-Milch Test", "H-Milch")
    guessed = inv.book_in(conn, milk, 1, None, loc(conn))
    row = conn.execute(
        "SELECT expires_on, expiry_guessed FROM batch WHERE id = ?", (guessed,)
    ).fetchone()
    assert tuple(row) == ((date.today() + timedelta(days=90)).isoformat(), 1)
    assert inv.stock_list(conn)[0]["expiry_guessed"] == 1
    # the same date typed confirms the batch; no shelf life: no date
    assert inv.book_in(conn, milk, 1, row["expires_on"], loc(conn)) == guessed
    assert (
        conn.execute("SELECT expiry_guessed FROM batch WHERE id = ?", (guessed,)).fetchone()[0] == 0
    )
    # "today" comes from HA's time zone when the caller passes it
    other = inv.book_in(conn, milk, 1, None, loc(conn), today=date(2030, 1, 1))
    assert conn.execute("SELECT expires_on FROM batch WHERE id = ?", (other,)).fetchone()[0] == (
        "2030-04-01"
    )
    paper = inv.book_in(conn, product(conn, "Küchenrolle", "Papier"), 1, None, loc(conn))
    assert conn.execute("SELECT expires_on FROM batch WHERE id = ?", (paper,)).fetchone()[0] is None
