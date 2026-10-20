"""Migration 28 (kept out of migrations.py for size): remaining amount of opened packages.

- batch.remaining: level of the one partly used package of a batch (1 = full; never 0: empty books
  it out). The other packages of the batch count as full.
- booking kind 'remaining' (packages 0) and booking.remaining: the level BEFORE the booking changed
  it (NULL = unchanged); undo restores it ('remaining' undo, put_back of an 'out').
"""

from __future__ import annotations

import sqlite3

from .migration_24 import widen_check


def remaining_amount(conn: sqlite3.Connection) -> None:
    conn.execute(
        "ALTER TABLE batch ADD COLUMN remaining REAL NOT NULL DEFAULT 1"
        " CHECK (remaining > 0 AND remaining <= 1)"
    )
    conn.execute(
        "ALTER TABLE booking ADD COLUMN remaining REAL CHECK (remaining > 0 AND remaining <= 1)"
    )
    widen_check(  # after the ADD COLUMN: the rebuild copies the stored SQL incl. the new column
        conn, "booking",
        "kind IN ('in', 'out', 'move', 'correct', 'open', 'freeze', 'thaw')",
        "kind IN ('in', 'out', 'move', 'correct', 'open', 'freeze', 'thaw', 'remaining')",
    )  # fmt: skip
