# Vorrat – Anleitung

*English version: [guide.en.md](guide.en.md)*

Vorrat ist die Vorratsverwaltung in Home Assistant. Du buchst Vorräte per Barcode oder Name ein
und aus: Lebensmittel, Batterien, Haushaltswaren, Medikamente und selbst eingekochte Gläser. Vorrat merkt sich, wo was liegt und wann es abläuft, erinnert an Ablaufendes und schreibt
die Einkaufsliste aus Mindestmengen. Diese Anleitung erklärt die Bedienung; Installation und
Technik stehen im [README](../README.md).

Du findest Vorrat in der Seitenleiste von Home Assistant. Oben gibt es die Tabs **Bestand**,
**Einbuchen**, **Auslagern**, **Ablauf**, **Einkauf**, **Rezepte**, **Speiseplan**, **Einkochen** und (nur für Admins)
**Einstellungen**. Das Fragezeichen oben rechts öffnet diese Anleitung.

## Inhalt

1. [Erste Schritte](#1-erste-schritte)
2. [Einkäufe einbuchen](#2-einkäufe-einbuchen)
3. [Verbrauchen und auslagern](#3-verbrauchen-und-auslagern)
4. [Bestand ansehen und korrigieren](#4-bestand-ansehen-und-korrigieren)
5. [Was läuft ab?](#5-was-läuft-ab)
6. [Einkaufsliste](#6-einkaufsliste)
7. [Rezepte](#7-rezepte)
7a. [Speiseplan](#7a-speiseplan)
7b. [Einkochen](#7b-einkochen)
8. [Etiketten und Bondrucker](#8-etiketten-und-bondrucker)
9. [Kategorien, Produktarten und Vererbung](#9-kategorien-produktarten-und-vererbung)
10. [Tipps und häufige Fragen](#10-tipps-und-häufige-fragen)

## 1. Erste Schritte

Vorrat bringt eine fertige Grundausstattung mit: Lagerorte (Kühlschrank, Gefrierschrank,
Vorratsschrank …), Einheiten (g, kg, ml, l, Stück, Packung, EL, TL …) und einen Kategoriebaum mit
rund 1.700 Produktarten (Tomatenmark, Spaghetti, Basmatireis …). Dazu kommen Kategorien für
Nicht-Lebensmittel (Haushalt & Drogerie, Haustechnik, Hausapotheke, Tierbedarf) und
Eingekochtes. Du kannst direkt loslegen.

Für Admins lohnt sich vorher ein Blick in **Einstellungen**:

1. **Lagerorte**: Passe die Liste an deine Küche an (umbenennen, hinzufügen, löschen).
2. **Standards**: Lege fest, was gilt, wenn eine Kategorie oder ein Produkt nichts Eigenes hat
   (Einheit, Lagerort, Datumsart, Warnung vor Ablauf, Haltbarkeit).
3. **Einheiten**: Mit dem Häkchen **Nur für Rezepte** blendest du eine Einheit (z. B. EL) bei Produkten, Mindestmengen und Standards aus. Für Rezeptzutaten bleibt sie wählbar.
4. **Kategorien**: Gib Kategorien einen Standard-Lagerort (z. B. Milchprodukte → Kühlschrank).
   Dann musst du beim Einbuchen seltener einen Lagerort wählen.
5. Optional: Richte einen Etikettendrucker oder Bondrucker ein (siehe [Etiketten und Bondrucker](#8-etiketten-und-bondrucker)).

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
   Die Beschriftung nennt die Datumsart (Mindesthaltbarkeit oder Verbrauchsdatum). Hat die Kategorie
   oder das Produkt eine *Haltbarkeit*, schlägt Vorrat heute + Haltbarkeit vor (siehe
   [Kategorien](#9-kategorien-produktarten-und-vererbung)).
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
- **Etikett-Symbol**: Etiketten für diese Charge nachdrucken. Eingekochte Gläser zeigen ihre Charge
  neben dem Datum.
- Rot heißt abgelaufen, orange heißt bald fällig.

## 5. Was läuft ab?

**Ablauf** listet alle abgelaufenen (rot) und bald ablaufenden (orange) Chargen, das früheste Datum
zuerst. „Bald“ heißt: innerhalb der *Warnung vor Ablauf* des Produkts (geerbt oder eigen).
**Warnschwelle** setzt vorübergehend eine Zahl für alle, z. B. 14 Tage zur Essensplanung; gespeichert
wird nichts.

Für Automationen gibt es die Sensoren *Abgelaufen* und *Läuft bald ab* (siehe README), z. B. für eine
Benachrichtigung aufs Handy.

## 6. Einkaufsliste

**Einkauf** entsteht aus drei Quellen:

- **Mindestmengen**: In den Kategorien (Einstellungen) legst du eine *Mindestmenge* (z. B. 2 kg
  Nudeln, egal welche Marke) und/oder eine *Mindestanzahl* (Packungen) fest. Am Produkt gibt es eine
  eigene *Mindestanzahl* für Lieblingsprodukte. Fehlt etwas, erscheint es auf der Liste: „Nudeln –
  500 g fehlen“ oder „Barilla · 2 Pkg. fehlen“. Mindestmengen zählen die ganze Kategorie samt
  Unterkategorien, und nichts wird doppelt gezählt.
- **Von Hand**: **Zur Einkaufsliste hinzufügen**, Namen tippen, Produkt oder Kategorie wählen,
  Anzahl angeben. Ein neues Produkt wird dabei gleich angelegt.
- **Aus Rezepten**: Im Rezept tippst du **Auf die Einkaufsliste**, wählst die Portionen und die
  optionalen Zutaten, die du brauchst. Die fehlenden Mengen aller Rezepte werden pro Kategorie
  zusammengezählt. Die Rezepte sind nummeriert (1, 2, 3 …); hinter jedem Eintrag steht klein, welches Rezept wie viel braucht („1:300 g; 2:200 g“). Ein Rezept bleibt auf
  der Liste, bis du es entfernst: Das machst du im Tab **Einkauf** unter **Für Rezepte** mit dem
  Papierkorb, z. B. nach dem Kochen. Portionen und optionale Zutaten änderst du dort mit dem Stift. Mengen in Rezept-Einheiten wie EL, Tasse oder Prise werden umgerechnet, wenn die Einheit zur Kategorie passt: in ml bei Volumen, in g bei Gewicht (3 EL Öl → 45 ml); sonst, wenn nichts davon im Vorrat ist, die Grundeinheit (2 EL Kapern → 30 ml); nur Scheibe bleibt wie geschrieben („2 Scheiben“). Zutaten ohne Menge zählen als 1 Pkg.

Abhaken streicht einen Eintrag durch. Ein Mindestmengen-Eintrag kommt von selbst zurück, wenn sich
die fehlende Menge ändert, z. B. wenn du nur einen Teil eingekauft hast.

Dieselbe Liste gibt es als To-do-Liste **Einkaufsliste** in Home Assistant und in der Companion-App.
Dort kannst du abhaken und Einträge mit dem genauen Namen eines Produkts oder einer Kategorie
hinzufügen.

**Einkaufszettel drucken**: Mit einem Bondrucker druckt dieser Knopf alle noch nicht abgehakten
Einträge, nach Hauptkategorien sortiert, und schneidet das Papier ab. Der Knopf erscheint nur, wenn
ein Bondrucker eingerichtet ist (siehe [Etiketten und Bondrucker](#8-etiketten-und-bondrucker)).

## 7. Rezepte

**Rezepte** zeigt alle Rezepte mit dem Stand „5 von 7 vorhanden“ (Einkochrezepte stehen im Tab
[Einkochen](#7b-einkochen), nicht hier). Das Suchfeld findet Name und
Zutaten. Eine Zeile aufklappen zeigt Zutaten mit Status, die nummerierten Schritte, Quelle und Bild; **Portionen**
rechnet die Mengen um (nur Anzeige). **Auf die Einkaufsliste** setzt das Rezept auf die Liste
(siehe [Einkaufsliste](#6-einkaufsliste)). **Einplanen** trägt es mit den angezeigten Portionen in den
[Speiseplan](#7a-speiseplan) ein (Datum: heute, Mahlzeit: Abendessen; im Dialog änderbar).

**Rezept hinzufügen**:

1. Name und Portionen eintragen.
2. Pro Zutat: im Feld **Zutat** eine Produktart oder Kategorie suchen (auch über einen Produktnamen,
   „Mutti“ findet Tomatenmark). Fehlt sie, **Neue Produktart „…“ anlegen**.
3. Menge und Einheit (beide oder keins), optional ein **Hinweis** wie „fein gewürfelt“.
4. **optional** für Zutaten, die das Rezept nicht braucht. **Nicht gegen den Vorrat prüfen** für
   Dinge, die du nicht im Vorrat führst (Salz, Wasser).
5. Fehlt eine Einheit, wähle **Neue Einheit …** in der Einheitenauswahl.
6. Unter **Zubereitung** mit **Schritt hinzufügen** die Schritte eintragen, einen pro Feld. Die
   Pfeile verschieben einen Schritt, das Kreuz entfernt ihn. **Zwischenüberschrift hinzufügen**
   teilt das Rezept in Abschnitte (z. B. „Teig“, „Füllung“); die Nummern laufen weiter.

Ältere Rezepte haben noch einen einzigen Anleitungstext. Beim nächsten Bearbeiten steht er an
Leerzeilen in Schritte geteilt im Dialog; mit dem Speichern wird daraus die Schrittliste.

**Drucken**: Mit einem Bondrucker druckt dieser Knopf im aufgeklappten Rezept Name, Portionen,
die Zutaten zum Abhaken (Mengen für die angezeigten Portionen) und die nummerierten Schritte. Der
Knopf erscheint nur, wenn ein Bondrucker eingerichtet ist.

**Kochmodus**: Im aufgeklappten Rezept öffnet **Kochmodus** Zutaten (für die angezeigten Portionen)
und Schritte im Vollbild. Ein Tipp auf einen Schritt hakt ihn ab (wird nicht gespeichert). Steht in
einem Schritt eine Zeit („20 Minuten“, „ca. 10–15 Min.“, „eine halbe Stunde“), gibt es dazu einen
Timer-Knopf; bei einer Spanne gilt der höhere Wert. Mehrere Timer laufen gleichzeitig und stehen
unten; ein abgelaufener piept, vibriert und wird rot. Der Bildschirm bleibt an, solange der
Kochmodus offen ist (wenn der Browser es erlaubt). Die Timer laufen nur in diesem Browserfenster:
Schließen fragt nach und beendet sie.

Einheiten mit Häkchen *Nur für Rezepte* (z. B. EL, TL, Tasse, Prise) stehen nur hier zur Wahl. Hat die Einheit eine Umrechnung, zeigt das Rezept die Menge dazu: „3 EL (≈ 45 ml)“. Die Größen sind Faustregeln: Prise und Messerspitze 0,5 g, Zehe 0,1 Stück (auf der Einkaufsliste wird aufgerundet: 3 Zehen → 1 Knoblauch), Handvoll 30 g, Tropfen 0,05 ml, Spritzer 1 ml, Schuss 20 ml. Scheibe, Zweig und Stiel haben keine Größe und zählen als beliebige Menge. Eine Einheit, die ein Rezeptimport anlegt, ist zunächst nur für Rezepte.

**Importieren**: Füge die Adresse eines Rezepts ein (z. B. Chefkoch, Mealie, Tandoor). Vorrat liest
die Rezeptdaten der Seite und öffnet den Rezeptdialog vorausgefüllt, mit den Schritten der Seite
(steht dort nur ein Textblock, wird er an Zeilenumbrüchen oder seiner eigenen Nummerierung geteilt). Gespeichert wird erst, wenn du
speicherst. Jede Zutat zeigt ihre Originalzeile; prüfe die vorgeschlagenen Produktarten. Eine
unbekannte Einheit (z. B. „Tasse“) legst du mit **Anlegen** an oder wählst eine vorhandene.

**KI-Prüfung** (wenn eingerichtet, siehe unten): Direkt nach dem Öffnen prüft die KI den Import.
Oben steht „KI prüft das Rezept …“; Speichern wartet so lange, **Nicht abwarten** überspringt die
Prüfung. Danach steht dort „keine Änderungen“ oder was die KI geändert hat: Zutaten mit besserer
Kategorie sind markiert („Von der KI geändert: … (vorher: …)“, mit **Rückgängig**), ein langer
Textblock ist in Schritte geteilt (**Schritte zurücksetzen** stellt ihn wieder her). Fehlt im
Kategoriebaum ein passender Produkttyp (z. B. ein seltenes Gewürz), schlägt die KI einen neuen
unter der passenden Kategorie vor („KI schlägt neuen Produkttyp … vor“); er wird erst beim
Speichern angelegt, **Rückgängig** verwirft den Vorschlag. Prüfe die
Änderungen vor dem Speichern. Schlägt die KI fehl, bleibt der Entwurf wie importiert.

Vorrat merkt sich, welche Kategorie du für eine importierte Zutat gespeichert hast: Beim nächsten
Import derselben Zutat ist sie gleich gewählt. Ebenso merkt es sich, wenn du beim Einbuchen die von
Open Food Facts vorgeschlagene Kategorie änderst.

**KI einrichten** (Admin, einmalig):

1. In Home Assistant eine KI mit *KI-Aufgabe* einrichten, z. B. *Einstellungen > Geräte & Dienste >
   Integration hinzufügen > Google Gemini* mit einem API-Schlüssel aus Google AI Studio (es gibt ein
   kostenloses Kontingent).
2. *Einstellungen > Geräte & Dienste > Pantry > Konfigurieren > KI-Prüfung von Rezeptimporten*:
   die KI-Aufgabe wählen. Leer = keine KI.

Jeder Import schickt das Rezept und den Baum der Lebensmittel-Kategorien an die KI (etwa 10.000
Tokens).

Status der Zutaten: *vorhanden*, *teilweise*, *fehlt*, *Menge unbekannt* (Produkte ohne Inhaltsangabe),
*keine Zutat zugeordnet*, *nicht geprüft*.

## 7a. Speiseplan

**Speiseplan** zeigt den Plan als **Tag**, **Woche** oder **Monat** (Schaltflächen oben). **Zurück** und **Weiter** springen um einen Tag, eine Woche oder einen Monat, je nach Ansicht; **Heute** springt zum heutigen Datum. **Tag** zeigt immer heute.

- **Woche**: Tabelle mit einer Zeile pro Mahlzeit und einer gleich breiten Spalte pro Tag. Auf dem Handy wird jeder Tag zu einem Block, der nur seine Gerichte zeigt, dazu ein **+**. Ein Tipp auf die Tagesüberschrift öffnet die Tagesansicht dieses Tags.
- **Tag**: Liste nach Mahlzeit gruppiert, mit **+** je Mahlzeit.
- **Monat**: Kalender mit einem kleinen Symbol je geplantem Gericht (der Name erscheint beim Darüberfahren oder langen Drücken). Ein Tipp auf einen Tag öffnet seine Tagesansicht.

**Mahlzeit**: Jedes Gericht gehört zu einer Mahlzeit: Frühstück, Mittag, Kaffee, Abendessen oder Snack. Innerhalb eines Tages stehen die Gerichte nach Mahlzeit, dann in der Reihenfolge, in der sie angelegt wurden.

**Gericht hinzufügen** (**+** bei der Mahlzeit):

1. Ein Rezept aus der Namensliste wählen oder freien Text eintippen (z. B. „Pizza vom Lieferdienst“). Ein Rezept wird als Abendessen eingeplant, im Dialog änderbar.
2. **Portionen** startet mit der Haushaltsgröße (siehe unten); ändern, wenn das Gericht für mehr oder weniger Leute ist.
3. Speichern.

Ein Tipp auf den Namen öffnet das Rezept (bei freiem Text den Bearbeiten-Dialog). Der Stift ändert ein Gericht, der Papierkorb löscht es. Wird ein Rezept gelöscht, bleiben seine Gerichte im Plan als freier Text; die Löschfrage listet sie auf.

**Umplanen**: Das Pfeil-Symbol bei einem Gericht verschiebt dessen Mahlzeit an diesem Tag und an jedem direkt folgenden Tag, an dem dieselbe Mahlzeit geplant ist, um einen Tag nach hinten. Die Verschiebung stoppt am ersten Tag ohne diese Mahlzeit (die Lücke). Andere Mahlzeiten bleiben stehen. Eine Bestätigung listet jedes Gericht mit altem und neuem Datum; erst **Verschieben** wendet es an.

**Drucken**: In **Tag** und **Woche** druckt dieser Knopf den Tag bzw. die Woche (Montag bis Sonntag) auf dem Bondrucker, pro Tag mit allen Gerichten. Der Knopf erscheint nur mit Bondrucker; der Monat passt nicht auf einen Bon.

**Mahlzeiten** (nur Admins): Unter *Einstellungen > Mahlzeiten* legst du fest, ab wann eine Mahlzeit gilt (Standard: Frühstück 05:00, Mittag 11:00, Kaffee 14:30, Abendessen 17:00, Snack 20:30). Danach richtet sich die Aktion *Geplantes Rezept drucken* ohne Angabe der Mahlzeit, z. B. ein Knopf in der Küche, der das Rezept für die nächste Mahlzeit druckt.

**Haushaltsgröße** (nur Admins): unter *Einstellungen > Geräte & Dienste > Pantry > Konfigurieren*, Schritt **Haushalt** (Menü *Einstellungen*), **Portionen im Haushalt** setzen (1 bis 99, Standard 3). Das ist der Portionen-Vorschlag für neue Gerichte.

**Kalender**: Der Plan ist zusätzlich ein nur lesbarer Kalender in Home Assistant, Entität *Speiseplan*. Jedes Gericht ist ein ganztägiges Ereignis mit dem Titel „Mahlzeit: Gericht“ (z. B. „Mittag: Spaghetti“); die Beschreibung zeigt die Portionen. Geändert wird der Plan nur in Vorrat.

## 7b. Einkochen

Selbst eingekochte Gläser (Marmelade, Kompott, Eingelegtes …) bucht Vorrat über ein **Einkochprotokoll**
ein. Jedes Protokoll bekommt eine Charge. Die Etiketten tragen sie, daher bucht ein Scan genau ein
Glas dieser Charge aus.

Der Tab **Einkochen** hat oben zwei Schaltflächen: **Protokolle** und **Rezepte**.

**Protokolle** zeigt die Protokolle, neueste zuerst, mit Charge, Produkt, Gläsern (hergestellt und noch
vorhanden), Temperatur und Dauer.

**Protokoll anlegen**:

1. Tab **Einkochen**, Ansicht **Protokolle**, Schaltfläche **Protokoll anlegen**.
2. **Einkochrezept** (optional): Mit einem Rezept ist das Produkt festgelegt (es steht als
   **Ergibt: …** da), und **Gläser**, **Temperatur** und **Dauer** werden aus dem Rezept vorausgefüllt.
   Du kannst sie ändern.
3. Ohne Rezept: **Produkt**. Ein vorhandenes Produkt per Namen wählen. Oder einen neuen Namen eintippen und eine
   **Kategorie** wählen (z. B. unter *Eingekochtes*).
4. **Hergestellt am**: Heute ist vorbelegt; ändern, wenn du an einem anderen Tag eingekocht hast.
5. **Gläser** (Anzahl) und **Lagerort**.
6. **Haltbar bis**: Vorrat schlägt Herstellungsdatum + Haltbarkeit vor; änderbar.
7. **Temperatur** (°C), **Dauer** (Minuten) prüfen; **Notizen** sind optional.
8. **Speichern**: Vorrat legt die Charge automatisch an, Code `JJJJMMTT-n` (z. B. `20261018-1`, n ist die
   laufende Nummer des Tages). Die Gläser werden als eigene Charge eingebucht, danach kannst du
   Etiketten drucken, eines pro Glas.

**Protokoll bearbeiten**: Der Stift ändert nur Rezept, Temperatur, Dauer, Notizen und **Haltbar bis**.
Herstellungsdatum, Produkt und Gläser bleiben, weil die Etiketten sie tragen.

**Rezepte** (Ansicht im Tab **Einkochen**) zeigt nur die Einkochrezepte, mit derselben Liste, Suche,
Import und Bearbeitung wie die Rezeptliste. **Einkochrezept anlegen** öffnet den Rezeptdialog:

- **Name**, **Zubereitung** (Schritte), Quelle und Bild, Zutaten wie bei normalen Rezepten.
- **Ergibt Produkt** (Pflicht): ein vorhandenes Produkt per Namen, oder ein neuer Name mit **Kategorie**.
- **Ergibt (Gläser)** statt Portionen: Die Zutaten werden nach Gläsern umgerechnet.
- **Temperatur** (°C) und **Dauer** (Minuten): optional, beide oder keins.

Ein Einkochrezept macht also immer ein festes Produkt. Öffnest du es, siehst du „ergibt N × Produkt“
und die Schaltfläche **Protokoll anlegen**; sie wechselt zu **Protokolle** mit diesem Rezept vorausgewählt.
Löschst du ein Produkt, werden die Einkochrezepte gelöscht, die es herstellen (die Rückfrage nennt sie).
Einkochrezepte erscheinen weder in der Rezeptliste noch im Speiseplan.

**Protokoll löschen** (nur Admins): Der Papierkorb entfernt das Protokoll mit seinem Bestand und seinen
Buchungen, nach der üblichen Rückfrage.

**Gläser ohne Protokoll**: Schon eingekochte Gläser, die du nicht protokolliert hast, bucht du wie jedes
Produkt ein (Kategorie *Eingekochtes*), ohne Charge.

**Etiketten**: Das Etikett zeigt die Charge in der Markenzeile. Der QR-Code enthält sie, daher bucht ein
Scan in **Einbuchen** oder **Auslagern** ein Glas dieser Charge aus.

## 8. Etiketten und Bondrucker

Ein Etikett zeigt Produkt, Marke, Ablaufdatum und einen QR-Code der Charge. Damit erkennst du Reste
im Gefrierschrank und buchst sie per Scan aus.

- **Einrichten** (Admin): *Einstellungen > Geräte & Dienste > Pantry > Konfigurieren > Etikettendrucker*. Modell wählen,
  z. B. *Dymo LabelWriter 450*, dann unter **Drucker** die Adresse des USB-Druckservers oder den
  Gerätepfad (USB am Home-Assistant-Rechner, z. B. `/dev/usb/lp0`) und die Etikettengröße eintragen.
  Mit *Kein Drucker* öffnet sich der Druckdialog des Browsers.
- **Beim Einbuchen**: Häkchen **Etiketten drucken**, ein Etikett pro Packung (höchstens 20).
- **Nachdrucken**: Etikett-Symbol an einer Charge im Bestand.
- **Einkochetiketten** tragen die Charge statt einer Marke in der Markenzeile (siehe [Einkochen](#7b-einkochen)).
- Mehr als 2 Etiketten auf einmal fragt Vorrat vorher nach.

**Bondrucker** (für Einkaufszettel und Rezepte): *Einstellungen > Geräte & Dienste > Pantry > Konfigurieren >
Bondrucker*. Unter **Drucker** steht der Gerätepfad (USB am Home-Assistant-Rechner, z. B.
`/dev/bondrucker`) oder die Netzwerkadresse. Dazu Papierbreite, Abschneiden und bei seriellen
Druckern die Baudrate. **Testbon drucken** prüft die Verbindung beim Speichern. Die technische
Einrichtung (USB an Docker durchreichen) steht im README unter *Bondrucker*.

## 9. Kategorien, Produktarten und Vererbung

Der Kategoriebaum hat drei Ebenen: **Hauptkategorie → Kategorie → Produktart**, z. B.
*Nudeln, Reis & Getreide → Nudeln → Spaghetti*. Produkte hängen meist an einer Produktart.
Rezepte und Mindestmengen arbeiten mit Kategorien und Produktarten, nicht mit Marken.

**Lebensmittel**: Jede Kategorie hat das Feld *Lebensmittel* mit den Werten „Lebensmittel“ oder
„Kein Lebensmittel“. Der Wert wird vererbt. Nicht-Lebensmittel werden nie als Rezeptzutat angeboten.

Vorrat bringt diese Hauptkategorien mit (bei bestehenden Installationen werden fehlende ergänzt):

- **Haushalt & Drogerie**, **Haustechnik** (Kategorien Batterien mit AA, AAA, C, D, 9V und
  Knopfzellen; Akkus; Leuchtmittel nach Sockel wie E27, E14, GU10), **Tierbedarf**: Nicht-Lebensmittel.
- **Hausapotheke**: Nicht-Lebensmittel, Datumsart „verbrauchen bis“, Warnung 30 Tage.
- **Eingekochtes** (Obst & Kompott, Marmelade & Gelee, Gemüse & Eingelegtes, Soßen & Suppen,
  Fleisch & Wurst): Haltbarkeit 365 Tage, Warnung 30 Tage.

**Vererbung**: Einheit, Standard-Lagerort, Datumsart, Warnung vor Ablauf und Haltbarkeit gelten für alles
darunter, bis eine tiefere Ebene oder das Produkt etwas Eigenes festlegt. Geerbte Werte stehen grau
mit ihrer Herkunft da („Geerbt: 7 Tage (von Milchprodukte)“). **Zurücksetzen** entfernt einen eigenen
Wert, danach gilt wieder der geerbte. Mindestmengen werden nicht vererbt.

**Ablaufdatum und Haltbarkeit**: Gekaufte Ware hat ihr Datum auf der Packung; das gilt. Ohne Aufdruck
(selbst gemacht, eingefroren, aus einer Großpackung umgefüllt) zählt die *Haltbarkeit* in Tagen:
Einbuchen schlägt heute + Haltbarkeit vor, ein Einkochprotokoll Herstellungsdatum + Haltbarkeit. Das
Datum bleibt überall änderbar.

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
  und dürfen neue Produktarten und Einheiten anlegen. Einstellungen, Produkte löschen, Rezepte
  löschen und Einkochprotokolle löschen sind Admins vorbehalten.
- **Falsch gebucht?** Direkt nach der Buchung **Rückgängig**, sonst die Charge im Bestand mit dem
  Stift korrigieren.
- **Automationen**: Für Scanner an ESPHome, NFC-Tags, Sprachbefehle usw. gibt es die Aktionen `pantry.book_in`,
  `pantry.book_out`, `pantry.print_labels`, `pantry.print_shopping_list`, `pantry.shop_recipe` (Rezept auf die
  Einkaufsliste), `pantry.plan_meal` (Gericht planen) und `pantry.canning` (Einkochprotokoll) (siehe README).
