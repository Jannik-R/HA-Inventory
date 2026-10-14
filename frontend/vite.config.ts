import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: { entry: "src/pantry-panel.ts", formats: ["es"], fileName: () => "pantry-panel.js" },
    outDir: "../custom_components/pantry/www",
    emptyOutDir: true,
  },
});
