import { LitElement, css, html, nothing } from "lit";
import { t } from "./i18n";
import { fieldMsg } from "./ui";
import { errorMessage, getMasterData, type Hass, type MasterData, type Recipe } from "./api";
import { storeLeftovers } from "./api-canning";
import { categoryDefault, inheritSelect } from "./inherit";
import { formStyles } from "./styles";
import { doneLine, doneStyles } from "./booking-done";
import "./label-dialog";
import type { HomeInventoryLabelDialog } from "./label-dialog";

/** Under the done line of "Gekocht": store leftovers of the cooked dish (servings, location).
 *  Fires `home-inventory-leftovers-stored` after storing. */
export class HomeInventoryLeftoverStore extends LitElement {
  static properties = {
    hass: { attribute: false },
    recipe: { attribute: false },
    servings: { state: true },
    locationId: { state: true },
    stored: { state: true },
    error: { state: true },
  };

  declare hass?: Hass;
  declare recipe?: Recipe;
  declare servings: number | null;
  declare locationId: number | null;
  declare stored?: { batch_id: number; charge: string; name: string; jars: number };
  declare error: string;
  private md?: MasterData;

  constructor() {
    super();
    this.servings = 1;
    this.locationId = null;
    this.error = "";
  }

  async connectedCallback() {
    super.connectedCallback();
    try {
      this.md = await getMasterData(this.hass!);
      this.requestUpdate();
    } catch (err) {
      this.error = await errorMessage(this.hass!, err);
    }
  }

  private dflt = () =>
    categoryDefault(this.md, this.md?.leftover_category_id, "default_location_id");

  private err() {
    const n = this.servings;
    if (n == null || !Number.isInteger(n) || n < 1 || n > 99) return t("valid.packages");
    return "";
  }

  private async store() {
    if (this.err() || !this.recipe) return;
    try {
      const res = await storeLeftovers(this.hass!, {
        recipe_id: this.recipe.id,
        servings: this.servings,
        location_id: this.locationId,
      });
      this.stored = { ...res, jars: this.servings! };
      this.error = "";
      this.dispatchEvent(
        new CustomEvent("home-inventory-leftovers-stored", { bubbles: true, composed: true }),
      );
    } catch (err) {
      this.error = await errorMessage(this.hass!, err);
    }
  }

  private labels() {
    const s = this.stored!;
    this.renderRoot
      .querySelector<HomeInventoryLabelDialog>("home-inventory-label-dialog")!
      .open({ id: s.batch_id, name: s.name, packages: s.jars }, s.jars);
  }

  render() {
    const dialog = html`<home-inventory-label-dialog
      .hass=${this.hass}
    ></home-inventory-label-dialog>`;
    if (this.stored)
      return html`${doneLine(
        t("leftovers.stored", { charge: this.stored.charge }),
        undefined,
        "leftover",
        html`<button
          type="button"
          class="undo"
          data-testid="leftover-label"
          @click=${() => this.labels()}
        >
          ${t("label.print")}
        </button>`,
      )}
      ${dialog}`;
    const err = this.err();
    return html`<div class="store">
        <label>
          <span class="lbl">${t("leftovers.jars")}</span>
          <input
            type="number"
            min="1"
            max="99"
            data-testid="leftover-servings"
            aria-invalid=${!!err}
            .value=${String(this.servings ?? "")}
            @keydown=${(e: KeyboardEvent) => e.key === "Enter" && this.store()}
            @input=${(e: Event) => {
              const v = (e.target as HTMLInputElement).value;
              this.servings = v === "" ? null : Number(v);
            }}
          />
          ${fieldMsg(err, "leftover-servings")}
        </label>
        <label>
          <span class="lbl">${t("book.location")}</span>
          ${inheritSelect({
            testid: "leftover-location",
            own: this.locationId,
            dflt: this.dflt(),
            options: (this.md?.locations ?? []).map((l) => [l.id, l.name]),
            numeric: true,
            onChange: (v) => (this.locationId = v as number | null),
          })}
        </label>
        <button
          type="button"
          data-testid="leftover-store"
          ?disabled=${!!err}
          @click=${() => this.store()}
        >
          ${t("leftovers.store")}
        </button>
      </div>
      ${this.error ? html`<p class="error" role="alert">${this.error}</p>` : nothing}`;
  }

  static styles = [
    formStyles,
    doneStyles,
    css`
      .store {
        display: flex;
        flex-wrap: wrap;
        align-items: flex-end;
        gap: 8px;
      }
    `,
  ];
}

customElements.define("home-inventory-leftover-store", HomeInventoryLeftoverStore);
