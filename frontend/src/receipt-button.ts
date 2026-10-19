import { LitElement, html, nothing } from "lit";
import { t } from "./i18n";
import { errorMessage, getLabelConfig, type Hass } from "./api";

/** One question per page load: is a receipt printer set up? (options change → reload) */
let hasReceipt: Promise<boolean> | undefined;

/** "Drucken" on the receipt printer (recipe, meal plan): runs `print`, then shows `done` or the
 * error next to it. Renders nothing without a receipt printer. Light DOM: the host's styles apply. */
export class HomeInventoryReceiptButton extends LitElement {
  static properties = {
    hass: { attribute: false },
    print: { attribute: false },
    done: { attribute: false },
    testid: { attribute: false },
    available: { state: true },
    note: { state: true },
    busy: { state: true },
  };
  declare hass?: Hass;
  declare print: () => Promise<unknown>;
  declare done: string;
  declare testid: string;
  declare available: boolean;
  declare note: string;
  declare busy: boolean;

  constructor() {
    super();
    this.available = false;
    this.note = "";
    this.busy = false;
  }

  connectedCallback() {
    super.connectedCallback();
    hasReceipt ??= getLabelConfig(this.hass!).then(
      (c) => c.receipt,
      () => false,
    );
    void hasReceipt.then((v) => (this.available = v));
  }

  private async run() {
    this.busy = true;
    try {
      await this.print();
      this.note = this.done;
    } catch (err) {
      this.note = await errorMessage(this.hass!, err);
    } finally {
      this.busy = false;
    }
  }

  createRenderRoot() {
    return this;
  }

  render() {
    if (!this.available) return nothing;
    return html`<button
        type="button"
        data-testid=${this.testid}
        ?disabled=${this.busy}
        @click=${() => this.run()}
      >
        ${t("common.print")}
      </button>
      ${
        this.note
          ? html`<span class="detail" role="status" data-testid=${`${this.testid}ed`}
              >${this.note}</span
            >`
          : nothing
      }`;
  }
}

customElements.define("home-inventory-receipt-button", HomeInventoryReceiptButton);
