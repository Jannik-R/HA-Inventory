import { apiPage, openPage, ws } from "./helpers";
import { expect, test } from "./fixtures";

const STAMP = Date.now();
const PARENT = `E2E Weg ${STAMP}`;
const CHILD = `E2E Kind ${STAMP}`;
const PRODUCT = `E2E Ware ${STAMP}`;
const LOCATION = `E2E Regal ${STAMP}`;

let productId: number | undefined;

test.beforeAll(async ({ browser }) => {
  const page = await apiPage(browser);
  const save = (table: string, data: object) =>
    ws(page, { type: "pantry/save", table, data }) as Promise<{ id: number }>;
  const parent = await save("category", { name: PARENT });
  const child = await save("category", { name: CHILD, parent_id: parent.id });
  const location = await save("location", { name: LOCATION });
  const res = (await ws(page, {
    type: "pantry/book_in",
    product: { name: PRODUCT, category_id: child.id },
    packages: 2,
    location_id: location.id,
  })) as { product_id: number };
  productId = res.product_id;
  await ws(page, { type: "pantry/shopping_add", product_id: productId });
  await page.close();
});

test.afterAll(async ({ browser }) => {
  // Only left over when the test failed before deleting.
  const page = await apiPage(browser);
  const md = (await ws(page, { type: "pantry/master_data" })) as {
    categories: { id: number; name: string }[];
  };
  const parent = md.categories.find((c) => c.name === PARENT);
  if (parent)
    await ws(page, { type: "pantry/delete", table: "category", row_id: parent.id, force: true });
  await page.close();
});

test("deleting things in use lists what goes with it; a location's stock moves", async ({
  page,
}) => {
  await openPage(page, "/pantry/settings/locations", "Einstellungen");
  const shelf = page.locator("pantry-settings li").filter({ hasText: LOCATION });
  await shelf.getByTestId("location-delete").click();
  await expect(page.getByTestId("delete-impact")).toContainText(PRODUCT);
  await expect(page.getByTestId("delete-impact")).toContainText("2 Pkg.");
  await page.getByTestId("delete-move-to").selectOption({ label: "Umlagern nach „Kühlschrank“" });
  await page.getByTestId("confirm-ok").click();
  await expect(shelf).toHaveCount(0);
  const rows = (await ws(page, { type: "pantry/stock", product_id: productId })) as {
    location: string;
    packages: number;
  }[];
  expect(rows.map((r) => [r.location, r.packages])).toEqual([["Kühlschrank", 2]]);

  await openPage(page, "/pantry/settings/categories", "Einstellungen");
  const parent = page.locator("pantry-settings li").filter({ hasText: PARENT });
  await parent.getByTestId("category-delete").click();
  const impact = page.getByTestId("delete-impact");
  await expect(impact).toContainText("Unterkategorien werden gelöscht (1)");
  await expect(impact).toContainText(CHILD);
  await expect(impact).toContainText(PRODUCT);
  // From the dry run: what cascades without anyone listing it, e.g. the shopping list entry.
  await expect(impact).toContainText("Einträge auf der Einkaufsliste werden gelöscht (1)");
  await expect(impact).toContainText("Buchungen werden gelöscht");
  await expect(page.getByTestId("confirm-ok")).toHaveText("Alles löschen");
  await page.getByTestId("confirm-ok").click();
  await expect(parent).toHaveCount(0);
  await expect(page.locator("pantry-settings .error")).toHaveCount(0);
});
