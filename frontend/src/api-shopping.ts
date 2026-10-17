import type { Hass, Product } from "./api";

export interface ShoppingItem {
  /** Set for items added by hand (`manual`); min stock shortages have none. */
  id: number | null;
  manual: boolean;
  product_id: number | null;
  brand: string | null;
  category_id: number;
  name: string;
  /** Category names from the main category down to this one. */
  path: string[];
  amount: {
    missing: number;
    unit_id: number;
    unit_symbol: string;
    unknown_products: number;
  } | null;
  packages: number | null;
  /** Minimums below are counted already: the rest is "any of this category". */
  any_of_subtree: boolean;
  done: boolean;
  /** The recipes this item is needed for: `no` (position in the alphabetically sorted shopping recipes) and need; for items
   * without an amount the need as written in the recipe ("2 EL"). */
  recipes: { no: number; name: string; amount: number | null; unit_symbol: string | null }[];
  /** Items from recipes only: the todo uid (`r<category>-<unit>`) used for checking. */
  key?: string;
}
export const getShopping = (hass: Hass) => hass.callWS<ShoppingItem[]>({ type: "pantry/shopping" });
/** Check a min stock item: a product's (`product_id`) or else a category's. */
export const setShoppingDone = (hass: Hass, item: ShoppingItem, done: boolean) =>
  hass.callWS<unknown>({
    type: "pantry/shopping_done",
    ...(item.product_id ? { product_id: item.product_id } : { category_id: item.category_id }),
    done,
  });
export const addShopping = (
  hass: Hass,
  data: {
    packages: number;
    product_id?: number;
    category_id?: number;
    product?: Product;
    category?: { name: string; parent_id: number | null };
  },
) => hass.callWS<{ id: number }>({ type: "pantry/shopping_add", ...data });
export const updateShoppingItem = (
  hass: Hass,
  item_id: number,
  data: { packages?: number; done?: boolean },
) => hass.callWS<unknown>({ type: "pantry/shopping_item", item_id, ...data });
export const deleteShoppingItem = (hass: Hass, item_id: number) =>
  hass.callWS<unknown>({ type: "pantry/shopping_item_delete", item_id });
export interface ShoppingRecipe {
  recipe_id: number;
  /** 1, 2, …: short reference on the list items. */
  no: number;
  name: string;
  servings: number;
  /** Ingredient ids of the optional ingredients that count. */
  optional: number[];
}
export const getShoppingRecipes = (hass: Hass) =>
  hass.callWS<ShoppingRecipe[]>({ type: "pantry/shopping_recipes" });
export const setShoppingRecipe = (
  hass: Hass,
  recipe_id: number,
  servings: number,
  optional: number[],
) => hass.callWS<unknown>({ type: "pantry/shopping_recipe_set", recipe_id, servings, optional });
export const removeShoppingRecipe = (hass: Hass, recipe_id: number) =>
  hass.callWS<unknown>({ type: "pantry/shopping_recipe_remove", recipe_id });
export const setShoppingRecipeDone = (hass: Hass, key: string, done: boolean) =>
  hass.callWS<unknown>({ type: "pantry/shopping_recipe_done", key, done });
