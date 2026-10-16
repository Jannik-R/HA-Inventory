import { html } from "lit";
import { t } from "./i18n";
import { fieldMsg } from "./ui";
import type { MasterData } from "./api";
import type { Draft } from "./settings-dialog";

/** Live errors of the two minimums (each optional; amount > 0, packages a whole number ≥ 1). */
export function minErrors(d: Draft): Record<string, string> {
  const e: Record<string, string> = {};
  if (d.min_stock != null && !(d.min_stock > 0)) e.min_stock = t("valid.positive");
  if (d.min_packages != null && !(Number.isInteger(d.min_packages) && d.min_packages >= 1))
    e.min_packages = t("valid.packages");
  return e;
}

/**
 * Category min stock fields: an amount with its own unit (kept when the category's unit changes;
 * a new amount starts in the effective unit) and a package count.
 */
export function minFields(o: {
  md: MasterData;
  d: Draft;
  errs: Record<string, string>;
  unitId: number | null;
  set: (key: string, value: unknown) => void;
}) {
  const { d, errs } = o;
  const num = (e: Event) => {
    const v = (e.target as HTMLInputElement).value;
    return v === "" || Number(v) === 0 ? null : Number(v);
  };
  return html`<label>
      <span class="lbl" title=${t("tip.min_stock")}>${t("settings.category.min_stock")}</span>
      <span class="num">
        <input
          type="number"
          step="any"
          min="0"
          data-testid="min_stock"
          aria-invalid=${!!errs.min_stock}
          .value=${String(d.min_stock ?? "")}
          @input=${(e: Event) => {
            const n = num(e);
            o.set("min_stock", n);
            o.set("min_stock_unit_id", n == null ? null : (d.min_stock_unit_id ?? o.unitId));
          }}
        />
        <select
          data-testid="min_stock_unit"
          aria-label=${t("settings.category.unit")}
          ?disabled=${d.min_stock == null}
          @change=${(e: Event) =>
            o.set("min_stock_unit_id", Number((e.target as HTMLSelectElement).value))}
        >
          ${o.md.units.map(
            (u) =>
              html`<option value=${u.id} .selected=${u.id === (d.min_stock_unit_id ?? o.unitId)}>
                ${u.symbol || u.name}
              </option>`,
          )}
        </select>
      </span>
      ${fieldMsg(errs.min_stock, "min_stock")}
    </label>
    <label>
      <span class="lbl" title=${t("tip.min_packages")}>${t("settings.category.min_packages")}</span>
      <span class="num">
        <input
          type="number"
          step="1"
          min="0"
          inputmode="numeric"
          data-testid="min_packages"
          aria-invalid=${!!errs.min_packages}
          .value=${String(d.min_packages ?? "")}
          @input=${(e: Event) => o.set("min_packages", num(e))}
        />
        <span class="detail">${t("book.packages")}</span>
      </span>
      ${fieldMsg(errs.min_packages, "min_packages")}
    </label>
    <p class="detail">${t("settings.category.min_hint")}</p>`;
}
