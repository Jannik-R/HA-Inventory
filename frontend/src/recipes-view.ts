import { LitElement, css, html, nothing, type PropertyValues } from "lit";
import { t } from "./i18n";
import { chevron, rowActions, toggled } from "./ui";
import { formStyles } from "./styles";
import {
  errorMessage,
  getMasterData,
  getRecipeAvailability,
  getRecipes,
  type Hass,
  type Ingredient,
  type MasterData,
  type Recipe,
  type RecipeDraft,
} from "./api";
import { deleteMasterRow } from "./delete-flow";
import { fmtPortions, recipeDetail } from "./recipe-detail";
import "./recipe-dialog";
import "./recipe-import";
import type { PantryRecipeImport } from "./recipe-import";
import type { PantryRecipeDialog } from "./recipe-dialog";

/** Recipe list: search (name and ingredients), open a row for ingredients with availability. */
export class PantryRecipes extends LitElement {
  static properties = {
    hass: { attribute: false },
    recipes: { state: true },
    md: { state: true },
    query: { state: true },
    open: { state: true },
    servings: { state: true },
    scaled: { state: true },
    error: { state: true },
  };

  declare hass?: Hass;
  declare recipes?: Recipe[];
  declare md?: MasterData;
  declare query: string;
  declare open: Set<number>;
  /** Servings shown per recipe (this session only) and the ingredients computed for them. */
  declare servings: Map<number, number>;
  declare scaled: Map<number, Ingredient[]>;
  declare error: string;

  constructor() {
    super();
    this.query = "";
    this.open = new Set();
    this.servings = new Map();
    this.scaled = new Map();
    this.error = "";
  }

  private started = false;

  willUpdate(changed: PropertyValues) {
    if (changed.has("hass") && this.hass && !this.started) {
      this.started = true; // once: `hass` changes on every state event
      this.load();
    }
  }

  private async load() {
    try {
      [this.recipes, this.md] = await Promise.all([
        getRecipes(this.hass!),
        getMasterData(this.hass!),
      ]);
      // Saved or changed stock: shown servings are recomputed from the fresh list.
      this.scaled = new Map();
      this.servings = new Map();
      this.error = "";
    } catch (err) {
      this.error = await errorMessage(this.hass!, err);
    }
    await this.updateComplete;
    this.renderRoot.querySelector<HTMLElement>("[data-testid=recipe-search]")?.focus();
  }

  private async setServings(r: Recipe, n: number) {
    this.servings = new Map(this.servings).set(r.id, n);
    try {
      const list = await getRecipeAvailability(this.hass!, r.id, n);
      if (this.servings.get(r.id) !== n) return; // a newer change is on its way
      this.scaled = new Map(this.scaled).set(r.id, list);
    } catch (err) {
      this.error = await errorMessage(this.hass!, err);
    }
  }

  private async removeRecipe(r: Recipe) {
    this.error = "";
    try {
      if (!(await deleteMasterRow(this.hass!, this.md!, "recipe", r))) return;
    } catch (err) {
      this.error = await errorMessage(this.hass!, err);
      return;
    }
    await this.load();
  }

  private edit(r?: Recipe) {
    this.renderRoot.querySelector<PantryRecipeDialog>("pantry-recipe-dialog")!.open(this.md!, r);
  }

  private importer() {
    return this.renderRoot.querySelector<PantryRecipeImport>("pantry-recipe-import")!;
  }

  private shown() {
    const q = this.query.trim().toLocaleLowerCase();
    return (this.recipes ?? []).filter(
      (r) =>
        !q ||
        r.name.toLocaleLowerCase().includes(q) ||
        r.ingredients.some((i) => i.text.toLocaleLowerCase().includes(q)),
    );
  }

  private row(r: Recipe) {
    const open = this.open.has(r.id);
    const toggle = () => (this.open = toggled(this.open, r.id));
    const n = this.servings.get(r.id) ?? r.servings;
    return html`<li class="recipe" data-testid="recipe-row">
      <div class="head">
        ${chevron(open, toggle)}
        <button type="button" class="row" @click=${toggle}>
          <span>${r.name}</span>
          <span class="detail"
            >${t("recipes.summary", r.summary)} · ${fmtPortions(this.hass, r.servings)}</span
          >
        </button>
        ${rowActions({
          testid: "recipe",
          name: r.name,
          onEdit: () => this.edit(r),
          onDelete: this.hass?.user?.is_admin ? () => this.removeRecipe(r) : undefined,
        })}
      </div>
      ${
        open
          ? recipeDetail({
              hass: this.hass!,
              md: this.md!,
              recipe: r,
              ingredients: this.scaled.get(r.id) ?? r.ingredients,
              servings: n,
              onServings: (v) => this.setServings(r, v),
            })
          : nothing
      }
    </li>`;
  }

  render() {
    const error = this.error ? html`<p class="error" role="alert">${this.error}</p>` : nothing;
    if (!this.recipes || !this.md) return error;
    const list = this.shown();
    return html`${error}
      <div class="bar">
        <input
          type="search"
          data-testid="recipe-search"
          aria-label=${t("recipes.search")}
          placeholder=${t("recipes.search")}
          .value=${this.query}
          @input=${(e: Event) => (this.query = (e.target as HTMLInputElement).value)}
        />
        <button data-testid="recipe-import" @click=${() => this.importer().open()}>
          ${t("recipes.import.open")}
        </button>
        <button class="primary" data-testid="recipe-add" @click=${() => this.edit()}>
          ${t("recipes.add")}
        </button>
      </div>
      <pantry-recipe-import
        .hass=${this.hass}
        @pantry-imported=${(e: CustomEvent<RecipeDraft>) =>
          this.renderRoot
            .querySelector<PantryRecipeDialog>("pantry-recipe-dialog")!
            .open(this.md!, undefined, e.detail)}
      ></pantry-recipe-import>
      <pantry-recipe-dialog
        .hass=${this.hass}
        @pantry-saved=${() => this.load()}
        @master=${(e: CustomEvent<MasterData>) => (this.md = e.detail)}
      >
      </pantry-recipe-dialog>
      ${
        list.length
          ? html`<ul>
              ${list.map((r) => this.row(r))}
            </ul>`
          : html`<p class="empty">
              ${t(this.recipes.length ? "recipes.no_hits" : "recipes.empty")}
            </p>`
      }`;
  }

  static styles = [
    formStyles,
    css`
      .bar {
        display: flex;
        gap: 8px;
        margin-bottom: 8px;
      }
      .bar input {
        flex: 1;
        min-width: 0;
      }
      .bar button {
        flex: none;
      }
      li.recipe {
        display: block;
      }
      .head {
        display: flex;
        align-items: center;
      }
      .detail-box {
        padding: 0 8px 12px 44px;
      }
      .servings {
        max-width: 140px;
      }
      li.ing {
        display: flex;
        justify-content: space-between;
        gap: 12px;
        padding: 6px 0;
      }
      .st {
        flex: none;
        color: var(--secondary-text-color);
        text-align: right;
      }
      .st.missing {
        color: var(--error-color);
      }
      .st.partial {
        color: var(--warning-color);
      }
      h3 {
        margin: 12px 0 4px;
        font-size: 1em;
        font-weight: 500;
      }
      .text {
        white-space: pre-line;
        margin: 0;
      }
      .photo {
        max-width: 100%;
        max-height: 240px;
        margin-top: 8px;
      }
      a {
        color: var(--primary-color);
      }
    `,
  ];
}

customElements.define("pantry-recipes", PantryRecipes);
