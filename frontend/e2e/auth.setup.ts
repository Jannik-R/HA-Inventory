import { expect, test as setup } from "@playwright/test";

export const STATE = "e2e/.auth/state.json";

// Log in once (trusted_networks: no password) and keep HA's stored tokens, so tests start
// without the authorize redirect and reload that otherwise race with the first interactions.
setup("login", async ({ page }) => {
  await page.goto("/pantry/stock");
  await page.waitForURL((u) => u.pathname === "/pantry/stock" && !u.search);
  await expect(page.getByRole("tab", { name: "Bestand" })).toHaveAttribute("aria-selected", "true");
  await page.context().storageState({ path: STATE });
});
