# Pantry (Vorrat) – User guide

*Deutsche Fassung: [guide.de.md](guide.de.md)*

Pantry is a food inventory inside Home Assistant. You book food in and out by barcode or name.
Pantry remembers where everything is and when it expires, reminds you of what expires soon and
writes the shopping list from minimum stock levels. This guide explains how to use it; installation
and technical details are in the [README](../README.md).

The panel's interface is in German, so this guide names buttons and fields by their German labels
(with a translation in brackets where it helps).

Pantry is in the Home Assistant sidebar as *Vorrat*. The tabs are **Bestand** (stock),
**Einbuchen** (book in), **Auslagern** (book out), **Ablauf** (expiry), **Einkauf** (shopping),
**Rezepte** (recipes), **Speiseplan** (meal plan) and, for admins only, **Einstellungen** (settings). The question mark at the
top right opens this guide.

## Contents

1. [Getting started](#1-getting-started)
2. [Booking in your shopping](#2-booking-in-your-shopping)
3. [Using up and booking out](#3-using-up-and-booking-out)
4. [Viewing and fixing the stock](#4-viewing-and-fixing-the-stock)
5. [What expires soon?](#5-what-expires-soon)
6. [Shopping list](#6-shopping-list)
7. [Recipes](#7-recipes)
7a. [Meal plan](#7a-meal-plan)
8. [Labels and receipt printer](#8-labels-and-receipt-printer)
9. [Categories, product types and inheritance](#9-categories-product-types-and-inheritance)
10. [Tips and FAQ](#10-tips-and-faq)

## 1. Getting started

Pantry comes ready to use: storage locations (Kühlschrank = fridge, Gefrierschrank = freezer,
Vorratsschrank = pantry cupboard …), units (g, kg, ml, l, Stück, Packung, EL, TL …) and a category
tree with about 1,700 product types (Tomatenmark, Spaghetti, Basmatireis …).

Admins should take a quick look at **Einstellungen** first:

1. **Lagerorte** (locations): adapt the list to your kitchen (rename, add, delete).
2. **Standards** (defaults): what applies when a category or product sets nothing of its own
   (unit, location, date type, expiry warning).
3. **Einheiten** (units): the checkbox **Nur für Rezepte** (recipe only) hides a unit (e.g. EL, tablespoon) for products, minimum stock and defaults. It stays available for recipe ingredients.
4. **Kategorien**: give categories a default location (e.g. dairy → fridge), so booking in rarely
   needs a location choice.
5. Optional: set up a label or receipt printer (see [Labels and receipt printer](#8-labels-and-receipt-printer)).

## 2. Booking in your shopping

Open **Einbuchen**. The input field is ready right away.

1. **Find the product**, in one of three ways:
   - Scan with a USB or Bluetooth barcode scanner; it types the barcode into the field.
   - Tap **Kamera** and hold the barcode in front of the phone camera.
   - Type a name and press Enter.
2. **Known product**: only the fields for this booking appear.
   **Unknown barcode**: Pantry asks Open Food Facts and prefills name, brand, content and a matching
   category. Check them. If nothing is found, create the product with **Neues Produkt** (new
   product); **Online suchen** searches Open Food Facts by name.
3. **Kategorie**: every new product needs a category, ideally a product type (e.g. "Tomatenmark").
   Type into the filter of the category picker. If it is missing, choose **„…“ neu anlegen**
   (create) and then the parent category.
4. **Inhalt** (content, optional): e.g. 500 g per package, drained weight for cans. Minimum stock
   and recipes calculate with it.
5. **Mindestanzahl** (minimum packages, optional): below it the product goes on the shopping list.
6. **Expiry date**: the date on the package; leave it empty if there is none. The label names the
   date type (best before or use by).
7. **Packungen** (packages) and **Lagerort** (location): the location is prefilled (grey:
   "Geerbt: Kühlschrank (von Milchprodukte)" = inherited). Another choice applies to this booking
   only; **Zurücksetzen** returns to the default. For a new product **Wird Standardlager** keeps the
   chosen location as its default.
8. **Etiketten drucken** (print labels, if set up) and **Einbuchen**.

The same product with the same date goes into the same batch. A different date makes a new batch,
so later you see which package has to go first.

## 3. Using up and booking out

**Auslagern** works like booking in: scanner, camera or name.

- By default the package with the earliest date is taken. You can also pick a batch and location.
- **Scan a label**: a Pantry label (QR code) books out one package of that batch, in both
  Einbuchen and Auslagern.
- **Rückgängig** (undo) next to the message puts the packages back where they were, once per
  booking.
- In **Bestand** and **Ablauf** the minus on a batch takes one package out of exactly that batch.

Cooking a recipe books nothing out automatically; book out the ingredients as usual.

## 4. Viewing and fixing the stock

**Bestand** shows the category tree with everything in stock, with counts and the earliest date.

- Tap a row to open it. A product shows its batches (date, location, packages).
- The search finds name, brand, barcode, category and location.
- **Alle Lagerorte** filters by location. **Auch Produkte ohne Bestand** also shows products with
  no stock, to edit or delete them.
- **Pencil on a product**: name, brand, barcode, category, content, minimum packages and own
  defaults (location, date type, expiry warning).
- **Pencil on a batch**: fix the date or the package count, e.g. after a typo; 0 packages removes
  the batch.
- **Tag icon**: reprint labels for this batch.
- Red means expired, orange means expiring soon.

## 5. What expires soon?

**Ablauf** lists all expired (red) and soon expiring (orange) batches, earliest first. "Soon" means
within the product's *Warnung vor Ablauf* (expiry warning, own or inherited). **Warnschwelle**
temporarily sets one value for all, e.g. 14 days for meal planning; nothing is saved.

For automations there are the sensors *Abgelaufen* (expired) and *Läuft bald ab* (expiring soon),
see the README, e.g. for a phone notification.

## 6. Shopping list

**Einkauf** has three sources:

- **Minimum stock**: on categories (settings) you set a *Mindestmenge* (amount, e.g. 2 kg pasta of
  any brand) and/or a *Mindestanzahl* (packages). A product can have its own *Mindestanzahl* for
  favourite products. When something is missing it appears on the list: "Nudeln – 500 g fehlen" or
  "Barilla · 2 Pkg. fehlen". Minimums count the whole category including subcategories, and nothing
  is counted twice.
- **By hand**: **Zur Einkaufsliste hinzufügen**, type a name, pick a product or category, set the
  count. A new product is created on the spot.
- **From recipes**: in a recipe tap **Auf die Einkaufsliste** (put on the shopping list), choose the
  servings and the optional ingredients you need. The missing amounts of all recipes are added up per
  category. The recipes are numbered 1, 2, 3 …; after each item, in smaller text, is which recipe needs how much ("1:300 g; 2:200 g"). A recipe stays on the
  list until you remove it: in the **Einkauf** tab under **Für Rezepte**, use the bin, e.g. after
  cooking. Change servings or optional ingredients there with the pencil. Amounts in recipe units such as EL, Tasse or Prise are converted when the unit fits the category: ml for volume, g for weight (3 EL oil → 45 ml); otherwise, if nothing of it is in stock, the base unit is used (2 EL capers → 30 ml); only Scheibe stays as written ("2 Scheiben"). An ingredient without an amount counts as 1 package.

Ticking strikes an item through. A minimum stock item comes back by itself when the missing amount
changes, e.g. after buying only part of it.

The same list is the to-do list **Einkaufsliste** in Home Assistant and the companion app. You can
tick items there and add items by the exact name of a product or category.

**Einkaufszettel drucken** (print shopping list): with a receipt printer this button prints all
unticked items, sorted by main category, and cuts the paper. It only shows when a receipt printer is
set up (see [Labels and receipt printer](#8-labels-and-receipt-printer)).

## 7. Recipes

**Rezepte** shows all recipes with "5 von 7 vorhanden" (5 of 7 in stock). The search finds names
and ingredients. Opening a row shows the ingredients with their status, instructions, source and
image; **Portionen** (servings) scales the amounts (display only). **Auf die Einkaufsliste** (put on
the shopping list) adds the recipe's missing amounts (see [Shopping list](#6-shopping-list)). **Einplanen** (plan) adds it to the
[meal plan](#7a-meal-plan) with the shown servings (date: today, meal: Abendessen/dinner, both changeable in the dialog).

**Rezept hinzufügen** (add recipe):

1. Enter name, servings and instructions.
2. For each ingredient search a product type or category in **Zutat** (a product name works too:
   "Mutti" finds Tomatenmark). If it is missing, **Neue Produktart „…“ anlegen**.
3. Amount and unit (both or neither), optionally a **Hinweis** (note) such as "fein gewürfelt".
4. **optional** for ingredients the recipe can do without; **Nicht gegen den Vorrat prüfen** (do
   not check against the stock) for things you do not keep in the inventory (salt, water).
5. If a unit is missing, choose **Neue Einheit …** in the unit select.

Units marked *Nur für Rezepte* (recipe only, e.g. EL, TL, Tasse, Prise) are offered only here. If the unit has a base amount, the recipe shows it too: "3 EL (≈ 45 ml)". Sizes are rules of thumb: Prise and Messerspitze 0.5 g, Zehe 0.1 piece (the shopping list rounds up: 3 Zehen → 1 Knoblauch), Handvoll 30 g, Tropfen 0.05 ml, Spritzer 1 ml, Schuss 20 ml, Zweig and Stiel 0.1 Bund. Only Scheibe has no size: it stays as written on the list ("2 Scheiben"). A unit created by a recipe import starts as recipe-only.

**Importieren** (import): paste the address of a recipe (e.g. Chefkoch, Mealie, Tandoor). Pantry
reads the page's recipe data and opens the recipe dialog prefilled; nothing is saved until you
save. Each ingredient shows its original line; check the suggested product types. An unknown unit
(e.g. "Tasse", cup) is created with **Anlegen** or replaced by an existing one.

Ingredient status: *vorhanden* (in stock), *teilweise* (partly), *fehlt* (missing), *Menge
unbekannt* (products without content), *keine Zutat zugeordnet* (not matched), *nicht geprüft* (not
checked).

## 7a. Meal plan

**Speiseplan** (meal plan) shows the plan as **Tag** (day), **Woche** (week) or **Monat** (month), buttons at the top. **Zurück** (previous) and **Weiter** (next) move by a day, a week or a month, depending on the view; **Heute** (today) jumps to today's date. **Tag** always shows today.

- **Woche**: a table with one row per meal and one equal-width column per day. On a phone each day becomes a block that shows only its dishes, plus a **+**. Tapping a day heading opens that day.
- **Tag**: a list grouped by meal, with a **+** per meal.
- **Monat**: a calendar grid with a small icon per planned dish (the name appears on hover or long press). Tapping a day opens its day view.

**Mahlzeit** (meal): every dish belongs to a meal: Frühstück (breakfast), Mittag (lunch), Kaffee (coffee), Abendessen (dinner) or Snack. Within a day, dishes are ordered by meal, then in the order they were added.

**Gericht hinzufügen** (add dish, **+** at the meal):

1. Pick a recipe from the list of names, or type free text (e.g. "Pizza from the delivery service"). A recipe is planned for Abendessen (dinner) by default; change it in the dialog if needed.
2. **Portionen** (servings) starts with the household size (see below); change it if this dish is for more or fewer people.
3. Save.

Tapping the name opens the recipe (free text: the edit dialog). The pencil changes a dish, the bin deletes it. Deleting a recipe keeps its dishes in the plan as free text; the delete question lists them.

**Umplanen** (shift): the arrow icon on a dish moves that dish's meal on this day and on every directly following day that has the same meal planned, one day later. The shift stops at the first day without that meal (the gap). Other meals stay where they are. A confirmation lists every dish with its old and new date; only **Verschieben** (move) applies it.

**Household size** (admins only): in *Settings > Devices & services > Pantry > Configure*, step **Haushalt** (menu *Einstellungen*), set **Portionen im Haushalt** (1 to 99, default 3). It is the servings default for new dishes.

**Calendar**: the plan is also a read-only calendar in Home Assistant, entity *Speiseplan*. Each dish is an all-day event titled "Mahlzeit: Gericht" (e.g. "Mittag: Spaghetti"); its description shows the servings. Change the plan in the panel.

## 8. Labels and receipt printer

A label shows product, brand, expiry date and a QR code of the batch, so you recognise leftovers in
the freezer and book them out by scanning.

- **Setup** (admin): *Settings > Devices & services > Pantry > Configure > Etikettendrucker*. Choose the model, e.g.
  *Dymo LabelWriter 450*, then under **Drucker** the address of the USB print server or the device
  path (USB on the Home Assistant machine, e.g. `/dev/usb/lp0`) and the label size. With *Kein Drucker*
  the browser's print dialog opens.
- **When booking in**: tick **Etiketten drucken**, one label per package (at most 20).
- **Reprint**: tag icon on a batch in Bestand.
- More than 2 labels at once ask first.

**Receipt printer** (for the shopping list): *Settings > Devices & services > Pantry > Configure >
Bondrucker*. **Drucker** is the device path (USB on the Home Assistant machine, e.g.
`/dev/bondrucker`) or the network address; also paper width, cutting and, for serial printers, the
baud rate. **Testbon drucken** checks the connection when you save. The technical setup (passing USB
into Docker) is in the README under *Bondrucker*.

## 9. Categories, product types and inheritance

The category tree has three levels: **main category → category → product type (Produktart)**,
e.g. *Nudeln, Reis & Getreide → Nudeln → Spaghetti*. Products usually belong to a product type.
Recipes and minimum stock work with categories and product types, not with brands.

**Inheritance**: unit, default location, date type and expiry warning apply to everything below
until a lower level or the product sets its own. Inherited values are grey with their source
("Geerbt: 7 Tage (von Milchprodukte)"). **Zurücksetzen** removes an own value, then the inherited
one applies again. Minimum stock is not inherited.

**Deleting**: before deleting, Pantry lists what goes with it or changes (subcategories, products,
stock, recipe ingredients …). A location with stock asks where its packages should go.

## 10. Tips and FAQ

- **What does a field mean?** Labels with a dotted underline explain themselves when you hover the
  mouse over them; icon buttons name their action the same way. Phones show no tooltips, which is
  what this guide is for.
- **The camera does not start.** Camera scanning needs HTTPS (or `localhost`) and camera permission
  in the browser or app.
- **Unknown barcode.** Not every product is in Open Food Facts. Create it with **Neues Produkt**;
  the next scan knows it.
- **Who may do what?** All users book, edit products, keep the shopping list and recipes, and may
  add product types and units. Settings, deleting products and deleting recipes are for admins.
- **Booked wrongly?** Right after the booking use **Rückgängig**, otherwise fix the batch with the
  pencil in Bestand.
- **Automations**: for scanners on ESPHome, NFC tags etc. there are the services `pantry.book_in`,
  `pantry.book_out` and `pantry.print_labels` (see README).
