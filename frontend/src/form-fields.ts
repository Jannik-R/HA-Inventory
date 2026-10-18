import { html } from "lit";
import { fieldMsg, numOrNull } from "./ui";

/** Labeled whole-number input (min 1) with its unit after it and the live error below. */
export const numField = (o: {
  testid: string;
  label: string;
  unit: string;
  value: number | null;
  err?: string;
  onChange: (v: number | null) => void;
}) =>
  html`<label>
    <span class="lbl">${o.label}</span>
    <span class="num">
      <input
        type="number"
        min="1"
        step="1"
        inputmode="numeric"
        data-testid=${o.testid}
        aria-invalid=${!!o.err}
        .value=${String(o.value ?? "")}
        @input=${(ev: Event) => o.onChange(numOrNull((ev.target as HTMLInputElement).value))}
      />
      ${o.unit}
    </span>
    ${fieldMsg(o.err, o.testid)}
  </label>`;

/** Labeled date input (2000-2099); `bad`: the browser holds incomplete input (value is then ""). */
export const dateInput = (o: {
  testid: string;
  label: string;
  value: string;
  err?: string;
  onChange: (value: string, bad: boolean) => void;
}) =>
  html`<label>
    <span class="lbl">${o.label}</span>
    <input
      type="date"
      min="2000-01-01"
      max="2099-12-31"
      data-testid=${o.testid}
      aria-invalid=${!!o.err}
      .value=${o.value}
      @input=${(ev: Event) => {
        const el = ev.target as HTMLInputElement;
        o.onChange(el.value, el.validity.badInput);
      }}
    />
    ${fieldMsg(o.err, o.testid)}
  </label>`;
