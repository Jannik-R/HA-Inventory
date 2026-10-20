import type { Hass } from "./api";

export interface CookedBatch {
  batch_id: number;
  location: string;
  /** Effective date (shorter once opened), null = none. */
  expires_on: string | null;
  packages: number;
  opened: boolean;
  frozen: boolean;
  /** Level of the package(s) of the batch (1 = full; below 1 = one partly used package). */
  remaining: number;
}

/** A product that could be used for the ingredient, with the defaults proposed for it. */
export interface CookedCandidate {
  product_id: number;
  name: string;
  brand: string | null;
  batches: CookedBatch[];
  action: CookedAction;
  /** Packages booked out first (for a reduce: the used up partly used ones, then `batch_id` is lowered). */
  packages: number;
  /** Of `packages` booked out first, the partly used ones taken by batch (out). */
  used_up: number;
  /** Packages to open after taking `packages` (the remainder of a package). */
  open: number;
  /** null = earliest first over all batches. */
  batch_id: number | null;
  /** Level of the opened or reduced package afterwards, null = unchanged. */
  remaining: number | null;
}

export interface CookedRow {
  ingredient_id: number;
  text: string;
  amount: number | null;
  unit_symbol: string | null;
  optional: boolean;
  candidates: CookedCandidate[];
  product_id: number;
  checked: boolean;
}

export type CookedAction = "out" | "open" | "reduce" | "skip";

export interface CookedItem {
  product_id: number;
  batch_id: number | null;
  packages: number;
  action: "out" | "open" | "reduce";
  open: number;
  used_up: number;
  remaining: number | null;
}

export interface CookedResult {
  bookings: {
    product_id: number;
    name: string;
    packages: number;
    action: "out" | "open" | "reduce";
  }[];
  out_ids: number[];
  open_ids: number[];
  remaining_ids: number[];
}

export const cookedProposal = (hass: Hass, recipe_id: number, servings: number) =>
  hass.callWS<CookedRow[]>({ type: "home_inventory/cooked_proposal", recipe_id, servings });
export const cookedBook = (hass: Hass, items: CookedItem[]) =>
  hass.callWS<CookedResult>({ type: "home_inventory/cooked_book", items });
export const cookedUndo = (hass: Hass, r: CookedResult) =>
  hass.callWS<null>({
    type: "home_inventory/cooked_undo",
    out_ids: r.out_ids,
    open_ids: r.open_ids,
    remaining_ids: r.remaining_ids,
  });
