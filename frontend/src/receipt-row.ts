import { css, html, nothing } from "lit";
import { t } from "./i18n";
import { dateInvalid, fieldMsg, todayIso } from "./ui";
import type { Hass, MasterData } from "./api";
import type { ReceiptItem } from "./api-purchase";
import { categoryDefault } from "./inherit";
import { plusDays } from "./plan-dates";
import "./category-picker";

/** A product id from the candidates, a new product, not booked, or not chosen yet. */
export type Choice = number | "new" | "skip" | null;
export interface Row {
  item: ReceiptItem;
  choice: Choice;
  name: string;
  category_id: number | null;
  packages: number;
  expires_on: string;
  dateBad: boolean;
}
type Errors = Partial<Record<"choice" | "name" | "category" | "packages" | "expires", string>>;

/** Field errors of one line (a skipped line has none but the choice). */
export function rowErrors(r: Row): Errors {
  const e: Errors = {};
  if (r.choice === null) e.choice = t("receipt.choose");
  if (r.choice === "skip") return e;
  if (r.choice === "new" && !r.name.trim()) e.name = t("valid.required");
  if (r.choice === "new" && r.category_id == null) e.category = t("valid.required");
  if (!(Number.isInteger(r.packages) && r.packages >= 1 && r.packages <= 9999))
    e.packages = t("valid.packages");
  if (dateInvalid(r.dateBad, r.expires_on)) e.expires = t("valid.date");
  return e;
}

/** Shelf life of the chosen product (or the new product's category) as a date, "" without one. */
export function rowGuess(r: Row, md: MasterData | undefined): string {
  const days =
    typeof r.choice === "number"
      ? r.item.candidates.find((c) => c.id === r.choice)?.shelf_days
      : r.choice === "new"
        ? categoryDefault(md, r.category_id, "shelf_days")?.value
        : undefined;
  return days ? plusDays(todayIso(), Number(days)) : "";
}

/** One receipt line in the review: product choice, new product fields, packages, date. */
export function receiptRow(o: {
  r: Row;
  i: number;
  md?: MasterData;
  hass?: Hass;
  set: (patch: Partial<Row>) => void;
}) {
  const { r, i } = o;
  const err = rowErrors(r);
  const id = `r${i}`;
  const value = r.choice === null ? "" : String(r.choice);
  const guessHint = !r.expires_on && rowGuess(r, o.md) ? t("receipt.guess_hint") : "";
  return html`<li data-testid="receipt-row">
    <div class="text">${r.item.text}</div>
    <label>
      <span class="lbl">${t("receipt.product")}</span>
      <select
        data-testid="receipt-product"
        aria-invalid=${!!err.choice}
        .value=${value}
        @change=${(e: Event) => {
          const v = (e.target as HTMLSelectElement).value;
          o.set({ choice: v === "new" || v === "skip" ? v : Number(v) });
        }}
      >
        <option value="" disabled ?selected=${value === ""}>${t("receipt.choose_option")}</option>
        ${r.item.candidates.map(
          (c) =>
            html`<option value=${c.id} ?selected=${value === String(c.id)}>
              ${c.brand ? `${c.name} (${c.brand})` : c.name}
            </option>`,
        )}
        <option value="new" ?selected=${value === "new"}>${t("receipt.new")}</option>
        <option value="skip" ?selected=${value === "skip"}>${t("receipt.skip")}</option>
      </select>
      ${fieldMsg(err.choice, `${id}-product`)}
    </label>
    ${
      r.choice === "new"
        ? html`<label>
              <span class="lbl">${t("common.name")}</span>
              <input
                data-testid="receipt-name"
                aria-invalid=${!!err.name}
                .value=${r.name}
                @input=${(e: Event) => o.set({ name: (e.target as HTMLInputElement).value })}
              />
              ${fieldMsg(err.name, `${id}-name`)}
            </label>
            <div>
              <span class="lbl">${t("book.category")}</span>
              <pantry-category-picker
                .categories=${o.md?.categories ?? []}
                .value=${r.category_id}
                .hass=${o.hass}
                @change=${(e: CustomEvent<number>) => o.set({ category_id: e.detail })}
              ></pantry-category-picker>
              ${fieldMsg(err.category, `${id}-category`)}
            </div>`
        : nothing
    }
    ${
      r.choice === "skip"
        ? nothing
        : html`<div class="pair">
            <label>
              <span class="lbl">${t("book.packages")}</span>
              <input
                type="number"
                min="1"
                max="9999"
                data-testid="receipt-packages"
                aria-invalid=${!!err.packages}
                .value=${String(r.packages)}
                @input=${(e: Event) =>
                  o.set({ packages: Number((e.target as HTMLInputElement).value) })}
              />
              ${fieldMsg(err.packages, `${id}-packages`)}
            </label>
            <label>
              <span class="lbl">${t("book.expires_on")}</span>
              <input
                type="date"
                min="2000-01-01"
                max="2099-12-31"
                data-testid="receipt-expires"
                aria-invalid=${!!err.expires}
                .value=${r.expires_on}
                @input=${(e: Event) => {
                  const el = e.target as HTMLInputElement;
                  o.set({ expires_on: el.value, dateBad: el.validity.badInput });
                }}
              />
              ${
                err.expires
                  ? fieldMsg(err.expires, `${id}-expires`)
                  : html`<span class="detail">${guessHint}</span>`
              }
            </label>
          </div>`
    }
  </li>`;
}

export const rowStyles = css`
  .rows {
    list-style: none;
    margin: 12px 0 0;
    padding: 0;
  }
  .rows li {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
    padding: 12px 0;
    border-top: 1px solid var(--divider-color);
  }
  .text {
    font-family: monospace;
    color: var(--secondary-text-color);
    overflow-wrap: anywhere;
  }
`;
