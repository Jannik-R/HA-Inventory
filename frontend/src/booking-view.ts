import { LitElement, css, html, nothing, type PropertyValues } from "lit";
import { mdiBarcodeScan } from "@mdi/js";
import { t } from "./i18n";
import { icon } from "./ui";
import { formStyles } from "./styles";
import {
  errorMessage,
  getMasterData,
  getStock,
  lookup,
  search,
  type Hass,
  type MasterData,
  type Product,
  type SearchHit,
  type StockRow,
} from "./api";
import type { PantryScanner } from "./scanner";
import "./scanner";
import "./booking-form";
import type { PantryBookingForm } from "./booking-form";

type Mode = "in" | "out";
const EAN = /^\d{8,14}$/;

/** Book in / book out: one input for scanner, camera and name search, then a short form. */
export class PantryBooking extends LitElement {
  static properties = {
    hass: { attribute: false },
    mode: { attribute: false },
    query: { state: true },
    hits: { state: true },
    online: { state: true },
    product: { state: true },
    stock: { state: true },
    message: { state: true },
    error: { state: true },
    busy: { state: true },
  };

  declare hass?: Hass;
  declare mode: Mode;
  declare query: string;
  declare hits?: (SearchHit | Product)[];
  declare online: boolean;
  declare product?: Product;
  declare stock?: StockRow[];
  declare message: string;
  declare error: string;
  declare busy: boolean;

  private md?: MasterData;

  constructor() {
    super();
    this.mode = "in";
    this.message = "";
    this.online = false;
    this.busy = false;
    this.reset();
  }

  private reset() {
    this.query = "";
    this.hits = undefined;
    this.online = false;
    this.product = undefined;
    this.stock = undefined;
    this.error = "";
  }

  willUpdate(changed: PropertyValues) {
    if (changed.has("mode") && changed.get("mode")) {
      this.reset();
      this.message = "";
    }
    if (changed.has("hass") && this.hass && !this.md) {
      getMasterData(this.hass).then(
        (md) => ((this.md = md), this.requestUpdate()),
        (err) => this.fail(err),
      );
    }
  }

  firstUpdated() {
    this.focusInput();
  }

  private focusInput() {
    this.updateComplete.then(() =>
      this.renderRoot.querySelector<HTMLInputElement>("#code")?.focus(),
    );
  }

  private async fail(err: unknown) {
    this.error = this.hass ? await errorMessage(this.hass, err) : String(err);
  }

  /** Run a backend call with busy state and translated errors. */
  private run = async <T>(fn: () => Promise<T>): Promise<T | undefined> => {
    this.busy = true;
    this.error = "";
    try {
      return await fn();
    } catch (err) {
      await this.fail(err);
      return undefined;
    } finally {
      this.busy = false;
    }
  };

  private async find(e?: Event) {
    e?.preventDefault();
    const q = this.query.trim();
    if (!q || !this.hass) return;
    const hass = this.hass;
    this.message = "";
    this.product = this.stock = this.hits = undefined;
    this.online = false;
    if (EAN.test(q)) {
      const res = await this.run(() => lookup(hass, q));
      if (!res) return;
      if (res.product) return this.choose(res.product);
      if (this.mode === "out") return void (this.error = t("book.unknown"));
      return this.choose(this.blank({ ean: q }));
    }
    const hits = await this.run(() => search(hass, q));
    if (!hits) return;
    this.hits = hits;
    if (this.mode === "out" && hits.length === 1) this.choose(hits[0] as Product);
  }

  private async searchOnline() {
    const hass = this.hass!;
    const hits = await this.run(() => search(hass, this.query.trim(), true));
    if (hits) ((this.hits = hits), (this.online = true));
  }

  private blank(p: Partial<Product>): Product {
    return {
      ean: null,
      name: "",
      brand: null,
      category_id: null,
      content_amount: null,
      content_unit_id: null,
      ...p,
    };
  }

  /** Online hits are only a name + EAN: load the full draft (category suggestion) first. */
  private async pick(hit: SearchHit | Product) {
    if (hit.id || !hit.ean) return this.choose(hit as Product);
    const res = await this.run(() => lookup(this.hass!, hit.ean!));
    if (res?.product) this.choose(res.product);
  }

  private async choose(p: Product) {
    this.hits = undefined;
    if (this.mode === "out" && !p.id) return void (this.error = t("book.unknown"));
    this.product = p;
    if (this.mode === "out") this.stock = await this.run(() => getStock(this.hass!, p.id!));
    await this.updateComplete;
    const form = this.renderRoot.querySelector<PantryBookingForm>("pantry-booking-form");
    await form?.updateComplete;
    form?.focusFirst();
  }

  private openScanner() {
    this.renderRoot.querySelector<PantryScanner>("pantry-scanner")?.open();
  }

  private scanned(e: CustomEvent<string>) {
    this.query = e.detail;
    this.find();
  }

  render() {
    return html`
      <form class="scan" @submit=${this.find}>
        <input
          id="code"
          data-testid="code-input"
          type="search"
          enterkeyhint="search"
          autocomplete="off"
          aria-label=${t("book.input")}
          placeholder=${t("book.input")}
          .value=${this.query}
          @input=${(e: Event) => (this.query = (e.target as HTMLInputElement).value)}
        />
        <button type="button" data-testid="camera" @click=${this.openScanner}>
          ${icon(mdiBarcodeScan)}<span>${t("book.camera")}</span>
        </button>
      </form>
      <pantry-scanner @scan=${this.scanned}></pantry-scanner>
      ${this.message ? html`<p class="done" role="status" data-testid="message">${this.message}</p>` : nothing}
      ${this.error ? html`<p class="error" role="alert" data-testid="error">${this.error}</p>` : nothing}
      ${this.hits ? this.renderHits() : nothing} ${this.renderForm()}
    `;
  }

  private renderHits() {
    const hits = this.hits!;
    return html`
      ${hits.length ? nothing : html`<p class="empty">${t("book.no_hits")}</p>`}
      <ul>
        ${hits.map(
          (h) =>
            html`<li>
              <button class="row" data-testid="hit" @click=${() => this.pick(h)}>
                <span>${h.name}</span>
                <span class="detail">${[h.brand, h.ean].filter(Boolean).join(" · ")}</span>
              </button>
            </li>`,
        )}
      </ul>
      ${
        this.mode === "in"
          ? html`<div class="actions after">
              ${
                this.online
                  ? nothing
                  : html`<button
                      data-testid="search-online"
                      ?disabled=${this.busy}
                      @click=${this.searchOnline}
                    >
                      ${t("book.search_online")}
                    </button>`
              }
              <button
                data-testid="new-product"
                @click=${() => this.choose(this.blank({ name: this.query.trim() }))}
              >
                ${t("book.new_product")}
              </button>
            </div>`
          : nothing
      }
    `;
  }

  private renderForm() {
    if (!this.product) return nothing;
    return html`<pantry-booking-form
      .hass=${this.hass}
      .mode=${this.mode}
      .product=${this.product}
      .md=${this.md}
      .stock=${this.stock}
      .busy=${this.busy}
      .run=${this.run}
      @booked=${this.booked}
      @cancel=${() => (this.reset(), this.focusInput())}
    ></pantry-booking-form>`;
  }

  private booked(e: CustomEvent<string>) {
    this.reset();
    this.message = e.detail;
    this.focusInput();
  }

  static styles = [
    formStyles,
    css`
      .scan {
        display: flex;
        gap: 8px;
        margin-bottom: 12px;
      }
      .scan input {
        flex: 1;
      }
      .scan button {
        flex: none;
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .done {
        margin: 0 0 12px;
      }
      .after {
        margin-top: 12px;
      }
    `,
  ];
}

customElements.define("pantry-booking", PantryBooking);
