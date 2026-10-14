"""All business logic. Plain sync functions on a sqlite3 connection (no HA imports)."""

from __future__ import annotations

import json
import sqlite3
from datetime import UTC, date, datetime

INHERITED = ("unit_id", "default_location_id", "expiry_type", "warn_days")

# Column whitelist per table (id and product.updated_at are handled by save()).
COLUMNS = {
    "unit": ("name", "symbol", "base_unit_id", "factor", "is_count"),
    "location": ("name", "sort"),
    "category": (
        "parent_id", "name", "sort", "off_tags", "unit_id", "default_location_id",
        "expiry_type", "warn_days", "min_stock",
    ),
    "product": (
        "ean", "name", "brand", "category_id", "content_amount", "content_unit_id",
        "default_location_id", "expiry_type", "warn_days", "image_url", "off_json",
    ),
}  # fmt: skip


class InventoryError(Exception):
    """User-facing error; translation_key maps to strings.json -> exceptions."""

    def __init__(self, translation_key: str, **placeholders: object) -> None:
        super().__init__(translation_key)
        self.translation_key = translation_key
        self.placeholders = placeholders


def _now() -> str:
    return datetime.now(UTC).isoformat(timespec="seconds")


# --- master data -------------------------------------------------------------


def _table(table: str) -> tuple[str, ...]:
    if table not in COLUMNS:
        raise ValueError(f"unknown table {table}")
    return COLUMNS[table]


def save(conn: sqlite3.Connection, table: str, data: dict) -> int:
    """Insert (no id) or update (id) a row; returns the id."""
    cols = _table(table)
    data = dict(data)
    row_id = data.pop("id", None)
    if not data:
        raise ValueError("no data")
    if unknown := set(data) - set(cols):
        raise ValueError(f"unknown columns for {table}: {sorted(unknown)}")
    if isinstance(data.get("off_tags"), list):
        data["off_tags"] = json.dumps(data["off_tags"])
    if "name" in data:
        if not isinstance(data["name"], str) or not data["name"].strip():
            raise InventoryError("invalid_value")
        data["name"] = data["name"].strip()
    if table == "unit":
        _check_unit(conn, row_id, data)
    if table == "category" and row_id is not None:
        _check_parent(conn, row_id, data.get("parent_id"))
    if table == "product":
        data["updated_at"] = _now()
    if row_id is None and "sort" in cols and "sort" not in data:  # new rows go last
        data["sort"] = conn.execute(f"SELECT coalesce(max(sort), 0) + 1 FROM {table}").fetchone()[0]
    names = list(data)
    try:
        if row_id is None:
            cur = conn.execute(
                f"INSERT INTO {table} ({', '.join(names)}) VALUES ({', '.join('?' * len(names))})",
                list(data.values()),
            )
            return cur.lastrowid
        cur = conn.execute(
            f"UPDATE {table} SET {', '.join(f'{n} = ?' for n in names)} WHERE id = ?",
            [*data.values(), row_id],
        )
    except sqlite3.IntegrityError as err:
        raise InventoryError("duplicate" if "UNIQUE" in str(err) else "invalid_value") from err
    if not cur.rowcount:
        raise InventoryError("not_found")
    return row_id


def _check_unit(conn: sqlite3.Connection, unit_id: int | None, data: dict) -> None:
    """Factor > 0; a base unit has no base itself, and a unit used as base cannot get one."""
    if ("factor" in data or unit_id is None) and not (data.get("factor") or 0) > 0:
        raise InventoryError("invalid_unit")
    base_id = data.get("base_unit_id")
    if base_id is None:
        return
    base = conn.execute("SELECT base_unit_id FROM unit WHERE id = ?", (base_id,)).fetchone()
    used_as_base = unit_id is not None and conn.execute(
        "SELECT 1 FROM unit WHERE base_unit_id = ?", (unit_id,)
    ).fetchone()
    if base is None or base_id == unit_id or base["base_unit_id"] is not None or used_as_base:
        raise InventoryError("invalid_unit")


def _check_parent(conn: sqlite3.Connection, category_id: int, parent_id: int | None) -> None:
    """The parent must not be the category itself or in its subtree."""
    cats = _categories(conn)
    while parent_id is not None and parent_id in cats:
        if parent_id == category_id:
            raise InventoryError("invalid_parent")
        parent_id = cats[parent_id]["parent_id"]


def delete(conn: sqlite3.Connection, table: str, row_id: int) -> None:
    _table(table)
    if table == "product" and conn.execute(
        "SELECT 1 FROM stock s JOIN batch b ON b.id = s.batch_id WHERE b.product_id = ?", (row_id,)
    ).fetchone():
        raise InventoryError("in_use")
    try:
        cur = conn.execute(f"DELETE FROM {table} WHERE id = ?", (row_id,))
    except sqlite3.IntegrityError as err:
        raise InventoryError("in_use") from err
    if not cur.rowcount:
        raise InventoryError("not_found")


def master_data(conn: sqlite3.Connection) -> dict:
    """Units, locations and categories (with effective values) for the settings view."""
    cats, dflt = _categories(conn), defaults(conn)
    return {
        "units": list_rows(conn, "unit"),
        "locations": list_rows(conn, "location"),
        "categories": [
            {**c, "off_tags": json.loads(c["off_tags"]), "effective": _resolve(cats, None, c["id"], dflt)}
            for c in list_rows(conn, "category")
        ],
        "defaults": dflt,
    }


def list_rows(conn: sqlite3.Connection, table: str) -> list[dict]:
    _table(table)
    order = "sort, id" if table in ("location", "category") else "id"
    return [dict(r) for r in conn.execute(f"SELECT * FROM {table} ORDER BY {order}")]


# --- inheritance ---------------------------------------------------------------


def defaults(conn: sqlite3.Connection) -> dict:
    """Integration-wide defaults (options come later)."""
    unit = conn.execute(
        "SELECT id FROM unit ORDER BY is_count DESC, id LIMIT 1"
    ).fetchone()
    return {
        "warn_days": 7,
        "expiry_type": "best_before",
        "unit_id": unit["id"] if unit else None,
        "default_location_id": None,
    }


def _categories(conn: sqlite3.Connection) -> dict[int, sqlite3.Row]:
    return {r["id"]: r for r in conn.execute("SELECT * FROM category")}


def _resolve(
    cats: dict, product: dict | None, category_id: int | None, dflt: dict
) -> dict:
    out = {}
    for key in INHERITED:
        if product is not None and product.get(key) is not None:
            out[key] = {"value": product[key], "source": "own"}
            continue
        cid, result = category_id, {"value": dflt.get(key), "source": "default"}
        while cid is not None:
            row = cats[cid]
            if row[key] is not None:
                own = product is None and cid == category_id
                result = {"value": row[key], "source": "own" if own else cid}
                break
            cid = row["parent_id"]
        out[key] = result
    return out


def effective(
    conn: sqlite3.Connection,
    product_id: int | None = None,
    category_id: int | None = None,
) -> dict:
    """Effective inheritable values with their source: "own", a category id or "default"."""
    product = None
    if product_id is not None:
        row = conn.execute(
            "SELECT * FROM product WHERE id = ?", (product_id,)
        ).fetchone()
        if row is None:
            raise InventoryError("not_found")
        product, category_id = dict(row), row["category_id"]
        product.pop(
            "unit_id", None
        )  # products inherit the unit; content has its own unit
    return _resolve(_categories(conn), product, category_id, defaults(conn))


# --- products and Open Food Facts ------------------------------------------------


def find_ean(conn: sqlite3.Connection, ean: str) -> dict | None:
    row = conn.execute("SELECT * FROM product WHERE ean = ?", (ean,)).fetchone()
    return dict(row) if row else None


def search_products(conn: sqlite3.Connection, query: str, limit: int = 20) -> list[dict]:
    """Local products whose name, brand or EAN contains query (Unicode case-insensitive)."""
    q = query.strip().casefold()
    if not q:
        return []
    # shortcut: filters in Python (SQLite LIKE folds ASCII only, "müsli" != "Müsli"); use FTS5 if the catalog gets large.
    rows = conn.execute("SELECT * FROM product ORDER BY name")
    hits = (r for r in rows if any(q in (r[k] or "").casefold() for k in ("name", "brand", "ean")))
    return [dict(r) for _, r in zip(range(limit), hits)]


def suggest_category(conn: sqlite3.Connection, tags: list[str]) -> int | None:
    """Deepest category whose off_tags meet the product's OFF tags; tie: more specific tag."""
    pos = {t: i for i, t in enumerate(tags)}
    cats = _categories(conn)
    found = [
        ((len(_chain(cats, cid)), max(hits)), cid)
        for cid, row in cats.items()
        if (hits := [pos[t] for t in json.loads(row["off_tags"]) if t in pos])
    ]
    return max(found)[1] if found else None


def product_draft(conn: sqlite3.Connection, off: dict) -> dict:
    """Normalized OFF data (see off.normalize) -> unsaved product with suggested category."""
    amount = unit_id = None
    if off["quantity"]:
        row = conn.execute(
            "SELECT id FROM unit WHERE lower(symbol) = ? OR lower(name) = ?",
            (off["quantity"][1],) * 2,
        ).fetchone()
        if row:
            amount, unit_id = off["quantity"][0], row["id"]
    return {
        "ean": off["ean"],
        "name": off["name"],
        "brand": off["brand"],
        "category_id": suggest_category(conn, off["off_tags"]),
        "content_amount": amount,
        "content_unit_id": unit_id,
        "image_url": off["image_url"],
        "off_json": off["off_json"],
    }


def add_product(conn: sqlite3.Connection, data: dict) -> int:
    """Save a new product. If its OFF tags matched no category, teach the chosen category
    the most specific tag so the next similar product is assigned automatically."""
    try:
        tags = json.loads(data.get("off_json") or "{}").get("categories_tags")
    except (ValueError, AttributeError):
        tags = None
    learn = (
        isinstance(tags, list)
        and bool(tags)
        and data.get("category_id") is not None
        and suggest_category(conn, tags) is None
    )
    product_id = save(conn, "product", data)
    if learn:
        row = conn.execute(
            "SELECT off_tags FROM category WHERE id = ?", (data["category_id"],)
        ).fetchone()
        save(
            conn,
            "category",
            {"id": data["category_id"], "off_tags": [*json.loads(row[0]), tags[-1]]},
        )
    return product_id


# --- bookings ------------------------------------------------------------------


def _booking(
    conn, kind, batch_id, location_id, packages, source, user_id, to_location_id=None
):
    conn.execute(
        "INSERT INTO booking (ts, kind, batch_id, location_id, to_location_id, packages, source, user_id)"
        " VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        (_now(), kind, batch_id, location_id, to_location_id, packages, source, user_id),
    )  # fmt: skip


def _add(conn, batch_id: int, location_id: int, packages: int) -> None:
    conn.execute(
        "INSERT INTO stock (batch_id, location_id, packages) VALUES (?, ?, ?)"
        " ON CONFLICT (batch_id, location_id) DO UPDATE SET packages = packages + excluded.packages",
        (batch_id, location_id, packages),
    )


def _take(conn, batch_id: int, location_id: int, packages: int) -> None:
    """Remove packages from a stock row (caller checked availability); empty rows are deleted."""
    if _stock_of(conn, batch_id, location_id) == packages:
        conn.execute(
            "DELETE FROM stock WHERE batch_id = ? AND location_id = ?",
            (batch_id, location_id),
        )
    else:
        conn.execute(
            "UPDATE stock SET packages = packages - ? WHERE batch_id = ? AND location_id = ?",
            (packages, batch_id, location_id),
        )


def _exists(conn, table: str, row_id: int | None) -> None:
    if row_id is not None and not conn.execute(f"SELECT 1 FROM {table} WHERE id = ?", (row_id,)).fetchone():
        raise InventoryError("not_found")


def _positive(packages: int) -> None:
    if packages < 1:
        raise ValueError("packages must be >= 1")


def book_in(
    conn: sqlite3.Connection,
    product_id: int,
    packages: int,
    expires_on: date | str | None = None,
    expiry_type: str | None = None,
    location_id: int | None = None,
    source: str = "manual",
    user_id: str | None = None,
) -> int:
    """Book packages in; the same product+date+type merges into one batch. Returns batch id."""
    _positive(packages)
    eff = effective(conn, product_id)  # raises not_found
    expiry_type = expiry_type or eff["expiry_type"]["value"]
    if expiry_type not in ("best_before", "use_by"):
        raise InventoryError("invalid_value")
    location_id = location_id or eff["default_location_id"]["value"]
    if location_id is None:
        raise InventoryError("location_required")
    _exists(conn, "location", location_id)
    if expires_on:
        try:
            expires_on = date.fromisoformat(str(expires_on)).isoformat()
        except ValueError:
            raise InventoryError("invalid_date") from None
    else:
        expires_on = None
    row = conn.execute(
        "SELECT id FROM batch WHERE product_id = ? AND expiry_type = ? AND expires_on IS ?",
        (product_id, expiry_type, expires_on),
    ).fetchone()
    if row:
        batch_id = row["id"]
    else:
        batch_id = conn.execute(
            "INSERT INTO batch (product_id, expires_on, expiry_type, created_at) VALUES (?, ?, ?, ?)",
            (product_id, expires_on, expiry_type, _now()),
        ).lastrowid
    _add(conn, batch_id, location_id, packages)
    _booking(conn, "in", batch_id, location_id, packages, source, user_id)
    return batch_id


def book_out(
    conn: sqlite3.Connection,
    product_id: int,
    packages: int,
    batch_id: int | None = None,
    location_id: int | None = None,
    source: str = "manual",
    user_id: str | None = None,
) -> list[dict]:
    """Take packages, earliest expiry first (no date last). Nothing changes if too few."""
    _positive(packages)
    _exists(conn, "product", product_id)
    _exists(conn, "batch", batch_id)
    _exists(conn, "location", location_id)
    sql = (
        "SELECT s.batch_id, s.location_id, s.packages FROM stock s JOIN batch b ON b.id = s.batch_id"
        " WHERE b.product_id = ?"
    )
    args: list = [product_id]
    if batch_id is not None:
        sql += " AND s.batch_id = ?"
        args.append(batch_id)
    if location_id is not None:
        sql += " AND s.location_id = ?"
        args.append(location_id)
    rows = conn.execute(
        sql + " ORDER BY b.expires_on IS NULL, b.expires_on, s.location_id", args
    ).fetchall()
    available = sum(r["packages"] for r in rows)
    if available < packages:
        raise InventoryError("not_enough_stock", available=available)
    taken, left = [], packages
    for r in rows:
        n = min(left, r["packages"])
        _take(conn, r["batch_id"], r["location_id"], n)
        _booking(conn, "out", r["batch_id"], r["location_id"], n, source, user_id)
        taken.append(
            {"batch_id": r["batch_id"], "location_id": r["location_id"], "packages": n}
        )
        left -= n
        if not left:
            break
    return taken


def _stock_of(conn, batch_id: int, location_id: int) -> int:
    row = conn.execute(
        "SELECT packages FROM stock WHERE batch_id = ? AND location_id = ?",
        (batch_id, location_id),
    ).fetchone()
    return row["packages"] if row else 0


def move(
    conn: sqlite3.Connection,
    batch_id: int,
    from_location_id: int,
    to_location_id: int,
    packages: int,
    source: str = "manual",
    user_id: str | None = None,
) -> None:
    _positive(packages)
    if from_location_id == to_location_id:
        raise InventoryError("invalid_value")
    _exists(conn, "batch", batch_id)
    _exists(conn, "location", from_location_id)
    _exists(conn, "location", to_location_id)
    available = _stock_of(conn, batch_id, from_location_id)
    if available < packages:
        raise InventoryError("not_enough_stock", available=available)
    _take(conn, batch_id, from_location_id, packages)
    _add(conn, batch_id, to_location_id, packages)
    _booking(
        conn,
        "move",
        batch_id,
        from_location_id,
        packages,
        source,
        user_id,
        to_location_id,
    )


def correct(
    conn: sqlite3.Connection,
    batch_id: int,
    location_id: int,
    packages: int,
    source: str = "manual",
    user_id: str | None = None,
) -> None:
    """Set the absolute count (0 deletes the row); the booking stores the signed difference."""
    if packages < 0:
        raise ValueError("packages must be >= 0")
    _exists(conn, "batch", batch_id)
    _exists(conn, "location", location_id)
    diff = packages - _stock_of(conn, batch_id, location_id)
    if not diff:
        return
    if packages:
        conn.execute(
            "INSERT INTO stock (batch_id, location_id, packages) VALUES (?, ?, ?)"
            " ON CONFLICT (batch_id, location_id) DO UPDATE SET packages = excluded.packages",
            (batch_id, location_id, packages),
        )
    else:
        conn.execute(
            "DELETE FROM stock WHERE batch_id = ? AND location_id = ?",
            (batch_id, location_id),
        )
    _booking(conn, "correct", batch_id, location_id, diff, source, user_id)


# --- queries -------------------------------------------------------------------


def _chain(cats: dict, category_id: int | None) -> list[int]:
    """Category ids from the root down to category_id."""
    ids = []
    while category_id is not None:
        ids.append(category_id)
        category_id = cats[category_id]["parent_id"]
    return ids[::-1]


def _path(cats: dict, category_id: int) -> list[str]:
    return [cats[c]["name"] for c in _chain(cats, category_id)]


def stock_list(
    conn: sqlite3.Connection, search: str | None = None, location_id: int | None = None
) -> list[dict]:
    """One row per batch and location."""
    cats = _categories(conn)
    sql = (
        "SELECT s.batch_id, s.location_id, s.packages, l.name AS location, b.expires_on, b.expiry_type,"
        " p.id AS product_id, p.name, p.brand, p.ean, p.category_id"
        " FROM stock s JOIN batch b ON b.id = s.batch_id JOIN product p ON p.id = b.product_id"
        " JOIN location l ON l.id = s.location_id"
    )
    args: list = []
    if location_id is not None:
        sql += " WHERE s.location_id = ?"
        args.append(location_id)
    rows = []
    for r in conn.execute(
        sql + " ORDER BY p.name, b.expires_on IS NULL, b.expires_on", args
    ):
        row = dict(r)
        row["category_path"] = _path(cats, r["category_id"])
        rows.append(row)
    if search:
        needle = search.casefold()
        rows = [
            r for r in rows
            if needle in " ".join(
                [r["name"], r["brand"] or "", r["ean"] or "", r["location"], *r["category_path"]]
            ).casefold()
        ]  # fmt: skip
    return rows


def expiring(
    conn: sqlite3.Connection, today: date, days: int | None = None
) -> list[dict]:
    """Stock rows expiring within the product's warn_days, or within `days` if given."""
    dflt, cats = defaults(conn), _categories(conn)
    products = {
        r["id"]: dict(r) for r in conn.execute("SELECT id, category_id, warn_days FROM product")
    }
    out = []
    for r in stock_list(conn):
        if r["expires_on"] is None:
            continue
        if days is None:
            p = products[r["product_id"]]
            limit = _resolve(cats, p, p["category_id"], dflt)["warn_days"]["value"]
        else:
            limit = days
        days_left = (date.fromisoformat(r["expires_on"]) - today).days
        if days_left <= limit:
            out.append(
                {
                    **r,
                    "days_left": days_left,
                    "status": "expired" if days_left < 0 else "soon",
                }
            )
    return sorted(out, key=lambda r: r["expires_on"])


# --- amounts and shopping list ---------------------------------------------------


def _units(conn: sqlite3.Connection) -> dict[int, sqlite3.Row]:
    return {r["id"]: r for r in conn.execute("SELECT * FROM unit")}


def _convert(units: dict, value: float, from_id: int, to_id: int) -> float | None:
    if from_id == to_id:
        return value
    a, b = units[from_id], units[to_id]
    base_a, base_b = a["base_unit_id"] or a["id"], b["base_unit_id"] or b["id"]
    if base_a != base_b:
        return None
    return value * a["factor"] / b["factor"]


def _amount(
    units: dict, packages: int, content_amount, content_unit_id, unit_id: int
) -> float | None:
    if units[unit_id]["is_count"]:
        return packages
    if content_amount is None or content_unit_id is None:
        return None
    return _convert(units, packages * content_amount, content_unit_id, unit_id)


def shopping_list(conn: sqlite3.Connection) -> list[dict]:
    """Missing amounts from nested min stock, bottom-up (see docs/PLAN.md)."""
    dflt = defaults(conn)
    cats, units = _categories(conn), _units(conn)
    children: dict[int | None, list[int]] = {}
    for c in cats.values():
        children.setdefault(c["parent_id"], []).append(c["id"])
    products: dict[int, list[sqlite3.Row]] = {}
    for p in conn.execute(
        "SELECT p.id, p.category_id, p.content_amount, p.content_unit_id,"
        " COALESCE(SUM(s.packages), 0) AS packages FROM product p"
        " LEFT JOIN batch b ON b.product_id = p.id LEFT JOIN stock s ON s.batch_id = b.id GROUP BY p.id"
    ):
        products.setdefault(p["category_id"], []).append(p)
    unit_of = {cid: _resolve(cats, None, cid, dflt)["unit_id"]["value"] for cid in cats}
    items: list[dict] = []

    def walk(cid: int) -> tuple[list, float, bool]:
        """Returns (products in subtree, shortfall in this node's unit, any min stock below)."""
        unit_id = unit_of[cid]
        subtree, short, any_min = list(products.get(cid, [])), 0.0, False
        for child in children.get(cid, []):
            c_products, c_missing, c_any = walk(child)
            subtree += c_products
            any_min = any_min or c_any
            # children not convertible to this unit are not subtracted
            short += _convert(units, c_missing, unit_of[child], unit_id) or 0.0
        amounts = [
            _amount(
                units, p["packages"], p["content_amount"], p["content_unit_id"], unit_id
            )
            for p in subtree
            if p["packages"]
        ]
        stock = sum(a for a in amounts if a is not None)
        unknown = amounts.count(None)
        minimum = cats[cid]["min_stock"]
        if minimum is None:
            return (
                subtree,
                short,
                any_min,
            )  # no own minimum: pass children's shortfall up
        missing = round(max(0.0, minimum - stock - short), 6)  # float residue
        if missing:
            items.append({
                "category_id": cid,
                "name": cats[cid]["name"],
                "path": _path(cats, cid),
                "missing": missing,
                "unit_id": unit_id,
                "unit_symbol": units[unit_id]["symbol"],
                "unknown_products": unknown,
                "any_of_subtree": any_min,
            })  # fmt: skip
        return subtree, missing, True

    for root in children.get(None, []):
        walk(root)

    def key(item: dict) -> list:
        return [
            (cats[c]["sort"], cats[c]["name"])
            for c in _chain(cats, item["category_id"])
        ]

    return sorted(items, key=key)

