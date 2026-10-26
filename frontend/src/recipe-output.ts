import { html } from "lit";
import { mdiDownload, mdiPrinter } from "@mdi/js";
import { t } from "./i18n";
import { errorMessage, exportRecipes, type Hass, type Recipe } from "./api";
import { saveJson } from "./download";
import { icon } from "./ui";

const fileName = (name: string) =>
  `${name.replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-|-$/g, "") || "recipe"}.json`;

/** schema.org Recipe JSON-LD of one recipe, or of all (`rezepte`: a list). Errors go to `onError`. */
export const downloadRecipes = async (hass: Hass, onError: (m: string) => void, r?: Recipe) => {
  try {
    saveJson(await exportRecipes(hass, r?.id), r ? fileName(r.name) : t("recipes.export_all_file"));
  } catch (err) {
    onError(await errorMessage(hass, err));
  }
};

const PRINT_STYLE = `
@media screen { #hi-print { display: none; } }
@media print {
  body > * { display: none !important; }
  body > #hi-print { display: block !important; color: #000; background: #fff; font: 12pt/1.4 sans-serif; }
  #hi-print h1 { font-size: 20pt; margin: 0 0 4pt; }
  #hi-print h2 { font-size: 14pt; margin: 14pt 0 4pt; }
  #hi-print h3 { font-size: 12pt; margin: 8pt 0 2pt; }
  #hi-print li { break-inside: avoid; margin-bottom: 3pt; }
}`;

/** Browser print dialog (also "save as PDF"): the recipe goes into a block that is the only thing
 * visible in print, because HA's own sidebar and header live outside the panel's shadow DOM. */
export const printRecipeSheet = (r: Recipe, servings: number, ingredients: string[]) => {
  const el = (tag: string, text?: string, parent?: Node) => {
    const e = document.createElement(tag);
    if (text) e.textContent = text;
    parent?.appendChild(e);
    return e;
  };
  document.getElementById("hi-print")?.remove();
  const root = el("div");
  root.id = "hi-print";
  el("style", PRINT_STYLE, root);
  el("h1", r.name, root);
  el("p", `${t("recipes.servings")}: ${servings}`, root);
  el("h2", t("recipes.ingredients"), root);
  const ul = el("ul", undefined, root);
  ingredients.forEach((line) => el("li", line, ul));
  if (r.steps.length) {
    el("h2", t("recipes.instructions"), root);
    let ol = el("ol", undefined, root);
    let n = 0;
    r.steps.forEach((s) => {
      if (s.section) {
        el("h3", s.section, root);
        ol = el("ol", undefined, root);
        ol.setAttribute("start", String(n + 1));
      }
      el("li", s.text, ol);
      n++;
    });
  } else if (r.instructions) {
    el("h2", t("recipes.instructions"), root);
    r.instructions
      .split("\n")
      .filter((p) => p.trim())
      .forEach((p) => el("p", p, root));
  }
  if (r.source_url) el("p", `${t("recipes.source")}: ${r.source_url}`, root);
  document.body.appendChild(root);
  window.addEventListener("afterprint", () => root.remove(), { once: true });
  try {
    window.print();
  } finally {
    root.remove(); // print() blocks until the dialog closes in most browsers
  }
};

/** "Alle Rezepte exportieren": a secondary button in the list bar. */
export const exportAllButton = (hass: Hass, onError: (m: string) => void) =>
  html`<button data-testid="recipe-export-all" @click=${() => downloadRecipes(hass, onError)}>
    ${t("recipes.export_all")}
  </button>`;

/** "JSON herunterladen" and "Drucken / PDF" for one recipe; both differ from the receipt printer. */
export const recipeOutputButtons = (o: {
  hass: Hass;
  recipe: Recipe;
  servings: number;
  ingredients: string[];
  onError: (m: string) => void;
}) =>
  html`<button
      type="button"
      data-testid="recipe-export"
      @click=${() => downloadRecipes(o.hass, o.onError, o.recipe)}
    >
      ${icon(mdiDownload)} ${t("recipes.export")}
    </button>
    <button
      type="button"
      data-testid="recipe-print-browser"
      @click=${() => printRecipeSheet(o.recipe, o.servings, o.ingredients)}
    >
      ${icon(mdiPrinter)} ${t("recipes.print_pdf")}
    </button>`;
