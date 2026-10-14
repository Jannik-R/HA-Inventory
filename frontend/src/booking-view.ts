import { LitElement, css, html, nothing, type PropertyValues } from "lit";
import { mdiBarcodeScan } from "@mdi/js";
import { t } from "./i18n";
import { fieldMsg, formStyles, icon, plausibleDate, todayIso } from "./ui";
import {
  bookIn,
  bookOut,
  errorMessage,
  getMasterData,
  getStock,
  lookup,
  search,
  type Hass,
  type MasterData,
  type Product,
  type SearchHit,
  type StockRow,
} from "./api";
import type { PantryScanner } from "./scanner";
import "./scanner";
import { categoryDefault, categoryPath, inheritSelect, type Dflt } from "./inherit";
import { productErrors, productFields, productSummary, type Errors } from "./product-fields";

type Mode = "in" | "out";
const EAN = /^\d{8,14}$/;
const AUTO = "auto";
type Inherit = "default_location_id" | "expiry_type";
// shortcut: last used location lives until the page reloads; persist it if users ask for it.
let lastLocation: number | null = null;

/** Book in / book out: one input for scanner, camera and name search, then a short form. */
export class PantryBooking extends LitElement {
  static properties = {
    hass: { attribute: false },
    mode: { attribute: false },
    query: { state: true },
    hits: { state: true },
    online: { state: true },
    product: { state: true },
    f: { state: true },
    stock: { state: true },
    message: { state: true },
    error: { state: true },
    busy: { state: true },
  };

  declare hass?: Hass;
  declare mode: Mode;
  declare query: string;
  declare hits?: (SearchHit | Product)[];
  declare online: boolean;
  declare product?: Product;
  // Form values; null = use the product's / category's default.
  declare f: {
    packages: number;
    expires_on: string;
    makeDefault: boolean;
    // The date input reports incomplete input only via validity, its value is then "".
    dateBad: boolean;
    location_id: number | null;
    pick: string;
  };
  declare stock?: StockRow[];
  declare message: string;
  declare error: string;
  declare busy: boolean;

  private md?: MasterData;

  constructor() {
    super();
    this.mode = "in";
    this.message = "";
    this.online = false;
    this.busy = false;
    this.reset();
  }

  private reset() {
    this.query = "";
    this.hits = undefined;
    this.online = false;
    this.product = undefined;
    this.stock = undefined;
    this.error = "";
    this.f = { packages: 1, expires_on: "", location_id: null, makeDefault: true, dateBad: false, pick: AUTO };
  }

  willUpdate(changed: PropertyValues) {
    if (changed.has("mode") && changed.get("mode")) {
      this.reset();
      this.message = "";
    }
    if (changed.has("hass") && this.hass && !this.md) {
      getMasterData(this.hass).then(
        (md) => ((this.md = md), this.requestUpdate()),
        (err) => this.fail(err),
      );
    }
  }

  firstUpdated() {
    this.focusInput();
  }

  private focusInput() {
    this.updateComplete.then(() =>
      this.renderRoot.querySelector<HTMLInputElement>("#code")?.focus(),
    );
  }

  private async fail(err: unknown) {
    this.error = this.hass ? await errorMessage(this.hass, err) : String(err);
  }

  /** Run a backend call with busy state and translated errors. */
  private async run<T>(fn: () => Promise<T>): Promise<T | undefined> {
    this.busy = true;
    this.error = "";
    try {
      return await fn();
    } catch (err) {
      await this.fail(err);
      return undefined;
    } finally {
      this.busy = false;
    }
  }

  private async find(e?: Event) {
    e?.preventDefault();
    const q = this.query.trim();
    if (!q || !this.hass) return;
    const hass = this.hass;
    this.message = "";
    this.product = this.stock = this.hits = undefined;
    this.online = false;
    if (EAN.test(q)) {
      const res = await this.run(() => lookup(hass, q));
      if (!res) return;
      if (res.product) return this.choose(res.product);
      if (this.mode === "out") return void (this.error = t("book.unknown"));
      return this.choose(this.blank({ ean: q }));
    }
    const hits = await this.run(() => search(hass, q));
    if (!hits) return;
    this.hits = hits;
    if (this.mode === "out" && hits.length === 1) this.choose(hits[0] as Product);
  }

  private async searchOnline() {
    const hass = this.hass!;
    const hits = await this.run(() => search(hass, this.query.trim(), true));
    if (hits) ((this.hits = hits), (this.online = true));
  }

  private blank(p: Partial<Product>): Product {
    return {
      ean: null,
      name: "",
      brand: null,
      category_id: null,
      content_amount: null,
      content_unit_id: null,
      ...p,
    };
  }

  /** Online hits are only a name + EAN: load the full draft (category suggestion) first. */
  private async pick(hit: SearchHit | Product) {
    if (hit.id || !hit.ean) return this.choose(hit as Product);
    const res = await this.run(() => lookup(this.hass!, hit.ean!));
    if (res?.product) this.choose(res.product);
  }

  private async choose(p: Product) {
    this.hits = undefined;
    if (this.mode === "out" && !p.id) return void (this.error = t("book.unknown"));
    this.product = p;
    this.f = { packages: 1, expires_on: "", location_id: null, makeDefault: true, dateBad: false, pick: AUTO };
    if (this.mode === "out") this.stock = await this.run(() => getStock(this.hass!, p.id!));
    await this.updateComplete;
    const first = this.mode === "out" ? "#packages" : p.name ? "#expires" : "#name";
    this.renderRoot.querySelector<HTMLElement>(first)?.focus();
  }

  /** Default for a batch field and its source: product, category chain, global default or last booking. */
  private dflt(field: Inherit): Dflt | undefined {
    const own = this.product?.[field];
    if (own != null) return { value: own, source: t("book.from_product") };
    const d = categoryDefault(this.md, this.product?.category_id, field);
    if (d) return d;
    if (field === "default_location_id" && lastLocation != null)
      return { value: lastLocation, source: t("book.last_used") };
    return undefined;
  }

  private setProduct(field: keyof Product, value: unknown) {
    this.product = { ...this.product!, [field]: value };
  }

  private async submit(e: Event) {
    e.preventDefault();
    const p = this.product!;
    const hass = this.hass!;
    const { packages } = this.f;
    let where = "";
    if (Object.keys(this.errors(p)).length) return;
    if (this.mode === "in") {
      const location_id =
        this.f.location_id ?? ((this.dflt("default_location_id")?.value as number | undefined) ?? null);
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
              ] as const
            ).map((k) => [k, p[k] === "" ? null : (p[k] ?? null)]),
          );
      // New product: the chosen location becomes its own default, unless the category gives it anyway.
      if (product && this.f.makeDefault && location_id !== categoryDefault(this.md, p.category_id, "default_location_id")?.value)
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
      where = this.md?.locations.find((l) => l.id === location_id)?.name ?? "";
    } else {
      const row = this.stock?.find((r) => `${r.batch_id}:${r.location_id}` === this.f.pick);
      const res = await this.run(() =>
        bookOut(hass, {
          product_id: p.id!,
          packages,
          ...(row ? { batch_id: row.batch_id, location_id: row.location_id } : {}),
        }),
      );
      if (!res) return;
    }
    this.reset();
    this.message = t(where ? "book.done_in_at" : `book.done_${this.mode}`, { n: packages, name: p.name, where });
    this.focusInput();
  }

  private date(iso: string | null): string {
    if (!iso) return t("book.no_date");
    const lang = this.hass?.locale?.language ?? this.hass?.language;
    return new Intl.DateTimeFormat(lang, { dateStyle: "medium" }).format(new Date(`${iso}T00:00`));
  }

  private openScanner() {
    this.renderRoot.querySelector<PantryScanner>("pantry-scanner")?.open();
  }

  private scanned(e: CustomEvent<string>) {
    this.query = e.detail;
    this.find();
  }

  render() {
    return html`
      <form class="scan" @submit=${this.find}>
        <input
          id="code"
          data-testid="code-input"
          type="search"
          enterkeyhint="search"
          autocomplete="off"
          aria-label=${t("book.input")}
          placeholder=${t("book.input")}
          .value=${this.query}
          @input=${(e: Event) => (this.query = (e.target as HTMLInputElement).value)}
        />
        <button type="button" data-testid="camera" @click=${this.openScanner}>
          ${icon(mdiBarcodeScan)}<span>${t("book.camera")}</span>
        </button>
      </form>
      <pantry-scanner @scan=${this.scanned}></pantry-scanner>
      ${this.message ? html`<p class="done" role="status" data-testid="message">${this.message}</p>` : nothing}
      ${this.error ? html`<p class="error" role="alert" data-testid="error">${this.error}</p>` : nothing}
      ${this.hits ? this.renderHits() : nothing}
      ${this.product ? this.renderForm(this.product) : nothing}
    `;
  }

  private renderHits() {
    const hits = this.hits!;
    return html`
      ${hits.length ? nothing : html`<p class="empty">${t("book.no_hits")}</p>`}
      <ul>
        ${hits.map(
          (h) =>
            html`<li>
              <button class="row" data-testid="hit" @click=${() => this.pick(h)}>
                <span>${h.name}</span>
                <span class="detail">${[h.brand, h.ean].filter(Boolean).join(" · ")}</span>
              </button>
            </li>`,
        )}
      </ul>
      ${
        this.mode === "in"
          ? html`<div class="actions after">
              ${
                this.online
                  ? nothing
                  : html`<button
                      data-testid="search-online"
                      ?disabled=${this.busy}
                      @click=${this.searchOnline}
                    >
                      ${t("book.search_online")}
                    </button>`
              }
              <button
                data-testid="new-product"
                @click=${() => this.choose(this.blank({ name: this.query.trim() }))}
              >
                ${t("book.new_product")}
              </button>
            </div>`
          : nothing
      }
    `;
  }

  private renderForm(p: Product) {
    const out = this.mode === "out";
    if (out && !this.stock?.length) {
      // No stock list means it failed to load: only the error is shown.
      return this.stock
        ? html`<h2>${p.name}</h2>
            <p class="empty" data-testid="no-stock">${t("book.no_stock")}</p>`
        : nothing;
    }
    const max = this.maxPackages();
    const err = this.errors(p);
    const lang = this.hass?.locale?.language ?? this.hass?.language;
    return html`<form class="book" @submit=${this.submit}>
      ${
        out
          ? html`<h2>${p.name}${p.brand ? html` <span class="detail">${p.brand}</span>` : nothing}</h2>`
          : html`<h2>${t("book.title_in")}</h2>
              <p class="summary" data-testid="summary">
                ${productSummary(this.md, p, categoryPath(this.md, p.category_id), lang) || t("book.new_product")}
                ${p.id ? nothing : html`<span class="detail">${t("book.is_new")}</span>`}
              </p>`
      }
      ${out ? this.renderPick() : html`${p.id ? nothing : productFields(this.md, p, (f, v) => this.setProduct(f, v), err)}${this.renderDate(err)}`}
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
      ${out ? nothing : this.renderLocation(p, err)}
      <div class="actions">
        <button class="primary" type="submit" data-testid="submit" ?disabled=${this.busy || Object.keys(err).length > 0}>
          ${t(`book.submit_${this.mode}`)}
        </button>
        <button type="button" data-testid="cancel" @click=${() => (this.reset(), this.focusInput())}>
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
      if (this.f.location_id == null && !this.dflt("default_location_id")) e.location = t("valid.location");
    }
    const max = this.maxPackages();
    if (!Number.isInteger(packages) || packages < 1) e.packages = t("valid.packages");
    else if (max != null && packages > max) e.packages = t("valid.max_packages", { n: max });
    return e;
  }

  /** Book out: packages of the picked row, or of all rows. */
  private maxPackages(): number | undefined {
    if (this.mode !== "out") return undefined;
    const row = this.stock?.find((r) => `${r.batch_id}:${r.location_id}` === this.f.pick);
    return row?.packages ?? this.stock?.reduce((n, r) => n + r.packages, 0);
  }

  private renderDate(err: Errors) {
    const past = !err.expires && this.f.expires_on && this.f.expires_on < todayIso();
    return html`<label>
      <span class="lbl">${this.dateLabel()}</span>
      <input
        id="expires"
        data-testid="expires"
        type="date"
        min="2000-01-01"
        max="2099-12-31"
        aria-invalid=${!!err.expires}
        .value=${this.f.expires_on}
        @input=${(e: Event) => {
          const el = e.target as HTMLInputElement;
          this.f = { ...this.f, expires_on: el.value, dateBad: el.validity.badInput };
        }}
      />
      ${
        err.expires || past
          ? html`${fieldMsg(err.expires, "expires")}${past ? fieldMsg(t("valid.past"), "expires", true) : ""}`
          : html`<span class="detail">${t("book.no_date_hint")}</span>`
      }
    </label>`;
  }

  /** "Ablaufdatum (Mindesthaltbarkeit)": the product's date type, set on the product or category. */
  private dateLabel() {
    const type = this.dflt("expiry_type")?.value;
    return type ? t("book.expires_on_type", { type: t(`settings.expiry.${type}`) }) : t("book.expires_on");
  }

  /** Location for this booking (default from product / category); a new product can keep it as its default. */
  private renderLocation(p: Product, err: Errors) {
    return html`<label>
        <span class="lbl">${t("book.location")}</span>
        ${inheritSelect({
          testid: "location",
          own: this.f.location_id,
          dflt: this.dflt("default_location_id"),
          options: (this.md?.locations ?? []).map((l) => [l.id, l.name]),
          numeric: true,
          invalid: !!err.location,
          onChange: (v) => (this.f = { ...this.f, location_id: v as number | null }),
        })}
        ${fieldMsg(err.location, "location")}
      </label>
      ${
        p.id
          ? nothing
          : html`<label class="check">
              <input
                type="checkbox"
                data-testid="make-default"
                .checked=${this.f.makeDefault}
                @change=${(e: Event) => (this.f = { ...this.f, makeDefault: (e.target as HTMLInputElement).checked })}
              />${t("book.make_default")}
            </label>`
      }`;
  }

  /** Book out: earliest expiry first by default, or one specific batch at one location. */
  private renderPick() {
    const rows = this.stock ?? [];
    const opt = (value: string, label: unknown) =>
      html`<label class="check">
        <input
          type="radio"
          name="pick"
          data-testid="pick"
          .value=${value}
          .checked=${this.f.pick === value}
          @change=${() => (this.f = { ...this.f, pick: value, packages: 1 })}
        />${label}
      </label>`;
    return html`<fieldset>
      <legend class="lbl">${t("book.which")}</legend>
      ${opt(AUTO, t("book.fefo"))}
      ${rows.map((r) =>
        opt(
          `${r.batch_id}:${r.location_id}`,
          html`<span
            >${this.date(r.expires_on)} · ${r.location}
            <span class="detail">${t("book.count", { n: r.packages })}</span></span
          >`,
        ),
      )}
    </fieldset>`;
  }

  static styles = [
    formStyles,
    css`
      .scan {
        display: flex;
        gap: 8px;
        margin-bottom: 12px;
      }
      .scan input {
        flex: 1;
      }
      .scan button {
        flex: none;
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .done {
        margin: 0 0 12px;
      }
      .after {
        margin-top: 12px;
      }
      .book {
        max-width: 480px;
      }
      fieldset {
        border: 0;
        margin: 0 0 12px;
        padding: 0;
      }
      fieldset .check {
        margin-bottom: 8px;
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

customElements.define("pantry-booking", PantryBooking);
