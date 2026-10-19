import { LitElement, css, html } from "lit";
import { t } from "./i18n";
import { editDialog, fieldMsg } from "./ui";
import { formStyles } from "./styles";
import { errorMessage, getDeleteImpact, moveLocation, type Hass } from "./api";

type Loc = { id: number; name: string };

/** "Umlagern" dialog of a location row: move all its stock to another location (it stays). */
export class HomeInventoryMoveLocation extends LitElement {
  static properties = {
    hass: { attribute: false },
    locations: { attribute: false },
    from: { state: true },
    target: { state: true },
    batches: { state: true },
    packages: { state: true },
    error: { state: true },
  };

  declare hass?: Hass;
  declare locations: Loc[];
  declare from?: Loc;
  declare target: string;
  declare batches: number;
  declare packages: number;
  declare error: string;

  constructor() {
    super();
    this.locations = [];
    this.target = "";
    this.batches = 0;
    this.packages = 0;
    this.error = "";
  }

  /** What moves comes from the delete dry run (its stock group), so no second query exists. */
  async open(from: Loc) {
    this.error = "";
    this.target = "";
    try {
      const impact = await getDeleteImpact(this.hass!, "location", from.id);
      const stock = impact.groups.find((g) => g.kind === "delete.stock");
      this.batches = stock?.count ?? 0;
      this.packages = stock?.packages ?? 0;
    } catch (err) {
      this.error = await errorMessage(this.hass!, err);
    }
    this.from = from;
    await this.updateComplete;
    this.renderRoot.querySelector("dialog")!.showModal();
    this.renderRoot.querySelector<HTMLElement>("select")?.focus();
  }

  private async save(e: Event) {
    e.preventDefault();
    if (!this.target || !this.batches) return;
    try {
      await moveLocation(this.hass!, this.from!.id, Number(this.target));
      this.renderRoot.querySelector("dialog")?.close();
      this.dispatchEvent(new CustomEvent("moved"));
    } catch (err) {
      this.error = await errorMessage(this.hass!, err);
    }
  }

  render() {
    const from = this.from;
    if (!from) return html`<dialog></dialog>`;
    return editDialog({
      title: t("settings.location.move_name", { name: from.name }),
      body: html`<p class="detail" data-testid="move-summary">
          ${
            this.batches
              ? t("settings.location.move_summary", {
                  batches: this.batches,
                  packages: this.packages,
                  name: from.name,
                })
              : t("settings.location.move_empty")
          }
        </p>
        <label>
          <span class="lbl">${t("settings.location.move_target")}</span>
          <select
            data-testid="move-target"
            aria-invalid=${!this.target}
            .value=${this.target}
            @change=${(e: Event) => (this.target = (e.target as HTMLSelectElement).value)}
          >
            <option value="">${t("settings.location.move_choose")}</option>
            ${this.locations
              .filter((l) => l.id !== from.id)
              .map((l) => html`<option value=${l.id}>${l.name}</option>`)}
          </select>
          ${fieldMsg(this.target ? undefined : t("valid.location"), "move-target")}
        </label>`,
      error: this.error,
      invalid: !this.target || !this.batches,
      submit: { label: t("settings.location.move_action"), testid: "move-save" },
      dirty: () => !!this.target,
      onSubmit: (e) => this.save(e),
      onClosed: () => (this.from = undefined),
    });
  }

  static styles = [
    formStyles,
    css`
      p.detail {
        margin: 0 0 12px;
        color: var(--secondary-text-color);
      }
    `,
  ];
}

customElements.define("home-inventory-move-location", HomeInventoryMoveLocation);
