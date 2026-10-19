import { apiPage, openPage, remove, ws } from "./helpers";
import { expect, test, type Page } from "./fixtures";

// Screenshots for the user guide (docs/images/<name>-<theme>.png), at phone width in light and
// dark theme. Run on demand with `npm run docs:screenshots` (playwright.docs.config.ts). Demo data
// is created here and deleted again afterwards.

const OUT = "../docs/images";
const day = (offset: number) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toLocaleDateString("sv-SE"); // local YYYY-MM-DD
};
const monday = -((new Date().getDay() + 6) % 7); // the week view starts on Monday

type Row = { id: number; name: string };
const products: number[] = [];
const meals: number[] = [];
let recipeId: number | undefined;
let canningId: number | undefined;

test.beforeAll(async ({ browser }) => {
  const api = await apiPage(browser);
  const md = (await ws(api, { type: "home_inventory/master_data" })) as Record<string, Row[]>;
  const id = (table: string, name: string) => {
    const row = md[table].find((r) => r.name === name);
    if (!row) throw new Error(`${table} "${name}" missing in the dev DB`);
    return row.id;
  };
  const cat = (name: string) => id("categories", name);
  const unit = (name: string) => id("units", name);
  const fridge = id("locations", "Kühlschrank");
  const home_inventory = id("locations", "Vorratsschrank");

  const bookIn = async (
    name: string,
    category: string,
    content: [number, string],
    packages: number,
    expires: number,
    location_id: number,
    ean?: string,
  ) => {
    const r = (await ws(api, {
      type: "home_inventory/book_in",
      product: {
        name,
        category_id: cat(category),
        content_amount: content[0],
        content_unit_id: unit(content[1]),
        ...(ean ? { ean } : {}),
      },
      packages,
      expires_on: day(expires),
      location_id,
    })) as { product_id: number };
    products.push(r.product_id);
  };
  await bookIn("Vollmilch 1,5 %", "Milch", [1, "l"], 2, 3, fridge, "4000000000006");
  await bookIn("Naturjoghurt 3,5 %", "Naturjoghurt", [500, "g"], 1, -2, fridge);
  await bookIn("Parmesan am Stück", "Parmesan", [200, "g"], 1, 20, fridge);
  await bookIn("Tomatenmark", "Tomatenmark", [200, "g"], 3, 400, home_inventory);
  await bookIn("Passierte Tomaten", "Passierte Tomaten", [500, "g"], 2, 300, home_inventory);
  await bookIn("Basmatireis", "Basmatireis", [1, "kg"], 1, 500, home_inventory);

  const canning = (await ws(api, {
    type: "home_inventory/canning_save",
    data: {
      made_on: day(-30),
      jars: 6,
      location_id: home_inventory,
      product: { name: "Erdbeermarmelade", category_id: cat("Marmelade & Gelee") },
      temp: 85,
      minutes: 10,
    },
  })) as { id: number };
  canningId = canning.id;

  recipeId = (
    (await ws(api, {
      type: "home_inventory/recipe_save",
      data: {
        name: "Pasta al pomodoro",
        servings: 2,
        ingredients: [
          { category_id: cat("Spaghetti"), amount: 250, unit_id: unit("g") },
          { category_id: cat("Passierte Tomaten"), amount: 500, unit_id: unit("g") },
          {
            category_id: cat("Zwiebeln"),
            amount: 1,
            unit_id: unit("Stück"),
            note: "fein gewürfelt",
          },
          { category_id: cat("Knoblauch"), amount: 2, unit_id: unit("Zehe") },
          { category_id: cat("Tomatenmark"), amount: 1, unit_id: unit("Esslöffel") },
          { category_id: cat("Parmesan"), amount: 50, unit_id: unit("g"), note: "gerieben" },
          { category_id: cat("Basilikum"), optional: true },
        ],
        steps: [
          { text: "Spaghetti in reichlich Salzwasser etwa 10 Minuten kochen." },
          { text: "Zwiebel und Knoblauch glasig dünsten, Tomatenmark kurz mitrösten." },
          { text: "Passierte Tomaten dazugeben." },
          { text: "Die Soße 15 Minuten köcheln lassen, mit Salz und Pfeffer abschmecken." },
          { text: "Mit Parmesan und Basilikum servieren." },
        ],
      },
    })) as { id: number }
  ).id;
  await ws(api, { type: "home_inventory/shopping_recipe_set", recipe_id: recipeId, servings: 6 });

  // slots: 0 breakfast, 1 lunch, 3 dinner
  for (const [offset, slot, text, recipe_id] of [
    [monday, 1, "Linsensuppe", null],
    [monday, 3, "", recipeId],
    [monday + 1, 0, "Müsli mit Joghurt", null],
    [monday + 1, 3, "Pizza vom Lieferdienst", null],
  ] as const) {
    const r = (await ws(api, {
      type: "home_inventory/meal_save",
      data: { day: day(offset), slot, text, recipe_id, servings: 2 },
    })) as { id: number };
    meals.push(r.id);
  }
  await api.close();
});

test.afterAll(async ({ browser }) => {
  const api = await apiPage(browser);
  for (const meal_id of meals) await ws(api, { type: "home_inventory/meal_delete", meal_id });
  if (recipeId != null) {
    await ws(api, { type: "home_inventory/shopping_recipe_remove", recipe_id: recipeId });
    await remove(api, "recipe", recipeId);
  }
  if (canningId != null) await remove(api, "canning", canningId);
  for (const id of products) await remove(api, "product", id);
  const hits = (await ws(api, {
    type: "home_inventory/search",
    query: "Erdbeermarmelade",
  })) as Row[];
  for (const p of hits) if (p.name === "Erdbeermarmelade") await remove(api, "product", p.id);
  await api.close();
});

const shot = (page: Page, name: string, theme: string) =>
  page.screenshot({ path: `${OUT}/${name}-${theme}.png`, animations: "disabled" });

for (const theme of ["light", "dark"] as const) {
  test(`guide screenshots (${theme})`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: theme });
    // German dates and numbers like the UI (HA keeps the language per browser)
    await page.addInitScript(() => localStorage.setItem("selectedLanguage", '"de"'));

    await openPage(page, "/home_inventory/stock", "Bestand");
    const closed = page.locator('[data-testid="stock-category"][aria-expanded="false"]');
    await expect(closed.first()).toBeVisible();
    while (await closed.count()) await closed.first().click();
    await page.getByTestId("code-input").scrollIntoViewIfNeeded();
    await shot(page, "stock", theme);

    await openPage(page, "/home_inventory/in", "Bestand");
    await page.getByTestId("code-input").fill("4000000000006");
    await page.getByTestId("code-input").press("Enter");
    await expect(page.locator("dialog[open]")).toBeVisible();
    await shot(page, "book-in", theme);
    await page.keyboard.press("Escape");

    await openPage(page, "/home_inventory/expiry", "Ablauf");
    await expect(page.getByText("Naturjoghurt 3,5 %")).toBeVisible();
    await shot(page, "expiry", theme);

    await openPage(page, "/home_inventory/shopping", "Einkauf");
    await expect(page.getByText("Zwiebeln").first()).toBeVisible();
    await shot(page, "shopping", theme);

    await openPage(page, "/home_inventory/recipes", "Rezepte");
    const recipe = page.getByTestId("recipe-row").filter({ hasText: "Pasta al pomodoro" });
    await recipe.getByTestId("recipe-toggle").click();
    await expect(recipe.getByText("Mit Parmesan und Basilikum servieren.")).toBeVisible();
    await shot(page, "recipe", theme);

    await openPage(page, "/home_inventory/plan/week", "Speiseplan");
    await expect(page.getByText("Linsensuppe")).toBeVisible();
    await shot(page, "plan", theme);

    await openPage(page, "/home_inventory/canning", "Einkochen");
    await expect(page.getByText("Erdbeermarmelade").first()).toBeVisible();
    await shot(page, "canning", theme);
  });
}
