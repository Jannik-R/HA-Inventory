# Changelog

## Unreleased

### Changed

- Recipe import: links into the local network (e.g. a Mealie on the NAS) only for admins.
- **Breaking**: the domain is now `home_inventory` (was `pantry`): folder `custom_components/home_inventory`, actions `home_inventory.*`, websocket `home_inventory/*`, panel URL `/home_inventory`, database `home_inventory.db`, LLM API `home_inventory`, entity ids (set up anew, named after the HA language). Remove the old integration and set it up again; data of `pantry.db` is not taken over.
- Opening packages is a module (*Anbrechen*, on by default).
- Privacy: new options step *Externe Dienste* with one switch per service that sends data out (Open Food Facts, recipe links, AI recipe check, AI product check, AI recipe reading, video download, receipt import); see the README section *Privacy*. `yt-dlp` is no longer a requirement; it is installed on first use when video download is turned on (default off).
- The panel bundle ships `THIRD_PARTY_LICENSES.txt`.

### Added

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

### Fixed

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

### Changed

- Labels: at most 20 per print (was 99); booking in prints at most 20 as well
- Open Food Facts online searches are spaced 6 s apart (their limit is 10 per minute and IP)
- Shopping list entity: item texts follow the Home Assistant language (German or English), a product's brand in brackets
- Recipe images are loaded without sending the referrer

- Recipe units: Bund, Prise, Messerspitze, EL, TL (EL/TL convert to ml), Zehe, Scheibe, Stange, Blatt, Dose, Glas, Becher; a count unit that does not convert counts packages ("1 TL Salz" = any salt in stock)
- Seeded categories get fitting default units (Milch l, Käse g, Fleisch g, Sahne ml, Gewürze g, ...); existing databases get them only where a category has no own unit.
- A count unit (Stück) uses the package content when it is known: a 10-pack of eggs counts as 10 Stück, also for minimum stock. Checked shopping list items in Stück may come back once.

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
