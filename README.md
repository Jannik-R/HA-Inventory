# Pantry (Vorrat) for Home Assistant

Food inventory as a Home Assistant custom integration: book items in and out by barcode or name,
track batches with best-before / use-by dates per storage location, see what expires soon,
and get a brand-independent shopping list from minimum stock levels.

> Status: early development (phases 0–7 done: booking, stock and products, expiry view, sensors, minimum stock and shopping list; next: labels). See [docs/PLAN.md](docs/PLAN.md).

## Features

Available:

- Book in by EAN barcode (USB/Bluetooth scanner or phone camera) or by name; product data from Open Food Facts
- Category tree (main category → category → food type) with inherited defaults (unit, location, date type, expiry warning)
- Batches with expiry date, counted per package, spread over multiple storage locations
- Stock overview with search, take-out and batch correction
- Expiry overview with a temporary "expiring soon" threshold; sensors for expired / expiring packages
- Minimum stock per category as an amount in any unit (e.g. "2 kg Nudeln", any brand) and/or a package count; shopping list in the panel and as an HA to-do list; add products or categories by hand (new ones are created on the spot)

Planned:

- Labels per package (QR code), printed via network (optional; e.g. Dymo LabelWriter 450 behind a USB print server such as TP-Link, or CUPS/IPP) without a print dialog or via browser print; scan a label to book out
- Receipt printer (ESC/POS) for the shopping list and later recipes

## Usage

### Bestand (stock and products)

The category tree (only branches with stock, each with its package count), products as leaves
with their total packages and earliest date. Tap a row (arrow on the left) to open it; a product
shows its batches (date, location, packages). The search field (focused, so a
scanner can type an EAN) matches name, brand, EAN, category and location and opens the tree down to all hits;
*Auch Produkte ohne Bestand* (off by default) also lists products with 0 Pkg. (all locations
only), so they can still be edited or deleted; their row opens the edit dialog.
*Alle Lagerorte* filters by location. Expired dates are red, dates within the warning period
(the product's or category's *Warnung vor Ablauf*) orange.

- **Product row**: pencil = change name, brand, EAN, category, content, and the product's own
  defaults (location, date type, warning days) that override the category's. Admins also get a
  bin: deletes the product with its stock and booking history (asks first, naming the stock).
- **Batch row**: minus = take one package out of that batch and location (only there, so you
  look at the batches first); *Rückgängig* books it back in. Pencil = fix this batch at this
  location: date and packages (e.g. a mistyped date; 0 removes it). The date type
  (best before / use by) is set on the product, not per batch. A date that another
  batch of the product already has merges into that batch. The change is logged as a correction.

### Ablauf (expiry)

All batches that are expired (red) or within their warning period (orange), earliest date first,
with the days left ("vor 2 Tagen", "morgen"), location and packages. The warning period is each
product's *Warnung vor Ablauf* (own or inherited). *Warnschwelle* overrides it for all products
while the page is open (e.g. 14 days when planning meals); empty = per product. Nothing is saved.
The minus button takes one package out of that batch, with *Rückgängig* like in *Bestand*.

### Einkauf (shopping list)

The list is shown as the category tree (same order as everywhere). Only rows with something to buy
have a checkbox: a category below its minimum stock, e.g. "Nudeln – 500 g und 2 Pkg. fehlen", or an
item added by hand; the other categories are just the way there. The minimum counts the whole category including its subcategories; a minimum further up
only lists what is missing beyond the minimums below ("weitere 0,2 kg fehlen (beliebig aus der
Kategorie)"), so a category only shows up as an item when something beyond its subcategories is
needed. Products without a content (e.g. 500 g) count for the package minimum only. A ticked item is
struck through and stays in place; a minimum stock item is unticked again by itself as soon as the
missing amount changes (e.g. after booking in only part of it).

*Zur Einkaufsliste hinzufügen* puts something on the list by hand: type a name, pick a matching
product or category (a category means "any of it"), set *Anzahl* (packages) and save. Without a match,
*Neues Produkt „…“ anlegen* creates the product with its category; admins can also create a new
category. Adding the same product or category again adds to its packages. Items added by hand have a
pencil (change the packages) and a bin; ticked ones stay (struck through) until deleted.

The same list is the to-do entity *Einkaufsliste* (`todo.vorrat_einkaufsliste`) in HA's to-do
dashboard and the companion app: ticking works there too; *Eintrag hinzufügen* takes the exact name of
an existing product or category (new ones only in the panel); *Erledigte entfernen* deletes ticked
items added by hand (minimum stock items stay until the stock is there).

### Sensors

The integration adds a device *Vorrat* with two sensors (packages, no polling, updated after every
booking and at midnight):

| Sensor | Value | Attribute `items` |
|---|---|---|
| *Abgelaufen* | packages past their date | name, expires_on, days_left, packages, location per batch |
| *Läuft bald ab* | packages within their warning period | same |

Example: notify when something has expired.

```yaml
triggers:
  - trigger: numeric_state
    entity_id: sensor.vorrat_abgelaufen
    above: 0
actions:
  - action: notify.notify
    data:
      message: >
        Abgelaufen: {{ state_attr('sensor.vorrat_abgelaufen', 'items') | map(attribute='name') | join(', ') }}
```

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

The camera scanner needs HTTPS (or `localhost`) and camera permission. Browsers without a built-in
barcode detector (iPhone, Firefox, Windows) load a bundled decoder on first use; nothing is loaded from external servers.

### Settings (Einstellungen)

- **Kategorien**: tree of main category → category → food type. Each category can set a unit,
  default storage location, expiry type (best before / use by) and warning days; empty fields are
  inherited from the parent category or the global defaults and are shown in grey with their source
  ("von Nudeln"). *Zurücksetzen* removes an own value. Minimum stock is set per category and is not
  inherited: *Mindestmenge* (amount with its own unit, kept when the category's unit changes) and/or
  *Mindestanzahl* (packages); both set = both must be met. See *Einkauf*.
  Tapping a category with subcategories opens it; the plus adds a subcategory, the pencil edits,
  the bin deletes (see below). The parent category is picked in a tree with a filter field.
- Every list row has a pencil (edit) and a bin (delete) icon; forms check entries while you type
  and only allow saving when everything is valid.
- **Lagerorte**: storage locations (Kühlschrank, Gefrierschrank, ...). Deleting a location only hides
  it (its booking history stays); its stock is moved to another location of your choice or booked
  out. Adding the same name again brings it back.
- **Einheiten**: units; a unit can be defined as a multiple of a base unit (1 kg = 1000 g) or count packages.
- **Standards**: the global defaults every category and product falls back to (unit, storage
  location, date type, warning days; initially Packung, none, best before, 7 days).
- Delete questions and "Änderungen verwerfen?" are asked in a dialog; *Abbrechen* is preselected.
- **Deleting something that is still in use** works too. Before asking, the integration runs the
  delete as a dry run (rolled back) and lists everything it would remove or change, grouped (e.g.
  subcategories, products, stock, bookings, shopping list entries, categories pointing to it), with up
  to five names each and a count for the rest. Category: its subcategories and their products (with
  stock and bookings) are deleted (*Alles löschen*). Unit: units defined on it (kg on g) are deleted;
  categories and products only lose it (unit inherited again, minimum amount or package content
  removed). The default unit cannot be deleted (change it under *Standards* first). Deleting a product
  in *Bestand* asks the same way.

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
