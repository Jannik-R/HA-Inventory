import { css, html } from "lit";
import { t } from "./i18n";
import type { Hass, StockRow } from "./api";
import { fmtDate } from "./format";

export const AUTO = "auto";

/** The stock row a pick value names; undefined for AUTO. */
export const pickedRow = (rows: StockRow[] | undefined, pick: string) =>
  rows?.find((r) => `${r.batch_id}:${r.location_id}` === pick);

/** Book out: packages of the picked row, or of all rows. */
export const maxPackages = (rows: StockRow[] | undefined, pick: string): number | undefined =>
  pickedRow(rows, pick)?.packages ?? rows?.reduce((n, r) => n + r.packages, 0);

/** Book out: earliest expiry first by default, or one specific batch at one location. */
export function renderPick(
  hass: Hass | undefined,
  rows: StockRow[],
  pick: string,
  onPick: (value: string) => void,
) {
  const opt = (value: string, label: unknown) =>
    html`<label class="check">
      <input
        type="radio"
        name="pick"
        data-testid="pick"
        .value=${value}
        .checked=${pick === value}
        @change=${() => onPick(value)}
      />${label}
    </label>`;
  return html`<fieldset>
    <legend class="lbl">${t("book.which")}</legend>
    ${opt(AUTO, t("book.fefo"))}
    ${rows.map((r) =>
      opt(
        `${r.batch_id}:${r.location_id}`,
        html`<span
          >${r.expires_on ? fmtDate(hass, r.expires_on) : t("book.no_date")} · ${r.location}
          <span class="detail">${t("book.count", { n: r.packages })}</span></span
        >`,
      ),
    )}
  </fieldset>`;
}

export const pickStyles = css`
  fieldset {
    border: 0;
    margin: 0 0 12px;
    padding: 0;
  }
  fieldset .check {
    margin-bottom: 8px;
  }
`;
