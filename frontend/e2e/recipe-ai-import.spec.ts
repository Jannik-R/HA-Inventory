import { openPage } from "./helpers";
import { expect, test } from "./fixtures";

// Any image will do (the AI is stubbed); the dialog scales it to a JPEG data URL before sending.
const PHOTO = "../docs/images/canning-dark.png";

const draft = (name: string) => ({
  name,
  servings: 2,
  steps: [{ section: null, text: "Kochen." }],
  source_url: null,
  image_url: null,
  ingredients: [],
});

test("a recipe is imported from pasted text or a photo (AI stubbed)", async ({ page, wsStub }) => {
  await openPage(page, "/home_inventory/recipes", "Rezepte");
  await page.getByTestId("recipe-import").click();
  const imp = page.locator("home-inventory-recipe-import dialog");
  test.skip(
    !(await imp.getByTestId("recipe-import-source-text").isVisible()),
    "no AI in the dev HA",
  );
  await expect(imp.getByTestId("recipe-import-url")).toBeFocused();

  await imp.getByTestId("recipe-import-source-text").click();
  await expect(imp.getByTestId("recipe-import-submit")).toBeDisabled();
  await imp.getByTestId("recipe-import-text").fill("Nudeln kochen, 200 g Spaghetti");
  wsStub("home_inventory/recipe_import", draft("E2E Text-Import"));
  await imp.getByTestId("recipe-import-submit").click();
  const dialog = page.locator("home-inventory-recipe-dialog dialog");
  await expect(dialog.getByTestId("recipe-name")).toHaveValue("E2E Text-Import");
  await dialog.getByRole("button", { name: "Abbrechen" }).click();

  await page.getByTestId("recipe-import").click();
  await imp.getByTestId("recipe-import-source-photo").click();
  const file = imp.getByTestId("recipe-import-photo");
  await expect(imp.getByTestId("recipe-import-submit")).toBeDisabled();
  await file.setInputFiles(PHOTO);
  await expect(imp.getByTestId("recipe-import-submit")).toBeEnabled();
  wsStub("home_inventory/recipe_import", draft("E2E Foto-Import"));
  await imp.getByTestId("recipe-import-submit").click();
  await expect(dialog.getByTestId("recipe-name")).toHaveValue("E2E Foto-Import");
});
