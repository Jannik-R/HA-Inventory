import { apiPage, openPage, ws } from "./helpers";
import { expect, test } from "@playwright/test";

const NAME = `E2E Einkauf ${Date.now()}`;

const NEW_PRODUCT = `E2E Produkt ${Date.now()}`;
const NEW_CATEGORY = `E2E Kategorie ${Date.now()}`;

let categoryId: number | undefined;

test.beforeAll(async ({ browser }) => {
  const page = await apiPage(browser);
  const res = (await ws(page, {
    type: "pantry/save",
    table: "category",
    data: { name: NAME },
  })) as { id: number };
  categoryId = res.id;
  await page.close();
});

test.afterAll(async ({ browser }) => {
  const page = await apiPage(browser);
  // Items by hand go with their product / category.
  const items = (await ws(page, { type: "pantry/shopping" })) as {
    name: string;
    product_id: number | null;
    category_id: number;
  }[];
  const product = items.find((i) => i.name === NEW_PRODUCT);
  if (product)
    await ws(page, { type: "pantry/delete", table: "product", row_id: product.product_id });
  const cat = items.find((i) => i.name === NEW_CATEGORY);
  if (cat) await ws(page, { type: "pantry/delete", table: "category", row_id: cat.category_id });
  if (categoryId != null)
    await ws(page, { type: "pantry/delete", table: "category", row_id: categoryId });
  await page.close();
});

test("min stock in the settings puts the category on the shopping list", async ({ page }) => {
  await openPage(page, "/pantry/settings/categories", "Einstellungen");
  await page
    .locator("pantry-settings li")
    .filter({ hasText: NAME })
    .getByTestId("category-edit")
    .click();
  const unit = page.getByTestId("min_stock_unit");
  await expect(unit).toBeDisabled(); // no amount yet
  await page.getByTestId("min_stock").fill("500");
  await unit.selectOption({ label: "g" });
  await page.getByTestId("min_packages").fill("1.5");
  await expect(page.getByTestId("min_packages-error")).toBeVisible();
  await page.getByTestId("min_packages").fill("2");
  await page.getByTestId("save").click();
  await expect(page.locator("pantry-settings li").filter({ hasText: NAME })).toContainText(
    "min. 500 g",
  );

  await openPage(page, "/pantry/shopping", "Einkauf");
  const row = page.getByTestId("shopping-row").filter({ hasText: NAME });
  await expect(row).toContainText("500 g und 2 Pkg. fehlen");
  await row.getByTestId("shopping-check").check();
  await expect(row).toHaveClass(/done/);
  await row.getByTestId("shopping-check").uncheck();
  await expect(row).not.toHaveClass(/done/);
});

test("add to the shopping list by hand: existing category, new product, new category", async ({
  page,
}) => {
  await openPage(page, "/pantry/shopping", "Einkauf");
  const dialog = page.locator("pantry-shopping-add dialog");

  // Existing category, then the same again: the packages add up.
  for (const n of ["2", "1"]) {
    await page.getByTestId("shopping-add").click();
    await dialog.getByTestId("shopping-what").fill(NAME);
    await expect(dialog.getByTestId("save")).toBeDisabled();
    await dialog.getByTestId("shopping-hit").filter({ hasText: NAME }).click();
    await expect(dialog.getByTestId("shopping-choice")).toContainText(NAME);
    await dialog.getByTestId("shopping-packages").fill(n);
    await dialog.getByTestId("save").click();
  }
  const mine = page
    .getByTestId("shopping-row")
    .filter({ hasText: "beliebig" })
    .filter({ hasText: NAME });
  await expect(mine).toContainText("3 Pkg.");
  await mine.getByTestId("shopping-edit").click();
  await dialog.getByTestId("shopping-packages").fill("4");
  await dialog.getByTestId("save").click();
  await expect(mine).toContainText("4 Pkg.");
  await mine.getByTestId("shopping-delete").click();
  await page.getByTestId("confirm-ok").click();
  await expect(mine).toHaveCount(0);

  // New product: needs a category.
  await page.getByTestId("shopping-add").click();
  await dialog.getByTestId("shopping-what").fill(NEW_PRODUCT);
  await dialog.getByTestId("shopping-new-product").click();
  await expect(dialog.getByTestId("name")).toHaveValue(NEW_PRODUCT);
  await expect(dialog.getByTestId("save")).toBeDisabled();
  await dialog.getByTestId("category").click();
  await dialog.getByTestId("category-option").filter({ hasText: NAME }).click();
  await dialog.getByTestId("category-confirm").click();
  await dialog.getByTestId("save").click();
  await expect(page.getByTestId("shopping-row").filter({ hasText: NEW_PRODUCT })).toContainText(
    "1 Pkg.",
  );

  // New category (admin), main category by default.
  await page.getByTestId("shopping-add").click();
  await dialog.getByTestId("shopping-what").fill(NEW_CATEGORY);
  await dialog.getByTestId("shopping-new-category").click();
  await dialog.getByTestId("save").click();
  await expect(page.getByTestId("shopping-row").filter({ hasText: NEW_CATEGORY })).toBeVisible();
});
