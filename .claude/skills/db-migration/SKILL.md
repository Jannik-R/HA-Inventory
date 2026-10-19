---
name: db-migration
description: Add or change the home_inventory SQLite schema the way this repo does it - a new step in migrations.MIGRATIONS, table rebuilds with foreign keys, data fixes, seed, upgrade test from the previous version. Use for any change to tables, columns, constraints or indexes in custom_components/home_inventory/migrations.py.
---

Schema lives only in `custom_components/home_inventory/migrations.py` → `MIGRATIONS` (`db.MIGRATIONS` is the same list, tests patch it there) (list of SQL scripts; index + 1 = `PRAGMA user_version`).

## Rules

- **Never edit a step that is merged to `main`.** Append a new step. An unmerged step may be edited; then delete `dev/config/home_inventory.db` (it is git-ignored) or restore a copy.
- One step = one transaction. `migrate()` turns foreign keys **off** for the step, runs `PRAGMA foreign_key_check` before the commit and rolls back on violations. So rebuilding a referenced table is safe.
- Fix data **before** adding a constraint (orphans, contradicting pairs), in the same step. Say in a comment what happens to bad rows.
- Comment at the top of the step: number + why (`# 4: ...`), like steps 2 and 3.
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
- Merge duplicates: `CREATE TEMP TABLE map AS SELECT old_id, new_id ...`, move child rows (SUM where a PK would collide), repoint references, drop the map (see step 2).
- JSON in a column → table: `json_each(col)` (see step 3).

## Also update

1. Python that reads/writes the changed columns (`inventory/`, `seed.py` - the seed runs **after** all steps on a new DB, so it must fill new required tables, e.g. `defaults`).
2. `inventory/common.py` → `COLUMNS` whitelist if a user-editable column changed.
3. Websocket schemas in `websocket.py`, the panel types in `frontend/src/api.ts`.
4. `docs/PLAN.md` → data model section (and the phase row).

## Test (required)

Upgrade test in `tests/test_inventory.py`, pattern `test_migration_<n>_...`:

```python
c = db.connect(":memory:")
c.executescript(f"BEGIN;{''.join(db.MIGRATIONS[: n - 1])}PRAGMA user_version={n - 1};COMMIT;")
c.executescript("INSERT ... rows in the OLD shape, including the bad cases ...")
db.migrate(c)
# assert new shape, fixed data, and: c.execute("PRAGMA foreign_key_check").fetchall() == []
```

Then run all backend tests (skill `ha-dev`), restart the dev HA (it migrates `dev/config/home_inventory.db`) and check `PRAGMA user_version` and `PRAGMA foreign_key_check` there.

## Release note

A step that merges or deletes data cannot be undone: mention it in the PR and the release notes ("make an HA backup before updating").
