"""Websocket commands for printing: print config, labels (printer or browser), book out by label code,
shopping list on the receipt printer."""

from __future__ import annotations

from functools import partial

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import HomeAssistantError, ServiceValidationError

from . import inventory, label, receipt
from .const import (
    CONF_LABEL_HEIGHT,
    CONF_LABEL_WIDTH,
    CONF_PRINT_ON_BOOK_IN,
    DOMAIN,
    MAX_LABELS,
)
from .label_printers import MODELS, printer_of
from .ws_common import db_of, run
from .ws_validate import CODE, ID


def async_register(hass: HomeAssistant) -> None:
    for command in (ws_label_config, ws_print_labels, ws_book_out_label, ws_print_shopping_list):
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
        "width_mm": opts.get(CONF_LABEL_WIDTH, 57),
        "height_mm": opts.get(CONF_LABEL_HEIGHT, 32),
        "receipt": bool(receipt.target_of(opts)),
    }


@websocket_api.websocket_command({vol.Required("type"): "pantry/label_config"})
@websocket_api.async_response
async def ws_label_config(hass: HomeAssistant, connection, msg: dict) -> None:
    cfg = _config(hass)
    cfg.pop("model")
    connection.send_result(msg["id"], cfg | {"printer": bool(cfg["printer"])})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "pantry/print_labels",
        vol.Required("batch_id"): ID,
        vol.Required("count"): vol.All(int, vol.Range(min=1, max=MAX_LABELS)),
    }
)
@websocket_api.async_response
async def ws_print_labels(hass: HomeAssistant, connection, msg: dict) -> None:
    """Print, or return the image for the browser (see async_print_labels)."""
    connection.send_result(msg["id"], await async_print_labels(hass, msg["batch_id"], msg["count"]))


async def async_print_labels(
    hass: HomeAssistant, batch_id: int, count: int, browser: bool = True
) -> dict:
    """`count` identical labels for a batch: printed, or one image the browser repeats `count` times.

    browser=False (services): a browser-only setup raises instead of returning an image."""
    cfg = _config(hass)
    w, h, model = cfg["width_mm"], cfg["height_mm"], cfg["model"]
    if not model.network and not browser:
        raise ServiceValidationError(translation_domain=DOMAIN, translation_key="no_label_printer")
    info = await run(hass, inventory.label_info, batch_id)
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
    {vol.Required("type"): "pantry/book_out_label", vol.Required("code"): CODE}
)
@websocket_api.async_response
async def ws_book_out_label(hass: HomeAssistant, connection, msg: dict) -> None:
    """One package out by a scanned label; any user, like booking."""
    result = await run(
        hass, partial(inventory.book_out_code, user_id=connection.user.id), msg["code"]
    )
    connection.send_result(msg["id"], result)


async def async_print_shopping_list(hass: HomeAssistant) -> dict:
    """The open shopping list on the receipt printer; {"printed": number of items}."""
    db_of(hass)  # raises not_loaded
    opts = hass.config_entries.async_loaded_entries(DOMAIN)[0].options
    if not receipt.target_of(opts):
        raise ServiceValidationError(
            translation_domain=DOMAIN, translation_key="no_receipt_printer"
        )
    items = await run(hass, inventory.shopping_list)
    return await receipt.async_print_shopping_list(hass, opts, items)


@websocket_api.websocket_command({vol.Required("type"): "pantry/print_shopping_list"})
@websocket_api.async_response
async def ws_print_shopping_list(hass: HomeAssistant, connection, msg: dict) -> None:
    """Any user, like the shopping list itself."""
    connection.send_result(msg["id"], await async_print_shopping_list(hass))
