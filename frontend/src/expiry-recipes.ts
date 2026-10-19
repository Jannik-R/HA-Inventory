import { LitElement, css, html, nothing, type PropertyValues } from "lit";
import { t } from "./i18n";
import { formStyles } from "./styles";
import { getExpiringRecipes, type ExpiringRecipe, type Hass } from "./api";

/** Recipes that use up what expires soon (same threshold as the list above), best first. */
export class HomeInventoryExpiryRecipes extends LitElement {
  static properties = {
    hass: { attribute: false },
    days: { attribute: false },
    stock: { attribute: false },
    list: { state: true },
  };

  declare hass?: Hass;
  /** The view's temporary threshold; undefined = each product's warn days. */
  declare days?: number;
  /** Changes when the stock does (take-out), so the suggestions follow. */
  declare stock?: unknown;
  declare list: ExpiringRecipe[];
  private latest = 0;
  private started = false;

  constructor() {
    super();
    this.list = [];
  }

  willUpdate(changed: PropertyValues) {
    if (!this.hass) return;
    // `hass` changes on every state event: it only starts the first load
    if (changed.has("days") || changed.has("stock") || (changed.has("hass") && !this.started)) {
      this.started = true;
      this.load();
    }
  }

  private async load() {
    const run = ++this.latest;
    try {
      const list = await getExpiringRecipes(this.hass!, this.days);
      if (run === this.latest) this.list = list;
    } catch {
      this.list = []; // suggestions are a bonus; the expiry list above reports real errors
    }
  }

  private open(id: number) {
    this.dispatchEvent(
      new CustomEvent("home-inventory-navigate", {
        detail: `recipes/${id}`,
        bubbles: true,
        composed: true,
      }),
    );
  }

  render() {
    if (!this.list.length) return nothing;
    return html`<h2>${t("expiry.recipes")}</h2>
      <ul>
        ${this.list.map(
          (r) =>
            html`<li>
              <button
                type="button"
                class="row"
                data-testid="expiry-recipe"
                @click=${() => this.open(r.recipe_id)}
              >
                <span>${r.name}</span>
                <span class="detail"
                  >${t("expiry.recipe_detail", { ...r, products: r.products.join(", ") })}</span
                >
              </button>
            </li>`,
        )}
      </ul>`;
  }

  static styles = [
    formStyles,
    css`
      h2 {
        font-size: 1em;
        margin: 24px 0 8px;
      }
    `,
  ];
}

customElements.define("home-inventory-expiry-recipes", HomeInventoryExpiryRecipes);
