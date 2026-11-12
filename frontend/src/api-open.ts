import type { Hass, Taken } from "./api";

/** What opening a package did: the opened batch (own batch with opened_on) and its booking. */
export interface Opened {
  batch_id: number;
  location_id: number;
  booking_id: number;
  /** Effective expiry of the opened package. */
  expires_on: string | null;
  name: string;
  location: string;
}

/** One package of that batch / location, else the earliest unopened one of the product. */
export const openPackage = (
  hass: Hass,
  data: { product_id: number; batch_id?: number; location_id?: number },
) => hass.callWS<Opened>({ type: "home_inventory/open_package", ...data });
/** A scanned label (code without PTRY:): one package of its batch. */
export const openLabel = (hass: Hass, code: string) =>
  hass.callWS<Opened>({ type: "home_inventory/open_label", code });
export const undoOpen = (hass: Hass, booking_id: number) =>
  hass.callWS<null>({ type: "home_inventory/open_undo", booking_id });

/** Freeze (thaw: false) or thaw packages of a batch; result like opening (the target batch). */
export const freezePackages = (
  hass: Hass,
  data: {
    thaw: boolean;
    product_id: number;
    packages: number;
    batch_id: number;
    location_id: number;
    to_location_id?: number;
  },
) => hass.callWS<Opened>({ type: "home_inventory/freeze", ...data });
export const undoFrozen = (hass: Hass, booking_id: number) =>
  hass.callWS<null>({ type: "home_inventory/frozen_undo", booking_id });

/** Scan mode Einfrieren: one package; a frozen batch's label thaws it (`thaw` in the result). */
export const freezeScan = (hass: Hass, code?: string, location_id?: number, product_id?: number) =>
  hass.callWS<Opened & { thaw: boolean }>({
    type: "home_inventory/freeze_scan",
    ...(code ? { code } : {}),
    ...(product_id ? { product_id } : {}),
    ...(location_id ? { location_id } : {}),
  });

/** Level (0..1) of the partly used package of an opened batch; 0 books the package out. */
export const setRemaining = (
  hass: Hass,
  data: { batch_id: number; location_id: number; remaining: number },
) =>
  hass.callWS<{ kind: "out"; taken: Taken[] } | { kind: "remaining"; booking_id: number | null }>({
    type: "home_inventory/remaining",
    ...data,
  });
