# BattleMages — Spielinhalte-Optimierung (Backlog)

> Auftrag (2026-07-28): tiefgehende Analyse, welche zusätzlichen
> Funktionen/Mechaniken/Inhalte BattleMages noch fehlen könnten, um die
> Spielerexperience zu optimieren. Reine Backlog-Aufnahme in diesem
> Schritt — die eigentliche Analyse ist noch nicht durchgeführt.

## Auftrag im Wortlaut

„Optimierung der Spielinhalte — tiefgehende Analyse, welche
Funktionen/Mechaniken/Inhalte wir noch zum Spiel hinzufügen können, um
die Spielerexperience zu optimieren."

Bewusst breiter gefasst als die bisherigen Einzel-Backlogs (UI-Umfang,
Animation/Feedback, Spellpool) — hier geht es nicht um eine einzelne
bereits identifizierte Lücke, sondern um einen neuen, ergebnisoffenen
Rundumblick auf das gesamte Spiel: welche Systeme fehlen komplett,
welche bestehenden Systeme sind unterentwickelt, wo hat das Spiel noch
spürbar "wenig Inhalt".

## Bereits bekannte, verwandte offene Fäden (nicht neu, aber relevanter Kontext)

Diese Punkte wurden in früheren Analysen bereits identifiziert und
bewusst zurückgestellt — die neue Analyse sollte sie erneut bewerten,
statt sie zu wiederholen oder zu ignorieren:

- ~~**Sustain-Archetyp**~~ — **umgesetzt (2026-08-16)**, siehe
  `BattleMages_Spellpool_Backlog.md`, Slot 1 (dortiger Status
  aktualisiert). Zwei neue Zauber (`soul_anchor`/Seelenanker,
  `soul_theft`/Seelenraub, `data/spellbookPart5.js`), erste
  Verwendung von `healPlayer()` (`combatFormula.js`, vorher toter
  Code).
- **Kosmetik-Schicht** (`BattleMages_Meta_Progression_Concept_v1.md`):
  als Meta-Progression-Baustein konzipiert, zurückgestellt bis
  Asset-Verfügbarkeit.
- **Option B — unsichtbare Archetyp-Reward-Gewichtung**
  (`[[project_build_archetype_decision]]`, siehe Memory): bevorzugte
  Langfrist-Richtung, bewusst noch nicht implementiert.
- **Herausforderungs-Modifikatoren** (`BattleMages_Meta_Progression_Concept_v1.md`):
  als möglicher weiterer Meta-Progression-Baustein erwähnt, nie
  vertieft.
- **Charakterauswahl/-Customization** (`BattleMages_UI_Umfang_Backlog.md`,
  "Bewusst zurückgestellt"): explizit für später vorgemerkt, kleinerer
  Umfang als volle Customization.
- **Drei Gegner mit abweichender Passiv-Architektur** (#3/#6/#9,
  `BattleMages_Balancing_Sprint_2026-07-28.md`): kein Balance-Problem,
  aber ein Hinweis auf uneinheitliche Gegner-Tiefe, der bei einer
  Inhalts-Analyse mitgedacht werden sollte.

## Status

Reine Backlog-Aufnahme (2026-07-28). Analyse steht noch aus — Umfang,
Methode und Ergebnis folgen dem CLAUDE.md-Standard-Workflow (Analyse →
Rückfragen → Lösungsmöglichkeiten → Empfehlung → Freigabe), sobald
dieser Punkt aktiv bearbeitet wird.
