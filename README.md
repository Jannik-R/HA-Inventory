# Pantry (Vorrat) for Home Assistant

Food inventory as a Home Assistant custom integration: book items in and out by barcode or name,
track batches with best-before / use-by dates per storage location, see what expires soon,
and get a brand-independent shopping list from minimum stock levels.

> Status: early development, first release 0.1.0 (booking, stock and products, expiry view, sensors, minimum stock and shopping list, labels, services, recipes). Changes: [CHANGELOG.md](CHANGELOG.md). See [docs/PLAN.md](docs/PLAN.md).

## Features

Available:

- Book in by EAN barcode (USB/Bluetooth scanner or phone camera) or by name; product data from Open Food Facts
- Category tree (main category → category → Produktart, many seeded) with inherited defaults (unit, location, date type, expiry warning)
- Batches with expiry date, counted per package, spread over multiple storage locations
- Stock overview with search, take-out and batch correction
- Expiry overview with a temporary "expiring soon" threshold; sensors for expired / expiring packages
- Labels (QR code of product + expiry date), printed on a network label printer (Dymo LabelWriter 450 behind a USB print server) or through the browser; scan a label to book out
- Services for automations (hardware scanners, NFC tags, ESPHome): book in / out by barcode or label code, print labels
- Recipe database with ingredients matched to categories: see what is in stock, scale the servings; import a recipe from a URL (Chefkoch, Mealie, Tandoor and most recipe sites)
- Minimum stock per category as an amount in any unit (e.g. "2 kg Nudeln", any brand) and/or a package count; shopping list in the panel and as an HA to-do list; add products or categories by hand (new ones are created on the spot)

Planned:

- Receipt printer (ESC/POS) for the shopping list and later recipes
- Shopping by recipes, week planner (also as HA calendar), shopping list from the plan, recipe suggestions for expiring items
- Moving a whole storage location, opened packages with a shorter shelf life, AI interface (Assist / MCP)

Order and details: [docs/PLAN.md](docs/PLAN.md) section 6.

## Usage

Labels with a dotted underline (e.g. *Mindestanzahl*, *Datumsart*, *Nicht gegen den Vorrat prüfen*)
explain the field in a tooltip on mouse hover; icon buttons (edit, delete, open/close) name their
action the same way. Touch screens do not show tooltips.

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
  defaults (location, date type, warning days) that override the category's, and its own
  *Mindestanzahl* (optional, packages; also when creating it on *Einbuchen*; below it the product goes on the shopping list). Admins also get a
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
needed. A product with its own *Mindestanzahl* (set on *Bestand*) is listed by itself
("Barilla · 2 Pkg. fehlen") below its category, and what it lacks counts toward its categories'
minimums too. Products without a content (e.g. 500 g) count for the package minimum only. A ticked item is
struck through and stays in place; a minimum stock item is unticked again by itself as soon as the
missing amount changes (e.g. after booking in only part of it).
A count unit (*Stück*) uses the package content, so a 10er pack of eggs is 10 Stück, for the minimum stock too.

*Zur Einkaufsliste hinzufügen* puts something on the list by hand: type a name, pick a matching
product or category (a category means "any of it"), set *Anzahl* (packages) and save. Without a match,
*Neues Produkt „…“ anlegen* creates the product with its category; admins can also create a new
category. Adding the same product or category again adds to its packages. Items added by hand have a
pencil (change the packages) and a bin; ticked ones stay (struck through) until deleted.

The same list is the to-do entity *Einkaufsliste* (`todo.vorrat_einkaufsliste`) in HA's to-do
dashboard and the companion app: ticking works there too; *Eintrag hinzufügen* takes the exact name of
an existing product or category (new ones only in the panel); *Erledigte entfernen* deletes ticked
items added by hand (minimum stock items stay until the stock is there).

### Rezepte (recipes)

The tab lists all recipes by name with "5 von 7 vorhanden · 4 Portionen". The search field (focused on
open) finds recipes by name and by ingredient text. A click on a row opens it: ingredients with
their status, instructions, source link and image. *Portionen* in the open row scales the amounts;
this is only shown, never saved.

An ingredient is a *Produktart* (e.g. Tomatenmark) or a more general category (e.g. Nudeln; any product in it, including subcategories, counts), plus an optional *Hinweis* (e.g. "fein gewürfelt"), and has an
optional amount with a unit, or none ("optional" ingredients and those marked *Nicht gegen den Vorrat prüfen*, e.g. Salz or Wasser, are not counted in the summary; the latter show "nicht geprüft" instead of a status and are never put on a shopping list).
Status: *vorhanden*, *teilweise: 50 von 200 g*, *fehlt 150 g*, *Menge unbekannt* (stock has products
without a content in a matching unit), *keine Zutat zugeordnet* (counts as not available). Without an
amount, any package in the category is enough. Cooking does not book anything out: take the
ingredients out in *Auslagern* as usual.

*Rezept hinzufügen* and the pencil are open to every user: name, portions, instructions, links and the ingredient rows
(Produktart or category, *Hinweis*, amount and unit together or neither, optional, *Nicht gegen den Vorrat prüfen*). The *Zutat* field is a search: type a Produktart or category name, or a product name ("Mutti" finds Tomatenmark, shown as "über Mutti Tomatenmark"). If nothing fits, *Neue Produktart „…“ anlegen* asks for the parent category and creates it right there. Picking a category fills an empty
unit with its unit. Only admins can delete a recipe (the bin).
Deleting a category or unit that recipes use asks first and lists those recipes. The ingredients stay: without the category they show *keine Zutat zugeordnet*; deleting a unit also clears their amount (amount and unit only go together).

Every unit select in a recipe ingredient row has *Neue Einheit …*: any user can add a unit there. Spelling variants (Tasse, Tassen, tasse) map to one unit; an existing match is reused instead of a duplicate.

*Importieren* on the tab reads a recipe from a URL. Home Assistant loads that page only when you click (15 s timeout, HTML up to 5 MB, http or https, LAN addresses too) and reads the schema.org recipe data that most recipe sites publish. Nothing is saved yet: the recipe dialog opens prefilled with name, portions, instructions, source link, image and ingredients. Each ingredient shows its original line ("Original: …") and a suggested Produktart or category; check them before saving. Pages without recipe data show "Auf dieser Seite wurde kein Rezept gefunden". Instagram posts and free text need the AI interface (planned, phase 19).

Imported ingredient lines are read in German: fractions (½, 1/2), ranges take the upper value (2-3 becomes 3), "Zehe/n", units by name, symbol or plural, an amount without unit is Stück, text after a comma or in brackets becomes the *Hinweis* (also "1 TL, gestr. Salz" and "Mehl für die Form"), Eigelb / Eiweiß count as Ei with the part as *Hinweis*, "n. B." / "nach Belieben" means no amount, "evtl." means optional.

Lines without an amount like "Salz und Pfeffer" become one ingredient each; a size word (klein, groß, mittel) goes into the note. An unknown unit (e.g. "1 ½ Tassen Mehl") shows *Einheit „Tasse“ ist unbekannt* on that row: create it with *Anlegen* (the name is editable) or pick an existing unit. Saving stays blocked until every such row is decided.

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
  If no category fits, type its name in the category filter and choose *„…“ neu anlegen*, then the
  parent category; it is created right there (also when editing a product on *Bestand*).
  An unknown EAN is looked up on Open Food Facts (name, brand, content - drained weight for jars and
  cans - and a suggested category; without OFF categories the category comes from keywords in the
  name or from similar saved products). A name search lists local products; *Online suchen* searches
  Open Food Facts, *Neues Produkt* creates one by hand.
- **Auslagern**: pick the product; by default the packages with the earliest date are taken first,
  or choose one batch and location. After booking out (also by scanning a label), *Rückgängig*
  next to the message puts exactly those packages back into their batch and location.
  Each booking out can be undone once; a storage location deactivated meanwhile is reactivated.

The camera scanner needs HTTPS (or `localhost`) and camera permission. Browsers without a built-in
barcode detector (iPhone, Firefox, Windows) load a bundled decoder on first use; nothing is loaded from external servers.

### Etiketten (labels)

Each label shows a QR code (`PTRY:<EAN>:<date>`, or `PTRY:P<product id>:<date>` without EAN), product name, brand and expiry date.
Printing is a checkbox *Etiketten drucken* on *Einbuchen* (its default is an option), and a tag
button on every batch row in *Bestand* opens a dialog to print 1 to 20 labels for that batch (booking in prints at most 20 as well).

- **Label printer setup** (this is the label printer; a receipt printer will be a separate setting later).
  In Home Assistant open *Settings > Devices & services > Pantry > Configure*. Step 1: choose the
  *Modell des Etikettendruckers*. Step 2: the settings of that model, label size in mm and whether
  to print on book-in. Models:
  - *Dymo LabelWriter 450 / 4xx* (raw port 9100, e.g. via a USB print server such as TP-Link with a
    fixed IP and raw printing enabled): enter the printer as `host` or `host:port` (port defaults
    to 9100). Width 10 to 57 mm, height 10 to 200 mm (default 57 x 32). The 450 never prints the last
    ~3 mm of a 57 x 32 label, so that space stays blank. *Testetikett drucken* sends one label when you
    save; if the printer is not reachable the form says so.
  - *Kein Netzwerkdrucker*: the browser print dialog opens with one page per label (choose the
    label printer there; the page size is the label size, 10 to 200 mm).
- **Many labels**: printing more than 2 labels at once (after book-in or in the reprint dialog) asks
  "n Etiketten drucken?" first; cancelling prints nothing (the booking itself is kept).
- **Scan to book out**: type or scan a label (scanner or camera) into the input of *Einbuchen* or
  *Auslagern*; one package of that batch is booked out, from the location chosen like in a normal
  booking out. Labels are not single-use: they name the batch, not one package.

### Services (automations)

All three return a response (use `response_variable` in a script or automation). Errors (unknown
barcode, unknown location, not enough stock, printer not reachable) make the action fail with a message.

| Service | Fields | Response |
|---|---|---|
| `pantry.book_in` | `code` (EAN of a product that already exists; new products are created once in the panel, where the category is chosen), `packages` (default 1), `expires_on` (date, optional), `location` (name, optional; default: the product's default location) | `product_id`, `batch_id`, `name` |
| `pantry.book_out` | `code` (EAN, or a label code `PTRY:…`), `packages` (default 1), `location` (name, optional) | `taken` (batch, location, packages, booking id per row), `name` (label code: also `location`) |
| `pantry.print_labels` | `batch_id` (from `book_in`), `count` (1 to 20, default 1) | `printed` |

- **book_out** with an EAN takes the earliest expiry first (packages without a date last), like the panel.
  A label code takes one package of the batch it names, from wherever that batch is (`packages` must be 1, no `location`).
- **print_labels** needs a network label printer (see *Etiketten*); with *Kein Netzwerkdrucker* it fails,
  since a service has no browser to print from.
- Location names are matched ignoring case. Bookings made by a service are logged with source `service`
  (label codes: `label`) and the calling user, if any.

Example: book in with a scanner that sends the barcode as an event, then print one label per package:

```yaml
actions:
  - action: pantry.book_in
    data:
      code: "{{ trigger.event.data.code }}"
      packages: 2
      expires_on: "2027-01-31"
      location: Kühlschrank
    response_variable: booked
  - action: pantry.print_labels
    data:
      batch_id: "{{ booked.batch_id }}"
      count: 2
```

### Settings (Einstellungen)

- **Kategorien**: tree of main category → category → Produktart (product type, e.g. Tomatenmark;
  about 320 are seeded, any user can add one from a recipe). Each category can set a unit,
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
- **Einheiten**: units; a unit can be defined as a multiple of a base unit (1 kg = 1000 g) or count packages. Seeded: Stück, Packung, g, kg, ml, l and recipe units (Bund, Prise, Messerspitze, EL = 15 ml, TL = 5 ml, cl = 10 ml, dl = 100 ml, Zehe, Scheibe, Stange, Blatt, Dose, Glas, Becher, Handvoll, Zweig, Würfel, Beutel, Schuss, Kopf, Stiel, Kugel, Flasche, Tasse, Spritzer, Tropfen). A counting unit that does not convert counts packages, so "1 TL Salz" is available when any salt is in stock.
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

Requires Home Assistant 2026.10.1 or newer.

HACS (only once the repository is public; HACS cannot install from private repositories): add this repository as a custom repository (category *Integration*), install *Pantry (Vorrat)*, restart Home Assistant. Versions are the GitHub releases.

Manual: download the release (or clone the repository), copy `custom_components/pantry` into your `config/custom_components/` and restart Home Assistant.

Then: *Settings → Devices & services → Add integration → Pantry*. The panel *Vorrat* appears in the sidebar.

## Development

Requires Docker (running) and Node.js LTS. Python lint and format: ruff (config in `pyproject.toml`, checked in CI; command in CLAUDE.md). CI also pins the Home Assistant and tool versions; Dependabot opens weekly update PRs.

```bash
docker compose -f dev/docker-compose.yml up -d homeassistant
```

Opens Home Assistant on http://localhost:8123 with the integration mounted from
`custom_components/pantry`. All dev HA data is stored in `dev/config/` and is git-ignored.
The dev HA is reachable only from this machine (port bound to `127.0.0.1`) and logs in without a
password (`trusted_networks` in `dev/configuration.yaml`), so browser tests need no credentials.
Never use this configuration for a real installation.
The camera barcode scanner needs HTTPS or `localhost`.

**Phone tests (camera over HTTPS):** an HTTPS reverse proxy on another host (with WebSockets enabled)
forwards to `http://<this PC>:8124`, served by the `proxy` service:

```bash
docker compose -f dev/docker-compose.yml --profile proxy up -d
```

Requests through port 8124 always need the HA login (the proxy sets a fixed untrusted client
address; Docker Desktop would otherwise show every LAN client as the trusted gateway). HA keeps
its HTTP settings in storage, not in YAML: set *use X-Forwarded-For* and the trusted proxy
`10.123.45.3` once (Settings › System › Network, or `dev/config/.storage/http`). Stop the proxy
when done: `docker compose -f dev/docker-compose.yml --profile proxy stop proxy`.

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
