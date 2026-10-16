# Implementation Plan

Food inventory ("Vorrat") as a Home Assistant **custom integration** (no add-on).
Everything runs inside the HA process; UI is a sidebar panel.

## 1. Architecture

```
HA sidebar panel (Lit web component, one bundled JS file)
        │  hass.callWS(...)
        ▼
websocket.py ── services.py ── LLM API tools (later)
        │                │                        │
        └────────────────┴──── inventory/ ────────┘   ← all business logic, one place
                                   │
                         db.py (stdlib sqlite3, <config>/pantry.db)
                                   │
              off.py (Open Food Facts lookup, result cached in `product`)
              label.py (render label, raw to a network print server)
              receipt.py (planned: ESC/POS receipt printer, see 4a)

Entities: sensor (expired / expiring soon), todo (shopping list; its state = open items, so no extra below-min sensor)
```

Rule: **every** entry point (panel, services, automations, future AI tools) calls
the `inventory` package (public API in its `__init__`, one submodule per concern). No logic in websocket handlers or entities.

### Key decisions

| Topic | Decision | Why |
|---|---|---|
| Domain | `pantry` | English code; UI says "Vorrat" |
| Storage | stdlib `sqlite3`, one file in config dir, schema via `PRAGMA user_version` migrations | relational data, constraints, growing booking log, recipes later. No dependency. |
| Backup safety | `backup.py` platform (`async_pre_backup` / `async_post_backup`) closes/locks DB | prevents corrupt DB in HA backups |
| DB access | executor jobs, one connection + lock | `shortcut:` single lock, fine for a household |
| Product data | Open Food Facts API v2 (EAN), `cgi/search.pl` for names (10 req/min: explicit search only); local products first; OFF result stored in `product` table on first booking | free, good DE coverage; local copy = cache |
| Frontend → backend | HA websocket commands | panel already has authenticated `hass` |
| Permissions | booking, lookup, search, stock: every HA user; master data writes and product delete: admin only; recipes: any user creates and edits, admin deletes | the kitchen phone may use a non-admin account |
| Automations | HA services `pantry.book_in` / `pantry.book_out` (by EAN or label code + location name, `inventory/codes.py`) and `pantry.print_labels` (network printer only), all with a response; unknown EANs fail (new products need a category: panel only, no OFF call from automations) | scanners/NFC/ESPHome can call them |
| Shopping list | own `todo` entity | native HA list UI, mobile app, Assist |
| Panel | `panel_custom` + static path, Lit + TypeScript, Vite build → committed `www/` (main file + lazy chunks with hashed names); panel URL `?v=<bundle mtime>` busts the browser cache on every build | HACS needs built file |
| UI components | own small Lit components styled with HA theme CSS vars; **no** internal `ha-*` elements | internal elements are not public API and break on HA updates |
| List rows | pencil (edit) + bin (delete) icons on every row, plus (add child) on tree rows (`rowActions`); row click = open/close a tree node, else edit | one pattern on every page; see CLAUDE.md UI/UX |
| Dialogs | modal; title = action + object; "Abbrechen" + primary right-aligned (primary last); only save + cancel inside (row icons cover the rest); click beside / Esc close, asking first when there are unsaved changes | common dialog guidelines (Material, Apple HIG); see CLAUDE.md UI/UX |
| Form validation | live: field errors under the field while typing, primary button disabled until valid; hints (e.g. past date) never block; backend validates again | errors before booking, not after; see CLAUDE.md UI/UX |
| Barcode (hardware) | USB/BT scanners act as keyboard → the normal, always-focused input field | zero code |
| Barcode (camera) | native `BarcodeDetector`, polyfill `barcode-detector` (zxing-wasm) loaded only when missing (iOS/Firefox/Windows); the wasm is bundled in a lazy chunk (~1.4 MB, ~600 kB gzip), never fetched from a CDN | camera needs HTTPS (or localhost); works offline in the LAN |
| Label printing | backend renders the label (Pillow + `segno` for QR) and sends Dymo raster data raw to a **network print server** (TP-Link, port 9100); CUPS/IPP as fallback. No dialog. | works from panel, services and automations; no USB cable to HA |
| i18n backend | HA standard: `strings.json` + `translations/{de,en}.json` | config flow, services, entities |
| i18n frontend | `frontend/src/i18n/<lang>.json`, `t(key, params)`, language from `hass.language`, fallback `de` | dates/numbers via `Intl` with `hass.locale` |
| Distribution | private GitHub repo now; layout HACS-compatible from day 1 (`hacs.json`, built bundle committed, GitHub releases) | publishing later = make repo public |
| License | MIT | free use/modification, copyright notice must be kept (= attribution) |

## 2. Data model

```
unit       (id, name UNIQUE, symbol, base_unit_id NULL → unit, factor > 0,
            is_count 0|1)   -- 1 = counts packages (Stück, Packung, Dose ...)
           -- seeded: Stück, Packung, g, kg (=1000 g), ml, l (=1000 ml); user can add (Dose, Glas, Bund ...)
location   (id, name UNIQUE, sort, active 0|1)   -- never deleted: "delete" deactivates (must be empty),
           -- so bookings keep a valid FK; adding the same name again reactivates it
defaults   (id = 1, unit_id → unit, default_location_id NULL → location, expiry_type, warn_days)
           -- one row: root of inheritance, editable in Einstellungen › Standards
category   (id, parent_id NULL → category, name, sort,
            unit_id, default_location_id, expiry_type, warn_days,   -- inheritable, NULL = inherit
            min_stock NULL, min_stock_unit_id NULL → unit,           -- amount with its own unit (both or none, CHECK); NOT inherited
            min_packages NULL)                                       -- package count (> 0); NOT inherited (migration 4)
product    (id, ean UNIQUE NULL, name, brand, category_id → category,
            content_amount, content_unit_id,                         -- e.g. 500 g per package; both or none (CHECK)
            default_location_id, expiry_type, warn_days,              -- overrides, NULL = inherit
            image_url, off_json, updated_at,
            min_packages NULL)                                        -- own minimum in packages (migration 11)
batch      (id, product_id, expires_on DATE, created_at, UNIQUE(product_id, expires_on))
           -- date type is a product property (own or inherited), never per batch (migration 2)
           -- at most one batch without a date per product (partial unique index, migration 6)
stock      (batch_id, location_id, packages > 0, PRIMARY KEY(batch_id, location_id))
shopping_done (category_id PK → category (cascade), missing)   -- checked shopping item + its shortage then
shopping_item (id, product_id UNIQUE NULL → product, category_id UNIQUE NULL → category,   -- added by hand,
            packages > 0, done 0|1, created_at)   -- exactly one of product / category (CHECK); both cascade
recipe     (id, name, servings > 0, instructions, source_url, image_url)   -- migration 7
recipe_ingredient (id, recipe_id → recipe (cascade), category_id NULL → category (set null: text stays,
            ingredient unmatched), amount > 0, unit_id → unit, text, optional 0|1, skip_stock 0|1)
            -- skip_stock (migration 10): never checked against the stock, status "skipped", not in the summary,
            -- never on the shopping list (phase 12); amount and unit both or none; order = id order (saving a recipe replaces all ingredients)
off_tag    (id, tag UNIQUE)                    -- each Open Food Facts category tag once
category_off_tag (category_id → category, off_tag_id → off_tag, PK both)   -- n:m; a known tag is referenced
booking    (id, ts, kind 'in'|'out'|'move'|'correct', batch_id → batch (cascade), location_id → location,
            to_location_id → location,           -- only 'move' (location_id = source)
            packages,                            -- always positive; 'correct' = signed difference
            source 'scan'|'manual'|'label'|'service'|'undo', user_id,
            reverts_id UNIQUE NULL → booking)    -- an undo's 'in' names the 'out' it reverses: undone once (migration 6)
            -- root category names are unique too (partial unique index, migration 6)
```

### Category tree

One self-referencing `category` table, any depth. Convention (not enforced):
**main category → category → food type**, e.g. `Nudeln, Reis & Getreide → Nudeln → Spaghetti`.
Products attach to any node, normally the leaf. The lowest level is called **Produktart** (product type)
in the UI: brand-independent, e.g. Tomatenmark. No separate table: a product type is a category.
Any user can add a category below an existing one (`pantry/product_type_add`: recipe ingredient,
category picker when booking in / editing a product); main categories and edits stay admin-only.
The seed (`seed_types.py`, ~320 types under the sub-categories) fills it for a new DB; migration 8 adds
the missing ones to existing DBs (only under a parent with that exact name, only when no category has
the type's name yet, so user renames and deletions stay). It also sets default units (`_DE_UNITS`: Milch l, Käse g, Fleisch g, ...) on categories without an own unit. Any user can add a type from a recipe
(`pantry/product_type_add`). Name keywords also match single-word type names (`suggest.py`).

- **Inheritance**: `unit`, `default_location`, `expiry_type`, `warn_days` resolve
  product → its category → parent … → root → integration defaults (`defaults` table).
  The API returns each effective value with its source (`own` | category id | `default`);
  the UI renders inherited values in secondary text color with "von <Kategorie>".
- **Min stock** is set on any node and counts its **whole subtree**. Two independent minimums
  per node, each optional: an **amount** (`min_stock` in its own `min_stock_unit_id`, e.g. 500 g; a new amount starts in the node's effective unit and keeps its unit when that changes)
  and a **package count** (`min_packages`, e.g. 3 Packungen, any content). A node may have one,
  both or none; levels are independent and may mix freely, e.g. *Spaghetti* 3 Packungen,
  *Nudeln* 1 kg **and** 2 Packungen, *Reis* 500 g, *Nudeln, Reis & Getreide* 2 kg.
  Not inherited (inheriting would multiply it). Both set on one node = both must be met.
- **Shopping list from nested min stock** (bottom-up, no double counting), computed
  **separately per dimension** (amount, packages) with the same rule:
  `missing(node) = max(0, min − stock(subtree) − Σ missing(children))`. Amount: children's
  shortages converted into the node's unit (skipped if not convertible). Packages: plain counts,
  no conversion; products without known content still count as packages. A child's shortage only
  reduces its parent's shortage in the same dimension; a node without a minimum in one dimension
  passes its children's shortage in that dimension up. One todo item per node lists every
  missing dimension ("Nudeln – 0,5 kg und 1 Packung fehlen").
  Example: stock Nudeln 0,5 kg, Reis 0, Couscous 0,3 kg → items
  "Nudeln 0,5 kg", "Reis 500 g", "Nudeln, Reis & Getreide: weitere 0,2 kg (beliebig)".
  Items are grouped by main category. A node without its own min stock passes its children's
  shortage up to its parent.
- **Product minimum** (`product.min_packages`, migration 11): packages only (the content is fixed,
  an amount adds nothing). Below it the product is its own item ("Barilla – 2 Pkg. fehlen"), and
  its shortfall counts like a child's shortage toward its category and above: packages as is,
  the amount as packages × content (not if the content is unknown). Checks in `shopping_done_product`.
- **Automatic category assignment**: each category node has `off_tags` (OFF category
  tags, e.g. `en:spaghetti`, `en:pastas`). A product gets the deepest node whose tag
  appears in its OFF `categories_tags` (tie: the later, more specific OFF tag). No match → user picks; the product's most specific
  OFF tag is then added to the chosen node, so the next similar product maps automatically.
  Fallbacks when no OFF tag matches (e.g. OFF has no categories at all): (1) **name keywords**
  (`keywords.py`, German, grows over time): keyword → OFF tag → category. The first name word
  with a match decides (German names put the product first: "Joghurt Erdbeere"); within it the
  score `len(keyword) + bonus` picks (whole word +10, end of compound = German head +5, start +2,
  inside a word: no match; minimum 5), then the deeper category. (2) **similar saved products**:
  the category of the product sharing the most name words (≥ 4 letters, longer words weigh more).
  Seed data ships tags for the default categories. The OFF taxonomy itself is not used as
  the tree (thousands of nodes, inconsistent) - it only feeds the mapping.
- **Package content from OFF**: drained weight if the `quantity` text states one
  ("Abtropfgewicht 240 g", "670g/370g"), else `product_quantity` + `product_quantity_unit`
  (fallback: parse the `quantity` string like "500 g", "6 x 1,5 l") → `content_amount` /
  `content_unit_id`. Always editable; missing → user enters it once per product.
- **Seed data** (categories, units, locations) is language-specific data, chosen by HA
  language at first setup; only `de` for now. Applied to a new DB only; after the first release,
  seed fixes for existing DBs need a migration step.
- **Amounts**: stock is counted in packages (one label per package). For min stock and
  display, packages × `content_amount` are converted into the node's effective unit
  via `unit.base_unit_id/factor`. A count unit (`Stück`/`Packung`) uses the content when it converts
  (10 Eier per package), else counts packages.
  Product without convertible content → counted as unknown, flagged in UI.
- **Recipe availability**: an ingredient references a category node: "Nudeln" accepts any pasta, "Spaghetti"
  only spaghetti. Stock of the node and all descendants counts (converted like min stock, scaled by
  servings / recipe servings). Status: `available`, `partial`, `missing`, `unknown` (only products with
  unconvertible content), `unmatched` (no category). No amount: available when any product of the subtree
  is in stock. Optional ingredients are left out of the summary.

### Seeded main categories (editable)

Organized by food type, roughly supermarket order (useful for the shopping list).
Storage is a location, not a category; exception: frozen food, because its
properties (location, warn days) differ and inherit nicely.

| Main category | Example categories | Inherited defaults |
|---|---|---|
| Obst & Gemüse | Obst, Gemüse, Kräuter, Kartoffeln | warn 2 d |
| Brot & Backwaren | Brot, Brötchen, Knäckebrot | warn 2 d |
| Milchprodukte & Eier | Milch, Joghurt, Käse, Butter, Eier | use-by, warn 3 d, location Kühlschrank |
| Fleisch, Wurst & Fisch | Fleisch, Aufschnitt, Fisch | use-by, warn 1 d, location Kühlschrank |
| Nudeln, Reis & Getreide | Nudeln, Reis, Couscous, Haferflocken | unit kg |
| Backen | Mehl, Zucker, Backmischungen, Hefe | unit kg |
| Konserven & Fertiggerichte | Gemüsekonserven, Tomaten, Suppen, Fertiggerichte | |
| Öle, Saucen & Gewürze | Öl, Essig, Saucen, Gewürze, Brühe | |
| Frühstück & Aufstriche | Müsli, Marmelade, Honig, Nussaufstrich | |
| Süßes & Snacks | Schokolade, Kekse, Chips, Nüsse | |
| Getränke | Wasser, Saft, Kaffee, Tee | unit l |
| Tiefkühlkost | Gemüse TK, Fleisch & Fisch TK, Pizza, Eis | location Gefrierschrank, warn 30 d |
| Haushalt & Drogerie (optional) | Spülmittel, Papier | no expiry tracking (batches without date; booking form hint: leave the date empty) |

Global defaults (integration options): warn 7 days, best-before, unit Stück.

## 3. Core flows

**Book in**: one input (scanner types into it, camera button next to it, or typed name)
→ local `product` lookup → else OFF lookup → else manual form. Unknown product: choose
category (suggested from OFF categories). Then: expiry date (its type comes from the product/category),
packages, location (default inherited / last used). "Print labels" toggle (default from options)
→ one label per package, printed immediately (labels carry no table: see Label printing).

**Book out**: the same single input.
- `PTRY:<key>:<date>` (key = product EAN, or `P<id>` without EAN; date = batch expiry, empty without) → one package of that batch, booked out like a normal book-out (location chosen as usual). A label can be scanned again; it names a batch, it does not track single packages.
- EAN / name → product → batch with **earliest expiry first** (FEFO),
  location = only one / last used. Override possible.

**Overview**: grouped by category tree → product → batch/location; search (name, brand,
EAN, category, location); location filter. Also the product page: edit/delete on product rows,
take out and fix (date, count) on batch rows; products without stock via an opt-in checkbox.

**Expiring**: sorted by date; threshold = effective `warn_days` per product, plus a view-wide
override field (session only, not saved). Expired listed first.

**Min stock / shopping list**: every category node below its `min_stock` and/or `min_packages`
→ todo item "Nudeln – 1,5 kg fehlen" / "Spaghetti – 2 Packungen fehlen" / both in one item. Recomputed on every booking. A check is stored with the item's shortage (`shopping_done`); the item counts as done while that shortage stays the same, so it comes back when it changes. Panel and todo entity share it. The panel shows the list as the category tree: only rows with something to buy get a checkbox, checked ones are struck through in place.
**Items by hand** (`shopping_item`): a product or a category ("any of it") with a package count; adding
the same again adds packages (a checked one starts again). The panel searches local products and
categories and can create a new product (any user) or category (admin) in the same transaction.
Todo entity: create = exact name of a product, else a category (no creation from free text: a
product needs a category); update = check mark only; delete = items by hand only (min stock items
come from the stock). Todo uids: `c<category id>` (min stock), `p<product id>` (product minimum), `m<item id>` (by hand).

## 4. Label printing (Dymo LabelWriter 450)

The 450 has only USB. It goes into the network through a **TP-Link mini print server**
(USB print server, e.g. TL-PS110U / TL-WPS510U: raw TCP port 9100 and LPD), so neither HA nor
a Pi needs a USB cable to the printer.

```
HA (pantry) ──raw TCP :9100 (Dymo raster commands)──▶ TP-Link print server ──USB──▶ LabelWriter 450
```

- **Default path: HA talks to the print server directly.** The 450 is not PostScript/PCL; it takes
  its own raster protocol (Dymo "LabelWriter Technical Reference": `ESC @` reset, label length,
  `SYN` + one line of 1-bit pixels per dot row, `ESC E` form feed). `label.py` renders the label
  with Pillow (QR via `segno`), converts it to 1-bit rows at 300 dpi and writes them to
  `<print server>:9100` (asyncio socket). No CUPS, no driver, no extra host.
  `label_printers.py` is the registry of label printer models (options flow step 1 picks one): per model the size limits, default port, blank bottom reserve (Dymo 450: 3 mm) and the stream encoder; `browser` has no encoder (browser print). A new network model = a new entry with its encoder. The receipt printer (4a) will be a separate setting, not a model here.
  `shortcut: own small raster encoder for LabelWriter 4xx; other label printers need their own encoder or the CUPS path.`
- **Fallback path: CUPS (NOT built; the browser print covers the no-printer case)** (for printers without an own encoder): a CUPS server (Pi container or
  HA add-on) with `printer-driver-dymo`, its queue pointing to `socket://<print server>:9100`;
  HA sends the PNG via IPP Print-Job to that queue.
- Check first: TP-Link print servers have a compatibility list and some USB label printers fail
  behind them (no bidirectional status). Test the 450 with one raw test label (via
  `nc <print server> 9100 < test.bin`) before building on it; if it fails, use CUPS on a Pi with USB.

Options (config flow → options): transport (`raw` print server host[:port] | `ipp` CUPS queue URI),
label width/height mm, auto-print on book-in. Test print button in options.
Label content: QR `PTRY:<key>:<date>`, product name, brand, expiry date. No label table; reprint = `count` identical labels of a batch (1..99); `pantry/print_labels` renders once: network printer `{printed}`, browser `{image, count, width_mm, height_mm}` (the panel repeats the image).
README documents the print server setup (fixed IP, port 9100 enabled) and the optional CUPS setup.

Network printing is **optional**: no printer configured → labels still work, the panel
opens the same PNG in the browser print view (`@page` sized to the label). Camera scanner
works on the Pi installation via HTTPS (cloud / local reverse proxy).

## 4a. Receipt printer (shopping list, later recipes)

Goal: print the shopping list (Phase 7) and later recipes on a cheap thermal receipt printer,
from the panel, a service and automations, without a print dialog. Support as many printers as
possible; the printer ordered for testing (58/80 mm thermal receipt printer from eBay) is only one example.

- **Command set: ESC/POS.** Almost every receipt printer speaks it (Epson TM, Star in ESC/POS mode,
  Xprinter, Munbyn, Rongta, HOIN, generic "POS-58/POS-80"). Only a small subset is needed:
  init (`ESC @`), raster image (`GS v 0`), feed, cut (`GS V`, ignored by printers without a cutter).
- **Content as a raster image**, not text mode: rendered with Pillow (shared with `label.py`), so
  umlauts, fonts, bold headings and QR codes work on every printer without code-page tables.
  `shortcut: image only; add text mode if a slow printer needs it.`
- **Transports** (option in the config flow, one printer):
  - device file on the HA host: USB printers show up as `/dev/usb/lp0` (USB printer class) or
    `/dev/ttyUSB0` / `/dev/ttyACM0` (USB-serial); plain binary writes, no dependency. Works on HA OS
    (USB devices are passed to HA core) and in Docker with `devices:`. Example: **TPG A799** (80 mm,
    cutter, USB with serial-over-USB) → `/dev/ttyUSB0` or `/dev/ttyACM0`;
  - network: raw TCP to port 9100 (most LAN/WiFi models), asyncio socket, no dependency;
  - CUPS/IPP: a raw queue on the Pi that already serves the Dymo;
  - Bluetooth: not planned (pairing on HA OS is fragile); use an ESP32 serial bridge or CUPS.
- **Options**: transport + address/device, paper width (58 mm = 384 dots, 80 mm = 576 dots), cutter yes/no,
  test print button. A cash drawer port (ESC/POS `ESC p`) is ignored.
- **No new requirement** if possible: ESC/POS bytes are written by hand (~30 lines); `python-escpos`
  only if real printers need its quirks database.
- Entry points: panel button "Einkaufszettel drucken" in the *Einkauf* tab, service `pantry.print_shopping_list`.

## 5. Development environment

`dev/docker-compose.yml` runs HA stable with `custom_components/pantry` mounted read-only.
All runtime data goes to `dev/config/` (git-ignored). Only `docker-compose.yml` and
`configuration.yaml` are committed.
Port bound to `127.0.0.1`; `trusted_networks` with `allow_bypass_login` → no password for local
browser tests (Claude's browser, later Playwright). The MCP Server uses its own token (`HA_DEV_TOKEN`).

## 5a. Dev tooling (token economy)

| Tool | Status | When |
|---|---|---|
| `ha-dev` skill (`.claude/skills/ha-dev`) | ready | start/restart HA, filtered logs, tests, build |
| HA MCP Server on dev HA (`.mcp.json` → `ha-dev`) | prepared; needs the MCP Server integration added in dev HA + `HA_DEV_TOKEN` env var | after Phase 0 (dev HA onboarded) |
| Context7 MCP (`.mcp.json`) | ready | library docs (Lit, Vite, Pillow) on demand |
| Format hook (`.claude/hooks/format.mjs`) | ready; runs ruff / prettier if installed, silent otherwise; prettier on `frontend/src` + `frontend/e2e`, generated files in `frontend/.prettierignore`, CI runs `npm run format:check` | ruff via `pip install ruff` |
| Serena MCP (symbol-level code navigation) | planned | after Phase 1, when the code base is big enough to pay off; needs `uv` |
| Playwright UI tests (`@playwright/test` in `frontend/`, `npm run test:e2e`): repeatable click-through tests of the panel against the local dev HA (no login via `trusted_networks`), run **locally only** (not in CI: each run would need an HA container + browser, ~5-8 billed GitHub Actions minutes, while the private repo has 2,000 free minutes/month; locally it takes seconds). Once the repo is public (Actions free), an E2E CI job can be enabled. Elements addressed by stable `data-testid` attributes (Playwright pierces shadow DOM); each test creates its own data and cleans up. Runs in the installed Edge (`channel: msedge`), no browser download | ready | booking, stock, expiry, settings, validation covered; extend per phase |
| `feature-checklist` skill + `npm run i18n:check` (missing/unused UI keys, also in CI) | ready | every feature/fix |
| `ha-integration-rules` skill: condensed HA dev rules (config flow, `runtime_data`, translations, service registration, quality scale items that matter here) | ready | |
| `db-migration` skill: add a migration step, test upgrade from a DB of the previous version, backup note | ready | every schema change |
| `off-api` skill: Open Food Facts endpoints, fields used, User-Agent, rate limits, seed tag check | ready | |
| `ui-review` skill: check a view in the browser at phone width, light + dark theme, against the UX rules | ready | |
| `release` skill: version bump in `manifest.json`, build, changelog, tag, GitHub release, HACS validation | ready | every release |

Frontend build runs locally (Node LTS). Backend tests run in a container based on the HA
image (Python version always matches HA; HA does not run on Windows natively).

## 6. Phases

Each phase ends with: tests green, README updated, checked in dev HA.

| # | Phase | Status | Content |
|---|---|---|---|
| 0 | Foundation | done | integration skeleton, config flow (single instance), panel shell, i18n, CI: hassfest + HACS action + pytest + frontend build |
| 1 | Core | done | `db.py` schema + migrations + seed, `inventory` (then one module, now the `inventory/` package; book in/out/move/correct, inheritance resolution, queries), backup platform (moved up from Phase 9: real data exists from now on), tests |
| 2 | Product lookup | done | `off.py`, search, category suggestion |
| 3 | Master data UI | done | locations, units, category tree with inherited values |
| 4 | Booking UI | done | book in/out, keyboard scanner field, camera scanner. Required fix: click beside a dialog must close it (code was there, browsers kept the old cached bundle: panel URL now busts the cache with the bundle mtime) |
| 5 | Overview + search | done | stock list, filters (category tree with products as leaves, take out one package per batch with undo; all filtering in the panel: one `pantry/stock` call, data size of a household) |
| 6 | Expiry | done | expiry view with temporary threshold (all in the panel from `pantry/stock`, like Phase 5), sensors expired / expiring soon (packages, batches as attribute; `DataUpdateCoordinator` without polling: `Database.run` sends a dispatcher signal after any write, plus a refresh at midnight) |
| 6a | Stock + products | done | "Produkte" tab merged into "Bestand": product rows get edit/delete, batch rows an edit dialog (`inventory.edit_stock`: date and count of one batch at one location, date type stays a product property; another date moves the packages to that batch, logged as two corrections); products without stock only via an opt-in checkbox |
| 6b | Maintenance | done | migration 3 (OFF tags normalized, CHECKs, location deactivation + booking FKs, `defaults` table editable in settings), styled confirm dialog, Prettier + i18n check in CI, skills `db-migration` and `feature-checklist` |
| 7 | Min stock | done | migration 4 (`min_stock_unit_id`: the minimum keeps its unit; `min_packages`; `shopping_done`), both minimums in the category dialog, *Einkauf* tab, todo entity *Einkaufsliste*; items by hand (migration 5 `shopping_item`, panel dialog with search and create, todo create/delete); deleting master data in use (`delete_impact` = dry run of the delete in a savepoint, diff of all tables, rolled back: lists every row deleted or changed; `force_delete` cascades or clears references, a location's stock moves or is booked out) |
| 8 | Labels | done | `inventory/labels.py` (`label_info`, `book_out_code`: one package of the batch the code names; no schema change), `label.py` (QR + text with Pillow/segno, Dymo stream, raw TCP send), options flow in two steps (printer model via `label_printers.py`, then host, size, print on book-in, test print), confirm before printing more than 2 labels, `websocket_label.py`, panel: print on book-in, reprint dialog per batch row, scan `PTRY:` to book out, browser print when no printer. CUPS/IPP not built |
| 8a | Receipt printer | open | `receipt.py`: print the shopping list on an ESC/POS receipt printer (see 4a); recipes once they exist |
| 9 | Release | done | services `pantry.book_in` / `book_out` / `print_labels`, README, `release` skill, CHANGELOG, first release 0.1.0 (HACS once the repo is public) |
| 10 | Recipe DB | done | `recipe` (name, servings, instructions, source URL, image URL), `recipe_ingredient` (category node = product type or a more general category as the ingredient key, amount, unit, `text` = name snapshot of the category (typed only while unmatched), optional `note`, optional flag); tab *Rezepte*: list with search, edit dialog, availability per ingredient from stock (category subtree, unit conversion like min stock). Cooking does **not** book out (booking stays manual). Migration 7 (migration 8: seeded product types); `inventory/recipes.py` + `amounts.py` (shared with min stock; a count unit now uses the package content); `websocket_recipe.py`; servings scaling per view (household default comes with phase 13); delete via `deleteMasterRow` |
| 11 | Recipe import | done | `recipe_fetch.py`: page fetch via HA's session, on user click only (15 s timeout, max 5 MB, HTML only, http/https; no private-IP block, so LAN servers like Mealie/Tandoor work; any user). `inventory/recipe_import.py`: schema.org `Recipe` JSON-LD → draft, nothing saved; the recipe dialog confirms it (product type/category suggested, must be checked). `inventory/ingredient_line.py`: German line parser (fractions ½ / 1/2, ranges take the upper value, Chefkoch "Zehe/n" and "Zwiebel(n)" (suffix dropped), leading size word (klein, groß, mittel…) → note, units by name/symbol/plural/alias, amount without unit → Stück, comma/bracket text → note, "n. B."/"nach Belieben" → no amount, "evtl." → optional, qualifier after the unit ("1 TL, gestr. Salz") and a trailing "für/zum/zur …" clause → note, eggs: Eigelb/Eiweiß/Eidotter/Eiklar → text "Ei" (egg category) with note Eigelb/Eiweiß, aliases (Tüte, Stängel, Fläschchen), no amount + "und"/"&" → one ingredient per part), unit matching and dedupe (spelling variants reuse one unit), `unit_add`. Unknown unit (capitalized word between amount and name, unless the category suggestion knows it as an ingredient or a product type starts with it: "2 Zwiebeln rot", "3 Pak Choi" stay 2/3 Stück): the row asks to create it (prefilled) or pick one; save blocked until decided. Commands `pantry/recipe_import`, `pantry/unit_add` in `websocket_recipe.py`; panel `recipe-import.ts`, `unit-add-dialog.ts`. No schema change. Image `@id` references in `@graph` are resolved. Pages without JSON-LD: error. Instagram/free text: phase 19 |
| 12 | Shopping by recipes | open | pick recipes + servings → missing amounts (demand − stock per category) → items on the shopping list (same todo entity), source shown; ingredients with `skip_stock` never go on the list. Egg parts: ingredient rows on the egg product type with note Eigelb/Eiweiß are summed as eggs = whole eggs + max(yolks, whites) (1 Eigelb + 1 Eiweiß = 1 Ei). Offers (supermarket discounts) deferred: see 7 |
| 13 | Week planner | open | `meal_plan(date, slot, recipe_id or free text, servings)`; slots flexible per day (default one per day, more added as needed); default servings = option *Portionen im Haushalt* (3); panel week view; HA `calendar` entity shows the plan |
| 14 | Shopping list from plan | open | plan demand for a date range − stock − forecast (consumption rate from `booking`) → same todo entity |
| 15 | Recipe suggestions for expiring items | open | expiring batches → their categories → recipes ranked by expiring ingredients used and availability; shown in *Ablauf* and the recipe list |
| 16 | Move a whole location | open | *Umlagern* action on a location row: move all its stock to another location (logic exists in `force_delete` for a location; reuse it for a location that stays) |
| 17 | Category mapping feedback | open | `mapping_log` table: each product whose OFF tags matched no category or whose suggested category was changed (EAN, OFF `categories_tags`, suggested and chosen category); view/export to improve the seed `off_tags` (`add_product` already knows both cases) |
| 18 | Opened packages | open | mark a package as opened (no remaining amount): it gets its own stock row with `opened_on`; new inherited field *haltbar nach Anbruch* (days) on category/product, empty = no change (e.g. Nudeln); effective expiry = min(batch expiry, opened_on + days); expiry view, sensors and labels use it |
| 19 | AI interface | open | HA **LLM API** (`homeassistant.helpers.llm`) with tools calling `inventory` → Assist agents and HA's built-in **MCP Server**; no own MCP server. AI recipe import (Instagram caption, free text) via HA `ai_task` |

Order decided 2026-10-16. Data model details are designed (agent `architect`) at the start of each phase.

**Open todos** (check before starting the next phase):

- Next (own branch after `fix/booking-feedback`): localized tooltips (`title` / `aria-label` via `t()`) on icon buttons and fields whose meaning is not obvious.
- After the tooltips: user guide (Anleitung) in German and English; decide first how (e.g. `docs/guide.de.md` + `docs/guide.en.md`, linked from README and the panel, or help texts inside the panel).
- Ongoing: extend the seeded product types (`seed.py`, lowest category level) whenever everyday products are missing; existing DBs get new ones by a migration step (released since 0.1.0).

## 7. Extension points (not built now)

| Later feature | Prepared by |
|---|---|
| Shopping by offers (supermarket discounts) | phase 12 shopping by recipes; no stable public API for offers (Marktguru, kaufDA: scraping only), so deferred |
| User feedback with AI evaluation (users send feedback from the panel; the AI interface groups and summarizes it into issues / plan items) | phase 19 AI interface; needs a feedback table and a panel entry point |
| Best-before date from the camera (read the printed date when booking in) | `expires_on` field and the camera scanner of the booking form; on-device OCR or the AI interface (phase 19) |
| Remaining amount of opened packages / book out by cooking | phase 18 marks opened packages only; cooking does not book out (manual booking) |

New feature = new module + next migration + new websocket commands + new panel tab.
