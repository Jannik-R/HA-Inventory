import { LitElement, html } from "lit";
import { t } from "./i18n";
import { editDialog, fieldMsg, rowActions } from "./ui";
import { formStyles } from "./styles";
import { errorMessage, type Hass } from "./api";

const CLOCK = /^([01][0-9]|2[0-3]):[0-5][0-9]$/;

/** Start time per meal (settings): decides "the current meal", e.g. for the action
 * `home_inventory.print_planned` without a meal. List of the five meals, one edit dialog. */
export class HomeInventoryMealTimes extends LitElement {
  static properties = {
    hass: { attribute: false },
    starts: { state: true },
    d: { state: true },
    error: { state: true },
  };

  declare hass?: Hass;
  declare starts?: string[];
  declare d?: string[];
  declare error: string;

  constructor() {
    super();
    this.error = "";
  }

  connectedCallback() {
    super.connectedCallback();
    void this.load();
  }

  private async load() {
    try {
      const rows = await this.hass!.callWS<{ slot: number; start: string }[]>({
        type: "home_inventory/meal_times",
      });
      this.starts = rows.map((r) => r.start);
    } catch (err) {
      this.error = await errorMessage(this.hass!, err);
    }
  }

  private async open() {
    this.error = "";
    this.d = [...this.starts!];
    await this.updateComplete;
    this.renderRoot.querySelector("dialog")!.showModal();
    this.renderRoot.querySelector<HTMLElement>("dialog input")?.focus();
  }

  private async save(e: Event) {
    e.preventDefault();
    if (this.d!.some((v) => !CLOCK.test(v))) return;
    try {
      await this.hass!.callWS({ type: "home_inventory/meal_times_save", starts: this.d });
      this.starts = [...this.d!];
      this.renderRoot.querySelector("dialog")?.close();
    } catch (err) {
      this.error = await errorMessage(this.hass!, err);
    }
  }

  render() {
    if (!this.starts) return html`${this.error ? html`<p class="error">${this.error}</p>` : ""}`;
    const d = this.d;
    return html`<p class="detail intro">${t("settings.meals.hint")}</p>
      <ul>
        ${this.starts.map(
          (start, n) =>
            html`<li>
              <button class="row" data-testid="meal-time-row" @click=${this.open}>
                <span>${t(`plan.slot.${n}`)}</span>
                <span class="detail">${t("settings.meals.from", { time: start })}</span>
              </button>
              ${rowActions({ testid: "meal-time", name: t(`plan.slot.${n}`), onEdit: () => this.open() })}
            </li>`,
        )}
      </ul>
      ${
        d
          ? editDialog({
              title: t("settings.meals.edit"),
              body: html`${d.map(
                (v, n) =>
                  html`<label>
                    <span class="lbl">${t(`plan.slot.${n}`)}</span>
                    <input
                      type="time"
                      data-testid=${`meal-time-${n}`}
                      aria-invalid=${!CLOCK.test(v)}
                      .value=${v}
                      @input=${(e: Event) =>
                        (this.d = d.map((x, k) =>
                          k === n ? (e.target as HTMLInputElement).value : x,
                        ))}
                    />
                    ${fieldMsg(CLOCK.test(v) ? undefined : t("valid.time"), `meal-time-${n}`)}
                  </label>`,
              )}`,
              error: this.error,
              invalid: d.some((v) => !CLOCK.test(v)),
              dirty: () => JSON.stringify(this.d) !== JSON.stringify(this.starts),
              onSubmit: (e) => this.save(e),
              onClosed: () => (this.d = undefined),
            })
          : html`<dialog></dialog>`
      }`;
  }

  static styles = [formStyles];
}

customElements.define("home-inventory-meal-times", HomeInventoryMealTimes);
