# Home Inventory (Vorrat) für Home Assistant

*English: [README.md](README.md)*

Vorratsverwaltung (Lebensmittel, Batterien, Haushaltswaren, Medikamente, Eingekochtes) als Custom
Integration für Home Assistant: per Barcode oder Name ein- und ausbuchen, Chargen mit
Mindesthaltbarkeits- oder Verbrauchsdatum je Lagerort verwalten, sehen, was bald abläuft, und eine
markenunabhängige Einkaufsliste aus Mindestmengen bekommen.

> Status: frühe Entwicklung, erste Version 0.1.0. Änderungen: [CHANGELOG.md](CHANGELOG.md).
> Planung: [docs/PLAN.md](docs/PLAN.md) (englisch).

## Funktionen

Vorhanden:

- Einbuchen per EAN-Barcode (USB-/Bluetooth-Scanner oder Handykamera) oder Name; Produktdaten von Open Food Facts
- Kategoriebaum (Hauptkategorie → Kategorie → Produktart, viele vorbelegt) mit geerbten Vorgaben (Einheit, Lagerort, Datumsart, Warnung vor Ablauf)
- Chargen mit Ablaufdatum, gezählt in Packungen, verteilt auf mehrere Lagerorte
- Bestandsübersicht mit Suche, Auslagern und Korrektur von Chargen
- Ablaufübersicht mit vorübergehender Warnschwelle; Sensoren für abgelaufene und bald ablaufende Packungen
- Etiketten (QR-Code von Produkt und Ablaufdatum) auf einem Etikettendrucker (Dymo LabelWriter 450 hinter einem USB-Druckserver oder per USB am HA-Rechner) oder über den Browser; Etikett scannen bucht aus
- Aktionen für Automationen (Hardware-Scanner, NFC-Tags, ESPHome, Sprache): per Barcode oder Etikett ein- und ausbuchen, Etiketten, Einkaufszettel und Rezepte drucken, ein Rezept auf die Einkaufsliste setzen, ein Gericht planen, ein Einkochprotokoll anlegen
- Rezeptdatenbank mit Zutaten als Kategorien: sehen, was vorrätig ist, Portionen umrechnen; Import per URL (Chefkoch, Mealie, Tandoor und die meisten Rezeptseiten)
- Mindestmenge je Kategorie als Menge in beliebiger Einheit (z. B. „2 kg Nudeln“, egal welche Marke) und/oder Packungszahl; Einkaufsliste im Panel und als To-do-Liste in HA; Produkte oder Kategorien von Hand hinzufügen (neue werden gleich angelegt)
- Einkaufen nach Rezepten: Rezepte für eine Portionszahl auf die Einkaufsliste setzen; die fehlenden Mengen aller Rezepte werden je Kategorie zusammengezählt, Rezept-Einheiten (EL, Tasse, Prise) in ml oder g umgerechnet
- Einkaufszettel, Rezepte und Speiseplan auf einem ESC/POS-Bondrucker (58 / 80 mm, USB am HA-Rechner oder Netzwerk), mit Abschneider
- Einkaufsliste aus dem Speiseplan: Die im Zeitraum geplanten Rezepte (Knopf *Einkaufsliste* im Speiseplan, Aktion `pantry.plan_to_shopping_list`) kommen abzüglich Vorrat auf die Liste; noch keine Verbrauchsprognose
- Speiseplan: Ansichten Tag, Woche und Monat (ab Montag); jedes Gericht hat eine Mahlzeit (Frühstück, Mittag, Kaffee, Abendessen, Snack) und ist ein Rezept oder freier Text; Umplanen verschiebt über die folgenden Tage; Portionen nach Haushaltsgröße; nur lesbare Kalender-Entität *Speiseplan*
- Nicht-Lebensmittel: Kategorien mit *Kein Lebensmittel* (vererbt) sind nie Rezeptzutaten; vorbelegt *Haushalt & Drogerie*, *Haustechnik* (Batterien, Akkus, Leuchtmittel nach Sockel), *Hausapotheke* (verbrauchen bis, Warnung 30 Tage) und *Tierbedarf*
- Haltbarkeit (Tage, vererbt wie die Warnung): Einbuchen schlägt heute + Haltbarkeit als Ablaufdatum vor; vorbelegt *Eingekochtes* (365 Tage)
- Einkochen (Tab *Einkochen*): Protokolle mit einer Charge je Gläser-Partie (JJJJMMTT-n); die Etiketten tragen die Charge, ein Scan bucht ein Glas dieser Charge aus; Einkochrezepte (jedes ergibt ein Produkt, optional Temperatur und Dauer) in der eigenen Ansicht *Rezepte* des Tabs

Geplant:

- Rezeptvorschläge für Ablaufendes
- Ganzen Lagerort umziehen, geöffnete Packungen mit kürzerer Haltbarkeit, KI-Schnittstelle (Assist / MCP)

Reihenfolge und Details: [docs/PLAN.md](docs/PLAN.md), Abschnitt 6.

## Installation

Benötigt Home Assistant 2026.10.1 oder neuer.

HACS (erst wenn das Repository öffentlich ist; HACS kann nicht aus privaten Repositories installieren): dieses Repository als benutzerdefiniertes Repository hinzufügen (Kategorie *Integration*), *Home Inventory (Vorrat)* installieren, Home Assistant neu starten. Versionen sind die GitHub-Releases.

Von Hand: das Release herunterladen (oder das Repository klonen), `custom_components/pantry` nach `config/custom_components/` kopieren und Home Assistant neu starten.

Danach: *Einstellungen → Geräte & Dienste → Integration hinzufügen → Home Inventory* (früher *Pantry*; die interne Domain bleibt `pantry`, Entitäten, Aktionen und Automationen ändern sich nicht), Module wählen (siehe unten). Das Panel *Vorrat* erscheint in der Seitenleiste.

**Module.** Bestand, Ein- und Auslagern, Ablauf und Einstellungen sind immer da. Optional, alle standardmäßig an: *Einkaufsliste* (Tab *Einkauf* und die To-do-Entität), *Rezepte* (Tab *Rezepte*), *Speiseplan* (Tab *Speiseplan*, die Kalender-Entität und der Einstellungsbereich *Mahlzeiten*), *Einkochen* (Tab *Einkochen*). Später änderbar unter *Konfigurieren > Module*; Speichern lädt die Integration neu. Ein abgeschaltetes Modul blendet nur seinen Tab und seine Knöpfe aus (z. B. *Auf die Einkaufsliste* im Rezept) und entfernt seine Entität; die Daten bleiben und sind beim Wiedereinschalten zurück. Websocket-Befehle und Aktionen eines abgeschalteten Moduls funktionieren weiter.

## Bedienung

**Anleitung** (Schritt für Schritt, mit Screenshots): [Deutsch](docs/guide.de.md) · [English](docs/guide.en.md).
Das Fragezeichen oben im Panel öffnet sie in der Sprache von Home Assistant.

## Einrichtung

Alle Optionen stehen unter *Einstellungen > Geräte & Dienste > Home Inventory > Konfigurieren*:
Module, Etikettendrucker, Bondrucker, KI-Prüfung von Rezeptimporten und Haushaltsgröße.

### Etikettendrucker

Jedes Etikett zeigt einen QR-Code (`PTRY:<EAN>:<Datum>`, ohne EAN `PTRY:P<Produkt-ID>:<Datum>`;
Einkochetiketten enthalten die Charge), Produktname, Marke und Ablaufdatum. Ein Scan im *Bestand*
bucht eine Packung dieser Charge aus.

*Etikettendrucker* wählen. Schritt 1: *Modell des Etikettendruckers*. Schritt 2: die Einstellungen
des Modells, Etikettengröße in mm und ob beim Einbuchen gedruckt wird. Modelle:

- *Dymo LabelWriter 450 / 4xx*: im Netzwerk über einen USB-Druckserver (z. B. TP-Link mit fester IP
  und aktiviertem Raw-Druck): Drucker als `host` oder `host:port` eintragen (Port standardmäßig
  9100). Oder per USB am HA-Rechner: Gerätepfad eintragen, z. B. `/dev/usb/lp0` (in Docker mit
  `devices:` durchreichen, wie beim Bondrucker). Breite 10 bis 57 mm, Höhe 10 bis 200 mm (Standard
  57 x 32). Der 450 druckt die letzten ~3 mm eines 57-x-32-Etiketts nie, dieser Rand bleibt leer.
  *Testetikett drucken* schickt beim Speichern ein Etikett; ist der Drucker nicht erreichbar, sagt es
  das Formular.
- *Kein Drucker*: Der Druckdialog des Browsers öffnet sich mit einer Seite pro Etikett (dort den
  Etikettendrucker wählen; die Seitengröße ist die Etikettengröße, 10 bis 200 mm).

### Bondrucker

Druckt Einkaufszettel, Rezepte und Speiseplan auf einem ESC/POS-Bondrucker (58 oder 80 mm, z. B. TPG
A799), als Bild, daher klappen Umlaute und Schriften auf jedem Drucker; mit Abschneider wird das Papier
am Ende abgeschnitten. Einrichtung eines USB-Druckers am Rechner, auf dem Home Assistant in Docker
läuft (z. B. ein Raspberry Pi):

1. Drucker anschließen und einschalten. Die meisten Bondrucker (z. B. der TPG A799) sind USB-Drucker:
   Auf dem Host zeigt `ls /dev/usb/` dann `lp0` (`dmesg` meldet `usblp`). Ein USB-Seriell-Drucker
   erscheint stattdessen in `ls -l /dev/serial/by-id/` als `usb-…` mit Verweis auf `ttyUSB0` oder
   `ttyACM0`.
2. Im `docker-compose.yml` von Home Assistant in den Container durchreichen:
   ```yaml
   services:
     homeassistant:
       devices:
         - /dev/usb/lp0:/dev/bondrucker   # oder /dev/serial/by-id/usb-… bei einem seriellen Drucker
   ```
   Container neu erstellen (`docker compose up -d homeassistant`). Der Drucker muss beim Start des
   Containers eingeschaltet und angeschlossen sein; nach dem Abstecken den Container neu starten.
   HA OS reicht USB-Geräte selbst durch: dort den Gerätepfad direkt eintragen.
3. *Konfigurieren > Bondrucker*: *Drucker* = `/dev/bondrucker` (Netzwerkdrucker: `host` oder
   `host:port`, Port 9100), Papierbreite, *Papier am Ende abschneiden*, Baudrate (nur serielle
   Drucker: die Einstellung des Druckers, oft 9600 oder 115200; eine Selbsttestseite, meist FEED beim
   Einschalten gedrückt halten, zeigt sie). *Testbon drucken* schickt beim Speichern einen kurzen
   Testbon; ein nicht erreichbarer Drucker wird im Formular gemeldet.
4. „Der Drucker ist nicht erreichbar“: Das Home-Assistant-Log nennt den Grund (z. B. belegt: ein
   anderer Dienst wie CUPS hält den Drucker; offline: Papier leer oder Deckel offen). Wirre Zeichen bei
   einem seriellen Drucker: falsche Baudrate, die anderen probieren.

### KI-Prüfung von Rezeptimporten

Optional. Zuerst in Home Assistant eine KI einrichten (eine *KI-Aufgabe*-Entität, z. B. *Integration
hinzufügen > Google Gemini* mit einem API-Schlüssel aus Google AI Studio, das ein kostenloses
Kontingent hat, oder *Anthropic*), dann unter *Konfigurieren > KI-Prüfung von Rezeptimporten*
wählen; leer = keine KI. Jeder Import schickt dann das Rezept und den Baum der
Lebensmittel-Kategorien an diese KI (etwa 10.000 Tokens; der feste Teil steht vorn, damit Anbieter mit
Prompt-Cache ihn seltener berechnen). Die KI schlägt nur Änderungen vor; gespeichert wird nichts ohne
dich.

Der Import selbst braucht keine KI: Home Assistant lädt die Rezeptseite nur beim Klick auf
*Importieren* (15 s Zeitlimit, HTML bis 5 MB, http oder https, auch Adressen im Heimnetz) und liest
ihre schema.org-Rezeptdaten.

## Sensoren

Die Integration legt ein Gerät *Vorrat* mit zwei Sensoren an (Packungen, ohne Abfrageintervall,
aktualisiert nach jeder Buchung und um Mitternacht):

| Sensor | Wert | Attribut `items` |
|---|---|---|
| *Abgelaufen* | Packungen nach ihrem Datum | name, expires_on, days_left, packages, location je Charge |
| *Läuft bald ab* | Packungen innerhalb ihrer Warnzeit | ebenso |

Beispiel: Benachrichtigung, wenn etwas abgelaufen ist.

```yaml
triggers:
  - trigger: numeric_state
    entity_id: sensor.vorrat_abgelaufen
    above: 0
actions:
  - action: notify.notify
    data:
      message: >
        Abgelaufen: {{ state_attr('sensor.vorrat_abgelaufen', 'items') | map(attribute='name') | join(', ') }}
```

## Aktionen (Automationen)

Alle liefern eine Antwort (`response_variable` in Skript oder Automation). Fehler (unbekannter
Barcode, unbekanntes Rezept oder Lagerort, zu wenig Bestand, Drucker nicht erreichbar) lassen die
Aktion mit einer Meldung fehlschlagen.

| Aktion | Felder | Antwort |
|---|---|---|
| `pantry.book_in` | `code` (EAN eines vorhandenen Produkts; neue Produkte werden einmal im Panel angelegt, wo die Kategorie gewählt wird), `packages` (Standard 1), `expires_on` (Datum, optional), `location` (Name, optional; Standard: Standardlager des Produkts) | `product_id`, `batch_id`, `name` |
| `pantry.book_out` | `code` (EAN oder Etikettencode `PTRY:…`), `packages` (Standard 1), `location` (Name, optional) | `taken` (Charge, Lagerort, Packungen, Buchungs-ID je Zeile), `name` (Etikettencode: auch `location`) |
| `pantry.print_labels` | `batch_id` (aus `book_in`), `count` (1 bis 20, Standard 1) | `printed` |
| `pantry.print_shopping_list` | keine | `printed` (Anzahl Einträge) |
| `pantry.print_plan` | `day` (Datum, Standard heute), `period` (`day` oder `week`, Standard `day`; eine Woche läuft Montag bis Sonntag um `day`) | `printed` (Anzahl Gerichte) |
| `pantry.print_planned` | `day` (Datum, Standard heute), `meal` (`breakfast` … `snack`; Standard: die aktuelle Mahlzeit nach den Startzeiten unter *Einstellungen > Mahlzeiten*) | `printed` (Anzahl Rezepte), `day`, `meal` |
| `pantry.print_recipe` | `recipe` (Name, auch Einkochrezept), `servings` (optional; Standard: die des Rezepts) | `printed` |
| `pantry.shop_recipe` | `recipe` (Name eines Gericht-Rezepts), `servings` (optional; Standard: *Portionen im Haushalt*) | `recipe_id` |
| `pantry.plan_to_shopping_list` | `start` (Datum, Standard heute), `days` (Standard 7, max. 366) | `recipes` (`recipe_id`, `name`, `servings`), `skipped` (Gerichte mit freiem Text) |
| `pantry.plan_meal` | `recipe` (Name) oder `text` (freier Text), `day` (Datum, Standard heute), `meal` (`breakfast`, `lunch`, `coffee`, `dinner`, `snack`; Standard `dinner`), `servings` (optional; Standard: *Portionen im Haushalt*) | `meal_id` |
| `pantry.canning` | `recipe` (Name eines Einkochrezepts), `jars` (Standard: Ertrag des Rezepts), `made_on` (Datum, Standard heute), `expires_on` (Datum; Standard: Herstellungsdatum + Haltbarkeit), `location` (Name, optional), `notes` | `id`, `batch_id`, `charge` |

- **book_out** mit EAN nimmt das früheste Ablaufdatum zuerst (Packungen ohne Datum zuletzt), wie das Panel.
  Ein Etikettencode nimmt eine Packung der genannten Charge, egal wo sie liegt (`packages` muss 1 sein, kein `location`).
- **print_planned** druckt jedes für diese Mahlzeit geplante Rezept mit seinen geplanten Portionen (freier Text wird übersprungen); ist nichts geplant, schlägt die Aktion mit einer Meldung fehl. Beispiel: ein Knopf in der Küche druckt, was als Nächstes gekocht wird.
- **print_labels** braucht einen Etikettendrucker (siehe [Etikettendrucker](#etikettendrucker)); mit *Kein Drucker* schlägt sie fehl, weil eine Aktion keinen Browser zum Drucken hat.
- **shop_recipe** bei einem Rezept, das schon auf der Liste steht, ändert seine Portionen und verwirft im Panel gewählte optionale Zutaten.
- **plan_to_shopping_list** setzt jedes im Zeitraum geplante Rezept mit den summierten Portionen seiner Mahlzeiten auf die Liste (wie **shop_recipe**, im Panel gewählte optionale Zutaten bleiben; steht ein Rezept schon auf der Liste, bleiben die größeren Portionen, ein zweiter Lauf ändert also nichts). Gerichte mit freiem Text werden übersprungen.
- **canning** nimmt Produkt, Temperatur und Dauer aus dem Einkochrezept; die Glasetiketten druckt `print_labels` mit der zurückgegebenen `batch_id`.
- Lagerort- und Rezeptnamen werden ohne Groß-/Kleinschreibung verglichen. Buchungen einer Aktion werden mit Quelle `service`
  (Etikettencodes: `label`) und dem aufrufenden Benutzer protokolliert, falls vorhanden.

Beispiel: Einbuchen mit einem Scanner, der den Barcode als Ereignis schickt, dann ein Etikett je Packung drucken:

```yaml
actions:
  - action: pantry.book_in
    data:
      code: "{{ trigger.event.data.code }}"
      packages: 2
      expires_on: "2027-01-31"
      location: Kühlschrank
    response_variable: booked
  - action: pantry.print_labels
    data:
      batch_id: "{{ booked.batch_id }}"
      count: 2
```

## Entwicklung

Siehe [README.md, Development](README.md#development) (englisch).

## Lizenz

MIT, siehe [LICENSE](LICENSE).
