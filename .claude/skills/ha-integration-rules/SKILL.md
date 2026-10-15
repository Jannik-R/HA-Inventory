---
name: ha-integration-rules
description: Condensed Home Assistant integration rules as applied in this repo - manifest, config flow, setup/unload, panel, translations, services, websocket, entities, tests, hassfest/HACS. Use before adding or changing anything in custom_components/pantry instead of looking up HA developer docs.
---

Applies to `custom_components/pantry/`. Business logic stays in the `inventory` package (see CLAUDE.md).

## Manifest
- `version` required (custom integration). Bump it for every release; it also busts the panel cache (`?v=`).
- `single_config_entry: true` → HA aborts a second flow with `single_instance_allowed`; no code needed.
- New HA dependency (another integration) → `dependencies`. Python package → `requirements` with pinned version, only with a strong reason.
- Keys sorted: domain, name, then alphabetical (hassfest checks).

## Setup lifecycle
- `async_setup`: once per HA start. Things that cannot be undone (static HTTP paths) go here. Needs `CONFIG_SCHEMA = cv.config_entry_only_config_schema(DOMAIN)`.
- `async_setup_entry`: everything removable (panel, websocket handlers are global → register in `async_setup`, services → `async_setup`).
- Runtime objects on `entry.runtime_data` (typed `type PantryConfigEntry = ConfigEntry[Pantry]`), never `hass.data[DOMAIN]`.
- `async_unload_entry` must undo setup_entry (panel removal, `async_unload_platforms`).
- Options: `OptionsFlow` + `entry.add_update_listener` → reload.

## Async / I/O
- Never block the event loop: sqlite, file I/O, Pillow → `await hass.async_add_executor_job(fn, *args)`.
- HTTP: `async_get_clientsession(hass)`, timeouts set, set a User-Agent for Open Food Facts.

## Panel
- Static files: `hass.http.async_register_static_paths([StaticPathConfig(url, path, cache_headers)])`.
- Panel: `panel_custom.async_register_panel(...)`, remove with `frontend.async_remove_panel(hass, DOMAIN)`.

## Websocket API (panel ↔ backend)
```python
@websocket_api.websocket_command({vol.Required("type"): "pantry/xyz", vol.Required("id_"): int})
@websocket_api.async_response
async def ws_xyz(hass, connection, msg):
    connection.send_result(msg["id"], result)
```
Register in `async_setup` with `websocket_api.async_register_command(hass, ws_xyz)`. Validate all input with voluptuous. Errors: `connection.send_error(msg["id"], code, message)`.

## Services
- Register in `async_setup` (not setup_entry). Schema with voluptuous, `services.yaml` for fields, names/descriptions in `strings.json` → `services`.
- Raise `ServiceValidationError` (user input) / `HomeAssistantError` (runtime) with `translation_domain=DOMAIN, translation_key=...`; texts in `strings.json` → `exceptions`.

## Entities
- `_attr_has_entity_name = True`, `_attr_translation_key`, `_attr_unique_id` = `f"{entry.entry_id}_<key>"`.
- Names via `strings.json` → `entity.<platform>.<key>.name`.
- Push updates (`async_write_ha_state`) after bookings; no polling (`_attr_should_poll = False`).

## Translations
- `strings.json` is the source; `translations/en.json` = resolved copy (references like `[%key:common::...%]` resolved); `translations/de.json` German. Keep all three in sync.
- Only allowed sections: `config`, `options`, `services`, `entity`, `exceptions`, `issues`, `selector`. Anything else fails hassfest.

## Tests
- `pytest-homeassistant-custom-component`, fixture `enable_custom_integrations` is autouse in `tests/conftest.py`.
- Set up `http` first when the panel is involved: `await async_setup_component(hass, "http", {})`.
- Create entries via the flow or `MockConfigEntry(domain=DOMAIN).add_to_hass(hass)` + `hass.config_entries.async_setup(entry.entry_id)`.
- Run: see skill `ha-dev`.

## CI gates
- hassfest (manifest, translations schema), HACS action (`hacs.json`, structure), pytest, committed bundle = built bundle.
