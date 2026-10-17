import { LitElement, css, html, nothing } from "lit";
import { mdiClose } from "@mdi/js";
import { t } from "./i18n";
import { ingredientErrors, type RowErrors } from "./ingredient-errors";
import { fieldMsg, icon, numOrNull } from "./ui";
import { formStyles } from "./styles";
import type { Category, Hass, Ingredient, MasterData, Unit } from "./api";
import "./ingredient-pick";
import "./unit-add-dialog";
import type { PantryUnitAddDialog } from "./unit-add-dialog";

/** Ingredient rows of the recipe dialog. Fires `change` with the whole array, `master` after a new Produktart or unit. */
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

  /** Row that asked for a new unit; its hint (if any) is resolved for all rows sharing it. */
  private unitFor = 0;

  private newUnit(n: number, name = "") {
    this.unitFor = n;
    this.renderRoot.querySelector<PantryUnitAddDialog>("pantry-unit-add-dialog")!.open(name);
  }

  private unitAdded(e: CustomEvent<{ id: number; md: MasterData }>) {
    const { id, md } = e.detail;
    this.units = md.units;
    this.dispatchEvent(new CustomEvent("master", { detail: md }));
    const hint = this.value[this.unitFor]?.unit_hint;
    this.emit(
      this.value.map((x, k) =>
        k === this.unitFor || (hint && x.unit_hint === hint && x.unit_id == null)
          ? { ...x, unit_id: id, unit_hint: null }
          : x,
      ),
    );
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
    const hint = !!i.unit_hint && i.unit_id == null; // its warning line below already says it
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
              this.set(n, { amount: numOrNull(v) });
            }}
          />
        </label>
        <label>
          <span class="lbl">${t("recipes.ingredient.unit")}</span>
          <select
            data-testid="ingredient-unit"
            aria-invalid=${!!err.pair}
            @change=${(e: Event) => {
              const sel = e.target as HTMLSelectElement;
              if (sel.value === "new") {
                sel.value = i.unit_id == null ? "" : String(i.unit_id);
                return this.newUnit(n);
              }
              this.set(n, { unit_id: sel.value ? Number(sel.value) : null, unit_hint: null });
            }}
          >
            <option value="" .selected=${i.unit_id == null}>${t("recipes.ingredient.none")}</option>
            ${this.units.map(
              (u) =>
                html`<option value=${u.id} .selected=${u.id === i.unit_id}>${u.symbol}</option>`,
            )}
            <option value="new">${t("recipes.ingredient.unit_new")}</option>
          </select>
        </label>
      </div>
      ${fieldMsg(err.amount ?? (hint ? undefined : err.pair), "ingredient-amount")}
      ${
        hint
          ? html`<div class="hintline">
              ${fieldMsg(
                t("recipes.ingredient.unit_unknown", { unit: i.unit_hint ?? "" }),
                "ingredient-unit",
                true,
              )}
              <button
                type="button"
                data-testid="ingredient-unit-create"
                @click=${() => this.newUnit(n, i.unit_hint ?? "")}
              >
                ${t("recipes.ingredient.unit_create")}
              </button>
            </div>`
          : nothing
      }
      ${
        i.line
          ? html`<div class="orig" data-testid="ingredient-line">
              ${t("recipes.ingredient.line", { line: i.line })}
            </div>`
          : nothing
      }
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
        <label class="check">
          <input
            type="checkbox"
            data-testid="ingredient-skip-stock"
            .checked=${i.skip_stock}
            @change=${(e: Event) => this.set(n, { skip_stock: (e.target as HTMLInputElement).checked })}
          />
          ${t("recipes.ingredient.skip_stock")}
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
    return html`<pantry-unit-add-dialog
        .hass=${this.hass}
        @unit-added=${(e: CustomEvent<{ id: number; md: MasterData }>) => this.unitAdded(e)}
      ></pantry-unit-add-dialog>
      <div class="lbl">${t("recipes.ingredients")}</div>
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
              skip_stock: false,
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
      .hintline {
        display: flex;
        align-items: center;
        gap: 8px;
        margin: 4px 0;
      }
      .hintline button {
        flex: none;
      }
      .orig {
        font-size: 0.875em;
        color: var(--secondary-text-color);
        margin-bottom: 4px;
      }
      .foot {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 4px 16px;
      }
      .foot .icon-btn {
        margin-left: auto;
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
