import { css } from "lit";

/** Layout of one shopping row: the name is cut off, the amount never; refs wrap below. */
export const rowStyles = css`
  .what {
    display: flex;
    flex-wrap: wrap; /* refs go below the name when the line is narrow */
    align-items: baseline;
    column-gap: 8px;
    min-width: 0;
  }
  .line {
    display: flex;
    min-width: 0;
    max-width: 100%;
    white-space: nowrap;
  }
  .name {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis; /* only the name is cut off, never the amount */
  }
  .amt {
    flex: none;
  }
  .refs {
    display: flex;
    flex-wrap: wrap;
    gap: 0 8px;
    font-size: 0.85em;
    color: var(--secondary-text-color);
  }
  .refs > span {
    white-space: nowrap;
  }
  .unknown {
    flex: none;
  }
  .done .line {
    text-decoration: line-through;
    color: var(--secondary-text-color);
  }
`;
