"""SQLite storage: connection, migrations, and an executor-backed wrapper."""

from __future__ import annotations

import sqlite3
import threading
from collections.abc import Callable
from typing import TYPE_CHECKING, Any

from homeassistant.helpers.dispatcher import async_dispatcher_send

from .const import SIGNAL_CHANGED
from .seed import seed

if TYPE_CHECKING:
    from homeassistant.core import HomeAssistant

# Never edit an existing step; append a new one.
MIGRATIONS: list[str] = [
    """
    CREATE TABLE unit (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        symbol TEXT NOT NULL,
        base_unit_id INTEGER REFERENCES unit(id),
        factor REAL NOT NULL DEFAULT 1,
        is_count INTEGER NOT NULL DEFAULT 0
    );
    CREATE TABLE location (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        sort INTEGER NOT NULL DEFAULT 0
    );
    CREATE TABLE category (
        id INTEGER PRIMARY KEY,
        parent_id INTEGER REFERENCES category(id) ON DELETE RESTRICT,
        name TEXT NOT NULL,
        sort INTEGER NOT NULL DEFAULT 0,
        off_tags TEXT NOT NULL DEFAULT '[]',
        unit_id INTEGER REFERENCES unit(id),
        default_location_id INTEGER REFERENCES location(id),
        expiry_type TEXT CHECK (expiry_type IN ('best_before', 'use_by')),
        warn_days INTEGER CHECK (warn_days >= 0),
        min_stock REAL CHECK (min_stock > 0),
        UNIQUE (parent_id, name)
    );
    CREATE TABLE product (
        id INTEGER PRIMARY KEY,
        ean TEXT UNIQUE,
        name TEXT NOT NULL,
        brand TEXT,
        category_id INTEGER NOT NULL REFERENCES category(id) ON DELETE RESTRICT,
        content_amount REAL CHECK (content_amount > 0),
        content_unit_id INTEGER REFERENCES unit(id),
        default_location_id INTEGER REFERENCES location(id),
        expiry_type TEXT CHECK (expiry_type IN ('best_before', 'use_by')),
        warn_days INTEGER CHECK (warn_days >= 0),
        image_url TEXT,
        off_json TEXT,
        updated_at TEXT NOT NULL
    );
    CREATE TABLE batch (
        id INTEGER PRIMARY KEY,
        product_id INTEGER NOT NULL REFERENCES product(id) ON DELETE CASCADE,
        expires_on TEXT,
        expiry_type TEXT NOT NULL CHECK (expiry_type IN ('best_before', 'use_by')),
        created_at TEXT NOT NULL,
        UNIQUE (product_id, expires_on, expiry_type)
    );
    CREATE TABLE stock (
        batch_id INTEGER NOT NULL REFERENCES batch(id) ON DELETE CASCADE,
        location_id INTEGER NOT NULL REFERENCES location(id) ON DELETE RESTRICT,
        packages INTEGER NOT NULL CHECK (packages > 0),
        PRIMARY KEY (batch_id, location_id)
    );
    -- packages is always positive; kind gives the direction ('correct': signed difference).
    -- 'move' is one row: location_id = source, to_location_id = target.
    CREATE TABLE booking (
        id INTEGER PRIMARY KEY,
        ts TEXT NOT NULL,
        kind TEXT NOT NULL CHECK (kind IN ('in', 'out', 'move', 'correct')),
        batch_id INTEGER,
        location_id INTEGER,
        to_location_id INTEGER,
        packages INTEGER NOT NULL,
        source TEXT NOT NULL,
        user_id TEXT
    );
    """,
]


def connect(path: str) -> sqlite3.Connection:
    """Open a connection usable from executor threads (callers serialize access)."""
    conn = sqlite3.connect(path, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys=ON")
    return conn


def migrate(conn: sqlite3.Connection) -> None:
    """Apply missing steps, one transaction each; seed while there are no units."""
    start = conn.execute("PRAGMA user_version").fetchone()[0]
    for i in range(start, len(MIGRATIONS)):
        conn.executescript(f"BEGIN;{MIGRATIONS[i]}PRAGMA user_version={i + 1};COMMIT;")
    if conn.execute("SELECT 1 FROM unit").fetchone() is None:
        seed(conn, "de")
        conn.commit()


class Database:
    """One connection plus a global lock."""

    # shortcut: one connection + global lock, fine for a household; per-request connections if it ever contends.
    def __init__(self, hass: HomeAssistant, path: str) -> None:
        self._hass = hass
        self._path = path
        self._conn: sqlite3.Connection | None = None
        self.lock = threading.Lock()

    def _open(self) -> sqlite3.Connection:
        conn = connect(self._path)
        migrate(conn)
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

    async def run(self, fn: Callable[..., Any], *args: Any) -> Any:
        """Run an inventory function in the executor; commit on success, roll back on error.

        Any write sends SIGNAL_CHANGED, so entities refresh whatever the entry point was.
        """
        result, changed = await self._hass.async_add_executor_job(self._run, fn, args)
        if changed:
            async_dispatcher_send(self._hass, SIGNAL_CHANGED)
        return result

    def _close(self) -> None:
        with self.lock:
            self._conn.close()

    async def async_close(self) -> None:
        await self._hass.async_add_executor_job(self._close)
