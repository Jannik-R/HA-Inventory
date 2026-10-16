"""Websocket commands for recipes: list, availability, save, import from a URL, new product type / unit."""

from __future__ import annotations

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant

from . import inventory, recipe_fetch
from .websocket import _db, _run, _translated
from .ws_validate import ID, IMAGE_URL, NAME, NULL_ID, POSITIVE, text

SERVINGS = vol.All(int, vol.Range(min=1, max=99))
INGREDIENT = {
    vol.Optional("category_id"): NULL_ID,
    vol.Optional("amount"): vol.Any(None, POSITIVE),
    vol.Optional("unit_id"): NULL_ID,
    vol.Optional("text"): text(200),
    vol.Optional("note"): vol.Any(None, text(200)),
    vol.Optional("optional"): bool,
    vol.Optional("skip_stock"): bool,
}


def async_register(hass: HomeAssistant) -> None:
    for command in (
        ws_recipes,
        ws_recipe_availability,
        ws_recipe_save,
        ws_recipe_import,
        ws_product_type_add,
        ws_unit_add,
    ):
        websocket_api.async_register_command(hass, command)


@websocket_api.websocket_command({vol.Required("type"): "pantry/recipes"})
@websocket_api.async_response
async def ws_recipes(hass: HomeAssistant, connection, msg: dict) -> None:
    connection.send_result(msg["id"], await _run(hass, inventory.recipes))


@websocket_api.websocket_command(
    {
        vol.Required("type"): "pantry/recipe_availability",
        vol.Required("recipe_id"): ID,
        vol.Required("servings"): SERVINGS,
    }
)
@websocket_api.async_response
async def ws_recipe_availability(hass: HomeAssistant, connection, msg: dict) -> None:
    result = await _run(hass, inventory.recipe_availability, msg["recipe_id"], msg["servings"])
    connection.send_result(msg["id"], result)


@websocket_api.websocket_command(
    {
        vol.Required("type"): "pantry/recipe_save",
        vol.Required("data"): {
            vol.Optional("id"): ID,
            vol.Required("name"): NAME,
            vol.Required("servings"): SERVINGS,
            vol.Optional("instructions"): vol.Any(None, text(20000)),
            vol.Optional("source_url"): vol.Any(None, IMAGE_URL),
            vol.Optional("image_url"): vol.Any(None, IMAGE_URL),
            vol.Required("ingredients"): vol.All([INGREDIENT], vol.Length(max=100)),
        },
    }
)
@websocket_api.async_response
async def ws_recipe_save(hass: HomeAssistant, connection, msg: dict) -> None:
    connection.send_result(msg["id"], {"id": await _run(hass, inventory.save_recipe, msg["data"])})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "pantry/product_type_add",
        vol.Required("name"): NAME,
        vol.Required("parent_id"): ID,
    }
)
@websocket_api.async_response
async def ws_product_type_add(hass: HomeAssistant, connection, msg: dict) -> None:
    """A product type is a category below a parent; any user may add one from a recipe."""
    data = {"name": msg["name"], "parent_id": msg["parent_id"]}
    connection.send_result(msg["id"], {"id": await _run(hass, inventory.save, "category", data)})


@websocket_api.websocket_command(
    {vol.Required("type"): "pantry/recipe_import", vol.Required("url"): IMAGE_URL}
)
@websocket_api.async_response
async def ws_recipe_import(hass: HomeAssistant, connection, msg: dict) -> None:
    """Recipe draft from a web page (not saved)."""
    with _translated():
        draft = await recipe_fetch.async_import(hass, _db(hass), msg["url"])
    connection.send_result(msg["id"], draft)


@websocket_api.websocket_command(
    {
        vol.Required("type"): "pantry/unit_add",
        vol.Required("name"): NAME,
        vol.Optional("symbol"): text(50),
    }
)
@websocket_api.async_response
async def ws_unit_add(hass: HomeAssistant, connection, msg: dict) -> None:
    """New count unit from a recipe import; an equivalent existing one (Tasse = Tassen) is reused."""
    unit_id = await _run(hass, inventory.unit_add, msg["name"], msg.get("symbol"))
    connection.send_result(msg["id"], {"id": unit_id})
