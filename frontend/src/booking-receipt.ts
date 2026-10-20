import { html, nothing } from "lit";
import { mdiReceiptTextOutline } from "@mdi/js";
import { t } from "./i18n";
import { icon } from "./ui";
import { hasExternal } from "./modules";
import type { Hass, MasterData } from "./api";
import "./receipt-import";
import type { HomeInventoryReceiptImport } from "./receipt-import";

/** *Kassenbon importieren* under the booking input (book-in mode, only with the AI) and its dialog. */
export const receiptEntry = (
  hass: Hass | undefined,
  md: MasterData | undefined,
  bookingIn: boolean,
  booked: (e: CustomEvent<number>) => void,
) =>
  html`${
      bookingIn && hasExternal("receipt_import")
        ? html`<button
            type="button"
            class="receipt"
            data-testid="receipt-import"
            @click=${(e: Event) =>
              (e.target as Element)
                .closest("button")!
                .parentNode!.querySelector<HomeInventoryReceiptImport>(
                  "home-inventory-receipt-import",
                )!
                .open()}
          >
            ${icon(mdiReceiptTextOutline)} ${t("receipt.open")}
          </button>`
        : nothing
    }
    <home-inventory-receipt-import
      .hass=${hass}
      .md=${md}
      @booked=${booked}
    ></home-inventory-receipt-import>`;
