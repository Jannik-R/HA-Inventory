import { apiPage, openPage, remove, save, ws } from "./helpers";
import { expect, test } from "./fixtures";

const STAMP = Date.now();
const COUNTED = `E2E Inventur-A ${STAMP}`;
const FOUND = `E2E Inventur-B ${STAMP}`;
const MAIN = `E2E Inventur-Haupt ${STAMP}`;
const LOCATION = `E2E Inventur-Ort ${STAMP}`;
let mainId: number | undefined;
let locationId: number | undefined;
const products: number[] = [];

type Row = { location_id: number; packages: number; expires_on: string | null };

test.beforeAll(async ({ browser }) => {
  const page = await apiPage(browser);
  mainId = await save(page, "category", { name: MAIN });
  locationId = await save(page, "location", { name: LOCATION });
  for (const [name, date, packages] of [
    [COUNTED, "2099-01-01", 2],
    [COUNTED, "2099-06-01", 1],
    [FOUND, "2099-01-01", 1],
  ] as const) {
    const id = name === COUNTED ? products[0] : undefined; // its second batch
    const res = (await ws(page, {
      type: "home_inventory/book_in",
      ...(id ? { product_id: id } : { product: { name, category_id: mainId } }),
      packages,
      expires_on: date,
      location_id: locationId,
    })) as { product_id: number };
    if (!products.includes(res.product_id)) products.push(res.product_id);
  }
  // FOUND is not stored here: book it out again, so a scan of it is "not in stock"
  await ws(page, { type: "home_inventory/book_out", product_id: products[1], packages: 1 });
  await page.close();
});

test.afterAll(async ({ browser }) => {
  const page = await apiPage(browser);
  for (const id of products) await remove(page, "product", id);
  if (mainId != null) await remove(page, "category", mainId);
  if (locationId != null) await remove(page, "location", locationId);
  await page.close();
});

test("stocktaking books what is missing and what was found", async ({ page }) => {
  await openPage(page, "/home_inventory/stock", "Bestand");
  await page.getByTestId("stocktake-start").click();
  await expect(page).toHaveURL(/\/home_inventory\/stocktake$/);
  await page.getByTestId("stocktake-location").selectOption({ label: LOCATION });
  const rows = page.getByTestId("stocktake-row");
  await expect(rows).toHaveCount(2);
  const input = page.getByTestId("code-input");
  await expect(input).toBeFocused();
  // the name names two batches here: asked which one
  await input.fill(COUNTED);
  await input.press("Enter");
  await expect(page.getByTestId("stocktake-pick")).toHaveCount(2);
  await page.getByTestId("stocktake-pick").first().click();
  await expect(rows.first()).toContainText("1 von 2 gezählt");
  await rows.first().getByTestId("stocktake-row-plus").click();
  await expect(rows.first()).toContainText("2 von 2 gezählt");
  // a product not stored here: "not in stock"
  await input.fill(FOUND);
  await input.press("Enter");
  await expect(page.getByTestId("stocktake-extra")).toContainText(FOUND);
  await page.getByTestId("stocktake-extra-date").fill("2099-03-01");

  await page.getByTestId("stocktake-apply").click();
  await expect(page.getByTestId("confirm-ok")).toBeVisible();
  await page.getByTestId("confirm-ok").click();
  await expect(page.getByTestId("stocktake-done")).toContainText("2 Korrekturen gebucht");

  const stock = (await ws(page, { type: "home_inventory/stock" })) as (Row & {
    product_id: number;
  })[];
  const here = stock.filter((r) => r.location_id === locationId);
  // the later batch of COUNTED was not scanned: booked out; FOUND booked in with its date
  expect(here.map((r) => [r.product_id, r.packages, r.expires_on]).sort()).toEqual(
    [
      [products[0], 2, "2099-01-01"],
      [products[1], 1, "2099-03-01"],
    ].sort(),
  );
});
