import { apiPage, openPage, panelConfig, remove, save, ws } from "./helpers";
import { expect, test } from "./fixtures";

const STAMP = Date.now();
const NAME = `E2E Bild ${STAMP}`;
const MAIN = `E2E Bild-Haupt ${STAMP}`;
const LOCATION = `E2E Bild-Lager ${STAMP}`;
const IMAGE = "https://images.openfoodfacts.org/e2e-test.png";
const SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"/>';
let mainId: number | undefined;
let locationId: number | undefined;
let productId: number | undefined;

test.beforeAll(async ({ browser }) => {
  const page = await apiPage(browser);
  mainId = await save(page, "category", { name: MAIN });
  locationId = await save(page, "location", { name: LOCATION });
  const res = (await ws(page, {
    type: "home_inventory/book_in",
    product: { name: NAME, category_id: mainId, image_url: IMAGE },
    packages: 1,
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

test("stock row shows the product image, and none when the service is off", async ({ page }) => {
  let requests = 0;
  await page.route("https://images.openfoodfacts.org/**", (route) => {
    requests++;
    return route.fulfill({ contentType: "image/svg+xml", body: SVG });
  });
  await openPage(page, "/home_inventory/stock", "Bestand");
  await panelConfig(page, { external: { off_images: true } });
  await page.getByTestId("code-input").fill(NAME);
  const img = page.getByTestId("stock-product").locator("xpath=..").getByTestId("product-image");
  await expect(img).toHaveAttribute("src", IMAGE);
  await expect(img).toHaveAttribute("alt", "");

  const before = requests;
  await panelConfig(page, { external: { off_images: false } });
  await page.getByTestId("code-input").fill(`${NAME} `);
  await expect(page.getByTestId("stock-product")).toHaveCount(1);
  await expect(page.getByTestId("product-image")).toHaveCount(0);
  expect(requests).toBeGreaterThan(0);
  expect(requests).toBe(before);
});

test("an image link on a foreign host renders no img", async ({ page }) => {
  await openPage(page, "/home_inventory/stock", "Bestand");
  await ws(page, {
    type: "home_inventory/product_save",
    data: { id: productId, image_url: "https://evil.example/openfoodfacts.org/x.png" },
  });
  await page.reload();
  await page.getByTestId("code-input").fill(NAME);
  await expect(page.getByTestId("stock-product")).toHaveCount(1);
  await expect(page.getByTestId("product-image")).toHaveCount(0);
});
