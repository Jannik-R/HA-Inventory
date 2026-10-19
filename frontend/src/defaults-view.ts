import { LitElement, html } from "lit";
import { hasModule } from "./modules";
import { t } from "./i18n";
import { editDialog, fieldMsg, numOrNull, rowActions } from "./ui";
import { formStyles } from "./styles";
import {
  errorMessage,
  saveDefaults,
  stockUnits,
  type Hass,
  type InheritField,
  type MasterData,
} from "./api";
import { fmt } from "./settings-format";

const FIELDS: [InheritField, string][] = [
  ["unit_id", "settings.category.unit"],
  ["default_location_id", "settings.category.location"],
  ["expiry_type", "settings.category.expiry_type"],
  ["warn_days", "settings.category.warn_days"],
  ["shelf_days", "settings.category.shelf_days"],
  ["opened_days", "settings.category.opened_days"],
];
type Draft = Record<InheritField, number | string | null>;

/** Integration-wide defaults (root of inheritance): list of the values, one edit dialog. */
export class PantryDefaults extends LitElement {
  static properties = {
    hass: { attribute: false },
    data: { attribute: false },
    d: { state: true },
    error: { state: true },
  };

  declare hass?: Hass;
  declare data?: MasterData;
  declare d?: Draft;
  declare error: string;
  private orig?: Draft;

  constructor() {
    super();
    this.error = "";
  }

  private async open() {
    this.error = "";
    this.d = { ...this.data!.defaults };
    this.orig = { ...this.d };
    await this.updateComplete;
    this.renderRoot.querySelector("dialog")!.showModal();
    this.renderRoot.querySelector<HTMLElement>("dialog select")?.focus();
  }

  private set(field: InheritField, value: number | string | null) {
    this.d = { ...this.d!, [field]: value };
  }

  private warnError(d: Draft) {
    const v = d.warn_days;
    return v === null || !Number.isInteger(v) || (v as number) < 0 ? t("valid.days") : undefined;
  }

  /** Shelf life (empty: no date proposal) and shelf life after opening (empty: no change) are optional. */
  private shelfError(d: Draft, field: "shelf_days" | "opened_days" = "shelf_days") {
    const v = d[field];
    return v !== null && !(Number.isInteger(v) && (v as number) >= 1)
      ? t("valid.shelf_days")
      : undefined;
  }

  private async save(e: Event) {
    e.preventDefault();
    const d = this.d!;
    if (this.warnError(d) || this.shelfError(d) || this.shelfError(d, "opened_days")) return;
    try {
      await saveDefaults(this.hass!, this.d!);
      this.renderRoot.querySelector("dialog")?.close();
      this.dispatchEvent(new CustomEvent("pantry-saved", { bubbles: true, composed: true }));
    } catch (err) {
      this.error = await errorMessage(this.hass!, err);
    }
  }

  render() {
    const md = this.data;
    if (!md) return html``;
    return html`<p class="detail intro">${t("settings.defaults.hint")}</p>
      <ul>
        ${FIELDS.filter(([f]) => f !== "opened_days" || hasModule("opened")).map(
          ([f, label]) =>
            html`<li>
              <button class="row" data-testid="default-row" @click=${this.open}>
                <span>${t(label)}</span>
                <span class="detail">${fmt(md, this.hass, f, md.defaults[f])}</span>
              </button>
              ${rowActions({ testid: "default", name: t(label), onEdit: () => this.open() })}
            </li>`,
        )}
      </ul>
      ${this.renderDialog(md)}`;
  }

  private select(f: InheritField, options: [number | string | null, string][]) {
    const d = this.d!;
    return html`<select
      data-testid=${`default-${f}`}
      @change=${(e: Event) => {
        const v = (e.target as HTMLSelectElement).value;
        this.set(f, f === "expiry_type" ? v : v ? Number(v) : null);
      }}
    >
      ${options.map(
        ([v, name]) => html`<option value=${v ?? ""} .selected=${v === d[f]}>${name}</option>`,
      )}
    </select>`;
  }

  private renderDialog(md: MasterData) {
    const d = this.d;
    if (!d) return html`<dialog></dialog>`;
    const err = this.warnError(d);
    const shelfErr = this.shelfError(d);
    const openedErr = this.shelfError(d, "opened_days");
    return editDialog({
      title: t("settings.defaults.edit"),
      body: html`<label>
          <span class="lbl" title=${t("tip.unit_id")}>${t("settings.category.unit")}</span>
          ${this.select(
            "unit_id",
            stockUnits(md.units, d.unit_id as number | null).map((u) => [u.id, u.name]),
          )}
        </label>
        <label>
          <span class="lbl" title=${t("tip.default_location_id")}
            >${t("settings.category.location")}</span
          >
          ${this.select("default_location_id", [
            [null, t("settings.defaults.no_location")],
            ...md.locations.map((l): [number, string] => [l.id, l.name]),
          ])}
        </label>
        <label>
          <span class="lbl" title=${t("tip.expiry_type")}
            >${t("settings.category.expiry_type")}</span
          >
          ${this.select(
            "expiry_type",
            ["best_before", "use_by"].map((k) => [k, t(`settings.expiry.${k}`)]),
          )}
        </label>
        <label>
          <span class="lbl" title=${t("tip.warn_days")}>${t("settings.category.warn_days")}</span>
          <span class="num">
            <input
              data-testid="default-warn_days"
              type="number"
              min="0"
              step="1"
              inputmode="numeric"
              aria-invalid=${!!err}
              .value=${String(d.warn_days ?? "")}
              @input=${(e: Event) => {
                const v = (e.target as HTMLInputElement).value;
                this.set("warn_days", numOrNull(v));
              }}
            />
            ${t("common.days_unit")}
          </span>
          ${fieldMsg(err, "default-warn_days")}
        </label>
        ${this.optionalDays(d, "shelf_days", shelfErr)}
        ${hasModule("opened") ? this.optionalDays(d, "opened_days", openedErr) : ""}`,
      error: this.error,
      invalid: !!err || !!shelfErr || !!openedErr,
      dirty: () => FIELDS.some(([f]) => d[f] !== this.orig?.[f]),
      onSubmit: (e) => this.save(e),
      onClosed: () => (this.d = undefined),
    });
  }

  private optionalDays(d: Draft, field: "shelf_days" | "opened_days", error?: string) {
    return html`<label>
      <span class="lbl" title=${t(`tip.${field}`)}>${t(`settings.category.${field}`)}</span>
      <span class="num">
        <input
          data-testid=${`default-${field}`}
          type="number"
          min="1"
          step="1"
          inputmode="numeric"
          aria-invalid=${!!error}
          .value=${String(d[field] ?? "")}
          @input=${(e: Event) => this.set(field, numOrNull((e.target as HTMLInputElement).value))}
        />
        ${t("common.days_unit")}
      </span>
      ${fieldMsg(error, `default-${field}`)}
    </label>`;
  }

  static styles = formStyles;
}

customElements.define("pantry-defaults", PantryDefaults);
