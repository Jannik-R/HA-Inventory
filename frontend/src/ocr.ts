/** Receipt image (data URL) -> text, in the browser: only the text goes to the AI (fewer tokens
 *  than an image). Worker, engine and German data ship in www/vendor/ (frontend/vendor.ts), never
 *  from tesseract.js' default CDN; the data is cached in the browser after the first run. */
export async function ocr(image: string, progress: (share: number) => void): Promise<string> {
  const { createWorker } = await import("tesseract.js");
  const vendor = new URL(/* @vite-ignore */ "vendor/", import.meta.url).href;
  const worker = await createWorker("deu", 1, {
    workerPath: `${vendor}tesseract-worker.min.js`,
    corePath: `${vendor}tesseract-core-simd-lstm.wasm.js`,
    langPath: vendor,
    logger: (m) => {
      if (m.status === "recognizing text") progress(m.progress);
    },
  });
  try {
    return (await worker.recognize(image)).data.text;
  } finally {
    await worker.terminate();
  }
}
