# Pantry (Vorrat) for Home Assistant

Food inventory as a Home Assistant custom integration: book items in and out by barcode or name,
track batches with best-before / use-by dates per storage location, see what expires soon,
and get a brand-independent shopping list from minimum stock levels.

> Status: early development (Phase 5: database, inventory logic, Open Food Facts lookup, settings, booking in/out and stock overview; expiry view follows). See [docs/PLAN.md](docs/PLAN.md).

## Planned features

- Book in by EAN barcode (USB/Bluetooth scanner or phone camera) or by name; product data from Open Food Facts
- Category tree (main category → category → food type) with inherited defaults (unit, location, expiry warning)
- Batches with expiry date, counted per package, spread over multiple storage locations
- Labels per package (QR code), printed via network (optional, CUPS/IPP, e.g. Dymo LabelWriter 450) without a print dialog or via browser print; scan a label to book out
- Stock overview with search
- Expiry overview with configurable "expiring soon" threshold
- Minimum stock per category in any unit (e.g. "2 kg Nudeln", any brand) and a shopping list (HA to-do entity)

## Usage

### Bestand (stock overview)

The category tree (only branches with stock, each with its package count), products as leaves
with their total packages and earliest date. Tap a row (arrow on the left) to open it; a product
shows its batches (date, location, packages). The search field (focused, so a
scanner can type an EAN) matches name, brand, EAN, category and location and opens the tree down to all hits;
*Alle Lagerorte* filters by location. Expired dates are red, dates within the warning period
(the product's or category's *Warnung vor Ablauf*) orange. The minus button on a batch row takes one package out of
that batch and location (only there, so you look at the batches first); *Rückgängig* books it
back in.

### Einbuchen / Auslagern (book in / out)

One input field, focused when the tab opens: scan with a USB/Bluetooth barcode scanner (it types
the EAN and Enter), tap *Kamera* to scan with the phone camera, or type a name and press Enter.

- **Einbuchen** ("Produkt zubuchen"): expiry date (the label names the product's date type, e.g.
  "Ablaufdatum (Mindesthaltbarkeit)"; leave it empty for items without one), packages and location.
  The location defaults to the product's or category's default (shown in grey as
  "Geerbt: … (von Nudeln)"; without one the last used one is used); another choice applies to this
  booking only, *Zurücksetzen* returns to the default. A new product also shows its name, brand,
  category and content; *Wird Standardlager* (on by default) keeps the chosen location as its default.
  An unknown EAN is looked up on Open Food Facts (name, brand, content - drained weight for jars and
  cans - and a suggested category; without OFF categories the category comes from keywords in the
  name or from similar saved products). A name search lists local products; *Online suchen* searches
  Open Food Facts, *Neues Produkt* creates one by hand.
- **Auslagern**: pick the product; by default the packages with the earliest date are taken first,
  or choose one batch and location.

### Produkte

All saved products with their stock, filterable. Tap one to change name, brand, EAN, category,
content, and its own defaults (location, date type, warning days) that override the category's.
Admins can delete a product (bin icon in the list); its stock and booking history
are deleted with it.

The camera scanner needs HTTPS (or `localhost`) and camera permission. Browsers without a built-in
barcode detector (iPhone, Firefox, Windows) load a bundled decoder on first use; nothing is loaded from external servers.

### Settings (Einstellungen)

- **Kategorien**: tree of main category → category → food type. Each category can set a unit,
  default storage location, expiry type (best before / use by) and warning days; empty fields are
  inherited from the parent category or the global defaults and are shown in grey with their source
  ("von Nudeln"). *Zurücksetzen* removes an own value. Minimum stock is set per category and is not inherited.
  Tapping a category with subcategories opens it; the plus adds a subcategory, the pencil edits,
  the bin deletes (only when the category is not in use). The parent category is picked in a tree with a filter field.
- Every list row has a pencil (edit) and a bin (delete) icon; forms check entries while you type
  and only allow saving when everything is valid.
- **Lagerorte**: storage locations (Kühlschrank, Gefrierschrank, ...).
- **Einheiten**: units; a unit can be defined as a multiple of a base unit (1 kg = 1000 g) or count packages.

## Installation

HACS: add this repository as a custom repository (category *Integration*), install *Pantry (Vorrat)*, restart Home Assistant.

Manual: copy `custom_components/pantry` into your `config/custom_components/` and restart Home Assistant.

Then: *Settings → Devices & services → Add integration → Pantry*. The panel *Vorrat* appears in the sidebar.

## Development

Requires Docker (running) and Node.js LTS. Optional: `pip install ruff` (auto-formatting in Claude Code).

```bash
docker compose -f dev/docker-compose.yml up -d homeassistant
```

Opens Home Assistant on http://localhost:8123 with the integration mounted from
`custom_components/pantry`. All dev HA data is stored in `dev/config/` and is git-ignored.
The dev HA is reachable only from this machine (port bound to `127.0.0.1`) and logs in without a
password (`trusted_networks` in `dev/configuration.yaml`), so browser tests need no credentials.
Never use this configuration for a real installation.
The camera barcode scanner needs HTTPS or `localhost`.

Panel source is in `frontend/` (Lit + TypeScript). Build into `custom_components/pantry/www/` (the built file is committed):

```bash
cd frontend && npm install && npm run build
```

Browser tests (Playwright, local only, against the running dev HA; uses the installed Edge, set
`PW_CHANNEL=chrome` for Chrome). A setup step logs in once and keeps the session in
`frontend/e2e/.auth/` (git-ignored). Tests create their own data and remove it afterwards:

```bash
cd frontend && npm run test:e2e
```

Backend tests run in a container with the same image as HA:

```bash
docker compose -f dev/docker-compose.yml run --rm test
```

### Claude Code helpers

- `.claude/skills/ha-dev`: commands for dev HA, logs, tests, build.
- `.claude/skills/ha-integration-rules`: condensed HA integration rules used in this repo.
- `.claude/skills/off-api`: Open Food Facts endpoints, limits and the seed category tag check.
- `.claude/skills/ui-review`: check a panel view in the dev HA browser (phone width, light/dark) against the UI rules.
- `.mcp.json`: `context7` (library docs) and `ha-dev` (MCP access to the dev HA).
  For `ha-dev`: in the dev HA add the integration *Model Context Protocol Server*,
  create a long-lived access token (profile → security) and set it as environment
  variable `HA_DEV_TOKEN` before starting Claude Code. Never commit the token.

## License

[MIT](LICENSE)
