import type { Hass } from "./api";
import type { Taken } from "./api-stock";

export interface LabelConfig {
  printer: boolean;
  print_on_book_in: boolean;
  /** Booking in: the date field starts with the guess (otherwise empty, guessed on save). */
  prefill_expiry: boolean;
  width_mm: number;
  height_mm: number;
  /** A receipt printer is set up (shopping list, recipes). */
  receipt: boolean;
}
/** Browser mode: one label image (data url), to be printed `count` times. */
type PrintResult =
  { printed: number } | { image: string; count: number; width_mm: number; height_mm: number };
export const getLabelConfig = (hass: Hass) =>
  hass.callWS<LabelConfig>({ type: "home_inventory/label_config" });
export const printLabelsWs = (
  hass: Hass,
  data: { batch_id: number; count: number } | { location_id: number; count: number },
) => hass.callWS<PrintResult>({ type: "home_inventory/print_labels", ...data });
export const printShoppingList = (hass: Hass) =>
  hass.callWS<{ printed: number }>({ type: "home_inventory/print_shopping_list" });
export const printRecipe = (hass: Hass, recipe_id: number, servings: number) =>
  hass.callWS<{ printed: number }>({ type: "home_inventory/print_recipe", recipe_id, servings });
export const printPlan = (hass: Hass, start: string, days: 1 | 7) =>
  hass.callWS<{ printed: number }>({ type: "home_inventory/print_plan", start, days });
export const bookOutLabel = (hass: Hass, code: string) =>
  hass.callWS<{ name: string; location: string; taken: Taken[] }>({
    type: "home_inventory/book_out_label",
    code,
  });
