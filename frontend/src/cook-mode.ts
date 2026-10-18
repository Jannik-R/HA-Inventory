import { LitElement, css, html, nothing } from "lit";
import { mdiClose, mdiTimerOutline } from "@mdi/js";
import { t } from "./i18n";
import { icon } from "./ui";
import { formStyles } from "./styles";
import { confirmDialog } from "./confirm-dialog";
import { amountText } from "./recipe-detail";
import { stepList } from "./recipe-steps";
import type { Hass, Ingredient, MasterData, Recipe, Step } from "./api";

interface Timer {
  key: string;
  label: string;
  step: number;
  end: number;
}

const clock = (ms: number) => {
  const s = Math.max(0, Math.ceil(ms / 1000));
  const h = Math.floor(s / 3600);
  const mm = String(Math.floor((s % 3600) / 60)).padStart(h ? 2 : 1, "0");
  const ss = String(s % 60).padStart(2, "0");
  return h ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
};

/** Three short beeps and a vibration when a timer runs out. */
const alarm = () => {
  navigator.vibrate?.([300, 200, 300, 200, 300]);
  try {
    const ctx = new AudioContext();
    for (let k = 0; k < 3; k++) {
      const osc = ctx.createOscillator();
      osc.frequency.value = 880;
      osc.connect(ctx.destination);
      osc.start(ctx.currentTime + k * 0.4);
      osc.stop(ctx.currentTime + k * 0.4 + 0.25);
    }
  } catch {
    // no audio (e.g. not allowed yet): the vibration and the red timer remain
  }
};

/** Full-screen cooking view: ingredients, steps to tick off (not saved), timers from the steps.
 * Keeps the screen on while open. Call `open(...)`. */
export class PantryCookMode extends LitElement {
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
                  <strong>${left > 0 ? clock(left) : t("cook.timer_done")}</strong>
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
    </dialog>`;
  }

  static styles = [
    formStyles,
    css`
      dialog {
        width: 100vw;
        max-width: 100vw;
        height: 100dvh;
        max-height: 100dvh;
        margin: 0;
        box-sizing: border-box;
        padding: 16px 16px 96px;
        border: none;
        overflow-y: auto;
      }
      header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
      }
      h2 {
        margin: 0;
      }
      h3,
      h4 {
        margin: 16px 0 4px;
        font-size: 1em;
        font-weight: 500;
      }
      .ings,
      ol {
        max-width: 720px;
      }
      ol {
        list-style: none;
        margin: 0;
        padding: 0;
      }
      .no {
        display: inline-block;
        min-width: 1.6em;
        font-weight: 500;
      }
      .ings li {
        padding: 2px 0;
      }
      ol li {
        margin: 8px 0;
      }
      .step {
        display: block;
        width: 100%;
        text-align: left;
        font: inherit;
        font-size: 1.1em;
        line-height: 1.5;
        padding: 6px 8px;
        color: var(--primary-text-color);
        background: none;
        border: 1px solid transparent;
        border-radius: 4px;
        cursor: pointer;
      }
      .step.done {
        color: var(--secondary-text-color);
        text-decoration: line-through;
      }
      .timer-btn {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        margin: 2px 8px 0 8px;
      }
      .timers {
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        flex-wrap: wrap;
        gap: 8px 16px;
        padding: 8px 16px;
        background: var(--card-background-color, var(--primary-background-color));
        border-top: 1px solid var(--divider-color);
      }
      .timer {
        display: inline-flex;
        align-items: center;
        gap: 4px;
      }
      .timer.over strong {
        color: var(--error-color);
      }
      .detail {
        color: var(--secondary-text-color);
      }
    `,
  ];
}

customElements.define("pantry-cook-mode", PantryCookMode);
