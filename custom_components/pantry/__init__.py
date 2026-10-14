"""Pantry: food inventory for Home Assistant."""

from pathlib import Path

from homeassistant.components import frontend, panel_custom
from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers.typing import ConfigType
from homeassistant.loader import async_get_integration

from . import websocket
from .const import DOMAIN, PANEL_URL
from .db import Database

type PantryConfigEntry = ConfigEntry[Database]

CONFIG_SCHEMA = cv.config_entry_only_config_schema(DOMAIN)


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Serve the panel bundle and register websocket commands (both global, once per HA start)."""
    await hass.http.async_register_static_paths(
        [StaticPathConfig(PANEL_URL, str(Path(__file__).parent / "www"), False)]
    )
    websocket.async_register(hass)
    return True


async def async_setup_entry(hass: HomeAssistant, entry: PantryConfigEntry) -> bool:
    """Open the database and add the sidebar panel."""
    entry.runtime_data = Database(hass, hass.config.path("pantry.db"))
    await entry.runtime_data.async_open()
    version = (await async_get_integration(hass, DOMAIN)).version
    await panel_custom.async_register_panel(
        hass,
        frontend_url_path=DOMAIN,
        webcomponent_name="pantry-panel",
        # shortcut: HA cannot translate custom panel titles; German only until it matters.
        sidebar_title="Vorrat",
        sidebar_icon="mdi:fridge-outline",
        module_url=f"{PANEL_URL}/pantry-panel.js?v={version}",
        require_admin=False,
    )
    return True


async def async_unload_entry(hass: HomeAssistant, entry: PantryConfigEntry) -> bool:
    """Remove the sidebar panel and close the database."""
    frontend.async_remove_panel(hass, DOMAIN)
    await entry.runtime_data.async_close()
    return True
