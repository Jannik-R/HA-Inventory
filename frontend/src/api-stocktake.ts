import type { Hass } from "./api";

/** A batch of the scanned product at the location (`packages` = in stock there, may be 0). */
export interface StocktakeBatch {
  batch_id: number;
  expires_on: string | null;
  opened_on: string | null;
  frozen_on: string | null;
  charge: string | null;
  packages: number;
}

export interface StocktakeScan {
  product_id: number;
  name: string;
  batches: StocktakeBatch[];
  /** Date a new batch would get (today + shelf life), null without one. */
  shelf_date: string | null;
}

export const stocktakeScan = (hass: Hass, location_id: number, code: string) =>
  hass.callWS<StocktakeScan>({ type: "home_inventory/stocktake_scan", location_id, code });

/** Counted packages per listed batch (0 = missing) and packages not in stock; books corrections. */
export const stocktakeApply = (
  hass: Hass,
  data: {
    location_id: number;
    counts: { batch_id: number; packages: number }[];
    extra: { product_id: number; packages: number; expires_on: string | null }[];
  },
) => hass.callWS<{ corrections: number }>({ type: "home_inventory/stocktake_apply", ...data });
