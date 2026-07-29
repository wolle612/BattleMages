# BattleMages — Balancing-Sprint (2026-07-28)

> Vereinbart am Ende der Meta-Progression-Roadmap (siehe
> `BattleMages_Meta_Progression_Concept_v1.md`, Abschnitt "Baustein E
> verworfen"): mindestens ein Mono-Schul-Build verlor damals selbst auf
> Maximalrang gegen die letzten Kämpfe — das hätte u.a. die
> Legendary-Meilensteine aus Baustein C für manche Schulen praktisch
> unerreichbar gemacht. Dieser Sprint prüft alle Builds (nicht nur
> Mono) und die Gegner-Stärke ganzheitlich.

## Methode

Kein `node` im Environment verfügbar (`tools/simulate_full_builds.js`
lief daher nicht direkt) — dieselbe Logik wurde im Browser gegen die
echte, geladene Engine nachgebaut (Edge headless über Chrome DevTools
Protocol, `Runtime.evaluate` gegen `simulateFight()`). 11 Builds (6
Mono-Schule + 5 realistische Misch-Rotationen, u.a. unter Verwendung
der neuen Baustein-D/Legendary-Zauber) × 3 Rang-Stufen (1/3/5) × alle
12 Gegner, mehrere tausend simulierte Kämpfe insgesamt.

**Wichtige Methodik-Lektion unterwegs**: ein Zwischenstand zeigte
scheinbar widersprüchliche Ergebnisse (derselbe Build gewann in einem
isolierten Test 100 %, im großen Sammel-Testlauf 0 %). Ursache war
kein Balancing-Problem, sondern zwei Infrastruktur-Fallstricke:
Browser-HTTP-Caching servierte zwischenzeitlich alte JS-Dateien trotz
Server-Neustart (behoben über `Network.setCacheDisabled` + frische
Edge-Profile), und ein echter Absturz (siehe Bugfix unten) hinterließ
die Seite in einem Zustand, der nachfolgende Tests in derselben
Sitzung verfälschte. Für belastbare Zahlen: pro Build eine frische
Seiten-Navigation.

## Befund 1 (Analyse-Phase): Kampf 10-12 als harte Wand

Bei Rang 5 gewannen ursprünglich nur 2 von 11 Builds den Boss
zuverlässig; 9 von 11 verloren zu 100 %. Ursache lag **nicht** an zu
hoher Gegner-HP, sondern am **Rundenschaden**: der Gegner handelt in
`simulateFight()` einmal pro gewirktem Spielerzauber (5× pro Runde bei
einer 5er-Rotation). Boss, Der Namenlose und Fleischformer richteten
dadurch 140–240 Schaden *pro Runde* an — weit über die fixen 120
Spieler-HP. Jeder Build ohne dedizierte Widerstands-Investition starb
faktisch in Runde 1, unabhängig von seinem eigenen Schadensoutput.

## Befund 2: echter Absturz-Bug, kein Balancing-Problem

Beim Verifizieren fiel ein Absturz in `src/upgradeResolver.js:148`
auf (`resolveSpellEffects`): `profile.paths[path]` griff ungeprüft auf
`.paths` zu. Jeder bisherige Zauber mit Rang-Profil hatte immer auch
`.paths` definiert — die 15 neuen Meta-Progression-Zauber (bewusst nur
mit Rang-2-Eintrag, ohne Pfade, siehe Baustein D/C) waren die ersten,
die das aufdeckten. Crasht bei Rang ≥3 ohne Pfad — hätte auch echte
Spieler getroffen, sobald einer dieser Zauber im echten Spiel Rang 3
erreicht. **Fix**: `profile.paths?.[path]` (ein Zeichen, `?.` statt
`.`), passend zum bereits etablierten defensiven Stil an den
Nachbarstellen derselben Datei.

## Umgesetzte Änderungen

### Gegner-Daten (`data/enemies.js`)
- **Text/Wert-Korrekturen** (keine Balance-Änderung): Runenketzer-Beschreibung
  40→35 Schild (Code-Wert war schon 35), Chaosgeborener-Beschreibung
  -20→-15 Schaden (Code-Wert war schon 15).
- **Fleischformer (#10)**: passive Heilung 50→30, aktive Heilung
  (`flesh_heal`) 70→45, Grundangriffe (`flesh_strike`/`_repeat`)
  35→24, `flesh_crush` 70→42.
- **Der Namenlose (#11)**: Schild-Strafe bei <2 Mechaniken 20→12,
  Grundangriffe (`nameless_strike`/`_repeat`) 40→24, `nameless_crush`
  75→42.
- **Boss (#12)**: HP 900→800, `arcane_bolt`/`_repeat` 35→16, alle 6
  Schultechniken um ca. 30-55 % gesenkt, `grand_spell` 72→32.

### Zauber-Daten (`data/spellUpgradeProfiles.js`)
- **Bestandszauber unangetastet.** Diagnose ergab, dass die
  scheinbare Schwäche einiger Mono-Builds größtenteils auf
  Test-Methodik zurückging (einheitliche Pfad-A-Wahl, nicht
  synergetisch geordnete Test-Rotationen), nicht auf zu niedrige
  Werte. Mono-Seelenmagie ist zudem *bewusst* nicht
  eigenständig lebensfähig — dokumentierte Design-Entscheidung
  (`BattleMages_Spell_Authoring_Checklist.md`, Abschnitt 0), keine
  Lücke.
- **15 neue Zauber** (Baustein D + Legendary) erhielten zunächst nur
  einen einfachen Rang-2-Eintrag (+~20 % Hauptwert) — bewusster
  Zwischenstand, siehe Nachtrag "Vollständige Rang-3-5-Pfade" unten,
  der diese Lücke geschlossen hat.

## Ergebnis (vorher/nachher, Rang 5, alle 11 Builds)

| Kampf | Vorher (Anzahl Builds bei 100 %) | Nachher |
|---|---|---|
| #10 Fleischformer | 3 von 11 | **11 von 11** |
| #11 Der Namenlose | 2 von 11 | **11 von 11** |
| #12 Boss | 2 von 11 | **10 von 11** (Schatten mono: 24 %) |

Gesamt-Siegquote über alle 12 Kämpfe (Rang 5): vorher 53–100 % je nach
Build (mehrere komplett unmögliche Einzelkämpfe darin versteckt),
nachher durchgehend 84,7–100 % ohne einen einzigen 0 %-Ausreißer.
Reines Schatten-Mono bleibt beim Boss die anspruchsvollste
Kombination (24 %) — plausibel, da diese Rotation praktisch keinen
Magischen Widerstand aufbaut; eine Schul-Mischung behebt das, wie es
für eine bewusst gewählte Mono-Schul-Herausforderung auch angemessen
ist.

## Nicht angefasst / bewusst zurückgestellt

- Drei Gegner-Passiven (#3, #6, #9) laufen ohne `rules[]`-Eintrag rein
  über generische Werte-Auswertung — Architektur-Inkonsistenz zu den
  anderen 9 Gegnern, aber kein Balance-Problem. Nicht angefasst, siehe
  CLAUDE.md "Nichts ohne Rücksprache verändern, wenn eine
  Inkonsistenz auffällt".
- Kämpfe 1-9: keine Änderungen, liefen in der Simulation bereits
  durchgehend gut.
## Nachtrag (2026-07-28): Vollständige Rang-3-5-Pfade für die 15 neuen Zauber

Die 9 Baustein-D- und 6 Legendary-Zauber hatten bis hierhin nur den
vereinfachten Rang-2-Ausgleich. Nachträglich vollständig auf das
Niveau der 41 Bestandszauber gebracht: je zwei Pfade (A/B) mit Rang 3
(neue Zusatzmechanik) und Rang 5 (Eskalation), plus Rang 4
(Hauptwert-Bump) — exakt das in `Combat_Formula_v2.md`
("Upgrade-System") beschriebene Schema.

**Vorgehen**: mehrere vollständige Bestandszauber-Profile
(`bone_fracture`, `dark_blade`, `mind_strike`, `entropy`, `overload`,
`soul_resonance`, `soul_spark`, `soul_ward`) im Detail gelesen, um das
Vokabular und die Eskalationslogik zu extrahieren, statt sie zu
erfinden — alle 15 neuen Pfade nutzen ausschließlich Werte-Schlüssel,
die dort bereits produktiv im Einsatz sind (u.a. `sequenceGuaranteedCrit`,
`critAppliesVulnerable`, `vulnerableGuaranteedCrit`,
`nextSpellCritDamageBonus`, `nextSpellPrepCharges`, `sequenceRepeatHits`,
`resistanceBonusDamageCritMultiplier`, `resistanceGainIfPlayerHasResistance`,
`resistanceFromDealtDamagePercent`). Keine neue Engine-Logik.

**Tooltip-Konvention beachtet**: Pfad-Zeilen vermeiden bewusst die
wörtlichen Muster „verursacht \d"/„erhalte \d" als Satzanfang (sonst
behandelt `getSpellTooltipLines()` sie als Vollersatz statt als
Ergänzung, siehe bestehender Kommentar bei `soul_resonance`) — stattdessen
durchgängig „zusätzlich"/„gewähren"/„erhältst"-Formulierungen.

**Verifiziert**: alle 15 Zauber über Rang 1-5 × Pfad A/B fehlerfrei
aufgelöst (150 Kombinationen, `getSpellTooltipView`/`getSpellRankValues`),
`getPathChoiceOptions()` liefert korrekt beide Pfade beim Rang-2→3-
Übergang. Balance-Nachtest mit echten Rang-5-Pfaden (nicht mehr nur
Rang 2) auf 10 Build-Kombinationen: RV überwiegend im „Synergisch"-
bis „Perfekt"-Band (220-360), Siegquoten 84-100 %. Ein Ausreißer
gefunden und korrigiert: Chaosmagie + Vernichtung (Pfad B,
„Kettenvernichtung") lag mit RV ~451 spürbar über dem Perfekt-Band —
`sequenceDamageBonus` bei Rang 5 von 35 auf 22 reduziert. Restliche
Abweichung (Chaosmagie+Legendary Pfad B: RV ~440, Siegquote nur 91 %
statt 100 %) bewusst belassen — ein sich selbst limitierender
Hochrisiko-Ausreißer, der zur eigenen Schulbeschreibung Chaosmagies
("Hoher Druck, kontrolliertes Risiko") passt, keine dominante
Strategie ohne Nachteil.
