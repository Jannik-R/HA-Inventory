import { LitElement, css, html, nothing, type PropertyValues } from "lit";
import { t } from "./i18n";
import { chevron, rowActions, toggled } from "./ui";
import { formStyles } from "./styles";
import "./settings-dialog";
import "./defaults-view";
import type { PantrySettingsDialog } from "./settings-dialog";
import type { Draft } from "./settings-model";
import { ADD } from "./settings-model";
import { fmt } from "./settings-format";
import { fmtNumber } from "./format";
import { deleteMasterRow } from "./delete-flow";
import {
  errorMessage,
  getMasterData,
  type Category,
  type Hass,
  type MasterData,
  type Table,
} from "./api";

// Section -> table it edits; "defaults" is one record with its own element.
const SECTIONS = {
  categories: "category",
  locations: "location",
  units: "unit",
  defaults: null,
} as const;
type Section = keyof typeof SECTIONS;

export class PantrySettings extends LitElement {
  static properties = {
    hass: { attribute: false },
    section: { attribute: false },
    data: { state: true },
    pageError: { state: true },
    expanded: { state: true },
  };

  declare hass?: Hass;
  declare section?: string;
  declare data?: MasterData;
  declare pageError: string;
  declare expanded: Set<number>;

  constructor() {
    super();
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
    this.renderRoot
      .querySelector<PantrySettingsDialog>("pantry-settings-dialog")
      ?.open(table, row, preset);
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
    this.expanded = toggled(this.expanded, id);
  }

  private catDetail(c: Category) {
    const md = this.data!;
    const parts = (["unit_id", "default_location_id", "expiry_type", "warn_days"] as const)
      .filter((f) => c[f] != null)
      .map((f) => fmt(md, this.hass, f, c[f]));
    if (c.min_stock != null) {
      const u = fmt(md, this.hass, "unit_id", c.min_stock_unit_id);
      parts.push(
        t("settings.category.min", { value: `${fmtNumber(this.hass, c.min_stock)} ${u}` }),
      );
    }
    if (c.min_packages != null)
      parts.push(t("settings.category.min", { value: t("book.count", { n: c.min_packages }) }));
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
            html`<button
              data-testid=${`settings-nav-${s}`}
              aria-current=${s === sec ? "page" : "false"}
              @click=${() => this.nav(s)}
            >
              ${t(`settings.section.${s}`)}
            </button>`,
        )}
      </nav>
      ${this.pageError ? html`<p class="error" role="alert">${this.pageError}</p>` : nothing}
      ${
        this.data
          ? table
            ? html`<div class="bar">
                  <button
                    class="primary"
                    data-testid="settings-add"
                    @click=${() => this.open(table)}
                  >
                    ${t(ADD[table])}
                  </button>
                </div>
                ${sec === "categories" ? this.renderCategories() : sec === "locations" ? this.renderLocations() : this.renderUnits()}`
            : html`<pantry-defaults
                .hass=${this.hass}
                .data=${this.data}
                @pantry-saved=${this.load}
              ></pantry-defaults>`
          : nothing
      }
      <pantry-settings-dialog
        .hass=${this.hass}
        .data=${this.data}
        @pantry-saved=${this.load}
      ></pantry-settings-dialog>
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
      <button class="row" data-testid="settings-row" @click=${onClick}>
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
    try {
      if (!(await deleteMasterRow(this.hass!, this.data!, table, row))) return;
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
        u.recipe_only ? t("settings.unit.recipe_only") : "",
        base
          ? `= ${fmtNumber(this.hass, u.factor)} ${base.symbol}`
          : u.recipe_only
            ? t("settings.unit.no_conversion") // counts as "any amount" against the stock
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
            ? chevron(open, () => this.toggle(c.id))
            : html`<span class="chev"></span>`;
          // A row with children opens and closes; editing has its own button.
          const actions = this.actions("category", c);
          const click = hasKids ? () => this.toggle(c.id) : () => this.open("category", c);
          return this.row(c.name, this.catDetail(c), click, depth, lead, actions);
        })}
      </ul>
      ${this.empty(this.data!.categories)}`;
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
    `,
  ];
}

customElements.define("pantry-settings", PantrySettings);
