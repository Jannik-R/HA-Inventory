import { LitElement, html, nothing, type PropertyValues } from "lit";
import { mdiRestore } from "@mdi/js";
import { t } from "./i18n";
import { editDialog, fieldMsg, icon, numOrNull } from "./ui";
import { formStyles } from "./styles";
import "./category-picker";
import {
  errorMessage,
  saveRow,
  stockUnits,
  type Hass,
  type InheritField,
  type MasterData,
  type Table,
} from "./api";
import { catName, fmt, inherited, sourceLabel } from "./settings-format";
import { minErrors, minFields } from "./min-stock";
import { ADD, COLUMNS, type Draft, type Opts } from "./settings-model";

/** Inherited day counts: number inputs with "Tage". */
const DAYS = ["warn_days", "shelf_days", "opened_days"];

/** Add/edit dialog for one master-data row. Call `open()`; fires `pantry-saved` after a successful save. */
export class PantrySettingsDialog extends LitElement {
  static properties = {
    hass: { attribute: false },
    data: { attribute: false },
    edit: { state: true },
    error: { state: true },
  };

  declare hass?: Hass;
  declare data?: MasterData;
  declare edit?: { table: Table; d: Draft; orig: Draft };
  declare error: string;

  constructor() {
    super();
    this.error = "";
  }

  open(table: Table, row?: Draft, preset: Draft = {}) {
    this.error = "";
    const d: Draft = {};
    for (const c of COLUMNS[table]) d[c] = row?.[c] ?? preset[c] ?? null;
    if (row) d.id = row.id;
    if (table === "unit") {
      d.is_count ??= 0;
      d.recipe_only ??= 0;
      d.factor ??= 1;
      d.symbol ??= "";
    }
    d.name ??= "";
    this.edit = { table, d, orig: { ...d } };
  }

  updated(changed: PropertyValues) {
    if (!changed.has("edit")) return;
    const dlg = this.renderRoot.querySelector("dialog");
    if (!dlg || !this.edit) return;
    if (!dlg.open) dlg.showModal();
    dlg.querySelector<HTMLElement>("input:not([type=checkbox]), select")?.focus();
  }

  private set(key: string, value: unknown) {
    const d = this.edit!.d;
    d[key] = value;
    if (key === "base_unit_id" && value == null) d.factor = 1;
    this.requestUpdate();
  }

  /** Field errors of the open dialog; shown live under the fields, saving is blocked while any exist. */
  private errors(): Record<string, string> {
    const { table, d } = this.edit!;
    const e: Record<string, string> = {};
    const name = String(d.name ?? "").trim();
    const md = this.data!;
    const siblings: { id: number; name: string }[] =
      table === "category"
        ? md.categories.filter((c) => c.parent_id === (d.parent_id ?? null))
        : table === "unit"
          ? md.units
          : md.locations;
    if (!name) e.name = t("valid.required");
    else if (
      siblings.some(
        (r) => r.id !== d.id && r.name.trim().toLocaleLowerCase() === name.toLocaleLowerCase(),
      )
    )
      e.name = t("valid.duplicate");
    if (table === "unit") {
      if (!String(d.symbol ?? "").trim()) e.symbol = t("valid.required");
      if (d.base_unit_id != null && !(d.factor > 0)) e.factor = t("valid.positive");
    }
    if (table === "category") {
      if (d.warn_days != null && !(Number.isInteger(d.warn_days) && d.warn_days >= 0))
        e.warn_days = t("valid.days");
      if (d.shelf_days != null && !(Number.isInteger(d.shelf_days) && d.shelf_days >= 1))
        e.shelf_days = t("valid.shelf_days");
      if (d.opened_days != null && !(Number.isInteger(d.opened_days) && d.opened_days >= 1))
        e.opened_days = t("valid.shelf_days");
      Object.assign(e, minErrors(d));
    }
    return e;
  }

  // Errors of the current render, read by the input helpers.
  private errs: Record<string, string> = {};

  private async save(e: Event) {
    e.preventDefault();
    if (Object.keys(this.errors()).length) return;
    const { table, d } = this.edit!;
    const payload: Draft = {};
    for (const c of COLUMNS[table]) payload[c] = d[c];
    if (d.id) payload.id = d.id;
    try {
      await saveRow(this.hass!, table, payload);
    } catch (err) {
      this.error = await errorMessage(this.hass!, err);
      return;
    }
    this.renderRoot.querySelector("dialog")?.close();
    this.dispatchEvent(new CustomEvent("pantry-saved", { bubbles: true, composed: true }));
  }

  private field(label: string, control: unknown, tip?: string) {
    return html`<label><span class="lbl" title=${tip ?? nothing}>${label}</span>${control}</label>`;
  }

  private text(key: string) {
    return html`<input
        type="text"
        .value=${String(this.edit!.d[key] ?? "")}
        ?required=${key === "name"}
        aria-invalid=${!!this.errs[key]}
        @input=${(e: Event) => this.set(key, (e.target as HTMLInputElement).value)}
      />${fieldMsg(this.errs[key], key)}`;
  }

  private numInput(key: string, placeholder = "", suffix = "") {
    const d = this.edit!.d;
    return html`<span class="num"
        ><input
          type="number"
          step=${DAYS.includes(key) ? "1" : "any"}
          min=${key === "factor" ? "0.000001" : "0"}
          placeholder=${placeholder}
          aria-invalid=${!!this.errs[key]}
          .value=${String(d[key] ?? "")}
          ?disabled=${key === "factor" && (d.base_unit_id == null || this.usedAsBase(d))}
          @input=${(e: Event) => {
            const v = (e.target as HTMLInputElement).value;
            this.set(key, numOrNull(v));
          }}
        />${suffix ? html`<span class="detail">${suffix}</span>` : nothing}</span
      >${DAYS.includes(key) ? nothing : fieldMsg(this.errs[key], key)}`;
  }

  private usedAsBase(d: Draft) {
    return !!d.id && this.data!.units.some((x) => x.base_unit_id === d.id);
  }

  private select(key: string, options: Opts, first: string, numeric = true, disabled = false) {
    const cur = this.edit!.d[key];
    return html`<select
      class=${cur == null ? "unset" : ""}
      ?disabled=${disabled}
      @change=${(e: Event) => {
        const v = (e.target as HTMLSelectElement).value;
        this.set(key, v === "" ? null : numeric ? Number(v) : v);
      }}
    >
      <option value="" .selected=${cur == null}>${first}</option>
      ${options.map(([v, l]) => html`<option value=${v} .selected=${cur === v}>${l}</option>`)}
    </select>`;
  }

  private reset(key: string) {
    return this.edit!.d[key] == null
      ? nothing
      : html`<button type="button" class="reset" @click=${() => this.set(key, null)}>
          ${icon(mdiRestore)}${t("common.reset")}
        </button>`;
  }

  private inh(field: InheritField | "food", label: string, options: Opts, numeric = true) {
    const md = this.data!;
    const inh = inherited(md, field, this.edit!.d.parent_id);
    const value = fmt(md, this.hass, field, inh.value);
    const source = sourceLabel(md, inh.source);
    const control = DAYS.includes(field)
      ? this.numInput(field, t("common.default", { value, source }), t("common.days_unit"))
      : this.select(field, options, t("common.default", { value, source }), numeric);
    return this.field(
      label,
      html`<span class="inh">${control}${this.reset(field)}</span
        >${fieldMsg(this.errs[field], field)}`,
      t(`tip.${field}`),
    );
  }

  render() {
    const e = this.edit;
    if (!e || !this.data) return html`<dialog></dialog>`;
    const { table, d, orig } = e;
    this.errs = this.errors();
    const md = this.data;
    const { units, locations } = md;
    let fields: unknown;
    if (table === "location") {
      fields = this.field(t("common.name"), this.text("name"));
    } else if (table === "unit") {
      const bases: Opts = stockUnits(units, d.base_unit_id)
        .filter((u) => u.base_unit_id == null && u.id !== d.id)
        .map((u) => [u.id, u.name]);
      fields = html`${this.field(t("common.name"), this.text("name"))}${this.field(t("settings.unit.symbol"), this.text("symbol"))}
        <label class="check"
          ><input
            type="checkbox"
            .checked=${!!d.is_count}
            @change=${(ev: Event) => this.set("is_count", (ev.target as HTMLInputElement).checked ? 1 : 0)}
          />${t("settings.unit.is_count")}</label
        >
        <label class="check"
          ><input
            type="checkbox"
            data-testid="unit-recipe-only"
            .checked=${!!d.recipe_only}
            @change=${(ev: Event) => this.set("recipe_only", (ev.target as HTMLInputElement).checked ? 1 : 0)}
          />${t("settings.unit.recipe_only")}</label
        >
        ${fieldMsg(t("settings.unit.recipe_only_hint"), "unit-recipe-only", true)}
        ${this.field(t("settings.unit.base"), this.select("base_unit_id", bases, t("common.none"), true, this.usedAsBase(d)))}
        ${this.field(t("settings.unit.factor"), this.numInput("factor"))}`;
    } else {
      const unit = d.unit_id ?? inherited(md, "unit_id", d.parent_id).value;
      const tags = md.categories.find((x) => x.id === d.id)?.off_tags ?? [];
      fields = html`${this.field(t("common.name"), this.text("name"))}
        <div class="field">
          <span class="lbl">${t("settings.category.parent")}</span>
          <pantry-category-picker
            .categories=${md.categories}
            .value=${d.parent_id ?? null}
            .noneLabel=${t("settings.category.no_parent")}
            .exclude=${d.id}
            @change=${(ev: CustomEvent<number | null>) => this.set("parent_id", ev.detail)}
          ></pantry-category-picker>
        </div>
        ${this.inh(
          "unit_id",
          t("settings.category.unit"),
          stockUnits(units, d.unit_id).map((u) => [
            u.id,
            u.symbol ? `${u.name} (${u.symbol})` : u.name,
          ]),
        )}
        ${this.inh(
          "default_location_id",
          t("settings.category.location"),
          locations.map((l) => [l.id, l.name]),
        )}
        ${this.inh(
          "expiry_type",
          t("settings.category.expiry_type"),
          ["best_before", "use_by"].map((k) => [k, t(`settings.expiry.${k}`)]),
          false,
        )}
        ${this.inh("warn_days", t("settings.category.warn_days"), [])}
        ${this.inh("shelf_days", t("settings.category.shelf_days"), [])}
        ${this.inh("opened_days", t("settings.category.opened_days"), [])}
        ${this.inh("food", t("settings.food.label"), [
          [1, t("settings.food.yes")],
          [0, t("settings.food.no")],
        ])}
        ${minFields({ md, d, errs: this.errs, unitId: unit as number | null, set: (k, v) => this.set(k, v) })}
        ${tags.length ? html`<p class="detail">${t("settings.category.off_tags", { tags: tags.join(", ") })}</p>` : nothing}`;
    }
    const dirty = () => COLUMNS[table].some((c) => (d[c] ?? null) !== (orig[c] ?? null));
    const parent =
      table === "category" && !d.id && d.parent_id != null ? catName(md, d.parent_id) : "";
    const title = d.id
      ? t("common.edit_name", { name: orig.name })
      : parent
        ? t("settings.category.add_sub_to", { name: parent })
        : t(ADD[table]);
    return editDialog({
      title,
      body: fields,
      error: this.error,
      invalid: Object.keys(this.errs).length > 0,
      dirty,
      onSubmit: (ev) => this.save(ev),
      onClosed: () => (this.edit = undefined),
    });
  }

  static styles = [formStyles];
}

customElements.define("pantry-settings-dialog", PantrySettingsDialog);
