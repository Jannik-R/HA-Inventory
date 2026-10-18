import { css, html } from "lit";
import { mdiDeleteOutline, mdiPencilOutline, mdiPlus } from "@mdi/js";
import { t } from "./i18n";
import { icon } from "./ui";
import { fmtPortions } from "./format";
import { addDays, DINNER, iso, locale, SLOTS, type PlanCtx } from "./plan-dates";
import { shiftButton } from "./plan-shift";
import type { Meal } from "./api-plan";

/** Phone width: the week as day blocks instead of the table (7 day columns do not fit). */
export const NARROW = "(max-width: 600px)";

const dish = (ctx: PlanCtx, m: Meal) =>
  html`<div class="dish" data-testid="plan-meal">
    <button type="button" class="open" data-testid="plan-meal-open" @click=${() => ctx.open(m)}>
      ${m.name}
    </button>
    <span class="sec">${fmtPortions(ctx.hass, m.servings)}</span>
    ${shiftButton(ctx, m)}
    <button
      class="icon-btn"
      data-testid="plan-meal-edit"
      aria-label=${t("common.edit_name", { name: m.name })}
      title=${t("common.edit_name", { name: m.name })}
      @click=${() => ctx.edit(m)}
    >
      ${icon(mdiPencilOutline)}
    </button>
    <button
      class="icon-btn"
      data-testid="plan-meal-delete"
      aria-label=${t("common.delete_name", { name: m.name })}
      title=${t("common.delete_name", { name: m.name })}
      @click=${() => ctx.remove(m)}
    >
      ${icon(mdiDeleteOutline)}
    </button>
  </div>`;

const addBtn = (ctx: PlanCtx, day: string, slot: number, testid: string) =>
  html`<button
    class="icon-btn quiet"
    data-testid=${testid}
    aria-label=${t("plan.add")}
    title=${t("plan.add")}
    @click=${() => ctx.add(day, slot)}
  >
    ${icon(mdiPlus)}
  </button>`;

/** Day heading: opens the day view of that date. */
const dayLink = (ctx: PlanCtx, date: Date, fmt: Intl.DateTimeFormat) =>
  html`<button
    type="button"
    class="daylink"
    data-testid="plan-day-open"
    @click=${() => ctx.openDay(date)}
  >
    ${fmt.format(date)}
  </button>`;

const days = (start: Date) => [0, 1, 2, 3, 4, 5, 6].map((i) => addDays(start, i));
const of = (ctx: PlanCtx, day: string, slot: number) =>
  ctx.meals.filter((m) => m.day === day && m.slot === slot);

/** Week: a table with one row per meal slot and one fixed-width column per day (Monday first);
 * on a phone (`narrow`) one block per day with only its planned slots. */
export function weekTable(ctx: PlanCtx, start: Date, narrow: boolean) {
  const fmt = new Intl.DateTimeFormat(locale(ctx.hass), {
    weekday: "short",
    day: "numeric",
    month: "numeric",
  });
  const today = iso(new Date());
  if (narrow)
    return html`<div data-testid="plan-week">
      ${days(start).map((date) => {
        const day = iso(date);
        return html`<section class="daybox" data-testid="plan-day" data-day=${day}>
          <h3 class=${day === today ? "today" : ""}>
            ${dayLink(ctx, date, fmt)} ${addBtn(ctx, day, DINNER, "plan-add-day")}
          </h3>
          ${SLOTS.filter((s) => of(ctx, day, s).length).map(
            (s) =>
              html`<div class="slotline" data-testid="plan-cell" data-slot=${s}>
                <span class="slot">${t(`plan.slot.${s}`)}</span>
                <div>${of(ctx, day, s).map((m) => dish(ctx, m))}</div>
              </div>`,
          )}
        </section>`;
      })}
    </div>`;
  return html`<table class="week" data-testid="plan-week">
    <thead>
      <tr>
        <th class="slotcol"></th>
        ${days(start).map(
          (date) =>
            html`<th scope="col" class=${iso(date) === today ? "today" : ""}>
              ${dayLink(ctx, date, fmt)}
            </th>`,
        )}
      </tr>
    </thead>
    <tbody>
      ${SLOTS.map(
        (s) =>
          html`<tr>
            <th scope="row">${t(`plan.slot.${s}`)}</th>
            ${days(start).map((date) => {
              const day = iso(date);
              return html`<td data-testid="plan-day" data-day=${day}>
                <div data-testid="plan-cell" data-slot=${s}>
                  ${of(ctx, day, s).map((m) => dish(ctx, m))} ${addBtn(ctx, day, s, "plan-add")}
                </div>
              </td>`;
            })}
          </tr>`,
      )}
    </tbody>
  </table>`;
}

export const weekStyles = css`
  /* fixed layout: every day column gets the same width, whatever the dish names */
  table.week {
    border-collapse: collapse;
    width: 100%;
    table-layout: fixed;
  }
  table.week th,
  table.week td {
    border: 1px solid var(--divider-color);
    padding: 4px 6px;
    vertical-align: top;
    text-align: left;
    overflow-wrap: anywhere;
  }
  table.week .slotcol {
    width: 7em;
  }
  table.week th {
    font-weight: 500;
    color: var(--secondary-text-color);
  }
  table.week th.today,
  .daybox h3.today {
    font-weight: 700;
    color: var(--primary-text-color);
  }
  /* name on its own line, servings and the icons below it: the name gets the cell's width */
  .dish {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0 2px;
    padding: 2px 0;
  }
  .dish .open {
    flex: 1 0 100%;
    min-width: 0;
    text-align: left;
    border: none;
    background: none;
    padding: 4px 2px;
    color: var(--primary-text-color);
    font: inherit;
    cursor: pointer;
  }
  .sec {
    flex: 1;
    padding-left: 2px;
    font-size: 0.875em;
    color: var(--secondary-text-color);
  }
  .daylink {
    border: none;
    background: none;
    padding: 2px 0;
    font: inherit;
    color: inherit;
    cursor: pointer;
    text-align: left;
  }
  .daylink:hover {
    text-decoration: underline;
  }
  .quiet {
    color: var(--secondary-text-color);
  }
  .daybox {
    border-bottom: 1px solid var(--divider-color);
    padding: 4px 0;
  }
  .daybox h3 {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0;
    font-size: 1em;
    font-weight: 400;
  }
  .slotline {
    display: grid;
    grid-template-columns: 6.5em 1fr;
    padding-left: 6px;
  }
  .slot {
    padding-top: 6px;
    color: var(--secondary-text-color);
    font-size: 0.875em;
  }
`;
