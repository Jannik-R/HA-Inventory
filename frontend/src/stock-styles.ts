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
  .batches li {
    gap: 12px;
    padding: 0 0 0 36px;
    border-bottom: 0;
  }
  .batches .detail {
    flex: 1;
  }
  .expired {
    color: var(--error-color);
  }
  .soon {
    color: var(--warning-color);
  }
`;
