# Battlemages – Gameplay Design Document

Version: 1.0
Status: Approved
Verantwortlich: Game Design

---

# Zweck

Dieses Dokument beschreibt den vollständigen Spielfluss von Battlemages.

Es definiert:

- Gameplay Loop
- Spielerentscheidungen
- Progression
- Belohnungen
- Runstruktur
- UI-Flows
- Spielzustände

Dieses Dokument enthält **keine** Details zum Kampfsystem.

→ Siehe: 01_Combat.md

---

# Vision

Battlemages soll leicht verständlich sein.

Die Spieltiefe entsteht nicht durch viele Systeme.

Sie entsteht durch:

- Zauberkombinationen
- Reihenfolge
- Timing
- Build-Entscheidungen

Der Spieler soll ständig kleine Entscheidungen treffen.

Nicht wenige große.

---

# Gameplay Loop

Der komplette Spielablauf.

```text
Hauptmenü

↓

Run starten

↓

Startzauber wählen

↓

Kampf

↓

Belohnung

↓

Zauberleiste bearbeiten

↓

Nächster Kampf

↓

...

↓

Boss

↓

Sieg oder Niederlage

↓

Run-Statistik

↓

Hauptmenü
```

---

# Spielstart

Nach Klick auf

**„Run starten“**

beginnt ein neuer Run.

Ein Run besitzt:

- 12 Kämpfe
- leeres Build
- volle HP

---

# Startzauber

Zu Beginn erhält der Spieler eine Auswahl.

Beispiel:

6 zufällige Zauber

↓

3 auswählen

↓

Diese bilden die erste Zauberleiste.

Die Reihenfolge darf anschließend angepasst werden.

---

# Aufbau eines Runs

Ein Run besteht aus:

## Kampf 1–8

Normale Gegner

Ziel:

Build aufbauen.

---

## Kampf 9–11

Elitegegner

Ziel:

Build testen.

---

## Kampf 12

Boss

Ziel:

Finale Prüfung.

---

# Nach jedem Kampf

Nach einem Sieg öffnet sich der Belohnungsbildschirm.

Der Spieler erhält drei Karten.

Beispiele:

- neuer Zauber
- Zauber verbessern
- seltenes Upgrade

Genau eine Karte darf gewählt werden.

---

# Danach

Deck bearbeiten.

Drag & Drop.

↓

Kampf starten.

---

# Belohnungen

Belohnungen besitzen unterschiedliche Seltenheiten.

Zum Beispiel:

Gewöhnlich

↓

Selten

↓

Episch

↓

Legendär

Seltenere Belohnungen erscheinen seltener.

---

# Zauber verbessern

Jeder Zauber besitzt:

Rang I

↓

Rang II

↓

Rang III

↓

Rang IV

↓

Rang V

Nur bereits vorhandene Zauber können verbessert werden.

---

# Rangsystem

## Rang I

Grundzauber.

---

## Rang II

Verbessert Zahlen.

---

## Rang III

Neuer Gameplay-Effekt.

Nicht nur höhere Werte.

---

## Rang IV

Verbessert Zahlen erneut.

---

## Rang V

Vollendung.

Der Zauber erreicht seine endgültige Form.

---

# Deck Editor

Zwischen Kämpfen darf der Spieler:

- Reihenfolge ändern
- neuen Zauber einbauen
- Zauber austauschen

Während eines Kampfes niemals.

---

# Deckgröße

Maximal:

5 Zauber.

Neue Zauber ersetzen bestehende.

Dadurch bleibt jede Entscheidung relevant.

---

# Buildphilosophie

Es existieren keine Klassen.

Der Spieler kombiniert frei.

Zum Beispiel:

Blut

+

Runen

+

Sterne

Oder

Traum

+

Schatten

Oder

Urgewalten

+

Blut

Alle Kombinationen sollen spielbar sein.

---

# Spieltempo

Ein Kampf soll:

- schnell verständlich sein
- trotzdem strategisch wirken

Der Spieler trifft seine Entscheidungen hauptsächlich:

zwischen den Kämpfen.

Nicht währenddessen.

---

# Spielerentscheidungen

Der Spieler entscheidet:

- welche Zauber
- welche Reihenfolge
- welche Verbesserungen
- welche Schule
- welche Synergien

Nicht:

welchen Zauber er als Nächstes wirkt.

Die Rotation übernimmt dies automatisch.

---

# Sieg

Nach Bosskampf:

Run abgeschlossen.

Statistik anzeigen.

Zurück ins Hauptmenü.

---

# Niederlage

Bei 0 HP:

Run endet sofort.

Statistik anzeigen.

Zurück ins Hauptmenü.

Keine Teilfortschritte.

---

# Statistik

Nach jedem Run:

Anzeigen:

- Kämpfe erreicht
- Boss besiegt?
- verwendete Schulen
- stärkster Zauber
- häufigster Zauber
- verursachter Schaden
- geblockter Schaden

(Optional für MVP: nur Kämpfe erreicht und Sieg/Niederlage.)

---

# Benutzeroberfläche

## Hauptmenü

Enthält:

- Run starten
- Einstellungen
- Beenden

---

## Kampf

Anzeige:

- Spieler
- Gegner
- HP
- Zauberleiste
- Kampflog
- Buffsymbole
- Fortschritt (Kampf X/12)

---

## Belohnung

3 Karten

↓

Auswahl

↓

Weiter

---

## Deck Editor

5 Slots

↓

Drag & Drop

↓

Bestätigen

↓

Nächster Kampf

---

## Run-Ende

Anzeige:

- Sieg oder Niederlage
- Statistik
- Neuer Run

---

# Progression

Während eines Runs:

- neue Zauber
- stärkere Zauber
- bessere Kombinationen

Außerhalb eines Runs:

Keine Meta-Progression (MVP).

Jeder Run startet identisch.

---

# Schwierigkeit

Die Schwierigkeit steigt durch:

- neue Gegner
- stärkere Mechaniken
- Elitegegner
- Boss

Nicht ausschließlich durch größere Zahlen.

---

# Zufall

Zufällig sind:

- Startzauber
- Belohnungen
- Gegnerreihenfolge (optional)

Nicht zufällig:

- Zauberrotation
- Kampfablauf
- Buildentscheidungen

Der Spieler soll sich jederzeit verantwortlich fühlen.

---

# MVP

Der erste spielbare Build enthält:

✓ Hauptmenü

✓ 12 Kämpfe

✓ 36 Zauber

✓ 6 Schulen

✓ Belohnungssystem

✓ Deck Editor

✓ Boss

✓ Sieg/Niederlage

Nicht enthalten:

- Meta-Progression
- Achievements
- Daily Runs
- Mehrere Spielmodi
- PvP

---

# Gameplay-Regeln

Neue Features müssen mindestens eine dieser Eigenschaften verbessern:

- Buildtiefe
- Lesbarkeit
- Spielerentscheidung
- Wiederspielbarkeit

Neue Features dürfen niemals:

- den Spielfluss verlangsamen
- unnötige Ressourcen hinzufügen
- die Zauberleiste weniger wichtig machen
- das Kampfsystem komplizierter machen

---

# Definition of Done

Das Gameplay gilt als vollständig, wenn:

✓ Ein kompletter Run von Anfang bis Ende spielbar ist.

✓ Alle Bildschirme funktionieren.

✓ Alle Entscheidungen funktionieren.

✓ Alle Übergänge funktionieren.

✓ Der Spieler ohne Entwicklerwerkzeuge einen vollständigen Run spielen kann.

Erst danach beginnt die eigentliche Feinabstimmung des Game Feel.