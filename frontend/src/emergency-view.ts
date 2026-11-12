import { LitElement, css, html, nothing, type PropertyValues } from "lit";
import { t } from "./i18n";
import { errorMessage, type Hass } from "./api";
import { getEmergency, type Emergency } from "./api-emergency";
import { fmtDays, fmtNumber } from "./format";
import { loadingLine } from "./ui";

/** Emergency stock (Notvorrat): stock against the BBK recommendation, days per food group. */
export class HomeInventoryEmergency extends LitElement {
  static properties = {
    hass: { attribute: false },
    data: { state: true },
    error: { state: true },
  };

  declare hass?: Hass;
  declare data?: Emergency;
  declare error: string;
  private started = false;

  constructor() {
    super();
    this.error = "";
  }

  willUpdate(changed: PropertyValues) {
    if (changed.has("hass") && this.hass && !this.started) {
      this.started = true; // once: `hass` changes on every state event
      this.load();
    }
  }

  private async load() {
    try {
      this.data = await getEmergency(this.hass!);
    } catch (e) {
      this.error = await errorMessage(this.hass!, e);
    }
  }

  render() {
    const d = this.data;
    if (this.error) return html`<p class="error">${this.error}</p>`;
    if (!d) return loadingLine();
    const n = (v: number) => fmtNumber(this.hass, v);
    return html`
      <p class="supply" data-testid="emergency-supply">
        ${t("emergency.supply", { days: fmtDays(this.hass, d.supply_days) })}
      </p>
      <p class="detail">
        ${t("emergency.target", { persons: n(d.persons), days: fmtDays(this.hass, d.days) })}
      </p>
      <table>
        <thead>
          <tr>
            <th>${t("emergency.group")}</th>
            <th>${t("emergency.need")}</th>
            <th>${t("emergency.have")}</th>
            <th>${t("emergency.lasts")}</th>
          </tr>
        </thead>
        <tbody>
          ${d.groups.map(
            (g) =>
              html`<tr data-testid=${`emergency-row-${g.key}`}>
                <td>
                  ${t(`emergency.group.${g.key}`)}
                  ${
                    g.unknown
                      ? html`<div class="detail">
                          ${t("emergency.unknown", { n: n(g.unknown) })}
                        </div>`
                      : nothing
                  }
                </td>
                <td>${n(g.need)} ${g.unit}</td>
                <td>${n(g.have)} ${g.unit}</td>
                <td>${fmtDays(this.hass, g.days)}</td>
              </tr>`,
          )}
        </tbody>
      </table>
      <p class="detail">${t("emergency.hint")}</p>
    `;
  }

  static styles = css`
    :host {
      display: block;
      padding: 16px;
      max-width: 720px;
      margin: 0 auto;
    }
    .supply {
      margin: 0;
      font-size: 22px;
    }
    .detail {
      margin: 4px 0;
      font-size: 13px;
      color: var(--secondary-text-color);
    }
    .error {
      color: var(--error-color);
    }
    table {
      width: 100%;
      margin: 16px 0;
      border-collapse: collapse;
    }
    th,
    td {
      padding: 8px 4px;
      text-align: left;
      border-bottom: 1px solid var(--divider-color);
    }
    th {
      font-weight: 500;
      color: var(--secondary-text-color);
    }
  `;
}
customElements.define("home-inventory-emergency", HomeInventoryEmergency);
