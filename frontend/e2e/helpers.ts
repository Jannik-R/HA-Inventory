import { expect, type Browser, type Page } from "@playwright/test";

/** Click a panel tab and wait until the panel shows it (the route update is async). */
export async function openTab(page: Page, name: string) {
  const tab = page.getByRole("tab", { name });
  await tab.click();
  await expect(tab).toHaveAttribute("aria-selected", "true");
}

/** Open a panel path and wait until its tab is active. */
export async function openPage(page: Page, path: string, tab: string) {
  await page.goto(path);
  await expect(page.getByRole("tab", { name: tab })).toHaveAttribute("aria-selected", "true");
}

/** Websocket call through the logged-in HA frontend (test data setup and cleanup). */
export const ws = (page: Page, msg: Record<string, unknown>) =>
  page.evaluate(
    (m) =>
      (
        document.querySelector("home-assistant") as unknown as {
          hass: { callWS: (m: unknown) => Promise<unknown> };
        }
      ).hass.callWS(m),
    msg,
  );

/** A fresh page with HA's connection ready, for `ws` calls in beforeAll/afterAll. */
export async function apiPage(browser: Browser) {
  const page = await browser.newPage();
  await openPage(page, "/pantry/stock", "Bestand");
  await page.waitForFunction(
    () => (document.querySelector("home-assistant") as unknown as { hass?: unknown })?.hass,
  );
  return page;
}
