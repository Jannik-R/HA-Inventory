import { test as base, type BrowserContext } from "@playwright/test";

/**
 * E2E tests must never print: the dev HA may have the real label printer configured.
 * Every `pantry/print_labels` call is answered here ("0 printed") and never reaches HA.
 */
export async function blockPrinting(context: BrowserContext, calls: unknown[] = []) {
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
export const test = base.extend<{ printCalls: unknown[] }>({
  printCalls: [
    async ({ context }, use) => {
      const calls: unknown[] = [];
      await blockPrinting(context, calls);
      await use(calls);
    },
    { auto: true },
  ],
});
export { expect } from "@playwright/test";
