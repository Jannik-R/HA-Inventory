import { LitElement, html, nothing } from "lit";
import { t } from "./i18n";
import { fieldMsg } from "./ui";
import { formStyles } from "./styles";
import { categoryPath } from "./inherit";
import {
  addProductType,
  errorMessage,
  getMasterData,
  search,
  type Category,
  type Hass,
} from "./api";
import { includesCI } from "./format";
import "./category-picker";

const MAX_HITS = 8;

interface Hit {
  cat: Category;
  /** Product name when found through a product. */
  via?: string;
}

/**
 * Ingredient field: search a Produktart (or higher category), also found via product names, or
 * create a new Produktart. Fires `change` (category id) and, after creating, `master` (MasterData).
 */
export class PantryIngredientPick extends LitElement {
  static properties = {
    hass: { attribute: false },
    categories: { attribute: false },
    value: { attribute: false },
    text: { attribute: false },
    error: { attribute: false },
    query: { state: true },
    products: { state: true },
    creating: { state: true },
    failure: { state: true },
  };

  declare hass?: Hass;
  declare categories: Category[];
  declare value: number | null;
  /** Text of a row without category (not yet matched). */
  declare text: string;
  declare error?: string;
  declare query: string;
  declare products: Hit[];
  /** Name of the new Produktart waiting for its parent category. */
  declare creating?: string;
  declare failure: string;

  constructor() {
    super();
    this.categories = [];
    this.value = null;
    this.text = "";
    this.query = "";
    this.products = [];
    this.failure = "";
  }

  private async input(q: string) {
    this.query = q;
    this.failure = "";
    if (!q.trim()) {
      this.products = [];
      return;
    }
    try {
      const hits = await search(this.hass!, q.trim());
      if (this.query !== q) return; // a newer input won
      const out: Hit[] = [];
      for (const h of hits) {
        const cat = this.foods().find((c) => c.id === h.category_id);
        if (cat && !out.some((o) => o.cat.id === cat.id)) out.push({ cat, via: h.name });
      }
      this.products = out;
    } catch {
      this.products = []; // product hits are a bonus; category hits still work
    }
  }

  private pick(id: number) {
    this.query = "";
    this.products = [];
    this.dispatchEvent(new CustomEvent("change", { detail: id }));
  }

  private async create(parent: number | null) {
    if (parent == null) return;
    try {
      await addProductType(this.hass!, this.creating!, parent);
      const md = await getMasterData(this.hass!);
      const made = md.categories.find((c) => c.parent_id === parent && c.name === this.creating);
      this.dispatchEvent(new CustomEvent("master", { detail: md }));
      this.creating = undefined;
      if (made) this.pick(made.id);
    } catch (err) {
      this.failure = await errorMessage(this.hass!, err);
    }
  }

  /** Categories a recipe may use: non-food ones (batteries, household) never are ingredients. */
  private foods() {
    return this.categories.filter((c) => c.effective.food.value !== 0);
  }

  /** Product types (no children) first, then higher categories; then matches via products. */
  private hits(q: string): Hit[] {
    const isParent = (c: Category) => this.categories.some((x) => x.parent_id === c.id);
    const own = this.foods()
      .filter((c) => includesCI(c.name, q))
      .sort((a, b) => Number(isParent(a)) - Number(isParent(b)))
      .map((cat) => ({ cat }));
    const via = this.products.filter((p) => !own.some((o) => o.cat.id === p.cat.id));
    return [...own, ...via].slice(0, MAX_HITS);
  }

  private hit(h: Hit) {
    const parent = categoryPath(this.categories, h.cat.parent_id);
    const detail = [h.via ? t("recipes.ingredient.via", { name: h.via }) : "", parent]
      .filter(Boolean)
      .join(" · ");
    return html`<li>
      <button
        type="button"
        class="row"
        data-testid="ingredient-hit"
        @click=${() => this.pick(h.cat.id)}
      >
        <span>${h.cat.name}</span>
        <span class="detail">${detail}</span>
      </button>
    </li>`;
  }

  private list() {
    const q = this.query.trim();
    if (!q) return nothing;
    const exact = this.categories.some((c) => c.name.toLocaleLowerCase() === q.toLocaleLowerCase());
    return html`<ul>
      ${this.hits(q).map((h) => this.hit(h))}
      ${
        exact
          ? nothing
          : html`<li>
              <button
                type="button"
                class="row"
                data-testid="ingredient-create"
                @click=${() => (this.creating = q)}
              >
                <span>${t("recipes.ingredient.new_type", { name: q })}</span>
              </button>
            </li>`
      }
    </ul>`;
  }

  render() {
    const cat = this.categories.find((c) => c.id === this.value);
    if (cat)
      return html`<div class="lbl">${t("recipes.ingredient.text")}</div>
        <p data-testid="ingredient-choice">
          ${cat.name}
          <button
            type="button"
            class="reset"
            data-testid="ingredient-change"
            @click=${() => this.dispatchEvent(new CustomEvent("change", { detail: null }))}
          >
            ${t("shopping.add.change")}
          </button>
        </p>`;
    if (this.creating)
      return html`<div class="field">
        <span class="lbl">${t("recipes.ingredient.parent", { name: this.creating })}</span>
        <pantry-category-picker
          .categories=${this.foods()}
          .value=${null}
          @change=${(e: CustomEvent<number | null>) => this.create(e.detail)}
        ></pantry-category-picker>
        ${this.failure ? html`<p class="error" role="alert">${this.failure}</p>` : nothing}
        <button type="button" class="reset" @click=${() => (this.creating = undefined)}>
          ${t("common.cancel")}
        </button>
      </div>`;
    return html`<label>
        <span class="lbl">${t("recipes.ingredient.text")}</span>
        ${this.text ? html`<span class="detail">${this.text} – ${t("recipes.ingredient.unmatched")}</span>` : nothing}
        <input
          type="search"
          data-testid="ingredient-search"
          aria-invalid=${!!this.error}
          .value=${this.query}
          @input=${(e: Event) => this.input((e.target as HTMLInputElement).value)}
        />
        ${fieldMsg(this.error, "ingredient-search")}
      </label>
      ${this.list()}`;
  }

  static styles = formStyles;
}

customElements.define("pantry-ingredient-pick", PantryIngredientPick);
