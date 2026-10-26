import { html } from "lit";
import { t } from "./i18n";
import type { TransferReport, TransferRow } from "./api-transfer";

/** Rows listed per group before "und N weitere". */
const SHOWN = 100;
const GROUPS = ["create", "update", "error", "skip"] as const;

/** Translated text of a dynamic key; `other` (with the key) when there is none. */
const lookup = (k: string, other: string) => {
  const text = t(k);
  return text === k ? other : text;
};

const value = (v: string | number | null) => (v === null || v === "" ? "–" : String(v));

const detail = (r: TransferRow) =>
  r.reason
    ? [lookup(`transfer.reason.${r.reason}`, t("transfer.reason.other", { key: r.reason }))]
    : r.kind === "category" || r.kind === "location"
      ? [t(`transfer.new.${r.kind}`)]
      : r.changes.map(
          (c) =>
            `${lookup(`transfer.field.${c.field}`, c.field)}: ${value(c.old)} → ${value(c.new)}`,
        );

/** What an import would do: counts, then the rows by outcome (the body of the "Import prüfen" question). */
export const previewBody = (report: TransferReport) =>
  html`<p data-testid="transfer-counts">${t("transfer.counts", { ...report.counts })}</p>
    ${GROUPS.map((action) => {
      const rows = report.rows.filter((r) => r.action === action);
      if (!rows.length) return "";
      return html`<ul class="impact" data-testid=${`transfer-${action}`}>
        <li><span class="kind">${t(`transfer.group.${action}`, { n: rows.length })}</span></li>
        ${rows.slice(0, SHOWN).map(
          (r) =>
            html`<li>
              <span class="kind">${t("transfer.row", { line: r.line, name: r.name })}</span>
              ${detail(r).map((d) => html`<span class="names">${d}</span>`)}
            </li>`,
        )}
        ${
          rows.length > SHOWN
            ? html`<li>
                <span class="names">${t("transfer.more", { n: rows.length - SHOWN })}</span>
              </li>`
            : ""
        }
      </ul>`;
    })}`;
