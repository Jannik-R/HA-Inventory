import { t } from "./i18n";
import type { Ingredient } from "./api";

export type RowErrors = { text?: string; amount?: string; pair?: string };

/** A row nothing was entered in yet: no error, left out on save. */
export const blankIngredient = (i: Ingredient) =>
  i.category_id == null && !i.text.trim() && i.amount == null && !i.note?.trim();

/** Live errors per ingredient row (same order). */
export const ingredientErrors = (list: Ingredient[]): RowErrors[] =>
  list.map((i) => {
    const e: RowErrors = {};
    if (blankIngredient(i)) return e;
    // Rows without category (unmatched, e.g. imported) keep their text until matched.
    if (!i.text.trim() && i.category_id == null) e.text = t("valid.ingredient_what");
    if (i.amount != null && !(i.amount > 0)) e.amount = t("valid.positive");
    // A unit without an amount is only the suggestion from the category; it is dropped on save.
    else if (i.amount != null && i.unit_id == null)
      e.pair = i.unit_hint
        ? t("recipes.ingredient.unit_unknown", { unit: i.unit_hint })
        : t("valid.amount_pair");
    return e;
  });
