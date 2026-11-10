/** Optional modules chosen in the integration options; the panel gets them via `panel.config`. */
export type Module =
  | "shopping"
  | "recipes"
  | "plan"
  | "canning"
  | "drying"
  | "opened"
  | "frozen"
  | "emergency"
  | "leftovers"
  | "diet";

let active: readonly string[] | undefined;

export const setModules = (list: readonly string[] | undefined) => (active = list);

/** Unknown (no config yet, e.g. in tests) = all on, like the backend default. */
export const hasModule = (m: Module) => !active || active.includes(m);

/** External services (backend `const.EXTERNAL`): what may send data out of Home Assistant. */
export type External =
  | "off_lookup"
  | "off_images"
  | "recipe_images"
  | "recipe_url"
  | "ai_recipe_check"
  | "ai_product_check"
  | "ai_import"
  | "ai_video"
  | "receipt_import";

let external: Partial<Record<External, boolean>> = {};

/** From the options, resolved by the backend (AI ones only with an AI Task entity); unset = all off. */
export const setExternal = (on: Partial<Record<External, boolean>> | undefined) =>
  (external = on ?? {});
export const hasExternal = (key: External) => !!external[key];
