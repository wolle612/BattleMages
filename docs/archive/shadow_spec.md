# Schattenmagie – Implementierungsspezifikation

Version: 1.0
Status: Final
Schule: Schattenmagie

---

# Designziel

Schattenmagie belohnt Vorbereitung.

Die Schule besitzt keine eigene Ressource.

Stattdessen entstehen Synergien über gegnerische Schwächen.

---

# Standardstatus

## Wunde

Status-ID:

shadow_wound

Beschreibung:

Der Gegner gilt als verwundet.

Alle Schattenzauber können auf diesen Status reagieren.

Grunddauer:

Bis zum Ende des Kampfes.

Maximale Stapel:

1

---

# Zauber 1 – Schattenstoß

ID:

shadow_strike

Typ:

Attack

Tags:

- Attack
- Manipulation

Seltenheit:

Common

Signature:

Nein

Cooldown:

0

Beschreibung:

Direkter Angriff.

Verursacht zusätzlichen Schaden gegen Gegner mit negativen Effekten.

---

## Rang I

Schaden:

10

Bonus:

+4 Schaden gegen Gegner mit mindestens einem negativen Effekt.

---

## Rang II

Schaden:

12

---

## Rang III

Bonus steigt auf:

+8 Schaden.

---

## Rang IV

Schaden:

14

---

## Rang V

Zusätzlich ignoriert Schattenstoß 8 Schild gegen geschwächte Gegner.

---

# Zauber 2 – Verdorbene Wunde

ID:

corrupted_wound

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

Beschreibung:

Verursacht Schaden und fügt Wunde zu.

---

## Rang I

Schaden:

8

Effekt:

Verleiht dem Gegner den Status "Wunde".

---

## Rang II

Schaden:

10

---

## Rang III

Der nächste Schattenzauber verursacht zusätzlich

+6 Schaden.

---

## Rang IV

Schaden:

12

---

## Rang V

"Wunde" erhöht zusätzlich allen Schatten-Schaden gegen dieses Ziel um +4.

---

# Zauber 3 – Schattenmantel

ID:

shadow_cloak

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

Beschreibung:

Gewährt Schild.

Der nächste Schattenzauber wird verstärkt.

---

## Rang I

Schild:

18

Bonus:

Der nächste Schattenzauber erhält +4 Schaden.

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

Der Bonus gilt für die nächsten zwei Schattenzauber.

---

# Zauber 4 – Umklammerung

ID:

embrace

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

Beschreibung:

Starker Angriff.

Profitiert von allen vorhandenen Schwächen.

---

## Rang I

Schaden:

18

Zusätzlich:

+6 Schaden bei Wunde.

---

## Rang II

Schaden:

22

---

## Rang III

Zusätzlich:

+6 Schaden pro weiterem negativen Effekt.

---

## Rang IV

Schaden:

26

---

## Rang V

Falls Wunde aktiv ist,

ignoriert Umklammerung 12 Schild.

---

# Zauber 5 – Dunkles Omen

ID:

dark_omen

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

Beschreibung:

Bereitet zukünftige Schattenzauber vor.

---

## Rang I

Die nächsten drei Schattenzauber erhalten

+3 Schaden.

---

## Rang II

Bonus:

+5 Schaden.

---

## Rang III

Der erste verstärkte Schattenzauber erhält zusätzlich

+6 Schaden.

---

## Rang IV

Bonus:

+7 Schaden.

---

## Rang V

Alle drei verstärkten Zauber ignorieren zusätzlich

6 Schild.

---

# Zauber 6 – Umbraler Henker

ID:

umbral_executioner

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

Beschreibung:

Der Finisher der Schattenmagie.

Profitiert von sämtlichen vorbereiteten Schwächen.

---

## Rang I

Grundschaden:

32

Zusätzlich:

+6 Schaden für jeden negativen Effekt auf dem Gegner.

---

## Rang II

Grundschaden:

38

---

## Rang III

Bonus steigt auf

+8 Schaden pro negativem Effekt.

---

## Rang IV

Grundschaden:

44

---

## Rang V

Der Schaden wird nicht mehr durch Schilde reduziert.