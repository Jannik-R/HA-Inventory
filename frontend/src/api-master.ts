import type { Diet, ExpiryType, Hass } from "./api";

export interface Unit {
  id: number;
  name: string;
  symbol: string;
  base_unit_id: number | null;
  factor: number;
  is_count: number;
  recipe_only: number;
}
/** Units for stock, booking and shopping: recipe-only ones stay out, except the one in use. */
export const stockUnits = (units: Unit[], keep?: number | null) =>
  units.filter((u) => !u.recipe_only || u.id === keep);
export interface Location {
  id: number;
  name: string;
  sort: number;
  /** 1 = a freezer: a freezable product booked in or moved here is frozen. */
  freezer: 0 | 1;
}
export type Source = "own" | number | "default";
export type InheritField =
  | "unit_id"
  | "default_location_id"
  | "expiry_type"
  | "warn_days"
  | "shelf_days"
  | "opened_days"
  | "frozen_days";
/** Inherited down the category tree only (null at the root = food, not frozen goods, no emergency group). */
export type CategoryFlag = "food" | "frozen_goods" | "emergency_group" | "diet" | "allergens";
export interface Category {
  id: number;
  parent_id: number | null;
  name: string;
  sort: number;
  off_tags: string[];
  unit_id: number | null;
  default_location_id: number | null;
  expiry_type: ExpiryType | null;
  warn_days: number | null;
  min_stock: number | null;
  min_stock_unit_id: number | null;
  min_packages: number | null;
  shelf_days: number | null;
  /** Days an opened package keeps (shortens its expiry), null = inherit. */
  opened_days: number | null;
  /** 0 = not a food (no recipe ingredient), null = inherit; the root is a food. */
  food: 0 | 1 | null;
  /** Days a product keeps frozen (home-frozen), null = inherit. */
  frozen_days: number | null;
  /** 1 = bought frozen (keeps its printed date in the freezer), null = inherit; the root is not. */
  frozen_goods: 0 | 1 | null;
  /** BBK food group of the emergency stock, "none" = not part of it, null = inherit; the root has none. */
  emergency_group: string | null;
  /** Diet, null = inherit (unknown at the root). */
  diet: Diet | null;
  /** Contained major allergens (comma list of keys), "" = none of the 14, null = inherit. */
  allergens: string | null;
  effective: Record<InheritField | CategoryFlag, { value: number | string | null; source: Source }>;
}
export interface MasterData {
  units: Unit[];
  locations: Location[];
  categories: Category[];
  defaults: Record<InheritField, number | string | null>;
  /** Root category Reste (null if deleted; the next storing creates it again). */
  leftover_category_id: number | null;
}
export type Table = "unit" | "location" | "category";
/** What `home_inventory/delete` accepts: master data plus products, recipes and canning protocols. */
export type DeleteTable = Table | "product" | "recipe" | "canning";

export const getMasterData = (hass: Hass) =>
  hass.callWS<MasterData>({ type: "home_inventory/master_data" });
export const saveRow = (hass: Hass, table: Table, data: Record<string, unknown>) =>
  hass.callWS<{ id: number }>({ type: "home_inventory/save", table, data });
export const saveDefaults = (hass: Hass, data: MasterData["defaults"]) =>
  hass.callWS<unknown>({ type: "home_inventory/defaults_save", data });
/** `force`: also delete what uses the row (see getDeleteImpact); `move_to`: target for a location's stock. */
export const deleteRow = (
  hass: Hass,
  table: DeleteTable,
  row_id: number,
  opts: { force?: boolean; move_to?: number | null } = {},
) => hass.callWS<unknown>({ type: "home_inventory/delete", table, row_id, ...opts });
export const moveLocation = (hass: Hass, location_id: number, move_to: number) =>
  hass.callWS<unknown>({ type: "home_inventory/move_location", location_id, move_to });
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
    type: "home_inventory/delete_impact",
    table,
    row_id,
  });

export const addUnit = (hass: Hass, name: string, symbol?: string) =>
  hass.callWS<{ id: number }>({ type: "home_inventory/unit_add", name, symbol });
