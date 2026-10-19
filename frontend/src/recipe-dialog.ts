import { LitElement, html, nothing } from "lit";
import { t } from "./i18n";
import { URL_RE, editDialog, fieldMsg, numOrNull } from "./ui";
import { aiStyles, formStyles } from "./styles";
import {
  checkRecipe,
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
import { ingredientErrors } from "./ingredient-errors";
import "./recipe-ingredients";
import { numField } from "./form-fields";
import { productInput } from "./product-input";
import "./recipe-steps-editor";
import { stepRowError } from "./recipe-steps-editor";
import type { StepRow } from "./recipe-steps";
import { fromRecipe, toPayload, type Draft } from "./recipe-draft";
import { aiBanner, aiDraft, applyAi, type AiState } from "./recipe-ai";

/** Add or edit a recipe. Call `open(md, recipe?, imported?)` (an import is a new recipe); fires `home-inventory-saved` after saving. */
export class HomeInventoryRecipeDialog extends LitElement {
  static properties = {
    hass: { attribute: false },
    draft: { state: true },
    active: { state: true },
    error: { state: true },
    ai: { state: true },
  };

  declare hass?: Hass;
  declare draft: Draft;
  declare active: boolean;
  declare error: string;
  declare ai: AiState;
  /** Bumped on skip / close / reopen: a late AI answer of an older run is ignored. */
  private aiRun = 0;
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
    this.ai = { kind: "none" };
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
    this.ai = { kind: "none" };
    this.aiRun++;
    this.active = true;
    await this.updateComplete;
    this.renderRoot.querySelector("dialog")!.showModal();
    this.renderRoot.querySelector<HTMLElement>("dialog input")?.focus();
    if (imported) void this.check();
  }

  /** Every import is checked once by the AI set up in the options (none: nothing happens). */
  private async check() {
    const run = ++this.aiRun;
    const d = this.draft;
    const sent = d.ingredients;
    this.ai = { kind: "running" };
    try {
      const res = await checkRecipe(this.hass!, aiDraft(d.name, d.servings, d.steps, sent));
      if (run !== this.aiRun) return;
      if (res.status !== "changes") {
        this.ai = { kind: res.status === "ok" ? "ok" : "none" };
        return;
      }
      const out = applyAi(res, sent, d.steps, this.draft, this.md!);
      this.draft = { ...this.draft, ingredients: out.ingredients, steps: out.steps };
      this.ai = out.state;
    } catch (err) {
      if (run === this.aiRun)
        this.ai = { kind: "failed", message: await errorMessage(this.hass!, err) };
    }
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
    const bad =
      ingredientErrors(d.ingredients).some((x) => Object.keys(x).length) ||
      d.steps.some((r) => stepRowError(r));
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
        ...toPayload(d, this.canningMode ? this.products : null),
      });
    } catch (err) {
      this.error = await errorMessage(this.hass!, err);
      return;
    }
    this.renderRoot.querySelector("dialog")?.close();
    this.dispatchEvent(new CustomEvent("home-inventory-saved", { bubbles: true, composed: true }));
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
      body: html`${aiBanner(this.ai, {
          onSkip: () => {
            this.aiRun++;
            this.ai = { kind: "skipped" };
          },
          onUndoSteps: () => {
            if (this.ai.kind !== "changed" || !this.ai.prevSteps) return;
            this.draft = { ...this.draft, steps: this.ai.prevSteps };
            this.ai = { ...this.ai, prevSteps: undefined };
          },
        })}
        ${this.text("name", t("common.name"), e.name)}
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
        <home-inventory-recipe-ingredients
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
        ></home-inventory-recipe-ingredients>
        <home-inventory-recipe-steps
          .value=${d.steps}
          @change=${(ev: CustomEvent<StepRow[]>) => (this.draft = { ...d, steps: ev.detail })}
        ></home-inventory-recipe-steps>`,
      error: this.error,
      // saving waits for the AI (or "Nicht abwarten")
      invalid: Object.keys(e).length > 0 || bad || this.ai.kind === "running",
      submit: { label: t("common.save"), testid: "recipe-save" },
      dirty: () => JSON.stringify(this.draft) !== this.initial,
      onSubmit: (ev) => this.save(ev),
      onClosed: () => {
        this.active = false;
        this.aiRun++;
      },
    });
  }

  static styles = [formStyles, aiStyles];
}

customElements.define("home-inventory-recipe-dialog", HomeInventoryRecipeDialog);
