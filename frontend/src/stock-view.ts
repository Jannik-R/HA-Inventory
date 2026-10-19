import { LitElement, html, nothing, type PropertyValues } from "lit";
import { hasModule } from "./modules";
import { mdiTagOutline } from "@mdi/js";
import { t } from "./i18n";
import { chevron, icon, rowActions, toggled } from "./ui";
import { formStyles } from "./styles";
import {
  errorMessage,
  getMasterData,
  getStock,
  listProducts,
  type Hass,
  type MasterData,
  type Product,
  type StockRow,
  isAdmin,
} from "./api";
import { expiryStatus, groupStock, type Item } from "./stock-data";
import { stockTree } from "./stock-tree";
import { fmtDate } from "./format";
import { outButton, undoLine, type Undo } from "./take-out";
import { openButton, openedLine, undoOpened, type LabelRequest } from "./open-action";
import type { Opened } from "./api-open";
import { doneLine, doneStyles } from "./booking-done";
import type { HomeInventoryProductDialog } from "./product-dialog";
import type { HomeInventoryBatchDialog } from "./batch-dialog";
import { stockFilterStyles, stockFilters } from "./stock-filters";
import { stockStyles } from "./stock-styles";
import { deleteMasterRow } from "./delete-flow";
import type { HomeInventoryLabelDialog } from "./label-dialog";
import "./product-dialog";
import "./batch-dialog";
import "./label-dialog";
import "./booking-view";
import type { Mode } from "./booking-view";

/** Stock and products: search / book in / book out switch, category › product › batch/location,
 *  location filter, edit/delete. */
export class HomeInventoryStock extends LitElement {
  static properties = {
    hass: { attribute: false },
    mode: { attribute: false },
    md: { state: true },
    stock: { state: true },
    filter: { state: true },
    location: { state: true },
    withEmpty: { state: true },
    open: { state: true },
    error: { state: true },
    undo: { state: true },
    opened: { state: true },
    message: { state: true },
  };

  declare hass?: Hass;
  /** From the route: /stock searches, /in and /out book. */
  declare mode: Mode;
  declare md?: MasterData;
  declare stock?: StockRow[];
  declare filter: string;
  declare location: number | null;
  /** Also products without stock (to edit them); off by default. */
  declare withEmpty: boolean;
  declare open: Set<string>;
  declare error: string;
  declare undo?: Undo;
  /** The last package opened (undo, label offer). */
  declare opened?: Opened;
  declare message: string;
  private products = new Map<number, Product>();

  constructor() {
    super();
    this.mode = "search";
    this.filter = "";
    this.location = null;
    this.withEmpty = false;
    this.open = new Set();
    this.error = "";
    this.message = "";
  }

  private started = false;

  willUpdate(changed: PropertyValues) {
    if (changed.has("hass") && this.hass && !this.started) {
      this.started = true; // once: `hass` changes on every state event
      this.load();
    }
    // One undo line at a time: taking out and opening replace each other's.
    if (changed.has("undo") && this.undo) this.opened = undefined;
    if (changed.has("opened") && this.opened) this.undo = undefined;
    // The "label printed" note belongs to the moment of printing.
    if (["filter", "location", "withEmpty", "stock"].some((k) => changed.has(k))) this.message = "";
  }

  private async load() {
    try {
      this.md = await getMasterData(this.hass!);
      await this.reload();
    } catch (err) {
      this.error = await errorMessage(this.hass!, err);
    }
  }

  /** Stock and products again, after a change. */
  private reload = async () => {
    const [stock, products] = await Promise.all([getStock(this.hass!), listProducts(this.hass!)]);
    this.products = new Map(products.map((p) => [p.id!, p]));
    this.stock = stock;
  };

  private tree(searching: boolean) {
    const items = groupStock(
      this.stock ?? [],
      this.filter,
      this.location,
      this.withEmpty ? this.products.values() : [],
      this.md,
    );
    return stockTree(this.md?.categories ?? [], items, this.open, searching).map((n) =>
      n.kind === "category"
        ? this.renderCategory(n.id, n.name, n.packages, n.depth, n.open)
        : this.renderItem(n.item, n.depth, n.open),
    );
  }

  private renderCategory(id: number, name: string, packages: number, depth: number, open: boolean) {
    return html`<li style="padding-left:${depth * 24}px">
      ${chevron(open, () => this.toggle(`c${id}`))}
      <button
        class="row"
        data-testid="stock-category"
        aria-expanded=${open}
        @click=${() => this.toggle(`c${id}`)}
      >
        <span>${name}</span>
        <span class="detail">${t("book.count", { n: packages })}</span>
      </button>
    </li>`;
  }

  private status(r: StockRow) {
    return expiryStatus(r, this.products.get(r.product_id), this.md);
  }

  private date(r: StockRow) {
    let date = r.expires_on ? fmtDate(this.hass, r.expires_on) : t("stock.no_date");
    if (r.expires_on && r.expiry_type === "guide") date = t("stock.approx_date", { date });
    else if (r.expiry_guessed) date = t("stock.guessed_date", { date });
    if (r.opened_on) date = t("stock.opened_on", { date, opened: fmtDate(this.hass, r.opened_on) });
    return r.charge ? t("stock.charge", { date, charge: r.charge }) : date;
  }

  private toggle(id: string) {
    this.open = toggled(this.open, id);
  }

  render() {
    const error = this.error ? html`<p class="error" role="alert">${this.error}</p>` : nothing;
    const head = html`<home-inventory-booking
      .hass=${this.hass}
      .mode=${this.mode}
      @query=${(e: CustomEvent<string>) => (this.filter = e.detail)}
      @booked=${this.saved}
      @home-inventory-print-label=${(e: CustomEvent<LabelRequest>) => this.label(e.detail)}
    ></home-inventory-booking>`;
    // One outer template: the input must survive the stock loading (Lit swaps elements per template).
    return html`${head} ${error} ${this.stock ? this.list(this.stock) : nothing}`;
  }

  private list(stock: StockRow[]) {
    const rows = this.tree(this.filter.trim() !== "");
    return html`
      ${stockFilters(this)} ${undoLine(this, "stock")}
      ${openedLine(
        this.hass,
        this.opened,
        () => undoOpened(this),
        () => this.label({ id: this.opened!.batch_id, name: this.opened!.name, packages: 1 }),
        "opened",
      )}
      ${doneLine(this.message, undefined, "label")}
      ${
        rows.length
          ? html`<ul>
              ${rows}
            </ul>`
          : html`<p class="empty">
              ${t(stock.length || this.filter.trim() ? "book.no_hits" : "stock.empty")}
            </p>`
      }
      <home-inventory-product-dialog
        .hass=${this.hass}
        .md=${this.md}
        @home-inventory-saved=${this.saved}
        @master=${(e: CustomEvent<MasterData>) => (this.md = e.detail)}
      ></home-inventory-product-dialog>
      <home-inventory-batch-dialog
        .hass=${this.hass}
        @home-inventory-saved=${this.saved}
      ></home-inventory-batch-dialog>
      <home-inventory-label-dialog
        .hass=${this.hass}
        @home-inventory-printed=${(e: CustomEvent<number>) =>
          (this.message = e.detail ? t("label.printed", { n: e.detail }) : "")}
      ></home-inventory-label-dialog>
    `;
  }

  private editProduct(id: number) {
    this.renderRoot
      .querySelector<HomeInventoryProductDialog>("home-inventory-product-dialog")!
      .open(this.products.get(id)!, [...this.products.values()]);
  }

  /** After a dialog saved: reload; a failure shows above the list. */
  private saved = async () => {
    this.error = "";
    try {
      await this.reload();
    } catch (err) {
      this.error = await errorMessage(this.hass!, err);
    }
  };

  private async deleteProduct(p: Item) {
    this.error = "";
    try {
      if (!(await deleteMasterRow(this.hass!, this.md!, "product", p))) return;
      this.undo = undefined; // its batches are gone
      await this.reload();
    } catch (err) {
      this.error = await errorMessage(this.hass!, err);
    }
  }

  /** Reprint dialog; the batch may be stocked at several locations. */
  private printBatch(b: StockRow, batches: StockRow[]) {
    const packages = batches
      .filter((x) => x.batch_id === b.batch_id)
      .reduce((sum, x) => sum + x.packages, 0);
    this.label({ id: b.batch_id, name: b.name, packages });
  }

  private label(r: LabelRequest) {
    this.renderRoot.querySelector<HomeInventoryLabelDialog>("home-inventory-label-dialog")?.open(r);
  }

  private editBatch(b: StockRow) {
    this.renderRoot.querySelector<HomeInventoryBatchDialog>("home-inventory-batch-dialog")!.open(b);
  }

  private renderItem(p: Item, depth: number, expanded: boolean) {
    const first = p.batches[0];
    // Without stock there is nothing to open: the row edits the product (list rule).
    const onRow = first ? () => this.toggle(`p${p.id}`) : () => this.editProduct(p.id);
    return html`<li class="item" style="padding-left:${depth * 24}px">
      <div class="head">
        ${first ? chevron(expanded, onRow) : html`<span class="chev"></span>`}
        <button
          class="row"
          data-testid="stock-product"
          aria-expanded=${first ? expanded : nothing}
          @click=${onRow}
        >
          <span>${p.name}</span>
          <span class="detail">
            ${[p.brand, t("book.count", { n: p.packages })].filter(Boolean).join(" · ")}
            ${first ? html` · <span class=${this.status(first)}>${this.date(first)}</span>` : nothing}
          </span>
        </button>
        ${rowActions({
          testid: "product",
          name: p.name,
          onEdit: () => this.editProduct(p.id),
          onDelete: isAdmin(this.hass) ? () => this.deleteProduct(p) : undefined,
        })}
      </div>
      ${
        expanded
          ? html`<ul class="batches">
              ${p.batches.map(
                (b) =>
                  html`<li data-testid="stock-batch">
                    <span class=${this.status(b)}>${this.date(b)}</span>
                    <span class="detail">${b.location}</span>
                    <span class="count">${t("book.count", { n: b.packages })}</span>
                    <span class="acts">
                      ${outButton(this, p.name, b, "stock-batch-out")}
                      ${hasModule("opened") ? openButton(this, p.name, b) : ""}
                      <button
                        class="icon-btn"
                        data-testid="stock-batch-label"
                        aria-label=${t("label.print_name", { name: p.name })}
                        title=${t("label.print")}
                        @click=${() => this.printBatch(b, p.batches)}
                      >
                        ${icon(mdiTagOutline)}
                      </button>
                      ${rowActions({
                        testid: "batch",
                        name: `${p.name}, ${this.date(b)}`,
                        onEdit: () => this.editBatch(b),
                      })}
                    </span>
                  </li>`,
              )}
            </ul>`
          : nothing
      }
    </li>`;
  }

  static styles = [formStyles, doneStyles, stockFilterStyles, stockStyles];
}

customElements.define("home-inventory-stock", HomeInventoryStock);
