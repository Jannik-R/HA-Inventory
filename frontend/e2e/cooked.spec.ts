import { apiPage, openPage, remove, ws } from "./helpers";
import { expect, test } from "./fixtures";

const NAME = `E2E Gekocht ${Date.now()}`;
let recipeId: number | undefined;

const batch = (batch_id: number, expires_on: string, packages = 2) => ({
  batch_id,
  location: "Vorratsschrank",
  expires_on,
  packages,
  opened: false,
});
const cand = (product_id: number, name: string, batches: unknown[], packages: number) => ({
  product_id,
  name,
  brand: null,
  batches,
  action: "out",
  packages,
  open: 0,
  batch_id: (batches[0] as { batch_id: number }).batch_id,
});

test.beforeAll(async ({ browser }) => {
  const page = await apiPage(browser);
  const res = (await ws(page, {
    type: "home_inventory/recipe_save",
    data: { name: NAME, servings: 2, ingredients: [{ text: "Nudeln" }] },
  })) as { id: number };
  recipeId = res.id;
  await page.close();
});

test.afterAll(async ({ browser }) => {
  const page = await apiPage(browser);
  if (recipeId != null) await remove(page, "recipe", recipeId);
  await page.close();
});

test("cooked: change product and batch, book out, undo", async ({ page, wsStub }) => {
  wsStub("home_inventory/cooked_proposal", [
    {
      ingredient_id: 1,
      text: "Nudeln",
      amount: 500,
      unit_symbol: "g",
      optional: false,
      checked: true,
      product_id: 1,
      candidates: [
        cand(1, "Spaghetti", [batch(11, "2027-01-01")], 1),
        cand(2, "Penne", [batch(21, "2027-03-01"), batch(22, "2028-01-01")], 2),
      ],
    },
  ]);
  wsStub("home_inventory/cooked_book", {
    bookings: [{ product_id: 2, name: "Penne", packages: 2, action: "out" }],
    out_ids: [1],
    open_ids: [],
  });
  wsStub("home_inventory/cooked_undo", null);
  await openPage(page, "/home_inventory/recipes", "Rezepte");
  const row = page.getByTestId("recipe-row").filter({ hasText: NAME });
  await row.getByTestId("recipe-toggle").click();
  await row.getByTestId("recipe-cooked").click();
  const dialog = page.locator("home-inventory-cooked-dialog dialog");
  await expect(dialog).toContainText("gekocht");
  await dialog.getByTestId("cooked-product").selectOption({ label: "Penne" });
  await expect(dialog.getByTestId("cooked-packages")).toHaveValue("2"); // Penne's proposal
  await expect(dialog.getByTestId("cooked-batch").locator("option")).toHaveCount(3);
  await dialog.getByTestId("cooked-packages").fill("3"); // more than the batch holds
  await dialog.getByTestId("cooked-batch").selectOption("21");
  await expect(dialog.getByTestId("cooked-save")).toBeDisabled(); // 3 > 2 in that batch
  await dialog.getByTestId("cooked-packages").fill("2");
  await dialog.getByTestId("cooked-save").click();
  await expect(dialog.getByTestId("cooked-done")).toContainText("Penne");
  await dialog.getByTestId("cooked-undo").click();
  await expect(dialog).not.toBeVisible();
});
