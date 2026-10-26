import { html } from "lit";
import { t } from "./i18n";
import { inheritSelect, reset, type Dflt } from "./inherit";
import { DIETS, type Diet } from "./api";

/** The 14 EU major allergens (backend `ALLERGENS`), in the order they are stored. */
export const ALLERGENS = [
  "gluten",
  "crustaceans",
  "eggs",
  "fish",
  "peanuts",
  "soybeans",
  "milk",
  "nuts",
  "celery",
  "mustard",
  "sesame-seeds",
  "sulphur-dioxide-and-sulphites",
  "lupin",
  "molluscs",
] as const;

/** "Gluten, Milch" / "Keine Hauptallergene" ("" = none of the 14) / "Unbekannt" (no value). */
export const allergenText = (value: string | number | null | undefined) =>
  value == null
    ? t("diet.unknown")
    : value === ""
      ? t("allergens.none")
      : String(value)
          .split(",")
          .map((k) => t(`allergen.${k}`))
          .join(", ");

const toggle = (list: string, key: string, on: boolean) =>
  ALLERGENS.filter((a) => (a === key ? on : list.split(",").includes(a))).join(",");

/** Diet select and allergens (inherited text with "Eigene Angabe", or 14 checkboxes) of a category
 * or product; `dflt*` is what it would inherit. */
export function dietFields(o: {
  diet: Diet | null | undefined;
  allergens: string | null | undefined;
  dietDflt: Dflt | undefined;
  allergensDflt: Dflt | undefined;
  onDiet: (v: Diet | null) => void;
  onAllergens: (v: string | null) => void;
}) {
  const own = o.allergens ?? null;
  return html`<label>
      <span class="lbl" title=${t("tip.diet")}>${t("diet.label")}</span>
      ${inheritSelect({
        testid: "diet",
        own: o.diet,
        dflt: o.dietDflt,
        optional: true,
        empty: t("diet.unknown"),
        options: DIETS.map((k) => [k, t(`diet.${k}`)]),
        numeric: false,
        onChange: (v) => o.onDiet(v as Diet | null),
      })}
    </label>
    <div class="field" data-testid="allergens">
      <span class="lbl" title=${t("tip.allergens")}>${t("allergens.label")}</span>
      ${
        own == null
          ? html`<span class="inh"
              ><span class="detail" data-testid="allergens-inherited"
                >${t("common.default", {
                  value: allergenText(o.allergensDflt?.value),
                  source: o.allergensDflt?.source ?? t("settings.inherit_default"),
                })}</span
              >
              <button
                type="button"
                data-testid="allergens-own"
                @click=${() => o.onAllergens((o.allergensDflt?.value as string | undefined) ?? "")}
              >
                ${t("allergens.own")}
              </button></span
            >`
          : html`<span class="allergen-grid">
                ${ALLERGENS.map(
                  (k) =>
                    html`<label class="check"
                      ><input
                        type="checkbox"
                        data-testid=${`allergen-${k}`}
                        .checked=${own.split(",").includes(k)}
                        @change=${(e: Event) =>
                          o.onAllergens(toggle(own, k, (e.target as HTMLInputElement).checked))}
                      />${t(`allergen.${k}`)}</label
                    >`,
                )}
              </span>
              <span class="detail">${t("allergens.none_hint")}</span>
              ${reset("allergens", () => o.onAllergens(null))}`
      }
    </div>`;
}
