# Changelog

## Unreleased

### Added

- Recipe ingredients: checkbox *Nicht gegen den Vorrat prüfen* (e.g. Salz, Wasser): no stock check, shown as "nicht geprüft", not counted in the summary (database migration 10, runs automatically)
- Recipe import (tab *Rezepte*, *Importieren*): a recipe URL is read from its schema.org data (e.g. Chefkoch, Mealie, Tandoor); the page is loaded only on click (15 s, 5 MB, HTML). The recipe dialog opens prefilled for review, nothing is saved before. Ingredient lines are parsed (fractions, ranges, units, notes, optional); the original line is shown per ingredient
- Recipe units: any user can add a unit (*Neue Einheit …*) in an ingredient row; unknown units from an import ask first (create or pick). Spelling variants map to one unit
- About 320 seeded product types (Produktarten, e.g. Tomatenmark, Spaghetti, Basmatireis) below the existing subcategories; existing databases get the missing ones on update (database migration 8, runs automatically; renamed or deleted categories are respected). Product names like "Mutti Tomatenmark" are now categorized to a product type.
- Recipe ingredients: optional *Hinweis* (e.g. "fein gewürfelt"); any user can add a new product type while editing a recipe
- Recipes (tab *Rezepte*): ingredients by product type or category, availability from stock per ingredient, servings scaling, search by name and ingredient (database migration 7, runs automatically)

### Changed

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
