import { LitElement, css, html, svg } from "lit";
import { t } from "./i18n";
import type { Pt } from "./opencv";

const KEY_STEP = 0.01; // arrow keys move a corner by 1 % of the image

/** A still image with the found outline; its four corners can be dragged (or moved with the arrow
 *  keys). Fires `change` (detail: the new corners). */
export class HomeInventoryScanCorners extends LitElement {
  static properties = {
    image: { attribute: false },
    quad: { attribute: false },
  };

  declare image: HTMLCanvasElement;
  declare quad: Pt[];
  private dragging = -1;

  private move(i: number, p: Pt) {
    const { width: w, height: h } = this.image;
    const quad = [...this.quad];
    quad[i] = { x: Math.min(w, Math.max(0, p.x)), y: Math.min(h, Math.max(0, p.y)) };
    this.dispatchEvent(new CustomEvent("change", { detail: quad }));
  }

  private at(e: PointerEvent): Pt {
    const r = (e.currentTarget as SVGElement).getBoundingClientRect();
    return {
      x: ((e.clientX - r.left) / r.width) * this.image.width,
      y: ((e.clientY - r.top) / r.height) * this.image.height,
    };
  }

  private key(i: number, e: KeyboardEvent) {
    const step = KEY_STEP * Math.max(this.image.width, this.image.height);
    const d = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[
      e.key
    ];
    if (!d) return;
    e.preventDefault();
    this.move(i, { x: this.quad[i].x + d[0] * step, y: this.quad[i].y + d[1] * step });
  }

  render() {
    const { width: w, height: h } = this.image;
    const r = Math.max(w, h) * 0.025;
    return html`<div class="frame">
      ${this.image}
      <svg
        viewBox="0 0 ${w} ${h}"
        preserveAspectRatio="none"
        @pointermove=${(e: PointerEvent) => this.dragging >= 0 && this.move(this.dragging, this.at(e))}
        @pointerup=${() => (this.dragging = -1)}
        @pointercancel=${() => (this.dragging = -1)}
      >
        <polygon points=${this.quad.map((p) => `${p.x},${p.y}`).join(" ")}></polygon>
        ${this.quad.map(
          (p, i) =>
            svg`<circle
              cx=${p.x}
              cy=${p.y}
              r=${r}
              tabindex="0"
              role="slider"
              data-testid="scan-corner"
              aria-label=${t(`scan.corner_${i}`)}
              @pointerdown=${(e: PointerEvent) => {
                this.dragging = i;
                (e.currentTarget as Element).closest("svg")!.setPointerCapture(e.pointerId);
              }}
              @keydown=${(e: KeyboardEvent) => this.key(i, e)}
            ></circle>`,
        )}
      </svg>
    </div>`;
  }

  static styles = css`
    .frame {
      position: relative;
      width: fit-content;
      margin: 0 auto 12px;
    }
    canvas {
      display: block;
      max-width: 100%;
      max-height: 55vh;
    }
    svg {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      touch-action: none;
    }
    polygon {
      fill: none;
      stroke: var(--primary-color);
      stroke-width: 2px;
      vector-effect: non-scaling-stroke;
    }
    circle {
      fill: var(--primary-color);
      fill-opacity: 0.4;
      stroke: var(--primary-color);
      cursor: move;
    }
    circle:focus {
      outline: none;
    }
    circle:focus-visible {
      fill-opacity: 0.9;
    }
  `;
}

customElements.define("home-inventory-scan-corners", HomeInventoryScanCorners);
