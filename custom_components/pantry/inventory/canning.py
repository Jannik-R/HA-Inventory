"""Canning protocols: each one is a charge (made-on date + number of that day) and its own batch."""

from __future__ import annotations

import sqlite3

from .booking import _add, _booking, _iso
from .common import InventoryError, _exists, _now, _packages
from .inherit import effective
from .master import save
from .products import add_product


def charge(made_on: str, seq: int) -> str:
    """Charge code YYYYMMDD-n, printed on the label and in the QR code."""
    return f"{made_on.replace('-', '')}-{seq}"


def cannings(conn: sqlite3.Connection) -> list[dict]:
    """All protocols, newest first, with their charge, best-before date and jars in stock."""
    rows = conn.execute(
        "SELECT c.*, p.name, r.name AS recipe, b.id AS batch_id, b.expires_on,"
        " (SELECT ifnull(sum(s.packages), 0) FROM stock s WHERE s.batch_id = b.id) AS in_stock"
        " FROM canning c JOIN product p ON p.id = c.product_id"
        " LEFT JOIN recipe r ON r.id = c.recipe_id LEFT JOIN batch b ON b.canning_id = c.id"
        " ORDER BY c.made_on DESC, c.seq DESC"
    )
    return [{**dict(r), "charge": charge(r["made_on"], r["seq"])} for r in rows]


def save_canning(
    conn: sqlite3.Connection, data: dict, user_id: str | None = None, source: str = "manual"
) -> dict:
    """New protocol: next charge of its day, a new product if given, the jars booked in.

    With an id only the process data (recipe, temperature, minutes, notes) and the
    best-before date of the charge change; made-on date, product and jars stay (labels carry them).
    Returns {id, batch_id, charge}.
    """
    data = dict(data)
    canning_id = data.pop("id", None)
    expires_on = _iso(data.pop("expires_on", None))
    _exists(conn, "recipe", data.get("recipe_id"))
    process = {k: data.get(k) for k in ("recipe_id", "temp", "minutes")}
    process["notes"] = (data.get("notes") or "").strip()[:2000]
    if canning_id is not None:
        save(conn, "canning", {"id": canning_id, **process})
        conn.execute(
            "UPDATE batch SET expires_on = ? WHERE canning_id = ?", (expires_on, canning_id)
        )
        row = conn.execute(
            "SELECT c.made_on, c.seq, b.id FROM canning c JOIN batch b ON b.canning_id = c.id"
            " WHERE c.id = ?",
            (canning_id,),
        ).fetchone()
        return {"id": canning_id, "batch_id": row["id"], "charge": charge(row[0], row[1])}
    made_on = _iso(data.get("made_on"))
    if made_on is None:
        raise InventoryError("invalid_date")
    _packages(data["jars"])
    recipe = conn.execute(
        "SELECT canning_product_id FROM recipe WHERE id = ?", (data.get("recipe_id"),)
    ).fetchone()
    # a canning recipe always makes its product
    product_id = (recipe and recipe[0]) or data.get("product_id")
    if product_id is None:
        if "product" not in data:  # neither a canning recipe nor a product given
            raise InventoryError("not_found")
        product_id = add_product(conn, data["product"])  # any user may create a product
    eff = effective(conn, product_id)  # raises not_found
    location_id = data.get("location_id") or eff["default_location_id"]["value"]
    if location_id is None:
        raise InventoryError("location_required")
    _exists(conn, "location", location_id)
    seq = conn.execute(
        "SELECT ifnull(max(seq), 0) + 1 FROM canning WHERE made_on = ?", (made_on,)
    ).fetchone()[0]
    canning_id = save(
        conn,
        "canning",
        {"made_on": made_on, "seq": seq, "product_id": product_id, "jars": data["jars"], **process},
    )
    batch_id = conn.execute(
        "INSERT INTO batch (product_id, expires_on, created_at, canning_id) VALUES (?, ?, ?, ?)",
        (product_id, expires_on, _now(), canning_id),
    ).lastrowid
    _add(conn, batch_id, location_id, data["jars"])
    _booking(conn, "in", batch_id, location_id, data["jars"], source, user_id)
    return {"id": canning_id, "batch_id": batch_id, "charge": charge(made_on, seq)}
