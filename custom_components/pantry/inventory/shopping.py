"""Shopping list: shortages from nested min stock (amount, packages; products: packages)
plus items added by hand."""

from __future__ import annotations

import sqlite3

from .amounts import _amount, _convert, _stock_by_category, _units
from .common import InventoryError, _now, id_by_name
from .inherit import _categories, _chain, _path, children
from .master import save
from .products import add_product


def _key(item: dict) -> str:
    """The shortage a check refers to; a different shortage shows the item again."""
    amount = item["amount"]["missing"] if item["amount"] else None
    return f"{amount}|{item['packages']}"


def shopping_list(conn: sqlite3.Connection) -> list[dict]:
    """Missing amount / packages per node, bottom-up, each dimension apart (see docs/PLAN.md)."""
    cats, units = _categories(conn), _units(conn)
    kids = children(cats)
    products = _stock_by_category(conn)
    done = dict(conn.execute("SELECT category_id, missing FROM shopping_done").fetchall())
    done_p = dict(conn.execute("SELECT product_id, missing FROM shopping_done_product").fetchall())
    items: list[dict] = []

    def walk(cid: int) -> tuple[list, list[tuple[float, int]], int, bool]:
        """(products in subtree, amount shortfalls as (value, unit), package shortfall, any min below)."""
        subtree = list(products.get(cid, []))
        short_amount: list[tuple[float, int]] = []
        short_packages, any_min = 0, False
        # A product's minimum: its own item; the shortfall counts toward the categories above.
        for p in subtree:
            if p["min_packages"] is None:
                continue
            any_min = True
            missing = max(0, p["min_packages"] - p["packages"])
            if not missing:
                continue
            short_packages += missing
            if p["content_amount"] is not None:
                short_amount.append((missing * p["content_amount"], p["content_unit_id"]))
            item = {
                "id": None,
                "manual": False,
                "product_id": p["id"],
                "brand": p["brand"],
                "category_id": cid,
                "name": p["name"],
                "path": _path(cats, cid),
                "amount": None,
                "packages": missing,
                "any_of_subtree": False,
            }
            item["done"] = done_p.get(p["id"]) == _key(item)
            items.append(item)
        for child in kids.get(cid, []):
            c_products, c_amount, c_packages, c_any = walk(child)
            subtree += c_products
            short_amount += c_amount
            short_packages += c_packages
            any_min = any_min or c_any
        row = cats[cid]
        amount = None
        if row["min_stock"] is not None:
            unit_id = row["min_stock_unit_id"]
            amounts = [
                _amount(
                    units,
                    p["packages"],
                    p["content_amount"],
                    p["content_unit_id"],
                    unit_id,
                )
                for p in subtree
                if p["packages"]
            ]
            # children's shortfalls not convertible to this unit are not subtracted
            short = sum(_convert(units, v, u, unit_id) or 0.0 for v, u in short_amount)
            missing = round(
                max(
                    0.0,
                    row["min_stock"] - sum(a for a in amounts if a is not None) - short,
                ),
                6,
            )
            short_amount = [(missing, unit_id)]  # replaces the children's: no double counting
            if missing:
                amount = {
                    "missing": missing,
                    "unit_id": unit_id,
                    "unit_symbol": units[unit_id]["symbol"],
                    "unknown_products": amounts.count(None),
                }
        packages = None
        if row["min_packages"] is not None:
            stock = sum(p["packages"] for p in subtree)
            short_packages = max(0, row["min_packages"] - stock - short_packages)
            packages = short_packages or None
        if amount or packages:
            item = {
                "id": None,
                "manual": False,
                "product_id": None,
                "brand": None,
                "category_id": cid,
                "name": row["name"],
                "path": _path(cats, cid),
                "amount": amount,
                "packages": packages,
                "any_of_subtree": any_min,
            }
            item["done"] = done.get(cid) == _key(item)
            items.append(item)
        has_min = row["min_stock"] is not None or row["min_packages"] is not None
        return subtree, short_amount, short_packages, any_min or has_min

    for root in kids.get(None, []):
        walk(root)
    # A check whose shortage is gone or changed is stale: drop it, or it would come back later.
    # (`items` holds only min stock items here; items by hand are added below.)
    checked = [i for i in items if i["done"]]
    for cid in done.keys() - {i["category_id"] for i in checked if i["product_id"] is None}:
        conn.execute("DELETE FROM shopping_done WHERE category_id = ?", (cid,))
    for pid in done_p.keys() - {i["product_id"] for i in checked}:
        conn.execute("DELETE FROM shopping_done_product WHERE product_id = ?", (pid,))
    for r in conn.execute(
        "SELECT i.*, p.name AS product, p.brand, p.category_id AS product_category"
        " FROM shopping_item i LEFT JOIN product p ON p.id = i.product_id"
    ):
        cid = r["category_id"] or r["product_category"]
        items.append({
            "id": r["id"],
            "manual": True,
            "product_id": r["product_id"],
            "brand": r["brand"],
            "category_id": cid,
            "name": r["product"] or cats[cid]["name"],
            "path": _path(cats, cid),
            "amount": None,
            "packages": r["packages"],
            "any_of_subtree": False,
            "done": bool(r["done"]),
        })  # fmt: skip
    return sorted(
        items,
        key=lambda i: [
            *((cats[c]["sort"], cats[c]["name"]) for c in _chain(cats, i["category_id"])),
            (i["manual"], i["name"]),
        ],
    )


def set_shopping_done(
    conn: sqlite3.Connection, category_id: int | None, done: bool, product_id: int | None = None
) -> None:
    """Check / uncheck a min stock item of a category, or of a product (`product_id`);
    a check holds while the item's shortage stays the same."""
    if (category_id is None) == (product_id is None):
        raise InventoryError("invalid_value")
    table, col, ref = (
        ("shopping_done", "category_id", category_id)
        if product_id is None
        else ("shopping_done_product", "product_id", product_id)
    )
    conn.execute(f"DELETE FROM {table} WHERE {col} = ?", (ref,))
    item = next(
        (
            i
            for i in shopping_list(conn)
            if not i["manual"] and i["product_id"] == product_id and i[col] == ref
        ),
        None,
    )
    if done and item:
        conn.execute(f"INSERT INTO {table} ({col}, missing) VALUES (?, ?)", (ref, _key(item)))


def add_shopping_item(
    conn: sqlite3.Connection,
    packages: int = 1,
    product_id: int | None = None,
    category_id: int | None = None,
    product: dict | None = None,
    category: dict | None = None,
) -> int:
    """Put a product or a category on the list; `product` / `category` create a new one first.
    An open item for the same thing gets the packages added; a checked one starts again."""
    if product is not None:
        product_id = add_product(conn, product)
    if category is not None:
        category_id = save(conn, "category", category)
    if (product_id is None) == (category_id is None):
        raise InventoryError("invalid_value")
    col, ref = (
        ("product_id", product_id) if product_id is not None else ("category_id", category_id)
    )
    row = conn.execute(f"SELECT id, done FROM shopping_item WHERE {col} = ?", (ref,)).fetchone()
    try:
        if row is None:
            return conn.execute(
                f"INSERT INTO shopping_item ({col}, packages, created_at) VALUES (?, ?, ?)",
                (ref, packages, _now()),
            ).lastrowid
        conn.execute(
            "UPDATE shopping_item SET packages = CASE WHEN done THEN ? ELSE packages + ? END,"
            " done = 0 WHERE id = ?",
            (packages, packages, row["id"]),
        )
    except sqlite3.IntegrityError as err:  # unknown product / category, packages < 1
        raise InventoryError("not_found" if "FOREIGN" in str(err) else "invalid_value") from err
    return row["id"]


def add_shopping_by_name(conn: sqlite3.Connection, name: str) -> int:
    """Free text (e.g. from HA's to-do card): a product, else a category, with exactly this name."""
    for table, col in (("product", "product_id"), ("category", "category_id")):
        if found := id_by_name(conn.execute(f"SELECT id, name FROM {table} ORDER BY id"), name):
            return add_shopping_item(conn, **{col: found})
    raise InventoryError("shopping_unknown", name=name.strip())


def update_shopping_item(
    conn: sqlite3.Connection, item_id: int, packages: int | None = None, done: bool | None = None
) -> None:
    """Change the packages and/or the check mark of an item added by hand."""
    for col, value in (("packages", packages), ("done", done)):
        if value is None:
            continue
        try:
            cur = conn.execute(
                f"UPDATE shopping_item SET {col} = ? WHERE id = ?", (int(value), item_id)
            )
        except sqlite3.IntegrityError as err:
            raise InventoryError("invalid_value") from err
        if not cur.rowcount:
            raise InventoryError("not_found")


def delete_shopping_item(conn: sqlite3.Connection, item_id: int) -> None:
    if not conn.execute("DELETE FROM shopping_item WHERE id = ?", (item_id,)).rowcount:
        raise InventoryError("not_found")
