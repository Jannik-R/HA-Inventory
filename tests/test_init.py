"""Setup, panel and unload."""

import asyncio
import sqlite3
from unittest.mock import AsyncMock, patch

import pytest
from homeassistant import config_entries
from homeassistant.core import HomeAssistant
from homeassistant.data_entry_flow import FlowResultType, InvalidData
from homeassistant.exceptions import HomeAssistantError
from homeassistant.setup import async_setup_component
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.home_inventory import inventory
from custom_components.home_inventory.backup import async_post_backup, async_pre_backup
from custom_components.home_inventory.const import DOMAIN, EXTERNAL, external


async def test_flow_setup_and_unload(hass: HomeAssistant) -> None:
    """Config flow creates the entry, the panel appears and disappears on unload."""
    assert await async_setup_component(hass, "http", {})

    result = await hass.config_entries.flow.async_init(
        DOMAIN, context={"source": config_entries.SOURCE_USER}
    )
    assert result["type"] is FlowResultType.FORM
    result = await hass.config_entries.flow.async_configure(result["flow_id"], {})
    assert result["type"] is FlowResultType.CREATE_ENTRY
    await hass.async_block_till_done()
    assert DOMAIN in hass.data["frontend_panels"]
    panel = hass.data["frontend_panels"][DOMAIN]
    assert panel.config["modules"] == [
        "shopping",
        "recipes",
        "plan",
        "canning",
        "drying",
        "opened",
        "frozen",
        "emergency",
        "leftovers",
    ]
    assert panel.config["external"]["off_lookup"] is True

    entry = hass.config_entries.async_entries(DOMAIN)[0]
    await async_pre_backup(hass)
    assert entry.runtime_data.gate.locked()
    await async_post_backup(hass)
    assert not entry.runtime_data.gate.locked()

    assert await hass.config_entries.async_unload(entry.entry_id)
    assert DOMAIN not in hass.data["frontend_panels"]

    result = await hass.config_entries.flow.async_init(
        DOMAIN, context={"source": config_entries.SOURCE_USER}
    )
    assert result["type"] is FlowResultType.ABORT


async def _options_entry(hass: HomeAssistant) -> MockConfigEntry:
    assert await async_setup_component(hass, "http", {})
    entry = MockConfigEntry(domain=DOMAIN, title="Home Inventory")
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    return entry


async def test_options_flow_modules(hass: HomeAssistant) -> None:
    """Turning modules off reloads the entry: the panel gets the list, todo/calendar entities go."""
    entry = await _options_entry(hass)
    assert hass.states.async_entity_ids("todo")
    result = await hass.config_entries.options.async_init(entry.entry_id)
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"next_step_id": "modules"}
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"modules": ["recipes"]}
    )
    assert result["type"] is FlowResultType.CREATE_ENTRY
    await hass.async_block_till_done()
    assert entry.options["modules"] == ["recipes"]
    assert hass.data["frontend_panels"][DOMAIN].config["modules"] == ["recipes"]
    assert not hass.states.async_entity_ids("todo")
    assert not hass.states.async_entity_ids("calendar")
    assert hass.states.async_entity_ids("sensor")


async def test_options_flow_browser(hass: HomeAssistant) -> None:
    """The browser model has no host and no test print."""
    entry = await _options_entry(hass)
    result = await hass.config_entries.options.async_init(entry.entry_id)
    assert result["type"] is FlowResultType.MENU
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"next_step_id": "label_model"}
    )
    assert result["data_schema"]({})["label_printer"] == "browser"
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"label_printer": "browser"}
    )
    assert result["step_id"] == "label" and "label_printer_host" not in result["data_schema"].schema
    form = {"label_width": 100, "label_height": 60, "print_on_book_in": False}
    result = await hass.config_entries.options.async_configure(result["flow_id"], form)
    assert result["type"] is FlowResultType.CREATE_ENTRY
    await hass.async_block_till_done()  # saving reloads the entry
    assert entry.options == {**form, "label_printer": "browser"}


async def test_options_flow_dymo_test_print(hass: HomeAssistant) -> None:
    """Dymo: limits of the model, host required, test print reports an unreachable printer (nothing real is sent)."""
    entry = await _options_entry(hass)
    form = {
        "label_printer_host": "10.0.0.5",
        "label_width": 57,
        "label_height": 32,
        "print_on_book_in": False,
    }

    result = await hass.config_entries.options.async_init(entry.entry_id)
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"next_step_id": "label_model"}
    )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"label_printer": "dymo_lw4xx"}
    )
    with pytest.raises(InvalidData):  # wider than the print head
        await hass.config_entries.options.async_configure(
            result["flow_id"], {**form, "label_width": 58}
        )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {**form, "label_printer_host": " "}
    )
    assert result["errors"] == {"label_printer_host": "host_required"}
    with patch("custom_components.home_inventory.label.send", side_effect=HomeAssistantError("x")):
        result = await hass.config_entries.options.async_configure(
            result["flow_id"], {**form, "test_print": True}
        )
    assert result["errors"] == {"base": "printer_unreachable"}
    assert result["data_schema"]({})["test_print"] is True  # a retry tests again

    with patch("custom_components.home_inventory.label.send", new=AsyncMock()) as send:
        result = await hass.config_entries.options.async_configure(
            result["flow_id"], {**form, "test_print": True}
        )
    assert result["type"] is FlowResultType.CREATE_ENTRY
    await hass.async_block_till_done()  # saving reloads the entry
    send.assert_awaited_once()
    assert send.await_args.args[0] == "10.0.0.5" and send.await_args.args[2] == 9100
    assert entry.options == {**form, "label_printer": "dymo_lw4xx"}  # test_print is not stored


async def test_backup_blocks_writes_without_parking_a_thread(hass: HomeAssistant) -> None:
    db = (await _options_entry(hass)).runtime_data
    await async_pre_backup(hass)
    write = hass.async_create_task(db.run(inventory.list_rows, "unit"))
    await asyncio.sleep(0.05)
    assert not write.done()  # waits on the event loop
    await async_post_backup(hass)
    assert await asyncio.wait_for(write, 5)


async def test_failed_setup_closes_the_database(hass: HomeAssistant) -> None:
    assert await async_setup_component(hass, "http", {})
    entry = MockConfigEntry(domain=DOMAIN)
    entry.add_to_hass(hass)
    with patch(
        "custom_components.home_inventory.panel_custom.async_register_panel",
        side_effect=RuntimeError("x"),
    ):
        assert not await hass.config_entries.async_setup(entry.entry_id)
    with pytest.raises(sqlite3.ProgrammingError):  # closed
        entry.runtime_data._conn.execute("SELECT 1")


async def test_options_flow_household(hass: HomeAssistant) -> None:
    entry = await _options_entry(hass)
    result = await hass.config_entries.options.async_init(entry.entry_id)
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"next_step_id": "household"}
    )
    assert result["data_schema"]({})["household_servings"] == 3
    with pytest.raises(InvalidData):
        await hass.config_entries.options.async_configure(
            result["flow_id"], {"household_servings": 0}
        )
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"household_servings": 4}
    )
    assert result["type"] is FlowResultType.CREATE_ENTRY
    await hass.async_block_till_done()  # saving reloads the entry
    assert entry.options == {"household_servings": 4, "prefill_expiry": False}


async def test_options_flow_ai(hass: HomeAssistant) -> None:
    entry = await _options_entry(hass)
    result = await hass.config_entries.options.async_init(entry.entry_id)
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"next_step_id": "ai"}
    )
    assert result["data_schema"]({})["llm_access"] == "plan"
    with pytest.raises(InvalidData):
        await hass.config_entries.options.async_configure(result["flow_id"], {"llm_access": "x"})
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"llm_access": "all"}
    )
    assert result["type"] is FlowResultType.CREATE_ENTRY
    await hass.async_block_till_done()
    assert entry.options == {"ai_task_entity": None, "llm_access": "all"}


async def test_options_flow_external(hass: HomeAssistant) -> None:
    """One switch per external service; the panel gets them resolved (AI ones need the entity)."""
    entry = await _options_entry(hass)
    result = await hass.config_entries.options.async_init(entry.entry_id)
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"next_step_id": "external"}
    )
    assert result["data_schema"]({}) == EXTERNAL
    choice = {**EXTERNAL, "off_lookup": False, "ai_video": True}
    result = await hass.config_entries.options.async_configure(result["flow_id"], choice)
    assert result["type"] is FlowResultType.CREATE_ENTRY
    await hass.async_block_till_done()
    assert entry.options == choice
    config = hass.data["frontend_panels"][DOMAIN].config["external"]
    assert config["off_lookup"] is False and config["recipe_url"] is True
    assert config["off_images"] is True
    assert config["recipe_images"] is True
    assert config["ai_video"] is False  # no AI Task entity
    assert external({**choice, "ai_task_entity": "ai_task.x"}, "ai_video") is True
