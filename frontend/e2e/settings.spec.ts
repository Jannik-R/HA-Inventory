import { openPage } from "./helpers";
import { expect, test } from "@playwright/test";

test("parent category is picked in a tree without the own subtree", async ({ page }) => {
  await openPage(page, "/pantry/settings/categories", "Einstellungen");
  const main = page.locator("pantry-settings li").filter({ hasText: "Nudeln, Reis & Getreide" });
  // Clicking a main category opens it; editing has its own button.
  await main.locator("button.row").click();
  await expect(page.locator("pantry-settings li button.row").filter({ hasText: /^\s*Couscous/ })).toBeVisible();
  // Plus icon: new subcategory with this parent; dialogs only have save and cancel.
  await main.getByTestId("category-add").click();
  await expect(page.locator("pantry-settings dialog pantry-category-picker").getByTestId("category")).toContainText(
    "Nudeln, Reis & Getreide",
  );
  await expect(page.locator("pantry-settings dialog").getByRole("button", { name: "Löschen" })).toHaveCount(0);
  await page.keyboard.press("Escape");
  await main.getByTestId("category-edit").click();
  await page.getByTestId("category").click();
  const current = page.locator("[data-testid=category-option][aria-current=true]");
  await expect(current).toHaveText("– keine (Hauptkategorie) –");
  await expect(page.getByTestId("category-option").filter({ hasText: "Nudeln, Reis & Getreide" })).toHaveCount(0);
  await page.getByTestId("category-option").filter({ hasText: "Backen" }).click();
  await expect(current).toHaveText("Backen");
  // Escape closes only the picker; the edit dialog keeps its unchanged value.
  await page.keyboard.press("Escape");
  await expect(page.getByTestId("category")).toContainText("keine");
  await page.keyboard.press("Escape");
});

test("locations: row actions and live validation", async ({ page }) => {
  await openPage(page, "/pantry/settings/locations", "Einstellungen");
  const fridge = page.locator("pantry-settings li").filter({ hasText: "Kühlschrank" });
  await expect(fridge.getByTestId("location-delete")).toBeVisible();
  await fridge.getByTestId("location-edit").click();
  const name = page.locator("pantry-settings dialog input").first();
  await name.fill("");
  await expect(page.getByTestId("name-error")).toHaveText("Pflichtfeld.");
  await expect(page.getByTestId("save")).toBeDisabled();
  await name.fill("gefrierschrank"); // other location, any case
  await expect(page.getByTestId("name-error")).toContainText("vergeben");
  await name.fill("Kühlschrank");
  await expect(page.getByTestId("save")).toBeEnabled();
  // Unsaved changes: Esc asks first; "keep editing" leaves the dialog open, "discard" closes it.
  await name.fill("Kühlschrank 2");
  page.once("dialog", (d) => d.dismiss());
  await page.keyboard.press("Escape");
  await expect(page.getByTestId("save")).toBeVisible();
  page.once("dialog", (d) => d.accept());
  await page.keyboard.press("Escape"); // never saved
  await expect(page.getByTestId("save")).toHaveCount(0);
});
