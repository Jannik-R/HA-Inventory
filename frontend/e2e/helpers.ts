import { expect, type Page } from "@playwright/test";

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
