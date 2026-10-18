import { html, nothing } from "lit";
import { t } from "./i18n";
import { fieldMsg } from "./ui";
import type { Hass, MasterData, Product } from "./api";
import "./category-picker";

/** Product by name: an existing one from the list, or a new one that then needs a category.
 * `err`: required / category errors; testid prefix e.g. "canning" → "canning-product". */
export function productInput(o: {
  testid: string;
  label: string;
  hass?: Hass;
  md?: MasterData;
  products: Product[];
  name: string;
  categoryId: number | null;
  err: { name?: string; category?: string };
  onName: (name: string) => void;
  onCategory: (id: number) => void;
}) {
  const id = `${o.testid}-product`;
  const known = o.products.some((p) => p.name === o.name.trim());
  const isNew = !!o.name.trim() && !known;
  return html`<label>
      <span class="lbl">${o.label}</span>
      <input
        type="text"
        list=${`${id}s`}
        data-testid=${id}
        aria-invalid=${!!o.err.name}
        .value=${o.name}
        @input=${(ev: Event) => o.onName((ev.target as HTMLInputElement).value)}
      />
      <datalist id=${`${id}s`}>
        ${o.products.map((p) => html`<option value=${p.name}></option>`)}
      </datalist>
      ${fieldMsg(o.err.name ?? (isNew ? t("canning.new_product") : undefined), id, !o.err.name)}
    </label>
    ${
      isNew
        ? html`<div class="field">
            <span class="lbl">${t("book.category")}</span>
            <pantry-category-picker
              .categories=${o.md?.categories ?? []}
              .value=${o.categoryId}
              .hass=${o.hass}
              @change=${(ev: CustomEvent<number>) => o.onCategory(ev.detail)}
            ></pantry-category-picker>
            ${fieldMsg(o.err.category, `${id}-category`)}
          </div>`
        : nothing
    }`;
}
