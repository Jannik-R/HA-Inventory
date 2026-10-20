"""Websocket commands for printing: print config, labels (printer or browser), book out by label code,
shopping list on the receipt printer."""

from __future__ import annotations

from datetime import date, timedelta
from functools import partial

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import HomeAssistantError, ServiceValidationError

from . import inventory, label, receipt
from .const import (
    CONF_LABEL_HEIGHT,
    CONF_LABEL_WIDTH,
    CONF_PREFILL_EXPIRY,
    CONF_PRINT_ON_BOOK_IN,
    DOMAIN,
    MAX_LABELS,
)
from .label_printers import MODELS, printer_of
from .ws_common import db_of, run
from .ws_validate import CODE, ID


def async_register(hass: HomeAssistant) -> None:
    for command in (
        ws_label_config,
        ws_print_labels,
        ws_book_out_label,
        ws_print_shopping_list,
        ws_print_recipe,
        ws_print_plan,
    ):
        websocket_api.async_register_command(hass, command)


def _config(hass: HomeAssistant) -> dict:
    db_of(hass)  # raises not_loaded
    opts = hass.config_entries.async_loaded_entries(DOMAIN)[0].options
    key, host = printer_of(opts)
    model = MODELS[key]
    return {
        "model": model,
        "printer": host if model.network else "",
        "print_on_book_in": opts.get(CONF_PRINT_ON_BOOK_IN, True),
        "prefill_expiry": opts.get(CONF_PREFILL_EXPIRY, False),  # booking form, not labels
        "width_mm": opts.get(CONF_LABEL_WIDTH, 57),
        "height_mm": opts.get(CONF_LABEL_HEIGHT, 32),
        "receipt": bool(receipt.target_of(opts)),
    }


@websocket_api.websocket_command({vol.Required("type"): "home_inventory/label_config"})
@websocket_api.async_response
async def ws_label_config(hass: HomeAssistant, connection, msg: dict) -> None:
    cfg = _config(hass)
    cfg.pop("model")
    connection.send_result(msg["id"], cfg | {"printer": bool(cfg["printer"])})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "home_inventory/print_labels",
        # a batch's labels, or a location's (code PTRY:L<id>)
        vol.Exclusive("batch_id", "what"): ID,
        vol.Exclusive("location_id", "what"): ID,
        vol.Required("count"): vol.All(int, vol.Range(min=1, max=MAX_LABELS)),
    }
)
@websocket_api.async_response
async def ws_print_labels(hass: HomeAssistant, connection, msg: dict) -> None:
    """Print, or return the image for the browser (see async_print_labels)."""
    if "batch_id" not in msg and "location_id" not in msg:
        connection.send_error(
            msg["id"], websocket_api.ERR_INVALID_FORMAT, "batch_id or location_id"
        )
        return
    result = await async_print_labels(
        hass, msg.get("batch_id"), msg["count"], location_id=msg.get("location_id")
    )
    connection.send_result(msg["id"], result)


async def async_print_labels(
    hass: HomeAssistant,
    batch_id: int | None,
    count: int,
    browser: bool = True,
    location_id: int | None = None,
) -> dict:
    """`count` identical labels for a batch: printed, or one image the browser repeats `count` times.

    browser=False (services): a browser-only setup raises instead of returning an image."""
    cfg = _config(hass)
    w, h, model = cfg["width_mm"], cfg["height_mm"], cfg["model"]
    if not model.network and not browser:
        raise ServiceValidationError(translation_domain=DOMAIN, translation_key="no_label_printer")
    info = await (
        run(hass, inventory.location_label_info, location_id)
        if location_id is not None
        else run(hass, inventory.label_info, batch_id)
    )
    if model.network and not cfg["printer"]:
        raise HomeAssistantError(translation_domain=DOMAIN, translation_key="printer_unreachable")
    image = await hass.async_add_executor_job(label.render, info, w, h, model.bottom_reserve_mm)
    if cfg["printer"]:
        data = await hass.async_add_executor_job(model.encode, [image] * count)
        await label.send(cfg["printer"], data, model.port)
        return {"printed": count}
    (url,) = await hass.async_add_executor_job(label.png_data_urls, [image])
    return {"image": url, "count": count, "width_mm": w, "height_mm": h}


@websocket_api.websocket_command(
    {vol.Required("type"): "home_inventory/book_out_label", vol.Required("code"): CODE}
)
@websocket_api.async_response
async def ws_book_out_label(hass: HomeAssistant, connection, msg: dict) -> None:
    """One package out by a scanned label; any user, like booking."""
    result = await run(
        hass, partial(inventory.book_out_code, user_id=connection.user.id), msg["code"]
    )
    connection.send_result(msg["id"], result)


def _receipt_options(hass: HomeAssistant):
    """The entry's options; raises when no receipt printer is set up."""
    db_of(hass)  # raises not_loaded
    opts = hass.config_entries.async_loaded_entries(DOMAIN)[0].options
    if not receipt.target_of(opts):
        raise ServiceValidationError(
            translation_domain=DOMAIN, translation_key="no_receipt_printer"
        )
    return opts


async def async_print_shopping_list(hass: HomeAssistant) -> dict:
    """The open shopping list on the receipt printer; {"printed": number of items}."""
    opts = _receipt_options(hass)
    items = await run(hass, inventory.shopping_list)
    return await receipt.async_print_shopping_list(hass, opts, items)


async def async_print_plan(hass: HomeAssistant, start: date, days: int) -> dict:
    """The meal plan of `days` days from `start` on the receipt printer."""
    opts = _receipt_options(hass)
    end = start + timedelta(days=days)
    meals = await run(hass, inventory.meals, start.isoformat(), end.isoformat())
    return await receipt.async_print_plan(hass, opts, meals, start, days)


async def async_print_recipe(hass: HomeAssistant, recipe_id: int, servings: int | None) -> dict:
    """A recipe (amounts for `servings`, default its own) on the receipt printer."""
    opts = _receipt_options(hass)
    sheet = await run(hass, inventory.recipe_sheet, recipe_id, servings)
    return await receipt.async_print_recipe(hass, opts, sheet)


@websocket_api.websocket_command({vol.Required("type"): "home_inventory/print_shopping_list"})
@websocket_api.async_response
async def ws_print_shopping_list(hass: HomeAssistant, connection, msg: dict) -> None:
    """Any user, like the shopping list itself."""
    connection.send_result(msg["id"], await async_print_shopping_list(hass))


@websocket_api.websocket_command(
    {
        vol.Required("type"): "home_inventory/print_recipe",
        vol.Required("recipe_id"): ID,
        vol.Optional("servings"): vol.All(int, vol.Range(min=1, max=99)),
    }
)
@websocket_api.async_response
async def ws_print_recipe(hass: HomeAssistant, connection, msg: dict) -> None:
    """Any user, like the recipes."""
    result = await async_print_recipe(hass, msg["recipe_id"], msg.get("servings"))
    connection.send_result(msg["id"], result)


@websocket_api.websocket_command(
    {
        vol.Required("type"): "home_inventory/print_plan",
        vol.Required("start"): vol.Date(),
        vol.Required("days"): vol.In([1, 7]),
    }
)
@websocket_api.async_response
async def ws_print_plan(hass: HomeAssistant, connection, msg: dict) -> None:
    """Day or week view of the meal plan; any user, like the plan."""
    start = date.fromisoformat(msg["start"])
    connection.send_result(msg["id"], await async_print_plan(hass, start, msg["days"]))
