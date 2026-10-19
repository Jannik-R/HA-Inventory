import { LitElement, css, html, nothing } from "lit";
import { t } from "./i18n";
import { backdropClick } from "./ui";
import { formStyles } from "./styles";
import { scaledPhoto } from "./photo";
import { detectQuad, fullQuad, loadCv, scanned, type Cv, type Pt } from "./opencv";
import "./scan-corners";

const LIVE_PX = 480; // frames are scaled to this for the live outline (fast enough on a phone)
const STILL_PX = 1000;
const TICK_MS = 200;

/** `source` drawn into a canvas whose longest side is at most `max`; `f` maps back to source pixels. */
function small(source: CanvasImageSource, w: number, h: number, max: number) {
  const f = Math.max(1, Math.max(w, h) / max);
  const c = document.createElement("canvas");
  c.width = Math.round(w / f);
  c.height = Math.round(h / f);
  c.getContext("2d")!.drawImage(source, 0, 0, c.width, c.height);
  return { canvas: c, f };
}

const scale = (quad: Pt[] | null, f: number) =>
  quad?.map((p) => ({ x: p.x * f, y: p.y * f })) ?? null;

/** Camera in a modal dialog. `take(scan)`: a photo from the live camera; with `scan` (document
 *  mode) the receipt outline is shown live, then its corners can be fixed and the result is
 *  straightened black and white. `edit(image)`: the corner step for a photo picked as a file.
 *  Both resolve with a data URL, or undefined when cancelled. */
export class HomeInventoryCamera extends LitElement {
  static properties = {
    scan: { state: true },
    still: { state: true },
    quad: { state: true },
    live: { state: true },
    video: { state: true },
    running: { state: true },
    ready: { state: true },
    error: { state: true },
    busy: { state: true },
  };

  declare scan: boolean;
  /** The taken photo (corner step), undefined while the camera runs. */
  declare still?: HTMLCanvasElement;
  declare quad: Pt[];
  /** Outline found in the current camera frame, in video pixels. */
  declare live: Pt[] | null;
  declare video: { w: number; h: number };
  declare running: boolean;
  /** OpenCV is loaded (scan mode). */
  declare ready: boolean;
  declare error: string;
  declare busy: boolean;
  private cv?: Cv;
  private stream?: MediaStream;
  private timer?: number;
  private done?: (url: string | undefined) => void;

  constructor() {
    super();
    this.scan = false;
    this.quad = [];
    this.live = null;
    this.video = { w: 0, h: 0 };
    this.running = this.ready = false;
    this.error = "";
    this.busy = false;
  }

  private async show(scan: boolean, still?: HTMLCanvasElement) {
    this.done?.(undefined);
    this.scan = scan;
    this.still = still;
    this.live = null;
    this.error = "";
    this.busy = false;
    this.quad = still ? fullQuad(still.width, still.height) : [];
    const result = new Promise<string | undefined>((resolve) => (this.done = resolve));
    await this.updateComplete;
    this.renderRoot.querySelector("dialog")!.showModal();
    if (scan)
      loadCv().then(
        ({ cv }) => {
          this.cv = cv;
          this.ready = true;
          if (this.still) this.findOutline();
        },
        () => (this.error = t("camera.no_scan")),
      );
    return result;
  }

  take(scan: boolean) {
    const result = this.show(scan);
    void this.updateComplete.then(() => this.start());
    return result;
  }

  edit(image: HTMLCanvasElement) {
    return this.show(true, image);
  }

  private async start() {
    if (!navigator.mediaDevices?.getUserMedia) return void (this.error = t("scan.https"));
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1920 }, height: { ideal: 1080 } },
      });
      const video = this.renderRoot.querySelector("video")!;
      video.srcObject = this.stream;
      await video.play();
      this.video = { w: video.videoWidth, h: video.videoHeight };
      this.running = true;
    } catch {
      this.stop();
      return void (this.error = t("scan.no_camera"));
    }
    if (this.scan) this.timer = window.setTimeout(this.tick, TICK_MS);
  }

  private tick = () => {
    const video = this.renderRoot.querySelector("video");
    if (!video || !this.stream) return;
    if (this.cv && video.videoWidth) {
      const { canvas, f } = small(video, video.videoWidth, video.videoHeight, LIVE_PX);
      this.live = scale(detectQuad(this.cv, canvas), f);
    }
    this.timer = window.setTimeout(this.tick, TICK_MS);
  };

  private findOutline() {
    const s = this.still!;
    const { canvas, f } = small(s, s.width, s.height, STILL_PX);
    this.quad = scale(detectQuad(this.cv, canvas), f) ?? fullQuad(s.width, s.height);
  }

  private stop() {
    clearTimeout(this.timer);
    this.stream?.getTracks().forEach((tr) => tr.stop());
    this.stream = undefined;
    this.running = false;
  }

  private finish(url?: string) {
    this.done?.(url);
    this.done = undefined;
    this.renderRoot.querySelector("dialog")?.close();
  }

  private closed = () => {
    this.stop();
    this.still = undefined;
    this.finish();
  };

  disconnectedCallback() {
    super.disconnectedCallback();
    this.stop();
  }

  private async capture() {
    const video = this.renderRoot.querySelector("video")!;
    const c = document.createElement("canvas");
    c.width = video.videoWidth;
    c.height = video.videoHeight;
    c.getContext("2d")!.drawImage(video, 0, 0);
    this.stop();
    if (!this.scan) return this.finish(await scaledPhoto(c));
    this.quad = this.live ?? fullQuad(c.width, c.height);
    this.still = c;
  }

  private async apply(cut: boolean) {
    this.busy = true;
    const still = this.still!;
    // uncut: keep enough pixels per text line for the OCR (see ocr.ts)
    const url = cut
      ? scanned(this.cv, still, this.quad).toDataURL("image/png")
      : await scaledPhoto(still, 3000);
    this.busy = false;
    this.finish(url);
  }

  private liveView() {
    const { w, h } = this.video;
    return html`<div class="frame">
        <video muted playsinline></video>
        ${
          this.live && w
            ? html`<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">
                <polygon points=${this.live.map((p) => `${p.x},${p.y}`).join(" ")}></polygon>
              </svg>`
            : nothing
        }
      </div>
      ${this.scan ? html`<p class="detail">${t("camera.live_hint")}</p>` : nothing}`;
  }

  private cornerView() {
    return html`<home-inventory-scan-corners
        .image=${this.still}
        .quad=${this.quad}
        @change=${(e: CustomEvent<Pt[]>) => (this.quad = e.detail)}
      ></home-inventory-scan-corners>
      <p class="detail">${t("camera.corners_hint")}</p>`;
  }

  private actions() {
    if (this.still)
      return html`<button
          type="button"
          data-testid="camera-uncut"
          ?disabled=${this.busy}
          @click=${() => this.apply(false)}
        >
          ${t("camera.uncut")}
        </button>
        <button
          type="button"
          class="primary"
          data-testid="camera-apply"
          ?disabled=${this.busy || !this.ready}
          @click=${() => this.apply(true)}
        >
          ${t("camera.apply")}
        </button>`;
    return html`<button
      type="button"
      class="primary"
      data-testid="camera-capture"
      ?disabled=${!this.running}
      @click=${() => this.capture()}
    >
      ${t("camera.capture")}
    </button>`;
  }

  render() {
    return html`<dialog data-testid="camera" @close=${this.closed} @click=${backdropClick()}>
      <h2>${t(this.scan ? "camera.title_scan" : "camera.title")}</h2>
      ${this.still ? this.cornerView() : this.liveView()}
      ${this.error ? html`<p class="error" role="alert">${this.error}</p>` : nothing}
      <div class="actions">
        <button type="button" @click=${() => this.finish()}>${t("common.cancel")}</button>
        ${this.actions()}
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
      svg {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
      }
      polygon {
        fill: var(--primary-color);
        fill-opacity: 0.15;
        stroke: var(--primary-color);
        stroke-width: 3px;
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

customElements.define("home-inventory-camera", HomeInventoryCamera);
