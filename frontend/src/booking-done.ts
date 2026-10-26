import { css, html, nothing, type TemplateResult } from "lit";
import { t } from "./i18n";
import { imageStyles, productImage } from "./product-image";

/** Status line after a booking, with an undo button when something can be put back, and an
 *  optional further action after it. Testids `message` / `undo`, or `<prefix>-done` / `<prefix>-undo`. */
export function doneLine(
  message: string,
  undo: (() => void) | undefined,
  prefix?: string,
  more?: TemplateResult,
  image?: string | null,
) {
  if (!message) return nothing;
  return html`<p class="done" role="status" data-testid=${prefix ? `${prefix}-done` : "message"}>
    ${productImage(image)} ${message}
    ${
      undo
        ? html`<button
            type="button"
            class="undo"
            data-testid=${prefix ? `${prefix}-undo` : "undo"}
            @click=${undo}
          >
            ${t("stock.undo")}
          </button>`
        : nothing
    }
    ${more ?? nothing}
  </p>`;
}

export const doneStyles = css`
  ${imageStyles}
  .done {
    margin: 0 0 12px;
  }
  .done .pimg {
    margin: 0 8px 0 0;
    vertical-align: middle;
  }
  .undo {
    margin-left: 8px;
    padding: 4px 8px;
    color: var(--primary-color);
  }
`;
