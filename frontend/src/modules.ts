/** Optional modules chosen in the integration options; the panel gets them via `panel.config`. */
export type Module = "shopping" | "recipes" | "plan" | "canning";

let active: readonly string[] | undefined;

export const setModules = (list: readonly string[] | undefined) => (active = list);

/** Unknown (no config yet, e.g. in tests) = all on, like the backend default. */
export const hasModule = (m: Module) => !active || active.includes(m);
