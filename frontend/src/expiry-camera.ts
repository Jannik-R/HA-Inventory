import { LitElement, html } from "lit";
import { mdiCameraOutline } from "@mdi/js";
import { t } from "./i18n";
import { icon } from "./ui";
import type { Hass } from "./api";
import "./expiry-scan";
import type { HomeInventoryExpiryScan } from "./expiry-scan";

/** Camera button beside the expiry date: opens the live scan and fires `expiry-found` (detail:
 *  ISO date). The user still saves the form. Light DOM: the host's styles apply. */
export class HomeInventoryExpiryCamera extends LitElement {
  static properties = { hass: { attribute: false } };
  declare hass?: Hass;

  connectedCallback() {
    super.connectedCallback();
    // clicks in the scan dialog must not reach the surrounding <label>
    this.addEventListener("click", (e) => e.stopPropagation());
  }

  createRenderRoot() {
    return this;
  }

  private async scan() {
    const date = await this.querySelector<HomeInventoryExpiryScan>(
      "home-inventory-expiry-scan",
    )!.scan();
    if (date) this.dispatchEvent(new CustomEvent("expiry-found", { detail: date }));
  }

  render() {
    return html`<button
        type="button"
        class="icon-btn"
        data-testid="expiry-camera"
        aria-label=${t("expiry.camera")}
        title=${t("expiry.camera")}
        @click=${() => this.scan()}
      >
        ${icon(mdiCameraOutline)}
      </button>
      <home-inventory-expiry-scan .hass=${this.hass}></home-inventory-expiry-scan>`;
  }
}

customElements.define("home-inventory-expiry-camera", HomeInventoryExpiryCamera);
