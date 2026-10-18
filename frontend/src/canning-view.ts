import { LitElement, css, html, nothing, type PropertyValues } from "lit";
import { t } from "./i18n";
import { rowActions } from "./ui";
import { formStyles } from "./styles";
import {
  errorMessage,
  getMasterData,
  getRecipes,
  isAdmin,
  listProducts,
  type Hass,
  type MasterData,
  type Product,
  type Recipe,
} from "./api";
import { getCannings, type Canning } from "./api-canning";
import { deleteMasterRow } from "./delete-flow";
import { fmtDate } from "./format";
import "./canning-dialog";
import "./label-dialog";
import "./recipes-view";
import type { PantryCanningDialog } from "./canning-dialog";
import type { PantryLabelDialog } from "./label-dialog";

/** Canning protocols, newest first: one row per charge; a new protocol books its jars in. */
export class PantryCanning extends LitElement {
  static properties = {
    hass: { attribute: false },
    section: { attribute: false },
    rows: { state: true },
    message: { state: true },
    error: { state: true },
  };

  declare hass?: Hass;
  /** Route part after `canning/`: "recipes" shows the canning recipes, else the protocols. */
  declare section?: string;
  declare rows?: Canning[];
  declare message: string;
  declare error: string;
  private md?: MasterData;
  private products: Product[] = [];
  private recipes: Recipe[] = [];
  private started = false;

  constructor() {
    super();
    this.message = "";
    this.error = "";
  }

  willUpdate(changed: PropertyValues) {
    if (changed.has("hass") && this.hass && !this.started) {
      this.started = true; // once: `hass` changes on every state event
      this.load();
    } else if (changed.has("section") && this.started) this.load(); // recipes may be new
  }

  private nav(path: string) {
    this.dispatchEvent(
      new CustomEvent("pantry-navigate", { detail: path, bubbles: true, composed: true }),
    );
  }

  /** "Protokoll anlegen" on a canning recipe: back to the protocols, dialog with that recipe. */
  private async start(e: CustomEvent<number>) {
    this.nav("canning");
    await this.load();
    this.edit(undefined, e.detail);
  }

  private async load() {
    try {
      [this.rows, this.md, this.products, this.recipes] = await Promise.all([
        getCannings(this.hass!),
        getMasterData(this.hass!),
        listProducts(this.hass!),
        getRecipes(this.hass!),
      ]);
      this.error = "";
    } catch (err) {
      this.error = await errorMessage(this.hass!, err);
    }
  }

  private edit(c?: Canning, recipeId?: number) {
    this.message = "";
    this.renderRoot
      .querySelector<PantryCanningDialog>("pantry-canning-dialog")!
      .open(this.md!, this.products, this.recipes, c, recipeId);
  }

  private async removeCanning(c: Canning) {
    this.error = "";
    try {
      if (!(await deleteMasterRow(this.hass!, this.md!, "canning", { id: c.id, name: c.charge })))
        return;
    } catch (err) {
      this.error = await errorMessage(this.hass!, err);
      return;
    }
    await this.load();
  }

  /** New charge: offer its labels, one per jar. */
  private async saved(
    e: CustomEvent<{ batch_id: number; charge: string; name: string; jars: number } | undefined>,
  ) {
    await this.load();
    const made = e.detail;
    if (!made) return;
    this.message = t("canning.saved", { charge: made.charge });
    this.renderRoot
      .querySelector<PantryLabelDialog>("pantry-label-dialog")!
      .open({ id: made.batch_id, name: made.name, packages: made.jars }, made.jars);
  }

  private detail(c: Canning) {
    const parts = [
      t("canning.jars_left", { jars: c.jars, left: c.in_stock }),
      c.expires_on ? t("canning.until", { date: fmtDate(this.hass, c.expires_on) }) : "",
      c.temp != null ? `${c.temp} °C` : "",
      c.minutes != null ? `${c.minutes} ${t("recipes.minutes_unit")}` : "",
      c.recipe ?? "",
    ];
    return parts.filter(Boolean).join(" · ");
  }

  /** The protocol list with its primary action. */
  private protocols() {
    if (!this.rows) return nothing;
    return html`<div class="bar">
        <button class="primary" data-testid="canning-add" @click=${() => this.edit()}>
          ${t("canning.add")}
        </button>
      </div>
      ${this.message ? html`<p class="done" role="status" data-testid="canning-done">${this.message}</p>` : nothing}
      ${
        this.rows.length
          ? html`<ul>
              ${this.rows.map(
                (c) =>
                  html`<li data-testid="canning-row" data-charge=${c.charge}>
                    <button type="button" class="row" @click=${() => this.edit(c)}>
                      <span>${c.charge} · ${c.name}</span>
                      <span class="detail">${this.detail(c)}</span>
                      ${c.notes ? html`<span class="detail">${c.notes}</span>` : nothing}
                    </button>
                    ${rowActions({
                      testid: "canning",
                      name: c.charge,
                      onEdit: () => this.edit(c),
                      onDelete: isAdmin(this.hass) ? () => this.removeCanning(c) : undefined,
                    })}
                  </li>`,
              )}
            </ul>`
          : html`<p class="empty">${t("canning.empty")}</p>`
      }`;
  }

  render() {
    const recipes = this.section === "recipes";
    return html`${this.error ? html`<p class="error" role="alert">${this.error}</p>` : nothing}
      <nav aria-label=${t("canning.view.label")}>
        ${(["protocols", "recipes"] as const).map(
          (v) =>
            html`<button
              data-testid=${`canning-view-${v}`}
              aria-current=${(v === "recipes") === recipes ? "page" : "false"}
              @click=${() => this.nav(v === "recipes" ? "canning/recipes" : "canning")}
            >
              ${t(`canning.view.${v}`)}
            </button>`,
        )}
      </nav>
      <div @pantry-canning-start=${this.start}>
        ${recipes ? html`<pantry-recipes .hass=${this.hass} .canning=${true}></pantry-recipes>` : this.protocols()}
      </div>
      <pantry-canning-dialog .hass=${this.hass} @pantry-saved=${this.saved}></pantry-canning-dialog>
      <pantry-label-dialog
        .hass=${this.hass}
        @pantry-printed=${(e: CustomEvent<number>) =>
          e.detail && (this.message = t("label.printed", { n: e.detail }))}
      ></pantry-label-dialog>`;
  }

  static styles = [
    formStyles,
    css`
      nav {
        display: flex;
        gap: 4px;
        margin-bottom: 12px;
      }
      nav button[aria-current="page"] {
        color: var(--primary-color);
        border-color: var(--primary-color);
      }
      .bar {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 8px;
      }
      ul {
        list-style: none;
        margin: 0;
        padding: 0;
      }
      li {
        display: flex;
        align-items: center;
        border-bottom: 1px solid var(--divider-color);
      }
      .row {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        text-align: left;
      }
    `,
  ];
}

customElements.define("pantry-canning", PantryCanning);
