import { apiPage, openPage, remove, save, ws } from "./helpers";
import { expect, test } from "./fixtures";

const STAMP = Date.now();
const CATEGORY = `E2E Kat ${STAMP}`;
const PRODUCT = `E2E Import ${STAMP}`;
let categoryId: number | undefined;

test.beforeAll(async ({ browser }) => {
  const page = await apiPage(browser);
  categoryId = await save(page, "category", { name: CATEGORY });
  await page.close();
});

test.afterAll(async ({ browser }) => {
  const page = await apiPage(browser);
  if (categoryId != null) await remove(page, "category", categoryId); // takes the product along
  await page.close();
});

test("products export as CSV with BOM and the fixed header", async ({ page }) => {
  await openPage(page, "/home_inventory/settings/transfer", "Einstellungen");
  const download = page.waitForEvent("download");
  await page.getByTestId("transfer-export-products").click();
  await page.getByTestId("confirm-ok").click(); // private use + ODbL notice
  const file = await download;
  expect(file.suggestedFilename()).toMatch(/^vorrat-produkte-\d{4}-\d{2}-\d{2}\.csv$/);
  let text = "";
  for await (const c of await file.createReadStream()) text += c.toString("utf-8");
  expect(text.startsWith("﻿name;brand;category;ean;")).toBe(true);
});

test("a CSV file is previewed, applied, and a second import changes nothing", async ({ page }) => {
  const csv = `name;category;shelf_days\r\n${PRODUCT};${CATEGORY};30\r\n`;
  const file = { name: "produkte.csv", mimeType: "text/csv", buffer: Buffer.from(csv, "utf-8") };
  await openPage(page, "/home_inventory/settings/transfer", "Einstellungen");
  await page.getByTestId("transfer-file").setInputFiles(file);
  await expect(page.getByTestId("transfer-create")).toContainText(PRODUCT);
  await expect(page.getByTestId("transfer-create")).toContainText("Haltbarkeit (Tage): – → 30");
  await page.getByTestId("confirm-ok").click();
  await expect(page.getByTestId("transfer-info")).toContainText("1 neu");
  const products = (await ws(page, { type: "home_inventory/products" })) as { name: string }[];
  expect(products.some((p) => p.name === PRODUCT)).toBe(true);
  await page.getByTestId("transfer-file").setInputFiles(file);
  await expect(page.getByTestId("transfer-info")).toHaveText("Nichts zu ändern.");
});
