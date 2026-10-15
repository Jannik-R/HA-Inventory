import { LitElement, css, html, nothing } from "lit";
import { t } from "./i18n";
import { formStyles } from "./styles";

export interface ConfirmOptions {
  /** Question as action + object: "„Kühlschrank“ löschen?", "Änderungen verwerfen?". */
  title: string;
  /** Optional detail, e.g. what goes with it ("… mit 3 Pkg. Bestand"). */
  message?: string;
  /** Verb on the confirm button ("Löschen", "Verwerfen"). */
  action: string;
  /** Destructive action: button in the error color. */
  danger?: boolean;
}

/** Modal yes/no question following the dialog rules; replaces the browser's `confirm()`. */
class PantryConfirm extends LitElement {
  declare o: ConfirmOptions;
  resolve!: (ok: boolean) => void;
  private ok = false;

  firstUpdated() {
    const dlg = this.renderRoot.querySelector("dialog")!;
    dlg.showModal();
    // Safe default: Enter on an accidental open does not delete.
    dlg.querySelector<HTMLElement>("[data-testid=confirm-cancel]")!.focus();
  }

  private answer(ok: boolean) {
    this.ok = ok;
    this.renderRoot.querySelector("dialog")!.close();
  }

  private backdrop(e: MouseEvent) {
    const dlg = e.target as HTMLDialogElement;
    if (dlg.tagName !== "DIALOG") return;
    const r = dlg.getBoundingClientRect();
    if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom)
      dlg.close();
  }

  render() {
    return html`<dialog
      aria-labelledby="title"
      @click=${this.backdrop}
      @close=${() => {
        this.resolve(this.ok);
        this.remove();
      }}
    >
      <h2 id="title">${this.o.title}</h2>
      ${this.o.message ? html`<p>${this.o.message}</p>` : nothing}
      <div class="actions">
        <button data-testid="confirm-cancel" @click=${() => this.answer(false)}>
          ${t("common.cancel")}
        </button>
        <button
          class=${this.o.danger ? "danger" : "primary"}
          data-testid="confirm-ok"
          @click=${() => this.answer(true)}
        >
          ${this.o.action}
        </button>
      </div>
    </dialog>`;
  }

  static styles = [
    formStyles,
    css`
      dialog {
        width: min(400px, calc(100vw - 32px));
      }
      p {
        margin: 0 0 16px;
        color: var(--secondary-text-color);
      }
      .actions {
        justify-content: flex-end;
      }
      .danger {
        background: var(--error-color);
        border-color: var(--error-color);
        color: var(--text-primary-color, #fff);
      }
    `,
  ];
}

customElements.define("pantry-confirm", PantryConfirm);

/** Ask a yes/no question in a modal dialog; resolves true only on the action button. */
export function confirmDialog(o: ConfirmOptions): Promise<boolean> {
  return new Promise((resolve) => {
    const el = document.createElement("pantry-confirm") as PantryConfirm;
    el.o = o;
    el.resolve = resolve;
    document.body.append(el);
  });
}

/** Delete question naming the object and, optionally, what goes with it. */
export const confirmDelete = (name: string, message?: string) =>
  confirmDialog({
    title: t("common.delete_name", { name }) + "?",
    message,
    action: t("common.delete"),
    danger: true,
  });
