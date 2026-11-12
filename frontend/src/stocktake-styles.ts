import { css } from "lit";
import { formStyles } from "./styles";
import { doneStyles } from "./booking-done";

/** Count rows, steppers and the pick line of the stocktaking view. */
export const stocktakeStyles = [
  formStyles,
  doneStyles,
  css`
    ul {
      list-style: none;
      margin: 0;
      padding: 0;
    }
    li {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 8px;
      padding: 6px 0;
      border-bottom: 1px solid var(--divider-color);
    }
    li .field-error {
      flex-basis: 100%;
    }
    .what {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-width: 0;
    }
    .count {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      white-space: nowrap;
    }
    .acts {
      display: flex;
    }
    .pick {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 8px;
      margin: 8px 0;
    }
    h3 {
      font-size: 1em;
      margin: 16px 0 4px;
    }
    .actions {
      display: flex;
      justify-content: flex-end;
      margin-top: 12px;
    }
  `,
];
