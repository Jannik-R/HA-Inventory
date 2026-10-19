import de from "./i18n/de.json";
import en from "./i18n/en.json";

type Strings = Record<string, string>;

// Adding a language: add a JSON file and one line here.
const languages: Record<string, Strings> = { de, en };

let current: Strings = en;

export function setLanguage(lang: string | undefined): void {
  const l = lang ?? "";
  // any other language: English
  current = languages[l] ?? languages[l.split("-")[0]] ?? en;
}

export function t(key: string, params?: Record<string, string | number>): string {
  const s = current[key] ?? en[key as keyof typeof en] ?? key;
  return params ? s.replace(/\{(\w+)\}/g, (m, k) => (k in params ? String(params[k]) : m)) : s;
}
