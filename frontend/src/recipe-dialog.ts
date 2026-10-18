import { LitElement, css, html, nothing } from "lit";
import { t } from "./i18n";
import { URL_RE, editDialog, fieldMsg, numOrNull } from "./ui";
import { formStyles } from "./styles";
import {
  errorMessage,
  listProducts,
  saveRecipe,
  type Hass,
  type Ingredient,
  type MasterData,
  type Product,
  type Recipe,
  type RecipeDraft,
} from "./api";
import { blankIngredient, ingredientErrors } from "./ingredient-errors";
import "./recipe-ingredients";
import { numField } from "./form-fields";
import { productInput } from "./product-input";

interface Draft {
  name: string;
  servings: number | null;
  instructions: string;
  source_url: string;
  image_url: string;
  /** Canning recipe: the product it makes (name; a new one needs its category). */
  product: string;
  product_category: number | null;
  canning_temp: number | null;
  canning_minutes: number | null;
  ingredients: Ingredient[];
}

const fromRecipe = (r?: Recipe | RecipeDraft): Draft => ({
  name: r?.name ?? "",
  servings: r?.servings ?? 4,
  instructions: r?.instructions ?? "",
  source_url: r?.source_url ?? "",
  image_url: r?.image_url ?? "",
  product: (r && "canning_product" in r && r.canning_product) || "",
  product_category: null,
  canning_temp: r?.canning_temp ?? null,
  canning_minutes: r?.canning_minutes ?? null,
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
  /** A canning recipe (Einkochen tab): makes a product, has temperature and minutes. */
  private canningMode = false;
  private products: Product[] = [];

  constructor() {
    super();
    this.draft = fromRecipe();
    this.active = false;
    this.error = "";
  }

  async open(md: MasterData, recipe?: Recipe, imported?: RecipeDraft, canning = false) {
    this.md = md;
    this.recipe = recipe;
    this.canningMode = canning;
    if (canning) this.products = await listProducts(this.hass!).catch(() => [] as Product[]); // suggestions only
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
    if (this.canningMode && !d.product.trim()) e.product = t("valid.required");
    else if (
      this.canningMode &&
      !this.products.some((p) => p.name === d.product.trim()) &&
      d.product_category == null
    )
      e.product_category = t("valid.category");
    // canning: both or none
    const temp = d.canning_temp,
      min = d.canning_minutes;
    if (temp != null && !(Number.isInteger(temp) && temp >= 1 && temp <= 200))
      e.canning_temp = t("valid.canning_temp");
    else if (temp == null && min != null) e.canning_temp = t("valid.required");
    if (min != null && !(Number.isInteger(min) && min >= 1 && min <= 1440))
      e.canning_minutes = t("valid.canning_minutes");
    else if (min == null && temp != null) e.canning_minutes = t("valid.required");
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
        ...(this.canningMode ? this.canningPayload() : {}),
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

  /** Product made (existing id or a new one with its category), temperature and minutes. */
  private canningPayload() {
    const d = this.draft;
    const known = this.products.find((p) => p.name === d.product.trim());
    return {
      ...(known
        ? { canning_product_id: known.id }
        : { canning_product: { name: d.product.trim(), category_id: d.product_category } }),
      canning_temp: d.canning_temp,
      canning_minutes: d.canning_minutes,
    };
  }

  /** Canning process value (°C or minutes) with its unit after the input. */
  private canning(field: "canning_temp" | "canning_minutes", unit: string, err?: string) {
    return numField({
      testid: `recipe-${field}`,
      label: t(`recipes.field.${field}`),
      unit,
      value: this.draft[field],
      err,
      onChange: (v) => (this.draft = { ...this.draft, [field]: v }),
    });
  }

  render() {
    if (!this.active) return html`<dialog></dialog>`;
    const { e, bad } = this.errors();
    const d = this.draft;
    return editDialog({
      title: this.recipe
        ? t("common.edit_name", { name: this.recipe.name })
        : t(this.canningMode ? "canning.recipe_add" : "recipes.add"),
      body: html`${this.text("name", t("common.name"), e.name)}
        ${
          this.canningMode
            ? productInput({
                testid: "recipe",
                label: t("canning.recipe_makes"),
                hass: this.hass,
                md: this.md,
                products: this.products,
                name: d.product,
                categoryId: d.product_category,
                err: { name: e.product, category: e.product_category },
                onName: (product) => (this.draft = { ...this.draft, product }),
                onCategory: (id) => (this.draft = { ...this.draft, product_category: id }),
              })
            : nothing
        }
        <label>
          <span class="lbl"
            >${t(this.canningMode ? "canning.recipe_jars" : "recipes.servings")}</span
          >
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
              this.draft = { ...d, servings: numOrNull(v) };
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
        ${
          this.canningMode
            ? html`<div class="pair">
                ${this.canning("canning_temp", "°C", e.canning_temp)}
                ${this.canning("canning_minutes", t("recipes.minutes_unit"), e.canning_minutes)}
              </div>`
            : nothing
        }
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
