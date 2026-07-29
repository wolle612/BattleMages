# BattleMages — Meta-Progression-Konzept v1

> Konzeptphase (2026-07-27), Ergebnis der Analyse-/Rechercheanfrage
> "konzipiere ein Meta-Progression-System". Ergänzt/konkretisiert
> Punkt 5 aus `BattleMages_UI_Umfang_Backlog.md` ("Meta-Progression,
> bewusst nicht ausformuliert").
>
> **Schritt 1 (Persistenz-Layer + Kompendium + Statistik), Schritt 2
> (Archetyp-Tracker), Baustein D/Option A (freischaltbare Start-Zauber)
> und Baustein C (Legendary-Meilensteine) sind umgesetzt
> (2026-07-27/28)**, siehe Abschnitt "Umsetzungsstand" am Ende.
> **Baustein E (Herausforderungs-Modifikatoren) ist verworfen
> (2026-07-28)**, nicht nur zurückgestellt — siehe Abschnitt
> "Baustein E verworfen" am Ende. Damit ist die Meta-Progression-
> Roadmap vollständig abgearbeitet — offen bleibt nur der vereinbarte
> **große Balancing-Sprint** (siehe "Offene Fäden" am Ende), der vor
> einem echten Playtest ohnehin fällig gewesen wäre.

## Leitplanke (unverändert aus dem Backlog)

**Keine Power-Progression.** Meta-Fortschritt darf einen Run niemals
stärker machen als einen ohne Meta-Fortschritt — das würde die
kalibrierten Balance-Zielbänder des Kampfsystems unterlaufen. Jede
Freischaltung ist **horizontal** (mehr Auswahl/Varianz/Content) statt
**vertikal** (mehr Rohstärke).

## Warum horizontal statt vertikal

Vergleich mit dem Genre:

| Spiel | Muster | Power-Progression? |
|---|---|---|
| Slay the Spire | Karten/Reliquien schalten sich kumulativ frei ("gesehen → kann künftig erscheinen"), Ascension-Level als opt-in Zusatzschwierigkeit | Nein |
| Balatro | Joker/Voucher/Decks über konkrete Achievements, kumulative Sammlung, Stakes als opt-in Härtegrad | Nein |
| Slay the Spire 2 | Eine einzige Fortschrittsleiste (Epochen/Meilensteine) statt Einzel-Charakter-Unlocks | Nein |
| Hades | Mirror of Night — permanente Stat-Buffs zwischen Runs | Ja — funktioniert nur im Story-Rahmen; Community-Konsens: Reiz verfällt, sobald Story-Content aufgebraucht ist |
| Dead Cells | Cells kaufen Blueprints + Kosmetik | Teilweise (manche Blueprints sind Stat-Items) — gilt als schwächerer Teil des Designs |

Fazit der Recherche: Systeme, die nur die **Breite** des Pools
erweitern (nicht seine Stärke), halten die Langzeitmotivation am
längsten und laufen nicht Gefahr, bestehendes Balancing zu
unterlaufen. Das ist die Grundlage für alle Bausteine unten.

## Ist-Zustand, auf dem aufgebaut wird

- `src/persistence.js` (`localStorage`, Key `battlemages_run_v1`)
  persistiert bereits einen laufenden Run als Checkpoint — aber nur
  **einen** Run, kein run-übergreifender State.
- `data/combatIdentity.js` definiert 15 `BUILD_ARCHETYPES`, die laut
  CLAUDE.md aktuell vom Code nicht ausgewertet werden — reines
  Design-Vokabular.
- Reward-System budgetiert bis 18% "Legendary"-Rarity ab Kampf 8, der
  Zauber-Pool enthält aber 0 Legendary-Zauber (41 Zauber: 17
  Common/20 Rare/4 Epic/0 Legendary).
- Home-Screen (`showHomeScreen()`) hat aktuell keine Slots für
  Profil-/Sammlungs-/Statistik-Menüs.

## Bausteine

### A. Kompendium
Codex aller je gesehenen Zauber und Gegner, füllt sich automatisch
beim ersten Auftreten in einem Run. Kein Gameplay-Effekt — reine
Sichtbarkeit/Sammelziel für alle 41 Zauber, 12 Gegner, 6 Schulen.

### B. Archetyp-Tracker
Nutzt die bisher brachliegenden `BUILD_ARCHETYPES` erstmals aktiv:
pro abgeschlossenem Run wird rein analytisch (keine neue
Kampflogik) erkannt, welcher der 15 Archetypen anhand der finalen
Rotation am ehesten zutrifft, und als Häkchen-Liste festgehalten.
Wertet ein bestehendes, bisher rein dokumentarisches Vokabular
gameplay-nah auf, ohne Balance anzufassen.

### C. Legendary-Freischaltung via Meilenstein — UMGESETZT (2026-07-28)
Jede der 6 Schulen erhält genau einen Legendary-Zauber, der durch
einen gewonnenen Run mit reiner Mono-Schul-Rotation dieser Schule
dauerhaft in den Reward-Pool freigeschaltet wird. Details siehe
"Umsetzungsstand Baustein C" weiter unten.

### D. Alternative Start-Loadouts
Vorgefertigte 5-Zauber-Startrotationen (Rang 1, wie ein normaler
Run-Start), die je einen Archetyp anspielen. Schalten sich durch
reines Spielen frei (z.B. "3 Runs abgeschlossen"). Ändert nichts an
der Stärke, nur am Startkomfort/an der Fantasie eines Runs.

### E. Herausforderungs-Modifikatoren ("Prüfungen") — VERWORFEN (2026-07-28)
Ursprüngliche Idee: Opt-in, Ascension/Stakes-artig, Gegner-HP-Aufschlag
und/oder weniger Reward-Slots gegen sichtbare Anerkennung im
Kompendium. Verworfen nach Prüfung — Begründung siehe
"Baustein E verworfen" am Ende des Dokuments.

### F. Persistente Statistik-Seite
Gesamtzahl Runs, Siegquote, bester erreichter Fortschritt,
persönliche Bestwerte — erweitert das bestehende `runStats`-Muster
(aktuell rein präsentationsseitig pro Run) auf run-übergreifende
Werte.

Bewusst **kein** Meta-Currency/Shop-Layer als Kernidee — genau an
diesem Punkt rutschen vergleichbare Systeme (Dead Cells) am ehesten
in Power-Progression ab oder erzeugen Komplexität ohne Mehrwert.
Freischaltung läuft direkt über Meilensteine (Balatro-/
Slay-the-Spire-Muster), nicht über eine Zwischenwährung.

## Entscheidungen (bereits getroffen, 2026-07-27)

- Legendary-Freischaltung (Baustein C) ist Teil des Konzepts.
- Kosmetik-Schicht (Portraits, Hintergründe, VFX-Farbvarianten) wird
  zurückgestellt, bis regulärer Content (Sound/VFX) weiter ist —
  analog zur bestehenden Zurückstellung der Lautstärke-Kontrolle
  (Punkt 4 im UI-Backlog). Belohnungen vorerst als Text/Zahlen/
  Abzeichen, keine neuen visuellen Assets.
- Erster Umsetzungsschritt ist bewusst schlank: nur Baustein A
  (Kompendium) + F (Statistik-Seite) + der dafür nötige
  Persistenz-Layer. B, C, D, E folgen in separaten, einzeln
  freizugebenden Schritten.

## Geplante Reihenfolge

1. ✅ **Meta-Persistenz-Layer** (neuer `localStorage`-Key, getrennt von
   `battlemages_run_v1`) + **Kompendium** + **Statistik-Seite**
2. ✅ Archetyp-Tracker (Baustein B)
3. ✅ Alternative Start-Loadouts (Baustein D, als Option A umgesetzt)
4. ✅ Legendary-Meilensteine (Baustein C)
5. ~~Herausforderungs-Modifikatoren (Baustein E)~~ — verworfen, siehe unten
6. Kosmetik-Schicht (später, sobald Asset-Lage es hergibt) — einziger
   noch offener Punkt neben dem Balancing-Sprint

## Grober technischer Zuschnitt für Schritt 1

Nur zur Einordnung des Aufwands, kein finaler Plan:

- Neue Datei `src/metaProgression.js` (Logik, analog zu
  `src/persistence.js`), neuer `localStorage`-Key
  `battlemages_meta_v1`.
- Getrackte Daten: Anzahl gestarteter/abgeschlossener Runs,
  Sieg/Niederlage-Zähler, bester erreichter Kampf-Index, Set
  gesehener Zauber-IDs, Set gesehener Gegner-IDs, persönliche
  Bestwerte (höchster Einzeltreffer, längster Run, o.ä. — Basis:
  bereits vorhandenes `runStats`-Muster).
- Schreibpunkte: nach jedem `simulateFight()` (Zauber/Gegner als
  "gesehen" markieren, analog zum bestehenden `runStats`-Update),
  beim Erreichen des Recap-Screens (Run-Zähler/Bestwerte committen).
- Neue Home-Screen-Buttons "Kompendium" und "Statistik", je ein neuer
  Screen-Zustand in `renderer.js` (reine Anzeige, kein Einfluss auf
  Kampf-Flow) — Renderer bleibt bei reiner Präsentation, keine
  Gameplay-Logik im DOM-Layer.

Vor der eigentlichen Umsetzung folgt dafür noch ein regulärer
technischer Plan zur Freigabe (Standard-Workflow).

## Umsetzungsstand Schritt 1 (2026-07-27)

Wie im groben Zuschnitt oben geplant umgesetzt, mit zwei bewussten
Vereinfachungen:

- **"Gesehene Zauber"** deckt nur die Start-Rotation (`recordRunStart`,
  aufgerufen in `startRun()`, `game.js`) und die finale Rotation beim
  Run-Ende (`recordRunEnd`, aufgerufen in `showRunRecapScreen()`) ab —
  nicht jede angebotene Reward-Karte. Ein Zauber, der mid-Run
  angeboten, aber nie behalten wurde, gilt also nicht als "gesehen".
  Erweiterung auf Reward-Angebote wäre ein zusätzlicher Hook in
  `showRewardScreen()`, bewusst zurückgestellt, um Schritt 1 klein zu
  halten (siehe Rückfrage-Antwort "Schlanker Kern zuerst").
- **Home-Screen-Layout**: Kompendium/Statistik wurden nicht als
  vollwertige dritte/vierte Menü-Zeile ergänzt, sondern als kompaktes
  Button-Paar (`.home-screen-submenu`, `.home-menu-btn--compact`)
  unterhalb des Hauptmenüs. Grund: `.home-screen-menu` ist absolut
  positioniert (`top: clamp(52%, 56vh, 60%)`) auf einem `overflow:
  hidden`-Body — zwei weitere volle Buttons hätten das Menü auf
  kleineren Viewports abschneiden können. Per automatisiertem
  Browser-Test (Chrome DevTools Protocol, da kein Node/Playwright im
  Environment verfügbar war) verifiziert: Menü bleibt bei 1400×1000
  vollständig im sichtbaren Bereich.

Geänderte/neue Dateien: `src/metaProgression.js` (neu),
`index.html` (Script-Tag), `src/game.js` (drei Integrationspunkte +
zwei neue Screen-Funktionen + zwei Helper), `src/renderer.js` (zwei
neue Render-Funktionen + Home-Screen-Buttons), `style.css`
(Kompendium-Grid, kompaktes Button-Paar, Stats-Grid-Wrap).

Verifiziert per End-to-End-Browsertest (Edge headless über CDP,
localStorage über zwei Runs hinweg geprüft): leerer Zustand (alles
"???"/Nullen) → ein Kampf (Gegner im Kompendium aufgedeckt) →
vollständiger Sieg-Run bis Recap → Statistik-/Kompendium-Werte
korrekt kumuliert über mehrere Runs, keine Konsolenfehler auf dem
reellen Interaktionspfad.

## Umsetzungsstand Schritt 2 (2026-07-27) — Archetyp-Tracker

Analyse ergab eine bessere Ausgangslage als angenommen: Jeder Zauber
trägt bereits ein `build`-Feld (`data/spellbookCore.js`/
`spellbookPart2.js`), das ihn genau einem der 15 `BUILD_ARCHETYPES`
zuordnet. `classifyRotationArchetypes()` (`src/metaProgression.js`)
zählt diese `build`-Werte über die finale 5er-Rotation eines Runs
(Mehrheitsregel, min. 2 Treffer, bei Gleichstand zählen alle
führenden Archetypen), Ergebnis wird kumulativ in
`unlockedArchetypeIds` festgehalten und als drittes Kompendium-Segment
("Archetypen") angezeigt.

Zwei per Rückfrage bestätigte Abweichungen von einer reinen
Zählregel, beide aus echten Datenlücken im Zauber-Pool, nicht aus
Implementierungsentscheidungen:

- **"Sustain" ist aus der Tracker-Liste entfernt.** 0 von 41 Zaubern
  tragen `build: "sustain"` — über keine Zählregel erreichbar. Bleibt
  ein offener Faden für eine künftige Zauber-Design-Session, bewusst
  nicht mit neu erfundenen Zaubern überbrückt.
- **"Monoschule" wird strukturell geprüft** (alle 5 Rotations-Zauber
  gleiche `spell.school`), nicht über die `build`-Mehrheit — nur 1
  von 41 Zaubern trägt `build: "monoschule"`, über eine reine
  Zählregel wäre der Archetyp praktisch nie erreichbar gewesen.

Verifiziert per Browsertest: eine Rotation mit 5 `kritmaschine`-Zaubern
schaltet "Kritmaschine" frei, eine Rotation aus 5 Biomantie-Zaubern
schaltet "Monoschule" (und zusätzlich den dort mehrheitlich
vertretenen Build) frei, "Sustain" taucht im Kompendium nicht auf,
14 Kacheln insgesamt, keine Konsolenfehler.

## Korrektur an Baustein B (2026-07-27): Archetyp-Namen nie im UI

Bei der Arbeit an Baustein D fiel auf: `docs/design/BattleMages_Spell_Authoring_Checklist.md`
und eine gespeicherte Design-Entscheidung vom 2026-07-21
("project-build-archetype-decision") legen explizit fest, dass
`BUILD_ARCHETYPES`-Namen (z.B. "Kritmaschine", "Monoschule") niemals
im UI erscheinen dürfen — reines internes Design-/Balance-Werkzeug.
Die Kompendium-Archetypen-Sektion aus Baustein B zeigte diese Labels
aber direkt an, ohne das damals abzugleichen.

**Korrektur**: neue Tabelle `ARCHETYPE_COMPENDIUM_TITLES`
(`data/combatIdentity.js`, direkt unter `BUILD_ARCHETYPES`) mit 14
eigens formulierten, spielerfreundlichen Titeln (z.B. "Kettenschlächter"
statt "Verwundbar-Ketten", "Tödliche Präzision" statt "Kritmaschine").
`getCompendiumArchetypeEntries()` (`game.js`) nutzt jetzt diese Tabelle
statt `archetype.label`. `BUILD_ARCHETYPES` selbst bleibt unverändert
internes Vokabular.

## Umsetzungsstand Baustein D / Option A (2026-07-27) — freischaltbare Start-Zauber

Ursprüngliche Idee (fixe 5er-Rotations-Presets pro Archetyp) verworfen
— zu wenig eigener Mehrwert (siehe Chat-Diskussion "Vergleiche a) neue
freischaltbare Start-Zauber gegen b) Presets"). Stattdessen **Option
A**: 9 neue Zauber (`data/spellbookPart3.js`), je einer für die
Archetypen, die zuvor 0-1 startfähige Zauber hatten (`multischule`,
`verwundbar_ketten`, `one_shot`, `widerstand_krit`, `monoschule`,
`krit_verwundbar`, `sequenz`, `kontrollierter_schaden`, `hybrid`) —
`sustain` weiterhin ausgeklammert (siehe Baustein B).

- Alle 9 nutzen ausschließlich bereits implementierte
  `spellEngine.js`/`combatFormula.js`-Werte-Schlüssel, keine neue
  Engine-Logik.
- Neues Datenfeld `starterUnlockArchetype` (nur auf diesen 9 Zaubern):
  der Zauber wird startfähig, sobald `unlockedArchetypeIds` (Baustein
  B) den passenden Archetyp enthält — `isStarterEligible()` in
  `game.js` erweitert den bestehenden `getRandomStarterOffer()`-Filter
  entsprechend. Bis dahin normale Reward-Pool-Zauber wie jeder andere.
  Keine neue Zahl, keine neue Mechanik — reine Sichtbarkeits-Freischaltung.
  Der Freischalt-*Moment* bleibt bewusst ohne Archetyp-Namen: ein
  `.spell-card--new`-Badge ("NEU") auf der Auswahlkarte, sobald der
  Zauber noch nicht in `seenSpellIds` steht.
- **Schul-Design-Abgleich vor dem Bauen**: `docs/design/BattleMages_Spellpool_Backlog.md`
  zeigte eine explizite Vorentscheidung vom 24.07. gegen einen vierten
  Biomantie-Verwundbar-Zauber. Rückfrage ergab: `Wundbrand` bleibt in
  Biomantie, da es die bislang fehlende Sequenz-Hälfte des Archetyps
  abdeckt (kein Biomantie-Zauber nutzte zuvor einen Sequenz-Trigger)
  — anderer Fall als reine Wiederholung.
- ~~Rang-2-5-Aufstiegspfade bewusst ausgeklammert~~ — nachgeholt
  (2026-07-28), siehe `BattleMages_Balancing_Sprint_2026-07-28.md`,
  Abschnitt "Vollständige Rang-3-5-Pfade für die 15 neuen Zauber".
  Alle 15 Zauber haben jetzt vollwertige Pfad-Spezialisierung wie die
  41 Bestandszauber.
- Keine Icon-/VFX-Kunstwerke — Icons fallen auf die bestehende
  Buchstaben-Platzhalter-Anzeige zurück (`bindSpellIcon`), VFX-
  Projektiltypen sind gesetzt (`SPELL_PROJECTILE_TYPES`), Cast/Impact
  ergeben sich automatisch aus der Schule.

Verifiziert per Browsertest: vor jeder Freischaltung sind alle 9 aus
dem Start-Pool ausgeschlossen; nach Erreichen eines Archetyps (z.B.
Verwundbar-Ketten) wird exakt der zugehörige Zauber startfähig, sonst
keiner; Kompendium zeigt den neuen Spieler-Titel statt des internen
Labels; "NEU"-Badge erscheint korrekt; keine Konsolenfehler.

## Baustein E verworfen (2026-07-28)

Bei der Kalibrierung fiel auf, dass ein globaler Gegner-HP-Multiplikator
in dieser Engine höchst ungleichmäßig wirkt. Empirisch nachgemessen
(echte Engine im Browser nachgebildet, da `node` im Environment nicht
verfügbar war, dieselbe Logik wie `tools/simulate_full_builds.js`):
bei schwachem Baustand (Rang 1) reißt bereits +15% Gegner-HP eine
Testrotation von 35% auf 18% Siegquote, bei mittlerem Baustand (Rang 3)
bleibt dieselbe Stufe fast wirkungslos (61%→~56%), bei starkem Baustand
(Rang 5) kaum spürbar. Ursache: jeder der 12 Kämpfe ist einzeln auf
ein enges Runden-/RV-Zielband kalibriert (`Combat_Formula_v2.md`) — ein
pauschaler Aufschlag ignoriert das und trifft ungleichmäßig genau die
frühen, ohnehin knappen Kämpfe am härtesten.

Über die Kalibrierungsfrage hinaus ein grundsätzlicheres Problem:
CLAUDE.md legt explizit fest *"Enemies skalieren über Mechanik, nicht
über rohe Zahlen … nie einfach nur mehr HP"* — ein HP-basierter
Härtegrad widerspricht damit der eigenen Spielphilosophie, unabhängig
von der Dosierung. Die Alternative (Reward-Slot-Reduktion) wurde als
Haupthebel verworfen, weil sie sich nicht wie zusätzliche
Herausforderung anfühlt, sondern wie reiner Entzug von
Spielmöglichkeiten — anders als die Genre-Vorbilder (Slay the Spire
Ascension, Hades Heat), die überwiegend neue Gegner-Verhalten
hinzufügen statt Ressourcen wegzunehmen. Ein "richtiger" Härtegrad
für BattleMages bräuchte also neue deklarative Gegner-Zusatzregeln
statt eines Zahlen-Reglers — das ist derselbe Design-Aufwand wie ein
neuer Zauber-Entwurf (eigene Session), nicht etwas, das sich aus
bestehenden Daten ableiten lässt. Zielgruppe (Spieler, die den
kompletten Content bereits durchgespielt haben) ist außerdem noch
nicht belegt, während Bausteine A/B/D bereits Langzeitmotivation ohne
Kampfbalance-Risiko liefern. Baustein E ist damit **verworfen, nicht
zurückgestellt** — keine Roadmap-Position mehr, siehe Bausteine-Liste
oben.

## Umsetzungsstand Baustein C (2026-07-28) — Legendary-Meilensteine

**6 neue Legendary-Zauber** (`data/spellbookPart4.js`), einer pro
Schule, komplett frisch entworfen (kein Bezug zu den archivierten,
offiziell veralteten "Zauber 6"-Konzepten — insbesondere deren
Cooldown-Mechanik wurde bewusst nicht übernommen, da sie "Die Rotation
IST der Cooldown" direkt widersprochen hätte):

| Schule | Zauber | Kernmechanik |
|---|---|---|
| Biomantie | Organkollaps | Großer Verwundbar-Bonusschaden |
| Schatten | Hinrichtung | Krit-Bonus + wirkt auf Krit wie gegen Verwundbar |
| Psionik | Geistessturm | Ignoriert Schild, skaliert mit Schulvielfalt der Rotation |
| Verbotene Runenkunst | Runenkollaps | 120% des eigenen Widerstands als Zusatzschaden |
| Chaosmagie | Vernichtung | Höchster Basisschaden aller Zauber, ignoriert Schild/Widerstand |
| Seelenmagie | Seelenapotheose | Verwundbar- + Widerstand- + Krit-Bonus gleichzeitig |

Alle 6 nutzen ausschließlich bereits implementierte
`spellEngine.js`/`combatFormula.js`-Werte, keine neue Engine-Logik.
**Nebenkorrektur während des Entwerfens**: die ursprüngliche Idee für
Organkollaps (Schaden skaliert mit der *Anzahl* negativer Effekte)
wurde verworfen, nachdem sich herausstellte, dass "Verwundbar" der
einzige negative Effekt ist, der im Spiel überhaupt existiert
(`context.effects.enemyStatuses` hat genau eine Zuweisungsstelle,
`src/combatStatus.js:62`) — die geplante Zählmechanik wäre technisch
funktionslos gewesen. Ersetzt durch einen einfachen, ehrlichen großen
Verwundbar-Bonus.

**Freischaltung**: `getMonoSchoolId()` (`src/metaProgression.js`,
Refactor von `isMonoSchoolRotation`) erkennt, welche Schule eine reine
Mono-Schul-Rotation bildet. `recordRunEnd()` trägt sie nur bei
**Sieg** in `unlockedLegendarySchools` ein (bewusst strenger als der
allgemeine Archetyp-Tracker, der keinen Sieg verlangt). Reward-Pool:
`isLegendaryUnlocked()` (`src/rewardSystem.js`) filtert nicht
freigeschaltete Legendary-Zauber komplett aus `pickNewRewardSpell()`/
`hasAvailableNewSpells()` heraus, unabhängig von der ohnehin
budgetierten Rarity-Gewichtung (bis 18% ab Kampf 8).

Verifiziert per Browsertest: Niederlage mit Mono-Schul-Rotation
schaltet nichts frei; Sieg schaltet ausschließlich die passende Schule
frei (0 Falsch-Positive bei den anderen 5); statistische Stichprobe
(400 Rotationen, fight-Index 10) bestätigt, dass der freigeschaltete
Zauber tatsächlich im Reward-Pool auftaucht, die gesperrten nie; keine
Konsolenfehler; bestehende Archetyp-Tracker-Funktionalität (Baustein B)
weiterhin unverändert korrekt (Regressionscheck).

## Balancing-Sprint — ERLEDIGT (2026-07-28)

Der hier vereinbarte Sprint ist durchgeführt. Vollständiger Bericht:
`BattleMages_Balancing_Sprint_2026-07-28.md`. Kurzfassung: Root Cause
war nicht Gegner-HP, sondern Rundenschaden (Gegner handelt 5×/Runde,
richtete 140-240 Schaden/Runde gegen 120 fixe Spieler-HP an) — behoben
durch Senkung der rohen Angriffswerte bei Fleischformer (#10), Der
Namenlose (#11) und Boss (#12). Alle 11 getesteten Builds gewinnen
jetzt #10/#11 zu 100%, den Boss 10 von 11 (nur reines Schatten-Mono
bei 24%). Damit ist ein Mono-Schul-Sieg für Baustein-C-Legendaries in
jeder Schule realistisch erreichbar. Nebenbefund: ein echter
Crash-Bug in `upgradeResolver.js` wurde dabei gefunden und gefixt
(betraf die 15 neuen Meta-Progression-Zauber ab Rang 3).
