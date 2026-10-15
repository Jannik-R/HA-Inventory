import { LitElement, html } from "lit";
import { t } from "./i18n";
import { editDialog, fieldMsg, plausibleDate } from "./ui";
import { formStyles } from "./styles";
import { editStock, errorMessage, type Hass, type StockRow } from "./api";
import type { Errors } from "./product-fields";

interface Draft {
  expires_on: string;
  packages: string;
  /** The date input reports incomplete input only via validity; its value is then "". */
  dateBad: boolean;
}

/** Fix one batch row (date, count at its location; the date type belongs to the product). Call `open()`; fires `pantry-saved`. */
export class PantryBatchDialog extends LitElement {
  static properties = {
    hass: { attribute: false },
    d: { state: true },
    error: { state: true },
  };

  declare hass?: Hass;
  declare d?: Draft;
  declare error: string;
  private row?: StockRow;
  private orig?: Draft;

  constructor() {
    super();
    this.error = "";
  }

  async open(row: StockRow) {
    this.error = "";
    this.row = row;
    this.d = {
      expires_on: row.expires_on ?? "",
      packages: String(row.packages),
      dateBad: false,
    };
    this.orig = { ...this.d };
    await this.updateComplete;
    this.renderRoot.querySelector("dialog")!.showModal();
    this.renderRoot.querySelector<HTMLElement>("dialog input")?.focus();
  }

  private set(patch: Partial<Draft>) {
    this.d = { ...this.d!, ...patch };
  }

  private errors(d: Draft): Errors {
    const e: Errors = {};
    if (d.dateBad || (d.expires_on && !plausibleDate(d.expires_on))) e.expires = t("valid.date");
    if (!/^\d+$/.test(d.packages.trim())) e.packages = t("valid.days");
    return e;
  }

  private async save(e: Event) {
    e.preventDefault();
    const d = this.d!;
    if (Object.keys(this.errors(d)).length) return;
    try {
      await editStock(this.hass!, {
        batch_id: this.row!.batch_id,
        location_id: this.row!.location_id,
        expires_on: d.expires_on || null,
        packages: Number(d.packages),
      });
      this.renderRoot.querySelector("dialog")?.close();
      this.dispatchEvent(new CustomEvent("pantry-saved", { bubbles: true, composed: true }));
    } catch (err) {
      this.error = await errorMessage(this.hass!, err);
    }
  }

  render() {
    const d = this.d;
    if (!d) return html`<dialog></dialog>`;
    const err = this.errors(d);
    const o = this.orig!;
    const dirty = () => d.expires_on !== o.expires_on || d.packages !== o.packages;
    return editDialog({
      title: t("stock.edit_batch", { name: this.row!.name, location: this.row!.location }),
      body: html`<label>
          <span class="lbl">
            ${t("book.expires_on_type", { type: t(`settings.expiry.${this.row!.expiry_type}`) })}
          </span>
          <input
            data-testid="batch-expires"
            type="date"
            min="2000-01-01"
            max="2099-12-31"
            aria-invalid=${!!err.expires}
            .value=${d.expires_on}
            @input=${(e: Event) => {
              const el = e.target as HTMLInputElement;
              this.set({ expires_on: el.value, dateBad: el.validity.badInput });
            }}
          />
          ${err.expires ? fieldMsg(err.expires, "batch-expires") : html`<span class="detail">${t("book.no_date_hint")}</span>`}
        </label>
        <label>
          <span class="lbl">${t("book.packages")}</span>
          <input
            data-testid="batch-packages"
            type="number"
            min="0"
            step="1"
            inputmode="numeric"
            aria-invalid=${!!err.packages}
            .value=${d.packages}
            @input=${(e: Event) => this.set({ packages: (e.target as HTMLInputElement).value })}
          />
          ${err.packages ? fieldMsg(err.packages, "batch-packages") : html`<span class="detail">${t("stock.zero_hint")}</span>`}
        </label>`,
      error: this.error,
      invalid: Object.keys(err).length > 0,
      dirty,
      onSubmit: (e) => this.save(e),
      onClosed: () => (this.d = undefined),
    });
  }

  static styles = formStyles;
}

customElements.define("pantry-batch-dialog", PantryBatchDialog);
