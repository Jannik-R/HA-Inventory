import { LitElement, css, html, nothing, type PropertyValues } from "lit";
import { t } from "./i18n";
import { formStyles } from "./styles";
import { backdropClick, escGuard, icon } from "./ui";
import { mdiMagnify, mdiMinus, mdiPlus } from "@mdi/js";
import {
  errorMessage,
  getMasterData,
  bookOutLabel,
  putBack,
  type Taken,
  getStock,
  lookup,
  search,
  type Hass,
  type MasterData,
  type Product,
  type SearchHit,
  type StockRow,
} from "./api";
import "./booking-scan";
import type { PantryBookingScan } from "./booking-scan";
import { blankProduct } from "./product-fields";
import "./booking-form";
import { doneLine, doneStyles } from "./booking-done";
import { hitList } from "./booking-hits";
import type { Booked, PantryBookingForm } from "./booking-form";

/** "search" only filters the stock list; Enter (scanners send one) books nothing. */
export type Mode = "search" | "in" | "out";
const MODES: [Mode, string][] = [
  ["search", mdiMagnify],
  ["in", mdiPlus],
  ["out", mdiMinus],
];
const EAN = /^\d{8,14}$/;
const LABEL = /^PTRY:/i;

/** The stock view's input (scanner, camera, name): filters the list (`query` event) and, when booking,
 *  opens a dialog with the hits and the booking form. Fires `booked` after each booking. */
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
    undo: { state: true },
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
  /** What the last book-out took; shown with the message as undo. */
  declare undo?: Taken[];
  declare error: string;
  declare busy: boolean;

  private md?: MasterData;
  /** Latest request; slower older answers (and answers after a reset) are dropped. */
  private seq = 0;

  constructor() {
    super();
    this.mode = "search";
    this.message = "";
    this.online = false;
    this.busy = false;
    this.reset();
  }

  private reset() {
    this.seq++;
    this.query = "";
    this.hits = undefined;
    this.online = false;
    this.product = undefined;
    this.stock = undefined;
    this.error = "";
  }

  private started = false;

  willUpdate(changed: PropertyValues) {
    if (changed.has("mode") && changed.get("mode")) {
      this.reset();
      this.message = "";
      this.undo = undefined;
    }
    if (changed.has("hass") && this.hass && !this.started) {
      this.started = true; // once: `hass` changes on every state event
      getMasterData(this.hass).then(
        (md) => ((this.md = md), this.requestUpdate()),
        (err) => this.fail(err),
      );
    }
  }

  firstUpdated() {
    this.focusInput();
  }

  updated(changed: PropertyValues) {
    if (changed.has("query"))
      this.dispatchEvent(new CustomEvent<string>("query", { detail: this.query }));
    const dlg = this.renderRoot.querySelector("dialog");
    const want = !!(this.hits || this.product);
    if (want && !dlg?.open) dlg?.showModal();
    else if (!want && dlg?.open) dlg.close();
  }

  /** The switch navigates (route = mode, /stock /in /out); the input keeps the focus for the scanner. */
  private setMode(mode: Mode) {
    this.dispatchEvent(
      new CustomEvent("pantry-navigate", {
        detail: mode === "search" ? "stock" : mode,
        bubbles: true,
        composed: true,
      }),
    );
    this.focusInput();
  }

  /** Closed by Esc, a click beside it or "Abbrechen": nothing booked. */
  private closed() {
    if (this.hits || this.product) this.reset();
    this.focusInput();
  }

  /** Unsaved input in the booking form (asks before Esc / click beside closes). */
  private dirty = () =>
    !!this.renderRoot.querySelector<PantryBookingForm>("pantry-booking-form")?.dirty();

  focusInput() {
    this.renderRoot.querySelector<PantryBookingScan>("pantry-booking-scan")?.focusInput();
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

  private async find() {
    const q = this.query.trim();
    if (!q || !this.hass || this.mode === "search") return;
    const hass = this.hass;
    const id = ++this.seq;
    this.message = "";
    this.undo = undefined;
    this.product = this.stock = this.hits = undefined;
    this.online = false;
    if (LABEL.test(q)) {
      // A label names its batch: it always books out.
      return this.scanLabel(q.replace(LABEL, ""));
    }
    if (EAN.test(q)) {
      const res = await this.run(() => lookup(hass, q));
      if (!res || id !== this.seq) return;
      if (res.product) return this.choose(res.product);
      if (this.mode === "out") return void (this.error = t("book.unknown"));
      return this.choose(blankProduct({ ean: q }));
    }
    const hits = await this.run(() => search(hass, q));
    if (!hits || id !== this.seq) return;
    this.hits = hits;
    if (this.mode === "out" && hits.length === 1) this.choose(hits[0] as Product);
  }

  /** A printed label books out one package of its batch (Auslagern only). */
  private async scanLabel(code: string) {
    this.reset();
    const id = this.seq;
    const res = await this.run(() => bookOutLabel(this.hass!, code));
    if (id !== this.seq) return;
    if (!res) return this.focusInput();
    this.message = t("book.done_label", { name: res.name, where: res.location });
    this.undo = res.taken;
    this.dispatchEvent(new CustomEvent("booked"));
    this.focusInput();
  }

  private async searchOnline() {
    const hass = this.hass!;
    const id = ++this.seq;
    const hits = await this.run(() => search(hass, this.query.trim(), true));
    if (hits && id === this.seq) ((this.hits = hits), (this.online = true));
  }

  /** Online hits are only a name + EAN: load the full draft (category suggestion) first. */
  private async pick(hit: SearchHit | Product) {
    if (hit.id || !hit.ean) return this.choose(hit as Product);
    const id = ++this.seq;
    const res = await this.run(() => lookup(this.hass!, hit.ean!));
    if (res?.product && id === this.seq) this.choose(res.product);
  }

  private async choose(p: Product) {
    const id = ++this.seq;
    this.hits = undefined;
    if (this.mode === "out" && !p.id) return void (this.error = t("book.unknown"));
    this.product = p;
    if (this.mode === "out") {
      const stock = await this.run(() => getStock(this.hass!, p.id!));
      if (id !== this.seq) return;
      this.stock = stock;
    }
    await this.updateComplete;
    const form = this.renderRoot.querySelector<PantryBookingForm>("pantry-booking-form");
    await form?.updateComplete;
    form?.focusFirst();
  }

  render() {
    const open = !!(this.hits || this.product);
    const error = this.error
      ? html`<p class="error" role="alert" data-testid="error">${this.error}</p>`
      : nothing;
    return html`
      <pantry-booking-scan
        .value=${this.query}
        @query=${(e: CustomEvent<string>) => (this.query = e.detail)}
        @find=${() => this.find()}
      >
        <div slot="before" class="modes" role="group" aria-label=${t("stock.mode")}>
          ${MODES.map(
            ([m, path]) =>
              html`<button
                type="button"
                data-testid=${`mode-${m}`}
                aria-pressed=${m === this.mode}
                aria-label=${t(`stock.mode_${m}`)}
                title=${t(`stock.mode_${m}`)}
                @click=${() => this.setMode(m)}
              >
                ${icon(path)}
              </button>`,
          )}
        </div>
      </pantry-booking-scan>
      ${doneLine(this.message, this.undo && (() => this.putBack()))} ${open ? nothing : error}
      <dialog
        data-testid="booking-dialog"
        @close=${this.closed}
        @click=${backdropClick(this.dirty)}
        @keydown=${escGuard(this.dirty)}
        @cancel=${escGuard(this.dirty)}
      >
        ${
          this.hits
            ? html`<h2>${t(`book.pick_${this.mode}`)}</h2>
                ${hitList(this.hits, {
                  more: this.mode === "in",
                  online: this.online,
                  busy: this.busy,
                  pick: (h) => this.pick(h),
                  searchOnline: () => this.searchOnline(),
                  create: () => this.choose(blankProduct({ name: this.query.trim() })),
                  cancel: () => this.closed(),
                })}`
            : nothing
        }
        ${this.renderForm()} ${open ? error : nothing}
      </dialog>
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
      @master=${(e: CustomEvent<MasterData>) => ((this.md = e.detail), this.requestUpdate())}
      @cancel=${() => this.closed()}
    ></pantry-booking-form>`;
  }

  /** Put back what the last book-out took. */
  private async putBack() {
    const taken = this.undo!;
    this.undo = undefined; // a second click cannot undo twice
    if ((await this.run(() => putBack(this.hass!, taken))) === undefined) {
      this.undo = taken; // failed: still undoable
      return;
    }
    this.message = t("book.undone");
    this.dispatchEvent(new CustomEvent("booked"));
    this.focusInput();
  }

  private booked(e: CustomEvent<Booked>) {
    const error = this.error; // a failed label print stays visible
    this.reset();
    this.error = error;
    this.message = e.detail.message;
    this.undo = e.detail.taken;
    this.dispatchEvent(new CustomEvent("booked"));
    this.focusInput();
  }

  static styles = [
    formStyles,
    doneStyles,
    css`
      .after {
        margin-top: 12px;
      }
      /* Search / book in / book out: a segmented switch (one framed group, the chosen one filled). */
      .modes {
        flex: none;
        display: flex;
        border: 1px solid var(--divider-color);
        border-radius: 4px;
        overflow: hidden;
      }
      .modes button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        padding: 0;
        border: 0;
        border-radius: 0;
        color: var(--secondary-text-color);
      }
      .modes button + button {
        border-left: 1px solid var(--divider-color);
      }
      .modes button[aria-pressed="true"] {
        background: var(--primary-color);
        color: var(--text-primary-color, #fff);
      }
      .modes button:focus-visible {
        outline: 2px solid currentColor;
        outline-offset: -4px;
      }
    `,
  ];
}

customElements.define("pantry-booking", PantryBooking);
