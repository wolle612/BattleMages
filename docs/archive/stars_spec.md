# Sternenmagie – Implementierungsspezifikation

Version: 1.0
Status: Final
Schule: Sternenmagie

> **STATUS: SUPERSEDED (Archiv)** — Alte Spec aus einem früheren Sprint, nicht
> im Runtime-Pfad. Maßgeblich: `data/spellbookCore.js`/`data/spellbookPart2.js`.
> Siehe `docs/specs/architecture_design_audit_2026-07-21.md`.

---

# Designziel

Sternenmagie belohnt perfektes Timing.

Sie besitzt keine eigene Ressource.

Ihre Stärke entsteht dadurch, den richtigen Moment innerhalb einer Rotation zu nutzen.

---

# Lokale Definitionen

## Timing-Effekt

Ein Timing-Effekt gilt als aktiv, wenn unmittelbar zuvor ein Sternenzauber mit vorbereitender Wirkung gewirkt wurde.

Timing-Effekte werden nicht gestapelt.

Es kann immer nur ein Timing-Effekt aktiv sein.

---

# Zauber 1 – Sternensplitter

ID:

star_shard

Typ:

Attack

Tags:

- Attack
- Preparation

Seltenheit:

Common

Signature:

Nein

Cooldown:

0

---

## Rang I

Schaden:

10

Bonus:

+4 Schaden bei aktivem Timing-Effekt.

---

## Rang II

Schaden:

12

---

## Rang III

Timing-Bonus steigt auf

+8 Schaden.

---

## Rang IV

Schaden:

14

---

## Rang V

Timing-Bonus ignoriert zusätzlich

8 Schild.

---

# Zauber 2 – Gravitationsfeld

ID:

gravity_field

Typ:

Status

Tags:

- Control
- Preparation

Seltenheit:

Common

Signature:

Nein

Cooldown:

0

---

## Rang I

Schaden:

8

Aktiviert einen Timing-Effekt.

---

## Rang II

Schaden:

10

---

## Rang III

Der Timing-Effekt gilt zusätzlich für den übernächsten Sternenzauber.

---

## Rang IV

Schaden:

12

---

## Rang V

Der Timing-Effekt verstärkt zusätzlich den nächsten Hybridzauber.

---

# Zauber 3 – Komet

ID:

comet

Typ:

Attack

Tags:

- Burst

Seltenheit:

Rare

Signature:

Nein

Cooldown:

0

---

## Rang I

Schaden:

20

Zusätzlich:

+8 Schaden bei aktivem Timing-Effekt.

---

## Rang II

Schaden:

24

---

## Rang III

Der Timing-Bonus erhöht zusätzlich den Schilddurchbruch um

8.

---

## Rang IV

Schaden:

28

---

## Rang V

Komet verbraucht keinen aktiven Timing-Effekt.

---

# Zauber 4 – Sonnenfinsternis

ID:

solar_eclipse

Typ:

Status

Tags:

- Preparation

Seltenheit:

Epic

Signature:

Nein

Cooldown:

0

---

## Rang I

Die nächsten zwei Sternenzauber erhalten

+4 Schaden.

---

## Rang II

Bonus:

+6 Schaden.

---

## Rang III

Der erste Timing-Bonus wird verdoppelt.

---

## Rang IV

Bonus:

+8 Schaden.

---

## Rang V

Alle Timing-Effekte dieses Kampfes erhalten zusätzlich

+4 Schaden.

---

# Zauber 5 – Sternbild

ID:

constellation

Typ:

Status

Tags:

- Preparation
- Manipulation

Seltenheit:

Epic

Signature:

Nein

Cooldown:

0

---

## Rang I

Hybridkombinationen erhalten

+4 Schaden.

---

## Rang II

Bonus:

+6 Schaden.

---

## Rang III

Hybridkombinationen erhalten zusätzlich

+4 Schild.

---

## Rang IV

Bonus:

+8 Schaden.

---

## Rang V

Alle Hybridkombinationen erzeugen automatisch einen Timing-Effekt.

---

# Zauber 6 – Supernova

ID:

supernova

Typ:

Attack

Tags:

- Burst

Seltenheit:

Legendary

Signature:

Ja

Cooldown:

1 Rotation

---

## Rang I

Grundschaden:

34

Zusätzlich:

+8 Schaden bei aktivem Timing-Effekt.

---

## Rang II

Grundschaden:

40

---

## Rang III

Der Timing-Bonus wird verdoppelt.

---

## Rang IV

Grundschaden:

46

---

## Rang V

Supernova aktiviert anschließend alle verfügbaren Timing-Effekte erneut.