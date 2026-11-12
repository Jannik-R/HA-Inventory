import { LitElement, css, html, nothing } from "lit";
import { mdiUndo } from "@mdi/js";
import { t } from "./i18n";
import { fieldMsg, icon, loadingLine } from "./ui";
import { formStyles } from "./styles";
import { fmtDateTime, fmtNumber } from "./format";
import { confirmDialog } from "./confirm-dialog";
import { errorMessage, type Hass } from "./api";
import {
  getHistory,
  historyUndo,
  type History,
  type HistoryAction,
  type HistoryRow,
} from "./api-history";

const PAGE = 100;

/** The booking log as actions, newest first, with filters; undo takes back a whole action. */
export class HomeInventoryHistory extends LitElement {
  static properties = {
    hass: { attribute: false },
    data: { state: true },
    name: { state: true },
    user: { state: true },
    from: { state: true },
    to: { state: true },
    offset: { state: true },
    error: { state: true },
  };

  declare hass?: Hass;
  declare data?: History;
  declare name: string;
  declare user: string;
  declare from: string;
  declare to: string;
  declare offset: number;
  declare error: string;
  private started = false;

  constructor() {
    super();
    this.name = this.user = this.from = this.to = this.error = "";
    this.offset = 0;
  }

  willUpdate() {
    if (this.hass && !this.started) {
      this.started = true; // once: `hass` changes on every state event
      this.load().then(() =>
        this.renderRoot.querySelector<HTMLInputElement>("[data-testid=history-name]")?.focus(),
      );
    }
  }

  private get rangeError() {
    return this.from && this.to && this.from > this.to ? t("history.range_error") : undefined;
  }

  private async load() {
    if (this.rangeError) return; // live error under the field; no load until fixed
    try {
      this.data = await getHistory(this.hass!, {
        name: this.name,
        user_id: this.user,
        date_from: this.from,
        date_to: this.to,
        offset: this.offset,
      });
      this.error = "";
    } catch (err) {
      this.error = await errorMessage(this.hass!, err);
    }
  }

  private filter(set: () => void) {
    set();
    this.offset = 0;
    this.load();
  }

  private page(delta: number) {
    this.offset = Math.max(0, this.offset + delta * PAGE);
    this.load();
  }

  private userName(id: string | null) {
    return this.data?.users.find((u) => u.id === id)?.name ?? "";
  }

  private line(r: HistoryRow) {
    const n = fmtNumber(this.hass, r.packages);
    const sign = r.kind === "correct" && r.packages > 0 ? `+${n}` : n; // a correction is signed
    const where = r.to_location ? `${r.location} → ${r.to_location}` : (r.location ?? "");
    return html`<span class="name">${r.name}</span> · ${t(`history.kind.${r.kind}`)} ·
      ${t("history.packages", { n: sign })}${where ? html` · ${where}` : nothing}`;
  }

  private async undo(a: HistoryAction) {
    const ok = await confirmDialog({
      title: t("history.undo_title", { date: fmtDateTime(this.hass, a.ts) }),
      message: t("history.undo_message"),
      body: html`<ul class="impact">
        ${a.rows.filter((r) => !r.undone_at).map((r) => html`<li>${this.line(r)}</li>`)}
        ${a.more_rows ? html`<li>${t("history.more_rows", { n: a.more_rows })}</li>` : nothing}
      </ul>`,
      action: t("stock.undo"),
    });
    if (!ok) return;
    try {
      await historyUndo(this.hass!, a.action_id);
      this.error = "";
    } catch (err) {
      this.error = await errorMessage(this.hass!, err);
    }
    await this.load();
  }

  private undoneLine(a: HistoryAction) {
    if (!a.undone_at) return a.partly ? t("history.partly") : "";
    const date = fmtDateTime(this.hass, a.undone_at);
    const user = this.userName(a.undone_by);
    return user ? t("history.undone_by", { date, user }) : t("history.undone", { date });
  }

  private action(a: HistoryAction) {
    const who = this.userName(a.user_id);
    const note = this.undoneLine(a);
    return html`<li data-testid="history-action">
      <div class="head">
        <span class="when ${a.undone_at ? "struck" : ""}"
          >${fmtDateTime(this.hass, a.ts)}${who ? ` · ${who}` : ""}</span
        >
        ${
          a.undone_at
            ? nothing
            : html`<button
                class="icon-btn"
                data-testid="history-undo"
                aria-label=${t("stock.undo")}
                title=${t("stock.undo")}
                @click=${() => this.undo(a)}
              >
                ${icon(mdiUndo)}
              </button>`
        }
      </div>
      ${a.rows.map(
        (r) =>
          html`<div data-testid="history-row" class=${a.undone_at || r.undone_at ? "struck" : ""}>
            ${this.line(r)}
          </div>`,
      )}
      ${
        a.more_rows
          ? html`<div class="when" data-testid="history-more-rows">
              ${t("history.more_rows", { n: a.more_rows })}
            </div>`
          : nothing
      }
      ${note ? html`<div class="when" data-testid="history-undone">${note}</div>` : nothing}
    </li>`;
  }

  private field(
    label: string,
    testid: string,
    value: string,
    set: (v: string) => void,
    type = "text",
  ) {
    return html`<label
      >${label}
      <input
        type=${type}
        data-testid=${testid}
        .value=${value}
        @change=${(e: Event) => this.filter(() => set((e.target as HTMLInputElement).value.trim()))}
      />
    </label>`;
  }

  render() {
    const d = this.data;
    return html`<div class="filters">
        ${this.field(t("history.name"), "history-name", this.name, (v) => (this.name = v))}
        <label
          >${t("history.user")}
          <select
            data-testid="history-user"
            @change=${(e: Event) =>
              this.filter(() => (this.user = (e.target as HTMLSelectElement).value))}
          >
            <option value="" .selected=${!this.user}>${t("history.all_users")}</option>
            ${(d?.users ?? []).map(
              (u) => html`<option value=${u.id} .selected=${u.id === this.user}>${u.name}</option>`,
            )}
          </select>
        </label>
        ${this.field(t("history.from"), "history-from", this.from, (v) => (this.from = v), "date")}
        ${this.field(t("history.to"), "history-to", this.to, (v) => (this.to = v), "date")}
        ${fieldMsg(this.rangeError, "history-range")}
      </div>
      ${this.error ? html`<p class="error" role="alert">${this.error}</p>` : nothing}
      ${!d && !this.error ? loadingLine() : nothing}
      ${d && !d.actions.length ? html`<p class="empty">${t("history.empty")}</p>` : nothing}
      <ul>
        ${(d?.actions ?? []).map((a) => this.action(a))}
      </ul>
      <div class="pager">
        <button
          data-testid="history-newer"
          ?disabled=${this.offset === 0}
          @click=${() => this.page(-1)}
        >
          ${t("history.newer")}
        </button>
        <button data-testid="history-older" ?disabled=${!d?.more} @click=${() => this.page(1)}>
          ${t("history.older")}
        </button>
      </div>`;
  }

  static styles = [
    formStyles,
    css`
      .filters {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 8px;
        margin-bottom: 8px;
      }
      .filters .field-error {
        grid-column: 1 / -1;
      }
      ul {
        list-style: none;
        margin: 0;
        padding: 0;
      }
      li {
        padding: 8px 0;
        border-bottom: 1px solid var(--divider-color);
      }
      .head {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .when {
        color: var(--secondary-text-color);
      }
      .name {
        font-weight: 500;
      }
      .struck {
        text-decoration: line-through;
      }
      .pager {
        display: flex;
        justify-content: space-between;
        margin-top: 12px;
      }
    `,
  ];
}

customElements.define("home-inventory-history", HomeInventoryHistory);
