# Implementation Plan

Household inventory ("Vorrat": food, but also batteries, household goods, medicine, home-canned jars) as a Home Assistant **custom integration** (no add-on).
Everything runs inside the HA process; UI is a sidebar panel.

## 1. Architecture

```
HA sidebar panel (Lit web component, one bundled JS file)
        │  hass.callWS(...)
        ▼
websocket.py ── services.py ── LLM API tools (later)
        │                │                        │
        └────────────────┴──── inventory/ ────────┘   ← all business logic, one place
                                   │
                         db.py (stdlib sqlite3, <config>/pantry.db)
                                   │
              off.py (Open Food Facts lookup, result cached in `product`)
              label.py (render label, raw to a network print server)
              receipt.py (planned: ESC/POS receipt printer, see 4a)

Entities: sensor (expired / expiring soon), todo (shopping list; its state = open items, so no extra below-min sensor)
```

Rule: **every** entry point (panel, services, automations, future AI tools) calls
the `inventory` package (public API in its `__init__`, one submodule per concern). No logic in websocket handlers or entities.

### Key decisions

| Topic | Decision | Why |
|---|---|---|
| Domain | `pantry` | English code; UI says "Vorrat" |
| Storage | stdlib `sqlite3`, one file in config dir, schema via `PRAGMA user_version` migrations | relational data, constraints, growing booking log, recipes later. No dependency. |
| Backup safety | `backup.py` platform (`async_pre_backup` / `async_post_backup`) closes/locks DB | prevents corrupt DB in HA backups |
| DB access | executor jobs, one connection + lock | `shortcut:` single lock, fine for a household |
| Product data | Open Food Facts API v2 (EAN), `cgi/search.pl` for names (10 req/min: explicit search only); local products first; OFF result stored in `product` table on first booking | free, good DE coverage; local copy = cache |
| Frontend → backend | HA websocket commands | panel already has authenticated `hass` |
| Permissions | booking, lookup, search, stock, product edits, shopping list, label printing (max 20 per call): every HA user; any user may also add a category below an existing one (`product_type_add`), a unit (`unit_add`) and import recipes; master data writes otherwise and product delete: admin only; recipes: any user creates and edits, admin deletes | the kitchen phone may use a non-admin account |
| Automations | HA services, all with a response, by name instead of id (`inventory/codes.py`): `pantry.book_in` / `pantry.book_out` (EAN or label code + location name), `pantry.print_labels` (printer only, no browser), `pantry.print_shopping_list`, `pantry.shop_recipe` (recipe on the shopping list), `pantry.plan_meal` (recipe or text in the meal plan), `pantry.canning` (protocol from a canning recipe). Unknown EANs fail (new products need a category: panel only, no OFF call from automations). Rule: every panel action an automation or voice command can trigger gets a service; master data upkeep (products, categories, locations, units, recipes), stock corrections and undo stay panel only | scanners/NFC/ESPHome/voice can call them |
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
location   (id, name UNIQUE, sort, active 0|1)   -- never deleted: "delete" deactivates (must be empty),
           -- so bookings keep a valid FK; adding the same name again reactivates it
defaults   (id = 1, unit_id → unit, default_location_id NULL → location, expiry_type, warn_days, shelf_days NULL)
           -- one row: root of inheritance, editable in Einstellungen › Standards
category   (id, parent_id NULL → category, name, sort,
            unit_id, default_location_id, expiry_type, warn_days, shelf_days,   -- inheritable, NULL = inherit
            food NULL 0|1,                                           -- 0 = not a food: no recipe ingredient; NULL = inherit, root = food (migration 15)
            min_stock NULL, min_stock_amount_id NULL → unit,           -- amount with its own unit (both or none, CHECK); NOT inherited
            min_packages NULL)                                       -- package count (> 0); NOT inherited (migration 4)
product    (id, ean UNIQUE NULL, name, brand, category_id → category,
            content_amount, content_unit_id,                         -- e.g. 500 g per package; both or none (CHECK)
            default_location_id, expiry_type, warn_days, shelf_days,  -- overrides, NULL = inherit
            image_url, off_json, updated_at,
            min_packages NULL)                                        -- own minimum in packages (migration 11)
batch      (id, product_id, expires_on DATE, created_at, canning_id NULL UNIQUE → canning (cascade))
           -- unique (product_id, expires_on, canning_id) (expression index, migration 15): a canning charge is its own batch
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
booking    (id, ts, kind 'in'|'out'|'move'|'correct', batch_id → batch (cascade), location_id → location,
            to_location_id → location,           -- only 'move' (location_id = source)
            packages,                            -- always positive; 'correct' = signed difference
            source 'scan'|'manual'|'label'|'service'|'undo', user_id,
            reverts_id UNIQUE NULL → booking)    -- an undo's 'in' names the 'out' it reverses: undone once (migration 6)
            -- root category names are unique too (partial unique index, migration 6)
```

### Category tree

One self-referencing `category` table, any depth. Convention (not enforced):
**main category → category → food type**, e.g. `Nudeln, Reis & Getreide → Nudeln → Spaghetti`.
Products attach to any node, normally the leaf. The lowest level is called **Produktart** (product type)
in the UI: brand-independent, e.g. Tomatenmark. No separate table: a product type is a category.
Any user can add a category below an existing one (`pantry/product_type_add`: recipe ingredient,
category picker when booking in / editing a product); main categories and edits stay admin-only.
The seed (`seed_types.py`, ~320 types under the sub-categories) fills it for a new DB; migration 8 adds
the missing ones to existing DBs (only under a parent with that exact name, only when no category has
the type's name yet, so user renames and deletions stay). It also sets default units (`_DE_UNITS`: Milch l, Käse g, Fleisch g, ...) on categories without an own unit. Any user can add a type from a recipe
(`pantry/product_type_add`). Name keywords also match single-word type names (`suggest.py`).

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
  `shelf_days` gives it: booking in proposes today + shelf life, a canning protocol made-on date + shelf
  life. Always a proposal, the field stays editable. No shelf life = no proposal (default).
- Opened packages (phase 18) will shorten it again (`haltbar nach Anbruch`).

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

## 4. Label printing (Dymo LabelWriter 450)

The 450 has only USB. It goes into the network through a **TP-Link mini print server**
(USB print server, e.g. TL-PS110U / TL-WPS510U: raw TCP port 9100 and LPD), so neither HA nor
a Pi needs a USB cable to the printer.

```
HA (pantry) ──raw TCP :9100 (Dymo raster commands)──▶ TP-Link print server ──USB──▶ LabelWriter 450
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
Label content: QR `PTRY:<key>:<date>`, product name, brand, expiry date. No label table; reprint = `count` identical labels of a batch (1..20, `MAX_LABELS`); `pantry/print_labels` renders once: network printer `{printed}`, browser `{image, count, width_mm, height_mm}` (the panel repeats the image).
README documents the print server setup (fixed IP, port 9100 enabled) and the optional CUPS setup.

Network printing is **optional**: no printer configured → labels still work, the panel
opens the same PNG in the browser print view (`@page` sized to the label). Camera scanner
works on the Pi installation via HTTPS (cloud / local reverse proxy).

## 4a. Receipt printer (shopping list, later recipes)

Goal: print the shopping list (Phase 7) and later recipes on a cheap thermal receipt printer,
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
- Entry points: panel button "Einkaufszettel drucken" in the *Einkauf* tab, service `pantry.print_shopping_list`.

## 5. Development environment

`dev/docker-compose.yml` runs HA stable with `custom_components/pantry` mounted read-only.
All runtime data goes to `dev/config/` (git-ignored). Only `docker-compose.yml` and
`configuration.yaml` are committed.
Port bound to `127.0.0.1`; `trusted_networks` with `allow_bypass_login` → no password for local
browser tests (Claude's browser, later Playwright). The MCP Server uses its own token (`HA_DEV_TOKEN`).

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
| 5 | Overview + search | done | stock list, filters (category tree with products as leaves, take out one package per batch with undo; all filtering in the panel: one `pantry/stock` call, data size of a household) |
| 6 | Expiry | done | expiry view with temporary threshold (all in the panel from `pantry/stock`, like Phase 5), sensors expired / expiring soon (packages, batches as attribute; `DataUpdateCoordinator` without polling: `Database.run` sends a dispatcher signal after any write, plus a refresh at midnight) |
| 6a | Stock + products | done | "Produkte" tab merged into "Bestand": product rows get edit/delete, batch rows an edit dialog (`inventory.edit_stock`: date and count of one batch at one location, date type stays a product property; another date moves the packages to that batch, logged as two corrections); products without stock only via an opt-in checkbox |
| 6b | Maintenance | done | migration 3 (OFF tags normalized, CHECKs, location deactivation + booking FKs, `defaults` table editable in settings), styled confirm dialog, Prettier + i18n check in CI, skills `db-migration` and `feature-checklist` |
| 7 | Min stock | done | migration 4 (`min_stock_amount_id`: the minimum keeps its unit; `min_packages`; `shopping_done`), both minimums in the category dialog, *Einkauf* tab, todo entity *Einkaufsliste*; items by hand (migration 5 `shopping_item`, panel dialog with search and create, todo create/delete); deleting master data in use (`delete_impact` = dry run of the delete in a savepoint, diff of all tables, rolled back: lists every row deleted or changed; `force_delete` cascades or clears references, a location's stock moves or is booked out) |
| 8 | Labels | done | `inventory/labels.py` (`label_info`, `book_out_code`: one package of the batch the code names; no schema change), `label.py` (QR + text with Pillow/segno, Dymo stream, raw TCP send), options flow in two steps (printer model via `label_printers.py`, then host, size, print on book-in, test print), confirm before printing more than 2 labels, `websocket_label.py`, panel: print on book-in, reprint dialog per batch row, scan `PTRY:` to book out, browser print when no printer. CUPS/IPP not built |
| 8a | Receipt printer | done | `receipt.py`: shopping list (open items, grouped by main category, todo texts) as one ESC/POS bit image (`ESC *` 24-dot lines, line spacing 24, 203 dpi; the A799 does not know `GS v 0`; 58 mm = 384 / 80 mm = 576 dots), feed, partial cut. Transports: device path (`/dev/ttyUSB0` / `/dev/ttyACM0`; a tty is set raw at the configured baud) or host[:port] raw TCP. Options menu: label printer / receipt printer (target, width, cutter, baud, test receipt); each part keeps the other's options. `pantry/print_shopping_list` (any user), service `pantry.print_shopping_list`, panel button in *Einkauf* when set up. No schema change, no new requirement. Recipes: `inventory/recipe_print.py` (`recipe_sheet`: scaled amounts, names, steps), `receipt.recipe_lines` (kinds text / head / item / step with hanging indent), `pantry/print_recipe` (any user), service `pantry.print_recipe` (recipe by name, dish or canning), meal plan: `receipt.plan_lines`, `pantry/print_plan {start, days 1|7}`, services `pantry.print_plan` (day / week Monday to Sunday) and `pantry.print_planned` (recipes of a meal; migration 19 `meal_time` start per slot, `meal_plan.meal_at`: latest start <= now, before the first start the last slot; settings section *Mahlzeiten*, `meal-times-view.ts`). Panel button `receipt-button.ts` (recipe, day / week view) when a receipt printer is set up. E2E blocks every `pantry/print_*` command |
| 9 | Release | done | services `pantry.book_in` / `book_out` / `print_labels`, README, `release` skill, CHANGELOG, first release 0.1.0 (HACS once the repo is public) |
| 10 | Recipe DB | done | `recipe` (name, servings, instructions, source URL, image URL), `recipe_ingredient` (category node = product type or a more general category as the ingredient key, amount, unit, `text` = name snapshot of the category (typed only while unmatched), optional `note`, optional flag); tab *Rezepte*: list with search, edit dialog, availability per ingredient from stock (category subtree, unit conversion like min stock). Cooking does **not** book out (booking stays manual). Migration 7 (migration 8: seeded product types); `inventory/recipes.py` + `amounts.py` (shared with min stock; a count unit now uses the package content); `websocket_recipe.py`; servings scaling per view (recipe view still starts at the recipe's servings; the household option is used by the plan); delete via `deleteMasterRow` |
| 11 | Recipe import | done | `recipe_fetch.py`: page fetch via HA's session, on user click only (15 s timeout, max 5 MB, HTML only, http/https; no private-IP block, so LAN servers like Mealie/Tandoor work; any user). `inventory/recipe_import.py`: schema.org `Recipe` JSON-LD → draft, nothing saved; the recipe dialog confirms it (product type/category suggested, must be checked). `inventory/ingredient_line.py`: German line parser (fractions ½ / 1/2, ranges take the upper value, Chefkoch "Zehe/n" and "Zwiebel(n)" (suffix dropped), leading size word (klein, groß, mittel…) → note, units by name/symbol/plural/alias, amount without unit → Stück, comma/bracket text → note, "n. B."/"nach Belieben" → no amount, "evtl." → optional, qualifier after the unit ("1 TL, gestr. Salz") and a trailing "für/zum/zur …" clause → note, eggs: Eigelb/Eiweiß/Eidotter/Eiklar → text "Ei" (egg category) with note Eigelb/Eiweiß, aliases (Tüte, Stängel, Fläschchen), no amount + "und"/"&" → one ingredient per part), unit matching and dedupe (spelling variants reuse one unit), `unit_add`. Unknown unit (capitalized word between amount and name, unless the category suggestion knows it as an ingredient or a product type starts with it: "2 Zwiebeln rot", "3 Pak Choi" stay 2/3 Stück): the row asks to create it (prefilled) or pick one; save blocked until decided. Commands `pantry/recipe_import`, `pantry/unit_add` in `websocket_recipe.py`; panel `recipe-import.ts`, `unit-add-dialog.ts`. No schema change. Image `@id` references in `@graph` are resolved. Pages without JSON-LD: error. Instagram/free text: phase 19 |
| 12 | Shopping by recipes | done | migration 12 (`shopping_recipe`, `shopping_recipe_optional`, `shopping_done_recipe`); `inventory/shopping_recipes.py`; `websocket_recipe.py` (`pantry/shopping_recipes`, `shopping_recipe_set`, `shopping_recipe_remove`, `shopping_recipe_done`); panel: *Auf die Einkaufsliste* in the recipe, block *Für Rezepte* on *Einkauf*. Shortcuts: demand flat per category (overlapping categories not netted), no reservation against min stock. Pick recipes + servings → missing amounts (demand − stock per category) → items on the shopping list (same todo entity), source shown as recipe numbers with amounts; ingredients with `skip_stock` never go on the list. Egg parts: ingredient rows on the egg product type with note Eigelb/Eiweiß are summed as eggs = whole eggs + max(yolks, whites) (1 Eigelb + 1 Eiweiß = 1 Ei). Offers (supermarket discounts) deferred: see 7. Recipe-only units (migration 13, `unit.recipe_only`): sections 2 and 3. Details: "Items from recipes" in section 3 |
| 13 | Week planner | done | migration 14 `meal_plan` (`slot` 0..4: Frühstück, Mittag, Kaffee, Abendessen, Snack; order within a day: slot, then id); `inventory/meal_plan.py`; `websocket_plan.py` (`pantry/meal_plan`, `meal_save`, `meal_delete`, `meal_shift {day, slot, apply}`: shifts a meal over the following days up to the first gap, `apply` false = preview); option step *Haushalt* (`household_servings`, default 3); tab *Speiseplan* with views Tag / Woche / Monat (dish = recipe from a datalist or free text, recipe defaults to Abendessen; *Umplanen* with confirm dialog listing old and new dates); read-only `calendar` entity *Speiseplan* (all-day events titled "Mahlzeit: Gericht"; next event looks 7 days ahead) |
| 13a | General use + canning | done | migration 15: `category.food` (non-food categories never become recipe ingredients), inheritable `shelf_days` (expiry proposal on book-in and canning), new seeded roots (Haustechnik: Batterien, Akkus, Leuchtmittel by socket; Hausapotheke, Tierbedarf, Eingekochtes), `recipe.canning_product_id` + `canning_temp/minutes` (canning recipe = process instruction that always makes one product, tab *Einkochen › Rezepte*), `canning` protocol with automatic charge (`YYYYMMDD-n`) as its own batch (`batch.canning_id`, rebuilt unique key), labels and scan per charge; `inventory/canning.py`, `websocket_canning.py`, tab *Einkochen*. Details: section 3 *Canning* |
| 13b | Recipe steps + cook mode | done | migration 17 `recipe_step` (recipe, pos, `section` = heading before this step, text); `recipe.instructions` stays for recipes saved before (no conversion: the editor splits it at blank lines on the next edit, saving steps clears it). `inventory/steps.py`: import splitting (schema.org HowToStep/HowToSection; one section name dropped, several become headings; leading numbers removed; one text block split at line breaks or its own numbering 1., 2., … after a sentence end) and timers read from a step's text at list time (not stored; ranges use the upper value, max 48 h). Panel: step rows editor (`recipe-steps-editor.ts`), numbered list per section (`recipe-steps.ts`), `cook-mode.ts`: full-screen ingredients + steps, tick off (not saved), timers in the browser tab (beep, vibrate), Wake Lock. Shortcut: timers die with the tab; an HA timer entity / speaker alarm is a later option |
| 13c | AI check of recipe imports | done | via HA `ai_task.generate_data` (any AI set up in HA; user picks the AI Task entity in the options, none = off; started with Google Gemini free tier). Every import is checked once, automatically: request = JSON with a fixed part first (app description, food category tree as compact `id name` lines, ~10k tokens; identical across calls so providers can cache it) and the draft (steps, ingredients with chosen category id and parser confidence). Answer by JSON schema: `{ok: true}` or `{ok: false, changes}` with only the changed ingredients/steps (veto). Long single-block steps are split by the AI. Missing product types: an ingredient change may carry `new_type {name, parent_id}` (only a product type below an existing food category, no new intermediate levels); the dialog shows it, `recipe_save` adds it in the same transaction (an existing food category of that name is reused). Dialog opens with the local draft at once, shows "KI prüft …", marks changed fields with the old value and an undo per field; saving waits for the AI or *Ohne KI-Prüfung speichern*; errors/timeouts keep the local draft. Learned mappings (replaces phase 17; migration 18 `learned_category`, `inventory/learned.py`): the category saved for an imported ingredient text (`source_text`, key = letters only, lower case) and a changed OFF suggestion of a new product (most specific tag) are asked before the rule based suggestion; learned rows are flagged to the AI. Built: `inventory/ai_check.py` (prompt, answer validation: unknown/non-food ids and no-op changes dropped, one section for all removed), `ai.py` (`probatio` answer schema, 120 s timeout, `after_dependencies: ai_task`), `pantry/recipe_ai_check`, options step *KI-Prüfung*. E2E never calls the real AI (`fixtures.ts` answers "off" unless stubbed). Measured on Gemini (free tier): about 5 s per import. No call cap for now |
| 14 | Shopping list from plan | done | no schema change. `inventory/plan_shopping.py` `plan_to_shopping_list(start, end)` (both days included, max 366 days) reuses phase 12: each recipe planned in the range goes on the list via `set_shopping_recipe` with servings = sum of its planned meals (`max` with the servings already on the list, so a second run is a no-op; optional choices kept); free-text meals are counted in `skipped`. Demand − stock then comes from `recipe_items` as for any shopping recipe. Panel: button *Einkaufsliste* in *Speiseplan* (`plan-shopping-dialog.ts`, Von/Bis default today..+6, live validation) via `pantry/plan_to_shopping_list`; service `pantry.plan_to_shopping_list` (`start`, `days`; response `recipes`, `skipped`). Not built: consumption forecast (rate from `booking`), see section 7 |
| 15 | Recipe suggestions for expiring items | open | expiring batches → their categories → recipes ranked by expiring ingredients used and availability; shown in *Ablauf* and the recipe list |
| 16 | Move a whole location | open | *Umlagern* action on a location row: move all its stock to another location (logic exists in `force_delete` for a location; reuse it for a location that stays) |
| 17 | Category mapping feedback | merged into 13c (learned mappings) | `mapping_log` table: each product whose OFF tags matched no category or whose suggested category was changed (EAN, OFF `categories_tags`, suggested and chosen category); view/export to improve the seed `off_tags` (`add_product` already knows both cases) |
| 18 | Opened packages | open | mark a package as opened (no remaining amount): it gets its own stock row with `opened_on`; new inherited field *haltbar nach Anbruch* (days) on category/product, empty = no change (e.g. Nudeln); effective expiry = min(batch expiry, opened_on + days); expiry view, sensors and labels use it |
| 19 | AI interface | open | HA **LLM API** (`homeassistant.helpers.llm`) with tools calling `inventory` → Assist agents and HA's built-in **MCP Server**; no own MCP server. AI recipe import (Instagram caption, free text) via HA `ai_task`, reusing `ai.py` / `ai_check.py` from phase 13c |
| 20 | User feedback with AI evaluation | open | users send feedback from the panel (text, view it came from, optional screenshot); `feedback` table; the AI interface (phase 19) groups and summarizes it into issues / plan items; admin view to review and close entries |
| 21 | Modules | done | options `modules` (`const.MODULES`: shopping, recipes, plan, canning; unset = all), chosen in the config flow user step and the options step *Module*; `OptionsFlowWithReload` reloads the entry on save. Panel gets the list as `panel.config.modules` (`frontend/src/modules.ts` `hasModule`) and hides tabs, recipe buttons (to shopping list / to plan) and the settings section *Mahlzeiten*. `coordinator.module_off`: todo (shopping) / calendar (plan) add no entity and drop it from the registry. Core (stock, booking, expiry, settings, sensors) always on. Data, websocket commands and services are not gated |
| 22 | Stocktaking | open | *Inventur* mode per location: scan everything there, then the differences (missing / too many per batch) become correction bookings after one confirm |
| 23 | Location labels | open | QR `PTRY:L<id>` per location (shelf, compartment), printed with the existing label printing; scanning it in the booking field sets the location for the following bookings |
| 24 | HA events | open | fire `pantry_booked`, `pantry_below_min`, `pantry_expired` on the HA event bus (after the DB write), so automations react without watching sensors |
| 25 | Blueprints | open | automation blueprints shipped in the repo: daily expiry notification, NFC tag books out a product, print the shopping list when leaving home |
| 26 | Dashboard card | open | small Lovelace card for a kitchen tablet: expiring soon, missing on the shopping list, today in the meal plan; data from the existing websocket commands |
| 27 | Emergency stock check | open | compare stock with the BBK checklist (10 days, persons from `household_servings`): what is missing, supply in days; checklist mapped to categories |
| 28 | Cooked books out | open | button *Gekocht* in recipe / cook mode proposes book-outs of the ingredients (FEFO, scaled servings), one confirm books them all; replaces the extension point "book out by cooking" |
| 29 | Leftovers as a charge | open | cooked leftovers (fridge / freezer) saved like a canning protocol: own charge with date, shelf life and label |
| 30 | Allergens and diet | open | allergens and vegan / vegetarian from OFF (product) or inherited on the category; filter recipes by them |
| 31 | Recipe export | open | recipe as schema.org `Recipe` JSON-LD (import into Mealie, Tandoor, back into this app) and a print / PDF view |
| 32 | Shop order | open | main categories in aisle order per shop; shopping list and receipt sorted by it |
| 33 | CSV import / export | open | stock and master data as CSV; import from Grocy as a migration aid |
| 34 | Product images | open | small product image from OFF (URL only, no download) in stock and booking |
| 35 | Booking history | open | history view of `booking` (already stores `user_id`): who booked what and when, filter by product / user |

Order decided 2026-10-16. Data model details are designed (agent `architect`) at the start of each phase.

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
| Remaining amount of opened packages | phase 18 marks opened packages only; book out by cooking is phase 28 |

New feature = new module + next migration + new websocket commands + new panel tab.
