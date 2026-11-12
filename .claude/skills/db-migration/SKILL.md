---
name: db-migration
description: Add or change the home_inventory SQLite schema the way this repo does it - a new step in migrations.MIGRATIONS after the 1.0.0 baseline, table rebuilds with foreign keys, data fixes, seed, upgrade test from the previous version. Use for any change to tables, columns, constraints or indexes in custom_components/home_inventory/migrations.py.
---

The 1.0.0 schema is one baseline: `schema_sql.py` → `SCHEMA` (`PRAGMA user_version` = `migrations.BASELINE`, 33, plus `PRAGMA application_id` = `migrations.APP_ID`; the 32 migrations of the 0.x development versions are squashed, files without the `application_id` are 0.x files and refused). Changes after it live in `migrations.py` → `MIGRATIONS` (`db.MIGRATIONS` is the same list, tests patch it there): a list of SQL scripts or callables, step `MIGRATIONS[i]` takes the schema from version `BASELINE + i` to `BASELINE + i + 1`. Never edit `SCHEMA` after 1.0.0 is released: the baseline stays what a 1.0.0 file contains, fresh files get it and then all steps.

## Rules

- **Never edit a step that is merged to `main`.** Append a new step. An unmerged step may be edited; then delete `dev/config/home_inventory.db` (it is git-ignored) or restore a copy.
- One step = one transaction. `migrate()` turns foreign keys **off** for the step, runs `PRAGMA foreign_key_check` before the commit and rolls back on violations. So rebuilding a referenced table is safe.
- Fix data **before** adding a constraint (orphans, contradicting pairs), in the same step. Say in a comment what happens to bad rows.
- Comment at the top of the step: version it creates + why (`# 34: ...`).
- Names: tables singular (`batch`, `off_tag`), link tables `<a>_<b>` (`category_off_tag`), FK columns `<table>_id`. Dates ISO text. Booleans `INTEGER NOT NULL DEFAULT 0 CHECK (x IN (0, 1))`.
- Locations are never deleted (deactivated, `active = 0`); anything that references them can use real FKs.

## Patterns (SQLite)

- Add a column: `ALTER TABLE t ADD COLUMN c ... DEFAULT ...` (a CHECK is allowed, NOT NULL needs a default).
- Drop a column: `ALTER TABLE t DROP COLUMN c` (not if it is in a UNIQUE, index, FK or CHECK; then rebuild).
- Change constraints / FKs / column order = rebuild:
  ```sql
  CREATE TABLE t_new (... new definition, references other tables by their final names ...);
  INSERT INTO t_new (cols) SELECT cols FROM t;
  DROP TABLE t;
  ALTER TABLE t_new RENAME TO t;
  -- recreate indexes of t
  ```
- Merge duplicates: `CREATE TEMP TABLE map AS SELECT old_id, new_id ...`, move child rows (SUM where a PK would collide), repoint references, drop the map.
- JSON in a column → table: `json_each(col)`.

## Also update

1. Python that reads/writes the changed columns (`inventory/`, `seed.py` and the other `seed_*.py` - the seed runs **after** baseline and all steps on a new DB, so it must fill new required tables, e.g. `defaults`; a changed seed also needs a step that fixes existing DBs).
2. `inventory/common.py` → `COLUMNS` whitelist if a user-editable column changed.
3. Websocket schemas in `websocket.py`, the panel types in `frontend/src/api.ts`.
4. `docs/PLAN.md` → data model section (and the phase row).

## Test (required)

Upgrade test in `tests/test_inventory.py` (or the feature's test file), pattern `test_migration_<version>_...`, from the previous version (`n` = the new version):

```python
c = db.connect(":memory:")
c.executescript(
    f"BEGIN;{db.SCHEMA}{''.join(db.MIGRATIONS[: n - db.BASELINE - 1])}PRAGMA user_version={n - 1};COMMIT;"
)
c.executescript("INSERT ... rows in the OLD shape, including the bad cases ...")
db.migrate(c)
# assert new shape, fixed data, and: c.execute("PRAGMA foreign_key_check").fetchall() == []
```

(`db.SCHEMA` and `db.BASELINE` are imported into `db`; steps given as callables run with `step(c)` instead of `executescript`.)

Then run all backend tests (skill `ha-dev`), restart the dev HA (it migrates `dev/config/home_inventory.db`) and check `PRAGMA user_version` and `PRAGMA foreign_key_check` there.

## Release note

A step that merges or deletes data cannot be undone: mention it in the PR and the release notes ("make an HA backup before updating").
