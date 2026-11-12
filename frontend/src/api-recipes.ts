import type { Diet, Hass } from "./api";
import type { NewType, Product } from "./api-stock";

type IngredientStatus = "available" | "partial" | "missing" | "unknown" | "unmatched" | "skipped";
export interface Ingredient {
  id?: number;
  category_id: number | null;
  amount: number | null;
  unit_id: number | null;
  text: string;
  note?: string | null;
  optional: boolean;
  skip_stock: boolean;
  /** Import only: the original line and the unit word that matched no unit. */
  line?: string;
  unit_hint?: string | null;
  /** Import only: the parsed text (the save learns the chosen category for it), and whether the
   * category came from such a learned choice. */
  source_text?: string | null;
  learned?: boolean;
  /** Changed by the AI check (dialog only, never saved): the previous choice for undo. */
  ai?: AiChange;
  /** Proposed by the AI check (category_id stays null until the save adds it). */
  new_type?: NewType;
  status?: IngredientStatus;
  /** With an amount (matched): need/have/missing in `unit_symbol`. */
  need?: number;
  have?: number;
  missing?: number;
  unit_symbol?: string;
  unknown_products?: number;
  /** Without an amount (matched): packages. */
  packages?: number;
}
/** A recipe step; `section` heads it (first step of a section). Timers are read from the text. */
export interface Step {
  section: string | null;
  text: string;
  timers?: { seconds: number; label: string }[];
}
export interface Recipe {
  id: number;
  name: string;
  servings: number;
  /** Old free text of recipes saved before steps existed (replaced by steps on their next save). */
  instructions: string | null;
  steps: Step[];
  source_url: string | null;
  image_url: string | null;
  /** Signed path of the picture stored in HA (preferred over image_url). */
  image_path?: string;
  /** Set: a canning recipe (Einkochen tab) that makes this product. */
  canning_product_id: number | null;
  canning_product: string | null;
  /** Only on a canning recipe, both or none (°C, minutes). */
  canning_temp: number | null;
  canning_minutes: number | null;
  /** Which tab a process recipe belongs to (Einkochen / Dörren). */
  canning_kind: "canning" | "drying";
  ingredients: Ingredient[];
  summary: { available: number; total: number };
  /** Servings on the shopping list, null when the recipe is not on it. */
  shopping_servings: number | null;
  /** Diet and allergens from the ingredients (optional ones do not count, see `optional`). */
  diet: RecipeDiet;
}
export interface RecipeDiet {
  diet: Diet | null;
  contains: string[];
  allergens_known: boolean;
  /** Required ingredients without (complete) information. */
  unknown: string[];
  /** Optional ingredients that are worse than the recipe. */
  optional: { text: string; diet: Diet | null; contains: string[] }[];
}
export const getRecipes = (hass: Hass) => hass.callWS<Recipe[]>({ type: "home_inventory/recipes" });
/** A recipe that uses up expiring stock, best first (`used` ingredients; `products` are the expiring ones). */
export interface ExpiringRecipe {
  recipe_id: number;
  name: string;
  used: number;
  products: string[];
  available: number;
  total: number;
}
export const getExpiringRecipes = (hass: Hass, days?: number) =>
  hass.callWS<ExpiringRecipe[]>({
    type: "home_inventory/expiring_recipes",
    ...(days == null ? {} : { days }),
  });
export const getRecipeAvailability = (hass: Hass, recipe_id: number, servings: number) =>
  hass.callWS<Ingredient[]>({ type: "home_inventory/recipe_availability", recipe_id, servings });
export const saveRecipe = (hass: Hass, data: Record<string, unknown>) =>
  hass.callWS<{ id: number }>({ type: "home_inventory/recipe_save", data });
export type RecipeDraft = Omit<Recipe, "id" | "summary" | "shopping_servings" | "diet">;
/** Canning recipes live in the Einkochen tab, the others in Rezepte and the meal plan. */
export const isCanning = (r: Recipe) => r.canning_product_id != null;
/** One source: a page (schema.org data, else the AI reads it), pasted text or a photo (data URL; both need the AI). */
export type ImportSource = { url: string } | { text: string } | { image: string };
export const importRecipe = (hass: Hass, source: ImportSource) =>
  hass.callWS<RecipeDraft>({ type: "home_inventory/recipe_import", ...source });
/** What the AI check changed on an ingredient (`cat` / `unit`), and the values before, for undo. */
export interface AiChange {
  cat: boolean;
  unit: boolean;
  before: number | null;
  beforeText: string;
  beforeUnit: number | null;
  beforeHint: string | null;
  reason: string;
}
/** AI check of an import draft (phase 13c): off (no AI set up), ok, or only the changes. */
export type AiCheck =
  | { status: "off" | "ok" }
  | {
      status: "changes";
      ingredients: {
        index: number;
        /** Each key only when it changes; new_unit: a unit the user adds in the dialog. */
        category_id?: number | null;
        new_type?: NewType;
        unit_id?: number;
        new_unit?: { name: string };
        reason: string;
      }[];
      steps?: Step[];
    };
export const checkRecipe = (hass: Hass, draft: Record<string, unknown>) =>
  hass.callWS<AiCheck>({ type: "home_inventory/recipe_ai_check", draft, language: hass.language });
/** AI check of a new product from Open Food Facts: only the fields that change. */
export type ProductAiCheck =
  | { status: "off" | "ok" }
  | ({ status: "changes"; reason: string; new_type?: NewType } & Partial<
      Pick<Product, "name" | "category_id" | "content_amount" | "content_unit_id">
    >);
export const checkProduct = (hass: Hass, draft: Record<string, unknown>) =>
  hass.callWS<ProductAiCheck>({
    type: "home_inventory/product_ai_check",
    draft,
    language: hass.language,
  });
export const exportRecipes = (hass: Hass, recipe_id?: number) =>
  hass.callWS<object>({ type: "home_inventory/recipe_export", recipe_id });
