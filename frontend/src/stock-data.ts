import type { MasterData, Product, StockRow } from "./api";
import { categoryDefault } from "./inherit";
import { todayIso } from "./ui";

/** A product in the stock overview with its batches (earliest expiry first). */
export interface Item {
  id: number;
  category_id: number;
  name: string;
  brand: string | null;
  packages: number;
  batches: StockRow[];
}

/** Stock rows matching search and location, as products per category id. */
export function groupStock(
  stock: StockRow[],
  filter: string,
  location: number | null,
): Map<number, Item[]> {
  const q = filter.trim().toLocaleLowerCase();
  const items = new Map<number, Item>();
  for (const r of stock) {
    if (location != null && r.location_id !== location) continue;
    const text = [r.name, r.brand, r.ean, r.location, ...r.category_path].join(" ");
    if (q && !text.toLocaleLowerCase().includes(q)) continue;
    let item = items.get(r.product_id);
    if (!item) {
      item = {
        id: r.product_id,
        category_id: r.category_id,
        name: r.name,
        brand: r.brand,
        packages: 0,
        batches: [],
      };
      items.set(r.product_id, item);
    }
    item.packages += r.packages;
    item.batches.push(r); // backend sorts by expiry, earliest first
  }
  const out = new Map<number, Item[]>();
  for (const i of items.values()) out.set(i.category_id, [...(out.get(i.category_id) ?? []), i]);
  return out;
}

/** Days from today to an ISO date (negative = past); rounding absorbs DST hours. */
export const daysLeft = (iso: string) =>
  Math.round((Date.parse(`${iso}T00:00`) - Date.parse(`${todayIso()}T00:00`)) / 86_400_000);

/** "expired" / "soon" by the product's effective warn days, or by `days` when given. */
export function expiryStatus(
  r: StockRow,
  p: Product | undefined,
  md: MasterData | undefined,
  days?: number,
): "expired" | "soon" | "" {
  if (!r.expires_on) return "";
  const left = daysLeft(r.expires_on);
  if (left < 0) return "expired";
  const warn =
    days ?? Number(p?.warn_days ?? categoryDefault(md, p?.category_id, "warn_days")?.value ?? 0);
  return left <= warn ? "soon" : "";
}
