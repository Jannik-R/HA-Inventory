import { LitElement, html, nothing } from "lit";
import { t } from "./i18n";
import { editDialog, fieldMsg, numOrNull } from "./ui";
import { formStyles } from "./styles";
import { errorMessage, type Hass, type Ingredient, type Recipe } from "./api";
import { getShoppingRecipes, setShoppingRecipe } from "./api-shopping";

/**
 * Put a recipe on the shopping list (or change its entry): servings and which optional
 * ingredients count. Call `open()`; fires `home-inventory-saved` after saving.
 */
export class HomeInventoryShoppingRecipeDialog extends LitElement {
  static properties = {
    hass: { attribute: false },
    recipe: { state: true },
    servings: { state: true },
    chosen: { state: true },
    active: { state: true },
    error: { state: true },
  };

  declare hass?: Hass;
  declare recipe?: Recipe;
  declare servings: number | null;
  declare chosen: Set<number>;
  declare active: boolean;
  declare error: string;
  private start = { servings: 1, chosen: new Set<number>() };

  constructor() {
    super();
    this.servings = 1;
    this.chosen = new Set();
    this.active = false;
    this.error = "";
  }

  async open(recipe: Recipe, servings: number, optional: number[] = []) {
    this.recipe = recipe;
    this.servings = servings;
    this.chosen = new Set(optional);
    this.start = { servings, chosen: new Set(optional) };
    this.error = "";
    this.active = true;
    await this.updateComplete;
    this.renderRoot.querySelector("dialog")!.showModal();
    this.renderRoot.querySelector<HTMLElement>("dialog input")?.focus();
  }

  /**
   * From a recipe's detail: servings the user set there, else the stored ones, else the recipe's.
   * Without optional ingredients nothing is asked and the list is updated right away.
   * Throws on backend errors (the caller shows them).
   */
  async request(recipe: Recipe, shown?: number) {
    const stored = (await getShoppingRecipes(this.hass!)).find((s) => s.recipe_id === recipe.id);
    const servings = shown ?? stored?.servings ?? recipe.servings;
    if (recipe.ingredients.some((i) => i.optional))
      return this.open(recipe, servings, stored?.optional);
    await setShoppingRecipe(this.hass!, recipe.id, servings, []);
    this.dispatchEvent(new CustomEvent("home-inventory-saved", { bubbles: true, composed: true }));
  }

  private errors() {
    const n = this.servings;
    return n == null || !Number.isInteger(n) || n < 1 || n > 99
      ? { servings: t("valid.servings") }
      : {};
  }

  private async save(ev: Event) {
    ev.preventDefault();
    if (Object.keys(this.errors()).length) return;
    try {
      await setShoppingRecipe(this.hass!, this.recipe!.id, this.servings!, [...this.chosen]);
    } catch (err) {
      this.error = await errorMessage(this.hass!, err);
      return;
    }
    this.renderRoot.querySelector("dialog")?.close();
    this.dispatchEvent(new CustomEvent("home-inventory-saved", { bubbles: true, composed: true }));
  }

  private toggle(i: Ingredient, on: boolean) {
    const next = new Set(this.chosen);
    if (on) next.add(i.id!);
    else next.delete(i.id!);
    this.chosen = next;
  }

  render() {
    if (!this.active || !this.recipe) return html`<dialog></dialog>`;
    const err = this.errors();
    const optional = this.recipe.ingredients.filter((i) => i.optional && i.id != null);
    return editDialog({
      title: t("shopping.recipe.title", { name: this.recipe.name }),
      body: html`<label>
          <span class="lbl">${t("recipes.servings")}</span>
          <input
            type="number"
            min="1"
            max="99"
            step="1"
            inputmode="numeric"
            data-testid="shopping-recipe-servings"
            aria-invalid=${!!err.servings}
            .value=${String(this.servings ?? "")}
            @input=${(e: Event) => (this.servings = numOrNull((e.target as HTMLInputElement).value))}
          />
          ${fieldMsg(err.servings, "shopping-recipe-servings")}
        </label>
        ${
          optional.length
            ? html`<fieldset>
                <legend class="lbl">${t("shopping.recipe.optional")}</legend>
                ${optional.map(
                  (i) =>
                    html`<label class="check">
                      <input
                        type="checkbox"
                        data-testid="shopping-recipe-optional"
                        .checked=${this.chosen.has(i.id!)}
                        @change=${(e: Event) => this.toggle(i, (e.target as HTMLInputElement).checked)}
                      />
                      ${i.text}
                    </label>`,
                )}
              </fieldset>`
            : nothing
        }`,
      error: this.error,
      invalid: Object.keys(err).length > 0,
      submit: { label: t("shopping.recipe.submit"), testid: "shopping-recipe-save" },
      dirty: () =>
        this.servings !== this.start.servings ||
        this.chosen.size !== this.start.chosen.size ||
        [...this.chosen].some((id) => !this.start.chosen.has(id)),
      onSubmit: (e) => this.save(e),
      onClosed: () => (this.active = false),
    });
  }

  static styles = formStyles;
}

customElements.define("home-inventory-shopping-recipe-dialog", HomeInventoryShoppingRecipeDialog);
