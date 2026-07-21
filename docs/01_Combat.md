# Battlemages – Combat Design Document

Version: 1.0
Status: Approved
Verantwortlich: Game Design

> **STATUS: SUPERSEDED** — Maßgeblich sind `docs/design/BattleMages_Combat_Formula_v2.md`
> und `docs/design/BattleMages_Combat_Identity_Matrix_v1.0.md`. Details:
> `docs/specs/architecture_design_audit_2026-07-21.md`.

---

# Zweck

Dieses Dokument beschreibt das vollständige Kampfsystem von Battlemages.

Es ist die alleinige Referenz für:

- Kampfablauf
- Zauberverarbeitung
- Gegneraktionen
- Balancing
- Kampfrhythmus
- Combat-Architektur

Gameplay-Entscheidungen dürfen nicht außerhalb dieses Dokuments getroffen werden.

---

# Designziele

Der Kampf soll:

- leicht verständlich sein
- strategische Tiefe besitzen
- wenige Grundmechaniken verwenden
- Entscheidungen über Builds statt Reflexe belohnen
- jederzeit gut lesbar bleiben

Komplexität entsteht nicht durch viele Systeme.

Komplexität entsteht durch die Kombination einfacher Systeme.

---

# Grundprinzipien

Battlemages besitzt:

- keine Mana-Ressource
- keine Aktionspunkte
- keine Energie
- keine Beschwörungen
- keine Flächeneffekte (MVP)

Der Spieler beeinflusst den Kampf ausschließlich durch:

- Auswahl seiner Zauber
- Reihenfolge der Zauber
- Verbesserungen
- Timing

---

# Kampfübersicht

Jeder Kampf besteht aus:

Spieler

gegen

einen Gegner

(1 vs 1)

---

# Spielerwerte

Startleben

100 HP

Zwischen Kämpfen

vollständige Heilung

Keine permanente Lebenssteigerung während eines Runs.

---

# Gegnerwerte

Jeder Gegner besitzt:

- Leben
- Grundangriff
- Spezialfähigkeit
- Passive Fähigkeit (optional)

Die Schwierigkeit steigt primär durch Mechaniken.

Nicht ausschließlich durch höhere Werte.

---

# Zauberleiste

Die Zauberleiste ist die wichtigste Mechanik des Spiels.

Eigenschaften:

- genau 5 Slots
- feste Reihenfolge
- wird automatisch abgespielt
- Reihenfolge kann während eines Kampfes nicht verändert werden
- zwischen Kämpfen frei per Drag & Drop anpassbar

Beispiel

Slot 1
↓

Slot 2
↓

Slot 3
↓

Slot 4
↓

Slot 5
↓

Slot 1

...

---

# Zauberrotation

Normale Zauber besitzen keinen Cooldown.

Jeder Zauber wird automatisch gewirkt, sobald sein Slot erreicht wird.

Dadurch entsteht ein gleichmäßiger Kampfrhythmus.

---

# Signature-Zauber

Jede Schule besitzt genau einen Signature-Zauber.

Diese Zauber besitzen eine Erholungsphase.

Erholungsphase

= Anzahl kompletter Rotationen, die der Zauber aussetzt.

Standard

1 Rotation

Normale Zauber besitzen keine Erholungsphase.

---

# Warum Rotations-Erholung?

Die Zauberleiste selbst stellt bereits den Rhythmus dar.

Klassische Cooldowns würden diesen Rhythmus unnötig komplizieren.

Dadurch besitzt Battlemages einen klaren USP.

Die Rotation IST der Cooldown.

---

# Kampfablauf

Kampf startet

↓

Buffs prüfen

↓

Spieler wirkt aktuellen Zauber

↓

Zaubereffekte werden verarbeitet

↓

Gegner reagiert

↓

Status aktualisieren

↓

Nächster Slot

↓

Sieg oder Niederlage prüfen

↓

nächster Impuls

---

# Reihenfolge der Verarbeitung

Jeder Impuls verarbeitet Effekte immer in derselben Reihenfolge.

1.
Zauber aktivieren

2.
Soforteffekte

3.
Schaden

4.
Schilde

5.
Buffs

6.
Debuffs

7.
Nachwirkungen

8.
Signature-Erholung aktualisieren

9.
Gegneraktion

10.
Tod prüfen

Diese Reihenfolge darf nicht verändert werden.

---

# Zauberarten

Es existieren drei Grundtypen.

## Angriff

Verursacht Schaden.

Kann zusätzliche Effekte besitzen.

---

## Schutz

Erzeugt Schilde.

Reduziert Schaden.

Kann defensive Nebeneffekte besitzen.

---

## Status

Verändert den Kampf.

Beispiele:

- Buff
- Debuff
- Vorbereitung
- Timing
- Regelbruch

---

# Kampfrhythmus

Das Spiel basiert auf Rhythmus.

Nicht auf Burst.

Nicht auf Cooldowns.

Nicht auf Ressourcen.

Der Spieler plant mehrere Züge voraus.

---

# Balancing

Grundwerte

Spieler

100 HP

---

Schaden

Klein

8

Standard

12

Stark

16

Signature

24

---

Schilde

Klein

10

Mittel

18

Stark

28

---

Buffs

Klein

+10 %

Mittel

+20 %

Groß

+35 %

Signature

+50 %

---

Dauer

Kurz

2 Impulse

Mittel

4 Impulse

Lang

6 Impulse

---

# Gegnerdesign

Gegner werden nicht ausschließlich stärker.

Sie verändern den Kampf.

Möglichkeiten:

- höherer Schaden
- andere Spezialfähigkeit
- andere Passivfähigkeit
- anderer Kampfrhythmus

Dadurch bleibt jeder Kampf unterschiedlich.

---

# Runstruktur

Ein Run besteht aus:

8 normale Kämpfe

↓

3 Elitekämpfe

↓

1 Boss

Gesamt:

12 Kämpfe

---

# Belohnung

Nach jedem gewonnenen Kampf:

Belohnungsbildschirm

↓

3 Karten

↓

Spieler wählt eine Karte

↓

Zauberleiste bearbeiten

↓

Nächster Kampf

---

# Zauberleiste bearbeiten

Zwischen Kämpfen darf:

- Reihenfolge geändert werden
- neuer Zauber eingebaut werden
- alter Zauber entfernt werden

Während eines Kampfes niemals.

---

# Visualisierung

Battlemages setzt auf klares Feedback.

Keine großen Animationen.

Stattdessen:

- Karten leuchten
- kleine Partikel
- Schadenszahlen
- Schildeffekt
- Buffsymbole
- Signature-Markierung
- Impulsmarker

Lesbarkeit besitzt immer Vorrang.

---

# Architektur

Der Kampf besteht aus mehreren unabhängigen Systemen.

Battle Manager

steuert ausschließlich den Kampfablauf.

Spell Engine

berechnet Zauber.

Enemy Engine

berechnet Gegner.

Effect Engine

verwaltet:

- Buffs
- Debuffs
- Schilde
- Nachwirkungen
- Trigger

Renderer

stellt ausschließlich dar.

Keine Spiellogik.

---

# Nicht Bestandteil des MVP

Kein PvP

Keine Mehrfachgegner

Keine Beschwörungen

Keine Flächeneffekte

Keine Meta-Progression

Keine Daily Runs

---

# Combat Design Regeln

Jeder neue Zauber muss:

- sofort verständlich sein
- sofortigen Impact besitzen
- eine eindeutige Fantasy erfüllen
- mit anderen Schulen kombinierbar sein
- nicht ausschließlich Vorbereitung sein

---

# Definition of Done

Das Kampfsystem ist fertig, wenn:

✓ Ein kompletter 12-Kämpfe-Run spielbar ist

✓ Alle 36 Zauber funktionieren

✓ Alle Gegner funktionieren

✓ Signature-Erholung funktioniert

✓ Belohnungssystem funktioniert

✓ Drag & Drop funktioniert

✓ Sieg und Niederlage funktionieren

Erst danach beginnt das eigentliche Balancing.
