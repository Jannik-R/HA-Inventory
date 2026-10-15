import { printLabelsWs, type Hass } from "./api";
import { confirmDialog } from "./confirm-dialog";
import { t } from "./i18n";

/** No printer configured: print the label images through the browser, one page per label. */
function printInBrowser(urls: string[], w: number, h: number) {
  const frame = document.createElement("iframe");
  frame.style.cssText = "position:fixed;width:0;height:0;border:0";
  frame.srcdoc =
    `<style>@page{size:${w}mm ${h}mm;margin:0}body{margin:0}` +
    `img{display:block;width:${w}mm;height:${h}mm}img:not(:last-child){break-after:page}</style>` +
    urls.map((u) => `<img src="${u}">`).join("");
  frame.onload = () => {
    const win = frame.contentWindow!;
    win.onafterprint = () => frame.remove();
    win.print();
  };
  document.body.append(frame);
}

/** Print `count` labels of a batch (1..99); more than 2 are confirmed first.
 *  Returns how many the printer printed; 0 when cancelled or the browser print dialog was opened instead. */
export async function printLabels(hass: Hass, batch_id: number, count: number): Promise<number> {
  if (count > 2) {
    const ok = await confirmDialog({
      title: t("label.confirm_many", { n: count }),
      action: t("label.submit"),
    });
    if (!ok) return 0;
  }
  const res = await printLabelsWs(hass, { batch_id, count });
  if ("printed" in res) return res.printed;
  printInBrowser(res.images, res.width_mm, res.height_mm);
  return 0;
}
