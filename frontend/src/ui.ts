import { css, html, nothing, svg } from "lit";
import {
  mdiChevronDown,
  mdiChevronRight,
  mdiDeleteOutline,
  mdiPencilOutline,
  mdiPlus,
} from "@mdi/js";
import { t } from "./i18n";

export const icon = (path: string) =>
  html`<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
    ${svg`<path d=${path} fill="currentColor"></path>`}
  </svg>`;

/** Accidental close (backdrop click, Esc) with unsaved changes asks first; "Abbrechen" closes directly. */
const keepOpen = (isDirty?: () => boolean) => !!isDirty?.() && !confirm(t("common.discard"));

/** Click handler: close the modal dialog on a click on its backdrop (the click targets the dialog). */
export const backdropClick = (isDirty?: () => boolean) => (e: MouseEvent) => {
  const dlg = e.target as HTMLDialogElement;
  if (dlg.tagName !== "DIALOG") return;
  const r = dlg.getBoundingClientRect();
  const outside =
    e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
  if (outside && !keepOpen(isDirty)) dlg.close();
};

/** `cancel` handler (Esc): keep the dialog open when the user does not want to discard changes. */
export const escGuard = (isDirty: () => boolean) => (e: Event) => {
  if (keepOpen(isDirty)) e.preventDefault();
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
  dirty: () => boolean;
  onSubmit: (e: Event) => void;
  onClosed: () => void;
}) =>
  html`<dialog @close=${o.onClosed} @click=${backdropClick(o.dirty)} @cancel=${escGuard(o.dirty)}>
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
        <button class="primary" type="submit" data-testid="save" ?disabled=${o.invalid}>
          ${t("common.save")}
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

/** Buttons, form fields, lists and dialogs shared by all views. */
export const formStyles = css`
  :host {
    display: block;
    color: var(--primary-text-color);
  }
  button {
    font: inherit;
    color: inherit;
    background: none;
    border: 1px solid var(--divider-color);
    border-radius: 4px;
    padding: 8px 12px;
    cursor: pointer;
  }
  button:focus-visible,
  input:focus-visible,
  select:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: 1px;
  }
  .primary {
    background: var(--primary-color);
    border-color: var(--primary-color);
    color: var(--text-primary-color, #fff);
  }
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  li {
    display: flex;
    align-items: center;
    border-bottom: 1px solid var(--divider-color);
  }
  li .row {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 2px;
    border: 0;
    padding: 10px 8px;
    text-align: left;
  }
  .detail,
  .empty {
    color: var(--secondary-text-color);
    font-size: 0.875em;
    margin: 0;
  }
  dialog {
    width: min(480px, calc(100vw - 32px));
    box-sizing: border-box;
    padding: 16px;
    border: 1px solid var(--divider-color);
    border-radius: 4px;
    background: var(--card-background-color, var(--primary-background-color));
    color: var(--primary-text-color);
  }
  dialog::backdrop {
    background: rgba(0, 0, 0, 0.5);
  }
  h2 {
    margin: 0 0 12px;
    font-size: 1.25em;
    font-weight: 500;
  }
  label {
    display: block;
    margin-bottom: 12px;
  }
  .lbl {
    display: block;
    margin-bottom: 4px;
    font-size: 0.875em;
    color: var(--secondary-text-color);
  }
  input:not([type="checkbox"], [type="radio"]),
  select {
    font: inherit;
    width: 100%;
    box-sizing: border-box;
    padding: 8px;
    color: var(--primary-text-color);
    background: var(--card-background-color, var(--primary-background-color));
    border: 1px solid var(--divider-color);
    border-radius: 4px;
  }
  /* Inherited values (no own value) in secondary color, see CLAUDE.md UI rules. */
  select.unset,
  input::placeholder {
    color: var(--secondary-text-color);
    opacity: 1;
  }
  option {
    color: var(--primary-text-color);
  }
  .check {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .error {
    color: var(--error-color);
    margin: 0 0 12px;
  }
  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .num,
  .inh {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .num {
    flex: 1;
  }
  .reset {
    flex: none;
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 6px 8px;
    font-size: 0.875em;
    color: var(--secondary-text-color);
  }
  .field {
    margin-bottom: 12px;
  }
  .pair {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 8px;
  }
  .field-error,
  .field-hint {
    display: block;
    margin-top: 4px;
    font-size: 0.875em;
    color: var(--error-color);
  }
  .field-hint {
    color: var(--warning-color);
  }
  [aria-invalid="true"] {
    border-color: var(--error-color) !important;
  }
  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  .icon-btn {
    flex: none;
    width: 40px;
    height: 40px;
    padding: 0;
    border: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--secondary-text-color);
  }
  dialog .actions {
    justify-content: flex-end;
  }
`;
