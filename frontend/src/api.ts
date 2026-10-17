export interface Hass {
  language: string;
  user?: { is_admin: boolean };
  locale?: { language: string };
  callWS<T>(msg: Record<string, unknown>): Promise<T>;
  loadBackendTranslation?(
    category: string,
    integration: string,
  ): Promise<(key: string, values?: Record<string, string>) => string>;
}

export const isAdmin = (hass?: Hass) => !!hass?.user?.is_admin;

interface WsError {
  message?: string;
  translation_domain?: string;
  translation_key?: string;
  translation_placeholders?: Record<string, string>;
}

/** Backend errors in the user's language (HA translates them only in the server language). */
export async function errorMessage(hass: Hass, err: unknown): Promise<string> {
  const e = err as WsError;
  if (e.translation_key && e.translation_domain && hass.loadBackendTranslation) {
    const localize = await hass.loadBackendTranslation("exceptions", e.translation_domain);
    const text = localize(
      `component.${e.translation_domain}.exceptions.${e.translation_key}.message`,
      e.translation_placeholders,
    );
    if (text) return text;
  }
  return e.message ?? String(err);
}

export interface Unit {
  id: number;
  name: string;
  symbol: string;
  base_unit_id: number | null;
  factor: number;
  is_count: number;
}
export interface Location {
  id: number;
  name: string;
  sort: number;
}
export type Source = "own" | number | "default";
export type InheritField = "unit_id" | "default_location_id" | "expiry_type" | "warn_days";
export interface Category {
  id: number;
  parent_id: number | null;
  name: string;
  sort: number;
  off_tags: string[];
  unit_id: number | null;
  default_location_id: number | null;
  expiry_type: "best_before" | "use_by" | null;
  warn_days: number | null;
  min_stock: number | null;
  min_stock_unit_id: number | null;
  min_packages: number | null;
  effective: Record<InheritField, { value: number | string | null; source: Source }>;
}
export interface MasterData {
  units: Unit[];
  locations: Location[];
  categories: Category[];
  defaults: Record<InheritField, number | string | null>;
}
export type Table = "unit" | "location" | "category";
/** What `pantry/delete` accepts: master data plus products and recipes. */
export type DeleteTable = Table | "product" | "recipe";

export const getMasterData = (hass: Hass) =>
  hass.callWS<MasterData>({ type: "pantry/master_data" });
export const saveRow = (hass: Hass, table: Table, data: Record<string, unknown>) =>
  hass.callWS<{ id: number }>({ type: "pantry/save", table, data });
export const saveDefaults = (hass: Hass, data: MasterData["defaults"]) =>
  hass.callWS<unknown>({ type: "pantry/defaults_save", data });
/** `force`: also delete what uses the row (see getDeleteImpact); `move_to`: target for a location's stock. */
export const deleteRow = (
  hass: Hass,
  table: DeleteTable,
  row_id: number,
  opts: { force?: boolean; move_to?: number | null } = {},
) => hass.callWS<unknown>({ type: "pantry/delete", table, row_id, ...opts });
export interface DeleteGroup {
  /** "<delete|change>.<table>" */
  kind: string;
  count: number;
  /** Distinct, sorted; empty for rows without a name (bookings). */
  names: string[];
  packages?: number;
}
export const getDeleteImpact = (hass: Hass, table: DeleteTable, row_id: number) =>
  hass.callWS<{ blocked: string | null; groups: DeleteGroup[] }>({
    type: "pantry/delete_impact",
    table,
    row_id,
  });

/** A saved product (has id) or an unsaved Open Food Facts draft (no id). */
export interface Product {
  id?: number;
  ean: string | null;
  name: string;
  brand: string | null;
  category_id: number | null;
  content_amount: number | null;
  content_unit_id: number | null;
  default_location_id?: number | null;
  expiry_type?: "best_before" | "use_by" | null;
  warn_days?: number | null;
  /** Below this many packages the product goes on the shopping list. */
  min_packages?: number | null;
  /** Packages in stock (product list only). */
  packages?: number;
  image_url?: string | null;
  off_json?: string | null;
}
export interface SearchHit {
  id?: number;
  ean: string | null;
  name: string;
  brand: string | null;
  category_id?: number | null;
}
/** A new lowest-level category ("Produktart") under `parent_id`. */
export const addProductType = (hass: Hass, name: string, parent_id: number) =>
  hass.callWS<{ id: number }>({ type: "pantry/product_type_add", name, parent_id });
export interface StockRow {
  batch_id: number;
  location_id: number;
  location: string;
  packages: number;
  expires_on: string | null;
  /** The product's date type (own or inherited); batches have none of their own. */
  expiry_type: "best_before" | "use_by";
  product_id: number;
  name: string;
  brand: string | null;
  ean: string | null;
  category_id: number;
  category_path: string[];
}
interface BookIn {
  packages: number;
  expires_on?: string | null;
  location_id?: number | null;
  product_id?: number;
  product?: Record<string, unknown>;
}

export const lookup = (hass: Hass, code: string) =>
  hass.callWS<{ product: Product | null }>({ type: "pantry/lookup", code });
export const search = (hass: Hass, query: string, online = false) =>
  hass.callWS<SearchHit[]>({ type: "pantry/search", query, online });
export const bookIn = (hass: Hass, data: BookIn) =>
  hass.callWS<{ product_id: number; batch_id: number }>({ type: "pantry/book_in", ...data });
export const bookOut = (
  hass: Hass,
  data: { product_id: number; packages: number; batch_id?: number; location_id?: number },
) => hass.callWS<{ taken: Taken[] }>({ type: "pantry/book_out", ...data });
/** What a book-out took, per batch and location; `putBack` undoes it. */
export interface Taken {
  batch_id: number;
  location_id: number;
  packages: number;
  booking_id: number;
}
export const putBack = (hass: Hass, taken: Taken[]) =>
  hass.callWS<null>({
    type: "pantry/put_back",
    booking_ids: taken.map((x) => x.booking_id),
  });
export const editStock = (
  hass: Hass,
  data: {
    batch_id: number;
    location_id: number;
    expires_on: string | null;
    packages: number;
  },
) => hass.callWS<{ batch_id: number }>({ type: "pantry/stock_edit", ...data });
export const getStock = (hass: Hass, product_id?: number) =>
  hass.callWS<StockRow[]>({ type: "pantry/stock", product_id });
export const listProducts = (hass: Hass) => hass.callWS<Product[]>({ type: "pantry/products" });
export const saveProduct = (hass: Hass, data: Record<string, unknown>) =>
  hass.callWS<{ id: number }>({ type: "pantry/product_save", data });

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

export interface LabelConfig {
  printer: boolean;
  print_on_book_in: boolean;
  width_mm: number;
  height_mm: number;
}
/** Browser mode: one label image (data url), to be printed `count` times. */
type PrintResult =
  { printed: number } | { image: string; count: number; width_mm: number; height_mm: number };
export const getLabelConfig = (hass: Hass) =>
  hass.callWS<LabelConfig>({ type: "pantry/label_config" });
export const printLabelsWs = (hass: Hass, data: { batch_id: number; count: number }) =>
  hass.callWS<PrintResult>({ type: "pantry/print_labels", ...data });
export const bookOutLabel = (hass: Hass, code: string) =>
  hass.callWS<{ name: string; location: string; taken: Taken[] }>({
    type: "pantry/book_out_label",
    code,
  });

type IngredientStatus = "available" | "partial" | "missing" | "unknown" | "unmatched" | "skipped";
export interface Ingredient {
  id?: number;
  category_id: number | null;
  amount: number | null;
  unit_id: number | null;
  text: string;
  note?: string | null;
  optional: boolean;
  skip_stock: boolean;
  /** Import only: the original line and the unit word that matched no unit. */
  line?: string;
  unit_hint?: string | null;
  status?: IngredientStatus;
  /** With an amount (matched): need/have/missing in `unit_symbol`. */
  need?: number;
  have?: number;
  missing?: number;
  unit_symbol?: string;
  unknown_products?: number;
  /** Without an amount (matched): packages. */
  packages?: number;
}
export interface Recipe {
  id: number;
  name: string;
  servings: number;
  instructions: string | null;
  source_url: string | null;
  image_url: string | null;
  ingredients: Ingredient[];
  summary: { available: number; total: number };
}
export const getRecipes = (hass: Hass) => hass.callWS<Recipe[]>({ type: "pantry/recipes" });
export const getRecipeAvailability = (hass: Hass, recipe_id: number, servings: number) =>
  hass.callWS<Ingredient[]>({ type: "pantry/recipe_availability", recipe_id, servings });
export const saveRecipe = (hass: Hass, data: Record<string, unknown>) =>
  hass.callWS<{ id: number }>({ type: "pantry/recipe_save", data });
export type RecipeDraft = Omit<Recipe, "id" | "summary">;
export const importRecipe = (hass: Hass, url: string) =>
  hass.callWS<RecipeDraft>({ type: "pantry/recipe_import", url });
export const addUnit = (hass: Hass, name: string, symbol?: string) =>
  hass.callWS<{ id: number }>({ type: "pantry/unit_add", name, symbol });
