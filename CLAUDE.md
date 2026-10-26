# CLAUDE.md

Household inventory (food, batteries, household goods, medicine, home-canned jars) for Home Assistant as a **custom integration** (domain `home_inventory`, integration name "Home Inventory", panel name "Vorrat"). The domain stays `home_inventory` (renaming it breaks existing installs).
Plan and data model: [docs/PLAN.md](docs/PLAN.md). Keep it current when decisions change.

## Working rules

- **Ask first.** Before starting a new feature or a larger task, ask all open questions in one message (numbered, each with a recommendation) and wait for the answers. Do not implement on assumptions; small obvious fixes need no questions.
- **Always use Ponytail** (`/ponytail full`; plugin enabled in `.claude/settings.json`). Laziest solution that works; stdlib and native HA features first; no speculative abstractions.
- **English** for code, comments, commits, docs. **German** only in UI strings (translation files) and in chat with the user.
- **Tasks for the user (setup, manual tests, things Claude must not do itself) are always given as numbered step-by-step instructions**: where to click/what to type, exact commands in their own code block, what the expected result looks like, and what to report back.
- **README is always current, in both languages.** `README.md` (English) and `README.de.md` (German) have the same sections: features, installation, usage (only a link to the guide), setup (label printer, receipt printer, AI check), sensors, services; development only in `README.md`. Every user-visible change to a feature, option, service, sensor or setup step updates both READMEs in the same change (translate, do not summarize; German in the same style as the guide, UI labels as in `de.json`). Labels in the docs are in the doc's own language: panel labels from `frontend/src/i18n/<lang>.json`, everything Home Assistant translates itself (config/options flow steps, fields and selector options, entity and action names) from `translations/<lang>.json`. Data (seeded categories, units, locations, demo products) stays as it is. How to use something (buttons, dialogs, workflows) goes into the user guide (`docs/guide.de.md` + `docs/guide.en.md`, both languages), not the README.
- **Branches**: every phase, feature or fix gets its own branch from current `main` (`phase-<n>-<topic>`, `feature/<topic>`, `fix/<topic>`) and ends with a PR to `main`. `main` is protected (ruleset "Protect main"): merge only via PR with green CI (hassfest, hacs, tests, frontend; PRs run only the affected jobs and test files, the full suite when shared basics or the workflow change; the full suite runs before a release or by hand: Actions > CI > Run workflow), **squash merge only** (linear history; the PR title becomes the commit title, the PR body its message, so write both for `main`). GitHub deletes the remote branch on merge; afterwards update `main` and delete the local branch. Never enable or offer Auto-fix (or auto-merge) for a PR; the user handles CI and merging.
- **Small, encapsulated files.** One responsibility per module; aim for under ~300 lines per file. When a file grows past that or mixes concerns (list + dialog, search flow + form), split it into its own module or Lit element instead of adding to it. Shared helpers go into a module both use, not into one of the users. Splitting is part of the change, not a later cleanup.
- **Panel actions as HA actions**: a new panel action that an automation, NFC tag or voice command could trigger (booking, printing, shopping list, meal plan, canning) also gets a service in `services.py` (names instead of ids, response, `services.yaml` + strings, README table). Master data upkeep, stock corrections and undo stay panel only. See PLAN, *Automations*.
- Do not commit unless asked. Short imperative commit messages ("Add batch booking"). Remote: private GitHub repo; keep layout HACS-compatible. License MIT.
- Never commit dev/runtime data (`dev/config/`, `*.db`, `.env`). Check `.gitignore` when adding anything that writes files.

## Token economy (speed and cost)

Avoid expensive actions unless they are really needed. When a task would need them repeatedly, propose a cheaper setup instead (an MCP server, a script, a CLI tool, a test fixture) and let the user decide.

- Read only what is needed: `Grep` first, then `Read` with `offset`/`limit`. Do not re-read files you just wrote or edited.
- No broad exploration when the file is known. `Explore` agent only for real fan-out searches.
- Cheapest agent that can do the job (see Subagents). `architect` (opus) only for schema/architecture decisions.
- Run the narrowest check: one test file, not the whole suite; build only when the bundle is needed.
- Browser: `read_page`/`get_page_text` over screenshots; screenshots only for visual layout checks.
- Ask before: large web research, browser automation sessions, long-running jobs, multi-agent workflows.
- Keep answers short; no restating of plans or code the user has already seen.
- Use the `ha-dev` skill for HA/test/build commands and filtered logs.
- Between phases (after the phase PR is merged): if the chat context is large, ask the user to run `/compact` (or start a new session) before the next phase. Everything needed must be in the repo (PLAN, CLAUDE.md, README), not only in the chat.
- Examples of cheaper setups to suggest: HA's MCP Server integration on the dev HA (query states/services directly instead of browser clicks), a `scripts/` helper for repeated multi-step commands.

## Layout

```
custom_components/home_inventory/   integration (Python)
  __init__.py               setup: static path, panel, platforms; config_flow.py, const.py
  inventory/                ALL business logic. Websocket, services, entities, AI tools only call `inventory.<name>`
    __init__.py             public API (re-exports); submodules: common, master, inherit, products, suggest, booking, corrections (put back, move, correct, edit stock), labels, codes, queries, amounts, shopping, shopping_recipes, recipes, expiry_recipes, recipe_import, recipe_export (schema.org JSON-LD), ingredient_line, meal_plan, plan_shopping, removal, canning, opened, frozen (freeze / thaw, freezer rule), emergency (emergency stock vs. BBK need), stocktake, notify (read views for the HA events), steps, learned, ai_check, ai_product (AI check of new products), recipe_print, assist (read views for AI tools), ai_import (AI recipe import: prompt, page sources, answer), purchase (receipt import: prompt, answer check, booking, learned receipt lines), cooked (book out a cooked recipe), leftovers (leftovers as a charge, product "Reste: <dish>" in root Reste), diet (allergens / diet per category and product, recipe diet), diet_reload (admin reload from OFF, chunks)
  db.py                     sqlite3 connection, applies the migrations (PRAGMA user_version); signals entities and fires home_inventory_booked after writes
  migrations.py             MIGRATIONS: the schema steps (SQL scripts or callables), one per schema version
  seed.py, keywords.py      default units/locations/categories (new DB only); name keywords for category suggestion
  seed_types.py             seeded product types (lowest category level), shared by seed and migrations 8/9 (`NEW_IN_9`: later additions for existing DBs)
  seed_types_more.py        data only: the larger product type and unit lists added in migration 9 (long by nature)
  migration_15.py           migration 15 SQL (non-food, shelf life, canning recipes, protocols, charges), kept out of migrations.py for size
  migration_20.py           migration 20 SQL (opened packages: opened_days, batch.opened_on, booking kind 'open')
  migration_24.py           migration 24: date kind 'guide' (Richtwert): rebuilds defaults/category/product with the wider CHECK; `set_guide` (fresh produce) also after the seed
  migration_25.py           migration 25: freezing (location.freezer, category.frozen_goods, frozen_days, batch.frozen_on, booking kinds freeze/thaw); `set_frozen` seeds values, also after the seed
  migration_26.py           migration 26: drying (canning.kind, recipe.canning_kind); `add_dried` seeds the root Gedörrtes, also after the seed
  migration_27.py           migration 27: emergency stock group (category.emergency_group); `set_emergency` seeds it, also after the seed
  migration_28.py           migration 28: remaining amount of opened packages (batch.remaining; a partly used package is its own batch, batch_key only for full ones; booking kind 'remaining')
  migration_29.py           migration 29: canning.kind 'leftover' (table rebuilt); root category Reste (`add_leftovers`)
  migration_30.py           migration 30: allergens and diet (category / product `diet`, `allergens`); `set_diet` seeds by name, also after the seed
  off_diet.py, websocket_diet.py  admin reload of allergens / diet from Open Food Facts, one small throttled chunk per call
  seed_general.py           seeded non-food roots and Eingekochtes: added by migrate() after the seed (new DB) and by migration 16 (existing DBs)
  ai.py                     AI check of recipe imports and new products, and reading of shopping receipts, via HA `ai_task` (entity from the options; prompt and answer checks in inventory/ai_check.py)
  recipe_ai.py              recipe import with AI fallback: URL without JSON-LD, pasted text, photo -> ai_task -> draft (inventory/ai_import.py)
  recipe_media.py           media for the AI import: yt-dlp video + caption, image download, hidden `.home_inventory_import` folder in the media dir (ai_task attachments)
  llm_api.py                LLM API `home_inventory` for Assist agents / HA MCP Server: tools per access level (options `llm_access`); write tools call the services
  off.py                    Open Food Facts client
  recipe_fetch.py           recipe page fetch for the import (HA session, on user click only)
  coordinator.py            shared by the entity platforms: coordinator refreshed by DB writes, device
  sensor.py                 expired / expiring-soon sensors (no polling)
  todo.py                   shopping list as todo entity (check; add/delete items by hand)
  calendar.py               read-only meal plan calendar (Speiseplan): all-day event per dish
  backup.py                 locks the DB during HA backups
  events.py                 HA events below_min (after writes) and expired (midnight); booked is fired by db.py per new booking row
  services.py               HA services for automations (booking by code, opening, freezing and thawing a package, printing, recipe on the shopping list, plan a dish, canning, drying) + services.yaml
  websocket.py              websocket commands for the panel: master data, defaults, delete, lookup/search; websocket_stock.py: booking, stock, products, shopping list; websocket_label.py: label, shopping list, recipe and meal plan print, scan commands; websocket_recipe.py: recipe, import, export (JSON-LD) and unit commands; websocket_plan.py: meal plan and meal start time commands; websocket_canning.py: canning / drying / leftover protocol commands (`leftover_store`); websocket_open.py: open, freeze or thaw a package / undo, `home_inventory/remaining` (level); websocket_emergency.py: emergency stock supply; websocket_cooked.py: book out a cooked recipe (proposal, book, undo); websocket_purchase.py: receipt import (read via AI, book); websocket_stocktake.py: stocktaking a location; ws_common.py: shared `db_of` / `run` / `translated` (also used by services, todo); ws_validate.py: shared input validators
  www/                      BUILT frontend bundle `home-inventory-panel.js` + hashed lazy chunks (committed, never edit by hand)
  label.py                  label rendering (Pillow + segno), PNG data urls, raw TCP send to the print server
  receipt.py                receipt printer (ESC/POS): shopping list, recipe or meal plan as raster image, device file or raw TCP
  label_printers.py         label printer models (limits, port, bottom reserve, stream encoder, e.g. Dymo LabelWriter)
  fonts/                    DejaVu Sans Condensed for labels (Pillow's default font has no umlauts), with its LICENSE
frontend/                   panel source (Lit + TypeScript, Vite); licenses.ts: build plugin writing www/THIRD_PARTY_LICENSES.txt; vendor.ts: copies runtime files (OCR) to www/vendor/ (no CDN; notices/: license texts not in the npm packages)
  src/i18n/de.json, en.json UI strings (German, English; other languages fall back to English)
  e2e/                      Playwright specs (local only)
  scripts/check-i18n.mjs    missing/unused UI keys and hardcoded German text (`npm run i18n:check`, runs in CI)
dev/                        dev HA (docker compose); runtime data in dev/config/ is git-ignored
tests/                      pytest (pytest-homeassistant-custom-component)
scripts/receipt_bridge.py   dev only (Windows): raw TCP 9100 -> Windows printer queue, so the dev HA reaches a USB receipt printer
scripts/dev.ps1             dev only (Windows): start/stop the dev HA with the receipt printer bridge
scripts/import_check.py     dev tool only: recipe import check against random Chefkoch pages (skill `import-check`; pages cached in dev/config/; site terms usually forbid automated fetching, so run it rarely)
docs/PLAN.md                architecture and roadmap
docs/guide.de.md, guide.en.md  user guide (German, English), opened from the panel header
README.md, README.de.md      setup and reference (English, German; same sections, development only in README.md)
```

## Backend conventions

- Read skill `ha-integration-rules` before changing the integration.
- Target the current stable Home Assistant release; follow HA developer docs (config flow, `entry.runtime_data`, `async_` naming).
- Blocking I/O (sqlite) only via `hass.async_add_executor_job`. HTTP via HA's shared `aiohttp` session.
- No new Python requirements in `manifest.json` without a strong reason. A package only an optional feature needs is not in the manifest: install it on first use with `homeassistant.requirements.async_process_requirements` (see `recipe_media.YT_DLP`).
- **External services (privacy)**: everything that sends data out of Home Assistant (a request to a third party, the AI, a library the panel loads from a CDN) is one entry in `const.EXTERNAL` (key -> default) with its own switch in the options step *Externe Dienste* (strings in `strings.json` + translations), gated where the data would go out with `external_on(hass, key)` (panel: `hasExternal(key)` in `frontend/src/modules.ts`), and one row in the *Privacy* / *Datenschutz* table of both READMEs. Never add an outgoing call without that. The default (on/off) of every new external service is the user's decision: ask, do not pick one.
- Schema change = new migration step in `migrations.py` (skill `db-migration`). Never edit a step that is merged to `main`; an unmerged step may be edited (then delete `dev/config/home_inventory.db`). `seed.py` only fills a new DB: before the first release, seed changes need no migration (delete the dev DB); after it, existing DBs are fixed by a migration step.
- Booking changes always write a `booking` row. Stock never goes negative (DB constraint).
- User-facing backend text (config flow, services, entity names, errors) via `strings.json` + `translations/de.json` / `en.json`. Raise `HomeAssistantError` with `translation_key`.

## Frontend conventions

- No hardcoded UI text. Every string is a key in `frontend/src/i18n/de.json` **and** `en.json` (same keys and `{placeholders}`; `npm run i18n:check` fails otherwise), used via `t("key")`. New keys: English, dot-separated (`stock.empty`). The panel follows `hass.language` (German, else English); prints and the sidebar title follow the HA system language.
- Dates/numbers via `Intl` with `hass.locale`, never manual formatting.
- Style only with HA theme variables (`--primary-color`, `--card-background-color`, `--primary-text-color`, `--secondary-text-color`, `--divider-color`, `--error-color`, `--warning-color`, toolbar: `--app-header-background-color`, `--app-header-text-color`). Must work in light and dark theme.
- Do not use HA internal elements (`ha-*`, `mwc-*`); they are not public API.
- After frontend changes run the build so `www/home-inventory-panel.js` is updated; CI fails when the committed bundle differs from a fresh build.
- Formatting: Prettier (`npm run format`, CI runs `format:check`); generated files are listed in `frontend/.prettierignore`. Python: ruff (config in `pyproject.toml`, CI runs `ruff check` and `ruff format --check`).
- Interactive elements that E2E tests use get a stable `data-testid` (`frontend/e2e/`).
- **Tests never call the real AI.** `fixtures.ts` answers `home_inventory/recipe_ai_check` and `home_inventory/product_ai_check` with `{status: "off"}` and refuses `home_inventory/recipe_import` and `home_inventory/receipt_read` (they reach the AI) unless a test stubs them (`wsStub`); backend tests patch `ai._generate` and `recipe_media.video` (yt-dlp).
- **Tests never print.** E2E specs import `test`/`expect` from `frontend/e2e/fixtures.ts`, which blocks every `home_inventory/print_*` command (labels, shopping list, recipe, meal plan; the dev HA may have the real printers configured); `playwright.config.ts` refuses to run otherwise. Backend tests patch `label.send`. Sending anything to the real printer (scripts, manual checks) needs the user's OK first, one label at a time.

## UI / UX

Calm, functional, looks like a tool, not like a demo.

- Lists and tables over card grids. Dense but readable. Clear hierarchy through typography and spacing, not color.
- One primary action per view. Scan/search input is always focused where it makes sense (hardware scanners type into it).
- No gradients, glows, glassmorphism, emoji, sparkle icons, oversized rounded cards, hero headers, or decorative illustrations.
- Inherited values (from parent category or defaults) are shown in `--secondary-text-color` with their source ("von Nudeln"); own values in normal text. Editing an inherited field creates an own value; a reset action removes it.
- Color only for meaning: expired (error), expiring soon (warning), below min stock.
- Icons: MDI only, sparingly, always with text or `aria-label`.
- Mobile first (phone in the kitchen), works on tablet/desktop. Keyboard accessible, visible focus.
- **Lists**: every row ends with an edit (pencil) and a delete (bin) icon button, via `rowActions` in `frontend/src/ui.ts` (delete only where the user may delete, e.g. admin); tree rows also get an add-child (plus) icon and start with the open/close arrow (`chevron`, state via `toggled`). Clicking the row opens/closes it when it has children (tree), otherwise it opens the edit dialog. Delete always asks first (`confirmDelete` in `frontend/src/confirm-dialog.ts`, never the browser's `confirm()`) and names what goes with it (e.g. stock). Master data that may be in use is deleted via `deleteMasterRow` (`frontend/src/delete-flow.ts`): the backend dry-runs the delete and the question lists every row it removes or changes, then deletes it along; never a dead-end "in use" error. New cascades need no extra code there.
- **Dialogs** (all modal `<dialog>`, helpers in `frontend/src/ui.ts`; edit/add dialogs use `editDialog`, which already implements the rules below):
  - Title = action + object: "„Kühlschrank“ bearbeiten", "Lagerort hinzufügen", "Kategorie wählen".
  - Labels above fields (placeholders never replace a label); units as text after the input ("Tage", "g").
  - First field focused on open; Enter submits; field errors live (see forms).
  - Actions at the bottom, right-aligned: "Abbrechen" first, the one primary action last (rightmost), named by a verb ("Speichern", "Übernehmen").
  - Only save + cancel inside; delete, add-child etc. are icons on the list row, never in the dialog.
  - Closing: a click beside it (`backdropClick`) or Esc (`escGuard`) closes it; with unsaved changes both ask "Änderungen verwerfen?" first. "Abbrechen" discards without asking (deliberate).
  - Backend errors show above the actions; width `min(480px, 100vw - 32px)`, content scrolls inside on small screens.
- **Wording for inherited values**: always "Geerbt: <Wert> (<Quelle>)" (key `common.default`), never "Vorgabe" or "Erben"; source "von <Kategorie>", "vom Produkt", "Standard" or "zuletzt benutzt".
- **Forms validate live**: every form computes its field errors on each render (an `errors()` function), shows them under the field (`fieldMsg`, `aria-invalid` red border) and disables its primary button while any exist. A field shows its error only once it was edited or left (`data-touched`, set globally in `home-inventory-panel.ts`, cleared when an `editDialog` closes), so a new form does not open in red. Warnings that must not block (e.g. a past date) use the hint style. The submit handler re-checks; the backend still validates (trust boundary).

## Commands

```bash
docker compose -f dev/docker-compose.yml run --rm test   # backend tests, parallel (pytest-xdist; see skill ha-dev)
cd frontend && npm run build          # build panel bundle
cd frontend && npm run dev            # watch build
cd frontend && npm run test:e2e       # Playwright against the running dev HA (local only)
cd frontend && npm run docs:screenshots  # regenerate the guide screenshots in docs/images (dev HA)
cd frontend && npm run typecheck:e2e  # type-check the E2E specs (runs in CI)
docker compose -f dev/docker-compose.yml run --rm --entrypoint sh test -c "pip install -q -r requirements_test.txt && ruff check --fix . && ruff format ."   # Python lint + format (CI checks both)
docker compose -f dev/docker-compose.yml up -d homeassistant   # dev HA on :8123
pwsh scripts/dev.ps1                  # Windows: dev HA + receipt printer bridge (-Stop, -Proxy, -NoBridge)
```

## Subagents (`.claude/agents/`)

Use the cheapest agent that can do the job.

**Always delegate to these agents; this is the standing request to use subagents.** The main session (often Opus) only asks the questions, plans, coordinates, checks agent results and handles git/PRs. Implementation goes to `coder`, i18n/README/guide/small fixes to `chore`, reviews to `reviewer`, schema/architecture to `architect`. Only trivial one-step edits (a single line, a config value) stay in the main session.

| Agent | Model | Use for |
|---|---|---|
| `architect` | opus | data model/migration design, new modules, cross-cutting decisions, phase planning |
| `coder` | sonnet | implementing a planned feature (backend or frontend) incl. its test |
| `chore` | haiku | translations, README/doc updates, renames, small fixes, boilerplate from an existing pattern |
| `reviewer` | sonnet | review a finished change against this file (correctness, over-engineering, i18n, UX rules) |

Read-only codebase searches: built-in `Explore` agent.
Flow for a feature: `architect` (only if it touches schema or architecture) → `coder` → `chore` (i18n/README) → `reviewer`.
