import { apiPage, openPage, ws } from "./helpers";
import { expect, test } from "@playwright/test";

const NAME = `E2E Bestand ${Date.now()}`;

let productId: number | undefined;
let locations: { id: number; name: string }[] = [];

test.beforeAll(async ({ browser }) => {
  const page = await apiPage(browser);
  const md = (await ws(page, { type: "pantry/master_data" })) as {
    categories: { id: number; name: string }[];
    locations: { id: number; name: string }[];
  };
  locations = md.locations.slice(0, 2);
  const category_id = md.categories.find((c) => c.name === "Nudeln")!.id;
  const res = (await ws(page, {
    type: "pantry/book_in",
    product: { name: NAME, category_id },
    packages: 2,
    expires_on: "2020-01-01",
    location_id: locations[0].id,
  })) as { product_id: number };
  productId = res.product_id;
  await ws(page, {
    type: "pantry/book_in",
    product_id: productId,
    packages: 3,
    expires_on: "2099-12-31",
    location_id: locations[1].id,
  });
  await page.close();
});

test.afterAll(async ({ browser }) => {
  if (productId == null) return;
  const page = await apiPage(browser);
  await ws(page, { type: "pantry/delete", table: "product", row_id: productId });
  await page.close();
});

test("overview groups by category, searches and filters by location", async ({ page }) => {
  await openPage(page, "/pantry/stock", "Bestand");
  const filter = page.getByTestId("stock-filter");
  await expect(filter).toBeFocused();
  await filter.fill(NAME);
  const product = page.getByTestId("stock-product");
  await expect(product).toHaveCount(1);
  await expect(product).toContainText(NAME);
  await expect(product).toContainText("5 Pkg.");
  // Searching opens the whole branch: main category › category › product.
  const cats = page.getByTestId("stock-category");
  await expect(cats.filter({ hasText: "Nudeln, Reis" })).toHaveAttribute("aria-expanded", "true");
  await expect(cats.filter({ hasText: /^\s*Nudeln\s+\d/ })).toHaveCount(1);
  // Searching shows the batches; earliest (expired) first, in error color.
  const batches = page.getByTestId("stock-batch");
  await expect(batches).toHaveCount(2);
  await expect(batches.first()).toContainText(locations[0].name);
  await expect(batches.first().locator(".expired")).toHaveCount(1);

  await page.getByTestId("stock-location").selectOption(String(locations[1].id));
  await expect(product).toContainText("3 Pkg.");
  await expect(batches).toHaveCount(1);
  await expect(batches.first()).toContainText(locations[1].name);

  // Only batch rows take packages out; undo books it back into the same batch.
  await expect(page.getByTestId("stock-out")).toHaveCount(0);
  await batches.first().getByTestId("stock-batch-out").click();
  await expect(page.getByTestId("stock-done")).toContainText(NAME);
  await expect(product).toContainText("2 Pkg.");
  await page.getByTestId("stock-undo").click();
  await expect(product).toContainText("3 Pkg.");
  await expect(batches).toHaveCount(1);
  await expect(page.getByTestId("stock-undo")).toHaveCount(0);

  // Without search, the tree starts closed and opens level by level.
  await filter.fill("");
  await page.getByTestId("stock-location").selectOption("");
  const mine = product.filter({ hasText: NAME });
  await expect(mine).toHaveCount(0);
  await cats.filter({ hasText: "Nudeln, Reis" }).click();
  await cats.filter({ hasText: /^\s*Nudeln\s+\d/ }).click();
  await expect(mine).toHaveAttribute("aria-expanded", "false");
  await mine.click();
  await expect(mine).toHaveAttribute("aria-expanded", "true");
});
