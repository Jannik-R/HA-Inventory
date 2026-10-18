import { LitElement, css, html } from "lit";
import { mdiBarcodeScan } from "@mdi/js";
import { t } from "./i18n";
import { icon } from "./ui";
import { formStyles } from "./styles";
import type { PantryScanner } from "./scanner";
import "./scanner";

/** The booking input (hardware scanner, camera, name). Fires `query` on typing and `find` on submit or scan. */
export class PantryBookingScan extends LitElement {
  static properties = { value: { attribute: false } };
  declare value: string;

  focusInput() {
    this.updateComplete.then(() =>
      this.renderRoot.querySelector<HTMLInputElement>("#code")?.focus(),
    );
  }

  private fire(name: string, q: string) {
    this.dispatchEvent(new CustomEvent<string>(name, { detail: q }));
  }

  private submit(e: Event) {
    e.preventDefault();
    this.fire("find", this.value);
  }

  private scanned(e: CustomEvent<string>) {
    this.fire("query", e.detail);
    this.fire("find", e.detail);
  }

  render() {
    return html`
      <form class="scan" @submit=${this.submit}>
        <slot name="before"></slot>
        <input
          id="code"
          data-testid="code-input"
          type="search"
          enterkeyhint="search"
          autocomplete="off"
          aria-label=${t("book.input")}
          placeholder=${t("book.input")}
          .value=${this.value}
          @input=${(e: Event) => this.fire("query", (e.target as HTMLInputElement).value)}
        />
        <button
          type="button"
          data-testid="camera"
          aria-label=${t("book.camera")}
          @click=${() => this.renderRoot.querySelector<PantryScanner>("pantry-scanner")?.open()}
        >
          ${icon(mdiBarcodeScan)}<span>${t("book.camera")}</span>
        </button>
      </form>
      <pantry-scanner @scan=${this.scanned}></pantry-scanner>
    `;
  }

  static styles = [
    formStyles,
    css`
      .scan {
        display: flex;
        gap: 8px;
        margin-bottom: 12px;
      }
      .scan input {
        flex: 1;
        min-width: 0;
      }
      .scan button {
        flex: none;
        display: flex;
        align-items: center;
        gap: 6px;
      }
      /* Phone: the input needs the room; the camera button is named by its aria-label. */
      @media (max-width: 480px) {
        .scan button span {
          display: none;
        }
      }
    `,
  ];
}

customElements.define("pantry-booking-scan", PantryBookingScan);
