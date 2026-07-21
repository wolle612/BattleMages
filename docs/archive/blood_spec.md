# Blutmagie – Implementierungsspezifikation

Version: 1.1

> **STATUS: SUPERSEDED (Archiv)** — Alte Spec aus einem früheren Sprint, nicht
> im Runtime-Pfad. Maßgeblich: `data/spellbookCore.js`/`data/spellbookPart2.js`
> und `docs/design/*`. Siehe `docs/specs/architecture_design_audit_2026-07-21.md`.

---

# Zauber 1 – Blutschlag

ID:
blood_strike

Typ:
Attack

Tags:

- Attack
- Sacrifice

Cooldown:
0

---

## Rang I

Schaden:

10

Zusätzlich:

Bis zu +5 Schaden abhängig vom fehlenden Leben.

(lineare Skalierung)

---

## Rang II

Schaden:

12

---

## Rang III

Maximale Skalierung steigt auf

+8 Schaden.

---

## Rang IV

Schaden:

14

---

## Rang V

Maximale Skalierung steigt auf

+10 Schaden.

---

# Zauber 2 – Blutlanze

ID:

blood_lance

Typ:

Attack

Tags:

- Sacrifice
- Burst

Cooldown:
0

---

## Rang I

Kosten:

5 % maximales Leben

Schaden:

18

---

## Rang II

Schaden:

22

---

## Rang III

Kosten sinken auf

4 %

---

## Rang IV

Schaden:

26

---

## Rang V

Falls Blutlanze einen Gegner besiegt,

erhältst du die geopferten HP vollständig zurück.

---

# Zauber 3 – Blutwall

ID:

blood_wall

Typ:

Protection

Tags:

- Protection
- Preparation

Cooldown:
0

---

## Rang I

Schild:

18

Bonus:

Der nächste Blutzauber erhält

+4 Schaden.

---

## Rang II

Schild:

24

---

## Rang III

Bonus steigt auf

+8 Schaden.

---

## Rang IV

Schild:

30

---

## Rang V

Der Bonus gilt für die nächsten zwei Blutzauber.

---

# Zauber 4 – Blutpakt

ID:

blood_pact

Typ:

Status

Tags:

- Preparation

Cooldown:
0

---

## Rang I

Die nächsten zwei Blutzauber erhalten:

+2 Schaden pro geopfertem Lebenspunkt.

---

## Rang II

Dauer:

3 Blutzauber.

---

## Rang III

Bonus steigt auf

+3 Schaden pro geopfertem Lebenspunkt.

---

## Rang IV

Dauer:

4 Blutzauber.

---

## Rang V

Nach Ablauf heilt Blutpakt

25 % der geopferten HP zurück.

---

# Zauber 5 – Blutrausch

ID:

blood_frenzy

Typ:

Status

Tags:

- Manipulation

Cooldown:
0

---

## Rang I

Aktiv unter

50 % Leben.

Alle Blutzauber erhalten:

+6 Schaden.

---

## Rang II

Bonus:

+8 Schaden.

---

## Rang III

Aktiviert bereits unter

60 % Leben.

---

## Rang IV

Bonus:

+10 Schaden.

---

## Rang V

Jeder Blutzauber erzeugt zusätzlich

10 Schild.

---

# Zauber 6 – Blutmond

ID:

blood_moon

Typ:

Attack

Tags:

- Burst

Signature:
Ja

Cooldown:

1 Rotation

---

## Rang I

Grundschaden:

34

Zusätzlich:

+1 Schaden

für je 2 % fehlendes Leben.

---

## Rang II

Grundschaden:

40

---

## Rang III

Aktiviert nach dem Treffer automatisch

Blutrausch.

---

## Rang IV

Grundschaden:

46

---

## Rang V

Ignoriert sämtliche Schilde.