import { LitElement, css, html, nothing } from "lit";
import { t } from "./i18n";
import { editDialog, fieldMsg, icon } from "./ui";
import type { Errors } from "./product-fields";
import { formStyles } from "./styles";
import { errorMessage, getLabelConfig, type Hass, type MasterData } from "./api";
import { bookReceipt, readReceipt, type ReceiptBookItem } from "./api-purchase";
import { receiptRow, rowErrors, rowGuess, rowStyles, type Row } from "./receipt-row";
import { ocr } from "./ocr";
import { photoCanvas } from "./photo";
import { mdiCameraOutline } from "@mdi/js";
import "./camera-dialog";
import type { HomeInventoryCamera } from "./camera-dialog";

const MAX_PX = 3000; // a receipt is long and narrow: keep enough pixels per text line

/** Photo of a shopping receipt -> OCR in the browser -> the AI reads the text -> the user checks
 *  every line (product, packages, date) -> all are booked in. `open()`; fires `booked` (detail: packages). */
export class HomeInventoryReceiptImport extends LitElement {
  static properties = {
    hass: { attribute: false },
    md: { attribute: false },
    active: { state: true },
    image: { state: true },
    rows: { state: true },
    store: { state: true },
    status: { state: true },
    error: { state: true },
  };

  declare hass?: Hass;
  declare md?: MasterData;
  declare active: boolean;
  /** The receipt picture (scanned black and white, or the uncut photo) as data URL. */
  declare image?: string;
  /** undefined until the AI has read the receipt (step 1: pick the photo). */
  declare rows?: Row[];
  declare store: string;
  /** Busy text ("Text wird erkannt … 40 %"), "" when idle. */
  declare status: string;
  declare error: string;
  private prefill = false;

  constructor() {
    super();
    this.active = false;
    this.store = "";
    this.status = "";
    this.error = "";
  }

  async open() {
    this.image = this.rows = undefined;
    this.store = this.status = this.error = "";
    this.active = true;
    getLabelConfig(this.hass!).then(
      (c) => (this.prefill = c.prefill_expiry),
      () => undefined,
    );
    await this.updateComplete;
    this.renderRoot.querySelector("dialog")!.showModal();
    this.renderRoot.querySelector<HTMLElement>("dialog input")?.focus();
  }

  private guess(r: Row) {
    return rowGuess(r, this.md);
  }

  private set(i: number, patch: Partial<Row>) {
    const rows = [...this.rows!];
    const old = rows[i];
    const next = { ...old, ...patch };
    // a date still at its guess follows another product (only when the option fills it in)
    if (this.prefill && !("expires_on" in patch) && old.expires_on === this.guess(old))
      next.expires_on = this.guess(next);
    rows[i] = next;
    this.rows = rows;
  }

  private errors(): Errors {
    const e: Errors = {};
    if (!this.rows && !this.image) e.photo = t("valid.photo");
    return e;
  }

  /** Review rows show their own messages (rowErrors); a running step blocks too. */
  private invalid = () =>
    !!this.status ||
    Object.keys(this.errors()).length > 0 ||
    !!this.rows?.some((r) => Object.keys(rowErrors(r)).length);

  private async read() {
    const hass = this.hass!;
    this.status = t("receipt.ocr", { percent: "0" });
    try {
      const text = await ocr(this.image!, (share) => {
        this.status = t("receipt.ocr", { percent: String(Math.round(share * 100)) });
      });
      if (!text.trim()) throw new Error(t("receipt.no_text"));
      this.status = t("receipt.ai");
      const res = await readReceipt(hass, text.slice(0, 8000));
      if (!res.items.length) throw new Error(t("receipt.no_items"));
      this.store = res.store;
      this.rows = res.items.map((item) => {
        const r: Row = {
          item,
          choice: item.product_id ?? (item.candidates.length ? null : "new"),
          name: item.name,
          category_id: item.category_id,
          packages: item.packages,
          expires_on: "",
          dateBad: false,
        };
        return { ...r, expires_on: this.prefill ? this.guess(r) : "" };
      });
    } catch (err) {
      this.error = err instanceof Error ? err.message : await errorMessage(hass, err);
    }
    this.status = "";
  }

  private async book() {
    const items: ReceiptBookItem[] = this.rows!.filter((r) => r.choice !== "skip").map((r) => ({
      text: r.item.text,
      packages: r.packages,
      expires_on: r.expires_on || null,
      ...(r.choice === "new"
        ? { product: { name: r.name.trim(), category_id: r.category_id! } }
        : { product_id: r.choice as number }),
    }));
    if (!items.length) return this.renderRoot.querySelector("dialog")?.close();
    this.status = t("receipt.booking");
    try {
      const res = await bookReceipt(this.hass!, this.store.trim(), items);
      this.renderRoot.querySelector("dialog")?.close();
      this.dispatchEvent(new CustomEvent("booked", { detail: res.booked }));
    } catch (err) {
      this.error = await errorMessage(this.hass!, err);
    }
    this.status = "";
  }

  private submit(e: Event) {
    e.preventDefault();
    this.error = "";
    if (this.invalid()) return;
    return this.rows ? this.book() : this.read();
  }

  private camera() {
    return this.renderRoot.querySelector<HomeInventoryCamera>("home-inventory-camera")!;
  }

  private async scanReceipt() {
    const url = await this.camera().take(true);
    if (url) this.image = url;
  }

  /** A picked photo goes through the same outline step as a camera picture. */
  private async pickFile(e: Event) {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = ""; // the same file can be picked again
    if (!file) return;
    this.error = "";
    let canvas: HTMLCanvasElement;
    try {
      canvas = await photoCanvas(file, MAX_PX);
    } catch {
      return void (this.error = t("receipt.photo_invalid"));
    }
    const url = await this.camera().edit(canvas);
    if (url) this.image = url;
  }

  private pickStep() {
    const err = this.errors();
    return html`<button
        type="button"
        class="scan"
        data-testid="receipt-scan"
        ?disabled=${!!this.status}
        @click=${() => this.scanReceipt()}
      >
        ${icon(mdiCameraOutline)} ${t("receipt.scan")}
      </button>
      <label>
        <span class="lbl">${t("receipt.photo")}</span>
        <input
          type="file"
          accept="image/*"
          data-testid="receipt-photo"
          ?disabled=${!!this.status}
          aria-invalid=${!!err.photo}
          @change=${(e: Event) => this.pickFile(e)}
        />
        ${fieldMsg(err.photo, "receipt-photo")}
      </label>
      ${
        this.image
          ? html`<img
              class="preview"
              data-testid="receipt-preview"
              src=${this.image}
              alt=${t("receipt.preview")}
            />`
          : nothing
      }
      <p class="detail">${t("receipt.photo_hint")}</p>`;
  }

  private reviewStep(rows: Row[]) {
    return html`<label>
        <span class="lbl">${t("receipt.store")}</span>
        <input
          data-testid="receipt-store"
          maxlength="100"
          .value=${this.store}
          @input=${(e: Event) => (this.store = (e.target as HTMLInputElement).value)}
        />
        <span class="detail">${t("receipt.store_hint")}</span>
      </label>
      <ul class="rows">
        ${rows.map((r, i) => receiptRow({ r, i, md: this.md, hass: this.hass, set: (p) => this.set(i, p) }))}
      </ul>`;
  }

  render() {
    if (!this.active) return html`<dialog></dialog>`;
    const busy = this.status
      ? html`<div class="busy" role="status" data-testid="receipt-busy">
          <progress aria-label=${this.status}></progress><span>${this.status}</span>
        </div>`
      : nothing;
    const count = this.rows?.filter((r) => r.choice !== "skip").length ?? 0;
    // the camera dialog sits beside this one, so its clicks are no backdrop clicks here
    return html`${editDialog({
        title: t("receipt.title"),
        body: html`${this.rows ? this.reviewStep(this.rows) : this.pickStep()} ${busy}`,
        error: this.error,
        invalid: this.invalid(),
        submit: this.rows
          ? { label: t("receipt.book", { count: String(count) }), testid: "receipt-book" }
          : { label: t("receipt.read"), testid: "receipt-read" },
        dirty: () => !!(this.image || this.rows),
        onSubmit: (e) => this.submit(e),
        onClosed: () => (this.active = false),
      })}<home-inventory-camera></home-inventory-camera>`;
  }

  static styles = [
    formStyles,
    rowStyles,
    css`
      .scan {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        margin-bottom: 12px;
      }
      .preview {
        display: block;
        max-width: 100%;
        max-height: 30vh;
        margin: 12px 0 0;
        border: 1px solid var(--divider-color);
      }
      .busy {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-top: 12px;
        color: var(--secondary-text-color);
      }
    `,
  ];
}

customElements.define("home-inventory-receipt-import", HomeInventoryReceiptImport);
