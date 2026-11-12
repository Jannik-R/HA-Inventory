import { apiPage, openPage, remove, ws } from "./helpers";
import { expect, test } from "./fixtures";

const NAME = `E2E Schritte ${Date.now()}`;

test.afterAll(async ({ browser }) => {
  const api = await apiPage(browser);
  const list = (await ws(api, { type: "home_inventory/recipes" })) as {
    id: number;
    name: string;
  }[];
  for (const r of list) if (r.name === NAME) await remove(api, "recipe", r.id);
  await api.close();
});

test("recipe steps: edit with a heading, numbered list, cook mode with a timer, print", async ({
  page,
  wsStub,
  printCalls,
}) => {
  // a receipt printer is set up (the print itself is blocked by the fixture)
  wsStub("home_inventory/label_config", {
    printer: false,
    print_on_book_in: false,
    width_mm: 0,
    height_mm: 0,
    receipt: true,
  });
  await openPage(page, "/home_inventory/recipes", "Rezepte");
  await page.getByTestId("recipe-add").click();
  const dialog = page.locator("home-inventory-recipe-dialog dialog");
  await dialog.getByTestId("recipe-name").fill(NAME);
  await dialog.getByTestId("step-add").click();
  await dialog.getByTestId("step-text").last().fill("Nudeln 10 Minuten kochen.");
  await dialog.getByTestId("step-add").click();
  await dialog.getByTestId("step-text").last().fill("Zwiebeln schälen.");
  // the second step goes first, then a heading above the pasta
  await dialog.getByTestId("step-up").nth(1).click();
  await dialog.getByTestId("step-head-add").click();
  await dialog.getByTestId("step-head").fill("Nudeln");
  await dialog.getByTestId("step-up").nth(2).click();
  await expect(dialog.getByTestId("step-text").first()).toHaveValue("Zwiebeln schälen.");
  await dialog.getByTestId("recipe-save").click();

  const row = page.getByTestId("recipe-row").filter({ hasText: NAME });
  await row.getByTestId("recipe-toggle").click();
  await expect(row.getByTestId("recipe-step")).toHaveText([
    "Zwiebeln schälen.",
    "Nudeln 10 Minuten kochen.",
  ]);
  await expect(row.locator("h4.section")).toHaveText("Nudeln");
  await expect(row.locator("ol.steps").nth(1)).toHaveAttribute("start", "2");

  await row.getByTestId("recipe-cook").click();
  const cook = page.locator("home-inventory-cook-mode dialog").first(); // the cooked dialog inside has its own
  await cook.getByTestId("cook-step").first().click();
  await expect(cook.getByTestId("cook-step").first()).toHaveAttribute("aria-pressed", "true");
  await cook.getByTestId("cook-timer-start").click();
  await expect(cook.getByTestId("cook-timer")).toContainText(
    /Schritt 2, 10 Minuten:\s+(09:5\d|10:00)(?![\d:])/,
  );
  // a running timer would be lost: closing asks first
  await cook.getByTestId("cook-close").click();
  await page.getByTestId("confirm-ok").click();
  await expect(cook).toBeHidden();

  await row.getByTestId("recipe-servings").fill("3");
  await row.getByTestId("recipe-servings").press("Tab");
  await row.getByTestId("recipe-print").click();
  await expect(row.getByTestId("recipe-printed")).toHaveText("Rezept gedruckt.");
  expect(printCalls).toContainEqual(
    expect.objectContaining({ type: "home_inventory/print_recipe", servings: 3 }),
  );
});
