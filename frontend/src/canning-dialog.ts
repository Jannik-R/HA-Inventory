import { LitElement, html, nothing } from "lit";
import { t } from "./i18n";
import { dateInvalid, editDialog, todayIso } from "./ui";
import { dateInput, numField } from "./form-fields";
import { formStyles } from "./styles";
import {
  errorMessage,
  isCanning,
  type Hass,
  type MasterData,
  type Product,
  type Recipe,
} from "./api";
import { saveCanning, type Canning } from "./api-canning";
import { categoryDefault, type Dflt } from "./inherit";
import { plusDays } from "./plan-dates";
import { durationField, pt, type Preserve } from "./preserve";
import { newFields, type Draft } from "./canning-new-fields";

/** New canning or drying protocol (a new charge, jars / packages booked in) or edit of its process
 * data. `open(md, products, recipes, kind, canning?)`; fires `home-inventory-saved` (detail: the save result + jars). */
export class HomeInventoryCanningDialog extends LitElement {
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
  private products: Product[] = [];
  private recipes: Recipe[] = [];
  private canning?: Canning;
  private kind: Preserve = "canning";
  private initial = "";

  constructor() {
    super();
    this.draft = this.blank();
    this.active = false;
    this.error = "";
  }

  private blank(): Draft {
    return {
      made_on: todayIso(),
      name: "",
      category_id: null,
      recipe_id: null,
      jars: 1,
      location_id: null,
      expires_on: "",
      temp: null,
      minutes: null,
      notes: "",
      dateBad: false,
    };
  }

  async open(
    md: MasterData,
    products: Product[],
    recipes: Recipe[],
    kind: Preserve,
    c?: Canning,
    recipeId?: number,
  ) {
    this.md = md;
    this.products = products;
    this.kind = c?.kind ?? kind;
    this.recipes = recipes.filter((r) => isCanning(r) && r.canning_kind === this.kind);
    this.canning = c;
    this.draft = c
      ? {
          ...this.blank(),
          made_on: c.made_on,
          name: c.name,
          recipe_id: c.recipe_id,
          jars: c.jars,
          expires_on: c.expires_on ?? "",
          temp: c.temp,
          minutes: c.minutes,
          notes: c.notes,
        }
      : this.blank();
    if (recipeId != null) this.pickRecipe(recipeId);
    this.initial = JSON.stringify(this.draft);
    this.error = "";
    this.active = true;
    await this.updateComplete;
    this.renderRoot.querySelector("dialog")!.showModal();
    this.renderRoot.querySelector<HTMLElement>("dialog input, dialog select")?.focus();
  }

  private product(d = this.draft) {
    return this.products.find((p) => p.name === d.name.trim());
  }

  /** Product own value, else the category's (own or inherited). */
  private dflt(field: "default_location_id" | "shelf_days", d = this.draft): Dflt | undefined {
    const p = this.product(d);
    if (p?.[field] != null) return { value: p[field]!, source: t("book.from_product") };
    return categoryDefault(this.md, p ? p.category_id : d.category_id, field);
  }

  /** Best before proposed from the shelf life: made on + days. */
  private proposal(d: Draft) {
    const shelf = this.dflt("shelf_days", d);
    return shelf && d.made_on ? plusDays(d.made_on, Number(shelf.value)) : "";
  }

  /** Change fields; a date still at its proposal follows a new product / made-on date. */
  private set(patch: Partial<Draft>) {
    const next = { ...this.draft, ...patch };
    if (!this.canning && this.draft.expires_on === this.proposal(this.draft))
      next.expires_on = this.proposal(next);
    this.draft = next;
  }

  /** A canning recipe fixes the product and brings its jars, temperature and minutes. */
  private pickRecipe(id: number | null) {
    const r = this.recipes.find((x) => x.id === id);
    this.set(
      r
        ? {
            recipe_id: id,
            name: r.canning_product ?? "",
            jars: r.servings,
            temp: r.canning_temp,
            minutes: r.canning_minutes,
          }
        : { recipe_id: null },
    );
  }

  private errors() {
    const d = this.draft;
    const e: Record<string, string> = {};
    if (!this.canning) {
      if (!d.made_on || dateInvalid(d.dateBad, d.made_on)) e.made_on = t("valid.date");
      if (!d.name.trim()) e.name = t("valid.required");
      else if (!this.product() && d.category_id == null) e.category = t("valid.category");
      if (d.jars == null || !Number.isInteger(d.jars) || d.jars < 1 || d.jars > 9999)
        e.jars = t("valid.packages");
      if (!this.dflt("default_location_id") && d.location_id == null)
        e.location = t("valid.location");
    }
    if (d.temp != null && !(Number.isInteger(d.temp) && d.temp >= 1 && d.temp <= 200))
      e.temp = t("valid.canning_temp");
    if (d.minutes != null && !(Number.isInteger(d.minutes) && d.minutes >= 1 && d.minutes <= 1440))
      e.minutes = t("valid.canning_minutes");
    return e;
  }

  private async save(ev: Event) {
    ev.preventDefault();
    if (Object.keys(this.errors()).length) return;
    const d = this.draft;
    const process = {
      recipe_id: d.recipe_id,
      temp: d.temp,
      minutes: d.minutes,
      notes: d.notes.trim() || null,
      expires_on: d.expires_on || null,
    };
    const p = this.product();
    try {
      const res = await saveCanning(
        this.hass!,
        this.canning
          ? { id: this.canning.id, ...process }
          : {
              ...process,
              made_on: d.made_on,
              jars: d.jars,
              kind: this.kind,
              location_id: d.location_id,
              ...(p
                ? { product_id: p.id }
                : { product: { name: d.name.trim(), category_id: d.category_id } }),
            },
      );
      this.renderRoot.querySelector("dialog")?.close();
      this.dispatchEvent(
        new CustomEvent("home-inventory-saved", {
          detail: this.canning ? undefined : { ...res, name: d.name.trim(), jars: d.jars },
          bubbles: true,
          composed: true,
        }),
      );
    } catch (err) {
      this.error = await errorMessage(this.hass!, err);
    }
  }

  private num(field: "jars" | "temp", label: string, unit: string, err?: string) {
    const testid = `canning-${field}`;
    return numField({
      testid,
      label,
      unit,
      value: this.draft[field],
      err,
      onChange: (v) => this.set({ [field]: v }),
    });
  }

  private date(field: "made_on" | "expires_on", label: string, err?: string) {
    return dateInput({
      testid: `canning-${field}`,
      label,
      value: this.draft[field],
      err,
      onChange: (v, bad) => this.set({ [field]: v, dateBad: bad }),
    });
  }

  /** Made on, product, jars, location: only for a new protocol (the labels carry them). */
  private newFields(e: Record<string, string>) {
    return newFields({
      kind: this.kind,
      canning: this.canning,
      draft: this.draft,
      recipes: this.recipes,
      hass: this.hass,
      md: this.md,
      products: this.products,
      e,
      location: this.dflt("default_location_id"),
      set: (patch) => this.set(patch),
      pickRecipe: (id) => this.pickRecipe(id),
      madeOn: this.date("made_on", t("canning.made_on"), e.made_on),
      jars: this.num("jars", pt(this.kind, "jars"), "", e.jars),
    });
  }

  render() {
    if (!this.active) return html`<dialog></dialog>`;
    const e = this.errors();
    const d = this.draft;
    const shelf =
      d.expires_on && d.expires_on === this.proposal(d) ? this.dflt("shelf_days") : undefined;
    return editDialog({
      title: this.canning
        ? t("common.edit_name", { name: this.canning.charge })
        : pt(this.kind, "add_title"),
      body: html`${this.newFields(e)} ${this.date("expires_on", t("canning.expires_on"))}
        ${shelf ? html`<span class="detail">${t("book.shelf_hint", { days: String(shelf.value), source: shelf.source })}</span>` : nothing}
        <div class="pair">
          ${this.num("temp", t("recipes.field.canning_temp"), "°C", e.temp)}
          ${durationField({
            kind: this.kind,
            testid: "canning-minutes",
            minutes: d.minutes,
            err: e.minutes,
            onChange: (minutes) => this.set({ minutes }),
          })}
        </div>
        <label>
          <span class="lbl">${t("canning.notes")}</span>
          <textarea
            rows="3"
            data-testid="canning-notes"
            .value=${d.notes}
            @input=${(ev: Event) => this.set({ notes: (ev.target as HTMLTextAreaElement).value })}
          ></textarea>
        </label>`,
      error: this.error,
      invalid: Object.keys(e).length > 0,
      submit: { label: t("common.save"), testid: "canning-save" },
      dirty: () => JSON.stringify(this.draft) !== this.initial,
      onSubmit: (ev) => this.save(ev),
      onClosed: () => (this.active = false),
    });
  }

  static styles = formStyles;
}

customElements.define("home-inventory-canning-dialog", HomeInventoryCanningDialog);
