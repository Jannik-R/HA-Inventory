import { css, html } from "lit";
import { mdiPlus } from "@mdi/js";
import { t } from "./i18n";
import { icon, rowActions } from "./ui";
import { fmtPortions } from "./format";
import { iso, SLOTS, type PlanCtx } from "./plan-dates";
import { shiftButton } from "./plan-shift";

/** One day as a list grouped by meal slot. */
export function dayList(ctx: PlanCtx, date: Date) {
  const day = iso(date);
  return html`<div data-testid="plan-day" data-day=${day}>
    ${SLOTS.map(
      (s) =>
        html`<section data-testid="plan-cell" data-slot=${s}>
          <div class="head">
            <h3>${t(`plan.slot.${s}`)}</h3>
            <button
              class="icon-btn"
              data-testid="plan-add"
              aria-label=${t("plan.add")}
              title=${t("plan.add")}
              @click=${() => ctx.add(day, s)}
            >
              ${icon(mdiPlus)}
            </button>
          </div>
          <ul>
            ${ctx.meals
              .filter((m) => m.day === day && m.slot === s)
              .map(
                (m) =>
                  html`<li data-testid="plan-meal">
                    <button
                      type="button"
                      class="row"
                      data-testid="plan-meal-open"
                      @click=${() => ctx.open(m)}
                    >
                      ${m.name} · ${fmtPortions(ctx.hass, m.servings)}
                    </button>
                    ${shiftButton(ctx, m)}
                    ${rowActions({
                      testid: "plan-meal",
                      name: m.name,
                      onEdit: () => ctx.edit(m),
                      onDelete: () => ctx.remove(m),
                    })}
                  </li>`,
              )}
          </ul>
        </section>`,
    )}
  </div>`;
}

export const dayStyles = css`
  .head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 12px;
  }
  h3 {
    margin: 0;
    font-size: 1em;
    font-weight: 500;
  }
`;
