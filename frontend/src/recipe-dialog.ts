import { LitElement, css, html } from "lit";
import { t } from "./i18n";
import { editDialog, fieldMsg } from "./ui";
import { formStyles } from "./styles";
import {
  errorMessage,
  saveRecipe,
  type Hass,
  type Ingredient,
  type MasterData,
  type Recipe,
  type RecipeDraft,
} from "./api";
import { blankIngredient, ingredientErrors } from "./recipe-ingredients";
import "./recipe-ingredients";

const URL_RE = /^https?:\/\//i;

interface Draft {
  name: string;
  servings: number | null;
  instructions: string;
  source_url: string;
  image_url: string;
  ingredients: Ingredient[];
}

const fromRecipe = (r?: Recipe | RecipeDraft): Draft => ({
  name: r?.name ?? "",
  servings: r?.servings ?? 4,
  instructions: r?.instructions ?? "",
  source_url: r?.source_url ?? "",
  image_url: r?.image_url ?? "",
  ingredients: (r?.ingredients ?? []).map((i) => ({
    category_id: i.category_id,
    amount: i.amount,
    unit_id: i.amount == null ? null : i.unit_id,
    text: i.text,
    note: i.note ?? null,
    optional: i.optional,
    skip_stock: i.skip_stock ?? false,
    line: i.line,
    unit_hint: i.unit_hint,
  })),
});

/** Add or edit a recipe. Call `open(md, recipe?, imported?)` (an import is a new recipe); fires `pantry-saved` after saving. */
export class PantryRecipeDialog extends LitElement {
  static properties = {
    hass: { attribute: false },
    draft: { state: true },
    active: { state: true },
    error: { state: true },
  };

  declare hass?: Hass;
  declare draft: Draft;
  declare active: boolean;
  declare error: string;
  private md?: MasterData;
  private recipe?: Recipe;
  private initial = "";

  constructor() {
    super();
    this.draft = fromRecipe();
    this.active = false;
    this.error = "";
  }

  async open(md: MasterData, recipe?: Recipe, imported?: RecipeDraft) {
    this.md = md;
    this.recipe = recipe;
    this.draft = fromRecipe(recipe ?? imported);
    // An import counts as unsaved: closing asks first.
    this.initial = JSON.stringify(imported ? fromRecipe() : this.draft);
    this.error = "";
    this.active = true;
    await this.updateComplete;
    this.renderRoot.querySelector("dialog")!.showModal();
    this.renderRoot.querySelector<HTMLElement>("dialog input")?.focus();
  }

  private errors() {
    const d = this.draft;
    const e: Record<string, string> = {};
    if (!d.name.trim()) e.name = t("valid.required");
    if (d.servings == null || !Number.isInteger(d.servings) || d.servings < 1 || d.servings > 99)
      e.servings = t("valid.servings");
    if (d.source_url.trim() && !URL_RE.test(d.source_url.trim())) e.source_url = t("valid.url");
    if (d.image_url.trim() && !URL_RE.test(d.image_url.trim())) e.image_url = t("valid.url");
    const bad = ingredientErrors(d.ingredients).some((x) => Object.keys(x).length);
    return { e, bad };
  }

  private async save(ev: Event) {
    ev.preventDefault();
    const { e, bad } = this.errors();
    if (Object.keys(e).length || bad) return;
    const d = this.draft;
    try {
      await saveRecipe(this.hass!, {
        ...(this.recipe ? { id: this.recipe.id } : {}),
        name: d.name.trim(),
        servings: d.servings,
        instructions: d.instructions.trim() || null,
        source_url: d.source_url.trim() || null,
        image_url: d.image_url.trim() || null,
        ingredients: d.ingredients
          .filter((i) => !blankIngredient(i))
          .map((i) => ({
            category_id: i.category_id,
            amount: i.amount,
            // A unit without an amount is only the category's suggestion.
            unit_id: i.amount == null ? null : i.unit_id,
            optional: i.optional,
            skip_stock: i.skip_stock,
            note: i.note?.trim() || null,
            // The backend takes the category's name; text only for rows without one.
            ...(i.category_id == null ? { text: i.text.trim() } : {}),
          })),
      });
    } catch (err) {
      this.error = await errorMessage(this.hass!, err);
      return;
    }
    this.renderRoot.querySelector("dialog")?.close();
    this.dispatchEvent(new CustomEvent("pantry-saved", { bubbles: true, composed: true }));
  }

  private text(
    field: "name" | "source_url" | "image_url",
    label: string,
    err?: string,
    type = "text",
  ) {
    return html`<label>
      <span class="lbl">${label}</span>
      <input
        type=${type}
        data-testid=${field === "name" ? "recipe-name" : `recipe-${field}`}
        aria-invalid=${!!err}
        .value=${this.draft[field]}
        @input=${(ev: Event) =>
          (this.draft = { ...this.draft, [field]: (ev.target as HTMLInputElement).value })}
      />
      ${fieldMsg(err, field === "name" ? "recipe-name" : `recipe-${field}`)}
    </label>`;
  }

  render() {
    if (!this.active) return html`<dialog></dialog>`;
    const { e, bad } = this.errors();
    const d = this.draft;
    return editDialog({
      title: this.recipe ? t("common.edit_name", { name: this.recipe.name }) : t("recipes.add"),
      body: html`${this.text("name", t("common.name"), e.name)}
        <label>
          <span class="lbl">${t("recipes.servings")}</span>
          <input
            type="number"
            min="1"
            max="99"
            step="1"
            inputmode="numeric"
            data-testid="recipe-servings-input"
            aria-invalid=${!!e.servings}
            .value=${String(d.servings ?? "")}
            @input=${(ev: Event) => {
              const v = (ev.target as HTMLInputElement).value;
              this.draft = { ...d, servings: v === "" ? null : Number(v) };
            }}
          />
          ${fieldMsg(e.servings, "recipe-servings-input")}
        </label>
        <label>
          <span class="lbl">${t("recipes.field.instructions")}</span>
          <textarea
            rows="5"
            data-testid="recipe-instructions"
            .value=${d.instructions}
            @input=${(ev: Event) =>
              (this.draft = { ...d, instructions: (ev.target as HTMLTextAreaElement).value })}
          ></textarea>
        </label>
        ${this.text("source_url", t("recipes.field.source_url"), e.source_url, "url")}
        ${this.text("image_url", t("recipes.field.image_url"), e.image_url, "url")}
        <pantry-recipe-ingredients
          .hass=${this.hass}
          .value=${d.ingredients}
          @master=${(ev: CustomEvent<MasterData>) => {
            this.md = ev.detail;
            this.requestUpdate();
            // the view keeps it too, even when this dialog is cancelled afterwards
            this.dispatchEvent(new CustomEvent("master", { detail: ev.detail }));
          }}
          .categories=${this.md?.categories ?? []}
          .units=${this.md?.units ?? []}
          @change=${(ev: CustomEvent<Ingredient[]>) =>
            (this.draft = { ...d, ingredients: ev.detail })}
        ></pantry-recipe-ingredients>`,
      error: this.error,
      invalid: Object.keys(e).length > 0 || bad,
      submit: { label: t("common.save"), testid: "recipe-save" },
      dirty: () => JSON.stringify(this.draft) !== this.initial,
      onSubmit: (ev) => this.save(ev),
      onClosed: () => (this.active = false),
    });
  }

  static styles = [
    formStyles,
    css`
      textarea {
        font: inherit;
        width: 100%;
        box-sizing: border-box;
        padding: 8px;
        color: var(--primary-text-color);
        background: var(--card-background-color, var(--primary-background-color));
        border: 1px solid var(--divider-color);
        border-radius: 4px;
      }
    `,
  ];
}

customElements.define("pantry-recipe-dialog", PantryRecipeDialog);
