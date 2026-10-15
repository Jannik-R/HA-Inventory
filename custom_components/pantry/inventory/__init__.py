"""All business logic. Plain sync functions on a sqlite3 connection (no HA imports).

Callers use `inventory.<name>`; the submodules are an implementation detail.
"""

from .common import COLUMNS, INHERITED, InventoryError
from .master import delete, list_rows, master_data, save, save_defaults
from .inherit import defaults, effective
from .products import add_product, find_ean, list_products, product_draft, search_products
from .suggest import keyword_score, suggest, suggest_by_keywords, suggest_by_name, suggest_category
from .booking import book_in, book_in_new, book_out, correct, edit_stock, move
from .queries import expiring, stock_list
from .removal import delete_impact, force_delete
from .shopping import (
    add_shopping_by_name,
    add_shopping_item,
    delete_shopping_item,
    set_shopping_done,
    shopping_list,
    update_shopping_item,
)

__all__ = [
    "COLUMNS",
    "INHERITED",
    "InventoryError",
    "add_product",
    "add_shopping_by_name",
    "add_shopping_item",
    "book_in",
    "book_in_new",
    "book_out",
    "correct",
    "defaults",
    "delete",
    "delete_impact",
    "delete_shopping_item",
    "edit_stock",
    "effective",
    "expiring",
    "find_ean",
    "force_delete",
    "keyword_score",
    "list_products",
    "list_rows",
    "master_data",
    "move",
    "product_draft",
    "save",
    "save_defaults",
    "search_products",
    "set_shopping_done",
    "shopping_list",
    "stock_list",
    "suggest",
    "suggest_by_keywords",
    "suggest_by_name",
    "suggest_category",
    "update_shopping_item",
]
