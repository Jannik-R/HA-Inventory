import { LitElement, css, html, nothing, type PropertyValues } from "lit";
import { t } from "./i18n";
import { mdiChevronDown, mdiChevronRight, mdiMinusCircleOutline } from "@mdi/js";
import { formStyles, icon, todayIso } from "./ui";
import {
  bookIn,
  bookOut,
  errorMessage,
  getMasterData,
  getStock,
  listProducts,
  type Hass,
  type MasterData,
  type Product,
  type StockRow,
} from "./api";
import { categoryDefault } from "./inherit";

interface Item {
  id: number;
  category_id: number;
  name: string;
  brand: string | null;
  packages: number;
  batches: StockRow[];
}

/** Stock overview: category › product › batch/location, with search and location filter. */
export class PantryStock extends LitElement {
  static properties = {
    hass: { attribute: false },
    md: { state: true },
    stock: { state: true },
    filter: { state: true },
    location: { state: true },
    open: { state: true },
    error: { state: true },
    undo: { state: true },
  };

  declare hass?: Hass;
  declare md?: MasterData;
  declare stock?: StockRow[];
  declare filter: string;
  declare location: number | null;
  declare open: Set<string>;
  declare error: string;
  declare undo?: { name: string; row: StockRow };
  private products = new Map<number, Product>();

  constructor() {
    super();
    this.filter = "";
    this.location = null;
    this.open = new Set();
    this.error = "";
  }

  willUpdate(changed: PropertyValues) {
    if (changed.has("hass") && this.hass && !this.md) this.load();
  }

  private async load() {
    try {
      const [md, stock, products] = await Promise.all([
        getMasterData(this.hass!),
        getStock(this.hass!),
        listProducts(this.hass!),
      ]);
      this.products = new Map(products.map((p) => [p.id!, p]));
      [this.md, this.stock] = [md, stock];
      await this.updateComplete;
      // Scanner types into the search field.
      this.renderRoot.querySelector<HTMLInputElement>(".filter")?.focus();
    } catch (err) {
      this.error = await errorMessage(this.hass!, err);
    }
  }

  private get locale() {
    return this.hass?.locale?.language ?? this.hass?.language;
  }

  /** Visible rows as products per category id. */
  private byCategory(): Map<number, Item[]> {
    const q = this.filter.trim().toLocaleLowerCase();
    const items = new Map<number, Item>();
    for (const r of this.stock ?? []) {
      if (this.location != null && r.location_id !== this.location) continue;
      const text = [r.name, r.brand, r.ean, r.location, ...r.category_path].join(" ");
      if (q && !text.toLocaleLowerCase().includes(q)) continue;
      let item = items.get(r.product_id);
      if (!item) {
        item = { id: r.product_id, category_id: r.category_id, name: r.name, brand: r.brand, packages: 0, batches: [] };
        items.set(r.product_id, item);
      }
      item.packages += r.packages;
      item.batches.push(r); // backend sorts by expiry, earliest first
    }
    const out = new Map<number, Item[]>();
    for (const i of items.values()) out.set(i.category_id, [...(out.get(i.category_id) ?? []), i]);
    return out;
  }

  /** Category tree (only branches with visible stock) with its products as leaves. */
  private tree(searching: boolean) {
    const cats = this.md?.categories ?? [];
    const items = this.byCategory();
    const total = new Map<number, number>();
    const sum = (id: number): number => {
      const n =
        (items.get(id) ?? []).reduce((n, i) => n + i.packages, 0) +
        cats.filter((c) => c.parent_id === id).reduce((n, c) => n + sum(c.id), 0);
      total.set(id, n);
      return n;
    };
    const rows: unknown[] = [];
    const walk = (parent: number | null, depth: number) => {
      for (const c of cats.filter((x) => x.parent_id === parent)) {
        if (!(total.get(c.id) ?? sum(c.id))) continue;
        const open = searching || this.open.has(`c${c.id}`);
        rows.push(this.renderCategory(c.id, c.name, total.get(c.id)!, depth, open));
        if (!open) continue;
        walk(c.id, depth + 1);
        for (const i of items.get(c.id) ?? []) rows.push(this.renderItem(i, depth + 1, searching || this.open.has(`p${i.id}`)));
      }
    };
    walk(null, 0);
    return rows;
  }

  private chev(key: string, open: boolean) {
    return html`<button
      class="chev"
      aria-expanded=${open}
      aria-label=${t(open ? "common.collapse" : "common.expand")}
      @click=${() => this.toggle(key)}
    >
      ${icon(open ? mdiChevronDown : mdiChevronRight)}
    </button>`;
  }

  private renderCategory(id: number, name: string, packages: number, depth: number, open: boolean) {
    return html`<li style="padding-left:${depth * 24}px">
      ${this.chev(`c${id}`, open)}
      <button class="row" data-testid="stock-category" aria-expanded=${open} @click=${() => this.toggle(`c${id}`)}>
        <span>${name}</span>
        <span class="detail">${t("book.count", { n: packages })}</span>
      </button>
    </li>`;
  }

  /** "expired" / "soon" by the product's effective warn days, for color only. */
  private status(r: StockRow): "expired" | "soon" | "" {
    if (!r.expires_on) return "";
    const today = todayIso();
    if (r.expires_on < today) return "expired";
    const p = this.products.get(r.product_id);
    const warn = Number(
      p?.warn_days ?? categoryDefault(this.md, p?.category_id, "warn_days")?.value ?? 0,
    );
    const limit = new Date(`${today}T00:00`);
    limit.setDate(limit.getDate() + warn);
    return new Date(`${r.expires_on}T00:00`) <= limit ? "soon" : "";
  }

  private date(r: StockRow) {
    if (!r.expires_on) return t("stock.no_date");
    return new Intl.DateTimeFormat(this.locale, { dateStyle: "medium" }).format(
      new Date(`${r.expires_on}T00:00`),
    );
  }

  private toggle(id: string) {
    const open = new Set(this.open);
    if (!open.delete(id)) open.add(id);
    this.open = open;
  }

  render() {
    if (this.error) return html`<p class="error" role="alert">${this.error}</p>`;
    if (!this.stock) return nothing;
    const rows = this.tree(this.filter.trim() !== "");
    return html`
      <div class="filters">
        <input
          class="filter"
          type="search"
          data-testid="stock-filter"
          aria-label=${t("stock.search_hint")}
          placeholder=${t("stock.search")}
          .value=${this.filter}
          @input=${(e: Event) => (this.filter = (e.target as HTMLInputElement).value)}
        />
        <select
          data-testid="stock-location"
          aria-label=${t("stock.location")}
          @change=${(e: Event) => (this.location = Number((e.target as HTMLSelectElement).value) || null)}
        >
          <option value="" ?selected=${this.location == null}>${t("stock.all_locations")}</option>
          ${(this.md?.locations ?? []).map((l) => html`<option value=${l.id} ?selected=${l.id === this.location}>${l.name}</option>`)}
        </select>
      </div>
      <p class="done" role="status" data-testid="stock-done">
        ${
          this.undo
            ? html`${t("stock.taken_one", { name: this.undo.name })}
                <button class="undo" data-testid="stock-undo" @click=${this.undoTake}>${t("stock.undo")}</button>`
            : nothing
        }
      </p>
      ${
        !this.stock.length
          ? html`<p class="empty">${t("stock.empty")}</p>`
          : rows.length
            ? html`<ul>${rows}</ul>`
            : html`<p class="empty">${t("book.no_hits")}</p>`
      }
    `;
  }

  private renderItem(p: Item, depth: number, expanded: boolean) {
    const first = p.batches[0];
    return html`<li class="item" style="padding-left:${depth * 24}px">
      <div class="head">
        ${this.chev(`p${p.id}`, expanded)}
        <button class="row" data-testid="stock-product" aria-expanded=${expanded} @click=${() => this.toggle(`p${p.id}`)}>
          <span>${p.name}</span>
          <span class="detail">
            ${[p.brand, t("book.count", { n: p.packages })].filter(Boolean).join(" · ")} ·
            <span class=${this.status(first)}>${this.date(first)}</span>
          </span>
        </button>
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
                    ${this.outButton(p.name, () => this.takeOut(p.name, b))}
                  </li>`,
              )}
            </ul>`
          : nothing
      }
    </li>`;
  }

  private outButton(name: string, onClick: () => void) {
    const label = t("stock.take_one", { name });
    return html`<button class="icon-btn" data-testid="stock-batch-out" aria-label=${label} title=${label} @click=${onClick}>
      ${icon(mdiMinusCircleOutline)}
    </button>`;
  }

  /** One package out of that batch and location; remembered for undo. */
  private async takeOut(name: string, b: StockRow) {
    await this.change(() => bookOut(this.hass!, { product_id: b.product_id, packages: 1, batch_id: b.batch_id, location_id: b.location_id }), { name, row: b });
  }

  /** Undo = book the package back in; same product, date and type merge into the same batch. */
  private async undoTake() {
    const { row } = this.undo!;
    await this.change(() =>
      bookIn(this.hass!, { product_id: row.product_id, packages: 1, expires_on: row.expires_on, expiry_type: row.expiry_type, location_id: row.location_id }),
    );
  }

  private async change(call: () => Promise<unknown>, undo?: { name: string; row: StockRow }) {
    try {
      await call();
      this.undo = undo;
      this.stock = await getStock(this.hass!);
    } catch (err) {
      this.undo = undefined;
      this.error = await errorMessage(this.hass!, err);
    }
  }

  static styles = [
    formStyles,
    css`
      .filters {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 8px;
        margin-bottom: 8px;
      }
      li.item {
        flex-direction: column;
        align-items: stretch;
      }
      .head {
        display: flex;
        align-items: center;
      }
      .undo {
        padding: 4px 8px;
        color: var(--primary-color);
      }
      .head .row {
        padding-left: 0;
      }
      .chev {
        flex: none;
        width: 36px;
        height: 36px;
        padding: 0;
        border: 0;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .done {
        display: flex;
        align-items: center;
        gap: 8px;
        min-height: 36px;
        margin: 0 0 4px;
        font-size: 0.875em;
        color: var(--secondary-text-color);
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
