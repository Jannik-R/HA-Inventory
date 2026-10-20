import { LitElement, html } from "lit";
import { t } from "./i18n";
import { editDialog, fieldMsg } from "./ui";
import { formStyles } from "./styles";
import { errorMessage, type Hass, type Location, type StockRow } from "./api";
import { freezePackages, type Opened } from "./api-open";

interface Draft {
  packages: string;
  /** "" = the backend's default (first freezer / the product's location). */
  to: string;
}

/** Freeze or thaw packages of a batch row: count (default 1) and target location. Call
 *  `open(row, thaw)`; fires `home-inventory-frozen` with the result and whether it was a thaw. */
export class HomeInventoryFrozenDialog extends LitElement {
  static properties = {
    hass: { attribute: false },
    locations: { attribute: false },
    d: { state: true },
    error: { state: true },
  };

  declare hass?: Hass;
  declare locations: Location[];
  declare d?: Draft;
  declare error: string;
  private row?: StockRow;
  private thaw = false;

  constructor() {
    super();
    this.locations = [];
    this.error = "";
  }

  async open(row: StockRow, thaw: boolean) {
    this.error = "";
    this.row = row;
    this.thaw = thaw;
    this.d = { packages: "1", to: "" };
    await this.updateComplete;
    this.renderRoot.querySelector("dialog")!.showModal();
    this.renderRoot.querySelector<HTMLInputElement>("dialog input")?.select();
  }

  private errors(d: Draft) {
    const n = Number(d.packages);
    return /^\d+$/.test(d.packages.trim()) && n >= 1 && n <= this.row!.packages
      ? undefined
      : t("frozen.packages_range", { n: this.row!.packages });
  }

  private async save(e: Event) {
    e.preventDefault();
    const d = this.d!;
    if (this.errors(d)) return;
    const r = this.row!;
    try {
      const res = await freezePackages(this.hass!, {
        thaw: this.thaw,
        product_id: r.product_id,
        packages: Number(d.packages),
        batch_id: r.batch_id,
        location_id: r.location_id,
        ...(d.to ? { to_location_id: Number(d.to) } : {}),
      });
      this.renderRoot.querySelector("dialog")?.close();
      this.dispatchEvent(
        new CustomEvent<{ result: Opened; thaw: boolean }>("home-inventory-frozen", {
          detail: { result: res, thaw: this.thaw },
          bubbles: true,
          composed: true,
        }),
      );
    } catch (err) {
      this.error = await errorMessage(this.hass!, err);
    }
  }

  render() {
    const d = this.d;
    if (!d) return html`<dialog></dialog>`;
    const err = this.errors(d);
    const targets = this.locations.filter((l) => !!l.freezer !== this.thaw);
    const name = this.row!.name;
    return editDialog({
      title: t(this.thaw ? "frozen.thaw_title" : "frozen.freeze_title", { name }),
      body: html`<label>
          <span class="lbl">${t("book.packages")}</span>
          <input
            data-testid="frozen-packages"
            type="number"
            min="1"
            max=${this.row!.packages}
            step="1"
            inputmode="numeric"
            aria-invalid=${!!err}
            .value=${d.packages}
            @input=${(e: Event) =>
              (this.d = { ...d, packages: (e.target as HTMLInputElement).value })}
          />
          ${fieldMsg(err, "frozen-packages")}
        </label>
        <label>
          <span class="lbl">${t("frozen.to")}</span>
          <select
            data-testid="frozen-to"
            @change=${(e: Event) => (this.d = { ...d, to: (e.target as HTMLSelectElement).value })}
          >
            <option value="" .selected=${d.to === ""}>
              ${t(this.thaw ? "frozen.to_default_thaw" : "frozen.to_default_freeze")}
            </option>
            ${targets.map(
              (l) =>
                html`<option value=${l.id} .selected=${d.to === String(l.id)}>${l.name}</option>`,
            )}
          </select>
        </label>`,
      error: this.error,
      invalid: !!err,
      submit: {
        label: t(this.thaw ? "frozen.thaw" : "frozen.freeze"),
        testid: "frozen-submit",
      },
      dirty: () => d.packages !== "1" || d.to !== "",
      onSubmit: (e) => this.save(e),
      onClosed: () => (this.d = undefined),
    });
  }

  static styles = formStyles;
}

customElements.define("home-inventory-frozen-dialog", HomeInventoryFrozenDialog);
