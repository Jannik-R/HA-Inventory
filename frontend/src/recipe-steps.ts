import { html, nothing, type TemplateResult } from "lit";
import type { Step } from "./api";

/** Editor rows: a heading row heads the steps after it (stored as `section` of the next step). */
export interface StepRow {
  kind: "step" | "head";
  text: string;
}

export const MAX_STEP = 2000;
export const MAX_HEAD = 100;

export const toRows = (steps: Step[]): StepRow[] =>
  steps.flatMap((s) => [
    ...(s.section ? [{ kind: "head" as const, text: s.section }] : []),
    { kind: "step" as const, text: s.text },
  ]);

/** Old recipes: their free text split at blank lines, edited as steps from now on. */
export const rowsFromText = (text: string | null): StepRow[] =>
  (text ?? "")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => ({ kind: "step", text: p }));

/** Rows back to steps; empty rows and a heading without a step after it are dropped. */
export const toSteps = (rows: StepRow[]) => {
  const out: { section: string | null; text: string }[] = [];
  let head: string | null = null;
  for (const r of rows) {
    const text = r.text.trim();
    if (!text) continue;
    if (r.kind === "head") head = text;
    else {
      out.push({ section: head, text });
      head = null;
    }
  }
  return out;
};

/** Steps numbered across sections: each section is its own list, numbering runs on. */
export const stepList = (steps: Step[], item: (s: Step, n: number) => unknown = (s) => s.text) => {
  const blocks: { section: string | null; first: number; steps: Step[] }[] = [];
  steps.forEach((s, n) => {
    if (s.section || !blocks.length) blocks.push({ section: s.section, first: n, steps: [] });
    blocks[blocks.length - 1].steps.push(s);
  });
  return html`${blocks.map(
    (b) =>
      html`${b.section ? html`<h4 class="section">${b.section}</h4>` : nothing}
        <ol class="steps" start=${b.first + 1}>
          ${b.steps.map(
            (s, k) =>
              html`<li data-testid="recipe-step">${item(s, b.first + k) as TemplateResult}</li>`,
          )}
        </ol>`,
  )}`;
};
