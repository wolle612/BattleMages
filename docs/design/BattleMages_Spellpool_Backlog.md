# BattleMages — Spellpool-Backlog (Zauber-Slots, noch ohne Werte/Namen)

> Ergebnis der Spellpool-Analyse vom 2026-07-24 (siehe Chat-Verlauf,
> keine eigene Roadmap-Datei für dieses Thema). Diese Liste beschreibt
> **Slots** — welche Rolle/Mechanik/Schule ein künftiger Zauber
> einnehmen sollte, damit er einen echten Design-Zweck erfüllt — nicht
> fertige Zauber. Keine Werte, keine Namen, keine Tooltips. Dient als
> Arbeitsgrundlage für eine spätere Design-Session, in der jeder Slot
> die volle Checkliste aus `BattleMages_Spell_Authoring_Checklist.md`
> bzw. CLAUDE.md ("Design neuer Zauber") durchläuft.

## Ausgangsbefund

Von 15 definierten Build-Archetypen (`BUILD_ARCHETYPES`,
`data/combatIdentity.js`) haben vier nur einen einzigen Zauber und zwei
gar keinen:

| Archetyp | Aktuell belegt von | Problem |
|---|---|---|
| `sustain` | — | weiterhin 0 Zauber, zurückgestellt (Slot 1) |
| `kontrollierter_schaden` | `bound_chaos` (Chaosmagie) | ✅ Slot 2 umgesetzt |
| `verwundbar_ketten` | `organ_failure` (Finisher), `keen_cut` (Schatten) | ✅ Slot 3 umgesetzt |
| `sequenz` | `shadow_dance` (Schatten), `soul_resonance` (Seelenmagie) | ✅ Slot 4 umgesetzt |
| `monoschule` | `purity` (Rune) | einziger Vertreter |
| `hybrid` | `rune_break` (Rune) | einziger Vertreter |

Diese Liste schlägt für die vier dringlichsten Fälle (`sustain`,
`kontrollierter_schaden`, `verwundbar_ketten`, `sequenz`) je einen
Slot vor. `monoschule`/`hybrid` bewusst nicht aufgenommen — niedrigere
Priorität, siehe Chat.

---

## Slot 1 — Sustain-Verstärker (zurückgestellt)

- **Status (2026-07-24):** zurückgestellt, nicht umgesetzt. Beim
  Durchsprechen stellte sich heraus, dass Heilung im Kampf aktuell
  komplett fehlt (`healPlayer` in `combatFormula.js` existiert, wird
  aber nirgends aufgerufen — toter Code) — ein einzelner Zauber wäre
  zu dünn, um eine komplett neue Mechanik zu tragen. Entweder mehrere
  Sustain-Zauber auf einmal (größerer Umfang) oder vorerst bei den
  anderen drei Slots bleiben, die bestehende Mechaniken rekombinieren
  statt eine neue einzuführen.
- **Archetyp:** `sustain`
- **Schule (Optionen):** Seelenmagie (passt zur "Mechaniken
  verbinden"-Identität) oder Biomantie (Körper-Regeneration passt zur
  Fantasy)
- **Rolle:** Verstärker
- **Design-Zweck:** Heilung/Selbsterhalt an eine bereits bestehende
  Mechanik koppeln (z. B. Heilung proportional zu verursachtem
  Schaden, oder Heilung gekoppelt an vorhandenen Magischen Widerstand)
  — damit Sustain kein Fremdkörper wird, sondern eine echte Erweiterung
  bestehender Systeme, kein neuer Ressourcentyp.
- **Design-Frage, die er aufwerfen soll:** "Baue ich auf Überleben
  über viele Runden statt auf schnellen Sieg?"
- **Ersetzt keine bestehende Karte, weil:** aktuell gibt es überhaupt
  keinen Heilungs-Zugang außerhalb der vollen Heilung zwischen
  Kämpfen — das wäre der erste In-Combat-Sustain-Baustein.

## Slot 2 — Kontrollierter-Schaden-Verstärker — ✅ umgesetzt

- **Status (2026-07-24):** umgesetzt als `bound_chaos` ("Gezügeltes
  Chaos", Chaosmagie, Rare, Verstärker). Rune verworfen (bereits 9
  Zauber, größtes Übergewicht im Spellbook) — Chaosmagie passt
  zusätzlich zur eigenen Schulbeschreibung "Hoher Druck, kontrolliertes
  Risiko" und wächst den kleineren Pool (5→6).
- **Archetyp:** `kontrollierter_schaden`
- **Design-Zweck:** ein Cast, der in **derselben Aktion** spürbaren
  Schaden UND Widerstand liefert, ohne dass eine Seite dominiert —
  Mittelweg-Option für Spieler, die sich weder auf reinen Burst noch
  auf reine Verteidigung festlegen wollen.
- **Ersetzt keine bestehende Karte, weil:** die existierenden
  Widerstand-Schaden-Hybriden (z. B. `soul_cut`, `chaos_catalyst`)
  skalieren Schaden AUS Widerstand — dieser Slot liefert beides
  UNABHÄNGIG in einem Cast, ein anderes Verhältnis.

## Slot 3 — Verwundbar-Ketten-Verstärker — ✅ umgesetzt

- **Status (2026-07-24):** umgesetzt als `keen_cut` ("Findiger
  Schnitt", Schatten, Common, Verstärker). Biomantie verworfen (schon
  mehrere sehr ähnliche Verwundbar-Zauber, ein weiterer hätte kaum
  Abwechslung gebracht) — Schatten hatte bislang nur einen
  pfadgebundenen Verwundbar-Zauber, passenderer Ort für echte
  Vertiefung. Mechanik an die Schulidentität angepasst
  (`critAppliesVulnerable` statt bedingungsloser Anwendung, synergiert
  mit den vorhandenen Präzision-Generatoren).
- **Nebenfund dabei**: `organ_failure`s eigene "erneut anwenden"-Kern-
  fähigkeit griff nie (Live-Check-Timing-Bug, gleiche Ursache/Lösung
  wie bei Präzision) — gefixt, siehe Commit `3a59cb0`.
- **Archetyp:** `verwundbar_ketten`
- **Design-Zweck:** hält Verwundbar aktiv oder erneuert es, statt es
  nur einmalig auszulösen — baut die Brücke zwischen einem frühen
  Verwundbar-Erzeuger und dem `organ_failure`-Finisher.
- **Ersetzt keine bestehende Karte, weil:** kein Schatten-Zauber
  verband bislang Verwundbar-Bonusschaden mit Krit-getriggerter
  Kettenfortsetzung.

## Slot 4 — Sequenz-Vertiefung — ✅ umgesetzt

- **Status (2026-07-24):** umgesetzt als `soul_resonance`
  ("Seelenresonanz", Seelenmagie, Common, Verstärker). Weder Schatten
  noch Psionik gewählt: Schatten stand nach den heutigen Ergänzungen
  bereits bei 8 von 40 Zaubern (nur 1 hinter Rune) — dieselbe
  Häufungs-Problematik wie bei Slot 2/3 wäre wiederholt worden.
  Seelenmagie schließt stattdessen eine seit Langem in
  `COMBAT_SCHOOLS` dokumentierte, nie eingelöste Identitätslücke
  (`primal.rareMechanic: "sequence"`, zuvor 0 Zauber).
- **Die befürchtete Mehrschritt-Ketten-Frage stellte sich nicht**:
  `shadow_dance` (und damit der gesamte `sequenz`-Archetyp) prüft wie
  alle Sequenz-Zauber im Spiel ausschließlich den unmittelbar letzten
  Cast — keine Abweichung von der bestehenden Regel nötig.
- **Archetyp:** `sequenz`
- **Design-Zweck:** Schaden + Widerstand, wenn zuvor ein Zauber einer
  anderen Schule gewirkt wurde (`sequenceTrigger: "different_school"`,
  bereits vollständig implementiertes Vokabular, zuvor nur in Psionik
  genutzt) — belohnt bewusstes Schulwechseln, passend zu Seelenmagies
  eigener Identität als Verbindungsschule.
- **Ersetzt keine bestehende Karte, weil:** kein Seelenmagie-Zauber
  nutzte zuvor irgendeinen Sequenz-Trigger.

## Verknüpfung zum Startauswahl-Thema — eingelöst

Slot 2 landete in Chaosmagie (5→6 Zauber), Slot 4 in Seelenmagie
(5→6 Zauber) — beide aus der Startauswahl-Analyse zurückgestellten
"soll der Pool wachsen"-Fragen sind damit nebenbei mit gelöst, ohne
eigene Content-Initiative.

## Status: alle vier Slots bearbeitet (2026-07-24)

Drei umgesetzt (`bound_chaos`, `keen_cut`, `soul_resonance`), Slot 1
(Sustain) bewusst zurückgestellt (siehe oben). Auffällig im Rückblick:
bei allen drei umgesetzten Slots wich die tatsächliche Schulwahl von
der ursprünglichen Erstidee im Backlog ab — jedes Mal, weil ein
genauerer Blick auf die aktuelle Schulgröße oder eine übersehene,
bereits dokumentierte Identitätslücke (`rareMechanic`) eine bessere
Passung ergab. Für künftige Slots lohnt sich dieser Zwischenschritt
("Schulgröße + COMBAT_SCHOOLS-Vokabular gegenprüfen, bevor die
Erstidee umgesetzt wird") offenbar grundsätzlich.

## Nicht Teil dieser Liste

- `monoschule`/`hybrid` (je 1 Zauber) — niedrigere Priorität, siehe
  Chat-Begründung.
- Konkrete Werte, Namen, Tooltips, Icon-Bedarf — folgt erst, wenn ein
  Slot tatsächlich bearbeitet wird, dann über die volle Checkliste aus
  CLAUDE.md ("Design neuer Zauber").
