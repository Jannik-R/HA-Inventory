import { LitElement, css, html, nothing, type PropertyValues } from "lit";
import { live } from "lit/directives/live.js";
import { t } from "./i18n";
import { formStyles } from "./styles";
import {
  deleteShoppingItem,
  errorMessage,
  getMasterData,
  getShopping,
  setShoppingDone,
  updateShoppingItem,
  type Category,
  type Hass,
  type ShoppingItem,
} from "./api";
import { fmtNumber } from "./format";
import { rowActions } from "./ui";
import { confirmDelete } from "./confirm-dialog";
import "./shopping-add";
import type { PantryShoppingAdd } from "./shopping-add";

/**
 * Shopping list (min stock shortages and items added by hand) as the category tree. Only rows with
 * something to buy get a checkbox; the other categories are just the way there. Checked = struck.
 */
export class PantryShopping extends LitElement {
  static properties = {
    hass: { attribute: false },
    items: { state: true },
    cats: { state: true },
    error: { state: true },
  };

  declare hass?: Hass;
  declare items?: ShoppingItem[];
  declare cats?: Category[];
  declare error: string;

  constructor() {
    super();
    this.error = "";
  }

  private started = false;

  willUpdate(changed: PropertyValues) {
    if (changed.has("hass") && this.hass && !this.started) {
      this.started = true; // once: `hass` changes on every state event
      this.load();
    }
  }

  private async load(keepError = false) {
    try {
      [this.items, this.cats] = await Promise.all([
        getShopping(this.hass!),
        getMasterData(this.hass!).then((md) => md.categories),
      ]);
      if (!keepError) this.error = "";
    } catch (err) {
      this.error = await errorMessage(this.hass!, err);
    }
  }

  private async check(item: ShoppingItem, done: boolean) {
    this.error = "";
    try {
      if (item.manual) await updateShoppingItem(this.hass!, item.id!, { done });
      else await setShoppingDone(this.hass!, item, done);
    } catch (err) {
      this.error = await errorMessage(this.hass!, err);
      return this.load(true); // the checkbox springs back; the error stays
    }
    await this.load();
  }

  private async removeItem(i: ShoppingItem) {
    if (!(await confirmDelete(i.name))) return;
    this.error = "";
    try {
      await deleteShoppingItem(this.hass!, i.id!);
    } catch (err) {
      this.error = await errorMessage(this.hass!, err);
      return this.load(true);
    }
    await this.load();
  }

  private openAdd(item?: ShoppingItem) {
    this.renderRoot.querySelector<PantryShoppingAdd>("pantry-shopping-add")!.open(item);
  }

  private missing(i: ShoppingItem) {
    if (i.manual)
      return [i.product_id ? i.brand : t("shopping.any"), t("book.count", { n: i.packages! })]
        .filter(Boolean)
        .join(" · ");
    const parts = [];
    if (i.amount) parts.push(`${fmtNumber(this.hass, i.amount.missing)} ${i.amount.unit_symbol}`);
    if (i.packages) parts.push(t("book.count", { n: i.packages }));
    const what = t(i.any_of_subtree ? "shopping.missing_more" : "shopping.missing", {
      what: parts.join(t("shopping.and")),
    });
    return [i.brand, what].filter(Boolean).join(" · ");
  }

  /** A row with something to buy; `name` shows a category item under its category's name. */
  private row(i: ShoppingItem, depth: number, category = false) {
    const unknown = i.amount?.unknown_products;
    return html`<li
      data-testid="shopping-row"
      class="${i.done ? "done" : ""} ${category ? "cat" : ""}"
      style="padding-left:${depth * 24}px"
    >
      <label>
        <input
          type="checkbox"
          data-testid="shopping-check"
          .checked=${live(i.done)}
          @change=${(e: Event) => this.check(i, (e.target as HTMLInputElement).checked)}
        />
        <span class="what">
          <span class="name">${i.name}</span>
          <span class="detail">${this.missing(i)}</span>
          ${unknown ? html`<span class="detail">${t("shopping.unknown", { n: unknown })}</span>` : nothing}
        </span>
      </label>
      ${
        i.manual
          ? rowActions({
              testid: "shopping",
              name: i.name,
              onEdit: () => this.openAdd(i),
              onDelete: () => this.removeItem(i),
            })
          : nothing
      }
    </li>`;
  }

  /** Category tree (order as everywhere: settings order), only branches that hold items. */
  private tree(items: ShoppingItem[], cats: Category[]) {
    const byCat = new Map<number, ShoppingItem[]>();
    for (const i of items) byCat.set(i.category_id, [...(byCat.get(i.category_id) ?? []), i]);
    const used = new Set<number>();
    for (const id of byCat.keys())
      for (let c = cats.find((x) => x.id === id); c; c = cats.find((x) => x.id === c!.parent_id))
        used.add(c.id);
    const rows: unknown[] = [];
    const walk = (parent: number | null, depth: number) => {
      for (const c of cats.filter((x) => x.parent_id === parent && used.has(x.id))) {
        const own = byCat.get(c.id) ?? [];
        const [first, ...more] = own.filter((i) => i.product_id == null);
        rows.push(
          first
            ? this.row(first, depth, true)
            : html`<li
                class="cat"
                data-testid="shopping-category"
                style="padding-left:${depth * 24}px"
              >
                <span class="name heading">${c.name}</span>
              </li>`,
        );
        // A category with both a min stock item and one by hand: the second goes below.
        for (const i of more) rows.push(this.row(i, depth + 1));
        walk(c.id, depth + 1);
        for (const i of own.filter((x) => x.product_id != null)) rows.push(this.row(i, depth + 1));
      }
    };
    walk(null, 0);
    return rows;
  }

  render() {
    const error = this.error ? html`<p class="error" role="alert">${this.error}</p>` : nothing;
    if (!this.items || !this.cats) return error;
    const bar = html`${error}
      <div class="bar">
        <button class="primary" data-testid="shopping-add" @click=${() => this.openAdd()}>
          ${t("shopping.add.title")}
        </button>
      </div>
      <pantry-shopping-add
        .hass=${this.hass}
        @pantry-saved=${() => this.load()}
      ></pantry-shopping-add>`;
    return html`${bar}
    ${
      this.items.length
        ? html`<ul>
            ${this.tree(this.items, this.cats)}
          </ul>`
        : html`<p class="empty">${t("shopping.empty")}</p>`
    }`;
  }

  static styles = [
    formStyles,
    css`
      .bar {
        margin-bottom: 8px;
      }
      li.cat .name {
        font-weight: 500;
      }
      .heading {
        display: block;
        padding: 8px 0 4px 8px;
      }
      label {
        display: flex;
        align-items: center;
        gap: 12px;
        flex: 1;
        padding: 4px 0 4px 8px;
        cursor: pointer;
      }
      .what {
        display: flex;
        flex-direction: column;
        gap: 2px;
        min-width: 0;
      }
      .done .name {
        text-decoration: line-through;
        color: var(--secondary-text-color);
      }
    `,
  ];
}

customElements.define("pantry-shopping", PantryShopping);
