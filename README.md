# Pantry (Vorrat) for Home Assistant

Food inventory as a Home Assistant custom integration: book items in and out by barcode or name,
track batches with best-before / use-by dates per storage location, see what expires soon,
and get a brand-independent shopping list from minimum stock levels.

> Status: planning. Nothing is installable yet. See [docs/PLAN.md](docs/PLAN.md).

## Planned features

- Book in by EAN barcode (USB/Bluetooth scanner or phone camera) or by name; product data from Open Food Facts
- Category tree (main category → category → food type) with inherited defaults (unit, location, expiry warning)
- Batches with expiry date, counted per package, spread over multiple storage locations
- Labels per package (QR code), printed via network (optional, CUPS/IPP, e.g. Dymo LabelWriter 450) without a print dialog or via browser print; scan a label to book out
- Stock overview with search
- Expiry overview with configurable "expiring soon" threshold
- Minimum stock per category in any unit (e.g. "2 kg Nudeln", any brand) and a shopping list (HA to-do entity)

## Installation

TBD (HACS custom repository).

## Development

Requires Docker and Node.js LTS. Optional: `pip install ruff` (auto-formatting in Claude Code).

```bash
docker compose -f dev/docker-compose.yml up -d homeassistant
```

Opens Home Assistant on http://localhost:8123 with the integration mounted from
`custom_components/pantry`. All dev HA data is stored in `dev/config/` and is git-ignored.
The camera barcode scanner needs HTTPS or `localhost`.

Backend tests run in a container with the same image as HA:

```bash
docker compose -f dev/docker-compose.yml run --rm test
```

### Claude Code helpers

- `.claude/skills/ha-dev`: commands for dev HA, logs, tests, build.
- `.mcp.json`: `context7` (library docs) and `ha-dev` (MCP access to the dev HA).
  For `ha-dev`: in the dev HA add the integration *Model Context Protocol Server*,
  create a long-lived access token (profile → security) and set it as environment
  variable `HA_DEV_TOKEN` before starting Claude Code. Never commit the token.

## License

[MIT](LICENSE)
