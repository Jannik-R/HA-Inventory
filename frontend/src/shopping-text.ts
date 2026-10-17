import { t } from "./i18n";
import { fmtAmount } from "./format";
import type { Hass } from "./api";
import type { ShoppingItem } from "./api-shopping";

/** What is missing, as shown after the item name ("500 g und 2 Pkg. fehlen", "beliebig · 2 Pkg."). */
export function missingText(hass: Hass | undefined, i: ShoppingItem) {
  const amount = (a: NonNullable<ShoppingItem["amount"]>) =>
    fmtAmount(hass, a.missing, a.unit_symbol);
  if (i.manual)
    return [i.product_id ? i.brand : t("shopping.any"), t("book.count", { n: i.packages! })]
      .filter(Boolean)
      .join(" · ");
  if (i.key) return i.amount ? amount(i.amount) : t("book.count", { n: i.packages ?? 1 });
  const parts = [];
  if (i.amount) parts.push(amount(i.amount));
  if (i.packages) parts.push(t("book.count", { n: i.packages }));
  const what = t(i.any_of_subtree ? "shopping.missing_more" : "shopping.missing", {
    what: parts.join(t("shopping.and")),
  });
  return [i.brand, what].filter(Boolean).join(" · ");
}

/** Small marks after the item: which recipe needs how much ("1:300 g") and uncounted products. */
export function refList(hass: Hass | undefined, i: ShoppingItem) {
  const uses = i.recipes.map((u) => {
    const amount = u.amount == null ? null : fmtAmount(hass, u.amount, u.unit_symbol);
    return {
      text: amount == null ? `${u.no}` : `${u.no}:${amount}`,
      title: t(amount == null ? "shopping.ref.title_plain" : "shopping.ref.title", {
        no: u.no,
        name: u.name,
        amount: amount ?? "",
      }),
    };
  });
  const unknown = i.amount?.unknown_products;
  return { uses, unknown: unknown ? t("shopping.unknown", { n: unknown }) : "" };
}
