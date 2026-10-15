import { apiPage, openPage, openTab, ws } from "./helpers";
import { expect, test } from "@playwright/test";

const NAME = `E2E Testprodukt ${Date.now()}`;

test.afterAll(async ({ browser }) => {
  const page = await apiPage(browser);
  const hits = (await ws(page, { type: "pantry/search", query: NAME })) as { id: number }[];
  for (const { id } of hits) {
    const stock = (await ws(page, { type: "pantry/stock", product_id: id })) as {
      packages: number;
    }[];
    const left = stock.reduce((n, r) => n + r.packages, 0);
    if (left) await ws(page, { type: "pantry/book_out", product_id: id, packages: left });
    await ws(page, { type: "pantry/delete", table: "product", row_id: id });
  }
  await page.close();
});

test("book a new product in and out again", async ({ page }) => {
  await openPage(page, "/pantry/in", "Einbuchen");
  const code = page.getByTestId("code-input");
  await expect(code).toBeFocused();
  await code.fill(NAME);
  await code.press("Enter");
  await page.getByTestId("new-product").click();
  await expect(page.locator("pantry-booking form.book > h2")).toHaveText("Produkt zubuchen");
  await expect(page.getByTestId("name")).toHaveValue(NAME);
  await page.getByTestId("category").click();
  await page.getByTestId("category-filter").fill("nudeln");
  await page.getByTestId("category-filter").press("Enter");
  await page.getByTestId("category-confirm").click();
  await expect(page.getByTestId("category")).toContainText("Nudeln");
  // Reopening shows the tree expanded down to the chosen category.
  await page.getByTestId("category").click();
  await expect(page.locator("[data-testid=category-option][aria-current=true]")).toHaveText(
    "Nudeln",
  );
  // Clicking a parent only marks and opens it; the dialog stays open until confirmed.
  await page.getByTestId("category-option").filter({ hasText: "Obst & Gemüse" }).click();
  await expect(page.getByTestId("category-confirm")).toBeVisible();
  await expect(page.locator("[data-testid=category-option][aria-current=true]")).toHaveText(
    "Obst & Gemüse",
  );
  await page.keyboard.press("Escape");
  await expect(page.getByTestId("category")).toContainText("Nudeln");
  // The date label names the product's date type; the chosen location becomes its default.
  await expect(page.locator("label", { has: page.getByTestId("expires") })).toContainText(
    "Ablaufdatum (",
  );
  await page.getByTestId("location").selectOption({ index: 1 });
  await expect(page.getByTestId("make-default")).toBeChecked();
  await page.getByTestId("expires").fill("2030-01-31");
  await page.getByTestId("packages").fill("3");
  await page.getByTestId("submit").click();
  await expect(page.getByTestId("message")).toContainText(`3 × ${NAME}`);
  await expect(code).toBeFocused();

  // Known product: date, packages and location only; the location default is now the product's own.
  await code.fill(NAME);
  await code.press("Enter");
  await page.getByTestId("hit").click();
  await expect(page.getByTestId("summary")).toContainText("Nudeln");
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
  await page.getByTestId("warn-days").fill("4");
  await page.getByTestId("save").click();
  await expect(product).toContainText("E2E Marke");

  await openTab(page, "Auslagern");
  await code.fill(NAME);
  await code.press("Enter");
  await expect(page.getByTestId("packages")).toHaveAttribute("max", "4");
  await page.getByTestId("packages").fill("2");
  await page.getByTestId("submit").click();
  await expect(page.getByTestId("message")).toContainText(`2 × ${NAME}`);

  // Admin deletes the product with its remaining stock.
  await openTab(page, "Bestand");
  await page.getByTestId("stock-filter").fill(NAME);
  // Delete icon in the list, only on the row with the test's own product name.
  const row = page.locator("pantry-stock li.item").filter({ hasText: NAME });
  await expect(row).toHaveCount(1);
  page.once("dialog", (d) => d.accept());
  await row.getByTestId("product-delete").click();
  await expect(product).toHaveCount(0);
});
