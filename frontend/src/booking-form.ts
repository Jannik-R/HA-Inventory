import { LitElement, css, html, nothing, type PropertyValues } from "lit";
import { t } from "./i18n";
import { fieldMsg, plausibleDate } from "./ui";
import { formStyles } from "./styles";
import {
  bookIn,
  bookOut,
  getLabelConfig,
  type Hass,
  type LabelConfig,
  type MasterData,
  type Product,
  type StockRow,
  type Taken,
} from "./api";
import { printLabels } from "./label-print";
import { categoryDefault, categoryPath, type Dflt } from "./inherit";
import { dateField, locationFields, printField, type InForm } from "./booking-in-fields";
import { productErrors, productFields, productSummary, type Errors } from "./product-fields";
import { lang } from "./format";
import { AUTO, maxPackages, pickedRow, pickStyles, renderPick } from "./booking-pick";

/** `booked` event: the done message, and for a book-out what it took (for undo). */
export interface Booked {
  message: string;
  taken?: Taken[];
}

const blankForm = () => ({
  packages: 1,
  expires_on: "",
  location_id: null as number | null,
  makeDefault: true,
  dateBad: false,
  pick: AUTO,
  print: null as boolean | null,
});
type Inherit = "default_location_id" | "expiry_type";
// shortcut: last used location lives until the page reloads; persist it if users ask for it.
let lastLocation: number | null = null;

/** Book in / book out form for one chosen product. Fires `booked` (detail: done message) and `cancel`. */
export class PantryBookingForm extends LitElement {
  static properties = {
    hass: { attribute: false },
    mode: { attribute: false },
    product: { attribute: false },
    md: { attribute: false },
    stock: { attribute: false },
    busy: { attribute: false },
    run: { attribute: false },
    draft: { state: true },
    labels: { state: true },
    f: { state: true },
  };

  declare hass?: Hass;
  declare mode: "in" | "out";
  declare product?: Product;
  declare md?: MasterData;
  declare stock?: StockRow[];
  declare busy: boolean;
  /** Parent's backend call wrapper (busy state, translated errors). */
  declare run: <T>(fn: () => Promise<T>) => Promise<T | undefined>;
  // Editable copy of the product (a new product is filled in here).
  declare draft?: Product;
  declare labels?: LabelConfig;
  // Form values; null = use the product's / category's default.
  declare f: InForm & {
    packages: number;
    pick: string;
  };
  private set = (patch: Partial<InForm>) => (this.f = { ...this.f, ...patch });

  constructor() {
    super();
    this.mode = "in";
    this.busy = false;
    this.run = (fn) => fn().catch(() => undefined);
    this.f = blankForm();
  }

  willUpdate(changed: PropertyValues) {
    if (changed.has("product")) {
      this.draft = this.product;
      this.f = blankForm();
      if (this.hass && this.mode === "in")
        getLabelConfig(this.hass).then(
          (c) => (this.labels = c),
          () => undefined,
        );
    }
  }

  focusFirst() {
    const first = this.mode === "out" ? "#packages" : this.draft?.name ? "#expires" : "#name";
    this.renderRoot.querySelector<HTMLElement>(first)?.focus();
  }

  /** Default for a batch field and its source: product, category chain, global default or last booking. */
  private dflt(field: Inherit): Dflt | undefined {
    const own = this.draft?.[field];
    if (own != null) return { value: own, source: t("book.from_product") };
    const d = categoryDefault(this.md, this.draft?.category_id, field);
    if (d) return d;
    if (field === "default_location_id" && lastLocation != null)
      return { value: lastLocation, source: t("book.last_used") };
    return undefined;
  }

  private setProduct(field: keyof Product, value: unknown) {
    this.draft = { ...this.draft!, [field]: value };
  }

  private async submit(e: Event) {
    e.preventDefault();
    const p = this.draft!;
    const hass = this.hass!;
    const { packages } = this.f;
    let where = "";
    let printed = 0;
    let taken: Taken[] | undefined;
    if (Object.keys(this.errors(p)).length) return;
    if (this.mode === "in") {
      const location_id =
        this.f.location_id ??
        (this.dflt("default_location_id")?.value as number | undefined) ??
        null;
      const product = p.id
        ? undefined
        : Object.fromEntries(
            (
              [
                "ean",
                "name",
                "brand",
                "category_id",
                "content_amount",
                "content_unit_id",
                "image_url",
                "off_json",
                "min_packages",
              ] as const
            ).map((k) => [k, p[k] === "" ? null : (p[k] ?? null)]),
          );
      // New product: the chosen location becomes its own default, unless the category gives it anyway.
      if (
        product &&
        this.f.makeDefault &&
        location_id !== categoryDefault(this.md, p.category_id, "default_location_id")?.value
      )
        product.default_location_id = location_id;
      const res = await this.run(() =>
        bookIn(hass, {
          packages,
          expires_on: this.f.expires_on || null,
          location_id,
          ...(p.id ? { product_id: p.id } : { product }),
        }),
      );
      if (!res) return;
      lastLocation = location_id;
      if (this.f.print ?? this.labels?.print_on_book_in) {
        const n = await this.run(() => printLabels(hass, res.batch_id, Math.min(packages, 99)));
        if (n) printed = n;
      }
      where = this.md?.locations.find((l) => l.id === location_id)?.name ?? "";
    } else {
      const row = pickedRow(this.stock, this.f.pick);
      const res = await this.run(() =>
        bookOut(hass, {
          product_id: p.id!,
          packages,
          ...(row ? { batch_id: row.batch_id, location_id: row.location_id } : {}),
        }),
      );
      if (!res) return;
      taken = res.taken;
    }
    const message =
      t(where ? "book.done_in_at" : `book.done_${this.mode}`, {
        n: packages,
        name: p.name,
        where,
      }) + (printed ? ` · ${t("label.printed", { n: printed })}` : "");
    this.dispatchEvent(new CustomEvent<Booked>("booked", { detail: { message, taken } }));
  }

  render() {
    const p = this.draft;
    if (!p) return nothing;
    const out = this.mode === "out";
    if (out && !this.stock?.length) {
      // No stock list means it failed to load: only the error is shown.
      return this.stock
        ? html`<h2>${p.name}</h2>
            <p class="empty" data-testid="no-stock">${t("book.no_stock")}</p>`
        : nothing;
    }
    const max = this.mode === "out" ? maxPackages(this.stock, this.f.pick) : undefined;
    const err = this.errors(p);
    return html`<form class="book" @submit=${this.submit}>
      ${
        out
          ? html`<h2>
              ${p.name}${p.brand ? html` <span class="detail">${p.brand}</span>` : nothing}
            </h2>`
          : html`<h2>${t("book.title_in")}</h2>
              <p class="summary" data-testid="summary">
                ${productSummary(this.md, p, categoryPath(this.md?.categories, p.category_id), lang(this.hass)) || t("book.new_product")}
                ${p.id ? nothing : html`<span class="detail">${t("book.is_new")}</span>`}
              </p>`
      }
      ${out ? renderPick(this.hass, this.stock ?? [], this.f.pick, (pick) => (this.f = { ...this.f, pick, packages: 1 })) : html`${p.id ? nothing : productFields(this.md, p, (f, v) => this.setProduct(f, v), err, this.hass)}${dateField(this.f, this.set, err, this.dflt("expiry_type")?.value)}`}
      <label>
        <span class="lbl">${t("book.packages")}</span>
        <input
          id="packages"
          data-testid="packages"
          type="number"
          inputmode="numeric"
          min="1"
          max=${max ?? nothing}
          step="1"
          required
          aria-invalid=${!!err.packages}
          .value=${String(this.f.packages)}
          @input=${(e: Event) => (this.f = { ...this.f, packages: Number((e.target as HTMLInputElement).value) })}
        />
        ${fieldMsg(err.packages, "packages")}
      </label>
      ${out ? nothing : html`${locationFields(this.md, p, this.f, this.set, err, this.dflt("default_location_id"))}${printField(this.f, this.set, !!this.labels?.print_on_book_in)}`}
      <div class="actions">
        <button
          class="primary"
          type="submit"
          data-testid="submit"
          ?disabled=${this.busy || Object.keys(err).length > 0}
        >
          ${t(`book.submit_${this.mode}`)}
        </button>
        <button
          type="button"
          data-testid="cancel"
          @click=${() => this.dispatchEvent(new CustomEvent("cancel"))}
        >
          ${t("common.cancel")}
        </button>
      </div>
    </form>`;
  }

  /** Field errors that block booking; shown live under the fields. */
  private errors(p: Product): Errors {
    const e: Errors = this.mode === "in" && !p.id ? productErrors(p) : {};
    const { packages, expires_on, dateBad } = this.f;
    if (this.mode === "in") {
      if (dateBad || (expires_on && !plausibleDate(expires_on))) e.expires = t("valid.date");
      if (this.f.location_id == null && !this.dflt("default_location_id"))
        e.location = t("valid.location");
    }
    const max = this.mode === "out" ? maxPackages(this.stock, this.f.pick) : undefined;
    if (!Number.isInteger(packages) || packages < 1) e.packages = t("valid.packages");
    else if (max != null && packages > max) e.packages = t("valid.max_packages", { n: max });
    return e;
  }

  static styles = [
    formStyles,
    pickStyles,
    css`
      .book {
        max-width: 480px;
      }
      .book .detail {
        display: block;
        margin-top: 4px;
      }
      h2 .detail {
        display: inline;
      }
      .summary {
        margin: 0 0 12px;
      }
      .summary .detail {
        display: inline;
        margin-left: 4px;
      }
    `,
  ];
}

customElements.define("pantry-booking-form", PantryBookingForm);
