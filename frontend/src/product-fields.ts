import { html } from "lit";
import { t } from "./i18n";
import { fieldMsg, numOrNull } from "./ui";
import { fmtNumber } from "./format";
import { inheritNumber } from "./inherit";
import type { Hass, MasterData, Product } from "./api";
import "./category-picker";

export const blankProduct = (p: Partial<Product> = {}): Product => ({
  ean: null,
  name: "",
  brand: null,
  category_id: null,
  content_amount: null,
  content_unit_id: null,
  ...p,
});

export type Errors = Record<string, string>;

/** Field errors of a product's own data (name, category, content). */
export function productErrors(p: Product): Errors {
  const e: Errors = {};
  if (!p.name.trim()) e.name = t("valid.required");
  if (p.category_id == null) e.category = t("book.category_required");
  if (p.content_amount != null && !(p.content_amount > 0)) e.content = t("valid.positive");
  else if ((p.content_amount == null) !== (p.content_unit_id == null))
    e.content = t("valid.content_pair");
  if (p.min_packages != null && !(Number.isInteger(p.min_packages) && p.min_packages >= 1))
    e.min_packages = t("valid.packages");
  return e;
}

/** Name, brand, category, package content and min packages of a product (booking form and product page). */
export function productFields(
  md: MasterData | undefined,
  p: Product,
  set: (field: keyof Product, value: unknown) => void,
  errors: Errors = {},
  hass?: Hass, // lets the category picker create a new category
) {
  return html`<label>
      <span class="lbl">${t("common.name")}</span>
      <input
        id="name"
        data-testid="name"
        required
        aria-invalid=${!!errors.name}
        .value=${p.name}
        @input=${(e: Event) => set("name", (e.target as HTMLInputElement).value)}
      />
      ${fieldMsg(errors.name, "name")}
    </label>
    <label>
      <span class="lbl">${t("book.brand")}</span>
      <input
        data-testid="brand"
        .value=${p.brand ?? ""}
        @input=${(e: Event) => set("brand", (e.target as HTMLInputElement).value || null)}
      />
    </label>
    <div class="field">
      <span class="lbl">${t("book.category")}</span>
      <pantry-category-picker
        .categories=${md?.categories ?? []}
        .value=${p.category_id}
        .hass=${hass}
        @change=${(e: CustomEvent<number>) => set("category_id", e.detail)}
      ></pantry-category-picker>
      ${fieldMsg(errors.category, "category")}
    </div>
    <div class="pair">
      <label>
        <span class="lbl">${t("book.content")}</span>
        <input
          data-testid="content-amount"
          type="number"
          inputmode="decimal"
          min="0"
          step="any"
          aria-invalid=${!!errors.content}
          .value=${p.content_amount == null ? "" : String(p.content_amount)}
          @input=${(e: Event) => {
            const v = (e.target as HTMLInputElement).value;
            set("content_amount", numOrNull(v));
          }}
        />
      </label>
      <label>
        <span class="lbl">${t("book.content_unit")}</span>
        <select
          data-testid="content-unit"
          aria-invalid=${!!errors.content}
          @change=${(e: Event) => set("content_unit_id", Number((e.target as HTMLSelectElement).value) || null)}
        >
          <option value="" .selected=${p.content_unit_id == null}>${t("common.none_dash")}</option>
          ${(md?.units ?? []).map(
            (u) =>
              html`<option value=${u.id} .selected=${u.id === p.content_unit_id}>
                ${u.symbol || u.name}
              </option>`,
          )}
        </select>
      </label>
    </div>
    ${fieldMsg(errors.content, "content")}
    <label>
      <span class="lbl">${t("products.min_packages")}</span>
      ${inheritNumber({
        testid: "min-packages",
        own: p.min_packages,
        dflt: undefined, // not inherited; the category's minimum counts the whole subtree
        format: String,
        suffix: t("book.packages"),
        invalid: !!errors.min_packages,
        onChange: (v) => set("min_packages", v),
      })}
      ${fieldMsg(errors.min_packages, "min-packages")}
    </label>`;
}

/** "Spaghetti No. 5 · Barilla · 500 g · Nudeln, Reis & Getreide › Nudeln" */
export function productSummary(
  md: MasterData | undefined,
  p: Product,
  path: string,
  hass?: Hass,
): string {
  const unit = md?.units.find((u) => u.id === p.content_unit_id);
  const content =
    p.content_amount != null && unit
      ? `${fmtNumber(hass, p.content_amount)} ${unit.symbol || unit.name}`
      : "";
  return [p.name, p.brand, content, path].filter(Boolean).join(" · ");
}
