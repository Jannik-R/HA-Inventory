import { apiPage, openPage, remove, save, ws } from "./helpers";
import { expect, test } from "./fixtures";

const NAME = `E2E Verlauf ${Date.now()}`;
let categoryId: number | undefined;
let productId: number | undefined;

test.beforeAll(async ({ browser }) => {
  const page = await apiPage(browser);
  categoryId = await save(page, "category", { name: `${NAME} Kat` });
  const res = (await ws(page, {
    type: "home_inventory/book_in",
    product: { name: NAME, category_id: categoryId },
    packages: 1,
    expires_on: "2099-01-01",
    location_id: 1,
  })) as { product_id: number };
  productId = res.product_id;
  await page.close();
});

test.afterAll(async ({ browser }) => {
  const page = await apiPage(browser);
  if (productId != null) await remove(page, "product", productId);
  if (categoryId != null) await remove(page, "category", categoryId);
  await page.close();
});

test("history shows an action and undoes it as a whole", async ({ page }) => {
  await openPage(page, "/home_inventory/stock", "Bestand");
  await page.getByTestId("history-start").click();
  await expect(page).toHaveURL(/\/home_inventory\/history$/);
  const name = page.getByTestId("history-name");
  await expect(name).toBeFocused();
  await name.fill(NAME);
  await name.press("Enter");
  const action = page.getByTestId("history-action");
  await expect(action).toHaveCount(1);
  await expect(action.getByTestId("history-row")).toContainText("Eingelagert");

  await action.getByTestId("history-undo").click();
  await page.getByTestId("confirm-ok").click();
  await expect(action.getByTestId("history-undone")).toContainText("Rückgängig gemacht am");
  await expect(action.getByTestId("history-row")).toHaveCSS("text-decoration-line", "line-through");
  await expect(action.getByTestId("history-undo")).toHaveCount(0);

  const stock = (await ws(page, { type: "home_inventory/stock", product_id: productId })) as [];
  expect(stock).toEqual([]);
});
