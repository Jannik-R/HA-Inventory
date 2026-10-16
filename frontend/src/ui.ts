import { html, nothing, svg } from "lit";
import {
  mdiChevronDown,
  mdiChevronRight,
  mdiDeleteOutline,
  mdiPencilOutline,
  mdiPlus,
} from "@mdi/js";
import { t } from "./i18n";
import { confirmDialog } from "./confirm-dialog";

export const icon = (path: string) =>
  html`<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
    ${svg`<path d=${path} fill="currentColor"></path>`}
  </svg>`;

/** Accidental close (backdrop click, Esc) with unsaved changes asks first; "Abbrechen" closes directly. */
let asking = false; // one question at a time (keydown and cancel can both arrive)

async function closeUnlessKept(dlg: HTMLDialogElement, isDirty?: () => boolean) {
  if (!isDirty?.()) return dlg.close();
  if (asking) return;
  asking = true;
  try {
    if (await confirmDialog({ title: t("common.discard"), action: t("common.discard_ok") }))
      dlg.close();
  } finally {
    asking = false;
  }
}

/** Click handler: close the modal dialog on a click on its backdrop (the click targets the dialog). */
export const backdropClick = (isDirty?: () => boolean) => (e: MouseEvent) => {
  const dlg = e.target as HTMLDialogElement;
  if (dlg.tagName !== "DIALOG") return;
  const r = dlg.getBoundingClientRect();
  const outside =
    e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
  if (outside) closeUnlessKept(dlg, isDirty);
};

/**
 * `keydown` + `cancel` handler (Esc): with unsaved changes, keep the dialog open and ask first.
 * Esc is caught on keydown: browsers ignore preventDefault() on a repeated `cancel` without a
 * click in between (close watcher rule), which closed the dialog behind the question.
 */
export const escGuard = (isDirty: () => boolean) => (e: Event) => {
  if (e instanceof KeyboardEvent && e.key !== "Escape") return;
  // A `cancel` that cannot be stopped closes anyway: do not ask in vain.
  if (!isDirty() || !e.cancelable) return;
  e.preventDefault();
  closeUnlessKept(e.currentTarget as HTMLDialogElement, isDirty);
};

/**
 * Edit/add dialog that follows the dialog rules in CLAUDE.md: title, fields, backend error,
 * "Abbrechen" (closes without asking) and the primary "Speichern"; backdrop/Esc ask when dirty.
 */
export const editDialog = (o: {
  title: string;
  body: unknown;
  error?: string;
  invalid: boolean;
  /** Primary button text and testid (default: "Speichern"). */
  submit?: { label: string; testid: string };
  dirty: () => boolean;
  onSubmit: (e: Event) => void;
  onClosed: () => void;
}) =>
  html`<dialog
    @close=${(e: Event) => {
      // A reopened dialog starts untouched again (see data-touched in formStyles).
      for (const el of (e.target as Element).querySelectorAll("[data-touched]"))
        el.removeAttribute("data-touched");
      o.onClosed();
    }}
    @click=${backdropClick(o.dirty)}
    @keydown=${escGuard(o.dirty)}
    @cancel=${escGuard(o.dirty)}
  >
    <form @submit=${o.onSubmit}>
      <h2>${o.title}</h2>
      ${o.body} ${o.error ? html`<p class="error" role="alert">${o.error}</p>` : nothing}
      <div class="actions">
        <button
          type="button"
          @click=${(e: Event) => (e.target as HTMLElement).closest("dialog")!.close()}
        >
          ${t("common.cancel")}
        </button>
        <button
          class="primary"
          type="submit"
          data-testid=${o.submit?.testid ?? "save"}
          ?disabled=${o.invalid}
        >
          ${o.submit?.label ?? t("common.save")}
        </button>
      </div>
    </form>
  </dialog>`;

/** Open/close button at the start of a tree row; rows without children get an empty `.chev` span. */
export const chevron = (open: boolean, onToggle: () => void) =>
  html`<button
    type="button"
    class="chev"
    aria-expanded=${open}
    aria-label=${t(open ? "common.collapse" : "common.expand")}
    @click=${onToggle}
  >
    ${icon(open ? mdiChevronDown : mdiChevronRight)}
  </button>`;

/** Copy of a set with `key` added or removed (Lit state needs a new object). */
export function toggled<T>(set: Set<T>, key: T): Set<T> {
  const next = new Set(set);
  if (!next.delete(key)) next.add(key);
  return next;
}

/** Add-child, edit and delete buttons at the end of every list row (house rule, see CLAUDE.md). */
export const rowActions = (o: {
  testid: string;
  name: string;
  onEdit: () => void;
  onDelete?: () => void;
  /** Tree rows: add a child; addLabel is the button's accessible name. */
  onAdd?: () => void;
  addLabel?: string;
}) =>
  html`${
      o.onAdd
        ? html`<button
            class="icon-btn"
            data-testid=${`${o.testid}-add`}
            aria-label=${o.addLabel ?? ""}
            @click=${o.onAdd}
          >
            ${icon(mdiPlus)}
          </button>`
        : nothing
    }<button
      class="icon-btn"
      data-testid=${`${o.testid}-edit`}
      aria-label=${t("common.edit_name", { name: o.name })}
      @click=${o.onEdit}
    >
      ${icon(mdiPencilOutline)}
    </button>
    ${
      o.onDelete
        ? html`<button
            class="icon-btn"
            data-testid=${`${o.testid}-delete`}
            aria-label=${t("common.delete_name", { name: o.name })}
            @click=${o.onDelete}
          >
            ${icon(mdiDeleteOutline)}
          </button>`
        : nothing
    }`;

/** Inline message under a field: error (blocks saving) or hint (warning only). */
export const fieldMsg = (msg: string | undefined, testid: string, hint = false) =>
  msg
    ? html`<span
        class=${hint ? "field-hint" : "field-error"}
        data-testid=${`${testid}-${hint ? "hint" : "error"}`}
        >${msg}</span
      >`
    : nothing;

/** Today as ISO date in local time. */
export const todayIso = () => {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
};

/** Plausible ISO date (the date input gives "" for incomplete input; that is checked via validity). */
export const plausibleDate = (iso: string) => iso >= "2000-01-01" && iso <= "2099-12-31";
