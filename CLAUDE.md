# CLAUDE.md

Food inventory for Home Assistant as a **custom integration** (domain `pantry`, UI name "Vorrat").
Plan and data model: [docs/PLAN.md](docs/PLAN.md). Keep it current when decisions change.

## Working rules

- **Always use Ponytail** (`/ponytail full`; plugin enabled in `.claude/settings.json`). Laziest solution that works; stdlib and native HA features first; no speculative abstractions.
- **English** for code, comments, commits, docs. **German** only in UI strings (translation files) and in chat with the user.
- **README.md is always current.** Every user-visible change (feature, option, service, setup step) updates README in the same change.
- Do not commit unless asked. Branch `main`; short imperative commit messages ("Add batch booking"). Remote: private GitHub repo; keep layout HACS-compatible. License MIT.
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
- Examples of cheaper setups to suggest: HA's MCP Server integration on the dev HA (query states/services directly instead of browser clicks), a `scripts/` helper for repeated multi-step commands.

## Layout

```
custom_components/pantry/   integration (Python)
  inventory.py              ALL business logic. Websocket, services, entities, AI tools only call this.
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

- Target the current stable Home Assistant release; follow HA developer docs (config flow, `entry.runtime_data`, `async_` naming).
- Blocking I/O (sqlite) only via `hass.async_add_executor_job`. HTTP via HA's shared `aiohttp` session.
- No new Python requirements in `manifest.json` without a strong reason.
- Schema change = new migration step in `db.py`. Never edit an existing step.
- Booking changes always write a `booking` row. Stock never goes negative (DB constraint).
- User-facing backend text (config flow, services, entity names, errors) via `strings.json` + `translations/de.json` / `en.json`. Raise `HomeAssistantError` with `translation_key`.

## Frontend conventions

- No hardcoded UI text. Every string is a key in `frontend/src/i18n/de.json`, used via `t("key")`. New keys: English, dot-separated (`stock.empty`).
- Dates/numbers via `Intl` with `hass.locale`, never manual formatting.
- Style only with HA theme variables (`--primary-color`, `--card-background-color`, `--primary-text-color`, `--secondary-text-color`, `--divider-color`, `--error-color`, `--warning-color`). Must work in light and dark theme.
- Do not use HA internal elements (`ha-*`, `mwc-*`); they are not public API.
- After frontend changes run the build so `www/pantry-panel.js` is updated.

## UI / UX

Calm, functional, looks like a tool, not like a demo.

- Lists and tables over card grids. Dense but readable. Clear hierarchy through typography and spacing, not color.
- One primary action per view. Scan/search input is always focused where it makes sense (hardware scanners type into it).
- No gradients, glows, glassmorphism, emoji, sparkle icons, oversized rounded cards, hero headers, or decorative illustrations.
- Inherited values (from parent category or defaults) are shown in `--secondary-text-color` with their source ("von Nudeln"); own values in normal text. Editing an inherited field creates an own value; a reset action removes it.
- Color only for meaning: expired (error), expiring soon (warning), below min stock.
- Icons: MDI only, sparingly, always with text or `aria-label`.
- Mobile first (phone in the kitchen), works on tablet/desktop. Keyboard accessible, visible focus.

## Commands

```bash
docker compose -f dev/docker-compose.yml run --rm test   # backend tests (see skill ha-dev)
cd frontend && npm run build          # build panel bundle
cd frontend && npm run dev            # watch build
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
