"""Canning: charges per made-on day, own batch, labels and scan per charge, edits; non-food
categories in recipes; migration 15 keeps batches."""

import pytest

from custom_components.home_inventory import inventory as inv


def cat(conn, name: str) -> int:
    return conn.execute("SELECT id FROM category WHERE name = ?", (name,)).fetchone()[0]


def new(conn, **kw) -> dict:
    data = {"made_on": "2026-10-18", "jars": 6, "expires_on": "2027-10-18", "temp": 90}
    return inv.save_canning(conn, {**data, "minutes": 30, **kw})


def test_charges_count_per_day_and_stay_apart(conn) -> None:
    first = new(conn, product={"name": "Apfelmus", "category_id": cat(conn, "Obst & Kompott")})
    pid = conn.execute("SELECT id FROM product WHERE name = 'Apfelmus'").fetchone()[0]
    second = new(conn, product_id=pid, jars=4)
    other_day = new(conn, product_id=pid, made_on="2026-10-19")
    assert [first["charge"], second["charge"], other_day["charge"]] == [
        "20261018-1",
        "20261018-2",
        "20261019-1",
    ]
    # same product and date by hand: never merged into a charge
    assert inv.book_in(conn, pid, 2, "2027-10-18") not in (first["batch_id"], second["batch_id"])
    rows = {r["charge"]: r for r in inv.cannings(conn)}
    assert (rows["20261018-2"]["in_stock"], rows["20261018-1"]["temp"]) == (4, 90)
    assert {r["charge"] for r in inv.stock_list(conn)} == {*rows, None}


def test_label_and_scan_name_the_charge(conn) -> None:
    pid = inv.save(
        conn, "product", {"name": "Kirschen", "category_id": cat(conn, "Obst & Kompott")}
    )
    c = new(conn, product_id=pid)
    new(conn, product_id=pid)
    info = inv.label_info(conn, c["batch_id"])
    assert info["code"] == f"PTRY:P{pid}:2027-10-18:20261018-1"
    assert info["brand"] == "20261018-1"
    # the date of the charge changed since printing: the code still finds it
    inv.save_canning(conn, {"id": c["id"], "expires_on": "2027-12-01", "notes": " 1 Glas offen "})
    taken = inv.book_out_code(conn, info["code"][5:])["taken"]
    assert taken[0]["batch_id"] == c["batch_id"]
    row = next(r for r in inv.cannings(conn) if r["id"] == c["id"])
    assert (row["expires_on"], row["notes"], row["in_stock"], row["jars"]) == (
        "2027-12-01",
        "1 Glas offen",
        5,
        6,
    )


def test_stock_edit_moves_the_whole_charge(conn) -> None:
    pid = inv.save(conn, "product", {"name": "Bohnen", "category_id": cat(conn, "Eingekochtes")})
    c = new(conn, product_id=pid)
    loc = conn.execute("SELECT location_id FROM stock WHERE batch_id = ?", (c["batch_id"],))
    assert inv.edit_stock(conn, c["batch_id"], loc.fetchone()[0], "2028-01-01", 5) == c["batch_id"]
    assert inv.cannings(conn)[0]["expires_on"] == "2028-01-01"


def test_delete_takes_batch_and_stock(conn) -> None:
    pid = inv.save(conn, "product", {"name": "Gurken", "category_id": cat(conn, "Eingekochtes")})
    c = new(conn, product_id=pid)
    kinds = [g["kind"] for g in inv.delete_impact(conn, "canning", c["id"])["groups"]]
    assert kinds == ["delete.stock", "delete.booking"]
    inv.force_delete(conn, "canning", c["id"])
    assert conn.execute("SELECT 1 FROM batch WHERE id = ?", (c["batch_id"],)).fetchone() is None


@pytest.mark.parametrize(
    ("data", "error"),
    [({"made_on": None}, "invalid_date"), ({"jars": 0}, "invalid_value")],
)
def test_new_needs_date_and_jars(conn, data, error) -> None:
    pid = inv.save(conn, "product", {"name": "X", "category_id": cat(conn, "Eingekochtes")})
    with pytest.raises(inv.InventoryError, match=error):
        new(conn, product_id=pid, **data)


def test_non_food_is_no_ingredient(conn) -> None:
    aa = cat(conn, "AA (Mignon)")
    assert inv.effective(conn, category_id=aa)["food"] == {
        "value": 0,
        "source": cat(conn, "Haustechnik"),
    }
    with pytest.raises(inv.InventoryError, match="not_food"):
        inv.save_recipe(
            conn, {"name": "x", "servings": 1, "ingredients": [{"category_id": aa, "text": ""}]}
        )
    assert inv.effective(conn, category_id=cat(conn, "Eingekochtes"))["shelf_days"]["value"] == 365


def test_non_food_roots_are_seeded(conn) -> None:
    food = "SELECT food FROM category WHERE parent_id IS NULL AND name = ?"
    assert conn.execute(food, ("Haushalt & Drogerie",)).fetchone()[0] == 0
    assert conn.execute(food, ("Haustechnik",)).fetchone()[0] == 0


def test_canning_recipe_makes_its_product(conn) -> None:
    rid = inv.save_recipe(
        conn,
        {
            "name": "Apfelmus einkochen",
            "servings": 6,
            "canning_product": {"name": "Apfelmus", "category_id": cat(conn, "Obst & Kompott")},
            "canning_temp": 90,
            "canning_minutes": 30,
            "ingredients": [],
        },
    )
    (r,) = inv.recipes(conn)
    assert (r["canning_product"], r["canning_temp"]) == ("Apfelmus", 90)
    other = inv.save(conn, "product", {"name": "Birnen", "category_id": cat(conn, "Eingekochtes")})
    # the recipe's product wins over a product given by the client
    new(conn, recipe_id=rid, product_id=other)
    assert inv.cannings(conn)[0]["name"] == "Apfelmus"
    with pytest.raises(inv.InventoryError, match="not_found"):
        inv.save_recipe(
            conn, {"name": "x", "servings": 1, "canning_product_id": 999, "ingredients": []}
        )
    # temperature without a product is no canning recipe (DB CHECK)
    with pytest.raises(inv.InventoryError, match="invalid_value"):
        inv.save_recipe(
            conn,
            {
                "name": "y",
                "servings": 1,
                "canning_temp": 90,
                "canning_minutes": 5,
                "ingredients": [],
            },
        )
    inv.force_delete(conn, "product", r["canning_product_id"])  # takes the recipe along
    assert inv.recipes(conn) == []


def test_electrical_tree(conn) -> None:
    """Batteries (incl. coin cells), rechargeables and lamps by socket under one root."""
    root = cat(conn, "Haustechnik")
    subs = conn.execute("SELECT name FROM category WHERE parent_id = ? ORDER BY name", (root,))
    assert [r[0] for r in subs] == ["Akkus", "Batterien", "Leuchtmittel"]
    parent = "SELECT p.name FROM category c JOIN category p ON p.id = c.parent_id WHERE c.name = ?"
    assert conn.execute(parent, ("Knopfzelle CR2032",)).fetchone()[0] == "Batterien"
    assert conn.execute(parent, ("Sockel GU10",)).fetchone()[0] == "Leuchtmittel"
    assert conn.execute("SELECT 1 FROM category WHERE name = 'Glühbirnen'").fetchone() is None
