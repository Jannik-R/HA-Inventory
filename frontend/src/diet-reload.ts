import { LitElement, html, nothing } from "lit";
import { t } from "./i18n";
import { formStyles } from "./styles";
import { errorMessage, isAdmin, type Hass } from "./api";
import { reloadDiet } from "./api-diet";
import { hasExternal, hasModule } from "./modules";

/** Admin button in the settings: fetch allergens / diet of existing products from Open Food Facts,
 * chunk by chunk (the backend spaces its requests), with progress and a stop button. */
export class HomeInventoryDietReload extends LitElement {
  static properties = {
    hass: { attribute: false },
    running: { state: true },
    checked: { state: true },
    total: { state: true },
    filled: { state: true },
    finished: { state: true },
    error: { state: true },
  };

  declare hass?: Hass;
  declare running: boolean;
  declare checked: number;
  declare total: number;
  declare filled: number;
  declare finished: boolean;
  declare error: string;
  private stopped = false;

  constructor() {
    super();
    [this.running, this.checked, this.total, this.filled, this.finished, this.error] = [
      false,
      0,
      0,
      0,
      false,
      "",
    ];
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.stopped = true; // leaving the view ends the run
  }

  private async run() {
    [this.running, this.stopped, this.finished, this.error] = [true, false, false, ""];
    [this.checked, this.filled] = [0, 0];
    let after = 0;
    try {
      while (!this.stopped) {
        const r = await reloadDiet(this.hass!, after);
        if (this.checked === 0) this.total = r.total;
        this.checked += r.checked;
        this.filled += r.filled;
        after = r.last;
        if (r.done) {
          this.finished = true;
          break;
        }
      }
    } catch (err) {
      this.error = await errorMessage(this.hass!, err);
    }
    this.running = false;
  }

  render() {
    if (!hasModule("diet") || !hasExternal("off_lookup") || !isAdmin(this.hass)) return nothing;
    return html`<div class="bar">
      ${
        this.running
          ? html`<button
                type="button"
                data-testid="diet-reload-stop"
                @click=${() => (this.stopped = true)}
              >
                ${t("diet.reload.stop")}
              </button>
              <span class="detail" data-testid="diet-reload-progress" role="status"
                >${t("diet.reload.progress", { n: this.checked, m: this.total })}</span
              >`
          : html`<button type="button" data-testid="diet-reload" @click=${() => this.run()}>
                ${t("diet.reload.button")}
              </button>
              ${
                this.finished || this.checked
                  ? html`<span class="detail" data-testid="diet-reload-result" role="status"
                      >${t("diet.reload.result", { n: this.filled, m: this.checked })}</span
                    >`
                  : html`<span class="detail">${t("diet.reload.hint")}</span>`
              }`
      }
      ${this.error ? html`<span class="error" role="alert">${this.error}</span>` : nothing}
    </div>`;
  }

  static styles = [formStyles];
}

customElements.define("home-inventory-diet-reload", HomeInventoryDietReload);
