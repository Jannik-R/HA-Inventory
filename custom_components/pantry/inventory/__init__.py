"""All business logic. Plain sync functions on a sqlite3 connection (no HA imports).

Callers use `inventory.<name>`; the submodules are an implementation detail
(common, master, inherit, products, suggest, booking, labels, codes, queries, amounts, shopping,
recipes, shopping_recipes, removal, ingredient_line, recipe_import, meal_plan, canning, steps).
"""

from .booking import book_in, book_in_new, book_out, correct, edit_stock, move, put_back
from .canning import cannings, charge, save_canning
from .codes import (
    book_in_by_code,
    book_out_by_code,
    canning_by_name,
    plan_meal_by_name,
    shop_recipe_by_name,
)
from .common import InventoryError, check_ean
from .ingredient_line import parse_ingredient, unit_add
from .inherit import defaults, effective
from .labels import book_out_code, label_info
from .master import delete, list_rows, master_data, save, save_defaults
from .meal_plan import delete_meal, meals, save_meal, shift_meals
from .products import add_product, find_ean, list_products, product_draft, search_products
from .queries import expiring, stock_list
from .recipe_import import recipe_import
from .recipes import recipe_availability, recipes, save_recipe
from .removal import delete_impact, force_delete
from .shopping import (
    add_shopping_by_name,
    add_shopping_item,
    delete_shopping_item,
    set_recipe_done,
    set_shopping_done,
    shopping_list,
    update_shopping_item,
)
from .shopping_recipes import (
    recipe_items,
    remove_shopping_recipe,
    set_shopping_recipe,
    shopping_recipes,
)
from .suggest import keyword_score, suggest, suggest_by_keywords, suggest_category

__all__ = [
    "InventoryError",
    "add_product",
    "add_shopping_by_name",
    "add_shopping_item",
    "book_in",
    "book_in_by_code",
    "book_in_new",
    "book_out",
    "book_out_by_code",
    "book_out_code",
    "canning_by_name",
    "cannings",
    "charge",
    "check_ean",
    "correct",
    "defaults",
    "delete",
    "delete_impact",
    "delete_meal",
    "delete_shopping_item",
    "edit_stock",
    "effective",
    "expiring",
    "find_ean",
    "force_delete",
    "keyword_score",
    "label_info",
    "list_products",
    "list_rows",
    "master_data",
    "meals",
    "move",
    "parse_ingredient",
    "plan_meal_by_name",
    "product_draft",
    "put_back",
    "recipe_availability",
    "recipe_import",
    "recipe_items",
    "recipes",
    "remove_shopping_recipe",
    "save",
    "save_canning",
    "save_defaults",
    "save_meal",
    "save_recipe",
    "search_products",
    "set_recipe_done",
    "set_shopping_done",
    "set_shopping_recipe",
    "shift_meals",
    "shop_recipe_by_name",
    "shopping_list",
    "shopping_recipes",
    "stock_list",
    "suggest",
    "suggest_by_keywords",
    "suggest_category",
    "unit_add",
    "update_shopping_item",
]
