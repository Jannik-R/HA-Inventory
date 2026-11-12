export interface Hass {
  language: string;
  user?: { is_admin: boolean };
  locale?: { language: string };
  callWS<T>(msg: Record<string, unknown>): Promise<T>;
  loadBackendTranslation?(
    category: string,
    integration: string,
  ): Promise<(key: string, values?: Record<string, string>) => string>;
}

/** Date kinds: printed best before / use by, or a guide value from the shelf life ("ca."). */
export const DIETS = ["vegan", "vegetarian", "none"] as const;
export const EXPIRY_TYPES = ["best_before", "use_by", "guide"] as const;
export type ExpiryType = (typeof EXPIRY_TYPES)[number];

/** Diet of a food (module diet); "none" reads "Nicht vegetarisch". */
export type Diet = "vegan" | "vegetarian" | "none";

export const isAdmin = (hass?: Hass) => !!hass?.user?.is_admin;

interface WsError {
  message?: string;
  translation_domain?: string;
  translation_key?: string;
  translation_placeholders?: Record<string, string>;
}

/** Backend errors in the user's language (HA translates them only in the server language). */
export async function errorMessage(hass: Hass, err: unknown): Promise<string> {
  const e = err as WsError;
  if (e.translation_key && e.translation_domain && hass.loadBackendTranslation) {
    const localize = await hass.loadBackendTranslation("exceptions", e.translation_domain);
    const text = localize(
      `component.${e.translation_domain}.exceptions.${e.translation_key}.message`,
      e.translation_placeholders,
    );
    if (text) return text;
  }
  return e.message ?? String(err);
}

export * from "./api-master";
export * from "./api-stock";
export * from "./api-label";
export * from "./api-recipes";
