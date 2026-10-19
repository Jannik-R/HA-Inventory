import { defineConfig } from "vite";
import { thirdPartyLicenses } from "./licenses";
import { vendorFiles } from "./vendor";

export default defineConfig({
  plugins: [thirdPartyLicenses(), vendorFiles()],
  build: {
    lib: {
      entry: "src/home-inventory-panel.ts",
      formats: ["es"],
      fileName: () => "home-inventory-panel.js",
    },
    outDir: "../custom_components/home_inventory/www",
    emptyOutDir: true,
  },
});
