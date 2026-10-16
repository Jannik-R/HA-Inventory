import { LitElement, css, html } from "lit";
import { t } from "./i18n";
import { URL_RE, editDialog, fieldMsg } from "./ui";
import { formStyles } from "./styles";
import { errorMessage, importRecipe, type Hass } from "./api";

/** Ask for a recipe URL. `open()`; fires `pantry-imported` (detail: RecipeDraft) on success. */
export class PantryRecipeImport extends LitElement {
  static properties = {
    hass: { attribute: false },
    active: { state: true },
    url: { state: true },
    busy: { state: true },
    error: { state: true },
  };

  declare hass?: Hass;
  declare active: boolean;
  declare url: string;
  declare busy: boolean;
  declare error: string;

  constructor() {
    super();
    this.active = false;
    this.url = "";
    this.busy = false;
    this.error = "";
  }

  async open() {
    this.url = "";
    this.error = "";
    this.busy = false;
    this.active = true;
    await this.updateComplete;
    this.renderRoot.querySelector("dialog")!.showModal();
    this.renderRoot.querySelector<HTMLElement>("dialog input")?.focus();
  }

  private errors() {
    const u = this.url.trim();
    if (!u) return t("valid.required");
    return URL_RE.test(u) ? undefined : t("valid.url");
  }

  private async submit(ev: Event) {
    ev.preventDefault();
    if (this.errors() || this.busy) return;
    this.busy = true;
    this.error = "";
    try {
      const draft = await importRecipe(this.hass!, this.url.trim());
      this.renderRoot.querySelector("dialog")?.close();
      this.dispatchEvent(new CustomEvent("pantry-imported", { detail: draft }));
    } catch (err) {
      this.error = await errorMessage(this.hass!, err);
    }
    this.busy = false;
  }

  render() {
    if (!this.active) return html`<dialog></dialog>`;
    const err = this.errors();
    return editDialog({
      title: t("recipes.import.title"),
      body: html`<label>
        <span class="lbl">${t("recipes.import.url")}</span>
        <input
          type="url"
          data-testid="recipe-import-url"
          aria-invalid=${!!err}
          .value=${this.url}
          @input=${(e: Event) => (this.url = (e.target as HTMLInputElement).value)}
        />
        ${fieldMsg(err, "recipe-import-url")}
        <span class="note">${t("recipes.import.hint")}</span>
      </label>`,
      error: this.error,
      invalid: !!err || this.busy,
      submit: { label: t("recipes.import.submit"), testid: "recipe-import-submit" },
      dirty: () => !!this.url.trim(),
      onSubmit: (e) => this.submit(e),
      onClosed: () => (this.active = false),
    });
  }

  static styles = [
    formStyles,
    css`
      .note {
        display: block;
        margin-top: 4px;
        font-size: 0.875em;
        color: var(--secondary-text-color);
      }
    `,
  ];
}

customElements.define("pantry-recipe-import", PantryRecipeImport);
