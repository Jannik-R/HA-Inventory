import { readdirSync, readFileSync } from "node:fs";
import { defineConfig, devices } from "@playwright/test";

// Every e2e file must use `test` from e2e/fixtures.ts: it blocks label printing (the dev HA may have the
// real printer configured). Refuse to run when one (but fixtures.ts) mentions @playwright/test directly.
const unguarded = readdirSync("e2e").filter(
  (f) =>
    f.endsWith(".ts") &&
    f !== "fixtures.ts" &&
    /["'`]@playwright\/test["'`]/.test(readFileSync(`e2e/${f}`, "utf8")),
);
if (unguarded.length)
  throw new Error(
    `Import test from ./fixtures (blocks printing), not @playwright/test: ${unguarded}`,
  );

// Local only (see docs/PLAN.md 5a): runs against the dev HA, which needs no login from localhost.
export default defineConfig({
  testDir: "e2e",
  fullyParallel: false,
  workers: 1, // the specs share one dev DB
  reporter: "list",
  use: {
    ...devices["Pixel 7"],
    baseURL: process.env.HA_URL ?? "http://localhost:8123",
    // Installed Edge/Chrome instead of a downloaded browser; override with PW_CHANNEL.
    channel: process.env.PW_CHANNEL ?? "msedge",
    trace: "retain-on-failure",
    // HA registers a service worker on localhost; its first activation reloads the page mid-test.
    serviceWorkers: "block",
    // A fake camera (test pattern), allowed without asking: the live camera dialog can be tested.
    launchOptions: {
      args: ["--use-fake-device-for-media-stream", "--use-fake-ui-for-media-stream"],
    },
  },
  projects: [
    { name: "setup", testMatch: /auth\.setup\.ts/ },
    { name: "e2e", dependencies: ["setup"], use: { storageState: "e2e/.auth/state.json" } },
  ],
});
