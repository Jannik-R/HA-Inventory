import de from "./i18n/de.json";

type Strings = Record<string, string>;

// Adding a language: add a JSON file and one line here.
const languages: Record<string, Strings> = { de };

let current: Strings = de;

export function setLanguage(lang: string | undefined): void {
  const l = lang ?? "";
  current = languages[l] ?? languages[l.split("-")[0]] ?? de;
}

export function t(key: string, params?: Record<string, string | number>): string {
  const s = current[key] ?? de[key as keyof typeof de] ?? key;
  return params ? s.replace(/\{(\w+)\}/g, (m, k) => (k in params ? String(params[k]) : m)) : s;
}
