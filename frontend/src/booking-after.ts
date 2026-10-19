import { t } from "./i18n";
import { doneLine } from "./booking-done";
import { bookOutLabel, putBack, type Hass, type Taken } from "./api";
import { undoOpen, type Opened } from "./api-open";
import { openedLine, requestLabel } from "./open-action";

/** The booking input's state after a booking: message, undo, the last opened package. */
export interface AfterHost extends EventTarget {
  hass?: Hass;
  message: string;
  undo?: Taken[];
  opened?: Opened;
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

/** Undo the last book-out or opening; cleared first, so a second click cannot undo twice. */
async function undoLast(host: AfterHost) {
  const { undo, opened } = host;
  host.undo = host.opened = undefined;
  const ok = await host.run(() =>
    opened ? undoOpen(host.hass!, opened.booking_id) : putBack(host.hass!, undo!),
  );
  if (ok === undefined) return void ((host.undo = undo), (host.opened = opened)); // still undoable
  done(host, t(opened ? "book.undone_open" : "book.undone"));
}

/** The status line under the input. */
export const afterLine = (host: AfterHost) =>
  host.opened
    ? openedLine(
        host.hass,
        host.opened,
        () => undoLast(host),
        () => requestLabel(host, host.opened!),
        "open",
      )
    : doneLine(host.message, host.undo && (() => undoLast(host)));
