---
name: import-check
description: Check the recipe import parser against random real Chefkoch recipes - runs scripts/import_check.py (no browser, no screenshots), prints only suspicious ingredient rows and a summary, then rate the result and turn real problems into parser fixes, test cases or new seeded product types. Use after changing inventory/ingredient_line.py, inventory/recipe_import.py, suggest.py or the seeded product types, or when the user asks to test the import.
---

All commands from the repo root. The script runs the real `inventory.recipe_import` against an in-memory DB seeded like a new install (default units, categories, product types), so results match a fresh HA, not the dev DB.

| Goal | Command |
|---|---|
| N random recipes (network, ~6 s per recipe) | `docker compose -f dev/docker-compose.yml run --rm --entrypoint python test scripts/import_check.py -n 10` |
| Re-run on the cached pages (no network, after a fix) | `... scripts/import_check.py --cached -n 50` |
| Specific URLs | `... scripts/import_check.py <url> <url>` |
| Every row, not only flagged | add `--all` |

Pages are cached in `dev/config/import-check/` (git-ignored; third-party content, never commit or copy into tests verbatim).

## Output

Per recipe: `## name | servings | rows | missing image_url/instructions | url`, then only flagged rows:
`FLAGS 'original line' -> amount unit 'text' [note] opt => category hint=unit`

| Flag | Meaning | Usually |
|---|---|---|
| `NOCAT` | no category/product type suggested | missing seeded product type (`seed_types.py`) or keyword (`keywords.py`); fine for rare items (Amaretto) |
| `HINT` | unknown unit proposed | correct for real measures (Tasse); wrong when it is an ingredient word |
| `DIGIT` | digits left in the text | amount/unit not parsed, or legit ("Gelierzucker 2:1") |
| `PUNCT` | `( ) /` left in the text | Chefkoch suffix (`Dose/n`, `(e)`) or nested parentheses not handled |
| `LONG` | text has more than 3 words | note not split off |
| `NOAMT` | line starts with a number but no amount | amount regex miss |

Summary line: counts per flag, `failed` (no recipe found), `no_image_url` / `no_instructions`; then top unit hints and top texts without category.

## Rating (keep it short)

1. Run 10 random recipes (or `--cached` after a fix). Read only the flagged rows.
2. Classify each flagged row: **parser bug** (wrong amount/unit/text/note), **seed gap** (common product without product type), or **acceptable** (rare item, legit digits).
3. Report to the user in German: rows total, share of rows that are correct (rows minus parser bugs and seed gaps), a list of parser bugs (line → what is wrong), seed gaps grouped (e.g. Ei, Kirsche, Marone), acceptable ones only counted.
4. Fixing (only when the user agrees): each parser bug becomes a line in the parametrized table in `tests/test_recipe_import.py` (write a shortened/own line, not copied page text beyond the ingredient line), then fix `ingredient_line.py`; seed gaps go into `seed_types.py` (`_DE_TYPES`; existing DBs need a migration step after a release, see skill `db-migration`). Re-run with `--cached` to confirm, then the narrow test file.

Politeness (built into the script): robots.txt disallows `/rezepte/*?*`, and the random link redirects to `…?zufall=on`, so the script reads the redirect target without following it and fetches the clean URL; 3 s between requests; a cached page is never fetched again; any HTTP error (429/503) stops the run without retry. At most 100 recipes per run, and only when the user asks for a big run; default 10.

Rules: no browser, no screenshots, no full page dumps. Never send anything to a printer (the script does not touch HA).
