import { LitElement, css, html, nothing, type PropertyValues } from "lit";
import { mdiHelpCircleOutline, mdiMenu } from "@mdi/js";
import { setLanguage, t } from "./i18n";
import { icon } from "./ui";
import { isAdmin, type Hass } from "./api";
import { hasModule, setAi, setModules, setOff, type Module } from "./modules";
import "./settings-view";
import "./stock-view";
import "./expiry-view";
import "./shopping-view";
import "./recipes-view";
import "./plan-view";
import "./canning-view";

// shortcut: the guide lives on GitHub; while the repo is private only its members can open it.
const GUIDE = "https://github.com/Jannik-R/HA-Inventory/blob/main/docs/guide";

const TABS = ["stock", "expiry", "shopping", "recipes", "plan", "canning", "settings"] as const;
type Tab = (typeof TABS)[number];

const MODULE_TABS: readonly string[] = ["shopping", "recipes", "plan", "canning"];

export class HomeInventoryPanel extends LitElement {
  static properties = {
    hass: { attribute: false },
    narrow: { type: Boolean },
    route: { attribute: false },
    panel: { attribute: false },
  };

  declare hass?: Hass;
  declare narrow: boolean;
  declare route?: { prefix: string; path: string };
  declare panel?: { config?: { modules?: string[]; ai?: boolean; off?: boolean } };

  constructor() {
    super();
    this.narrow = false;
    // A field shows its error only once it was edited or left (see formStyles); both events
    // cross shadow roots, so one listener here covers every view and dialog.
    const touch = (e: Event) => (e.composedPath()[0] as Element).setAttribute?.("data-touched", "");
    this.addEventListener("input", touch);
    this.addEventListener("focusout", touch);
  }

  willUpdate(changed: PropertyValues) {
    if (changed.has("hass") && this.hass) setLanguage(this.hass.language);
    if (changed.has("panel")) {
      setModules(this.panel?.config?.modules);
      setAi(this.panel?.config?.ai);
      setOff(this.panel?.config?.off);
    }
  }

  private get tabs(): Tab[] {
    return TABS.filter(
      (tab) =>
        (tab !== "settings" || isAdmin(this.hass)) &&
        (!MODULE_TABS.includes(tab) || hasModule(tab as Module)),
    );
  }

  private get seg(): string | undefined {
    return (this.route?.path ?? "").split("/").filter(Boolean)[0];
  }

  /** /in and /out are the stock tab with its switch on book in / book out. */
  private get tab(): Tab {
    const seg = this.seg ?? "";
    return (this.tabs as string[]).includes(seg) ? (seg as Tab) : "stock";
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
                title=${t("panel.menu")}
                @click=${() => this.dispatchEvent(new Event("hass-toggle-menu", { bubbles: true, composed: true }))}
              >
                ${icon(mdiMenu)}
              </button>`
            : nothing
        }
        <h1>${t("panel.title")}</h1>
        <a
          class="menu help"
          href=${`${GUIDE}.${this.hass?.language?.startsWith("de") ? "de" : "en"}.md`}
          target="_blank"
          rel="noopener noreferrer"
          data-testid="help"
          aria-label=${t("panel.help")}
          title=${t("panel.help")}
          >${icon(mdiHelpCircleOutline)}</a
        >
      </header>
      <div role="tablist">
        ${this.tabs.map(
          (tab) =>
            html`<button
              role="tab"
              data-testid=${`tab-${tab}`}
              aria-selected=${tab === active}
              @click=${() => this.select(tab)}
            >
              ${t(`tab.${tab}`)}
            </button>`,
        )}
      </div>
      <main
        role="tabpanel"
        @home-inventory-navigate=${(e: CustomEvent<string>) => this.select(e.detail)}
      >
        ${
          active === "settings"
            ? html`<home-inventory-settings
                .hass=${this.hass}
                .section=${this.sub}
              ></home-inventory-settings>`
            : active === "stock"
              ? html`<home-inventory-stock
                  .hass=${this.hass}
                  .mode=${this.seg === "in" || this.seg === "out" || (this.seg === "open" && hasModule("opened")) ? this.seg : "search"}
                ></home-inventory-stock>`
              : active === "expiry"
                ? html`<home-inventory-expiry .hass=${this.hass}></home-inventory-expiry>`
                : active === "recipes"
                  ? html`<home-inventory-recipes
                      .hass=${this.hass}
                      .section=${this.sub}
                    ></home-inventory-recipes>`
                  : active === "plan"
                    ? html`<home-inventory-plan
                        .hass=${this.hass}
                        .section=${this.sub}
                      ></home-inventory-plan>`
                    : active === "canning"
                      ? html`<home-inventory-canning
                          .hass=${this.hass}
                          .section=${this.sub}
                        ></home-inventory-canning>`
                      : html`<home-inventory-shopping .hass=${this.hass}></home-inventory-shopping>`
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
    .help {
      margin-left: auto;
      color: inherit;
    }
    .help:focus-visible {
      outline: 2px solid currentColor;
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

customElements.define("home-inventory-panel", HomeInventoryPanel);
