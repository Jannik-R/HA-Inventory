import { css, html, nothing } from "lit";
import { mdiMinusCircleOutline } from "@mdi/js";
import { t } from "./i18n";
import { icon } from "./ui";
import { bookIn, bookOut, errorMessage, getStock, type Hass, type StockRow } from "./api";

/** The last package taken out, for undo. */
export interface Taken {
  name: string;
  row: StockRow;
}

/** A view showing stock rows with take-out (stock, expiry); its reactive state is updated here. */
export interface TakeOutHost {
  hass?: Hass;
  stock?: StockRow[];
  undo?: Taken;
  error: string;
}

async function apply(host: TakeOutHost, call: () => Promise<unknown>, undo?: Taken) {
  try {
    await call();
    host.undo = undo;
    host.stock = await getStock(host.hass!);
  } catch (err) {
    host.undo = undefined;
    host.error = await errorMessage(host.hass!, err);
  }
}

/** One package out of that batch and location; remembered for undo. */
const takeOut = (host: TakeOutHost, name: string, b: StockRow) =>
  apply(
    host,
    () =>
      bookOut(host.hass!, {
        product_id: b.product_id,
        packages: 1,
        batch_id: b.batch_id,
        location_id: b.location_id,
      }),
    { name, row: b },
  );

/** Undo = book the package back in; the same product and date merge into the same batch. */
const undoTake = (host: TakeOutHost) => {
  const { row } = host.undo!;
  return apply(host, () =>
    bookIn(host.hass!, {
      product_id: row.product_id,
      packages: 1,
      expires_on: row.expires_on,
      location_id: row.location_id,
    }),
  );
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
  html`<p class="done" role="status" data-testid=${`${prefix}-done`}>
    ${
      host.undo
        ? html`${t("stock.taken_one", { name: host.undo.name })}
            <button class="undo" data-testid=${`${prefix}-undo`} @click=${() => undoTake(host)}>
              ${t("stock.undo")}
            </button>`
        : nothing
    }
  </p>`;

export const takeOutStyles = css`
  .undo {
    padding: 4px 8px;
    color: var(--primary-color);
  }
  .done {
    display: flex;
    align-items: center;
    gap: 8px;
    min-height: 36px;
    margin: 0 0 4px;
    font-size: 0.875em;
    color: var(--secondary-text-color);
  }
`;
