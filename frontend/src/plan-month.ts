import { css, html } from "lit";
import {
  mdiCoffee,
  mdiFoodApple,
  mdiWeatherNight,
  mdiWeatherSunsetUp,
  mdiWhiteBalanceSunny,
} from "@mdi/js";
import { t } from "./i18n";
import { icon } from "./ui";
import { addDays, iso, locale, SLOTS, type PlanCtx } from "./plan-dates";

const SLOT_ICONS = [
  mdiWeatherSunsetUp,
  mdiWhiteBalanceSunny,
  mdiCoffee,
  mdiWeatherNight,
  mdiFoodApple,
];

/** Month grid (Monday first, `weeks` rows from `first`): one small icon per slot with a dish; a tap opens the day. */
export function monthGrid(ctx: PlanCtx, first: Date, weeks: number, month: number) {
  const lang = locale(ctx.hass);
  const head = new Intl.DateTimeFormat(lang, { weekday: "short" });
  const full = new Intl.DateTimeFormat(lang, { dateStyle: "full" });
  const today = iso(new Date());
  return html`<div class="month" data-testid="plan-month">
    ${[0, 1, 2, 3, 4, 5, 6].map((i) => html`<div class="wd">${head.format(addDays(first, i))}</div>`)}
    ${Array.from({ length: weeks * 7 }, (_, i) => addDays(first, i)).map((d) => {
      const key = iso(d);
      const meals = ctx.meals.filter((m) => m.day === key);
      return html`<button
        type="button"
        class="cell ${d.getMonth() === month ? "" : "dim"} ${key === today ? "today" : ""}"
        data-testid="plan-month-day"
        data-day=${key}
        aria-label=${full.format(d)}
        @click=${() => ctx.openDay(d)}
      >
        <span class="num">${d.getDate()}</span>
        <span class="icons">
          ${SLOTS.filter((s) => meals.some((m) => m.slot === s)).map((s) => {
            const slot = t(`plan.slot.${s}`);
            const names = meals.filter((m) => m.slot === s).map((m) => m.name);
            return html`<span
              role="img"
              data-testid="plan-month-slot"
              data-slot=${s}
              aria-label=${slot}
              title=${[slot, ...names].join("\n")}
              >${icon(SLOT_ICONS[s])}</span
            >`;
          })}
        </span>
      </button>`;
    })}
  </div>`;
}

export const monthStyles = css`
  .month {
    display: grid;
    grid-template-columns: repeat(7, minmax(0, 1fr));
    border-top: 1px solid var(--divider-color);
    border-left: 1px solid var(--divider-color);
  }
  .wd {
    padding: 4px;
    text-align: center;
    font-size: 0.875em;
    color: var(--secondary-text-color);
    border-right: 1px solid var(--divider-color);
    border-bottom: 1px solid var(--divider-color);
  }
  .cell {
    min-height: 56px;
    padding: 4px;
    border: none;
    border-right: 1px solid var(--divider-color);
    border-bottom: 1px solid var(--divider-color);
    border-radius: 0;
    background: none;
    color: var(--primary-text-color);
    font: inherit;
    text-align: left;
    cursor: pointer;
  }
  .cell.dim {
    color: var(--secondary-text-color);
    opacity: 0.55;
  }
  .cell.today .num {
    font-weight: 700;
  }
  .num {
    display: block;
  }
  .icons {
    display: flex;
    flex-wrap: wrap;
  }
  .icons svg {
    width: 14px;
    height: 14px;
    fill: var(--secondary-text-color);
  }
`;
