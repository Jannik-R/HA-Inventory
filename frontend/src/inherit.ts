import { html, nothing } from "lit";
import { mdiRestore } from "@mdi/js";
import { t } from "./i18n";
import { icon, numOrNull } from "./ui";
import type { Category, InheritField, MasterData } from "./api";

export interface Dflt {
  value: number | string;
  source: string;
}

/** "Hauptkategorie › Kategorie" for a category id. */
export function categoryPath(
  categories: Category[] | undefined,
  id: number | null | undefined,
): string {
  const names: string[] = [];
  for (
    let c = categories?.find((x) => x.id === id);
    c;
    c = categories!.find((x) => x.id === c!.parent_id)
  )
    names.unshift(c.name);
  return names.join(" › ");
}

/** Value a product of this category inherits, with its source ("von Nudeln" / "Standard"). */
export function categoryDefault(
  md: MasterData | undefined,
  categoryId: number | null | undefined,
  field: InheritField,
): Dflt | undefined {
  if (!md) return undefined;
  const cat = md.categories.find((c) => c.id === categoryId);
  const e = cat ? cat.effective[field] : { value: md.defaults[field], source: "default" as const };
  if (e.value == null) return undefined;
  if (e.source === "default") return { value: e.value, source: t("settings.inherit_default") };
  const from = e.source === "own" ? cat!.name : md.categories.find((c) => c.id === e.source)?.name;
  return { value: e.value, source: t("settings.inherit_from", { name: from ?? "" }) };
}

const reset = (testid: string, onClick: () => void) =>
  html`<button type="button" class="reset" data-testid=${`${testid}-reset`} @click=${onClick}>
    ${icon(mdiRestore)}${t("common.reset")}
  </button>`;

/** Select whose empty choice shows the default and its source; an own value gets a reset action. */
export function inheritSelect(o: {
  testid: string;
  own: number | string | null | undefined;
  dflt: Dflt | undefined;
  options: [number | string, string][];
  numeric: boolean;
  /** No default is fine: the empty choice reads "keine" and is allowed. */
  optional?: boolean;
  invalid?: boolean;
  onChange: (v: number | string | null) => void;
}) {
  const own = o.own ?? null;
  const label = (v: number | string) => o.options.find(([x]) => x === v)?.[1] ?? "";
  return html`<span class="inh">
    <select
      data-testid=${o.testid}
      class=${own == null ? "unset" : ""}
      aria-invalid=${!!o.invalid}
      ?required=${!o.dflt && !o.optional}
      @change=${(e: Event) => {
        const v = (e.target as HTMLSelectElement).value;
        o.onChange(v === "" ? null : o.numeric ? Number(v) : v);
      }}
    >
      <option value="" .selected=${own == null}>
        ${o.dflt ? t("common.default", { value: label(o.dflt.value), source: o.dflt.source }) : t(o.optional ? "common.none" : "book.choose")}
      </option>
      ${o.options.map(([v, l]) => html`<option value=${v} .selected=${own === v}>${l}</option>`)}
    </select>
    ${own == null ? nothing : reset(o.testid, () => o.onChange(null))}
  </span>`;
}

/** Number input whose placeholder shows the default and its source; an own value gets a reset action. */
export function inheritNumber(o: {
  testid: string;
  own: number | null | undefined;
  dflt: Dflt | undefined;
  format: (v: number | string) => string;
  /** Unit shown after the input ("Tage"). */
  suffix?: string;
  invalid?: boolean;
  onChange: (v: number | null) => void;
}) {
  const own = o.own ?? null;
  return html`<span class="inh">
    <input
      data-testid=${o.testid}
      type="number"
      inputmode="numeric"
      min="0"
      step="1"
      aria-invalid=${!!o.invalid}
      placeholder=${o.dflt ? t("common.default", { value: o.format(o.dflt.value), source: o.dflt.source }) : ""}
      .value=${own == null ? "" : String(own)}
      @input=${(e: Event) => {
        const v = (e.target as HTMLInputElement).value;
        o.onChange(numOrNull(v));
      }}
    />
    ${o.suffix ? html`<span class="detail">${o.suffix}</span>` : nothing}
    ${own == null ? nothing : reset(o.testid, () => o.onChange(null))}
  </span>`;
}
