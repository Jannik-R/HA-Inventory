import { cleanupE2E, ws } from "./helpers";
import { expect, test as setup } from "./fixtures";

export const STATE = "e2e/.auth/state.json";

// Log in once (trusted_networks: no password) and keep HA's stored tokens, so tests start
// without the authorize redirect and reload that otherwise race with the first interactions.
setup("login", async ({ page, request }) => {
  setup.setTimeout(240_000);
  // After an HA restart: wait for the API, then for the home_inventory panel and its websocket API.
  await expect
    .poll(async () => (await request.get("/api/").catch(() => undefined))?.status() ?? 0, {
      timeout: 180_000,
      intervals: [2000],
    })
    .toBeLessThan(500);
  await expect
    .poll(
      async () => {
        try {
          // Short limits per try: a page loaded while HA was still starting never gets ready.
          await page.goto("/home_inventory/stock", { timeout: 15_000 });
          await page.waitForURL((u) => u.pathname === "/home_inventory/stock" && !u.search, {
            timeout: 15_000,
          });
          await page.waitForFunction(
            () => (document.querySelector("home-assistant") as unknown as { hass?: unknown })?.hass,
            undefined,
            { timeout: 15_000 },
          );
          await ws(page, { type: "home_inventory/master_data" });
          return true;
        } catch {
          return false;
        }
      },
      { timeout: 180_000, intervals: [2000] },
    )
    .toBe(true);
  await expect(page.getByRole("tab", { name: "Bestand" })).toHaveAttribute("aria-selected", "true");
  await cleanupE2E(page); // leftovers of failed runs
  await page.context().storageState({ path: STATE });
});
