import { LitElement, css, html, nothing, type PropertyValues } from "lit";
import { mdiChevronDown, mdiChevronRight, mdiRestore } from "@mdi/js";
import { t } from "./i18n";
import { backdropClick, escGuard, fieldMsg, formStyles, icon, rowActions } from "./ui";
import "./category-picker";
import {
  deleteRow,
  errorMessage,
  getMasterData,
  saveRow,
  type Category,
  type Hass,
  type InheritField,
  type MasterData,
  type Source,
  type Table,
} from "./api";

const SECTIONS = { categories: "category", locations: "location", units: "unit" } as const;
type Section = keyof typeof SECTIONS;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Draft = Record<string, any>;
type Opts = [string | number, string][];
// Columns sent on save (no sort, no derived fields).
const COLUMNS: Record<Table, string[]> = {
  unit: ["name", "symbol", "base_unit_id", "factor", "is_count"],
  location: ["name"],
  category: [
    "parent_id",
    "name",
    "unit_id",
    "default_location_id",
    "expiry_type",
    "warn_days",
    "min_stock",
  ],
};
const ADD: Record<Table, string> = {
  unit: "settings.unit.add",
  location: "settings.location.add",
  category: "settings.category.add",
};
export class PantrySettings extends LitElement {
  static properties = {
    hass: { attribute: false },
    section: { attribute: false },
    data: { state: true },
    edit: { state: true },
    error: { state: true },
    pageError: { state: true },
    expanded: { state: true },
  };

  declare hass?: Hass;
  declare section?: string;
  declare data?: MasterData;
  declare edit?: { table: Table; d: Draft; orig: Draft };
  declare error: string;
  declare pageError: string;
  declare expanded: Set<number>;

  constructor() {
    super();
    this.error = "";
    this.pageError = "";
    this.expanded = new Set();
  }

  private loaded = false;

  willUpdate(changed: PropertyValues) {
    if (changed.has("hass") && this.hass && !this.loaded) {
      this.loaded = true;
      this.load();
    }
  }

  updated(changed: PropertyValues) {
    if (!changed.has("edit")) return;
    const dlg = this.renderRoot.querySelector("dialog");
    if (!dlg || !this.edit) return;
    if (!dlg.open) dlg.showModal();
    dlg.querySelector<HTMLElement>("input:not([type=checkbox]), select")?.focus();
  }

  private get sec(): Section {
    return this.section && this.section in SECTIONS ? (this.section as Section) : "categories";
  }

  private async load() {
    if (!this.hass) return;
    try {
      this.data = await getMasterData(this.hass);
      this.pageError = "";
    } catch (err) {
      this.pageError = await errorMessage(this.hass, err);
    }
  }

  private nav(s: Section) {
    this.dispatchEvent(
      new CustomEvent("pantry-navigate", {
        detail: `settings/${s}`,
        bubbles: true,
        composed: true,
      }),
    );
  }

  private open(table: Table, row?: Draft, preset: Draft = {}) {
    this.error = "";
    const d: Draft = {};
    for (const c of COLUMNS[table]) d[c] = row?.[c] ?? preset[c] ?? null;
    if (row) d.id = row.id;
    if (table === "unit") {
      d.is_count ??= 0;
      d.factor ??= 1;
      d.symbol ??= "";
    }
    d.name ??= "";
    this.edit = { table, d, orig: { ...d } };
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
    else if (siblings.some((r) => r.id !== d.id && r.name.trim().toLocaleLowerCase() === name.toLocaleLowerCase()))
      e.name = t("valid.duplicate");
    if (table === "unit") {
      if (!String(d.symbol ?? "").trim()) e.symbol = t("valid.required");
      if (d.base_unit_id != null && !(d.factor > 0)) e.factor = t("valid.positive");
    }
    if (table === "category") {
      if (d.warn_days != null && !(Number.isInteger(d.warn_days) && d.warn_days >= 0)) e.warn_days = t("valid.days");
      if (d.min_stock != null && !(d.min_stock > 0)) e.min_stock = t("valid.positive");
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
    await this.run(() => saveRow(this.hass!, table, payload));
  }

  private async run(fn: () => Promise<unknown>) {
    try {
      await fn();
    } catch (err) {
      this.error = await errorMessage(this.hass!, err);
      return;
    }
    this.renderRoot.querySelector("dialog")?.close();
    await this.load();
  }

  // ---- inheritance helpers ----
  private catName(id: number) {
    return this.data!.categories.find((c) => c.id === id)?.name ?? "";
  }

  private sourceLabel(s: Source) {
    return s === "default"
      ? t("settings.inherit_default")
      : t("settings.inherit_from", { name: this.catName(s as number) });
  }

  /** Value a category inherits from the (draft) parent, or from the defaults. */
  private inherited(
    field: InheritField,
    parentId: number | null,
  ): { value: number | string | null; source: Source } {
    const p = this.data!.categories.find((c) => c.id === parentId);
    if (!p) return { value: this.data!.defaults[field], source: "default" };
    return p[field] != null ? { value: p[field], source: p.id } : p.effective[field];
  }

  private fmt(field: InheritField, v: number | string | null): string {
    if (v == null) return "–";
    const { units, locations } = this.data!;
    if (field === "unit_id") {
      const u = units.find((x) => x.id === v);
      return u ? u.symbol || u.name : "–";
    }
    if (field === "default_location_id") return locations.find((x) => x.id === v)?.name ?? "–";
    if (field === "expiry_type") return t(`settings.expiry.${v}`);
    const one = new Intl.PluralRules(this.hass?.language).select(Number(v)) === "one";
    return t(one ? "settings.day" : "settings.days", { n: v });
  }

  private num(n: number) {
    return new Intl.NumberFormat(this.hass?.locale?.language ?? this.hass?.language).format(n);
  }

  // ---- category tree ----
  private tree(): { c: Category; depth: number; hasKids: boolean }[] {
    const cats = this.data!.categories;
    const out: { c: Category; depth: number; hasKids: boolean }[] = [];
    const walk = (parent: number | null, depth: number) => {
      for (const c of cats.filter((x) => x.parent_id === parent)) {
        const hasKids = cats.some((x) => x.parent_id === c.id);
        out.push({ c, depth, hasKids });
        if (hasKids) walk(c.id, depth + 1);
      }
    };
    walk(null, 0);
    return out;
  }

  private visible() {
    const byId = new Map(this.data!.categories.map((c) => [c.id, c]));
    return this.tree().filter(({ c }) => {
      for (let p = c.parent_id; p != null; p = byId.get(p)?.parent_id ?? null)
        if (!this.expanded.has(p)) return false;
      return true;
    });
  }

  private toggle(id: number) {
    const s = new Set(this.expanded);
    if (!s.delete(id)) s.add(id);
    this.expanded = s;
  }

  private catDetail(c: Category) {
    const parts = (["unit_id", "default_location_id", "expiry_type", "warn_days"] as const)
      .filter((f) => c[f] != null)
      .map((f) => this.fmt(f, c[f]));
    if (c.min_stock != null) {
      const u = this.fmt("unit_id", c.effective.unit_id.value);
      parts.push(
        t("settings.category.min", {
          value: `${this.num(c.min_stock)} ${u === "–" ? "" : u}`.trim(),
        }),
      );
    }
    return parts.join(" · ");
  }

  // ---- rendering ----
  render() {
    const sec = this.sec;
    const table = SECTIONS[sec];
    return html`
      <nav aria-label=${t("settings.nav")}>
        ${(Object.keys(SECTIONS) as Section[]).map(
          (s) =>
            html`<button aria-current=${s === sec ? "page" : "false"} @click=${() => this.nav(s)}>
              ${t(`settings.section.${s}`)}
            </button>`,
        )}
      </nav>
      ${this.pageError ? html`<p class="error" role="alert">${this.pageError}</p>` : nothing}
      ${
        this.data
          ? html`<div class="bar">
                <button class="primary" @click=${() => this.open(table)}>${t(ADD[table])}</button>
              </div>
              ${sec === "categories" ? this.renderCategories() : sec === "locations" ? this.renderLocations() : this.renderUnits()}`
          : nothing
      }
      ${this.renderDialog()}
    `;
  }

  private empty(rows: unknown[]) {
    return rows.length ? nothing : html`<p class="empty">${t("common.empty")}</p>`;
  }

  private row(
    name: string,
    detail: string,
    onClick: () => void,
    depth = 0,
    lead: unknown = nothing,
    trail: unknown = nothing,
  ) {
    return html`<li style="padding-left:${depth * 24}px">
      ${lead}
      <button class="row" @click=${onClick}>
        <span>${name}</span>${detail ? html`<span class="detail">${detail}</span>` : nothing}
      </button>
      ${trail}
    </li>`;
  }

  private actions(table: Table, row: { id: number; name: string }) {
    return rowActions({
      testid: table,
      name: row.name,
      onEdit: () => this.open(table, row),
      onDelete: () => this.delRow(table, row),
      ...(table === "category"
        ? {
            onAdd: () => this.open("category", undefined, { parent_id: row.id }),
            addLabel: t("settings.category.add_sub_to", { name: row.name }),
          }
        : {}),
    });
  }

  /** Delete straight from the list; errors (e.g. still in use) show above the list. */
  private async delRow(table: Table, row: { id: number; name: string }) {
    if (!confirm(t("common.confirm_delete", { name: row.name }))) return;
    try {
      await deleteRow(this.hass!, table, row.id);
      this.pageError = "";
    } catch (err) {
      this.pageError = await errorMessage(this.hass!, err);
      return;
    }
    await this.load();
  }

  private renderLocations() {
    const rows = this.data!.locations;
    return html`<ul>
        ${rows.map((l) => this.row(l.name, "", () => this.open("location", l), 0, nothing, this.actions("location", l)))}
      </ul>
      ${this.empty(rows)}`;
  }

  private renderUnits() {
    const { units } = this.data!;
    const detail = (u: (typeof units)[number]) => {
      const base = units.find((b) => b.id === u.base_unit_id);
      return [
        u.symbol,
        base
          ? `= ${this.num(u.factor)} ${base.symbol}`
          : u.is_count
            ? t("settings.unit.count")
            : "",
      ]
        .filter(Boolean)
        .join(" · ");
    };
    return html`<ul>
        ${units.map((u) => this.row(u.name, detail(u), () => this.open("unit", u), 0, nothing, this.actions("unit", u)))}
      </ul>
      ${this.empty(units)}`;
  }

  private renderCategories() {
    return html`<ul>
        ${this.visible().map(({ c, depth, hasKids }) => {
          const open = this.expanded.has(c.id);
          const lead = hasKids
            ? html`<button
                class="chev"
                aria-expanded=${open}
                aria-label=${t(open ? "common.collapse" : "common.expand")}
                @click=${() => this.toggle(c.id)}
              >
                ${icon(open ? mdiChevronDown : mdiChevronRight)}
              </button>`
            : html`<span class="chev"></span>`;
          // A row with children opens and closes; editing has its own button.
          const actions = this.actions("category", c);
          const click = hasKids ? () => this.toggle(c.id) : () => this.open("category", c);
          return this.row(c.name, this.catDetail(c), click, depth, lead, actions);
        })}
      </ul>
      ${this.empty(this.data!.categories)}`;
  }

  private field(label: string, control: unknown) {
    return html`<label><span class="lbl">${label}</span>${control}</label>`;
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
        step=${key === "warn_days" ? "1" : "any"}
        min=${key === "factor" ? "0.000001" : "0"}
        placeholder=${placeholder}
        aria-invalid=${!!this.errs[key]}
        .value=${String(d[key] ?? "")}
        ?disabled=${key === "factor" && (d.base_unit_id == null || this.usedAsBase(d))}
        @input=${(e: Event) => {
          const v = (e.target as HTMLInputElement).value;
          let n = v === "" ? null : Number(v);
          if (key === "min_stock" && !n) n = null;
          this.set(key, n);
        }}
      />${suffix ? html`<span class="detail">${suffix}</span>` : nothing}</span
    >${key === "warn_days" ? nothing : fieldMsg(this.errs[key], key)}`;
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
      <option value="" ?selected=${cur == null}>${first}</option>
      ${options.map(([v, l]) => html`<option value=${v} ?selected=${cur === v}>${l}</option>`)}
    </select>`;
  }

  private reset(key: string) {
    return this.edit!.d[key] == null
      ? nothing
      : html`<button type="button" class="reset" @click=${() => this.set(key, null)}>
          ${icon(mdiRestore)}${t("common.reset")}
        </button>`;
  }

  private inh(field: InheritField, label: string, options: Opts, numeric = true) {
    const inh = this.inherited(field, this.edit!.d.parent_id);
    const value = this.fmt(field, inh.value);
    const source = this.sourceLabel(inh.source);
    const control =
      field === "warn_days"
        ? this.numInput(field, t("common.default", { value, source }), t("common.days_unit"))
        : this.select(field, options, t("common.default", { value, source }), numeric);
    return this.field(
      label,
      html`<span class="inh">${control}${this.reset(field)}</span>${fieldMsg(this.errs[field], field)}`,
    );
  }

  private renderDialog() {
    const e = this.edit;
    if (!e || !this.data) return html`<dialog></dialog>`;
    const { table, d, orig } = e;
    this.errs = this.errors();
    const { units, locations } = this.data;
    let fields: unknown;
    if (table === "location") {
      fields = this.field(t("common.name"), this.text("name"));
    } else if (table === "unit") {
      const bases: Opts = units
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
        ${this.field(t("settings.unit.base"), this.select("base_unit_id", bases, t("common.none"), true, this.usedAsBase(d)))}
        ${this.field(t("settings.unit.factor"), this.numInput("factor"))}`;
    } else {
      const unit = d.unit_id ?? this.inherited("unit_id", d.parent_id).value;
      const suffix = this.fmt("unit_id", unit);
      const tags = this.data.categories.find((x) => x.id === d.id)?.off_tags ?? [];
      fields = html`${this.field(t("common.name"), this.text("name"))}
      <div class="field">
        <span class="lbl">${t("settings.category.parent")}</span>
        <pantry-category-picker
          .categories=${this.data.categories}
          .value=${d.parent_id ?? null}
          .noneLabel=${t("settings.category.no_parent")}
          .exclude=${d.id}
          @change=${(ev: CustomEvent<number | null>) => this.set("parent_id", ev.detail)}
        ></pantry-category-picker>
      </div>
      ${this.inh(
        "unit_id",
        t("settings.category.unit"),
        units.map((u) => [u.id, u.symbol ? `${u.name} (${u.symbol})` : u.name]),
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
      ${this.field(t("settings.category.min_stock"), this.numInput("min_stock", "", suffix === "–" ? "" : suffix))}
      ${tags.length ? html`<p class="detail">${t("settings.category.off_tags", { tags: tags.join(", ") })}</p>` : nothing}`;
    }
    const close = () => this.renderRoot.querySelector("dialog")?.close();
    const dirty = () => COLUMNS[table].some((c) => (d[c] ?? null) !== (orig[c] ?? null));
    const parent = table === "category" && !d.id && d.parent_id != null ? this.catName(d.parent_id) : "";
    const title = d.id
      ? t("common.edit_name", { name: orig.name })
      : parent
        ? t("settings.category.add_sub_to", { name: parent })
        : t(ADD[table]);
    return html`<dialog
      @close=${() => (this.edit = undefined)}
      @click=${backdropClick(dirty)}
      @cancel=${escGuard(dirty)}
    >
      <form @submit=${this.save}>
        <h2>${title}</h2>
        ${fields} ${this.error ? html`<p class="error" role="alert">${this.error}</p>` : nothing}
        <div class="actions">
          <button type="button" @click=${close}>${t("common.cancel")}</button>
          <button class="primary" type="submit" data-testid="save" ?disabled=${Object.keys(this.errs).length > 0}>
            ${t("common.save")}
          </button>
        </div>
      </form>
    </dialog>`;
  }

  static styles = [
    formStyles,
    css`
    nav {
      display: flex;
      gap: 4px;
      margin-bottom: 12px;
    }
    nav button[aria-current="page"] {
      color: var(--primary-color);
      border-color: var(--primary-color);
    }
    .bar {
      margin-bottom: 8px;
    }
    .chev {
      flex: none;
      width: 36px;
      height: 36px;
      padding: 0;
      border: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `,
  ];
}

customElements.define("pantry-settings", PantrySettings);
