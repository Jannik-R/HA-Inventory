import { apiPage, openPage, remove, save, ws } from "./helpers";
import { expect, test } from "./fixtures";

const STAMP = Date.now();
const FROM = `E2E Quelle ${STAMP}`;
const TO = `E2E Ziel ${STAMP}`;
const CAT = `E2E Umlagern ${STAMP}`;
let ids: { from?: number; to?: number; cat?: number } = {};
let productId: number | undefined;

test.beforeAll(async ({ browser }) => {
  const page = await apiPage(browser);
  ids = {
    from: await save(page, "location", { name: FROM }),
    to: await save(page, "location", { name: TO }),
    cat: await save(page, "category", { name: CAT }),
  };
  const res = (await ws(page, {
    type: "pantry/book_in",
    product: { name: `E2E Ware ${STAMP}`, category_id: ids.cat },
    packages: 3,
    location_id: ids.from,
  })) as { product_id: number };
  productId = res.product_id;
  await page.close();
});

test.afterAll(async ({ browser }) => {
  const page = await apiPage(browser);
  for (const [table, id] of [
    ["category", ids.cat],
    ["location", ids.from],
    ["location", ids.to],
  ] as const)
    if (id) await remove(page, table, id);
  await page.close();
});

test("moving a location books its stock to the target and keeps the location", async ({ page }) => {
  await openPage(page, "/pantry/settings/locations", "Einstellungen");
  const row = page.locator("pantry-settings li").filter({ hasText: FROM });
  await row.getByTestId("location-move").click();
  await expect(page.getByTestId("move-summary")).toContainText("1 Charge(n), 3 Pkg.");
  await expect(page.getByTestId("move-save")).toBeDisabled();
  await page.getByTestId("move-target").selectOption({ label: TO });
  await page.getByTestId("move-save").click();
  await expect(row).toHaveCount(1); // the location stays
  const stock = (await ws(page, { type: "pantry/stock", product_id: productId })) as {
    location: string;
    packages: number;
  }[];
  expect(stock.map((r) => [r.location, r.packages])).toEqual([[TO, 3]]);
});
