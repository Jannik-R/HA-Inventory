"""HA services for automations (scanners, NFC tags, ESPHome): book in/out by code, print labels,
print the shopping list."""

from __future__ import annotations

from functools import partial

import voluptuous as vol
from homeassistant.core import HomeAssistant, ServiceCall, ServiceResponse, SupportsResponse
from homeassistant.exceptions import ServiceValidationError
from homeassistant.helpers import config_validation as cv

from . import inventory
from .const import DOMAIN, MAX_LABELS
from .websocket_label import async_print_labels, async_print_shopping_list
from .ws_common import db_of, translated
from .ws_validate import ID, NAME, PACKAGES

# YAML may give a scanned EAN as a number and template values as strings: coerce both.
_CODE = vol.All(cv.string, vol.Length(min=1, max=64))
_PACKAGES = vol.All(vol.Coerce(int), PACKAGES)
# A template for an optional field may render "": same as left out.
_LOCATION = vol.Any(None, "", NAME)

BOOK_IN = vol.Schema(
    {
        vol.Required("code"): _CODE,
        vol.Optional("packages", default=1): _PACKAGES,
        vol.Optional("expires_on"): vol.Any(None, "", cv.date),
        vol.Optional("location"): _LOCATION,
    }
)
BOOK_OUT = vol.Schema(
    {
        vol.Required("code"): _CODE,
        vol.Optional("packages", default=1): _PACKAGES,
        vol.Optional("location"): _LOCATION,
    }
)
PRINT_LABELS = vol.Schema(
    {
        vol.Required("batch_id"): vol.All(vol.Coerce(int), ID),
        vol.Optional("count", default=1): vol.All(
            vol.Coerce(int), vol.Range(min=1, max=MAX_LABELS)
        ),
    }
)


async def _run(hass: HomeAssistant, fn, *args) -> dict:
    """Inventory errors are the caller's input (unknown code, no stock): ServiceValidationError."""
    db = db_of(hass)
    with translated(ServiceValidationError):
        return await db.run(fn, *args)


def async_register(hass: HomeAssistant) -> None:
    async def book_in(call: ServiceCall) -> ServiceResponse:
        d = call.data
        fn = partial(
            inventory.book_in_by_code,
            expires_on=d.get("expires_on") or None,
            location=d.get("location") or None,
            user_id=call.context.user_id,
        )
        return await _run(hass, fn, d["code"], d["packages"])

    async def book_out(call: ServiceCall) -> ServiceResponse:
        d = call.data
        fn = partial(
            inventory.book_out_by_code,
            location=d.get("location") or None,
            user_id=call.context.user_id,
        )
        return await _run(hass, fn, d["code"], d["packages"])

    async def print_labels(call: ServiceCall) -> ServiceResponse:
        return await async_print_labels(
            hass, call.data["batch_id"], call.data["count"], browser=False
        )

    async def print_shopping_list(call: ServiceCall) -> ServiceResponse:
        return await async_print_shopping_list(hass)

    for name, handler, schema in (
        ("book_in", book_in, BOOK_IN),
        ("book_out", book_out, BOOK_OUT),
        ("print_labels", print_labels, PRINT_LABELS),
        ("print_shopping_list", print_shopping_list, vol.Schema({})),
    ):
        hass.services.async_register(
            DOMAIN, name, handler, schema, supports_response=SupportsResponse.OPTIONAL
        )
