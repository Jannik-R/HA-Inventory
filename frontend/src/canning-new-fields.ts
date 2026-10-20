import { html } from "lit";
import { t } from "./i18n";
import { fieldMsg } from "./ui";
import { inheritSelect, type Dflt } from "./inherit";
import { productInput } from "./product-input";
import { pt, type Preserve } from "./preserve";
import type { Hass, MasterData, Product, Recipe } from "./api";
import type { Canning } from "./api-canning";

export interface Draft {
  made_on: string;
  name: string;
  category_id: number | null;
  recipe_id: number | null;
  jars: number | null;
  location_id: number | null;
  expires_on: string;
  temp: number | null;
  minutes: number | null;
  notes: string;
  dateBad: boolean;
}

/** Fields of a new protocol (recipe, made on, product, jars, location); an existing one shows
 *  what stays fixed. */
export function newFields(o: {
  kind: Preserve;
  canning?: Canning;
  draft: Draft;
  recipes: Recipe[];
  hass?: Hass;
  md?: MasterData;
  products: Product[];
  e: Record<string, string>;
  /** Inherited location of the product. */
  location?: Dflt;
  set: (patch: Partial<Draft>) => void;
  pickRecipe: (id: number | null) => void;
  madeOn: unknown;
  jars: unknown;
}) {
  const d = o.draft;
  const e = o.e;
  if (o.canning)
    return html`<p class="detail" data-testid="canning-fixed">
      ${pt(o.kind, "fixed", { charge: o.canning.charge, name: d.name, jars: d.jars ?? "" })}
    </p>`;
  const recipe = o.recipes.find((r) => r.id === d.recipe_id);
  return html`<label>
      <span class="lbl">${pt(o.kind, "recipe")}</span>
      <select
        data-testid="canning-recipe"
        @change=${(ev: Event) => {
          const v = (ev.target as HTMLSelectElement).value;
          o.pickRecipe(v ? Number(v) : null);
        }}
      >
        <option value="" .selected=${d.recipe_id == null}>${t("common.none")}</option>
        ${o.recipes.map(
          (r) => html`<option value=${r.id} .selected=${r.id === d.recipe_id}>${r.name}</option>`,
        )}
      </select>
    </label>
    ${o.madeOn}
    ${
      recipe
        ? html`<p class="detail" data-testid="canning-recipe-product">
            ${pt(o.kind, "recipe_product", { name: recipe.canning_product ?? "" })}
          </p>`
        : productInput({
            testid: "canning",
            label: t("canning.product"),
            hass: o.hass,
            md: o.md,
            products: o.products,
            name: d.name,
            categoryId: d.category_id,
            err: e,
            onName: (name) => o.set({ name }),
            onCategory: (category_id) => o.set({ category_id }),
          })
    }
    ${o.jars}
    <label>
      <span class="lbl">${t("book.location")}</span>
      ${inheritSelect({
        testid: "canning-location",
        own: d.location_id,
        dflt: o.location,
        options: (o.md?.locations ?? []).map((l) => [l.id, l.name]),
        numeric: true,
        invalid: !!e.location,
        onChange: (v) => o.set({ location_id: v as number | null }),
      })}
      ${fieldMsg(e.location, "canning-location")}
    </label>`;
}
