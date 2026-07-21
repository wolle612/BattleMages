# Urgewaltenmagie – Implementierungsspezifikation

Version: 1.0
Status: Final
Schule: Urgewaltenmagie

> **STATUS: SUPERSEDED (Archiv)** — Alte Spec aus einem früheren Sprint, nicht
> im Runtime-Pfad. Maßgeblich: `data/spellbookCore.js`/`data/spellbookPart2.js`.
> Siehe `docs/specs/architecture_design_audit_2026-07-21.md`.

---

# Designziel

Urgewaltenmagie erzeugt stetig zunehmenden Druck.

Sie besitzt keine eigene Ressource.

Stattdessen baut sie Momentum auf, welches mächtige Zauber verstärkt.

---

# Lokale Definitionen

## Momentum

Momentum besitzt fünf Stufen.

Minimum:

0

Maximum:

5

Momentum bleibt bis zum Kampfende erhalten.

Kataklysmus verbraucht sämtliches Momentum.

---

# Zauber 1 – Erdbeben

ID:

earthquake

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

Nachbeben:

4 Schaden.

---

## Rang II

Schaden:

12

Nachbeben:

6 Schaden.

---

## Rang III

Das Nachbeben erzeugt zusätzlich

+1 Momentum.

---

## Rang IV

Schaden:

14

Nachbeben:

8 Schaden.

---

## Rang V

Das Nachbeben ignoriert

8 Schild.

---

# Zauber 2 – Gewitterfront

ID:

stormfront

Typ:

Status

Tags:

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

Erzeugt:

+1 Momentum.

---

## Rang II

Schaden:

10

---

## Rang III

Erzeugt:

+2 Momentum.

---

## Rang IV

Schaden:

12

---

## Rang V

Erhöht zusätzlich den Schaden des nächsten Urgewaltenzaubers um

+6.

---

# Zauber 3 – Tornado

ID:

tornado

Typ:

Attack

Tags:

- Manipulation

Seltenheit:

Common

Signature:

Nein

Cooldown:

0

---

## Rang I

Schaden:

12

Der nächste Urgewaltenzauber erhält

+4 Schaden.

---

## Rang II

Schaden:

14

---

## Rang III

Der nächste Urgewaltenzauber erhält zusätzlich

+1 Momentum.

---

## Rang IV

Schaden:

16

---

## Rang V

Der Bonus gilt für die nächsten zwei Urgewaltenzauber.

---

# Zauber 4 – Vulkanausbruch

ID:

volcanic_eruption

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

Grundschaden:

18

Zusätzlich:

+4 Schaden pro Momentum.

---

## Rang II

Grundschaden:

22

---

## Rang III

Momentum erhöht zusätzlich den Schilddurchbruch um

2 pro Momentum.

---

## Rang IV

Grundschaden:

26

---

## Rang V

Der Zauber verbraucht kein Momentum.

---

# Zauber 5 – Naturgewalt

ID:

force_of_nature

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

Alle Momentum-Effekte erzeugen

+1 zusätzliches Momentum.

---

## Rang II

Zusätzlich erhalten Urgewaltenzauber

+4 Schaden.

---

## Rang III

Der Kampf beginnt mit

1 Momentum.

---

## Rang IV

Bonus steigt auf

+8 Schaden.

---

## Rang V

Momentum erreicht sofort mindestens

3,

falls es darunter liegt.

---

# Zauber 6 – Kataklysmus

ID:

cataclysm

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

30

Zusätzlich:

+8 Schaden pro Momentum.

Nach dem Treffer wird Momentum auf

0

gesetzt.

---

## Rang II

Grundschaden:

36

---

## Rang III

Der Bonus steigt auf

+10 Schaden pro Momentum.

---

## Rang IV

Grundschaden:

42

---

## Rang V

Kataklysmus verursacht zusätzlich

+4 Schaden für jeden zuvor im Kampf verbrauchten Momentum-Punkt.