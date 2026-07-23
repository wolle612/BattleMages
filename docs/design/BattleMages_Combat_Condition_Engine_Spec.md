# BattleMages — Combat Condition Engine: Design-Spezifikation (Phase 0)

> Technische Design-Spezifikation für den Umbau von Schild und Krit in
> ein deterministisches Bedingungssystem. Ergänzt
> `docs/specs/combat_condition_engine_roadmap.md` (Phasenplan/Status) —
> dieses Dokument ist die Phase-0-Ausarbeitung selbst: Vokabular,
> Datenstrukturen, Next-Spell-Prep-Entscheidung, vollständige
> Spell-Migrationstabelle. Quelle der Wahrheit für Phase 0.5 ff., sobald
> bestätigt.

## 1. Geschlossenes Bedingungs-Vokabular

### 1.1 Wiederverwendet, unverändert
Aus `combatSequence.js`/`SEQUENCE_TRIGGERS`, keine Code-Änderung nötig:
- `same_school` / `different_school` (`hybrid`) — Schule des vorherigen Casts
- `after_attack` / `after_protection` — Typ des vorherigen Casts
- `hasEnemyVulnerable` — Verwundbar-Status des Gegners (unverändert)

**Schutz als Bedingung braucht keinen neuen Code.** "Payoff nach einem
Schutz-Zauber" = `sequenceTrigger: "after_protection"`, exakt wie heute
schon bei `soul_ward` Pfad B.

### 1.2 Neu: Zustandsbasiert (Spieler)
- `hasPlayerResistance` — `context.playerResistance > 0` (neues Feld,
  siehe Abschnitt 3)
- `hasPlayerPrecision` — Präzision aktiv (technisch: Next-Spell-Prep mit
  `nextSpellGuaranteedCrit`, siehe Abschnitt 2)

### 1.3 Neu: Zähler-basiert (pro Runde)
- `nthAttackCastThisRound` — wie viele Angriffszauber diese Runde bereits
  gecastet wurden (`context.roundCounters.attackCasts`)
- `nthProtectionCastThisRound` — analog für Schutz-Zauber
- Reset bei jedem `context.round++` in `battleManager.js`

### 1.4 Neu: Positionsbasiert
- `isFirstCastInRotation` / `isLastCastInRotation` — ableitbar aus
  `castedSpellIds.length` (bereits getrackt), kein neuer State nötig

## 2. Next-Spell-Prep-Entscheidung

**Entscheidung: Next-Spell-Prep bleibt als generisches Trägersystem
bestehen, wird nicht dupliziert oder ersetzt.** Begründung: Sequence-
Trigger prüfen die *Vergangenheit* (was wurde vor mir gecastet),
Next-Spell-Prep gewährt der *Zukunft* etwas (was bekommt der nächste
Cast) — zwei unterschiedliche Zeitrichtungen, beide bereits
deterministisch, kein Widerspruch zur neuen Philosophie, keine
Überschneidung.

**Präzision wird technisch über den bestehenden Prep-Mechanismus
implementiert** (`grantUniversalNextSpellPrep` mit
`nextSpellGuaranteedCrit: true`, ein bereits vorhandener Value-Key),
bekommt aber eine eigene, benannte Identität im Spielerlebnis (eigener
Status-Name "Präzision", eigenes Icon, nicht das generische
Next-Spell-Prep-UI). Kein Duplikat-System im Code, aber klare eigene
Fantasie für die Spieler:innen.

Die übrigen Prep-Varianten (`nextSpellDamageBonus`,
`nextSpellAppliesVulnerable`, `nextSpellShieldPierce` → wird zu
`nextSpellResistancePierce`, s. u.) bleiben als generisches Werkzeug für
Nicht-Krit-Fälle bestehen — sie sind kein Duplikat, weil sie eine andere
Aufgabe haben als die Sequence-Trigger.

**Erledigt (Phase 2, Chaosmagie-Rollout):** `chaos_eruption` wurde
komplett neu entworfen (Chaosblitz-inspiriert, "ignoriert Schild/
Widerstand" statt Zufallsschaden) und nutzt `nextSpellRandomPrep`
seither nicht mehr — Option (b) wurde de facto durch das Redesign
umgesetzt. `nextSpellRandomPrep`/`grantRandomNextSpellPrep` und die
zugehörigen `randomDamageMin`/`randomDamageMax`/
`applyVulnerableOnMaxRandomDamage`-Werte waren seitdem toter Code ohne
Aufrufer und wurden in Phase 3 (Balance-Neukalibrierung) entfernt. Das
migrierte Vokabular ist damit vollständig frei von Zufallskomponenten.

## 3. Neue Datenstrukturen

```js
// combatContext.js — initializeCombatContext()
context.playerResistance = 0;          // permanent, nie konsumiert

// effectEngine.js — initializeCombatEffects()
// playerStatuses existiert bereits (bisher ungenutzt), wird jetzt befüllt:
effects.playerStatuses.precision = { active: true };  // via Prep-Mechanismus gesetzt/gelesen

// battleManager.js / combatContext.js — neuer Rundenzähler-Container
context.roundCounters = {
    attackCasts: 0,
    protectionCasts: 0
};
// Reset bei jedem context.round++
```

## 3.5 Umfangsklärung — was migriert wird und was nicht (WICHTIG)

Missverständnis-Gefahr, deshalb explizit: Migriert werden ausschließlich
die konkreten Schild-/Krit-*Werte* eines Zaubers, egal wo sie im
Zauber auftauchen — nicht der ganze Zauber, und nicht Mechaniken, die
mit Schild/Krit nichts zu tun haben. Verwundbar, reine Sequence-
Schadensboni und alle sonstigen Effekte bleiben unverändert bestehen —
sie sind das Vorbild für dieses Redesign, nicht sein Ziel.

Der Befund "alle 38 Zauber berühren Schild/Krit" (Abschnitt 5) bedeutet
NICHT, dass alle 38 Zauber grundlegend neu gebaut werden. Meist ist nur
ein einzelner Rang-/Pfad-Zweig betroffen (oft nur Pfad B, Rang 5); der
Rest des Zaubers bleibt exakt wie er ist. Nur Verbotene Runenkunst und
Schatten (wo Schild/Krit die Kernidentität sind) bekommen einen
tiefen, strukturellen Umbau.

**Entschieden (2026-07-23): kein Big-Bang-Rewrite bestehender
Mechaniken, volle Vereinheitlichung als Prinzip statt als Projekt.**
Geprüft wurde die radikalste Fassung von "Lösung 3" — dasselbe
Bedingungssystem auch auf Verwundbar und reine Sequence-Boni anwenden.
Befund anhand realer Zauber (`bone_fracture`→`blood_clot`,
Verwundbar-Generator/Payoff-Paar; `mind_trap`,
`applyVulnerableOnSequenceTrigger`): diese Mechaniken sind bereits
heute deterministisch und bedingungsbasiert — kein Würfel, keine
Verbesserung durch einen Umbau. Ein vollständiger Rewrite würde fast
ausschließlich Code-Architektur betreffen (mehrere bestehende
Prüf-Funktionen zu einem Dispatcher zusammenführen), ohne spürbaren
Spielerlebnis-Gewinn, aber mit echtem Regressionsrisiko an bereits
validierten, funktionierenden Systemen.

**Stattdessen:** Volle Vereinheitlichung wird zum **verbindlichen
Designprinzip für alle neuen/überarbeiteten Zauber ab sofort**
(aufzunehmen in die Phase-4-Neufassung der Spell-Authoring-
Checkliste), nicht zu einem einmaligen Rewrite-Projekt. Das Spiel
konvergiert dadurch organisch zum einheitlichen System, ohne
funktionierenden Code ohne Not anzufassen.

## 4. Mechanik-Spezifikationen

### 4.1 Magischer Widerstand
- Formel: `schadenAnHP = max(1, eingehenderSchaden - context.playerResistance)`
  (Mindestschaden 1, keine vollständige Unverwundbarkeit möglich)
- Nie konsumiert, gilt für den gesamten Kampf
- Neuer Effekt `gain_resistance` (Struktur analog zu `gain_shield` heute)
- Stapelt additiv bei jedem Cast — wächst über die Kampfdauer
- Interner Bezeichner: `resistance`/`magicResistance`; Anzeige: "Magischer
  Widerstand" (kurz: "Widerstand")
- **Für Phase 3 offen, nicht jetzt entschieden:** Soft-Cap/Diminishing
  Returns gegen unbegrenztes Stapeln in sehr langen Kämpfen (50-Runden-
  Limit existiert bereits als Sicherheitsnetz in `battleManager.js`,
  aber ein Balance-Cap ist trotzdem sinnvoll zu prüfen)
- **Späterer Hook, nicht Teil dieses Umbaus:** Gegner-seitige
  "Widerstandsdurchdringung" (analog `shieldPierce`) als zukünftiger
  Boss-Design-Hebel

### 4.2 Schutz
Keine neue Mechanik — reine Anwendung von `sequenceTrigger:
"after_protection"` auf Payoff-Zauber. Rune-Generatoren (Typ
"Protection") gewähren `gain_resistance` als Grundeffekt, ihre
Payoff-Partner prüfen `after_protection` für einen deterministischen
Bonus.

### 4.3 Präzision
- Gesetzt durch `nextSpellGuaranteedCrit: true` (Next-Spell-Prep,
  bestehender Mechanismus)
- Payoff: garantiert kritisch (x2, bestehende
  `COMBAT_FORMULA_CONSTANTS.critDamageMultiplier`), kein Würfelwurf
- **UI-Pflicht**: `getPlayerStatusViews()` (aktuell fest `[]`) muss
  Präzision ausgeben, sonst unsichtbarer Zustand — siehe Phase 0.5

## 5. Vollständige Spell-Migrationstabelle

Befund vorab: **alle 38 Zauber berühren Schild und/oder Krit** in
mindestens einem Rang/Pfad — es gibt keinen unberührten Zauber. Dies ist
tatsächlich eine vollständige Spellbook-Neufassung, keine Ausnahme.

Format: `id (Schule/Rolle)` — alte Mechanik(en), kompakt — neue
Einordnung (Kategorie, keine finalen Zahlen/Texte — das ist Phase 2).

### Biomantie
- `bone_fracture` (Generator) — Schild via Verwundbar (PathB) → Widerstand-Payoff bei Verwundbar-Anwendung
- `organ_failure` (Build-Enabler) — Schild via Verwundbar, Next-Crit-Prep (PathB) → Widerstand-Payoff, Präzision-Generator
- `anatomy` (Verstärker) — Krit→Verwundbar-Bonus (Basis), Krit-Shield (PathB) → Präzision-Konsument, Widerstand-Payoff bei Krit
- `bone_armor` (Verstärker) — Schild-Generator, Schild→Schaden (PathB) → Widerstand-Generator, Schutz-Payoff
- `blood_clot` (Verstärker) — Schild via Verwundbar (PathB) → Widerstand-Payoff bei Verwundbar

### Schatten
- `precision_strike` (Build-Enabler) — Krit-Bonus, Verwundbar→Garantie-Krit (PathA) → Präzision-Konsument (Verwundbar-gekoppelt)
- `dark_blade` (Generator) — Krit-Chance, Verwundbar→Krit (PathB) → Präzision-Generator (ersetzt Chance)
- `shadow_grasp` (Build-Enabler) — bereits Next-Spell-Prep-basiert (Krit+Schaden), Schild-Prep (PathB) → **schon heute quasi Präzision**, Widerstand-Payoff
- `death_stroke` (Finisher) — Krit-Bonus, Folgetreffer (PathA) → Präzision-Konsument
- `shadow_dance` (Build-Enabler) — Krit-Shield, Doppel-Krit (PathA) → Präzision-Konsument, Widerstand-Payoff
- `shadow_mantle` (Verstärker) — Krit-Shield (Basis), Verwundbar→Krit (PathB) → Präzision-Konsument mit Widerstand-Payoff
- `dark_blow` (Verstärker) — Krit-Bonus, Krit-Shield, Folgetreffer → Präzision-Konsument, Widerstand-Payoff
- `will_break` (Verstärker) — Verwundbar→Krit-Chance → Präzision-Generator (Verwundbar-gekoppelt)

### Psionik
- `mind_strike` (Generator) — Krit-Chance, Folgetreffer → Präzision-Generator (ersetzt Chance)
- `mind_stream` (Verstärker) — bereits Next-Crit-Prep-basiert → **schon heute quasi Präzision**
- `mind_barrier` (Verstärker) — Schild-Generator, Schild→Schaden (PathB) → Widerstand-Generator, Schutz-Payoff
- `mind_trap` (Verstärker) — Sequence-Schild, Sequence-Garantie-Krit (PathA) → Widerstand-Payoff, Präzision-Konsument (**bereits Sequence-basiert, schon deterministisch**)
- `mind_redirect` (Verstärker) — Next-Crit-Prep → **schon heute quasi Präzision**
- `arcane_chain` (Build-Enabler) — Next-Crit-Chance (PathB) → Präzision-Generator

### Verbotene Runenkunst — MIGRIERT (2026-07-23, Phase 0.5, alle 9 Zauber)
- `shield_wall` (Generator) — Kern-Schild-Zauber der Schule → **Widerstand-Generator** (zentraler Zauber) ✅
- `shield_breaker` (Build-Enabler) — Schild-Konsum→Schaden → Schutz-Payoff (nutzt `after_protection` statt Konsum) ✅
- `rune_harmony` (Build-Enabler) — Krit-Shield, Verwundbar→Krit (PathB) → Präzision-Konsument mit Widerstand-Payoff ✅
- `forbidden_seal` (Verstärker) — Sequence-Schild → Widerstand-Generator (**bereits Sequence-verstärkt**) ✅
- `amplified_seal` (Verstärker) — reiner Schild-Verstärker → Widerstand-Verstärker ✅
- `fracture_rune` (Verstärker) — Schild via Verwundbar (PathB) → Widerstand-Payoff bei Verwundbar ✅
- `rune_break` (Verstärker) — Schild-Presence-Gate → Bedingung wird zu "hat Widerstand" ✅
- `rune_thrust` (Verstärker) — Schild-Generator, Krit-Bonus (PathA) → Widerstand-Generator, Präzision-Konsument ✅
- `purity` (Build-Enabler) — Schild-Prep, Krit-Prep (PathB) → Widerstand-Generator, Präzision-Generator ✅

### Chaosmagie
- `chaos_eruption` (Verstärker) — **Random-Prep** (Schild/Krit-Chance) → offener Punkt, siehe Abschnitt 2
- `chaos_blade` (Verstärker) — Krit-Bonus, Verwundbar→Krit (PathB) → Präzision-Konsument (Verwundbar-gekoppelt)
- `chaos_catalyst` (Build-Enabler) — Schild→Schaden, Verwundbar→Krit (PathB) → Schutz-Payoff, Präzision-Konsument
- `entropy` (Generator) — Schild-Generator, Krit-Bonus (PathB) → Widerstand-Generator, Präzision-Konsument
- `overload` (Finisher) — atomarer Schild-Gewinn+Konsum in einem Cast → **Schutz-Payoff, bleibt strukturelles Vorbild** (kein Umbau nötig, Muster funktioniert schon deterministisch)

### Seelenmagie
- `soul_bind` (Verstärker) — schadensbasierter Schild, Next-Krit-Chance (PathB) → Widerstand-Generator, Präzision-Generator
- `soul_cut` (Verstärker) — Schild→Schaden, Verwundbar→Krit (PathB) → Schutz-Payoff, Präzision-Konsument
- `soul_pulse` (Verstärker) — Schild via Verwundbar, Next-Krit-Chance (PathB) → Widerstand-Payoff bei Verwundbar, Präzision-Generator
- `soul_spark` (Verstärker) — Verwundbar→Krit-Chance, Schild via Verwundbar (PathB) → Präzision-Generator (Verwundbar-gekoppelt), Widerstand-Payoff
- `soul_ward` (Verstärker) — Krit-Shield → Präzision-Konsument mit Widerstand-Payoff

## 6. Bemerkenswerter Nebenbefund

Mehrere Zauber (`shadow_grasp`, `mind_stream`, `mind_redirect`,
`mind_trap` PathA, `forbidden_seal`) sind **schon heute** strukturell
näher am neuen System als am alten — sie nutzen bereits Next-Spell-Prep
oder Sequence-Trigger statt reiner Zufalls-%/Zahlen-Logik. Das bestätigt
noch einmal, dass die neue Richtung keine Erfindung aus dem Nichts ist,
sondern eine Verallgemeinerung eines Musters, das im Spiel an mehreren
Stellen schon funktioniert.

## 7. Phase 0.5 — tatsächlich umgesetzte Engine-Erweiterungen (2026-07-23)

Ergänzend zur ursprünglichen Spezifikation, während der Umsetzung
präzisiert:

- `context.playerResistance` (permanent) + `applyPlayerResistance()`
  (`effectEngine.js`, wird VOR dem klassischen Schild verrechnet,
  Mindestschaden 1) statt des in Abschnitt 3 skizzierten
  `hasPlayerResistance`-Bedingungs-Checks als primärer Mechanismus.
- Effekte `gain_resistance`/`increase_resistance`
  (`spellEngine.js`), formulagetrieben über `calculateResistanceGain`
  (`combatFormula.js`, Sequence-Bonus-fähig, Gegenstück zu
  `calculateShieldGain`).
- `resistanceBonusDamagePercent` (Widerstand-Skalierungsschaden,
  Gegenstück zu `shieldBonusDamagePercent`) und
  `getSequenceGatedResistanceBonusDamage` (Gegenstück zu
  `deal_shield_damage`/Schild-Konsum, aber sequenzgebunden statt
  konsumbasiert, da Widerstand nie konsumiert wird) — ersetzt
  `deal_shield_damage` für migrierte Zauber vollständig über den
  normalen `deal_damage`-Pfad.
- `critResistanceGain`/`critResistanceMultiplier` (Gegenstück zu
  `critShieldGain`/`critShieldMultiplier`) und
  `applyVulnerableResistanceGain`/`applyVulnerableIfPlayerResistance`
  (Gegenstücke zu den Schild-Verwundbar-Kopplungen) — reine
  Werte-Übersetzung, keine neue Formel-Logik nötig, da diese Effekte
  bereits deterministisch waren (Krit-Ereignis bzw.
  Verwundbar-Anwendung als Auslöser, unabhängig von Zufalls-Krit vs.
  künftiger Präzision).
- `roundCounters`/Präzision (Next-Spell-Prep-Konsolidierung) NICHT
  gebaut — für die Rune-Slice nicht benötigt (keiner der 9 Rune-Zauber
  braucht einen Rundenzähler; Kritchance-Vergabe bleibt für alle
  Schulen vorerst unverändert, da Rune nur Krit-*Ereignis*-Konsument
  ist, nicht -Erzeuger). Bleibt Aufgabe von Phase 1/Schatten-Rollout.

## Status
Entwurf, wartet auf Bestätigung durch den Nutzer (Freigabe-Gate Ende
Phase 0, siehe Roadmap-Dokument). Nach Bestätigung: offener Punkt
`chaos_eruption`-Zufall klären (kann bis Phase 2/Chaosmagie warten),
dann Start Phase 0.5 (Vertical Slice Verbotene Runenkunst).

**Update 2026-07-23, Phase 0.5 abgeschlossen:** siehe Abschnitt 7 oben
für die tatsächliche Umsetzung; Rune-Migrationstabelle in Abschnitt 5
mit ✅ markiert. Balance-Ergebnis und offene Design-Lücken siehe
Roadmap-Dokument (`docs/specs/combat_condition_engine_roadmap.md`),
Status-Abschnitt.
