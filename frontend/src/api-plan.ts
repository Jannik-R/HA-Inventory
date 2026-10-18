import type { Hass } from "./api";

export interface Meal {
  id: number;
  day: string;
  slot: number;
  recipe_id: number | null;
  name: string;
  servings: number;
}

export interface MealDraft {
  id?: number;
  day: string;
  slot: number;
  recipe_id: number | null;
  text: string;
  servings: number;
}

/** Meals from `start` up to (excluding) `end`, both local ISO dates. */
export const getMealPlan = (hass: Hass, start: string, end: string) =>
  hass.callWS<{ household_servings: number; meals: Meal[] }>({
    type: "pantry/meal_plan",
    start,
    end,
  });
export const saveMeal = (hass: Hass, data: MealDraft) =>
  hass.callWS<{ id: number }>({ type: "pantry/meal_save", data });
export const deleteMeal = (hass: Hass, meal_id: number) =>
  hass.callWS<void>({ type: "pantry/meal_delete", meal_id });
/** Dishes of a slot from `day` up to the first free day; `apply` moves them one day later (false = preview). */
export const shiftMeals = (hass: Hass, day: string, slot: number, apply: boolean) =>
  hass.callWS<{ meals: { id: number; day: string; slot: number; name: string }[] }>({
    type: "pantry/meal_shift",
    day,
    slot,
    apply,
  });
