import { css, html, nothing } from "lit";
import { t } from "./i18n";
import { fieldMsg } from "./ui";
import { fmtAmount, fmtDate } from "./format";
import { levelSelect, lowerLevel } from "./remaining";
import type { Hass } from "./api";
import type { CookedAction, CookedBatch, CookedCandidate, CookedRow } from "./api-cooked";

/** One ingredient row of the "Gekocht" dialog: the proposal plus what the user changed. */
export interface Row {
  src: CookedRow;
  checked: boolean;
  product_id: number;
  batch_id: number | null;
  packages: number | null;
  open: number;
  /** Level of the opened or reduced package afterwards (null = unchanged). */
  remaining: number | null;
  action: CookedAction;
}

export const candidate = (r: Row) => r.src.candidates.find((c) => c.product_id === r.product_id)!;
/** The defaults the backend proposes for that product (batch reset to earliest first). */
export const defaults = (c: CookedCandidate) => ({
  product_id: c.product_id,
  batch_id: c.batch_id,
  packages: c.packages,
  open: c.open,
  remaining: c.remaining ?? null,
  action: c.action,
});

/** Only unopened, unfrozen packages can be opened. */
const openable = (b: CookedBatch) => !b.opened && !b.frozen;
const sum = (bs: CookedBatch[]) => bs.reduce((a, b) => a + b.packages, 0);
const batchesFor = (r: Row) =>
  r.action === "open"
    ? candidate(r).batches.filter(openable)
    : r.action === "reduce"
      ? candidate(r).batches.filter((b) => b.opened)
      : candidate(r).batches;

/** The opened batch a reduce uses: the chosen one, else a partly used one first (as the backend). */
const reduceBatch = (r: Row) =>
  candidate(r)
    .batches.filter((b) => b.opened && (r.batch_id == null || b.batch_id === r.batch_id))
    .sort((a, b) => Number((a.remaining ?? 1) === 1) - Number((b.remaining ?? 1) === 1))[0];

/** Live validation of a checked row (undefined = fine). */
export const rowError = (r: Row): string | undefined => {
  if (!r.checked || r.action === "skip") return;
  if (r.action === "reduce") {
    const b = reduceBatch(r);
    if (!b) return t("cooked.no_opened");
    if (r.remaining == null || r.remaining >= (b.remaining ?? 1) - 1e-9)
      return t("valid.level_below");
    return;
  }
  const n = r.packages;
  const none = n === 0 && !(r.action === "out" && r.open > 0);
  if (n == null || !Number.isInteger(n) || n < 0 || none) return t("valid.packages");
  const max = sum(batchesFor(r).filter((b) => r.batch_id == null || b.batch_id === r.batch_id));
  if (n > max) return t("valid.max_packages", { n: max });
  const fresh = sum(candidate(r).batches.filter(openable));
  if (r.action === "out" && n + r.open > fresh) return t("valid.max_packages", { n: fresh });
};

const select = (
  label: string,
  testid: string,
  value: string,
  opts: [string, string][],
  on: (v: string) => void,
) =>
  html`<label>
    <span class="lbl">${label}</span>
    <select
      data-testid=${testid}
      .value=${value}
      @change=${(e: Event) => on((e.target as HTMLSelectElement).value)}
    >
      ${opts.map(([v, text]) => html`<option value=${v} ?selected=${v === value}>${text}</option>`)}
    </select>
  </label>`;

const batchText = (hass: Hass | undefined, b: CookedBatch) => {
  const date = b.expires_on ? fmtDate(hass, b.expires_on) : t("cooked.no_date");
  const parts = [date, b.location, t("cooked.pkg", { n: b.packages })];
  if (b.opened) parts.push(t("cooked.opened"));
  if (b.frozen) parts.push(t("cooked.frozen"));
  return parts.join(", ");
};

export const cookedRow = (o: {
  hass?: Hass;
  r: Row;
  err?: string;
  change: (patch: Partial<Row>) => void;
}) => {
  const { r, err, change } = o;
  const s = r.src;
  const what = [s.amount != null ? fmtAmount(o.hass, s.amount, s.unit_symbol) : "", s.text]
    .filter(Boolean)
    .join(" ");
  const batches: [string, string][] = batchesFor(r).map((b) => [
    String(b.batch_id),
    batchText(o.hass, b),
  ]);
  return html`<li class="crow" data-testid="cooked-row">
    <label class="check">
      <input
        type="checkbox"
        data-testid="cooked-check"
        .checked=${r.checked}
        @change=${(e: Event) => change({ checked: (e.target as HTMLInputElement).checked })}
      />
      <span
        >${what}${
          s.optional ? html` <span class="detail">${t("recipes.optional")}</span>` : nothing
        }</span
      >
    </label>
    <div class="ctl">
      ${select(
        t("cooked.product"),
        "cooked-product",
        String(r.product_id),
        s.candidates.map((x) => [
          String(x.product_id),
          x.brand ? `${x.name} (${x.brand})` : x.name,
        ]),
        (v) => change(defaults(s.candidates.find((x) => String(x.product_id) === v)!)),
      )}
      ${select(
        t("cooked.batch"),
        "cooked-batch",
        r.batch_id == null ? "" : String(r.batch_id),
        [["", t("cooked.fefo")], ...batches],
        (v) => change({ batch_id: v === "" ? null : Number(v) }),
      )}
      <label class="pk">
        <span class="lbl">${t("cooked.packages")}</span>
        <input
          type="number"
          min="0"
          step="1"
          inputmode="numeric"
          data-testid="cooked-packages"
          aria-invalid=${!!err}
          .value=${String(r.packages ?? "")}
          @input=${(e: Event) => {
            const v = (e.target as HTMLInputElement).value;
            change({ packages: v === "" ? null : Number(v) });
          }}
        />
      </label>
      ${select(
        t("cooked.action"),
        "cooked-action",
        r.action,
        (["out", "open", "reduce", "skip"] as const).map((a) => [a, t(`cooked.action.${a}`)]),
        (v) => {
          const action = v as CookedAction;
          // a batch that cannot be opened (reduced) is no longer offered: back to earliest first
          const ok =
            (action !== "open" && action !== "reduce") ||
            candidate(r).batches.some(
              (b) => b.batch_id === r.batch_id && (action === "open" ? openable(b) : b.opened),
            );
          const next = { ...r, action, batch_id: ok ? r.batch_id : null };
          // a reduce starts one level below the current one (never null or "voll")
          const b = action === "reduce" ? reduceBatch(next) : undefined;
          change({
            action,
            ...(ok ? {} : { batch_id: null }),
            ...(b ? { remaining: lowerLevel(b.remaining ?? 1) } : {}),
          });
        },
      )}
    </div>
    ${
      r.action === "out"
        ? html`<label class="check also">
            <input
              type="checkbox"
              data-testid="cooked-also-open"
              .checked=${r.open > 0}
              @change=${(e: Event) => change({ open: (e.target as HTMLInputElement).checked ? 1 : 0 })}
            />
            ${t("cooked.also_open")}
          </label>`
        : nothing
    }
    ${
      r.action === "reduce" || r.action === "open" || (r.action === "out" && r.open > 0)
        ? html`<label class="lvl">
            <span class="lbl">${t("cooked.left_after")}</span>
            ${levelSelect({
              value: r.remaining ?? 1,
              empty: r.action === "reduce",
              label: t("cooked.left_after"),
              testid: "cooked-level",
              on: (remaining) => change({ remaining }),
            })}
          </label>`
        : nothing
    }
    ${fieldMsg(err, "cooked-packages")}
  </li>`;
};

export const cookedRowStyles = css`
  .crow {
    display: block;
    padding: 8px 0;
  }
  .ctl {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin: 6px 0 0 24px;
  }
  .ctl label {
    display: flex;
    flex-direction: column;
    flex: 1 1 160px;
    min-width: 0;
  }
  .ctl .pk {
    flex: 0 0 90px;
  }
  .also,
  .lvl {
    margin: 6px 0 0 24px;
  }
  .lvl {
    display: flex;
    flex-direction: column;
    max-width: 160px;
  }
  select,
  input[type="number"] {
    font: inherit;
    min-width: 0;
    box-sizing: border-box;
    width: 100%;
  }
`;
