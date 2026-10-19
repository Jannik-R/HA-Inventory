import { LitElement, css, html, nothing } from "lit";
import { mdiMenuDown } from "@mdi/js";
import { t } from "./i18n";
import { backdropClick, chevron, icon, toggled } from "./ui";
import { includesCI } from "./format";
import { formStyles } from "./styles";
import { addProductType, errorMessage, getMasterData, type Category, type Hass } from "./api";
import { categoryPath } from "./inherit";

/**
 * Category field: shows the chosen path, opens a tree (with a filter) in a dialog. Fires `change`.
 * With `hass`, a filter text without exact match can be created below a chosen category; then it
 * also fires `master` (bubbling, MasterData) so the host can refresh its categories.
 */
export class HomeInventoryCategoryPicker extends LitElement {
  static properties = {
    categories: { attribute: false },
    value: { attribute: false },
    noneLabel: { attribute: false },
    exclude: { attribute: false },
    expanded: { state: true },
    filter: { state: true },
    draft: { state: true },
    hass: { attribute: false },
    creating: { state: true },
    failure: { state: true },
    busy: { state: true },
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
  declare hass?: Hass;
  /** Name of the category to create; the dialog then picks its parent. */
  declare creating?: string;
  declare failure?: string;
  declare busy: boolean;

  constructor() {
    super();
    this.categories = [];
    this.value = null;
    this.expanded = new Set();
    this.filter = "";
    this.draft = undefined;
    this.busy = false;
  }

  /** Ids from the root down to id. */
  private chain(id: number | null): number[] {
    const ids: number[] = [];
    for (let c = id; c != null; c = this.categories.find((x) => x.id === c)?.parent_id ?? null)
      ids.unshift(c);
    return ids;
  }

  private kids(parent: number | null) {
    return this.categories
      .filter((c) => c.parent_id === parent && c.id !== this.exclude)
      .sort((a, b) => a.sort - b.sort);
  }

  async open() {
    this.filter = "";
    this.creating = this.failure = undefined;
    this.draft = this.value ?? (this.noneLabel ? null : undefined);
    this.expanded = new Set(this.chain(this.value));
    await this.updateComplete;
    this.renderRoot.querySelector("dialog")!.showModal();
    this.renderRoot.querySelector<HTMLElement>("[aria-current=true], input")?.focus();
  }

  private async confirm() {
    if (this.creating) return this.create(this.draft);
    this.renderRoot.querySelector("dialog")!.close();
    if (this.draft !== undefined)
      this.dispatchEvent(new CustomEvent("change", { detail: this.draft }));
  }

  private startCreate(name: string) {
    this.creating = name;
    this.filter = "";
    this.draft = undefined;
  }

  private async create(parent: number | null | undefined) {
    if (parent == null || this.busy) return;
    this.busy = true;
    try {
      const { id } = await addProductType(this.hass!, this.creating!, parent);
      const md = await getMasterData(this.hass!);
      this.dispatchEvent(new CustomEvent("master", { detail: md, bubbles: true, composed: true }));
      this.renderRoot.querySelector("dialog")!.close();
      this.dispatchEvent(new CustomEvent("change", { detail: id }));
    } catch (err) {
      this.failure = await errorMessage(this.hass!, err);
    } finally {
      this.busy = false;
    }
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
    const q = this.filter.trim();
    if (q) {
      return this.categories
        .filter((c) => includesCI(c.name, q))
        .filter((c) => this.exclude == null || !this.chain(c.id).includes(this.exclude))
        .map((c) => ({ c, depth: 0, label: categoryPath(this.categories, c.id) }));
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
    const q = this.filter.trim();
    const filtering = !!q;
    const canCreate =
      this.hass &&
      !this.creating &&
      filtering &&
      !this.categories.some((c) => c.name.toLocaleLowerCase() === q.toLocaleLowerCase());
    return html`<button
        type="button"
        class="field"
        data-testid="category"
        aria-haspopup="dialog"
        @click=${this.open}
      >
        <span class=${this.value == null ? "unset" : ""}>
          ${this.value == null ? (this.noneLabel ?? t("book.choose")) : categoryPath(this.categories, this.value)}
        </span>
        ${icon(mdiMenuDown)}
      </button>
      <dialog @click=${backdropClick()}>
        <h2>
          ${this.creating ? t("book.choose_parent", { name: this.creating }) : t("book.choose_category")}
        </h2>
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
            this.noneLabel && !filtering && !this.creating
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
        ${
          canCreate
            ? html`<button
                type="button"
                class="reset"
                data-testid="category-create"
                @click=${() => this.startCreate(q)}
              >
                ${t("book.create_category", { name: q })}
              </button>`
            : rows.length
              ? nothing
              : html`<p class="empty">${t("book.no_hits")}</p>`
        }
        ${this.failure ? html`<p class="error" role="alert">${this.failure}</p>` : nothing}
        <div class="actions">
          <button type="button" @click=${() => this.renderRoot.querySelector("dialog")!.close()}>
            ${t("common.cancel")}
          </button>
          <button
            type="button"
            class="primary"
            data-testid="category-confirm"
            ?disabled=${this.draft === undefined || this.busy}
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

customElements.define("home-inventory-category-picker", HomeInventoryCategoryPicker);
