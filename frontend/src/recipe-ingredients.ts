import { LitElement, css, html } from "lit";
import { mdiClose } from "@mdi/js";
import { t } from "./i18n";
import { fieldMsg, icon } from "./ui";
import { formStyles } from "./styles";
import type { Category, Hass, Ingredient, MasterData, Unit } from "./api";
import "./ingredient-pick";

type RowErrors = { text?: string; amount?: string; pair?: string };

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
    else if (i.amount != null && i.unit_id == null) e.pair = t("valid.amount_pair");
    return e;
  });

/** Ingredient rows of the recipe dialog. Fires `change` with the whole array, `master` after a new Produktart. */
export class PantryRecipeIngredients extends LitElement {
  static properties = {
    hass: { attribute: false },
    value: { attribute: false },
    categories: { attribute: false },
    units: { attribute: false },
  };

  declare hass?: Hass;
  declare value: Ingredient[];
  declare categories: Category[];
  declare units: Unit[];

  constructor() {
    super();
    this.value = [];
    this.categories = [];
    this.units = [];
  }

  private emit(list: Ingredient[]) {
    this.dispatchEvent(new CustomEvent("change", { detail: list }));
  }

  private set(index: number, patch: Partial<Ingredient>) {
    this.emit(this.value.map((x, k) => (k === index ? { ...x, ...patch } : x)));
  }

  /** A category fills an empty unit (its effective unit, in its base unit: recipes count g, not kg) and the text (its name). */
  private pick(index: number, id: number | null) {
    const cat = this.categories.find((c) => c.id === id);
    const cur = this.value[index];
    const patch: Partial<Ingredient> = { category_id: id };
    if (!cat)
      patch.text = ""; // "change": back to an empty, unmatched row
    else {
      patch.text = cat.name;
      if (cur.unit_id == null && cur.amount == null) {
        const id = (cat.effective.unit_id.value as number | null) ?? null;
        patch.unit_id = this.units.find((u) => u.id === id)?.base_unit_id ?? id;
      }
    }
    this.set(index, patch);
  }

  private row(i: Ingredient, n: number, err: RowErrors) {
    return html`<li data-testid="ingredient-row" class="ing">
      <pantry-ingredient-pick
        .hass=${this.hass}
        .categories=${this.categories}
        .value=${i.category_id}
        .text=${i.category_id == null ? i.text : ""}
        .error=${err.text}
        @change=${(e: CustomEvent<number | null>) => this.pick(n, e.detail)}
        @master=${(e: CustomEvent<MasterData>) => {
          this.categories = e.detail.categories; // known before the `change` that follows
          this.dispatchEvent(new CustomEvent("master", { detail: e.detail }));
        }}
      ></pantry-ingredient-pick>
      <div class="line">
        <label>
          <span class="lbl">${t("recipes.ingredient.amount")}</span>
          <input
            type="number"
            min="0"
            step="any"
            inputmode="decimal"
            data-testid="ingredient-amount"
            aria-invalid=${!!err.amount || !!err.pair}
            .value=${i.amount == null ? "" : String(i.amount)}
            @input=${(e: Event) => {
              const v = (e.target as HTMLInputElement).value;
              this.set(n, { amount: v === "" ? null : Number(v) });
            }}
          />
        </label>
        <label>
          <span class="lbl">${t("recipes.ingredient.unit")}</span>
          <select
            data-testid="ingredient-unit"
            aria-invalid=${!!err.pair}
            @change=${(e: Event) => {
              const v = (e.target as HTMLSelectElement).value;
              this.set(n, { unit_id: v ? Number(v) : null });
            }}
          >
            <option value="" ?selected=${i.unit_id == null}>${t("recipes.ingredient.none")}</option>
            ${this.units.map(
              (u) =>
                html`<option value=${u.id} ?selected=${u.id === i.unit_id}>${u.symbol}</option>`,
            )}
          </select>
        </label>
      </div>
      ${fieldMsg(err.amount ?? err.pair, "ingredient-amount")}
      <label>
        <span class="lbl">${t("recipes.ingredient.note")}</span>
        <input
          data-testid="ingredient-note"
          maxlength="200"
          .value=${i.note ?? ""}
          @input=${(e: Event) => this.set(n, { note: (e.target as HTMLInputElement).value })}
        />
      </label>
      <div class="foot">
        <label class="check">
          <input
            type="checkbox"
            data-testid="ingredient-optional"
            .checked=${i.optional}
            @change=${(e: Event) => this.set(n, { optional: (e.target as HTMLInputElement).checked })}
          />
          ${t("recipes.ingredient.optional")}
        </label>
        <button
          type="button"
          class="icon-btn"
          data-testid="ingredient-remove"
          aria-label=${t("recipes.ingredient.remove")}
          @click=${() => this.emit(this.value.filter((_, k) => k !== n))}
        >
          ${icon(mdiClose)}
        </button>
      </div>
    </li>`;
  }

  render() {
    const errs = ingredientErrors(this.value);
    return html`<div class="lbl">${t("recipes.ingredients")}</div>
      <ul>
        ${this.value.map((i, n) => this.row(i, n, errs[n]))}
      </ul>
      <button
        type="button"
        class="add"
        data-testid="ingredient-add"
        @click=${() =>
          this.emit([
            ...this.value,
            {
              category_id: null,
              amount: null,
              unit_id: null,
              text: "",
              note: null,
              optional: false,
            },
          ])}
      >
        ${t("recipes.ingredient.add")}
      </button>`;
  }

  static styles = [
    formStyles,
    css`
      li.ing {
        display: block;
        padding: 8px 0;
      }
      .line {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
      }
      .foot {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .foot .check {
        margin: 0;
      }
      .add {
        margin-top: 8px;
        margin-bottom: 12px;
      }
    `,
  ];
}

customElements.define("pantry-recipe-ingredients", PantryRecipeIngredients);
