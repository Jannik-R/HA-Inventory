"""Recipe-only units: migration 13, seed, import, and how they count against the stock."""

from custom_components.home_inventory import inventory as inv

from .test_inventory import loc, product, unit
from .test_recipes import ing, recipe
from .test_shopping_recipes import listed


def flags(c):
    return {
        r["name"]: (r["recipe_only"], r["is_count"], r["base_unit_id"], r["factor"])
        for r in c.execute("SELECT * FROM unit")
    }


def test_seed(conn):
    f, ml = flags(conn), unit(conn, "ml")
    assert f["Esslöffel"][:2] == (1, 0) and f["Esslöffel"][3] == 15
    assert f["Tasse"] == (1, 0, ml, 250) and f["Bund"][0] == 0
    # rule-of-thumb sizes
    assert f["Prise"] == (1, 0, unit(conn, "g"), 0.5)
    assert f["Zehe"] == (1, 0, unit(conn, "Stück"), 0.1)
    assert f["Scheibe"][:3] == (1, 1, None)  # no sensible size: stays "any"


def test_unit_add_is_recipe_only(conn):
    inv.unit_add(conn, "Klacks")
    assert flags(conn)["Klacks"][0] == 1


def test_recipe_only_against_stock(conn):
    ml, g = unit(conn, "ml"), unit(conn, "g")
    a = recipe(conn, [ing(conn, "Öl", 3, "Esslöffel"), ing(conn, "Öl", 100, "ml")], name="A")
    b = recipe(
        conn, [ing(conn, "Milch", 2, "Tasse"), ing(conn, "Gewürze", 1, "Teelöffel")], name="B"
    )
    inv.set_shopping_recipe(conn, a, 2)
    inv.set_shopping_recipe(conn, b, 2)
    items = {x[0]: x[1:3] for x in listed(conn)}
    assert items == {
        "Öl": (145, "ml"),
        "Milch": (500, "ml"),
        "Gewürze": (5, "ml"),
    }  # any salt; 1 TL shown in ml
    spice = next(i for i in inv.shopping_list(conn) if i.get("key", "").endswith("-"))
    # an "any" item (key without unit): the recipe reference is in ml too, never TL
    assert [(u["amount"], u["unit_symbol"]) for u in spice["recipes"]] == [(5, "ml")]
    # TL Salz (category in g) is any stock; 3 EL oil (category in l) is a volume
    inv.book_in(conn, product(conn, "Salz", "Gewürze", content_amount=500, content_unit_id=g), 1,
                location_id=loc(conn))  # fmt: skip
    inv.book_in(conn, product(conn, "Olivenöl", "Öl", content_amount=1, content_unit_id=unit(conn, "l")), 1,
                location_id=loc(conn))  # fmt: skip
    assert [x[0] for x in listed(conn)] == ["Milch"]
    assert [i["status"] for i in inv.recipe_availability(conn, a, 2)] == ["available"] * 2
    s = inv.recipe_availability(conn, b, 2)
    assert [i["status"] for i in s] == ["missing", "available"] and s[0]["unit_symbol"] == "ml"
    assert ml


def test_scheibe_counts_as_any(conn):
    r = recipe(conn, [ing(conn, "Gewürze", 2, "Scheibe")])
    assert status_of(conn, r) == ["missing"]
    inv.book_in(conn, product(conn, "Salz", "Gewürze"), 1, location_id=loc(conn))
    assert status_of(conn, r) == ["available"]


def test_zehe_rounds_up_to_whole_garlic(conn):
    r = recipe(conn, [ing(conn, "Knoblauch", 3, "Zehe")])
    inv.set_shopping_recipe(conn, r, 2)
    assert [x[:3] for x in listed(conn)] == [("Knoblauch", 1, "Stk")]  # 0.3 bulbs -> 1


def status_of(conn, rid):
    return [i["status"] for i in inv.recipe_availability(conn, rid, 2)]


def test_any_items_always_get_an_estimate(conn):
    """Nothing in stock and no stock-unit amount: Scheibe as written, no amount = one package,
    Zweig as Bund (rounded up)."""
    r = recipe(
        conn,
        [ing(conn, "Zitronen", 2, "Scheibe"), ing(conn, "Salz", None, None),
         ing(conn, "Kräuter", 3, "Zweig")],
    )  # fmt: skip
    inv.set_shopping_recipe(conn, r, 2)
    got = {i["name"]: (i["amount"] and (i["amount"]["missing"], i["amount"]["unit_symbol"]),
                       i["packages"]) for i in inv.shopping_list(conn) if i.get("key")}  # fmt: skip
    assert got == {
        "Zitronen": ((2, "Scheibe"), None),
        "Salz": (None, 1),
        "Kräuter": ((1, "Bund"), None),
    }
