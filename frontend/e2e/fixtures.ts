import { test as base, type BrowserContext } from "@playwright/test";

// The only module that may import @playwright/test (playwright.config.ts enforces it).
export type { Browser, Page } from "@playwright/test";

// Every print command (labels, shopping list, recipe, meal plan, and any added later).
const isPrint = (type: unknown) =>
  typeof type === "string" && type.startsWith("home_inventory/print_");
const AI_ALWAYS = ["home_inventory/recipe_import", "home_inventory/receipt_read"];
const callsByContext = new WeakMap<BrowserContext, unknown[]>();
const stubsByContext = new WeakMap<BrowserContext, Map<string, unknown>>();

/**
 * E2E tests must never print: the dev HA may have the real label or receipt printer configured.
 * Every print call (`isPrint`: any `home_inventory/print_*` command) is answered here ("0 printed") and never reaches HA, and the
 * options flow (which can print a test label or receipt) is aborted. Installed on every browser context.
 */
export async function blockPrinting(context: BrowserContext) {
  const calls: unknown[] = [];
  callsByContext.set(context, calls);
  // Nor call the real AI (quota, cost): the AI check answers "off" unless a test stubs it.
  const stubs = new Map<string, unknown>([
    ["home_inventory/recipe_ai_check", { status: "off" }],
    ["home_inventory/product_ai_check", { status: "off" }],
  ]);
  stubsByContext.set(context, stubs);
  await context.route("**/api/config/config_entries/options/flow**", (route) =>
    route.request().method() === "POST" ? route.abort() : route.fallback(),
  );
  await context.routeWebSocket(/\/api\/websocket/, (ws) => {
    const server = ws.connectToServer();
    ws.onMessage((raw) => {
      const msg = typeof raw === "string" ? JSON.parse(raw) : undefined;
      if (isPrint(msg?.type)) {
        calls.push(msg);
        return ws.send(
          JSON.stringify({ id: msg.id, type: "result", success: true, result: { printed: 0 } }),
        );
      }
      // The import may hand a page, text or photo to the real AI, the receipt import always hands
      // over the text: only stubbed ones run.
      if (AI_ALWAYS.includes(msg?.type) && !stubs.has(msg.type))
        return ws.send(
          JSON.stringify({
            id: msg.id,
            type: "result",
            success: false,
            error: { code: "e2e_blocked", message: `Stub ${msg.type} (wsStub)` },
          }),
        );
      if (msg && stubs.has(msg.type))
        return ws.send(
          JSON.stringify({
            id: msg.id,
            type: "result",
            success: true,
            result: stubs.get(msg.type),
          }),
        );
      server.send(raw);
    });
    server.onMessage((raw) => ws.send(raw));
  });
}

/** Use this `test` in every spec (not the one from @playwright/test).
 *  `printCalls`: the print requests this test's page made (all blocked). */
export const test = base.extend<
  { printCalls: unknown[]; wsStub: (type: string, result: unknown) => void },
  { browser: import("@playwright/test").Browser }
>({
  // Every context made from the browser (fixtures, `browser.newPage()`, `browser.newContext()`)
  // is print-blocked; Browser.newPage goes through newContext.
  browser: [
    async ({ browser }, use) => {
      const newContext = browser.newContext.bind(browser);
      browser.newContext = async (options) => {
        const context = await newContext(options);
        await blockPrinting(context);
        return context;
      };
      await use(browser);
    },
    { scope: "worker" },
  ],
  wsStub: ({ context }, use) =>
    use((type, result) => stubsByContext.get(context)?.set(type, result)),
  printCalls: [({ context }, use) => use(callsByContext.get(context) ?? []), { auto: true }],
  // HA's own survey toast covers the bottom of a phone screen: close it whenever it shows up.
  page: async ({ page }, use) => {
    await page.addLocatorHandler(
      page.getByRole("button", { name: /An Umfrage teilnehmen|Take the survey/ }),
      () =>
        page
          .getByRole("button", { name: /^(Schließen|Close)$/ })
          .last()
          .click(),
    );
    await use(page);
  },
});
export { expect } from "@playwright/test";
