import type { Hass } from "./api";

/** BBK food groups of the emergency stock, in display order (backend `inventory.emergency`). */
export const EMERGENCY_GROUPS = [
  "drinks",
  "grains",
  "vegetables",
  "fruit_nuts",
  "dairy",
  "meat_fish_eggs",
  "fats",
] as const;

export interface EmergencyGroup {
  key: (typeof EMERGENCY_GROUPS)[number];
  unit: "kg" | "l";
  /** Target for all persons and days. */
  need: number;
  have: number;
  /** Packages without a known amount (not counted in `have`). */
  unknown: number;
  days: number;
}

export interface Emergency {
  persons: number;
  days: number;
  supply_days: number;
  groups: EmergencyGroup[];
}

export const getEmergency = (hass: Hass) =>
  hass.callWS<Emergency>({ type: "home_inventory/emergency" });
