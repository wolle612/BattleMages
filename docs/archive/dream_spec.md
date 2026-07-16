# Traummagie – Implementierungsspezifikation

Version: 1.0
Status: Final
Schule: Traummagie

---

# Designziel

Traummagie verändert die Regeln des Kampfes.

Sie besitzt keine eigene Ressource.

Ihre Stärke entsteht nicht durch höhere Werte,
sondern durch außergewöhnliche Kampfsituationen.

---

# Globale Traumregel

## Echo

Status-ID:

echo

Beschreibung:

Ein Echo wiederholt einen Zauber automatisch mit verringerter Wirkung.

Standard:

50 % der ursprünglichen Stärke.

Echo löst keinen weiteren Echo-Effekt aus.

Echo kann niemals unendlich verkettet werden.

---

# Zauber 1 – Traumsplitter

ID:

dream_shard

Typ:

Attack

Tags:

- Attack
- Echo

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

Zusätzlich:

Erzeugt ein Echo mit 50 % Schaden.

---

## Rang II

Schaden:

12

---

## Rang III

Das Echo übernimmt zusätzlich Statuseffekte des ursprünglichen Zaubers.

---

## Rang IV

Schaden:

14

---

## Rang V

Echo wirkt mit 75 % der ursprünglichen Stärke.

---

# Zauber 2 – Déjà-vu

ID:

deja_vu

Typ:

Status

Tags:

- Echo
- Manipulation

Seltenheit:

Common

Signature:

Nein

Cooldown:

0

---

## Rang I

Der nächste Echo-Effekt erhält

+4 Schaden.

---

## Rang II

Bonus:

+6 Schaden.

---

## Rang III

Echo wird sofort nach dem ursprünglichen Zauber ausgelöst.

---

## Rang IV

Bonus:

+8 Schaden.

---

## Rang V

Echo übernimmt sämtliche Effekte des ursprünglichen Zaubers.

---

# Zauber 3 – Traumschleier

ID:

dream_veil

Typ:

Protection

Tags:

- Protection
- Manipulation

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

Der nächste gegnerische Angriff verursacht

4 Schaden weniger.

---

## Rang II

Schild:

24

---

## Rang III

Der nächste gegnerische Angriff verursacht

8 Schaden weniger.

---

## Rang IV

Schild:

30

---

## Rang V

Der Schleier schützt zusätzlich vor negativen Statuseffekten bis zum nächsten eigenen Zug.

---

# Zauber 4 – Traumparadoxon

ID:

dream_paradox

Typ:

Status

Tags:

- Manipulation

Seltenheit:

Rare

Signature:

Nein

Cooldown:

0

---

## Rang I

Der nächste Zauber ignoriert genau **eine** Einschränkung.

Mögliche Einschränkungen:

- Lebenskosten
- Cooldown
- Voraussetzung

---

## Rang II

Der verstärkte Zauber erhält zusätzlich

+4 Schaden oder +4 Schild.

(je nach Zaubertyp)

---

## Rang III

Der nächste Zauber darf gleichzeitig zwei Einschränkungen ignorieren.

---

## Rang IV

Bonus:

+8 Schaden oder +8 Schild.

---

## Rang V

Der nächste Zauber ignoriert sämtliche Einschränkungen.

---

# Zauber 5 – Falsches Erwachen

ID:

false_awakening

Typ:

Status

Tags:

- Echo
- Manipulation

Seltenheit:

Epic

Signature:

Nein

Cooldown:

0

---

## Rang I

Die nächsten zwei Echo-Effekte erhalten

+4 Schaden.

---

## Rang II

Bonus:

+6 Schaden.

---

## Rang III

Echo-Effekte lösen unmittelbar nach ihrem Ursprung aus.

---

## Rang IV

Bonus:

+8 Schaden.

---

## Rang V

Alle Echo-Effekte dieses Kampfes wirken mit 75 % Stärke.

---

# Zauber 6 – Traumwanderung

ID:

dreamwalk

Typ:

Status

Tags:

- Echo
- Manipulation

Seltenheit:

Legendary

Signature:

Ja

Cooldown:

1 Rotation

---

## Rang I

Aktiviert sofort:

- Traumparadoxon
- Falsches Erwachen

für den nächsten Zauber.

---

## Rang II

Zusätzlich:

Der nächste Zauber erhält

+8 Schaden oder +8 Schild.

---

## Rang III

Alle aktiven Echo-Effekte werden sofort ausgelöst.

---

## Rang IV

Bonus:

+12 Schaden oder +12 Schild.

---

## Rang V

Alle aktiven Traum-Effekte werden maximiert.

Echo wirkt mit 100 % Stärke.

Traumparadoxon ignoriert sämtliche Einschränkungen.

Falsches Erwachen verstärkt alle Echo-Effekte gleichzeitig.