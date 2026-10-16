# Changelog

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
