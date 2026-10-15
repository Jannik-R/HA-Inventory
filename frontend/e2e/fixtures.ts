import { test as base, type BrowserContext } from "@playwright/test";

// The only module that may import @playwright/test (playwright.config.ts enforces it).
export type { Browser, Page } from "@playwright/test";

const callsByContext = new WeakMap<BrowserContext, unknown[]>();

/**
 * E2E tests must never print: the dev HA may have the real label printer configured.
 * Every `pantry/print_labels` call is answered here ("0 printed") and never reaches HA, and the
 * options flow (which can print a test label) is aborted. Installed on every browser context.
 */
export async function blockPrinting(context: BrowserContext) {
  const calls: unknown[] = [];
  callsByContext.set(context, calls);
  await context.route("**/api/config/config_entries/options/flow**", (route) =>
    route.request().method() === "POST" ? route.abort() : route.fallback(),
  );
  await context.routeWebSocket(/\/api\/websocket/, (ws) => {
    const server = ws.connectToServer();
    ws.onMessage((raw) => {
      const msg = typeof raw === "string" ? JSON.parse(raw) : undefined;
      if (msg?.type === "pantry/print_labels") {
        calls.push(msg);
        return ws.send(
          JSON.stringify({ id: msg.id, type: "result", success: true, result: { printed: 0 } }),
        );
      }
      server.send(raw);
    });
    server.onMessage((raw) => ws.send(raw));
  });
}

/** Use this `test` in every spec (not the one from @playwright/test).
 *  `printCalls`: the print requests this test's page made (all blocked). */
export const test = base.extend<
  { printCalls: unknown[] },
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
  printCalls: [({ context }, use) => use(callsByContext.get(context) ?? []), { auto: true }],
});
export { expect } from "@playwright/test";
