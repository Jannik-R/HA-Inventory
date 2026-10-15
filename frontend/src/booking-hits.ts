import { html, nothing } from "lit";
import { t } from "./i18n";
import type { Product, SearchHit } from "./api";

/** Search hits to pick from; `more`: book-in also offers online search and a new product. */
export function hitList(
  hits: (SearchHit | Product)[],
  o: {
    more: boolean;
    online: boolean;
    busy: boolean;
    pick: (h: SearchHit | Product) => void;
    searchOnline: () => void;
    create: () => void;
  },
) {
  return html`
    ${hits.length ? nothing : html`<p class="empty">${t("book.no_hits")}</p>`}
    <ul>
      ${hits.map(
        (h) =>
          html`<li>
            <button class="row" data-testid="hit" @click=${() => o.pick(h)}>
              <span>${h.name}</span>
              <span class="detail">${[h.brand, h.ean].filter(Boolean).join(" · ")}</span>
            </button>
          </li>`,
      )}
    </ul>
    ${
      o.more
        ? html`<div class="actions after">
            ${
              o.online
                ? nothing
                : html`<button
                    data-testid="search-online"
                    ?disabled=${o.busy}
                    @click=${o.searchOnline}
                  >
                    ${t("book.search_online")}
                  </button>`
            }
            <button data-testid="new-product" @click=${o.create}>${t("book.new_product")}</button>
          </div>`
        : nothing
    }
  `;
}
