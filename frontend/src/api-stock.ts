import type { Diet, ExpiryType, Hass } from "./api";

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
  expiry_type?: ExpiryType | null;
  warn_days?: number | null;
  shelf_days?: number | null;
  opened_days?: number | null;
  frozen_days?: number | null;
  /** Own diet / allergens, null = inherit from the category. */
  diet?: Diet | null;
  allergens?: string | null;
  /** Below this many packages the product goes on the shopping list. */
  min_packages?: number | null;
  /** Packages in stock (product list only). */
  packages?: number;
  image_url?: string | null;
  off_json?: string | null;
  /** Proposed by the AI check (book-in form only, category_id stays null): added before booking. */
  new_type?: NewType;
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
  hass.callWS<{ id: number }>({ type: "home_inventory/product_type_add", name, parent_id });
export interface StockRow {
  batch_id: number;
  location_id: number;
  location: string;
  packages: number;
  /** Effective expiry: earlier than the batch date when opened (opened_on + opened days). */
  expires_on: string | null;
  /** The batch's own date (what the stock edit changes). */
  batch_expires_on: string | null;
  /** Set on an opened package (its own batch). */
  opened_on: string | null;
  /** Level of the partly used package of an opened batch: 1 = full, 0.5 = half. */
  remaining: number;
  /** Set on a frozen package (its own batch, dated frozen_on + frozen days). */
  frozen_on: string | null;
  /** 1: the date was guessed at book-in (today + shelf life), nobody entered it. */
  expiry_guessed: number;
  /** The product's date type (own or inherited); batches have none of their own. */
  expiry_type: ExpiryType;
  product_id: number;
  name: string;
  brand: string | null;
  ean: string | null;
  category_id: number;
  category_path: string[];
  /** Canning charge (YYYYMMDD-n) when the batch is one. */
  charge: string | null;
}
interface BookIn {
  packages: number;
  expires_on?: string | null;
  location_id?: number | null;
  product_id?: number;
  product?: Record<string, unknown>;
}

export const lookup = (hass: Hass, code: string) =>
  hass.callWS<{ product: Product | null }>({ type: "home_inventory/lookup", code });
export const search = (hass: Hass, query: string, online = false) =>
  hass.callWS<SearchHit[]>({ type: "home_inventory/search", query, online });
export const bookIn = (hass: Hass, data: BookIn) =>
  hass.callWS<{ product_id: number; batch_id: number }>({
    type: "home_inventory/book_in",
    ...data,
  });
export const bookOut = (
  hass: Hass,
  data: { product_id: number; packages: number; batch_id?: number; location_id?: number },
) => hass.callWS<{ taken: Taken[] }>({ type: "home_inventory/book_out", ...data });
/** What a book-out took, per batch and location; `putBack` undoes it. */
export interface Taken {
  batch_id: number;
  location_id: number;
  packages: number;
  booking_id: number;
}
export const putBack = (hass: Hass, taken: Taken[]) =>
  hass.callWS<null>({
    type: "home_inventory/put_back",
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
) => hass.callWS<{ batch_id: number }>({ type: "home_inventory/stock_edit", ...data });
export const getStock = (hass: Hass, product_id?: number) =>
  hass.callWS<StockRow[]>({ type: "home_inventory/stock", product_id });
export const listProducts = (hass: Hass) =>
  hass.callWS<Product[]>({ type: "home_inventory/products" });
export const saveProduct = (hass: Hass, data: Record<string, unknown>) =>
  hass.callWS<{ id: number }>({ type: "home_inventory/product_save", data });

/** A product type the AI check proposes; added below parent_id when the recipe is saved. */
export type NewType = { name: string; parent_id: number };
