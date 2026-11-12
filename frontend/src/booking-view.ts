import { LitElement, css, html, nothing, type PropertyValues } from "lit";
import { t } from "./i18n";
import { formStyles } from "./styles";
import { backdropClick, escGuard } from "./ui";
import { receiptEntry } from "./booking-receipt";
import {
  errorMessage,
  getMasterData,
  type Taken,
  getStock,
  lookup,
  search,
  type Hass,
  type MasterData,
  type Product,
  type SearchHit,
  type StockRow,
  type Location,
} from "./api";
import type { FrozenDone } from "./frozen-action";
import { locationLine } from "./location-scan";
import "./booking-scan";
import type { HomeInventoryBookingScan } from "./booking-scan";
import { blankProduct } from "./product-fields";
import "./booking-form";
import { doneStyles } from "./booking-done";
import { hitList } from "./booking-hits";
import type { Booked, HomeInventoryBookingForm } from "./booking-form";
import { modeSwitch, modesStyles, type Mode } from "./booking-modes";
import { openPackage, type Opened, freezeScan } from "./api-open";
import { afterLine, openWith, frozenWith, scanCode } from "./booking-after";

export type { Mode };

const EAN = /^\d{8,14}$/;

/** The stock view's input (scanner, camera, name): filters the list (`query` event) and, when booking,
 *  opens a dialog with the hits and the booking form. Fires `booked` after each booking. */
export class HomeInventoryBooking extends LitElement {
  static properties = {
    at: { state: true },
    hass: { attribute: false },
    mode: { attribute: false },
    query: { state: true },
    hits: { state: true },
    online: { state: true },
    product: { state: true },
    stock: { state: true },
    message: { state: true },
    undo: { state: true },
    opened: { state: true },
    frozen: { state: true },
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
  /** The last package opened ("open" mode); shown with the message as undo and label offer. */
  declare opened?: Opened;
  declare frozen?: FrozenDone;
  declare error: string;
  declare busy: boolean;
  /** A scanned location label: the location of the following bookings (until another one). */
  declare at?: Location;

  private md?: MasterData;
  /** Latest request; slower older answers (and answers after a reset) are dropped. */
  seq = 0;

  constructor() {
    super();
    this.mode = "search";
    this.message = "";
    this.online = false;
    this.busy = false;
    this.reset();
  }

  reset() {
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
      this.undo = this.opened = this.frozen = undefined;
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
      new CustomEvent("home-inventory-navigate", {
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
    !!this.renderRoot
      .querySelector<HomeInventoryBookingForm>("home-inventory-booking-form")
      ?.dirty();

  focusInput() {
    this.renderRoot
      .querySelector<HomeInventoryBookingScan>("home-inventory-booking-scan")
      ?.focusInput();
  }

  private async fail(err: unknown) {
    this.error = this.hass ? await errorMessage(this.hass, err) : String(err);
  }

  /** Run a backend call with busy state and translated errors. */
  run = async <T>(fn: () => Promise<T>): Promise<T | undefined> => {
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
    this.undo = this.opened = this.frozen = undefined;
    this.product = this.stock = this.hits = undefined;
    this.online = false;
    if (await scanCode(this, hass, q)) return;
    if (EAN.test(q)) {
      const res = await this.run(() => lookup(hass, q));
      if (!res || id !== this.seq) return;
      if (res.product) return this.choose(res.product);
      if (this.mode !== "in") return void (this.error = t("book.unknown"));
      return this.choose(blankProduct({ ean: q }));
    }
    const hits = await this.run(() => search(hass, q));
    if (!hits || id !== this.seq) return;
    this.hits = hits;
    if (this.mode !== "in" && hits.length === 1) this.choose(hits[0] as Product);
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
    if (this.mode !== "in" && !p.id) return void (this.error = t("book.unknown"));
    if (this.mode === "freeze")
      return frozenWith(this, () => freezeScan(this.hass!, undefined, this.at?.id, p.id));
    if (this.mode === "open")
      return openWith(this, () =>
        openPackage(this.hass!, { product_id: p.id!, location_id: this.at?.id }),
      );
    this.product = p;
    if (this.mode === "out") {
      const stock = await this.run(() => getStock(this.hass!, p.id!));
      if (id !== this.seq) return;
      this.stock = this.at ? stock?.filter((r) => r.location_id === this.at!.id) : stock;
    }
    await this.updateComplete;
    const form = this.renderRoot.querySelector<HomeInventoryBookingForm>(
      "home-inventory-booking-form",
    );
    await form?.updateComplete;
    form?.focusFirst();
  }

  render() {
    const open = !!(this.hits || this.product);
    const error = this.error
      ? html`<p class="error" role="alert" data-testid="error">${this.error}</p>`
      : nothing;
    return html`
      <home-inventory-booking-scan
        .value=${this.query}
        @query=${(e: CustomEvent<string>) => (this.query = e.detail)}
        @find=${() => this.find()}
      >
        ${modeSwitch(this.mode, (m) => this.setMode(m))}
      </home-inventory-booking-scan>
      ${locationLine(this.at?.name, () => (this.at = undefined))} ${afterLine(this)}
      ${open ? nothing : error}
      ${receiptEntry(this.hass, this.md, this.mode === "in", this.receiptBooked)}
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
    return html`<home-inventory-booking-form
      .hass=${this.hass}
      .mode=${this.mode}
      .product=${this.product}
      .md=${this.md}
      .stock=${this.stock}
      .at=${this.at?.id}
      .busy=${this.busy}
      .run=${this.run}
      @booked=${this.booked}
      @master=${(e: CustomEvent<MasterData>) => ((this.md = e.detail), this.requestUpdate())}
      @cancel=${() => this.closed()}
    ></home-inventory-booking-form>`;
  }

  private receiptBooked = (e: CustomEvent<number>) => {
    this.reset();
    this.message = t("receipt.done", { count: String(e.detail) });
    this.undo = undefined;
    this.dispatchEvent(new CustomEvent("booked"));
  };

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
    modesStyles,
    css`
      .after {
        margin-top: 12px;
      }
      .receipt {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        margin-top: 8px;
      }
    `,
  ];
}

customElements.define("home-inventory-booking", HomeInventoryBooking);
