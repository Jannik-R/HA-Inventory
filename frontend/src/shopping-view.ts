import { LitElement, css, html, nothing, type PropertyValues } from "lit";
import { live } from "lit/directives/live.js";
import { t } from "./i18n";
import { formStyles } from "./styles";
import {
  errorMessage,
  getMasterData,
  getLabelConfig,
  printShoppingList,
  type Category,
  type Hass,
} from "./api";
import {
  deleteShoppingItem,
  getShopping,
  setShoppingDone,
  setShoppingRecipeDone,
  updateShoppingItem,
  type ShoppingItem,
} from "./api-shopping";
import { missingText, refList } from "./shopping-text";
import { rowStyles } from "./shopping-row-styles";
import { loadingLine, rowActions } from "./ui";
import { confirmDelete } from "./confirm-dialog";
import "./shopping-add";
import "./shopping-recipes";
import type { HomeInventoryShoppingAdd } from "./shopping-add";

/**
 * Shopping list (min stock shortages and items added by hand) as the category tree. Only rows with
 * something to buy get a checkbox; the other categories are just the way there. Checked = struck.
 */
export class HomeInventoryShopping extends LitElement {
  static properties = {
    hass: { attribute: false },
    items: { state: true },
    cats: { state: true },
    error: { state: true },
    receipt: { state: true },
    printing: { state: true },
    note: { state: true },
  };

  declare hass?: Hass;
  declare items?: ShoppingItem[];
  declare cats?: Category[];
  declare error: string;
  /** A receipt printer is set up: offer "Einkaufszettel drucken". */
  declare receipt: boolean;
  declare printing: boolean;
  declare note: string;

  constructor() {
    super();
    this.error = "";
    this.receipt = false;
    this.printing = false;
    this.note = "";
  }

  private started = false;

  willUpdate(changed: PropertyValues) {
    if (changed.has("hass") && this.hass && !this.started) {
      this.started = true; // once: `hass` changes on every state event
      this.load();
      getLabelConfig(this.hass).then(
        (c) => (this.receipt = c.receipt),
        () => undefined, // no print button then
      );
    }
  }

  private async print() {
    if (this.printing) return;
    this.printing = true;
    this.error = this.note = "";
    try {
      const { printed } = await printShoppingList(this.hass!);
      this.note = t("shopping.printed", { n: printed });
    } catch (err) {
      this.error = await errorMessage(this.hass!, err);
    } finally {
      this.printing = false;
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
      else if (item.key) await setShoppingRecipeDone(this.hass!, item.key, done);
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
    this.renderRoot
      .querySelector<HomeInventoryShoppingAdd>("home-inventory-shopping-add")!
      .open(item);
  }

  /** A row with something to buy; `name` shows a category item under its category's name. */
  private row(i: ShoppingItem, depth: number, category = false) {
    const what = missingText(this.hass, i);
    const refs = refList(this.hass, i);
    const full = what ? `${i.name} – ${what}` : i.name;
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
          <span class="line" title=${full}
            ><span class="name">${i.name}</span
            >${what ? html`<span class="amt"> – ${what}</span>` : nothing}</span
          >
          ${
            refs.uses.length || refs.unknown
              ? html`<span class="refs" data-testid="shopping-refs"
                  >${refs.uses.map(
                    (u, n) =>
                      html`<span title=${u.title} aria-label=${u.title}
                        >${u.text}${n < refs.uses.length - 1 ? ";" : ""}</span
                      >`,
                  )}${
                    refs.unknown
                      ? html`<span class="unknown" title=${refs.unknown}>${refs.unknown}</span>`
                      : nothing
                  }</span
                >`
              : nothing
          }
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
    if (!this.items || !this.cats) return html`${error}${this.error ? nothing : loadingLine()}`;
    const bar = html`${error}
      <div class="bar">
        <button class="primary" data-testid="shopping-add" @click=${() => this.openAdd()}>
          ${t("shopping.add.title")}
        </button>
        ${
          this.receipt
            ? html`<button
                data-testid="shopping-print"
                ?disabled=${this.printing || !this.items.some((i) => !i.done)}
                @click=${() => this.print()}
              >
                ${t("shopping.print")}
              </button>`
            : nothing
        }
      </div>
      ${this.note ? html`<p class="detail" role="status" data-testid="shopping-printed">${this.note}</p>` : nothing}
      <home-inventory-shopping-recipes
        .hass=${this.hass}
        @home-inventory-saved=${() => this.load()}
      ></home-inventory-shopping-recipes>
      <home-inventory-shopping-add
        .hass=${this.hass}
        @home-inventory-saved=${() => this.load()}
      ></home-inventory-shopping-add>`;
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
    rowStyles,
    css`
      .bar {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
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
        min-width: 0;
        padding: 4px 0 4px 8px;
        cursor: pointer;
      }
    `,
  ];
}

customElements.define("home-inventory-shopping", HomeInventoryShopping);
