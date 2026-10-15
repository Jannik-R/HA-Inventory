// Check UI strings: every key used in src/ exists in src/i18n/de.json and every key there is used.
// Used = a t("key") call, any other string literal equal to a key (maps like ADD, FIELDS), or a
// template `prefix.${x}` (anywhere, e.g. inside a ternary) which covers all keys starting with it.
// Exit code 1 lists the problems. Run: npm run i18n:check
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const keys = Object.keys(JSON.parse(readFileSync(join(root, "src/i18n/de.json"), "utf8")));
const files = readdirSync(join(root, "src"), { recursive: true })
  .filter((f) => f.endsWith(".ts"))
  .map((f) => readFileSync(join(root, "src", f), "utf8"));
const code = files.join("\n");

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
if (missing.length || unused.length) process.exit(1);
console.log(`i18n ok: ${keys.length} keys`);
