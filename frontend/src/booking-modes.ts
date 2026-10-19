import { css, html } from "lit";
import { mdiMagnify, mdiMinus, mdiPackageVariant, mdiPlus } from "@mdi/js";
import { t } from "./i18n";
import { icon } from "./ui";

/** "search" only filters the stock list; Enter (scanners send one) books nothing. "open" marks a
 *  package as opened (label: that batch; EAN / name: earliest expiry first). */
export type Mode = "search" | "in" | "out" | "open";
const MODES: [Mode, string][] = [
  ["search", mdiMagnify],
  ["in", mdiPlus],
  ["out", mdiMinus],
  ["open", mdiPackageVariant],
];

/** The mode switch in front of the booking input (slot "before"). */
export const modeSwitch = (mode: Mode, pick: (m: Mode) => void) =>
  html`<div slot="before" class="modes" role="group" aria-label=${t("stock.mode")}>
    ${MODES.map(
      ([m, path]) =>
        html`<button
          type="button"
          data-testid=${`mode-${m}`}
          aria-pressed=${m === mode}
          aria-label=${t(`stock.mode_${m}`)}
          title=${t(`stock.mode_${m}`)}
          @click=${() => pick(m)}
        >
          ${icon(path)}
        </button>`,
    )}
  </div>`;

/** Search / book in / book out / open: a segmented switch (one framed group, the chosen one filled). */
export const modesStyles = css`
  .modes {
    flex: none;
    display: flex;
    border: 1px solid var(--divider-color);
    border-radius: 4px;
    overflow: hidden;
  }
  .modes button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    padding: 0;
    border: 0;
    border-radius: 0;
    color: var(--secondary-text-color);
  }
  .modes button + button {
    border-left: 1px solid var(--divider-color);
  }
  .modes button[aria-pressed="true"] {
    background: var(--primary-color);
    color: var(--text-primary-color, #fff);
  }
  .modes button:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: -4px;
  }
`;
