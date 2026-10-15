import { LitElement, css, html, nothing, type PropertyValues } from "lit";
import { t } from "./i18n";
import { editDialog, fieldMsg, formStyles, rowActions } from "./ui";
import {
  errorMessage,
  getMasterData,
  listProducts,
  saveProduct,
  type Hass,
  type MasterData,
  type Product,
} from "./api";
import { categoryDefault, categoryPath, inheritNumber, inheritSelect } from "./inherit";
import { productErrors, productFields, type Errors } from "./product-fields";
import { fmtDays } from "./format";

// Columns sent on save (packages is derived, image/off data are not edited here).
const COLUMNS = [
  "name",
  "brand",
  "ean",
  "category_id",
  "content_amount",
  "content_unit_id",
  "default_location_id",
  "expiry_type",
  "warn_days",
] as const;

/** Saved products: searchable list, edit dialog for their properties and own defaults. */
export class PantryProducts extends LitElement {
  static properties = {
    hass: { attribute: false },
    md: { state: true },
    products: { state: true },
    filter: { state: true },
    edit: { state: true },
    error: { state: true },
  };

  declare hass?: Hass;
  declare md?: MasterData;
  declare products?: Product[];
  declare filter: string;
  declare edit?: Product;
  declare error: string;
  private orig?: Product;

  constructor() {
    super();
    this.filter = "";
    this.error = "";
  }

  willUpdate(changed: PropertyValues) {
    if (changed.has("hass") && this.hass && !this.md) this.load();
  }

  private async load() {
    try {
      [this.md, this.products] = await Promise.all([
        getMasterData(this.hass!),
        listProducts(this.hass!),
      ]);
    } catch (err) {
      this.error = await errorMessage(this.hass!, err);
    }
  }

  private visible(): Product[] {
    const q = this.filter.trim().toLocaleLowerCase();
    const all = this.products ?? [];
    if (!q) return all;
    return all.filter((p) =>
      [p.name, p.brand, p.ean, categoryPath(this.md, p.category_id)]
        .join(" ")
        .toLocaleLowerCase()
        .includes(q),
    );
  }

  private async open(p: Product) {
    this.error = "";
    this.edit = { ...p };
    this.orig = { ...p };
    await this.updateComplete;
    this.renderRoot.querySelector("dialog")!.showModal();
    this.renderRoot.querySelector<HTMLElement>("dialog input")?.focus();
  }

  private set(field: keyof Product, value: unknown) {
    this.edit = { ...this.edit!, [field]: value };
  }

  private close() {
    this.renderRoot.querySelector("dialog")?.close();
  }

  /** Field errors that block saving; shown live under the fields. */
  private errors(p: Product): Errors {
    const e = productErrors(p);
    if (p.ean && !/^\d{8,14}$/.test(p.ean)) e.ean = t("valid.ean");
    const owner = p.ean && this.products?.find((x) => x.ean === p.ean && x.id !== p.id);
    if (owner) e.ean = t("valid.ean_taken", { name: owner.name });
    if (p.warn_days != null && !(Number.isInteger(p.warn_days) && p.warn_days >= 0))
      e.warn_days = t("valid.days");
    return e;
  }

  private async save(e: Event) {
    e.preventDefault();
    const p = this.edit!;
    if (Object.keys(this.errors(p)).length) return;
    const data: Record<string, unknown> = { id: p.id };
    for (const k of COLUMNS) data[k] = p[k] === "" ? null : (p[k] ?? null);
    try {
      await saveProduct(this.hass!, data);
      this.close();
      this.products = await listProducts(this.hass!);
    } catch (err) {
      this.error = await errorMessage(this.hass!, err);
    }
  }

  private async del(p: Product) {
    const ask = p.packages
      ? t("products.confirm_delete_stock", { name: p.name, n: p.packages })
      : t("common.confirm_delete", { name: p.name });
    if (!confirm(ask)) return;
    try {
      await this.hass!.callWS({ type: "pantry/delete", table: "product", row_id: p.id });
      this.close();
      this.products = await listProducts(this.hass!);
    } catch (err) {
      this.error = await errorMessage(this.hass!, err);
    }
  }

  render() {
    const rows = this.visible();
    return html`
      <input
        class="filter"
        type="search"
        data-testid="product-filter"
        aria-label=${t("products.filter")}
        placeholder=${t("products.filter")}
        .value=${this.filter}
        @input=${(e: Event) => (this.filter = (e.target as HTMLInputElement).value)}
      />
      ${this.error && !this.edit ? html`<p class="error" role="alert">${this.error}</p>` : nothing}
      <ul>
        ${rows.map(
          (p) =>
            html`<li>
              <button class="row" data-testid="product" @click=${() => this.open(p)}>
                <span>${p.name}</span>
                <span class="detail">
                  ${[
                    p.brand,
                    categoryPath(this.md, p.category_id),
                    t("book.count", { n: p.packages ?? 0 }),
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </span>
              </button>
              ${rowActions({
                testid: "product",
                name: p.name,
                onEdit: () => this.open(p),
                onDelete: this.hass?.user?.is_admin ? () => this.del(p) : undefined,
              })}
            </li>`,
        )}
      </ul>
      ${this.products && !rows.length ? html`<p class="empty">${t("book.no_hits")}</p>` : nothing}
      ${this.renderDialog()}
    `;
  }

  private renderDialog() {
    const p = this.edit;
    if (!p) return html`<dialog></dialog>`;
    const err = this.errors(p);
    const dflt = (field: "default_location_id" | "expiry_type" | "warn_days") =>
      categoryDefault(this.md, p.category_id, field);
    const dirty = () => COLUMNS.some((k) => (p[k] ?? null) !== (this.orig?.[k] ?? null));
    return editDialog({
      title: t("common.edit_name", { name: this.orig?.name ?? p.name }),
      body: html`${productFields(this.md, p, (f, v) => this.set(f, v), err)}
        <label>
          <span class="lbl">${t("products.ean")}</span>
          <input
            data-testid="ean"
            inputmode="numeric"
            aria-invalid=${!!err.ean}
            .value=${p.ean ?? ""}
            @input=${(e: Event) => this.set("ean", (e.target as HTMLInputElement).value.trim() || null)}
          />
          ${fieldMsg(err.ean, "ean")}
        </label>
        <label>
          <span class="lbl">${t("settings.category.location")}</span>
          ${inheritSelect({
            testid: "location",
            own: p.default_location_id,
            dflt: dflt("default_location_id"),
            optional: true,
            options: (this.md?.locations ?? []).map((l) => [l.id, l.name]),
            numeric: true,
            onChange: (v) => this.set("default_location_id", v),
          })}
        </label>
        <label>
          <span class="lbl">${t("settings.category.expiry_type")}</span>
          ${inheritSelect({
            testid: "expiry-type",
            own: p.expiry_type,
            dflt: dflt("expiry_type"),
            options: ["best_before", "use_by"].map((k) => [k, t(`settings.expiry.${k}`)]),
            numeric: false,
            onChange: (v) => this.set("expiry_type", v),
          })}
        </label>
        <label>
          <span class="lbl">${t("settings.category.warn_days")}</span>
          ${inheritNumber({
            testid: "warn-days",
            own: p.warn_days,
            dflt: dflt("warn_days"),
            format: (v) => fmtDays(this.hass, v),
            suffix: t("common.days_unit"),
            invalid: !!err.warn_days,
            onChange: (v) => this.set("warn_days", v),
          })}
          ${fieldMsg(err.warn_days, "warn-days")}
        </label>`,
      error: this.error,
      invalid: Object.keys(err).length > 0,
      dirty,
      onSubmit: (e) => this.save(e),
      onClosed: () => (this.edit = undefined),
    });
  }

  static styles = [
    formStyles,
    css`
      .filter {
        margin-bottom: 8px;
      }
    `,
  ];
}

customElements.define("pantry-products", PantryProducts);
