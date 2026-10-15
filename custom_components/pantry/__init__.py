"""Pantry: food inventory for Home Assistant."""

from pathlib import Path

from homeassistant.components import frontend, panel_custom
from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import Platform
from homeassistant.core import HomeAssistant
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers.typing import ConfigType

from . import websocket
from .const import DOMAIN, PANEL_URL
from .db import Database

type PantryConfigEntry = ConfigEntry[Database]

CONFIG_SCHEMA = cv.config_entry_only_config_schema(DOMAIN)
PLATFORMS = [Platform.SENSOR, Platform.TODO]


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
    # Bundle mtime, not the integration version: every build must bust the browser cache.
    bundle = Path(__file__).parent / "www" / "pantry-panel.js"
    version = (await hass.async_add_executor_job(bundle.stat)).st_mtime_ns
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
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    return True


async def async_unload_entry(hass: HomeAssistant, entry: PantryConfigEntry) -> bool:
    """Remove the sidebar panel and entities, then close the database."""
    if not await hass.config_entries.async_unload_platforms(entry, PLATFORMS):
        return False
    frontend.async_remove_panel(hass, DOMAIN)
    await entry.runtime_data.async_close()
    return True
