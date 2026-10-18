import { LitElement, css, html, nothing, type PropertyValues } from "lit";
import { mdiChevronLeft, mdiChevronRight } from "@mdi/js";
import { t } from "./i18n";
import { confirmDelete } from "./confirm-dialog";
import { icon } from "./ui";
import { formStyles } from "./styles";
import { errorMessage, getRecipes, printPlan, type Hass, type Recipe } from "./api";
import { deleteMeal, getMealPlan, type Meal } from "./api-plan";
import { VIEWS, iso, locale, range, step, type PlanCtx, type View } from "./plan-dates";
import { shiftFlow } from "./plan-shift";
import { dayList, dayStyles } from "./plan-day";
import { NARROW, weekStyles, weekTable } from "./plan-week";
import { monthGrid, monthStyles } from "./plan-month";
import "./meal-dialog";
import "./receipt-button";
import type { PantryMealDialog } from "./meal-dialog";

/** Meal planner with day, week and month view; the view comes from the route (`plan/<view>`). */
export class PantryPlan extends LitElement {
  static properties = {
    hass: { attribute: false },
    section: { attribute: false },
    date: { state: true },
    meals: { state: true },
    household: { state: true },
    recipes: { state: true },
    error: { state: true },
  };

  declare hass?: Hass;
  declare section?: string;
  declare date: Date;
  declare meals: Meal[];
  declare household: number;
  declare recipes: Recipe[];
  declare error: string;
  private started = false;
  private narrow = window.matchMedia(NARROW);
  private onNarrow = () => this.requestUpdate();

  connectedCallback() {
    super.connectedCallback();
    this.narrow.addEventListener("change", this.onNarrow);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.narrow.removeEventListener("change", this.onNarrow);
  }

  constructor() {
    super();
    this.date = new Date();
    this.meals = [];
    this.household = 1;
    this.recipes = [];
    this.error = "";
  }

  private get view(): View {
    return VIEWS.includes(this.section as View) ? (this.section as View) : "week";
  }

  willUpdate(changed: PropertyValues) {
    if (changed.has("hass") && this.hass && !this.started) {
      this.started = true; // once: `hass` changes on every state event
      this.load();
      getRecipes(this.hass).then(
        (r) => (this.recipes = r),
        () => undefined, // only feeds the suggestions
      );
    } else if (changed.has("section") && this.started) this.load();
  }

  private async load() {
    const [from, to] = range(this.view, this.date);
    try {
      const plan = await getMealPlan(this.hass!, iso(from), iso(to));
      this.meals = plan.meals;
      this.household = plan.household_servings;
      this.error = "";
    } catch (err) {
      this.error = await errorMessage(this.hass!, err);
    }
  }

  private go(date: Date) {
    this.date = date;
    this.load();
  }

  private nav(view: View) {
    this.dispatchEvent(
      new CustomEvent("pantry-navigate", { detail: `plan/${view}`, bubbles: true, composed: true }),
    );
  }

  private dialog() {
    return this.renderRoot.querySelector<PantryMealDialog>("pantry-meal-dialog")!;
  }

  /** Run a backend action on a meal, show its error, reload. */
  private async act(fn: () => Promise<unknown>) {
    try {
      await fn();
    } catch (err) {
      this.error = await errorMessage(this.hass!, err);
      return;
    }
    await this.load();
  }

  private ctx(): PlanCtx {
    return {
      hass: this.hass,
      meals: this.meals,
      add: (day, slot) => this.dialog().open(day, slot, this.recipes, this.household),
      edit: (m) => this.dialog().open(m.day, m.slot, this.recipes, this.household, m),
      remove: async (m) => {
        if (await confirmDelete(m.name)) await this.act(() => deleteMeal(this.hass!, m.id));
      },
      open: (m) =>
        m.recipe_id == null
          ? this.dialog().open(m.day, m.slot, this.recipes, this.household, m)
          : this.dispatchEvent(
              new CustomEvent("pantry-navigate", {
                detail: `recipes/${m.recipe_id}`,
                bubbles: true,
                composed: true,
              }),
            ),
      shift: (m) => this.act(() => shiftFlow(this.hass!, m)),
      openDay: (d) => {
        this.date = d;
        this.nav("day");
      },
    };
  }

  private label() {
    const lang = locale(this.hass);
    const d = this.date;
    if (this.view === "day") return new Intl.DateTimeFormat(lang, { dateStyle: "full" }).format(d);
    if (this.view === "month")
      return new Intl.DateTimeFormat(lang, { month: "long", year: "numeric" }).format(d);
    const [from, to] = range("week", d);
    return new Intl.DateTimeFormat(lang, { dateStyle: "medium" }).formatRange(
      from,
      new Date(to.getFullYear(), to.getMonth(), to.getDate() - 1),
    );
  }

  private body() {
    const ctx = this.ctx();
    const [from, to] = range(this.view, this.date);
    if (this.view === "day") return dayList(ctx, this.date);
    if (this.view === "week") return weekTable(ctx, from, this.narrow.matches);
    const weeks = Math.round((to.getTime() - from.getTime()) / (7 * 86400000));
    return monthGrid(ctx, from, weeks, this.date.getMonth());
  }

  render() {
    const view = this.view;
    return html`${this.error ? html`<p class="error" role="alert">${this.error}</p>` : nothing}
      <nav aria-label=${t("plan.view.label")}>
        ${VIEWS.map(
          (v) =>
            html`<button
              data-testid=${`plan-view-${v}`}
              aria-current=${v === view ? "page" : "false"}
              @click=${() => (v === "day" ? this.ctx().openDay(new Date()) : this.nav(v))}
            >
              ${t(`plan.view.${v}`)}
            </button>`,
        )}
      </nav>
      <div class="bar">
        <button
          class="icon-btn"
          data-testid="plan-prev"
          aria-label=${t("plan.prev")}
          title=${t("plan.prev")}
          @click=${() => this.go(step(view, this.date, -1))}
        >
          ${icon(mdiChevronLeft)}
        </button>
        <button data-testid="plan-today" @click=${() => this.go(new Date())}>
          ${t("plan.today")}
        </button>
        <button
          class="icon-btn"
          data-testid="plan-next"
          aria-label=${t("plan.next")}
          title=${t("plan.next")}
          @click=${() => this.go(step(view, this.date, 1))}
        >
          ${icon(mdiChevronRight)}
        </button>
        <span class="range" data-testid="plan-range">${this.label()}</span>
        ${
          view !== "month" // a month does not fit a receipt
            ? html`<pantry-receipt-button
                .hass=${this.hass}
                .print=${() => printPlan(this.hass!, iso(range(view, this.date)[0]), view === "day" ? 1 : 7)}
                .done=${t("plan.printed")}
                .testid=${"plan-print"}
              ></pantry-receipt-button>`
            : nothing
        }
      </div>
      ${this.body()}
      <pantry-meal-dialog
        .hass=${this.hass}
        @pantry-saved=${() => this.load()}
      ></pantry-meal-dialog>`;
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
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 8px;
      }
      .range {
        color: var(--secondary-text-color);
      }
    `,
    dayStyles,
    weekStyles,
    monthStyles,
  ];
}

customElements.define("pantry-plan", PantryPlan);
