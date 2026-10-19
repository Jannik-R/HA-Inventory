"""Recipe steps: import splitting, timers, save and list."""

import pytest

from custom_components.home_inventory import inventory as inv
from custom_components.home_inventory.inventory.steps import import_steps, timers


def texts(steps):
    return [s["text"] for s in steps]


def test_how_to_steps_drop_numbers_and_a_single_section():
    chefkoch = [
        {
            "@type": "HowToSection",
            "name": "Zubereitung",
            "itemListElement": [
                {"@type": "HowToStep", "text": "1. Zwiebeln <b>schälen</b>."},
                {"@type": "HowToStep", "text": "Schritt 2: Anbraten."},
                {"@type": "HowToStep", "text": "  "},
            ],
        }
    ]
    assert import_steps(chefkoch) == [
        {"section": None, "text": "Zwiebeln schälen."},
        {"section": None, "text": "Anbraten."},
    ]


def test_several_sections_head_their_first_step():
    value = [
        {"name": "Teig", "itemListElement": [{"text": "Kneten."}, {"text": "Ruhen."}]},
        {"name": "Füllung", "itemListElement": [{"text": "Mischen."}]},
    ]
    assert [s["section"] for s in import_steps(value)] == ["Teig", None, "Füllung"]


@pytest.mark.parametrize(
    ("value", "expected"),
    [
        (
            "Erst schälen.<br>Dann kochen.\nServieren.",
            ["Erst schälen.", "Dann kochen.", "Servieren."],
        ),
        (
            "1. Zwiebeln schälen. 2. Bei Stufe 3. Dann anbraten. 3. Servieren.",
            ["Zwiebeln schälen.", "Bei Stufe 3. Dann anbraten.", "Servieren."],
        ),
        (
            [{"text": "Alles in 2. Schritt mischen und 20 Min. backen."}],
            ["Alles in 2. Schritt mischen und 20 Min. backen."],
        ),
        (None, []),
    ],
)
def test_one_block_is_split_by_lines_or_its_numbering(value, expected):
    assert texts(import_steps(value)) == expected


@pytest.mark.parametrize(
    ("text", "seconds"),
    [
        ("20 Minuten köcheln", [1200]),
        ("ca. 10-15 Min. backen", [900]),
        ("1,5 Stunden ruhen, dann 30 Sek. mixen", [5400, 30]),
        ("½ Std. ziehen lassen", [1800]),
        ("eine halbe Stunde quellen, danach eine Viertelstunde", [1800, 900]),
        ("1 h garen", [3600]),
        ("bei 180 °C, 2 Eier, 3 Minzblätter", []),
        ("200 Stunden", []),
    ],
)
def test_timers(text, seconds):
    assert [t["seconds"] for t in timers(text)] == seconds


def test_save_replaces_steps_and_old_text(conn):
    data = {"name": "Suppe", "servings": 2, "ingredients": [], "instructions": "Alt."}
    rid = inv.save_recipe(conn, data)
    (r,) = inv.recipes(conn)
    assert (r["instructions"], r["steps"]) == ("Alt.", [])  # old recipes keep their text
    steps = [{"section": "Brühe", "text": "10 Minuten kochen."}, {"text": "Würzen."}]
    inv.save_recipe(conn, {**data, "id": rid, "steps": steps})
    (r,) = inv.recipes(conn)
    assert r["instructions"] is None
    assert r["steps"] == [
        {
            "section": "Brühe",
            "text": "10 Minuten kochen.",
            "timers": [{"seconds": 600, "label": "10 Minuten"}],
        },
        {"section": None, "text": "Würzen.", "timers": []},
    ]
    with pytest.raises(inv.InventoryError, match="invalid_value"):
        inv.save_recipe(conn, {**data, "id": rid, "steps": [{"text": " "}]})
    inv.delete(conn, "recipe", rid)
    assert conn.execute("SELECT count(*) FROM recipe_step").fetchone()[0] == 0
