/** Save text as a file (Blob + link; no server round trip for the file). */
const saveFile = (content: string, filename: string, type: string) => {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const a = Object.assign(document.createElement("a"), { href: url, download: filename });
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

export const saveJson = (data: object, filename: string) =>
  saveFile(JSON.stringify(data, null, 2), filename, "application/json");

/** UTF-8 with BOM, so Excel shows umlauts right. */
export const saveCsv = (csv: string, filename: string) =>
  saveFile("﻿" + csv, filename, "text/csv;charset=utf-8");
