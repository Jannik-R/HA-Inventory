import { css, html, nothing } from "lit";
import { hasExternal } from "./modules";

/** Product picture (`size` px, default 40) (Open Food Facts image server). Nothing when the service is off (no request
 *  leaves the browser), the product has none, or the link is not https on an Open * Facts host. */
const HOSTS = [
  "openfoodfacts.org",
  "openbeautyfacts.org",
  "openpetfoodfacts.org",
  "openproductsfacts.org",
];

/** https and a host of the Open * Facts family (the sister databases' pictures are stored too). */
function allowed(url: string) {
  try {
    const u = new URL(url);
    return (
      u.protocol === "https:" && HOSTS.some((h) => u.hostname === h || u.hostname.endsWith(`.${h}`))
    );
  } catch {
    return false;
  }
}

/** `size` is the max height in px; wide packs may use the full width instead. */
export const productImage = (url: string | null | undefined, size: number) =>
  url && hasExternal("off_images") && allowed(url)
    ? html`<img
        class="pimg"
        src=${url}
        alt=""
        style="max-height: ${size}px"
        @error=${(e: Event) => ((e.target as HTMLElement).hidden = true)}
        loading="lazy"
        referrerpolicy="no-referrer"
        data-testid="product-image"
      />`
    : nothing;

export const imageStyles = css`
  .pimg[hidden] {
    display: none;
  }
  .pimg {
    display: block;
    max-width: 100%;
    object-fit: contain;
    margin: 0 0 8px;
  }
`;
