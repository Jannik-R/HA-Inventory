import { html } from "lit";
import { t } from "./i18n";
import { confirmDelete, confirmDialog } from "./confirm-dialog";
import {
  deleteRow,
  getDeleteImpact,
  type DeleteGroup,
  type DeleteTable,
  type Hass,
  type MasterData,
} from "./api";

/** Names shown per group before "und N weitere". */
const SHOWN = 5;

/** "Produkte werden gelöscht (3)"; unknown kinds (a new table) still show, generically. */
const label = (table: string, g: DeleteGroup) => {
  const n = g.names.length || g.count;
  const kind = table === "location" && g.kind === "delete.stock" ? "location_stock" : g.kind;
  const key = `delete.kind.${kind}`;
  const text = t(key, { n });
  return text === key ? t("delete.kind.other", { table: g.kind.split(".")[1], n }) : text;
};

const names = (g: DeleteGroup) => {
  const more = g.names.length - SHOWN;
  return g.names.slice(0, SHOWN).join(", ") + (more > 0 ? t("delete.more", { n: more }) : "");
};

/**
 * Delete a row (master data or a product). Asks first; the question lists everything the delete
 * would remove or change, from a dry run on the backend (grouped, a few names each, then a
 * count), and deleting takes it along. A location's stock
 * is moved to another location (default) or booked out. Resolves false when cancelled;
 * backend errors (also "cannot be deleted at all") are thrown like any websocket error.
 */
export async function deleteMasterRow(
  hass: Hass,
  md: MasterData,
  table: DeleteTable,
  row: { id: number; name: string },
): Promise<boolean> {
  const hint =
    table === "location" || table === "unit" ? t(`settings.${table}.delete_hint`) : undefined;
  const impact = await getDeleteImpact(hass, table, row.id);
  if (impact.blocked)
    throw {
      translation_domain: "home_inventory",
      translation_key: impact.blocked,
      message: impact.blocked,
    };
  if (!impact.groups.length) {
    if (!(await confirmDelete(row.name, hint))) return false;
    await deleteRow(hass, table, row.id);
    return true;
  }
  const targets = md.locations.filter((l) => l.id !== row.id);
  let moveTo: number | null = table === "location" ? (targets[0]?.id ?? null) : null;
  const body = html`<ul class="impact" data-testid="delete-impact">
      ${impact.groups.map(
        (g) =>
          html`<li>
            <span class="kind">${label(table, g)}</span>
            <span class="names">${names(g)}</span>
            ${g.packages ? html`<span class="names">${t("book.count", { n: g.packages })}</span>` : ""}
          </li>`,
      )}
    </ul>
    ${
      table === "location"
        ? html`<label>
            <span class="lbl">${t("delete.stock")}</span>
            <select
              data-testid="delete-move-to"
              @change=${(e: Event) => {
                const v = (e.target as HTMLSelectElement).value;
                moveTo = v ? Number(v) : null;
              }}
            >
              ${targets.map(
                (l) =>
                  html`<option value=${l.id}>${t("delete.move_to", { name: l.name })}</option>`,
              )}
              <option value="">${t("delete.book_out")}</option>
            </select>
          </label>`
        : ""
    }`;
  const all = impact.groups.some(
    (g) => g.kind.startsWith("delete.") && !(table === "location" && g.kind === "delete.stock"),
  );
  const ok = await confirmDialog({
    title: t("common.delete_name", { name: row.name }) + "?",
    message: hint ?? t("delete.affected"),
    body,
    action: t(all ? "delete.all" : "common.delete"),
    danger: true,
  });
  if (!ok) return false;
  await deleteRow(hass, table, row.id, { force: true, move_to: moveTo });
  return true;
}
