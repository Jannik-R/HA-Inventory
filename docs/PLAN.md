# Implementation Plan

Household inventory ("Vorrat": food, but also batteries, household goods, medicine, home-canned jars) as a Home Assistant **custom integration** (no add-on).
Everything runs inside the HA process; UI is a sidebar panel.

## 1. Architecture

```
HA sidebar panel (Lit web component, one bundled JS file)
        │  hass.callWS(...)
        ▼
websocket.py ── services.py ── llm_api.py (LLM API tools)
        │                │                        │
        └────────────────┴──── inventory/ ────────┘   ← all business logic, one place
                                   │
                         db.py (stdlib sqlite3, <config>/home_inventory.db)
                                   │
              off.py (Open Food Facts lookup, result cached in `product`)
              label.py (render label, raw to a network print server)
              receipt.py (planned: ESC/POS receipt printer, see 4a)

Entities: sensor (expired / expiring soon), todo (shopping list; its state = open items, so no extra below-min sensor)
```

Rule: **every** entry point (panel, services, automations, AI tools) calls
the `inventory` package (public API in its `__init__`, one submodule per concern). No logic in websocket handlers or entities.

### Key decisions

| Topic | Decision | Why |
|---|---|---|
| Domain | `home_inventory` | English code; UI says "Vorrat" |
| Storage | stdlib `sqlite3`, one file in config dir, schema via `PRAGMA user_version` migrations | relational data, constraints, growing booking log, recipes later. No dependency. |
| Backup safety | `backup.py` platform (`async_pre_backup` / `async_post_backup`) closes/locks DB | prevents corrupt DB in HA backups |
| DB access | executor jobs, one connection + lock | `shortcut:` single lock, fine for a household |
| Product data | Open Food Facts API v2 (EAN), `cgi/search.pl` for names (10 req/min: explicit search only); local products first; OFF result stored in `product` table on first booking | free, good DE coverage; local copy = cache |
| Frontend → backend | HA websocket commands | panel already has authenticated `hass` |
| Permissions | booking, lookup, search, stock, product edits, shopping list, label printing (max 20 per call): every HA user; any user may also add a category below an existing one (`product_type_add`), a unit (`unit_add`) and import recipes; master data writes otherwise and product delete: admin only; recipes: any user creates and edits, admin deletes | the kitchen phone may use a non-admin account |
| Automations | HA services, all with a response, by name instead of id (`inventory/codes.py`): `home_inventory.book_in` / `home_inventory.book_out` (EAN or label code + location name), `home_inventory.print_labels` (printer only, no browser), `home_inventory.print_shopping_list`, `home_inventory.shop_recipe` (recipe on the shopping list), `home_inventory.plan_meal` (recipe or text in the meal plan), `home_inventory.canning` (protocol from a canning recipe). Unknown EANs fail (new products need a category: panel only, no OFF call from automations). Rule: every panel action an automation or voice command can trigger gets a service; master data upkeep (products, categories, locations, units, recipes), stock corrections and undo stay panel only | scanners/NFC/ESPHome/voice can call them |
| Shopping list | own `todo` entity | native HA list UI, mobile app, Assist |
| Panel | `panel_custom` + static path, Lit + TypeScript, Vite build → committed `www/` (main file + lazy chunks with hashed names); panel URL `?v=<bundle mtime>` busts the browser cache on every build | HACS needs built file |
| UI components | own small Lit components styled with HA theme CSS vars; **no** internal `ha-*` elements | internal elements are not public API and break on HA updates |
| List rows | pencil (edit) + bin (delete) icons on every row, plus (add child) on tree rows (`rowActions`); row click = open/close a tree node, else edit | one pattern on every page; see CLAUDE.md UI/UX |
| Dialogs | modal; title = action + object; "Abbrechen" + primary right-aligned (primary last); only save + cancel inside (row icons cover the rest); click beside / Esc close, asking first when there are unsaved changes | common dialog guidelines (Material, Apple HIG); see CLAUDE.md UI/UX |
| Form validation | live: field errors under the field while typing, primary button disabled until valid; hints (e.g. past date) never block; backend validates again | errors before booking, not after; see CLAUDE.md UI/UX |
| Barcode (hardware) | USB/BT scanners act as keyboard → the normal, always-focused input field | zero code |
| Barcode (camera) | native `BarcodeDetector`, polyfill `barcode-detector` (zxing-wasm) loaded only when missing (iOS/Firefox/Windows); the wasm is bundled in a lazy chunk (~1.4 MB, ~600 kB gzip), never fetched from a CDN | camera needs HTTPS (or localhost); works offline in the LAN |
| Label printing | backend renders the label (Pillow + `segno` for QR) and sends Dymo raster data raw to a **network print server** (TP-Link, port 9100); CUPS/IPP as fallback. No dialog. | works from panel, services and automations; no USB cable to HA |
| i18n backend | HA standard: `strings.json` + `translations/{de,en}.json` | config flow, services, entities |
| i18n frontend | `frontend/src/i18n/<lang>.json`, `t(key, params)`, language from `hass.language`, fallback `de` | dates/numbers via `Intl` with `hass.locale` |
| Distribution | private GitHub repo now; layout HACS-compatible from day 1 (`hacs.json`, built bundle committed, GitHub releases) | publishing later = make repo public |
| License | MIT | free use/modification, copyright notice must be kept (= attribution) |

## 2. Data model

```
unit       (id, name UNIQUE, symbol, base_unit_id NULL → unit, factor > 0,
            is_count 0|1, recipe_only 0|1)   -- is_count 1 = counts packages (Stück, Packung, Dose ...); recipe_only 1 = only offered in recipe ingredients (migration 13)
           -- seeded: Stück, Packung, g, kg (=1000 g), ml, l (=1000 ml); user can add (Dose, Glas, Bund ...)
location   (id, name UNIQUE, sort, active 0|1, freezer 0|1)   -- freezer: migration 25; never deleted: "delete" deactivates (must be empty),
           -- so bookings keep a valid FK; adding the same name again reactivates it
defaults   (id = 1, unit_id → unit, default_location_id NULL → location, expiry_type, warn_days, shelf_days NULL, opened_days NULL, frozen_days NULL)
           -- expiry_type: best_before | use_by | guide (Richtwert, migration 24)
           -- one row: root of inheritance, editable in Einstellungen › Standards
category   (id, parent_id NULL → category, name, sort,
            unit_id, default_location_id, expiry_type, warn_days, shelf_days, opened_days,   -- inheritable, NULL = inherit (opened_days: migration 20)
            food NULL 0|1,                                           -- 0 = not a food: no recipe ingredient; NULL = inherit, root = food (migration 15)
            frozen_days NULL, frozen_goods NULL 0|1,                   -- days frozen (inheritable); bought frozen (tree only, root = no) (migration 25)
            min_stock NULL, min_stock_amount_id NULL → unit,           -- amount with its own unit (both or none, CHECK); NOT inherited
            min_packages NULL)                                       -- package count (> 0); NOT inherited (migration 4)
product    (id, ean UNIQUE NULL, name, brand, category_id → category,
            content_amount, content_unit_id,                         -- e.g. 500 g per package; both or none (CHECK)
            default_location_id, expiry_type, warn_days, shelf_days, opened_days, frozen_days,  -- overrides, NULL = inherit
            image_url, off_json, updated_at,
            min_packages NULL)                                        -- own minimum in packages (migration 11)
batch      (id, product_id, expires_on DATE, created_at, canning_id NULL → canning (cascade), opened_on DATE NULL,
            frozen_on DATE NULL)   -- frozen_on: home-frozen batch, part of the unique key (migration 25)
           -- unique (product_id, expires_on, canning_id, opened_on) (expression index, migrations 15/20): a canning charge is its own batch,
           -- an opened package too (same product, date and charge, opened_on set; canning_id no longer UNIQUE since migration 20)
           -- date type is a product property (own or inherited), never per batch (migration 2)
           -- at most one batch without a date per product (partial unique index, migration 6)
stock      (batch_id, location_id, packages > 0, PRIMARY KEY(batch_id, location_id))
shopping_done (category_id PK → category (cascade), missing)   -- checked shopping item + its shortage then
shopping_done_product (product_id PK → product (cascade), missing)   -- same for a product minimum (migration 11)
shopping_item (id, product_id UNIQUE NULL → product, category_id UNIQUE NULL → category,   -- added by hand,
            packages > 0, done 0|1, created_at)   -- exactly one of product / category (CHECK); both cascade
shopping_recipe (recipe_id PK → recipe (cascade), servings > 0)   -- recipe on the shopping list, servings to buy for (migration 12)
shopping_recipe_optional (recipe_id → shopping_recipe (cascade), ingredient_id → recipe_ingredient (cascade), PK both)   -- optional ingredients chosen for it
shopping_done_recipe (uid PK, missing)   -- checked recipe item, uid `r<category id>-<base unit id or empty>`, like shopping_done (migration 12)
recipe     (id, name, servings > 0, instructions, source_url, image_url,   -- migration 7
            canning_product_id NULL → product (cascade),   -- set: a canning recipe that makes this product (migration 15)
            canning_temp NULL, canning_minutes NULL)   -- both or none, only on a canning recipe
canning    (id, made_on DATE, seq > 0, product_id → product (cascade), recipe_id NULL → recipe (set null),
            jars > 0, temp NULL, minutes NULL, notes, UNIQUE(made_on, seq))   -- canning protocol; charge = YYYYMMDD-seq (migration 15)
recipe_ingredient (id, recipe_id → recipe (cascade), category_id NULL → category (set null: text stays,
            ingredient unmatched), amount > 0, unit_id → unit, text, note, optional 0|1, skip_stock 0|1)
            -- skip_stock (migration 10): never checked against the stock, status "skipped", not in the summary,
            -- never on the shopping list (phase 12); amount and unit both or none; order = id order (saving a recipe replaces all ingredients)
meal_plan (id, day DATE, slot INTEGER 0..4 (0 Frühstück, 1 Mittag, 2 Kaffee, 3 Abendessen, 4 Snack), recipe_id NULL → recipe (set null: text stays as free text), text, servings > 0)   -- week planner (migration 14); text = recipe name snapshot or free text; a day's dishes in slot, then id order
off_tag    (id, tag UNIQUE)                    -- each Open Food Facts category tag once
category_off_tag (category_id → category, off_tag_id → off_tag, PK both)   -- n:m; a known tag is referenced
booking    (id, ts, kind 'in'|'out'|'move'|'correct'|'open', batch_id → batch (cascade), location_id → location,
            to_location_id → location,           -- only 'move' (location_id = source)
            packages,                            -- always positive; 'correct' = signed difference; 'open' (migration 20):
                                                 -- batch_id = the opened batch, +n opened, -n = undo (reverts_id names it)
            source 'scan'|'manual'|'label'|'service'|'undo', user_id,
            reverts_id UNIQUE NULL → booking)    -- an undo's 'in' names the 'out' it reverses: undone once (migration 6)
            -- root category names are unique too (partial unique index, migration 6)
```

### Category tree

One self-referencing `category` table, any depth. Convention (not enforced):
**main category → category → food type**, e.g. `Nudeln, Reis & Getreide → Nudeln → Spaghetti`.
Products attach to any node, normally the leaf. The lowest level is called **Produktart** (product type)
in the UI: brand-independent, e.g. Tomatenmark. No separate table: a product type is a category.
Any user can add a category below an existing one (`home_inventory/product_type_add`: recipe ingredient,
category picker when booking in / editing a product); main categories and edits stay admin-only.
The seed (`seed_types.py`, ~320 types under the sub-categories) fills it for a new DB; migration 8 adds
the missing ones to existing DBs (only under a parent with that exact name, only when no category has
the type's name yet, so user renames and deletions stay). It also sets default units (`_DE_UNITS`: Milch l, Käse g, Fleisch g, ...) on categories without an own unit. Any user can add a type from a recipe
(`home_inventory/product_type_add`). Name keywords also match single-word type names (`suggest.py`).

- **Inheritance**: `unit`, `default_location`, `expiry_type`, `warn_days` resolve
  product → its category → parent … → root → integration defaults (`defaults` table).
  The API returns each effective value with its source (`own` | category id | `default`);
  the UI renders inherited values in secondary text color with "von <Kategorie>".
- **Min stock** is set on any node and counts its **whole subtree**. Two independent minimums
  per node, each optional: an **amount** (`min_stock` in its own `min_stock_amount_id`, e.g. 500 g; a new amount starts in the node's effective unit and keeps its unit when that changes)
  and a **package count** (`min_packages`, e.g. 3 Packungen, any content). A node may have one,
  both or none; levels are independent and may mix freely, e.g. *Spaghetti* 3 Packungen,
  *Nudeln* 1 kg **and** 2 Packungen, *Reis* 500 g, *Nudeln, Reis & Getreide* 2 kg.
  Not inherited (inheriting would multiply it). Both set on one node = both must be met.
- **Shopping list from nested min stock** (bottom-up, no double counting), computed
  **separately per dimension** (amount, packages) with the same rule:
  `missing(node) = max(0, min − stock(subtree) − Σ missing(children))`. Amount: children's
  shortages converted into the node's unit (skipped if not convertible). Packages: plain counts,
  no conversion; products without known content still count as packages. A child's shortage only
  reduces its parent's shortage in the same dimension; a node without a minimum in one dimension
  passes its children's shortage in that dimension up. One todo item per node lists every
  missing dimension ("Nudeln – 0,5 kg und 1 Packung fehlen").
  Example: stock Nudeln 0,5 kg, Reis 0, Couscous 0,3 kg → items
  "Nudeln 0,5 kg", "Reis 500 g", "Nudeln, Reis & Getreide: weitere 0,2 kg (beliebig)".
  Items are grouped by main category. A node without its own min stock passes its children's
  shortage up to its parent.
- **Product minimum** (`product.min_packages`, migration 11): packages only (the content is fixed,
  an amount adds nothing). Below it the product is its own item ("Spaghetti (Barilla) – 2 Packungen fehlen"; panel: "Barilla · 2 Pkg. fehlen"), and
  its shortfall counts like a child's shortage toward its category and above: packages as is,
  the amount as packages × content (not if the content is unknown). Checks in `shopping_done_product`.
- **Automatic category assignment**: each category node has `off_tags` (OFF category
  tags, e.g. `en:spaghetti`, `en:pastas`). A product gets the deepest node whose tag
  appears in its OFF `categories_tags` (tie: the later, more specific OFF tag). No match → user picks; the product's most specific
  OFF tag is then added to the chosen node, so the next similar product maps automatically.
  Fallbacks when no OFF tag matches (e.g. OFF has no categories at all): (1) **name keywords**
  (`keywords.py`, German, grows over time): keyword → OFF tag → category. The first name word
  with a match decides (German names put the product first: "Joghurt Erdbeere"); within it the
  score `len(keyword) + bonus` picks (whole word +10, end of compound = German head +5, start +2,
  inside a word: no match; minimum 5), then the deeper category. (2) **similar saved products**:
  the category of the product sharing the most name words (≥ 4 letters, longer words weigh more).
  Seed data ships tags for the default categories. The OFF taxonomy itself is not used as
  the tree (thousands of nodes, inconsistent) - it only feeds the mapping.
- **Package content from OFF**: drained weight if the `quantity` text states one
  ("Abtropfgewicht 240 g", "670g/370g"), else `product_quantity` + `product_quantity_unit`
  (fallback: parse the `quantity` string like "500 g", "6 x 1,5 l") → `content_amount` /
  `content_unit_id`. Always editable; missing → user enters it once per product.
- **Seed data** (categories, units, locations) is language-specific data, chosen by HA
  language at first setup; only `de` for now. Applied to a new DB only; after the first release,
  seed fixes for existing DBs need a migration step.
- **Amounts**: stock is counted in packages (one label per package). For min stock and
  display, packages × `content_amount` are converted into the node's effective unit
  via `unit.base_unit_id/factor`. A count unit (`Stück`/`Packung`) uses the content when it converts
  (10 Eier per package), else counts packages.
  Product without convertible content → counted as unknown, flagged in UI.
- **Recipe availability**: an ingredient references a category node: "Nudeln" accepts any pasta, "Spaghetti"
  only spaghetti. Stock of the node and all descendants counts (converted like min stock, scaled by
  servings / recipe servings). Status: `available`, `partial`, `missing`, `unknown` (only products with
  unconvertible content), `unmatched` (no category). No amount: available when any product of the subtree
  is in stock. Optional ingredients are left out of the summary.
- **Recipe-only units** (`unit.recipe_only`, migration 13): EL, TL, Tasse, Prise, Zehe and similar are offered only in recipe ingredient pickers, not for product content, min stock, defaults, category or base units; the backend accepts them everywhere (existing rows keep working). Units created by a recipe import start recipe-only. A unit with a size (`RECIPE_BASES` in `seed_types.py`: EL = 15 ml, TL = 5 ml, Tasse = 250 ml, Prise and Messerspitze = 0.5 g, Zehe = 0.1 Stück, Handvoll = 30 g, Zweig and Stiel = 0.1 Bund, Tropfen, Spritzer, Schuss; only Scheibe has none) shows its amount in recipes ("3 EL (≈ 45 ml)"). Against stock and the shopping list it becomes its base unit when that fits the category's effective unit (volume to ml, weight to g: 3 EL Öl, Öl in l → 45 ml), else, when the subtree has nothing in stock, it becomes its base unit if it has a size (2 EL Kapern → 30 ml); Scheibe stays as written ("2 Scheiben"), so recipe-only units never reach the list except Scheibe. No density: volume never becomes weight (EL Mehl = any Mehl). Calculation: `_stock_amount` in `inventory/amounts.py`.

### Seeded main categories (editable)

Organized by food type, roughly supermarket order (useful for the shopping list).
Storage is a location, not a category; exception: frozen food, because its
properties (location, warn days) differ and inherit nicely.

| Main category | Example categories | Inherited defaults |
|---|---|---|
| Obst & Gemüse | Obst, Gemüse, Kräuter, Kartoffeln | warn 2 d |
| Brot & Backwaren | Brot, Brötchen, Knäckebrot | warn 2 d |
| Milchprodukte & Eier | Milch, Joghurt, Käse, Butter, Eier | use-by, warn 3 d, location Kühlschrank |
| Fleisch, Wurst & Fisch | Fleisch, Aufschnitt, Fisch | use-by, warn 1 d, location Kühlschrank |
| Nudeln, Reis & Getreide | Nudeln, Reis, Couscous, Haferflocken | unit kg |
| Backen | Mehl, Zucker, Backmischungen, Hefe | unit kg |
| Konserven & Fertiggerichte | Gemüsekonserven, Tomaten, Suppen, Fertiggerichte | |
| Öle, Saucen & Gewürze | Öl, Essig, Saucen, Gewürze, Brühe | |
| Frühstück & Aufstriche | Müsli, Marmelade, Honig, Nussaufstrich | |
| Süßes & Snacks | Schokolade, Kekse, Chips, Nüsse | |
| Getränke | Wasser, Saft, Kaffee, Tee | unit l |
| Tiefkühlkost | Gemüse TK, Fleisch & Fisch TK, Pizza, Eis | location Gefrierschrank, warn 30 d |
| Haushalt & Drogerie | Spülmittel, Papier | not a food; no expiry tracking (batches without date) |
| Haustechnik | Batterien (AA, AAA, C, D, 9V, Knopfzellen), Akkus, Leuchtmittel (by socket: E27, E14, GU10, GU5.3, G9, G4, R7s) | not a food, warn 90 d; migration 16 moves the old type *Batterien* from *Spülmittel* here (it becomes the category) and deletes the old type *Glühbirnen* when unused (else it moves to *Leuchtmittel*) |
| Hausapotheke | Schmerzmittel, Erkältung, Verbandsmaterial | not a food, warn 30 d |
| Tierbedarf | Tierfutter, Katzenstreu | not a food |
| Eingekochtes | Obst & Kompott, Marmelade & Gelee, Gemüse & Eingelegtes, Soßen & Suppen, Fleisch & Wurst | shelf life 365 d, warn 30 d |

*Haushalt & Drogerie*, *Haustechnik*, *Hausapotheke* and *Tierbedarf* are
marked "kein Lebensmittel" (`food` 0); migration 15 adds them to existing DBs (only roots whose name
does not exist yet) and marks *Haushalt & Drogerie*.

Global defaults (integration options): warn 7 days, best-before, unit Stück, no shelf life.
Shelf life and days after opening per food category / product type: `seed_days.py` (new DB after the seed, existing DBs by migration 21, only where empty; names must be unique).

## 3. Core flows

**Book in**: one input (scanner types into it, camera button next to it, or typed name)
→ local `product` lookup → else OFF lookup → else manual form. Unknown product: choose
category (suggested from OFF categories). Then: expiry date (its type comes from the product/category),
packages, location (default inherited / last used). "Print labels" toggle (default from options)
→ one label per package, printed immediately (labels carry no table: see Label printing).

**Book out**: the same single input.
- `PTRY:<key>:<date>` (key = product EAN, or `P<id>` without EAN; date = batch expiry, empty without) → one package of that batch, booked out like a normal book-out (location chosen as usual). A label can be scanned again; it names a batch, it does not track single packages.
- EAN / name → product → batch with **earliest expiry first** (FEFO),
  location = only one / last used. Override possible.

**Overview**: grouped by category tree → product → batch/location; search (name, brand,
EAN, category, location); location filter. Also the product page: edit/delete on product rows,
take out and fix (date, count) on batch rows; products without stock via an opt-in checkbox.

**Expiring**: sorted by date; threshold = effective `warn_days` per product, plus a view-wide
override field (session only, not saved). Expired listed first.

**Min stock / shopping list**: every category node below its `min_stock` and/or `min_packages`
→ todo item "Nudeln – 1,5 kg fehlen" / "Spaghetti – 2 Packungen fehlen" / both in one item. Recomputed on every booking. A check is stored with the item's shortage (`shopping_done`); the item counts as done while that shortage stays the same, so it comes back when it changes. Panel and todo entity share it. The panel shows the list as the category tree: only rows with something to buy get a checkbox, checked ones are struck through in place.
**Items by hand** (`shopping_item`): a product or a category ("any of it") with a package count; adding
the same again adds packages (a checked one starts again). The panel searches local products and
categories and can create a new product (any user) or category (admin) in the same transaction.
Todo entity: create = exact name of a product, else a category (no creation from free text: a
product needs a category); update = check mark only; delete = items by hand only (min stock items
come from the stock). Todo uids: `c<category id>` (min stock), `p<product id>` (product minimum), `m<item id>` (by hand), `r<category id>-<base unit id or empty>` (recipe, base unit = the group's stable key; a stale key raises `not_found`). Documented shortcuts: renaming a chosen optional ingredient loses the choice (matched by text); the egg rule (yolk/white rows) applies per recipe in the refs but across all recipes in the item total (refs may sum to more); availability applies it per recipe too (yolk/white rows report whole eggs + max(yolks, whites)). Migration 13 skips units already used (content, category, min stock, defaults) and its unit lists are frozen.

**Items from recipes** (`shopping_recipe`, migration 12): each recipe on the list with its servings and chosen optional ingredients. Demand per ingredient = amount × servings / recipe servings. Left out: `skip_stock` ingredients, unmatched ones, optional ones not chosen. Demand is summed per category and unit group; units are converted into the first one, non-convertible units give separate items. Egg rows (note Eigelb / Eiweiß, count unit) count as whole eggs + max(yolks, whites). Have = stock of the category subtree in that unit (unknown content → `unknown_products`, as for min stock). Missing = demand − have, not rounded to packages; count units round up. An ingredient without amount counts as one package ("1 Pkg."). Recipe-only amounts become their base unit (EL → ml) when that fits the category's unit, else (nothing in stock) the base unit of a sized unit, or Scheibe as written (see Recipe-only units). Recipe items do not depend on min stock (no reservation). Source = `recipes: [{no, name, amount}]` on the item; `no` is the number `shopping_recipes` returns (shown in *Für Rezepte*). Panel shows amounts in small text, the receipt leaves references and 'fehlen' out (`summary(short=True)`), the todo entity names the recipes. Checks as for min stock (`shopping_done_recipe`, holds while the shortage is unchanged). A recipe stays until removed by hand, or deleted (cascade). Shortcuts (to upgrade later): demand is flat per category, so overlapping categories (Nudeln vs. Spaghetti) are not netted; recipe demand is not reserved against min stock. Calculation in `inventory/shopping_recipes.py`.

**Not a food** (`category.food`, inherited down the tree like the other category values): such a
category and its subtree are never offered as recipe ingredients (picker, import suggestion) and the
backend refuses them (`not_food`). Everything else (stock, expiry, min stock, shopping list) works the same.

**Shelf life** (how the expiry date is defined):
- The expiry *type* stays a product property: best before, use by, or none (batteries without a date,
  household goods).
- The *date* comes from the package when it is printed (bought goods: typed or, later, read by the camera).
- For things without a printed date (home-canned, home-frozen, bulk goods) the inheritable
  `shelf_days` gives it: an empty date at book-in becomes today + shelf life (`book_in`, so panel and
  services alike), stored with `batch.expiry_guessed = 1` (migration 22; shown as
  *geschätzt*; any booking or stock edit with a real date for that batch clears it, an opened package
  keeps it). Option `prefill_expiry` (household step) only decides whether the panel puts the guess into
  the date field. A canning protocol proposes made-on date + shelf life. No shelf life = no guess.
- Opened packages (phase 18) shorten it again: see **Opened packages**.

**Opened packages** (phase 18, `inventory/opened.py`):
- *Anbrechen* moves one package of an unopened batch to the batch with the same product, date and charge
  and `opened_on` = today (same location; the same day merges). Booking `open` on the opened batch.
- Effective expiry = min(batch date, opened_on + `opened_days`), computed on read (`stock_list`:
  `expires_on` = effective, `batch_expires_on` = own date), so a changed `opened_days` applies to open
  packages too. No `opened_days` anywhere = no change. FEFO book-out, expiry view, sensors, expiring
  recipes and labels use it; opened packages count toward stock and minimums.
- Ways: batch row button, booking mode *Anbrechen* (`/home_inventory/open`; label → that batch, EAN / name →
  earliest unopened), service `home_inventory.open_package`. Undo (`home_inventory/open_undo`) once, while in stock.
  After opening the panel offers *Etikett drucken* (label dialog = the confirm).
- Labels: the code keeps the batch key (product, date, charge), the printed date is the effective one.
  `shortcut: a label scan takes an opened package of that key first, so scanning a closed package's
  label takes the opened one; add an opened marker to the code if that bites.`

**Canning** (tab *Einkochen*):
- **Process instruction** = a canning recipe: a recipe with `canning_product_id`, the product it
  always makes; servings are the jars it yields; optional `canning_temp` (°C) and `canning_minutes`.
  Ingredients, availability, import, shopping list work as for any recipe; the instructions hold the
  steps. Managed in *Einkochen › Rezepte* (the same list element with `canning` set); never in the
  *Rezepte* tab or the meal plan. Deleting the product deletes its canning recipes (cascade, listed
  by the dry run).
- **Protocol** (`canning`): made on (default today), optional canning recipe (fixes the product, prefills
  jars, temperature and minutes; the backend takes the recipe's product), else a product (existing, or a
  new one with a category, created in the same transaction), jars,
  location, best before (made on + shelf life), temperature, minutes, notes (e.g. jars that did not seal).
- **Charge**: saving a protocol creates it automatically: `YYYYMMDD-<n>`, n = next number of that
  made-on day (`seq`). The charge is its own batch (`batch.canning_id`); the jars are booked in there
  (booking `in`, source `manual`). Booking in the same product by hand never merges into a charge.
- **Labels**: as for any batch (label dialog opens after saving, count = jars); the label shows the
  charge in the brand line, the QR code is `PTRY:<key>:<date>:<charge>`, so a scan books out a jar of
  exactly that charge. Old codes without a charge still work.
- **Edit**: recipe, temperature, minutes, notes and best before (moves the whole charge; editing the date
  of a charge's stock row does the same). Made on, product and jars stay (the labels carry them); fix
  the stock with the usual stock edit. **Delete** (admin, dry run like master data): the protocol with
  its batch, stock and bookings.
- **Without a protocol**: already canned jars are booked in like any product (category *Eingekochtes*,
  date proposed from the shelf life); no charge.
- Cooking or canning never books out ingredients (as for recipes).

**Date kinds** (phase 21c, migration 24, `migration_24.py`):
- Today `expiry_type` is `best_before` (MHD) or `use_by` (Verbrauchsdatum); "no date" = batches without one.
  Fresh fruit and vegetables, home-dried, home-frozen and leftovers have neither: the date is a guide
  value from the shelf life, not a promise printed on a package.
- New third value `guide` (*Richtwert*, shown as "ca. <Datum>"): same inheritance as the other two
  (defaults → category → product). Seed: *Obst & Gemüse* (fresh) and *Gedörrtes* use it, frozen
  batches always show it (below). The migration sets *Obst & Gemüse* to `guide` in existing DBs too,
  always (also when the user changed it; their own product overrides stay); the seeded jar types
  below it (Schattenmorellen, Preiselbeeren) get `best_before`. The shelf life that makes the "ca."
  date was already seeded by migration 21 (`seed_days.py`: Obst & Gemüse 7, Äpfel 30, Kartoffeln 30,
  Erdbeeren 3, Salat 4, …).
- Meaning differs only in display and colour, not in the logic (FEFO, sensors, expiry view, expiring
  recipes stay as they are): `use_by` past = error colour (`expiryStatus` "expired"), `best_before` and
  `guide` past = bold warning colour ("past": check it). Stock and expiry view show "ca. <date>"
  (`stock.approx_date`), labels print "ca." before a `guide` date (`label_info.approx`).
- With `guide` the date field is filled from the shelf life (`shelf_days`) even when `prefill_expiry`
  is off, and the batch stays `expiry_guessed` (the "geschätzt" mark is redundant there and hidden).
- Schema: only the CHECK of `expiry_type` on `defaults`, `category`, `product`: each table is rebuilt
  from its stored SQL with the wider CHECK (ids and indexes kept).

**Freezing** (phase 21d, module `frozen`, migration 25 `migration_25.py`, `inventory/frozen.py`):
- Freezing a fresh product (meat, bread, berries, leftovers) replaces its date: frozen food keeps for
  months, the original MHD no longer matters. Frozen goods bought frozen keep their printed date: they
  are recognized by the category (inheritable flag `category.frozen_goods`, *Tiefkühlware*, like `food`;
  seeded on *Tiefkühlkost*). Non-food is never frozen.
- Rule: a batch of a freezable product (food, not frozen goods, `frozen_days` set) at a freezer location
  (`location.freezer`, checkbox *Gefrierort*; seeded on *Gefrierschrank*) is frozen: `book_in` there
  books into a frozen batch, `move` into a freezer freezes, out of it thaws (`frozen.on_move`).
- A frozen batch is its own batch (`batch.frozen_on`, part of the unique key) dated
  frozen_on + `frozen_days`, **stored** (not computed on read like opened packages), so FEFO, sensors,
  expiry view and labels work unchanged; a later change of `frozen_days` does not move it (edit the
  date). Its date kind is shown as *Richtwert* ("ca.", `stock_list` sets `expiry_type` guide).
- `frozen_days` inheritable (*Haltbar eingefroren*; seed: defaults 90, Fleisch 180, Hackfleisch 90,
  Fisch 120, Brot & Backwaren 90, Obst 300, Gemüse 300; NULL = inherit).
- *Einfrieren* on a batch row: dialog with packages (default 1) and target freezer (default: first
  freezer by sort). *Auftauen* on a frozen row: target default the product's location; thawed = a batch
  with `opened_on` = today dated today + `opened_days` (1 day without). Opening a frozen package is
  refused (`frozen`).
- Bookings: kinds `freeze` / `thaw`, two rows each (-n on the source batch, +n on the target);
  `undo_frozen` reverses both once (the -n row is the id before the +n row).
- Panel: done line with undo and (after freezing) *Etikett drucken*; labels print "ca." for frozen
  batches. Websocket `home_inventory/freeze {thaw, …}`, `home_inventory/frozen_undo`; services
  `home_inventory.freeze_package` / `thaw_package` (code, packages, location, to_location).
- Not built: a scan mode *Einfrieren* (the services cover NFC / automations), an expiry view filter
  for frozen batches (their warn days come late anyway).
- `shortcut: module off hides buttons and fields only; a location marked Gefrierort still freezes on
  book-in / move. Gate the rule on the module if that surprises anyone.`

**Drying** (phase 21e, module `drying`, migration 26 `migration_26.py`):
- Same as canning, same table: `canning.kind` (`canning` | `drying`), `recipe.canning_kind` (which tab
  a process recipe belongs to). Protocol, automatic charge `YYYYMMDD-n` (numbering shared by both
  kinds), own batch, labels, scan per charge, edit, delete are reused. A recipe's kind wins over the
  one sent with a new protocol.
- Drying counts packages instead of jars (same column `jars`); the duration is stored in minutes
  (`canning_minutes` / `minutes`, max 1440) and shown / typed in hours (half steps) in the panel.
- One tab *Haltbarmachen* (route `canning`; `canning/recipes`, `canning/drying`,
  `canning/drying-recipes`), shown while module `canning` or `drying` is on; with both, a switch
  *Einkochen* / *Dörren* above *Protokolle* / *Rezepte* (`preserve.ts`). Seeded root *Gedörrtes*
  (food, *Vorratsschrank*, shelf 180 days, warn 14, date kind *Richtwert*) with types Trockenobst,
  Gemüsechips, Getrocknete Kräuter, Getrocknete Pilze, Jerky (`add_dried`, also after a new seed).
- Service `home_inventory.drying` (same handler as `canning`, drying recipes only).

## 4. Label printing (Dymo LabelWriter 450)

The 450 has only USB. It goes into the network through a **TP-Link mini print server**
(USB print server, e.g. TL-PS110U / TL-WPS510U: raw TCP port 9100 and LPD), so neither HA nor
a Pi needs a USB cable to the printer.

```
HA (home_inventory) ──raw TCP :9100 (Dymo raster commands)──▶ TP-Link print server ──USB──▶ LabelWriter 450
```

- **Default path: HA talks to the print server directly.** The 450 is not PostScript/PCL; it takes
  its own raster protocol (Dymo "LabelWriter Technical Reference": `ESC @` reset, label length,
  `SYN` + one line of 1-bit pixels per dot row, `ESC E` form feed). `label.py` renders the label
  with Pillow (QR via `segno`), converts it to 1-bit rows at 300 dpi and writes them to
  `<print server>:9100` (asyncio socket). No CUPS, no driver, no extra host.
  `label_printers.py` is the registry of label printer models (options flow step 1 picks one): per model the size limits, default port, blank bottom reserve (Dymo 450: 3 mm) and the stream encoder; `browser` has no encoder (browser print). A new network model = a new entry with its encoder. The receipt printer (4a) will be a separate setting, not a model here.
  `shortcut: own small raster encoder for LabelWriter 4xx; other label printers need their own encoder or the CUPS path.`
- **USB on the HA host** (built): the printer field takes a device path instead (`/dev/usb/lp0`,
  USB printer class); `label.send` writes the same stream to the device file. One target per printer:
  host[:port] or a path, shared with the receipt printer (4a).
- **Fallback path: CUPS (NOT built; the browser print covers the no-printer case)** (for printers without an own encoder): a CUPS server (Pi container or
  HA add-on) with `printer-driver-dymo`, its queue pointing to `socket://<print server>:9100`;
  HA sends the PNG via IPP Print-Job to that queue.
- Check first: TP-Link print servers have a compatibility list and some USB label printers fail
  behind them (no bidirectional status). Test the 450 with one raw test label (via
  `nc <print server> 9100 < test.bin`) before building on it; if it fails, use CUPS on a Pi with USB.

Options (config flow → options): printer model (or none), print server host[:port], label width/height mm,
auto-print on book-in, test print. (IPP/CUPS is not built.)
Label content: QR `PTRY:<key>:<date>`, product name, brand, expiry date. No label table; reprint = `count` identical labels of a batch (1..20, `MAX_LABELS`); `home_inventory/print_labels` renders once: network printer `{printed}`, browser `{image, count, width_mm, height_mm}` (the panel repeats the image).
README documents the print server setup (fixed IP, port 9100 enabled) and the optional CUPS setup.

Network printing is **optional**: no printer configured → labels still work, the panel
opens the same PNG in the browser print view (`@page` sized to the label). Camera scanner
works on the Pi installation via HTTPS (cloud / local reverse proxy).

## 4a. Receipt printer (shopping list, recipes, meal plan)

Goal: print the shopping list (Phase 7), recipes and the meal plan on a cheap thermal receipt printer,
from the panel, a service and automations, without a print dialog. Support as many printers as
possible; the printer ordered for testing (58/80 mm thermal receipt printer from eBay) is only one example.

- **Command set: ESC/POS.** Almost every receipt printer speaks it (Epson TM, Star in ESC/POS mode,
  Xprinter, Munbyn, Rongta, HOIN, generic "POS-58/POS-80"). Only a small subset is needed:
  init (`ESC @`), bit image (`ESC *` mode 33, 24 dots per line: works on old printers; the TPG A799 prints `GS v 0` raster data as text), feed, cut (`GS V`, ignored by printers without a cutter).
- **Content as a raster image**, not text mode: rendered with Pillow (shared with `label.py`), so
  umlauts, fonts, bold headings and QR codes work on every printer without code-page tables.
  `shortcut: image only; add text mode if a slow printer needs it.`
- **Transports** (option in the config flow, one printer; built: device file and network):
  - device file on the HA host: USB printers show up as `/dev/usb/lp0` (USB printer class) or
    `/dev/ttyUSB0` / `/dev/ttyACM0` (USB-serial); plain binary writes, no dependency. Works on HA OS
    (USB devices are passed to HA core) and in Docker with `devices:`. Example: **TPG A799** (80 mm,
    cutter, USB with serial-over-USB) → `/dev/ttyUSB0` or `/dev/ttyACM0`;
  - network: raw TCP to port 9100 (most LAN/WiFi models), asyncio socket, no dependency;
  - CUPS/IPP: a raw queue on the Pi that already serves the Dymo;
  - Bluetooth: not planned (pairing on HA OS is fragile); use an ESP32 serial bridge or CUPS.
- **Options**: transport + address/device, paper width (58 mm = 384 dots, 80 mm = 576 dots), cutter yes/no,
  test print button. A cash drawer port (ESC/POS `ESC p`) is ignored.
- **No new requirement** if possible: ESC/POS bytes are written by hand (~30 lines); `python-escpos`
  only if real printers need its quirks database.
- Entry points: panel button "Einkaufszettel drucken" in the *Einkauf* tab, service `home_inventory.print_shopping_list`.

## 4b. AI interface (phase 19)

Two parts, both through what Home Assistant already offers; no own MCP server, no AI SDK.

### LLM API (Assist agents, HA MCP Server)

- `llm_api.py` registers one `llm.API` (id `home_inventory`, name "Home Inventory") in
  `async_setup_entry` (`entry.async_on_unload(llm.async_register_api(...))`). Assist agents (Gemini,
  OpenAI, Claude, Ollama) list it under *Control Home Assistant*; HA's built-in **MCP Server**
  integration exposes it to external clients (Claude Desktop etc.) when the user picks it there.
- **Access level** (options step *KI*, `llm_access`, the entry reloads on save, so the tools are
  built once per level): `read` = stock, expiring, recipes (list + one recipe with availability),
  shopping list, meal plan; `plan` (default) = read + put an item or a recipe on the shopping
  list + plan a dish; `all` = plan + book in, book out, open a package.
- Tools take names, never ids (like the services). Write tools **call the HA services**
  (`home_inventory.shop_recipe`, `plan_meal`, `book_in`, …) with the conversation's context, so validation,
  defaults (today, household servings), the user id in `booking.user_id` and the response are the
  services' own; an item by name is `add_shopping_by_name` (same as the todo entity). Read tools call
  `inventory` directly and return trimmed rows (no ids, no OFF data) to keep tokens low.
  `book_in` / `book_out` / `open_package` accept an EAN, a label code **or a product name**
  (`codes._product`: exact name, ignoring case; the services gain the same fallback).
- Annotations per tool (`read_only` / `destructive` / `idempotent`, `open_world=False`), forwarded
  by the MCP Server as tool hints.

### AI recipe import (no JSON-LD, social media, text, photo)

Research (2026-10, how other apps do it):

| App | Social media import | How |
|---|---|---|
| ReciMe | TikTok, Instagram via the share sheet | caption first, then the video's **audio**, then the linked website |
| Deglaze, FoodiePrep, Pestle, Honeydew | share sheet | caption + AI; Deglaze also on-screen text / scene analysis (videos up to 10 min) |
| Mealie | URL scraper (recipe-scrapers, JSON-LD); OpenAI for images and pages without schema; video import only via external tools (SousVid, social-to-mealie, discussion #5448) | **yt-dlp** download + Whisper transcription + ffmpeg frames → LLM |
| Tandoor | photo / PDF import via an AI (Gemini Flash free tier works) | screenshots of social posts, no video |
| Paprika | built-in browser, websites | only when the post links a recipe page |
| Samsung Food | own importer, websites and social links | not documented |

Findings: (1) the caption often has no recipe (5 to 20 words, hashtags); the recipe is spoken or on
screen, so the **video itself** is the source; (2) everybody downloads with **yt-dlp**; (3) the
others need Whisper + ffmpeg because their LLM only reads text and images, while HA's `ai_task`
takes **attachments** and Gemini reads a video file with its audio track directly, so no
transcription stack is needed; (4) Instagram blocks unauthenticated video downloads more and more
(SousVid needs browser cookies); its page still carries the caption and a cover image in the
Open Graph tags; TikTok and YouTube Shorts download without login.

Design:

- `home_inventory/recipe_import` takes exactly one of `url`, `text` (pasted, max 20,000 characters) or
  `image` (data URL; the panel scales a photo to max 2000 px JPEG before sending, the backend
  allows 3 MB). URL first runs the schema.org import as before (no AI). Only when that finds no
  recipe (no JSON-LD, page not HTML or not loadable) and an AI Task entity is set up, the AI reads it.
- `recipe_media.py` collects the sources for a URL (executor, temp dir, all deleted after the call):
  yt-dlp (`yt_dlp.YoutubeDL`, no playlist, max 15 min, smallest MP4 up to 480p, max 50 MB) for
  caption/title/thumbnail + the video file; when yt-dlp fails or the post has no video: Open Graph
  title/description/image of the page plus its visible text (max 15,000 characters) and the
  `og:image` file (max 5 MB). Attachments are files in a hidden folder `.home_inventory_import/` of the
  first HA media directory, passed as `media-source://media_source/<dir>/.home_inventory_import/…` (the
  only way `ai_task` takes files; hidden from media search). Without attachment support on the
  AI Task entity only the text goes.
- `inventory/ai_import.py` (pure): the extraction prompt (German output: ingredient lines as
  "200 g Mehl, gesiebt" so the existing German parser reads them; steps with optional sections;
  `found: false` when it is no recipe), Open Graph / text extraction from HTML, and the answer →
  a schema.org-like `Recipe` dict. `recipe_import.recipe_draft` (split out of `recipe_import`)
  turns that dict into the usual draft (line parser, units, category suggestion, learned
  mappings), so the dialog and the AI check of phase 13c run unchanged on the result (a second,
  short AI call that maps the categories).
- `recipe_ai.py` calls `ai._generate` (`task_name` "Vorrat: Rezept auslesen", 180 s timeout,
  `probatio` answer schema). Errors: `ai_failed` / `recipe_not_found` keep the import dialog open.
- New requirement **`yt-dlp`**: the only maintained way to read Instagram/TikTok/YouTube videos; it
  is already in the Home Assistant image (core `media_extractor` pins it), so a standard install
  downloads nothing.
- Panel: the import dialog gets *Link* / *Text* / *Foto* (the last two only with an AI set up,
  `panel.config.ai`), a progress line while the AI reads, and keeps the input on errors.
- No service: an import is a draft that a person confirms in the recipe dialog (CLAUDE.md: recipes
  are panel only). Phone share target: later (see section 7).

## 5. Development environment

`dev/docker-compose.yml` runs HA stable with `custom_components/home_inventory` mounted read-only.
All runtime data goes to `dev/config/` (git-ignored). Only `docker-compose.yml` and
`configuration.yaml` are committed.
Port bound to `127.0.0.1`; `trusted_networks` with `allow_bypass_login` → no password for local
browser tests (Playwright, Claude's browser). The MCP Server uses its own token (`HA_DEV_TOKEN`).

## 5a. Dev tooling (token economy)

| Tool | Status | When |
|---|---|---|
| `ha-dev` skill (`.claude/skills/ha-dev`) | ready | start/restart HA, filtered logs, tests, build |
| HA MCP Server on dev HA (`.mcp.json` → `ha-dev`) | prepared; needs the MCP Server integration added in dev HA + `HA_DEV_TOKEN` env var | after Phase 0 (dev HA onboarded) |
| Context7 MCP (`.mcp.json`) | ready | library docs (Lit, Vite, Pillow) on demand |
| Format hook (`.claude/hooks/format.mjs`) | ready; runs ruff / prettier if installed, silent otherwise; prettier on `frontend/src` + `frontend/e2e`, generated files in `frontend/.prettierignore`, CI runs `npm run format:check` | ruff via `pip install ruff` |
| Serena MCP (symbol-level code navigation) | planned | after Phase 1, when the code base is big enough to pay off; needs `uv` |
| Playwright UI tests (`@playwright/test` in `frontend/`, `npm run test:e2e`): repeatable click-through tests of the panel against the local dev HA (no login via `trusted_networks`), run **locally only** (not in CI: each run would need an HA container + browser, ~5-8 billed GitHub Actions minutes, while the private repo has 2,000 free minutes/month; locally it takes seconds). Once the repo is public (Actions free), an E2E CI job can be enabled. Elements addressed by stable `data-testid` attributes (Playwright pierces shadow DOM); each test creates its own data and cleans up. Runs in the installed Edge (`channel: msedge`), no browser download | ready | booking, stock, expiry, settings, validation covered; extend per phase |
| `feature-checklist` skill + `npm run i18n:check` (missing/unused UI keys, also in CI) | ready | every feature/fix |
| `ha-integration-rules` skill: condensed HA dev rules (config flow, `runtime_data`, translations, service registration, quality scale items that matter here) | ready | |
| `db-migration` skill: add a migration step, test upgrade from a DB of the previous version, backup note | ready | every schema change |
| `off-api` skill: Open Food Facts endpoints, fields used, User-Agent, rate limits, seed tag check | ready | |
| `ui-review` skill: check a view in the browser at phone width, light + dark theme, against the UX rules | ready | |
| `release` skill: version bump in `manifest.json`, build, changelog, tag, GitHub release, HACS validation | ready | every release |

Frontend build runs locally (Node LTS). Backend tests run in a container based on the HA
image (Python version always matches HA; HA does not run on Windows natively).

## 6. Phases

Each phase ends with: tests green, README updated, checked in dev HA.

| # | Phase | Status | Content |
|---|---|---|---|
| 0 | Foundation | done | integration skeleton, config flow (single instance), panel shell, i18n, CI: hassfest + HACS action + pytest + frontend build |
| 1 | Core | done | `db.py` schema + migrations + seed, `inventory` (then one module, now the `inventory/` package; book in/out/move/correct, inheritance resolution, queries), backup platform (moved up from Phase 9: real data exists from now on), tests |
| 2 | Product lookup | done | `off.py`, search, category suggestion |
| 3 | Master data UI | done | locations, units, category tree with inherited values |
| 4 | Booking UI | done | book in/out, keyboard scanner field, camera scanner. Required fix: click beside a dialog must close it (code was there, browsers kept the old cached bundle: panel URL now busts the cache with the bundle mtime) |
| 5 | Overview + search | done | stock list, filters (category tree with products as leaves, take out one package per batch with undo; all filtering in the panel: one `home_inventory/stock` call, data size of a household) |
| 6 | Expiry | done | expiry view with temporary threshold (all in the panel from `home_inventory/stock`, like Phase 5), sensors expired / expiring soon (packages, batches as attribute; `DataUpdateCoordinator` without polling: `Database.run` sends a dispatcher signal after any write, plus a refresh at midnight) |
| 6a | Stock + products | done | "Produkte" tab merged into "Bestand": product rows get edit/delete, batch rows an edit dialog (`inventory.edit_stock`: date and count of one batch at one location, date type stays a product property; another date moves the packages to that batch, logged as two corrections); products without stock only via an opt-in checkbox |
| 6b | Maintenance | done | migration 3 (OFF tags normalized, CHECKs, location deactivation + booking FKs, `defaults` table editable in settings), styled confirm dialog, Prettier + i18n check in CI, skills `db-migration` and `feature-checklist` |
| 7 | Min stock | done | migration 4 (`min_stock_amount_id`: the minimum keeps its unit; `min_packages`; `shopping_done`), both minimums in the category dialog, *Einkauf* tab, todo entity *Einkaufsliste*; items by hand (migration 5 `shopping_item`, panel dialog with search and create, todo create/delete); deleting master data in use (`delete_impact` = dry run of the delete in a savepoint, diff of all tables, rolled back: lists every row deleted or changed; `force_delete` cascades or clears references, a location's stock moves or is booked out) |
| 8 | Labels | done | `inventory/labels.py` (`label_info`, `book_out_code`: one package of the batch the code names; no schema change), `label.py` (QR + text with Pillow/segno, Dymo stream, raw TCP send), options flow in two steps (printer model via `label_printers.py`, then host, size, print on book-in, test print), confirm before printing more than 2 labels, `websocket_label.py`, panel: print on book-in, reprint dialog per batch row, scan `PTRY:` to book out, browser print when no printer. CUPS/IPP not built |
| 8a | Receipt printer | done | `receipt.py`: shopping list (open items, grouped by main category, todo texts) as one ESC/POS bit image (`ESC *` 24-dot lines, line spacing 24, 203 dpi; the A799 does not know `GS v 0`; 58 mm = 384 / 80 mm = 576 dots), feed, partial cut. Transports: device path (`/dev/ttyUSB0` / `/dev/ttyACM0`; a tty is set raw at the configured baud) or host[:port] raw TCP. Options menu: label printer / receipt printer (target, width, cutter, baud, test receipt); each part keeps the other's options. `home_inventory/print_shopping_list` (any user), service `home_inventory.print_shopping_list`, panel button in *Einkauf* when set up. No schema change, no new requirement. Recipes: `inventory/recipe_print.py` (`recipe_sheet`: scaled amounts, names, steps), `receipt.recipe_lines` (kinds text / head / item / step with hanging indent), `home_inventory/print_recipe` (any user), service `home_inventory.print_recipe` (recipe by name, dish or canning), meal plan: `receipt.plan_lines`, `home_inventory/print_plan {start, days 1|7}`, services `home_inventory.print_plan` (day / week Monday to Sunday) and `home_inventory.print_planned` (recipes of a meal; migration 19 `meal_time` start per slot, `meal_plan.meal_at`: latest start <= now, before the first start the last slot; settings section *Mahlzeiten*, `meal-times-view.ts`). Panel button `receipt-button.ts` (recipe, day / week view) when a receipt printer is set up. E2E blocks every `home_inventory/print_*` command |
| 9 | Release | done | services `home_inventory.book_in` / `book_out` / `print_labels`, README, `release` skill, CHANGELOG, first release 0.1.0 (HACS once the repo is public) |
| 10 | Recipe DB | done | `recipe` (name, servings, instructions, source URL, image URL), `recipe_ingredient` (category node = product type or a more general category as the ingredient key, amount, unit, `text` = name snapshot of the category (typed only while unmatched), optional `note`, optional flag); tab *Rezepte*: list with search, edit dialog, availability per ingredient from stock (category subtree, unit conversion like min stock). Cooking does **not** book out (booking stays manual). Migration 7 (migration 8: seeded product types); `inventory/recipes.py` + `amounts.py` (shared with min stock; a count unit now uses the package content); `websocket_recipe.py`; servings scaling per view (recipe view still starts at the recipe's servings; the household option is used by the plan); delete via `deleteMasterRow` |
| 11 | Recipe import | done | `recipe_fetch.py`: page fetch via HA's session, on user click only (15 s timeout, max 5 MB, HTML only, http/https; no private-IP block, so LAN servers like Mealie/Tandoor work; any user). `inventory/recipe_import.py`: schema.org `Recipe` JSON-LD → draft, nothing saved; the recipe dialog confirms it (product type/category suggested, must be checked). `inventory/ingredient_line.py`: German line parser (fractions ½ / 1/2, ranges take the upper value, Chefkoch "Zehe/n" and "Zwiebel(n)" (suffix dropped), leading size word (klein, groß, mittel…) → note, units by name/symbol/plural/alias, amount without unit → Stück, comma/bracket text → note, "n. B."/"nach Belieben" → no amount, "evtl." → optional, qualifier after the unit ("1 TL, gestr. Salz") and a trailing "für/zum/zur …" clause → note, eggs: Eigelb/Eiweiß/Eidotter/Eiklar → text "Ei" (egg category) with note Eigelb/Eiweiß, aliases (Tüte, Stängel, Fläschchen), no amount + "und"/"&" → one ingredient per part), unit matching and dedupe (spelling variants reuse one unit), `unit_add`. Unknown unit (capitalized word between amount and name, unless the category suggestion knows it as an ingredient or a product type starts with it: "2 Zwiebeln rot", "3 Pak Choi" stay 2/3 Stück): the row asks to create it (prefilled) or pick one; save blocked until decided. Commands `home_inventory/recipe_import`, `home_inventory/unit_add` in `websocket_recipe.py`; panel `recipe-import.ts`, `unit-add-dialog.ts`. No schema change. Image `@id` references in `@graph` are resolved. Pages without JSON-LD: error. Instagram/free text: phase 19 |
| 12 | Shopping by recipes | done | migration 12 (`shopping_recipe`, `shopping_recipe_optional`, `shopping_done_recipe`); `inventory/shopping_recipes.py`; `websocket_recipe.py` (`home_inventory/shopping_recipes`, `shopping_recipe_set`, `shopping_recipe_remove`, `shopping_recipe_done`); panel: *Auf die Einkaufsliste* in the recipe, block *Für Rezepte* on *Einkauf*. Shortcuts: demand flat per category (overlapping categories not netted), no reservation against min stock. Pick recipes + servings → missing amounts (demand − stock per category) → items on the shopping list (same todo entity), source shown as recipe numbers with amounts; ingredients with `skip_stock` never go on the list. Egg parts: ingredient rows on the egg product type with note Eigelb/Eiweiß are summed as eggs = whole eggs + max(yolks, whites) (1 Eigelb + 1 Eiweiß = 1 Ei). Offers (supermarket discounts) deferred: see 7. Recipe-only units (migration 13, `unit.recipe_only`): sections 2 and 3. Details: "Items from recipes" in section 3 |
| 13 | Week planner | done | migration 14 `meal_plan` (`slot` 0..4: Frühstück, Mittag, Kaffee, Abendessen, Snack; order within a day: slot, then id); `inventory/meal_plan.py`; `websocket_plan.py` (`home_inventory/meal_plan`, `meal_save`, `meal_delete`, `meal_shift {day, slot, apply}`: shifts a meal over the following days up to the first gap, `apply` false = preview); option step *Haushalt* (`household_servings`, default 3); tab *Speiseplan* with views Tag / Woche / Monat (dish = recipe from a datalist or free text, recipe defaults to Abendessen; *Umplanen* with confirm dialog listing old and new dates); read-only `calendar` entity *Speiseplan* (all-day events titled "Mahlzeit: Gericht"; next event looks 7 days ahead) |
| 13a | General use + canning | done | migration 15: `category.food` (non-food categories never become recipe ingredients), inheritable `shelf_days` (expiry proposal on book-in and canning), new seeded roots (Haustechnik: Batterien, Akkus, Leuchtmittel by socket; Hausapotheke, Tierbedarf, Eingekochtes), `recipe.canning_product_id` + `canning_temp/minutes` (canning recipe = process instruction that always makes one product, tab *Einkochen › Rezepte*), `canning` protocol with automatic charge (`YYYYMMDD-n`) as its own batch (`batch.canning_id`, rebuilt unique key), labels and scan per charge; `inventory/canning.py`, `websocket_canning.py`, tab *Einkochen*. Details: section 3 *Canning* |
| 13b | Recipe steps + cook mode | done | migration 17 `recipe_step` (recipe, pos, `section` = heading before this step, text); `recipe.instructions` stays for recipes saved before (no conversion: the editor splits it at blank lines on the next edit, saving steps clears it). `inventory/steps.py`: import splitting (schema.org HowToStep/HowToSection; one section name dropped, several become headings; leading numbers removed; one text block split at line breaks or its own numbering 1., 2., … after a sentence end) and timers read from a step's text at list time (not stored; ranges use the upper value, max 48 h). Panel: step rows editor (`recipe-steps-editor.ts`), numbered list per section (`recipe-steps.ts`), `cook-mode.ts`: full-screen ingredients + steps, tick off (not saved), timers in the browser tab (beep, vibrate), Wake Lock. Shortcut: timers die with the tab; an HA timer entity / speaker alarm is a later option |
| 13c | AI check of recipe imports | done | via HA `ai_task.generate_data` (any AI set up in HA; user picks the AI Task entity in the options, none = off; started with Google Gemini free tier). Every import is checked once, automatically: request = JSON with a fixed part first (app description, food category tree as compact `id name` lines, ~10k tokens; identical across calls so providers can cache it) and the draft (steps, ingredients with chosen category id and parser confidence). Answer by JSON schema: `{ok: true}` or `{ok: false, changes}` with only the changed ingredients/steps (veto). Long single-block steps are split by the AI. Missing product types: an ingredient change may carry `new_type {name, parent_id}` (only a product type below an existing food category, no new intermediate levels); the dialog shows it, `recipe_save` adds it in the same transaction (an existing food category of that name is reused). Dialog opens with the local draft at once, shows "KI prüft …", marks changed fields with the old value and an undo per field; saving waits for the AI or *Ohne KI-Prüfung speichern*; errors/timeouts keep the local draft. Learned mappings (replaces phase 17; migration 18 `learned_category`, `inventory/learned.py`): the category saved for an imported ingredient text (`source_text`, key = letters only, lower case) and a changed OFF suggestion of a new product (most specific tag) are asked before the rule based suggestion; learned rows are flagged to the AI. Built: `inventory/ai_check.py` (prompt, answer validation: unknown/non-food ids and no-op changes dropped, one section for all removed), `ai.py` (`probatio` answer schema, 120 s timeout, `after_dependencies: ai_task`), `home_inventory/recipe_ai_check`, options step *KI-Prüfung*. E2E never calls the real AI (`fixtures.ts` answers "off" unless stubbed). Measured on Gemini (free tier): about 5 s per import. No call cap for now Units too: an ingredient change may carry `unit_id` (existing unit) or `new_unit {name}` (no match: shown as unknown unit, the user adds it in the dialog); keys only when they change. New products from Open Food Facts get the same check (`inventory/ai_product.py`, `home_inventory/product_ai_check`, started by the book-in form): name without brand/size, category from the whole tree (food and non-food) or a `new_type` (added by the panel via `product_type_add` right before the book-in), package content; only fields still as sent are changed, undo restores them. |
| 14 | Shopping list from plan | done | no schema change. `inventory/plan_shopping.py` `plan_to_shopping_list(start, end)` (both days included, max 366 days) reuses phase 12: each recipe planned in the range goes on the list via `set_shopping_recipe` with servings = sum of its planned meals (`max` with the servings already on the list, so a second run is a no-op; optional choices kept); free-text meals are counted in `skipped`. Demand − stock then comes from `recipe_items` as for any shopping recipe. Panel: button *Einkaufsliste* in *Speiseplan* (`plan-shopping-dialog.ts`, Von/Bis default today..+6, live validation) via `home_inventory/plan_to_shopping_list`; service `home_inventory.plan_to_shopping_list` (`start`, `days`; response `recipes`, `skipped`). Not built: consumption forecast (rate from `booking`), see section 7 |
| 15 | Recipe suggestions for expiring items | done | `inventory/expiry_recipes.py`, command `home_inventory/expiring_recipes` (optional `days`, like the view's temporary threshold): `queries.expiring` batches (expired or within the warn days) of food categories → recipes whose non-optional, non-skipped ingredients have an expiring product in their category subtree (same match as availability). Ranking: used ingredients, then available/total, then name. Panel: list *Rezepte für Ablaufendes* in *Ablauf* (opens the recipe; only with the recipes module), marker "Ablaufendes: n" and filter *Nur mit Ablaufendem* in the recipe list. Read-only, so no service. No schema change |
| 16 | Move a whole location | done | *Umlagern* action on a location row: move all its stock to another location (logic exists in `force_delete` for a location; shared `_relocate` in `inventory/removal.py` serves `force_delete` and `move_location`; websocket `home_inventory/move_location`, panel only, no HA service because it is a stock correction; dialog shows batches/packages from the delete dry run) |
| 17 | Category mapping feedback | merged into 13c (learned mappings) | `mapping_log` table: each product whose OFF tags matched no category or whose suggested category was changed (EAN, OFF `categories_tags`, suggested and chosen category); view/export to improve the seed `off_tags` (`add_product` already knows both cases) |
| 18 | Opened packages | done | migration 20 (`migration_20.py`): inheritable `opened_days` (*Haltbar nach Anbruch*, > 0, on defaults / category / product, NULL = inherit, unset = no change, e.g. Nudeln); an opened package is its own **batch** (`batch.opened_on`; batch key gets opened_on, `canning_id` loses UNIQUE so a charge can have an opened batch), so book-out, move, stock edit and labels work unchanged by batch id; booking kind `open` (booking rebuilt for the CHECK; one row on the opened batch, the unopened one is implied by the key; undo = `open` −1 with `reverts_id`). Effective expiry = min(batch date, opened_on + days), computed on read. Panel: *Anbrechen* button on batch rows, booking mode *Anbrechen* (route `/home_inventory/open`), undo and *Etikett drucken* offer in the done line; websocket `home_inventory/open_package` / `open_label` / `open_undo` (`websocket_open.py`); service `home_inventory.open_package` (EAN or label code, location by name). No remaining amount (see section 7) |
| 19 | AI interface | done | design, research and decisions: section 4b. `llm_api.py`: LLM API `home_inventory` for Assist agents and HA's MCP Server, three access levels in the options (read / + shopping list and plan (default) / + booking), tools by name; write tools call the services. AI recipe import via `ai_task` when a URL has no JSON-LD (yt-dlp video + caption, else Open Graph + page text + image as attachments), from pasted text or a photo (`recipe_media.py`, `recipe_ai.py`, `inventory/ai_import.py`); the result goes through the normal draft + AI check. New requirement `yt-dlp` (already in the HA image). No schema change. Real test (Gemini, dev HA, a TikTok clip, 2026-10-19): 15.6 s, complete German draft (English caption translated, US units converted; the prompt now asks for g or pieces instead of ml for solids). Instagram not tested live (no public reel at hand; yt-dlp usually needs a login there, the Open Graph caption + image path covers it). Phone share target: see section 7 |
| 21 | Modules | done | options `modules` (`const.MODULES`: shopping, recipes, plan, canning, opened; unset = all; `opened` hides the *Anbrechen* button, booking mode and the *Haltbar nach Anbruch* fields), chosen in the config flow user step and the options step *Module*; `OptionsFlowWithReload` reloads the entry on save. Panel gets the list as `panel.config.modules` (`frontend/src/modules.ts` `hasModule`) and hides tabs, recipe buttons (to shopping list / to plan) and the settings section *Mahlzeiten*. `coordinator.module_off`: todo (shopping) / calendar (plan) add no entity and drop it from the registry. Core (stock, booking, expiry, settings, sensors) always on. Data, websocket commands and services are not gated |
| 21b | External services | done | every way data leaves HA is one entry in `const.EXTERNAL` (key -> default) with its own switch in the options step *Externe Dienste* and a gate `external_on(hass, key)` where the data would go out; the panel gets them resolved as `panel.config.external` (`hasExternal`). Keys: `off_lookup`, `recipe_url`, `ai_recipe_check`, `ai_product_check`, `ai_import`, `ai_video` (default off; yt-dlp is not in the manifest, `async_process_requirements` installs it on first use), `receipt_import`. The panel loads no library from a CDN (OCR files ship in `www/vendor/`). AI keys also need the AI Task entity. README section *Privacy* lists each. A new external service: new entry, gate, README row; the user decides its default. Third-party licenses of the bundle: `www/THIRD_PARTY_LICENSES.txt`, written by the build (`frontend/licenses.ts`) |
| 21c | Date kind *Richtwert* | done | third `expiry_type` `guide` for things without a printed date (fresh produce, dried, frozen, leftovers): "ca." date from the shelf life, warning colour when past (use_by keeps the error colour). Details: section 3 *Date kinds*. Decided 2026-10-20: name *Richtwert*; existing DBs: *Obst & Gemüse* always switched to it |
| 21d | Freezing | done | *Einfrieren* / *Auftauen* for fresh products like *Anbrechen*: `batch.frozen_on`, inheritable `frozen_days`, `location.freezer`, thawed = opened. Details: section 3 *Freezing*. Decided 2026-10-20: own module `frozen`, freezer by the flag `location.freezer`. Seeded `frozen_days` decided (section 3) |
| 21e | Drying | done | module `drying`: the canning protocol and recipe with `canning.kind` = `drying`, seeded root *Gedörrtes*. Details: section 3 *Drying*. Decided 2026-10-20: one tab *Haltbarmachen* (shown when canning or drying is on) with *Einkochen* / *Dörren* inside; duration stored in minutes, shown in hours |
| 22 | Stocktaking | done | `inventory/stocktake.py`, `websocket_stocktake.py` (`home_inventory/stocktake_scan`, `stocktake_apply`), panel route `/home_inventory/stocktake` (`stocktake-view.ts`, button *Inventur* beside the location filter). Pick a location, scan (EAN, label, name): one package of its batch there; several batches there: the panel asks; none: *Nicht im Bestand* with a date (today + shelf life). *Differenzen buchen* after one confirm: each listed batch corrected to its count (not scanned = 0), extras booked into the batch book-in would use (`booking.in_batch`, freezer rule included), all as `correct` with source `stocktake`. Rows booked meanwhile elsewhere stay untouched (only the listed batches are sent). Panel only, no service (stock corrections). No schema change
| 23 | Location labels | done | `labels.location_label_info` (name + code `PTRY:L<id>`, no date), `home_inventory/print_labels` takes `location_id` instead of `batch_id` (printer or browser like batch labels); tag icon on location rows in the settings (label dialog with a hint). Booking view: a scanned `PTRY:L<id>` (`location-scan.ts`, master data fetched fresh) sets the active location: book in presets it as the booking's location, book out lists only stock there, *Anbrechen* opens there; shown as a line with *Aufheben*; it stays until another location label, *Aufheben* or leaving the view (element state). Item labels keep their batch. Stocktaking: a location label switches the location. No service (printing a location label is a one-off), no schema change
| 24 | HA events | done | `home_inventory_booked`: `Database.run` notes the last booking id before the call and fires one event per new booking row after the commit (all entry points; data from `inventory.bookings_since`). `events.py`: `home_inventory_below_min` compares the min stock shortfalls (`inventory.below_min`, from `shopping_list`, recipes and items by hand left out) after every write with the set before (startup set = known, no event; serialized by a lock), fires for new keys only; `home_inventory_expired` at 00:00:01 for each batch in stock whose effective date was yesterday (`inventory.expired_on`). Names in `const.EVENT_*`. No schema change. README section *Events* |
| 25 | Blueprints | open | automation blueprints shipped in the repo: daily expiry notification, NFC tag books out a product, print the shopping list when leaving home |
| 26 | Dashboard card | open | small Lovelace card for a kitchen tablet: expiring soon, missing on the shopping list, today in the meal plan; data from the existing websocket commands |
| 27 | Emergency stock check | open | compare stock with the BBK checklist (10 days, persons from `household_servings`): what is missing, supply in days; checklist mapped to categories |
| 28 | Cooked books out | open | button *Gekocht* in recipe / cook mode proposes book-outs of the ingredients (FEFO, scaled servings), one confirm books them all; replaces the extension point "book out by cooking" |
| 29 | Leftovers as a charge | open | cooked leftovers (fridge / freezer) saved like a canning protocol: own charge with date, shelf life and label |
| 30 | Allergens and diet | open | allergens and vegan / vegetarian from OFF (product) or inherited on the category; filter recipes by them |
| 31 | Recipe export | open | recipe as schema.org `Recipe` JSON-LD (import into Mealie, Tandoor, back into this app) and a print / PDF view |
| 32 | Shop order | open | main categories in aisle order per shop; shopping list and receipt sorted by it |
| 33 | CSV import / export | open | stock and master data as CSV; import from Grocy as a migration aid. Export is for private use only (OFF data is ODbL); the export dialog says so |
| 34 | Product images | open | small product image from OFF (URL only, no download) in stock and booking |
| 35 | Booking history | open | history view of `booking` (already stores `user_id`): who booked what and when, filter by product / user |
| 36 | Receipt import | done | *Kassenbon importieren* in booking in (only with an AI): document scan (`camera-dialog.ts`: live camera with the outline found every 200 ms on a 480 px frame; `scan-corners.ts`: draggable corners; `opencv.ts`: Canny + biggest convex quad or the min-area rectangle of the biggest contour, perspective warp, adaptive threshold; OpenCV.js 4.12 from `www/vendor/` (copied by `frontend/vendor.ts`, no CDN), loaded on first use; a picked file gets the corner step too; *Ohne Zuschnitt* keeps the photo) -> OCR in the browser (tesseract.js, lazy chunk, engine + `deu` data from `www/vendor/`) -> `home_inventory/receipt_read` sends the text + the product list (id, name, brand) to `ai_task` (`ai.RECEIPT_SCHEMA`; prompt and answer check in `inventory/purchase.py`) -> review dialog (`receipt-import.ts`: per line product from up to 5 candidates / new product with category / skip, packages, date; empty date = guessed from the shelf life) -> `home_inventory/receipt_book` books all in one transaction (source `receipt`) and learns line -> product per store (migration 23, `receipt_line`, key = lower case + single spaces; same store first, then any). Text instead of image to save tokens. No service (always needs a human check). No prices. The same camera dialog without scan is *Foto aufnehmen* in the recipe photo import |
| 37 | Panel in English | done | `frontend/src/i18n/en.json` (same keys as de.json, `i18n:check` compares both incl. placeholders); the panel follows `hass.language` (de, else en). Sidebar title and device name (`translation_key`) follow the HA system language at setup, prints already did. AI reasons follow the panel language (`language` on the check commands); the data the AI writes (names, ingredients, steps) stays German like the seed. Guide screenshots per language (`docs/images/<name>-<lang>-<theme>.png`) |
| 38 | English seed | open | a new install in another language gets English categories, product types, units, locations and keywords (category suggestion, ingredient parser, receipt and AI prompts assume German today); existing DBs keep their data |
| 39 | Local links admins only | done | the recipe import by link refuses addresses that are not public (private, loopback, link-local; also names resolving there, e.g. `nas.lan`) for non-admins: `recipe_fetch.async_private`, error `url_private`. The page or the AI's reading of it comes back to the user, so a guest account must not read devices in the LAN. Checked at every hop: for non-admins `recipe_fetch.async_get` follows redirects itself (IP literals checked there) and uses a session whose `_PublicResolver` refuses local addresses at connect time (no check-then-use gap); the preview image goes the same way; yt-dlp runs without its generic extractor |

Order decided 2026-10-16; 21c–21e inserted before 22 on 2026-10-20 (21c first: 21d and 21e use its date kind); 21c–24 planned as one unattended run (2026-10-20 night), each its own PR, merged after green CI. Data model details are designed (agent `architect`) at the start of each phase.

**Open todos** (check before starting the next phase):

- Keep the user guide (`docs/guide.de.md`, `docs/guide.en.md`) current with every user-visible change, like README.md and README.de.md.
- Ongoing: extend the seeded product types (`seed.py`, lowest category level) whenever everyday products are missing; existing DBs get new ones by a migration step (released since 0.1.0).

## 7. Extension points (not built now)

| Later feature | Prepared by |
|---|---|
| Shopping by offers (supermarket discounts) | phase 12 shopping by recipes; no stable public API for offers (Marktguru, kaufDA: scraping only), so deferred |
| Consumption forecast on the plan shopping list (rate from `booking` over the range, minus stock) | phase 14 `plan_to_shopping_list` only adds the planned recipes; a forecast would add category items next to `recipe_items` |
| Netting recipe demand bottom-up (overlapping categories) and reserving it against min stock | phase 12 `recipe_items` sums demand flat per category; the min-stock formula per subtree is the upgrade path |
| Best-before date from the camera (read the printed date when booking in) | `expires_on` field and the camera scanner of the booking form; on-device OCR or the AI interface (phase 19) |
| Manual order within a slot | `meal_plan` rows in id order within a slot; add `sort` when needed |
| Editing the plan from the HA calendar | read-only `calendar.py`; add `CREATE_EVENT` etc. with free-text entries |
| Import from the phone's share sheet (Instagram/TikTok *Teilen* → Vorrat) | phase 19 home_inventory/recipe_import {url}; needs a pending-import inbox in the panel (the draft must be confirmed by a person) filled by an automation on the companion app's share event, or a deep link /home_inventory/recipes?import=<url> that opens the import dialog. For now: *Link kopieren* and paste |
| Remaining amount of opened packages | phase 18 (done) marks opened packages as their own batch (`opened_on`); a remaining amount would be a column on that batch; book out by cooking is phase 28 |

New feature = new module + next migration + new websocket commands + new panel tab.
