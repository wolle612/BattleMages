```
BattleMages – Combat Identity Matrix (v1.0)
```

```
DESIGN VISION
```

```
BattleMages ist kein Spiel über Zauberschulen. BattleMages ist ein Spiel
über Build-Archetypen.
```

```
Die Schulen liefern die Fantasy. Die Mechaniken liefern den Build. Die
Zauberrollen liefern die Funktion. Die Sequenz liefert die Optimierung.
```

```
========================================
```

## `UNIVERSELLE MECHANIKEN` 

- `Magischer Widerstand (Update 2026-07-23, vormals "Schild") Permanente Defensiv-Ressource, nie konsumiert. Kann aufgebaut, verstärkt oder offensiv genutzt werden (Schaden skaliert mit Widerstandshöhe).` 

- `Verwundbar Temporärer Debuff. Nicht stackbar. Erhöht erhaltenen Schaden.` 

```
-   Krit Universeller Schadensmultiplikator. Kann aufgebaut, verstärkt
    oder gezielt ausgenutzt werden.
```

- `Präzision (Update 2026-07-23) Deterministische Krit-Variante: garantierter kritischer Treffer für den nächsten Zauber statt einer Chance.` 

```
========================================
```

```
UNIVERSELLE ZAUBERROLLEN
```

- `Generator` 

- `Verstärker` 

- `Finisher` 

- `Utility` 

- `Build-Enabler` 

```
========================================
```

## `SEQUENZ-SYSTEM` 

```
Sequenzen sind keine Mechanik, sondern ein Optimierungssystem.
```

```
Maximal ca. 25 % aller Zauber besitzen Sequenz-Effekte.
```

```
Typische Trigger: - nach Schutz - nach Angriff - gleiche Schule -
unterschiedliche Schule
```

```
========================================
```

```
COMBAT IDENTITY MATRIX
```

```
Biomantie - Gameplay: Den Körper systematisch zerstören. - Primär:
Verwundbar - Sekundär: Hybrid - Selten: Krit
```

```
Schatten - Gameplay: Präzision, Tempo und kritische Treffer. - Primär:
Krit - Sekundär: Sequenz - Selten: Widerstand
```

```
Psionik - Gameplay: Kontrolle und Manipulation. - Primär: Hybrid -
Sekundär: Sequenz - Selten: Burst
```

```
Verbotene Runenkunst - Gameplay: Stabilität und Kontrolle. - Primär:
Widerstand - Sekundär: Utility - Selten: Krit
```

```
Chaosmagie - Gameplay: Hoher Druck, kontrolliertes Risiko. - Primär:
Burst - Sekundär: Hybrid - Selten: Widerstand
```

```
Seelenmagie - Gameplay: Mechaniken verbinden. - Primär: Hybrid -
```

```
Sekundär: Sustain - Selten: Sequenz
```

```
Hinweis (2026-07-22, empirisch bestätigt via tools/simulate_full_builds.js):
Seelenmagie besitzt bewusst keinen Generator und keinen Finisher. Jeder Zauber
der Schule verbindet zwei Mechaniken (z. B. Schaden<->Schild, Verwundbar->Schild,
Verwundbar->Krit, Krit->Schild) und setzt externen Input aus einer anderen
Schule voraus (meist Verwundbar oder Schild). Das ist keine Lücke, sondern die
direkte Konsequenz der eigenen Gameplay-Identität "Mechaniken verbinden" --
Seelenmagie ist als Multischule-Verbindungsschule konzipiert, nicht für
Monoschule-Solospiel. Messung: eine reine Seelenmagie-Rotation bleibt schwach
(Rang 5: 46 % Siegquote), ein einziger getauschter Verwundbar-Generator aus
einer anderen Schule hebt dieselbe Rotation auf 69 % Siegquote.
```

```
========================================
```

```
MECHANIK-VERTEILUNG
```

```
Widerstand (Update 2026-07-23, vormals "Schild"): - Hauptschule:
Runenkunst - Nebenschulen: Seelenmagie, Psionik, Biomantie
```

```
Verwundbar: - Hauptschule: Biomantie - Nebenschulen: Schatten, Psionik,
Seelenmagie
```

```
Krit: - Hauptschule: Schatten - Nebenschulen: Chaosmagie, Biomantie,
Seelenmagie
```

```
Hybrid: - Hauptschule: Seelenmagie - Nebenschulen: Psionik, Chaosmagie,
Biomantie
```

```
========================================
```

```
SEQUENZ-VERTEILUNG
```

```
Hoch: - Schatten - Psionik
```

```
Mittel: - Verbotene Runenkunst
```

```
Niedrig: - Biomantie - Seelenmagie
```

```
Sehr niedrig: - Chaosmagie
```

```
========================================
```

```
BUILD-ARCHETYPEN
```

- `Widerstandsfestung` 

- `Widerstandskanone` 

- `Widerstand/Krit` 

```
(Update 2026-07-23: vormals Schildfestung/Schildkanone/Schild-Krit --
die drei Archetyp-IDs `schildfestung`/`schildkanone`/`schild_krit`
(`data/combatIdentity.js`, `BUILD_ARCHETYPES`) referenzierten noch die
alte Schild-Mechanik und wurden auf `widerstandsfestung`/
`widerstandskanone`/`widerstand_krit` (`focus: ["resistance", ...]`)
umbenannt, um mit dem Rest des Vokabulars konsistent zu sein. Rein
interne Design-/Balance-IDs, nie spielersichtbar -- alle
`build:`-Referenzen in `data/spellbookCore.js`/`spellbookPart2.js`
mitgezogen.)
```

- `Verwundbar-Burst` 

- `Verwundbar-Ketten` 

- `Kritmaschine` 

- `One-Shot` 

- `Krit/Verwundbar` 

- `Sustain` 

- `Monoschule` 

- `Multischule` 

- `Sequenz` 

- `Hybrid` 

- `Burst` 

- `Kontrollierter Schaden` 

```
========================================
```

## `DESIGNREGELN` 

`1.  Jeder Zauber beantwortet: Öffne ich einen Build oder verbessere ich einen bestehenden?` 

`2.  Ein Zauber besitzt höchstens zwei Synergien.` 

`3.  Tooltips bleiben kurz.` 

`4.  Mechaniken sind universell.` 

`5.  Schulen liefern Fantasy, nicht Mechaniken.` 

`6.  Sequenzen optimieren Builds, definieren sie aber nicht.` 

`7.  Jeder Build braucht mindestens:` 

- `einen Generator` 

- `einen Verstärker` 

- `einen Finisher` 

`8.  Support-Zauber dürfen niemals nur schlechtere Versionen anderer Zauber sein.` 

```
========================================
```

## `OBERSTE DESIGNREGEL` 

```
Jeder Zauber muss den Spieler auf genau eine interessante Frage bringen.
```

```
Beispiele: - Wie bekomme ich mehr Schild? - Wie halte ich Verwundbar
aktiv? - Wie sichere ich kritische Treffer? - Wie optimiere ich meine
Zauberleiste? - Welche Schule kombiniere ich als Nächstes?
```

```
Nicht: ‘Was macht dieser Zauber eigentlich alles?’
```

```
Ein einzelner Zauber soll einfach zu verstehen sein. Die Tiefe entsteht
erst durch die Kombination vieler einfacher Zauber.
```

