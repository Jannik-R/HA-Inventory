// Check UI strings: every key used in src/ exists in src/i18n/de.json, every key there is used, and
// src/i18n/en.json has exactly the same keys with the same {placeholders}.
// Used = a t("key") call, any other string literal equal to a key (maps like ADD, FIELDS), or a
// template `prefix.${x}` (anywhere, e.g. inside a ternary) which covers all keys starting with it.
// Exit code 1 lists the problems. Run: npm run i18n:check
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const read = (lang) => JSON.parse(readFileSync(join(root, `src/i18n/${lang}.json`), "utf8"));
const de = read("de");
const en = read("en");
const keys = Object.keys(de);
const holes = (s) =>
  [...s.matchAll(/\{(\w+)\}/g)]
    .map((m) => m[1])
    .sort()
    .join();
const english = [
  ...keys.filter((k) => !(k in en)).map((k) => `missing in en.json: ${k}`),
  ...Object.keys(en)
    .filter((k) => !(k in de))
    .map((k) => `only in en.json: ${k}`),
  ...keys
    .filter((k) => k in en && holes(de[k]) !== holes(en[k]))
    .map((k) => `other {placeholders} in en.json: ${k}`),
];
const names = readdirSync(join(root, "src"), { recursive: true }).filter((f) => f.endsWith(".ts"));
const files = names.map((f) => readFileSync(join(root, "src", f), "utf8"));
const code = files.join("\n");

// Hardcoded German UI text: umlauts outside comments (blanked so line numbers stay).
// shortcut: German without umlauts slips through; add a word list or lint rule if that bites.
const german = names.flatMap((f, i) =>
  files[i]
    .replace(/\/\*[\s\S]*?\*\//g, (c) => c.replace(/[^\n]/g, ""))
    .replace(/\/\/.*$/gm, "")
    .split("\n")
    .flatMap((line, n) => (/[äöüÄÖÜß]/.test(line) ? [`src/${f}:${n + 1}`] : [])),
);

const called = [...code.matchAll(/\bt\(\s*"([^"]+)"/g)].map((m) => m[1]);
const literals = new Set([...code.matchAll(/"([a-z_]+(?:\.[a-z_]+)+)"/g)].map((m) => m[1]));
const groups = new Set(keys.map((k) => k.split(".")[0]));
const prefixes = [...code.matchAll(/`([a-z_]+\.[a-z_.]*)\$\{/g)]
  .map((m) => m[1])
  .filter((p) => groups.has(p.split(".")[0])); // skip other templates, e.g. backend "component.*"

const missing = [
  ...called.filter((k) => !keys.includes(k)),
  ...prefixes.filter((p) => !keys.some((k) => k.startsWith(p))).map((p) => `${p}*`),
];
const unused = keys.filter((k) => !literals.has(k) && !prefixes.some((p) => k.startsWith(p)));

for (const k of new Set(missing)) console.error(`missing in de.json: ${k}`);
for (const k of unused) console.error(`unused in de.json:  ${k}`);
for (const g of german) console.error(`hardcoded German text (use t()): ${g}`);
for (const e of english) console.error(e);
if (missing.length || unused.length || german.length || english.length) process.exit(1);
console.log(`i18n ok: ${keys.length} keys`);
