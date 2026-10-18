import { apiPage, openPage, remove, ws } from "./helpers";
import { expect, test } from "./fixtures";

type Md = { categories: { id: number; name: string }[] };

const plusDays = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

test("a canning recipe starts a protocol: charge, product, proposed date, edit", async ({
  page,
}) => {
  const NAME = `E2E Apfelmus ${Date.now()}`;
  const api = await apiPage(page.context().browser()!);
  const md = (await ws(api, { type: "pantry/master_data" })) as Md;
  const category_id = md.categories.find((c) => c.name === "Obst & Kompott")!.id;
  const { product_id } = (await ws(api, {
    type: "pantry/book_in",
    product: { name: NAME, category_id },
    packages: 1,
  })) as { product_id: number };
  try {
    // the canning recipe lives in Einkochen › Rezepte and fixes the product
    await openPage(page, "/pantry/canning/recipes", "Einkochen");
    await page.getByTestId("recipe-add").click();
    const rd = page.locator("pantry-recipe-dialog dialog");
    await rd.getByTestId("recipe-name").fill(`${NAME} Rezept`);
    await rd.getByTestId("recipe-product").fill(NAME);
    await rd.getByTestId("recipe-servings-input").fill("3");
    await rd.getByTestId("recipe-canning_temp").fill("85");
    await rd.getByTestId("recipe-canning_minutes").fill("20");
    await rd.getByTestId("recipe-save").click();
    const recipe = page.getByTestId("recipe-row").filter({ hasText: `${NAME} Rezept` });
    await expect(recipe).toContainText(`ergibt 3 × ${NAME}`);
    await recipe.getByTestId("recipe-toggle").click();
    await recipe.getByTestId("recipe-to-canning").click();

    const dialog = page.locator("pantry-canning-dialog dialog");
    await expect(page).toHaveURL(/\/pantry\/canning$/);
    await expect(dialog.getByTestId("canning-recipe-product")).toContainText(NAME);
    await expect(dialog.getByTestId("canning-jars")).toHaveValue("3");
    await expect(dialog.getByTestId("canning-temp")).toHaveValue("85");
    // shelf life of "Eingekochtes": 365 days from the made-on date (today)
    await expect(dialog.getByTestId("canning-expires_on")).toHaveValue(plusDays(365));
    await dialog.getByTestId("canning-save").click();

    // the label dialog offers one label per jar; tests never print
    const labels = page.locator("pantry-label-dialog dialog");
    await expect(labels.getByTestId("label-count")).toHaveValue("3");
    await labels.getByRole("button", { name: "Abbrechen" }).click();

    const row = page.getByTestId("canning-row").filter({ hasText: NAME });
    await expect(row).toContainText("3 von 3 Gläsern da");
    await expect(row).toContainText("85 °C");
    const charge = await row.getAttribute("data-charge");
    expect(charge).toMatch(/^\d{8}-\d+$/);

    await row.getByTestId("canning-edit").click();
    await expect(dialog.getByTestId("canning-fixed")).toContainText(charge!);
    await dialog.getByTestId("canning-notes").fill("E2E ein Glas offen");
    await dialog.getByTestId("canning-save").click();
    await expect(row).toContainText("E2E ein Glas offen");

    await openPage(page, `/pantry/stock`, "Bestand");
    await page.getByTestId("code-input").fill(NAME);
    // the jars of the charge (3) and the one booked in by hand stay apart
    await expect(page.getByTestId("stock-batch")).toHaveCount(2);
    await expect(
      page.getByTestId("stock-batch").filter({ hasText: `Charge ${charge}` }),
    ).toHaveCount(1);
    // canning recipes are no dishes: not in the Rezepte tab
    await openPage(page, "/pantry/recipes", "Rezepte");
    await page.getByTestId("recipe-search").fill(NAME);
    await expect(page.getByTestId("recipe-row")).toHaveCount(0);
  } finally {
    await remove(api, "product", product_id); // takes the recipe and the protocol along
    await api.close();
  }
});

test("non-food categories are no recipe ingredients", async ({ page }) => {
  await openPage(page, "/pantry/recipes", "Rezepte");
  await page.getByTestId("recipe-add").click();
  const dialog = page.locator("pantry-recipe-dialog dialog");
  await dialog.getByTestId("ingredient-add").click();
  const ing = dialog.getByTestId("ingredient-row");
  await ing.getByTestId("ingredient-search").fill("Mignon");
  await expect(ing.getByTestId("ingredient-hit")).toHaveCount(0);
  await ing.getByTestId("ingredient-search").fill("Apfelmus");
  await expect(ing.getByTestId("ingredient-hit").first()).toBeVisible();
});
