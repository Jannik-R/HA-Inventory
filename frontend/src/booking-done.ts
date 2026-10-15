import { css, html, nothing } from "lit";
import { t } from "./i18n";

/** Status line after a booking, with an undo button when something can be put back. */
export function doneLine(message: string, undo: (() => void) | undefined) {
  if (!message) return nothing;
  return html`<p class="done" role="status" data-testid="message">
    ${message}
    ${
      undo
        ? html`<button type="button" class="undo" data-testid="undo" @click=${undo}>
            ${t("stock.undo")}
          </button>`
        : nothing
    }
  </p>`;
}

export const doneStyles = css`
  .done {
    margin: 0 0 12px;
  }
  .undo {
    margin-left: 8px;
    padding: 4px 8px;
    color: var(--primary-color);
  }
`;
