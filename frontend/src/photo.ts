/** A photo in a canvas, scaled down so its longest side is at most `maxPx` (phone photos are
 *  3–10 MB). createImageBitmap applies the EXIF rotation, so text stands upright. */
export async function photoCanvas(source: ImageBitmapSource, maxPx: number) {
  const bmp = await createImageBitmap(source);
  const f = Math.min(1, maxPx / Math.max(bmp.width, bmp.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bmp.width * f);
  canvas.height = Math.round(bmp.height * f);
  canvas.getContext("2d")!.drawImage(bmp, 0, 0, canvas.width, canvas.height);
  bmp.close();
  return canvas;
}

/** The same as JPEG data URL (the websocket takes 4 MB). */
export const scaledPhoto = async (source: ImageBitmapSource, maxPx = 2000) =>
  (await photoCanvas(source, maxPx)).toDataURL("image/jpeg", 0.85);
