# BattleMages — Combat Condition Engine: Redesign-Roadmap

> Lebendes Planungsdokument für den Umbau von Schild und Krit von
> reaktiven/zufallsbasierten Mechaniken zu einem deterministischen,
> bedingungsbasierten System ("Lösung 3" aus der Schild/Krit-Diskussion,
> 2026-07-22/23). Ergänzt `docs/specs/architecture_design_audit_2026-07-21.md`,
> ersetzt an dieser Stelle aber dessen Krit/Schild-bezogene Roadmap-Punkte.

## Entscheidung und Kontext

Ausgangspunkt: Schild- und Krit-Mechaniken funktionieren strukturell nicht
gut in BattleMages' 1:1-Alternations-Kampfmodell (Gegner handelt nach
jedem einzelnen Spieler-Cast). Mehrere inkrementelle Fixes wurden
diskutiert und verworfen (Schild-Deckelung pro Treffer, Fokus-Meter für
Krit) — der Nutzer hat sich stattdessen für die radikalste der
diskutierten Optionen entschieden:

**Harter Cut, keine Rückwärtskompatibilität nötig (keine bestehende
Spielerschaft).** Schild und Krit werden zu Instanzen eines einzigen,
generischen Bedingungssystems ("Bedingung → Effekt"), das dieselbe
deklarative Sprache spricht, die die Gegner-KI (`enemyEngine.js`
Passiv-Regeln) bereits nutzt. Kernprinzip: Payoffs hängen von der
**Struktur der Rotation** ab (Reihenfolge, vorheriger Zaubertyp/Schule,
Zähler pro Runde), nicht von Zufall oder Gegner-Timing.

Betroffener Umfang: **alle 6 Schulen**, nicht nur Verbotene Runenkunst
(Schild) und Schatten (Krit) — Krit- und Schild-Mechaniken tauchen in
Biomantie, Psionik, Chaosmagie und Seelenmagie ebenfalls auf
(Next-Spell-Prep-Ketten, `critShieldGain`, `vulnerableGuaranteedCrit`
etc.). Volle Spellbook-Neufassung, nicht auf zwei Schulen begrenzt.

## Offene Design-Entscheidungen (Stand 2026-07-23)

### 0. Namensgebung
Die neue permanente Verteidigungs-Ressource (siehe Punkt 2) heißt
**Magischer Widerstand** (kurz: Widerstand), nicht "Rüstung" —
passt besser zur Magier-Fantasie als ein Plattenpanzer-Begriff
(Nutzer-Entscheidung, 2026-07-23). Empfohlene Konvention, analog zu
Schulen (`rune` intern vs. "Verbotene Runenkunst" im UI) und
bestehenden Mechaniken (`shield`/`vulnerable` intern vs. "Schild"/
"Verwundbar" im UI): interner Code-Bezeichner `resistance` oder
`magicResistance`, Anzeigetext "Magischer Widerstand".

### 1. Numerischer Schild-Restwert? — ENTSCHIEDEN, entfällt als eigenes Konzept
**Kein separater depletable Schild-Restwert.** Ursprünglich als kleine,
sekundäre Garantie-Untergrenze vorgeschlagen (siehe Diskussion
2026-07-23). Bei kritischer Prüfung des Gesamt-Vokabular-Umfangs
verworfen zugunsten einer saubereren Lösung: Schutz-Zauber gewähren
direkt etwas Magischen Widerstand (siehe Punkt 2) als Grundeffekt,
statt einer eigenen zweiten numerischen Ressource. Grund: ein
depletable Pool kann immer von einem einzelnen ausreichend großen
Treffer komplett ausgelöscht werden (egal wie groß er gerade ist) —
das reproduziert das ursprüngliche Schild-Problem nur mit kleineren
Zahlen. Magischer Widerstand ist strukturell immun dagegen (nie
konsumiert) und übernimmt die "Garantie-Untergrenze"-Funktion gleich
mit, ohne ein zweites paralleles Zahlenkonzept zu brauchen.

Wichtiger Nebenbefund bei derselben Prüfung: **Schutz als Bedingung
braucht keinen neuen Status-Zustand.** Der bestehende Sequence-Trigger
`after_protection` (`combatSequence.js`, `matchesSequenceTrigger`)
prüft bereits exakt "war der vorherige Zauber vom Typ Schutz" — kein
neuer State nötig, nur mehr Zauber, die diesen bereits vorhandenen
Trigger nutzen. Ebenso ist **Präzision** im Kern keine Neuerfindung,
sondern eine Konsolidierung des bereits existierenden Next-Spell-Prep-
Systems (`nextSpellGuaranteedCrit` existiert bereits als Value-Key) zum
primären Krit-Mechanismus statt einer von vielen Nebenvarianten. Damit
ist die tatsächlich neue Vokabel-Last für dieses Projekt sehr klein:
**Magischer Widerstand ist das einzige echt neue Primitiv**, der Rest ist
Wiederverwendung/Aufräumen bestehender Systeme. Das war ein
ausdrücklicher Diskussionspunkt (Sorge vor Vokabular-/Balancing-
Aufblähung, 2026-07-23) und wurde mit dieser Zusammenlegung aufgelöst.

### 2. Wie funktioniert Überleben, wenn Schild kein Hauptpuffer mehr ist?
**Empfehlung: Magischer Widerstand (permanenter, nie konsumierter
Flachwert pro Treffer) wird der neue primäre Überlebens-Hebel.**
Begründung: Widerstand ist eine vorab berechenbare, statische
Eigenschaft einer gebauten Rotation — exakt wie die Rotation Value (RV)
heute schon eine vorab berechenbare Offensiv-Kennzahl ist. Widerstand
wäre das defensive Gegenstück dazu: zwei symmetrische, deterministische
Achsen
("programmierte Kampfmaschine" konsequent zu Ende gedacht), statt einer
reaktiven Ressource, die im Kampf getestet wird. Schutz (das neue
Bedingungssystem) wird dadurch zur taktischen/Burst-Schicht statt zum
Haupt-Überlebenswerkzeug — sein Job ist der einzelne, gut getimte
Moment, nicht "den ganzen Kampf durchhalten".

Zusätzlich als explizites Design-Prinzip festgehalten: "Schneller
töten" (Verwundbar-Burst, künftige Präzision-Finisher) ist eine
gleichwertige, offiziell anerkannte Überlebensstrategie, keine
Nebensache — Überleben muss nicht ausschließlich über
Schadensreduktion laufen.

Ob die Basis-HP (aktuell 120) oder die Gegner-Schadenskurve zusätzlich
angepasst werden müssen, ist eine empirische Frage für den
Balance-Check am Ende der Vertical Slice (siehe Phase 0.5), keine
Entscheidung, die jetzt blind getroffen wird.

*Beide Empfehlungen sind Vorschläge, noch nicht final vom Nutzer
bestätigt — hier als Diskussionsstand festgehalten.*

## Roadmap (korrigierte Fassung)

### Phase 0 — Design-Fundament (nur Dokumentation, kein Code)
- Geschlossenes Bedingungs-Vokabular definieren (analog `SEQUENCE_TRIGGERS`,
  aber vollständig: Rundenzähler, Positions-Bedingungen, Widerstands-Schwellen).
  Schutz-Bedingungen laufen über den bestehenden `after_protection`-Trigger,
  brauchen keinen eigenen neuen Status (siehe Punkt 1 oben).
- Präzision als Konsolidierung des Next-Spell-Prep-Systems ausformulieren
  (nicht als komplett neues Parallelsystem) — konkret ausarbeiten, wie
  `nextSpellGuaranteedCrit` und verwandte Prep-Varianten in das neue
  Vokabular aufgehen, statt daneben bestehen zu bleiben (Präzedenzfall:
  866 Zeilen toter Code durch genau so ein Parallelsystem, 2026-07-21).
- Neue Datenstrukturen spezifizieren (`playerStatuses`-Schema erweitert,
  neuer Rundenzähler-Container).
- Vollständige Spell-für-Spell-Migrationstabelle: alle 38 Zauber, alt →
  neu, als Checkliste für Phase 2.
- Freigabe-Gate: Nutzer bestätigt Design-Dokument, bevor Code beginnt.

### Phase 0.5 — Vertical Slice: eine Schule komplett (empfohlen: Verbotene Runenkunst)
- Engine-Grundlage wird hier zum ersten Mal gebaut (Bedingungsprüfung +
  generischer Effekt-Dispatch, State-Erweiterung in `combatContext.js`).
- Alle Rune-Zauber auf das neue System umgestellt.
- Tests für die neuen Primitive.
- UI-Minimalversion für den neuen Status (mind. `getPlayerStatusViews()`
  gefüllt).
- **Go/No-Go-Gate**: `simulate_full_builds.js`-Balance-Check für die
  umgebaute Schule gegen die bisherigen RV-Zielbänder. Nur bei
  bestandenem Check geht es weiter zu Phase 1/2 — sonst zurück ins
  Grundprinzip.

### Phase 1 — Engine verallgemeinern
- Bedingungs-/Zähler-Typen ergänzen, die die Rune-Slice nicht abgedeckt
  hat (Präzision-Streaks, schulspezifische Bedingungen für Psionik/
  Chaosmagie/Seelenmagie/Biomantie).

### Phase 2 — Content-Rollout, schulweise mit Checkpoints
- Eine Schule nach der anderen (nicht alle fünf auf einmal), nach jeder
  Schule: `validate_data.py`, Testsuiten, kurzer Balance-Check.
- Abgleich gegen die Migrationstabelle aus Phase 0 (jeder alte
  Schild-/Krit-Touchpoint muss eine bewusste neue Entsprechung haben,
  nichts fällt kommentarlos weg).

### Phase 3 — Vollständige Balance-Neukalibrierung
- `simulate_full_builds.js` für alle 6 Schulen gegen die (ggf.
  angepassten) RV-Zielbänder.
- Volle Regressionsprüfung.

### Phase 4 — UI/VFX/Dokumentation
- `getPlayerStatusViews()` vollständig, neue Status-Icons über die
  bestehende Icon-Pipeline, Reward-System-Gewichtung falls nötig.
- `Combat_Formula_v2.md` → neue Version, `Combat_Identity_Matrix`
  aktualisiert, **Spell Authoring Checklist komplett neu geschrieben**
  (aktuelle Version dokumentiert die alten 7 Effekt-IDs als Kanon —
  wird mit diesem Umbau vollständig veraltet).

## Prozess-Empfehlung
Eigener Branch/Worktree statt direkt auf `main` — der Umbau ist über
mehrere Phasen hinweg instabil, bevor er wieder in einem sauberen,
spielbaren Zustand ist. **Umgesetzt (2026-07-23)**: Arbeit läuft im
Worktree `combat-condition-engine` (Branch `worktree-combat-condition-engine`).
Wichtiger Hinweis für künftige Sessions: der Worktree wurde vom letzten
gepushten Commit (`2e7ae80`) erstellt, NICHT vom damaligen
Arbeitsverzeichnis-Stand des Haupt-Checkouts — die Phase-0-Dokumente
(dieses Dokument + die Spec) existierten zu dem Zeitpunkt nur
uncommitted im Haupt-Checkout und mussten nachträglich manuell in den
Worktree kopiert werden. Für künftige größere Vorhaben: Docs vor dem
Erstellen eines Worktrees committen, um diesen Sync-Schritt zu vermeiden.

## Status
**Phase 0: abgeschlossen und bestätigt (2026-07-23).** Vollständige
Design-Spezifikation (Bedingungs-Vokabular, Datenstrukturen,
Next-Spell-Prep-Entscheidung, Migrationstabelle für alle 38 Zauber,
Umfangsklärung) in `docs/design/BattleMages_Combat_Condition_Engine_Spec.md`.
Zusatzentscheidung: volle Vereinheitlichung über Schild/Krit hinaus
(radikalste Lösung-3-Fassung) wird NICHT als Rewrite umgesetzt, sondern
als Designprinzip für neue Inhalte ab sofort — bestehende, bereits
funktionierende Mechaniken (Verwundbar, Sequence) bleiben unangetastet.
Ein offener Punkt bleibt markiert (`chaos_eruption`s Zufalls-Prep, kann
bis Chaosmagie-Rollout in Phase 2 warten).

**Phase 0.5: alle 9 Rune-Zauber migriert, Go/No-Go-Check bestanden
(2026-07-23).** Engine-Grundlage (`playerResistance`, `applyPlayerResistance`,
`gain_resistance`/`increase_resistance`-Effekte, `calculateResistanceGain`,
sequenzgebundener Widerstand-Schaden als Ersatz für Schild-Konsum) in
`combatContext.js`/`effectEngine.js`/`enemyEngine.js`/`spellEngine.js`/
`combatFormula.js`/`combatStatus.js` gebaut und mit 23 neuen Tests
verifiziert (End-to-End über `resolveSpellCast`, inkl. Krit-Auslösung,
Sequence-Bedingungen, Koexistenz mit dem noch aktiven klassischen
Schild-Pfad der übrigen 5 Schulen). Bestehende Suiten weiterhin grün
(16+28+19+23 = 86/86), `validate_data.py`/`validate_icons.py` ohne neue
Probleme.

**Balance-Signal (`simulate_full_builds.js`, Vorher/Nachher-Vergleich
innerhalb derselben Session):** Rune ging von 0-36 % Siegrate / RV
35-115 (historisch klar unter Zielband) auf **100 % Siegrate bei allen
drei geprüften Rangstufen, RV 129,7 → 157,1 → 179,2 — Rang 5 landet
sauber im Zielband "Durchschnittlicher Build" (160-190)**. Bestätigt
den Kern-Befund der ganzen Redesign-Diskussion empirisch: die
strukturelle Ursache (Schild verschwindet vor jedem Nutzen) ist durch
Magischen Widerstand tatsächlich behoben. Ehrlicher Vorbehalt: 100 %
Siegrate ist deutlich zu stark — erwartet, weil alle Zahlen bewusst
1:1 aus dem alten Schild-System übernommen wurden (keine Neubalancierung
in dieser Phase). Ein permanenter, nie konsumierter Wert in alter
Schild-Größenordnung ist zwangsläufig überstark. Echtes Retuning ist
Aufgabe von Phase 3, nicht dieser Phase.

**Zwei offene, bewusst nicht eigenmächtig entschiedene Design-Lücken:**
1. `shield_wall` Pfad A Rang 3 (`playerShieldFlatIncrease`, jetzt
   `playerResistanceFlatIncrease`) war schon vor der Migration
   wirkungslos (fehlender `increase_shield_percent`/`increase_resistance`-
   Eintrag im `effects[]`-Array). 1:1 als ebenso wirkungsloser Wert
   übernommen, nicht repariert.
2. `shield_breaker` Pfad B Rang 3 ("Kontrollierter Einschlag",
   `shieldConsumePercent`) hat unter permanentem Widerstand keine
   Entsprechung mehr (nichts wird mehr konsumiert) — Rang-3-Slot bewusst
   ohne Zusatzeffekt gelassen statt eines erfundenen Ersatzwerts.

**Nächster Schritt:** Go/No-Go-Entscheidung durch den Nutzer, dann
Phase 1 (Engine verallgemeinern) bzw. Phase 2 (restliche 5 Schulen).

**Phase 2, Zwischenstand (2026-07-23): Go/No-Go bestätigt, Biomantie/
Psionik/Chaosmagie/Seelenmagie migriert, nur Schatten steht noch aus.**

- **Biomantie**: alle 5 Zauber komplett (`bone_fracture`, `organ_failure`,
  `anatomy`, `bone_armor`, `blood_clot`).
- **Psionik**: 5/6 berührte Zauber migriert (`mind_barrier`, `mind_trap`
  Pfad B [bereits vorher wirkungslos, 1:1 übernommen]). `mind_strike`
  komplett neugestaltet (siehe unten). `mind_stream`/`mind_redirect`/
  `arcane_chain` brauchten keine Änderung.
- **Chaosmagie**: alle 5 Zauber. `chaos_catalyst`/`entropy`/`overload`
  reine Migration. `chaos_eruption` komplett neugestaltet auf
  ausdrücklichen Nutzerwunsch (siehe unten). `chaos_blade` brauchte
  keine Änderung.
- **Seelenmagie**: alle 5 Zauber. `soul_bind` (neue Formel
  `gainResistanceFromDealtDamage`, spiegelt `gainShieldFromDealtDamage`),
  `soul_cut`, `soul_pulse`, `soul_ward` reine Migration. `soul_spark`
  komplett neugestaltet (siehe unten).

**Zwei kreative Neugestaltungen auf explizite Nutzeranfrage** (kein reiner
Formalismus wie der Rest der Migration):

1. **`chaos_eruption`** — komplette Zufalls-Entfernung (Basis-Schadensbereich
   UND Pfad-B-Random-Prep). Neu: Basisschaden skaliert deterministisch mit
   eigener fehlender Lebensenergie (`damagePerMissingLifePercent`, neue
   Funktion `getMissingLifePercent`/`applyVulnerableIfMissingLifePercent`
   in `spellEngine.js`) statt Würfelwurf — "Chaos" jetzt als "abhängig vom
   eigenen Risiko" statt als Zufall ausgedrückt. Pfad B gewährt
   deterministisch Präzision (`nextSpellGuaranteedCrit`) statt eines
   zufälligen Bonus. **Wichtiger Fund**: `nextSpellRandomPrep`,
   `randomDamageMin`/`randomDamageMax` und
   `applyVulnerableOnMaxRandomDamage` werden dadurch von KEINEM Zauber
   mehr referenziert — toter Code in `spellEngine.js`/`combatFormula.js`,
   noch nicht entfernt (Nutzer-Entscheidung nötig, ob jetzt oder später).
2. **"Option B"-Redesign für `mind_strike`/`soul_spark`**: reine
   Selbst-Krit-Chance ohne eigenen Payoff wird zum Präzision-Generator für
   den nächsten Zauber (`nextSpellGuaranteedCrit`), nicht zur reinen
   Selbst-Chance. Beide Zauber vollständig neu durchdacht über alle
   Ränge/Pfade (nicht nur die Basis), da die alten Pfade strukturell auf
   der jetzt entfernten Selbst-Chance aufbauten.

**Bugfix, beim Testen gefunden (nicht Teil der ursprünglichen Migration,
aber durch sie aufgedeckt):** `nextSpellPrepRequiresVulnerable` prüfte
den Verwundbar-Status per Live-Check NACH der Effekt-Ausführung —
zu spät, weil `deal_damage` gegen ein verwundbares Ziel Verwundbar im
selben Cast bereits konsumiert. Betraf `organ_failure` Pfad B Rang 5
(bereits vor dieser Session vorhanden) und die neue
`soul_spark`-Neugestaltung gleichermaßen. Behoben durch eine
Cast-Start-Momentaufnahme (`cast.enemyWasVulnerableAtCast`,
`spellEngine.js`) statt eines Live-Checks. Verifiziert für beide Zauber.

Verifiziert: alle Syntax-Checks grün, bestehende Suiten weiterhin 86/86,
`validate_data.py` sauber, `simulate_full_builds.js` läuft für alle
migrierten Schulen durch (durchweg deutlich erhöhte Sieg-/RV-Werte,
konsistent mit dem bereits erwarteten "unretuned"-Befund aus Phase 0.5).

**`chaos_eruption`, zweiter Anlauf (2026-07-23):** Nutzer widersprach dem
ersten Entwurf (Skalierung mit eigener fehlender Lebensenergie) —
Fund bestätigt: diese Mechanik war ursprünglich für Blutmagie/Biomantie
gedacht (`docs/archive/blood_spec.md`), nicht für Chaosmagie, und wird
von keinem aktuellen Zauber genutzt. Neu, an "Chaosblitz" (World of
Warcraft) orientiert: **ignoriert gegnerischen Schild/Widerstand
vollständig** (`ignoreShield`, bereits vorhandener, bis dahin
ungenutzter Wert in `combatFormula.js`). Dafür neu gebaut: `ignoreShield`
als vergebbare Next-Spell-Prep-Eigenschaft (`nextSpellIgnoresShield` →
`prep.ignoreShield` → `cast.ignoreShieldFromPrep`, verdrahtet in
`combatPrep.js`/`spellEngine.js`) für Pfad B ("der nächste Zauber
ignoriert ebenfalls Schild/Widerstand"). Pfad A nutzt `vulnerableBonusDamage`
(bewusst ein bislang unberührter Wert, um nicht von den Basis-Rang-
Überschreibungen geklont zu werden — bekannte Eigenheit des
Merge-Systems, siehe Code-Kommentar). Verifiziert: Basis ignoriert
100 Gegner-Schild vollständig ohne ihn zu verbrauchen; Pfad-B-Prep
funktioniert nachweislich auch für einen komplett unabhängigen
Folgezauber (`bone_fracture` im Test). Bestehende Suiten weiterhin grün,
`simulate_full_builds.js` läuft für Chaosmagie durch.

**Phase 2 abgeschlossen — Schatten fertig, alle 6 Schulen migriert
(2026-07-23).** Letzte Schule: `precision_strike`/`death_stroke`
brauchten keine Änderung (reine Verwundbar-/Krit-Konsumenten, kein
Schild-/Chance-Bezug). `shadow_grasp`/`shadow_dance`/`shadow_mantle`/
`dark_blow` reine Werte-Migration (`critShieldGain`→`critResistanceGain`
etc.). `dark_blade` per Option B neu gestaltet (Präzision-Generator
statt Selbst-Chance) — Pfad A dabei ebenfalls neu gedacht
(`sequenceTrigger: "after_attack"` + `sequenceGuaranteedCrit` statt
weiterer Selbst-Chance-Stapelung), Pfad B unverändert gelassen (war
bereits als sich selbst tragende Verwundbar→Krit-Schleife entworfen,
brauchte die Selbst-Chance nie).

**Nachgetragen**: `will_break` gehört zu Psionik, nicht Schatten (eigener
Einordnungsfehler in einer früheren Zusammenfassung) — im selben
Aufwasch nach demselben Option-B-Muster wie `soul_spark` neu gestaltet
(Verwundbar-gated Präzision-Generator statt Selbst-Chance).

**Neuer Baustein**: `nextSpellResistanceBonus` als Next-Spell-Prep-Feld
(Gegenstück zu `nextSpellShieldBonus`) für `shadow_grasp` Pfad B und
`will_break` Pfad B nötig — `flatResistance` in
`createNextSpellPrep`/`applyNextSpellPrepToCast`/
`grantUniversalNextSpellPrep` ergänzt (`combatPrep.js`/`spellEngine.js`).

**Zwei weitere pre-existing Tooltip/Wert-Diskrepanzen gefunden (nicht
Teil dieser Migration, zunächst nicht repariert, nur geflaggt)**:
`death_stroke` Pfad A Rang 3 (`critFlatBonus: 90`, Tooltip nennt "+40")
und `dark_blow` Pfad A Rang 3 (`critFlatBonus: 55`, Tooltip nennt "+35")
— beide schon vor dieser Session vorhanden, unabhängig vom
Combat-Condition-Engine-Umbau. **Update Phase 3**: beide im Rahmen der
Balance-Neukalibrierung tatsächlich auf ihren Tooltip-Wert korrigiert
(90→40, 55→35), siehe Phase-3-Abschnitt unten — nicht mehr offen.

**`COMBAT_SCHOOLS`-Tags aktualisiert**: `shadow.rareMechanic` und
`star.rareMechanic` von `"shield"` auf `"resistance"` (jetzt beide
Schulen vollständig migriert, analog zu `rune.primaryMechanic` aus
Phase 0.5).

Verifiziert: `test_upgrade_resolver.js` hatte 8 Fehlschläge, weil sein
Referenzzauber (`shadow_mantle`) fest verdrahtete alte Werte
(`critShieldGain`) als Testerwartung nutzte — Fixture aktualisiert,
keine Logik-Änderung nötig. Alle 4 Suiten wieder grün (86/86),
`validate_data.py` sauber, `simulate_full_builds.js` läuft für alle 6
Schulen durch.

**Damit ist die komplette Spellbook-Migration (Phase 0.5 + Phase 2)
fertig.** Noch offen: Entscheidung zum toten `nextSpellRandomPrep`-Code,
Phase 1 (Engine verallgemeinern -- de facto schon erledigt, da jede
neue Bedingung/jeder neue Prep-Wert direkt beim Bedarf gebaut wurde,
nicht vorab spekulativ), Phase 3 (vollständige Balance-Neukalibrierung
-- zwingend nötig, alle Schulen zeigen deutlich überhöhte Sieg-/RV-Werte,
siehe eigener Abschnitt unten) und Phase 4 (UI/VFX/Doku, inkl.
`getPlayerStatusViews()` für Präzision).

## Phase 3 — Balance-Neukalibrierung (2026-07-23)

**Ausgangsproblem**: Magischer Widerstand war bis hierhin linear
implementiert (`Math.max(1, damage - resistance)`, siehe Phase 0). Das
lässt sich strukturell nicht gegen Stapelung balancieren — jeder feste
Wert, der bei niedriger Investition sinnvoll ist, macht den Spieler bei
mehreren kombinierten Widerstand-Quellen in derselben Rotation quasi
unverwundbar. Die volle `simulate_full_builds.js`-Auswertung zeigte
genau dieses Bild: alle 6 Schulen deutlich über den Zielbändern aus
`Combat_Formula_v2.md` (Durchschnittlicher Build 160–190, Synergischer
Build 220–260, Perfekt optimierter Build 300–360).

**Lösung: prozentuale Schadensreduktion mit abnehmendem Grenznutzen**
(`src/effectEngine.js`, `applyPlayerResistance`), Rüstungs-Formel-Muster
aus League of Legends/Dota/WoW statt linearem Abzug:

```
reductionPercent = resistance / (resistance + K)
finalDamage = floor(damageTaken * (1 - reductionPercent))
```

`K = RESISTANCE_MITIGATION_CONSTANT = 40` (Widerstandswert, der genau
50 % Reduktion ergibt — reiner Tuning-Wert). Die Kurve nähert sich
100 % nur asymptotisch an, macht den alten künstlichen
Mindestschaden-1 überflüssig, und jede weitere Widerstand-Investition
bleibt spürbar, aber mit sinkendem Grenzertrag. Diese Formel-Änderung
allein (ohne eine einzige Zauberwert-Änderung) hat die Balance bei
fast allen Schulen bereits deutlich in Richtung Zielband korrigiert.
5 neue Regressionstests in `tools/test_combat_formula.js` decken die
Formel ab (inkl. Grenzfall 0 Widerstand, hoher Widerstand, Nicht-
Konsumption, 0 Schaden).

**Verbleibender Ausreißer: Schatten.** Root Cause: `dark_blade` und
`shadow_grasp` gewähren beide bedingungslos bei jedem Cast Präzision
(garantierter Krit) für den nächsten Zauber — das läuft in derselben
5-Zauber-Rotation direkt in `death_stroke` (Finisher mit großem
flachem Krit-Bonus + Folgehit) und `shadow_dance` (Doppelhit, beide
Treffer kritfähig). Diese beiden Finisher kritten dadurch praktisch
in jeder Runde zuverlässig — eine Verlässlichkeit, für die ihre
ursprüngliche (chance-basierte) Tunung nie ausgelegt war. Statt eines
weiteren Mechanik-/Formel-Eingriffs wurde gezielt an den beiden
"Empfänger"-Zaubern nachjustiert (`data/spellUpgradeProfiles.js`):

- `death_stroke` Pfad A Rang 3: `critFlatBonus` 90 → 40 (korrigiert
  auf den eigenen, schon vorher bestehenden Tooltip-Wert "+40" —
  siehe oben, die überhöhte Zahl war ein Mitverursacher der
  Übertunung).
- `death_stroke` Rang 4 (Basis): `damage` 65 → 50.
- `death_stroke` Pfad A Rang 5: `critFollowUpPercent` 50 % → 30 %
  (Tooltip entsprechend angepasst).
- `dark_blow` Pfad A Rang 3: `critFlatBonus` 55 → 35 (ebenfalls auf
  eigenen Tooltip-Wert "+35" korrigiert).
- `shadow_dance` Rang 4 (Basis): `damage` 45 → 40.

Damit landet Schatten bei Rang 5 wieder auf RV 292 (vorher 478),
konsistent mit dem eigenen Vor-Session-Ausgangswert der Schule
(~275–329, vor jeglichem Combat-Condition-Engine-Umbau).

**Finale Simulationsergebnisse** (`tools/simulate_full_builds.js`,
Rang 1 Basis / Rang 3 Pfad A / Rang 5 Pfad A, Sieg-% / Ø-RV):

| Schule | Rang 1 | Rang 3 | Rang 5 |
|---|---|---|---|
| Biomantie | 12 % / 79,4 | 42 % / 131,1 | 54 % / 186,6 |
| Schatten | 36 % / 131,0 | 58 % / 179,1 | 75 % / 292,2 |
| Psionik | 26 % / 93,0 | 48 % / 157,2 | 80 % / 183,4 |
| Verbotene Runenkunst | 52 % / 74,5 | 61 % / 117,9 | 100 % / 179,3 |
| Chaosmagie | 34 % / 119,6 | 60 % / 238,4 | 76 % / 346,3 |
| Seelenmagie | 11 % / 73,0 | 43 % / 152,9 | 76 % / 210,9 |

Alle Rang-5-Werte liegen im oder nahe am Zielband; Chaosmagie
(Perfekt-Band, plausibel für eine aggressive Burst-Schule) und Rune
(100 % Sieg bei Rang 5, vertretbar angesichts der defensiven
Schulidentität) sind bewusst am oberen Rand, nicht fehlerhaft im
Sinne von "kaputt". Rune-Basis (52 %) und Chaosmagie-Rang-3 (238,4,
oberes Ende Synergischer Build) sind die einzigen Werte, die bei
zukünftigem echtem Playtesting zuerst gegengeprüft werden sollten.

**Offene Anomalie (nicht behoben, niedrige Priorität)**: die
Multischule-Vergleichsbuild Seelenmagie+Biomantie zeigt bei Rang 5
einen nicht-monotonen Einbruch (RV 132,3, unter Rang 3s 189,5). Nicht
root-caused — sekundärer Vergleichsbuild, keine der 6 primären
Schulen, daher zurückgestellt statt sofort verfolgt.

**Verifiziert**: alle 4 Test-Suiten grün (`test_combat_formula.js` 21,
`test_enemy_engine.js` 28, `test_upgrade_resolver.js` 19,
`test_reward_system.js` 23 — 91/91), `validate_data.py` sauber (gleiche
zwei lange bekannte, unabhängige Validator-Bugs wie zuvor).

Geänderte Dateien: `src/effectEngine.js` (Formel),
`data/spellUpgradeProfiles.js` (5 Zauberwerte, siehe oben),
`tools/test_combat_formula.js` (5 neue Tests).

Noch offen (nicht Teil von Phase 3): Entscheidung zum toten
`nextSpellRandomPrep`-Code, die drei pre-existing inerten Rang-3-Werte
(`shield_wall`/`bone_armor`/`mind_barrier` Pfad A), die zwei
Content-Lücken ohne mechanisches Widerstand-Äquivalent
(`shield_breaker` Pfad B Rang 3, `soul_cut` Pfad A Rang 5), die
Multischule-Anomalie oben, und Phase 4 (UI/VFX/Doku).
