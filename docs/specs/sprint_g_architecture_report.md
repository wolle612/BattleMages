# Sprint G – Architecture Cleanup Report

**Status:** Abgeschlossen  
**Datum:** 2026-07-07  
**Scope:** Legacy-Entfernung, Architektur-Verifikation, Datenvalidierung — keine Gameplay-/UI-/Balance-Änderungen

---

## 1. Entfernte Legacy-Komponenten

| Komponente | Typ | Grund |
|------------|-----|-------|
| `spells.js` (Root) | Datei | Nur Wrapper um `createLegacySpells()`; ersetzt durch Export in `spellRegistry.js` |
| `combat.js` (Root) | Datei | Altes 10-Gegner-Array (HP/Damage); nicht in `index.html` geladen |
| `game.js` (Root) | Datei | Vor-Migrations-UI mit `spell.element`; nicht in `index.html` geladen |
| `createLegacySpells()` | Funktion | Flache Felder `element`, `damage`, `shield` — keine Referenzen mehr in `src/` |
| `buildPrepFromLegacySchoolBonus()` | Funktion | Tot; keine Aufrufer nach Spellbook v2-Migration |
| `buildPrepFromLegacyConditional()` | Funktion | Tot; keine Aufrufer |
| `reduceCooldowns()` | Funktion | Tot; nie aufgerufen |
| `SPELL_DESCRIPTIONS` (Legacy-IDs) | Daten | Fallback-Texte für alte Zauber-IDs (`blood_strike`, `dreamwalk`, …) entfernt |
| `legacyId` in `COMBAT_SCHOOLS` | Datenfeld | Ungenutzt nach Migration |
| `LEGACY_STATUS_ALIASES` | Konstante | Umbenannt zu `STATUS_ALIASES` (`wound` → `vulnerable`, weiterhin aktiv) |

**Bereits zuvor entfernt (Sprint C/D):** `src/legacySpellAdapter.js`, `data/spellsLegacy.js`, Legacy-Enemy-Rotation, `SPELL_EFFECTS`-Namensverzweigungen.

---

## 2. Zentrale Datenstrukturen

| Datei | Inhalt |
|-------|--------|
| `data/spellbookCore.js` | 12 Starter + Part-I-Zauber |
| `data/spellbookPart2.js` | 23 Part-II-Zauber |
| `data/spells.js` | Merge zu `rawSpellDefinitions` (35 Zauber) |
| `data/spellUpgradeProfiles.js` | Rang 2–5 + Pfad A/B für alle 35 Zauber |
| `data/enemies.js` | 12 v3-Gegner (Impulse-Combat) |
| `data/combatIdentity.js` | Formeln, Schulen, Build-Archetypen, Sequenz-Trigger |

**Laufzeit-Export:** `spellDefinitions` + `spells` (sortiert) aus `src/spellRegistry.js`; `enemies` aus `src/enemyRegistry.js`.

---

## 3. Combat-Core-Module

```
index.html
  └─ data/* (Spellbook, Upgrades, Enemies, Identity)
  └─ spellRegistry / enemyRegistry / upgradeResolver
  └─ combatContext ──► battleManager (Impulse-Loop)
         │                    │
         ├─ spellEngine ◄─────┤ resolveSpellCast
         ├─ enemyEngine ◄─────┤ resolveEnemyImpulse
         ├─ combatFormula
         ├─ combatSequence
         ├─ combatPrep
         ├─ combatStatus
         └─ effectEngine
```

| Modul | Verantwortung |
|-------|---------------|
| `battleManager.js` | Kampfschleife, Runden, Sieg/Niederlage |
| `combatContext.js` | Kontext-Initialisierung, Cast-State |
| `spellEngine.js` | Effekt-IDs → Schaden/Schild/Status/Prep |
| `enemyEngine.js` | Action-Bar, Passiv-Hooks, Boss-Schulwechsel |
| `combatFormula.js` | Schaden, Krit, Verwundbar, Schild-Boni |
| `combatSequence.js` | Sequenz-Trigger (generisch über `sequenceTrigger`) |
| `combatPrep.js` | „Nächster Zauber“-Vorbereitung |
| `combatStatus.js` | Verwundbar, Status-Normalisierung |
| `effectEngine.js` | Schild-Absorption (Spieler/Gegner) |
| `upgradeResolver.js` | Rang/Pfad-Auflösung → `values` + `effects` |
| `rotationManager.js` | Spieler-Rotationsreihenfolge |

---

## 4. Rendering / Meta (kein Combat-Logic)

| Modul | Verantwortung |
|-------|---------------|
| `renderer.js` | Screens, Kampf-UI, Tooltips, Belohnungsanzeige |
| `game.js` | Run-Flow, Screen-Wechsel, Event-Handler |
| `rewardSystem.js` | Belohnungs-Gewichtung und -Generierung |
| `portraitRegistry.js` | Portrait-Pfade |
| `constants.js` | HP, Starter-Counts, Timing-Konstanten |
| `state.js` | Run-State (`selectedSpells`, `spellRanks`, `spellPaths`) |
| `utils.js` | Hilfsfunktionen (Römische Zahlen) |

---

## 5. Architektur-Verifikation

| Prüfpunkt | Ergebnis |
|-----------|----------|
| Spell-Namensprüfungen in Combat | **Keine** — nur `spell.id` für Logik |
| Gegner-Namensprüfungen | **Keine** — nur `enemy.id`, `tier`, Passiv-Hooks |
| Schul-Sonderfälle in Combat | **Generisch** — Sequenz/Prep über Datenkeys; Ausnahme: `isRunicCombination()` prüft `school === "rune"` (siehe Schulden) |
| Legacy-Effekt-IDs | **Keine** — Spell: `deal_damage`, `gain_shield`, …; Enemy: `deal_damage`, `gain_shield`, `heal`, `apply_status`, … |
| Geladene Legacy-Dateien | **Keine** — `index.html` bereinigt |

---

## 6. Datenvalidierung

### Zauber (35/35)

Alle Pflichtfelder vorhanden: `id`, `school`, `role`, `build`, `mechanics`, `effects`, `upgrades`, `rarity`, `description`, `tooltip`.

Upgrade-Profile: 35/35 Zauber abgedeckt (`tools/validate_data.py`).

### Gegner (12/12)

Alle Pflichtfelder vorhanden: `id`, `passive`, `actionBar`, `combatIdentity`, `buildTest`, `encounter`, `tier`, `hp`, `ui`, `rewards`.

---

## 7. Playtest-Bereitschaft

| Kriterium | Status |
|-----------|--------|
| Einheitliche Daten-Architektur | ✅ |
| Keine aktiven Legacy-Pfade | ✅ |
| Combat vollständig ID-basiert | ✅ (Display nutzt `name` nur für UI-Text) |
| Upgrade-System integriert | ✅ |
| Enemy v3 integriert | ✅ |
| Balance-/Playtest-fähig | ✅ |

**Empfehlung:** Projekt ist bereit für langfristiges Balancing und manuelles Playtesting.

---

## 8. Verbleibende technische Schulden

1. **`spellRegistry.js` — Tooltip-Builder für ungenutzte Legacy-Value-Keys**  
   Zeilen für `echoPercent`, `nextBloodDamageBonus`, `momentumGain`, `masterRuneAdaptiveBonus` usw. — keine Entsprechung in aktuellen Zauberdaten; harmlos, aber ~400 Zeilen toter Tooltip-Code.

2. **`combatPrep.js` — `isRunicCombination()`**  
   Hardcoded `school === "rune"`; kein Zauber setzt `requireRuneCombo` / `conditionalTrigger: "rune_combo"` in Daten.

3. **`combatPrep.js` — `createNextSpellPrep`-Felder**  
   `echoPercent`, `ruleBreak`, `requireRuneCombo` — Legacy-Infrastruktur ohne aktive Zauberdaten.

4. **`rewardSystem.js` — `requiredStatusId === "wound"`**  
   Alias existiert (`STATUS_ALIASES`); kein Zauber nutzt `wound` mehr direkt.

5. **`renderer.js` — `wound`-Status-View**  
   Visuelles Mapping für Alias; funktional, aber redundant zu `vulnerable`.

6. **`utils.js` — doppelte Funktionen**  
   `toRoman()` und `romanize()` mit leicht unterschiedlichen Bereichen.

7. **`spellRegistry.js` — `SPELL_ICON_FILE_OVERRIDES`**  
   Mappt neue Spell-IDs auf alte Icon-Dateinamen; kein Legacy-Code, aber Asset-Naming-Schuld.

8. **`enemyEngine.js` — `BOSS_SCHOOL_CYCLE`**  
   Schul-Reihenfolge hardcoded; Schultechnik-Werte datengetrieben, Zyklus-Reihenfolge nicht.

9. **`docs/archive/`**  
   Alte Specs (Sprint ≤18); nicht im Runtime-Pfad, aber verwirrend neben `docs/design/`.

10. **`tools/balance_sim.py`**  
    Vereinfachte Python-Simulation; nicht an echten Engine-Code gekoppelt.

---

## Geänderte Dateien (Sprint G)

- **Gelöscht:** `spells.js`, `combat.js`, `game.js` (Root)
- **Geändert:** `index.html`, `src/spellRegistry.js`, `src/combatPrep.js`, `src/effectEngine.js`, `src/combatStatus.js`, `data/combatIdentity.js`
- **Neu:** `tools/validate_data.py`, dieses Dokument
