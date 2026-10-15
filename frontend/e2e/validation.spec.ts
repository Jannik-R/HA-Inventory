import { apiPage, openPage, remove, save, ws } from "./helpers";
import { expect, test } from "./fixtures";

const STAMP = Date.now();
const CATEGORY = `E2E Pruefung ${STAMP}`;
const LOCATION = `E2E Pruefort ${STAMP}`;
const PRODUCT = `E2E Pruefware ${STAMP}`;
let categoryId: number | undefined;
let locationId: number | undefined;

test.beforeAll(async ({ browser }) => {
  const page = await apiPage(browser);
  categoryId = await save(page, "category", { name: CATEGORY });
  locationId = await save(page, "location", { name: LOCATION });
  await ws(page, {
    type: "pantry/book_in",
    product: { name: PRODUCT, category_id: categoryId },
    packages: 1,
    location_id: locationId,
  });
  await page.close();
});

test.afterAll(async ({ browser }) => {
  const page = await apiPage(browser);
  if (categoryId != null) await remove(page, "category", categoryId); // takes the product along
  if (locationId != null) await remove(page, "location", locationId);
  await page.close();
});

// Live validation: errors show while typing and block saving; nothing is saved here.
test("booking form validates while typing", async ({ page }) => {
  await openPage(page, "/pantry/in", "Einbuchen");
  const code = page.getByTestId("code-input");
  await code.fill("E2E Validierung");
  await code.press("Enter");
  await page.getByTestId("new-product").click();
  const submit = page.getByTestId("submit");

  await expect(page.getByTestId("category-error")).toBeVisible();
  await expect(submit).toBeDisabled();

  await page.getByTestId("name").fill("");
  await expect(page.getByTestId("name-error")).toBeVisible();
  await page.getByTestId("name").fill("E2E Validierung");
  await expect(page.getByTestId("name-error")).toHaveCount(0);

  await page.getByTestId("content-amount").fill("500");
  await expect(page.getByTestId("content-error")).toContainText("Einheit");
  await page.getByTestId("content-unit").selectOption({ label: "g" });
  await expect(page.getByTestId("content-error")).toHaveCount(0);

  await page.getByTestId("packages").fill("0");
  await expect(page.getByTestId("packages-error")).toBeVisible();
  await page.getByTestId("packages").fill("2");

  await page.getByTestId("expires").fill("2001-01-01");
  await expect(page.getByTestId("expires-hint")).toBeVisible(); // past date: hint only

  await page.getByTestId("category").click();
  await page.getByTestId("category-filter").fill(CATEGORY);
  await page.getByTestId("category-filter").press("Enter");
  await page.getByTestId("category-confirm").click();
  await page.getByTestId("location").selectOption({ label: LOCATION });
  await expect(submit).toBeEnabled();
});

test("product dialog validates the EAN", async ({ page }) => {
  await openPage(page, "/pantry/stock", "Bestand");
  await page.getByTestId("stock-filter").fill(PRODUCT); // opens the tree down to the product
  await page.getByTestId("product-edit").click();
  await page.getByTestId("ean").fill("123");
  await expect(page.getByTestId("ean-error")).toBeVisible();
  await expect(page.getByTestId("save")).toBeDisabled();
  await page.getByTestId("ean").fill("");
  await expect(page.getByTestId("save")).toBeEnabled();
  await page.keyboard.press("Escape"); // never saved
});
