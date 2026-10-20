import { t } from "./i18n";
import { hasModule } from "./modules";
import { numField } from "./form-fields";
import { fmtNumber } from "./format";
import type { Hass } from "./api";

/** Canning and drying share protocols, charges and process recipes; `kind` tells them apart. */
export type Preserve = "canning" | "drying";

/** UI text of that kind: `canning.<key>` or `drying.<key>` (same placeholders). */
export const pt = (kind: Preserve, key: string, vars?: Record<string, string | number>) =>
  kind === "drying" ? t(`drying.${key}`, vars) : t(`canning.${key}`, vars);

/** The kinds whose module is on (tab *Haltbarmachen* shows when one is). */
export const preserveKinds = (): Preserve[] =>
  (["canning", "drying"] as const).filter((k) => hasModule(k));

/** Duration as text: minutes for canning, hours for drying (stored in minutes either way). */
export const fmtDuration = (hass: Hass | undefined, kind: Preserve, minutes: number) =>
  kind === "drying"
    ? `${fmtNumber(hass, minutes / 60)} ${t("drying.hours_unit")}`
    : `${minutes} ${t("recipes.minutes_unit")}`;

/** Duration input: drying in hours (half steps), canning in minutes; the value stays minutes. */
export const durationField = (o: {
  kind: Preserve;
  testid: string;
  minutes: number | null;
  err?: string;
  onChange: (minutes: number | null) => void;
}) =>
  o.kind === "drying"
    ? numField({
        testid: o.testid,
        label: t("recipes.field.canning_minutes"),
        unit: t("drying.hours_unit"),
        step: "0.5",
        value: o.minutes == null ? null : o.minutes / 60,
        err: o.err && t("valid.drying_hours"),
        onChange: (h) => o.onChange(h == null ? null : Math.round(h * 60)),
      })
    : numField({
        testid: o.testid,
        label: t("recipes.field.canning_minutes"),
        unit: t("recipes.minutes_unit"),
        value: o.minutes,
        err: o.err,
        onChange: o.onChange,
      });
