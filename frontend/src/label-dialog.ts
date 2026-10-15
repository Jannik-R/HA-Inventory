import { LitElement, html } from "lit";
import { t } from "./i18n";
import { editDialog, fieldMsg } from "./ui";
import { formStyles } from "./styles";
import { errorMessage, type Hass } from "./api";
import { printLabels } from "./label-print";

/** Print labels of one batch: how many (default 1). Call `open()`; fires `pantry-printed` (detail: printed count). */
export class PantryLabelDialog extends LitElement {
  static properties = {
    hass: { attribute: false },
    batch: { state: true },
    count: { state: true },
    error: { state: true },
  };

  declare hass?: Hass;
  declare count: string;
  declare error: string;
  declare batch?: { id: number; name: string; packages: number };

  constructor() {
    super();
    this.count = "1";
    this.error = "";
  }

  async open(batch: { id: number; name: string; packages: number }) {
    this.batch = batch;
    this.count = "1";
    this.error = "";
    await this.updateComplete;
    this.renderRoot.querySelector("dialog")!.showModal();
    this.renderRoot.querySelector<HTMLElement>("dialog input")?.focus();
  }

  private invalid = () => !/^\d+$/.test(this.count) || +this.count < 1 || +this.count > 99;

  private async print(e: Event) {
    e.preventDefault();
    if (this.invalid()) return;
    try {
      const n = await printLabels(this.hass!, this.batch!.id, Number(this.count));
      this.renderRoot.querySelector("dialog")?.close();
      this.dispatchEvent(
        new CustomEvent("pantry-printed", { detail: n, bubbles: true, composed: true }),
      );
    } catch (err) {
      this.error = await errorMessage(this.hass!, err);
    }
  }

  render() {
    const b = this.batch;
    if (!b) return html`<dialog></dialog>`;
    const bad = this.invalid();
    return editDialog({
      title: t("label.title", { name: b.name }),
      body: html`<label>
        <span class="lbl">${t("label.count")}</span>
        <input
          data-testid="label-count"
          type="number"
          min="1"
          max="99"
          step="1"
          inputmode="numeric"
          aria-invalid=${bad}
          .value=${this.count}
          @input=${(e: Event) => (this.count = (e.target as HTMLInputElement).value)}
        />
        ${
          bad
            ? fieldMsg(t("valid.label_count"), "label-count")
            : html`<span class="detail">${t("label.in_stock", { n: b.packages })}</span>`
        }
      </label>`,
      error: this.error,
      invalid: bad,
      submit: { label: t("label.submit"), testid: "label-print" },
      dirty: () => this.count !== "1",
      onSubmit: (e) => this.print(e),
      onClosed: () => (this.batch = undefined),
    });
  }

  static styles = formStyles;
}

customElements.define("pantry-label-dialog", PantryLabelDialog);
