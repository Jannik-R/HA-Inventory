import { apiPage, openPage, remove, save, ws } from "./helpers";
import { expect, test } from "./fixtures";

const STAMP = Date.now();
const NAME = `E2E Pegel ${STAMP}`;
const MAIN = `E2E Pegel-Haupt ${STAMP}`;
const LOCATION = `E2E Pegel-Lager ${STAMP}`;
let mainId: number | undefined;
let locationId: number | undefined;
let productId: number | undefined;

test.beforeAll(async ({ browser }) => {
  const page = await apiPage(browser);
  mainId = await save(page, "category", { name: MAIN });
  locationId = await save(page, "location", { name: LOCATION });
  const res = (await ws(page, {
    type: "home_inventory/book_in",
    product: { name: NAME, category_id: mainId },
    packages: 2,
    expires_on: "2099-12-31",
    location_id: locationId,
  })) as { product_id: number; batch_id: number };
  productId = res.product_id;
  await ws(page, { type: "home_inventory/open_package", product_id: productId });
  await page.close();
});

test.afterAll(async ({ browser }) => {
  const page = await apiPage(browser);
  if (productId != null) await remove(page, "product", productId);
  if (mainId != null) await remove(page, "category", mainId);
  if (locationId != null) await remove(page, "location", locationId);
  await page.close();
});

test("level of an opened package: half shows ca. ½, empty books it out with undo", async ({
  page,
}) => {
  await openPage(page, "/home_inventory/stock", "Bestand");
  await page.getByTestId("code-input").fill(NAME);
  const opened = page.getByTestId("stock-batch").filter({ hasText: "angebrochen am" });
  await expect(opened).toHaveCount(1);
  await expect(page.getByTestId("stock-batch-level")).toHaveCount(1); // only the opened row
  await opened.getByTestId("stock-batch-level").selectOption({ label: "½" });
  await expect(opened).toContainText("ca. ½");
  await opened.getByTestId("stock-batch-level").selectOption({ label: "leer" });
  await expect(page.getByTestId("stock-done")).toContainText(NAME);
  await expect(page.getByTestId("stock-batch").filter({ hasText: "angebrochen am" })).toHaveCount(
    0,
  );
  await page.getByTestId("stock-undo").click();
  await expect(opened).toHaveCount(1);
  await expect(opened).toContainText("ca. ½"); // undo brings the level back
});
