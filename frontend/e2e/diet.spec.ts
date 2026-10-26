import { apiPage, openPage, openTab, panelConfig, remove, save, ws } from "./helpers";
import { expect, test } from "./fixtures";

const STAMP = Date.now();
const MILK = `E2E Milchzutat ${STAMP}`;
const PLAIN = `E2E Mehlzutat ${STAMP}`;
const R_MILK = `E2E Milchrezept ${STAMP}`;
const R_UNKNOWN = `E2E Unklar ${STAMP}`;
const MODULES = ["shopping", "recipes", "plan", "canning", "drying", "opened", "frozen", "diet"];

const ids: { cats: number[] } = { cats: [] };

test.beforeAll(async ({ browser }) => {
  const page = await apiPage(browser);
  const md = (await ws(page, { type: "home_inventory/master_data" })) as {
    units: { id: number; symbol: string }[];
  };
  const unit_id = md.units.find((u) => u.symbol === "g")!.id;
  const milk = await save(page, "category", {
    name: MILK,
    unit_id,
    diet: "vegetarian",
    allergens: "milk",
  });
  const plain = await save(page, "category", {
    name: PLAIN,
    unit_id,
    diet: "vegan",
    allergens: "",
  });
  ids.cats = [milk, plain];
  const recipe = (name: string, ingredients: object[]) =>
    ws(page, {
      type: "home_inventory/recipe_save",
      data: { name, servings: 2, ingredients },
    });
  await recipe(R_MILK, [{ category_id: milk, amount: 100, unit_id }]);
  await recipe(R_UNKNOWN, [{ category_id: plain, amount: 100, unit_id }, { text: "E2E Mystery" }]);
  await page.close();
});

test.afterAll(async ({ browser }) => {
  const page = await apiPage(browser);
  const list = (await ws(page, { type: "home_inventory/recipes" })) as {
    id: number;
    name: string;
  }[];
  for (const r of list)
    if (r.name === R_MILK || r.name === R_UNKNOWN) await remove(page, "recipe", r.id);
  for (const id of ids.cats) await remove(page, "category", id);
  await page.close();
});

test("recipe shows its diet, the strict filter hides recipes with milk or missing data", async ({
  page,
}) => {
  await openPage(page, "/home_inventory/recipes", "Rezepte");
  await panelConfig(page, { modules: MODULES });
  await openTab(page, "Bestand");
  await openTab(page, "Rezepte");
  const milk = page.getByTestId("recipe-row").filter({ hasText: R_MILK });
  const unknown = page.getByTestId("recipe-row").filter({ hasText: R_UNKNOWN });
  await expect(milk.getByTestId("recipe-diet")).toContainText("Vegetarisch");
  await expect(milk.getByTestId("recipe-diet")).toContainText("Milch");
  await expect(unknown.getByTestId("recipe-diet-unknown")).toContainText("E2E Mystery");

  await page.getByTestId("recipe-diet-filter").locator("summary").click();
  await page.getByTestId("recipe-without-milk").check();
  await expect(milk).toHaveCount(0);
  await expect(unknown).toHaveCount(0); // strict: missing information fails the filter
  await page.getByTestId("recipe-without-milk").uncheck();
  await page.getByTestId("recipe-diet-select").selectOption("vegan");
  await expect(milk).toHaveCount(0);
  await expect(unknown).toHaveCount(0);
  await page.getByTestId("recipe-diet-select").selectOption("vegetarian");
  await expect(milk).toBeVisible();
});

test("category dialog: inherited allergens, own value, reset", async ({ page }) => {
  await openPage(page, "/home_inventory/settings/categories", "Einstellungen");
  await panelConfig(page, { modules: MODULES });
  await openTab(page, "Bestand");
  await openTab(page, "Einstellungen");
  await page.getByTestId("settings-nav-categories").click();
  await page.getByTestId("settings-add").click();
  const dialog = page.locator("home-inventory-settings-dialog dialog");
  await expect(dialog.getByTestId("allergens-inherited")).toContainText("Unbekannt");
  await dialog.getByTestId("allergens-own").click();
  await dialog.getByTestId("allergen-milk").check();
  await dialog.getByTestId("allergen-gluten").check();
  await expect(dialog.getByTestId("allergen-milk")).toBeChecked();
  await dialog.getByTestId("allergens-reset").click();
  await expect(dialog.getByTestId("allergens-own")).toBeVisible();
  await dialog.getByTestId("diet").selectOption("vegan");
  await expect(dialog.getByTestId("diet-reset")).toBeVisible();
});
