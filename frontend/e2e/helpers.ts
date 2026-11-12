import { expect, type Browser, type Page } from "./fixtures";

/** Click a panel tab and wait until the panel shows it (the route update is async). */
export async function openTab(page: Page, name: string) {
  const tab = page.getByRole("tab", { name });
  await tab.click();
  await expect(tab).toHaveAttribute("aria-selected", "true");
}

/** Open a panel path and wait until its tab is active. */
export async function openPage(page: Page, path: string, tab: string) {
  await page.goto(path);
  await expect(page.getByRole("tab", { name: tab, exact: true })).toHaveAttribute(
    "aria-selected",
    "true",
  );
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
  await page.goto("/home_inventory/stock"); // any language: only the connection matters here
  await page.waitForFunction(
    () => (document.querySelector("home-assistant") as unknown as { hass?: unknown })?.hass,
  );
  return page;
}

/** Create a master data row (category, location); returns its id. */
export async function save(page: Page, table: string, data: object) {
  return ((await ws(page, { type: "home_inventory/save", table, data })) as { id: number }).id;
}

/** Delete a master data row with everything that uses it (cleanup; ignores rows already gone). */
export const remove = (page: Page, table: string, row_id: number) =>
  ws(page, { type: "home_inventory/delete", table, row_id, force: true }).catch(() => undefined);

/** Delete everything the specs create ("E2E " prefix), e.g. left over after a failed run. */
export async function cleanupE2E(page: Page) {
  const del = (table: string, row_id: number) =>
    ws(page, { type: "home_inventory/delete", table, row_id, force: true }).catch(() => undefined);
  const products = (await ws(page, { type: "home_inventory/search", query: "E2E " })) as {
    id: number;
    name: string;
  }[];
  for (const p of products) if (p.name.startsWith("E2E ")) await del("product", p.id);
  const recipes = (await ws(page, { type: "home_inventory/recipes" })) as {
    id: number;
    name: string;
  }[];
  for (const r of recipes) if (r.name.startsWith("E2E ")) await del("recipe", r.id);
  const md = (await ws(page, { type: "home_inventory/master_data" })) as Record<
    string,
    { id: number; name: string }[]
  >;
  // Deleting a parent category takes its children along (later deletes fail quietly).
  for (const table of ["category", "location"])
    for (const r of md[`${table === "category" ? "categories" : "locations"}`])
      if (r.name.startsWith("E2E ")) await del(table, r.id);
}

/** Panel config as the integration options would set it (modules, Open Food Facts lookup). */
export async function panelConfig(page: Page, config: Record<string, unknown>) {
  await page.evaluate((cfg) => {
    const walk = (root: ParentNode): (Element & { panel?: { config?: object } }) | undefined => {
      for (const el of root.querySelectorAll("*")) {
        if (el.tagName === "HOME-INVENTORY-PANEL") return el;
        const found = el.shadowRoot && walk(el.shadowRoot);
        if (found) return found;
      }
    };
    const el = walk(document)!;
    const old = (el.panel?.config ?? {}) as { external?: object };
    const external = { ...old.external, ...(cfg as { external?: object }).external };
    el.panel = { ...el.panel, config: { ...old, ...cfg, external } };
  }, config);
}
