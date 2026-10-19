import { LitElement, html, nothing, type PropertyValues } from "lit";
import { t } from "./i18n";
import { chevron, rowActions, todayIso, toggled } from "./ui";
import { formStyles } from "./styles";
import { recipesStyles } from "./recipes-styles";
import {
  errorMessage,
  getMasterData,
  getRecipeAvailability,
  getExpiringRecipes,
  getRecipes,
  type Hass,
  type Ingredient,
  type MasterData,
  type Recipe,
  type RecipeDraft,
  isAdmin,
  isCanning,
} from "./api";
import { deleteMasterRow } from "./delete-flow";
import { recipeDetail } from "./recipe-detail";
import { fmtPortions, includesCI } from "./format";
import "./recipe-dialog";
import "./recipe-import";
import "./shopping-recipe-dialog";
import { DINNER } from "./plan-dates";
import "./meal-dialog";
import "./cook-mode";
import type { PantryCookMode } from "./cook-mode";
import type { PantryMealDialog } from "./meal-dialog";
import type { PantryShoppingRecipeDialog } from "./shopping-recipe-dialog";
import type { PantryRecipeImport } from "./recipe-import";
import type { PantryRecipeDialog } from "./recipe-dialog";

/** Recipe list: search (name and ingredients), open a row for ingredients with availability. */
export class PantryRecipes extends LitElement {
  static properties = {
    hass: { attribute: false },
    section: { attribute: false },
    canning: { attribute: false },
    recipes: { state: true },
    md: { state: true },
    query: { state: true },
    expiring: { state: true },
    onlyExpiring: { state: true },
    open: { state: true },
    servings: { state: true },
    scaled: { state: true },
    error: { state: true },
  };

  declare hass?: Hass;
  /** Route part after `recipes/`: a recipe id opens that recipe (link from the week plan). */
  declare section?: string;
  /** Einkochen tab: only canning recipes (each makes a product); else only the others. */
  declare canning?: boolean;
  declare recipes?: Recipe[];
  declare md?: MasterData;
  declare query: string;
  /** Recipe id -> expiring ingredients it uses up; `onlyExpiring` hides the others. */
  declare expiring: Map<number, number>;
  declare onlyExpiring: boolean;
  declare open: Set<number>;
  /** Servings shown per recipe (this session only) and the ingredients computed for them. */
  declare servings: Map<number, number>;
  declare scaled: Map<number, Ingredient[]>;
  declare error: string;

  constructor() {
    super();
    this.query = "";
    this.expiring = new Map();
    this.onlyExpiring = false;
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
    } else if (changed.has("section") && this.recipes) this.reveal();
  }

  /** Open the recipe named by the route and scroll to it. */
  private async reveal() {
    const id = Number(this.section);
    if (!this.recipes?.some((r) => r.id === id)) return;
    this.query = "";
    this.open = new Set(this.open).add(id);
    await this.updateComplete;
    this.renderRoot.querySelector(`[data-recipe-id="${id}"]`)?.scrollIntoView({ block: "start" });
  }

  private async load() {
    try {
      const [recipes, md, expiring] = await Promise.all([
        getRecipes(this.hass!),
        getMasterData(this.hass!),
        getExpiringRecipes(this.hass!),
      ]);
      [this.recipes, this.md] = [recipes, md];
      this.expiring = new Map(expiring.map((e) => [e.recipe_id, e.used]));
      // Saved or changed stock: shown servings are recomputed from the fresh list.
      this.scaled = new Map();
      this.servings = new Map();
      this.error = "";
    } catch (err) {
      this.error = await errorMessage(this.hass!, err);
    }
    await this.updateComplete;
    this.renderRoot.querySelector<HTMLElement>("[data-testid=recipe-search]")?.focus();
    await this.reveal();
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

  private async toShopping(r: Recipe) {
    this.error = "";
    try {
      await this.renderRoot
        .querySelector<PantryShoppingRecipeDialog>("pantry-shopping-recipe-dialog")!
        .request(r, this.servings.get(r.id));
    } catch (err) {
      this.error = await errorMessage(this.hass!, err);
    }
  }

  /** The shopping list changed: refresh only "on the list" marks, not the shown servings or focus. */
  private async refreshShopping() {
    try {
      const fresh = new Map((await getRecipes(this.hass!)).map((r) => [r.id, r.shopping_servings]));
      this.recipes = this.recipes?.map((r) => ({
        ...r,
        shopping_servings: fresh.get(r.id) ?? null,
      }));
    } catch (err) {
      this.error = await errorMessage(this.hass!, err);
    }
  }

  private edit(r?: Recipe) {
    this.renderRoot
      .querySelector<PantryRecipeDialog>("pantry-recipe-dialog")!
      .open(this.md!, r, undefined, !!this.canning);
  }

  private importer() {
    return this.renderRoot.querySelector<PantryRecipeImport>("pantry-recipe-import")!;
  }

  private shown() {
    const q = this.query.trim();
    return (this.recipes ?? []).filter(
      (r) =>
        isCanning(r) === !!this.canning &&
        (!this.onlyExpiring || this.expiring.has(r.id)) &&
        (!q || includesCI(r.name, q) || r.ingredients.some((i) => includesCI(i.text, q))),
    );
  }

  private row(r: Recipe) {
    const open = this.open.has(r.id);
    const toggle = () => (this.open = toggled(this.open, r.id));
    const n = this.servings.get(r.id) ?? r.servings;
    return html`<li class="recipe" data-testid="recipe-row" data-recipe-id=${r.id}>
      <div class="head">
        ${chevron(open, toggle)}
        <button type="button" class="row" data-testid="recipe-toggle" @click=${toggle}>
          <span>${r.name}</span>
          <span class="detail"
            >${t("recipes.summary", r.summary)} ·
            ${isCanning(r) ? t("canning.recipe_summary", { name: r.canning_product ?? "", jars: r.servings }) : fmtPortions(this.hass, r.servings)}${
              this.expiring.has(r.id)
                ? html` �
                    <span class="soon" data-testid="recipe-expiring"
                      >${t("recipes.expiring", { n: this.expiring.get(r.id)! })}</span
                    >`
                : nothing
            }</span
          >
        </button>
        ${rowActions({
          testid: "recipe",
          name: r.name,
          onEdit: () => this.edit(r),
          onDelete: isAdmin(this.hass) ? () => this.removeRecipe(r) : undefined,
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
              onShopping: () => this.toShopping(r),
              // a canning recipe starts a protocol (handled by the Einkochen tab)
              onPlan: () =>
                isCanning(r)
                  ? this.dispatchEvent(
                      new CustomEvent("pantry-canning-start", {
                        detail: r.id,
                        bubbles: true,
                        composed: true,
                      }),
                    )
                  : this.renderRoot
                      .querySelector<PantryMealDialog>("pantry-meal-dialog")!
                      .open(todayIso(), DINNER, this.recipes!, n, undefined, r.name),
              onCook: () =>
                this.renderRoot
                  .querySelector<PantryCookMode>("pantry-cook-mode")!
                  .open(this.hass!, this.md!, r, this.scaled.get(r.id) ?? r.ingredients, n),
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
          ${t(this.canning ? "canning.recipe_add" : "recipes.add")}
        </button>
      </div>
      ${
        this.expiring.size
          ? html`<label class="check">
              <input
                type="checkbox"
                data-testid="recipe-expiring-only"
                .checked=${this.onlyExpiring}
                @change=${(e: Event) => (this.onlyExpiring = (e.target as HTMLInputElement).checked)}
              />
              ${t("recipes.expiring_only")}
            </label>`
          : nothing
      }
      <pantry-recipe-import
        .hass=${this.hass}
        @pantry-imported=${(e: CustomEvent<RecipeDraft>) =>
          this.renderRoot
            .querySelector<PantryRecipeDialog>("pantry-recipe-dialog")!
            .open(this.md!, undefined, e.detail, !!this.canning)}
      ></pantry-recipe-import>
      <pantry-shopping-recipe-dialog
        .hass=${this.hass}
        @pantry-saved=${() => this.refreshShopping()}
      ></pantry-shopping-recipe-dialog>
      <pantry-meal-dialog .hass=${this.hass}></pantry-meal-dialog>
      <pantry-cook-mode></pantry-cook-mode>
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
              ${t(this.query.trim() ? "recipes.no_hits" : this.canning ? "canning.recipes_empty" : "recipes.empty")}
            </p>`
      }`;
  }

  static styles = [formStyles, recipesStyles];
}

customElements.define("pantry-recipes", PantryRecipes);
