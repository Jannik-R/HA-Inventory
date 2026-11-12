import { css } from "lit";

/** Full-screen layout, ingredient and step lists, and timer chips of the cooking view. */
export const cookStyles = css`
  dialog {
    width: 100vw;
    max-width: 100vw;
    height: 100dvh;
    max-height: 100dvh;
    margin: 0;
    box-sizing: border-box;
    padding: 16px 16px 96px;
    border: none;
    overflow-y: auto;
  }
  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }
  h2 {
    margin: 0;
  }
  h3,
  h4 {
    margin: 16px 0 4px;
    font-size: 1em;
    font-weight: 500;
  }
  .ings,
  ol {
    max-width: 720px;
  }
  ol {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .no {
    display: inline-block;
    min-width: 1.6em;
    font-weight: 500;
  }
  .ings li {
    padding: 2px 0;
  }
  ol li {
    margin: 8px 0;
  }
  .step {
    display: block;
    width: 100%;
    text-align: left;
    font: inherit;
    font-size: 1.1em;
    line-height: 1.5;
    padding: 6px 8px;
    color: var(--primary-text-color);
    background: none;
    border: 1px solid transparent;
    border-radius: 4px;
    cursor: pointer;
  }
  .step.done {
    color: var(--secondary-text-color);
    text-decoration: line-through;
  }
  .timer-btn {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    margin: 2px 8px 0 8px;
  }
  .timers {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 8px 16px;
    padding: 8px 16px;
    background: var(--card-background-color, var(--primary-background-color));
    border-top: 1px solid var(--divider-color);
  }
  .timer {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }
  .timer.over strong {
    color: var(--error-color);
  }
  .detail {
    color: var(--secondary-text-color);
  }
`;
