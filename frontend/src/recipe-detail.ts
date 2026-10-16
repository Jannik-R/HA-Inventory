import { html, nothing } from "lit";
import { t } from "./i18n";
import { fmtNumber, lang } from "./format";
import type { Hass, Ingredient, MasterData, Recipe } from "./api";

/** "1 Portion" / "4 Portionen". */
export const fmtPortions = (hass: Hass | undefined, n: number) =>
  t(new Intl.PluralRules(lang(hass)).select(n) === "one" ? "recipes.portion" : "recipes.portions", {
    n,
  });

/** Amount for the shown servings: matched ingredients carry it as `need`, others scale `amount`. */
const amountText = (hass: Hass, md: MasterData, i: Ingredient, factor: number) => {
  if (i.amount == null) return "";
  const n = i.need ?? i.amount * factor;
  const unit = i.unit_symbol ?? md.units.find((u) => u.id === i.unit_id)?.symbol ?? "";
  return `${fmtNumber(hass, n)} ${unit}`.trim();
};

const status = (hass: Hass, i: Ingredient) => {
  const unit = i.unit_symbol ?? "";
  switch (i.status) {
    case "missing":
      return i.amount == null
        ? t("recipes.status.missing_plain")
        : t("recipes.status.missing", { what: `${fmtNumber(hass, i.missing ?? 0)} ${unit}` });
    case "partial":
      return t("recipes.status.partial", {
        have: fmtNumber(hass, i.have ?? 0),
        need: fmtNumber(hass, i.need ?? 0),
        unit,
      });
    case "unknown":
      return t("recipes.status.unknown");
    case "unmatched":
      return t("recipes.status.unmatched");
    default:
      return t("recipes.status.available");
  }
};

/** The opened part of a recipe row: servings (not saved), ingredients with status, instructions. */
export const recipeDetail = (o: {
  hass: Hass;
  md: MasterData;
  recipe: Recipe;
  ingredients: Ingredient[];
  servings: number;
  onServings: (n: number) => void;
}) => {
  const r = o.recipe;
  return html`<div class="detail-box">
    <label class="servings">
      <span class="lbl">${t("recipes.servings")}</span>
      <input
        type="number"
        min="1"
        max="99"
        step="1"
        inputmode="numeric"
        data-testid="recipe-servings"
        .value=${String(o.servings)}
        @change=${(e: Event) => {
          const el = e.target as HTMLInputElement;
          const n = Number(el.value);
          if (Number.isInteger(n) && n >= 1 && n <= 99) o.onServings(n);
          else el.value = String(o.servings);
        }}
      />
    </label>
    <ul class="ings">
      ${o.ingredients.map(
        (i) =>
          html`<li data-testid="ingredient-row" class="ing">
            <span class="what">
              ${[
                amountText(o.hass, o.md, i, o.servings / r.servings),
                o.md.categories.find((c) => c.id === i.category_id)?.name ?? i.text,
              ]
                .filter(Boolean)
                .join(" ")}
              ${i.note ? html`<span class="detail">${i.note}</span>` : nothing}
              ${i.optional ? html`<span class="detail">${t("recipes.optional")}</span>` : nothing}
            </span>
            <span class="st ${i.status}" data-testid="ingredient-status">${status(o.hass, i)}</span>
          </li>`,
      )}
    </ul>
    ${
      r.instructions
        ? html`<h3>${t("recipes.instructions")}</h3>
            <p class="text">${r.instructions}</p>`
        : nothing
    }
    ${
      r.source_url
        ? html`<p>
            <a href=${r.source_url} target="_blank" rel="noopener noreferrer"
              >${t("recipes.source")}</a
            >
          </p>`
        : nothing
    }
    ${
      r.image_url
        ? html`<img class="photo" src=${r.image_url} alt=${r.name} loading="lazy" />`
        : nothing
    }
  </div>`;
};
