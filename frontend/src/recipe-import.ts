import { LitElement, css, html, nothing } from "lit";
import { t } from "./i18n";
import { URL_RE, editDialog, fieldMsg, icon } from "./ui";
import { formStyles } from "./styles";
import { errorMessage, importRecipe, type Hass, type ImportSource } from "./api";
import { hasExternal } from "./modules";
import { scaledPhoto } from "./photo";
import { mdiCameraOutline } from "@mdi/js";
import "./camera-dialog";
import type { HomeInventoryCamera } from "./camera-dialog";

/** Where the recipe comes from; text and photo only with an AI set up (they always need it). */
type Source = "url" | "text" | "photo";
const SOURCES: Source[] = ["url", "text", "photo"];

/** Sources the options allow: a link needs `recipe_url`, text and photo the AI import. */
export const importSources = () =>
  SOURCES.filter((s) => hasExternal(s === "url" ? "recipe_url" : "ai_import"));
const MAX_TEXT = 20000; // backend: inventory.MAX_PASTE

/** Ask for a recipe URL, text or photo. `open()`; fires `home-inventory-imported` (detail: RecipeDraft) on success. */
export class HomeInventoryRecipeImport extends LitElement {
  static properties = {
    hass: { attribute: false },
    active: { state: true },
    source: { state: true },
    url: { state: true },
    text: { state: true },
    photo: { state: true },
    busy: { state: true },
    error: { state: true },
  };

  declare hass?: Hass;
  declare active: boolean;
  declare source: Source;
  declare url: string;
  declare text: string;
  declare photo: string;
  declare busy: boolean;
  declare error: string;

  constructor() {
    super();
    this.active = false;
    this.source = "url";
    this.url = "";
    this.text = "";
    this.photo = "";
    this.busy = false;
    this.error = "";
  }

  async open() {
    this.source = importSources()[0] ?? "url";
    this.url = this.text = this.photo = "";
    this.error = "";
    this.busy = false;
    this.active = true;
    await this.updateComplete;
    this.renderRoot.querySelector("dialog")!.showModal();
    this.focusField();
  }

  private async focusField() {
    await this.updateComplete;
    this.renderRoot.querySelector<HTMLElement>("dialog input, dialog textarea")?.focus();
  }

  private errors() {
    if (this.source === "text") return this.text.trim() ? undefined : t("valid.required");
    if (this.source === "photo") return this.photo ? undefined : t("valid.required");
    const u = this.url.trim();
    if (!u) return t("valid.required");
    return URL_RE.test(u) ? undefined : t("valid.url");
  }

  private request(): ImportSource {
    if (this.source === "text") return { text: this.text.trim() };
    if (this.source === "photo") return { image: this.photo };
    return { url: this.url.trim() };
  }

  private async takePhoto() {
    const camera = this.renderRoot.querySelector<HomeInventoryCamera>("home-inventory-camera")!;
    const url = await camera.take(false);
    if (url) this.photo = url;
  }

  private async pickPhoto(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    this.photo = "";
    this.error = "";
    if (!file) return;
    try {
      this.photo = await scaledPhoto(file);
    } catch {
      this.error = t("recipes.import.photo_invalid");
    }
  }

  private async submit(ev: Event) {
    ev.preventDefault();
    if (this.errors() || this.busy) return;
    this.busy = true;
    this.error = "";
    try {
      const draft = await importRecipe(this.hass!, this.request());
      this.renderRoot.querySelector("dialog")?.close();
      this.dispatchEvent(new CustomEvent("home-inventory-imported", { detail: draft }));
    } catch (err) {
      this.error = await errorMessage(this.hass!, err);
    }
    this.busy = false;
  }

  private switcher() {
    return html`<div class="sources" role="group" aria-label=${t("recipes.import.source")}>
      ${importSources().map(
        (s) =>
          html`<button
            type="button"
            data-testid=${`recipe-import-source-${s}`}
            aria-pressed=${s === this.source}
            ?disabled=${this.busy}
            @click=${() => {
              this.source = s;
              this.error = "";
              this.focusField();
            }}
          >
            ${t(`recipes.import.source_${s}`)}
          </button>`,
      )}
    </div>`;
  }

  private field(err: string | undefined) {
    if (this.source === "text")
      return html`<label>
        <span class="lbl">${t("recipes.import.text")}</span>
        <textarea
          rows="8"
          maxlength=${MAX_TEXT}
          data-testid="recipe-import-text"
          aria-invalid=${!!err}
          .value=${this.text}
          @input=${(e: Event) => (this.text = (e.target as HTMLTextAreaElement).value)}
        ></textarea>
        ${fieldMsg(err, "recipe-import-text")}
        <span class="note">${t("recipes.import.text_hint")}</span>
      </label>`;
    if (this.source === "photo")
      return html`<button
          type="button"
          class="take"
          data-testid="recipe-import-camera"
          ?disabled=${this.busy}
          @click=${() => this.takePhoto()}
        >
          ${icon(mdiCameraOutline)} ${t("recipes.import.take_photo")}
        </button>
        <label>
          <span class="lbl">${t("recipes.import.photo")}</span>
          <input
            type="file"
            accept="image/*"
            data-testid="recipe-import-photo"
            aria-invalid=${!!err}
            @change=${(e: Event) => this.pickPhoto(e)}
          />
          ${fieldMsg(err, "recipe-import-photo")}
          <span class="note">${t("recipes.import.photo_hint")}</span>
        </label>
        ${
          this.photo
            ? html`<img class="preview" src=${this.photo} alt=${t("recipes.import.photo")} />`
            : nothing
        }`;
    return html`<label>
      <span class="lbl">${t("recipes.import.url")}</span>
      <input
        type="url"
        data-testid="recipe-import-url"
        aria-invalid=${!!err}
        .value=${this.url}
        @input=${(e: Event) => (this.url = (e.target as HTMLInputElement).value)}
      />
      ${fieldMsg(err, "recipe-import-url")}
      <span class="note"
        >${t(hasExternal("ai_import") ? "recipes.import.hint_ai" : "recipes.import.hint")}</span
      >
    </label>`;
  }

  render() {
    if (!this.active) return html`<dialog></dialog>`;
    const err = this.errors();
    // the camera dialog sits beside this one, so its clicks are no backdrop clicks here
    return html`${editDialog({
        title: t("recipes.import.title"),
        body: html`${importSources().length > 1 ? this.switcher() : nothing} ${this.field(err)}
        ${
          this.busy
            ? html`<div class="busy" role="status" data-testid="recipe-import-busy">
                <progress aria-label=${t("recipes.import.busy")}></progress>
                <span
                  >${t(hasExternal("ai_import") ? "recipes.import.busy_ai" : "recipes.import.busy")}</span
                >
              </div>`
            : nothing
        }`,
        error: this.error,
        invalid: !!err || this.busy,
        submit: { label: t("recipes.import.submit"), testid: "recipe-import-submit" },
        dirty: () => !!(this.url.trim() || this.text.trim() || this.photo),
        onSubmit: (e) => this.submit(e),
        onClosed: () => (this.active = false),
      })}<home-inventory-camera></home-inventory-camera>`;
  }

  static styles = [
    formStyles,
    css`
      .take {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        margin-bottom: 12px;
      }
      .preview {
        display: block;
        max-width: 100%;
        max-height: 30vh;
        margin-top: 12px;
      }
      .note {
        display: block;
        margin-top: 4px;
        font-size: 0.875em;
        color: var(--secondary-text-color);
      }
      .sources {
        display: flex;
        margin-bottom: 12px;
        border: 1px solid var(--divider-color);
        border-radius: 4px;
        overflow: hidden;
      }
      .sources button {
        flex: 1;
        padding: 6px 8px;
        border: 0;
        border-radius: 0;
        background: none;
        color: var(--primary-text-color);
        font: inherit;
      }
      .sources button + button {
        border-left: 1px solid var(--divider-color);
      }
      .sources button[aria-pressed="true"] {
        background: var(--primary-color);
        color: var(--text-primary-color, #fff);
      }
      .sources button:focus-visible {
        outline: 2px solid currentColor;
        outline-offset: -4px;
      }
      textarea {
        resize: vertical;
      }
      .busy {
        display: flex;
        align-items: center;
        gap: 8px;
        margin: 12px 0;
        color: var(--secondary-text-color);
      }
      .busy progress {
        flex: none;
        width: 64px;
      }
    `,
  ];
}

customElements.define("home-inventory-recipe-import", HomeInventoryRecipeImport);
