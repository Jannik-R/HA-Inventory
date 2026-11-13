const KEY =
  /(?:mhd|haltbar|verbrauchen|best\s*before|use\s*by|exp(?:iry|ires?)?|bbe)\b[^\d]{0,15}$/i;
const ENDE = /\bende\b[^\d]{0,15}$/i; // "Ende 03/26" only makes sense for a month
const SEP = String.raw`[ \t]*[.\/-][ \t]*`;
const FULL = new RegExp(String.raw`(?<!\d)(\d{1,2})${SEP}(\d{1,2})${SEP}(\d{4}|\d{2})(?!\d)`, "g");
const MONTH = new RegExp(
  String.raw`(?<![\d.\/-])(\d{1,2})[ \t]*([.\/-])[ \t]*(\d{4}|\d{2})(?!\d|${SEP}\d)`,
  "g",
);

/** ISO date for d.m.y (month-only: d = 0 -> last day), null when it is no real date. */
function iso(d: number, m: number, y: number): string | null {
  if (y < 100) y += 2000;
  const now = new Date();
  if (y < 2000 || y > now.getFullYear() + 15 || m < 1 || m > 12) return null;
  const last = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const day = d || last;
  if (day > last) return null;
  const date = `${y}-${String(m).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  // more than a year back: a lot or production code, not a best-before date
  now.setFullYear(now.getFullYear() - 1);
  return date < now.toISOString().slice(0, 10) ? null : date;
}

/** Best-before date from OCR text, or null. A date right after a keyword (MHD, "mind. haltbar bis",
 *  EXP ...) wins, else the latest one. Month-only dates mean the last day of the month. */
export function parseExpiry(text: string): string | null {
  // O for 0 only next to a digit (typical OCR slip)
  const orig = text.replace(/(?<=\d)[Oo]|[Oo](?=\d)/g, "0");
  let s = orig;
  const found: { date: string; key: boolean }[] = [];
  const take = (re: RegExp, get: (m: string[], key: boolean) => string | null, month: boolean) => {
    s = s.replace(re, (...a) => {
      const m = a.slice(0, -2) as string[];
      const at = a[a.length - 2] as number;
      const before = orig.slice(Math.max(0, at - 30), at); // the original: blanked dates are no keywords
      const key = KEY.test(before);
      const date = get(m, key || (month && ENDE.test(before)));
      if (date) found.push({ date, key: key || (month && ENDE.test(before)) });
      return " ".repeat(m[0].length); // do not read the same digits again
    });
  };
  take(FULL, (m) => iso(+m[1], +m[2], +m[3]), false);
  // prices look like MM.YY: a two-digit year needs "/" or a keyword before it
  take(
    MONTH,
    (m, key) => (m[3].length === 4 || m[2] === "/" || key ? iso(0, +m[1], +m[3]) : null),
    true,
  );
  const keyed = found.filter((f) => f.key);
  const pool = keyed.length ? keyed : found;
  return (
    pool
      .map((f) => f.date)
      .sort()
      .at(-1) ?? null
  );
}
