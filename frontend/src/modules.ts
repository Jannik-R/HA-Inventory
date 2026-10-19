/** Optional modules chosen in the integration options; the panel gets them via `panel.config`. */
export type Module = "shopping" | "recipes" | "plan" | "canning" | "opened";

let active: readonly string[] | undefined;

export const setModules = (list: readonly string[] | undefined) => (active = list);

/** Unknown (no config yet, e.g. in tests) = all on, like the backend default. */
export const hasModule = (m: Module) => !active || active.includes(m);

let ai = false;

/** An AI Task entity is set up in the options: the recipe import also reads text and photos. */
export const setAi = (on: boolean | undefined) => (ai = !!on);
export const hasAi = () => ai;

let off = true;

/** Open Food Facts lookup is on in the options (unset = on): book-in offers the online search. */
export const setOff = (on: boolean | undefined) => (off = on ?? true);
export const hasOff = () => off;
