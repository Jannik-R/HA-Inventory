import { LitElement, html } from "lit";
import { t } from "./i18n";
import { dateInvalid, editDialog, fieldMsg, todayIso } from "./ui";
import { formStyles } from "./styles";
import { errorMessage, type Hass } from "./api";
import { planToShoppingList } from "./api-plan";
import { addDays, iso, parse } from "./plan-dates";

const MAX_DAYS = 366;
const daysBetween = (from: string, to: string) =>
  Math.round((parse(to).getTime() - parse(from).getTime()) / 86400000);

/**
 * Put the recipes planned from a start to an end date on the shopping list. Call `open()`;
 * fires `pantry-shopped` (detail = result message) after saving.
 */
export class PantryPlanShoppingDialog extends LitElement {
  static properties = {
    hass: { attribute: false },
    from: { state: true },
    to: { state: true },
    bad: { state: true },
    active: { state: true },
    error: { state: true },
  };

  declare hass?: Hass;
  declare from: string;
  declare to: string;
  declare bad: { from: boolean; to: boolean };
  declare active: boolean;
  declare error: string;

  constructor() {
    super();
    this.from = this.to = "";
    this.bad = { from: false, to: false };
    this.active = false;
    this.error = "";
  }

  async open() {
    this.from = todayIso();
    this.to = iso(addDays(parse(this.from), 6));
    this.bad = { from: false, to: false };
    this.error = "";
    this.active = true;
    await this.updateComplete;
    this.renderRoot.querySelector("dialog")!.showModal();
    this.renderRoot.querySelector<HTMLElement>("dialog input")?.focus();
  }

  private errors() {
    const e: { from?: string; to?: string } = {};
    if (!this.from || dateInvalid(this.bad.from, this.from)) e.from = t("valid.date");
    if (!this.to || dateInvalid(this.bad.to, this.to)) e.to = t("valid.date");
    else if (!e.from && this.to < this.from) e.to = t("plan.shop.order");
    else if (!e.from && daysBetween(this.from, this.to) >= MAX_DAYS)
      e.to = t("plan.shop.long", { max: MAX_DAYS });
    return e;
  }

  private async save(ev: Event) {
    ev.preventDefault();
    if (Object.keys(this.errors()).length) return;
    try {
      const res = await planToShoppingList(this.hass!, this.from, this.to);
      this.renderRoot.querySelector("dialog")?.close();
      const message = res.recipes.length
        ? t("plan.shop.done", {
            recipes: res.recipes.map((r) => `${r.name} (${r.servings})`).join(", "),
          })
        : t("plan.shop.none");
      this.dispatchEvent(
        new CustomEvent("pantry-shopped", { detail: message, bubbles: true, composed: true }),
      );
    } catch (err) {
      this.error = await errorMessage(this.hass!, err);
    }
  }

  private field(key: "from" | "to", label: string, err?: string) {
    return html`<label>
      <span class="lbl">${label}</span>
      <input
        type="date"
        min="2000-01-01"
        max="2099-12-31"
        data-testid=${`plan-shop-${key}`}
        aria-invalid=${!!err}
        .value=${this[key]}
        @input=${(e: Event) => {
          const el = e.target as HTMLInputElement;
          this[key] = el.value;
          this.bad = { ...this.bad, [key]: el.validity.badInput };
        }}
      />
      ${fieldMsg(err, `plan-shop-${key}`)}
    </label>`;
  }

  render() {
    if (!this.active) return html`<dialog></dialog>`;
    const err = this.errors();
    return editDialog({
      title: t("plan.shop.title"),
      body: html`<p class="hint">${t("plan.shop.hint")}</p>
        ${this.field("from", t("plan.shop.from"), err.from)}
        ${this.field("to", t("plan.shop.to"), err.to)}`,
      error: this.error,
      invalid: Object.keys(err).length > 0,
      submit: { label: t("plan.shop.submit"), testid: "plan-shop-save" },
      dirty: () => false,
      onSubmit: (e) => this.save(e),
      onClosed: () => (this.active = false),
    });
  }

  static styles = formStyles;
}

customElements.define("pantry-plan-shopping-dialog", PantryPlanShoppingDialog);
