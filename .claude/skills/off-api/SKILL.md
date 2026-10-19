---
name: off-api
description: Open Food Facts API facts for this repo - endpoints, fields used, User-Agent, rate limits, taxonomy checks for category off_tags. Use when touching off.py, seed off_tags or category suggestion.
---

# Open Food Facts (OFF)

Client: `custom_components/home_inventory/off.py` (HTTP + parsing). Category logic: `inventory.suggest_category`, `product_draft`, `add_product`.

## Endpoints (all `https://world.openfoodfacts.org`)

| Use | Request | Notes |
|---|---|---|
| Product by EAN | `GET /api/v2/product/<ean>?fields=...&lc=de` | unknown EAN: HTTP 404 with JSON `{"status": 0}`; found: `status: 1`, `product` |
| Name search | `GET /cgi/search.pl?search_terms=..&json=1&page_size=20&fields=..` | `products` list. `/api/v2/search` has no full-text search |
| Taxonomy check | `GET /api/v2/taxonomy?tagtype=categories&tags=en:a,en:b&fields=name,parents&lc=de` | unknown tag returns `{}` (empty object), not an error |

Sister databases with the same API and fields (`off.SITES`): Open Beauty Facts, Open Pet Food Facts,
Open Products Facts. A non-food EAN on OFF answers HTTP 404 with `status_verbose` "product found with a
different product type: beauty|petfood|product"; `async_lookup` then asks that one database. The name
search asks all four at once (one rate-limit slot; food first, duplicates dropped, a failing sister is
left out). Their search sometimes answers 500.

## Rules

- Always send `User-Agent: HA-Inventory/<ver> (<repo url>)` (`off.HEADERS`). Read-only, no auth.
- Rate limits: product 100 req/min, search **10 req/min** -> search only on explicit user action, never per keystroke. Local products first (`inventory.search_products`, `find_ean`).
- Always pass `fields=`; full product JSON is large.
- Fields used: `code, product_name, product_name_<lang>, generic_name_<lang>, brands` (comma list, first wins), `categories_tags` (includes all ancestors, roughly general -> specific; may contain non-`en:` junk), `product_quantity` + `product_quantity_unit` (usually g/ml, already the total for multipacks), `quantity` (free text fallback, e.g. "6 x 1,5 l"), `image_front_small_url`.
- Data quality varies: tags can be missing or only in one language (e.g. only `nl:...`). Missing match -> user picks a category, `add_product` learns the last tag.

## Checking seed off_tags

```bash
tags=$(grep -o '"en:[^"]*"' custom_components/home_inventory/seed.py | tr -d '"' | sort -u | paste -sd, -)
curl -s -A "HA-Inventory-dev" "https://world.openfoodfacts.org/api/v2/taxonomy?tagtype=categories&tags=$tags&fields=name" | python -c "import json,sys; [print(k) for k,v in json.load(sys.stdin).items() if not v]"
```

Prints only tags that do not exist. To find a replacement, look at `categories_tags` of a real product
(`/api/v2/product/<ean>?fields=categories_tags`) or `/api/v2/search?categories_tags_de=<name>&fields=categories_tags&page_size=3`.
