import { html, nothing } from "lit";
import { t } from "./i18n";
import { ALLERGENS, allergenText } from "./diet-fields";
import { DIETS, type Diet, type Recipe, type RecipeDiet } from "./api";

/** Recipe list filter: vegan / vegetarian, and allergens the recipe must be free of. */
export interface DietFilter {
  diet: "" | "vegan" | "vegetarian";
  without: string[];
}
export const noDietFilter = (): DietFilter => ({ diet: "", without: [] });
export const dietFilterCount = (f: DietFilter) => (f.diet ? 1 : 0) + f.without.length;

/** Strict: a recipe with missing information fails the filter. */
export const matchesDiet = (r: Recipe, f: DietFilter) => {
  const d = r.diet;
  if (f.diet && !(d.diet === "vegan" || (f.diet === "vegetarian" && d.diet === "vegetarian")))
    return false;
  return f.without.every((k) => d.allergens_known && !d.contains.includes(k));
};

const worse = (d: Diet | null, than: Diet | null) =>
  than != null && (d == null || DIETS.indexOf(d) > DIETS.indexOf(than));

/** What an optional ingredient does to the recipe: "nicht vegetarisch", "enthält Milch". */
export const optionalMark = (d: RecipeDiet, text: string) => {
  const o = d.optional.find((x) => x.text === text);
  if (!o) return "";
  return [
    worse(o.diet, d.diet)
      ? o.diet == null
        ? t("diet.missing")
        : t(o.diet === "none" ? "diet.not_vegetarian" : "diet.not_vegan")
      : "",
    o.contains.length ? t("allergens.contains", { list: allergenText(o.contains.join(",")) }) : "",
  ]
    .filter(Boolean)
    .join(", ");
};

/** "Vegetarisch · Enthält: Milch · Optional: Speck (nicht vegetarisch)", then what is missing. */
export const dietLine = (r: Recipe) => {
  const d = r.diet;
  const parts = [
    d.diet ? t(`diet.${d.diet}`) : "",
    d.contains.length
      ? t("allergens.contains", { list: allergenText(d.contains.join(",")) })
      : d.allergens_known
        ? t("allergens.none")
        : "",
    d.optional.length
      ? t("recipes.diet.optional", {
          list: d.optional.map((o) => `${o.text} (${optionalMark(d, o.text)})`).join(", "),
        })
      : "",
  ].filter(Boolean);
  return html`<span class="detail" data-testid="recipe-diet"
      >${parts.length ? parts.join(" · ") : t("diet.unknown")}</span
    >${
      d.unknown.length
        ? html`<span class="detail" data-testid="recipe-diet-unknown"
            >${t("recipes.diet.unknown", { list: d.unknown.join(", ") })}</span
          >`
        : nothing
    }`;
};

/** Collapsed filter ("Ernährung (2)"): diet select and "Ohne" allergen checkboxes. */
export const dietFilter = (f: DietFilter, onChange: (f: DietFilter) => void) =>
  html`<details class="diet-filter" data-testid="recipe-diet-filter">
    <summary>
      ${t("recipes.diet.filter")}${dietFilterCount(f) ? ` (${dietFilterCount(f)})` : ""}
    </summary>
    <label>
      <span class="lbl">${t("diet.label")}</span>
      <select
        data-testid="recipe-diet-select"
        @change=${(e: Event) =>
          onChange({ ...f, diet: (e.target as HTMLSelectElement).value as DietFilter["diet"] })}
      >
        <option value="" .selected=${f.diet === ""}>${t("recipes.diet.all")}</option>
        ${(["vegan", "vegetarian"] as const).map(
          (k) => html`<option value=${k} .selected=${f.diet === k}>${t(`diet.${k}`)}</option>`,
        )}
      </select>
    </label>
    <div class="field">
      <span class="lbl">${t("recipes.diet.without")}</span>
      <span class="allergen-grid">
        ${ALLERGENS.map(
          (k) =>
            html`<label class="check"
              ><input
                type="checkbox"
                data-testid=${`recipe-without-${k}`}
                .checked=${f.without.includes(k)}
                @change=${(e: Event) =>
                  onChange({
                    ...f,
                    without: (e.target as HTMLInputElement).checked
                      ? [...f.without, k]
                      : f.without.filter((x) => x !== k),
                  })}
              />${t(`allergen.${k}`)}</label
            >`,
        )}
      </span>
    </div>
  </details>`;
