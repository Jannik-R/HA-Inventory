import { apiPage, openPage, remove, save, ws } from "./helpers";
import { expect, test } from "./fixtures";

const STAMP = Date.now();
const NAME = `E2E Bestand ${STAMP}`;
const MAIN = `E2E Haupt ${STAMP}`;
const SUB = `E2E Unter ${STAMP}`;
const LOCATIONS = [`E2E Lager A ${STAMP}`, `E2E Lager B ${STAMP}`];
let mainId: number | undefined;
let locationIds: number[] = [];

let productId: number | undefined;
let locations: { id: number; name: string }[] = [];

test.beforeAll(async ({ browser }) => {
  const page = await apiPage(browser);
  mainId = await save(page, "category", { name: MAIN });
  const category_id = await save(page, "category", { name: SUB, parent_id: mainId });
  locationIds = [await save(page, "location", { name: LOCATIONS[0] })];
  locationIds.push(await save(page, "location", { name: LOCATIONS[1] }));
  locations = locationIds.map((id, i) => ({ id, name: LOCATIONS[i] }));
  const res = (await ws(page, {
    type: "home_inventory/book_in",
    product: { name: NAME, category_id },
    packages: 2,
    expires_on: "2020-01-01",
    location_id: locations[0].id,
  })) as { product_id: number };
  productId = res.product_id;
  await ws(page, {
    type: "home_inventory/book_in",
    product_id: productId,
    packages: 3,
    expires_on: "2099-12-31",
    location_id: locations[1].id,
  });
  await page.close();
});

test.afterAll(async ({ browser }) => {
  const page = await apiPage(browser);
  if (productId != null) await remove(page, "product", productId);
  if (mainId != null) await remove(page, "category", mainId);
  for (const id of locationIds) await remove(page, "location", id);
  await page.close();
});

test("overview groups by category, searches and filters by location", async ({ page }) => {
  await openPage(page, "/home_inventory/stock", "Bestand");
  const filter = page.getByTestId("code-input");
  await expect(filter).toBeFocused();
  await filter.fill(NAME);
  // "Suchen" only filters: the scanner's Enter opens no booking dialog.
  await expect(page.getByTestId("mode-search")).toHaveAttribute("aria-pressed", "true");
  await filter.press("Enter");
  await expect(page.getByTestId("booking-dialog")).toBeHidden();
  const product = page.getByTestId("stock-product");
  await expect(product).toHaveCount(1);
  await expect(product).toContainText(NAME);
  await expect(product).toContainText("5 Pkg.");
  // Searching opens the whole branch: main category › category › product.
  const cats = page.getByTestId("stock-category");
  await expect(cats.filter({ hasText: MAIN })).toHaveAttribute("aria-expanded", "true");
  await expect(cats.filter({ hasText: SUB })).toHaveCount(1);
  // Searching shows the batches; earliest (expired) first, in error color.
  const batches = page.getByTestId("stock-batch");
  await expect(batches).toHaveCount(2);
  await expect(batches.first()).toContainText(locations[0].name);
  await expect(batches.first().locator(".expired, .past")).toHaveCount(1);

  await page.getByTestId("stock-location").selectOption(String(locations[1].id));
  await expect(product).toContainText("3 Pkg.");
  await expect(batches).toHaveCount(1);
  await expect(batches.first()).toContainText(locations[1].name);

  // Only batch rows take packages out; undo books it back into the same batch.
  await expect(
    page.locator("home-inventory-stock .head [data-testid=stock-batch-out]"),
  ).toHaveCount(0);
  await batches.first().getByTestId("stock-batch-out").click();
  await expect(page.getByTestId("stock-done")).toContainText(NAME);
  await expect(product).toContainText("2 Pkg.");
  await page.getByTestId("stock-undo").click();
  await expect(product).toContainText("3 Pkg.");
  await expect(batches).toHaveCount(1);
  await expect(page.getByTestId("stock-undo")).toHaveCount(0);

  // Fix a batch: other date and count.
  await batches.first().getByTestId("batch-edit").click();
  await expect(page.locator("home-inventory-batch-dialog dialog > form > h2")).toContainText(NAME);
  await page.getByTestId("batch-expires").fill("2098-01-01");
  await page.getByTestId("batch-packages").fill("4");
  await page.getByTestId("save").click();
  await expect(product).toContainText("4 Pkg.");
  await expect(batches.first()).toContainText("2098");

  // Without search, the tree starts closed and opens level by level.
  await filter.fill("");
  await page.getByTestId("stock-location").selectOption("");
  const mine = product.filter({ hasText: NAME });
  await expect(mine).toHaveCount(0);
  await cats.filter({ hasText: MAIN }).click();
  await cats.filter({ hasText: SUB }).click();
  await expect(mine).toHaveAttribute("aria-expanded", "false");
  await mine.click();
  await expect(mine).toHaveAttribute("aria-expanded", "true");

  // Without stock the product is hidden, unless the checkbox asks for it; then its row opens the edit dialog.
  await filter.fill(NAME);
  for (let n = 2; n > 0; n--) {
    await batches.first().getByTestId("batch-edit").click();
    await page.getByTestId("batch-packages").fill("0");
    await page.getByTestId("save").click();
    await expect(batches).toHaveCount(n - 1);
  }
  await expect(product).toHaveCount(0);
  await page.getByTestId("stock-with-empty").check();
  await expect(product).toContainText("0 Pkg.");
  await product.click();
  await expect(page.locator("home-inventory-product-dialog dialog > form > h2")).toContainText(
    NAME,
  );
  await page.keyboard.press("Escape");
});

test("reprint asks for the count and shows the stock", async ({ page, printCalls }) => {
  await openPage(page, "/home_inventory/stock", "Bestand");
  // The test above books everything out.
  await ws(page, {
    type: "home_inventory/book_in",
    product_id: productId,
    packages: 3,
    expires_on: "2099-12-31",
    location_id: locations[1].id,
  });
  await openPage(page, "/home_inventory/stock", "Bestand");
  await page.getByTestId("code-input").fill(NAME);
  const batches = page.getByTestId("stock-batch");
  await expect(batches).toHaveCount(1);
  await batches.first().getByTestId("stock-batch-label").click();
  const count = page.getByTestId("label-count");
  await expect(count).toBeFocused();
  await expect(count).toHaveValue("1");
  await expect(page.locator("home-inventory-label-dialog")).toContainText("3 Packungen im Lager");
  await count.fill("0");
  await expect(page.getByTestId("label-print")).toBeDisabled();
  // Up to 2 labels print without asking (the fixture blocks the request).
  await count.fill("2");
  await page.getByTestId("label-print").click();
  await expect.poll(() => printCalls.length).toBe(1);
  await expect(page.locator("home-inventory-confirm")).toHaveCount(0);
});

test("undo works once: the second try is impossible and one package comes back", async ({
  page,
}) => {
  await openPage(page, "/home_inventory/stock", "Bestand");
  await page.getByTestId("code-input").fill(NAME);
  const product = page.getByTestId("stock-product");
  const count = async () => Number(/(\d+) Pkg\./.exec((await product.textContent()) ?? "")?.[1]);
  const before = await count();
  expect(before).toBeGreaterThan(1);
  await page.getByTestId("stock-batch-out").first().click();
  await expect.poll(count).toBe(before - 1);
  // A double click must not put back two packages.
  await page.getByTestId("stock-undo").dblclick();
  await expect.poll(count).toBe(before);
  await expect(page.getByTestId("stock-undo")).toHaveCount(0);
  await page.waitForTimeout(500); // a late second put_back would show up now
  expect(await count()).toBe(before);
});
