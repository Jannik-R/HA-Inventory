import { LitElement, html, nothing } from "lit";
import { mdiMinus, mdiPlus } from "@mdi/js";
import { t } from "./i18n";
import { fieldMsg, icon, loadingLine } from "./ui";
import { doneLine } from "./booking-done";
import { stocktakeStyles } from "./stocktake-styles";
import { fmtDate } from "./format";
import { confirmDialog } from "./confirm-dialog";
import {
  errorMessage,
  getMasterData,
  getStock,
  type Hass,
  type MasterData,
  type StockRow,
} from "./api";
import { stocktakeApply, stocktakeScan, type StocktakeScan } from "./api-stocktake";
import { isLocationCode, scannedLocation } from "./location-scan";
import "./booking-scan";
import type { HomeInventoryBookingScan } from "./booking-scan";

/** Scanned packages of a product that is not in stock there (booked in as a correction). */
interface Extra {
  product_id: number;
  name: string;
  packages: number;
  expires_on: string;
}

/** Stocktaking of one location: scan everything there, then book the differences (not scanned =
 *  missing, scanned but not in stock = too many) as corrections after one confirm. */
export class HomeInventoryStocktake extends LitElement {
  static properties = {
    hass: { attribute: false },
    md: { state: true },
    location: { state: true },
    rows: { state: true },
    loadingRows: { state: true },
    counted: { state: true },
    extra: { state: true },
    pick: { state: true },
    query: { state: true },
    message: { state: true },
    error: { state: true },
  };

  declare hass?: Hass;
  declare md?: MasterData;
  declare location: number | null;
  /** Stock rows at the location when it was chosen (the list being counted). */
  declare rows: StockRow[];
  declare loadingRows: boolean;
  declare counted: Map<number, number>;
  declare extra: Extra[];
  /** A scan that names several batches here: which one was it? */
  declare pick?: StocktakeScan;
  declare query: string;
  declare message: string;
  declare error: string;
  private started = false;

  constructor() {
    super();
    this.location = null;
    this.rows = [];
    this.loadingRows = false;
    this.counted = new Map();
    this.extra = [];
    this.query = "";
    this.message = "";
    this.error = "";
  }

  willUpdate() {
    if (this.hass && !this.started) {
      this.started = true; // once: `hass` changes on every state event
      getMasterData(this.hass).then(
        (md) => (this.md = md),
        async (err) => (this.error = await errorMessage(this.hass!, err)),
      );
    }
  }

  private async choose(location: number | null) {
    const fresh = location !== this.location; // a refresh of the same location keeps its list
    this.location = location;
    this.counted = new Map();
    this.extra = [];
    this.pick = undefined;
    this.error = "";
    this.loadingRows = !!location && fresh;
    try {
      this.rows = location
        ? (await getStock(this.hass!)).filter((r) => r.location_id === location)
        : [];
    } catch (err) {
      this.rows = [];
      this.error = await errorMessage(this.hass!, err);
    } finally {
      this.loadingRows = false;
    }
    await this.updateComplete;
    this.renderRoot
      .querySelector<HomeInventoryBookingScan>("home-inventory-booking-scan")
      ?.focusInput();
  }

  private count(batch: number, delta: number) {
    const n = Math.max(0, (this.counted.get(batch) ?? 0) + delta);
    this.counted = new Map(this.counted).set(batch, n);
  }

  private addExtra(
    p: { product_id: number; name: string; shelf_date?: string | null },
    delta: number,
  ) {
    const i = this.extra.findIndex((e) => e.product_id === p.product_id);
    if (i < 0) {
      if (delta > 0)
        this.extra = [
          ...this.extra,
          { product_id: p.product_id, name: p.name, packages: 1, expires_on: p.shelf_date ?? "" },
        ];
      return;
    }
    const packages = this.extra[i].packages + delta;
    this.extra = packages
      ? this.extra.map((e, j) => (j === i ? { ...e, packages } : e))
      : this.extra.filter((_, j) => j !== i);
  }

  /** A scanned package: its batch here counts one more; several batches ask; none = too many. */
  private async find(code: string) {
    if (!code.trim() || !this.location) return;
    this.error = this.message = "";
    try {
      if (isLocationCode(code)) {
        const at = await scannedLocation(this.hass!, code);
        this.query = "";
        if (at) return void this.choose(at.id); // a location label switches the location
        return void (this.error = t("location_label.unknown"));
      }
      const s = await stocktakeScan(this.hass!, this.location, code.trim());
      const here = s.batches.filter((b) => this.rows.some((r) => r.batch_id === b.batch_id));
      if (here.length === 1) this.count(here[0].batch_id, 1);
      else if (here.length > 1) this.pick = { ...s, batches: here };
      else this.addExtra(s, 1);
      this.query = "";
    } catch (err) {
      this.error = await errorMessage(this.hass!, err);
    }
  }

  private batchLabel(b: { expires_on: string | null; charge: string | null }) {
    const date = b.expires_on ? fmtDate(this.hass, b.expires_on) : t("stock.no_date");
    return b.charge ? t("stock.charge", { date, charge: b.charge }) : date;
  }

  /** Packages missing and too many (incl. the ones not in stock). */
  private diffs() {
    let missing = 0,
      more = 0;
    for (const r of this.rows) {
      const d = (this.counted.get(r.batch_id) ?? 0) - r.packages;
      if (d < 0) missing -= d;
      else more += d;
    }
    for (const e of this.extra) more += e.packages;
    return { missing, more };
  }

  private async apply() {
    const { missing, more } = this.diffs();
    const ok = await confirmDialog({
      title: t("stocktake.confirm_title"),
      message: t("stocktake.confirm_message", { missing, more }),
      action: t("stocktake.apply"),
    });
    if (!ok) return;
    try {
      const res = await stocktakeApply(this.hass!, {
        location_id: this.location!,
        counts: this.rows
          .filter((r) => (this.counted.get(r.batch_id) ?? 0) !== r.packages)
          .map((r) => ({ batch_id: r.batch_id, packages: this.counted.get(r.batch_id) ?? 0 })),
        extra: this.extra.map((e) => ({
          product_id: e.product_id,
          packages: e.packages,
          expires_on: e.expires_on || null,
        })),
      });
      await this.choose(this.location);
      this.message = t("stocktake.done", { n: res.corrections });
    } catch (err) {
      this.error = await errorMessage(this.hass!, err);
    }
  }

  private stepper(testid: string, name: string, n: number, change: (d: number) => void) {
    return html`<span class="acts">
      <button
        class="icon-btn"
        data-testid=${`${testid}-minus`}
        aria-label=${t("stocktake.less", { name })}
        title=${t("stocktake.less", { name })}
        ?disabled=${n === 0}
        @click=${() => change(-1)}
      >
        ${icon(mdiMinus)}
      </button>
      <button
        class="icon-btn"
        data-testid=${`${testid}-plus`}
        aria-label=${t("stocktake.one_more", { name })}
        title=${t("stocktake.one_more", { name })}
        @click=${() => change(1)}
      >
        ${icon(mdiPlus)}
      </button>
    </span>`;
  }

  /** A partly used package is exactly 1 package: more cannot be counted. */
  private rowError(r: StockRow) {
    return r.remaining < 1 && (this.counted.get(r.batch_id) ?? 0) > 1
      ? t("valid.partial_one")
      : undefined;
  }

  private list() {
    return html`<ul>
      ${this.rows.map((r) => {
        const n = this.counted.get(r.batch_id) ?? 0;
        const diff = n - r.packages;
        return html`<li data-testid="stocktake-row">
          <span class="what">
            <span>${r.name}</span>
            <span class="detail">${this.batchLabel(r)}</span>
          </span>
          <span class="count">
            ${t("stocktake.counted", { n, packages: r.packages })}
            ${
              diff
                ? html`<span class="detail"
                    >${t(diff < 0 ? "stocktake.missing" : "stocktake.too_many", { n: Math.abs(diff) })}</span
                  >`
                : nothing
            }
          </span>
          ${this.stepper("stocktake-row", r.name, n, (d) => this.count(r.batch_id, d))}
          ${fieldMsg(this.rowError(r), "stocktake-row")}
        </li>`;
      })}
    </ul>`;
  }

  private extras() {
    if (!this.extra.length) return nothing;
    return html`<h3>${t("stocktake.extra")}</h3>
      <ul>
        ${this.extra.map(
          (e, i) =>
            html`<li data-testid="stocktake-extra">
              <span class="what">
                <span>${e.name}</span>
                <input
                  type="date"
                  data-testid="stocktake-extra-date"
                  aria-label=${t("book.expires_on")}
                  min="2000-01-01"
                  max="2099-12-31"
                  .value=${e.expires_on}
                  @input=${(ev: Event) =>
                    (this.extra = this.extra.map((x, j) =>
                      j === i ? { ...x, expires_on: (ev.target as HTMLInputElement).value } : x,
                    ))}
                />
              </span>
              <span class="count">${t("book.count", { n: e.packages })}</span>
              ${this.stepper("stocktake-extra", e.name, e.packages, (d) => this.addExtra(e, d))}
            </li>`,
        )}
      </ul>`;
  }

  private pickLine(p: StocktakeScan) {
    const label = t("stocktake.pick", { name: p.name });
    return html`<div class="pick" role="group" aria-label=${label}>
      <span>${label}</span>
      ${p.batches.map(
        (b) =>
          html`<button
            type="button"
            data-testid="stocktake-pick"
            @click=${() => {
              this.count(b.batch_id, 1);
              this.pick = undefined;
            }}
          >
            ${this.batchLabel(b)}
          </button>`,
      )}
    </div>`;
  }

  render() {
    const { missing, more } = this.diffs();
    return html`<label>
        <span class="lbl">${t("stocktake.location")}</span>
        <select
          data-testid="stocktake-location"
          @change=${(e: Event) =>
            this.choose(Number((e.target as HTMLSelectElement).value) || null)}
        >
          <option value="" .selected=${this.location == null}>${t("stocktake.choose")}</option>
          ${(this.md?.locations ?? []).map(
            (l) =>
              html`<option value=${l.id} .selected=${l.id === this.location}>${l.name}</option>`,
          )}
        </select>
      </label>
      ${this.error ? html`<p class="error" role="alert">${this.error}</p>` : nothing}
      ${doneLine(this.message, undefined, "stocktake")}
      ${
        this.location
          ? html`<p class="detail">${t("stocktake.hint")}</p>
              <home-inventory-booking-scan
                .value=${this.query}
                @query=${(e: CustomEvent<string>) => (this.query = e.detail)}
                @find=${(e: CustomEvent<string>) => this.find(e.detail)}
              ></home-inventory-booking-scan>
              ${this.pick ? this.pickLine(this.pick) : nothing}
              ${
                this.loadingRows
                  ? loadingLine()
                  : this.rows.length
                    ? this.list()
                    : html`<p class="empty">${t("stocktake.empty")}</p>`
              }
              ${this.extras()}
              <div class="actions">
                <button
                  class="primary"
                  data-testid="stocktake-apply"
                  ?disabled=${(!missing && !more) || this.rows.some((r) => this.rowError(r))}
                  @click=${() => this.apply()}
                >
                  ${t("stocktake.apply")}
                </button>
              </div>`
          : nothing
      }`;
  }

  static styles = stocktakeStyles;
}

customElements.define("home-inventory-stocktake", HomeInventoryStocktake);
