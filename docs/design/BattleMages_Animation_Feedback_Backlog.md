# BattleMages — Animation-/Feedback-Backlog

> Ergebnis der Animations-/Asset-Analyse vom 2026-07-24 (siehe
> Chat-Verlauf). Reine Analyse, bewusst zurückgestellt — Arbeit geht
> erst mit dem Spellpool-Backlog weiter, diese Liste wartet.

## Was schon gut funktioniert

Fliegende Zahlen (`floating-number`, `style.css`) sind sauber gebaut:
Pop-in-Animation, farbcodiert (Schaden rot, Heilung grün, Schild blau,
Krit gold+größer). Der Impact-VFX-Pipeline (Cast/Impact/Partikel pro
Schule) und die Portrait-Overlays für Status (Verwundbar/Schild/
Präzision, siehe Commits vom 2026-07-24) sind eine solide Grundlage.

## Kritische Lücken (mit Code-Beleg)

1. **Krit-Feedback minimal**: einziger Unterschied ist Farbe/Größe der
   fliegenden Zahl (`floating-number--crit`). Kein zusätzlicher
   Partikeleffekt, keine Kamera-Reaktion.
2. **Kamera-Shake eskaliert nie**: drei Stufen existieren im CSS
   (`battle-screen--vfx-shake-small/medium/heavy`), aber
   `effectManager.js:156` vergibt fest immer nur `"small"`.
   `medium`/`heavy` sind aktuell 100 % totes CSS.
3. **Keine Gegner-Angriffsanimation**: das Gegner-Portrait bewegt sich
   nie, auch nicht während der eigene Zauber wirkt. Nur die
   Aktionsleiste hebt die nächste Aktion hervor.
4. **Kein Treffer-Feedback am Ziel** (weder Spieler noch Gegner): kein
   Aufblitzen, kein Zittern, kein Rückstoß beim Treffer — nur Zahl,
   HP-Balken, genereller Screen-Shake, Impact-VFX.

## Referenz

Darkest Dungeon: ebenfalls statische Portraits, gilt trotzdem als
Paradebeispiel für starkes Trefferfeedback — über billige Mittel
(Weißblitz, Zittern, Kamera-Punch bei Krits), kein aufwendiges
Sprite-Rig. Passt zum heute etablierten Ansatz (reines CSS, keine
neuen Bild-Assets).

## Priorisierte Vorschläge (günstig → aufwendiger, alles ohne neue Bild-Assets)

1. **Hit-Flash**: kurzer Aufblitz-Filter aufs getroffene Portrait bei
   jedem Treffer (CSS `filter`/Keyframe-Puls).
2. **Hit-Shake/Recoil**: kleines Zittern/Zurückrucken des getroffenen
   Portraits (CSS-Transform).
3. **Krit-Eskalation nutzen**: bei Krit `medium`/`heavy`-Shake
   auslösen (Infrastruktur existiert bereits, nur nie verdrahtet) +
   evtl. kurzer Hit-Stop.
4. **Gegner-Angriffs-Lunge**: einfache Vor-/Zurück-Bewegung des
   Gegner-Portraits beim Angriff (CSS-Transform).
5. **Sieg/Niederlage-Reaktion**: besiegtes Portrait faded/kollabiert
   sichtbar statt einfach zu verschwinden.

Punkte 1-3 gelten als "fast geschenkt" — reines CSS, Punkt 3 nutzt
sogar bereits vorhandenen toten Code.

## Status

Bewusst zurückgestellt (2026-07-24) — Arbeit geht mit dem
Spellpool-Backlog weiter (`BattleMages_Spellpool_Backlog.md`).
