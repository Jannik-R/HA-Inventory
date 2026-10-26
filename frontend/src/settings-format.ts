import { t } from "./i18n";
import { fmtDays } from "./format";
import type { CategoryFlag, Hass, InheritField, MasterData, Source } from "./api";

export function catName(md: MasterData, id: number) {
  return md.categories.find((c) => c.id === id)?.name ?? "";
}

export function sourceLabel(md: MasterData, s: Source) {
  return s === "default"
    ? t("settings.inherit_default")
    : t("settings.inherit_from", { name: catName(md, s as number) });
}

/** Value a category inherits from the (draft) parent, or from the defaults. */
export function inherited(
  md: MasterData,
  field: InheritField | CategoryFlag,
  parentId: number | null,
): { value: number | string | null; source: Source } {
  const p = md.categories.find((c) => c.id === parentId);
  if (!p)
    return {
      value:
        field === "food" ||
        field === "frozen_goods" ||
        field === "emergency_group" ||
        field === "diet" ||
        field === "allergens"
          ? null
          : md.defaults[field],
      source: "default",
    };
  return p[field] != null ? { value: p[field], source: p.id } : p.effective[field];
}

export function fmt(
  md: MasterData,
  hass: Hass | undefined,
  field: InheritField | CategoryFlag,
  v: number | string | null,
): string {
  if (field === "food") return t(v === 0 ? "settings.food.no" : "settings.food.yes"); // null: root = food
  if (field === "frozen_goods")
    return t(v === 1 ? "settings.frozen_goods.yes" : "settings.frozen_goods.no");
  if (field === "emergency_group")
    return t(v == null || v === "none" ? "settings.emergency_group.none" : `emergency.group.${v}`);
  if (v == null) return t("common.none_dash");
  const { units, locations } = md;
  if (field === "unit_id") {
    const u = units.find((x) => x.id === v);
    return u ? u.symbol || u.name : t("common.none_dash");
  }
  if (field === "default_location_id")
    return locations.find((x) => x.id === v)?.name ?? t("common.none_dash");
  if (field === "expiry_type") return t(`settings.expiry.${v}`);
  return fmtDays(hass, v);
}
