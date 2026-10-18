import { html, nothing } from "lit";
import { t } from "./i18n";
import type { AiCheck, Ingredient, MasterData } from "./api";
import { toRows, toSteps, type StepRow } from "./recipe-steps";

/** AI check of an import in the recipe dialog. */
export type AiState =
  | { kind: "none" }
  | { kind: "running" }
  | { kind: "ok" }
  | { kind: "skipped" }
  | { kind: "failed"; message: string }
  | { kind: "changed"; ingredients: number; prevSteps?: StepRow[] };

/** What goes to the AI: the draft as the user sees it now (bounded by the backend). */
export const aiDraft = (
  name: string,
  servings: number | null,
  rows: StepRow[],
  ings: Ingredient[],
) => ({
  name: name.trim() || "-",
  servings: servings ?? 1,
  steps: toSteps(rows),
  ingredients: ings.map((i) => ({
    category_id: i.category_id,
    amount: i.amount,
    unit_id: i.unit_id,
    text: i.text.slice(0, 200),
    note: i.note ?? null,
    line: i.line ?? null,
    learned: !!i.learned,
  })),
});

/** Apply the AI answer to the current draft. Rows are matched by their import line, so edits
 * made while waiting stay; steps change only when they are still as sent. */
export const applyAi = (
  res: Extract<AiCheck, { status: "changes" }>,
  sent: Ingredient[],
  sentRows: StepRow[],
  cur: { ingredients: Ingredient[]; steps: StepRow[] },
  md: MasterData,
) => {
  const ingredients = [...cur.ingredients];
  let changed = 0;
  for (const c of res.ingredients) {
    const was = sent[c.index];
    const k = ingredients.findIndex(
      (i) => was && i.line === was.line && i.source_text === was.source_text,
    );
    if (k < 0 || ingredients[k].category_id !== was.category_id) continue; // user changed it
    const cat = md.categories.find((x) => x.id === c.category_id);
    ingredients[k] = {
      ...ingredients[k],
      category_id: c.category_id,
      text: cat?.name ?? ingredients[k].source_text ?? ingredients[k].text,
      ai: { before: was.category_id, beforeText: was.text, reason: c.reason },
    };
    changed++;
  }
  const keepSteps = JSON.stringify(cur.steps) === JSON.stringify(sentRows);
  const steps = res.steps && keepSteps ? toRows(res.steps) : cur.steps;
  const state: AiState = {
    kind: "changed",
    ingredients: changed,
    prevSteps: steps !== cur.steps ? cur.steps : undefined,
  };
  return {
    ingredients,
    steps,
    state: changed || state.prevSteps ? state : ({ kind: "ok" } as AiState),
  };
};

/** Status line above the form while / after the AI checks an import. */
export const aiBanner = (s: AiState, o: { onSkip: () => void; onUndoSteps: () => void }) => {
  switch (s.kind) {
    case "running":
      return html`<div class="ai" role="status" data-testid="ai-status">
        <progress aria-label=${t("recipes.ai.running")}></progress>
        <span>${t("recipes.ai.running")}</span>
        <button type="button" data-testid="ai-skip" @click=${o.onSkip}>
          ${t("recipes.ai.skip")}
        </button>
      </div>`;
    case "ok":
      return html`<p class="ai" role="status" data-testid="ai-status">${t("recipes.ai.ok")}</p>`;
    case "skipped":
      return html`<p class="ai" role="status" data-testid="ai-status">
        ${t("recipes.ai.skipped")}
      </p>`;
    case "failed":
      return html`<p class="ai error" role="alert" data-testid="ai-status">${s.message}</p>`;
    case "changed":
      return html`<div class="ai" role="status" data-testid="ai-status">
        ${
          s.ingredients
            ? html`<span
                >${
                  s.ingredients === 1
                    ? t("recipes.ai.changed_one")
                    : t("recipes.ai.changed_many", { n: s.ingredients })
                }</span
              >`
            : nothing
        }
        ${
          s.prevSteps
            ? html`<span>${t("recipes.ai.steps")}</span>
                <button type="button" data-testid="ai-undo-steps" @click=${o.onUndoSteps}>
                  ${t("recipes.ai.undo_steps")}
                </button>`
            : nothing
        }
      </div>`;
    default:
      return nothing;
  }
};
