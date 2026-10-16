import { apiPage, openPage, remove, save, ws } from "./helpers";
import { expect, test } from "./fixtures";

const CAT = `E2E Rezeptzutat ${Date.now()}`;
const TYPE = `E2E Produktart ${Date.now()}`;
const NAME = `E2E Rezept ${Date.now()}`;

let categoryId: number | undefined;

test.beforeAll(async ({ browser }) => {
  const page = await apiPage(browser);
  const md = (await ws(page, { type: "pantry/master_data" })) as {
    units: { id: number; symbol: string }[];
  };
  const gram = md.units.find((u) => u.symbol === "g")!;
  categoryId = await save(page, "category", { name: CAT, unit_id: gram.id });
  await page.close();
});

test.afterAll(async ({ browser }) => {
  const page = await apiPage(browser);
  const list = (await ws(page, { type: "pantry/recipes" })) as { id: number; name: string }[];
  for (const r of list) if (r.name === NAME) await remove(page, "recipe", r.id);
  // The new Produktart is a child of CAT: delete it first.
  const md = (await ws(page, { type: "pantry/master_data" })) as {
    categories: { id: number; name: string }[];
  };
  for (const c of md.categories) if (c.name === TYPE) await remove(page, "category", c.id);
  if (categoryId != null) await remove(page, "category", categoryId);
  await page.close();
});

test("create a recipe with a category ingredient, scale servings, delete it", async ({ page }) => {
  await openPage(page, "/pantry/recipes", "Rezepte");
  await page.getByTestId("recipe-add").click();
  const dialog = page.locator("pantry-recipe-dialog dialog");
  await expect(dialog.getByTestId("recipe-save")).toBeDisabled(); // no name
  await dialog.getByTestId("recipe-name").fill(NAME);
  await dialog.getByTestId("recipe-servings-input").fill("2");
  await dialog.getByTestId("ingredient-add").click();
  const ing = dialog.getByTestId("ingredient-row");
  // An untouched row shows no error and does not block saving (it is left out).
  await expect(ing.locator("[aria-invalid=true]")).toHaveCount(0);
  await expect(dialog.getByTestId("recipe-save")).toBeEnabled();
  await ing.getByTestId("ingredient-amount").fill("1");
  await expect(dialog.getByTestId("recipe-save")).toBeDisabled(); // an amount needs an ingredient
  await ing.getByTestId("ingredient-amount").fill("");
  await ing.getByTestId("ingredient-search").fill(CAT);
  await ing.getByTestId("ingredient-hit").filter({ hasText: CAT }).click();
  // The category fills the unit.
  await expect(ing.getByTestId("ingredient-choice")).toContainText(CAT);
  await expect(ing.getByTestId("ingredient-unit")).toContainText("g");
  await ing.getByTestId("ingredient-note").fill("fein gewürfelt");
  await expect(dialog.getByTestId("recipe-save")).toBeEnabled(); // unit alone is only a suggestion
  await ing.getByTestId("ingredient-amount").fill("200");
  await dialog.getByTestId("recipe-save").click();

  const row = page.getByTestId("recipe-row").filter({ hasText: NAME });
  await expect(row).toContainText("0 von 1 vorhanden");
  await row.locator("button.row").click();
  await expect(row.getByTestId("ingredient-row")).toContainText("fehlt 200 g");
  await expect(row.getByTestId("ingredient-row")).toContainText("fein gewürfelt");
  await row.getByTestId("recipe-servings").fill("4");
  await row.getByTestId("recipe-servings").press("Tab"); // commits the change
  await expect(row.getByTestId("ingredient-row")).toContainText("fehlt 400 g");

  await page.getByTestId("recipe-search").fill("zzz-nothing");
  await expect(row).toHaveCount(0);
  await page.getByTestId("recipe-search").fill(CAT);
  await expect(row).toBeVisible();

  await row.getByTestId("recipe-delete").click();
  await page.getByTestId("confirm-ok").click();
  await expect(row).toHaveCount(0);
});

test("find a seeded Produktart and create a new one", async ({ page }) => {
  await openPage(page, "/pantry/recipes", "Rezepte");
  await page.getByTestId("recipe-add").click();
  const dialog = page.locator("pantry-recipe-dialog dialog");
  await dialog.getByTestId("ingredient-add").click();
  const ing = dialog.getByTestId("ingredient-row");
  await ing.getByTestId("ingredient-search").fill("Tomatenmark");
  await ing.getByTestId("ingredient-hit").filter({ hasText: "Tomatenmark" }).first().click();
  await expect(ing.getByTestId("ingredient-choice")).toContainText("Tomatenmark");
  await ing.getByTestId("ingredient-change").click();

  await ing.getByTestId("ingredient-search").fill(TYPE);
  await ing.getByTestId("ingredient-create").click();
  await ing.getByTestId("category").click();
  await ing.getByTestId("category-option").filter({ hasText: CAT }).click();
  await ing.getByTestId("category-confirm").click();
  await expect(ing.getByTestId("ingredient-choice")).toContainText(TYPE);
  await expect(dialog.getByTestId("recipe-save")).toBeDisabled(); // no name yet
  await dialog.getByTestId("recipe-name").fill(NAME + " 2");
  await expect(dialog.getByTestId("recipe-save")).toBeEnabled();
});
