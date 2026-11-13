// Unit check of the expiry date parser (node strips the types; runs in CI via `npm run test:unit`).
// Dates lie far ahead: the parser drops dates more than a year in the past.
import assert from "node:assert/strict";
import { parseExpiry } from "../src/expiry-parse.ts";
import { pickDate } from "../src/expiry-pick.ts";

const cases = [
  ["MHD 12.03.2033", "2033-03-12"],
  ["mind. haltbar bis 5.1.33", "2033-01-05"],
  ["EXP 03/2034", "2034-03-31"],
  ["Ende 02/32", "2032-02-29"],
  ["BBE 12-03-33", "2033-03-12"],
  ["12 . 03 . 2033", "2033-03-12"],
  ["MHD 1O.O3.2O33", "2033-03-10"],
  ["Abgefüllt 01.01.2035 MHD 05.06.2033", "2033-06-05"], // keyword beats the latest
  ["01.01.2033 und 05.06.2034", "2034-06-05"], // no keyword: latest
  ["Preis 1.99 EUR MHD 03.2034", "2034-03-31"],
  ["3,49 EUR", null],
  ["12.50", null],
  ["MHD 01.01.2034   12.03.2035", "2034-01-01"], // only the first follows the keyword
  ["Best before 12/2034", "2034-12-31"],
  ["EXP/LOT: 05.06.2034 L123", "2034-06-05"],
  ["Expiry: 05.06.2034", "2034-06-05"],
  ["12.03.19", null], // old: a lot code
  ["12.03\n2034", null], // no merging across lines
  ["12\n03\n2034", null],
  ["31.02.2034", null],
  ["Kein Datum hier 500 g", null],
  // live scan of a dot-matrix print (Teekanne box, blur 2px read; real year 2028 moved ahead)
  ["11.2033\nL13L0 20: 15D CH306848", "2033-11-30"],
];
for (const [text, want] of cases) assert.equal(parseExpiry(text), want, text);
const A = "2033-01-01";
const B = "2033-02-01";
const picks = [
  [[A, null, A], A],
  [[A, B, null, B], B],
  [[A, B, null, null], null],
  [[A, B, B, A], B], // the first to repeat
  [[A, null, null, null, A], null], // the first A is out of the last 4
  [[], null],
];
for (const [readings, want] of picks) assert.equal(pickDate(readings), want, String(readings));
console.log("expiry-parse ok");
