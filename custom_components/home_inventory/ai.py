"""AI check of recipe imports and new products, AI reading of shopping receipts, and AI reading of recipe imports through HA's AI Task (any AI set up in HA; chosen in the options)."""

from __future__ import annotations

import asyncio
import json
import logging
from datetime import UTC, datetime
from pathlib import Path

import probatio
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import HomeAssistantError

from . import inventory
from .const import CONF_AI_LOG, CONF_AI_TASK, DOMAIN
from .ws_common import db_of, external_on, options_of, translated

_LOGGER = logging.getLogger(__name__)
LOG_MAX_BYTES = 2 * 1024 * 1024
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

RECEIPT_SCHEMA = probatio.Schema(
    {
        probatio.Required("store"): str,
        probatio.Required("items"): [
            {
                probatio.Required("text"): str,
                probatio.Required("name"): str,
                probatio.Required("packages"): int,
                probatio.Optional("product_ids"): [int],
            }
        ],
    }
)


async def _generate(hass: HomeAssistant, **kwargs):
    """ai_task.async_generate_data, imported only when an AI is set up (tests patch this)."""
    from homeassistant.components import ai_task

    return await ai_task.async_generate_data(hass, **kwargs)


def entity_of(hass: HomeAssistant) -> str | None:
    """The AI Task entity from the options, None = no AI (unset, or ai_task not loaded)."""
    entity_id = options_of(hass).get(CONF_AI_TASK)
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


def _append_log(path: Path, line: str) -> None:
    # shortcut: concurrent checks may interleave or lose a line; fine for a debug log, lock it if it is ever read by code.
    path.parent.mkdir(parents=True, exist_ok=True)
    if path.exists() and path.stat().st_size >= LOG_MAX_BYTES:
        path.replace(path.with_name(path.name + ".1"))
    with path.open("a", encoding="utf-8") as f:
        f.write(line + "\n")


async def _log_changes(
    hass: HomeAssistant, check: str, draft: dict, found: dict, source: str | None = None
) -> None:
    """Option "Log AI changes": one line per check with changes, to improve the parser later."""
    if not options_of(hass).get(CONF_AI_LOG):
        return
    line = json.dumps(
        {
            "ts": datetime.now(UTC).isoformat(),
            "check": check,
            "source": (source or draft.get("ean") or "")[:2000]
            or None,  # recipe URL or product barcode
            "draft": draft,
            "changes": {k: v for k, v in found.items() if k != "ok"},
        },
        ensure_ascii=False,
    )
    try:
        await hass.async_add_executor_job(
            _append_log, Path(hass.config.path("home_inventory", "ai_changes.jsonl")), line
        )
    except OSError as err:
        _LOGGER.warning("AI change log not written: %s", err)


def _reasons_in(language: str | None) -> str:
    """Last prompt line (after the cached fixed part): the panel language for the "reason" texts.
    The data itself follows the database language (see inventory/ai_lang.py)."""
    name = "German" if (language or "").startswith("de") else "English"
    return f'\nWrite every "reason" in {name}.\n'


async def async_check_recipe(hass: HomeAssistant, draft: dict, language: str | None = None) -> dict:
    """{status: off} without an AI Task entity, else {status: ok} or {status: changes, ...}."""
    db = db_of(hass)
    if not entity_of(hass) or not external_on(hass, "ai_recipe_check"):
        return {"status": "off"}
    source = draft.get("source_url")  # for the change log only, not part of the prompt
    draft = {k: v for k, v in draft.items() if k != "source_url"}
    instructions = await db.run(inventory.ai_prompt, draft) + _reasons_in(language)
    data = await _check(hass, "Vorrat: Rezeptimport prüfen", instructions, RECIPE_CHECK_SCHEMA)
    found = await db.run(inventory.ai_changes, draft, data)
    if found["ok"]:
        return {"status": "ok"}
    await _log_changes(hass, "recipe", draft, found, source)
    return {"status": "changes", **found}


async def async_check_product(
    hass: HomeAssistant, draft: dict, language: str | None = None
) -> dict:
    """Like async_check_recipe, for a new product from Open Food Facts."""
    db = db_of(hass)
    if not entity_of(hass) or not external_on(hass, "ai_product_check"):
        return {"status": "off"}
    instructions = await db.run(inventory.ai_product_prompt, draft) + _reasons_in(language)
    data = await _check(hass, "Vorrat: Neues Produkt prüfen", instructions, PRODUCT_CHECK_SCHEMA)
    found = await db.run(inventory.ai_product_changes, draft, data)
    if found.pop("ok"):
        return {"status": "ok"}
    await _log_changes(hass, "product", draft, found)
    return {"status": "changes", **found}


async def async_read_receipt(hass: HomeAssistant, text: str) -> dict:
    """OCR text of a shopping receipt -> items to review (inventory.receipt_items); needs an AI."""
    db = db_of(hass)
    if not entity_of(hass):
        raise HomeAssistantError(translation_domain=DOMAIN, translation_key="ai_off")
    if not external_on(hass, "receipt_import"):
        raise HomeAssistantError(translation_domain=DOMAIN, translation_key="external_off")
    with translated():
        instructions = await db.run(inventory.receipt_prompt, text)
        data = await _check(hass, "Vorrat: Kassenbon lesen", instructions, RECEIPT_SCHEMA)
        return await db.run(inventory.receipt_items, data, write=False)
