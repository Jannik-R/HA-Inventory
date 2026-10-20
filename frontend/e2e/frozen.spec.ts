import { apiPage, openPage, panelConfig, remove, save, ws } from "./helpers";
import { expect, test } from "./fixtures";

const STAMP = Date.now();
const NAME = `E2E Frost ${STAMP}`;
const MAIN = `E2E Frost-Haupt ${STAMP}`;
const FRIDGE = `E2E Frost-Kühl ${STAMP}`;
const FREEZER = `E2E Frost-Gefrier ${STAMP}`;
let mainId: number | undefined;
let fridgeId: number | undefined;
let freezerId: number | undefined;
let productId: number | undefined;

test.beforeAll(async ({ browser }) => {
  const page = await apiPage(browser);
  mainId = await save(page, "category", { name: MAIN, frozen_days: 30, opened_days: 2 });
  fridgeId = await save(page, "location", { name: FRIDGE });
  freezerId = await save(page, "location", { name: FREEZER, freezer: 1 });
  const res = (await ws(page, {
    type: "home_inventory/book_in",
    product: { name: NAME, category_id: mainId },
    packages: 3,
    expires_on: "2099-12-31",
    location_id: fridgeId,
  })) as { product_id: number };
  productId = res.product_id;
  await page.close();
});

test.afterAll(async ({ browser }) => {
  const page = await apiPage(browser);
  if (productId != null) await remove(page, "product", productId);
  if (mainId != null) await remove(page, "category", mainId);
  for (const id of [fridgeId, freezerId]) if (id != null) await remove(page, "location", id);
  await page.close();
});

test("batch row freezes packages, thaws them and undoes", async ({ page }) => {
  await openPage(page, "/home_inventory/stock", "Bestand");
  // the dev HA may have its modules saved from before this one existed
  await panelConfig(page, {
    modules: ["shopping", "recipes", "plan", "canning", "opened", "frozen"],
  });
  await page.getByTestId("code-input").fill(NAME);
  const batches = page.getByTestId("stock-batch");
  await expect(batches).toHaveCount(1);
  await batches.first().getByTestId("stock-batch-freeze").click();
  // one package by default, to our freezer
  await expect(page.getByTestId("frozen-packages")).toHaveValue("1");
  await page.getByTestId("frozen-packages").fill("2");
  await page.getByTestId("frozen-to").selectOption({ label: FREEZER });
  await page.getByTestId("frozen-submit").click();
  await expect(page.getByTestId("frozen-done")).toContainText(`„${NAME}“ eingefroren (${FREEZER})`);
  const frozen = batches.filter({ hasText: "eingefroren am" });
  await expect(frozen).toHaveCount(1);
  await expect(frozen).toContainText("ca.");
  await expect(frozen).toContainText("2 Pkg.");
  await expect(frozen.getByTestId("stock-batch-freeze")).toHaveCount(0);
  await expect(frozen.getByTestId("stock-batch-open")).toHaveCount(0);
  // thaw one back to the fridge: opened today, keeps 2 days
  await frozen.getByTestId("stock-batch-thaw").click();
  await page.getByTestId("frozen-to").selectOption({ label: FRIDGE });
  await page.getByTestId("frozen-submit").click();
  await expect(page.getByTestId("frozen-done")).toContainText(`„${NAME}“ aufgetaut (${FRIDGE})`);
  await expect(batches.filter({ hasText: "angebrochen am" })).toHaveCount(1);
  await page.getByTestId("frozen-undo").click();
  await expect(batches.filter({ hasText: "angebrochen am" })).toHaveCount(0);
  await expect(batches.filter({ hasText: "eingefroren am" })).toContainText("2 Pkg.");
});

test("a location can be marked as freezer", async ({ page }) => {
  await openPage(page, "/home_inventory/settings", "Einstellungen");
  const rows = (await ws(page, { type: "home_inventory/master_data" })) as {
    locations: { id: number; freezer: number }[];
  };
  expect(rows.locations.find((l) => l.id === freezerId)?.freezer).toBe(1);
  expect(rows.locations.find((l) => l.id === fridgeId)?.freezer).toBe(0);
});
