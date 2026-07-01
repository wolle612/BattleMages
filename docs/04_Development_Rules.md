# Battlemages – Development Rules

Version: 1.0
Status: Verbindlich

---

# Zweck

Dieses Dokument definiert die Regeln für die Entwicklung von Battlemages.

Alle Entwickler und KI-Assistenten (Cursor) müssen diese Regeln einhalten.

Bei Widersprüchen gilt folgende Priorität:

1. Development Rules
2. Technical Design
3. Combat Design
4. Gameplay Design

---

# Entwicklungsphilosophie

Battlemages wird iterativ entwickelt.

Nicht:

Große Features auf einmal.

Sondern:

Kleine, abgeschlossene Systeme.

Jede Sitzung soll genau ein Ziel besitzen.

---

# Grundprinzipien

Immer:

- einfache Lösungen bevorzugen
- kleine Module schreiben
- bestehende Architektur respektieren
- Änderungen nachvollziehbar halten

Niemals:

- unnötige Komplexität
- spontane Features
- unkontrollierte Refactorings

---

# Single Source of Truth

Die Dokumentation ist verbindlich.

Combat Design

↓

Gameplay Design

↓

Technical Design

Code folgt den Dokumenten.

Nicht umgekehrt.

---

# Gameplay-Regeln

Cursor darf niemals:

- neue Zauber erfinden
- neue Ressourcen hinzufügen
- Balancing verändern
- Regeln interpretieren
- fehlende Mechaniken ergänzen

Bei Unsicherheit:

Fragen.

Nicht raten.

---

# Architektur-Regeln

Jedes Modul besitzt genau eine Verantwortung.

Keine Datei übernimmt Aufgaben eines anderen Moduls.

Renderer

zeigt an.

Battle Manager

steuert den Kampf.

Spell Engine

berechnet Zauber.

Enemy Engine

berechnet Gegner.

Effect Engine

verwaltet Effekte.

UI

verarbeitet Eingaben.

---

# Code-Regeln

Code soll:

- lesbar
- modular
- testbar

sein.

Große Klassen vermeiden.

Große Funktionen vermeiden.

Doppelte Logik vermeiden.

Magic Numbers vermeiden.

---

# Dateiregeln

Bestehende Dateien werden nicht gelöscht.

Bestehende Dateien werden nicht umbenannt.

Neue Dateien nur dann erstellen,

wenn sie eine eigene Verantwortung besitzen.

---

# Implementierungsworkflow

Jede Aufgabe folgt derselben Reihenfolge.

## 1

Analyse

↓

## 2

Technischen Plan erstellen

↓

## 3

Betroffene Dateien nennen

↓

## 4

Auf Freigabe warten

↓

## 5

Implementieren

↓

## 6

Zusammenfassung schreiben

↓

## 7

Offene Punkte nennen

---

# Vor jeder Implementierung

Cursor beantwortet:

Welche Dateien werden geändert?

Warum?

Welche Auswirkungen entstehen?

Welche Risiken bestehen?

Erst danach beginnt die Implementierung.

---

# Nach jeder Implementierung

Cursor beantwortet:

Was wurde umgesetzt?

Welche Dateien wurden geändert?

Welche Funktionen wurden ergänzt?

Welche TODOs bleiben?

---

# Refactoring

Refactorings sind erlaubt.

Aber nur wenn:

- sie begründet werden
- keine Funktion verloren geht
- Dokumentation weiterhin stimmt

Große Refactorings niemals ungefragt.

---

# Neue Features

Neue Features werden niemals selbstständig ergänzt.

Beispiele:

Keine Animationen

Keine Sounds

Keine Tooltips

Keine Einstellungen

Keine Statistik

Wenn sie nicht ausdrücklich angefordert wurden.

---

# Dokumentation

Neue Systeme werden dokumentiert.

Bestehende Dokumente werden nicht automatisch geändert.

Nur auf ausdrückliche Anweisung.

---

# Balancing

Cursor verändert niemals:

- Schaden
- Buffwerte
- Schildwerte
- Gegnerwerte

Ohne ausdrückliche Freigabe.

---

# Fehlerbehandlung

Bei Fehlern gilt:

1.

Ursache finden.

2.

Lösung erklären.

3.

Implementieren.

Nicht:

Workarounds verstecken.

---

# Kommunikation

Cursor arbeitet transparent.

Keine versteckten Änderungen.

Keine stillen Refactorings.

Keine Vermutungen.

Immer erklären:

- Warum?
- Wie?
- Welche Folgen?

---

# Entwicklungsstil

Bevorzugen:

- kleine Commits
- kleine Module
- klare Benennung
- einfache Architektur

Vermeiden:

- riesige Dateien
- verschachtelte Bedingungen
- globale Zustände
- schwer nachvollziehbare Abhängigkeiten

---

# Definition of Done

Eine Aufgabe gilt als abgeschlossen wenn:

✓ Keine Konsolenfehler auftreten.

✓ Alle Dokumente weiterhin eingehalten werden.

✓ Keine bestehende Funktion beschädigt wurde.

✓ Der Code verständlich bleibt.

✓ Die Architektur verbessert oder mindestens erhalten wurde.

---

# Absolute Verbote

Cursor darf niemals:

❌ Gameplay verändern

❌ Dokumentation ignorieren

❌ Architektur eigenständig umbauen

❌ Dateien ohne Begründung löschen

❌ Mehrere Systeme gleichzeitig entwickeln

❌ Ungefragte Optimierungen durchführen

❌ Eigenständig neue Designentscheidungen treffen

---

# Leitsatz

Battlemages wird nicht möglichst schnell entwickelt.

Battlemages wird möglichst sauber entwickelt.

Jede Entscheidung soll das Projekt langfristig einfacher wartbar machen.

Qualität besitzt immer Vorrang vor Geschwindigkeit.