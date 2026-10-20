"""Migration 28 (kept out of migrations.py for size): remaining amount of opened packages.

- batch.remaining: level of a partly used package (1 = full; never 0: empty books it out). A batch
  below 1 holds exactly one package at one location (checked in booking._add) and never merges:
  the unique key applies to full batches only (partial index WHERE remaining = 1).
- booking kind 'remaining': a level change moves the package to a batch of the same key at the new
  level, two rows like freeze / thaw (-1 on the source, +1 on the target); undo moves it back.
"""

from __future__ import annotations

import sqlite3

from .migration_24 import widen_check


def remaining_amount(conn: sqlite3.Connection) -> None:
    conn.execute(
        "ALTER TABLE batch ADD COLUMN remaining REAL NOT NULL DEFAULT 1"
        " CHECK (remaining > 0 AND remaining <= 1)"
    )
    conn.execute("DROP INDEX batch_key")
    conn.execute(
        "CREATE UNIQUE INDEX batch_key ON batch (product_id, ifnull(expires_on, ''),"
        " ifnull(canning_id, 0), ifnull(opened_on, ''), ifnull(frozen_on, '')) WHERE remaining = 1"
    )
    widen_check(
        conn, "booking",
        "kind IN ('in', 'out', 'move', 'correct', 'open', 'freeze', 'thaw')",
        "kind IN ('in', 'out', 'move', 'correct', 'open', 'freeze', 'thaw', 'remaining')",
    )  # fmt: skip
