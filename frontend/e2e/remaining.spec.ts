import { apiPage, openPage, panelConfig, remove, save, ws } from "./helpers";
import { expect, test } from "./fixtures";

const STAMP = Date.now();
const NAME = `E2E Pegel ${STAMP}`;
const MAIN = `E2E Pegel-Haupt ${STAMP}`;
const LOCATION = `E2E Pegel-Lager ${STAMP}`;
const FREEZER = `E2E Pegel-Frost ${STAMP}`;
const COLD = `E2E Pegel-Kalt ${STAMP}`;
let mainId: number | undefined;
let locationId: number | undefined;
let freezerId: number | undefined;
let productId: number | undefined;
let coldId: number | undefined;

test.beforeAll(async ({ browser }) => {
  const page = await apiPage(browser);
  mainId = await save(page, "category", { name: MAIN, frozen_days: 30 });
  locationId = await save(page, "location", { name: LOCATION });
  freezerId = await save(page, "location", { name: FREEZER, freezer: 1 });
  const res = (await ws(page, {
    type: "home_inventory/book_in",
    product: { name: NAME, category_id: mainId },
    packages: 2,
    expires_on: "2099-12-31",
    location_id: locationId,
  })) as { product_id: number; batch_id: number };
  productId = res.product_id;
  for (let i = 0; i < 2; i++)
    await ws(page, { type: "home_inventory/open_package", product_id: productId });
  const cold = (await ws(page, {
    type: "home_inventory/book_in",
    product: { name: `${NAME} kalt`, category_id: mainId },
    packages: 1,
    location_id: freezerId,
  })) as { product_id: number };
  coldId = cold.product_id;
  await page.close();
});

test.afterAll(async ({ browser }) => {
  const page = await apiPage(browser);
  if (productId != null) await remove(page, "product", productId);
  if (coldId != null) await remove(page, "product", coldId);
  if (mainId != null) await remove(page, "category", mainId);
  for (const id of [locationId, freezerId]) if (id != null) await remove(page, "location", id);
  await page.close();
});

test("level of an opened package: half splits one package off, empty books it out with undo", async ({
  page,
}) => {
  await openPage(page, "/home_inventory/stock", "Bestand");
  await page.getByTestId("code-input").fill(NAME);
  const opened = page.getByTestId("stock-batch").filter({ hasText: "angebrochen am" });
  await expect(opened).toHaveCount(1);
  await opened.getByTestId("stock-batch-level").selectOption({ label: "½" });
  await expect(opened).toHaveCount(2); // the partly used package is its own row
  const half = opened.filter({ hasText: "ca. ½" });
  await expect(half).toHaveCount(1);
  await expect(opened.filter({ hasText: "2 Pkg." })).toHaveCount(0);
  await half.getByTestId("stock-batch-level").selectOption({ label: "leer" });
  await expect(page.getByTestId("stock-done")).toContainText(NAME);
  await expect(opened).toHaveCount(1);
  await page.getByTestId("stock-undo").click();
  await expect(opened).toHaveCount(2);
  await expect(opened.filter({ hasText: "ca. ½" })).toHaveCount(1); // undo brings the level back
});

test("a frozen row has a level select", async ({ page }) => {
  await openPage(page, "/home_inventory/stock", "Bestand");
  await panelConfig(page, {
    modules: ["shopping", "recipes", "plan", "canning", "opened", "frozen"],
  });
  await page.getByTestId("code-input").fill(`${NAME} kalt`);
  const frozen = page.getByTestId("stock-batch").filter({ hasText: "eingefroren am" });
  await expect(frozen).toHaveCount(1);
  await expect(frozen.getByTestId("stock-batch-level")).toHaveCount(1);
});
