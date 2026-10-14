---
name: ha-dev
description: Run and inspect the dev Home Assistant and the backend tests for this repo - start/restart HA, read only the pantry log lines, run pytest in the container, build the panel. Use whenever a change must be checked in HA or tested, instead of figuring out commands or reading full logs.
---

All commands from the repo root. Compose file: `dev/docker-compose.yml` (shortened to `$C` below).

```bash
C="docker compose -f dev/docker-compose.yml"
```

| Goal | Command |
|---|---|
| Start HA (http://localhost:8123) | `$C up -d homeassistant` |
| Apply Python changes | `$C restart homeassistant` (integration is mounted, no copy needed) |
| Pantry log lines only | `$C logs homeassistant --since 5m 2>&1 \| grep -iE "pantry\|Traceback" \| tail -40` |
| Errors only | `$C logs homeassistant --since 5m 2>&1 \| grep -E "ERROR\|Traceback" -A5 \| tail -60` |
| One test file | `$C run --rm test tests/test_inventory.py -q` |
| All tests | `$C run --rm test tests -q` |
| Build panel | `cd frontend && npm run build` (then hard-reload the browser, no HA restart) |
| Stop | `$C down` |

Rules:
- Never print full logs; always filter and `tail`.
- Run the narrowest test first; the full suite only before handing off.
- To inspect HA state/services prefer the `ha-dev` MCP server over the browser. It works only if HA is running and `HA_DEV_TOKEN` is set (see README, Development).
- Frontend-only change: build + reload, no HA restart. Python change: restart. `manifest.json` / new platform: restart.
