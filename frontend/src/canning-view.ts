import { LitElement, css, html, nothing, type PropertyValues } from "lit";
import { t } from "./i18n";
import { loadingLine, rowActions } from "./ui";
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
import "./leftover-dialog";
import "./label-dialog";
import "./recipes-view";
import type { HomeInventoryCanningDialog } from "./canning-dialog";
import type { HomeInventoryLeftoverDialog } from "./leftover-dialog";
import type { HomeInventoryLabelDialog } from "./label-dialog";
import { fmtDuration, preserveKinds, pt, type Preserve } from "./preserve";

/** Tab *Haltbarmachen*: canning or drying protocols (`kind`), newest first: one row per charge;
 *  a new protocol books its jars / packages in. */
export class HomeInventoryCanning extends LitElement {
  static properties = {
    hass: { attribute: false },
    section: { attribute: false },
    rows: { state: true },
    message: { state: true },
    error: { state: true },
  };

  declare hass?: Hass;
  /** Route part after `canning/`: "" / "recipes" (canning), "drying" / "drying-recipes". */
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

  /** Drying by route, or when it is the only kind switched on. */
  private get kind(): Preserve {
    const kinds = preserveKinds();
    if (this.section === "leftovers") return "leftover";
    if (this.section?.startsWith("drying")) return "drying";
    return kinds.includes("canning") ? "canning" : (kinds[0] ?? "canning");
  }

  private get recipesShown() {
    return this.section === "recipes" || this.section === "drying-recipes";
  }

  /** Route of a kind and view. */
  private route(kind: Preserve, recipes: boolean) {
    if (kind === "leftover") return "canning/leftovers";
    if (kind === "drying") return recipes ? "canning/drying-recipes" : "canning/drying";
    return recipes ? "canning/recipes" : "canning";
  }

  private nav(path: string) {
    this.dispatchEvent(
      new CustomEvent("home-inventory-navigate", { detail: path, bubbles: true, composed: true }),
    );
  }

  /** "Protokoll anlegen" on a canning recipe: back to the protocols, dialog with that recipe. */
  private async start(e: CustomEvent<number>) {
    this.nav(this.route(this.kind, false));
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
    if ((c?.kind ?? this.kind) === "leftover")
      return this.renderRoot
        .querySelector<HomeInventoryLeftoverDialog>("home-inventory-leftover-dialog")!
        .open(this.md!, this.recipes, c);
    this.renderRoot
      .querySelector<HomeInventoryCanningDialog>("home-inventory-canning-dialog")!
      .open(this.md!, this.products, this.recipes, this.kind, c, recipeId);
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
      .querySelector<HomeInventoryLabelDialog>("home-inventory-label-dialog")!
      .open({ id: made.batch_id, name: made.name, packages: made.jars }, made.jars);
  }

  private detail(c: Canning) {
    const parts = [
      pt(c.kind, "jars_left", { jars: c.jars, left: c.in_stock }),
      c.expires_on ? t("canning.until", { date: fmtDate(this.hass, c.expires_on) }) : "",
      c.temp != null ? `${c.temp} °C` : "",
      c.minutes != null ? fmtDuration(this.hass, c.kind, c.minutes) : "",
      c.recipe ?? "",
    ];
    return parts.filter(Boolean).join(" · ");
  }

  /** The protocol list with its primary action. */
  private protocols() {
    if (!this.rows) return this.error ? nothing : loadingLine();
    const rows = this.rows.filter((c) => c.kind === this.kind);
    return html`<div class="bar">
        <button class="primary" data-testid="canning-add" @click=${() => this.edit()}>
          ${this.kind === "leftover" ? t("leftovers.add_title") : t("canning.add")}
        </button>
      </div>
      ${this.message ? html`<p class="done" role="status" data-testid="canning-done">${this.message}</p>` : nothing}
      ${
        rows.length
          ? html`<ul>
              ${rows.map(
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
          : html`<p class="empty">${pt(this.kind, "empty")}</p>`
      }`;
  }

  render() {
    const kind = this.kind;
    const recipes = this.recipesShown && kind !== "leftover";
    const kinds = preserveKinds();
    return html`${this.error ? html`<p class="error" role="alert">${this.error}</p>` : nothing}
      ${
        kinds.length > 1
          ? html`<nav aria-label=${t("preserve.kind_label")}>
              ${kinds.map(
                (k) =>
                  html`<button
                    data-testid=${`preserve-${k}`}
                    aria-current=${k === kind ? "page" : "false"}
                    @click=${() => this.nav(this.route(k, recipes))}
                  >
                    ${t(`preserve.${k}`)}
                  </button>`,
              )}
            </nav>`
          : nothing
      }
      ${
        kind === "leftover"
          ? nothing
          : html`<nav aria-label=${t("canning.view.label")}>
              ${(["protocols", "recipes"] as const).map(
                (v) =>
                  html`<button
                    data-testid=${`canning-view-${v}`}
                    aria-current=${(v === "recipes") === recipes ? "page" : "false"}
                    @click=${() => this.nav(this.route(kind, v === "recipes"))}
                  >
                    ${t(`canning.view.${v}`)}
                  </button>`,
              )}
            </nav>`
      }
      <div @home-inventory-canning-start=${this.start}>
        ${recipes ? html`<home-inventory-recipes .hass=${this.hass} .canning=${kind as "canning" | "drying"}></home-inventory-recipes>` : this.protocols()}
      </div>
      <home-inventory-canning-dialog
        .hass=${this.hass}
        @home-inventory-saved=${this.saved}
      ></home-inventory-canning-dialog>
      <home-inventory-leftover-dialog
        .hass=${this.hass}
        @home-inventory-saved=${this.saved}
      ></home-inventory-leftover-dialog>
      <home-inventory-label-dialog
        .hass=${this.hass}
        @home-inventory-printed=${(e: CustomEvent<number>) =>
          e.detail && (this.message = t("label.printed", { n: e.detail }))}
      ></home-inventory-label-dialog>`;
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

customElements.define("home-inventory-canning", HomeInventoryCanning);
