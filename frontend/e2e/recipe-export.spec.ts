import { apiPage, openPage, remove, ws } from "./helpers";
import { expect, test } from "./fixtures";

const NAME = `E2E Export ${Date.now()}`;
let recipeId: number | undefined;

test.beforeAll(async ({ browser }) => {
  const page = await apiPage(browser);
  const res = (await ws(page, {
    type: "home_inventory/recipe_save",
    data: {
      name: NAME,
      servings: 2,
      ingredients: [{ text: "E2E Salz" }],
      steps: [{ text: "Erst." }, { section: "Soße", text: "Dann." }],
    },
  })) as { id: number };
  recipeId = res.id;
  await page.close();
});

test.afterAll(async ({ browser }) => {
  const page = await apiPage(browser);
  if (recipeId != null) await remove(page, "recipe", recipeId);
  await page.close();
});

test("one recipe downloads as schema.org JSON-LD", async ({ page }) => {
  await openPage(page, "/home_inventory/recipes", "Rezepte");
  await page.getByTestId("recipe-search").fill(NAME);
  await page.getByTestId("recipe-toggle").click();
  const download = page.waitForEvent("download");
  await page.getByTestId("recipe-export").click();
  const file = await download;
  expect(file.suggestedFilename()).toMatch(/^E2E-Export-\d+\.json$/);
  const stream = await file.createReadStream();
  let text = "";
  for await (const c of stream) text += c.toString("utf-8");
  const json = JSON.parse(text);
  expect(json["@type"]).toBe("Recipe");
  expect(json.name).toBe(NAME);
  expect(json.recipeInstructions[1]["@type"]).toBe("HowToSection");
});

test("Drucken / PDF prints only the recipe; the receipt button is a different one", async ({
  page,
}) => {
  await openPage(page, "/home_inventory/recipes", "Rezepte");
  await page.getByTestId("recipe-search").fill(NAME);
  await page.getByTestId("recipe-toggle").click();
  await page.evaluate(() => {
    (window as unknown as { printed: string[] }).printed = [];
    window.print = () => {
      const block = document.querySelector("#hi-print") as HTMLElement;
      (window as unknown as { printed: string[] }).printed.push(block.textContent ?? "");
      document.body.appendChild(block.cloneNode(true)); // the real one is removed after print()
    };
  });
  await expect(page.getByTestId("recipe-print-browser")).toContainText("Drucken / PDF");
  await page.getByTestId("recipe-print-browser").click();
  const printed = await page.evaluate(() => (window as unknown as { printed: string[] }).printed);
  expect(printed).toHaveLength(1);
  expect(printed[0]).toContain(NAME);
  expect(printed[0]).toContain("E2E Salz");
  expect(printed[0]).toContain("Dann.");
  await page.emulateMedia({ media: "print" });
  const visible = await page.evaluate(() => [
    getComputedStyle(document.querySelector("home-assistant")!).display,
    getComputedStyle(document.querySelector("#hi-print")!).display,
  ]);
  expect(visible).toEqual(["none", "block"]);
  // the receipt button (only with a receipt printer) has its own test id and label
  await expect(page.getByTestId("recipe-print")).not.toContainText("PDF");
});

test("all recipes download as one list", async ({ page }) => {
  await openPage(page, "/home_inventory/recipes", "Rezepte");
  const download = page.waitForEvent("download");
  await page.getByTestId("recipe-export-all").click();
  expect((await download).suggestedFilename()).toBe("rezepte.json");
});
