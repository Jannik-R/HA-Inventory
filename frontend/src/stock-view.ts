import { LitElement, css, html, nothing, type PropertyValues } from "lit";
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
} from "./api";
import { expiryStatus, groupStock, type Item } from "./stock-data";
import { fmtDate } from "./format";
import { outButton, takeOutStyles, undoLine, type Taken } from "./take-out";
import type { PantryProductDialog } from "./product-dialog";
import type { PantryBatchDialog } from "./batch-dialog";
import { stockFilterStyles, stockFilters } from "./stock-filters";
import { deleteMasterRow } from "./delete-flow";
import type { PantryLabelDialog } from "./label-dialog";
import "./product-dialog";
import "./batch-dialog";
import "./label-dialog";

/** Stock and products: category › product › batch/location, search, location filter, edit/delete. */
export class PantryStock extends LitElement {
  static properties = {
    hass: { attribute: false },
    md: { state: true },
    stock: { state: true },
    filter: { state: true },
    location: { state: true },
    withEmpty: { state: true },
    open: { state: true },
    error: { state: true },
    undo: { state: true },
    message: { state: true },
  };

  declare hass?: Hass;
  declare md?: MasterData;
  declare stock?: StockRow[];
  declare filter: string;
  declare location: number | null;
  /** Also products without stock (to edit them); off by default. */
  declare withEmpty: boolean;
  declare open: Set<string>;
  declare error: string;
  declare undo?: Taken;
  declare message: string;
  private products = new Map<number, Product>();

  constructor() {
    super();
    this.filter = "";
    this.location = null;
    this.withEmpty = false;
    this.open = new Set();
    this.error = "";
    this.message = "";
  }

  willUpdate(changed: PropertyValues) {
    if (changed.has("hass") && this.hass && !this.md) this.load();
  }

  private async load() {
    try {
      this.md = await getMasterData(this.hass!);
      await this.reload();
      await this.updateComplete;
      // Scanner types into the search field.
      this.renderRoot.querySelector<HTMLInputElement>(".filter")?.focus();
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

  /** Category tree (only branches with visible products) with its products as leaves. */
  private tree(searching: boolean) {
    const cats = this.md?.categories ?? [];
    const items = groupStock(
      this.stock ?? [],
      this.filter,
      this.location,
      this.withEmpty ? this.products.values() : [],
      this.md,
    );
    // [packages, visible products] per category subtree.
    const total = new Map<number, [number, number]>();
    const sum = (id: number): [number, number] => {
      let [n, k] = [0, 0];
      for (const i of items.get(id) ?? []) [n, k] = [n + i.packages, k + 1];
      for (const c of cats.filter((x) => x.parent_id === id)) {
        const [cn, ck] = sum(c.id);
        [n, k] = [n + cn, k + ck];
      }
      total.set(id, [n, k]);
      return [n, k];
    };
    const rows: unknown[] = [];
    const walk = (parent: number | null, depth: number) => {
      for (const c of cats.filter((x) => x.parent_id === parent)) {
        const [packages, visible] = total.get(c.id) ?? sum(c.id);
        if (!visible) continue;
        const open = searching || this.open.has(`c${c.id}`);
        rows.push(this.renderCategory(c.id, c.name, packages, depth, open));
        if (!open) continue;
        walk(c.id, depth + 1);
        for (const i of items.get(c.id) ?? [])
          rows.push(this.renderItem(i, depth + 1, searching || this.open.has(`p${i.id}`)));
      }
    };
    walk(null, 0);
    return rows;
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
    return r.expires_on ? fmtDate(this.hass, r.expires_on) : t("stock.no_date");
  }

  private toggle(id: string) {
    this.open = toggled(this.open, id);
  }

  render() {
    if (this.error) return html`<p class="error" role="alert">${this.error}</p>`;
    if (!this.stock) return nothing;
    const rows = this.tree(this.filter.trim() !== "");
    return html`
      ${stockFilters(this)} ${undoLine(this, "stock")}
      ${this.message ? html`<p class="done" role="status" data-testid="label-done">${this.message}</p>` : nothing}
      ${
        rows.length
          ? html`<ul>
              ${rows}
            </ul>`
          : html`<p class="empty">
              ${t(this.stock.length || this.filter.trim() ? "book.no_hits" : "stock.empty")}
            </p>`
      }
      <pantry-product-dialog
        .hass=${this.hass}
        .md=${this.md}
        @pantry-saved=${this.reload}
      ></pantry-product-dialog>
      <pantry-batch-dialog .hass=${this.hass} @pantry-saved=${this.reload}></pantry-batch-dialog>
      <pantry-label-dialog
        .hass=${this.hass}
        @pantry-printed=${(e: CustomEvent<number>) =>
          (this.message = e.detail ? t("label.printed", { n: e.detail }) : "")}
      ></pantry-label-dialog>
    `;
  }

  private editProduct(id: number) {
    this.renderRoot
      .querySelector<PantryProductDialog>("pantry-product-dialog")!
      .open(this.products.get(id)!, [...this.products.values()]);
  }

  private async deleteProduct(p: Item) {
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
    this.renderRoot
      .querySelector<PantryLabelDialog>("pantry-label-dialog")!
      .open({ id: b.batch_id, name: b.name, packages });
  }

  private editBatch(b: StockRow) {
    this.renderRoot.querySelector<PantryBatchDialog>("pantry-batch-dialog")!.open(b);
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
          onDelete: this.hass?.user?.is_admin ? () => this.deleteProduct(p) : undefined,
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
                    ${outButton(this, p.name, b, "stock-batch-out")}
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
                  </li>`,
              )}
            </ul>`
          : nothing
      }
    </li>`;
  }

  static styles = [
    formStyles,
    takeOutStyles,
    stockFilterStyles,
    css`
      li.item {
        flex-direction: column;
        align-items: stretch;
      }
      .head {
        display: flex;
        align-items: center;
      }
      .head .row {
        padding-left: 0;
      }
      .batches li {
        gap: 12px;
        padding: 0 0 0 36px;
        border-bottom: 0;
      }
      .batches .detail {
        flex: 1;
      }
      .expired {
        color: var(--error-color);
      }
      .soon {
        color: var(--warning-color);
      }
    `,
  ];
}

customElements.define("pantry-stock", PantryStock);
