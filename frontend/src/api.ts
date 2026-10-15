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
  effective: Record<InheritField, { value: number | string | null; source: Source }>;
}
export interface MasterData {
  units: Unit[];
  locations: Location[];
  categories: Category[];
  defaults: Record<InheritField, number | string | null>;
}
export type Table = "unit" | "location" | "category";

export const getMasterData = (hass: Hass) =>
  hass.callWS<MasterData>({ type: "pantry/master_data" });
export const saveRow = (hass: Hass, table: Table, data: Record<string, unknown>) =>
  hass.callWS<{ id: number }>({ type: "pantry/save", table, data });
export const deleteRow = (hass: Hass, table: Table, row_id: number) =>
  hass.callWS<unknown>({ type: "pantry/delete", table, row_id });

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
}
export interface StockRow {
  batch_id: number;
  location_id: number;
  location: string;
  packages: number;
  expires_on: string | null;
  expiry_type: "best_before" | "use_by";
  product_id: number;
  name: string;
  brand: string | null;
  ean: string | null;
  category_id: number;
  category_path: string[];
}
export interface BookIn {
  packages: number;
  expires_on?: string | null;
  expiry_type?: "best_before" | "use_by";
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
) => hass.callWS<{ taken: unknown[] }>({ type: "pantry/book_out", ...data });
export const getStock = (hass: Hass, product_id?: number) =>
  hass.callWS<StockRow[]>({ type: "pantry/stock", product_id });
export const listProducts = (hass: Hass) => hass.callWS<Product[]>({ type: "pantry/products" });
export const saveProduct = (hass: Hass, data: Record<string, unknown>) =>
  hass.callWS<{ id: number }>({ type: "pantry/product_save", data });
