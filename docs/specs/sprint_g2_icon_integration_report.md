# Sprint G2 – Spell Icon Integration Report

**Status:** Abgeschlossen  
**Datum:** 2026-07-07  
**Scope:** Datengetriebene Icon-Integration — keine Gameplay-/Balance-/Tooltip-Änderungen

---

## Ergebnis

| Prüfpunkt | Ergebnis |
|-----------|----------|
| Spell-Icons gefunden | **35 / 35** |
| Spell-IDs = Asset-Dateinamen | **Ja** (nach Asset-Korrektur) |
| School-Ordner korrekt | **Ja** (über `COMBAT_SCHOOLS.iconFolder`) |
| `SPELL_ICON_FILE_OVERRIDES` entfernt | **Ja, vollständig** |
| `SPELL_ICON_FOLDER_BY_SCHOOL` entfernt | **Ja, vollständig** |
| Icon-System datengetrieben | **Ja** |

---

## Icon-Lookup (neu)

Pfad wird zentral in `getSpellIconPath()` erzeugt:

```
assets/icons/spells/{COMBAT_SCHOOLS[school].iconFolder}/{spell.id}.png
```

**School → Asset-Ordner** (`data/combatIdentity.js`):

| `spell.school` | `iconFolder` |
|----------------|--------------|
| `blood` | `biomancy` |
| `shadow` | `shadow` |
| `dream` | `psionics` |
| `rune` | `forbidden_runes` |
| `star` | `chaos` |
| `primal` | `soul` |

Gameplay-Schul-IDs (`blood`, `dream`, …) bleiben unverändert. Der Asset-Ordner ist Teil der Schul-Identitätsdaten — kein per-Spell-Mapping.

**Fallback:** Bei fehlendem Icon zeigt `bindSpellIcon()` weiterhin den Initialen-Platzhalter (`getSpellIconFallbackInitial`).

---

## Asset-Validierung: gefundene Inkonsistenzen (behoben)

13 Icon-Dateien hatten abweichende Namen und wurden auf `spell.id` umbenannt:

| Spell-ID | Alter Dateiname | Neuer Dateiname |
|----------|-----------------|-----------------|
| `death_stroke` | `deathblow.png` | `death_stroke.png` |
| `dark_blow` | `gloom_strike.png` | `dark_blow.png` |
| `shadow_mantle` | `shadow_cloak.png` | `shadow_mantle.png` |
| `will_break` | `mind_break.png` | `will_break.png` |
| `mind_strike` | `mind_blast.png` | `mind_strike.png` |
| `mind_stream` | `mindstream.png` | `mind_stream.png` |
| `shield_breaker` | `shieldbreaker.png` | `shield_breaker.png` |
| `rune_harmony` | `rune_harmoney.png` | `rune_harmony.png` |
| `amplified_seal` | `empowered_seal.png` | `amplified_seal.png` |
| `fracture_rune` | `rune_of_fracture.png` | `fracture_rune.png` |
| `rune_thrust` | `rune_strike.png` | `rune_thrust.png` |
| `soul_bind` | `soul_bond.png` | `soul_bind.png` |
| `soul_cut` | `soul_rend.png` | `soul_cut.png` |

**22 Zauber** hatten bereits korrekte Dateinamen und Ordner.

**Verwaiste Assets** (kein Spellbook-Eintrag, nicht geladen): z. B. `shadow/shadow_step.png`, Legacy-Icons in alten Ordnern (`blood/`, `dream/`, `runes/`, `stars/`, `primal/`).

---

## UI-Abdeckung

Alle Spell-Icons laufen über `renderSpellIconElement()` → `getSpellIconPath()`:

- Starterauswahl
- Actionbar / Build-Manager
- Belohnungen (Upgrade / Neuer Zauber / Pfadwahl)
- Tooltips
- Kampf-Feedback (über Action-Queue)

Keine separaten Icon-Pfade im Renderer.

---

## Daten-Konsistenz (Spells)

| Feld | Status |
|------|--------|
| `id` | 35 eindeutige IDs |
| `school` | Alle 6 Schulen gültig |
| `rarity`, `role`, `build`, `mechanics` | Vollständig |
| `effects`, `upgrades`, `tooltip` | Vollständig |
| Icon (via `school` + `id`) | 35/35 vorhanden |

Validator: `tools/validate_icons.py`

---

## Entfernte Legacy-Komponenten

- `SPELL_ICON_FILE_OVERRIDES` (35 Einträge)
- `SPELL_ICON_FOLDER_BY_SCHOOL` (6 Einträge)

---

## Asset-Review

- ✓ Alle Zauber besitzen ein gültiges Icon  
- ✓ Alle Icons werden automatisch über `getSpellIconPath()` geladen  
- ✓ Keine Legacy-Mappings mehr  
- ✓ Neue Zauber: `spell.school` + `spell.id` + PNG in `{iconFolder}/` — fertig  

---

## Geänderte Dateien

- `data/combatIdentity.js` — `iconFolder` pro Schule
- `src/spellRegistry.js` — vereinfachter Icon-Lookup, Overrides entfernt
- `assets/icons/spells/**` — 13 Datei-Umbenennungen
- `tools/validate_icons.py` — neu

---

## Optionale Nacharbeit (kein Blocker)

Alte Icon-Ordner (`blood/`, `dream/`, `runes/`, `stars/`, `primal/`) und verwaiste PNGs können in einem Asset-Cleanup-Sprint gelöscht werden; sie werden vom Spiel nicht mehr referenziert.
