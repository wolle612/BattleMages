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
Noch nicht committet.
