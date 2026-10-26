import { LitElement, html, nothing } from "lit";
import { t } from "./i18n";
import { dateInvalid, editDialog, fieldMsg, todayIso } from "./ui";
import { dateInput, numField } from "./form-fields";
import { formStyles } from "./styles";
import { errorMessage, isCanning, type Hass, type MasterData, type Recipe } from "./api";
import { saveCanning, storeLeftovers, type Canning } from "./api-canning";
import { categoryDefault, inheritSelect } from "./inherit";
import { hasModule } from "./modules";
import { plusDays } from "./plan-dates";

interface Draft {
  made_on: string;
  dish: string;
  servings: number | null;
  location_id: number | null;
  expires_on: string;
  notes: string;
  madeBad: boolean;
  expiresBad: boolean;
}

/** Store leftovers of a dish (a new charge, one package per serving) or edit the date and notes of
 * a charge. `open(md, recipes, charge?)`; fires `home-inventory-saved` (detail: the result + jars). */
export class HomeInventoryLeftoverDialog extends LitElement {
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
  private recipes: Recipe[] = [];
  private canning?: Canning;
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
      dish: "",
      servings: 1,
      location_id: null,
      expires_on: "",
      notes: "",
      madeBad: false,
      expiresBad: false,
    };
  }

  async open(md: MasterData, recipes: Recipe[], c?: Canning) {
    this.md = md;
    this.recipes = recipes.filter((r) => !isCanning(r));
    this.canning = c;
    this.draft = c
      ? {
          ...this.blank(),
          made_on: c.made_on,
          dish: c.name,
          servings: c.jars,
          expires_on: c.expires_on ?? "",
          notes: c.notes,
        }
      : this.blank();
    if (!c) this.draft.expires_on = this.proposal(this.draft);
    this.initial = JSON.stringify(this.draft);
    this.error = "";
    this.active = true;
    await this.updateComplete;
    this.renderRoot.querySelector("dialog")!.showModal();
    this.renderRoot.querySelector<HTMLElement>("dialog input, dialog select")?.focus();
  }

  private cat = (field: "default_location_id" | "shelf_days" | "frozen_days") =>
    categoryDefault(this.md, this.md?.leftover_category_id, field);

  /** Days the date is proposed from: frozen days at a freezer (module on), else the shelf life. */
  private days(d: Draft) {
    const place = d.location_id ?? Number(this.cat("default_location_id")?.value);
    const frozen = hasModule("frozen") && this.md?.locations.find((l) => l.id === place)?.freezer;
    return this.cat(frozen ? "frozen_days" : "shelf_days");
  }

  /** Best before proposed from those days: made on + days. */
  private proposal(d: Draft) {
    const shelf = this.days(d);
    return shelf && d.made_on ? plusDays(d.made_on, Number(shelf.value)) : "";
  }

  /** Change fields; a date still at its proposal follows the made-on date. */
  private set(patch: Partial<Draft>) {
    const next = { ...this.draft, ...patch };
    if (
      !this.canning &&
      !("expires_on" in patch) &&
      this.draft.expires_on === this.proposal(this.draft)
    )
      next.expires_on = this.proposal(next);
    this.draft = next;
  }

  private errors() {
    const d = this.draft;
    const e: Record<string, string> = {};
    if (dateInvalid(d.expiresBad, d.expires_on)) e.expires_on = t("valid.date");
    if (!this.canning) {
      if (!d.made_on || dateInvalid(d.madeBad, d.made_on)) e.made_on = t("valid.date");
      if (!d.dish.trim()) e.dish = t("valid.required");
      if (d.servings == null || !Number.isInteger(d.servings) || d.servings < 1 || d.servings > 99)
        e.servings = t("valid.packages");
      if (!this.cat("default_location_id") && d.location_id == null)
        e.location = t("valid.location");
    }
    return e;
  }

  private async save(ev: Event) {
    ev.preventDefault();
    if (Object.keys(this.errors()).length) return;
    const d = this.draft;
    const notes = d.notes.trim() || null;
    const expires_on = d.expires_on || null;
    const name = d.dish.trim();
    // a dish recipe by its exact name is linked (and gives the product its name)
    const recipe = this.recipes.find((r) => r.name === name);
    try {
      const res = this.canning
        ? await saveCanning(this.hass!, {
            id: this.canning.id,
            recipe_id: this.canning.recipe_id,
            expires_on,
            notes,
          })
        : await storeLeftovers(this.hass!, {
            ...(recipe ? { recipe_id: recipe.id } : { dish: name }),
            servings: d.servings,
            made_on: d.made_on,
            location_id: d.location_id,
            expires_on,
            notes,
          });
      this.renderRoot.querySelector("dialog")?.close();
      this.dispatchEvent(
        new CustomEvent("home-inventory-saved", {
          detail: this.canning ? undefined : { ...res, jars: d.servings },
          bubbles: true,
          composed: true,
        }),
      );
    } catch (err) {
      this.error = await errorMessage(this.hass!, err);
    }
  }

  /** Dish, made on, servings, location: only for a new charge (the labels carry them). */
  private newFields(e: Record<string, string>) {
    const d = this.draft;
    if (this.canning)
      return html`<p class="detail" data-testid="leftover-fixed">
        ${t("leftovers.fixed", { charge: this.canning.charge, name: d.dish, jars: d.servings ?? "" })}
      </p>`;
    return html`<label>
        <span class="lbl">${t("leftovers.dish")}</span>
        <input
          list="leftover-dishes"
          data-testid="leftover-dish"
          aria-invalid=${!!e.dish}
          .value=${d.dish}
          @input=${(ev: Event) => this.set({ dish: (ev.target as HTMLInputElement).value })}
        />
        <datalist id="leftover-dishes">
          ${this.recipes.map((r) => html`<option value=${r.name}></option>`)}
        </datalist>
        ${fieldMsg(e.dish, "leftover-dish")}
      </label>
      ${dateInput({
        testid: "leftover-made_on",
        label: t("canning.made_on"),
        value: d.made_on,
        err: e.made_on,
        onChange: (v, bad) => this.set({ made_on: v, madeBad: bad }),
      })}
      ${numField({
        testid: "leftover-servings",
        label: t("leftovers.jars"),
        unit: "",
        value: d.servings,
        err: e.servings,
        onChange: (v) => this.set({ servings: v }),
      })}
      <label>
        <span class="lbl">${t("book.location")}</span>
        ${inheritSelect({
          testid: "leftover-location",
          own: d.location_id,
          dflt: this.cat("default_location_id"),
          options: (this.md?.locations ?? []).map((l) => [l.id, l.name]),
          numeric: true,
          invalid: !!e.location,
          onChange: (v) => this.set({ location_id: v as number | null }),
        })}
        ${fieldMsg(e.location, "leftover-location")}
      </label>`;
  }

  render() {
    if (!this.active) return html`<dialog></dialog>`;
    const e = this.errors();
    const d = this.draft;
    const shelf = d.expires_on && d.expires_on === this.proposal(d) ? this.days(d) : undefined;
    return editDialog({
      title: this.canning
        ? t("common.edit_name", { name: this.canning.charge })
        : t("leftovers.add_title"),
      body: html`${this.newFields(e)}
        ${dateInput({
          testid: "leftover-expires_on",
          label: t("canning.expires_on"),
          value: d.expires_on,
          err: e.expires_on,
          onChange: (v, bad) => this.set({ expires_on: v, expiresBad: bad }),
        })}
        ${shelf ? html`<span class="detail">${t("book.shelf_hint", { days: String(shelf.value), source: shelf.source })}</span>` : nothing}
        <label>
          <span class="lbl">${t("canning.notes")}</span>
          <textarea
            rows="3"
            data-testid="leftover-notes"
            .value=${d.notes}
            @input=${(ev: Event) => this.set({ notes: (ev.target as HTMLTextAreaElement).value })}
          ></textarea>
        </label>`,
      error: this.error,
      invalid: Object.keys(e).length > 0,
      submit: { label: t("common.save"), testid: "leftover-save" },
      dirty: () => JSON.stringify(this.draft) !== this.initial,
      onSubmit: (ev) => this.save(ev),
      onClosed: () => (this.active = false),
    });
  }

  static styles = formStyles;
}

customElements.define("home-inventory-leftover-dialog", HomeInventoryLeftoverDialog);
