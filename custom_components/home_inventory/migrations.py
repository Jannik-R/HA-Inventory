"""Schema migrations after the 1.0.0 baseline (`schema_sql.py`), applied by `db.migrate`."""

from __future__ import annotations

import sqlite3
from collections.abc import Callable

# user_version of the baseline schema (0.x files have 1..32; a local dev file may even have 33,
# so db.migrate recognises 0.x files by the missing APP_ID, not by the version).
BASELINE = 33
# PRAGMA application_id ("HOME") set with the baseline: a file with a user_version but without it
# was written by a 0.x version and is refused.
APP_ID = 0x484F4D45

# Never edit an existing step; append a new one. MIGRATIONS[i] takes the schema from version
# BASELINE + i to BASELINE + i + 1 (an SQL script or a callable(conn) run in the same transaction).
MIGRATIONS: list[str | Callable[[sqlite3.Connection], None]] = []
