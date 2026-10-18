import { LitElement, css, html } from "lit";
import { mdiArrowDown, mdiArrowUp, mdiClose } from "@mdi/js";
import { t } from "./i18n";
import { fieldMsg, icon } from "./ui";
import { formStyles } from "./styles";
import { MAX_HEAD, MAX_STEP, type StepRow } from "./recipe-steps";

/** Field error of a step / heading row (too long). */
export const stepRowError = (r: StepRow) =>
  r.text.length > (r.kind === "head" ? MAX_HEAD : MAX_STEP)
    ? t("valid.too_long", { n: r.kind === "head" ? MAX_HEAD : MAX_STEP })
    : undefined;

/** Steps of a recipe as rows (step / heading): add, move, remove. Fires `change` with the rows. */
export class PantryRecipeSteps extends LitElement {
  static properties = { value: { attribute: false } };
  declare value: StepRow[];

  constructor() {
    super();
    this.value = [];
  }

  private emit(rows: StepRow[]) {
    this.dispatchEvent(new CustomEvent("change", { detail: rows }));
  }

  private async add(kind: StepRow["kind"]) {
    this.emit([...this.value, { kind, text: "" }]);
    await this.updateComplete;
    this.renderRoot
      .querySelector<HTMLElement>("li:last-child textarea, li:last-child input")
      ?.focus();
  }

  private move(n: number, by: number) {
    const rows = [...this.value];
    [rows[n], rows[n + by]] = [rows[n + by], rows[n]];
    this.emit(rows);
  }

  private btn(testid: string, label: string, path: string, onClick: () => void, disabled = false) {
    return html`<button
      type="button"
      class="icon-btn"
      data-testid=${testid}
      aria-label=${label}
      title=${label}
      ?disabled=${disabled}
      @click=${onClick}
    >
      ${icon(path)}
    </button>`;
  }

  render() {
    let no = 0;
    const last = this.value.length - 1;
    return html`<span class="lbl">${t("recipes.instructions")}</span>
      <ol>
        ${this.value.map((r, n) => {
          const label =
            r.kind === "head" ? t("recipes.steps.head") : t("recipes.steps.step", { n: ++no });
          const err = stepRowError(r);
          const set = (e: Event) =>
            this.emit(
              this.value.map((x, k) =>
                k === n ? { ...x, text: (e.target as HTMLInputElement).value } : x,
              ),
            );
          return html`<li class=${r.kind}>
            <div class="row">
              <span class="no" aria-hidden="true">${r.kind === "head" ? "" : `${no}.`}</span>
              ${
                r.kind === "head"
                  ? html`<input
                      data-testid="step-head"
                      aria-label=${label}
                      placeholder=${label}
                      aria-invalid=${!!err}
                      .value=${r.text}
                      @input=${set}
                    />`
                  : html`<textarea
                      rows="2"
                      data-testid="step-text"
                      aria-label=${label}
                      aria-invalid=${!!err}
                      .value=${r.text}
                      @input=${set}
                    ></textarea>`
              }
              ${this.btn("step-up", t("recipes.steps.up"), mdiArrowUp, () => this.move(n, -1), n === 0)}
              ${this.btn("step-down", t("recipes.steps.down"), mdiArrowDown, () => this.move(n, 1), n === last)}
              ${this.btn("step-remove", t("recipes.steps.remove"), mdiClose, () =>
                this.emit(this.value.filter((_, k) => k !== n)),
              )}
            </div>
            ${fieldMsg(err, `step-${n}`)}
          </li>`;
        })}
      </ol>
      <p class="adds">
        <button type="button" data-testid="step-add" @click=${() => this.add("step")}>
          ${t("recipes.steps.add")}
        </button>
        <button type="button" data-testid="step-head-add" @click=${() => this.add("head")}>
          ${t("recipes.steps.head_add")}
        </button>
      </p>`;
  }

  static styles = [
    formStyles,
    css`
      ol {
        list-style: none;
        margin: 0;
        padding: 0;
      }
      .row {
        display: flex;
        align-items: flex-start;
        gap: 4px;
        margin: 4px 0;
      }
      .no {
        flex: none;
        width: 2em;
        padding-top: 8px;
        text-align: right;
        color: var(--secondary-text-color);
      }
      textarea,
      input {
        flex: 1;
        min-width: 0;
        font: inherit;
        box-sizing: border-box;
        padding: 8px;
        color: var(--primary-text-color);
        background: var(--card-background-color, var(--primary-background-color));
        border: 1px solid var(--divider-color);
        border-radius: 4px;
      }
      li.head input {
        font-weight: 500;
      }
      .adds {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
    `,
  ];
}

customElements.define("pantry-recipe-steps", PantryRecipeSteps);
