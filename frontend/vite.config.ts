import { defineConfig } from "vite";

export default defineConfig({
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
