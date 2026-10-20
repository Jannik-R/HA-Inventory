import { html, nothing } from "lit";
import { mdiTagOutline } from "@mdi/js";
import { t } from "./i18n";
import { icon } from "./ui";
import { getMasterData, type Hass, type Location } from "./api";

/** A location label: `PTRY:L<id>` (an item label is `PTRY:<ean or P id>:…`). */
const LOCATION_CODE = /^PTRY:L(\d+)$/i;

export const isLocationCode = (code: string) => LOCATION_CODE.test(code.trim());

/** The active location a scanned location code names (fresh master data: it may be new);
 *  null = unknown or inactive. */
export async function scannedLocation(hass: Hass, code: string): Promise<Location | null> {
  const id = Number(LOCATION_CODE.exec(code.trim())![1]);
  return (await getMasterData(hass)).locations.find((l) => l.id === id) ?? null;
}

/** "Lagerort: Keller" above the bookings while a scanned location applies, with a clear button. */
export const locationLine = (name: string | undefined, clear: () => void) =>
  name
    ? html`<p class="done" role="status" data-testid="scanned-location">
        ${t("location_label.active", { name })}
        <button type="button" class="undo" data-testid="scanned-location-clear" @click=${clear}>
          ${t("location_label.clear")}
        </button>
      </p>`
    : nothing;

/** Location row (settings): print its label, code PTRY:L<id>. */
export const locationLabelButton = (l: { name: string }, open: () => void) => {
  const label = t("location_label.print", { name: l.name });
  return html`<button
    class="icon-btn"
    data-testid="location-label"
    aria-label=${label}
    title=${label}
    @click=${open}
  >
    ${icon(mdiTagOutline)}
  </button>`;
};
