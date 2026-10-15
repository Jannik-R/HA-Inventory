import { apiPage, openPage, remove, save, ws } from "./helpers";
import { expect, test } from "./fixtures";

const NAME = `E2E Ablauf ${Date.now()}`;
const SCOPE = `E2E Ablauf-Ort ${Date.now()}`;

let productId: number | undefined;
let categoryId: number | undefined;
let locationId: number | undefined;

test.beforeAll(async ({ browser }) => {
  const page = await apiPage(browser);
  const category_id = (categoryId = await save(page, "category", { name: SCOPE }));
  const location_id = (locationId = await save(page, "location", { name: SCOPE }));
  const res = (await ws(page, {
    type: "pantry/book_in",
    product: { name: NAME, category_id },
    packages: 2,
    expires_on: "2020-01-01",
    location_id,
  })) as { product_id: number };
  productId = res.product_id;
  await ws(page, {
    type: "pantry/book_in",
    product_id: productId,
    packages: 1,
    expires_on: "2099-12-31",
    location_id,
  });
  await page.close();
});

test.afterAll(async ({ browser }) => {
  const page = await apiPage(browser);
  if (productId != null) await remove(page, "product", productId);
  if (categoryId != null) await remove(page, "category", categoryId);
  if (locationId != null) await remove(page, "location", locationId);
  await page.close();
});

test("expired first; a temporary threshold widens the list", async ({ page }) => {
  await openPage(page, "/pantry/expiry", "Ablauf");
  const mine = page.getByTestId("expiry-row").filter({ hasText: NAME });
  await expect(mine).toHaveCount(1);
  await expect(mine.locator(".expired")).toHaveCount(1);
  await expect(page.getByTestId("expiry-row").first().locator(".expired")).toHaveCount(1);

  const days = page.getByTestId("expiry-days");
  await days.fill("1.5");
  await expect(page.getByTestId("expiry-days-error")).toBeVisible();
  await days.fill("40000");
  await expect(mine).toHaveCount(2);
  await expect(mine.last()).toContainText("1 Pkg.");
  await days.fill("");
  await expect(mine).toHaveCount(1);

  // Take one out of the expired batch, then undo.
  await expect(mine).toContainText("2 Pkg.");
  await mine.getByTestId("expiry-out").click();
  await expect(page.getByTestId("expiry-done")).toContainText(NAME);
  await expect(mine).toContainText("1 Pkg.");
  await page.getByTestId("expiry-undo").click();
  await expect(mine).toContainText("2 Pkg.");
  await expect(page.getByTestId("expiry-undo")).toHaveCount(0);
});
