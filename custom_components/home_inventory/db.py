"""SQLite storage: connection, applying the migrations (`migrations.py`), and an executor-backed wrapper."""

from __future__ import annotations

import asyncio
import sqlite3
import threading
from collections.abc import Callable
from typing import TYPE_CHECKING, Any

from homeassistant.helpers.dispatcher import async_dispatcher_send

from .const import SIGNAL_CHANGED
from .migrations import MIGRATIONS
from .seed import seed
from .seed_days import fill_days
from .seed_general import add_general
from .seed_types import mark_recipe_only

if TYPE_CHECKING:
    from homeassistant.core import HomeAssistant


def connect(path: str) -> sqlite3.Connection:
    """Open a connection usable from executor threads (callers serialize access)."""
    conn = sqlite3.connect(path, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys=ON")
    return conn


def migrate(conn: sqlite3.Connection) -> None:
    """Apply missing steps, one transaction each; seed while there are no units.

    Foreign keys are off during a step (SQLite's way to rebuild a referenced table) and
    checked before its commit; a violation rolls the step back.
    """
    start = conn.execute("PRAGMA user_version").fetchone()[0]
    conn.execute("PRAGMA foreign_keys=OFF")  # no effect inside a transaction, so set it here
    try:
        for i in range(start, len(MIGRATIONS)):
            step = MIGRATIONS[i]
            if callable(step):
                conn.execute("BEGIN")
                step(conn)
                conn.execute(f"PRAGMA user_version={i + 1}")
            else:
                conn.executescript(f"BEGIN;{step}PRAGMA user_version={i + 1};")
            if bad := conn.execute("PRAGMA foreign_key_check").fetchall():
                conn.rollback()
                raise sqlite3.IntegrityError(f"migration {i + 1}: foreign key violations {bad[:5]}")
            conn.commit()
    finally:
        conn.execute("PRAGMA foreign_keys=ON")
    if conn.execute("SELECT 1 FROM unit").fetchone() is None:
        seed(conn, "de")
        mark_recipe_only(conn)  # not in seed(): old-schema DBs are seeded by tests
        add_general(conn)  # same
        fill_days(conn)  # same
        conn.commit()


class Database:
    """One connection plus a global lock."""

    # shortcut: one connection + global lock, fine for a household; per-request connections if it ever contends.
    def __init__(self, hass: HomeAssistant, path: str) -> None:
        self._hass = hass
        self._path = path
        self._conn: sqlite3.Connection | None = None
        self.lock = threading.Lock()
        # Held by every run() while it works and by a backup: writes wait on the event loop,
        # not in an executor thread.
        self.gate = asyncio.Lock()

    def _open(self) -> sqlite3.Connection:
        conn = connect(self._path)
        try:
            migrate(conn)
        except BaseException:
            conn.close()
            raise
        return conn

    async def async_open(self) -> None:
        self._conn = await self._hass.async_add_executor_job(self._open)

    def _run(self, fn: Callable[..., Any], args: tuple) -> tuple[Any, bool]:
        with self.lock:
            before = self._conn.total_changes
            try:
                result = fn(self._conn, *args)
                self._conn.commit()
            except BaseException:
                self._conn.rollback()
                raise
            return result, self._conn.total_changes != before

    async def run(self, fn: Callable[..., Any], *args: Any, write: bool = True) -> Any:
        """Run an inventory function in the executor; commit on success, roll back on error.

        Any write sends SIGNAL_CHANGED, so entities refresh whatever the entry point was
        (`write=False`: a dry run that is rolled back, nothing to announce).
        """
        async with self.gate:
            result, changed = await self._hass.async_add_executor_job(self._run, fn, args)
        if changed and write:
            async_dispatcher_send(self._hass, SIGNAL_CHANGED)
        return result

    def _close(self) -> None:
        with self.lock:
            self._conn.close()

    async def async_close(self) -> None:
        await self._hass.async_add_executor_job(self._close)
