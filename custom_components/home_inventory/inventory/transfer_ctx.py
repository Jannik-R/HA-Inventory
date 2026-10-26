"""State and lookups of one CSV / Grocy import run: report rows, category / location / unit / product matching."""

from __future__ import annotations

import sqlite3

from .common import InventoryError, unit_key
from .ingredient_line import unit_lookup
from .inherit import _categories, _path
from .master import save


class Ctx:
    def __init__(self, conn: sqlite3.Connection, user_id: str | None) -> None:
        self.conn, self.user_id = conn, user_id
        self.rows: list[dict] = []
        self.quiet = 0  # unchanged rows: only counted
        self.line = 0
        self.units = unit_lookup(conn)
        self._index: dict[str, list[int]] | None = None

    def add(self, action, kind, name, changes=(), reason=None) -> None:
        self.rows.append({"line": self.line, "action": action, "kind": kind, "name": name,
                          "changes": list(changes), "reason": reason})  # fmt: skip

    def report(self) -> dict:
        counts = dict.fromkeys(("create", "update", "skip", "error"), 0)
        for r in self.rows:
            counts[r["action"]] += 1
        counts["skip"] += self.quiet
        return {"rows": self.rows, "counts": counts}

    def category(self, cell: str) -> int:
        """Full path from the root, else the only category with the last name, else create the
        levels missing below the longest matching prefix."""
        path = [s.strip() for s in cell.split(">") if s.strip()]
        if not path:
            raise InventoryError("invalid_value")
        cats = _categories(self.conn).values()
        parent, depth = None, 0
        for seg in path:
            hit = [c["id"] for c in cats if c["parent_id"] == parent and _eq(c["name"], seg)]
            if not hit:
                break
            parent, depth = hit[0], depth + 1
        if depth == len(path):
            return parent
        named = [c["id"] for c in cats if _eq(c["name"], path[-1])]
        if len(named) == 1:
            return named[0]
        if len(named) > 1 and len(path) == 1:
            raise InventoryError("ambiguous")
        for seg in path[depth:]:
            parent = save(self.conn, "category", {"parent_id": parent, "name": seg})
            self.add("create", "category", seg)
        return parent

    def category_path(self, category_id: int) -> str:
        return " > ".join(_path(_categories(self.conn), category_id))

    def find_location(self, name: str) -> int | None:
        """Id of the active location with this name."""
        for r in self.conn.execute("SELECT id, name FROM location WHERE active"):
            if _eq(r["name"], name):
                return r["id"]
        return None

    def location(self, name: str, freezer: bool = False) -> int:
        """Active location by name; an unknown or deactivated one is created / brought back."""
        if (found := self.find_location(name)) is not None:
            return found
        old = next(
            (r for r in self.conn.execute("SELECT name FROM location") if _eq(r["name"], name)),
            None,
        )
        data = {"name": old["name"] if old else name, **({"freezer": 1} if freezer else {})}
        self.add("create", "location", name)
        return save(self.conn, "location", data)

    def unit(self, name: str) -> int:
        if (unit_id := self.units.get(unit_key(name))) is None:
            raise InventoryError("unknown_unit")
        return unit_id

    def label(self, name: str, brand: str | None) -> str:
        return f"{name} ({brand})" if brand else name

    def products(self, name: str, brand: str | None) -> list[sqlite3.Row]:
        """Products with this name (and brand, when the file has the column); casefolded."""
        if self._index is None:
            self._index = {}
            for r in self.conn.execute("SELECT id, name FROM product"):
                self._index.setdefault(r["name"].casefold(), []).append(r["id"])
        rows = [
            self.conn.execute("SELECT * FROM product WHERE id = ?", (i,)).fetchone()
            for i in self._index.get(name.casefold(), [])
        ]
        return [r for r in rows if brand is None or _eq(r["brand"] or "", brand)]

    def created(self, name: str, product_id: int) -> None:
        self._index.setdefault(name.casefold(), []).append(product_id)


def _eq(a: str, b: str) -> bool:
    return a.strip().casefold() == b.strip().casefold()
