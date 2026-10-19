import type { Hass } from "./api";

/** A canning protocol: one charge (made_on + seq) with its own batch. */
export interface Canning {
  id: number;
  made_on: string;
  seq: number;
  /** YYYYMMDD-n, printed on the labels. */
  charge: string;
  product_id: number;
  name: string;
  recipe_id: number | null;
  recipe: string | null;
  jars: number;
  in_stock: number;
  batch_id: number;
  expires_on: string | null;
  temp: number | null;
  minutes: number | null;
  notes: string;
}

export const getCannings = (hass: Hass) =>
  hass.callWS<Canning[]>({ type: "home_inventory/cannings" });
/** New (made_on, jars, product_id or product) or edit (id + process data). */
export const saveCanning = (hass: Hass, data: Record<string, unknown>) =>
  hass.callWS<{ id: number; batch_id: number; charge: string }>({
    type: "home_inventory/canning_save",
    data,
  });
