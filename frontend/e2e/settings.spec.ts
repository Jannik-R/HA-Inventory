import { apiPage, openPage, remove, save } from "./helpers";
import { expect, test } from "./fixtures";

// Own rows, so the tests do not depend on the seed data (the defaults test uses the seed on purpose).
const STAMP = Date.now();
const MAIN_NAME = `E2E Haupt ${STAMP}`;
const SUB_NAME = `E2E Unter ${STAMP}`;
const OTHER = `E2E Andere ${STAMP}`;
const FRIDGE = `E2E Kuehl ${STAMP}`;
const FREEZER = `E2E Frost ${STAMP}`;
const ids: { table: string; id: number }[] = [];

test.beforeAll(async ({ browser }) => {
  const page = await apiPage(browser);
  const main = await save(page, "category", { name: MAIN_NAME });
  ids.push({ table: "category", id: main });
  ids.push({
    table: "category",
    id: await save(page, "category", { name: SUB_NAME, parent_id: main }),
  });
  ids.push({ table: "category", id: await save(page, "category", { name: OTHER }) });
  for (const name of [FRIDGE, FREEZER])
    ids.push({ table: "location", id: await save(page, "location", { name }) });
  await page.close();
});

test.afterAll(async ({ browser }) => {
  const page = await apiPage(browser);
  for (const { table, id } of ids) await remove(page, table, id);
  await page.close();
});

test("parent category is picked in a tree without the own subtree", async ({ page }) => {
  await openPage(page, "/pantry/settings/categories", "Einstellungen");
  const main = page.locator("pantry-settings li").filter({ hasText: MAIN_NAME });
  // Clicking a main category opens it; editing has its own button.
  await main.locator("button.row").click();
  await expect(
    page
      .locator("pantry-settings li button.row")
      .filter({ hasText: new RegExp("^\\s*" + SUB_NAME) }),
  ).toBeVisible();
  // Plus icon: new subcategory with this parent; dialogs only have save and cancel.
  await main.getByTestId("category-add").click();
  await expect(
    page.locator("pantry-settings dialog pantry-category-picker").getByTestId("category"),
  ).toContainText(MAIN_NAME);
  await expect(
    page.locator("pantry-settings dialog").getByRole("button", { name: "Löschen" }),
  ).toHaveCount(0);
  await page.keyboard.press("Escape");
  await main.getByTestId("category-edit").click();
  await page.getByTestId("category").click();
  const current = page.locator("[data-testid=category-option][aria-current=true]");
  await expect(current).toHaveText("– keine (Hauptkategorie) –");
  await expect(page.getByTestId("category-option").filter({ hasText: MAIN_NAME })).toHaveCount(0);
  await page.getByTestId("category-option").filter({ hasText: OTHER }).click();
  await expect(current).toHaveText(OTHER);
  // Escape closes only the picker; the edit dialog keeps its unchanged value.
  await page.keyboard.press("Escape");
  await expect(page.getByTestId("category")).toContainText("keine");
  await page.keyboard.press("Escape");
});

test("locations: row actions and live validation", async ({ page }) => {
  await openPage(page, "/pantry/settings/locations", "Einstellungen");
  const fridge = page.locator("pantry-settings li").filter({ hasText: FRIDGE });
  await expect(fridge.getByTestId("location-delete")).toBeVisible();
  await fridge.getByTestId("location-edit").click();
  const name = page.locator("pantry-settings dialog input").first();
  await name.fill("");
  await expect(page.getByTestId("name-error")).toHaveText("Pflichtfeld.");
  await expect(page.getByTestId("save")).toBeDisabled();
  await name.fill(FREEZER.toLowerCase()); // other location, any case
  await expect(page.getByTestId("name-error")).toContainText("vergeben");
  await name.fill(FRIDGE);
  await expect(page.getByTestId("save")).toBeEnabled();
  // Unsaved changes: Esc asks first; "keep editing" leaves the dialog open, "discard" closes it.
  await name.fill(`${FRIDGE} 2`);
  // Esc, Esc (keep editing), Esc: the dialog must still be open behind the second question
  // (browsers ignore preventDefault on a repeated cancel event without a click in between).
  const question = page.locator("pantry-confirm h2");
  await page.keyboard.press("Escape");
  await expect(question).toHaveText("Änderungen verwerfen?");
  await page.keyboard.press("Escape");
  await expect(question).toHaveCount(0);
  await expect(page.getByTestId("save")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(question).toHaveText("Änderungen verwerfen?");
  await expect(page.getByTestId("save")).toBeVisible();
  await page.getByTestId("confirm-cancel").click();
  await expect(question).toHaveCount(0);
  await expect(page.getByTestId("save")).toBeVisible();
  await page.keyboard.press("Escape");
  await page.getByTestId("confirm-ok").click(); // never saved
  await expect(page.getByTestId("save")).toHaveCount(0);
});

test("defaults: edit the warning days and restore them", async ({ page }) => {
  await openPage(page, "/pantry/settings/defaults", "Einstellungen");
  const warn = page.getByTestId("default-row").filter({ hasText: "Warnung vor Ablauf" });
  const before = (await warn.locator(".detail").textContent())!.trim();
  await page.getByTestId("default-edit").first().click();
  const input = page.getByTestId("default-warn_days");
  const old = await input.inputValue();
  await input.fill("-1");
  await expect(page.getByTestId("default-warn_days-error")).toBeVisible();
  await expect(page.getByTestId("save")).toBeDisabled();
  await input.fill("23");
  await page.getByTestId("save").click();
  await expect(warn).toContainText("23 Tage");
  // Restore, so other tests and the dev data keep their defaults.
  await page.getByTestId("default-edit").first().click();
  await input.fill(old);
  await page.getByTestId("save").click();
  await expect(warn).toContainText(before);
});
