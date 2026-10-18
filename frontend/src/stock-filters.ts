import { css, html } from "lit";
import { t } from "./i18n";
import type { MasterData } from "./api";

/** The stock view's filter state; the view owns it (reactive properties). */
interface StockFilterHost {
  md?: MasterData;
  location: number | null;
  withEmpty: boolean;
}

/** Location filter and "also products without stock" (the text filter is the booking input). */
export const stockFilters = (h: StockFilterHost) =>
  html`<div class="filters">
      <select
        data-testid="stock-location"
        aria-label=${t("stock.location")}
        @change=${(e: Event) => (h.location = Number((e.target as HTMLSelectElement).value) || null)}
      >
        <option value="" .selected=${h.location == null}>${t("stock.all_locations")}</option>
        ${(h.md?.locations ?? []).map(
          (l) => html`<option value=${l.id} .selected=${l.id === h.location}>${l.name}</option>`,
        )}
      </select>
    </div>
    <label class="check">
      <input
        type="checkbox"
        data-testid="stock-with-empty"
        .checked=${h.withEmpty}
        @change=${(e: Event) => (h.withEmpty = (e.target as HTMLInputElement).checked)}
      />
      ${t("stock.with_empty")}
    </label>`;

export const stockFilterStyles = css`
  .filters {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    margin-bottom: 8px;
  }
`;
