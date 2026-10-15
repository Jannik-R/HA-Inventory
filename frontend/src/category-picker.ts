import { LitElement, css, html, nothing } from "lit";
import { mdiMenuDown } from "@mdi/js";
import { t } from "./i18n";
import { backdropClick, chevron, formStyles, icon, toggled } from "./ui";
import type { Category } from "./api";

/** Category field: shows the chosen path, opens a tree (with a filter) in a dialog. Fires `change`. */
export class PantryCategoryPicker extends LitElement {
  static properties = {
    categories: { attribute: false },
    value: { attribute: false },
    noneLabel: { attribute: false },
    exclude: { attribute: false },
    expanded: { state: true },
    filter: { state: true },
    draft: { state: true },
  };

  declare categories: Category[];
  declare value: number | null;
  /** If set, "no category" is a choice with this label (e.g. main category). */
  declare noneLabel?: string;
  /** Category whose subtree is hidden (a category cannot be its own parent). */
  declare exclude?: number;
  declare expanded: Set<number>;
  declare filter: string;
  // Marked in the dialog (null = "none", undefined = nothing marked); becomes the value on confirm.
  declare draft: number | null | undefined;

  constructor() {
    super();
    this.categories = [];
    this.value = null;
    this.expanded = new Set();
    this.filter = "";
    this.draft = undefined;
  }

  private get byId() {
    return new Map(this.categories.map((c) => [c.id, c]));
  }

  /** Ids from the root down to id. */
  private chain(id: number | null): number[] {
    const byId = this.byId;
    const ids: number[] = [];
    for (let c = id; c != null; c = byId.get(c)?.parent_id ?? null) ids.unshift(c);
    return ids;
  }

  private path(id: number) {
    const byId = this.byId;
    return this.chain(id)
      .map((c) => byId.get(c)!.name)
      .join(" › ");
  }

  private kids(parent: number | null) {
    return this.categories
      .filter((c) => c.parent_id === parent && c.id !== this.exclude)
      .sort((a, b) => a.sort - b.sort);
  }

  async open() {
    this.filter = "";
    this.draft = this.value ?? (this.noneLabel ? null : undefined);
    this.expanded = new Set(this.chain(this.value));
    await this.updateComplete;
    this.renderRoot.querySelector("dialog")!.showModal();
    this.renderRoot.querySelector<HTMLElement>("[aria-current=true], input")?.focus();
  }

  private confirm() {
    this.renderRoot.querySelector("dialog")!.close();
    if (this.draft !== undefined)
      this.dispatchEvent(new CustomEvent("change", { detail: this.draft }));
  }

  /** Mark a category; a closed parent also opens, so its children can be picked next. */
  private mark(id: number) {
    this.draft = id;
    if (!this.expanded.has(id) && this.kids(id).length) this.toggle(id);
  }

  private toggle(id: number) {
    this.expanded = toggled(this.expanded, id);
  }

  /** Visible rows: the expanded tree, or all matches (with path) while filtering. */
  private rows(): { c: Category; depth: number; label: string }[] {
    const q = this.filter.trim().toLocaleLowerCase();
    if (q) {
      return this.categories
        .filter((c) => c.name.toLocaleLowerCase().includes(q))
        .filter((c) => this.exclude == null || !this.chain(c.id).includes(this.exclude))
        .map((c) => ({ c, depth: 0, label: this.path(c.id) }));
    }
    const out: { c: Category; depth: number; label: string }[] = [];
    const walk = (parent: number | null, depth: number) =>
      this.kids(parent).forEach((c) => {
        out.push({ c, depth, label: c.name });
        if (this.expanded.has(c.id)) walk(c.id, depth + 1);
      });
    walk(null, 0);
    return out;
  }

  private filterKey(e: KeyboardEvent) {
    if (e.key !== "Enter") return;
    e.preventDefault();
    const [first] = this.rows();
    if (first) this.draft = first.c.id;
  }

  render() {
    const rows = this.rows();
    const filtering = !!this.filter.trim();
    return html`<button
        type="button"
        class="field"
        data-testid="category"
        aria-haspopup="dialog"
        @click=${this.open}
      >
        <span class=${this.value == null ? "unset" : ""}>
          ${this.value == null ? (this.noneLabel ?? t("book.choose")) : this.path(this.value)}
        </span>
        ${icon(mdiMenuDown)}
      </button>
      <dialog @click=${backdropClick()}>
        <h2>${t("book.choose_category")}</h2>
        <input
          type="search"
          data-testid="category-filter"
          aria-label=${t("book.filter")}
          placeholder=${t("book.filter")}
          .value=${this.filter}
          @input=${(e: Event) => (this.filter = (e.target as HTMLInputElement).value)}
          @keydown=${this.filterKey}
        />
        <ul>
          ${
            this.noneLabel && !filtering
              ? html`<li>
                  <span class="chev"></span>
                  <button
                    type="button"
                    class="row"
                    data-testid="category-option"
                    aria-current=${this.draft === null}
                    @click=${() => (this.draft = null)}
                    @dblclick=${this.confirm}
                  >
                    ${this.noneLabel}
                  </button>
                </li>`
              : nothing
          }
          ${rows.map(({ c, depth, label }) => {
            const kids = !filtering && this.kids(c.id).length > 0;
            const open = this.expanded.has(c.id);
            return html`<li style="padding-left: ${depth * 20}px">
              ${
                kids
                  ? chevron(open, () => this.toggle(c.id))
                  : filtering
                    ? nothing
                    : html`<span class="chev"></span>`
              }
              <button
                type="button"
                class="row"
                data-testid="category-option"
                aria-current=${c.id === this.draft}
                @click=${() => this.mark(c.id)}
                @dblclick=${this.confirm}
              >
                ${label}
              </button>
            </li>`;
          })}
        </ul>
        ${rows.length ? nothing : html`<p class="empty">${t("book.no_hits")}</p>`}
        <div class="actions">
          <button type="button" @click=${() => this.renderRoot.querySelector("dialog")!.close()}>
            ${t("common.cancel")}
          </button>
          <button
            type="button"
            class="primary"
            data-testid="category-confirm"
            ?disabled=${this.draft === undefined}
            @click=${this.confirm}
          >
            ${t("book.apply")}
          </button>
        </div>
      </dialog>`;
  }

  static styles = [
    formStyles,
    css`
      :host {
        display: block;
      }
      .field {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        padding: 8px;
        text-align: left;
        background: var(--card-background-color, var(--primary-background-color));
      }
      .unset {
        color: var(--secondary-text-color);
      }
      dialog input {
        margin-bottom: 8px;
      }
      ul {
        max-height: 55vh;
        overflow-y: auto;
        margin-bottom: 12px;
      }
      .row[aria-current="true"] {
        color: var(--primary-color);
        font-weight: 500;
      }
    `,
  ];
}

customElements.define("pantry-category-picker", PantryCategoryPicker);
