import { html } from "lit";
import { mdiMinusCircleOutline } from "@mdi/js";
import { t } from "./i18n";
import { icon } from "./ui";
import { doneLine } from "./booking-done";
import {
  bookOut,
  errorMessage,
  getStock,
  putBack,
  type Hass,
  type StockRow,
  type Taken,
} from "./api";

/** The last package taken out, for undo: the bookings it created. */
export interface Undo {
  name: string;
  taken: Taken[];
}

/** A view showing stock rows with take-out (stock, expiry); its reactive state is updated here. */
interface TakeOutHost {
  hass?: Hass;
  stock?: StockRow[];
  undo?: Undo;
  error: string;
}

/** Runs one action; `undo` is cleared first, so a double click cannot undo twice, and comes
 *  back when the action fails (the earlier booking can still be undone). */
async function apply(host: TakeOutHost, call: () => Promise<Undo | undefined>) {
  const before = host.undo;
  host.error = "";
  host.undo = undefined;
  try {
    host.undo = await call();
    host.stock = await getStock(host.hass!);
  } catch (err) {
    host.undo = before;
    host.error = await errorMessage(host.hass!, err);
  }
}

/** One package out of that batch and location; remembered for undo. */
const takeOut = (host: TakeOutHost, name: string, b: StockRow) =>
  apply(host, async () => {
    const { taken } = await bookOut(host.hass!, {
      product_id: b.product_id,
      packages: 1,
      batch_id: b.batch_id,
      location_id: b.location_id,
    });
    return { name, taken };
  });

/** Undo = put the booking back (the backend refuses a second undo of the same booking). */
const undoTake = (host: TakeOutHost) => {
  const u = host.undo;
  if (!u) return;
  return apply(host, async () => {
    await putBack(host.hass!, u.taken);
    return undefined;
  });
};

/** Minus button for a batch row. */
export const outButton = (host: TakeOutHost, name: string, b: StockRow, testid: string) => {
  const label = t("stock.take_one", { name });
  return html`<button
    class="icon-btn"
    data-testid=${testid}
    aria-label=${label}
    title=${label}
    @click=${() => takeOut(host, name, b)}
  >
    ${icon(mdiMinusCircleOutline)}
  </button>`;
};

/** Status line "1 Pkg. … ausgelagert." with undo; testids `<prefix>-done` / `<prefix>-undo`. */
export const undoLine = (host: TakeOutHost, prefix: string) =>
  doneLine(
    host.undo ? t("stock.taken_one", { name: host.undo.name }) : "",
    host.undo && (() => undoTake(host)),
    prefix,
  );
