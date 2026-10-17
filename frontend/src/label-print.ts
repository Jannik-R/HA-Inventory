import { printLabelsWs, type Hass } from "./api";
import { confirmDialog } from "./confirm-dialog";
import { t } from "./i18n";

/** No printer configured: print the label image through the browser, `count` pages. */
function printInBrowser(url: string, count: number, w: number, h: number) {
  const frame = document.createElement("iframe");
  frame.style.cssText = "position:fixed;width:0;height:0;border:0";
  frame.addEventListener(
    "load",
    async () => {
      const doc = frame.contentDocument!;
      const style = doc.createElement("style");
      style.textContent =
        `@page{size:${w}mm ${h}mm;margin:0}body{margin:0}` +
        `img{display:block;width:${w}mm;height:${h}mm}img:not(:last-child){break-after:page}`;
      const imgs = Array.from({ length: count }, () => {
        const img = doc.createElement("img");
        img.src = url;
        return img;
      });
      doc.head.append(style);
      doc.body.append(...imgs);
      await Promise.all(imgs.map((i) => i.decode().catch(() => undefined)));
      const win = frame.contentWindow!;
      win.onafterprint = () => frame.remove();
      win.print();
    },
    { once: true },
  );
  document.body.append(frame);
}

/** Most labels per print (the backend's MAX_LABELS). */
export const MAX_LABELS = 20;

/** Print `count` labels of a batch (1..MAX_LABELS); more than 2 are confirmed first.
 *  Returns how many the printer printed (0 when the browser print dialog was opened instead),
 *  or null when the user cancelled the question. */
export async function printLabels(
  hass: Hass,
  batch_id: number,
  count: number,
): Promise<number | null> {
  if (count > 2) {
    const ok = await confirmDialog({
      title: t("label.confirm_many", { n: count }),
      action: t("label.submit"),
    });
    if (!ok) return null;
  }
  const res = await printLabelsWs(hass, { batch_id, count });
  if ("printed" in res) return res.printed;
  printInBrowser(res.image, res.count, res.width_mm, res.height_mm);
  return 0;
}
