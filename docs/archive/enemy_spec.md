# Battlemages – Enemy Specification

Version: 1.0

Status: Final

> **STATUS: SUPERSEDED (Archiv)** — Alte Spec aus einem früheren Sprint, nicht
> im Runtime-Pfad. Maßgeblich: `docs/design/BattleMages_Enemy_Design_Document_v3.md`
> und `data/enemies.js`. Siehe `docs/specs/architecture_design_audit_2026-07-21.md`.

---

# Allgemeine Regeln

Alle Gegner besitzen:

- Standardangriff
- Passive Fähigkeit
- Aktive Fähigkeit

Elitegegner erhalten zusätzlich einen Elite-Effekt.

Elite+ erhält eine zweite aktive Fähigkeit.

Mini-Bosse besitzen zwei Kampfphasen.

Der Endboss besitzt zwei Kampfphasen und wechselt zwischen Magieschulen.

Aktive Fähigkeiten werden niemals zufällig eingesetzt.

Sie folgen einer festen Rotation und sind für den Spieler sichtbar.

---

# Kampf 1

Name

Runenakolyth

Typ

Normal

Designziel

Schilde kennenlernen.

Standardangriff

Runensplitter

Passive

Konzentriert

Der erste Angriff verursacht erhöhten Schaden.

Aktive Fähigkeit

Runenbarriere

Erzeugt einen kleinen Schild.

---

# Kampf 2

Name

Blutkultist

Typ

Normal

Designziel

Low-HP-Mechaniken kennenlernen.

Standardangriff

Blutdolch

Passive

Blutrausch

Verursacht mehr Schaden bei wenig Leben.

Aktive Fähigkeit

Blutstoß

Opfert Leben und verursacht erhöhten Schaden.

---

# Kampf 3

Name

Schattenassassine

Typ

Elite-Vorstufe

Designziel

Debuffs verstehen.

Standardangriff

Schattendolch

Passive

Jägerinstinkt

Verursacht mehr Schaden gegen Gegner mit Debuffs.

Aktive Fähigkeit

Schattenstoß

(Spielerzauber)

---

# Kampf 4

Name

Sternenseher

Typ

DPS-Check

Designziel

Vorbereitete Burst-Fähigkeiten erkennen.

Standardangriff

Sternenscherbe

Passive

Kosmischer Zyklus

Jeder dritte Angriff verursacht erhöhten Schaden.

Aktive Fähigkeit

Komet

(Spielerzauber)

---

# Kampf 5

Name

Traumwandler

Typ

Normal

Designziel

Vorbereitete Zauber verstehen.

Standardangriff

Traumsplitter

Passive

Flüchtige Realität

Echo-Effekte werden verstärkt.

Aktive Fähigkeit

Traumhülle

Bereitet den nächsten Traumzauber vor.

---

# Kampf 6

Name

Runenhüter

Typ

Survival-Check

Designziel

Schilde durchbrechen.

Standardangriff

Runenklinge

Passive

Runenpanzer

Erzeugt regelmäßig Schilde.

Aktive Fähigkeit

Runenbarriere

(Verstärkte Version)

---

# Kampf 7

Name

Schattenrichter

Typ

Elite

Designziel

Debuffs bestrafen.

Standardangriff

Seelenschnitt

Passive

Urteilsblick

Verursacht mehr Schaden gegen Ziele mit Debuffs.

Aktive Fähigkeit

Umbraler Henker

(Spielerzauber)

Elite-Effekt

Dunkles Tribunal

Der Spieler beginnt den Kampf mit Wunde.

---

# Kampf 8

Name

Blutarchon

Typ

Spezialgegner

Designziel

Risiko gegen Belohnung.

Standardangriff

Blutlanze

(Spielerzauber)

Passive

Lebensdurst

Blutzauber werden bei wenig Leben stärker.

Aktive Fähigkeit

Blutpakt

(Spielerzauber)

---

# Kampf 9

Name

Sternenprophet

Typ

DPS-/Mechanik-Check

Designziel

Timing lesen.

Standardangriff

Sternensplitter

Passive

Konstellation

Jede vorbereitete Fähigkeit verstärkt den nächsten Sternenzauber.

Aktive Fähigkeit

Sonnenfinsternis

(Spielerzauber)

---

# Kampf 10

Name

Runenmeister

Typ

Elite+

Designziel

Runenkombinationen verstehen.

Standardangriff

Runenschlag

(Spielerzauber)

Passive

Perfekte Konstruktion

Jede erfolgreich ausgelöste Runenkombination verstärkt den nächsten Zauber.

Aktive Fähigkeit

Meisterrune

(Spielerzauber)

Zweite aktive Fähigkeit

Runenfluss

(Spielerzauber)

Elite-Effekt

Runennetz

Beginnt den Kampf mit einer vorbereiteten Runenkombination.

---

# Kampf 11

Name

Hüter der Elemente

Typ

Mini-Boss

Designziel

Eskalierende Kämpfe meistern.

Standardangriff

Erdspalter

(Spielerzauber)

Passive

Naturgewalt

Momentum-Effekte werden verstärkt.

Aktive Fähigkeit

Kataklysmus+

Bossversion des Spielerzaubers.

Phase 2

Bei 50 % Leben:

Momentum wird vollständig aufgebaut.

Alle Angriffe verursachen erhöhten Schaden.

---

# Kampf 12

Name

Der Verdorbene Archmagus

Typ

Endboss

Designziel

Alle Spielmechaniken meistern.

Standardangriff

Arkane Vernichtung

Passive

Verbotene Meisterschaft

Beherrscht alle sechs Magieschulen.

Boss-Signature

Signatur der Erzmagier

Wirkt verstärkte Versionen der Signature-Zauber aller Schulen.

Phasen

Phase 1

Blut → Schatten → Traum

Phase 2

Runen → Sterne → Urgewalten

Boss-Effekt

Sechs verbotene Künste

Beim Wechsel der Schule werden sämtliche Zauber dieser Schule verstärkt.

---

# UI-Regeln

Der Spieler sieht jederzeit:

- Gegnername
- HP
- Passive Fähigkeit
- Nächste aktive Fähigkeit
- Verbleibende Impulse bis zur nächsten Fähigkeit

Der Spieler kennt dadurch die gegnerische Rotation und kann seine eigene Planung daran ausrichten.

---

# Designprinzip

Jeder Gegner prüft genau eine Kernmechanik.

Der Spieler soll nach jedem Kampf das Gefühl haben:

"Jetzt habe ich etwas Neues gelernt."

Nicht:

"Der Gegner hatte einfach nur mehr Leben."