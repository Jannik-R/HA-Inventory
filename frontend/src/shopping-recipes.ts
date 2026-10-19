import { LitElement, css, html, nothing, type PropertyValues } from "lit";
import { t } from "./i18n";
import { rowActions } from "./ui";
import { formStyles } from "./styles";
import { errorMessage, getRecipes, type Hass, type Recipe } from "./api";
import { getShoppingRecipes, removeShoppingRecipe, type ShoppingRecipe } from "./api-shopping";
import { confirmDelete } from "./confirm-dialog";
import { fmtPortions } from "./format";
import "./shopping-recipe-dialog";
import type { HomeInventoryShoppingRecipeDialog } from "./shopping-recipe-dialog";

/** "Für Rezepte": the recipes on the shopping list; change or remove an entry. Fires `home-inventory-saved`. */
export class HomeInventoryShoppingRecipes extends LitElement {
  static properties = {
    hass: { attribute: false },
    list: { state: true },
    error: { state: true },
  };

  declare hass?: Hass;
  declare list: ShoppingRecipe[];
  declare error: string;
  private recipes: Recipe[] = [];
  private started = false;

  constructor() {
    super();
    this.list = [];
    this.error = "";
  }

  willUpdate(changed: PropertyValues) {
    if (changed.has("hass") && this.hass && !this.started) {
      this.started = true; // once: `hass` changes on every state event
      this.load();
    }
  }

  private async load() {
    try {
      [this.list, this.recipes] = await Promise.all([
        getShoppingRecipes(this.hass!),
        getRecipes(this.hass!),
      ]);
      this.error = "";
    } catch (err) {
      this.error = await errorMessage(this.hass!, err);
    }
  }

  private edit(s: ShoppingRecipe) {
    const recipe = this.recipes.find((r) => r.id === s.recipe_id);
    if (recipe)
      this.renderRoot
        .querySelector<HomeInventoryShoppingRecipeDialog>("home-inventory-shopping-recipe-dialog")!
        .open(recipe, s.servings, s.optional);
  }

  private async removeEntry(s: ShoppingRecipe) {
    if (!(await confirmDelete(s.name))) return;
    try {
      await removeShoppingRecipe(this.hass!, s.recipe_id);
    } catch (err) {
      this.error = await errorMessage(this.hass!, err);
      return;
    }
    await this.load();
    this.dispatchEvent(new CustomEvent("home-inventory-saved", { bubbles: true, composed: true }));
  }

  render() {
    return html`${this.error ? html`<p class="error" role="alert">${this.error}</p>` : nothing}
      <home-inventory-shopping-recipe-dialog
        .hass=${this.hass}
        @home-inventory-saved=${() => this.load()}
      ></home-inventory-shopping-recipe-dialog>
      ${
        this.list.length
          ? html`<h3>${t("shopping.recipes.title")}</h3>
              <ul>
                ${this.list.map(
                  (s) =>
                    html`<li data-testid="shopping-recipe">
                      <span
                        class="no"
                        data-testid="shopping-recipe-no"
                        aria-label=${t("shopping.recipe.no", { no: s.no })}
                        >${s.no}</span
                      >
                      <span class="grow">${s.name}</span>
                      <span class="detail">${fmtPortions(this.hass, s.servings)}</span>
                      ${rowActions({
                        testid: "shopping-recipe",
                        name: s.name,
                        onEdit: () => this.edit(s),
                        onDelete: () => this.removeEntry(s),
                      })}
                    </li>`,
                )}
              </ul>`
          : nothing
      }`;
  }

  static styles = [
    formStyles,
    css`
      h3 {
        margin: 12px 0 4px;
        font-size: 1em;
        font-weight: 500;
      }
      .no {
        min-width: 1.5em;
        padding-left: 8px;
        color: var(--secondary-text-color);
      }
      .grow {
        flex: 1;
        min-width: 0;
      }
      ul {
        margin-bottom: 12px;
      }
    `,
  ];
}

customElements.define("home-inventory-shopping-recipes", HomeInventoryShoppingRecipes);
