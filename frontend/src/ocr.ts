import type { Worker } from "tesseract.js";

/** One tesseract worker (German). Engine and data ship in www/vendor/ (frontend/vendor.ts), never
 *  from tesseract.js' default CDN; the data is cached in the browser after the first run.
 *  The caller terminates it. */
export async function ocrWorker(progress?: (share: number) => void): Promise<Worker> {
  const { createWorker } = await import("tesseract.js");
  const vendor = new URL(/* @vite-ignore */ "vendor/", import.meta.url).href;
  return createWorker("deu", 1, {
    workerPath: `${vendor}tesseract-worker.min.js`,
    corePath: `${vendor}tesseract-core-simd-lstm.wasm.js`,
    langPath: vendor,
    logger: (m) => {
      if (m.status === "recognizing text") progress?.(m.progress);
    },
  });
}

/** Receipt image (data URL) -> text, in the browser: only the text goes to the AI (fewer tokens
 *  than an image). */
export async function ocr(image: string, progress: (share: number) => void): Promise<string> {
  const worker = await ocrWorker(progress);
  try {
    return (await worker.recognize(image)).data.text;
  } finally {
    await worker.terminate();
  }
}
