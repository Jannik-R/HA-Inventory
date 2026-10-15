import { t } from "./i18n";
import type { Hass } from "./api";

/** Locale for Intl: the user's HA number/date locale, else the UI language. */
export const lang = (hass?: Hass) => hass?.locale?.language ?? hass?.language;

/** "15.10.2026" style date for an ISO date (local, no time zone shift). */
export const fmtDate = (hass: Hass | undefined, iso: string) =>
  new Intl.DateTimeFormat(lang(hass), { dateStyle: "medium" }).format(new Date(`${iso}T00:00`));

export const fmtNumber = (hass: Hass | undefined, n: number) =>
  new Intl.NumberFormat(lang(hass)).format(n);

/** "1 Tag" / "3 Tage". */
export const fmtDays = (hass: Hass | undefined, v: number | string) =>
  t(
    new Intl.PluralRules(lang(hass)).select(Number(v)) === "one" ? "settings.day" : "settings.days",
    { n: v },
  );
