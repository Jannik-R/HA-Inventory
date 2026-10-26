import type { Table } from "./api";

/** Settings section -> table it edits; "defaults" and "meals" have their own element. */
export const SECTIONS = {
  categories: "category",
  locations: "location",
  units: "unit",
  defaults: null,
  meals: null,
  transfer: null,
} as const;
export type Section = keyof typeof SECTIONS;

/** Draft rows, column lists and titles of the settings add/edit dialog. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Draft = Record<string, any>;
export type Opts = [string | number, string][];
// Columns sent on save (no sort, no derived fields).
export const COLUMNS: Record<Table, string[]> = {
  unit: ["name", "symbol", "base_unit_id", "factor", "is_count", "recipe_only"],
  location: ["name", "freezer"],
  category: [
    "parent_id",
    "name",
    "unit_id",
    "default_location_id",
    "expiry_type",
    "warn_days",
    "min_stock",
    "min_stock_unit_id",
    "min_packages",
    "shelf_days",
    "opened_days",
    "food",
    "frozen_days",
    "frozen_goods",
    "emergency_group",
    "diet",
    "allergens",
  ],
};
export const ADD: Record<Table, string> = {
  unit: "settings.unit.add",
  location: "settings.location.add",
  category: "settings.category.add",
};
