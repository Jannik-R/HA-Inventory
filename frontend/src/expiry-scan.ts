import { LitElement, css, html, nothing } from "lit";
import type { Worker } from "tesseract.js";
import { t } from "./i18n";
import { backdropClick } from "./ui";
import { formStyles } from "./styles";
import { fmtDate } from "./format";
import type { Hass } from "./api";
import { ocrWorker } from "./ocr";
import { parseExpiry } from "./expiry-parse";
import { pickDate } from "./expiry-pick";

const BAND = 0.25; // share of the video height that is read (centered, full width)
const TICK_MS = 1000;
// Read modes, tried in turn: dot-matrix print falls apart into dots in the raw frame; a blur or
// a strong downscale joins them (the downscale also works where canvas filters do not, e.g. Safari).
const MODES = [
  { filter: "none", k: 1 },
  { filter: "grayscale(1) blur(2px)", k: 1 },
  { filter: "none", k: 1 / 3 },
];

interface Box {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

/** Live expiry date scan in a modal dialog: about once a second the band in the middle of the
 *  camera image is read with one OCR worker; a date seen twice among the last readings is taken.
 *  `scan()` resolves with the ISO date, or undefined when cancelled. */
export class HomeInventoryExpiryScan extends LitElement {
  static properties = {
    hass: { attribute: false },
    date: { state: true },
    box: { state: true },
    error: { state: true },
    ready: { state: true },
  };
  declare hass?: Hass;
  /** Date of the latest reading, if it had one. */
  declare date: string | null;
  /** Its frame, in percent of the band. */
  declare box: Box | null;
  declare error: string;
  /** The OCR worker is loaded (the first open downloads the language data). */
  declare ready: boolean;
  private stream?: MediaStream;
  private worker?: Worker;
  private timer = 0;
  private active = false;
  private done?: (date?: string) => void;
  private readings: (string | null)[] = [];
  private n = 0;

  constructor() {
    super();
    this.date = null;
    this.box = null;
    this.error = "";
    this.ready = false;
  }

  async scan() {
    this.done?.();
    this.date = null;
    this.box = null;
    this.error = "";
    this.ready = false;
    this.readings = [];
    this.n = 0;
    this.active = true;
    const result = new Promise<string | undefined>((resolve) => (this.done = resolve));
    await this.updateComplete;
    this.renderRoot.querySelector("dialog")!.showModal();
    void this.start();
    return result;
  }

  private async start() {
    if (!navigator.mediaDevices?.getUserMedia) return this.fail(t("scan.https"));
    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1920 }, height: { ideal: 1080 } },
      });
    } catch {
      return this.fail(t("scan.no_camera"));
    }
    this.stream = stream;
    try {
      const worker = await ocrWorker();
      if (!this.active) return void worker.terminate();
      this.worker = worker;
      const video = this.renderRoot.querySelector("video")!;
      video.srcObject = stream;
      await video.play();
      this.ready = true;
      this.tick();
    } catch (err) {
      console.error(err);
      this.fail(t("expiry.failed"));
    }
  }

  private fail(message: string) {
    this.error = message;
    this.stop();
  }

  /** Read the band, then wait: the next read starts only after this one finished. */
  private tick = async () => {
    const worker = this.worker;
    const video = this.renderRoot.querySelector("video");
    if (!this.active || !worker || !video) return;
    try {
      const mode = MODES[this.n++ % MODES.length];
      const h = Math.round(video.videoHeight * BAND);
      const c = document.createElement("canvas");
      c.width = Math.round(video.videoWidth * mode.k);
      c.height = Math.round(h * mode.k);
      const ctx = c.getContext("2d")!;
      ctx.filter = mode.filter;
      ctx.drawImage(
        video,
        0,
        Math.round((video.videoHeight - h) / 2),
        video.videoWidth,
        h,
        0,
        0,
        c.width,
        c.height,
      );
      const { data } = await worker.recognize(c, {}, { text: true, blocks: true });
      if (!this.active) return;
      const date = parseExpiry(data.text);
      this.readings.push(date);
      this.date = date;
      // frame: the line that holds the date by itself (the keyword may sit in another line)
      const line = data.blocks
        ?.flatMap((b) => b.paragraphs.flatMap((p) => p.lines))
        .find((l) => date && parseExpiry(l.text) === date);
      const b = line?.bbox;
      this.box = !b
        ? null
        : {
            x0: (b.x0 / c.width) * 100,
            y0: (b.y0 / c.height) * 100,
            x1: (b.x1 / c.width) * 100,
            y1: (b.y1 / c.height) * 100,
          };
      const picked = pickDate(this.readings);
      if (picked) return this.finish(picked);
    } catch (err) {
      if (!this.active) return; // terminated while reading
      console.error(err);
      return this.fail(t("expiry.failed"));
    }
    this.timer = window.setTimeout(this.tick, TICK_MS);
  };

  private stop() {
    this.active = false;
    clearTimeout(this.timer);
    this.stream?.getTracks().forEach((tr) => tr.stop());
    this.stream = undefined;
    void this.worker?.terminate();
    this.worker = undefined;
  }

  private finish(date?: string) {
    this.done?.(date);
    this.done = undefined;
    this.renderRoot.querySelector("dialog")?.close();
  }

  private closed = () => {
    this.stop();
    this.finish();
  };

  disconnectedCallback() {
    super.disconnectedCallback();
    this.stop();
  }

  render() {
    const b = this.box;
    return html`<dialog data-testid="expiry-scan" @close=${this.closed} @click=${backdropClick()}>
      <h2>${t("expiry.camera")}</h2>
      <div class="frame">
        <video muted playsinline></video>
        <div class="band">
          ${
            b
              ? html`<svg viewBox="0 0 100 100" preserveAspectRatio="none" data-testid="expiry-box">
                  <rect x=${b.x0} y=${b.y0} width=${b.x1 - b.x0} height=${b.y1 - b.y0}></rect>
                </svg>`
              : nothing
          }
        </div>
      </div>
      ${
        this.error
          ? html`<p class="error" role="alert">${this.error}</p>`
          : html`<p class="detail" role="status" data-testid="expiry-hint">
              ${this.date ? fmtDate(this.hass, this.date) : t(this.ready ? "expiry.hint" : "common.loading")}
            </p>`
      }
      <div class="actions">
        <button type="button" @click=${() => this.finish()}>${t("common.cancel")}</button>
      </div>
    </dialog>`;
  }

  static styles = [
    formStyles,
    css`
      .frame {
        position: relative;
        width: fit-content;
        margin: 0 auto;
      }
      video {
        display: block;
        max-width: 100%;
        max-height: 55vh;
      }
      .band {
        position: absolute;
        left: 0;
        right: 0;
        top: 37.5%;
        height: 25%;
        border: 2px solid var(--primary-color);
        box-sizing: border-box;
        pointer-events: none;
      }
      svg {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
      }
      rect {
        fill: none;
        stroke: var(--warning-color);
        stroke-width: 2px;
        vector-effect: non-scaling-stroke;
      }
      .detail {
        margin: 8px 0 12px;
        color: var(--secondary-text-color);
        font-size: 0.875em;
      }
    `,
  ];
}

customElements.define("home-inventory-expiry-scan", HomeInventoryExpiryScan);
