# Runenmagie – Implementierungsspezifikation

Version: 1.0
Status: Final
Schule: Runenmagie

---

# Designziel

Runenmagie belohnt Planung.

Sie besitzt keine eigene Ressource.

Ihre Stärke entsteht durch Reihenfolgen und sinnvolle Kombinationen.

---

# Lokale Definitionen

## Runenkombination

Eine Runenkombination entsteht, wenn zwei Runenzauber direkt hintereinander gewirkt werden.

---

## Hybridkombination

Eine Hybridkombination entsteht, wenn zwei aufeinanderfolgende Zauber unterschiedlichen Schulen angehören.

Beispiel:

Blut → Rune

Rune → Traum

Sterne → Rune

---

## Unterschiedlicher Zaubertyp

Es zählen ausschließlich:

- Attack
- Status
- Protection

---

# Zauber 1 – Runenschlag

ID:

rune_strike

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

+2 Schaden für jeden unterschiedlichen Zaubertyp,
der unmittelbar zuvor gewirkt wurde.

(maximal +6)

---

## Rang II

Schaden:

12

---

## Rang III

Berücksichtigt zusätzlich unterschiedliche Schulen.

(maximal +10 Bonus)

---

## Rang IV

Schaden:

14

---

## Rang V

Der maximale Bonus steigt auf

+14 Schaden.

---

# Zauber 2 – Schutzrune

ID:

protection_rune

Typ:

Protection

Tags:

- Protection
- Preparation

Seltenheit:

Common

Signature:

Nein

Cooldown:

0

---

## Rang I

Schild:

18

Zusätzlich:

Der nächste Runenzauber erhält

+4 Schaden.

---

## Rang II

Schild:

24

---

## Rang III

Der nächste Runenzauber erhält zusätzlich

+4 Schild.

---

## Rang IV

Schild:

30

---

## Rang V

Der Bonus gilt für die nächsten zwei Runenzauber.

---

# Zauber 3 – Runenverbindung

ID:

rune_link

Typ:

Status

Tags:

- Preparation
- Manipulation

Seltenheit:

Common

Signature:

Nein

Cooldown:

0

---

## Rang I

Der nächste Zauber erhält

+6 Schaden oder +6 Schild.

(je nach Zaubertyp)

---

## Rang II

Bonus:

+8

---

## Rang III

Hybridkombinationen erhalten den Bonus ebenfalls.

---

## Rang IV

Bonus:

+10

---

## Rang V

Die nächsten zwei Zauber profitieren.

---

# Zauber 4 – Runenfluss

ID:

rune_flow

Typ:

Status

Tags:

- Preparation

Seltenheit:

Rare

Signature:

Nein

Cooldown:

0

---

## Rang I

Der nächste Runenzauber erhält

+4 Schaden.

Zusätzlich:

Ziehe ihn in der Rotation um einen Slot nach vorne.

---

## Rang II

Bonus:

+6 Schaden.

---

## Rang III

Der nächste Runenzauber erhält zusätzlich

+4 Schild.

---

## Rang IV

Bonus:

+8 Schaden.

---

## Rang V

Die Positionsänderung bleibt bis zum Ende des Kampfes bestehen.

---

# Zauber 5 – Runengeflecht

ID:

rune_weave

Typ:

Status

Tags:

- Manipulation
- Preparation

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

Hybridkombinationen erhalten zusätzlich

+1 weiteren Build-Tag für Synergieprüfungen.

---

# Zauber 6 – Meisterrune

ID:

master_rune

Typ:

Status

Tags:

- Burst
- Preparation

Seltenheit:

Legendary

Signature:

Ja

Cooldown:

1 Rotation

---

## Rang I

Aktiviert sämtliche vorbereiteten Runenboni.

Zusätzlich:

Alle aktiven Runenzauber erhalten

+8 Schaden oder +8 Schild.

---

## Rang II

Bonus:

+12

---

## Rang III

Alle aktiven Runenverbindungen werden erneut ausgelöst.

---

## Rang IV

Bonus:

+16

---

## Rang V

Alle vorbereiteten Runeneffekte werden maximiert.

Zusätzlich werden sämtliche Hybridkombinationen sofort aktiviert.