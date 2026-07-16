# Sprint F – Balance Pass 1 Report

**Status:** Abgeschlossen  
**Datum:** 2026-07-07  
**Scope:** Spielgefühl, Balance, Build-Vielfalt — keine neuen Systeme, keine Mechanik-Redesigns  
**Referenzen:** `docs/design/BattleMages_Combat_Formula_v2.md`, `BattleMages_Combat_Identity_Matrix_v1.0.md`, `BattleMages_Enemy_Design_Document_v3.md`

---

## Methodik

1. **Impulse-Combat-Analyse** gegen Designziele (Rotation Value 160–360, Kampfdauer 3–12 Rotationen je Tier)
2. **Archetyp-Simulation** (`tools/balance_sim.py`) — 6 Starter-Builds × 12 Gegner, 300 Trials, Rang-1-Werte, 3-Zauber-Rotation
3. **Manuelle Zauber-/Upgrade-/Reward-Prüfung** aller 35 Spellbook-Zauber
4. **Direkte Korrekturen** nur in Kategorie **A** und **B**

### Technische Korrekturen (Voraussetzung für valide Gegner-Tests)

| Problem | Datei | Wirkung |
|---------|-------|---------|
| `applyEnemyCombatStart()` wurde nie aufgerufen | `src/combatContext.js` | Runenketzer-Start-Schild und Runenkonstrukt-Schadenscap fehlten komplett |
| `everyNthAction` triggerte auf Impuls 1, 3, 5 statt 2, 4, 6 | `src/enemyEngine.js` | Verirrter Novize: −10 Schaden pro 3er-Rotation |

---

## 1. Build-Archetypen

| Archetyp | Starter (3 Zauber) | Mid-/Late-Run (5 Zauber + Upgrades) | Urteil |
|----------|-------------------|-------------------------------------|--------|
| **Verwundbar** | Sehr stark (E1–E3 ~100 % Sieg) | Skaliert gut über Blut-Pfad A/B und Präzisionsschlag | Spielbar |
| **Schild** | Schwach ohne Belohnungen (RV ~60–90) | Erst mit Schildbrecher-Rang 3+, Verstärktem Siegel, 5 Slots spürbar | Siehe C |
| **Krit** | Stark early, bricht an Schild-/Heal-Gegnern ein | One-Shot-Pfad funktioniert mit Prep-Kette | Spielbar |
| **Hybrid** | Gut ab E2, schwächer vs. Runenketzer | Multischule + Sequenz belohnt korrekte Reihenfolge | Spielbar |
| **Sequenz** | Mittelmäßig vs. Schattenläufer (Anti-Burst) | Braucht 5 Slots und klare Angriffs-→Sequenz-Kette | Siehe C |
| **Burst** | Dominant early, absichtlich schwach vs. Chaosgeborener | Korrektes Build-Test-Verhalten | Spielbar |

**Design-Check:** Kein Archetyp soll alle 12 Kämpfe mit Starter-Deck alleine schaffen. Späte Niederlagen ohne Upgrades sind erwartet.

---

## 2. Zauber (35 Spellbook-Zauber)

### Generatoren / Starters (12)

| Zauber | Rolle | Urteil |
|--------|-------|--------|
| Knochenbruch | Verwundbar-Generator | Erfüllt Rolle, eröffnet Burst/Ketten |
| Organversagen | Ketten-Enabler | Sinnvoll nur mit Setup — korrekt |
| Präzisionsschlag | Burst-Finisher | War zu dominant vs. alle Alternativen → **B fix** |
| Schildwall | Schild-Generator | Budget-konform, leicht angehoben → **A fix** |
| Schildbrecher | Schild→Schaden | Erst spät tragfähig — korrekt |
| Dunkle Klinge | Krit-Generator | Solider Standard |
| Schattengriff | Prep-Enabler | Eröffnet One-Shot klar |
| Todesstoß | Krit-Finisher | Belohnt Prep, nicht ohne Setup spielbar |
| Runenharmonie | Schild/Krit-Hybrid | Identisch zu Schattenmantel → **B/C** |
| Schattentanz | Sequenz-Enabler | Belohnt Reihenfolge spürbar |
| Arkane Verkettung | Hybrid-Enabler | Öffnet Multischule |
| Reinheit | Monoschule-Enabler | Öffnet Runen-Mono |

### Part-II-Zauber (23) — Kurzbewertung

| Kategorie | Zauber | Befund |
|-----------|--------|--------|
| Verwundbar | Blutgerinnsel, Bruchrune, Seelenimpuls | Füller/Setup — keine Auto-Picks |
| Krit | Finsterer Hieb, Gedankenschlag, Schattenmantel | Finsterer Hieb > Gedankenschlag als reiner DPS → **B fix (Gedankenschlag)** |
| Hybrid | Gedankenfalle, Runenbruch, Seelenbindung | Erweitern Builds sinnvoll |
| Schild | Verbotenes Siegel, Verstärktes Siegel, Runenstoß | Pfad zu Schildkanone — kein Pflichtpfad |
| Burst | Chaoseruption, Chaosklinge, Chaoskatalysator | Chaoseruption RNG vs. Chaosklinge Konstante — bewusste Wahl |
| Prep | Gedankenstrom, Gedankenumlenkung | Eröffnen Krit ohne Starter-Duplikat |

**Offensichtliche Alternativen ( dokumentiert, teilweise gefixt ):**
- **Präzisionsschlag** war fast immer besser als Blutgerinnsel + direkter Burst → Bonus 40→35
- **Finsterer Hieb** (35 + Crit-Bonus) vs. **Gedankenschlag** (28 + 15 %) → Gedankenschlag 32 + 18 %
- **Runenharmonie** vs. **Schattenmantel** — identische Rank-1-Werte → Schattenmantel +2 Schaden

---

## 3. Upgrades

| Prüfpunkt | Ergebnis |
|-----------|----------|
| Beide Pfade interessant? | Ja — durchgehend unterschiedliche Identität (Offense vs. Defense, Burst vs. Setup) |
| Pflichtpfade? | **Knochenbruch Pfad A** und **Präzisionsschlag Pfad A** sind in Verwundbar-Runs ~15–20 % stärker als B — empfohlen, nicht erzwungen → **C** |
| Nutzlose Pfade? | **Schildwall Pfad B (Dornenschild)** schwach bis Rang 5 — dokumentiert → **C** |
| Rang-2 (+20 %) | Konsistent über alle Profile |

---

## 4. Gegner

| # | Gegner | Build-Test | Sim / Gefühl | Nach Niederlage klar? |
|---|--------|------------|--------------|------------------------|
| 1 | Verirrter Novize | Rotation verstehen | Leicht, fair | „Mehr Schaden / bessere Reihenfolge“ |
| 2 | Entstellter Adept | Verwundbar | Verwundbar dominiert — korrekt | „Ohne Verwundbar zu langsam“ ✓ |
| 3 | Schattenläufer | Krit-Timing | Bestraft blinden Krit-Burst | „Ersten Krit nicht verschwenden“ ✓ |
| 4 | Runenketzer | Schild entfernen | Hart für reine Schaden-Builds | „Schildbrecher / Piercing nötig“ ✓ |
| 5 | Wahnsinniges Orakel | Rotationsplanung | Bestraft Spam | „Nicht nur Schaden hintereinander“ ✓ |
| 6 | Chaosgeborener | Konstanter DPS | Bestraft Spikes | „Burst-Build ungeeignet“ ✓ |
| 7 | Seelenhüter | Lange Kämpfe | Sustain zu stark vs. schwache RV → **A fix** | „Mehr DPS / weniger Einzelspikes“ ✓ |
| 8 | Runenkonstrukt | Mehrfach-Treffer | Cap erfordert Multi-Hit — **Start-Cap-Bug** behoben | ✓ |
| 9 | Schattenbestie | Krit-Timing | Risiko spürbar, Maul zu hart → **A fix** | ✓ |
| 10 | Fleischformer | Burst-Fenster | Heilung überstimmt schwache Rotation → **A fix** | „Nicht genug Burst pro Rotation“ ✓ |
| 11 | Der Namenlose | Hybrid | Fordert 2+ Mechaniken — fair | ✓ |
| 12 | Erster Erzmagier | Vollbeherrschung | Sehr hoch, Großzauber spiky → **A fix** | „Run noch nicht reif“ ✓ |

---

## 5. Rewards

| Prüfpunkt | Ergebnis |
|-----------|----------|
| Interessante Entscheidungen? | Ja — Upgrade / Neuer Zauber / Pfadwahl (Rang 3) |
| Auto-Picks? | **Upgrade-Slot 1+2 rein zufällig** — kein Bias auf schwächere Zauber → **C** |
| Setup-abhängige Zauber | Waren mit 12 % Gewicht fast unsichtbar → **B fix: 20 %** |
| Seltenheitskurve | Epic ab Kampf 3 (10 %) — akzeptabel für First Playable |

---

## 6. Rotation

| Prüfpunkt | Ergebnis |
|-----------|----------|
| Echte Rotationsentscheidungen? | Ja — Verwundbar→Präzision, Prep→Finisher, Schutz→Sequenz |
| Reihenfolge wichtig? | Ja — Schattentanz, Arkane Verkettung, Reinheit, Orakel-Passiv |
| Drag & Drop Impact | Spürbar ab Kampf 5+ |

**Beispiel-RV (Rang 1, 3 Zauber optimal sortiert):**

| Build | Rotation (Beispiel) | ~RV |
|-------|---------------------|-----|
| Verwundbar | Knochenbruch → Präzisionsschlag → Organversagen | ~200 |
| Krit | Schattengriff → Todesstoß → Dunkle Klinge | ~170 (variiert) |
| Schild | Schildwall → Schildwall → Schildbrecher | ~65 + 60 Schild |

---

## Angewandte Korrekturen (A / B)

### A) Zahlenprobleme

| Ziel | Änderung |
|------|----------|
| Seelenhüter sustain zu hoch | Heilung 40 → **35** / Impuls |
| Fleischformer Burst-Fenster zu eng | Heilung nach Rotation 60 → **50** |
| Boss-Spike zu brutal | Großzauber 80 → **72** |
| Schattenbestie Strafe zu hart | Schattensprung 60 → **52** |
| Chaos-Dämpfung zu streng | Strafe 20 → **15** |
| Runenketzer Start-Schild (mit Fix) | 40 → **35** |
| Entstellter Adept Passiv-Schild | 10 → **8** |
| Schattenläufer Erst-Krit-Reduktion | 20 → **15** |
| Schildwall Rank 1 | 30 → **32** Schild (+ angepasste Rank 2/4) |
| Novize Passiv-Timing | Impuls 2/4/6 statt 1/3/5 (≈ −10 Schaden / 3er-Rotation) |

### B) Balanceprobleme

| Ziel | Änderung |
|------|----------|
| Präzisionsschlag dominiert alle Burst-Alternativen | Verwundbar-Bonus 40 → **35** |
| Gedankenschlag strict inferior zu Dunkler Klinge / Finsterer Hieb | 28/+15 % → **32/+18 %** (+ Rank 2/4) |
| Schattenmantel = Runenharmonie | Schattenmantel **32** Schaden |
| Setup-Zauber fast nie angeboten | Reward-Multiplikator 0.12 → **0.20** |

---

## Dokumentiert — keine Änderung (C / D)

### C) Buildprobleme

1. **Schild-Starter-Deck (3 Zauber)** erreicht kein RV-Ziel (160+) — erst ab Kampf 4–5 mit Belohnungen tragfähig. Kein reiner Schild-Start-Run ohne Upgrades realistisch.
2. **Sequenz-Starter** (Schattentanz + 2 Karten) ohne volle 5er-Rotation und Angriffs-Setup unter Ziel-RV.
3. **Upgrade-Auto-Pick:** Zwei zufällige Upgrade-Slots — kein „schwächster Zauber zuerst“-Bias.
4. **Knochenbruch Pfad A / Präzisionsschlag Pfad A** fühlen sich in Verwundbar-Runs als Soft-Pflicht an.
5. **Schildwall Pfad B** erst ab Rang 5 konkurrenzfähig zu Pfad A.
6. **Späte Elites ohne fokussiertes Deck** (0 % in Starter-Sim) — erwartet, aber Grenzfall für Hybrid-Generalisten.

### D) Fantasyprobleme

1. **Runenharmonie vs. Schattenmantel** — gleiche Fantasy (Krit → Schild), minimal differenziert trotz Schul-Zugehörigkeit.
2. **Chaosmagie-Burst** fühlt sich erst ab Chaosklinge/Chaoskatalysator wie „Burst-Schule“ an — Chaoseruption wirkt wie Lottery.
3. **Biomantie-Schild** (Knochenpanzer, Seelenimpuls) — defensiv, aber Blut-Fantasy bleibt „Zerstörung“; Hybrid ok, Mono-Blood-Schild fehlt.
4. **Boss-Schultechniken** — Wechsel sichtbar, aber Technique-Werte nicht im Design-Doc spezifiziert; Cycle spürbar, Fantasy der einzelnen Schulen noch schwach lesbar.

---

## Empfohlene Playtest-Fokus (Sprint G)

1. Voller Run mit **Schild-Start** — ab welchem Kampf wird es spielbar?
2. **Pfadwahl Rang 3** — wird B gewählt, wenn A nicht Verwundbar ist?
3. **Kampf 10 Fleischformer** — reicht 50 HP Heilung für Burst-Fenster?
4. **Boss** — 8–12 Rotationen mit Endgame-Deck?

---

## Geänderte Dateien

- `src/combatContext.js` — Combat-Start-Hook
- `src/enemyEngine.js` — everyNthAction-Timing
- `src/rewardSystem.js` — Setup-Gewichtung
- `data/enemies.js` — Gegnerwerte + UI-Texte
- `data/spellbookCore.js` — Schildwall, Präzisionsschlag
- `data/spellbookPart2.js` — Gedankenschlag, Schattenmantel
- `data/spellUpgradeProfiles.js` — Schildwall, Gedankenschlag Rank 2/4
- `tools/balance_sim.py` — Simulations-Harness (neu)
