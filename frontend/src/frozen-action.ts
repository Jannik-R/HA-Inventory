import { html, nothing } from "lit";
import { mdiSnowflake, mdiSnowflakeMelt } from "@mdi/js";
import { t } from "./i18n";
import { icon } from "./ui";
import { doneLine } from "./booking-done";
import { fmtDate } from "./format";
import {
  errorMessage,
  getStock,
  type Hass,
  type MasterData,
  type Product,
  type StockRow,
} from "./api";
import { undoFrozen, type Opened } from "./api-open";

/** The last freeze / thaw (done line with undo; a frozen batch offers its label). */
export interface FrozenDone {
  result: Opened;
  thaw: boolean;
}

/** A fresh food (not frozen goods) with days frozen: the panel offers *Einfrieren*. */
export function freezable(md: MasterData | undefined, p: Product | undefined) {
  if (!md || !p) return false;
  const e = md.categories.find((c) => c.id === p.category_id)?.effective;
  if (!e || e.food.value === 0 || e.frozen_goods.value === 1) return false;
  return (p.frozen_days ?? e.frozen_days.value) != null;
}

/** *Einfrieren* (fresh batch, not in a freezer) or *Auftauen* (frozen batch) on a batch row. */
export function frozenButton(
  md: MasterData | undefined,
  p: Product | undefined,
  b: StockRow,
  onClick: (thaw: boolean) => void,
) {
  const inFreezer = !!md?.locations.find((l) => l.id === b.location_id)?.freezer;
  const thaw = !!b.frozen_on;
  if (!thaw && (inFreezer || !freezable(md, p))) return nothing;
  const label = t(thaw ? "frozen.thaw_title" : "frozen.freeze_title", { name: b.name });
  return html`<button
    class="icon-btn"
    data-testid=${thaw ? "stock-batch-thaw" : "stock-batch-freeze"}
    aria-label=${label}
    title=${label}
    @click=${() => onClick(thaw)}
  >
    ${icon(thaw ? mdiSnowflakeMelt : mdiSnowflake)}
  </button>`;
}

/** "2 Pkg. „Hack“ eingefroren (Gefrierschrank), ca. bis …" with undo and, after freezing, a label. */
export function frozenLine(
  hass: Hass | undefined,
  done: FrozenDone | undefined,
  undo: () => void,
  print: () => void,
) {
  if (!done) return nothing;
  const o = done.result;
  const message = t(done.thaw ? "frozen.thawed" : "frozen.frozen", {
    name: o.name,
    location: o.location,
    date: o.expires_on ? fmtDate(hass, o.expires_on) : "",
  });
  return doneLine(
    message,
    undo,
    "frozen",
    done.thaw
      ? undefined
      : html`<button type="button" class="undo" data-testid="frozen-label" @click=${print}>
          ${t("stock.opened_label")}
        </button>`,
  );
}

interface FrozenHost {
  hass?: Hass;
  stock?: StockRow[];
  frozen?: FrozenDone;
  error: string;
}

/** Undo the last freeze / thaw (the backend refuses a second undo). */
export async function undoFrozenDone(host: FrozenHost) {
  const done = host.frozen;
  if (!done) return;
  host.frozen = undefined; // a double click cannot undo twice
  host.error = "";
  try {
    await undoFrozen(host.hass!, done.result.booking_id);
    host.stock = await getStock(host.hass!);
  } catch (err) {
    host.frozen = done;
    host.error = await errorMessage(host.hass!, err);
  }
}
