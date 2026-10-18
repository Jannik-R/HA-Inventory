"""Recipe import: ingredient line parser, unit dedupe, JSON-LD extraction, fetch via websocket."""

import json
from unittest.mock import patch

import pytest

from custom_components.pantry import inventory as inv
from custom_components.pantry import recipe_fetch

from .test_inventory import unit
from .test_websocket import ws  # noqa: F401  (fixture)


@pytest.fixture
def parse(conn):
    units, piece = inv.ingredient_line.unit_lookup(conn), unit(conn, "Stück")

    def go(line):
        row = inv.parse_ingredient(line, units, piece)
        return row, lambda name: unit(conn, name)

    return go


@pytest.mark.parametrize(
    ("line", "amount", "unit_name", "text", "note"),
    [
        ("200 g Mehl", 200, "g", "Mehl", None),
        ("200g Mehl", 200, "g", "Mehl", None),
        ("1 EL Olivenöl", 1, "Esslöffel", "Olivenöl", None),
        ("1/2 TL Salz", 0.5, "Teelöffel", "Salz", None),
        ("1 ½ TL Zucker", 1.5, "Teelöffel", "Zucker", None),
        ("2 Zehe/n Knoblauch", 2, "Zehe", "Knoblauch", None),
        ("Salz und Pfeffer", None, None, "Salz und Pfeffer", None),
        ("2-3 Tomaten", 3, "Stück", "Tomaten", None),
        ("2 rote Zwiebeln", 2, "Stück", "rote Zwiebeln", None),
        ("n. B. Petersilie", None, None, "Petersilie", "n. B."),
        ("1 Dose Tomaten, gehackt", 1, "Dose", "Tomaten", "gehackt"),
        ("2 Blätter Gelatine", 2, "Blatt", "Gelatine", None),
        ("1 Pck. Vanillezucker", 1, "Packung", "Vanillezucker", None),
        ("200 g Mehl (Type 405)", 200, "g", "Mehl", "Type 405"),
        ("2 EL", 2, "Esslöffel", "2 EL", None),
        ("2-3 EL Öl", 3, "Esslöffel", "Öl", None),
        ("0 g Mehl", None, None, "g Mehl", None),
        ("1 Ei (M)", 1, "Stück", "Ei", "M"),
        ("2 Eier (groß)", 2, "Stück", "Eier", "groß"),
        ("1 Butternusskürbis(se) (oder Hokkaido)", 1, "Stück", "Butternusskürbis", "oder Hokkaido"),
        ("1 Zwiebel(n)", 1, "Stück", "Zwiebel", None),
        ("1 Zehe/n Knoblauch", 1, "Zehe", "Knoblauch", None),
        ("2 Knoblauchzehe(n)", 2, "Stück", "Knoblauchzehe", None),
        ("0.5 kleine Butternusskürbis(se)", 0.5, "Stück", "Butternusskürbis", "kleine"),
        ("3 große Eier", 3, "Stück", "Eier", "große"),
        ("3 EL Petersilie (frische)", 3, "Esslöffel", "Petersilie", "frische"),
        ("50 g Cheddarkäse (oder Gouda, gerieben)", 50, "g", "Cheddarkäse", "oder Gouda, gerieben"),
        ("200 g Tomaten, passierte", 200, "g", "Tomaten", "passierte"),
        ("n. B. Salz und Pfeffer", None, None, "Salz und Pfeffer", "n. B."),
        ("4 cl Likör (Kirschlikör)", 4, "cl", "Likör", "Kirschlikör"),
        (
            "1 Zitrone(n) (abgeriebene Schale (Bio!))",
            1,
            "Stück",
            "Zitrone",
            "abgeriebene Schale (Bio!)",
        ),
        ("1 gr. Dose/n Pfirsich(e)", 1, "Dose", "Pfirsich", "gr."),
        ("1 TL, gestr. Salz", 1, "Teelöffel", "Salz", "gestr."),
        ("1 EL, gehäuft Mehl (Sagomehl)", 1, "Esslöffel", "Mehl", "gehäuft, Sagomehl"),
        (
            "1 TL, gestr. Pfeffer, bunter (frisch gemahlen)",
            1,
            "Teelöffel",
            "Pfeffer",
            "gestr., bunter, frisch gemahlen",
        ),
        ("1 EL, gehäuft Zucker, brauner", 1, "Esslöffel", "Zucker", "gehäuft, brauner"),
        ("1 m.-große Pfirsich", 1, "Stück", "Pfirsich", "m.-große"),
        ("2 mittelgr. Zwiebeln", 2, "Stück", "Zwiebeln", "mittelgr."),
        ("1 Fläschchen Zitronenaroma", 1, "Flasche", "Zitronenaroma", None),
        ("1 Tüte Vanillezucker", 1, "Packung", "Vanillezucker", None),
        ("3 Stängel Dill", 3, "Stiel", "Dill", None),
        ("Fett für das Blech", None, None, "Fett", "für das Blech"),
        ("Mehl für die Arbeitsfläche", None, None, "Mehl", "für die Arbeitsfläche"),
        ("1 Schuss Öl zum Braten", 1, "Schuss", "Öl", "zum Braten"),
        ("2 Eigelb", 2, "Stück", "Ei", "Eigelb"),
        ("1 Eiweiss (M)", 1, "Stück", "Ei", "Eiweiß, M"),
        ("3 Eidotter", 3, "Stück", "Ei", "Eigelb"),
        ("Eiklar", None, None, "Ei", "Eiweiß"),
        ("2 Eigelb zum Bestreichen", 2, "Stück", "Ei", "Eigelb, zum Bestreichen"),
        (
            "etwas Öl (zum Braten und zum Einpinseln)",
            None,
            None,
            "Öl",
            "zum Braten und zum Einpinseln, etwas",
        ),
    ],
)
def test_parse(parse, line, amount, unit_name, text, note):
    row, uid = parse(line)
    assert (row["amount"], row["text"], row["note"]) == (amount, text, note)
    assert row["unit_id"] == (uid(unit_name) if unit_name else None)


def test_parse_optional_unknown_unit(parse):
    assert parse("evtl. 1 TL Zimt")[0]["optional"] is True
    row = parse("1 ½ Knollen Mehl")[0]
    assert (row["amount"], row["unit_id"], row["unit_hint"], row["text"]) == (
        1.5,
        None,
        "Knolle",
        "Mehl",
    )


def test_draft_lines(conn):
    def draft(*lines):
        data = {"@type": "Recipe", "name": "R", "recipeIngredient": list(lines)}
        return inv.recipe_import(conn, page(json.dumps(data)), "https://x.test")["ingredients"]

    # an unknown capitalized word that is itself an ingredient stays part of the text
    row = draft("2 Zwiebeln rot")[0]
    assert (row["amount"], row["unit_hint"], row["text"]) == (2, None, "Zwiebeln rot")
    assert row["unit_id"] == unit(conn, "Stück") and row["category_id"] is not None
    pak = draft("3 kleine Pak Choi")[0]
    assert (pak["amount"], pak["unit_hint"], pak["text"], pak["note"]) == (
        3,
        None,
        "Pak Choi",
        "kleine",
    )
    assert pak["category_id"] is not None
    assert draft("1 Knolle Sellerie")[0]["unit_hint"] == "Knolle"
    assert draft("2 Eigelb")[0]["category_id"] == draft("2 Eier")[0]["category_id"]
    salt, pepper = draft("n. B. Salz und Pfeffer")
    assert (salt["text"], pepper["text"], pepper["note"]) == ("Salz", "Pfeffer", "n. B.")
    assert salt["category_id"] != pepper["category_id"]
    assert len(draft("etwas Öl (zum Braten und zum Einpinseln)")) == 1
    assert len(draft("2 Eier und Mehl")) == 1


def test_unit_add_dedupe(conn):
    tasse = inv.unit_add(conn, "Tasse")
    assert {inv.unit_add(conn, n) for n in ("Tassen", "tasse", "Tasse/n")} == {tasse}
    el = inv.unit_add(conn, "Esslöffel", "EL")
    assert inv.unit_add(conn, "EL") == el and inv.unit_add(conn, "Esslöffel") == el
    with pytest.raises(inv.InventoryError):
        inv.unit_add(conn, " ")


def page(*blocks):
    return "".join(f'<script type="application/ld+json">{b}</script>' for b in blocks)


RECIPE = {
    "@context": "https://schema.org",
    "@graph": [
        {"@type": "WebSite", "name": "Site"},
        {
            "@type": ["Recipe", "NewsArticle"],
            "name": "Spaghetti &amp; Sauce",
            "recipeYield": "4 Portionen",
            "image": [{"@type": "ImageObject", "url": "https://x.test/a.jpg"}],
            "recipeIngredient": ["200 g Mehl", "Xyzzy plugh", 5, "1 Schuss Salz"],
            "recipeInstructions": [
                {
                    "@type": "HowToSection",
                    "name": "Sauce",
                    "itemListElement": [{"text": "Kochen."}],
                },
                {"@type": "HowToStep", "text": "<p>Essen.</p>"},
            ],
        },
    ],
}


def test_import_draft(conn):
    draft = inv.recipe_import(conn, page("{broken", json.dumps(RECIPE)), "https://x.test/r")
    assert draft["name"] == "Spaghetti & Sauce" and draft["servings"] == 4
    assert draft["steps"] == [
        {"section": "Sauce", "text": "Kochen."},
        {"section": None, "text": "Essen."},
    ]
    assert (
        draft["image_url"] == "https://x.test/a.jpg" and draft["source_url"] == "https://x.test/r"
    )
    flour, nonsense, salt = draft["ingredients"]
    assert flour["category_id"] is not None and nonsense["category_id"] is None
    assert nonsense["text"] == "Xyzzy plugh" and salt["unit_hint"] is None and salt["unit_id"]


@pytest.mark.parametrize(("yield_", "servings"), [(None, 4), ("500", 99), (0, 1), ([6, "6"], 6)])
def test_servings(conn, yield_, servings):
    data = {"@type": "Recipe", "name": "R", "recipeYield": yield_, "recipeIngredient": []}
    assert inv.recipe_import(conn, page(json.dumps(data)), "https://x.test")["servings"] == servings


def test_image_by_reference(conn):
    ref = "https://x.test/r#primaryimage"
    graph = {
        "@graph": [
            {"@type": "Recipe", "name": "R", "image": {"@id": ref}},
            {"@type": "ImageObject", "@id": ref, "contentUrl": "https://x.test/i.jpg"},
        ]
    }
    assert (
        inv.recipe_import(conn, page(json.dumps(graph)), "u")["image_url"] == "https://x.test/i.jpg"
    )


def test_no_recipe(conn):
    with pytest.raises(inv.InventoryError) as err:
        inv.recipe_import(conn, page('{"@type": "WebSite"}'), "https://x.test")
    assert err.value.translation_key == "recipe_not_found"


def test_hostile_pages_stay_fast(conn):
    """No quadratic regex: these took minutes to hours at a few MB before."""
    import time

    nested = '{"@type": "Recipe", "name": "R", "x": ' + "[" * 100_000 + "]" * 100_000 + "}"
    start = time.monotonic()
    for bad in (
        "<script " * 50_000,
        "<script type='application/ld+json'>" * 12_000,
        page(json.dumps({"@type": "Recipe", "name": "<" * 400_000})),
        page(nested),
    ):
        try:
            inv.recipe_import(conn, bad, "https://x.test")
        except inv.InventoryError:
            pass
    assert time.monotonic() - start < 3


async def test_ws_import(ws, aioclient_mock):  # noqa: F811
    html = {"Content-Type": "text/html; charset=utf-8"}
    aioclient_mock.get("https://x.test/ok", text=page(json.dumps(RECIPE)), headers=html)
    aioclient_mock.get("https://x.test/404", status=404)
    aioclient_mock.get(
        "https://x.test/json", text="{}", headers={"Content-Type": "application/json"}
    )
    aioclient_mock.get("https://x.test/big", text=page(json.dumps(RECIPE)), headers=html)
    aioclient_mock.get("https://x.test/500", status=500)
    aioclient_mock.get(
        "https://x.test/latin",
        content=page(json.dumps(RECIPE).replace("Spaghetti", "Köchen")).encode("latin-1"),
        headers={"Content-Type": "text/html; charset=iso-8859-1"},
    )

    async def call(url):
        return await ws.call({"type": "pantry/recipe_import", "url": url})

    msg = await call("https://x.test/ok")
    assert msg["result"]["source_url"] == "https://x.test/ok"
    assert (await call("https://x.test/404"))["error"]["translation_key"] == "recipe_unreachable"
    assert (await call("https://x.test/json"))["error"]["translation_key"] == "recipe_not_found"
    assert (await call("https://x.test/500"))["error"]["translation_key"] == "recipe_unreachable"
    with patch.object(recipe_fetch, "MAX_BYTES", 10):
        assert (await call("https://x.test/big"))["error"][
            "translation_key"
        ] == "recipe_unreachable"
    msg = await call("https://x.test/latin")
    assert "Köchen" in msg["result"]["name"]
    assert not (await call("ftp://x.test/r"))["success"]

    first = (await ws.call({"type": "pantry/unit_add", "name": "Tasse"}))["result"]["id"]
    again = (await ws.call({"type": "pantry/unit_add", "name": "Tassen"}))["result"]["id"]
    assert first == again
