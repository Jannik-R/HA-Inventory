from custom_components.home_inventory import db


def test_migration_33_bigger_images(monkeypatch) -> None:
    c = db.connect(":memory:")
    with monkeypatch.context() as m:
        m.setattr(db, "MIGRATIONS", db.MIGRATIONS[:32])
        db.migrate(c)
    cat = c.execute("INSERT INTO category (name) VALUES ('K')").lastrowid
    urls = {
        "a": "https://images.openfoodfacts.org/images/products/1/front_de.12.200.jpg",
        "b": "https://images.openbeautyfacts.org/x/front_de.3.100.jpg",
        "c": "https://images.example.com/x/front_de.3.200.jpg",
        "d": "https://images.openfoodfacts.org/images/products/1/front_de.12.400.jpg",
    }
    for n, u in urls.items():
        c.execute(
            "INSERT INTO product (name, category_id, image_url, updated_at) VALUES (?, ?, ?, 0)",
            (n, cat, u),
        )
    c.commit()
    db.migrate(c)
    got = dict(c.execute("SELECT name, image_url FROM product"))
    assert got["a"].endswith("front_de.12.400.jpg") and got["b"].endswith("front_de.3.400.jpg")
    assert got["c"] == urls["c"] and got["d"] == urls["d"]
