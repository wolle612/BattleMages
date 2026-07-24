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
| `sequenz` | `shadow_dance` (Schatten) | einziger Vertreter, Epic (spät im Run) — Slot 4 noch offen |
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

## Slot 4 — Sequenz-Vertiefung

- **Archetyp:** `sequenz`
- **Schule (Optionen):** Schatten oder Psionik (beide laut
  `Combat_Identity_Matrix_v1.0.md` "hohe Sequenz"-Schulen)
- **Rolle:** Verstärker
- **Design-Zweck:** belohnt eine **längere** bewusste Zauberreihenfolge
  statt nur den unmittelbar letzten Zauber (aktuelle Sequenzregel prüft
  laut `Combat_Formula_v2.md` ausschließlich den direkten Vorgänger,
  "keine längeren Ketten") — würde das Sequenz-System um eine neue
  Tiefe erweitern, nicht nur wiederholen.
- **Design-Frage:** "Baue ich eine mehrstufige Zauberreihenfolge auf,
  die sich erst nach mehreren aufeinanderfolgenden Casts auszahlt?"
- **Achtung:** das ist die einzige Idee hier, die potenziell über die
  bestehende Sequenzregel hinausgeht (echte Mehrschritt-Kette statt
  Ein-Schritt-Prüfung) — müsste vor der Umsetzung explizit gegen
  `Combat_Formula_v2.md` ("Keine längeren Ketten") abgeglichen werden,
  da das eine bewusste Design-Grundregel berührt, nicht nur ein
  Content-Slot ist.

## Verknüpfung zum Startauswahl-Thema — teilweise eingelöst

Slot 2 ist tatsächlich in Chaosmagie gelandet (5→6 Zauber) — löst die
aus der Startauswahl-Analyse zurückgestellte "soll der Pool wachsen"-
Frage für diese Schule mit. Seelenmagie (Slot 1, zurückgestellt)
bleibt bei 5 Zaubern, diese Verknüpfung steht also noch aus.

## Nicht Teil dieser Liste

- `monoschule`/`hybrid` (je 1 Zauber) — niedrigere Priorität, siehe
  Chat-Begründung.
- Konkrete Werte, Namen, Tooltips, Icon-Bedarf — folgt erst, wenn ein
  Slot tatsächlich bearbeitet wird, dann über die volle Checkliste aus
  CLAUDE.md ("Design neuer Zauber").
