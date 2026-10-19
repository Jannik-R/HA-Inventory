import { apiPage, openPage, panelConfig, remove, save, ws } from "./helpers";
import { expect, test } from "./fixtures";

const STAMP = Date.now();
const NAME = `E2E Offen ${STAMP}`;
const MAIN = `E2E Offen-Haupt ${STAMP}`;
const LOCATION = `E2E Offen-Lager ${STAMP}`;
let mainId: number | undefined;
let locationId: number | undefined;
let productId: number | undefined;

test.beforeAll(async ({ browser }) => {
  const page = await apiPage(browser);
  mainId = await save(page, "category", { name: MAIN, opened_days: 3 });
  locationId = await save(page, "location", { name: LOCATION });
  const res = (await ws(page, {
    type: "home_inventory/book_in",
    product: { name: NAME, category_id: mainId },
    packages: 2,
    expires_on: "2099-12-31",
    location_id: locationId,
  })) as { product_id: number };
  productId = res.product_id;
  await page.close();
});

test.afterAll(async ({ browser }) => {
  const page = await apiPage(browser);
  if (productId != null) await remove(page, "product", productId);
  if (mainId != null) await remove(page, "category", mainId);
  if (locationId != null) await remove(page, "location", locationId);
  await page.close();
});

test("batch row opens a package, offers a label and undoes it", async ({ page }) => {
  await openPage(page, "/home_inventory/stock", "Bestand");
  await page.getByTestId("code-input").fill(NAME);
  const batches = page.getByTestId("stock-batch");
  await expect(batches).toHaveCount(1);
  await batches.first().getByTestId("stock-batch-open").click();
  // own row with the shorter date (opened today + 3 days), still counted in the stock
  await expect(page.getByTestId("opened-done")).toContainText(`„${NAME}“ angebrochen, haltbar bis`);
  await expect(batches).toHaveCount(2);
  const opened = batches.filter({ hasText: "angebrochen am" });
  await expect(opened).toHaveCount(1);
  await expect(opened.getByTestId("stock-batch-open")).toHaveCount(0);
  await expect(page.getByTestId("stock-product")).toContainText("2 Pkg.");
  // the label is only offered: the dialog asks first (printing is blocked in tests anyway)
  await page.getByTestId("opened-label").click();
  await expect(page.getByTestId("label-print")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByTestId("label-print")).toBeHidden();
  await page.getByTestId("opened-undo").click();
  await expect(batches).toHaveCount(1);
  await expect(page.getByTestId("opened-done")).toHaveCount(0);
});

test("mode Anbrechen opens by label scan and by name", async ({ page }) => {
  await openPage(page, "/home_inventory/open", "Bestand");
  await expect(page.getByTestId("mode-open")).toHaveAttribute("aria-pressed", "true");
  const input = page.getByTestId("code-input");
  await expect(input).toBeFocused();
  await input.fill(`PTRY:P${productId}:2099-12-31`);
  await input.press("Enter");
  await expect(page.getByTestId("open-done")).toContainText(`„${NAME}“ angebrochen`);
  await expect(input).toHaveValue("");
  await page.getByTestId("open-undo").click();
  await expect(page.getByTestId("message")).toContainText("wieder ungeöffnet");
  // a name with one hit opens its earliest unopened package directly
  await input.fill(NAME);
  await input.press("Enter");
  await expect(page.getByTestId("open-done")).toContainText(`„${NAME}“ angebrochen`);
  const rows = (await ws(page, { type: "home_inventory/stock", product_id: productId })) as {
    opened_on: string | null;
  }[];
  expect(rows.filter((r) => r.opened_on).length).toBe(1);
});

test("module Anbrechen and the Open Food Facts lookup can be turned off", async ({ page }) => {
  await openPage(page, "/home_inventory/in", "Bestand");
  await page.getByTestId("code-input").fill(NAME);
  await page.keyboard.press("Enter");
  await expect(page.getByTestId("search-online")).toBeVisible();
  await expect(page.getByTestId("mode-open")).toBeVisible();

  await openPage(page, "/home_inventory/in", "Bestand");
  await panelConfig(page, {
    modules: ["shopping", "recipes", "plan", "canning"],
    external: { off_lookup: false },
  });
  await page.getByTestId("code-input").fill(NAME);
  await page.keyboard.press("Enter");
  await expect(page.getByTestId("new-product")).toBeVisible();
  await expect(page.getByTestId("search-online")).toHaveCount(0);
  await expect(page.getByTestId("mode-open")).toHaveCount(0);
  await page.getByTestId("cancel").click();
  await page.getByTestId("mode-search").click();
  await page.getByTestId("code-input").fill(NAME);
  await expect(page.getByTestId("stock-batch").first()).toBeVisible(); // earlier tests may leave an opened one
  await expect(page.getByTestId("stock-batch-open")).toHaveCount(0);
});
