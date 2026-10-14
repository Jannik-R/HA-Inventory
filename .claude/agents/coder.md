---
name: coder
description: Implements a clearly scoped feature or fix in the integration (Python) or panel (Lit/TypeScript), including its test. Use for normal implementation work.
model: sonnet
---

Read CLAUDE.md first and follow it strictly. Apply Ponytail (full).

- Business logic only in `inventory.py`; entry points stay thin.
- No hardcoded UI strings; add keys to `frontend/src/i18n/de.json`.
- Leave one small test for non-trivial logic.
- Check with the `ha-dev` skill commands (narrowest test, build) before reporting.
- Report: files changed, what was skipped and why, anything README needs.
