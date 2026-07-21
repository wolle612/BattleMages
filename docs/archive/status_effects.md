# Battlemages – Status Effects

Version: 1.1

Status: Final

> **STATUS: SUPERSEDED (Archiv)** — Alte Spec aus einem früheren Sprint, nicht
> im Runtime-Pfad. Maßgeblich: `src/combatStatus.js` und `data/combatIdentity.js`.
> Siehe `docs/specs/architecture_design_audit_2026-07-21.md`.

---

# Zweck

Dieses Dokument definiert sämtliche globalen Status- und Kampfeffekte von Battlemages.

Status werden niemals innerhalb einzelner Zauber implementiert.

Alle Schulen greifen ausschließlich auf diese Definitionen zurück.

Neue Status müssen zuerst in diesem Dokument ergänzt werden.

---

# Allgemeine Regeln

## Buff

Ein Buff verbessert den Spieler.

Buffs besitzen:

- ID
- Auslöser
- Wirkung
- Dauer
- Stapelbarkeit

---

## Debuff

Ein Debuff schwächt den Gegner.

Debuffs besitzen dieselben Eigenschaften.

---

## Dauer

Dauer wird grundsätzlich angegeben als:

- nächster Zauber
- nächste X Zauber
- bis Kampfende
- bis ausgelöst

Es existieren keine Sekunden oder Echtzeitdauern.

---

## Stapelbarkeit

Ist nichts anderes angegeben,

gilt:

Nicht stapelbar.

---

# Wunde

ID

wound

Typ

Debuff

Stapelbar

Nein

Beschreibung

Der Gegner gilt als verwundet.

Einige Schattenzauber erhalten gegen verwundete Ziele zusätzliche Effekte.

Dauer

Bis Kampfende.

---

# Blutpakt

ID

blood_pact

Typ

Buff

Stapelbar

Nein

Beschreibung

Verstärkt ausschließlich Blutzauber.

Die genaue Höhe wird durch den auslösenden Zauber definiert.

Dauer

Bis ausgelöst.

---

# Blutrausch

ID

blood_frenzy

Typ

Buff

Stapelbar

Nein

Beschreibung

Verstärkt Blutzauber solange die jeweiligen Bedingungen erfüllt sind.

Der Bonus wird ausschließlich vom Zauber definiert.

Dauer

Bis Kampfende oder bis der auslösende Effekt endet.

---

# Vorbereitung

ID

preparation

Typ

Buff

Stapelbar

Nein

Beschreibung

Ein vorbereitender Effekt.

Besitzt selbst keine Wirkung.

Verstärkt den nächsten passenden Zauber.

Die konkrete Stärke bestimmt immer der auslösende Zauber.

---

# Echo

ID

echo

Typ

Buff

Stapelbar

Nein

Beschreibung

Der nächste passende Zauber wird automatisch wiederholt.

Regeln

- 50 % Grundwirkung
- übernimmt Schaden
- übernimmt Schild
- übernimmt erlaubte Status
- erzeugt niemals weiteres Echo

Dauer

Einmalig.

---

# Timing

ID

timing

Typ

Buff

Stapelbar

Nein

Beschreibung

Bereitet den nächsten Sternenzauber vor.

Regeln

Es kann immer nur ein Timing-Effekt aktiv sein.

Ein neuer Timing-Effekt ersetzt den bisherigen.

Dauer

Bis ausgelöst.

---

# Momentum

ID

momentum

Typ

Buff

Stapelbar

Ja

Maximale Stapel

5

Beschreibung

Momentum verstärkt bestimmte Urgewaltenzauber.

Regeln

Momentum

- bleibt bis Kampfende erhalten
- wird ausschließlich durch Momentum-Effekte erzeugt
- kann vollständig verbraucht werden

---

# Runenverbindung

ID

rune_link

Typ

Buff

Stapelbar

Nein

Beschreibung

Verbindet zwei aufeinanderfolgende Runenzauber.

Ermöglicht zusätzliche Runenkombinationen.

Dauer

Bis ausgelöst.

---

# Hybridbonus

ID

hybrid_bonus

Typ

Buff

Stapelbar

Nein

Beschreibung

Verstärkt den nächsten Hybridzauber.

Hybrid bedeutet:

Zwei unmittelbar aufeinanderfolgende Zauber unterschiedlicher Schulen.

Dauer

Bis ausgelöst.

---

# Schildbonus

ID

shield_bonus

Typ

Buff

Stapelbar

Nein

Beschreibung

Verstärkt den nächsten erzeugten Schild.

Dauer

Bis ausgelöst.

---

# Schilddurchbruch

ID

armor_break

Typ

Temporärer Effekt

Beschreibung

Ein Teil des Schadens ignoriert vorhandene Schilde.

Besitzt keine Dauer.

Gilt ausschließlich für den aktuellen Angriff.

---

# Nachbeben

ID

aftershock

Typ

Folgeeffekt

Beschreibung

Ein zweiter kleiner Angriff.

Regeln

- erfolgt unmittelbar nach dem Haupttreffer
- gilt nicht als eigener Zauber
- löst keine Zauber erneut aus
- erzeugt keine Triggerketten

---

# Globale Regeln

Status werden ausschließlich über ihre ID geprüft.

Nicht erlaubt:

spell.name

status.name

Erlaubt:

status.id

hasStatus(id)

addStatus(id)

removeStatus(id)

---

# Darstellung

Status sollen künftig im Charakterfenster dargestellt werden.

Jeder Status besitzt später:

- Icon
- Name
- Tooltip
- Stapelanzeige
- Restdauer (falls relevant)

Die Darstellung erfolgt ausschließlich über Statusdaten.

---

# Erweiterbarkeit

Neue Schulen dürfen neue Status hinzufügen.

Diese müssen jedoch zuerst in diesem Dokument definiert werden.

Erst danach dürfen sie in einer *_spec.md verwendet werden.

---

# UI-Darstellung

Die folgenden Status sollen im Kampf als Statuschips unter dem jeweiligen Charakter dargestellt werden.

| Status-ID | Schule | Sichtbar | Icon |
|-----------|---------|----------|------|
| blood_pact | Blut | Ja | 🩸 |
| blood_frenzy | Blut | Ja | 🩸 |
| wound | Schatten | Ja | 🌑 |
| preparation | Global | Nein | — |
| echo | Traum | Ja | 🌙 |
| rune_link | Runen | Ja | ✨ |
| hybrid_bonus | Runen | Nein | — |
| timing | Sterne | Ja | ⭐ |
| momentum | Urgewalten | Ja | 🌋 |
| shield_bonus | Global | Nein | 🛡 |
| armor_break | Global | Nein | ⚔ |
| aftershock | Global | Nein | 🌋 |

## Regeln

Status mit **Sichtbar = Ja** werden künftig als Statuschips im Charakterfenster dargestellt.

Jeder Statuschip besitzt später:

- Icon
- Tooltip
- Stapelanzeige (falls stapelbar)
- Restdauer (falls relevant)

Status mit **Sichtbar = Nein** sind reine interne Kampfzustände und werden nicht dauerhaft im UI angezeigt.

# Dokumentenhierarchie

implementation_rules.md

↓

combat_rules.md

↓

status_effects.md

↓

*_spec.md

↓

Code

Diese Reihenfolge ist verbindlich.