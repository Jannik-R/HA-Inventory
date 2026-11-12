# Changelog

## Unreleased

### Removed

- Product pictures from Open Food Facts (stock list, booking result) and the external service *Produktbilder* (`off_images`); the stored `image_url` of products stays unused

### Fixed

- *Gekocht*: two ingredients of the same category or product no longer both claim the same packages; the proposal is planned row by row against the stock the rows before leave, so it can always be booked as shown

## 0.3.1 - 2026-11-10

### Added

- New external service *Rezeptbilder* (`recipe_images`, on by default): the browser loads recipe pictures from the website the recipe was imported from. Switch it off under *Konfigurieren > Externe Dienste*.

### Changed

- Requires Home Assistant 2026.11.0 or newer (the version CI tests against); dependency updates
- AI prompts follow the database language (German or English): product names, ingredient lines and units come back in that language

## 0.3.0 - 2026-10-26

### Upgrade notes

- Make a backup before updating. The database migrates automatically on start to schema version 32: migration 29 rebuilds `canning` (ids kept) and seeds the root category *Reste*; migration 30 adds diet and allergen columns to categories and products; migration 31 adds `booking.action_id` (older bookings each count as their own action in the history); migration 32 adds the seed language (`de` for existing databases) and repairs the unit of *Holunderbeeren*.
- New module *Allergene & Ernährung* is off by default: switch it on under *Konfigurieren > Module*. The new module *Reste* is on for new installs; an install with a saved module list gets it off until ticked there.
- New external service *Produktbilder* (`off_images`, on by default): the browser loads product pictures from Open Food Facts' image server. Switch it off under *Konfigurieren > Externe Dienste*.
- The receipt printer button in recipes and the meal plan is now *Bon drucken*; *Drucken / PDF* is the new browser print.

### Added

- Leftovers as a charge (module *Reste*): *Reste einlagern* after *Gekocht ausbuchen* or by hand in *Haltbarmachen > Reste*; a product "Reste: <Gericht>" with its own charge, date (3 days, frozen at a freezer location) and labels, one package per serving; action `home_inventory.store_leftovers`
- Recipe export: *JSON herunterladen* (schema.org `Recipe` JSON-LD) per recipe and *Alle Rezepte exportieren*; *Drucken / PDF* prints a recipe through the browser's print dialog
- Allergens and diet (module *Allergene & Ernährung*): the 14 EU major allergens and vegan / vegetarian on categories and products (inherited, filled from Open Food Facts), recipe filter *Ernährung* (strict; optional ingredients do not count but are marked), *Allergene von Open Food Facts nachladen* for existing products (throttled); `get_recipes` for AI agents carries diet and allergens
- Product pictures from Open Food Facts in the stock list and the booking result (external service *Produktbilder*)
- CSV import / export (*Einstellungen > Import / Export*, admins): products and stock as CSV with a preview of every change; import from Grocy's JSON files; import never deletes and never books out, a re-import changes nothing; import bookings fire no `home_inventory_booked` events
- Booking history (*Bestand > Verlauf*): every booking grouped by action, filters by product, user and period; undo a whole action (all or nothing), undone entries stay struck through with the undo date and user
- English seed: a new install whose Home Assistant system language is not German gets English categories, product types, units (plus oz, lb, fl oz) and locations; the ingredient parser understands English units

### Changed

- Bundled OpenCV.js 5 for the receipt scan
- Shop order (planned phase 32) dropped

### Fixed

- A partly frozen canning charge showed twice in the protocol list
- The unit of the seeded product type *Holunderbeeren* was never set (typo in the seed)

## 0.2.0 - 2026-10-21

### Upgrade notes

- **Breaking**: the domain is now `home_inventory` (was `pantry`). Remove the old integration and set it up again; the data of `pantry.db` is not taken over.
- The database migrates automatically on start to schema version 28, from any earlier version. The steps that change existing data: migration 20 rebuilds `batch` and `booking` (ids kept, no data removed); migration 24 rebuilds `defaults`, `category` and `product` and sets *Richtwert* on *Obst & Gemüse*; migration 28 adds `batch.remaining`. Existing stock stays full; a partly used package becomes its own batch once a level is set. Migrations 25 and 27 seed the freezer and emergency group values.
- While the version is 0.x, breaking changes come with a minor version (0.2.0), not a major one.

### Added

- Remaining amount of opened packages (*Füllstand*): a level on an opened or frozen row (full, ¾, ½, ¼, almost empty, empty), shown as "ca. ½"; a partly used package is its own batch and never merges with others (`home_inventory/remaining`; database migration 28, runs automatically)
- Cooked book-out (*Gekocht ausbuchen*): the recipe view and the end of cook mode book out the ingredients scaled to the servings, one row per ingredient (batch, book out or open, packages), one confirm with undo; action `home_inventory.cooked`
- Emergency stock check (*Notvorrat*, optional module): stock compared with the BBK emergency checklist (7 food groups, 10 days per person, household servings); tab *Notvorrat* and a sensor for the supply (database migration 27, runs automatically; categories get their group by name)
- Dashboard example in the README (*Dashboard*): native Home Assistant cards for a kitchen tablet (expired and expiring items, shopping list, today's meal plan), no custom card
- Scan mode *Einfrieren* (snowflake in the booking switch, optional module): one package per scan; an item label targets its batch, a scanned frozen package thaws one package, a freezer location label is the target
- Home Assistant events for automations: `home_inventory_booked` (every new booking), `home_inventory_below_min` (only minimums that were just undercut) and `home_inventory_expired` (once per batch, after midnight)
- Location labels: a label with a location's QR code (tag icon in the settings) sets the booking location until another location label, *Aufheben* or leaving the view; book in, book out and *Anbrechen* use it
- Stocktaking per location: *Inventur* beside the location filter; scan everything in a location, then *Differenzen buchen* books out missing and books in found packages in one step (source `stocktake`)
- Drying (*Dörren*) beside canning in the tab *Haltbarmachen*: drying protocols with charges and labels, drying recipes, duration in hours; action `home_inventory.drying`
- Freezing and thawing (optional module *Einfrieren*): a product booked into or moved to a freezer location is frozen and gets a frozen date (shown as "ca."); moved out, it is thawed; actions `home_inventory.freeze_package` and `home_inventory.thaw_package`; days per category are inherited (default 90)
- Date kind *Richtwert* ("ca." date) for food without a printed date, e.g. fresh produce; prefilled at book-in, labels print "ca." (database migration 24, runs automatically)
- Panel in English (PLAN 37): it follows each user's Home Assistant language (German or English, others get English); sidebar title and device name follow the system language; the AI's reasons come in the panel language. The English guide uses the English labels and its own screenshots.
- Opened packages: *Anbrechen* on a batch row, in the booking switch (label scan, barcode, name) and as action `home_inventory.open_package` marks one package as opened; it becomes its own stock row and expires after the new inherited field *Haltbar nach Anbruch* (never later than its date). Undo, and a new label is offered. Migration 20 rebuilds `batch` and `booking` (ids kept, no data removed).
- Meal plan on the receipt printer: *Drucken* in the day and week view, action `home_inventory.print_plan` (day or week). Action `home_inventory.print_planned` prints the recipes planned for a meal (default: today, the current meal by the new start times under *Einstellungen > Mahlzeiten*; database migration 19, runs automatically)
- Recipes on the receipt printer: *Drucken* in an open recipe and action `home_inventory.print_recipe` print name, servings, the ingredients to tick off (scaled) and the numbered steps
- AI check of recipe imports: with an AI Task entity chosen in the options (any AI set up in Home Assistant, e.g. Google Gemini), every import is checked once; the AI answers "fine" or only the changes (better ingredient categories, a text block split into steps), shown marked in the dialog with undo; saving waits for it or skips it. Learned choices: the category saved for an imported ingredient text, and a changed Open Food Facts suggestion for a new product, are remembered for the next time (database migration 18, runs automatically)
- Recipe steps and cook mode: the preparation is a list of numbered steps with optional headings (editor rows: add, move, remove); the import takes the page's steps (one section name dropped, several become headings, leading numbers removed, a single text block split at line breaks or its own numbering). *Kochmodus* shows ingredients and steps full screen, steps tick off with a tap, durations in a step ("20 Minuten", "10–15 Min.") become timers that beep and vibrate, the screen stays on. Older recipes keep their text until edited (database migration 17, runs automatically)
- Actions for automations: `home_inventory.shop_recipe` (a recipe on the shopping list), `home_inventory.plan_meal` (a recipe or free text in the meal plan) and `home_inventory.canning` (a canning protocol from a canning recipe, returns the charge and `batch_id` for labels); recipes and locations by name
- General use and canning: the inventory is no longer food only. Categories have a field *Lebensmittel* (inherited); non-food categories are never offered as recipe ingredients. Seeded non-food roots: *Haushalt & Drogerie*, *Haustechnik* (Batterien, Akkus, Leuchtmittel by socket), *Hausapotheke*, *Tierbedarf*. Shelf life (*Haltbarkeit*, days) on Standards, categories and products proposes today + shelf life as expiry date on booking in. Tab *Einkochen*: canning protocols (made-on date, product, jars, best-before, temperature, duration) with a charge code YYYYMMDD-n per protocol; the jars are booked in as their own batch, labels carry the charge and scanning one books out a jar of that charge. Canning recipes live in the view *Rezepte* of that tab (not in the recipe tab or the meal plan); each makes a defined product (yield in jars, optional temperature and duration), and a protocol can start from one. Seeded root *Eingekochtes* (365 days, warning 30 days) (database migrations 15 and 16, run automatically)
- Week planner: tab *Speiseplan* with views Tag, Woche and Monat (prev / Heute / next move by day, week or month); every dish has a meal slot (Frühstück, Mittag, Kaffee, Abendessen, Snack; a recipe defaults to Abendessen); *Umplanen* (arrow on a dish) shifts that meal over the following days up to the first gap, after a confirmation that lists the changes; a dish is a recipe (name list) or free text, servings default to *Portionen im Haushalt* (new options step *Haushalt* in the menu *Einstellungen*, default 3); deleting a recipe keeps its dishes as free text; read-only calendar entity *Speiseplan* with an all-day event per dish titled "Mahlzeit: Gericht" (database migration 14, runs automatically)
- Label printer on USB: instead of a print server address, the Dymo LabelWriter can be set up with the device path on the HA host (e.g. `/dev/usb/lp0`), like the receipt printer
- Shopping by recipes: *Auf die Einkaufsliste* on a recipe puts its missing amounts on the shopping list (servings, optional ingredients on request); amounts of all recipes are added up per category, items reference their recipes by number (1, 2 …). Block *Für Rezepte* on the *Einkauf* tab changes servings or removes a recipe; recipes stay until removed (database migration 12, runs automatically)
- Receipt printer: *Einkaufszettel drucken* on the *Einkauf* tab and action `home_inventory.print_shopping_list` print the open shopping list on an ESC/POS receipt printer (58 / 80 mm, USB device on the HA host or network, cutter); set up under *Configure > Bondrucker* with a test receipt
- User guide in German and English (`docs/guide.de.md`, `docs/guide.en.md`); the question mark in the panel header opens it
- Tooltips: icon buttons name their action, and labels of non-obvious fields (dotted underline) explain the field on hover
- Products: optional own *Mindestanzahl* (packages) when booking in a new product and in the product dialog; below it the product goes on the shopping list by itself and counts toward its categories' minimums (database migration 11, runs automatically)
- Booking in / editing a product: a missing category or Produktart can be created right in the category picker (*„…“ neu anlegen*, then the parent)
- More recipe units (cl, dl, Handvoll, Zweig, Würfel, Beutel, Schuss, Kopf, Stiel, Kugel, Flasche, Tasse, Spritzer, Tropfen), about 1,000 more seeded product types and a subcategory *Alkohol* under Getränke; existing databases get the missing ones (database migration 9, runs automatically)
- Recipe ingredients: checkbox *Nicht gegen den Vorrat prüfen* (e.g. Salz, Wasser): no stock check, shown as "nicht geprüft", not counted in the summary (database migration 10, runs automatically)
- Recipe import (tab *Rezepte*, *Importieren*): a recipe URL is read from its schema.org data (e.g. Chefkoch, Mealie, Tandoor); the page is loaded only on click (15 s, 5 MB, HTML). The recipe dialog opens prefilled for review, nothing is saved before. Ingredient lines are parsed (fractions, ranges, units, notes, optional); the original line is shown per ingredient
- Recipe units: any user can add a unit (*Neue Einheit …*) in an ingredient row; unknown units from an import ask first (create or pick). Spelling variants map to one unit
- Recipe-only units: checkbox *Nur für Rezepte* in *Einstellungen › Einheiten* hides a unit from every picker except recipe ingredients (EL, TL, Tasse, Prise …; rule-of-thumb sizes: EL = 15 ml, TL = 5 ml, Tasse = 250 ml, Prise and Messerspitze = 0.5 g, Zehe = 0.1 Stück, Handvoll = 30 g, Zweig and Stiel = 0.1 Bund, Tropfen, Spritzer, Schuss; only Scheibe has none). Recipes show the amount in the base unit ("3 EL (≈ 45 ml)"); the shopping list converts it when the base unit fits the category (ml for volume, g for weight; otherwise the base unit, and an ingredient without an amount shows 1 Pkg.; database migration 13, runs automatically)
- About 320 seeded product types (Produktarten, e.g. Tomatenmark, Spaghetti, Basmatireis) below the existing subcategories; existing databases get the missing ones on update (database migration 8, runs automatically; renamed or deleted categories are respected). Product names like "Mutti Tomatenmark" are now categorized to a product type.
- Recipe ingredients: optional *Hinweis* (e.g. "fein gewürfelt"); any user can add a new product type while editing a recipe
- Recipes (tab *Rezepte*): ingredients by product type or category, availability from stock per ingredient, servings scaling, search by name and ingredient (database migration 7, runs automatically)

### Changed

- Recipe import: links into the local network (e.g. a Mealie on the NAS) only for admins.
- **Breaking**: the domain is now `home_inventory` (was `pantry`): folder `custom_components/home_inventory`, actions `home_inventory.*`, websocket `home_inventory/*`, panel URL `/home_inventory`, database `home_inventory.db`, LLM API `home_inventory`, entity ids (set up anew, named after the HA language). Remove the old integration and set it up again; data of `pantry.db` is not taken over.
- Opening packages is a module (*Anbrechen*, on by default).
- Privacy: new options step *Externe Dienste* with one switch per service that sends data out (Open Food Facts, recipe links, AI recipe check, AI product check, AI recipe reading, video download, receipt import); see the README section *Privacy*. `yt-dlp` is no longer a requirement; it is installed on first use when video download is turned on (default off).
- The panel bundle ships `THIRD_PARTY_LICENSES.txt`.
- Receipt import: OpenCV.js, tesseract.js and the German OCR data ship with the integration (`www/vendor/`, about 16 MB) instead of loading from the jsDelivr CDN.
- Labels: at most 20 per print (was 99); booking in prints at most 20 as well
- Open Food Facts online searches are spaced 6 s apart (their limit is 10 per minute and IP)
- Shopping list entity: item texts follow the Home Assistant language (German or English), a product's brand in brackets
- Recipe images are loaded without sending the referrer
- Recipe units: Bund, Prise, Messerspitze, EL, TL (EL/TL convert to ml), Zehe, Scheibe, Stange, Blatt, Dose, Glas, Becher; a count unit that does not convert counts packages ("1 TL Salz" = any salt in stock)
- Seeded categories get fitting default units (Milch l, Käse g, Fleisch g, Sahne ml, Gewürze g, ...); existing databases get them only where a category has no own unit.
- A count unit (Stück) uses the package content when it is known: a 10-pack of eggs counts as 10 Stück, also for minimum stock. Checked shopping list items in Stück may come back once.

### Fixed

- Freezing: with the module *Einfrieren* off, no date changes; booking in at or moving to a freezer is a plain booking, freeze and thaw are refused
- Barcode scanning in Firefox works again with the camera; a detector error is shown instead of retrying silently
- Printer settings: after a failed test print, *Testdruck* stays ticked, so trying again tests again instead of saving untested
- Action forms: *Packages* of `home_inventory.book_in` allowed up to 9999 again (was 2099), *Count* of `home_inventory.print_labels` up to 20
- Booking in: *Zurücksetzen* of the location now shows the default again (selects in other dialogs had the same issue)
- Recipe import: a hostile or broken page can no longer stall Home Assistant (linear page scan, limited line length, deeply nested data skipped)
- Dialogs: a double click or a second Enter no longer saves, adds or prints twice
- Esc in a dialog opened from another dialog (e.g. the category picker) no longer asks to discard the outer one
- *Rückgängig* stays available when putting back failed
- Views no longer reload on every Home Assistant state change while their first load runs
- Recipes: a Produktart or unit created in a cancelled recipe dialog now shows up right away
- Tree arrows in *Bestand*, *Einstellungen* and the category picker are aligned and without a frame
- Open Food Facts image links other than http(s) are dropped (booking in such a product failed)

## 0.1.0 - 2026-10-16

First release.

### Added

- Panel *Vorrat*: book in / out by barcode (USB/Bluetooth scanner or camera) or name, product data from Open Food Facts
- Category tree with inherited defaults (unit, location, date type, warning days), storage locations, units
- Stock overview with search, take-out with undo, batch correction; expiry view with a temporary threshold
- Sensors *Abgelaufen* / *Läuft bald ab*; shopping list from minimum stock (amount and/or packages) plus items by hand, also as an HA to-do list
- Labels with QR code on a Dymo LabelWriter 450 (network print server) or through the browser; scan a label to book out
- Services `home_inventory.book_in`, `home_inventory.book_out`, `home_inventory.print_labels` for automations
- Database in `<config>/home_inventory.db`, locked during HA backups
