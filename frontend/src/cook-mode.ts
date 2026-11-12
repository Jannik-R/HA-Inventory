import { LitElement, html, nothing } from "lit";
import { mdiClose, mdiTimerOutline } from "@mdi/js";
import { t } from "./i18n";
import { icon } from "./ui";
import { formStyles } from "./styles";
import { confirmDialog } from "./confirm-dialog";
import { amountText } from "./recipe-detail";
import "./cooked-dialog";
import type { HomeInventoryCookedDialog } from "./cooked-dialog";
import { stepList } from "./recipe-steps";
import { cookStyles } from "./cook-mode-styles";
import { alarm, clock, type Timer } from "./cook-timer";
import type { Hass, Ingredient, MasterData, Recipe, Step } from "./api";

/** Full-screen cooking view: ingredients, steps to tick off (not saved), timers from the steps.
 * Keeps the screen on while open. Call `open(...)`. */
export class HomeInventoryCookMode extends LitElement {
  static properties = {
    active: { state: true },
    done: { state: true },
    timers: { state: true },
    now: { state: true },
  };
  declare active: boolean;
  declare done: Set<number>;
  declare timers: Timer[];
  declare now: number;
  private hass?: Hass;
  private md?: MasterData;
  private recipe?: Recipe;
  private ingredients: Ingredient[] = [];
  private servings = 1;
  private tick?: number;
  private lock?: WakeLockSentinel;
  private relock = () => {
    if (document.visibilityState === "visible" && this.active) void this.keepOn();
  };

  constructor() {
    super();
    this.active = false;
    this.done = new Set();
    this.timers = [];
    this.now = Date.now();
  }

  async open(
    hass: Hass,
    md: MasterData,
    recipe: Recipe,
    ingredients: Ingredient[],
    servings: number,
  ) {
    Object.assign(this, { hass, md, recipe, ingredients, servings });
    this.done = new Set();
    this.timers = [];
    this.active = true;
    await this.updateComplete;
    this.renderRoot.querySelector("dialog")!.showModal();
    void this.keepOn();
    document.addEventListener("visibilitychange", this.relock);
  }

  private async keepOn() {
    try {
      this.lock = await navigator.wakeLock?.request("screen");
    } catch {
      // not allowed (battery saver, insecure context): the view works without it
    }
  }

  private closed() {
    this.active = false;
    window.clearInterval(this.tick);
    this.tick = undefined;
    void this.lock?.release();
    this.lock = undefined;
    document.removeEventListener("visibilitychange", this.relock);
  }

  /** Close; running timers would be lost, so ask first. */
  private async close() {
    const running = this.timers.some((x) => x.end > Date.now());
    if (running && !(await confirmDialog({ title: t("cook.stop"), action: t("cook.stop_ok") })))
      return;
    this.renderRoot.querySelector("dialog")?.close();
  }

  private start(step: number, label: string, seconds: number) {
    const key = `${step}:${label}`;
    this.timers = [
      ...this.timers.filter((x) => x.key !== key),
      { key, label, step, end: Date.now() + seconds * 1000 },
    ];
    this.tick ??= window.setInterval(() => this.onTick(), 500);
    this.now = Date.now();
  }

  private onTick() {
    const before = this.now;
    this.now = Date.now();
    if (this.timers.some((x) => x.end <= this.now && x.end > before)) alarm();
  }

  private toggle(n: number) {
    const done = new Set(this.done);
    if (!done.delete(n)) done.add(n);
    this.done = done;
  }

  private step(s: Step, n: number) {
    return html`<button
        type="button"
        class="step ${this.done.has(n) ? "done" : ""}"
        data-testid="cook-step"
        aria-pressed=${this.done.has(n)}
        @click=${() => this.toggle(n)}
      >
        <span class="no">${n + 1}.</span>${s.text}
      </button>
      ${(s.timers ?? []).map(
        (x) =>
          html`<button
            type="button"
            class="timer-btn"
            data-testid="cook-timer-start"
            aria-label=${t("cook.timer_start", { what: x.label })}
            @click=${() => this.start(n, x.label, x.seconds)}
          >
            ${icon(mdiTimerOutline)} ${x.label}
          </button>`,
      )}`;
  }

  render() {
    if (!this.active || !this.recipe) return html`<dialog></dialog>`;
    const r = this.recipe;
    const factor = this.servings / r.servings;
    return html`<dialog
      @close=${() => this.closed()}
      @cancel=${(e: Event) => {
        e.preventDefault();
        void this.close();
      }}
    >
      <header>
        <h2>${t("cook.title", { name: r.name })}</h2>
        <button
          type="button"
          class="icon-btn"
          data-testid="cook-close"
          aria-label=${t("cook.close")}
          title=${t("cook.close")}
          @click=${() => this.close()}
        >
          ${icon(mdiClose)}
        </button>
      </header>
      <h3>${t("recipes.ingredients")}</h3>
      <ul class="ings">
        ${this.ingredients.map(
          (i) =>
            html`<li>
              ${[
                amountText(this.hass!, this.md!, i, factor),
                this.md!.categories.find((c) => c.id === i.category_id)?.name ?? i.text,
              ]
                .filter(Boolean)
                .join(" ")}
              ${i.note ? html`<span class="detail">${i.note}</span>` : nothing}
            </li>`,
        )}
      </ul>
      <h3>${t("recipes.instructions")}</h3>
      <p class="detail">${t("cook.hint")}</p>
      ${stepList(r.steps, (s, n) => this.step(s, n))}
      ${
        this.timers.length
          ? html`<div class="timers" role="status">
              ${this.timers.map((x) => {
                const left = x.end - this.now;
                return html`<span class="timer ${left <= 0 ? "over" : ""}" data-testid="cook-timer">
                  ${t("cook.timer", { n: x.step + 1, what: x.label })}:
                  <strong>${left > 0 ? clock(this.hass, left) : t("cook.timer_done")}</strong>
                  <button
                    type="button"
                    class="icon-btn"
                    aria-label=${t("cook.timer_cancel")}
                    title=${t("cook.timer_cancel")}
                    @click=${() => (this.timers = this.timers.filter((y) => y !== x))}
                  >
                    ${icon(mdiClose)}
                  </button>
                </span>`;
              })}
            </div>`
          : nothing
      }
      <p>
        <button type="button" data-testid="cook-cooked" @click=${() => this.cooked()}>
          ${t("cooked.open")}
        </button>
      </p>
      <home-inventory-cooked-dialog></home-inventory-cooked-dialog>
    </dialog>`;
  }

  /** The cooking is done: book out the ingredients (for the servings set when this opened). */
  private cooked() {
    const d = this.renderRoot.querySelector<HomeInventoryCookedDialog>(
      "home-inventory-cooked-dialog",
    )!;
    d.hass = this.hass;
    void d.open(this.recipe!, this.servings);
  }

  static styles = [formStyles, cookStyles];
}

customElements.define("home-inventory-cook-mode", HomeInventoryCookMode);
