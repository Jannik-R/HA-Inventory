import { defineConfig, devices } from "@playwright/test";

// Local only (see docs/PLAN.md 5a): runs against the dev HA, which needs no login from localhost.
export default defineConfig({
  testDir: "e2e",
  fullyParallel: false,
  reporter: "list",
  use: {
    ...devices["Pixel 7"],
    baseURL: process.env.HA_URL ?? "http://localhost:8123",
    // Installed Edge/Chrome instead of a downloaded browser; override with PW_CHANNEL.
    channel: process.env.PW_CHANNEL ?? "msedge",
    trace: "retain-on-failure",
  },
  projects: [
    { name: "setup", testMatch: /auth\.setup\.ts/ },
    { name: "e2e", dependencies: ["setup"], use: { storageState: "e2e/.auth/state.json" } },
  ],
});
