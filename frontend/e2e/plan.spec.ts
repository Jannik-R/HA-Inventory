import { apiPage, openPage, remove, ws } from "./helpers";
import { expect, test } from "./fixtures";

const DISH = `E2E Gericht ${Date.now()}`;

test("add, edit and delete a meal in the week plan", async ({ page }) => {
  await openPage(page, "/pantry/plan", "Speiseplan");
  // phone: the day's plus; wider screens: the plus of each cell
  await page.locator('[data-testid^="plan-add"]:visible').first().click();
  const dialog = page.locator("pantry-meal-dialog dialog");
  await expect(dialog.getByTestId("meal-save")).toBeDisabled(); // no dish
  await dialog.getByTestId("meal-text").fill(DISH);
  await dialog.getByTestId("meal-servings").fill("3");
  await dialog.getByTestId("meal-slot").selectOption("1"); // lunch
  await dialog.getByTestId("meal-save").click();
  const row = page.locator('[data-slot="1"]').getByTestId("plan-meal").filter({ hasText: DISH });
  await expect(row).toContainText("3 Portionen");

  await row.getByTestId("plan-meal-open").click();
  await dialog.getByTestId("meal-servings").fill("2");
  await dialog.getByTestId("meal-save").click();
  await expect(row).toContainText("2 Portionen");

  await row.getByTestId("plan-meal-delete").click();
  await page.locator("pantry-confirm").getByRole("button", { name: "Löschen" }).click();
  await expect(row).toHaveCount(0);
});

test("a recipe is planned from the recipe list for today", async ({ page }) => {
  const RECIPE = `E2E Planrezept ${Date.now()}`;
  const api = await apiPage(page.context().browser()!);
  const { id } = (await ws(api, {
    type: "pantry/recipe_save",
    data: { name: RECIPE, servings: 2, ingredients: [] },
  })) as { id: number };
  try {
    await openPage(page, "/pantry/recipes", "Rezepte");
    const row = page.getByTestId("recipe-row").filter({ hasText: RECIPE });
    await row.getByTestId("recipe-toggle").click();
    await row.getByTestId("recipe-to-plan").click();
    const dialog = page.locator("pantry-meal-dialog dialog");
    await expect(dialog.getByTestId("meal-text")).toHaveValue(RECIPE);
    await expect(dialog.getByTestId("meal-servings")).toHaveValue("2"); // the shown servings
    await expect(dialog.getByTestId("meal-slot")).toHaveValue("3"); // dinner by default
    await dialog.getByTestId("meal-save").click();

    await openPage(page, "/pantry/plan", "Speiseplan");
    const meal = page
      .locator('[data-slot="3"]')
      .getByTestId("plan-meal")
      .filter({ hasText: RECIPE });
    await expect(meal).toContainText("2 Portionen");
    // the dish title opens its recipe, not the edit dialog
    await meal.getByTestId("plan-meal-open").click();
    await expect(page).toHaveURL(new RegExp(`/pantry/recipes/${id}$`));
    await expect(
      page.getByTestId("recipe-row").filter({ hasText: RECIPE }).getByTestId("recipe-to-plan"),
    ).toBeVisible();
    await openPage(page, "/pantry/plan", "Speiseplan");
    await meal.getByTestId("plan-meal-delete").click();
    await page.locator("pantry-confirm").getByRole("button", { name: "Löschen" }).click();
    await expect(meal).toHaveCount(0);
  } finally {
    await remove(api, "recipe", id);
    await api.close();
  }
});

const local = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

test("shifting a slot moves the run of consecutive days one day later", async ({ page }) => {
  const A = `E2E Schicht A ${Date.now()}`;
  const B = `E2E Schicht B ${Date.now()}`;
  const api = await apiPage(page.context().browser()!);
  // Monday, Tuesday and Wednesday of this week, snack slot (4): nothing on Wednesday.
  const now = new Date();
  const mon = new Date(now.getFullYear(), now.getMonth(), now.getDate() - ((now.getDay() + 6) % 7));
  const day = (n: number) => local(new Date(mon.getFullYear(), mon.getMonth(), mon.getDate() + n));
  const ids: number[] = [];
  try {
    for (const [d, text] of [
      [day(0), A],
      [day(1), B],
    ])
      ids.push(
        (
          (await ws(api, {
            type: "pantry/meal_save",
            data: { day: d, slot: 4, recipe_id: null, text, servings: 1 },
          })) as { id: number }
        ).id,
      );
    await openPage(page, "/pantry/plan/week", "Speiseplan");
    const cell = (n: number) =>
      page.locator(`[data-day="${day(n)}"] [data-slot="4"]`).getByTestId("plan-meal");
    await cell(0).filter({ hasText: A }).getByTestId("plan-meal-shift").click();
    const confirm = page.locator("pantry-confirm");
    await expect(confirm.getByTestId("shift-list")).toContainText(A);
    await expect(confirm.getByTestId("shift-list")).toContainText(B);
    await confirm.getByTestId("confirm-ok").click();
    await expect(cell(0)).toHaveCount(0);
    await expect(cell(1).filter({ hasText: A })).toHaveCount(1);
    await expect(cell(2).filter({ hasText: B })).toHaveCount(1);
  } finally {
    const plan = (await ws(api, {
      type: "pantry/meal_plan",
      start: day(0),
      end: day(4),
    })) as { meals: { id: number; name: string }[] };
    for (const m of plan.meals)
      if (m.name === A || m.name === B)
        await ws(api, { type: "pantry/meal_delete", meal_id: m.id }).catch(() => undefined);
    await api.close();
  }
});

test("the plan switches between day, month and week view", async ({ page }) => {
  await openPage(page, "/pantry/plan", "Speiseplan");
  await expect(page.getByTestId("plan-week")).toBeVisible(); // default
  await page.getByTestId("plan-view-month").click();
  await expect(page.getByTestId("plan-month")).toBeVisible();
  await page.locator(`[data-testid="plan-month-day"][data-day$="-15"]`).first().click();
  await expect(page.getByTestId("plan-view-day")).toHaveAttribute("aria-current", "page");
  await expect(page.getByTestId("plan-cell")).toHaveCount(5);
  await page.getByTestId("plan-view-week").click();
  await expect(page.getByTestId("plan-week")).toBeVisible();
  // a day heading opens that day; the "Tag" button always shows today
  const second = page.getByTestId("plan-day").nth(1);
  const day = await second.getAttribute("data-day");
  await second.getByTestId("plan-day-open").click();
  await expect(page.locator(`[data-testid="plan-day"][data-day="${day}"]`)).toHaveCount(1);
  await page.getByTestId("plan-view-week").click();
  await page.getByTestId("plan-view-day").click();
  const now = new Date();
  await expect(page.locator(`[data-testid="plan-day"][data-day="${local(now)}"]`)).toHaveCount(1);
});

test("print the week and the day on the receipt printer", async ({ page, wsStub, printCalls }) => {
  wsStub("pantry/label_config", {
    printer: false,
    print_on_book_in: false,
    width_mm: 0,
    height_mm: 0,
    receipt: true,
  });
  await openPage(page, "/pantry/plan/week", "Speiseplan");
  await page.getByTestId("plan-print").click();
  await expect(page.getByTestId("plan-printed")).toHaveText("Speiseplan gedruckt.");
  await page.getByTestId("plan-view-day").click();
  await page.getByTestId("plan-print").click();
  await expect(page.getByTestId("plan-printed")).toBeVisible();
  const calls = printCalls as { type: string; start: string; days: number }[];
  expect(calls.map((c) => [c.type, c.days])).toEqual([
    ["pantry/print_plan", 7],
    ["pantry/print_plan", 1],
  ]);
  expect(new Date(calls[0].start).getDay()).toBe(1); // the week starts on Monday
  await page.getByTestId("plan-view-month").click();
  await expect(page.getByTestId("plan-print")).toHaveCount(0);
});

test("the planned recipes of a date range go on the shopping list", async ({ page }) => {
  const RECIPE = `E2E Planeinkauf ${Date.now()}`;
  const api = await apiPage(page.context().browser()!);
  const { id } = (await ws(api, {
    type: "pantry/recipe_save",
    data: { name: RECIPE, servings: 2, ingredients: [] },
  })) as { id: number };
  const day = local(new Date());
  const meal = (await ws(api, {
    type: "pantry/meal_save",
    data: { day, slot: 3, recipe_id: id, text: "", servings: 5 },
  })) as { id: number };
  try {
    await openPage(page, "/pantry/plan", "Speiseplan");
    await page.getByTestId("plan-shop").click();
    const dialog = page.locator("pantry-plan-shopping-dialog dialog");
    await expect(dialog.getByTestId("plan-shop-from")).toHaveValue(day);
    await dialog.getByTestId("plan-shop-to").fill("2000-01-01"); // before the start
    await expect(dialog.getByTestId("plan-shop-save")).toBeDisabled();
    await expect(dialog.getByTestId("plan-shop-to-error")).toBeVisible();
    await dialog.getByTestId("plan-shop-to").fill(day);
    await dialog.getByTestId("plan-shop-save").click();
    await expect(page.getByTestId("plan-shop-note")).toContainText(`${RECIPE} (5)`);
    const listed = (await ws(api, { type: "pantry/shopping_recipes" })) as {
      recipe_id: number;
      servings: number;
    }[];
    expect(listed.find((s) => s.recipe_id === id)?.servings).toBe(5);
  } finally {
    await ws(api, { type: "pantry/meal_delete", meal_id: meal.id }).catch(() => undefined);
    await remove(api, "recipe", id); // takes its shopping list entry along
    await api.close();
  }
});
