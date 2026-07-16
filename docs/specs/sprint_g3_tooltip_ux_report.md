# Sprint G3 – Tooltip & Card UX Refresh Report

**Status:** Abgeschlossen  
**Datum:** 2026-07-07  
**Scope:** UI/UX — keine Gameplay-, Balance- oder Tooltip-Textänderungen an Zauberdaten

---

## 1. Angepasste UI-Bereiche

| Bereich | Änderung |
|---------|----------|
| **Starterauswahl** | Keine Rang-Anzeige; Karten zeigen Icon, Name, Schule, Seltenheit, Beschreibung, aktuelle Werte (Rang 1) |
| **Tooltips** (Starter, Actionbar, Rewards, Build-Panel) | Neue Struktur ohne Tags/Rang; einheitliche Informationshierarchie |
| **Reward-Karten** | Tags entfernt; Rang, Seltenheit, Werte und Upgrade-Vergleich unverändert erhalten |
| **Actionbar** | Unverändert: Rang + Icon (+ Cooldown im Kampf) |
| **CSS** | Styles für Spezialisierung, Tooltip-Reihenfolge, Starter-Karten |

---

## 2. Ranginformationen — wo sichtbar?

| Kontext | Rang sichtbar? |
|---------|----------------|
| Starterauswahl | **Nein** |
| Tooltips | **Nein** |
| Actionbar (Kampf + Readonly) | **Ja** |
| Reward-Karten | **Ja** (Footer „Rang …“) |
| Pfadwahl-Karten | **Ja** (Titel „… III“) |

---

## 3. Entfernte Tags

Entfernt aus **allen** sichtbaren Zauberkarten und Tooltips:

- Typ-Badges (z. B. „Angriff“, „Schutz“)
- Tag-Badges (z. B. „Burst“, „Vorbereitung“)
- Tooltip-Rang-Zeile („Rang I“ …)
- Tooltip-Badge-Leiste

**Intern unverändert:** `spell.role`, `spell.build`, `spell.mechanics`, `spell.tags` in Daten.

---

## 4. Tooltip-Inhalt (spielrelevant)

Reihenfolge in allen Tooltips:

1. Icon  
2. Zaubername  
3. Seltenheit  
4. Schule  
5. Beschreibung (`spell.description`)  
6. Aktuelle Werte (`getSpellTooltipLines` für aktuellen Rang/Pfad)  
7. Spezialisierung (Pfad-Label ab Rang 3, falls gewählt)

**Nicht mehr enthalten:** Tags, Rangzahl, Entwickler-/Mechanik-Labels aus der UI.

Keyword-Hervorhebungen in Beschreibung/Werten (`tooltip-keyword`) bleiben — sie erklären Spielbegriffe wie „Verwundbar“.

---

## 5. Datenquelle

Alle Darstellungen nutzen weiterhin `getSpellTooltipView()` → `getSpellTooltipLines()` / `getSpellRewardView()`.

Kontextsteuerung über `variant`:

- `selection` — Beschreibung + Werte, kein Rang  
- `reward` — Werte + Rang + Upgrade-Diff im Footer  
- Tooltips — volle Hierarchie inkl. Spezialisierung

---

## UX-Review

| Kriterium | Bewertung |
|-----------|-----------|
| **Starterauswahl — Übersichtlichkeit** | Gut — weniger visuelles Rauschen; Fokus auf Fantasy + Wirkung |
| **Tooltips — Lesbarkeit** | Gut — klare vertikale Hierarchie, kein Badge-Clutter |
| **Reward-Karten — Verständlichkeit** | Gut — Upgrade-Diff und Rang weiterhin sofort sichtbar |
| **Konsistenz** | Gut — eine Datenquelle, kontextabhängige Informationsdichte |

---

## Geänderte Dateien

- `src/spellRegistry.js` — vereinfachtes `getSpellTooltipView`
- `src/renderer.js` — Karten-Varianten, Tooltip-Layout
- `style.css` — Tooltip-Spezialisierung, Starter-Spacing

---

## Bestätigung

- ✓ Starter zeigen keine Rang-1-Darstellung mehr  
- ✓ Tags in UI entfernt, interne Daten bleiben  
- ✓ Tooltips nur spielrelevante Felder  
- ✓ Actionbar behält Rang  
- ✓ Rewards behalten Fortschrittsinformationen
