/** Document scan with OpenCV.js: find the outline of a receipt, straighten it, black and white.
 *  OpenCV.js (one file, ~10 MB with its wasm) comes from the jsDelivr CDN on first use and is then
 *  in the browser cache, like the OCR data. */

const URL = "https://cdn.jsdelivr.net/npm/@techstark/opencv-js@4.12.0-release.1/dist/opencv.js";

// shortcut: OpenCV.js ships no types usable here; the calls below are its documented API.
export type Cv = any;
export type Pt = { x: number; y: number };

let loading: Promise<{ cv: Cv }> | undefined;

/** Load OpenCV.js once; it is ready when `cv.Mat` exists (the wasm starts after the script).
 *  Wrapped in an object: the module has its own `then`, so resolving with it never settles. */
export function loadCv(): Promise<{ cv: Cv }> {
  loading ??= new Promise<{ cv: Cv }>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = URL;
    script.async = true;
    script.onerror = () => {
      loading = undefined;
      reject(new Error("opencv"));
    };
    script.onload = () => {
      const started = Date.now();
      const wait = () => {
        const cv = (window as unknown as { cv?: Cv }).cv;
        if (cv?.Mat) resolve({ cv });
        else if (Date.now() - started > 60_000) reject(new Error("opencv"));
        else setTimeout(wait, 100);
      };
      wait();
    };
    document.head.append(script);
  });
  return loading;
}

const dist = (a: Pt, b: Pt) => Math.hypot(a.x - b.x, a.y - b.y);

/** Four points as top left, top right, bottom right, bottom left. */
export function ordered(pts: Pt[]): Pt[] {
  const by = (f: (p: Pt) => number) => [...pts].sort((a, b) => f(a) - f(b));
  const sum = by((p) => p.x + p.y);
  const diff = by((p) => p.y - p.x);
  return [sum[0], diff[0], sum[3], diff[3]];
}

/** The whole image as outline (nothing found, or "use all"). */
export const fullQuad = (w: number, h: number): Pt[] => [
  { x: 0, y: 0 },
  { x: w, y: 0 },
  { x: w, y: h },
  { x: 0, y: h },
];

/** Corners of the biggest document-like outline in the canvas, in its pixels; null if none
 *  covers at least a tenth of it. A receipt with curled edges gets its enclosing rectangle. */
export function detectQuad(cv: Cv, canvas: HTMLCanvasElement): Pt[] | null {
  const src = cv.imread(canvas);
  const gray = new cv.Mat();
  const edges = new cv.Mat();
  const contours = new cv.MatVector();
  const hierarchy = new cv.Mat();
  const kernel = cv.Mat.ones(3, 3, cv.CV_8U);
  try {
    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
    cv.GaussianBlur(gray, gray, new cv.Size(5, 5), 0);
    cv.Canny(gray, edges, 50, 150);
    cv.dilate(edges, edges, kernel);
    cv.findContours(edges, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
    let best: Pt[] | null = null;
    let bestArea = canvas.width * canvas.height * 0.1;
    for (let i = 0; i < contours.size(); i++) {
      const c = contours.get(i);
      const area = cv.contourArea(c);
      if (area > bestArea) {
        const approx = new cv.Mat();
        cv.approxPolyDP(c, approx, 0.02 * cv.arcLength(c, true), true);
        let pts: Pt[];
        if (approx.rows === 4 && cv.isContourConvex(approx)) {
          const d = approx.data32S;
          pts = [0, 1, 2, 3].map((j) => ({ x: d[2 * j], y: d[2 * j + 1] }));
        } else pts = cv.RotatedRect.points(cv.minAreaRect(c));
        approx.delete();
        best = ordered(pts);
        bestArea = area;
      }
      c.delete();
    }
    return best;
  } finally {
    for (const m of [src, gray, edges, contours, hierarchy, kernel]) m.delete();
  }
}

/** Cut out the outline, straighten it and turn it black and white (adapts to shadows and folds). */
export function scanned(cv: Cv, canvas: HTMLCanvasElement, quad: Pt[]): HTMLCanvasElement {
  const [tl, tr, br, bl] = quad;
  const w = Math.max(1, Math.round(Math.max(dist(tl, tr), dist(bl, br))));
  const h = Math.max(1, Math.round(Math.max(dist(tl, bl), dist(tr, br))));
  const src = cv.imread(canvas);
  const from = cv.matFromArray(
    4,
    1,
    cv.CV_32FC2,
    quad.flatMap((p) => [p.x, p.y]),
  );
  const to = cv.matFromArray(4, 1, cv.CV_32FC2, [0, 0, w, 0, w, h, 0, h]);
  const m = cv.getPerspectiveTransform(from, to);
  const flat = new cv.Mat();
  const gray = new cv.Mat();
  try {
    cv.warpPerspective(src, flat, m, new cv.Size(w, h));
    cv.cvtColor(flat, gray, cv.COLOR_RGBA2GRAY);
    // block ~2 % of the width: big enough for text strokes, small enough for local shadows
    const block = Math.max(15, Math.round(w / 50) | 1);
    cv.adaptiveThreshold(
      gray,
      gray,
      255,
      cv.ADAPTIVE_THRESH_GAUSSIAN_C,
      cv.THRESH_BINARY,
      block,
      15,
    );
    const out = document.createElement("canvas");
    cv.imshow(out, gray);
    return out;
  } finally {
    for (const x of [src, from, to, m, flat, gray]) x.delete();
  }
}
