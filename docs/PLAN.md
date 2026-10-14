# Implementation Plan

Food inventory ("Vorrat") as a Home Assistant **custom integration** (no add-on).
Everything runs inside the HA process; UI is a sidebar panel.

## 1. Architecture

```
HA sidebar panel (Lit web component, one bundled JS file)
        │  hass.callWS(...)
        ▼
websocket.py ── services (services.yaml) ── LLM API tools (later)
        │                │                        │
        └────────────────┴──── inventory.py ──────┘   ← all business logic, one place
                                   │
                         db.py (stdlib sqlite3, <config>/pantry.db)
                                   │
              off.py (Open Food Facts lookup, result cached in `product`)
              label.py (render label PNG, send via IPP to CUPS)

Entities: sensor (expiring / expired / below-min counts), todo (shopping list)
```

Rule: **every** entry point (panel, services, automations, future AI tools) calls
`inventory.py`. No logic in websocket handlers or entities.

### Key decisions

| Topic | Decision | Why |
|---|---|---|
| Domain | `pantry` | English code; UI says "Vorrat" |
| Storage | stdlib `sqlite3`, one file in config dir, schema via `PRAGMA user_version` migrations | relational data, constraints, growing booking log, recipes later. No dependency. |
| Backup safety | `backup.py` platform (`async_pre_backup` / `async_post_backup`) closes/locks DB | prevents corrupt DB in HA backups |
| DB access | executor jobs, one connection + lock | `shortcut:` single lock, fine for a household |
| Product data | Open Food Facts API v2 (EAN), `cgi/search.pl` for names (10 req/min: explicit search only); local products first; OFF result stored in `product` table on first booking | free, good DE coverage; local copy = cache |
| Frontend → backend | HA websocket commands | panel already has authenticated `hass` |
| Permissions | booking, lookup, search, stock: every HA user; master data writes and product delete: admin only | the kitchen phone may use a non-admin account |
| Automations | HA services (`pantry.book_in`, `pantry.book_out`, `pantry.print_labels`, ...) | scanners/NFC/ESPHome can call them |
| Shopping list | own `todo` entity | native HA list UI, mobile app, Assist |
| Panel | `panel_custom` + static path, Lit + TypeScript, Vite build → committed `www/` (main file + lazy chunks with hashed names); panel URL `?v=<bundle mtime>` busts the browser cache on every build | HACS needs built file |
| UI components | own small Lit components styled with HA theme CSS vars; **no** internal `ha-*` elements | internal elements are not public API and break on HA updates |
| List rows | pencil (edit) + bin (delete) icons on every row, plus (add child) on tree rows (`rowActions`); row click = open/close a tree node, else edit | one pattern on every page; see CLAUDE.md UI/UX |
| Dialogs | modal; title = action + object; "Abbrechen" + primary right-aligned (primary last); only save + cancel inside (row icons cover the rest); click beside / Esc close, asking first when there are unsaved changes | common dialog guidelines (Material, Apple HIG); see CLAUDE.md UI/UX |
| Form validation | live: field errors under the field while typing, primary button disabled until valid; hints (e.g. past date) never block; backend validates again | errors before booking, not after; see CLAUDE.md UI/UX |
| Barcode (hardware) | USB/BT scanners act as keyboard → the normal, always-focused input field | zero code |
| Barcode (camera) | native `BarcodeDetector`, polyfill `barcode-detector` (zxing-wasm) loaded only when missing (iOS/Firefox/Windows); the wasm is bundled in a lazy chunk (~1.4 MB, ~600 kB gzip), never fetched from a CDN | camera needs HTTPS (or localhost); works offline in the LAN |
| Label printing | backend renders PNG (Pillow + `segno` for QR), sends it via **IPP Print-Job** to a CUPS queue. No dialog. | works from panel, services and automations; any IPP printer works |
| i18n backend | HA standard: `strings.json` + `translations/{de,en}.json` | config flow, services, entities |
| i18n frontend | `frontend/src/i18n/<lang>.json`, `t(key, params)`, language from `hass.language`, fallback `de` | dates/numbers via `Intl` with `hass.locale` |
| Distribution | private GitHub repo now; layout HACS-compatible from day 1 (`hacs.json`, built bundle committed, GitHub releases) | publishing later = make repo public |
| License | MIT | free use/modification, copyright notice must be kept (= attribution) |

## 2. Data model

```
unit       (id, name, symbol, base_unit_id NULL → unit, factor,
            is_count)   -- 1 = counts packages (Stück, Packung, Dose ...)
           -- seeded: Stück, Packung, g, kg (=1000 g), ml, l (=1000 ml); user can add (Dose, Glas, Bund ...)
location   (id, name, sort)
category   (id, parent_id NULL → category, name, sort, off_tags JSON,
            unit_id, default_location_id, expiry_type, warn_days,   -- inheritable, NULL = inherit
            min_stock NULL,                                          -- amount in the node's unit; NOT inherited, see below
            min_packages NULL)                                       -- package count (> 0); NOT inherited; added in Phase 7 migration
product    (id, ean UNIQUE NULL, name, brand, category_id → category,
            content_amount, content_unit_id,                         -- e.g. 500 g per package
            default_location_id, expiry_type, warn_days,              -- overrides, NULL = inherit
            image_url, off_json, updated_at)
batch      (id, product_id, expires_on DATE, expiry_type 'best_before'|'use_by', created_at)
stock      (batch_id, location_id, packages > 0, PRIMARY KEY(batch_id, location_id))
label      (id TEXT short random, batch_id, location_id, printed_at, used_at NULL)   -- added in Phase 8 migration
booking    (id, ts, kind 'in'|'out'|'move'|'correct', batch_id, location_id,
            to_location_id,                      -- only 'move' (location_id = source)
            packages,                            -- always positive; 'correct' = signed difference
            source 'scan'|'manual'|'label'|'service', user_id)
```

### Category tree

One self-referencing `category` table, any depth. Convention (not enforced):
**main category → category → food type**, e.g. `Nudeln, Reis & Getreide → Nudeln → Spaghetti`.
Products attach to any node, normally the leaf.

- **Inheritance**: `unit`, `default_location`, `expiry_type`, `warn_days` resolve
  product → its category → parent … → root → integration defaults (options).
  The API returns each effective value with its source (`own` | category id | `default`);
  the UI renders inherited values in secondary text color with "von <Kategorie>".
- **Min stock** is set on any node and counts its **whole subtree**. Two independent minimums
  per node, each optional: an **amount** (`min_stock`, in the node's effective unit, e.g. 500 g)
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
  via `unit.base_unit_id/factor`. Unit `Stück`/`Packung` = count packages.
  Product without convertible content → counted as unknown, flagged in UI.
- Recipes later reference a category node: "Nudeln" accepts any pasta, "Spaghetti" only spaghetti.

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
category (suggested from OFF categories). Then: expiry date (+ type, default inherited),
packages, location (default inherited / last used). "Print labels" toggle (default from options)
→ one label per package, printed immediately.

**Book out**: the same single input.
- `PTRY:<label_id>` → that package, that batch, that location. Label marked used.
- EAN / name → product → batch with **earliest expiry first** (FEFO),
  location = only one / last used. Override possible.

**Overview**: grouped by category tree → product → batch/location; search (name, brand,
EAN, category, location); location filter.

**Expiring**: sorted by date; threshold = effective `warn_days` per product, plus a view-wide
override field (session only, not saved). Expired listed first.

**Min stock / shopping list**: every category node below its `min_stock` and/or `min_packages`
→ todo item "Nudeln – 1,5 kg fehlen" / "Spaghetti – 2 Packungen fehlen" / both in one item. Recomputed on every booking. Checked items stay hidden until stock changes.

## 4. Label printing (Dymo LabelWriter 450)

The 450 is USB-only, so the network part is CUPS:

```
HA (pantry) ──IPP Print-Job (PNG)──▶ CUPS on the Pi (container, USB passthrough,
                                      printer-driver-dymo) ──USB──▶ LabelWriter 450
```

Options (config flow → options): printer URI (`ipp://<pi>:631/printers/dymo`),
CUPS media name, label width/height mm, DPI, auto-print on book-in.
Label content: QR `PTRY:<id>`, product name, expiry date, short ID as text.
Test print button in options. README documents the CUPS container setup (compose template).

Network printing is **optional**: no printer URI configured → labels still work, the panel
opens the same PNG in the browser print view (`@page` sized to the label). Camera scanner
works on the Pi installation via HTTPS (cloud / local reverse proxy).
`shortcut: IPP only; add raw/other transports when a printer without IPP/CUPS is needed.`

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
| Format hook (`.claude/hooks/format.mjs`) | ready; runs ruff / prettier if installed, silent otherwise | prettier active after Phase 0 (`frontend/` exists); ruff via `pip install ruff` |
| Serena MCP (symbol-level code navigation) | planned | after Phase 1, when the code base is big enough to pay off; needs `uv` |
| Playwright UI tests (`@playwright/test` in `frontend/`, `npm run test:e2e`): repeatable click-through tests of the panel against the local dev HA (no login via `trusted_networks`), run **locally only** (not in CI: each run would need an HA container + browser, ~5-8 billed GitHub Actions minutes, while the private repo has 2,000 free minutes/month; locally it takes seconds). Once the repo is public (Actions free), an E2E CI job can be enabled. Elements addressed by stable `data-testid` attributes (Playwright pierces shadow DOM); each test creates its own data and cleans up. Runs in the installed Edge (`channel: msedge`), no browser download | ready | booking flow covered; extend per phase |
| `feature-checklist` skill + missing-i18n-key script | planned | after Phase 4 (first complete feature end to end = the pattern to write down) |
| `ha-integration-rules` skill: condensed HA dev rules (config flow, `runtime_data`, translations, service registration, quality scale items that matter here) | ready | |
| `db-migration` skill: add a migration step, test upgrade from a fixture DB of the previous version, backup note | planned | after Phase 1 (first schema exists) |
| `off-api` skill: Open Food Facts endpoints, fields used, User-Agent, rate limits, seed tag check | ready | |
| `ui-review` skill: check a view in the browser at phone width, light + dark theme, against the UX rules | ready | |
| `release` skill: version bump in `manifest.json`, build, changelog, tag, GitHub release, HACS validation | planned | Phase 9 |

Frontend build runs locally (Node LTS). Backend tests run in a container based on the HA
image (Python version always matches HA; HA does not run on Windows natively).

## 6. Phases

Each phase ends with: tests green, README updated, checked in dev HA.

| # | Phase | Content |
|---|---|---|
| 0 | Foundation | integration skeleton, config flow (single instance), panel shell, i18n, CI: hassfest + HACS action + pytest + frontend build |
| 1 | Core | `db.py` schema + migrations + seed, `inventory.py` (book in/out/move/correct, inheritance resolution, queries), backup platform (moved up from Phase 9: real data exists from now on), tests |
| 2 | Product lookup | `off.py`, search, category suggestion |
| 3 | Master data UI | locations, units, category tree with inherited values |
| 4 | Booking UI | book in/out, keyboard scanner field, camera scanner. Required fix: click beside a dialog must close it (code was there, browsers kept the old cached bundle: panel URL now busts the cache with the bundle mtime) |
| 5 | Overview + search | stock list, filters |
| 6 | Expiry | expiry view with temporary threshold, sensors |
| 7 | Min stock | migration `min_packages`, both minimums per node (each optional, any level) in settings UI and shopping list, todo entity |
| 8 | Labels | `label.py`, IPP printing, options, scan-to-consume |
| 9 | Release | services, README, HACS release |

## 7. Extension points (not built now)

| Later feature | Prepared by |
|---|---|
| Recipe DB | category nodes as ingredient key; `recipe`, `recipe_ingredient(category_id, amount, unit_id)` |
| Week planner | `meal_plan(date, slot, recipe_id, servings)` |
| Shopping list from plan | plan demand − stock − forecast from `booking` consumption rate → same todo entity |
| Recipe suggestions for expiring items | expiry query returns category ids → match recipes |
| AI interface | HA **LLM API** (`homeassistant.helpers.llm`) with tools calling `inventory.py` → usable by Assist agents and HA's built-in **MCP Server** integration. No own MCP server. |
| Recipe import | websites: schema.org `Recipe` JSON-LD; Instagram etc.: caption text → LLM parse |
| Shopping by recipes / offers | separate module; source TBD (no stable public API for app discounts) |
| Category mapping feedback | log each product whose OFF tags matched no category or whose suggestion the user changed (EAN, OFF `categories_tags`, suggested and chosen category) in a `mapping_log` table; export/view it to improve the seed `off_tags` in code (`add_product` already knows both cases) |
| Partially used packages | `stock.packages` → REAL or separate `opened` amount; not needed yet |
| Styled confirm dialog | replace native `confirm()` (delete questions, "Änderungen verwerfen?") with an own modal `<dialog>` in `ui.ts` following the dialog rules (title, "Abbrechen" + destructive action right, danger color for delete); returns a Promise so call sites stay one line |

New feature = new module + next migration + new websocket commands + new panel tab.
