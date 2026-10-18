"""HA services for automations (scanners, NFC tags, ESPHome, voice): book in/out by code, print
labels and the shopping list, a recipe on the shopping list, plan a dish, a canning protocol."""

from __future__ import annotations

from functools import partial

import voluptuous as vol
from homeassistant.core import HomeAssistant, ServiceCall, ServiceResponse, SupportsResponse
from homeassistant.exceptions import ServiceValidationError
from homeassistant.helpers import config_validation as cv
from homeassistant.util import dt as dt_util

from . import inventory
from .const import CONF_HOUSEHOLD_SERVINGS, DEFAULT_SERVINGS, DOMAIN, MAX_LABELS
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
_DATE = vol.Any(None, "", cv.date)
_SERVINGS = vol.All(vol.Coerce(int), vol.Range(min=1, max=99))
# order = meal_plan.slot (0 breakfast … 4 snack)
MEALS = ["breakfast", "lunch", "coffee", "dinner", "snack"]
SHOP_RECIPE = vol.Schema({vol.Required("recipe"): NAME, vol.Optional("servings"): _SERVINGS})
PLAN_MEAL = vol.Schema(
    {
        vol.Exclusive("recipe", "dish"): NAME,
        vol.Exclusive("text", "dish"): vol.All(cv.string, vol.Length(min=1, max=200)),
        vol.Optional("day"): _DATE,
        vol.Optional("meal", default="dinner"): vol.In(MEALS),
        vol.Optional("servings"): _SERVINGS,
    }
)
CANNING = vol.Schema(
    {
        vol.Required("recipe"): NAME,
        vol.Optional("jars"): vol.Any(None, "", _PACKAGES),
        vol.Optional("made_on"): _DATE,
        vol.Optional("expires_on"): _DATE,
        vol.Optional("location"): _LOCATION,
        vol.Optional("notes"): vol.Any(None, vol.All(cv.string, vol.Length(max=2000))),
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


def _household(hass: HomeAssistant) -> int:
    entry = hass.config_entries.async_loaded_entries(DOMAIN)[0]
    return entry.options.get(CONF_HOUSEHOLD_SERVINGS, DEFAULT_SERVINGS)


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

    async def shop_recipe(call: ServiceCall) -> ServiceResponse:
        servings = call.data.get("servings") or _household(hass)
        return await _run(hass, inventory.shop_recipe_by_name, call.data["recipe"], servings)

    async def plan_meal(call: ServiceCall) -> ServiceResponse:
        d = call.data
        if not (d.get("recipe") or d.get("text")):
            raise ServiceValidationError(translation_domain=DOMAIN, translation_key="dish_required")
        fn = partial(inventory.plan_meal_by_name, recipe=d.get("recipe"), text=d.get("text"))
        day = d.get("day") or dt_util.now().date()
        return await _run(
            hass, fn, day, MEALS.index(d["meal"]), d.get("servings") or _household(hass)
        )

    async def canning(call: ServiceCall) -> ServiceResponse:
        d = call.data
        fn = partial(
            inventory.canning_by_name,
            jars=d.get("jars") or None,
            location=d.get("location") or None,
            expires_on=d.get("expires_on") or None,
            notes=d.get("notes"),
            user_id=call.context.user_id,
        )
        return await _run(hass, fn, d["recipe"], d.get("made_on") or dt_util.now().date())

    for name, handler, schema in (
        ("book_in", book_in, BOOK_IN),
        ("book_out", book_out, BOOK_OUT),
        ("print_labels", print_labels, PRINT_LABELS),
        ("print_shopping_list", print_shopping_list, vol.Schema({})),
        ("shop_recipe", shop_recipe, SHOP_RECIPE),
        ("plan_meal", plan_meal, PLAN_MEAL),
        ("canning", canning, CANNING),
    ):
        hass.services.async_register(
            DOMAIN, name, handler, schema, supports_response=SupportsResponse.OPTIONAL
        )
