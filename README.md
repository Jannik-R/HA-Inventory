# Home Inventory (Vorrat) for Home Assistant

*Deutsch: [README.de.md](README.de.md)*

Household inventory (food, batteries, household goods, medicine, home-canned jars) as a Home Assistant
custom integration: book items in and out by barcode or name, track batches with best-before / use-by
dates per storage location, see what expires soon, and get a brand-independent shopping list from
minimum stock levels.

> Status: early development, first release 0.1.0 (booking, stock and products, expiry view, sensors, minimum stock and shopping list, labels, services, recipes, week planner, general use and canning). Changes: [CHANGELOG.md](CHANGELOG.md). See [docs/PLAN.md](docs/PLAN.md).

## Features

Available:

- Book in by EAN barcode (USB/Bluetooth scanner or phone camera) or by name; product data from Open Food Facts
- Category tree (main category → category → Produktart, many seeded) with inherited defaults (unit, location, date type, expiry warning)
- Batches with expiry date, counted per package, spread over multiple storage locations
- Stock overview with search, take-out and batch correction; a whole storage location can be moved to another one in the settings (panel only, no service: it is a stock correction)
- Expiry overview with a temporary "expiring soon" threshold and recipe suggestions that use up what expires (recipes ranked by expiring ingredients, then by availability; marked in the recipe list); sensors for expired / expiring packages
- Labels (QR code of product + expiry date), printed on a label printer (Dymo LabelWriter 450 behind a USB print server or on USB at the HA host) or through the browser; scan a label to book out
- Services for automations (hardware scanners, NFC tags, ESPHome, voice): book in / out by barcode, label code or product name, print labels, the shopping list and recipes, a recipe on the shopping list, plan a dish, record a canning run
- Recipe database with ingredients matched to categories: see what is in stock, scale the servings; import a recipe from a URL (Chefkoch, Mealie, Tandoor and most recipe sites); with an AI set up also posts without recipe data (Instagram, TikTok, YouTube: caption, video, image), pasted text and photos (e.g. a cookbook page)
- Minimum stock per category as an amount in any unit (e.g. "2 kg Nudeln", any brand) and/or a package count; shopping list in the panel and as an HA to-do list; add products or categories by hand (new ones are created on the spot)
- Shopping by recipes: put recipes on the shopping list for a number of servings; the missing amounts of all of them are added up per category; amounts in recipe-only units (EL, Tasse, Prise) convert to ml or g when the category fits (volume or weight), otherwise to their base unit (2 EL Kapern → 30 ml); only Scheibe stays as written ("2 Scheiben"); an ingredient without an amount shows 1 Pkg.
- Shopping list, recipes and meal plan on an ESC/POS receipt printer (58 / 80 mm, USB on the HA host or network), with cutter
- Shopping list from the meal plan: the recipes planned in a date range (button *Einkaufsliste* in the meal plan, action `pantry.plan_to_shopping_list`) go on the list minus stock; no consumption forecast yet
- Week planner: views day, week and month (Monday first); each dish has a meal slot (breakfast, lunch, coffee, dinner, snack) and comes from a recipe or free text; moving a meal shifts it over the following days; servings default to the household size; read-only calendar entity *Speiseplan*
- Non-food: categories marked *Kein Lebensmittel* (inherited) are never recipe ingredients; seeded roots *Haushalt & Drogerie*, *Haustechnik* (Batterien, Akkus, Leuchtmittel by socket), *Hausapotheke* (use-by, 30 days warning) and *Tierbedarf*
- Shelf life (*Haltbarkeit*, days, inherited like the warning): booking in proposes today + shelf life as expiry date; seeded with typical values for the food categories (e.g. *H-Milch* 90, *Brötchen* 2, *Eingekochtes* 365 days)
- Opened packages (*Anbrechen*): mark one package as opened (button on the batch row, scan mode *Anbrechen*, action `pantry.open_package`); it becomes its own stock row and expires earlier by the inherited *Haltbar nach Anbruch* (days; seeded for the food categories, e.g. milk 3; empty = the date stays, e.g. pasta); the expiry view, sensors, labels and recipe suggestions use that date; a new label is offered (printed only after the label dialog)
- Canning (tab *Einkochen*): protocols with a charge per batch of jars (YYYYMMDD-n); labels carry the charge and scanning one books out a jar of that charge; canning recipes (each makes a product, optional temperature and duration) live in the tab's own *Rezepte* view, not in the recipe tab or the meal plan
- AI assistants: the LLM API *Home Inventory* for Assist agents and Home Assistant's MCP Server (stock, expiring, recipes, shopping list, meal plan; what they may change is set in the options)

Planned:

- User feedback with AI evaluation

Order and details: [docs/PLAN.md](docs/PLAN.md) section 6.

## Installation

Requires Home Assistant 2026.10.1 or newer.

HACS (only once the repository is public; HACS cannot install from private repositories): add this repository as a custom repository (category *Integration*), install *Home Inventory (Vorrat)*, restart Home Assistant. Versions are the GitHub releases.

Manual: download the release (or clone the repository), copy `custom_components/pantry` into your `config/custom_components/` and restart Home Assistant.

Python packages (installed by Home Assistant): `segno` (QR codes on labels) and `yt-dlp` (reads the video and caption of a post for the AI recipe import; it is already part of the Home Assistant image, so a standard install downloads nothing).

Then: *Settings → Devices & services → Add integration → Home Inventory* (formerly *Pantry*; the internal domain stays `pantry`, so entities, services and automations are unchanged), choose the modules (see below). The panel *Vorrat* appears in the sidebar.

**Modules.** Stock, booking in/out, expiry and settings are always there. Optional, all on by default: *Einkaufsliste* (tab *Einkauf* and the shopping list to-do entity), *Rezepte* (tab *Rezepte*), *Speiseplan* (tab *Speiseplan*, the meal plan calendar entity and the settings section *Mahlzeiten*), *Einkochen* (tab *Einkochen*). Change them later under *Configure > Module*; saving reloads the integration. A turned off module only hides its tab and buttons (e.g. *Auf die Einkaufsliste* in a recipe) and removes its entity; its data stays and comes back when the module is turned on again. Websocket commands and services of a turned off module keep working.

## Usage

**User guide** (how to use it, step by step, with screenshots): [Deutsch](docs/guide.de.md) · [English](docs/guide.en.md).
The question mark in the panel header opens it in the Home Assistant language. The panel itself is in
German; the English guide names buttons by their German labels.

## Setup

All options are under *Settings > Devices & services > Home Inventory > Configure*: modules, label
printer, receipt printer, AI and household size.

### Label printer (Etikettendrucker)

Each label shows a QR code (`PTRY:<EAN>:<date>`, or `PTRY:P<product id>:<date>` without EAN; canning
labels contain the charge), product name, brand and expiry date. Scanning a label in *Bestand* books
out one package of that batch.

Choose *Etikettendrucker*. Step 1: the *Modell des Etikettendruckers*. Step 2: the settings of that
model, label size in mm and whether to print on book-in. Models:

- *Dymo LabelWriter 450 / 4xx*: network via a USB print server (e.g. TP-Link with a fixed IP and raw
  printing enabled): enter the printer as `host` or `host:port` (port defaults to 9100). Or USB on the
  HA host: enter the device path, e.g. `/dev/usb/lp0` (in Docker pass it with `devices:`, as for the
  receipt printer). Width 10 to 57 mm, height 10 to 200 mm (default 57 x 32). The 450 never prints
  the last ~3 mm of a 57 x 32 label, so that space stays blank. *Testetikett drucken* sends one label
  when you save; if the printer is not reachable the form says so.
- *Kein Drucker*: the browser print dialog opens with one page per label (choose the label printer
  there; the page size is the label size, 10 to 200 mm).

### Receipt printer (Bondrucker)

Prints the shopping list, recipes and the meal plan on an ESC/POS receipt printer (58 or 80 mm, e.g.
TPG A799), as an image, so umlauts and fonts work on every printer; with a cutter the paper is cut at
the end. Setup for a USB printer on the machine that runs Home Assistant in Docker (e.g. a Raspberry Pi):

1. Plug in the printer and switch it on. Most receipt printers (e.g. the TPG A799) are USB printers:
   on the host `ls /dev/usb/` shows `lp0` (`dmesg` says `usblp`). A USB-serial printer instead shows
   up in `ls -l /dev/serial/by-id/` as `usb-…` pointing to `ttyUSB0` or `ttyACM0`.
2. Pass it into the Home Assistant container, in its `docker-compose.yml`:
   ```yaml
   services:
     homeassistant:
       devices:
         - /dev/usb/lp0:/dev/bondrucker   # or /dev/serial/by-id/usb-… for a serial printer
   ```
   Recreate the container (`docker compose up -d homeassistant`). The printer must be on and
   plugged in when the container starts; after unplugging it, restart the container.
   HA OS passes USB devices on its own: use the device path directly.
3. *Configure > Bondrucker*: *Drucker* = `/dev/bondrucker` (a network printer: `host` or `host:port`,
   port 9100), paper width, *Papier am Ende abschneiden*, baud rate (serial printers only: the
   printer's setting, often 9600 or 115200; a self-test page, usually FEED held while switching on,
   shows it). *Testbon drucken* sends one short test receipt when you save; an unreachable printer is
   reported in the form.
4. "Der Drucker ist nicht erreichbar": the Home Assistant log names the reason (e.g. busy: another
   service such as CUPS holds the printer; offline: paper out or cover open). Garbled characters on a
   serial printer: wrong baud rate; try the others.

### AI (KI)

Optional. Set up an AI in Home Assistant first (an *AI Task* entity, e.g. *Add integration > Google
Gemini* with an API key from Google AI Studio, which has a free tier, or *Anthropic*), then pick it
under *Configure > KI (Rezeptimport, Assistenten) > KI-Aufgabe*; empty = no AI.

**Recipe import.** Importing a page with schema.org recipe data needs no AI: Home Assistant loads the
page only when you click *Importieren* (15 s timeout, HTML up to 5 MB, http or https, LAN addresses
too). With an AI set up:

- Every import is checked once: the recipe, the food category tree and the units go to the AI (about
  10,000 tokens; the fixed part comes first, so providers that cache prompts bill it less often). It
  fixes categories and units (an existing unit, or a new one that you add in the dialog). The AI only
  answers "ok" or the changes, and only proposes them; nothing is saved without you.
- A link without recipe data (Instagram, TikTok, YouTube, a blog) is read by the AI: Home Assistant
  fetches the post with `yt-dlp` (caption, and the video up to 15 minutes and 50 MB, at most 720p),
  otherwise the page's title, description, visible text and preview image (up to 5 MB), and sends them
  to the AI (attachments go through a hidden folder `.pantry_import` in the first media directory and
  are deleted right after). The AI reads spoken words and on-screen text of a video when it supports
  video (Google Gemini does); otherwise it gets the text only. Instagram often refuses videos without
  login; then only the caption and the image are used.
- *Text* and *Foto* in the import dialog send pasted text (up to 20,000 characters) or a photo
  (scaled to 2000 px in the browser) to the AI.

Reading a post takes 15 to 60 seconds and costs one AI call, plus the check.

**New products.** A product that booking in finds on Open Food Facts (not yet in Vorrat) is checked
once as well: its name, brand, the Open Food Facts quantity and categories, the whole category tree
(food and non-food) and the units go to the AI. It fixes the name (without brand and size), the
category and the package content (e.g. "4 x 125 g" = 500 g). When no product type fits, it proposes a
new one below the right category; it is added when you book in. The book-in form stays usable meanwhile;
fields you edited are kept.

**Assistants (LLM API).** The integration provides the LLM API *Home Inventory*. Select it in an
Assist agent (e.g. *Google Gemini > Configure > Control Home Assistant*) or in the *Model Context
Protocol Server* integration (for Claude Desktop and other MCP clients). *Zugriff für Assistenten*
decides what they may do:

| Level | Tools |
|---|---|
| *Nur lesen* | `get_stock`, `get_expiring`, `get_recipes`, `get_recipe` (with stock status), `get_shopping_list`, `get_meal_plan` |
| *Lesen, Einkaufsliste und Speiseplan* (default) | plus `add_to_shopping_list` (product or category by name), `add_recipe_to_shopping_list`, `plan_meal` |
| *Alles, auch Ein- und Ausbuchen und Anbrechen* | plus `book_in`, `book_out`, `open_package` (product by name or EAN) |

Tools use names, like the services; the write tools run the services below, so a booking records the
user of the conversation.

## Sensors

The integration adds a device *Vorrat* with two sensors (packages, no polling, updated after every
booking and at midnight):

| Sensor | Value | Attribute `items` |
|---|---|---|
| *Abgelaufen* | packages past their date | name, expires_on, days_left, packages, location per batch |
| *Läuft bald ab* | packages within their warning period | same |

An opened package counts with its shorter date (opened on + *Haltbar nach Anbruch*).

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

## Services (automations)

All return a response (use `response_variable` in a script or automation). Errors (unknown
barcode, recipe or location, not enough stock, printer not reachable) make the action fail with a message.

| Service | Fields | Response |
|---|---|---|
| `pantry.book_in` | `code` (EAN or name of a product that already exists; new products are created once in the panel, where the category is chosen), `packages` (default 1), `expires_on` (date, optional), `location` (name, optional; default: the product's default location) | `product_id`, `batch_id`, `name` |
| `pantry.book_out` | `code` (EAN, label code `PTRY:…` or product name), `packages` (default 1), `location` (name, optional) | `taken` (batch, location, packages, booking id per row), `name` (label code: also `location`) |
| `pantry.open_package` | `code` (EAN or product name: earliest expiry first; label code `PTRY:…`: a package of that batch), `location` (name, optional, not with a label code) | `batch_id` (the opened package's batch), `location_id`, `booking_id`, `expires_on` (new expiry date), `name`, `location` |
| `pantry.print_labels` | `batch_id` (from `book_in`), `count` (1 to 20, default 1) | `printed` |
| `pantry.print_shopping_list` | none | `printed` (number of items) |
| `pantry.print_plan` | `day` (date, default today), `period` (`day` or `week`, default `day`; a week runs Monday to Sunday around `day`) | `printed` (number of dishes) |
| `pantry.print_planned` | `day` (date, default today), `meal` (`breakfast` … `snack`; default: the current meal by the start times under *Einstellungen > Mahlzeiten*) | `printed` (number of recipes), `day`, `meal` |
| `pantry.print_recipe` | `recipe` (name, also a canning recipe), `servings` (optional; default: the recipe's own) | `printed` |
| `pantry.shop_recipe` | `recipe` (name of a dish recipe), `servings` (optional; default: *Portionen im Haushalt*) | `recipe_id` |
| `pantry.plan_to_shopping_list` | `start` (date, default today), `days` (default 7, max 366) | `recipes` (`recipe_id`, `name`, `servings`), `skipped` (free-text dishes) |
| `pantry.plan_meal` | `recipe` (name) or `text` (free text), `day` (date, default today), `meal` (`breakfast`, `lunch`, `coffee`, `dinner`, `snack`; default `dinner`), `servings` (optional; default: *Portionen im Haushalt*) | `meal_id` |
| `pantry.canning` | `recipe` (name of a canning recipe), `jars` (default: the recipe's yield), `made_on` (date, default today), `expires_on` (date; default: made-on date + shelf life), `location` (name, optional), `notes` | `id`, `batch_id`, `charge` |

- **book_out** with an EAN takes the earliest expiry first (packages without a date last), like the panel.
  A label code takes one package of the batch it names, from wherever that batch is (`packages` must be 1, no `location`).
- **print_planned** prints each recipe planned for that meal with its planned servings (free-text dishes are skipped); nothing planned fails with a message. Example: a button in the kitchen prints what is cooked next.
- **print_labels** needs a label printer (see [Label printer](#label-printer-etikettendrucker)); with *Kein Drucker* it fails,
  since a service has no browser to print from.
- **shop_recipe** on a recipe already on the list changes its servings and drops optional ingredients chosen in the panel.
- **plan_to_shopping_list** puts every recipe planned in the range on the list with the summed servings of its meals (like **shop_recipe**, keeps optional ingredients chosen in the panel; a recipe already on the list keeps the larger servings, so running it twice changes nothing). Free-text dishes are skipped.
- **canning** takes product, temperature and minutes from the canning recipe; print the jar labels with `print_labels` and the returned `batch_id`.
- Location and recipe names are matched ignoring case. Bookings made by a service are logged with source `service`
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

**Receipt printer on this PC (dev HA):** Docker Desktop's WSL kernel has no USB printer driver, so a
USB receipt printer cannot be passed into the dev container. Add it in Windows as a printer with the
driver *Generic / Text Only* on its USB port, then run the bridge (stdlib only, listens on
`127.0.0.1:9100`, each connection becomes one RAW print job):

```bash
python scripts/receipt_bridge.py "Bondrucker"
```

and set the receipt printer of the dev HA to `host.docker.internal:9100`. `file:<path>` instead of a
printer name appends the bytes to a file (no printing). E2E tests block printing either way.

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

Screenshots for the user guide (`docs/images/`, phone width, light and dark theme) are made the
same way, on demand only. The spec (`frontend/e2e/screenshots.docs.ts`) creates demo data, takes
the shots and removes the data again. Rerun it after visible UI changes and commit the images:

```bash
cd frontend && npm run docs:screenshots
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
