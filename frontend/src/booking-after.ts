import { t } from "./i18n";
import { doneLine } from "./booking-done";
import { bookOutLabel, putBack, type Hass, type Taken } from "./api";
import { freezeScan, openLabel, undoFrozen, undoOpen, type Opened } from "./api-open";
import { isLocationCode, scannedLocation } from "./location-scan";
import type { Location } from "./api";
import type { Mode } from "./booking-modes";
import { openedLine, requestLabel } from "./open-action";
import { frozenLine, type FrozenDone } from "./frozen-action";

/** The booking input's state after a booking: message, undo, the last opened package. */
export interface AfterHost extends EventTarget {
  hass?: Hass;
  message: string;
  image?: string | null;
  undo?: Taken[];
  opened?: Opened;
  /** The last freeze / thaw (scan mode Einfrieren). */
  frozen?: FrozenDone;
  seq: number;
  run<T>(fn: () => Promise<T>): Promise<T | undefined>;
  reset(): void;
  focusInput(): void;
}

const done = (host: AfterHost, message?: string) => {
  if (message !== undefined) host.message = message;
  host.dispatchEvent(new CustomEvent("booked"));
  host.focusInput();
};

/** A printed label books out one package of its batch. */
export async function scanLabel(host: AfterHost, code: string) {
  host.reset();
  const id = host.seq;
  const res = await host.run(() => bookOutLabel(host.hass!, code));
  if (id !== host.seq) return;
  if (!res) return host.focusInput();
  host.undo = res.taken;
  done(host, t("book.done_label", { name: res.name, where: res.location }));
}

/** Open one package; the done line offers undo and a new label. */
export async function openWith(host: AfterHost, call: () => Promise<Opened>) {
  host.reset();
  const id = host.seq;
  const res = await host.run(call);
  if (id !== host.seq) return;
  if (!res) return host.focusInput();
  host.opened = res;
  done(host);
}

/** Freeze or thaw one package (scan mode Einfrieren); the done line offers undo and a label. */
export async function frozenWith(host: AfterHost, call: () => Promise<Opened & { thaw: boolean }>) {
  host.reset();
  const id = host.seq;
  const res = await host.run(call);
  if (id !== host.seq) return;
  if (!res) return host.focusInput();
  host.frozen = { result: res, thaw: res.thaw };
  done(host);
}

/** Undo the last book-out, opening or freeze; cleared first, so a second click cannot undo twice. */
async function undoLast(host: AfterHost) {
  const { undo, opened, frozen } = host;
  host.undo = host.opened = host.frozen = undefined;
  const ok = await host.run(() =>
    frozen
      ? undoFrozen(host.hass!, frozen.result.booking_id)
      : opened
        ? undoOpen(host.hass!, opened.booking_id)
        : putBack(host.hass!, undo!),
  );
  if (ok === undefined)
    return void ((host.undo = undo), (host.opened = opened), (host.frozen = frozen)); // still undoable
  done(host, t(frozen ? "book.undone_frozen" : opened ? "book.undone_open" : "book.undone"));
}

/** The status line under the input. */
export const afterLine = (host: AfterHost) =>
  host.frozen
    ? frozenLine(
        host.hass,
        host.frozen,
        () => undoLast(host),
        () => requestLabel(host, host.frozen!.result),
      )
    : host.opened
      ? openedLine(
          host.hass,
          host.opened,
          () => undoLast(host),
          () => requestLabel(host, host.opened!),
          "open",
        )
      : doneLine(
          host.message,
          host.undo && (() => undoLast(host)),
          undefined,
          undefined,
          host.image,
        );

/** The booking input's state a code scan needs. */
interface ScanHost extends AfterHost {
  mode: Mode;
  query: string;
  error: string;
  at?: Location;
}

const LABEL = /^PTRY:/i;
const EAN = /^\d{8,14}$/;

/** Codes that act without a product dialog: a location label (sets the location of the following
 *  bookings), a label or EAN in mode Einfrieren, an item label (books out / opens its batch).
 *  False: an EAN or name to look up. */
export async function scanCode(host: ScanHost, hass: Hass, q: string): Promise<boolean> {
  if (isLocationCode(q)) {
    const at = await host.run(() => scannedLocation(hass, q));
    if (at === undefined) return true; // failed: the error shows
    host.query = "";
    if (at) host.at = at;
    else host.error = t("location_label.unknown");
    return true;
  }
  // Einfrieren: label (its batch; a frozen one thaws) or EAN straight to the backend
  if (host.mode === "freeze" && (LABEL.test(q) || EAN.test(q))) {
    await frozenWith(host, () => freezeScan(hass, q, host.at?.id));
    return true;
  }
  if (!LABEL.test(q)) return false;
  const code = q.replace(LABEL, "");
  await (host.mode === "open"
    ? openWith(host, () => openLabel(hass, code))
    : scanLabel(host, code));
  return true;
}
