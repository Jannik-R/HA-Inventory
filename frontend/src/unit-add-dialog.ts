import { LitElement, html } from "lit";
import { t } from "./i18n";
import { editDialog, fieldMsg } from "./ui";
import { formStyles } from "./styles";
import type { Errors } from "./product-fields";
import { addUnit, errorMessage, getMasterData, type Hass, type MasterData } from "./api";

/** Small dialog for a new count unit. `open(name)`; fires `unit-added` ({id, md}) with fresh master data. */
export class HomeInventoryUnitAddDialog extends LitElement {
  static properties = {
    hass: { attribute: false },
    active: { state: true },
    name: { state: true },
    symbol: { state: true },
    error: { state: true },
    busy: { state: true },
  };

  declare hass?: Hass;
  declare active: boolean;
  declare name: string;
  declare symbol: string;
  declare error: string;
  declare busy: boolean;
  private initial = "";

  constructor() {
    super();
    this.active = false;
    this.name = "";
    this.symbol = "";
    this.error = "";
    this.busy = false;
  }

  async open(name = "") {
    this.name = name;
    this.symbol = "";
    this.initial = JSON.stringify([name, ""]);
    this.error = "";
    this.active = true;
    await this.updateComplete;
    this.renderRoot.querySelector("dialog")!.showModal();
    this.renderRoot.querySelector<HTMLElement>("dialog input")?.focus();
  }

  private errors(): Errors {
    const e: Errors = {};
    if (!this.name.trim()) e.name = t("valid.required");
    return e;
  }

  private async save(ev: Event) {
    ev.preventDefault();
    if (Object.keys(this.errors()).length || this.busy) return;
    this.busy = true;
    try {
      const { id } = await addUnit(this.hass!, this.name.trim(), this.symbol.trim() || undefined);
      const md: MasterData = await getMasterData(this.hass!);
      this.renderRoot.querySelector("dialog")?.close();
      this.dispatchEvent(new CustomEvent("unit-added", { detail: { id, md } }));
    } catch (err) {
      this.error = await errorMessage(this.hass!, err);
    } finally {
      this.busy = false;
    }
  }

  render() {
    if (!this.active) return html`<dialog></dialog>`;
    const err = this.errors();
    return editDialog({
      title: t("unit_add.title"),
      body: html`<label>
          <span class="lbl">${t("unit_add.name")}</span>
          <input
            data-testid="unit-add-name"
            aria-invalid=${!!err.name}
            .value=${this.name}
            @input=${(e: Event) => (this.name = (e.target as HTMLInputElement).value)}
          />
          ${fieldMsg(err.name, "unit-add-name")}
        </label>
        <label>
          <span class="lbl">${t("unit_add.symbol")}</span>
          <input
            data-testid="unit-add-symbol"
            .value=${this.symbol}
            @input=${(e: Event) => (this.symbol = (e.target as HTMLInputElement).value)}
          />
        </label>`,
      error: this.error,
      invalid: Object.keys(err).length > 0 || this.busy,
      submit: { label: t("common.save"), testid: "unit-add-save" },
      dirty: () => JSON.stringify([this.name, this.symbol]) !== this.initial,
      onSubmit: (e) => this.save(e),
      onClosed: () => (this.active = false),
    });
  }

  static styles = [formStyles];
}

customElements.define("home-inventory-unit-add-dialog", HomeInventoryUnitAddDialog);
