"""All business logic. Plain sync functions on a sqlite3 connection (no HA imports).

Callers use `inventory.<name>`; the submodules are an implementation detail
(common, master, inherit, products, suggest, booking, labels, codes, queries, amounts, shopping,
recipes, expiry_recipes, shopping_recipes, removal, ingredient_line, recipe_import, meal_plan, plan_shopping, canning, steps, learned, ai_check, ai_product, recipe_print, opened, frozen, stocktake, assist, ai_import, purchase).
"""

from .ai_check import changes as ai_changes
from .ai_check import prompt as ai_prompt
from .ai_import import MAX_PASTE
from .ai_import import page_sources as ai_page_sources
from .ai_import import prompt as ai_import_prompt
from .ai_import import to_recipe as ai_recipe
from .ai_product import changes as ai_product_changes
from .ai_product import prompt as ai_product_prompt
from .assist import expiring_stock as assist_expiring
from .assist import meal_plan as assist_meal_plan
from .assist import recipe as assist_recipe
from .assist import recipe_list as assist_recipes
from .assist import stock as assist_stock
from .booking import book_in, book_in_new, book_out, correct, edit_stock, move, put_back
from .canning import cannings, charge, save_canning
from .codes import (
    book_in_by_code,
    book_out_by_code,
    canning_by_name,
    frozen_by_code,
    open_by_code,
    plan_meal_by_name,
    recipe_by_name,
    shop_recipe_by_name,
)
from .common import InventoryError, check_ean
from .expiry_recipes import expiring_recipes
from .frozen import freeze, thaw, undo_frozen
from .ingredient_line import parse_ingredient, unit_add
from .inherit import defaults, effective
from .labels import book_out_code, label_info, location_label_info, open_code
from .master import delete, list_rows, master_data, save, save_defaults
from .meal_plan import (
    MEALS,
    delete_meal,
    meal_at,
    meal_times,
    meals,
    planned_recipes,
    save_meal,
    save_meal_times,
    shift_meals,
)
from .opened import open_package, undo_open
from .plan_shopping import plan_to_shopping_list
from .products import add_product, find_ean, list_products, product_draft, search_products
from .purchase import analyze as receipt_items
from .purchase import book_receipt
from .purchase import prompt as receipt_prompt
from .queries import expiring, stock_list
from .recipe_import import recipe_draft, recipe_import
from .recipe_print import recipe_sheet
from .recipes import recipe_availability, recipes, save_recipe
from .removal import delete_impact, force_delete, move_location
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
from .stocktake import stocktake_apply, stocktake_scan
from .suggest import keyword_score, suggest, suggest_by_keywords, suggest_category

__all__ = [
    "MAX_PASTE",
    "MEALS",
    "InventoryError",
    "add_product",
    "add_shopping_by_name",
    "add_shopping_item",
    "ai_changes",
    "ai_import_prompt",
    "ai_page_sources",
    "ai_product_changes",
    "ai_product_prompt",
    "ai_prompt",
    "ai_recipe",
    "assist_expiring",
    "assist_meal_plan",
    "assist_recipe",
    "assist_recipes",
    "assist_stock",
    "book_in",
    "book_in_by_code",
    "book_in_new",
    "book_out",
    "book_out_by_code",
    "book_out_code",
    "book_receipt",
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
    "expiring_recipes",
    "find_ean",
    "force_delete",
    "freeze",
    "frozen_by_code",
    "keyword_score",
    "label_info",
    "list_products",
    "list_rows",
    "location_label_info",
    "master_data",
    "meal_at",
    "meal_times",
    "meals",
    "move",
    "move_location",
    "open_by_code",
    "open_code",
    "open_package",
    "parse_ingredient",
    "plan_meal_by_name",
    "plan_to_shopping_list",
    "planned_recipes",
    "product_draft",
    "put_back",
    "receipt_items",
    "receipt_prompt",
    "recipe_availability",
    "recipe_by_name",
    "recipe_draft",
    "recipe_import",
    "recipe_items",
    "recipe_sheet",
    "recipes",
    "remove_shopping_recipe",
    "save",
    "save_canning",
    "save_defaults",
    "save_meal",
    "save_meal_times",
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
    "stocktake_apply",
    "stocktake_scan",
    "suggest",
    "suggest_by_keywords",
    "suggest_category",
    "thaw",
    "undo_frozen",
    "undo_open",
    "unit_add",
    "update_shopping_item",
]
