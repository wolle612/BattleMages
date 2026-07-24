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
| `sustain` | — | 0 Zauber, reine Vokabel |
| `kontrollierter_schaden` | — | 0 Zauber, reine Vokabel |
| `verwundbar_ketten` | `organ_failure` (Biomantie) | einziger Vertreter wurde gerade zum Finisher umgewidmet — der Verstärker-Unterbau fehlt jetzt |
| `sequenz` | `shadow_dance` (Schatten) | einziger Vertreter, Epic (spät im Run) |
| `monoschule` | `purity` (Rune) | einziger Vertreter |
| `hybrid` | `rune_break` (Rune) | einziger Vertreter |

Diese Liste schlägt für die vier dringlichsten Fälle (`sustain`,
`kontrollierter_schaden`, `verwundbar_ketten`, `sequenz`) je einen
Slot vor. `monoschule`/`hybrid` bewusst nicht aufgenommen — niedrigere
Priorität, siehe Chat.

---

## Slot 1 — Sustain-Verstärker

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

## Slot 2 — Kontrollierter-Schaden-Verstärker

- **Archetyp:** `kontrollierter_schaden`
- **Schule (Optionen):** Runenkunst (natürliche Erweiterung des
  bestehenden Widerstand-Kerns) oder Chaosmagie (als bewusster
  Kontrast zum reinen Burst-Fokus der Schule)
- **Rolle:** Verstärker
- **Design-Zweck:** ein Cast, der in **derselben Aktion** spürbaren
  Schaden UND Widerstand liefert, ohne dass eine Seite dominiert —
  Mittelweg-Option für Spieler, die sich weder auf reinen Burst noch
  auf reine Verteidigung festlegen wollen.
- **Design-Frage:** "Gebe ich etwas Schadenspotenzial auf, um
  stabiler zu werden — ohne komplett auf Offensive zu verzichten?"
- **Ersetzt keine bestehende Karte, weil:** die existierenden
  Widerstand-Schaden-Hybriden (z. B. `soul_cut`, `chaos_catalyst`)
  skalieren Schaden AUS Widerstand — dieser Slot soll beides
  UNABHÄNGIG in einem Cast liefern, ein anderes Verhältnis.

## Slot 3 — Verwundbar-Ketten-Verstärker

- **Archetyp:** `verwundbar_ketten`
- **Schule:** Biomantie (ergänzt `organ_failure`, das durch die
  Finisher-Umwidmung den Verstärker-Unterbau dieses Archetyps verloren
  hat)
- **Rolle:** Verstärker
- **Design-Zweck:** hält Verwundbar aktiv oder erneuert es, statt es
  nur einmalig auszulösen — baut die Brücke zwischen einem frühen
  Verwundbar-Erzeuger (z. B. `bone_fracture`) und dem
  `organ_failure`-Finisher, der auf wiederholt vorhandenes Verwundbar
  angewiesen ist.
- **Design-Frage:** "Halte ich Verwundbar durchgehend aktiv, statt es
  nur punktuell für einen Bonus auszulösen?"
- **Ersetzt keine bestehende Karte, weil:** aktuelle Biomantie-Zauber
  erzeugen oder nutzen Verwundbar einmalig — kein Zauber verlängert
  oder erneuert es aktiv.

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

## Offene Verknüpfung zum Startauswahl-Thema

Slot 1 (Seelenmagie-Option) und Slot 2 (Chaosmagie-Option) würden
nebenbei auch den Gesamtpool der beiden kleinsten Schulen (je 5
Zauber) wachsen lassen — die aus der Startauswahl-Analyse
zurückgestellte Frage "soll der Pool dieser Schulen wachsen" ließe
sich damit zusammen mit der Archetyp-Lücke lösen, statt zwei separate
Content-Initiativen zu brauchen.

## Nicht Teil dieser Liste

- `monoschule`/`hybrid` (je 1 Zauber) — niedrigere Priorität, siehe
  Chat-Begründung.
- Konkrete Werte, Namen, Tooltips, Icon-Bedarf — folgt erst, wenn ein
  Slot tatsächlich bearbeitet wird, dann über die volle Checkliste aus
  CLAUDE.md ("Design neuer Zauber").
