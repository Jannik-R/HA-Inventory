import { LitElement, css, html, nothing, svg, type PropertyValues } from "lit";
import { mdiMenu } from "@mdi/js";
import { setLanguage, t } from "./i18n";
import type { Hass } from "./api";
import "./settings-view";
import "./booking-view";
import "./stock-view";
import "./expiry-view";
import "./shopping-view";

const TABS = ["stock", "in", "out", "expiry", "shopping", "settings"] as const;
type Tab = (typeof TABS)[number];

export class PantryPanel extends LitElement {
  static properties = {
    hass: { attribute: false },
    narrow: { type: Boolean },
    route: { attribute: false },
    panel: { attribute: false },
  };

  declare hass?: Hass;
  declare narrow: boolean;
  declare route?: { prefix: string; path: string };
  declare panel?: unknown;

  constructor() {
    super();
    this.narrow = false;
  }

  willUpdate(changed: PropertyValues) {
    if (changed.has("hass") && this.hass) setLanguage(this.hass.language);
  }

  private get tab(): Tab {
    const seg = (this.route?.path ?? "").split("/").filter(Boolean)[0];
    if (seg === "settings" && !this.hass?.user?.is_admin) return "stock";
    return (TABS as readonly string[]).includes(seg) ? (seg as Tab) : "stock";
  }

  private get sub(): string | undefined {
    return (this.route?.path ?? "").split("/").filter(Boolean)[1];
  }

  private select(path: string) {
    history.pushState(null, "", `${this.route?.prefix ?? ""}/${path}`);
    window.dispatchEvent(new CustomEvent("location-changed"));
  }

  render() {
    const active = this.tab;
    return html`
      <header>
        ${
          this.narrow
            ? html`<button
                class="menu"
                aria-label=${t("panel.menu")}
                @click=${() => this.dispatchEvent(new Event("hass-toggle-menu", { bubbles: true, composed: true }))}
              >
                <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
                  ${svg`<path d=${mdiMenu} fill="currentColor"></path>`}
                </svg>
              </button>`
            : nothing
        }
        <h1>${t("panel.title")}</h1>
      </header>
      <div role="tablist">
        ${TABS.filter((tab) => tab !== "settings" || this.hass?.user?.is_admin).map(
          (tab) =>
            html`<button
              role="tab"
              aria-selected=${tab === active}
              @click=${() => this.select(tab)}
            >
              ${t(`tab.${tab}`)}
            </button>`,
        )}
      </div>
      <main role="tabpanel" @pantry-navigate=${(e: CustomEvent<string>) => this.select(e.detail)}>
        ${
          active === "settings"
            ? html`<pantry-settings .hass=${this.hass} .section=${this.sub}></pantry-settings>`
            : active === "in" || active === "out"
              ? html`<pantry-booking .hass=${this.hass} .mode=${active}></pantry-booking>`
              : active === "stock"
                ? html`<pantry-stock .hass=${this.hass}></pantry-stock>`
                : active === "expiry"
                  ? html`<pantry-expiry .hass=${this.hass}></pantry-expiry>`
                  : html`<pantry-shopping .hass=${this.hass}></pantry-shopping>`
        }
      </main>
    `;
  }

  static styles = css`
    :host {
      display: block;
      min-height: 100%;
      background: var(--primary-background-color);
      color: var(--primary-text-color);
    }
    header {
      display: flex;
      align-items: center;
      height: 56px;
      padding: 0 12px;
      box-sizing: border-box;
      background: var(--app-header-background-color, var(--primary-color));
      color: var(--app-header-text-color, #fff);
    }
    h1 {
      margin: 0 0 0 8px;
      font-size: 20px;
      font-weight: 400;
    }
    button {
      font: inherit;
      color: inherit;
      background: none;
      border: 0;
      cursor: pointer;
    }
    button:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: -2px;
    }
    .menu {
      display: flex;
      padding: 8px;
      border-radius: 50%;
    }
    header .menu:focus-visible {
      outline-color: currentColor;
    }
    [role="tablist"] {
      display: flex;
      overflow-x: auto;
      scrollbar-width: none;
      border-bottom: 1px solid var(--divider-color);
    }
    [role="tab"] {
      flex: none;
      padding: 14px 16px 12px;
      color: var(--secondary-text-color);
      border-bottom: 2px solid transparent;
      white-space: nowrap;
    }
    [role="tab"][aria-selected="true"] {
      color: var(--primary-color);
      border-bottom-color: var(--primary-color);
    }
    main {
      padding: 16px;
    }
    p {
      margin: 0;
      color: var(--secondary-text-color);
    }
  `;
}

customElements.define("pantry-panel", PantryPanel);
