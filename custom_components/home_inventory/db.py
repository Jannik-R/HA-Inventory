"""SQLite storage: connection, applying the migrations (`migrations.py`), and an executor-backed wrapper."""

from __future__ import annotations

import asyncio
import sqlite3
import threading
from collections.abc import Callable
from typing import TYPE_CHECKING, Any

from homeassistant.exceptions import ConfigEntryError
from homeassistant.helpers.dispatcher import async_dispatcher_send

from .const import DOMAIN, EVENT_BOOKED, SIGNAL_CHANGED
from .inventory.notify import bookings_since, last_booking
from .migrations import APP_ID, BASELINE, MIGRATIONS
from .schema_sql import SCHEMA
from .seed import seed
from .seed_days import fill_days
from .seed_diet import set_diet
from .seed_en import to_english
from .seed_flags import set_emergency, set_frozen, set_guide
from .seed_general import add_dried, add_general, add_leftovers
from .seed_types import mark_recipe_only

if TYPE_CHECKING:
    from homeassistant.core import HomeAssistant


class Connection(sqlite3.Connection):
    """A connection that knows the modules the logic must respect."""

    # module `frozen`: off = nothing is frozen, no date changes (inventory/frozen.py)
    freezing = True
    # module `diet`: off = recipes() builds no diet (inventory/recipes.py)
    diet = True


def connect(path: str) -> sqlite3.Connection:
    """Open a connection usable from executor threads (callers serialize access)."""
    conn = sqlite3.connect(path, check_same_thread=False, factory=Connection)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys=ON")
    # SQLite lower()/LIKE fold ASCII only; the history filter needs "äpfel" = "Äpfel"
    conn.create_function("fold", 1, lambda s: s.casefold() if s else s, deterministic=True)
    return conn


def seed_lang(hass: HomeAssistant) -> str:
    """Language of the seeded names of a new DB: German if HA's system language is German."""
    return "de" if hass.config.language.split("-")[0] == "de" else "en"


def migrate(conn: sqlite3.Connection, lang: str = "de") -> None:
    """Create the baseline schema in a new file, apply missing steps (one transaction each); seed while there are no units.

    `lang` is the seed language of a new DB (an existing one keeps its names). A file written
    by a 0.x version (a user_version but no APP_ID) is refused untouched.

    Foreign keys are off during a step (SQLite's way to rebuild a referenced table) and
    checked before its commit; a violation rolls the step back.
    """
    start = conn.execute("PRAGMA user_version").fetchone()[0]
    if start and conn.execute("PRAGMA application_id").fetchone()[0] != APP_ID:
        raise ConfigEntryError(
            translation_domain=DOMAIN,
            translation_key="old_database",
            translation_placeholders={"path": conn.execute("PRAGMA database_list").fetchone()[2]},
        )
    conn.execute("PRAGMA foreign_keys=OFF")  # no effect inside a transaction, so set it here
    try:
        if start == 0:
            conn.executescript(
                f"BEGIN;{SCHEMA}PRAGMA application_id={APP_ID};PRAGMA user_version={BASELINE};COMMIT;"
            )
            start = BASELINE
        for version in range(start, BASELINE + len(MIGRATIONS)):
            step = MIGRATIONS[version - BASELINE]
            if callable(step):
                conn.execute("BEGIN")
                step(conn)
                conn.execute(f"PRAGMA user_version={version + 1}")
            else:
                conn.executescript(f"BEGIN;{step}PRAGMA user_version={version + 1};")
            if bad := conn.execute("PRAGMA foreign_key_check").fetchall():
                conn.rollback()
                raise sqlite3.IntegrityError(
                    f"migration {version + 1}: foreign key violations {bad[:5]}"
                )
            conn.commit()
    finally:
        conn.execute("PRAGMA foreign_keys=ON")
    if conn.execute("SELECT 1 FROM unit").fetchone() is None:
        seed(conn, "de")
        for setter in (  # the German base seed first, then the setters, then the rename
            mark_recipe_only, add_general, fill_days, set_guide, set_frozen, add_dried,
            set_emergency, add_leftovers, set_diet,
        ):  # fmt: skip
            setter(conn)
        if lang == "en":
            to_english(conn)
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
            migrate(conn, seed_lang(self._hass))
        except BaseException:
            conn.close()
            raise
        return conn

    async def async_open(self, freezing: bool = True, diet: bool = True) -> None:
        self._conn = await self._hass.async_add_executor_job(self._open)
        self._conn.freezing = freezing
        self._conn.diet = diet

    def _run(self, fn: Callable[..., Any], args: tuple) -> tuple[Any, bool, list[dict]]:
        with self.lock:
            before = self._conn.total_changes
            last = last_booking(self._conn)
            try:
                result = fn(self._conn, *args)
                # one action = everything this call booked, named by its first row
                self._conn.execute(
                    "UPDATE booking SET action_id = (SELECT min(id) FROM booking WHERE id > ?)"
                    " WHERE id > ? AND action_id IS NULL",
                    (last, last),
                )
                self._conn.commit()
            except BaseException:
                self._conn.rollback()
                raise
            changed = self._conn.total_changes != before
            return result, changed, bookings_since(self._conn, last) if changed else []

    async def run(
        self, fn: Callable[..., Any], *args: Any, write: bool = True, events: bool = True
    ) -> Any:
        """Run an inventory function in the executor; commit on success, roll back on error.

        Any write sends SIGNAL_CHANGED, so entities refresh whatever the entry point was
        (`write=False`: a dry run that is rolled back, nothing to announce). Each new booking row
        fires EVENT_BOOKED on the HA event bus (`events=False`: not for a bulk import).
        """
        async with self.gate:
            result, changed, booked = await self._hass.async_add_executor_job(self._run, fn, args)
        if changed and write:
            for row in booked if events else ():
                self._hass.bus.async_fire(EVENT_BOOKED, row)
            async_dispatcher_send(self._hass, SIGNAL_CHANGED)
        return result

    def _close(self) -> None:
        with self.lock:
            self._conn.close()

    async def async_close(self) -> None:
        await self._hass.async_add_executor_job(self._close)
