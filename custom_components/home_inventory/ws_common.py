"""Helpers shared by the websocket, service and todo modules: the loaded DB and error translation."""

from __future__ import annotations

from collections.abc import Iterator, Mapping
from contextlib import contextmanager
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.exceptions import HomeAssistantError

from .const import DOMAIN, external
from .db import Database
from .inventory import InventoryError


def db_of(hass: HomeAssistant) -> Database:
    entries = hass.config_entries.async_loaded_entries(DOMAIN)
    if not entries:
        raise HomeAssistantError(translation_domain=DOMAIN, translation_key="not_loaded")
    return entries[0].runtime_data


def options_of(hass: HomeAssistant) -> Mapping[str, Any]:
    """Options of the loaded entry (empty when not loaded)."""
    entries = hass.config_entries.async_loaded_entries(DOMAIN)
    return entries[0].options if entries else {}


def external_on(hass: HomeAssistant, key: str) -> bool:
    """The options allow this external service (see const.EXTERNAL)."""
    return external(options_of(hass), key)


@contextmanager
def translated(cls: type[HomeAssistantError] = HomeAssistantError) -> Iterator[None]:
    """InventoryError -> HomeAssistantError (services: ServiceValidationError) with translation."""
    try:
        yield
    except InventoryError as err:
        raise cls(
            translation_domain=DOMAIN,
            translation_key=err.translation_key,
            translation_placeholders={k: str(v) for k, v in err.placeholders.items()},
        ) from err


async def run(hass: HomeAssistant, fn, *args: Any) -> Any:
    """Run an inventory function on the loaded entry's DB."""
    db = db_of(hass)
    with translated():
        return await db.run(fn, *args)
