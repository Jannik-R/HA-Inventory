import { html } from "lit";
import { mdiTagOutline } from "@mdi/js";
import { t } from "./i18n";
import { chevron, icon, rowActions } from "./ui";
import { hasModule } from "./modules";
import { fmtDate } from "./format";
import { leftText } from "./remaining";
import { outButton, levelButton } from "./take-out";
import { openButton } from "./open-action";
import { frozenButton } from "./frozen-action";
import type { Hass, MasterData, Product, StockRow } from "./api";

/** "20.10.2026 · angebrochen am …, ca. ½ (ca. 250 g)": expiry with its qualifiers of one stock row. */
export function stockDate(hass: Hass | undefined, r: StockRow, product?: Product, md?: MasterData) {
  let date = r.expires_on ? fmtDate(hass, r.expires_on) : t("stock.no_date");
  if (r.expires_on && r.expiry_type === "guide") date = t("stock.approx_date", { date });
  else if (r.expiry_guessed) date = t("stock.guessed_date", { date });
  if (r.opened_on) {
    date = t("stock.opened_on", { date, opened: fmtDate(hass, r.opened_on) });
    if (r.remaining < 1) date += `, ${leftText(hass, r.remaining, product, md?.units)}`;
  }
  if (r.frozen_on) date = t("stock.frozen_on", { date, frozen: fmtDate(hass, r.frozen_on) });
  return r.charge ? t("stock.charge", { date, charge: r.charge }) : date;
}

/** What a batch row needs from the stock view. */
interface RowContext {
  host: Parameters<typeof outButton>[0] & Parameters<typeof openButton>[0];
  md?: MasterData;
  product?: Product;
  status: (b: StockRow) => string;
  date: (b: StockRow) => string;
  freeze: (b: StockRow, thaw: boolean) => void;
  label: (b: StockRow) => void;
  edit: (b: StockRow) => void;
}

/** One batch / location row under a product: date, location, count and its action buttons. */
export const batchRow = (c: RowContext, name: string, b: StockRow) =>
  html`<li data-testid="stock-batch">
    <span class=${c.status(b)}>${c.date(b)}</span>
    <span class="detail">${b.location}</span>
    <span class="count">${t("book.count", { n: b.packages })}</span>
    <span class="acts">
      ${outButton(c.host, name, b, "stock-batch-out")}
      ${hasModule("opened") && b.opened_on ? levelButton(c.host, name, b) : ""}
      ${hasModule("opened") && !b.frozen_on ? openButton(c.host, name, b) : ""}
      ${hasModule("frozen") ? frozenButton(c.md, c.product, b, (thaw) => c.freeze(b, thaw)) : ""}
      <button
        class="icon-btn"
        data-testid="stock-batch-label"
        aria-label=${t("label.print_name", { name })}
        title=${t("label.print")}
        @click=${() => c.label(b)}
      >
        ${icon(mdiTagOutline)}
      </button>
      ${rowActions({
        testid: "batch",
        name: `${name}, ${c.date(b)}`,
        onEdit: () => c.edit(b),
      })}
    </span>
  </li>`;

/** A category row of the stock tree: open/close arrow, name and package count. */
export const categoryRow = (
  id: number,
  name: string,
  packages: number,
  depth: number,
  open: boolean,
  toggle: (key: string) => void,
) =>
  html`<li style="padding-left:${depth * 24}px">
    ${chevron(open, () => toggle(`c${id}`))}
    <button
      class="row"
      data-testid="stock-category"
      aria-expanded=${open}
      @click=${() => toggle(`c${id}`)}
    >
      <span>${name}</span>
      <span class="detail">${t("book.count", { n: packages })}</span>
    </button>
  </li>`;
