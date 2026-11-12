"""Home Inventory: household inventory for Home Assistant."""

from pathlib import Path

from homeassistant.components import frontend, panel_custom
from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import Platform
from homeassistant.core import HomeAssistant
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers.typing import ConfigType

from . import (
    events,
    llm_api,
    recipe_image,
    services,
    websocket,
    websocket_canning,
    websocket_cooked,
    websocket_diet,
    websocket_emergency,
    websocket_history,
    websocket_label,
    websocket_open,
    websocket_plan,
    websocket_purchase,
    websocket_recipe,
    websocket_shopping,
    websocket_stock,
    websocket_stocktake,
    websocket_transfer,
)
from .const import DOMAIN, EXTERNAL, PANEL_URL, external, modules_of
from .db import Database

type HomeInventoryConfigEntry = ConfigEntry[Database]

CONFIG_SCHEMA = cv.config_entry_only_config_schema(DOMAIN)
PLATFORMS = [Platform.CALENDAR, Platform.SENSOR, Platform.TODO]


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Serve the panel bundle, register websocket commands and services (global, once per HA start)."""
    await hass.http.async_register_static_paths(
        [StaticPathConfig(PANEL_URL, str(Path(__file__).parent / "www"), False)]
    )
    hass.http.register_view(recipe_image.RecipeImageView)
    websocket.async_register(hass)
    websocket_stock.async_register(hass)
    websocket_shopping.async_register(hass)
    websocket_label.async_register(hass)
    websocket_recipe.async_register(hass)
    websocket_plan.async_register(hass)
    websocket_emergency.async_register(hass)
    websocket_canning.async_register(hass)
    websocket_cooked.async_register(hass)
    websocket_diet.async_register(hass)
    websocket_stocktake.async_register(hass)
    websocket_history.async_register(hass)
    websocket_transfer.async_register(hass)
    websocket_open.async_register(hass)
    websocket_purchase.async_register(hass)
    services.async_register(hass)
    return True


async def async_setup_entry(hass: HomeAssistant, entry: HomeInventoryConfigEntry) -> bool:
    """Open the database and add the sidebar panel."""
    db = entry.runtime_data = Database(hass, hass.config.path("home_inventory.db"))
    modules = modules_of(entry.options)
    await db.async_open(freezing="frozen" in modules, diet="diet" in modules)
    try:
        # Bundle mtime, not the integration version: every build must bust the browser cache.
        bundle = Path(__file__).parent / "www" / "home-inventory-panel.js"
        version = (await hass.async_add_executor_job(bundle.stat)).st_mtime_ns
        await panel_custom.async_register_panel(
            hass,
            frontend_url_path=DOMAIN,
            webcomponent_name="home-inventory-panel",
            # HA cannot translate custom panel titles: the system language at setup decides
            sidebar_title="Vorrat" if hass.config.language.startswith("de") else "Home Inventory",
            sidebar_icon="mdi:fridge-outline",
            module_url=f"{PANEL_URL}/home-inventory-panel.js?v={version}",
            require_admin=False,
            config={
                "modules": modules_of(entry.options),
                "external": {key: external(entry.options, key) for key in EXTERNAL},
            },
        )
        await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
        await events.async_setup(hass, entry)
        entry.async_on_unload(llm_api.async_register(hass, entry.options))
    except BaseException:  # a later step failed: do not leave the DB connection open
        frontend.async_remove_panel(hass, DOMAIN, warn_if_unknown=False)
        await db.async_close()
        raise
    return True


async def async_unload_entry(hass: HomeAssistant, entry: HomeInventoryConfigEntry) -> bool:
    """Remove the sidebar panel and entities, then close the database."""
    if not await hass.config_entries.async_unload_platforms(entry, PLATFORMS):
        return False
    frontend.async_remove_panel(hass, DOMAIN)
    await entry.runtime_data.async_close()
    return True
