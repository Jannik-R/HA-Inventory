import { LitElement, html, nothing } from "lit";
import { t } from "./i18n";
import { editDialog, fieldMsg } from "./ui";
import { formStyles } from "./styles";
import {
  addShopping,
  errorMessage,
  getMasterData,
  listProducts,
  updateShoppingItem,
  type Hass,
  type MasterData,
  type Product,
  type ShoppingItem,
} from "./api";
import { productErrors, productFields, type Errors } from "./product-fields";
import { categoryPath } from "./inherit";
import "./category-picker";

/** What goes on the list: a saved product or category, or a new one created on save. */
type Choice =
  | { kind: "product"; id: number; name: string }
  | { kind: "category"; id: number; name: string }
  | { kind: "new-product"; product: Product }
  | { kind: "new-category"; name: string; parent_id: number | null };

const MAX_HITS = 8;

/**
 * Add a product or category to the shopping list by hand (search, or create it), or change the
 * packages of an item added by hand. Call `open()`; fires `pantry-saved` after saving.
 */
export class PantryShoppingAdd extends LitElement {
  static properties = {
    hass: { attribute: false },
    query: { state: true },
    choice: { state: true },
    packages: { state: true },
    item: { state: true },
    active: { state: true },
    error: { state: true },
  };

  declare hass?: Hass;
  declare query: string;
  declare choice?: Choice;
  declare packages: number | null;
  /** Set when editing an item added by hand (only the packages change). */
  declare item?: ShoppingItem;
  declare active: boolean;
  declare error: string;
  private md?: MasterData;
  private products: Product[] = [];

  constructor() {
    super();
    this.query = "";
    this.packages = 1;
    this.active = false;
    this.error = "";
  }

  async open(item?: ShoppingItem) {
    this.item = item;
    this.query = "";
    this.choice = undefined;
    this.packages = item?.packages ?? 1;
    this.error = "";
    try {
      [this.md, this.products] = await Promise.all([
        getMasterData(this.hass!),
        listProducts(this.hass!),
      ]);
    } catch (err) {
      this.error = await errorMessage(this.hass!, err); // stays visible in the dialog
    }
    this.active = true;
    await this.updateComplete;
    this.renderRoot.querySelector("dialog")!.showModal();
    this.renderRoot.querySelector<HTMLElement>("dialog input")?.focus();
  }

  private path(id: number | null) {
    return categoryPath(this.md?.categories, id);
  }

  private errors(): Errors {
    const e: Errors = {};
    const c = this.choice;
    if (!this.item && !c) e.what = t("shopping.add.pick");
    if (c?.kind === "new-product") Object.assign(e, productErrors(c.product));
    if (c?.kind === "new-category" && !c.name.trim()) e.name = t("valid.required");
    const n = this.packages;
    if (n == null || !Number.isInteger(n) || n < 1) e.packages = t("valid.packages");
    return e;
  }

  private async save(ev: Event) {
    ev.preventDefault();
    if (Object.keys(this.errors()).length) return;
    const c = this.choice;
    const packages = this.packages!;
    try {
      if (this.item) await updateShoppingItem(this.hass!, this.item.id!, { packages });
      else if (c?.kind === "product") await addShopping(this.hass!, { packages, product_id: c.id });
      else if (c?.kind === "category")
        await addShopping(this.hass!, { packages, category_id: c.id });
      else if (c?.kind === "new-product")
        await addShopping(this.hass!, { packages, product: { ...c.product } });
      else if (c?.kind === "new-category")
        await addShopping(this.hass!, {
          packages,
          category: { name: c.name.trim(), parent_id: c.parent_id },
        });
    } catch (err) {
      this.error = await errorMessage(this.hass!, err);
      return;
    }
    this.renderRoot.querySelector("dialog")?.close();
    this.dispatchEvent(new CustomEvent("pantry-saved", { bubbles: true, composed: true }));
  }

  private hit(testid: string, label: string, detail: string, choice: Choice) {
    return html`<li>
      <button
        type="button"
        class="row"
        data-testid=${testid}
        @click=${() => (this.choice = choice)}
      >
        <span>${label}</span>
        <span class="detail">${detail}</span>
      </button>
    </li>`;
  }

  /** Matching products and categories, then "create new" for what is typed. */
  private hits() {
    const q = this.query.trim();
    if (!q) return nothing;
    const k = q.toLocaleLowerCase();
    const has = (s: string | null | undefined) => !!s && s.toLocaleLowerCase().includes(k);
    const products = this.products.filter((p) => has(p.name) || has(p.brand)).slice(0, MAX_HITS);
    const cats = (this.md?.categories ?? []).filter((c) => has(c.name)).slice(0, MAX_HITS);
    const draft: Product = {
      name: q,
      brand: null,
      ean: null,
      category_id: null,
      content_amount: null,
      content_unit_id: null,
    };
    return html`<ul>
      ${products.map((p) =>
        this.hit(
          "shopping-hit",
          p.name,
          [p.brand, this.path(p.category_id)].filter(Boolean).join(" · "),
          { kind: "product", id: p.id!, name: p.name },
        ),
      )}
      ${cats.map((c) =>
        this.hit("shopping-hit", c.name, t("shopping.add.category", { path: this.path(c.id) }), {
          kind: "category",
          id: c.id,
          name: c.name,
        }),
      )}
      ${this.hit("shopping-new-product", t("shopping.add.new_product", { name: q }), "", {
        kind: "new-product",
        product: draft,
      })}
      ${
        this.hass?.user?.is_admin
          ? this.hit("shopping-new-category", t("shopping.add.new_category", { name: q }), "", {
              kind: "new-category",
              name: q,
              parent_id: null,
            })
          : nothing
      }
    </ul>`;
  }

  private what(err: Errors) {
    const c = this.choice;
    if (!c)
      return html`<label>
          <span class="lbl">${t("shopping.add.what")}</span>
          <input
            type="search"
            data-testid="shopping-what"
            .value=${this.query}
            @input=${(e: Event) => (this.query = (e.target as HTMLInputElement).value)}
          />
          ${this.query.trim() ? fieldMsg(err.what, "shopping-what") : nothing}
        </label>
        ${this.hits()}`;
    const change = html`<button
      type="button"
      class="reset"
      data-testid="shopping-change"
      @click=${() => (this.choice = undefined)}
    >
      ${t("shopping.add.change")}
    </button>`;
    if (c.kind === "product" || c.kind === "category")
      return html`<p data-testid="shopping-choice">
        ${c.kind === "product" ? c.name : t("shopping.add.category", { path: this.path(c.id) })}
        ${change}
      </p>`;
    if (c.kind === "new-product")
      return html`<p class="detail">${t("shopping.add.creates_product")} ${change}</p>
        ${productFields(
          this.md,
          c.product,
          (f, v) => (this.choice = { ...c, product: { ...c.product, [f]: v } }),
          err,
        )}`;
    return html`<p class="detail">${t("shopping.add.creates_category")} ${change}</p>
      <label>
        <span class="lbl">${t("common.name")}</span>
        <input
          data-testid="name"
          aria-invalid=${!!err.name}
          .value=${c.name}
          @input=${(e: Event) =>
            (this.choice = { ...c, name: (e.target as HTMLInputElement).value })}
        />
        ${fieldMsg(err.name, "name")}
      </label>
      <div class="field">
        <span class="lbl">${t("settings.category.parent")}</span>
        <pantry-category-picker
          .categories=${this.md?.categories ?? []}
          .value=${c.parent_id}
          .noneLabel=${t("settings.category.no_parent")}
          @change=${(e: CustomEvent<number | null>) => (this.choice = { ...c, parent_id: e.detail })}
        ></pantry-category-picker>
      </div>`;
  }

  render() {
    if (!this.active) return html`<dialog></dialog>`;
    const err = this.errors();
    return editDialog({
      title: this.item ? t("common.edit_name", { name: this.item.name }) : t("shopping.add.title"),
      body: html`${this.item ? nothing : this.what(err)}
        <label>
          <span class="lbl">${t("shopping.add.packages")}</span>
          <span class="num">
            <input
              type="number"
              min="1"
              step="1"
              inputmode="numeric"
              data-testid="shopping-packages"
              aria-invalid=${!!err.packages}
              .value=${String(this.packages ?? "")}
              @input=${(e: Event) => {
                const v = (e.target as HTMLInputElement).value;
                this.packages = v === "" ? null : Number(v);
              }}
            />
            <span class="detail">${t("book.packages")}</span>
          </span>
          ${fieldMsg(err.packages, "shopping-packages")}
        </label>`,
      error: this.error,
      invalid: Object.keys(err).length > 0,
      dirty: () =>
        !!this.choice || !!this.query.trim() || this.packages !== (this.item?.packages ?? 1),
      onSubmit: (e) => this.save(e),
      onClosed: () => (this.active = false),
    });
  }

  static styles = formStyles;
}

customElements.define("pantry-shopping-add", PantryShoppingAdd);
