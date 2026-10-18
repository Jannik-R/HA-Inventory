import { html } from "lit";
import { mdiCalendarArrowRight } from "@mdi/js";
import { t } from "./i18n";
import { confirmDialog } from "./confirm-dialog";
import { icon } from "./ui";
import type { Hass } from "./api";
import { shiftMeals, type Meal } from "./api-plan";
import { addDays, iso, locale, parse, type PlanCtx } from "./plan-dates";

/** Icon button on a dish: move it and the following days' dishes of the same slot by one day. */
export const shiftButton = (ctx: PlanCtx, m: Meal) =>
  html`<button
    class="icon-btn"
    data-testid="plan-meal-shift"
    aria-label=${t("plan.shift")}
    title=${t("plan.shift")}
    @click=${() => ctx.shift(m)}
  >
    ${icon(mdiCalendarArrowRight)}
  </button>`;

/** Preview the shift, ask, then apply it. Resolves true when meals moved; throws on backend errors. */
export async function shiftFlow(hass: Hass, m: Meal): Promise<boolean> {
  const { meals } = await shiftMeals(hass, m.day, m.slot, false);
  const fmt = new Intl.DateTimeFormat(locale(hass), {
    weekday: "short",
    day: "numeric",
    month: "numeric",
  });
  const ok = await confirmDialog({
    title: t("plan.shift_title", { slot: t(`plan.slot.${m.slot}`) }),
    body: html`<ul class="impact" data-testid="shift-list">
      ${meals.map((x) => {
        const d = parse(x.day);
        return html`<li>${fmt.format(d)} ${x.name} → ${fmt.format(parse(iso(addDays(d, 1))))}</li>`;
      })}
    </ul>`,
    action: t("plan.shift_ok"),
  });
  if (!ok) return false;
  await shiftMeals(hass, m.day, m.slot, true);
  return true;
}
