/// <reference types="vite/client" />
import { LitElement, css, html } from "lit";
import type { BarcodeDetector as Detector } from "barcode-detector/ponyfill";
import { t } from "./i18n";
import { backdropClick } from "./ui";
import { formStyles } from "./styles";

const FORMATS = ["ean_13", "ean_8", "upc_a", "upc_e", "qr_code"] as const; // QR: our labels (PTRY:<key>:<date>)

/** Native BarcodeDetector if it reads EAN, else the zxing-wasm polyfill (loaded on first use). */
async function createDetector(): Promise<Detector> {
  const Native = (window as unknown as { BarcodeDetector?: typeof Detector }).BarcodeDetector;
  const supported = Native ? await Native.getSupportedFormats() : [];
  if (Native && supported.includes("ean_13")) {
    return new Native({ formats: FORMATS.filter((f) => supported.includes(f)) });
  }
  const [{ BarcodeDetector, prepareZXingModule }, { default: wasm }] = await Promise.all([
    import("barcode-detector/ponyfill"),
    import("zxing-wasm/reader/zxing_reader.wasm?url"),
  ]);
  // Serve the wasm from our own bundle, not from the library's default CDN.
  prepareZXingModule({
    overrides: {
      locateFile: (path: string, prefix: string) => (path.endsWith(".wasm") ? wasm : prefix + path),
    },
  });
  return new BarcodeDetector({ formats: [...FORMATS] });
}

/** Camera barcode scanner in a modal dialog; fires `scan` with the code as detail. */
export class PantryScanner extends LitElement {
  static properties = { error: { state: true } };
  declare error: string;

  private stream?: MediaStream;
  private timer?: number;

  constructor() {
    super();
    this.error = "";
  }

  async open() {
    this.error = "";
    await this.updateComplete;
    const dlg = this.renderRoot.querySelector("dialog")!;
    dlg.showModal();
    if (!navigator.mediaDevices?.getUserMedia) {
      this.error = t("scan.https");
      return;
    }
    // Each step has its own message: permission/camera problems differ from a detector load failure.
    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
    } catch {
      this.error = t("scan.no_camera");
      return;
    }
    let detector: Detector;
    try {
      detector = await createDetector();
    } catch {
      stream.getTracks().forEach((tr) => tr.stop());
      this.error = t("scan.detector");
      return;
    }
    if (!dlg.open) return stream.getTracks().forEach((tr) => tr.stop());
    this.stream = stream;
    const video = this.renderRoot.querySelector("video")!;
    video.srcObject = stream;
    try {
      await video.play();
    } catch {
      this.error = t("scan.no_camera");
      return;
    }
    // One detect() at a time: the next one is armed only after the previous finished.
    const tick = async () => {
      const [hit] = await detector.detect(video).catch(() => []);
      if (!dlg.open) return;
      if (hit) {
        dlg.close();
        this.dispatchEvent(new CustomEvent("scan", { detail: hit.rawValue }));
      } else this.timer = window.setTimeout(tick, 250);
    };
    this.timer = window.setTimeout(tick, 250);
  }

  private stop() {
    clearTimeout(this.timer);
    this.stream?.getTracks().forEach((tr) => tr.stop());
    this.stream = undefined;
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.stop();
  }

  render() {
    return html`<dialog data-testid="scanner" @close=${this.stop} @click=${backdropClick()}>
      <h2>${t("scan.title")}</h2>
      ${this.error ? html`<p class="error" role="alert">${this.error}</p>` : html`<video muted playsinline></video>`}
      <div class="actions">
        <button type="button" @click=${() => this.renderRoot.querySelector("dialog")!.close()}>
          ${t("common.cancel")}
        </button>
      </div>
    </dialog>`;
  }

  static styles = [
    formStyles,
    css`
      video {
        display: block;
        width: 100%;
        max-height: 60vh;
        margin-bottom: 12px;
      }
    `,
  ];
}

customElements.define("pantry-scanner", PantryScanner);
