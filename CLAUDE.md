# CLAUDE.md — BattleMages

Projektanleitung für die Zusammenarbeit mit Claude Code an BattleMages.
Ergänzt (nicht ersetzt) die bestehenden Docs unter `docs/`.

## Projektüberblick

BattleMages ist ein rundenbasiertes 1v1-Browser-Roguelite. Ein Run besteht
aus 12 Kämpfen (8 normal, 3 Elite, 1 Boss). Der Spieler stellt eine feste
5-Zauber-Rotation zusammen, die im Kampf automatisch abgespielt wird —
kein Mana, keine Aktionspunkte, kein klassisches Cooldown-System
("Die Rotation IST der Cooldown"). Nach jedem Sieg: 3 Belohnungskarten,
eine wird gewählt.

Ausführliches Game Design: `docs/01_Combat.md`, `docs/02_Gameplay.md`,
`docs/05_Balance.md`, `docs/06_Spells.md`, `docs/07_Enemies.md`.
**Achtung Aktualität**: siehe Abschnitt "Quellenhierarchie" unten.

## Core Design Philosophy

BattleMages ist kein Spiel über Zauberschulen. Zauberschulen liefern Fantasy.
Build-Archetypen liefern Gameplay. Ein neuer Zauber wird niemals danach
bewertet, ob er zur Schule passt, sondern ob er einen interessanten Build
eröffnet oder einen bestehenden verbessert.

Jeder Zauber muss den Spieler auf genau eine interessante Frage bringen
(Referenz: `docs/design/BattleMages_Combat_Identity_Matrix_v1.0.md`):

- Welche Frage erzeugt dieser Zauber?
- Welche Build-Entscheidung eröffnet er?

Gameplay entsteht durch: Rollen, Mechaniken, Build-Archetypen, Sequenzen.
Fantasy entsteht durch: Name, Animation, Icon, Tooltip, VFX.

Neue Systeme dürfen nur eingeführt werden, wenn sie das Spiel vereinfachen
oder bestehende Systeme sinnvoll ersetzen. Komplexität darf niemals
Selbstzweck sein.

**Hinweis zum Status**: Build-Archetypen sind ein bewusstes Langfristziel
und Designprinzip — sie definieren die Design-/Balance-Identität des
Spiels und sind Leitlinie für neue Zauber und Systeme. Der Code wertet
`BUILD_ARCHETYPES`/`spell.build` (`data/combatIdentity.js`) heute noch
nicht vollständig aus. Als Designprinzip nutzen, nicht als technische
Wahrheit — nicht annehmen, dass sie aktuell bereits Gameplay beeinflussen.

## Technische Architektur

- **Kein Build-System.** Reines HTML/CSS/JS, `index.html` lädt ~50
  `<script>`-Tags in fester Reihenfolge in einem gemeinsamen globalen
  Scope. Kein `type="module"`, kein Bundler, kein npm.
- **Ladereihenfolge ist bedeutsam**: Daten (`data/*.js`) → Engine
  (`src/*.js`) → PixiJS + `src/vfx/*` (additive Schicht, rührt
  Kampflogik nicht an) → `src/dev/*` → `src/game.js` (Einstiegspunkt,
  letzter Aufruf `showHomeScreen()`).
- **Simulate-then-Replay**: `battleManager.js` simuliert einen Kampf
  vollständig synchron zu einer `actionQueue` (keine DOM-Berührung,
  keine Zeit-/Animationslogik). `renderer.js` spielt diese Queue danach
  per `setTimeout`-Choreografie ab. Kampf-Mathematik ist damit komplett
  unabhängig von Timing/Animation — bei Formel-Änderungen niemals
  Timing-Code in `battleManager.js`/`spellEngine.js`/`combatFormula.js`
  einbauen.
- **Daten/Logik-Trennung strikt einhalten**: `data/*.js` enthält
  ausschließlich Objekt-/Array-Literale, `src/*.js` ausschließlich
  Funktionen. Neue Zauber/Gegner/Upgrades sind Daten, nicht Code.
- **State**: `src/state.js` hält nur 4 globale Variablen, kein
  Persistieren (Run geht bei Reload verloren — das ist aktueller Stand,
  nicht notwendigerweise gewollt, im Zweifel nachfragen).

### Modul-Landkarte

| Bereich | Dateien |
|---|---|
| Kampf-Orchestrierung | `battleManager.js`, `combatContext.js`, `combatSequence.js`, `combatPrep.js`, `combatStatus.js` |
| Kampfformeln | `combatFormula.js` (reine Mathematik) + `data/combatIdentity.js` (Vokabular: Schulen, Rollen, Archetypen) |
| Zauber | `spellEngine.js` (Ausführung), `spellRegistry.js` (Aufbereitung/Tooltips), `upgradeResolver.js` (Rang/Pfad-Auflösung), `data/spellbookCore.js` + `spellbookPart2.js` + `spellUpgradeProfiles.js` |
| Gegner | `enemyEngine.js` (deklarative Passiv-Regeln, feste Aktionsleiste), `enemyRegistry.js`, `data/enemies.js` |
| Belohnungen | `rewardSystem.js` |
| Rendering | `renderer.js` (einziger DOM-Layer, String-Templates + `innerHTML`), `portraitRegistry.js` |
| VFX (additiv) | `src/vfx/*` (PixiJS-Stack), `data/vfx/*` (Presets/Definitionen), `assets/effects/*` |
| Dev-Tools | `src/dev/*`, per F9 oder `window.BattleMagesDev` |

### Bekannte Stolperfallen im Code

- `getSpellRankValues` existiert **doppelt** (`spellRegistry.js` und
  `upgradeResolver.js`) mit unterschiedlichem Verhalten — die spät
  geladene Version aus `upgradeResolver.js` gewinnt durch Ladereihenfolge.
  Bei Änderungen an Rang-/Pfad-Logik beide Stellen prüfen.
- `getPlayerStatusViews()`/`getEnemyBuffViews()` in `battleManager.js`
  geben immer `[]` zurück — UI-Anbindung für Spieler-Status/Gegner-Buffs
  ist verdrahtet, aber nie befüllt. Vor Erweiterung klären, ob das
  bewusst reduziert ist.
- Drei unabhängige Schul-Namens-Tabellen müssen synchron gehalten
  werden: `VFX_SCHOOL_ID_MAP` (`data/vfx/schoolVfxAssets.js`,
  auto-generiert), das Schema in `tools/validate_icons.py`, und
  `COMBAT_SCHOOLS` (`data/combatIdentity.js`). Bei neuen Schulen/IDs
  alle drei anfassen.
- `DEV_MODE_ENABLED` (`src/dev/devConfig.js`) ist standardmäßig `true`,
  es gibt keine Build-seitige Abschaltung für Releases — manuell im
  Blick behalten.

## Game-Design-Prinzipien

- **Balance-Reihenfolge**: Fantasy → Hook → Mechanik → Timing →
  Visualisierung → **Zahlen zuletzt**. Nach einer Niederlage soll der
  Spieler denken "ich probiere einen anderen Build", nicht "der Zauber
  ist zu schwach".
- **Balancing-Ebene**: Balancing erfolgt auf Ebene kompletter Rotationen,
  nicht auf Ebene einzelner Karten oder einzelner Zahlen. Synergie ist
  wichtiger als Rohstärke.
- **Enemies skalieren über Mechanik, nicht über rohe Zahlen.** Normal =
  ein klares Gimmick, Elite = kombinierte Mechaniken, Boss = testet den
  gesamten Build, nie einfach nur mehr HP.
- **Kein Zufall in der Gegner-KI**: Gegner spulen eine feste
  Aktionsleiste ab, keine Entscheidungslogik. Überraschung entsteht
  über deklarative Passiv-Regeln (Trigger-Bedingungen), nicht über RNG.
- **6 Magieschulen**, intern über kurze IDs (`blood/shadow/dream/rune/
  star/primal`), nach außen (Icons, VFX, Fantasy-Namen) als Biomantie/
  Schatten/Psionik/Verbotene Runenkunst/Chaosmagie/Seelenmagie geführt.
  Mapping-Tabelle: `data/combatIdentity.js` (`COMBAT_SCHOOLS`).

## Design neuer Zauber

Jeder neue Zauber wird anhand dieser festen Checkliste vorgestellt:

- **Fantasy:** …
- **Build:** …
- **Rolle:** …
- Welche Mechanik unterstützt er?
- Welchen bestehenden Build verbessert er?
- Welchen neuen Build eröffnet er?
- Welche anderen Zauber synergieren mit ihm?
- Warum ersetzt er keine bestehende Karte?
- Welche interessante Entscheidung erzeugt er?

Diese Liste ist die kreative/konzeptionelle Seite. Für die technische Seite
(Pflichtfelder, Vokabulare, VFX-/Icon-Zuordnung, Validierung nach dem
Anlegen) siehe `docs/design/BattleMages_Spell_Authoring_Checklist.md`.

## Quellenhierarchie bei Konflikten

- **Zauber/Schulen**: `data/spellbookCore.js` + `data/spellbookPart2.js`
  + `data/combatIdentity.js` sind maßgeblich, **nicht** `docs/06_Spells.md`
  / `docs/spells/*.md` / `docs/archive/*`. Diese Docs sind bestätigt
  veraltet (Zauberanzahl pro Schule, Schul-Identitäten).
- **VFX-Bibliotheksstand**: `docs/design/BattleMages_VFX_Library.md` und
  `..._Production_Plan_v2.md` beschreiben nur den alten Ein-Zauber-
  Pilotstand; der tatsächliche Code deckt bereits alle 6 Schulen ab.
  Migration/Doku-Abgleich läuft.
- Bei **jedem weiteren** Doku-vs-Code-Widerspruch: nicht raten, welche
  Seite stimmt — im Zweifel nachfragen.

## Regeln für die Zusammenarbeit

- **Nichts ohne Rücksprache verändern, wenn eine Inkonsistenz auffällt.**
  Doku-vs-Code-Widersprüche, toter/duplizierter Code, veraltete
  Referenzen: explizit benennen und auf Entscheidung warten, nicht
  selbständig "reparieren" oder stillschweigend um sie herumarbeiten.
- Vor größeren Änderungen: technischen Plan vorschlagen und auf
  Freigabe warten (siehe `DEVELOPMENT_RULES.md` /
  `docs/04_Development_Rules.md`).
- Nicht mehrere große Systeme gleichzeitig anfassen.
- **"Sauber vor schnell."** Keine neuen Zauber, Mechaniken, Ressourcen
  oder Balance-Werte erfinden — das ist Game-Design-Hoheit, nicht
  Implementierungsdetail.
- Architekturprinzipien respektieren: Renderer fasst keine Gameplay-
  Logik an, Spell Engine fasst kein DOM an, keine Magic Numbers (Werte
  kommen aus `data/*.js`), Funktionen möglichst ~50 Zeilen.
- Code-Bezeichner/Kommentare Englisch, In-Game-Texte und UI-Strings
  Deutsch — bestehende Konvention beibehalten.
- Nach jeder größeren Änderung:
  - tote Imports prüfen
  - ungenutzte Funktionen suchen
  - doppelte Logik suchen
  - Dokumentation prüfen
  - Regressionen nennen
- Eine Aufgabe gilt erst als abgeschlossen wenn:
  - Code implementiert
  - Dokumentation aktualisiert
  - keine Konsolenfehler
  - keine toten Referenzen
  - Architektur weiterhin eingehalten
  - Zusammenfassung geschrieben
- Standard-Workflow:
  1. Analyse
  2. Rückfragen
  3. Lösungsmöglichkeiten
  4. Empfehlung
  5. Freigabe
  6. Umsetzung
  7. Selbstreview
  8. Dokumentation
  9. Zusammenfassung
- **Geltungsbereich des Standard-Workflow**: gilt vollständig für
  mittelgroße/große Aufgaben sowie für Änderungen an Gameplay,
  Architektur, UI, VFX, Datenstrukturen oder Design. Kleine, klar
  abgegrenzte Änderungen (Tippfehler, einzelne Textänderungen,
  offensichtliche Ein-Zeilen-Fixes) dürfen ohne den vollständigen
  Workflow umgesetzt werden. Im Zweifel nachfragen.