# Battlemages – Technical Design Document

Version: 1.0
Status: Approved
Verantwortlich: Technical Design

---

# Zweck

Dieses Dokument definiert die technische Architektur von Battlemages.

Es beschreibt:

- Projektstruktur
- Verantwortlichkeiten
- Modulgrenzen
- Datenfluss
- Implementierungsregeln
- Entwicklungsreihenfolge

Gameplay-Regeln gehören ausschließlich in:

→ 01_Combat.md

Spielfluss gehört ausschließlich in:

→ 02_Gameplay.md

---

# Entwicklungsphilosophie

Battlemages wird modular entwickelt.

Jedes System besitzt genau eine Verantwortung.

Keine Datei soll mehrere Systeme gleichzeitig verwalten.

Lesbarkeit und Wartbarkeit besitzen Vorrang vor kurzen Lösungen.

---

# Technologie

Frontend

- HTML
- CSS
- Vanilla JavaScript

Keine Frameworks.

Keine Build-Pipeline.

Kein Canvas.

Das Spiel basiert vollständig auf DOM-Elementen.

---

# Architektur

Das Projekt besteht aus mehreren unabhängigen Modulen.

```text
Game

↓

Game State

↓

Battle Manager

↓

Spell Engine

↓

Enemy Engine

↓

Effect Engine

↓

Reward System

↓

Renderer

↓

UI
```

Jedes Modul besitzt genau eine Aufgabe.

---

# Projektstruktur

```text
BattleMages/

docs/

assets/

images/

icons/

audio/

data/

spells.js

enemies.js

schools.js

upgrades.js

src/

game.js

state.js

battleManager.js

spellEngine.js

enemyEngine.js

effectEngine.js

rewardSystem.js

renderer.js

ui.js

constants.js

utils.js

index.html

style.css
```

---

# Modulübersicht

## game.js

Startpunkt des Spiels.

Aufgaben:

- Initialisierung
- Startbildschirm
- Spiel starten
- Module verbinden

Keine Spiellogik.

---

## state.js

Verwaltet den aktuellen Spielzustand.

Mögliche States:

MainMenu

Battle

Reward

DeckEditor

Victory

Defeat

Nur Zustandswechsel.

Keine Darstellung.

---

## battleManager.js

Steuert ausschließlich den Kampfablauf.

Verantwortlich für:

- Kampfbeginn
- Reihenfolge
- Spielerzug
- Gegnerzug
- Kampfende

Keine Schadensberechnung.

Keine Buffs.

Keine Darstellung.

---

## spellEngine.js

Berechnet ausschließlich Zauber.

Aufgaben:

- Schaden
- Schilde
- Buffs auslösen
- Status erzeugen

Keine Gegnerlogik.

Keine UI.

---

## enemyEngine.js

Berechnet ausschließlich Gegner.

Aufgaben:

- Grundangriff
- Spezialfähigkeit
- Passive Fähigkeit

Keine Zauber.

Keine UI.

---

## effectEngine.js

Verarbeitet alle Effekte.

Beispiele:

- Buffs

- Debuffs

- Schilde

- Nachwirkungen

- Trigger

- Signature-Erholung

Dieses Modul enthält sämtliche temporären Zustände.

---

## rewardSystem.js

Erstellt Belohnungen.

Aufgaben:

- Karten generieren
- Seltenheiten
- Verbesserungen
- Zauber anbieten

---

## renderer.js

Darstellung.

Ausschließlich:

- DOM aktualisieren
- Animationen starten
- Zahlen anzeigen

Keine Spiellogik.

---

## ui.js

Verarbeitet Eingaben.

Beispiele:

- Buttons

- Drag & Drop

- Hover

- Tooltips

Keine Spielregeln.

---

## constants.js

Globale Konstanten.

Beispiele:

Spieler HP

Runlänge

Schadensklassen

Buffklassen

Animationen

Keine Logik.

---

## utils.js

Hilfsfunktionen.

Beispiele:

Zufallszahlen

Sortierung

Hilfsberechnungen

Keine Spiellogik.

---

# Daten

Alle Inhalte werden datengetrieben gespeichert.

Beispiele:

spells.js

enemies.js

upgrades.js

schools.js

Die Engine kennt keine konkreten Zauber.

Sie verarbeitet ausschließlich Daten.

---

# Datenmodell

## Spell

Eigenschaften:

- id
- Name
- Schule
- Typ
- Rang
- Werte
- Mechaniken
- Erholung
- Upgrades

---

## Enemy

Eigenschaften:

- id
- Name
- HP
- Angriff
- Spezialfähigkeit
- Passive Fähigkeit

---

## Run

Eigenschaften:

- Kampfnummer
- Spielerleben
- Zauberleiste
- Verbesserungen
- Belohnungen

---

# Datenfluss

Ein Spielerzug läuft immer identisch ab.

Battle Manager

↓

Spell Engine

↓

Effect Engine

↓

Enemy Engine

↓

Effect Engine

↓

Renderer

↓

Battle Manager

Die Richtung darf niemals umgekehrt werden.

---

# Architekturregeln

Module kommunizieren ausschließlich über definierte Schnittstellen.

Ein Modul darf niemals direkt interne Daten eines anderen Moduls verändern.

Beispiel:

Renderer darf keine HP verändern.

Spell Engine darf keine DOM-Elemente verändern.

Enemy Engine darf keine Animationen starten.

---

# Fehlerbehandlung

Jedes Modul behandelt ausschließlich seine eigenen Fehler.

Fehler dürfen niemals still ignoriert werden.

Im Entwicklungsmodus werden Fehler in der Konsole ausgegeben.

---

# Performance

Das Spiel besitzt nur einen Kampf gleichzeitig.

Komplexe Optimierungen sind nicht notwendig.

Lesbarkeit besitzt Vorrang.

---

# Animationen

Animationen besitzen niemals Spiellogik.

Animationen zeigen ausschließlich bereits berechnete Ergebnisse.

Spielregeln dürfen niemals von Animationen abhängen.

---

# Entwicklung

Jedes neue System wird vollständig abgeschlossen.

Danach erfolgt:

Review

↓

Test

↓

Refactoring

↓

Nächster Sprint

Mehrere große Systeme gleichzeitig werden vermieden.

---

# Implementierungsreihenfolge

Sprint 1

Projektstruktur

---

Sprint 2

Game State

---

Sprint 3

Renderer

---

Sprint 4

Battle Manager

---

Sprint 5

Spell Engine

---

Sprint 6

Effect Engine

---

Sprint 7

Enemy Engine

---

Sprint 8

Reward System

---

Sprint 9

Deck Editor

---

Sprint 10

Alle Zauber

---

Sprint 11

Alle Gegner

---

Sprint 12

Animationen

---

Sprint 13

Balancing

---

# Code-Regeln

Jede Funktion besitzt genau eine Aufgabe.

Keine Funktion sollte länger als ungefähr 50 Zeilen werden.

Große if-Ketten vermeiden.

Magic Numbers vermeiden.

Keine globale Spielzustände außerhalb des State-Systems.

Keine Gameplay-Logik im Renderer.

Keine Gameplay-Logik in der UI.

---

# Cursor-Regeln

Cursor trifft keine Gameplay-Entscheidungen.

Cursor verändert keine Dokumentation eigenständig.

Cursor implementiert ausschließlich freigegebene Systeme.

Vor jeder größeren Änderung:

- technischen Plan erstellen
- betroffene Dateien auflisten
- auf Freigabe warten

---

# Definition of Done

Ein Modul gilt als abgeschlossen, wenn:

✓ Es nur eine Verantwortung besitzt.

✓ Es unabhängig getestet werden kann.

✓ Es keine Logik anderer Module enthält.

✓ Es dokumentiert wurde.

✓ Es keine Konsolenfehler erzeugt.

Erst danach beginnt das nächste Modul.