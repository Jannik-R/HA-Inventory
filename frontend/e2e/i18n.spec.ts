import { openPage } from "./helpers";
import { expect, test } from "./fixtures";

// The panel follows the HA user's language: German and English, anything else falls back to English.
test("the panel speaks English for an English user", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("selectedLanguage", '"en"'));
  await openPage(page, "/home_inventory/stock", "Stock");
  await expect(page.getByRole("tab", { name: "Expiry" })).toBeVisible();
  await expect(page.getByTestId("mode-in")).toHaveAttribute("aria-label", "Book in");
  await expect(page.getByTestId("code-input")).toHaveAttribute("placeholder", /EAN or name/);
});
