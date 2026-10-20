import { fmtDuration, pt } from "./preserve";
import { html, nothing } from "lit";
import { t } from "./i18n";
import { fmtAmount, fmtNumber, fmtPortions } from "./format";
import { stepList } from "./recipe-steps";
import { hasModule } from "./modules";
import "./receipt-button";
import {
  isCanning,
  printRecipe,
  type Hass,
  type Ingredient,
  type MasterData,
  type Recipe,
} from "./api";

/** Amount for the shown servings: matched ingredients carry it as `need`, others scale `amount`. */
export const amountText = (hass: Hass, md: MasterData, i: Ingredient, factor: number) => {
  if (i.amount == null) return "";
  const n = i.amount * factor;
  const u = md.units.find((x) => x.id === i.unit_id);
  const text = fmtAmount(hass, n, u?.symbol);
  const base = u?.recipe_only ? md.units.find((x) => x.id === u.base_unit_id) : undefined;
  if (!u || !base) return text;
  const approx = fmtAmount(hass, (n * u.factor) / base.factor, base.symbol);
  return `${text} (${t("recipes.approx", { what: approx })})`;
};

const status = (hass: Hass, i: Ingredient) => {
  const unit = i.unit_symbol ?? "";
  switch (i.status) {
    case "missing":
      return i.need == null // no amount, or one that counts as "any" (2 EL capers in pieces)
        ? t("recipes.status.missing_plain")
        : t("recipes.status.missing", { what: fmtAmount(hass, i.missing ?? 0, unit) });
    case "partial":
      return t("recipes.status.partial", {
        have: fmtNumber(hass, i.have ?? 0),
        need: fmtNumber(hass, i.need ?? 0),
        unit,
      });
    case "unknown":
      return t("recipes.status.unknown");
    case "skipped":
      return t("recipes.status.skipped");
    case "unmatched":
      return t("recipes.status.unmatched");
    default:
      return t("recipes.status.available");
  }
};

/** The opened part of a recipe row: servings (not saved), ingredients with status, steps (or the
 * old instructions text). */
export const recipeDetail = (o: {
  hass: Hass;
  md: MasterData;
  recipe: Recipe;
  ingredients: Ingredient[];
  servings: number;
  onServings: (n: number) => void;
  onShopping: () => void;
  /** Plan the dish; a canning recipe starts a protocol instead. */
  onPlan: () => void;
  onCook: () => void;
  onCooked: () => void;
}) => {
  const r = o.recipe;
  return html`<div class="detail-box">
    <label class="servings">
      <span class="lbl"
        >${isCanning(r) ? pt(r.canning_kind, "recipe_jars") : t("recipes.servings")}</span
      >
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
    <p class="shopping">
      ${
        hasModule("shopping")
          ? html`<button type="button" data-testid="recipe-to-shopping" @click=${o.onShopping}>
              ${t("recipes.to_shopping")}
            </button>`
          : nothing
      }
      ${
        isCanning(r)
          ? html`<button type="button" data-testid="recipe-to-canning" @click=${o.onPlan}>
              ${pt(r.canning_kind, "add_title")}
            </button>`
          : hasModule("plan")
            ? html`<button type="button" data-testid="recipe-to-plan" @click=${o.onPlan}>
                ${t("recipes.to_plan")}
              </button>`
            : nothing
      }
      ${
        isCanning(r)
          ? nothing
          : html`<button type="button" data-testid="recipe-cooked" @click=${o.onCooked}>
              ${t("cooked.open")}
            </button>`
      }
      <home-inventory-receipt-button
        .hass=${o.hass}
        .print=${() => printRecipe(o.hass, r.id, o.servings)}
        .done=${t("recipes.printed")}
        .testid=${"recipe-print"}
      ></home-inventory-receipt-button>
      ${
        r.shopping_servings != null && hasModule("shopping")
          ? html`<span class="detail" data-testid="recipe-on-shopping"
              >${t("recipes.on_shopping", { what: fmtPortions(o.hass, r.shopping_servings) })}</span
            >`
          : nothing
      }
    </p>
    ${
      isCanning(r)
        ? html`<p data-testid="recipe-canning">
            ${t("canning.recipe_summary", { name: r.canning_product ?? "", jars: r.servings })}
            ${r.canning_temp != null ? `· ${r.canning_temp} °C, ${fmtDuration(o.hass, r.canning_kind, r.canning_minutes ?? 0)}` : ""}
          </p>`
        : nothing
    }
    ${
      r.steps.length
        ? html`<h3>${t("recipes.instructions")}</h3>
            ${stepList(r.steps)}
            <p>
              <button type="button" data-testid="recipe-cook" @click=${o.onCook}>
                ${t("cook.open")}
              </button>
            </p>`
        : r.instructions
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
        ? html`<img
            class="photo"
            src=${r.image_url}
            alt=${r.name}
            loading="lazy"
            referrerpolicy="no-referrer"
          />`
        : nothing
    }
  </div>`;
};
