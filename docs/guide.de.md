# Vorrat – Anleitung

*English version: [guide.en.md](guide.en.md)*

Vorrat ist die Vorratsverwaltung in Home Assistant. Du buchst Lebensmittel per Barcode oder Name ein
und aus. Vorrat merkt sich, wo was liegt und wann es abläuft, erinnert an Ablaufendes und schreibt
die Einkaufsliste aus Mindestmengen. Diese Anleitung erklärt die Bedienung; Installation und
Technik stehen im [README](../README.md).

Du findest Vorrat in der Seitenleiste von Home Assistant. Oben gibt es die Tabs **Bestand**,
**Einbuchen**, **Auslagern**, **Ablauf**, **Einkauf**, **Rezepte** und (nur für Admins)
**Einstellungen**. Das Fragezeichen oben rechts öffnet diese Anleitung.

## Inhalt

1. [Erste Schritte](#1-erste-schritte)
2. [Einkäufe einbuchen](#2-einkäufe-einbuchen)
3. [Verbrauchen und auslagern](#3-verbrauchen-und-auslagern)
4. [Bestand ansehen und korrigieren](#4-bestand-ansehen-und-korrigieren)
5. [Was läuft ab?](#5-was-läuft-ab)
6. [Einkaufsliste](#6-einkaufsliste)
7. [Rezepte](#7-rezepte)
8. [Etiketten](#8-etiketten)
9. [Kategorien, Produktarten und Vererbung](#9-kategorien-produktarten-und-vererbung)
10. [Tipps und häufige Fragen](#10-tipps-und-häufige-fragen)

## 1. Erste Schritte

Vorrat bringt eine fertige Grundausstattung mit: Lagerorte (Kühlschrank, Gefrierschrank,
Vorratsschrank …), Einheiten (g, kg, ml, l, Stück, Packung, EL, TL …) und einen Kategoriebaum mit
rund 1.700 Produktarten (Tomatenmark, Spaghetti, Basmatireis …). Du kannst direkt loslegen.

Für Admins lohnt sich vorher ein Blick in **Einstellungen**:

1. **Lagerorte**: Passe die Liste an deine Küche an (umbenennen, hinzufügen, löschen).
2. **Standards**: Lege fest, was gilt, wenn eine Kategorie oder ein Produkt nichts Eigenes hat
   (Einheit, Lagerort, Datumsart, Warnung vor Ablauf).
3. **Kategorien**: Gib Kategorien einen Standard-Lagerort (z. B. Milchprodukte → Kühlschrank).
   Dann musst du beim Einbuchen seltener einen Lagerort wählen.
4. Optional: Richte einen Etikettendrucker ein (siehe [Etiketten](#8-etiketten)).

## 2. Einkäufe einbuchen

Öffne **Einbuchen**. Das Eingabefeld ist sofort bereit.

1. **Produkt finden**, auf eine von drei Arten:
   - Mit einem USB- oder Bluetooth-Barcodescanner scannen. Der Scanner tippt den Barcode ins Feld.
   - **Kamera** antippen und den Barcode vor die Handykamera halten.
   - Einen Namen tippen und Enter drücken.
2. **Bekanntes Produkt**: Es erscheinen nur die Felder für diese Buchung.
   **Unbekannter Barcode**: Vorrat fragt Open Food Facts und füllt Name, Marke, Inhalt und eine
   passende Kategorie vor. Prüfe die Angaben. Findet sich nichts, legst du das Produkt mit
   **Neues Produkt** selbst an; über **Online suchen** suchst du bei Open Food Facts nach Namen.
3. **Kategorie**: Jedes neue Produkt braucht eine Kategorie, am besten eine Produktart
   (z. B. „Tomatenmark“). Tippe in das Filterfeld der Kategorieauswahl. Fehlt die passende,
   wähle **„…“ neu anlegen** und danach die übergeordnete Kategorie.
4. **Inhalt** (optional): z. B. 500 g pro Packung, bei Konserven das Abtropfgewicht. Damit rechnen
   Mindestmengen und Rezepte.
5. **Mindestanzahl** (optional): Unter dieser Packungszahl kommt das Produkt auf die Einkaufsliste.
6. **Ablaufdatum**: Das Datum von der Packung. Leer lassen, wenn es keins gibt.
   Die Beschriftung nennt die Datumsart (Mindesthaltbarkeit oder Verbrauchsdatum).
7. **Packungen** und **Lagerort**: Der Lagerort ist vorbelegt (grau: „Geerbt: Kühlschrank (von
   Milchprodukte)“). Eine andere Wahl gilt nur für diese Buchung; **Zurücksetzen** kehrt zum Standard
   zurück. Bei neuen Produkten merkt sich **Wird Standardlager** den gewählten Ort fürs Produkt.
8. **Etiketten drucken** (falls eingerichtet) und **Einbuchen**.

Gleiche Produkte mit gleichem Datum landen in derselben Charge. Ein anderes Datum ergibt eine neue
Charge, so siehst du später, welche Packung zuerst weg muss.

## 3. Verbrauchen und auslagern

**Auslagern** funktioniert wie Einbuchen: scannen, Kamera oder Name.

- Standardmäßig wird die Packung mit dem frühesten Datum genommen. Du kannst auch eine bestimmte
  Charge und einen Lagerort wählen.
- **Etikett scannen**: Ein Vorrat-Etikett (QR-Code) bucht genau eine Packung dieser Charge aus,
  in Einbuchen und Auslagern.
- **Rückgängig** neben der Meldung legt die Packungen zurück, wohin sie gehörten. Das geht einmal pro
  Buchung.
- Im **Bestand** und unter **Ablauf** nimmt das Minus an einer Charge eine Packung aus genau dieser
  Charge.

Kochen nach Rezept bucht nichts automatisch aus. Lagere die Zutaten wie gewohnt aus.

## 4. Bestand ansehen und korrigieren

**Bestand** zeigt den Kategoriebaum mit allem, was da ist, mit Anzahl und frühestem Datum.

- Eine Zeile antippen klappt sie auf. Ein Produkt zeigt seine Chargen (Datum, Lagerort, Packungen).
- Das Suchfeld findet Name, Marke, Barcode, Kategorie und Lagerort.
- **Alle Lagerorte** filtert nach einem Lagerort. **Auch Produkte ohne Bestand** zeigt leere Produkte,
  um sie zu bearbeiten oder zu löschen.
- **Stift am Produkt**: Name, Marke, Barcode, Kategorie, Inhalt, Mindestanzahl und eigene Vorgaben
  (Lagerort, Datumsart, Warnung vor Ablauf).
- **Stift an einer Charge**: Datum oder Packungszahl korrigieren, etwa nach einem Tippfehler.
  0 Packungen entfernt die Charge.
- **Etikett-Symbol**: Etiketten für diese Charge nachdrucken.
- Rot heißt abgelaufen, orange heißt bald fällig.

## 5. Was läuft ab?

**Ablauf** listet alle abgelaufenen (rot) und bald ablaufenden (orange) Chargen, das früheste Datum
zuerst. „Bald“ heißt: innerhalb der *Warnung vor Ablauf* des Produkts (geerbt oder eigen).
**Warnschwelle** setzt vorübergehend eine Zahl für alle, z. B. 14 Tage zur Essensplanung; gespeichert
wird nichts.

Für Automationen gibt es die Sensoren *Abgelaufen* und *Läuft bald ab* (siehe README), z. B. für eine
Benachrichtigung aufs Handy.

## 6. Einkaufsliste

**Einkauf** entsteht aus zwei Quellen:

- **Mindestmengen**: In den Kategorien (Einstellungen) legst du eine *Mindestmenge* (z. B. 2 kg
  Nudeln, egal welche Marke) und/oder eine *Mindestanzahl* (Packungen) fest. Am Produkt gibt es eine
  eigene *Mindestanzahl* für Lieblingsprodukte. Fehlt etwas, erscheint es auf der Liste: „Nudeln –
  500 g fehlen“ oder „Barilla · 2 Pkg. fehlen“. Mindestmengen zählen die ganze Kategorie samt
  Unterkategorien, und nichts wird doppelt gezählt.
- **Von Hand**: **Zur Einkaufsliste hinzufügen**, Namen tippen, Produkt oder Kategorie wählen,
  Anzahl angeben. Ein neues Produkt wird dabei gleich angelegt.

Abhaken streicht einen Eintrag durch. Ein Mindestmengen-Eintrag kommt von selbst zurück, wenn sich
die fehlende Menge ändert, z. B. wenn du nur einen Teil eingekauft hast.

Dieselbe Liste gibt es als To-do-Liste **Einkaufsliste** in Home Assistant und in der Companion-App.
Dort kannst du abhaken und Einträge mit dem genauen Namen eines Produkts oder einer Kategorie
hinzufügen.

## 7. Rezepte

**Rezepte** zeigt alle Rezepte mit dem Stand „5 von 7 vorhanden“. Das Suchfeld findet Name und
Zutaten. Eine Zeile aufklappen zeigt Zutaten mit Status, Anleitung, Quelle und Bild; **Portionen**
rechnet die Mengen um (nur Anzeige).

**Rezept hinzufügen**:

1. Name, Portionen und Anleitung eintragen.
2. Pro Zutat: im Feld **Zutat** eine Produktart oder Kategorie suchen (auch über einen Produktnamen,
   „Mutti“ findet Tomatenmark). Fehlt sie, **Neue Produktart „…“ anlegen**.
3. Menge und Einheit (beide oder keins), optional ein **Hinweis** wie „fein gewürfelt“.
4. **optional** für Zutaten, die das Rezept nicht braucht. **Nicht gegen den Vorrat prüfen** für
   Dinge, die du nicht im Vorrat führst (Salz, Wasser).
5. Fehlt eine Einheit, wähle **Neue Einheit …** in der Einheitenauswahl.

**Importieren**: Füge die Adresse eines Rezepts ein (z. B. Chefkoch, Mealie, Tandoor). Vorrat liest
die Rezeptdaten der Seite und öffnet den Rezeptdialog vorausgefüllt. Gespeichert wird erst, wenn du
speicherst. Jede Zutat zeigt ihre Originalzeile; prüfe die vorgeschlagenen Produktarten. Eine
unbekannte Einheit (z. B. „Tasse“) legst du mit **Anlegen** an oder wählst eine vorhandene.

Status der Zutaten: *vorhanden*, *teilweise*, *fehlt*, *Menge unbekannt* (Produkte ohne Inhaltsangabe),
*keine Zutat zugeordnet*, *nicht geprüft*.

## 8. Etiketten

Ein Etikett zeigt Produkt, Marke, Ablaufdatum und einen QR-Code der Charge. Damit erkennst du Reste
im Gefrierschrank und buchst sie per Scan aus.

- **Einrichten** (Admin): *Einstellungen > Geräte & Dienste > Pantry > Konfigurieren*. Modell wählen,
  z. B. *Dymo LabelWriter 450* hinter einem USB-Druckserver, Adresse und Etikettengröße eintragen.
  Ohne Netzwerkdrucker öffnet sich der Druckdialog des Browsers.
- **Beim Einbuchen**: Häkchen **Etiketten drucken**, ein Etikett pro Packung (höchstens 20).
- **Nachdrucken**: Etikett-Symbol an einer Charge im Bestand.
- Mehr als 2 Etiketten auf einmal fragt Vorrat vorher nach.

## 9. Kategorien, Produktarten und Vererbung

Der Kategoriebaum hat drei Ebenen: **Hauptkategorie → Kategorie → Produktart**, z. B.
*Nudeln, Reis & Getreide → Nudeln → Spaghetti*. Produkte hängen meist an einer Produktart.
Rezepte und Mindestmengen arbeiten mit Kategorien und Produktarten, nicht mit Marken.

**Vererbung**: Einheit, Standard-Lagerort, Datumsart und Warnung vor Ablauf gelten für alles
darunter, bis eine tiefere Ebene oder das Produkt etwas Eigenes festlegt. Geerbte Werte stehen grau
mit ihrer Herkunft da („Geerbt: 7 Tage (von Milchprodukte)“). **Zurücksetzen** entfernt einen eigenen
Wert, danach gilt wieder der geerbte. Mindestmengen werden nicht vererbt.

**Löschen**: Vor dem Löschen zeigt Vorrat, was mitgelöscht oder geändert wird (Unterkategorien,
Produkte, Bestand, Rezeptzutaten …). Ein Lagerort mit Bestand bekommt einen Zielort für die
Packungen.

## 10. Tipps und häufige Fragen

- **Was bedeutet ein Feld?** Gepunktet unterstrichene Beschriftungen erklären sich, wenn du mit der
  Maus darüber fährst. Symbol-Knöpfe nennen ihre Aktion ebenso. Am Handy gibt es keine Tooltips;
  dafür ist diese Anleitung da.
- **Die Kamera startet nicht.** Der Kamerascan braucht HTTPS (oder `localhost`) und die
  Kamera-Berechtigung im Browser bzw. in der App.
- **Der Barcode ist unbekannt.** Nicht jedes Produkt steht bei Open Food Facts. Lege es mit
  **Neues Produkt** an; beim nächsten Scan kennt Vorrat es.
- **Wer darf was?** Alle Nutzer buchen, bearbeiten Produkte, führen die Einkaufsliste und Rezepte
  und dürfen neue Produktarten und Einheiten anlegen. Einstellungen, Produkte löschen und Rezepte
  löschen sind Admins vorbehalten.
- **Falsch gebucht?** Direkt nach der Buchung **Rückgängig**, sonst die Charge im Bestand mit dem
  Stift korrigieren.
- **Automationen**: Für Scanner an ESPHome, NFC-Tags usw. gibt es die Dienste `pantry.book_in`,
  `pantry.book_out` und `pantry.print_labels` (siehe README).
