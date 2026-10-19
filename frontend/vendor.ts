import { readFileSync } from "node:fs";
import type { Plugin } from "vite";

/**
 * Files the panel loads at runtime (receipt scan), shipped with the integration instead of fetched
 * from a CDN: www/vendor/<name> <- node_modules path. Copied as they are; lib mode would inline them
 * as base64. Fixed names are fine: HA serves www/ without long cache headers.
 */
export const VENDOR: Record<string, string> = {
  "opencv.js": "@techstark/opencv-js/dist/opencv.js",
  "tesseract-worker.min.js": "tesseract.js/dist/worker.min.js",
  "tesseract-worker.min.js.LICENSE.txt": "tesseract.js/dist/worker.min.js.LICENSE.txt",
  // shortcut: only the SIMD build (every current browser); add the plain one if an old browser needs it
  "tesseract-core-simd-lstm.wasm.js": "tesseract.js-core/tesseract-core-simd-lstm.wasm.js",
  "deu.traineddata.gz": "@tesseract.js-data/deu/4.0.0_best_int/deu.traineddata.gz",
};

/** npm package name of a VENDOR path (handles @scope/name). */
export const packageOf = (path: string): string =>
  path
    .split("/")
    .slice(0, path.startsWith("@") ? 2 : 1)
    .join("/");

export const vendorFiles = (): Plugin => ({
  name: "vendor-files",
  apply: "build",
  generateBundle() {
    for (const [name, path] of Object.entries(VENDOR)) {
      this.emitFile({
        type: "asset",
        fileName: `vendor/${name}`,
        source: readFileSync(new URL(`node_modules/${path}`, import.meta.url)),
      });
    }
  },
});
