"""Websocket commands for recipes: list, availability, save, import from a URL, new product type / unit."""

from __future__ import annotations

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant

from . import ai, inventory, recipe_fetch
from .websocket_stock import _NEW_PRODUCT
from .ws_common import db_of, run, translated
from .ws_validate import CANNING_MINUTES, CANNING_TEMP, HTTP_URL, ID, NAME, NULL_ID, POSITIVE, text

SERVINGS = vol.All(int, vol.Range(min=1, max=99))
INGREDIENT = {
    vol.Optional("category_id"): NULL_ID,
    vol.Optional("amount"): vol.Any(None, POSITIVE),
    vol.Optional("unit_id"): NULL_ID,
    vol.Optional("text"): text(200),
    vol.Optional("note"): vol.Any(None, text(200)),
    vol.Optional("optional"): bool,
    vol.Optional("skip_stock"): bool,
    # imported rows: the parsed text, so the save can learn the chosen category
    vol.Optional("source_text"): vol.Any(None, text(200)),
}

STEP = {vol.Required("text"): text(2000), vol.Optional("section"): vol.Any(None, text(100))}


def async_register(hass: HomeAssistant) -> None:
    for command in (
        ws_recipes,
        ws_recipe_availability,
        ws_recipe_save,
        ws_recipe_import,
        ws_recipe_ai_check,
        ws_shopping_recipes,
        ws_shopping_recipe_set,
        ws_shopping_recipe_remove,
        ws_shopping_recipe_done,
        ws_product_type_add,
        ws_unit_add,
    ):
        websocket_api.async_register_command(hass, command)


@websocket_api.websocket_command({vol.Required("type"): "pantry/recipes"})
@websocket_api.async_response
async def ws_recipes(hass: HomeAssistant, connection, msg: dict) -> None:
    connection.send_result(msg["id"], await run(hass, inventory.recipes))


@websocket_api.websocket_command(
    {
        vol.Required("type"): "pantry/recipe_availability",
        vol.Required("recipe_id"): ID,
        vol.Required("servings"): SERVINGS,
    }
)
@websocket_api.async_response
async def ws_recipe_availability(hass: HomeAssistant, connection, msg: dict) -> None:
    result = await run(hass, inventory.recipe_availability, msg["recipe_id"], msg["servings"])
    connection.send_result(msg["id"], result)


@websocket_api.websocket_command(
    {
        vol.Required("type"): "pantry/recipe_save",
        vol.Required("data"): {
            vol.Optional("id"): ID,
            vol.Required("name"): NAME,
            vol.Required("servings"): SERVINGS,
            vol.Optional("instructions"): vol.Any(None, text(20000)),
            vol.Optional("steps"): vol.All([STEP], vol.Length(max=100)),
            vol.Optional("source_url"): vol.Any(None, HTTP_URL),
            vol.Optional("image_url"): vol.Any(None, HTTP_URL),
            # a canning recipe makes this product (existing or new); temperature and minutes
            # both or none (DB CHECKs as well)
            vol.Exclusive("canning_product_id", "canning_product"): NULL_ID,
            vol.Exclusive("canning_product", "canning_product"): _NEW_PRODUCT,
            vol.Inclusive("canning_temp", "canning"): vol.Any(None, CANNING_TEMP),
            vol.Inclusive("canning_minutes", "canning"): vol.Any(None, CANNING_MINUTES),
            vol.Required("ingredients"): vol.All([INGREDIENT], vol.Length(max=100)),
        },
    }
)
@websocket_api.async_response
async def ws_recipe_save(hass: HomeAssistant, connection, msg: dict) -> None:
    connection.send_result(msg["id"], {"id": await run(hass, inventory.save_recipe, msg["data"])})


@websocket_api.websocket_command({vol.Required("type"): "pantry/shopping_recipes"})
@websocket_api.async_response
async def ws_shopping_recipes(hass: HomeAssistant, connection, msg: dict) -> None:
    connection.send_result(msg["id"], await run(hass, inventory.shopping_recipes))


@websocket_api.websocket_command(
    {
        vol.Required("type"): "pantry/shopping_recipe_set",
        vol.Required("recipe_id"): ID,
        vol.Required("servings"): SERVINGS,
        vol.Optional("optional", default=[]): [ID],
    }
)
@websocket_api.async_response
async def ws_shopping_recipe_set(hass: HomeAssistant, connection, msg: dict) -> None:
    """Put a recipe on the shopping list; open to any user like the list itself."""
    args = (msg["recipe_id"], msg["servings"], msg["optional"])
    await run(hass, inventory.set_shopping_recipe, *args)
    connection.send_result(msg["id"])


@websocket_api.websocket_command(
    {vol.Required("type"): "pantry/shopping_recipe_remove", vol.Required("recipe_id"): ID}
)
@websocket_api.async_response
async def ws_shopping_recipe_remove(hass: HomeAssistant, connection, msg: dict) -> None:
    await run(hass, inventory.remove_shopping_recipe, msg["recipe_id"])
    connection.send_result(msg["id"])


@websocket_api.websocket_command(
    {
        vol.Required("type"): "pantry/shopping_recipe_done",
        vol.Required("key"): vol.Match(r"^r\d+-\d*$"),
        vol.Required("done"): bool,
    }
)
@websocket_api.async_response
async def ws_shopping_recipe_done(hass: HomeAssistant, connection, msg: dict) -> None:
    await run(hass, inventory.set_recipe_done, msg["key"], msg["done"])
    connection.send_result(msg["id"])


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
    connection.send_result(msg["id"], {"id": await run(hass, inventory.save, "category", data)})


@websocket_api.websocket_command(
    {vol.Required("type"): "pantry/recipe_import", vol.Required("url"): HTTP_URL}
)
@websocket_api.async_response
async def ws_recipe_import(hass: HomeAssistant, connection, msg: dict) -> None:
    """Recipe draft from a web page (not saved)."""
    with translated():
        draft = await recipe_fetch.async_import(hass, db_of(hass), msg["url"])
    connection.send_result(msg["id"], draft)


# The draft only goes into the AI prompt: bounded, extra keys dropped.
_DRAFT_INGREDIENT = vol.Schema(
    {
        **INGREDIENT,
        vol.Optional("line"): vol.Any(None, text(500)),
        vol.Optional("learned"): bool,
    },
    extra=vol.REMOVE_EXTRA,
)


@websocket_api.websocket_command(
    {
        vol.Required("type"): "pantry/recipe_ai_check",
        vol.Required("draft"): vol.Schema(
            {
                vol.Required("name"): NAME,
                vol.Required("servings"): SERVINGS,
                vol.Required("steps"): vol.All([STEP], vol.Length(max=100)),
                vol.Required("ingredients"): vol.All([_DRAFT_INGREDIENT], vol.Length(max=100)),
            },
            extra=vol.REMOVE_EXTRA,
        ),
    }
)
@websocket_api.async_response
async def ws_recipe_ai_check(hass: HomeAssistant, connection, msg: dict) -> None:
    """Check an import draft with the AI set up in the options: {status: off | ok | changes}."""
    connection.send_result(msg["id"], await ai.async_check_recipe(hass, msg["draft"]))


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
    unit_id = await run(hass, inventory.unit_add, msg["name"], msg.get("symbol"))
    connection.send_result(msg["id"], {"id": unit_id})
