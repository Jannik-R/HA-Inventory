import { LitElement, css, html, nothing } from "lit";
import { t } from "./i18n";
import { editDialog } from "./ui";
import { formStyles } from "./styles";
import { candidate, cookedRow, cookedRowStyles, defaults, rowError, type Row } from "./cooked-row";
import { doneLine, doneStyles } from "./booking-done";
import { errorMessage, type Hass, type Recipe } from "./api";
import {
  cookedBook,
  cookedProposal,
  cookedUndo,
  type CookedItem,
  type CookedResult,
} from "./api-cooked";

/**
 * "Gekocht": book out what a recipe used. Proposes a row per ingredient (product, batch,
 * packages, out / open / skip) the user can change; one confirm books the checked rows at once.
 * Call `open()`; fires `home-inventory-saved` after booking and after undo.
 */
export class HomeInventoryCookedDialog extends LitElement {
  static properties = {
    hass: { attribute: false },
    recipe: { state: true },
    rows: { state: true },
    result: { state: true },
    active: { state: true },
    error: { state: true },
  };

  declare hass?: Hass;
  declare recipe?: Recipe;
  declare rows: Row[];
  declare result?: CookedResult;
  declare active: boolean;
  declare error: string;
  private dirty = false;

  constructor() {
    super();
    this.rows = [];
    this.active = false;
    this.error = "";
  }

  async open(recipe: Recipe, servings: number) {
    this.error = "";
    this.result = undefined;
    this.dirty = false;
    try {
      const rows = await cookedProposal(this.hass!, recipe.id, servings);
      this.rows = rows.map((src) => ({
        src,
        checked: src.checked,
        ...defaults(src.candidates.find((c) => c.product_id === src.product_id)!),
      }));
    } catch (err) {
      this.rows = [];
      this.error = await errorMessage(this.hass!, err);
    }
    this.recipe = recipe;
    this.active = true;
    await this.updateComplete;
    this.renderRoot.querySelector("dialog")!.showModal();
  }

  private change(i: number, patch: Partial<Row>) {
    this.dirty = true;
    this.rows = this.rows.map((r, k) => (k === i ? { ...r, ...patch } : r));
  }

  private errors(): Record<number, string> {
    const out: Record<number, string> = {};
    this.rows.forEach((r, i) => {
      const e = rowError(r);
      if (e) out[i] = e;
    });
    return out;
  }

  private items(): CookedItem[] {
    return this.rows
      .filter((r) => r.checked && r.action !== "skip")
      .map((r) => ({
        product_id: r.product_id,
        batch_id: r.batch_id,
        packages: r.packages ?? 0,
        action: r.action as "out" | "open" | "reduce",
        open: r.action === "out" ? r.open : 0,
        remaining:
          r.action === "reduce"
            ? r.remaining
            : r.action === "open" || r.open
              ? (r.remaining ?? 1)
              : null,
      }));
  }

  private saved() {
    this.dispatchEvent(new CustomEvent("home-inventory-saved", { bubbles: true, composed: true }));
  }

  private async save(ev: Event) {
    ev.preventDefault();
    const items = this.items();
    if (!items.length || Object.keys(this.errors()).length) return;
    try {
      this.result = await cookedBook(this.hass!, items);
    } catch (err) {
      this.error = await errorMessage(this.hass!, err);
      return;
    }
    this.error = "";
    this.dirty = false;
    this.saved();
  }

  private async undo() {
    try {
      await cookedUndo(this.hass!, this.result!);
    } catch (err) {
      this.error = await errorMessage(this.hass!, err);
      return;
    }
    this.result = undefined;
    this.saved();
    this.renderRoot.querySelector("dialog")?.close();
  }

  private summary() {
    return this.result!.bookings.map((b) =>
      t(`cooked.done_${b.action}`, {
        n: b.packages,
        name: b.name,
      }),
    ).join(", ");
  }

  render() {
    if (!this.active || !this.recipe) return html`<dialog></dialog>`;
    const err = this.errors();
    const booked = !!this.result;
    return editDialog({
      title: t("cooked.title", { name: this.recipe.name }),
      body: booked
        ? doneLine(t("cooked.done", { what: this.summary() }), () => this.undo(), "cooked")
        : this.rows.length
          ? html`<p class="detail">${t("cooked.hint")}</p>
              <ul>
                ${this.rows.map((r, i) => cookedRow({ hass: this.hass, r, err: err[i], change: (p) => this.change(i, p) }))}
              </ul>`
          : html`<p class="empty" data-testid="cooked-empty">${t("cooked.empty")}</p>`,
      error: this.error,
      invalid: booked || !this.items().length || Object.keys(err).length > 0,
      submit: { label: t("cooked.submit"), testid: "cooked-save" },
      hideSubmit: booked,
      cancel: booked ? t("common.close") : undefined,
      dirty: () => this.dirty,
      onSubmit: (e) => this.save(e),
      onClosed: () => (this.active = false),
    });
  }

  static styles = [
    formStyles,
    doneStyles,
    cookedRowStyles,
    css`
      dialog {
        width: min(720px, calc(100vw - 32px));
        max-height: calc(100dvh - 32px);
        overflow-y: auto;
      }
    `,
  ];
}

customElements.define("home-inventory-cooked-dialog", HomeInventoryCookedDialog);
