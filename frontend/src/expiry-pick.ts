/** Date of the live scan: the first one seen twice among the last `keep` readings (null = no date
 *  in that frame; those do not break the streak). */
export function pickDate(readings: (string | null)[], keep = 4): string | null {
  const last = readings.slice(-keep);
  return last.find((d, i) => d && last.indexOf(d) !== i) ?? null;
}
