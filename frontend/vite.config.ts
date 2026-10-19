import { defineConfig } from "vite";
import { thirdPartyLicenses } from "./licenses";

export default defineConfig({
  plugins: [thirdPartyLicenses()],
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
