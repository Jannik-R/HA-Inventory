import { html } from "lit";
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

/** Fixed location for the following scans (also set by a scanned location label); empty = the product's default. */
export const locationSelect = (
  locations: Location[],
  at: Location | undefined,
  pick: (l: Location | undefined) => void,
) =>
  html`<label>
    <span class="lbl">${t("book.location")}</span>
    <select
      data-testid="booking-location"
      @change=${(e: Event) =>
        pick(locations.find((l) => (e.target as HTMLSelectElement).value === String(l.id)))}
    >
      <option value="" .selected=${!at}>${t("book.location_auto")}</option>
      ${locations.map((l) => html`<option value=${l.id} .selected=${l.id === at?.id}>${l.name}</option>`)}
    </select>
  </label>`;

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
