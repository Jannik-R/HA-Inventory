import { LitElement, css, html, nothing, svg, type PropertyValues } from "lit";
import { mdiChevronDown, mdiChevronRight, mdiRestore } from "@mdi/js";
import { t } from "./i18n";
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
const icon = (path: string) =>
  html`<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
    ${svg`<path d=${path} fill="currentColor"></path>`}
  </svg>`;

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

  private async save(e: Event) {
    e.preventDefault();
    const { table, d } = this.edit!;
    const payload: Draft = {};
    for (const c of COLUMNS[table]) payload[c] = d[c];
    if (d.id) payload.id = d.id;
    await this.run(() => saveRow(this.hass!, table, payload));
  }

  private async del() {
    const { table, d } = this.edit!;
    if (!confirm(t("common.confirm_delete", { name: d.name }))) return;
    await this.run(() => deleteRow(this.hass!, table, d.id));
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
  ) {
    return html`<li style="padding-left:${depth * 24}px">
      ${lead}
      <button class="row" @click=${onClick}>
        <span>${name}</span>${detail ? html`<span class="detail">${detail}</span>` : nothing}
      </button>
    </li>`;
  }

  private renderLocations() {
    const rows = this.data!.locations;
    return html`<ul>
        ${rows.map((l) => this.row(l.name, "", () => this.open("location", l)))}
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
        ${units.map((u) => this.row(u.name, detail(u), () => this.open("unit", u)))}
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
          return this.row(c.name, this.catDetail(c), () => this.open("category", c), depth, lead);
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
      @input=${(e: Event) => this.set(key, (e.target as HTMLInputElement).value)}
    />`;
  }

  private numInput(key: string, placeholder = "", suffix = "") {
    const d = this.edit!.d;
    return html`<span class="num"
      ><input
        type="number"
        step=${key === "warn_days" ? "1" : "any"}
        min=${key === "factor" ? "0.000001" : "0"}
        placeholder=${placeholder}
        .value=${String(d[key] ?? "")}
        ?disabled=${key === "factor" && (d.base_unit_id == null || this.usedAsBase(d))}
        @input=${(e: Event) => {
          const v = (e.target as HTMLInputElement).value;
          let n = v === "" ? null : Number(v);
          if (n != null && key === "warn_days") n = Math.trunc(n);
          if (key === "min_stock" && !n) n = null;
          this.set(key, n);
        }}
      />${suffix ? html`<span class="detail">${suffix}</span>` : nothing}</span
    >`;
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
        ? this.numInput(field, `${value} (${source})`)
        : this.select(field, options, t("settings.inherit", { value, source }), numeric);
    return this.field(label, html`<span class="inh">${control}${this.reset(field)}</span>`);
  }

  /** Parent options as paths ("A › B"), without the edited category and its subtree. */
  private parentOptions(id?: number): Opts {
    const skip = new Set<number>();
    if (id) {
      skip.add(id);
      for (const { c } of this.tree()) if (skip.has(c.parent_id ?? -1)) skip.add(c.id);
    }
    const cats = this.data!.categories;
    const path = (c: Category): string =>
      c.parent_id == null ? c.name : `${path(cats.find((x) => x.id === c.parent_id)!)} › ${c.name}`;
    return this.tree()
      .filter(({ c }) => !skip.has(c.id))
      .map(({ c }) => [c.id, path(c)]);
  }

  /** A click on the backdrop targets the dialog itself, outside its box. */
  private backdropClick(e: MouseEvent) {
    const dlg = e.target as HTMLDialogElement;
    if (dlg.tagName !== "DIALOG") return;
    const r = dlg.getBoundingClientRect();
    const inside =
      e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
    if (!inside) dlg.close();
  }

  private renderDialog() {
    const e = this.edit;
    if (!e || !this.data) return html`<dialog></dialog>`;
    const { table, d, orig } = e;
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
      ${this.field(
        t("settings.category.parent"),
        this.select("parent_id", this.parentOptions(d.id), t("settings.category.no_parent")),
      )}
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
    return html`<dialog @close=${() => (this.edit = undefined)} @click=${this.backdropClick}>
      <form @submit=${this.save}>
        <h2>${d.id ? orig.name : t(ADD[table])}</h2>
        ${fields} ${this.error ? html`<p class="error" role="alert">${this.error}</p>` : nothing}
        <div class="actions">
          <button class="primary" type="submit">${t("common.save")}</button>
          <button type="button" @click=${close}>${t("common.cancel")}</button>
          ${
            table === "category" && d.id && COLUMNS.category.every((c) => d[c] === orig[c])
              ? html`<button
                  type="button"
                  @click=${() => this.open("category", undefined, { parent_id: d.id })}
                >
                  ${t("settings.category.add_sub")}
                </button>`
              : nothing
          }
          ${d.id ? html`<button type="button" class="danger" @click=${this.del}>${t("common.delete")}</button>` : nothing}
        </div>
      </form>
    </dialog>`;
  }

  static styles = css`
    :host {
      display: block;
      color: var(--primary-text-color);
    }
    button {
      font: inherit;
      color: inherit;
      background: none;
      border: 1px solid var(--divider-color);
      border-radius: 4px;
      padding: 8px 12px;
      cursor: pointer;
    }
    button:focus-visible,
    input:focus-visible,
    select:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 1px;
    }
    nav {
      display: flex;
      gap: 4px;
      margin-bottom: 12px;
    }
    nav button[aria-current="page"] {
      color: var(--primary-color);
      border-color: var(--primary-color);
    }
    .primary {
      background: var(--primary-color);
      border-color: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }
    .danger {
      color: var(--error-color);
      margin-left: auto;
    }
    .bar {
      margin-bottom: 8px;
    }
    ul {
      list-style: none;
      margin: 0;
      padding: 0;
    }
    li {
      display: flex;
      align-items: center;
      border-bottom: 1px solid var(--divider-color);
    }
    li .row {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 2px;
      border: 0;
      padding: 10px 8px;
      text-align: left;
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
    .detail,
    .empty {
      color: var(--secondary-text-color);
      font-size: 0.875em;
      margin: 0;
    }
    dialog {
      width: min(480px, calc(100vw - 32px));
      box-sizing: border-box;
      padding: 16px;
      border: 1px solid var(--divider-color);
      border-radius: 4px;
      background: var(--card-background-color, var(--primary-background-color));
      color: var(--primary-text-color);
    }
    dialog::backdrop {
      background: rgba(0, 0, 0, 0.5);
    }
    h2 {
      margin: 0 0 12px;
      font-size: 1.25em;
      font-weight: 500;
    }
    label {
      display: block;
      margin-bottom: 12px;
    }
    .lbl {
      display: block;
      margin-bottom: 4px;
      font-size: 0.875em;
      color: var(--secondary-text-color);
    }
    input:not([type="checkbox"]),
    select {
      font: inherit;
      width: 100%;
      box-sizing: border-box;
      padding: 8px;
      color: var(--primary-text-color);
      background: var(--card-background-color, var(--primary-background-color));
      border: 1px solid var(--divider-color);
      border-radius: 4px;
    }
    /* Inherited values (no own value) in secondary color, see CLAUDE.md UI rules. */
    select.unset,
    input::placeholder {
      color: var(--secondary-text-color);
      opacity: 1;
    }
    option {
      color: var(--primary-text-color);
    }
    .check {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .num,
    .inh {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .num {
      flex: 1;
    }
    .reset {
      flex: none;
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 6px 8px;
      font-size: 0.875em;
      color: var(--secondary-text-color);
    }
    .error {
      color: var(--error-color);
      margin: 0 0 12px;
    }
    .actions {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
  `;
}

customElements.define("pantry-settings", PantrySettings);
