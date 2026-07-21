# BattleMages -- Architecture & Design Audit

**Datum:** 2026-07-21
**Anlass:** Vor einer größeren Weiterentwicklungsphase (neue Systeme/Content)
**Rolle:** Lead Game Designer + Software Architect + Technical Director + UX Designer + Reviewer
**Workflow:** `docs/workflows/BattleMages_Architecture_Design_Audit_Workflow.md`
**Methode:** Vollständige Lektüre von Code (`src/`, `data/`, `tools/`), allen Docs
(`docs/`, inkl. `docs/design/*`, `docs/archive/*`, `docs/specs/*`) und `CLAUDE.md`.
Keine Dateien verändert, keine Lösungen implementiert.

---

## Status-Update (2026-07-21): Tatsächlicher Umsetzungsstand

Dieser Abschnitt existiert, weil "erledigt" im Verlauf der Umsetzung für zwei
unterschiedliche Dinge benutzt wurde. Hier sauber getrennt, damit das nicht wieder
verwischt.

### 1. Tatsächlich umgesetzt und verifiziert (Code/Doku geändert, getestet)

- Doku-Kennzeichnung veralteter Docs (22 Dateien)
- Kampfformel-Regressionstests (`tools/test_combat_formula.js`, 16 Tests)
- RV-Messung in `tools/balance_sim.py`
- Timeout/Unentschieden-Ausgang für den 50-Runden-Cap
- Mechanik-Dispatch: 866 Zeilen toter Code aus `spellRegistry.js` entfernt
- Legacy-Vokabular-Sweep (inkl. echtem Bugfix in `renderer.js`)
- Breitere Testabdeckung (`test_enemy_engine.js`, `test_reward_system.js`,
  `test_upgrade_resolver.js` -- 86 Tests gesamt über 4 Suiten)

Diese Punkte sind abgeschlossen. Nichts davon wartet noch auf weitere Arbeit.

### 2. Analysiert und entschieden, Umsetzung steht noch aus

- **Spellbook-Tiefenbalance**: Diagnose + Prioritätsempfehlung fertig (siehe
  Vertiefungs-Audit oben), aber **kein neuer Zauber gebaut**. Das ist Content-Arbeit
  für die anstehende Entwicklungsphase (siehe "Empfehlung für die Content-Phase"
  unten).
- **Build-Archetyp**: Richtung entschieden (Option B, unsichtbare
  Reward-Gewichtung), aber **nicht implementiert** -- bewusst zurückgestellt bis
  (a) die Content-Welle sich beruhigt hat und (b) der nächste Playtest ansteht.
- **Runenharmonie/Schattenmantel**: Drei Richtungsoptionen aufgezeigt, aber
  **keine umgesetzt** -- wartet auf eine Design-Entscheidung (siehe unten: jetzt
  eingeplant für die Content-Phase).

### 3. Blockiert auf externe Faktoren, nicht begonnen

- Sound (wartet auf Ressourcen)
- `combat_log_frame`, `combat_feedback_frame`, Icon-v1→v2-Rollout,
  UI-9-Slice-Asset-Pass (warten auf neue Bild-Generierung, nicht selbst erzeugbar)

---

## Empfehlung für die Content-Phase (Lead-Designer-Perspektive, 2026-07-21)

Kein weiterer breiter Audit vor der Content-Phase -- abnehmender Grenznutzen nach
diesem bereits sehr umfassenden Durchlauf. Eine gezielte Tooling-Lücke aber vor
Content-Start schließen:

**Phase 0 -- Fundament (vor dem ersten neuen Zauber)**
1. ✅ **Erledigt (2026-07-21)**: `tools/simulate_full_builds.js` -- Node-Simulator,
   der die **echte** Engine (`spellEngine.js`, `enemyEngine.js`, `battleManager.js`)
   per `vm`-Sandbox laedt und ausfuehrt (keine Python-Zweitimplementierung, keine
   Drift-Gefahr). Setzt echte 5-Zauber-Rotationen inkl. Rang/Pfad, ruft die
   unveraenderte `simulateFight()` auf, extrahiert RV aus der zurueckgegebenen
   `actionQueue` (unvollstaendige Schlussrunde bei Tod ausgeschlossen, bei
   Rundenlimit-Timeout alle Runden gezaehlt -- Logik isoliert gegen eine
   handgebaute Test-Queue verifiziert). Demo-Läufe mit Monoschule-Builds aller
   6 Schulen über 3 Rang-Stufen (1 / 3+Pfad A / 5+Pfad A), je 50 Versuche x 12
   Gegner:
   - RV steigt in **jedem** Build monoton mit dem Rang (Fortschritts-System
     funktioniert wie intendiert).
   - **Verbotene Runenkunst** (Schild-Monoschule) bleibt selbst bei Rang 5 klar
     unter dem Zielband (RV ~112 vs. 160--190) -- bestätigt unabhängig und mit
     voller Rotation den bereits aus Sprint F bekannten Befund
     "Schild-Decks sind vor Reward-Boost unviable", diesmal mit echtem
     5-Zauber-Rang-5-Build statt nur Startern.
   - **Wichtiger Vorbehalt zu Chaosmagie/Seelenmagie**: ihre RV-Werte sind
     wegen der strukturell kürzeren "Rotation" (3 bzw. 4 statt 5 Zauber, damit
     auch weniger Gegner-Gegenangriffe pro Runde) **nicht direkt vergleichbar**
     mit den anderen Schulen -- die Zahlen wirken dadurch künstlich kompetitiv.
     Verstärkt eher den bereits bekannten Spellbook-Tiefenbefund, als ihn zu
     entkräften.
2. ✅ **Erledigt (2026-07-21)**: `docs/design/BattleMages_Spell_Authoring_Checklist.md`
   -- Pflichtfelder, feste Vokabulare (Schulen/Rollen/Mechanik-Tags/Build-
   Archetypen), Effekt-IDs, VFX-/Icon-Zuordnung, Tooltip-Konvention,
   Validierungs-Checkliste nach dem Anlegen. Bewusst **ohne** eigene
   `values`-Vokabelliste -- verweist stattdessen auf `combatFormula.js`/
   `spellEngine.js` als einzige Quelle, um nicht dieselbe Art Duplikat zu
   erzeugen, die gerade erst als 866 Zeilen toter Code entfernt wurde. Kurzer
   Verweis dazu in `CLAUDE.md` ergänzt (Abschnitt "Design neuer Zauber").

**Phase 1 -- Content**
3. Chaosmagie zuerst: mindestens 1 Generator + 1 Finisher (kleinste,
   strukturell unvollständigste Schule).
4. Seelenmagie: 1 Generator ergänzen, oder bewusst als "nur im Multischule-Build
   spielbar" dokumentieren (passt zu ihrer Fantasy "Mechaniken verbinden").
5. Runenharmonie/Schattenmantel-Differenzierung in diesem Zug mit erledigen --
   dieselbe Art Arbeit wie neue Zauber designen, kein separater Termin nötig.
6. Jeden neuen Zauber sofort gegen die erweiterte RV-Messung validieren, nicht
   erst am Ende des gesamten Batches.

**Phase 2 -- Danach**
7. Nächster echter Playtest-Durchlauf.
8. Erst dann Build-Archetyp Option B angehen (Trigger-Bedingung erfüllt).
9. Testsuite parallel mitwachsen lassen -- neue Mechaniken bekommen neue Tests
   direkt beim Bauen, nicht als Nachgang.

**Phase 1, erster Schritt (2026-07-21): ✅ Entropie (Chaosmagie-Generator) gebaut.**
Erster neuer Zauber der Content-Phase, Prozess: Bestandsaufnahme der drei
bestehenden Chaos-Zauber → 3 Konzept-Optionen vorgelegt → Option "Funkenschild"
(Schild-Generator, füttert Chaoskatalysators Schild-zu-Schaden-Umwandlung) vom
Nutzer gewählt, Name auf "Entropie" verfeinert (bricht bewusst mit dem
"Chaos-"Präfix) → Zahlen nach Budget-System ausgearbeitet und vom Nutzer
freigegeben → in `data/spellbookPart2.js`, `data/spellUpgradeProfiles.js`,
`data/vfx/spellVfxDefinitions.js` (`SPELL_PROJECTILE_TYPES`) eingetragen.
Rolle Generator, `build: "schildkanone"` (teilt sich das Build-Tag bewusst mit
Chaoskatalysator), zwei Pfade ("Verdichtung" = Schild-Ausbau, "Implosion" =
Krit-Ausbau -- bewusst *nicht* die Verwundbar+Krit-Pfadwahl der übrigen drei
Chaos-Zauber wiederholt). Validiert: `validate_data.py` (36 Zauber, keine
fehlenden Pflichtfelder), `validate_icons.py` (Icon fehlt erwartungsgemäß,
Nutzer ergänzt es), `validate_vfx_assets.py` (`all_ok: true`),
`test_combat_formula.js` (16/16 weiterhin grün, keine neue Formel-Mechanik
nötig), `simulate_full_builds.js` (Chaosmagie-Build auf 4/5 Zauber erweitert:
RV bei Rang 5 von 189.5 auf 209.0 gestiegen, jetzt zwischen "Durchschnittlich"
und "Synergisch" -- spürbare Verbesserung ohne Überziehen). Fehlt noch: Icon
(Nutzer ergänzt).

**Phase 1, zweiter Schritt (2026-07-22): ✅ Überladung (Chaosmagie-Finisher) gebaut,
inkl. echter Design-Iteration durch die Simulation.** Erster Entwurf (`deal_shield_damage`
pur) zeigte in `simulate_full_builds.js` mit vollständiger 5/5-Rotation einen
**niedrigeren** RV (158.4) als die vorherige 4/5-Rotation (209.0) -- Ursache: der
Effekt bricht komplett ab, wenn der Schild bei 0 liegt (auch der Fixschaden-Anteil),
und der Gegner schlägt nach *jedem* Spieler-Zauber einmal zurück, sodass der von
Entropie erzeugte Schild bis zum letzten Rotationsslot oft schon aufgebraucht war.
Positionstest (Überladung direkt nach Entropie statt am Ende) linderte das nur
teilweise (RV 180.0). Lösung: `effects: ["gain_shield", "deal_shield_damage"]` --
der Zauber erzeugt jetzt einen garantierten Mindestschild und verbraucht ihn im
selben Zug, wodurch immer ein Mindestschaden entsteht, unabhängig von der
Rotationsposition. Zahlen dafür leicht nach unten angepasst (Reliability-Trade-off).
Ergebnis nach dem Fix: RV 205.5 (Slot 5) bzw. 180.4 (direkt nach Entropie) --
Positionsabhängigkeit praktisch verschwunden, beide Werte solide im/nahe am
Zielband. Chaosmagie hat damit erstmals eine vollständige, funktionierende
5-Zauber-Monoschule-Rotation mit allen Kernrollen (Generator/Verstärker/
Build-Enabler/Finisher). Validiert: `validate_data.py` (37 Zauber), `validate_icons.py`
(2 Icons fehlen erwartungsgemäß -- Entropie, Überladung), `validate_vfx_assets.py`
(`all_ok: true`), `test_combat_formula.js` (16/16), `simulate_full_builds.js`
(mehrere Rotationspositionen getestet).

**Phase 1, dritter Schritt (2026-07-22): ✅ Seelenmagie geprüft -- kein Generator/
Finisher ergänzt, stattdessen ein Common-Verstärker.** Bestandsaufnahme der vier
bestehenden Zauber ergab ein klares, durchgängiges Muster: jeder Zauber verbindet
zwei Mechaniken (Schaden↔Schild, Verwundbar→Schild, Verwundbar→Krit) -- passt exakt
zur Fantasy "Mechaniken verbinden". Empfehlung: **kein** Generator/Finisher ergänzen,
da das fehlende Rollen-Set (anders als bei Chaosmagie) eine logische Konsequenz der
Multischule-/Connector-Identität ist, kein Versehen. Stattdessen "Seelenwache"
(Common, Verstärker, Krit→Schild, schließt eine bisher ungenutzte Verbindung
innerhalb der Schule) ergänzt, u. a. um die Common-Rarity-Dünnheit zu lindern.
Pfad B nutzt bewusst die bisher komplett ungenutzte Sequenz-Nebenmechanik der
Schule (`sequenceTrigger: "after_protection"`) statt erneut Verwundbar+Krit zu
wiederholen. Empirisch mit `simulate_full_builds.js` bestätigt: Seelenmagie pur
(Monoschule) bleibt schwach (Rang 1: 2 % Sieg, RV 56.5; Rang 5: 46 % Sieg, RV 188.2),
aber ein einziger getauschter Zauber (Biomantie-Generator für Verwundbar-Zugriff)
hebt Rang 1 auf 21 % Sieg und Rang 5 auf 69 % Sieg / RV 221.8 (Band "Synergisch")
-- klarer empirischer Beleg, dass die Schule genau wie vorgesehen funktioniert und
keinen eigenen Generator/Finisher braucht. Validiert: `validate_data.py`
(38 Zauber), `validate_icons.py` (3 Icons insgesamt fehlen erwartungsgemäß),
`validate_vfx_assets.py` (`all_ok: true`), `test_combat_formula.js` (16/16).
✅ **Nachgetragen (2026-07-22)**: Seelenmagies Multischule-Identität ist jetzt
formal in `Combat_Identity_Matrix.md` (mit den Messwerten) und als
allgemeine Regel in der Spell-Authoring-Checkliste (neuer Abschnitt 0:
"Braucht die Schule wirklich eine neue Rolle?") festgehalten.

**Bugfix (2026-07-22, nutzergemeldet): Schild-Anzeige auf der HP-Leiste
unsichtbar bei voller/nahezu voller HP.** Nutzer berichtete einen Spielerbericht
("Schild verschwindet direkt nach dem Casten"). Ursache gefunden: Die
Schild-Leiste (`updateHpBar` in `renderer.js`) versuchte, über die HP-Füllung
hinauszuragen, begrenzt auf 100 % der Leistenbreite -- bei voller HP (Start
jedes Kampfes) blieb dafür kein sichtbarer Platz, obwohl der Schild-Wert
mechanisch korrekt gesetzt war (`applyPlayerShield` selbst war nie betroffen).
Betraf Spieler- *und* Gegner-Leiste gleichermaßen (gleiche Funktion). Fix:
Schild wird jetzt als Overlay auf der *sichtbaren* HP-Füllung gezeichnet
(angedockt an deren rechten Rand, dort wo der nächste Treffer zuerst ansetzt)
statt als Verlängerung darüber hinaus -- funktioniert dadurch auch bei
vollständig ungedeckeltem Schild-Wert. Geändert: `src/renderer.js`
(`updateHpBar`-Formel), `style.css` (`.shield-fill` z-index ueber `.hp-fill`
angehoben, beide Vorkommen). Verifiziert: Formel von Hand gegen mehrere Fälle
durchgerechnet (kein Schild / kleiner Schild bei voller HP / sättigender
großer Schild / Schild bei halber HP), Syntaxcheck grün, keine doppelte
Leisten-Logik anderswo gefunden. **Nicht** visuell im Browser bestätigt --
in dieser Umgebung weder `chromium-cli` noch Playwright verfügbar; Nutzer
sollte es im Spiel gegenprüfen.

**Drei Folge-Bugfixes (2026-07-22, aus eigenem Playtest nach obigem Fix
gemeldet):** beim Gegentesten des Schild-Anzeige-Fixes drei weitere,
unabhängige Probleme in der Kampf-Choreografie/VFX-Schicht gefunden und
behoben.

1. **Schild reduzierte sich, bevor die Gegneranimation durchlief.** Ursache:
   `applyEnemyDamageToPlayer` (`src/enemyEngine.js`) loggte einen komplett
   vom Schild absorbierten Gegnerangriff (`damageTaken === 0`) mit
   `type: "shield"` und **ohne** `impact`-Feld. `getCombatMomentFlow`
   (`renderer.js`) wertet ein leeres `impact` als "kein Impact" und
   überspringt dafür komplett die Wartezeit auf die Impact-VFX -- der
   Schildbalken aktualisierte sich dadurch nach nur 260 ms, ohne dass
   überhaupt eine Gegner-Angriffsanimation lief. Fix: beide Fälle (Restschaden
   durchgekommen / komplett absorbiert) laufen jetzt über eine gemeinsame
   `addCombatAction`-Stelle mit `type: "enemyAttack"` und stets gesetztem
   `impact` (`-0` bei vollständiger Absorption) -- dadurch greift derselbe
   VFX-Wartepfad wie bei echtem Schaden, inklusive korrektem Impact-Ziel
   (vorher hätte der generische `"shield"`-Zweig bei Gegner-Actor fälschlich
   "enemy" statt "player" als Ziel geliefert -- ein zweiter, kleinerer Bug an
   derselben Stelle). Nebeneffekt: Combat-Log-Farbe für diesen Eintrag wechselt
   von "shield"- zu "enemy"-Stil; Feedback-Popup zeigt bei Vollabsorption keinen
   Text mehr ("Angriff absorbiert"), sondern wie bei jedem Gegnerangriff nur
   noch Aktionsname + Impact-Zahl "-0" (bestehende Konvention, vom Nutzer
   abgesegnet). Verifiziert: Ad-hoc-Check über den vm-Sandbox-Testaufbau (voll
   absorbiert/teilweise absorbiert/kein Schild), `test_enemy_engine.js` 28/28,
   `test_combat_formula.js` 16/16, `simulate_full_builds.js` unverändert
   plausibel.
2. **Cast-Animation lief doppelt bei Zaubern mit mehreren Effekten** (z. B.
   Schaden + Schild). Ursache: jeder Eintrag im `effects[]`-Array eines
   Zaubers erzeugt einen eigenen `actionQueue`-Eintrag (`spellEngine.js`);
   `createCombatMoments` (`renderer.js`) mappt das 1:1 auf eigene Momente ohne
   Merging, jeder Moment löst unabhängig die volle Cast→Projektil→Impact-VFX
   aus. Fix: neue Erkennung `isContinuationOfSameSpellCast` in
   `src/vfx/combatVfxAdapter.js` -- folgt ein Moment direkt auf einen Moment
   desselben Zaubers, wird die Cast-Phase (Beschwörungs-Flash) übersprungen
   (`skipCast`-Option durch `src/vfx/effectManager.js` und den
   Fallback-Delay-Schätzer durchgereicht). Nebeneffekt (bewusst mitgenommen,
   vom Nutzer abgesegnet): greift auch bei Mehrfachtreffer-/Folgetreffer-
   Zaubern -- Cast-Flash läuft dort jetzt ebenfalls nur beim ersten Treffer,
   konsistent mit der bereits bestehenden verkürzten Folgetreffer-Pacing-Logik.
   Verifiziert: `node --check` auf allen drei geänderten Dateien, Codepfad von
   Hand nachverfolgt. **Nicht** visuell im Browser bestätigt (hängt an
   PixiJS/DOM) -- Nutzer sollte gezielt einen Schild+Schaden-Zauber (Entropie,
   Überladung) im Spiel gegenprüfen.
3. **Unsaubere Sprite-Ränder bei praktisch allen Cast-Animationen** (Rest des
   Nachbar-Frames sichtbar, meist rechts, gelegentlich versetzt). Ursache:
   `tools/generate_school_vfx_manifests.py` packt alle Frames eines Sheets
   lückenlos aneinander (Frame N endet exakt dort, wo Frame N+1 beginnt); beim
   Rendern mit nicht-ganzzahligem Downscale (z. B. `displaySize: 230` auf
   `frameW: 256`) tastet die GPU an dieser gemeinsamen Kante vereinzelt Pixel
   des Nachbar-Frames mit ab. Fix: `build_frames()` zieht jeden Frame jetzt
   symmetrisch um 3 px nach innen (`STRIP_PAD`), alle 30 Manifeste + `data/
   vfx/schoolVfxAssets.js` neu generiert (`py tools/
   generate_school_vfx_manifests.py`). Verifiziert: Diff-Stichprobe zeigt
   erwarteten 6 px-Sicherheitsabstand zwischen Frames, kleinster betroffener
   Frame sheet-weit 58 px (unauffälliger Verlust), `validate_vfx_assets.py`
   weiterhin `"all_ok": true`, `node --check` grün. Nebenbei: Generator-Skript
   brauchte `numpy`/`Pillow`, lokal per `pip install` nachinstalliert (fehlten
   in dieser Python-Umgebung). **Nicht** visuell im Browser bestätigt.

**Parallel, unabhängig vom Content-Fortschritt:** Sound (sobald Ressourcen da
sind, günstigster Pfad zuerst) und UI-Kunst-Pass (9-Slice, geparkte Assets,
Icon-v2) -- blockieren nichts von oben, können jederzeit einschieben.

---

## Baseline-Klärung (vor dem Audit mit dem Team abgestimmt)

Es existieren zwei nicht kompatible Doku-Generationen:

- **Nummerierte Docs** `docs/00_Project.md` … `docs/07_Enemies.md` (+ `docs/spells/*.md`, `docs/archive/*`)
- **`docs/design/*_v2`/`_v3`-Serie** (`Combat_Formula_v2`, `Combat_Identity_Matrix_v1.0`,
  `Enemy_Design_Document_v3`, `Spell_Budget_Review_v2`, `Reward_System_v2`, VFX-Docs)

Verifiziert gegen den tatsächlichen Code (nicht nur gegen andere Docs):

| Datenpunkt | Nummerierte Docs | `design/*_v2/v3` | Code | Ergebnis |
|---|---|---|---|---|
| Spieler-HP | 100 (`01_Combat.md`) | 120 (`Combat_Formula_v2.md`) | `PLAYER_START_HP = 120` | design/v2 ✅ |
| Schadens-Framework | Small/Standard/Strong/Signature, 8/12/16/24 (`05_Balance.md`) | Generator/Motor/Build-Enabler, Budget-System (`Combat_Formula_v2.md`, `Spell_Budget_Review_v2.md`) | `bone_fracture` = 30 Schaden, matcht exakt `Spell_Budget_Review_v2` | design/v2 ✅ |
| Gegner-Roster | 12 andere Namen, komplett anderes Rollenkonzept (`07_Enemies.md`) | 12 Karten mit exakten Passiv-/Actionbar-Werten (`Enemy_Design_Document_v3.md`) | `data/enemies.js`-IDs matchen v3 1:1 | design/v3 ✅ |
| Design-Philosophie | Schulen als Kern (`00_Project.md`) | "Kein Spiel über Zauberschulen, sondern über Build-Archetypen" | `SPELL_ROLES`/`BUILD_ARCHETYPES` in `data/combatIdentity.js` matchen die Matrix-Taxonomie | design/v2 ✅ |

**Konsequenz für diesen Audit:** `docs/design/*_v2/v3` + tatsächlicher Code sind die Baseline-Wahrheit.
Die nummerierte Serie 00–07 (und `docs/spells/*`, `docs/archive/*`) wird als **veralteter,
vollständig abgelöster Snapshot** behandelt und nur einmal (Abschnitt 5 + Roadmap) als eigener
Befund geführt, statt an jeder Einzelstelle wiederholt zu werden.

---

## 1. Architecture Review

### Stärken

- **Simulate-then-Replay**: `battleManager.js` simuliert einen Kampf vollständig synchron zu
  einer `actionQueue`; `renderer.js` spielt sie danach zeitgesteuert ab. Kampf-Mathematik hat
  dadurch keinerlei Abhängigkeit von Timing/Animation -- ein seltener, sehr sauberer
  Architekturentscheid für ein Projekt dieser Größe.
- **Konsequente Daten/Logik-Trennung**: `data/*.js` = ausschließlich Objekt-/Array-Literale,
  `src/*.js` = ausschließlich Funktionen. Wird über das gesamte Projekt eingehalten.
- **VFX-Schicht ist echt additiv**: Kampflogik hat null Abhängigkeit vom Rendering; der
  `combatVfxAdapter` fällt bei Timeout auf eigene Fallback-Timings zurück, sodass ein kaputter
  Sprite die Gameplay-Pacing nie blockiert.
- **Deklarative Regelsysteme** für Gegner-Passive (`matchesPassiveRule`/`resolvePassiveEffect`)
  und Zauber-Vorbereitungseffekte vermeiden hardcodierte Pro-Entity-Branches im Regelfall.
- **Datengetriebene Icon-/Portrait-Auflösung** über ID + Ordner-Mapping, kein Pro-Entity-Sonderfall.

### Schwächen

- **Kein Build-System, globaler Script-Scope**: Korrektheit hängt an der `<script>`-Reihenfolge
  in `index.html`. Konkret beobachtbar: `getSpellRankValues` ist in `spellRegistry.js` **und**
  `upgradeResolver.js` unterschiedlich definiert; welche Version gilt, entscheidet allein die
  Ladereihenfolge -- unsichtbar für jeden, der nur eine der beiden Dateien liest.
- **Keine automatisierten Tests** (`**/*.test.js`, `**/test/**` -- beide leer). Die einzige
  Absicherung ist manuelles Playtesting plus `tools/balance_sim.py` (statistische Simulation) und
  Struktur-Validatoren (`validate_data.py`, `validate_icons.py`, `validate_vfx_assets.py`). Keiner
  davon prüft, ob die Kampfformel selbst (Krit, Verwundbar-Multiplikator, Schildmitigation)
  tatsächlich das tut, was sie soll.
- **Mechanik-Dispatch über verteilte if-Ketten**: Ein Effekt (`deal_damage`, `apply_vulnerable`, ...)
  wird in mindestens vier Dateien einzeln behandelt (`spellEngine.js`, `enemyEngine.js`,
  `spellRegistry.js`-Tooltip-Generator, `upgradeResolver.js`s `getUpgradeChangeLines`). Ein neues
  Mechanik braucht vier synchron gepflegte Stellen, nichts erzwingt das.
- **`DEV_MODE_ENABLED = true` per Default**, keine Build-seitige Abschaltung -- ein Release-Build
  ist aktuell "merke dich, das Flag umzudrehen und vier Script-Tags zu entfernen".
- **50-Runden-Hardcap** in `simulateFight` ohne eigenen Timeout/Draw-Ausgang -- meldet bei
  `playerHp > 0` einen Sieg, auch wenn der Gegner nicht besiegt wurde. Seltener, aber echter
  Korrektheitsrand für defensive/Stall-Builds.

### Risiken

Mit dem Ziel "100+ Zauber" (explizit als Skalierungsziel in `effectPresets.js` kommentiert)
verschärft sich sowohl das Duplikat-/Ladereihenfolge-Risiko als auch die Wartungslast der
verteilten if-Ketten. Ohne Tests werden Regressionen ausschließlich durch menschliches Playtesting
gefunden -- das skaliert nicht mit wachsendem Content.

---

## 2. Gameplay & Game Design Review

*(Systeme bewertet, keine Einzelzahlen.)*

### Stärken

- Die Design-Dokumente (`Combat_Formula_v2`, `Combat_Identity_Matrix`, `Spell_Budget_Review_v2`,
  `Enemy_Design_Document_v3`) bilden untereinander ein **konsistentes, durchdachtes System**
  (Rollen, Mechaniken, Sequenzregeln, Rotationswert-Ziele greifen ineinander) -- ungewöhnlich
  reif für ein Indie-Projekt dieser Größe.
- `SPELL_ROLES` und die Schul-Mechanik-Zuordnung in `data/combatIdentity.js` setzen die
  Design-Taxonomie **exakt** um.
- Reward-System (`Reward_System_v2.md`) ist ein Positivbeispiel: 55/45-Split, 1,5x
  Schul-Affinität, Start-Rang-Tabelle, "kein Soft-Guarantee beim Reroll" -- **alles** im Code
  1:1 nachvollziehbar, keine Abweichung gefunden.
- Gegnerdesign (v3) ist 1:1 im Code umgesetzt (12/12 Encounter), "jeder Kampf testet genau einen
  Build-Aspekt" ist ein klares, konsequent durchgehaltenes Rückgrat.

### Schwächen

- **Größte Lücke des gesamten Audits**: Die zentrale, in `Combat_Identity_Matrix.md` explizit als
  Kernidentität formulierte Aussage "BattleMages ist ein Spiel über Build-Archetypen" wird von
  keinem einzigen Code-Pfad ausgewertet. `BUILD_ARCHETYPES` ist inerte Metadaten; Reward-Gewichtung
  kennt nur Schule/Rarity, keine Archetyp-Vollständigkeit; keine UI zeigt "du baust gerade Richtung
  Archetyp X". Die selbst erklärte Kernidentität des Spiels ist aktuell Wunschbild, nicht Realität
  -- bereits mit dir als bewusstes Langfristziel bestätigt (`CLAUDE.md`), aber der Abstand
  zwischen Anspruch und Umsetzung ist größer, als eine einzelne CLAUDE.md-Zeile vermuten lässt.
- **Rotation Value (RV)** -- die eigentliche quantitative Grundlage der ganzen Balance-Philosophie
  (Ø 160--190, synergisch 220--260, perfekt 300--360 Schaden) -- wird von **keinem Tool**
  gemessen. `tools/balance_sim.py` enthält keine RV-Berechnung. "Approved"-Status der Balance-Docs
  beruht auf manueller Einschätzung, nicht auf Messung.
- Bereits von Sprint F diagnostiziert und **weiterhin offen**: Runenharmonie/Schattenmantel fühlen
  sich fantasy-identisch an -- verletzt direkt die explizite Designregel "Support-Zauber dürfen
  niemals nur schlechtere Versionen anderer Zauber sein."
- Uneinheitliche Zauberzahl pro Schule (aus früherer Analyse: 3--9 je Schule) steht im Spannungsfeld
  zur Regel "Jeder Build braucht mindestens: Generator, Verstärker, Finisher" -- dünn besetzte
  Schulen könnten strukturell Mühe haben, alle drei Rollen anzubieten.

### Risiken

Wächst der Spellbook-Umfang weiter, ohne dass RV messbar gemacht wird, driftet die Balance
zunehmend auf Gefühlsbasis. Die Build-Archetyp-Lücke bedeutet: neues Content-Design hat aktuell
keinen Prüfmechanismus dafür, ob es tatsächlich zur erklärten Kernidentität beiträgt.

---

## 3. UI / UX Review

### Stärken

- Tooltip-Überarbeitung (Sprint G3) hat Struktur vereinheitlicht (Icon→Name→Rarity→Schule→
  Beschreibung→Werte→Pfad), Rang-/Typ-Badge-Unordnung aus Starter-Auswahl/Tooltip entfernt.
- Fantasy-UI-CSS-Pass (Sprint G4) etabliert ein kohärentes Stein/Bronze-Farbsystem über
  CSS-Custom-Properties (wartbar), entfernt Glassmorphism/pulsierendes Glühen, das dem
  "uralte Artefakte"-Ton widersprach.
- Portrait-System (G5) hat eine saubere, datengetriebene Fallback-Kette ohne Pro-Gegner-Sonderfälle.
- Der Playtest-Feedback-Loop funktioniert nachweislich: 16 getrackte Punkte (F-01--F-16), fast alle
  gelöst -- echter iterativer UX-Prozess, kein einmaliger Durchlauf.

### Schwächen

- **Drei UI-Assets seit 2026-07-08 "geparkt"** (`combat_log_frame`, `combat_feedback_frame`,
  `rarity_frames`) mit ungeklärten Konzeptfragen -- genau die Flächen, die "verstehe ich sofort,
  was gerade passiert" betreffen (Kampflog-Lesbarkeit, Rarity-Erkennbarkeit), nicht Dekoration.
- Sprint G4 selbst attestiert: Material wirkt "noch synthetisch" (wiederholende CSS-Gradients,
  keine echte Textur), der nächste qualitative Sprung braucht echte 9-Slice-Assets. Das Team weiß
  bereits, dass die aktuelle UI ein Platzhalter-Plateau ist, keine fertige visuelle Messlatte.
- `getSpellTooltipSections`/`getUpgradeChangeLines` interpretieren händisch ~70 mögliche
  Value-Keys in Text -- trotz der Designregel "Tooltips bleiben kurz" ist die zugrundeliegende
  Formatierungslogik bereits jetzt eine aufwendige, ad-hoc gepflegte Übersetzungsschicht, getrennt
  von der eigentlichen Formel.
- Keine automatisierte UI-Absicherung (siehe Architecture -- keine Tests im Projekt).

---

## 4. VFX / Art Pipeline Review

*(Ergänzt die gerade abgeschlossene VFX-Migration dieser Session.)*

### Stärken

- Das Schul-Sheet-Modell (1 Cast + 1 Impact + 3 Projektiltyp-Sheets je Schule, 30 Sheets gesamt)
  ist ein sauberes, bereits realisiertes, skalierbares Produktionssystem für alle 6 Schulen.
- Additiv zur Kampflogik, Pooling für Partikel, robustes WebGL-Fehler-Fallback
  (`disableVfxRendering`).
- Jetzt durch `tools/validate_vfx_assets.py` gegen künftigen Preset-/Datei-Drift abgesichert.

### Schwächen

- **Sound ist komplett nicht implementiert** (`soundBridge.js` ist ein bewusster No-Op-Stub). Für
  ein kommerzielles Release ist das Fehlen von Audio wahrscheinlich der größte
  wahrgenommene Qualitätsabstand -- größer als jede verbleibende visuelle Politur.
- Der generische "projectile"-Typ (klassisches fliegendes Geschoss) hat für ~7 Zauber weiterhin
  kein eigenes Sprite, fällt auf einen prozeduralen Platzhalter zurück.
- Icon-v1→v2-Vereinfachung wurde bisher nur für eine Schule (Biomantie) durchgeführt -- unklar,
  ob die übrigen 5 Schulen dieselbe Qualitätsstufe noch brauchen.

### Risiken

Sound ist eine echte Projektentscheidung wert (eigenproduziert? lizenziert? Asset-Store?) und
steht aktuell in keiner Roadmap.

---

## 5. Documentation Review

Zentraler Befund bereits oben (Baseline-Klärung): die **komplette nummerierte Doku-Serie
`docs/00_Project.md` -- `docs/07_Enemies.md`** ist ein vollständig abgelöster Snapshot, ohne
jede Kennzeichnung. Konkret veraltet: `00_Project.md` (Fast-Leerstelle), `01_Combat.md`
(100 HP vs. echte 120), `05_Balance.md` (inkompatibles Schadensklassen-System vs. tatsächliches
Budget-System), `06_Spells.md` + `docs/spells/*.md` (Zauberanzahl-/Identitäts-Drift, bereits in
`CLAUDE.md` vermerkt), `07_Enemies.md` (100 % andere Gegnernamen, soeben verifiziert).
`docs/archive/*` wurde von Sprint G selbst bereits als "verwirrend neben docs/design/" markiert
und nie bereinigt.

Das ist ein systemisches Risiko: README's eigene "Maßgebliche Dokumente"-Leseliste verweist zuerst
auf genau diese veraltete Serie. Jeder (Mensch oder KI), der dieser Leseliste folgt, baut sich ein
komplett falsches Bild des Spiels auf.

Positiv-Gegenbeispiel: `BattleMages_VFX_Library.md`/`_Production_Plan_v2.md`/`_Style_Guide.md`
wurden in dieser Session exakt auf diesen Zustand hin korrigiert -- dasselbe Muster sollte auf die
nummerierte Serie angewendet werden.

---

## 6. Code Quality Review

- `getSpellRankValues` doppelt definiert (`spellRegistry.js`/`upgradeResolver.js`),
  Ladereihenfolge entscheidet unsichtbar, welche gilt.
- `hasPlayerStatus` doppelt (`battleManager.js`/`combatStatus.js`), identische Logik.
- `toRoman` vs. `romanize` (`utils.js`) -- zwei fast identische Konverter, einer davon vestigial.
- `getPlayerStatusViews()`/`getEnemyBuffViews()` geben permanent `[]` zurück -- UI-Plumbing
  existiert, wird nie befüllt (laut Sprint-Kontext vermutlich bewusst reduziert, aber nicht
  dokumentiert).
- `isRunicCombination()` -- von Sprint G selbst als einzige verbleibende Ausnahme vom
  "datengetrieben, keine Hardcodierung"-Prinzip benannt.
- Mechanik-Dispatch über vier verteilte if-Ketten (siehe Architecture).

Keiner dieser Punkte ist aktuell ein aktiver Bug -- alle sind latentes Wartungsrisiko, das mit
wachsendem Umfang teurer wird.

---

## 7. Project Maturity

| Reif/produktionsbereit | Fühlt sich wie Prototyp an | Braucht weitere Design-Runde |
|---|---|---|
| Kampfkern (battleManager/combatFormula/spellEngine/enemyEngine) | Sound (schlicht nicht vorhanden) | Doku-Hierarchie (nummeriert vs. design/) |
| Reward-System | Build-Archetyp-System (Daten da, ungenutzt) | Balance-Instrumentierung (RV ungemessen) |
| VFX-Sprite-Pipeline (nach Migration) | 3 geparkte UI-Assets | Runenharmonie/Schattenmantel-Fantasy-Überschneidung |
| Portrait-System | Icon-v2-Pass (nur 1/6 Schulen) | |
| Tooltip-/UI-Textpass | | |

---

## 8. Risks

- **Technisch**: keine Tests + ladereihenfolge-fragile Duplikate = Regressionen werden erst spät,
  nur durch Playtesting sichtbar -- verschärft sich mit dem Skalierungsziel 100+ Zauber.
- **Design**: Build-Archetyp-Identität -- die selbst erklärte Kernidentität des Spiels -- ist
  nirgends messbar oder erzwungen. Größte philosophisch-technische Lücke im gesamten Audit.
- **Pipeline**: Sound komplett unadressiert; UI-Asset-Generierung hat ein wiederkehrendes,
  nie diagnostiziertes Auflösungs-Mismatch-Problem (aus der VFX-Migration bekannt), das künftige
  Asset-Produktion weiter verzögern wird.
- **Doku/Langfristpflege**: veraltete nummerierte Docs führen aktiv in die Irre, solange README's
  Leseliste sie zuerst nennt.

---

## 9. Quick Wins

Hoher Impact, geringer Aufwand, geringes Risiko:

- Einzeiliger Status-Hinweis ("SUPERSEDED -- siehe docs/design/X") oben in jedem veralteten
  nummerierten Dokument (00, 01, 05, 06, 07 + `docs/spells/*`, `docs/archive/*`). Nahezu
  aufwandsfrei, behebt das größte Doku-Risiko sofort, ohne Volltext-Überarbeitung.
- `tools/balance_sim.py` um eine RV-Ausgabe je simuliertem Build gegenüber den Zielbändern aus
  `Combat_Formula_v2.md` erweitern -- Simulator und Zielwerte existieren bereits beide, sie sind
  nur nicht verbunden.
- `getSpellRankValues`-Duplikat auflösen (bereits exakt diagnostiziert, isolierte Änderung).
- README's "Maßgebliche Dokumente"-Leseliste auf die `design/`-Serie umstellen.

---

## 10. Roadmap

### P0 -- Blockers

| Beschreibung | Nutzen | Aufwand | Risiko | Begründung |
|---|---|---|---|---|
| ✅ **Erledigt (2026-07-21)** Veraltete nummerierte Docs als "superseded" kennzeichnen (oder Nützliches nach `design/` übernehmen, Rest archivieren) | 5 | 1 | 1 | Führt aktiv in die Irre, solange README zuerst darauf verweist; Aufwand minimal. Umgesetzt: 22 Dateien (`00`–`07`, `docs/spells/*`, `docs/archive/*`) mit `STATUS: SUPERSEDED`-Hinweis + Verweis auf das jeweils maßgebliche Dokument versehen. |
| ✅ **Erledigt (2026-07-21)** Minimale Regressionstests für `combatFormula.js`-Kernfunktionen (Krit, Verwundbar-Multiplikator, Schildmitigation) | 5 | 2 | 1 | Mathematischer Kern des gesamten Verkaufsarguments hat aktuell null automatisierten Schutz. Umgesetzt: `tools/test_combat_formula.js` (Node `vm`-Sandbox, kein Test-Framework, passend zur Build-losen Architektur). 16/16 Tests laufen erfolgreich (`node tools/test_combat_formula.js`). |

### P1 -- High Priority

| Beschreibung | Nutzen | Aufwand | Risiko | Begründung |
|---|---|---|---|---|
| ✅ **Erledigt (2026-07-21)** RV-Messung in `balance_sim.py` gegen die Zielbänder aus `Combat_Formula_v2.md` verdrahten | 4 | 2 | 1 | Macht eine bereits existierende Designaussage erstmals überprüfbar. **Wichtiger Vorbehalt**: `balance_sim.py` modelliert nur 3-Zauber-Starter-Rotationen ohne Upgrades, nicht die vollen 5-Zauber-Endgame-Rotationen, für die die Zielbänder eigentlich gedacht sind -- Ergebnis ist eine Baseline für Starter-Builds, keine vollständige Validierung. Ergebnis (300 Trials, seed 42): nur `burst` (173.1) liegt im Band "Durchschnittlicher Build" (160--190); `krit` (156.2), `verwundbar` (150.9), `hybrid` (143.6), `sequenz` (107.2) liegen darunter; `schild` (0.5) praktisch bei null -- bestätigt unabhängig den bereits aus Sprint F bekannten Befund "Schild-Starter unviable bis reward-geboostet". Folgeaufwand für echte 5-Zauber/Upgrade-Abdeckung wäre ein größerer, separater Task. |
| Build-Archetyp-Lücke: Richtung entschieden (Vertiefungs-Audit, 2026-07-21) -- Archetypen bleiben rein intern/nicht spielersichtbar (waren ein Design-Werkzeug zur Prüfung der Build-Vielfalt, keine geplante UI-Funktion); Option B (unsichtbare, archetyp-bewusste Reward-Gewichtung, analog zum bestehenden Schul-Affinitäts-Multiplikator) ist die bevorzugte Richtung, aber **bewusst zurückgestellt** bis (a) die laufende große Content-/System-Phase sich beruhigt hat und (b) der nächste echte Playtest-Durchlauf ansteht; zusätzlich abhängig von der noch offenen Spellbook-Tiefenbalance je Schule | 5 | 3 (wenn fällig) | 2 | Klärt den Nordstern des Designs, ohne gegen ein bewegliches Ziel zu kalibrieren; Umsetzung erst sinnvoll, wenn Spellbook stabil ist und Playtesting ansteht |
| Sound-Umfang entscheiden und minimal umsetzen (zumindest Cast-/Hit-Stingers) -- **bewusst zurückgestellt (2026-07-21)**: aktuell keine Ressourcen für Erstellung/Suche von Sound-Assets. Optionen für später: (a) CC0-Bibliotheken (kein Budget, nur Sichtungsaufwand), (b) gekaufte Asset-Packs (kleines Budget, kuratierter), (c) beauftragte/eigene Produktion (höchster Aufwand, einzigartiger Sound). Technische Anbindung ist vorbereitet: `soundBridge.js` ruft `sound.cast`/`projectile`/`impact` bereits an den richtigen Timeline-Stellen auf -- der Aufwand steckt im Beschaffen der Dateien, nicht in der Integration. | 5 | 4 | 2 | Aktuell eine komplette Lücke in einem sonst release-nahen Spiel; Umsetzung wartet auf Ressourcen, nicht auf eine Design-Entscheidung |
| Runenharmonie/Schattenmantel-Fantasy-Überschneidung auflösen -- **bewusst zurückgestellt (2026-07-21)**: nach genauerer Prüfung ist Aufwand/Risiko höher als hier ursprünglich angesetzt (echte Design-Entscheidung, keine reine Code-Änderung: beide Zauber sind auf Rang 1 mechanisch identisch -- 30 Schaden + 20 Schild bei Krit). Drei Richtungsoptionen für später notiert: (a) Mechanik entlang der Schul-Identität trennen (Runenharmonie -> Schild-Aufbau, Schattenmantel -> reiner Krit-Payoff), (b) nur Rang 1 differenzieren und den bereits divergierenden Rang-2+-Ausbau als ausreichend akzeptieren, (c) einen der beiden komplett aus der Schild+Krit-Kombination herauslösen. Keine akute Dringlichkeit -- am besten im Rahmen der anstehenden Content-Phase mitentscheiden. | 3 | 3 (echte Design-Entscheidung, nicht nur Code) | 1 | Named, bereits diagnostizierte Verletzung einer expliziten Designregel; Umsetzung wartet auf eine Design-Richtung von dir, nicht auf Implementierungsaufwand |

### P2 -- Medium Priority

| Beschreibung | Nutzen | Aufwand | Risiko | Begründung |
|---|---|---|---|---|
| ✅ **Erledigt (2026-07-21), anders als geplant** Mechanik-Dispatch: statt Konsolidierung wurde die eigentliche Ursache entfernt -- `spellRegistry.js` enthielt eine ~500-Zeilen-Funktion (`getSpellTooltipSections`) plus Helper, die per Aufruf-Kette bis auf null Aufrufer zurückverfolgt zu 100 % totem Code war (legacy Momentum/Echo/Blutrausch/Traumparadoxon-Vokabular, das kein aktueller Zauber mehr setzt), und `getUpgradeChangeLines` war zu ~95 % tot (nur `damage`/`shield` von ~40 geprüften Keys je aktiv). Gesamt 866 Zeilen entfernt (1214 → 348 Zeilen, verifiziert: 0 verbleibende Referenzen projektweit, Node-Syntaxcheck grün, alle 16 Formeltests weiterhin grün). Damit ist die eigentliche Duplikation (Tooltip-Logik musste jede Mechanik der Formel-Logik nachbilden) komplett verschwunden -- Tooltips laufen ausschließlich über handgeschriebene Texte. Verbleibende Dispatch-Stellen (`spellEngine.js` 7 Branches, `enemyEngine.js` 4+5 Branches) sind klein, domänengetrennt und bewusst **nicht** weiter konsolidiert -- Risiko/Nutzen spricht dagegen, seit die eigentliche Duplikation weg ist. | 3 | 3 | 2 | Neue Mechanik brauchte vorher vier Anlaufpunkte, davon zwei jetzt komplett entfallen |
| Die 4 geparkten UI-Assets (combat_log_frame, combat_feedback_frame, rarity_frames, corner_ornaments) konzeptionell klären | 3 | 3 | 1 | Betrifft Kern-Lesbarkeit, nicht Dekoration. **rarity_frames (2026-07-21): entschieden, bleibt wie ist.** Aktuelle CSS-Lösung (Rahmenfarbe + Text-Label `[Rarity]`) entspricht bereits der "Karten-Akzent"-Variante und funktioniert; illustriertes Asset ist ohnehin falsch dimensioniert/konzipiert und wird mit dem P3-UI-9-Slice-Pass gebündelt statt isoliert verfolgt. `combat_log_frame`/`combat_feedback_frame` bleiben blockiert (neue Asset-Generierung nötig, externer Schritt). `corner_ornaments` noch offen. |
| Icon-v1→v2-Vereinfachung auf die übrigen 5 Schulen ausweiten | 2 | 3 | 1 | Konsistenz-Lücke, kein Blocker |
| ✅ **Erledigt (2026-07-21)** Echten "Timeout"-Ausgang für den 50-Runden-Cap ergänzen | 2 | 1 | 1 | Seltener, aber realer Korrektheitsrand. Als Niederlage gewertet (simpelste Lösung, keine neue UI nötig): `src/battleManager.js`, `victory: context.playerHp > 0 && context.enemyHp <= 0` statt nur `context.playerHp > 0`. Verifiziert, dass beide Defeat-Anzeigen (`renderCombatOutcome`, `renderCombatOutcomeOverlay`) generischen Text ohne HP-Annahme zeigen. |

### P3 -- Long-Term Vision

| Beschreibung | Nutzen | Aufwand | Risiko | Begründung |
|---|---|---|---|---|
| Echter UI-9-Slice-Asset-Pass (von Sprint G4 selbst als "nächster qualitativer Sprung" benannt) | 4 | 4 | 2 | Größte verbleibende visuelle Qualitätsstufe |
| ✅ **Erledigt (2026-07-21)** Breitere automatisierte Testabdeckung (Gegner-Passive, Reward-Gewichtung, Upgrade-Auflösung) | 4 | 4 | 2 | Baut auf den P0-Basistests auf. Umgesetzt nach demselben Muster wie `test_combat_formula.js` (Node-`vm`-Sandbox, kein Framework): `tools/test_enemy_engine.js` (28 Tests: `matchesPassiveRule`, `resolvePassiveEffect`, `cycleBossSchool`, `modifyIncomingPlayerDamage`, Heal-Deckelung), `tools/test_reward_system.js` (23 Tests: Raritäts-/Rang-Gewichtsbänder, Schul-Affinität, Wound-Setup-Abwertung, 55/45-Split via gemocktem `Math.random`), `tools/test_upgrade_resolver.js` (19 Tests: vollständiger Rang-/Pfad-Wertverlauf gegen den echten `shadow_mantle`-Zauber, Merge-Helper, Upgrade-Art-Bestimmung). Alle Erwartungswerte von Hand gegen die echte Implementierung nachgerechnet; ein Testfixture-Fehler (Schul-Überschneidung bei einem Wound-Enabler-Test) beim ersten Lauf gefangen und korrigiert. Gesamt 86/86 Tests grün, alle 4 Suiten + vollständiger Syntaxcheck aller `src/`/`data/`-Dateien final verifiziert. |
| Formale Bewertung eines Build-Systems (ES-Module o.ä.), falls der Codebase weiter Richtung 100+ Zauber wächst | 3 | 5 | 3 | Noch nicht dringend, aber der globale Script-Tag-Scope hat eine Skalierungsgrenze |

---

## Empfohlene Abarbeitungsreihenfolge

Kein striktes Entweder-Oder zwischen "Roadmap abarbeiten" und "erst die drei
Vertiefungs-Audits durchführen":

1.  **Sofort, unabhängig von allem:** die beiden P0-Punkte (Doku-Kennzeichnung,
    Formel-Tests). Billig, ohne Abhängigkeiten, schaffen ein Sicherheitsnetz.
2.  **Vor dem Rest der Roadmap: die drei Vertiefungs-Audits unten.** Zwei der
    vier P1-Punkte ("Build-Archetyp-Lücke auflösen", "Sound-Umfang
    entscheiden") sind faktisch genau diese Vertiefungsthemen, nur als
    einzeilige Tickets getarnt. Sie als simple "Entscheidung treffen +
    umsetzen"-Punkte abzuarbeiten würde dem Projektprinzip widersprechen
    (Fantasy/Konzept vor Zahlen, keine Annahmen bei fehlenden Informationen)
    -- und sie bestimmen maßgeblich, wonach die nächste Entwicklungsphase
    überhaupt ausgerichtet werden soll, was der explizite Anlass dieses
    Audits ist.
3.  **Kann parallel weiterlaufen, ohne zu warten:** alle P1--P3-Punkte, die
    nicht von den drei großen Fragen abhängen (Runenharmonie/Schattenmantel-
    Fix, RV-Messung verdrahten, geparkte UI-Assets, Dispatch-Konsolidierung,
    Icon-v2-Rollout, Timeout/Unentschieden-Fix, UI-9-Slice-Pass, breitere
    Testabdeckung).
4.  **Danach:** Erkenntnisse der drei Vertiefungs-Audits mit dem
    unverbrauchten Rest dieser Roadmap zu einer einzigen, konsolidierten
    Roadmap zusammenführen -- die drei Audits werden voraussichtlich selbst
    neue P0--P3-Punkte produzieren.

---

## Vertiefungs-Audit: Spellbook-Tiefenbalance je Schule (2026-07-21)

**Methode:** Alle 35 Zauber (`data/spellbookCore.js` + `data/spellbookPart2.js`) nach Schule,
`role` (`SPELL_ROLES`) und `rarity` ausgewertet.

| Schule | Zauber | Generator | Verstärker | Finisher | Build-Enabler | Common | Rare | Epic |
|---|---|---|---|---|---|---|---|---|
| Biomantie (blood) | 5 | 1 | 3 | 0 | 1 | 3 | 2 | 0 |
| Schatten (shadow) | 7 | 1 | 2 | **1** | 3 | 2 | 3 | 2 |
| Psionik (dream) | 7 | 1 | 5 | 0 | 1 | 3 | 4 | 0 |
| Verbotene Runenkunst (rune) | 9 | 1 | 5 | 0 | 3 | 3 | 6 | 0 |
| Chaosmagie (star) | 3 | **0** | 2 | 0 | 1 | 1 | 1 | 1 |
| Seelenmagie (primal) | 4 | **0** | 4 | 0 | 0 | 1 | 3 | 0 |
| **Gesamt** | 35 | 4 | 21 | **1** | 9 | 13 | 19 | 3 |

### Befunde

1.  **"Finisher" ist praktisch eine Phantom-Rolle.** Nur 1/35 Zauber (`death_stroke`, Schatten)
    trägt `role: "finisher"`. 5 von 6 Schulen haben null Finisher-Zauber. Die explizite
    Designregel (`Combat_Identity_Matrix.md`, Regel 7: "Jeder Build braucht mindestens: einen
    Generator, einen Verstärker, einen Finisher") ist für eine Monoschule-Build außerhalb von
    Schatten strukturell nicht erfüllbar.
2.  **Chaosmagie und Seelenmagie sind für Monoschule-Spiel unvollständig** -- beide ohne
    Generator und ohne Finisher, nur Verstärker/Build-Enabler. Chaosmagie ist mit 3 Zaubern
    zugleich die kleinste Schule. Bei Seelenmagie evtl. beabsichtigt (eigene Fantasy laut Matrix:
    "Mechaniken verbinden", also eher Multischule als Solo) -- bei Chaosmagie ("Hoher Druck,
    kontrolliertes Risiko") liest sich das eher wie eine echte Lücke, kein Designziel.
3.  **Rarity-Skew verstärkt das Problem:** beide dünnsten Schulen haben je nur 1 Common-Zauber
    -- erklärt konkret einen Teil des bereits bekannten Playtest-Befunds F-15 ("zu wenige
    Commons im Starter-Pool").
4.  Die fünfte Rolle `utility` (`SPELL_ROLES`) wird von keinem einzigen Zauber verwendet --
    ähnlich der Build-Archetypen eine definierte, aber ungenutzte Kategorie.

### Gegengewicht

Schatten (7 Zauber, einzige Schule mit allen drei Kernrollen) und Runenkunst (9 Zauber) sind
strukturell solide. Die Schlagseite Richtung Verstärker (21/35) passt grundsätzlich zur
Rotations-/Kombo-Designphilosophie -- Finisher als seltene, wertvolle Auszahlungs-Rolle zu
halten kann teilweise beabsichtigt sein, aber 1/35 wirkt zu knapp, um als gleichwertige dritte
Kernrolle zu tragen.

### Empfehlung für die anstehende Content-Phase

Bei neuen Zaubern priorisieren: (1) Chaosmagie zuerst um Generator und idealerweise einen
Finisher ergänzen -- kleinste und strukturell unvollständigste Schule; (2) Seelenmagie auf
Generator prüfen, falls Monoschule-Spielbarkeit gewünscht ist (sonst als bewusste
Multischule-Schule dokumentieren, siehe `docs/design/BattleMages_Combat_Identity_Matrix_v1.0.md`);
(3) Finisher-Rolle generell breiter besetzen, nicht zwingend symmetrisch pro Schule, aber über
mehr als eine einzige Schule hinweg.

---

## Vertiefungskandidaten (nicht mehr Teil dieses Audits)

Folgende Themen wurden identifiziert, aber laut Workflow-Vorgabe nicht tiefer untersucht, da sie
einen eigenen fokussierten Audit rechtfertigen würden:

- ~~**Build-Archetyp-Implementierung**~~ -- erledigt, siehe P1-Roadmap-Zeile (Richtung
  entschieden: Option B, bewusst zurückgestellt).
- ~~**Spellbook-Tiefenbalance je Schule**~~ -- erledigt, siehe Abschnitt oben.
- **Sound-Konzept**: Umfang, Stil, Produktionsweg -- eigenes Thema, berührt Budget/Zeitplan.
  Erfordert eine Entscheidung von dir (Budget/Ressourcen), keine reine Code-/Datenanalyse.
