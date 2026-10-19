/** A photo as JPEG data URL, scaled down (phone photos are 3–10 MB; the websocket takes 4 MB).
 *  createImageBitmap applies the EXIF rotation, so text stands upright for the AI and the OCR. */
export const scaledPhoto = async (file: File, maxPx = 2000) => {
  const bmp = await createImageBitmap(file);
  const f = Math.min(1, maxPx / Math.max(bmp.width, bmp.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bmp.width * f);
  canvas.height = Math.round(bmp.height * f);
  canvas.getContext("2d")!.drawImage(bmp, 0, 0, canvas.width, canvas.height);
  bmp.close();
  return canvas.toDataURL("image/jpeg", 0.85);
};
