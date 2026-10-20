import { apiPage, openPage, remove, save, ws } from "./helpers";
import { expect, test } from "./fixtures";

const STAMP = Date.now();
const NAME = `E2E Ortsetikett ${STAMP}`;
const MAIN = `E2E Ortsetikett-Haupt ${STAMP}`;
const SHELF = `E2E Regal ${STAMP}`;
const HOME = `E2E Ortsetikett-Standard ${STAMP}`;
let mainId: number | undefined;
let shelfId: number | undefined;
let homeId: number | undefined;
let productId: number | undefined;

test.beforeAll(async ({ browser }) => {
  const page = await apiPage(browser);
  shelfId = await save(page, "location", { name: SHELF });
  homeId = await save(page, "location", { name: HOME });
  mainId = await save(page, "category", { name: MAIN, default_location_id: homeId });
  const res = (await ws(page, {
    type: "home_inventory/book_in",
    product: { name: NAME, category_id: mainId },
    packages: 1,
    expires_on: "2099-01-01",
  })) as { product_id: number };
  productId = res.product_id;
  await page.close();
});

test.afterAll(async ({ browser }) => {
  const page = await apiPage(browser);
  if (productId != null) await remove(page, "product", productId);
  if (mainId != null) await remove(page, "category", mainId);
  for (const id of [shelfId, homeId]) if (id != null) await remove(page, "location", id);
  await page.close();
});

test("a location row offers its label (print blocked in tests)", async ({ page }) => {
  await openPage(page, "/home_inventory/settings/locations", "Einstellungen");
  const row = page.locator("li").filter({ hasText: SHELF });
  await row.getByTestId("location-label").click();
  const dialog = page.locator("home-inventory-label-dialog dialog");
  await expect(dialog).toContainText(`„${SHELF}“`);
  await expect(dialog).toContainText("folgenden Buchungen");
  await dialog.getByRole("button", { name: "Abbrechen" }).click();
});

test("a scanned location label sets the location of the next bookings", async ({ page }) => {
  await openPage(page, "/home_inventory/in", "Bestand");
  const input = page.getByTestId("code-input");
  await input.fill(`PTRY:L${shelfId}`);
  await input.press("Enter");
  await expect(page.getByTestId("scanned-location")).toContainText(SHELF);
  await expect(input).toHaveValue("");
  // book in: the scanned location instead of the category's default
  await input.fill(NAME);
  await input.press("Enter");
  await page.getByTestId("hit").first().click();
  await expect(page.getByTestId("location")).toHaveValue(String(shelfId));
  await page.getByTestId("submit").click();
  await expect(page.getByTestId("message")).toContainText(SHELF);
  await expect(page.getByTestId("scanned-location")).toContainText(SHELF);
  const rows = (await ws(page, { type: "home_inventory/stock", product_id: productId })) as {
    location_id: number;
    packages: number;
  }[];
  expect(rows.find((r) => r.location_id === shelfId)?.packages).toBe(1);
  // cleared: the default applies again
  await page.getByTestId("scanned-location-clear").click();
  await expect(page.getByTestId("scanned-location")).toHaveCount(0);
  await input.fill("PTRY:L999999");
  await input.press("Enter");
  await expect(page.getByTestId("error")).toContainText("Unbekannter Lagerort");
});
