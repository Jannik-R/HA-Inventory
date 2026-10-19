"""Receipt import: the AI reads the OCR text of a shopping receipt (prompt + answer check here,
ai.py sends it), the panel shows the items for review, `book_receipt` books them in and learns
which product a receipt line of a store is (table receipt_line)."""

from __future__ import annotations

import sqlite3

from .booking import book_in
from .common import InventoryError
from .inherit import effective
from .products import add_product
from .suggest import suggest

MAX_TEXT = 8000  # characters of OCR text; a long receipt is ~2000
MAX_ITEMS = 100
MAX_CANDIDATES = 5

# Fixed part first and byte-identical between calls (prompt prefix caching, see ai_check).
_TASK = """You read a German shopping receipt for "Vorrat", a household inventory in Home Assistant.
The text comes from OCR and may have errors. Find the store name and the bought items. Leave out
deposit (Pfand, Leergut), bags (Tragetasche, Tüte), discounts and coupons (Rabatt, negative amounts),
totals, payment, tax and every line that is not a product.
For each item:
- "text": the product part of the line as printed, without price and quantity
- "name": a short readable German product name without brand and package size
  (e.g. "H-Milch 3,5%" for "JA H-MILCH 3,5% 1L")
- "packages": how many were bought ("2 x 1,19" = 2; weighed goods = 1)
- "product_ids": ids from the product list below that this item may be, best first; [] when none
  fits. Only ids from the list.

Answer with JSON only: {"store": "<store name or empty>", "items": [...]}.

Products (id|name|brand):
"""


def line_key(text: str) -> str:
    """Lower case, single spaces: receipt lines differ only in such details between scans."""
    return " ".join(text.casefold().split())[:200]


def prompt(conn: sqlite3.Connection, text: str) -> str:
    if not text.strip() or len(text) > MAX_TEXT:
        raise InventoryError("invalid_value")
    rows = conn.execute("SELECT id, name, brand FROM product ORDER BY name")
    products = "\n".join(f"{r['id']}|{r['name']}|{r['brand'] or ''}" for r in rows)
    return f"{_TASK}{products}\n\nReceipt:\n{text.strip()}\n"


def _learned(conn: sqlite3.Connection, store: str, key: str) -> int | None:
    """Product booked for this line before: same store first, then any store."""
    row = conn.execute(
        "SELECT product_id FROM receipt_line WHERE key = ? ORDER BY store = ? DESC LIMIT 1",
        (key, store),
    ).fetchone()
    return row[0] if row else None


def analyze(conn: sqlite3.Connection, answer: object) -> dict:
    """Checked AI answer -> {store, items: [{text, name, packages, product_id, candidates,
    category_id}]}; a candidate is {id, name, brand, shelf_days}. product_id: learned or the only candidate, else None (the user chooses);
    category_id: suggestion for a new product. Unknown ids and odd fields are dropped."""
    if not isinstance(answer, dict) or not isinstance(answer.get("items"), list):
        raise InventoryError("ai_failed")
    store = answer.get("store") if isinstance(answer.get("store"), str) else ""
    store = store.strip()[:100]
    names = {
        r["id"]: {"id": r["id"], "name": r["name"], "brand": r["brand"]}
        for r in conn.execute("SELECT id, name, brand FROM product")
    }
    items = []
    for it in answer["items"][:MAX_ITEMS]:
        if not isinstance(it, dict) or not isinstance(it.get("text"), str):
            continue
        text = it["text"].strip()[:200]
        if not (key := line_key(text)):
            continue
        name = it.get("name") if isinstance(it.get("name"), str) else ""
        name = name.strip()[:200] or text
        packages = it.get("packages")
        packages = packages if isinstance(packages, int) and 1 <= packages <= 99 else 1
        ids = it.get("product_ids") if isinstance(it.get("product_ids"), list) else []
        learned = _learned(conn, line_key(store), key)
        found = [learned] if learned else []
        found += [i for i in ids if isinstance(i, int) and i in names and i not in found]
        found = found[:MAX_CANDIDATES]
        items.append(
            {
                "text": text,
                "name": name,
                "packages": packages,
                "product_id": learned or (found[0] if len(found) == 1 else None),
                "candidates": [
                    {**names[i], "shelf_days": effective(conn, i)["shelf_days"]["value"]}
                    for i in found
                ],
                "category_id": suggest(conn, [], name),
            }
        )
    return {"store": store, "items": items}


def book_receipt(
    conn: sqlite3.Connection, store: str, items: list[dict], user_id: str | None = None
) -> dict:
    """Book every item in (one transaction): `product_id` or a new `product` {name, category_id},
    packages, expires_on (empty: guessed from the shelf life), location_id (empty: default).
    Remembers line -> product for the store. Returns {booked: packages, rows: items}."""
    store_key = line_key(store or "")
    booked = 0
    for it in items:
        product_id = it.get("product_id") or add_product(conn, it["product"])
        book_in(
            conn,
            product_id,
            it["packages"],
            it.get("expires_on"),
            it.get("location_id"),
            "receipt",
            user_id,
        )
        booked += it["packages"]
        if key := line_key(it.get("text") or ""):
            conn.execute(
                "INSERT INTO receipt_line (store, key, product_id) VALUES (?, ?, ?)"
                " ON CONFLICT (store, key) DO UPDATE SET product_id = excluded.product_id",
                (store_key, key, product_id),
            )
    return {"booked": booked, "rows": len(items)}
