import { LitElement, css, html, nothing } from "lit";
import { t } from "./i18n";
import { dateInvalid, editDialog, fieldMsg, todayIso } from "./ui";
import { formStyles } from "./styles";
import { errorMessage, getLabelConfig, type Hass, type MasterData } from "./api";
import { bookReceipt, readReceipt, type ReceiptBookItem, type ReceiptItem } from "./api-purchase";
import { categoryDefault } from "./inherit";
import { plusDays } from "./plan-dates";
import { ocr } from "./ocr";
import "./category-picker";

/** A product id from the candidates, a new product, not booked, or not chosen yet. */
type Choice = number | "new" | "skip" | null;
interface Row {
  item: ReceiptItem;
  choice: Choice;
  name: string;
  category_id: number | null;
  packages: number;
  expires_on: string;
  dateBad: boolean;
}
type Errors = Partial<Record<"choice" | "name" | "category" | "packages" | "expires", string>>;

/** Photo of a shopping receipt -> OCR in the browser -> the AI reads the text -> the user checks
 *  every line (product, packages, date) -> all are booked in. `open()`; fires `booked` (detail: packages). */
export class PantryReceiptImport extends LitElement {
  static properties = {
    hass: { attribute: false },
    md: { attribute: false },
    active: { state: true },
    file: { state: true },
    rows: { state: true },
    store: { state: true },
    status: { state: true },
    error: { state: true },
  };

  declare hass?: Hass;
  declare md?: MasterData;
  declare active: boolean;
  declare file?: File;
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
    this.file = this.rows = undefined;
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

  /** Shelf life of the chosen product (or the new product's category) as a date, "" without one. */
  private guess(r: Row): string {
    const days =
      typeof r.choice === "number"
        ? r.item.candidates.find((c) => c.id === r.choice)?.shelf_days
        : r.choice === "new"
          ? categoryDefault(this.md, r.category_id, "shelf_days")?.value
          : undefined;
    return days ? plusDays(todayIso(), Number(days)) : "";
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

  private errors(r: Row): Errors {
    const e: Errors = {};
    if (r.choice === null) e.choice = t("receipt.choose");
    if (r.choice === "skip") return e;
    if (r.choice === "new" && !r.name.trim()) e.name = t("valid.required");
    if (r.choice === "new" && r.category_id == null) e.category = t("valid.required");
    if (!(Number.isInteger(r.packages) && r.packages >= 1 && r.packages <= 9999))
      e.packages = t("valid.packages");
    if (dateInvalid(r.dateBad, r.expires_on)) e.expires = t("valid.date");
    return e;
  }

  private invalid() {
    if (!this.rows) return !this.file || !!this.status;
    return !!this.status || this.rows.some((r) => Object.keys(this.errors(r)).length);
  }

  private async read() {
    const hass = this.hass!;
    this.status = t("receipt.ocr", { percent: "0" });
    try {
      const text = await ocr(this.file!, (share) => {
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

  private pickStep() {
    return html`<label>
      <span class="lbl">${t("receipt.photo")}</span>
      <input
        type="file"
        accept="image/*"
        data-testid="receipt-photo"
        ?disabled=${!!this.status}
        @change=${(e: Event) => (this.file = (e.target as HTMLInputElement).files?.[0])}
      />
      <span class="detail">${t("receipt.photo_hint")}</span>
    </label>`;
  }

  private row(r: Row, i: number) {
    const err = this.errors(r);
    const id = `r${i}`;
    const value = r.choice === null ? "" : String(r.choice);
    const guessHint = !r.expires_on && this.guess(r) ? t("receipt.guess_hint") : "";
    return html`<li data-testid="receipt-row">
      <div class="text">${r.item.text}</div>
      <label>
        <span class="lbl">${t("receipt.product")}</span>
        <select
          data-testid="receipt-product"
          aria-invalid=${!!err.choice}
          .value=${value}
          @change=${(e: Event) => {
            const v = (e.target as HTMLSelectElement).value;
            this.set(i, { choice: v === "new" || v === "skip" ? v : Number(v) });
          }}
        >
          <option value="" disabled ?selected=${value === ""}>${t("receipt.choose_option")}</option>
          ${r.item.candidates.map(
            (c) =>
              html`<option value=${c.id} ?selected=${value === String(c.id)}>
                ${c.brand ? `${c.name} (${c.brand})` : c.name}
              </option>`,
          )}
          <option value="new" ?selected=${value === "new"}>${t("receipt.new")}</option>
          <option value="skip" ?selected=${value === "skip"}>${t("receipt.skip")}</option>
        </select>
        ${fieldMsg(err.choice, `${id}-product`)}
      </label>
      ${
        r.choice === "new"
          ? html`<label>
                <span class="lbl">${t("common.name")}</span>
                <input
                  data-testid="receipt-name"
                  aria-invalid=${!!err.name}
                  .value=${r.name}
                  @input=${(e: Event) => this.set(i, { name: (e.target as HTMLInputElement).value })}
                />
                ${fieldMsg(err.name, `${id}-name`)}
              </label>
              <div>
                <span class="lbl">${t("book.category")}</span>
                <pantry-category-picker
                  .categories=${this.md?.categories ?? []}
                  .value=${r.category_id}
                  .hass=${this.hass}
                  @change=${(e: CustomEvent<number>) => this.set(i, { category_id: e.detail })}
                ></pantry-category-picker>
                ${fieldMsg(err.category, `${id}-category`)}
              </div>`
          : nothing
      }
      ${
        r.choice === "skip"
          ? nothing
          : html`<div class="pair">
              <label>
                <span class="lbl">${t("book.packages")}</span>
                <input
                  type="number"
                  min="1"
                  max="9999"
                  data-testid="receipt-packages"
                  aria-invalid=${!!err.packages}
                  .value=${String(r.packages)}
                  @input=${(e: Event) =>
                    this.set(i, { packages: Number((e.target as HTMLInputElement).value) })}
                />
                ${fieldMsg(err.packages, `${id}-packages`)}
              </label>
              <label>
                <span class="lbl">${t("book.expires_on")}</span>
                <input
                  type="date"
                  min="2000-01-01"
                  max="2099-12-31"
                  data-testid="receipt-expires"
                  aria-invalid=${!!err.expires}
                  .value=${r.expires_on}
                  @input=${(e: Event) => {
                    const el = e.target as HTMLInputElement;
                    this.set(i, { expires_on: el.value, dateBad: el.validity.badInput });
                  }}
                />
                ${
                  err.expires
                    ? fieldMsg(err.expires, `${id}-expires`)
                    : html`<span class="detail">${guessHint}</span>`
                }
              </label>
            </div>`
      }
    </li>`;
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
        ${rows.map((r, i) => this.row(r, i))}
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
    return editDialog({
      title: t("receipt.title"),
      body: html`${this.rows ? this.reviewStep(this.rows) : this.pickStep()} ${busy}`,
      error: this.error,
      invalid: this.invalid(),
      submit: this.rows
        ? { label: t("receipt.book", { count: String(count) }), testid: "receipt-book" }
        : { label: t("receipt.read"), testid: "receipt-read" },
      dirty: () => !!(this.file || this.rows),
      onSubmit: (e) => this.submit(e),
      onClosed: () => (this.active = false),
    });
  }

  static styles = [
    formStyles,
    css`
      .rows {
        list-style: none;
        margin: 12px 0 0;
        padding: 0;
      }
      .rows li {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        gap: 8px;
        padding: 12px 0;
        border-top: 1px solid var(--divider-color);
      }
      .text {
        font-family: monospace;
        color: var(--secondary-text-color);
        overflow-wrap: anywhere;
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

customElements.define("pantry-receipt-import", PantryReceiptImport);
