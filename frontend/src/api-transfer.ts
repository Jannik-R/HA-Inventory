import type { Hass } from "./api";

export interface TransferChange {
  field: string;
  old: string | number | null;
  new: string | number | null;
}
export interface TransferRow {
  line: number;
  action: "create" | "update" | "skip" | "error";
  kind: "product" | "stock" | "category" | "location";
  name: string;
  changes: TransferChange[];
  reason: string | null;
}
export interface TransferReport {
  rows: TransferRow[];
  counts: Record<TransferRow["action"], number>;
}
export type TransferKind = "products" | "stock";

export const exportCsv = (hass: Hass, kind: TransferKind) =>
  hass.callWS<{ csv: string }>({ type: "home_inventory/export_csv", kind });

export const importCsv = (hass: Hass, kind: TransferKind, text: string, apply: boolean) =>
  hass.callWS<TransferReport>({ type: "home_inventory/import_csv", kind, text, apply });

export const importGrocy = (hass: Hass, files: string[], apply: boolean) =>
  hass.callWS<TransferReport>({ type: "home_inventory/import_grocy", files, apply });
