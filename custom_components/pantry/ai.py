"""AI check of recipe imports and new products, and AI reading of recipe imports through HA's AI Task (any AI set up in HA; chosen in the options)."""

from __future__ import annotations

import asyncio
import logging

import probatio
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import HomeAssistantError

from . import inventory
from .const import CONF_AI_TASK, DOMAIN
from .ws_common import db_of

_LOGGER = logging.getLogger(__name__)
_TIMEOUT = 120  # s; a big prompt on a free tier can take a while

# The answer's shape; Gemini wants plain types (no nullables), so 0 stands for "no category".
RECIPE_CHECK_SCHEMA = probatio.Schema(
    {
        probatio.Required("ok"): bool,
        probatio.Optional("ingredients"): [
            {
                probatio.Required("index"): int,
                probatio.Optional("category_id"): int,
                probatio.Optional("new_type"): {
                    probatio.Required("name"): str,
                    probatio.Required("parent_id"): int,
                },
                probatio.Optional("unit_id"): int,
                probatio.Optional("new_unit"): {probatio.Required("name"): str},
                probatio.Optional("reason"): str,
            }
        ],
        probatio.Optional("steps"): [
            {probatio.Required("text"): str, probatio.Optional("section"): str}
        ],
    }
)

PRODUCT_CHECK_SCHEMA = probatio.Schema(
    {
        probatio.Required("ok"): bool,
        probatio.Optional("name"): str,
        probatio.Optional("category_id"): int,
        probatio.Optional("new_type"): {
            probatio.Required("name"): str,
            probatio.Required("parent_id"): int,
        },
        probatio.Optional("content_amount"): float,
        probatio.Optional("content_unit_id"): int,
        probatio.Optional("reason"): str,
    }
)


async def _generate(hass: HomeAssistant, **kwargs):
    """ai_task.async_generate_data, imported only when an AI is set up (tests patch this)."""
    from homeassistant.components import ai_task

    return await ai_task.async_generate_data(hass, **kwargs)


def entity_of(hass: HomeAssistant) -> str | None:
    """The AI Task entity from the options, None = no AI (unset, or ai_task not loaded)."""
    entries = hass.config_entries.async_loaded_entries(DOMAIN)
    entity_id = entries[0].options.get(CONF_AI_TASK) if entries else None
    return entity_id if entity_id and "ai_task" in hass.config.components else None


async def _check(hass: HomeAssistant, task: str, instructions: str, structure) -> object:
    """One check through ai_task: the answer's data; a failure or timeout is an error."""
    try:
        async with asyncio.timeout(_TIMEOUT):
            result = await _generate(
                hass,
                task_name=task,
                entity_id=entity_of(hass),
                instructions=instructions,
                structure=structure,
            )
    except (HomeAssistantError, TimeoutError) as err:
        _LOGGER.warning("AI check (%s) failed: %s", task, err)
        raise HomeAssistantError(translation_domain=DOMAIN, translation_key="ai_failed") from err
    return result.data


async def async_check_recipe(hass: HomeAssistant, draft: dict) -> dict:
    """{status: off} without an AI Task entity, else {status: ok} or {status: changes, ...}."""
    db = db_of(hass)
    if not entity_of(hass):
        return {"status": "off"}
    instructions = await db.run(inventory.ai_prompt, draft)
    data = await _check(hass, "Vorrat: Rezeptimport prüfen", instructions, RECIPE_CHECK_SCHEMA)
    found = await db.run(inventory.ai_changes, draft, data)
    return {"status": "ok"} if found["ok"] else {"status": "changes", **found}


async def async_check_product(hass: HomeAssistant, draft: dict) -> dict:
    """Like async_check_recipe, for a new product from Open Food Facts."""
    db = db_of(hass)
    if not entity_of(hass):
        return {"status": "off"}
    instructions = await db.run(inventory.ai_product_prompt, draft)
    data = await _check(hass, "Vorrat: Neues Produkt prüfen", instructions, PRODUCT_CHECK_SCHEMA)
    found = await db.run(inventory.ai_product_changes, draft, data)
    return {"status": "ok"} if found.pop("ok") else {"status": "changes", **found}
