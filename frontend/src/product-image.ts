import { css, html, nothing } from "lit";
import { hasExternal } from "./modules";

/** Small product picture (Open Food Facts image server). Nothing when the service is off (no request
 *  leaves the browser), the product has none, or the link is not https (trust boundary). */
export const productImage = (url?: string | null) =>
  url && url.startsWith("https://") && hasExternal("off_images")
    ? html`<img
        class="pimg"
        src=${url}
        alt=""
        loading="lazy"
        referrerpolicy="no-referrer"
        data-testid="product-image"
      />`
    : nothing;

export const imageStyles = css`
  .pimg {
    flex: none;
    width: 40px;
    height: 40px;
    object-fit: contain;
    margin: 0 8px;
  }
`;
