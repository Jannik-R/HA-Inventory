import { apiPage, openPage, remove, save, ws } from "./helpers";
import { expect, test } from "./fixtures";

const NAME = `E2E Einkauf ${Date.now()}`;

const NEW_PRODUCT = `E2E Produkt ${Date.now()}`;
const NEW_CATEGORY = `E2E Kategorie ${Date.now()}`;

let categoryId: number | undefined;

test.beforeAll(async ({ browser }) => {
  const page = await apiPage(browser);
  const res = (await ws(page, {
    type: "pantry/save",
    table: "category",
    data: { name: NAME },
  })) as { id: number };
  categoryId = res.id;
  await page.close();
});

test.afterAll(async ({ browser }) => {
  const page = await apiPage(browser);
  // Items by hand go with their product / category.
  const items = (await ws(page, { type: "pantry/shopping" })) as {
    name: string;
    product_id: number | null;
    category_id: number;
  }[];
  const product = items.find((i) => i.name === NEW_PRODUCT);
  if (product)
    await ws(page, { type: "pantry/delete", table: "product", row_id: product.product_id });
  const cat = items.find((i) => i.name === NEW_CATEGORY);
  if (cat) await ws(page, { type: "pantry/delete", table: "category", row_id: cat.category_id });
  if (categoryId != null)
    await ws(page, { type: "pantry/delete", table: "category", row_id: categoryId });
  await page.close();
});

test("min stock in the settings puts the category on the shopping list", async ({
  page,
  wsStub,
  printCalls,
}) => {
  // As if a receipt printer were set up (the print itself is blocked by the fixture).
  wsStub("pantry/label_config", {
    printer: false,
    print_on_book_in: false,
    width_mm: 57,
    height_mm: 32,
    receipt: true,
  });
  await openPage(page, "/pantry/settings/categories", "Einstellungen");
  await page
    .locator("pantry-settings li")
    .filter({ hasText: NAME })
    .getByTestId("category-edit")
    .click();
  const unit = page.getByTestId("min_stock_unit");
  await expect(unit).toBeDisabled(); // no amount yet
  await page.getByTestId("min_stock").fill("500");
  await unit.selectOption({ label: "g" });
  await page.getByTestId("min_packages").fill("1.5");
  await expect(page.getByTestId("min_packages-error")).toBeVisible();
  await page.getByTestId("min_packages").fill("2");
  await page.getByTestId("save").click();
  await expect(page.locator("pantry-settings li").filter({ hasText: NAME })).toContainText(
    "min. 500 g",
  );

  await openPage(page, "/pantry/shopping", "Einkauf");
  const row = page.getByTestId("shopping-row").filter({ hasText: NAME });
  await expect(row).toContainText("500 g und 2 Pkg. fehlen");
  await row.getByTestId("shopping-check").check();
  await expect(row).toHaveClass(/done/);
  await row.getByTestId("shopping-check").uncheck();
  await expect(row).not.toHaveClass(/done/);

  await page.getByTestId("shopping-print").click();
  await expect(page.getByTestId("shopping-printed")).toContainText("Einkaufszettel gedruckt");
  expect(printCalls).toEqual([expect.objectContaining({ type: "pantry/print_shopping_list" })]);
});

test("add to the shopping list by hand: existing category, new product, new category", async ({
  page,
}) => {
  await openPage(page, "/pantry/shopping", "Einkauf");
  const dialog = page.locator("pantry-shopping-add dialog");

  // Existing category, then the same again: the packages add up.
  for (const n of ["2", "1"]) {
    await page.getByTestId("shopping-add").click();
    await dialog.getByTestId("shopping-what").fill(NAME);
    await expect(dialog.getByTestId("save")).toBeDisabled();
    await dialog.getByTestId("shopping-hit").filter({ hasText: NAME }).click();
    await expect(dialog.getByTestId("shopping-choice")).toContainText(NAME);
    await dialog.getByTestId("shopping-packages").fill(n);
    await dialog.getByTestId("save").click();
  }
  const mine = page
    .getByTestId("shopping-row")
    .filter({ hasText: "beliebig" })
    .filter({ hasText: NAME });
  await expect(mine).toContainText("3 Pkg.");
  await mine.getByTestId("shopping-edit").click();
  await dialog.getByTestId("shopping-packages").fill("4");
  await dialog.getByTestId("save").click();
  await expect(mine).toContainText("4 Pkg.");
  await mine.getByTestId("shopping-delete").click();
  await page.getByTestId("confirm-ok").click();
  await expect(mine).toHaveCount(0);

  // New product: needs a category.
  await page.getByTestId("shopping-add").click();
  await dialog.getByTestId("shopping-what").fill(NEW_PRODUCT);
  await dialog.getByTestId("shopping-new-product").click();
  await expect(dialog.getByTestId("name")).toHaveValue(NEW_PRODUCT);
  await expect(dialog.getByTestId("save")).toBeDisabled();
  await dialog.getByTestId("category").click();
  await dialog.getByTestId("category-option").filter({ hasText: NAME }).click();
  await dialog.getByTestId("category-confirm").click();
  await dialog.getByTestId("save").click();
  await expect(page.getByTestId("shopping-row").filter({ hasText: NEW_PRODUCT })).toContainText(
    "1 Pkg.",
  );

  // New category (admin), main category by default.
  await page.getByTestId("shopping-add").click();
  await dialog.getByTestId("shopping-what").fill(NEW_CATEGORY);
  await dialog.getByTestId("shopping-new-category").click();
  await dialog.getByTestId("save").click();
  await expect(page.getByTestId("shopping-row").filter({ hasText: NEW_CATEGORY })).toBeVisible();
});

test("a recipe on the shopping list adds its ingredients and can be removed", async ({ page }) => {
  const RECIPE = `E2E Einkaufsrezept ${Date.now()}`;
  const api = await apiPage(page.context().browser()!);
  const md = (await ws(api, { type: "pantry/master_data" })) as {
    units: { id: number; symbol: string }[];
  };
  const { id } = (await ws(api, {
    type: "pantry/recipe_save",
    data: {
      name: RECIPE,
      servings: 2,
      ingredients: [
        {
          category_id: categoryId,
          amount: 300,
          unit_id: md.units.find((u) => u.symbol === "g")!.id,
          text: NAME,
        },
      ],
    },
  })) as { id: number };
  try {
    await openPage(page, "/pantry/recipes", "Rezepte");
    const row = page.getByTestId("recipe-row").filter({ hasText: RECIPE });
    await row.getByTestId("recipe-toggle").click();
    await row.getByTestId("recipe-to-shopping").click(); // no optional ingredients: no dialog
    await expect(row.getByTestId("recipe-on-shopping")).toContainText("2 Portionen");

    await openPage(page, "/pantry/shopping", "Einkauf");
    const entry = page.getByTestId("shopping-recipe").filter({ hasText: RECIPE });
    const no = (await entry.getByTestId("shopping-recipe-no").textContent())!.trim();
    // one line: "<category> – 300 g", small "<no>:300 g" (other recipes may be listed too)
    const item = page
      .getByTestId("shopping-row")
      .filter({ hasText: `${NAME} – 300 g` })
      .filter({ has: page.getByTestId("shopping-refs").filter({ hasText: `${no}:300 g` }) });
    await expect(item).toHaveCount(1);
    await item.getByTestId("shopping-check").check();
    await expect(item).toHaveClass(/done/);

    await entry.getByTestId("shopping-recipe-delete").click();
    await page.getByTestId("confirm-ok").click();
    await expect(item).toHaveCount(0);
  } finally {
    await ws(api, { type: "pantry/shopping_recipe_remove", recipe_id: id }).catch(() => undefined);
    await remove(api, "recipe", id);
    await api.close();
  }
});

test("optional ingredients, editing servings in the list, shown servings survive", async ({
  page,
}) => {
  const RECIPE = `E2E Optionalrezept ${Date.now()}`;
  const REQ = `E2E Pflicht ${Date.now()}`;
  const OPT = `E2E Optional ${Date.now()}`;
  const api = await apiPage(page.context().browser()!);
  const [req, opt] = [
    await save(api, "category", { name: REQ }),
    await save(api, "category", { name: OPT }),
  ];
  const md = (await ws(api, { type: "pantry/master_data" })) as {
    units: { id: number; symbol: string }[];
  };
  const unit_id = md.units.find((u) => u.symbol === "g")!.id;
  const { id } = (await ws(api, {
    type: "pantry/recipe_save",
    data: {
      name: RECIPE,
      servings: 2,
      ingredients: [
        { category_id: req, amount: 300, unit_id, text: REQ },
        { category_id: opt, amount: 100, unit_id, text: OPT, optional: true },
      ],
    },
  })) as { id: number };
  try {
    await openPage(page, "/pantry/recipes", "Rezepte");
    const row = page.getByTestId("recipe-row").filter({ hasText: RECIPE });
    await row.getByTestId("recipe-toggle").click();
    await row.getByTestId("recipe-servings").fill("4");
    await row.getByTestId("recipe-servings").press("Tab");
    await row.getByTestId("recipe-to-shopping").click();

    // The dialog starts with the servings shown in the detail; the optional one is ticked.
    const dialog = page.locator("pantry-shopping-recipe-dialog dialog");
    await expect(dialog.getByTestId("shopping-recipe-servings")).toHaveValue("4");
    await dialog.getByTestId("shopping-recipe-optional").check();
    await dialog.getByTestId("shopping-recipe-save").click();
    await expect(row.getByTestId("recipe-on-shopping")).toContainText("4 Portionen");
    // The shown servings were not reset by the refresh.
    await expect(row.getByTestId("recipe-servings")).toHaveValue("4");

    await openPage(page, "/pantry/shopping", "Einkauf");
    const item = (name: string) => page.getByTestId("shopping-row").filter({ hasText: name });
    await expect(item(REQ)).toContainText("600 g");
    await expect(item(OPT)).toContainText("200 g");

    // Edit the servings in "Für Rezepte": the amounts follow.
    const entry = page.getByTestId("shopping-recipe").filter({ hasText: RECIPE });
    await entry.getByTestId("shopping-recipe-edit").click();
    const edit = page.locator("pantry-shopping-recipes pantry-shopping-recipe-dialog dialog");
    await edit.getByTestId("shopping-recipe-servings").fill("2");
    await edit.getByTestId("shopping-recipe-save").click();
    await expect(item(REQ)).toContainText("300 g");
    await expect(item(OPT)).toContainText("100 g");
  } finally {
    await ws(api, { type: "pantry/shopping_recipe_remove", recipe_id: id }).catch(() => undefined);
    await remove(api, "recipe", id);
    await remove(api, "category", req);
    await remove(api, "category", opt);
    await api.close();
  }
});
