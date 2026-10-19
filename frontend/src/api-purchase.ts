import type { Hass } from "./api";

export interface ReceiptCandidate {
  id: number;
  name: string;
  brand: string | null;
  /** Inherited shelf life (days) for the guessed date; null = no guess. */
  shelf_days: number | null;
}
/** One receipt line as the AI read it; product_id: learned or the only candidate, else the user chooses. */
export interface ReceiptItem {
  text: string;
  name: string;
  packages: number;
  product_id: number | null;
  candidates: ReceiptCandidate[];
  /** Suggested category for a new product. */
  category_id: number | null;
}
export interface ReceiptRead {
  store: string;
  items: ReceiptItem[];
}
export type ReceiptBookItem = {
  text: string;
  packages: number;
  expires_on: string | null;
} & ({ product_id: number } | { product: { name: string; category_id: number } });

export const readReceipt = (hass: Hass, text: string) =>
  hass.callWS<ReceiptRead>({ type: "pantry/receipt_read", text });

export const bookReceipt = (hass: Hass, store: string, items: ReceiptBookItem[]) =>
  hass.callWS<{ booked: number; rows: number }>({ type: "pantry/receipt_book", store, items });
