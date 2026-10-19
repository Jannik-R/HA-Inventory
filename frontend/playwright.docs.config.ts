import { defineConfig } from "@playwright/test";
import base from "./playwright.config";

// Guide screenshots (docs/images), on demand only: `npm run docs:screenshots`. The normal e2e run
// never picks up *.docs.ts (Playwright's default testMatch only matches *.spec.ts / *.test.ts).
export default defineConfig({
  ...base,
  workers: 1, // the demo data is created once per worker
  projects: [
    base.projects![0], // setup (login)
    {
      name: "docs",
      testMatch: /\.docs\.ts$/,
      dependencies: ["setup"],
      use: {
        storageState: "e2e/.auth/state.json",
        viewport: { width: 375, height: 812 },
        deviceScaleFactor: 2,
      },
    },
  ],
});
