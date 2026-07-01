# Battlemages – Implementation Rules

Version: 1.0

Status: Final

---

# Zweck

Dieses Dokument definiert sämtliche verbindlichen Implementierungsregeln für Battlemages.

Es dient als technische Grundlage für:

- alle Zauber
- alle Schulen
- sämtliche zukünftigen Inhalte

Die hier definierten Regeln gelten projektweit.

Abweichungen sind nicht erlaubt.

---

# Entwicklungsphilosophie

Fantasy wird in den jeweiligen Schulendokumenten definiert.

Implementierungsdetails werden ausschließlich in den *_spec.md Dokumenten festgelegt.

Der Code implementiert ausschließlich die Spezifikation.

Die Spezifikation ist die Wahrheit.

Nicht der Code.

---

# Zauberstruktur

Jeder Zauber besitzt folgende Eigenschaften.

## Pflichtfelder

id

school

name

description

type

rarity

tags

cooldown

rotationOrder

effects

upgrades

---

# IDs

Jeder Zauber besitzt eine eindeutige ID.

Format:

school_spellname

Beispiele:

blood_strike

shadow_cloak

dream_shard

master_rune

supernova

cataclysm

IDs dürfen niemals geändert werden.

---

# Schulen

Gültige Werte:

blood

shadow

dream

rune

star

primal

---

# Typen

Jeder Zauber besitzt genau einen Typ.

Erlaubte Typen:

Attack

Status

Protection

Weitere Typen dürfen nicht eingeführt werden.

---

# Seltenheiten

Erlaubte Werte:

Common

Rare

Epic

Legendary

Signature-Zauber besitzen zusätzlich:

isSignature = true

---

# Build-Tags

Erlaubte Tags:

Preparation

Control

Sacrifice

Manipulation

Echo

Burst

Neue Tags dürfen nur nach Designentscheidung ergänzt werden.

---

# Cooldowns

Normale Zauber:

Cooldown = 0

Signature-Zauber:

Cooldown = 1 Rotation

Weitere Cooldown-Stufen existieren nicht.

---

# Rotation

rotationOrder bestimmt ausschließlich:

- Reihenfolge in der Actionbar
- Reihenfolge der Kampfrotation

rotationOrder darf durch Spielmechaniken verändert werden.

Die aktuelle Reihenfolge gilt immer als Wahrheit.

---

# Upgrades

Alle Zauber besitzen exakt fünf Ränge.

## Rang I

Grundversion.

## Rang II

Numerische Verbesserung.

Keine neue Mechanik.

## Rang III

Neue Mechanik.

Keine reine Zahlenanpassung.

## Rang IV

Numerische Verbesserung.

Keine neue Mechanik.

## Rang V

Finale Mechanik.

Der Zauber erreicht seine vollständige Identität.

---

# Zahlenphilosophie

Grundsätzlich werden absolute Werte verwendet.

Beispiele:

+4 Schaden

+8 Schild

+2 Momentum

+6 Bonus

Keine Prozentwerte für gewöhnliche Buffs.

---

# Prozentwerte

Prozentwerte sind ausschließlich erlaubt für:

- fehlendes Leben
- geopfertes Leben
- Schilddurchdringung
- andere mathematisch notwendige Skalierungen

Alle übrigen Boni werden absolut angegeben.

---

# Buffs

Buffs besitzen:

- eindeutigen Auslöser
- eindeutige Dauer
- eindeutige Wirkung

Beispiel:

Die nächsten zwei Blutzauber erhalten +6 Schaden.

Nicht:

Blutzauber werden stärker.

---

# Debuffs

Debuffs folgen denselben Regeln.

Sie benötigen:

- ID
- Auslöser
- Wirkung
- Dauer

Alle Debuffs werden zentral in status_effects.md definiert.

---

# Ressourcen

Battlemages besitzt keine schulenspezifischen Ressourcen.

Erlaubt sind ausschließlich globale Kampfmechaniken wie:

- Momentum
- Echo
- Timing
- Wunde

Diese werden zentral definiert.

---

# Balancing

Balancing erfolgt ausschließlich über:

- Grundschaden
- Schildwerte
- absolute Boni
- Trigger
- Dauer
- Reihenfolge

Nicht über komplizierte Skalierungsformeln.

---

# Implementierungsprinzip

Die Engine kennt ausschließlich Daten.

Zauberverhalten wird nicht über Namen geprüft.

Nicht erlaubt:

if (spell.name === "Blutlanze")

Stattdessen:

if (spell.id === "blood_lance")

oder

über Effekte und Tags.

---

# Dokumentenhierarchie

1. implementation_rules.md

Projektweite Regeln.

↓

2. combat_rules.md

Kampfregeln.

↓

3. status_effects.md

Globale Effekte.

↓

4. *_spec.md

Konkrete Implementierung einer Schule.

↓

5. Code

Technische Umsetzung.

---

# Änderungsregel

Neue Inhalte werden niemals direkt im Code definiert.

Änderungsreihenfolge:

1. Design-Dokument

↓

2. Spec

↓

3. Code

Der Code wird niemals zur Quelle des Game Designs.