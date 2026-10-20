---
name: release
description: Cut a release of the home_inventory integration - version bump in manifest.json, CHANGELOG, checks, PR, then tag + GitHub release (HACS installs from releases). Use when the user asks for a release or a new version.
---

Releases are GitHub releases with a tag `v<version>`; HACS offers them as versions. The tag must
equal `manifest.json` → `version` (HACS and HA show that number).

## 1. Prepare (branch `release/<version>`)

- [ ] Pick the version (SemVer, `0.x` until the first public release): fix → patch, feature → minor,
      schema change without migration path or removed service field → major (or minor while `0.x`, say so in CHANGELOG).
- [ ] `custom_components/home_inventory/manifest.json` → `version`.
- [ ] `CHANGELOG.md`: new section `## <version> - <YYYY-MM-DD>` on top, user-visible changes since the last tag
      (`git log --oneline v<last>..main`), grouped *Added / Changed / Fixed*; note DB migrations and anything the user must do.
- [ ] `hacs.json` → `homeassistant`: minimum HA version = the HA image CI tests against (`.github/workflows/ci.yml`,
      same as `dev/docker-compose.yml`); never guess lower.
- [ ] README status line current (README.md and README.de.md).
- [ ] Build (`cd frontend && npm run build`), backend tests, ruff (skill `ha-dev`); bundle must be unchanged or committed.
- [ ] Commit "Release <version>", PR to `main`, green CI, user merges.

## 2. Publish (only after the user confirms; outward-facing)

PRs run only the affected jobs and test files, so run the full CI on `main` first and do not release unless it is green:

```bash
git checkout main && git pull --prune
gh workflow run ci.yml --ref main
gh run list --workflow ci.yml --branch main --limit 1 --json databaseId --jq '.[0].databaseId'   # the new run's id
gh run watch <id> --exit-status
```

Then tag:

```bash
gh release create v<version> --target main --title "v<version>" --notes-file <changelog section as file>
```

- Notes = the CHANGELOG section of this version (write it to a scratch file, do not use `--generate-notes`).
- Check: `gh release view v<version>`; the tag points to the merge commit on `main`.
- HACS needs a **public** repository; while the repo is private, install manually (README → Installation).
