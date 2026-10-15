---
name: feature-checklist
description: Checklist to take a pantry feature from idea to merged PR - which layers to touch (inventory, db, websocket, panel, i18n, sensors), tests, docs, checks and the PR. Use when starting or finishing any feature, fix or phase in this repo, so nothing is forgotten.
---

Follow CLAUDE.md; this is the order that works in this repo. Skip lines that do not apply.

## Before coding

- [ ] Branch from current `main`: `phase-<n>-<topic>`, `feature/<topic>` or `fix/<topic>`.
- [ ] Schema change? → skill `db-migration` first. Architecture change? → `architect` agent.
- [ ] Read the files the change touches (Grep first). Note every caller of a function you change.

## Backend (`custom_components/pantry/`, read skill `ha-integration-rules`)

- [ ] Logic only in `inventory/<module>.py`; export it in `inventory/__init__.py` (`__all__`, sorted).
- [ ] User-facing errors: `InventoryError("<key>")` + `exceptions.<key>` in `strings.json`, `translations/en.json`, `translations/de.json`.
- [ ] Websocket command in `websocket.py`: voluptuous schema, `@require_admin` for master data, register in `async_register`.
- [ ] Writes go through `Database.run` → entities refresh by themselves (dispatcher).
- [ ] Tests: logic in `tests/test_inventory.py` (in-memory DB), command in `tests/test_websocket.py`.

## Panel (`frontend/src/`)

- [ ] API call + types in `api.ts`.
- [ ] New view/dialog = own file / Lit element (keep files under ~300 lines); shared helpers in `ui.ts`, `format.ts`, shared CSS `formStyles` in `styles.ts`.
- [ ] UI rules (CLAUDE.md): row actions via `rowActions`, dialogs via `editDialog`, questions via `confirmDialog` / `confirmDelete`, live validation with `fieldMsg`, theme variables only, `data-testid` on what E2E uses.
- [ ] Strings only via `t("key")` in `i18n/de.json`.
- [ ] E2E spec in `frontend/e2e/` (own test data, cleans up, never touches other data).

## Checks (narrowest first)

```bash
docker compose -f dev/docker-compose.yml run --rm test tests/<file>.py -q   # backend
cd frontend && npm run i18n:check && npm run format:check && npm run build
docker compose -f dev/docker-compose.yml restart homeassistant              # new backend code
cd frontend && npx playwright test                                           # E2E, local only
```

- [ ] Look at it in the dev HA (skill `ui-review` for layout: phone width, light + dark).

## Docs

- [ ] README: every user-visible change (usage section, features list, status line).
- [ ] `docs/PLAN.md`: phase row / status, data model, decisions that changed.
- [ ] CLAUDE.md layout list when files were added or removed.

## Hand-over

- [ ] Tell the user what changed and numbered steps to test it; wait for "passt".
- [ ] Commit only when asked; PR to `main` (CI: hassfest, hacs, tests, frontend). No Auto-fix.
- [ ] After merge: delete the branch, pull `main`; between phases suggest `/compact`.
