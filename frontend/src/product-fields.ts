import { html } from "lit";
import { t } from "./i18n";
import { fieldMsg } from "./ui";
import type { MasterData, Product } from "./api";
import "./category-picker";

export type Errors = Record<string, string>;

/** Field errors of a product's own data (name, category, content). */
export function productErrors(p: Product): Errors {
  const e: Errors = {};
  if (!p.name.trim()) e.name = t("valid.required");
  if (p.category_id == null) e.category = t("book.category_required");
  if (p.content_amount != null && !(p.content_amount > 0)) e.content = t("valid.positive");
  else if ((p.content_amount == null) !== (p.content_unit_id == null)) e.content = t("valid.content_pair");
  return e;
}

/** Name, brand, category and package content of a product (booking form and product page). */
export function productFields(
  md: MasterData | undefined,
  p: Product,
  set: (field: keyof Product, value: unknown) => void,
  errors: Errors = {},
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
            set("content_amount", v === "" ? null : Number(v));
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
          <option value="" ?selected=${p.content_unit_id == null}>–</option>
          ${(md?.units ?? []).map(
            (u) =>
              html`<option value=${u.id} ?selected=${u.id === p.content_unit_id}>
                ${u.symbol || u.name}
              </option>`,
          )}
        </select>
      </label>
    </div>
    ${fieldMsg(errors.content, "content")}`;
}

/** "Spaghetti No. 5 · Barilla · 500 g · Nudeln, Reis & Getreide › Nudeln" */
export function productSummary(md: MasterData | undefined, p: Product, path: string, lang?: string): string {
  const unit = md?.units.find((u) => u.id === p.content_unit_id);
  const content =
    p.content_amount != null && unit ? `${new Intl.NumberFormat(lang).format(p.content_amount)} ${unit.symbol || unit.name}` : "";
  return [p.name, p.brand, content, path].filter(Boolean).join(" · ");
}
