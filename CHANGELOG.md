# Changelog

## Unreleased

### Added

- Receipt printer: *Einkaufszettel drucken* on the *Einkauf* tab and action `pantry.print_shopping_list` print the open shopping list on an ESC/POS receipt printer (58 / 80 mm, USB device on the HA host or network, cutter); set up under *Configure > Bondrucker* with a test receipt
- User guide in German and English (`docs/guide.de.md`, `docs/guide.en.md`); the question mark in the panel header opens it
- Tooltips: icon buttons name their action, and labels of non-obvious fields (dotted underline) explain the field on hover
- Products: optional own *Mindestanzahl* (packages) when booking in a new product and in the product dialog; below it the product goes on the shopping list by itself and counts toward its categories' minimums (database migration 11, runs automatically)
- Booking in / editing a product: a missing category or Produktart can be created right in the category picker (*„…“ neu anlegen*, then the parent)
- More recipe units (cl, dl, Handvoll, Zweig, Würfel, Beutel, Schuss, Kopf, Stiel, Kugel, Flasche, Tasse, Spritzer, Tropfen), about 1,000 more seeded product types and a subcategory *Alkohol* under Getränke; existing databases get the missing ones (database migration 9, runs automatically)
- Recipe ingredients: checkbox *Nicht gegen den Vorrat prüfen* (e.g. Salz, Wasser): no stock check, shown as "nicht geprüft", not counted in the summary (database migration 10, runs automatically)
- Recipe import (tab *Rezepte*, *Importieren*): a recipe URL is read from its schema.org data (e.g. Chefkoch, Mealie, Tandoor); the page is loaded only on click (15 s, 5 MB, HTML). The recipe dialog opens prefilled for review, nothing is saved before. Ingredient lines are parsed (fractions, ranges, units, notes, optional); the original line is shown per ingredient
- Recipe units: any user can add a unit (*Neue Einheit …*) in an ingredient row; unknown units from an import ask first (create or pick). Spelling variants map to one unit
- About 320 seeded product types (Produktarten, e.g. Tomatenmark, Spaghetti, Basmatireis) below the existing subcategories; existing databases get the missing ones on update (database migration 8, runs automatically; renamed or deleted categories are respected). Product names like "Mutti Tomatenmark" are now categorized to a product type.
- Recipe ingredients: optional *Hinweis* (e.g. "fein gewürfelt"); any user can add a new product type while editing a recipe
- Recipes (tab *Rezepte*): ingredients by product type or category, availability from stock per ingredient, servings scaling, search by name and ingredient (database migration 7, runs automatically)

### Fixed

- Action forms: *Packages* of `pantry.book_in` allowed up to 9999 again (was 2099), *Count* of `pantry.print_labels` up to 20
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
- Services `pantry.book_in`, `pantry.book_out`, `pantry.print_labels` for automations
- Database in `<config>/pantry.db`, locked during HA backups
