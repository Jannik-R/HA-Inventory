# CLAUDE.md

Food inventory for Home Assistant as a **custom integration** (domain `pantry`, UI name "Vorrat").
Plan and data model: [docs/PLAN.md](docs/PLAN.md). Keep it current when decisions change.

## Working rules

- **Always use Ponytail** (`/ponytail full`; plugin enabled in `.claude/settings.json`). Laziest solution that works; stdlib and native HA features first; no speculative abstractions.
- **English** for code, comments, commits, docs. **German** only in UI strings (translation files) and in chat with the user.
- **Tasks for the user (setup, manual tests, things Claude must not do itself) are always given as numbered step-by-step instructions**: where to click/what to type, exact commands in their own code block, what the expected result looks like, and what to report back.
- **README.md is always current.** Every user-visible change (feature, option, service, setup step) updates README in the same change.
- **Branches**: every phase, feature or fix gets its own branch from current `main` (`phase-<n>-<topic>`, `feature/<topic>`, `fix/<topic>`) and ends with a PR to `main`. `main` is protected (ruleset "Protect main"): merge only via PR with green CI (hassfest, hacs, tests, frontend). Delete the branch after merge.
- **Small, encapsulated files.** One responsibility per module; aim for under ~300 lines per file. When a file grows past that or mixes concerns (list + dialog, search flow + form), split it into its own module or Lit element instead of adding to it. Shared helpers go into a module both use, not into one of the users. Splitting is part of the change, not a later cleanup.
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
custom_components/pantry/   integration (Python)
  inventory/                ALL business logic. Websocket, services, entities, AI tools only call `inventory.<name>`
    __init__.py             public API (re-exports); submodules: common, master, inherit, products, suggest, booking, queries
  db.py                     sqlite3 schema + migrations (PRAGMA user_version)
  off.py                    Open Food Facts client
  label.py                  label PNG rendering + optional IPP printing
  websocket.py              websocket commands for the panel
  www/pantry-panel.js       BUILT frontend bundle (committed, do not edit by hand)
frontend/                   panel source (Lit + TypeScript, Vite)
  src/i18n/de.json          UI strings
dev/                        dev HA (docker compose); runtime data in dev/config/ is git-ignored
tests/                      pytest (pytest-homeassistant-custom-component)
docs/PLAN.md                architecture and roadmap
```

## Backend conventions

- Read skill `ha-integration-rules` before changing the integration.
- Target the current stable Home Assistant release; follow HA developer docs (config flow, `entry.runtime_data`, `async_` naming).
- Blocking I/O (sqlite) only via `hass.async_add_executor_job`. HTTP via HA's shared `aiohttp` session.
- No new Python requirements in `manifest.json` without a strong reason.
- Schema change = new migration step in `db.py`. Never edit a step that is merged to `main`; an unmerged step may be edited (then delete `dev/config/pantry.db`). `seed.py` only fills a new DB: before the first release, seed changes need no migration (delete the dev DB); after it, existing DBs are fixed by a migration step.
- Booking changes always write a `booking` row. Stock never goes negative (DB constraint).
- User-facing backend text (config flow, services, entity names, errors) via `strings.json` + `translations/de.json` / `en.json`. Raise `HomeAssistantError` with `translation_key`.

## Frontend conventions

- No hardcoded UI text. Every string is a key in `frontend/src/i18n/de.json`, used via `t("key")`. New keys: English, dot-separated (`stock.empty`).
- Dates/numbers via `Intl` with `hass.locale`, never manual formatting.
- Style only with HA theme variables (`--primary-color`, `--card-background-color`, `--primary-text-color`, `--secondary-text-color`, `--divider-color`, `--error-color`, `--warning-color`, toolbar: `--app-header-background-color`, `--app-header-text-color`). Must work in light and dark theme.
- Do not use HA internal elements (`ha-*`, `mwc-*`); they are not public API.
- After frontend changes run the build so `www/pantry-panel.js` is updated.
- Interactive elements that E2E tests use get a stable `data-testid` (`frontend/e2e/`).

## UI / UX

Calm, functional, looks like a tool, not like a demo.

- Lists and tables over card grids. Dense but readable. Clear hierarchy through typography and spacing, not color.
- One primary action per view. Scan/search input is always focused where it makes sense (hardware scanners type into it).
- No gradients, glows, glassmorphism, emoji, sparkle icons, oversized rounded cards, hero headers, or decorative illustrations.
- Inherited values (from parent category or defaults) are shown in `--secondary-text-color` with their source ("von Nudeln"); own values in normal text. Editing an inherited field creates an own value; a reset action removes it.
- Color only for meaning: expired (error), expiring soon (warning), below min stock.
- Icons: MDI only, sparingly, always with text or `aria-label`.
- Mobile first (phone in the kitchen), works on tablet/desktop. Keyboard accessible, visible focus.
- **Lists**: every row ends with an edit (pencil) and a delete (bin) icon button, via `rowActions` in `frontend/src/ui.ts` (delete only where the user may delete, e.g. admin); tree rows also get an add-child (plus) icon and start with the open/close arrow (`chevron`, state via `toggled`). Clicking the row opens/closes it when it has children (tree), otherwise it opens the edit dialog. Delete always asks first and names what goes with it (e.g. stock).
- **Dialogs** (all modal `<dialog>`, helpers in `frontend/src/ui.ts`; edit/add dialogs use `editDialog`, which already implements the rules below):
  - Title = action + object: "„Kühlschrank“ bearbeiten", "Lagerort hinzufügen", "Kategorie wählen".
  - Labels above fields (placeholders never replace a label); units as text after the input ("Tage", "g").
  - First field focused on open; Enter submits; field errors live (see forms).
  - Actions at the bottom, right-aligned: "Abbrechen" first, the one primary action last (rightmost), named by a verb ("Speichern", "Übernehmen").
  - Only save + cancel inside; delete, add-child etc. are icons on the list row, never in the dialog.
  - Closing: a click beside it (`backdropClick`) or Esc (`escGuard`) closes it; with unsaved changes both ask "Änderungen verwerfen?" first. "Abbrechen" discards without asking (deliberate).
  - Backend errors show above the actions; width `min(480px, 100vw - 32px)`, content scrolls inside on small screens.
- **Wording for inherited values**: always "Geerbt: <Wert> (<Quelle>)" (key `common.default`), never "Vorgabe" or "Erben"; source "von <Kategorie>", "vom Produkt", "Standard" or "zuletzt benutzt".
- **Forms validate live**: every form computes its field errors on each render (an `errors()` function), shows them under the field (`fieldMsg`, `aria-invalid` red border) and disables its primary button while any exist. Warnings that must not block (e.g. a past date) use the hint style. The submit handler re-checks; the backend still validates (trust boundary).

## Commands

```bash
docker compose -f dev/docker-compose.yml run --rm test   # backend tests (see skill ha-dev)
cd frontend && npm run build          # build panel bundle
cd frontend && npm run dev            # watch build
cd frontend && npm run test:e2e       # Playwright against the running dev HA (local only)
docker compose -f dev/docker-compose.yml up -d homeassistant   # dev HA on :8123
```

## Subagents (`.claude/agents/`)

Use the cheapest agent that can do the job.

| Agent | Model | Use for |
|---|---|---|
| `architect` | opus | data model/migration design, new modules, cross-cutting decisions, phase planning |
| `coder` | sonnet | implementing a planned feature (backend or frontend) incl. its test |
| `chore` | haiku | translations, README/doc updates, renames, small fixes, boilerplate from an existing pattern |
| `reviewer` | sonnet | review a finished change against this file (correctness, over-engineering, i18n, UX rules) |

Read-only codebase searches: built-in `Explore` agent.
Flow for a feature: `architect` (only if it touches schema or architecture) → `coder` → `chore` (i18n/README) → `reviewer`.
