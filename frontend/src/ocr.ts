/** Receipt image (data URL) -> text, in the browser: only the text goes to the AI (fewer tokens
 *  than an image). tesseract.js loads its worker, engine and German data from the jsDelivr CDN on
 *  first use (a separate chunk; the data is cached in the browser afterwards). */
export async function ocr(image: string, progress: (share: number) => void): Promise<string> {
  const { createWorker } = await import("tesseract.js");
  const worker = await createWorker("deu", 1, {
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
