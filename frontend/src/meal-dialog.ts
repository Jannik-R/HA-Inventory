import { LitElement, html } from "lit";
import { t } from "./i18n";
import { dateInvalid, editDialog, fieldMsg, numOrNull } from "./ui";
import { formStyles } from "./styles";
import { errorMessage, type Hass, type Recipe } from "./api";
import { DINNER, SLOTS } from "./plan-dates";
import { saveMeal, type Meal } from "./api-plan";

interface Draft {
  day: string;
  slot: number;
  text: string;
  servings: number | null;
  dateBad: boolean;
}

/** Add or edit a meal of the week plan: `open(day, slot, recipes, servings, meal?, text?)`; fires `pantry-saved`. */
export class PantryMealDialog extends LitElement {
  static properties = {
    hass: { attribute: false },
    draft: { state: true },
    active: { state: true },
    error: { state: true },
  };

  declare hass?: Hass;
  declare draft: Draft;
  declare active: boolean;
  declare error: string;
  private recipes: Recipe[] = [];
  private meal?: Meal;
  private initial = "";

  constructor() {
    super();
    this.draft = { day: "", slot: DINNER, text: "", servings: 1, dateBad: false };
    this.active = false;
    this.error = "";
  }

  async open(
    day: string,
    slot: number,
    recipes: Recipe[],
    servings: number,
    meal?: Meal,
    text = "",
  ) {
    this.recipes = recipes;
    this.meal = meal;
    this.draft = {
      day: meal?.day ?? day,
      slot: meal?.slot ?? slot,
      text: meal?.name ?? text,
      servings: meal?.servings ?? servings,
      dateBad: false,
    };
    this.initial = JSON.stringify(this.draft);
    this.error = "";
    this.active = true;
    await this.updateComplete;
    this.renderRoot.querySelector("dialog")!.showModal();
    this.renderRoot.querySelector<HTMLElement>("dialog input")?.focus();
  }

  private errors() {
    const d = this.draft;
    const e: Record<string, string> = {};
    if (!d.text.trim()) e.text = t("valid.required");
    if (!d.day || dateInvalid(d.dateBad, d.day)) e.day = t("valid.date");
    if (d.servings == null || !Number.isInteger(d.servings) || d.servings < 1 || d.servings > 99)
      e.servings = t("valid.servings");
    return e;
  }

  private async save(ev: Event) {
    ev.preventDefault();
    if (Object.keys(this.errors()).length) return;
    const d = this.draft;
    const text = d.text.trim();
    try {
      await saveMeal(this.hass!, {
        ...(this.meal ? { id: this.meal.id } : {}),
        day: d.day,
        slot: d.slot,
        // An exact recipe name links the recipe; anything else is free text.
        recipe_id: this.recipes.find((r) => r.name === text)?.id ?? null,
        text,
        servings: d.servings!,
      });
    } catch (err) {
      this.error = await errorMessage(this.hass!, err);
      return;
    }
    this.renderRoot.querySelector("dialog")?.close();
    this.dispatchEvent(new CustomEvent("pantry-saved", { bubbles: true, composed: true }));
  }

  render() {
    if (!this.active) return html`<dialog></dialog>`;
    const e = this.errors();
    const d = this.draft;
    return editDialog({
      title: this.meal ? t("common.edit_name", { name: this.meal.name }) : t("plan.add"),
      body: html`<label>
          <span class="lbl">${t("plan.date")}</span>
          <input
            type="date"
            min="2000-01-01"
            max="2099-12-31"
            data-testid="meal-day"
            aria-invalid=${!!e.day}
            .value=${d.day}
            @input=${(ev: Event) => {
              const el = ev.target as HTMLInputElement;
              this.draft = { ...d, day: el.value, dateBad: el.validity.badInput };
            }}
          />
          ${fieldMsg(e.day, "meal-day")}
        </label>
        <label>
          <span class="lbl">${t("plan.slot_label")}</span>
          <select
            data-testid="meal-slot"
            .value=${String(d.slot)}
            @change=${(ev: Event) =>
              (this.draft = { ...d, slot: Number((ev.target as HTMLSelectElement).value) })}
          >
            ${SLOTS.map(
              (s) =>
                html`<option value=${s} ?selected=${s === d.slot}>${t(`plan.slot.${s}`)}</option>`,
            )}
          </select>
        </label>
        <label>
          <span class="lbl">${t("plan.dish")}</span>
          <input
            type="text"
            list="meal-recipes"
            data-testid="meal-text"
            aria-invalid=${!!e.text}
            .value=${d.text}
            @input=${(ev: Event) =>
              (this.draft = { ...d, text: (ev.target as HTMLInputElement).value })}
          />
          <datalist id="meal-recipes">
            ${this.recipes.map((r) => html`<option value=${r.name}></option>`)}
          </datalist>
          ${fieldMsg(e.text, "meal-text")}
        </label>
        <label>
          <span class="lbl">${t("recipes.servings")}</span>
          <input
            type="number"
            min="1"
            max="99"
            step="1"
            inputmode="numeric"
            data-testid="meal-servings"
            aria-invalid=${!!e.servings}
            .value=${String(d.servings ?? "")}
            @input=${(ev: Event) =>
              (this.draft = {
                ...d,
                servings: numOrNull((ev.target as HTMLInputElement).value),
              })}
          />
          ${fieldMsg(e.servings, "meal-servings")}
        </label>`,
      error: this.error,
      invalid: Object.keys(e).length > 0,
      submit: { label: t("common.save"), testid: "meal-save" },
      dirty: () => JSON.stringify(this.draft) !== this.initial,
      onSubmit: (ev) => this.save(ev),
      onClosed: () => (this.active = false),
    });
  }

  static styles = formStyles;
}

customElements.define("pantry-meal-dialog", PantryMealDialog);
