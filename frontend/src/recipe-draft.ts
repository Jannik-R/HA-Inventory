import type { Ingredient, Product, Recipe, RecipeDraft } from "./api";
import { blankIngredient } from "./ingredient-errors";
import { rowsFromText, toRows, toSteps, type StepRow } from "./recipe-steps";

/** The recipe dialog's form state. */
export interface Draft {
  name: string;
  servings: number | null;
  steps: StepRow[];
  source_url: string;
  image_url: string;
  /** Canning recipe: the product it makes (name; a new one needs its category). */
  product: string;
  product_category: number | null;
  canning_temp: number | null;
  canning_minutes: number | null;
  ingredients: Ingredient[];
}

export const fromRecipe = (r?: Recipe | RecipeDraft): Draft => ({
  name: r?.name ?? "",
  servings: r?.servings ?? 4,
  // an old recipe without steps: its text split at blank lines
  steps: r?.steps?.length ? toRows(r.steps) : rowsFromText(r?.instructions ?? null),
  source_url: r?.source_url ?? "",
  image_url: r?.image_url ?? "",
  product: (r && "canning_product" in r && r.canning_product) || "",
  product_category: null,
  canning_temp: r?.canning_temp ?? null,
  canning_minutes: r?.canning_minutes ?? null,
  ingredients: (r?.ingredients ?? []).map((i) => ({
    category_id: i.category_id,
    amount: i.amount,
    unit_id: i.amount == null ? null : i.unit_id,
    text: i.text,
    note: i.note ?? null,
    optional: i.optional,
    skip_stock: i.skip_stock ?? false,
    line: i.line,
    unit_hint: i.unit_hint,
    source_text: i.source_text ?? null,
    learned: i.learned,
  })),
});

/** The save payload (without id). `products`: a canning recipe's product suggestions, else null. */
export const toPayload = (d: Draft, products: Product[] | null) => {
  const known = products?.find((p) => p.name === d.product.trim());
  return {
    name: d.name.trim(),
    servings: d.servings,
    steps: toSteps(d.steps),
    source_url: d.source_url.trim() || null,
    image_url: d.image_url.trim() || null,
    // a canning recipe: the product it makes (existing id or a new one), temperature, minutes
    ...(products
      ? {
          ...(known
            ? { canning_product_id: known.id }
            : { canning_product: { name: d.product.trim(), category_id: d.product_category } }),
          canning_temp: d.canning_temp,
          canning_minutes: d.canning_minutes,
        }
      : {}),
    ingredients: d.ingredients
      .filter((i) => !blankIngredient(i))
      .map((i) => ({
        category_id: i.category_id,
        amount: i.amount,
        // A unit without an amount is only the category's suggestion.
        unit_id: i.amount == null ? null : i.unit_id,
        optional: i.optional,
        skip_stock: i.skip_stock,
        source_text: i.source_text ?? null,
        note: i.note?.trim() || null,
        // The backend takes the category's name; text only for rows without one.
        ...(i.category_id == null ? { text: i.text.trim() } : {}),
      })),
  };
};
