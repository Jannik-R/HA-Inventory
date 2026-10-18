import { apiPage, openPage, remove, save, ws } from "./helpers";
import { expect, test } from "./fixtures";

const CAT = `E2E Rezeptzutat ${Date.now()}`;
const TYPE = `E2E Produktart ${Date.now()}`;
const NAME = `E2E Rezept ${Date.now()}`;

const STAMP = Date.now();
const IMPORT_NAME = `E2E Import ${STAMP}`;
const CUP = `E2E Tasse ${STAMP}`;

let categoryId: number | undefined;
let unitG: number | undefined;

test.beforeAll(async ({ browser }) => {
  const page = await apiPage(browser);
  const md = (await ws(page, { type: "pantry/master_data" })) as {
    units: { id: number; symbol: string }[];
  };
  const gram = md.units.find((u) => u.symbol === "g")!;
  unitG = gram.id;
  categoryId = await save(page, "category", { name: CAT, unit_id: gram.id });
  await page.close();
});

test.afterAll(async ({ browser }) => {
  const page = await apiPage(browser);
  const list = (await ws(page, { type: "pantry/recipes" })) as { id: number; name: string }[];
  for (const r of list)
    if (r.name === NAME || r.name === IMPORT_NAME) await remove(page, "recipe", r.id);
  const units = (
    (await ws(page, { type: "pantry/master_data" })) as { units: { id: number; name: string }[] }
  ).units;
  for (const u of units) if (u.name === CUP) await remove(page, "unit", u.id);
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
  // A second row that is not checked against the stock.
  await dialog.getByTestId("ingredient-add").click();
  const skipped = dialog.getByTestId("ingredient-row").nth(1);
  await skipped.getByTestId("ingredient-search").fill(CAT);
  await skipped.getByTestId("ingredient-hit").filter({ hasText: CAT }).click();
  await skipped.getByTestId("ingredient-skip-stock").check();
  await dialog.getByTestId("recipe-save").click();

  const row = page.getByTestId("recipe-row").filter({ hasText: NAME });
  await expect(row).toContainText("0 von 1 vorhanden");
  await row.getByTestId("recipe-toggle").click();
  await expect(row.getByTestId("ingredient-row").first()).toContainText("fehlt 200 g");
  await expect(row.getByTestId("ingredient-row").nth(1)).toContainText("nicht geprüft");
  await expect(row.getByTestId("ingredient-row").first()).toContainText("fein gewürfelt");
  await row.getByTestId("recipe-servings").fill("4");
  await row.getByTestId("recipe-servings").press("Tab"); // commits the change
  await expect(row.getByTestId("ingredient-row").first()).toContainText("fehlt 400 g");

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

test("import a recipe draft, fix the unknown unit, save", async ({ page, wsStub }) => {
  wsStub("pantry/recipe_import", {
    name: IMPORT_NAME,
    servings: 2,
    steps: [{ section: null, text: "Alles mischen." }],
    source_url: "https://example.com/r",
    image_url: null,
    ingredients: [
      {
        text: CAT,
        amount: 200,
        unit_id: unitG,
        unit_hint: null,
        note: null,
        optional: false,
        line: "200 g " + CAT,
        category_id: categoryId,
      },
      {
        text: "Etwas Unbekanntes",
        amount: null,
        unit_id: null,
        unit_hint: null,
        note: null,
        optional: false,
        line: "eine Prise Magie",
        category_id: null,
      },
      {
        text: "Mehl",
        amount: 1.5,
        unit_id: null,
        unit_hint: CUP,
        note: null,
        optional: false,
        line: "1,5 " + CUP + " Mehl",
        category_id: categoryId,
      },
    ],
  });
  await openPage(page, "/pantry/recipes", "Rezepte");
  await page.getByTestId("recipe-import").click();
  const imp = page.locator("pantry-recipe-import dialog");
  await imp.getByTestId("recipe-import-url").fill("ftp://x");
  await expect(imp.getByTestId("recipe-import-submit")).toBeDisabled();
  await imp.getByTestId("recipe-import-url").fill("https://example.com/r");
  await imp.getByTestId("recipe-import-submit").click();

  const dialog = page.locator("pantry-recipe-dialog dialog");
  await expect(dialog.getByTestId("recipe-name")).toHaveValue(IMPORT_NAME);
  const rows = dialog.getByTestId("ingredient-row");
  await expect(rows.nth(1).getByTestId("ingredient-line")).toContainText(
    "Original: eine Prise Magie",
  );
  await expect(rows.nth(2).getByTestId("ingredient-unit-hint")).toContainText(CUP);
  await expect(dialog.getByTestId("recipe-save")).toBeDisabled();
  await rows.nth(2).getByTestId("ingredient-unit-create").click();
  const unit = page.locator(
    "pantry-recipes pantry-recipe-dialog pantry-recipe-ingredients pantry-unit-add-dialog dialog",
  );
  await expect(unit.getByTestId("unit-add-name")).toHaveValue(CUP);
  await unit.getByTestId("unit-add-save").click();
  await expect(rows.nth(2).getByTestId("ingredient-unit-hint")).toHaveCount(0);
  await expect(rows.nth(2).getByTestId("ingredient-unit")).toContainText(CUP);
  await expect(dialog.getByTestId("recipe-save")).toBeEnabled();
  await dialog.getByTestId("recipe-save").click();
  await expect(page.getByTestId("recipe-row").filter({ hasText: IMPORT_NAME })).toBeVisible();
});
