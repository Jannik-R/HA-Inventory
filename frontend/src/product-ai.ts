import { html, nothing } from "lit";
import { t } from "./i18n";
import { checkProduct, errorMessage, type Hass, type MasterData, type Product } from "./api";
import { fmtAmount } from "./format";

const FIELDS = ["name", "category_id", "content_amount", "content_unit_id"] as const;
type Field = (typeof FIELDS)[number];

/** AI check of a new product from Open Food Facts in the book-in form. */
export type ProductAi =
  | { kind: "none" }
  | { kind: "running" }
  | { kind: "ok" }
  | { kind: "failed"; message: string }
  | { kind: "changed"; before: Partial<Product>; reason: string };

/** Check `sent` and apply the answer to the fields that are still as sent (edits while waiting win). */
export const runProductAi = async (
  hass: Hass,
  sent: Product,
  current: () => Product,
): Promise<{ state: ProductAi; draft?: Product }> => {
  try {
    const res = await checkProduct(hass, {
      ...Object.fromEntries(FIELDS.map((k) => [k, sent[k]])),
      brand: sent.brand,
      ean: sent.ean,
      off_json: sent.off_json,
    });
    if (res.status !== "changes") return { state: { kind: res.status === "ok" ? "ok" : "none" } };
    const cur = current();
    const keys = FIELDS.filter((k) => k in res && cur[k] === sent[k]);
    if (!keys.length) return { state: { kind: "ok" } };
    const before = Object.fromEntries(keys.map((k) => [k, sent[k]])) as Partial<Product>;
    const after = Object.fromEntries(keys.map((k) => [k, res[k as Field]]));
    return {
      state: { kind: "changed", before, reason: res.reason },
      draft: { ...cur, ...after } as Product,
    };
  } catch (err) {
    return { state: { kind: "failed", message: await errorMessage(hass, err) } };
  }
};

/** The previous values in words: name, category, content. */
const beforeText = (hass: Hass | undefined, md: MasterData | undefined, b: Partial<Product>) => {
  const parts: string[] = [];
  if ("name" in b) parts.push(b.name || "–");
  if ("category_id" in b)
    parts.push(md?.categories.find((c) => c.id === b.category_id)?.name ?? "–");
  if ("content_amount" in b || "content_unit_id" in b) {
    const unit = md?.units.find((u) => u.id === b.content_unit_id)?.symbol ?? "";
    parts.push(b.content_amount != null ? fmtAmount(hass, b.content_amount, unit) : "–");
  }
  return parts.join(", ");
};

/** Status line at the top of the book-in form; `onUndo` restores the values before. */
export const productAiBanner = (
  s: ProductAi,
  hass: Hass | undefined,
  md: MasterData | undefined,
  onUndo: (before: Partial<Product>) => void,
) => {
  switch (s.kind) {
    case "running":
      return html`<div class="ai" role="status" data-testid="product-ai-status">
        <progress aria-label=${t("book.ai.running")}></progress>
        <span>${t("book.ai.running")}</span>
      </div>`;
    case "ok":
      return html`<p class="ai" role="status" data-testid="product-ai-status">
        ${t("book.ai.ok")}
      </p>`;
    case "failed":
      return html`<p class="ai error" role="alert" data-testid="product-ai-status">
        ${s.message}
      </p>`;
    case "changed":
      return html`<div class="ai" role="status" data-testid="product-ai-status">
        <span
          >${t("book.ai.changed", { reason: s.reason, before: beforeText(hass, md, s.before) })}</span
        >
        <button type="button" data-testid="product-ai-undo" @click=${() => onUndo(s.before)}>
          ${t("book.ai.undo")}
        </button>
      </div>`;
    default:
      return nothing;
  }
};
