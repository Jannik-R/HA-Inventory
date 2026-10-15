"""All business logic. Plain sync functions on a sqlite3 connection (no HA imports).

Callers use `inventory.<name>`; the submodules are an implementation detail.
"""

from .common import COLUMNS, INHERITED, InventoryError
from .master import delete, list_rows, master_data, save
from .inherit import defaults, effective
from .products import add_product, find_ean, list_products, product_draft, search_products
from .suggest import keyword_score, suggest, suggest_by_keywords, suggest_by_name, suggest_category
from .booking import book_in, book_in_new, book_out, correct, edit_stock, move
from .queries import expiring, shopping_list, stock_list

__all__ = [
    "COLUMNS",
    "INHERITED",
    "InventoryError",
    "add_product",
    "book_in",
    "book_in_new",
    "book_out",
    "correct",
    "defaults",
    "delete",
    "edit_stock",
    "effective",
    "expiring",
    "find_ean",
    "keyword_score",
    "list_products",
    "list_rows",
    "master_data",
    "move",
    "product_draft",
    "save",
    "search_products",
    "shopping_list",
    "stock_list",
    "suggest",
    "suggest_by_keywords",
    "suggest_by_name",
    "suggest_category",
]
