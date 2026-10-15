import { html, nothing } from "lit";
import { t } from "./i18n";
import { fieldMsg, todayIso } from "./ui";
import { inheritSelect, type Dflt } from "./inherit";
import type { MasterData, Product } from "./api";
import type { Errors } from "./product-fields";

/** Book-in form values the fields below read and change. */
export interface InForm {
  expires_on: string;
  // The date input reports incomplete input only via validity, its value is then "".
  dateBad: boolean;
  location_id: number | null;
  makeDefault: boolean;
  // Print labels after booking in; null = the integration option.
  print: boolean | null;
}
type Set = (patch: Partial<InForm>) => void;

/** Expiry date; `type` is the product's date type (own or inherited), if any. */
export function dateField(f: InForm, set: Set, err: Errors, type: unknown) {
  const past = !err.expires && f.expires_on && f.expires_on < todayIso();
  return html`<label>
    <span class="lbl"
      >${type ? t("book.expires_on_type", { type: t(`settings.expiry.${type}`) }) : t("book.expires_on")}</span
    >
    <input
      id="expires"
      data-testid="expires"
      type="date"
      min="2000-01-01"
      max="2099-12-31"
      aria-invalid=${!!err.expires}
      .value=${f.expires_on}
      @input=${(e: Event) => {
        const el = e.target as HTMLInputElement;
        set({ expires_on: el.value, dateBad: el.validity.badInput });
      }}
    />
    ${
      err.expires || past
        ? html`${fieldMsg(err.expires, "expires")}${past ? fieldMsg(t("valid.past"), "expires", true) : ""}`
        : html`<span class="detail">${t("book.no_date_hint")}</span>`
    }
  </label>`;
}

/** Location for this booking (default from product / category); a new product can keep it as its default. */
export function locationFields(
  md: MasterData | undefined,
  p: Product,
  f: InForm,
  set: Set,
  err: Errors,
  dflt: Dflt | undefined,
) {
  return html`<label>
      <span class="lbl">${t("book.location")}</span>
      ${inheritSelect({
        testid: "location",
        own: f.location_id,
        dflt,
        options: (md?.locations ?? []).map((l) => [l.id, l.name]),
        numeric: true,
        invalid: !!err.location,
        onChange: (v) => set({ location_id: v as number | null }),
      })}
      ${fieldMsg(err.location, "location")}
    </label>
    ${
      p.id
        ? nothing
        : html`<label class="check">
            <input
              type="checkbox"
              data-testid="make-default"
              .checked=${f.makeDefault}
              @change=${(e: Event) => set({ makeDefault: (e.target as HTMLInputElement).checked })}
            />${t("book.make_default")}
          </label>`
    }`;
}

/** "Etiketten drucken"; `dflt` = the integration option. */
export function printField(f: InForm, set: Set, dflt: boolean) {
  return html`<label class="check">
    <input
      type="checkbox"
      data-testid="print-labels"
      .checked=${f.print ?? dflt}
      @change=${(e: Event) => set({ print: (e.target as HTMLInputElement).checked })}
    />${t("label.print")}
  </label>`;
}
