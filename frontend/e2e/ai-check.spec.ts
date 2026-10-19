import { apiPage, openPage, ws } from "./helpers";
import { expect, test } from "./fixtures";

type Md = {
  categories: { id: number; name: string; parent_id: number | null }[];
  units: { id: number; name: string; symbol: string }[];
};

const ingredient = (text: string, line: string, unit_hint: string | null) => ({
  text,
  source_text: text,
  amount: 1,
  unit_id: null,
  unit_hint,
  note: null,
  optional: false,
  line,
  category_id: null,
});

test("an import is checked by the AI: changes are marked and can be undone", async ({
  page,
  wsStub,
}) => {
  const api = await apiPage(page.context().browser()!);
  const md = (await ws(api, { type: "pantry/master_data" })) as Md;
  await api.close();
  const id = (name: string) => md.categories.find((c) => c.name === name)!.id;
  const block = "Saft kochen, Zucker einrühren und abfüllen.";
  wsStub("pantry/recipe_import", {
    name: `E2E KI ${Date.now()}`,
    servings: 4,
    steps: [{ section: null, text: block }],
    source_url: "https://example.com/gelee",
    image_url: null,
    ingredients: [
      {
        text: "Zucker",
        source_text: "Zucker",
        amount: null,
        unit_id: null,
        unit_hint: null,
        note: null,
        optional: false,
        line: "500 g Zucker",
        category_id: id("Zucker"),
      },
    ],
  });
  wsStub("pantry/recipe_ai_check", {
    status: "changes",
    ok: false,
    ingredients: [{ index: 0, category_id: id("Haushaltszucker"), reason: "genauer" }],
    steps: [
      { section: null, text: "Saft kochen." },
      { section: null, text: "Zucker einrühren und abfüllen." },
    ],
  });
  await openPage(page, "/pantry/recipes", "Rezepte");
  await page.getByTestId("recipe-import").click();
  const imp = page.locator("pantry-recipe-import dialog");
  await imp.getByTestId("recipe-import-url").fill("https://example.com/gelee");
  await imp.getByTestId("recipe-import-submit").click();

  const dialog = page.locator("pantry-recipe-dialog dialog");
  await expect(dialog.getByTestId("ai-status")).toContainText("1 Zutat geändert");
  const row = dialog.getByTestId("ingredient-row");
  await expect(row.getByTestId("ingredient-choice")).toContainText("Haushaltszucker");
  await expect(row.getByTestId("ingredient-ai")).toContainText("genauer (vorher: Zucker)");
  await expect(dialog.getByTestId("step-text")).toHaveCount(2);

  await row.getByTestId("ingredient-ai-undo").click();
  await expect(row.getByTestId("ingredient-choice")).not.toContainText("Haushaltszucker");
  await expect(row.getByTestId("ingredient-ai")).toHaveCount(0);
  await dialog.getByTestId("ai-undo-steps").click();
  await expect(dialog.getByTestId("step-text")).toHaveValue(block);
  await expect(dialog.getByTestId("recipe-save")).toBeEnabled();
});

test("a product type proposed by the AI is added when the recipe is saved", async ({
  page,
  wsStub,
}) => {
  const api = await apiPage(page.context().browser()!);
  const md = (await ws(api, { type: "pantry/master_data" })) as Md;
  const spices = md.categories.find((c) => c.name === "Gewürze")!.id;
  const stamp = Date.now();
  const type = `E2E Gewürz ${stamp}`;
  wsStub("pantry/recipe_import", {
    name: `E2E KI Typ ${stamp}`,
    servings: 2,
    steps: [{ section: null, text: "Würzen." }],
    source_url: "https://example.com/typ",
    image_url: null,
    ingredients: [
      {
        text: "Seltenes Gewürz",
        source_text: "Seltenes Gewürz",
        amount: null,
        unit_id: null,
        unit_hint: null,
        note: null,
        optional: false,
        line: "1 Prise Seltenes Gewürz",
        category_id: null,
      },
    ],
  });
  wsStub("pantry/recipe_ai_check", {
    status: "changes",
    ok: false,
    ingredients: [
      { index: 0, category_id: null, new_type: { name: type, parent_id: spices }, reason: "neu" },
    ],
  });
  await openPage(page, "/pantry/recipes", "Rezepte");
  await page.getByTestId("recipe-import").click();
  const imp = page.locator("pantry-recipe-import dialog");
  await imp.getByTestId("recipe-import-url").fill("https://example.com/typ");
  await imp.getByTestId("recipe-import-submit").click();

  const dialog = page.locator("pantry-recipe-dialog dialog");
  const row = dialog.getByTestId("ingredient-row");
  await expect(row.getByTestId("ingredient-ai")).toContainText(`„${type}“ unter „Gewürze“`);
  await dialog.getByTestId("recipe-save").click();
  const added = async () =>
    ((await ws(api, { type: "pantry/master_data" })) as Md).categories.find((c) => c.name === type);
  await expect.poll(async () => (await added())?.parent_id).toBe(spices);
  // cleanup: the recipe, then the type
  const recipes = (await ws(api, { type: "pantry/recipes" })) as { id: number; name: string }[];
  const recipe = recipes.find((r) => r.name === `E2E KI Typ ${stamp}`)!;
  await ws(api, { type: "pantry/delete", table: "recipe", row_id: recipe.id, force: true });
  await ws(api, {
    type: "pantry/delete",
    table: "category",
    row_id: (await added())!.id,
    force: true,
  });
  await api.close();
});

test("the AI picks an existing unit or proposes a new one", async ({ page, wsStub }) => {
  const api = await apiPage(page.context().browser()!);
  const md = (await ws(api, { type: "pantry/master_data" })) as Md;
  await api.close();
  const msp = md.units.find((u) => u.name === "Messerspitze")!.id;
  wsStub("pantry/recipe_import", {
    name: `E2E KI Einheit ${Date.now()}`,
    servings: 2,
    steps: [{ section: null, text: "Würzen." }],
    source_url: "https://example.com/einheit",
    image_url: null,
    ingredients: [
      ingredient("Muskat", "1 Msp Muskat", "Msp"),
      ingredient("Sellerie", "1 Knolle Sellerie", null),
    ],
  });
  wsStub("pantry/recipe_ai_check", {
    status: "changes",
    ok: false,
    ingredients: [
      { index: 0, unit_id: msp, reason: "Messerspitze" },
      { index: 1, new_unit: { name: "Knolle" }, reason: "neue Einheit" },
    ],
  });
  await openPage(page, "/pantry/recipes", "Rezepte");
  await page.getByTestId("recipe-import").click();
  const imp = page.locator("pantry-recipe-import dialog");
  await imp.getByTestId("recipe-import-url").fill("https://example.com/einheit");
  await imp.getByTestId("recipe-import-submit").click();

  const rows = page.locator("pantry-recipe-dialog dialog").getByTestId("ingredient-row");
  await expect(rows.nth(0).getByTestId("ingredient-unit")).toHaveValue(String(msp));
  await expect(rows.nth(0).getByTestId("ingredient-ai")).toContainText(
    "Messerspitze (vorher: Msp)",
  );
  await expect(rows.nth(1)).toContainText("Einheit „Knolle“ ist unbekannt");
  await expect(rows.nth(1).getByTestId("ingredient-unit-create")).toBeVisible();
  await rows.nth(0).getByTestId("ingredient-ai-undo").click();
  await expect(rows.nth(0).getByTestId("ingredient-unit")).toHaveValue("");
  await expect(rows.nth(0)).toContainText("Einheit „Msp“ ist unbekannt");
});

test("a new product from Open Food Facts is checked by the AI", async ({ page, wsStub }) => {
  const api = await apiPage(page.context().browser()!);
  const md = (await ws(api, { type: "pantry/master_data" })) as Md;
  await api.close();
  const g = md.units.find((u) => u.symbol === "g")!.id;
  const name = `Marke E2E Nudeln ${Date.now()} 500g`;
  wsStub("pantry/lookup", {
    product: {
      ean: "4000000000017",
      name,
      brand: "Marke",
      category_id: null,
      content_amount: null,
      content_unit_id: null,
      image_url: null,
      off_json: "{}",
    },
  });
  wsStub("pantry/product_ai_check", {
    status: "changes",
    name: "E2E Nudeln",
    content_amount: 500,
    content_unit_id: g,
    reason: "ohne Marke",
  });
  await openPage(page, "/pantry/in", "Bestand");
  await page.getByTestId("code-input").fill("4000000000017");
  await page.getByTestId("code-input").press("Enter");

  const status = page.getByTestId("product-ai-status");
  await expect(status).toContainText(`ohne Marke (vorher: ${name}, –)`);
  await expect(page.getByTestId("name")).toHaveValue("E2E Nudeln");
  await expect(page.getByTestId("content-amount")).toHaveValue("500");
  await page.getByTestId("product-ai-undo").click();
  await expect(page.getByTestId("name")).toHaveValue(name);
  await expect(page.getByTestId("content-amount")).toHaveValue("");
  await expect(status).toHaveCount(0);
});

test("the AI proposes a product type for a new product", async ({ page, wsStub }) => {
  const api = await apiPage(page.context().browser()!);
  const md = (await ws(api, { type: "pantry/master_data" })) as Md;
  await api.close();
  const batteries = md.categories.find((c) => c.name === "Batterien")!.id;
  wsStub("pantry/lookup", {
    product: {
      ean: "4000000000024",
      name: `E2E Knopfzelle ${Date.now()}`,
      brand: null,
      category_id: null,
      content_amount: null,
      content_unit_id: null,
      image_url: null,
      off_json: "{}",
    },
  });
  wsStub("pantry/product_ai_check", {
    status: "changes",
    category_id: null,
    new_type: { name: "E2E Knopfzellen", parent_id: batteries },
    reason: "neue Sorte",
  });
  await openPage(page, "/pantry/in", "Bestand");
  await page.getByTestId("code-input").fill("4000000000024");
  await page.getByTestId("code-input").press("Enter");

  await expect(page.getByTestId("product-ai-new-type")).toContainText(
    "„E2E Knopfzellen“ unter „Batterien“",
  );
  await page.getByTestId("product-ai-undo").click();
  await expect(page.getByTestId("product-ai-new-type")).toHaveCount(0);
});
