import { html } from "lit";
import { t } from "./i18n";
import { fmtAmount } from "./format";
import type { Hass, Product, Unit } from "./api";

/** Choosable levels of a partly used package; 0.1 = almost empty. 0 (empty) is offered separately. */
const LEVELS = [1, 0.75, 0.5, 0.25, 0.1];
const KEYS: Record<number, string> = {
  1: "level.full",
  0.75: "level.three_quarters",
  0.5: "level.half",
  0.25: "level.quarter",
  0.1: "level.low",
  0: "level.empty",
};

/** The offered level closest to `v`; below 1 never "voll". */
export const nearest = (v: number) =>
  (v < 1 ? LEVELS.slice(1) : LEVELS).reduce((a, b) => (Math.abs(b - v) < Math.abs(a - v) ? b : a));

/** The next offered level below `v` (`v` itself when it is the lowest). */
export const lowerLevel = (v: number) => LEVELS.find((l) => l < v - 1e-9) ?? v;

export const levelLabel = (v: number) => t(KEYS[v === 0 ? 0 : nearest(v)]);

/** "ca. ½ (ca. 250 g)" / "fast leer"; the amount only when the package content is known. */
export function leftText(
  hass: Hass | undefined,
  remaining: number,
  product: Product | undefined,
  units: Unit[] = [],
) {
  const near = nearest(remaining);
  const left = near === 0.1 ? levelLabel(near) : t("stock.left", { level: levelLabel(near) });
  const unit = units.find((u) => u.id === product?.content_unit_id);
  if (!unit || !product?.content_amount) return left;
  const amount = fmtAmount(
    hass,
    Math.round(remaining * product.content_amount * 10) / 10,
    unit.symbol,
  );
  return t("stock.left_amount", { left, amount });
}

/** Plain select of the levels (`empty`: also "leer"); `on` gets the chosen level. */
export const levelSelect = (o: {
  value: number;
  empty: boolean;
  label: string;
  testid: string;
  on: (v: number) => void;
}) => {
  const current = nearest(o.value);
  const options = o.empty ? [...LEVELS, 0] : LEVELS;
  return html`<select
    data-testid=${o.testid}
    aria-label=${o.label}
    title=${o.label}
    @change=${(e: Event) => o.on(Number((e.target as HTMLSelectElement).value))}
  >
    ${options.map(
      (v) => html`<option value=${v} ?selected=${v === current}>${levelLabel(v)}</option>`,
    )}
  </select>`;
};
