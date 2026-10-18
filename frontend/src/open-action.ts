import { html, nothing } from "lit";
import { mdiPackageVariant } from "@mdi/js";
import { t } from "./i18n";
import { icon } from "./ui";
import { doneLine } from "./booking-done";
import { fmtDate } from "./format";
import { errorMessage, getStock, type Hass, type StockRow } from "./api";
import { openPackage, undoOpen, type Opened } from "./api-open";

/** A label to print for an opened package (its new effective date); the label dialog confirms. */
export interface LabelRequest {
  id: number;
  name: string;
  packages: number;
}

/** Asks the stock view (which holds the label dialog) to open it; bubbles from the booking input. */
export const requestLabel = (from: EventTarget, o: Opened) =>
  from.dispatchEvent(
    new CustomEvent<LabelRequest>("pantry-print-label", {
      detail: { id: o.batch_id, name: o.name, packages: 1 },
      bubbles: true,
      composed: true,
    }),
  );

/** "„Milch“ angebrochen, haltbar bis …" with undo and *Etikett drucken*; testids `<prefix>-done`,
 *  `<prefix>-undo`, `<prefix>-label`. */
export function openedLine(
  hass: Hass | undefined,
  o: Opened | undefined,
  undo: () => void,
  print: () => void,
  prefix: string,
) {
  if (!o) return nothing;
  const message = o.expires_on
    ? t("stock.opened_until", { name: o.name, date: fmtDate(hass, o.expires_on) })
    : t("stock.opened_one", { name: o.name });
  return doneLine(
    message,
    undo,
    prefix,
    html`<button type="button" class="undo" data-testid=${`${prefix}-label`} @click=${print}>
      ${t("stock.opened_label")}
    </button>`,
  );
}

/** The stock view's state that the batch row button changes. */
interface OpenHost {
  hass?: Hass;
  stock?: StockRow[];
  opened?: Opened;
  error: string;
}

async function apply(host: OpenHost, call: () => Promise<Opened | undefined>) {
  const before = host.opened;
  host.error = "";
  host.opened = undefined; // a double click cannot undo twice
  try {
    host.opened = await call();
    host.stock = await getStock(host.hass!);
  } catch (err) {
    host.opened = before;
    host.error = await errorMessage(host.hass!, err);
  }
}

/** Undo the last opening (the backend refuses a second undo of the same booking). */
export const undoOpened = (host: OpenHost) => {
  const o = host.opened;
  if (o) return apply(host, () => undoOpen(host.hass!, o.booking_id).then(() => undefined));
};

/** *Anbrechen* button for an unopened batch row; nothing on an opened one. */
export const openButton = (host: OpenHost, name: string, b: StockRow) => {
  if (b.opened_on) return nothing;
  const label = t("stock.open_one", { name });
  return html`<button
    class="icon-btn"
    data-testid="stock-batch-open"
    aria-label=${label}
    title=${label}
    @click=${() =>
      apply(host, () =>
        openPackage(host.hass!, {
          product_id: b.product_id,
          batch_id: b.batch_id,
          location_id: b.location_id,
        }),
      )}
  >
    ${icon(mdiPackageVariant)}
  </button>`;
};
