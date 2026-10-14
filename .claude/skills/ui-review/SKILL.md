---
name: ui-review
description: Check a panel view in the dev HA browser at phone width, light and dark theme, against the CLAUDE.md UI/UX rules, with few screenshots. Use after frontend changes before a PR.
---

# UI review (dev HA, built-in browser)

Prereq: `cd frontend && npm run build`, dev HA running (skill `ha-dev`). No login needed: the dev HA trusts localhost (`trusted_networks` in `dev/configuration.yaml`). If a login page appears anyway, reload once.

## Steps

1. `navigate` to `http://localhost:8123/pantry/<tab>[/<sub>]`, then `resize_window` preset `mobile` (`colorScheme: dark`).
2. The panel lives in shadow DOM: `find`/`read_page` do not see it. Use `javascript_tool` with a deep query helper:
   ```js
   const deep=(root,sel)=>{const r=[];const walk=n=>{n.querySelectorAll(sel).forEach(e=>r.push(e));n.querySelectorAll('*').forEach(e=>e.shadowRoot&&walk(e.shadowRoot))};walk(root);return r};
   const s = deep(document,'pantry-settings')[0].shadowRoot;   // element of the view
   ```
   Click rows/buttons from JS and read text or `getComputedStyle` instead of screenshots. Call component methods directly when useful (e.g. `el.toggle(id)`).
   Do not `location.reload()` inside a script that also waits (the script is cut off); reload in its own call.
3. Screenshots only for layout: one per view state at `scale` 0.6–0.8; the screenshot is scaled, compute click coordinates in the reported coordinate frame (or click from JS).
4. Repeat 1–3 with `colorScheme: light`, and once at preset `desktop`. Reset to `desktop` at the end.

## Checklist (CLAUDE.md UI/UX)

- Inherited values (empty own value) in `--secondary-text-color` with source ("von X" / "Standard"); own values in primary text; reset action present for own values.
- One primary (filled) button per view; navigation is not filled.
- No hardcoded text (all via `t()`), German plural forms right (`Intl.PluralRules`), numbers/dates via `Intl`.
- Backend errors shown translated in the user language (`errorMessage` in `src/api.ts`).
- Lists, not card grids; readable at 375 px, no horizontal scroll; dialogs fit the screen.
- Keyboard: visible focus, Enter submits, Esc closes dialogs, icons have `aria-label`.
- Light and dark theme: no hardcoded colors.
