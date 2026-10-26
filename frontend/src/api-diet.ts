import type { Hass } from "./api";

/** One chunk of the admin reload from Open Food Facts; call again with `after` = `last` until `done`. */
export interface DietReload {
  done: boolean;
  /** Products still without values at the start of this chunk (it included). */
  total: number;
  checked: number;
  filled: number;
  last: number;
}
export const reloadDiet = (hass: Hass, after: number) =>
  hass.callWS<DietReload>({ type: "home_inventory/diet_reload", after });
