import { LitElement, css, html, nothing } from "lit";
import { t } from "./i18n";
import { formStyles } from "./styles";
import { errorMessage, type Hass } from "./api";
import {
  exportCsv,
  importCsv,
  importGrocy,
  type TransferKind,
  type TransferReport,
} from "./api-transfer";
import { confirmDialog } from "./confirm-dialog";
import { saveCsv } from "./download";
import { previewBody } from "./transfer-preview";

type Source = TransferKind | "grocy";
const SOURCES: Source[] = ["products", "stock", "grocy"];

/** Files are UTF-8 (Excel's "CSV UTF-8"); older Excel exports are Windows-1252. */
const readText = async (file: File) => {
  const bytes = await file.arrayBuffer();
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    return new TextDecoder("windows-1252").decode(bytes);
  }
};

/** Settings > Import / Export: CSV export of products and stock, CSV and Grocy import with a preview. */
class HomeInventoryTransfer extends LitElement {
  static properties = {
    hass: { attribute: false },
    source: { state: true },
    error: { state: true },
    info: { state: true },
    busy: { state: true },
  };
  declare hass?: Hass;
  declare source: Source;
  declare error: string;
  declare info: string;
  declare busy: boolean;

  constructor() {
    super();
    this.source = "products";
    this.error = this.info = "";
    this.busy = false;
  }

  private async guard(fn: () => Promise<void>) {
    this.error = this.info = "";
    this.busy = true;
    try {
      await fn();
    } catch (err) {
      this.error = await errorMessage(this.hass!, err);
    } finally {
      this.busy = false;
    }
  }

  private export(kind: TransferKind) {
    return this.guard(async () => {
      const ok = await confirmDialog({
        title: t(`transfer.export.${kind}`),
        message: t("transfer.export.notice"),
        action: t("transfer.export.action"),
      });
      if (!ok) return;
      const { csv } = await exportCsv(this.hass!, kind);
      saveCsv(csv, `${t(`transfer.file_name.${kind}`)}-${this.today()}.csv`);
    });
  }

  /** Local date as YYYY-MM-DD (digits per locale), safe in file names. */
  private today() {
    const parts = new Intl.DateTimeFormat(this.hass!.locale?.language ?? this.hass!.language, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(new Date());
    const get = (type: string) => parts.find((p) => p.type === type)!.value;
    return `${get("year")}-${get("month")}-${get("day")}`;
  }

  private run(files: string[], apply: boolean): Promise<TransferReport> {
    return this.source === "grocy"
      ? importGrocy(this.hass!, files, apply)
      : importCsv(this.hass!, this.source, files[0], apply);
  }

  private async pick(e: Event) {
    const input = e.target as HTMLInputElement;
    const picked = [...(input.files ?? [])];
    if (!picked.length) return;
    await this.guard(async () => {
      const files = await Promise.all(picked.map(readText));
      const preview = await this.run(files, false);
      if (!preview.rows.length) {
        this.info = t("transfer.none");
        return;
      }
      const ok = await confirmDialog({
        title: t("transfer.review"),
        body: previewBody(preview),
        action: t("transfer.apply"),
      });
      if (!ok) return;
      const done = await this.run(files, true);
      this.info = t("transfer.done", { ...done.counts });
    });
    input.value = "";
  }

  render() {
    return html`
      <h2>${t("transfer.export.title")}</h2>
      <div class="actions">
        ${(["products", "stock"] as const).map(
          (k) =>
            html`<button
              data-testid=${`transfer-export-${k}`}
              ?disabled=${this.busy}
              @click=${() => this.export(k)}
            >
              ${t(`transfer.export.${k}`)}
            </button>`,
        )}
      </div>
      <h2>${t("transfer.import.title")}</h2>
      <fieldset>
        ${SOURCES.map(
          (s) =>
            html`<label class="check">
              <input
                type="radio"
                name="source"
                data-testid=${`transfer-source-${s}`}
                .checked=${this.source === s}
                @change=${() => (this.source = s)}
              />${t(`transfer.source.${s}`)}
            </label>`,
        )}
      </fieldset>
      <p class="hint">${t(`transfer.hint.${this.source === "grocy" ? "grocy" : "csv"}`)}</p>
      <label>
        <span class="lbl">${t("transfer.file")}</span>
        <input
          type="file"
          data-testid="transfer-file"
          accept=${this.source === "grocy" ? ".json" : ".csv,.txt"}
          ?multiple=${this.source === "grocy"}
          ?disabled=${this.busy}
          @change=${this.pick}
        />
      </label>
      ${this.error ? html`<p class="error" role="alert">${this.error}</p>` : nothing}
      ${this.info ? html`<p data-testid="transfer-info" role="status">${this.info}</p>` : nothing}
    `;
  }

  static styles = [
    formStyles,
    css`
      h2 {
        font-size: 1rem;
        margin: 16px 0 8px;
      }
      .hint {
        color: var(--secondary-text-color);
      }
    `,
  ];
}

customElements.define("home-inventory-transfer", HomeInventoryTransfer);
