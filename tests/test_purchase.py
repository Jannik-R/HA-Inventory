"""Receipt import: prompt, AI answer check (candidates, learned lines), booking, websocket."""

from types import SimpleNamespace
from unittest.mock import AsyncMock, patch

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.setup import async_setup_component
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.pantry import inventory as inv
from custom_components.pantry.const import CONF_AI_TASK, DOMAIN
from tests.test_inventory import cat, loc, product

RECEIPT = "REWE\nJA H-MILCH 3,5% 1L  0,99\nPFAND 0,25\n2 x BANANEN 1,19\n"


def test_prompt_lists_products_and_receipt(conn) -> None:
    milk = product(conn, "H-Milch", "H-Milch", brand="ja!")
    text = inv.receipt_prompt(conn, RECEIPT)
    assert f"{milk}|H-Milch|ja!" in text and text.endswith("2 x BANANEN 1,19\n")
    with pytest.raises(inv.InventoryError):
        inv.receipt_prompt(conn, "  ")


def test_analyze_candidates_learning_and_booking(conn) -> None:
    milk = product(conn, "H-Milch", "H-Milch")
    milk2 = product(conn, "H-Milch fettarm", "H-Milch")
    answer = {
        "store": "REWE",
        "items": [
            {
                "text": "JA H-MILCH 3,5% 1L",
                "name": "H-Milch",
                "packages": 1,
                "product_ids": [milk, milk2, 999],
            },
            {"text": "BANANEN", "name": "Bananen", "packages": 2, "product_ids": []},
            {"text": "", "name": "x", "packages": 1},
            "junk",
        ],
    }
    res = inv.receipt_items(conn, answer)
    assert res["store"] == "REWE"
    first, banana = res["items"]
    assert first["product_id"] is None  # two candidates: the user chooses
    assert [c["id"] for c in first["candidates"]] == [milk, milk2]
    assert (banana["product_id"], banana["packages"], banana["category_id"]) == (
        None,
        2,
        cat(conn, "Bananen"),
    )

    out = inv.book_receipt(
        conn,
        "REWE",
        [
            {"text": first["text"], "product_id": milk2, "packages": 1, "location_id": loc(conn)},
            {
                "text": "BANANEN",
                "product": {"name": "Bananen", "category_id": cat(conn, "Bananen")},
                "packages": 2,
            },
        ],
    )
    assert out == {"booked": 3, "rows": 2}
    guessed = conn.execute("SELECT count(*) FROM batch WHERE expiry_guessed = 1").fetchone()[0]
    assert guessed == 2  # no dates typed: both guessed from the shelf life
    # next receipt of the store: the learned product wins, also with other spacing / case
    answer["items"][0]["text"] = "ja  h-milch 3,5% 1l"
    again = inv.receipt_items(conn, answer)["items"][0]
    assert again["product_id"] == milk2 and again["candidates"][0]["id"] == milk2


async def test_websocket(hass: HomeAssistant, hass_ws_client) -> None:
    assert await async_setup_component(hass, "http", {})
    entry = MockConfigEntry(domain=DOMAIN)
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    client = await hass_ws_client(hass)
    await client.send_json_auto_id({"type": "pantry/receipt_read", "text": RECEIPT})
    assert (await client.receive_json())["error"]["translation_key"] == "ai_off"

    hass.config_entries.async_update_entry(entry, options={CONF_AI_TASK: "ai_task.test"})
    hass.config.components.add("ai_task")
    answer = SimpleNamespace(
        data={"store": "REWE", "items": [{"text": "BANANEN", "name": "Bananen", "packages": 2}]}
    )
    with patch("custom_components.pantry.ai._generate", new=AsyncMock(return_value=answer)) as gen:
        await client.send_json_auto_id({"type": "pantry/receipt_read", "text": RECEIPT})
        res = (await client.receive_json())["result"]
    assert "Receipt:\nREWE" in gen.await_args.kwargs["instructions"]
    item = res["items"][0]
    assert (item["name"], item["packages"], item["product_id"]) == ("Bananen", 2, None)

    book = {
        "type": "pantry/receipt_book",
        "store": "REWE",
        "items": [
            {
                "text": "BANANEN",
                "packages": 2,
                "product": {"name": "Bananen", "category_id": item["category_id"]},
            }
        ],
    }
    await client.send_json_auto_id(book)
    assert (await client.receive_json())["result"] == {"booked": 2, "rows": 1}
    await client.send_json_auto_id({**book, "items": [{"packages": 1}]})  # neither id nor product
    assert (await client.receive_json())["success"] is False
