import { LitElement, css, html, nothing, type PropertyValues } from "lit";
import { t } from "./i18n";
import { fieldMsg } from "./ui";
import { formStyles } from "./styles";
import {
  errorMessage,
  getMasterData,
  getStock,
  listProducts,
  type Hass,
  type MasterData,
  type Product,
  type StockRow,
} from "./api";
import { daysLeft, expiryStatus } from "./stock-data";
import { fmtDate, lang } from "./format";
import { outButton, undoLine, type Undo } from "./take-out";
import { doneStyles } from "./booking-done";
import { hasModule } from "./modules";
import "./expiry-recipes";

/** Expired and soon expiring batches, earliest first; threshold per product or a temporary one. */
export class PantryExpiry extends LitElement {
  static properties = {
    hass: { attribute: false },
    md: { state: true },
    stock: { state: true },
    days: { state: true },
    error: { state: true },
    undo: { state: true },
  };

  declare hass?: Hass;
  declare md?: MasterData;
  declare stock?: StockRow[];
  /** Temporary threshold as typed; "" = each product's warn days. Not saved. */
  declare days: string;
  declare error: string;
  declare undo?: Undo;
  private products = new Map<number, Product>();

  constructor() {
    super();
    this.days = "";
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
      const [md, stock, products] = await Promise.all([
        getMasterData(this.hass!),
        getStock(this.hass!),
        listProducts(this.hass!),
      ]);
      this.products = new Map(products.map((p) => [p.id!, p]));
      [this.md, this.stock] = [md, stock];
    } catch (err) {
      this.error = await errorMessage(this.hass!, err);
    }
  }

  private errors() {
    const v = this.days.trim();
    return v && !/^\d+$/.test(v) ? t("expiry.days_invalid") : undefined;
  }

  private relative(iso: string) {
    return new Intl.RelativeTimeFormat(lang(this.hass), { numeric: "auto" }).format(
      daysLeft(iso),
      "day",
    );
  }

  render() {
    const error = this.error ? html`<p class="error" role="alert">${this.error}</p>` : nothing;
    if (!this.stock) return error;
    const invalid = this.errors();
    const days = this.days.trim() && !invalid ? Number(this.days) : undefined;
    const rows = this.stock
      .map((r) => ({ r, status: expiryStatus(r, this.products.get(r.product_id), this.md, days) }))
      .filter((x) => x.status)
      .sort((a, b) => a.r.expires_on!.localeCompare(b.r.expires_on!));
    return html`
      ${error}
      <div class="field">
        <label class="lbl" for="days">${t("expiry.days")}</label>
        <span class="num">
          <input
            id="days"
            type="number"
            min="0"
            step="1"
            inputmode="numeric"
            data-testid="expiry-days"
            placeholder=${t("expiry.days_placeholder")}
            aria-invalid=${!!invalid}
            .value=${this.days}
            @input=${(e: Event) => (this.days = (e.target as HTMLInputElement).value)}
          />
          ${t("common.days_unit")}
        </span>
        ${fieldMsg(invalid, "expiry-days")}
      </div>
      ${undoLine(this, "expiry")}
      ${
        rows.length
          ? html`<ul>
              ${rows.map(
                ({ r, status }) =>
                  html`<li data-testid="expiry-row">
                    <span class="when">
                      <span class=${status}>${fmtDate(this.hass, r.expires_on!)}</span>
                      <span class="detail"
                        >${this.relative(r.expires_on!)}${r.expiry_guessed ? ` · ${t("stock.guessed")}` : ""}</span
                      >
                    </span>
                    <span class="what">
                      <span>${r.name}</span>
                      <span class="detail"
                        >${[r.brand, r.opened_on && t("stock.opened"), r.location].filter(Boolean).join(" · ")}</span
                      >
                    </span>
                    <span class="detail">${t("book.count", { n: r.packages })}</span>
                    ${outButton(this, r.name, r, "expiry-out")}
                  </li>`,
              )}
            </ul>`
          : html`<p class="empty">${t("expiry.empty")}</p>`
      }
      ${
        hasModule("recipes")
          ? html`<pantry-expiry-recipes
              .hass=${this.hass}
              .days=${days}
              .stock=${this.stock}
            ></pantry-expiry-recipes>`
          : nothing
      }
    `;
  }

  static styles = [
    formStyles,
    doneStyles,
    css`
      .num input {
        max-width: 160px;
      }
      li {
        gap: 12px;
        padding: 4px 0 4px 8px;
      }
      .when,
      .what {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }
      .when {
        flex: none;
        width: 7.5em;
      }
      .what {
        flex: 1;
        min-width: 0;
      }
      .expired {
        color: var(--error-color);
      }
      .soon {
        color: var(--warning-color);
      }
    `,
  ];
}

customElements.define("pantry-expiry", PantryExpiry);
