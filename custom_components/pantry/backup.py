"""Backup platform: block DB writes while HA copies the config directory."""

from homeassistant.core import HomeAssistant

from .const import DOMAIN

# Locks taken by async_pre_backup; post only releases these, never a lock held by a running write.
_held = []


async def async_pre_backup(hass: HomeAssistant) -> None:
    for entry in hass.config_entries.async_loaded_entries(DOMAIN):
        lock = entry.runtime_data.lock
        await hass.async_add_executor_job(lock.acquire)
        _held.append(lock)


async def async_post_backup(hass: HomeAssistant) -> None:
    while _held:
        _held.pop().release()
