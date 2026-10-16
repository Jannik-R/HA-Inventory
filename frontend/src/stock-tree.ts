import type { Category } from "./api";
import type { Item } from "./stock-data";

/** A visible row of the stock tree: a category, or a product below it. */
type StockNode =
  | { kind: "category"; id: number; name: string; packages: number; depth: number; open: boolean }
  | { kind: "item"; item: Item; depth: number; open: boolean };

/** Category tree (only branches with visible products) with its products as leaves.
 *  `open` holds `c<id>` / `p<id>` keys of opened rows; while `searching` everything is open. */
export function stockTree(
  cats: Category[],
  items: Map<number, Item[]>,
  open: Set<string>,
  searching: boolean,
): StockNode[] {
  // [packages, visible products] per category subtree.
  const total = new Map<number, [number, number]>();
  const sum = (id: number): [number, number] => {
    let [n, k] = [0, 0];
    for (const i of items.get(id) ?? []) [n, k] = [n + i.packages, k + 1];
    for (const c of cats.filter((x) => x.parent_id === id)) {
      const [cn, ck] = sum(c.id);
      [n, k] = [n + cn, k + ck];
    }
    total.set(id, [n, k]);
    return [n, k];
  };
  const rows: StockNode[] = [];
  const walk = (parent: number | null, depth: number) => {
    for (const c of cats.filter((x) => x.parent_id === parent)) {
      const [packages, visible] = total.get(c.id) ?? sum(c.id);
      if (!visible) continue;
      const isOpen = searching || open.has(`c${c.id}`);
      rows.push({ kind: "category", id: c.id, name: c.name, packages, depth, open: isOpen });
      if (!isOpen) continue;
      walk(c.id, depth + 1);
      for (const item of items.get(c.id) ?? [])
        rows.push({
          kind: "item",
          item,
          depth: depth + 1,
          open: searching || open.has(`p${item.id}`),
        });
    }
  };
  walk(null, 0);
  return rows;
}
