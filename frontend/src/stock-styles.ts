import { css } from "lit";

/** Product rows, their batch rows and the expiry colors of the stock view. */
export const stockStyles = css`
  li.item {
    flex-direction: column;
    align-items: stretch;
  }
  .head {
    display: flex;
    align-items: center;
  }
  .head .row {
    padding-left: 0;
  }
  /* On a phone the row actions wrap to their own line, right-aligned. */
  .batches li {
    flex-wrap: wrap;
    gap: 4px 12px;
    padding: 0 0 0 36px;
    border-bottom: 0;
  }
  .batches .detail {
    flex: 1;
  }
  .batches .acts {
    display: flex;
    margin-left: auto;
  }
  .expired {
    color: var(--error-color);
  }
  .soon {
    color: var(--warning-color);
  }
`;
