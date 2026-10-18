import type { Hass } from "./api";
import type { Meal } from "./api-plan";

export type View = "day" | "week" | "month";
export const VIEWS: View[] = ["day", "week", "month"];
/** Meal slots as the backend numbers them: breakfast, lunch, coffee, dinner, snack. */
export const SLOTS = [0, 1, 2, 3, 4];
export const DINNER = 3;

/** Local calendar date as ISO string (toISOString would shift it by the time zone). */
export const iso = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
/** Local midnight of an ISO date. */
export const parse = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};
export const addDays = (d: Date, n: number) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
/** Monday of the week containing `d`. */
export const monday = (d: Date) => addDays(d, -((d.getDay() + 6) % 7));

/** First displayed day and the day after the last one for a view; the month shows whole weeks. */
export function range(view: View, d: Date): [Date, Date] {
  if (view === "day") return [d, addDays(d, 1)];
  if (view === "week") return [monday(d), addDays(monday(d), 7)];
  const first = monday(new Date(d.getFullYear(), d.getMonth(), 1));
  const last = new Date(d.getFullYear(), d.getMonth() + 1, 0);
  return [first, addDays(monday(last), 7)];
}

/** `d` moved by `dir` units of the view (month steps land on the 1st). */
export const step = (view: View, d: Date, dir: number) =>
  view === "month"
    ? new Date(d.getFullYear(), d.getMonth() + dir, 1)
    : addDays(d, dir * (view === "week" ? 7 : 1));

export const locale = (hass?: Hass) => hass?.locale?.language;

/** Everything a view renderer needs from the plan element. */
export interface PlanCtx {
  hass?: Hass;
  meals: Meal[];
  add: (day: string, slot: number) => void;
  edit: (m: Meal) => void;
  /** Dish clicked: its recipe when it has one, else the edit dialog. */
  open: (m: Meal) => void;
  remove: (m: Meal) => void;
  shift: (m: Meal) => void;
  openDay: (d: Date) => void;
}
