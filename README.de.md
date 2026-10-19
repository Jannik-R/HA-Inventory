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

- Einbuchen per EAN-Barcode (USB-/Bluetooth-Scanner oder Handykamera) oder Name; Produktdaten von Open Food Facts, bei Non-Food von Open Beauty Facts, Open Pet Food Facts und Open Products Facts
- Kassenbon-Import (*Kassenbon importieren*, braucht eine KI): Dokumentenscan des Bons (Live-Umriss, Ecken, Schwarz-Weiß), Texterkennung im Browser, die KI liest die Artikel, du prüfst Produkt, Packungen und Datum je Zeile in einem Dialog und buchst alles ein; merkt sich je Händler, welches Produkt zu einer Bonzeile gehört
- Kategoriebaum (Hauptkategorie → Kategorie → Produktart, viele vorbelegt) mit geerbten Vorgaben (Einheit, Lagerort, Datumsart, Warnung vor Ablauf)
- Chargen mit Ablaufdatum, gezählt in Packungen, verteilt auf mehrere Lagerorte
- Bestandsübersicht mit Suche, Auslagern und Korrektur von Chargen; ein ganzer Lagerort lässt sich in den Einstellungen auf einen anderen umlagern (nur im Panel, kein Service: es ist eine Bestandskorrektur)
- Ablaufübersicht mit vorübergehender Warnschwelle und Rezeptvorschlägen, die Ablaufendes aufbrauchen (Rezepte nach ablaufenden Zutaten, dann nach Vorrat sortiert; in der Rezeptliste markiert); Sensoren für abgelaufene und bald ablaufende Packungen
- Etiketten (QR-Code von Produkt und Ablaufdatum) auf einem Etikettendrucker (Dymo LabelWriter 450 hinter einem USB-Druckserver oder per USB am HA-Rechner) oder über den Browser; Etikett scannen bucht aus
- Aktionen für Automationen (Hardware-Scanner, NFC-Tags, ESPHome, Sprache): per Barcode, Etikett oder Produktname ein- und ausbuchen, Etiketten, Einkaufszettel und Rezepte drucken, ein Rezept auf die Einkaufsliste setzen, ein Gericht planen, ein Einkochprotokoll anlegen
- Rezeptdatenbank mit Zutaten als Kategorien: sehen, was vorrätig ist, Portionen umrechnen; Import per URL (Chefkoch, Mealie, Tandoor und die meisten Rezeptseiten); mit eingerichteter KI auch Beiträge ohne Rezeptdaten (Instagram, TikTok, YouTube: Beschreibung, Video, Bild), eingefügter Text und Fotos (z. B. eine Kochbuchseite)
- Mindestmenge je Kategorie als Menge in beliebiger Einheit (z. B. „2 kg Nudeln“, egal welche Marke) und/oder Packungszahl; Einkaufsliste im Panel und als To-do-Liste in HA; Produkte oder Kategorien von Hand hinzufügen (neue werden gleich angelegt)
- Einkaufen nach Rezepten: Rezepte für eine Portionszahl auf die Einkaufsliste setzen; die fehlenden Mengen aller Rezepte werden je Kategorie zusammengezählt, Rezept-Einheiten (EL, Tasse, Prise) in ml oder g umgerechnet
- Einkaufszettel, Rezepte und Speiseplan auf einem ESC/POS-Bondrucker (58 / 80 mm, USB am HA-Rechner oder Netzwerk), mit Abschneider
- Einkaufsliste aus dem Speiseplan: Die im Zeitraum geplanten Rezepte (Knopf *Einkaufsliste* im Speiseplan, Aktion `pantry.plan_to_shopping_list`) kommen abzüglich Vorrat auf die Liste; noch keine Verbrauchsprognose
- Speiseplan: Ansichten Tag, Woche und Monat (ab Montag); jedes Gericht hat eine Mahlzeit (Frühstück, Mittag, Kaffee, Abendessen, Snack) und ist ein Rezept oder freier Text; Umplanen verschiebt über die folgenden Tage; Portionen nach Haushaltsgröße; nur lesbare Kalender-Entität *Speiseplan*
- Nicht-Lebensmittel: Kategorien mit *Kein Lebensmittel* (vererbt) sind nie Rezeptzutaten; vorbelegt *Haushalt & Drogerie*, *Haustechnik* (Batterien, Akkus, Leuchtmittel nach Sockel), *Hausapotheke* (verbrauchen bis, Warnung 30 Tage) und *Tierbedarf*
- Haltbarkeit (Tage, vererbt wie die Warnung): ein leeres Ablaufdatum beim Einbuchen (Panel, Kassenbon-Import, `pantry.book_in`) wird zu heute + Haltbarkeit und steht als *geschätzt* da, bis die Bestandszeile bearbeitet wird; die Option *Geschätztes Ablaufdatum vorausfüllen* schreibt die Schätzung schon ins Datumsfeld; vorbelegt mit üblichen Werten für die Lebensmittel-Kategorien (z. B. *H-Milch* 90, *Brötchen* 2, *Eingekochtes* 365 Tage)
- Angebrochene Packungen (*Anbrechen*): eine Packung als angebrochen markieren (Knopf an der Chargenzeile, Scan-Modus *Anbrechen*, Aktion `pantry.open_package`); sie wird eine eigene Bestandszeile und läuft früher ab, um die vererbte *Haltbar nach Anbruch* (Tage; vorbelegt für die Lebensmittel-Kategorien, z. B. Milch 3; leer = das Datum bleibt, z. B. Nudeln); Ablaufübersicht, Sensoren, Etiketten und Rezeptvorschläge nutzen dieses Datum; ein neues Etikett wird angeboten (gedruckt erst nach dem Etikettendialog)
- Einkochen (Tab *Einkochen*): Protokolle mit einer Charge je Gläser-Partie (JJJJMMTT-n); die Etiketten tragen die Charge, ein Scan bucht ein Glas dieser Charge aus; Einkochrezepte (jedes ergibt ein Produkt, optional Temperatur und Dauer) in der eigenen Ansicht *Rezepte* des Tabs
- KI-Assistenten: die LLM-API *Home Inventory* für Assist-Agenten und den MCP-Server von Home Assistant (Bestand, Ablauf, Rezepte, Einkaufsliste, Speiseplan; was sie ändern dürfen, steht in den Optionen)

Geplant:

- Rückmeldungen der Nutzer mit KI-Auswertung

Reihenfolge und Details: [docs/PLAN.md](docs/PLAN.md), Abschnitt 6.

## Installation

Benötigt Home Assistant 2026.10.1 oder neuer.

HACS (erst wenn das Repository öffentlich ist; HACS kann nicht aus privaten Repositories installieren): dieses Repository als benutzerdefiniertes Repository hinzufügen (Kategorie *Integration*), *Home Inventory (Vorrat)* installieren, Home Assistant neu starten. Versionen sind die GitHub-Releases.

Von Hand: das Release herunterladen (oder das Repository klonen), `custom_components/pantry` nach `config/custom_components/` kopieren und Home Assistant neu starten.

Python-Pakete (installiert Home Assistant): `segno` (QR-Codes auf Etiketten) und `yt-dlp` (liest Video und Beschreibung eines Beitrags für den KI-Rezeptimport; ist schon Teil des Home-Assistant-Images, eine normale Installation lädt also nichts herunter).

Danach: *Einstellungen → Geräte & Dienste → Integration hinzufügen → Home Inventory* (früher *Pantry*; die interne Domain bleibt `pantry`, Entitäten, Aktionen und Automationen ändern sich nicht), Module wählen (siehe unten). Das Panel *Vorrat* erscheint in der Seitenleiste.

**Module.** Bestand, Ein- und Auslagern, Ablauf und Einstellungen sind immer da. Optional, alle standardmäßig an: *Einkaufsliste* (Tab *Einkauf* und die To-do-Entität), *Rezepte* (Tab *Rezepte*), *Speiseplan* (Tab *Speiseplan*, die Kalender-Entität und der Einstellungsbereich *Mahlzeiten*), *Einkochen* (Tab *Einkochen*). Später änderbar unter *Konfigurieren > Module*; Speichern lädt die Integration neu. Ein abgeschaltetes Modul blendet nur seinen Tab und seine Knöpfe aus (z. B. *Auf die Einkaufsliste* im Rezept) und entfernt seine Entität; die Daten bleiben und sind beim Wiedereinschalten zurück. Websocket-Befehle und Aktionen eines abgeschalteten Moduls funktionieren weiter.

## Bedienung

**Anleitung** (Schritt für Schritt, mit Screenshots): [Deutsch](docs/guide.de.md) · [English](docs/guide.en.md).
Das Fragezeichen oben im Panel öffnet sie in der Sprache von Home Assistant.

## Einrichtung

Alle Optionen stehen unter *Einstellungen > Geräte & Dienste > Home Inventory > Konfigurieren*:
Module, Etikettendrucker, Bondrucker, KI und Haushaltsgröße.

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

### KI

Optional. Zuerst in Home Assistant eine KI einrichten (eine *KI-Aufgabe*-Entität, z. B. *Integration
hinzufügen > Google Gemini* mit einem API-Schlüssel aus Google AI Studio, das ein kostenloses
Kontingent hat, oder *Anthropic*), dann unter *Konfigurieren > KI (Rezeptimport, Assistenten) >
KI-Aufgabe* wählen; leer = keine KI.

**Rezeptimport.** Eine Seite mit schema.org-Rezeptdaten braucht keine KI: Home Assistant lädt die
Seite nur beim Klick auf *Importieren* (15 s Zeitlimit, HTML bis 5 MB, http oder https, auch Adressen
im Heimnetz). Mit eingerichteter KI:

- Jeder Import wird einmal geprüft: Das Rezept, der Baum der Lebensmittel-Kategorien und die Einheiten
  gehen an die KI (etwa 10.000 Tokens; der feste Teil steht vorn, damit Anbieter mit Prompt-Cache ihn
  seltener berechnen). Sie korrigiert Kategorien und Einheiten (eine vorhandene Einheit oder eine neue,
  die du im Dialog anlegst). Die KI antwortet nur „ok“ oder mit den Änderungen und schlägt sie nur
  vor; gespeichert wird nichts ohne dich.
- Einen Link ohne Rezeptdaten (Instagram, TikTok, YouTube, ein Blog) liest die KI aus: Home Assistant
  holt den Beitrag mit `yt-dlp` (Beschreibung und das Video bis 15 Minuten und 50 MB, höchstens 720p),
  sonst Titel, Beschreibung, sichtbaren Text und Vorschaubild (bis 5 MB) der Seite, und schickt sie an
  die KI (Anhänge laufen über einen versteckten Ordner `.pantry_import` im ersten Medienverzeichnis und
  werden gleich danach gelöscht). Gesprochenes und eingeblendeten Text eines Videos liest die KI, wenn
  sie Videos versteht (Google Gemini kann das); sonst bekommt sie nur den Text. Instagram verweigert
  Videos ohne Anmeldung oft; dann zählen nur Beschreibung und Bild.
- *Text* und *Foto* im Importdialog schicken eingefügten Text (bis 20.000 Zeichen) oder ein Foto (im
  Browser auf 2000 px verkleinert; gewählt oder mit *Foto aufnehmen* von der Live-Kamera) an die KI.

Einen Beitrag auszulesen dauert 15 bis 60 Sekunden und kostet einen KI-Aufruf, dazu die Prüfung.

**Neue Produkte.** Ein Produkt, das beim Einbuchen über Open Food Facts gefunden wird (noch nicht in
Vorrat), wird ebenfalls einmal geprüft: Name, Marke, Mengenangabe und Kategorien von Open Food Facts,
der ganze Kategoriebaum (Lebensmittel und Non-Food) und die Einheiten gehen an die KI. Sie korrigiert
den Namen (ohne Marke und Größe), die Kategorie und den Packungsinhalt (z. B. „4 x 125 g“ = 500 g).
Passt keine Produktart, schlägt sie eine neue unter der passenden Kategorie vor; die wird beim
Einbuchen angelegt.
Das Einbuchen-Formular bleibt währenddessen bedienbar; Felder, die du geändert hast, bleiben.

**Kassenbon-Import.** *Kassenbon importieren* (beim Einbuchen, nur mit KI) scannt den Bon wie der
Dokumentenscanner eines Handys: die Live-Kamera markiert den Rand des Bons, die Ecken lassen sich
korrigieren, der Ausschnitt wird entzerrt und schwarz-weiß (OpenCV.js, etwa 10 MB, einmal vom
jsDelivr-CDN, danach im Browser-Cache; ein gewähltes Foto bekommt denselben Zuschnitt-Schritt). Danach
wird der Text im Browser erkannt (tesseract.js; Engine und deutsche Sprachdaten, einige MB, ebenfalls
von jsDelivr und im Cache). Nur dieser Text geht an die KI, zusammen mit der Liste
deiner Produkte (ID, Name, Marke), nicht das Foto: einige tausend Tokens. Die KI liefert den Händler
und die Artikel mit bis zu fünf passenden Produkten je Zeile; Pfand, Tüten und Rabatte lässt sie weg.
Eine einmal eingebuchte Bonzeile merkt sich Vorrat je Händler und wählt sie beim nächsten Mal vor.

**Assistenten (LLM-API).** Die Integration stellt die LLM-API *Home Inventory* bereit. Wähle sie in
einem Assist-Agenten (z. B. *Google Gemini > Konfigurieren > Home Assistant steuern*) oder in der
Integration *Model Context Protocol Server* (für Claude Desktop und andere MCP-Clients). *Zugriff für
Assistenten* legt fest, was sie dürfen:

| Stufe | Werkzeuge |
|---|---|
| *Nur lesen* | `get_stock`, `get_expiring`, `get_recipes`, `get_recipe` (mit Vorratsstatus), `get_shopping_list`, `get_meal_plan` |
| *Lesen, Einkaufsliste und Speiseplan* (Standard) | dazu `add_to_shopping_list` (Produkt oder Kategorie per Name), `add_recipe_to_shopping_list`, `plan_meal` |
| *Alles, auch Ein- und Ausbuchen und Anbrechen* | dazu `book_in`, `book_out`, `open_package` (Produkt per Name oder EAN) |

Die Werkzeuge nehmen Namen, wie die Aktionen; die schreibenden rufen die Aktionen unten auf, eine
Buchung vermerkt also den Nutzer des Gesprächs.

## Sensoren

Die Integration legt ein Gerät *Vorrat* mit zwei Sensoren an (Packungen, ohne Abfrageintervall,
aktualisiert nach jeder Buchung und um Mitternacht):

| Sensor | Wert | Attribut `items` |
|---|---|---|
| *Abgelaufen* | Packungen nach ihrem Datum | name, expires_on, days_left, packages, location je Charge |
| *Läuft bald ab* | Packungen innerhalb ihrer Warnzeit | ebenso |

Eine angebrochene Packung zählt mit ihrem kürzeren Datum (angebrochen am + *Haltbar nach Anbruch*).

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
| `pantry.book_in` | `code` (EAN oder Name eines vorhandenen Produkts; neue Produkte werden einmal im Panel angelegt, wo die Kategorie gewählt wird), `packages` (Standard 1), `expires_on` (Datum, optional; leer: heute + Haltbarkeit, als geschätzt markiert), `location` (Name, optional; Standard: Standardlager des Produkts) | `product_id`, `batch_id`, `name` |
| `pantry.book_out` | `code` (EAN, Etikettencode `PTRY:…` oder Produktname), `packages` (Standard 1), `location` (Name, optional) | `taken` (Charge, Lagerort, Packungen, Buchungs-ID je Zeile), `name` (Etikettencode: auch `location`) |
| `pantry.open_package` | `code` (EAN oder Produktname: früheste Ablaufzeit zuerst; Etikettencode `PTRY:…`: eine Packung dieser Charge), `location` (Name, optional, nicht mit Etikettencode) | `batch_id` (Charge der angebrochenen Packung), `location_id`, `booking_id`, `expires_on` (neues Ablaufdatum), `name`, `location` |
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
