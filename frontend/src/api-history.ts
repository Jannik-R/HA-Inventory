import type { Hass } from "./api";

export interface HistoryRow {
  id: number;
  kind: string;
  /** Signed for `correct`, else positive. */
  packages: number;
  product_id: number;
  name: string;
  location: string | null;
  to_location: string | null;
  undone_at: string | null;
}

/** Everything one write call booked; undone together. */
export interface HistoryAction {
  action_id: number;
  ts: string;
  user_id: string | null;
  source: string;
  /** The first rows only; the rest is counted in `more_rows` (undo takes all). */
  rows: HistoryRow[];
  more_rows: number;
  /** Set when every row is undone. */
  undone_at: string | null;
  undone_by: string | null;
  /** Some, not all rows undone. */
  partly: boolean;
}

export interface History {
  actions: HistoryAction[];
  more: boolean;
  users: { id: string; name: string }[];
}

export interface HistoryFilter {
  name?: string;
  user_id?: string;
  date_from?: string;
  date_to?: string;
  offset: number;
}

export const getHistory = (hass: Hass, f: HistoryFilter) =>
  hass.callWS<History>({
    type: "home_inventory/history",
    ...Object.fromEntries(Object.entries(f).filter(([, v]) => v !== "" && v !== undefined)),
  });

export const historyUndo = (hass: Hass, action_id: number) =>
  hass.callWS<unknown>({ type: "home_inventory/history_undo", action_id });
