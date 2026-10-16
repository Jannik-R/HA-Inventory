import { apiPage, openPage, openTab, remove, save, ws } from "./helpers";
import { expect, test } from "./fixtures";

const STAMP = Date.now();
const NAME = `E2E Testprodukt ${STAMP}`;
const PARENT = `E2E Eltern ${STAMP}`;
const CHILD = `E2E Sorte ${STAMP}`;
const NEW_TYPE = `E2E Neue Sorte ${STAMP}`;
const LOCATION = `E2E Regal ${STAMP}`;
let parentId: number | undefined;
let locationId: number | undefined;

test.beforeAll(async ({ browser }) => {
  const page = await apiPage(browser);
  parentId = await save(page, "category", { name: PARENT });
  await save(page, "category", { name: CHILD, parent_id: parentId });
  locationId = await save(page, "location", { name: LOCATION });
  await page.close();
});

test.afterAll(async ({ browser }) => {
  const page = await apiPage(browser);
  const hits = (await ws(page, { type: "pantry/search", query: NAME })) as { id: number }[];
  for (const { id } of hits) {
    const stock = (await ws(page, { type: "pantry/stock", product_id: id })) as {
      packages: number;
    }[];
    const left = stock.reduce((n, r) => n + r.packages, 0);
    if (left) await ws(page, { type: "pantry/book_out", product_id: id, packages: left });
    await remove(page, "product", id);
  }
  if (parentId != null) await remove(page, "category", parentId);
  if (locationId != null) await remove(page, "location", locationId);
  await page.close();
});

test("book a new product in and out again", async ({ page, printCalls }) => {
  await openPage(page, "/pantry/in", "Einbuchen");
  const code = page.getByTestId("code-input");
  await expect(code).toBeFocused();
  await code.fill(NAME);
  await code.press("Enter");
  await page.getByTestId("new-product").click();
  await expect(page.locator("pantry-booking form.book > h2")).toHaveText("Produkt zubuchen");
  await expect(page.getByTestId("name")).toHaveValue(NAME);
  await page.getByTestId("category").click();
  await page.getByTestId("category-filter").fill(CHILD);
  await page.getByTestId("category-filter").press("Enter");
  await page.getByTestId("category-confirm").click();
  await expect(page.getByTestId("category")).toContainText(CHILD);
  // Reopening shows the tree expanded down to the chosen category.
  await page.getByTestId("category").click();
  await expect(page.locator("[data-testid=category-option][aria-current=true]")).toHaveText(CHILD);
  // Clicking a parent only marks and opens it; the dialog stays open until confirmed.
  await page.getByTestId("category-option").filter({ hasText: PARENT }).click();
  await expect(page.getByTestId("category-confirm")).toBeVisible();
  await expect(page.locator("[data-testid=category-option][aria-current=true]")).toHaveText(PARENT);
  await page.keyboard.press("Escape");
  await expect(page.getByTestId("category")).toContainText(CHILD);
  // The date label names the product's date type; the chosen location becomes its default.
  await expect(page.locator("label", { has: page.getByTestId("expires") })).toContainText(
    "Ablaufdatum (",
  );
  await page.getByTestId("location").selectOption({ label: LOCATION });
  // Reset shows the inherited choice again.
  await page.getByTestId("location-reset").click();
  await expect(page.getByTestId("location")).toHaveValue("");
  await page.getByTestId("location").selectOption({ label: LOCATION });
  await expect(page.getByTestId("make-default")).toBeChecked();
  // Non-obvious fields explain themselves in a tooltip.
  await expect(page.locator("label", { has: page.getByTestId("make-default") })).toHaveAttribute(
    "title",
    /Standard-Lagerort/,
  );
  // Optional minimum, set right when creating the product.
  await expect(page.getByTestId("min-packages")).toHaveValue("");
  await page.getByTestId("min-packages").fill("2");
  await page.getByTestId("expires").fill("2030-01-31");
  await page.getByTestId("packages").fill("3");
  await expect(page.getByTestId("print-labels")).toBeChecked();
  await page.getByTestId("submit").click();
  // More than 2 labels are confirmed first.
  await expect(page.locator("pantry-confirm")).toContainText("3 Etiketten drucken?");
  await page.getByTestId("confirm-ok").click();
  await expect(page.getByTestId("message")).toContainText(`3 × ${NAME}`);
  // The print request was sent, and blocked by the fixture (never reaches the printer).
  expect(printCalls).toEqual([expect.objectContaining({ type: "pantry/print_labels", count: 3 })]);
  await expect(code).toBeFocused();

  // Known product: date, packages and location only; the location default is now the product's own.
  await code.fill(NAME);
  await code.press("Enter");
  await page.getByTestId("hit").click();
  await expect(page.getByTestId("summary")).toContainText(CHILD);
  await expect(page.getByTestId("name")).toHaveCount(0);
  await expect(page.getByTestId("make-default")).toHaveCount(0);
  await expect(page.getByTestId("location").locator("option").first()).toContainText("vom Produkt");
  await expect(page.getByTestId("expires")).toBeFocused();
  await page.getByTestId("submit").click();
  await expect(page.getByTestId("message")).toContainText(`1 × ${NAME}`);

  // Stock page: edit a property of the product.
  await openTab(page, "Bestand");
  await page.getByTestId("stock-filter").fill(NAME);
  const product = page.getByTestId("stock-product");
  await expect(product).toContainText("4 Pkg.");
  await page.getByTestId("product-edit").click();
  // Safety: only ever edit or delete the test's own product.
  await expect(page.locator("pantry-product-dialog dialog > form > h2")).toHaveText(
    `„${NAME}“ bearbeiten`,
  );
  await page.getByTestId("brand").fill("E2E Marke");
  // A new category is created right from the picker, below a chosen parent.
  await page.getByTestId("category").click();
  await page.getByTestId("category-filter").fill(NEW_TYPE);
  await page.getByTestId("category-create").click();
  await page.getByTestId("category-option").filter({ hasText: PARENT }).click();
  await page.getByTestId("category-confirm").click();
  await expect(page.getByTestId("category")).toContainText(`${PARENT} › ${NEW_TYPE}`);
  await page.getByTestId("warn-days").fill("4");
  await page.getByTestId("save").click();
  await expect(product).toContainText("E2E Marke");

  // Below its own minimum the product goes on the shopping list (4 in stock, 9 wanted).
  await page.getByTestId("product-edit").click();
  await page.getByTestId("min-packages").fill("9");
  await page.getByTestId("save").click();
  await openTab(page, "Einkauf");
  await expect(page.getByTestId("shopping-row").filter({ hasText: NAME })).toContainText(
    "E2E Marke · 5 Pkg. fehlen",
  );
  await openTab(page, "Bestand");
  await page.getByTestId("stock-filter").fill(NAME);

  await openTab(page, "Auslagern");
  await code.fill(NAME);
  await code.press("Enter");
  await expect(page.getByTestId("packages")).toHaveAttribute("max", "4");
  await page.getByTestId("packages").fill("2");
  await page.getByTestId("submit").click();
  await expect(page.getByTestId("message")).toContainText(`2 × ${NAME}`);
  // Undo puts both packages back.
  await page.getByTestId("undo").click();
  await expect(page.getByTestId("message")).toContainText("Rückgängig");
  await expect(page.getByTestId("undo")).toHaveCount(0);

  // Admin deletes the product with its remaining stock.
  await openTab(page, "Bestand");
  await page.getByTestId("stock-filter").fill(NAME);
  // Delete icon in the list, only on the row with the test's own product name.
  const row = page.locator("pantry-stock li.item").filter({ hasText: NAME });
  await expect(row).toHaveCount(1);
  await expect(row).toContainText("4 Pkg.");
  await row.getByTestId("product-delete").click();
  await expect(page.locator("pantry-confirm h2")).toHaveText(`„${NAME}“ löschen?`);
  await page.getByTestId("confirm-ok").click();
  await expect(product).toHaveCount(0);
});
