"""Backup platform: block DB writes while HA copies the config directory."""

from homeassistant.core import HomeAssistant

from .const import DOMAIN

# Gates taken by async_pre_backup; post only releases these.
_held = []


async def async_pre_backup(hass: HomeAssistant) -> None:
    """Wait (on the event loop) for running writes, then keep new ones waiting."""
    for entry in hass.config_entries.async_loaded_entries(DOMAIN):
        gate = entry.runtime_data.gate
        await gate.acquire()
        _held.append(gate)


async def async_post_backup(hass: HomeAssistant) -> None:
    while _held:
        _held.pop().release()
