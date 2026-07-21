# BattleMages -- Spell Authoring Checklist

> Kurzreferenz für das Anlegen neuer Zauber. Macht nur explizit, was im
> aktuellen Code bereits Konvention ist -- keine neue Design-Vorgabe.
> Entstanden als Phase-0-Vorbereitung der Content-Phase, siehe
> `docs/specs/architecture_design_audit_2026-07-21.md`.

---

## 0. Vor dem Entwerfen: braucht die Schule wirklich eine neue Rolle?

Nicht jede Schule muss alle vier Rollen (Generator/Verstärker/Build-Enabler/
Finisher) selbst abdecken. **Seelenmagie ist die bestätigte Ausnahme**: sie hat
bewusst keinen Generator/Finisher, weil jeder ihrer Zauber zwei Mechaniken
verbindet und externen Input (meist Verwundbar oder Schild) aus einer anderen
Schule voraussetzt -- siehe Hinweis in
`docs/design/BattleMages_Combat_Identity_Matrix_v1.0.md`. Vor dem Ergänzen
einer fehlenden Rolle erst prüfen, ob die Lücke ein echtes Versehen ist
(wie bei Chaosmagie, wo ein fehlender Generator ergänzt wurde) oder eine
logische Konsequenz der Schul-Identität (wie bei Seelenmagie).

---

## 1. Wo der Zauber hin muss

- **Basis-Definition (Rang 1)**: `data/spellbookCore.js` oder
  `data/spellbookPart2.js` -- beide werden zu `rawSpellDefinitions`
  zusammengeführt (`data/spells.js`), technisch egal welche Datei.
- **Rang-Upgrades**: `data/spellUpgradeProfiles.js` -- optional (ein Zauber
  ohne Eintrag bleibt dauerhaft auf Rang 1 stehen), aber jeder
  `spellbookCore: true`-Zauber sollte einen vollständigen Verlauf bekommen.

## 2. Pflichtfelder in der Basis-Definition

| Feld | Beispiel | Hinweis |
|---|---|---|
| `id` | `"chaos_spark"` | eindeutig, snake_case, wird auch als Icon-/VFX-Schlüssel benutzt |
| `school` | `"star"` | interne Kurz-ID, siehe Tabelle unten -- **nicht** der Fantasy-Name |
| `name` | `"Chaosfunke"` | deutscher Anzeigename |
| `type` | `"Attack"` \| `"Status"` \| `"Protection"` | |
| `role` | `"generator"` | siehe SPELL_ROLES unten |
| `build` | `"burst"` | siehe BUILD_ARCHETYPES unten -- **rein intern**, nie spielersichtbar (siehe CLAUDE.md) |
| `mechanics` | `["crit"]` | siehe Mechanik-Vokabular unten |
| `rarity` | `"Common"` | ohne Angabe: automatischer Default nach Position in der Schule -- explizit setzen empfohlen |
| `description` | kurzer Fließtext | |
| `tooltip` | `["Verursacht 30 Schaden."]` | siehe Abschnitt 6 |
| `tags` | `["Attack"]` | in der Praxis meist nur der `type`-Wert erneut; wird in der UI gegen den `type` herausgefiltert |
| `spellbookCore` | `true`/`false` | ob der Zauber Teil des Kern-Spellbooks ist |
| `starter` | `true`/`false` | ob er in der Startauswahl auftauchen darf |
| `cooldown` | meist `0` | reguläre Zauber haben keinen Cooldown (siehe Kernprinzip "Rotation IST der Cooldown") |
| `effects` | `["deal_damage"]` | siehe Abschnitt 4 |
| `upgrades` | `[{ rank: 1, values: {...} }]` | Rang-1-Werte, siehe Abschnitt 5 |

## 3. Feste Vokabulare (nicht erweitern ohne Rücksprache)

**Schulen** (`data/combatIdentity.js`, `COMBAT_SCHOOLS`):

| interne ID | Fantasy-Name | Icon-Ordner |
|---|---|---|
| `blood` | Biomantie | `biomancy` |
| `shadow` | Schatten | `shadow` |
| `dream` | Psionik | `psionics` |
| `rune` | Verbotene Runenkunst | `forbidden_runes` |
| `star` | Chaosmagie | `chaos` |
| `primal` | Seelenmagie | `soul` |

**Rollen** (`SPELL_ROLES`): `generator`, `verstaerker`, `finisher`,
`utility`, `build_enabler`.

**Mechanik-Tags** (`mechanics[]`, sollte zu `COMBAT_SCHOOLS[school]`s
`primaryMechanic`/`secondaryMechanic`/`rareMechanic` passen):
`vulnerable`, `crit`, `shield`, `hybrid`, `sequence`, `burst`, `utility`,
`sustain`.

**Build-Archetypen** (`BUILD_ARCHETYPES`, 15 Stück, z. B. `schildfestung`,
`verwundbar_burst`, `kritmaschine`, `monoschule`, `multischule`, `sequenz`,
`burst`, `sustain`, `one_shot`, `kontrollierter_schaden` ...): volle Liste in
`data/combatIdentity.js`. **Nur internes Design-/Balance-Werkzeug, niemals
im UI anzeigen** (siehe CLAUDE.md, "Build-Archetyp-Entscheidung").

## 4. Effekte (`effects[]`) -- welche IDs existieren

Dispatch in `src/spellEngine.js` (`resolveSpellEffect`), aktuell genau
diese sieben:

`deal_damage`, `gain_shield`, `apply_vulnerable`, `grant_next_spell_prep`,
`deal_shield_damage`, `increase_shield_percent`,
`gain_shield_from_dealt_damage`.

## 5. Werte (`values`) -- keine zweite Vokabelliste pflegen

Absichtlich **keine Liste möglicher `values`-Keys hier**. Die einzige
gültige Quelle sind `src/combatFormula.js` und `src/spellEngine.js` selbst
-- genau eine parallele Dokumentation dieser Werte (in
`spellRegistry.js`s Tooltip-Generator) ist der Grund, warum am
2026-07-21 866 Zeilen toter Code entfernt werden mussten (siehe Audit).
Beim Bauen eines neuen Effekts: den passenden `values`-Key in der echten
Formel-Funktion nachschlagen/ergänzen, nicht hier eintragen.

## 6. Tooltip-Konvention

- `tooltip: [...]` in der Basis-Definition: kurze, direkte Sätze im Stil
  "Verursacht X Schaden.", "Erhalte X Schild.", "Fügt Verwundbar zu."
- Rang-Upgrade-Tooltips (`spellUpgradeProfiles.js`, `rank2`/`rank3`/`rank4`/
  `rank5`) werden entweder als **vollständiger Ersatz** oder als
  **Ergänzung** zu den bisherigen Zeilen behandelt (`getSpellTooltipLines`,
  `tooltipLinesLookComplete`): enthält eine der neuen Zeilen ein Muster wie
  `verursacht \d`, `erhalte \d` oder `erhöhe dein`, gilt sie als
  vollständiger Ersatz; sonst wird sie an die bisherigen Zeilen angehängt.
  Beim Formulieren neuer Rang-Tooltips darauf achten, welches Verhalten
  gewünscht ist.

## 7. VFX

- **Cast und Impact** ergeben sich automatisch aus der Schule -- nichts zu
  tun.
- **Projektiltyp**: Pflichteintrag in `SPELL_PROJECTILE_TYPES`
  (`data/vfx/spellVfxDefinitions.js`), sonst kein Projektil-Rendering.
  Werte: `"beam"`, `"cut"`, `"explosion"`, `"projectile"`, `"shield"`
  (siehe Kommentar in derselben Datei für die genaue Bedeutung jedes Typs).

## 8. Icon

- Pfad: `assets/icons/spells/{iconFolder}/{spell.id}.png` (Icon-Ordner
  aus der Schulen-Tabelle oben).
- 1024x1024, transparenter Hintergrund, ein Hauptmotiv, kein Rahmen/Text/
  Rarity-Farbe (siehe `docs/art_style.md`, `docs/design/BattleMages_Icon_Design_Guide.md`).

## 9. Nach dem Anlegen: validieren

1. `py tools/validate_data.py` -- Pflichtfelder, Cross-Referenz zu
   `spellUpgradeProfiles.js`.
2. `py tools/validate_icons.py` -- Icon-Datei am erwarteten Pfad vorhanden.
3. `node tools/validate_vfx_assets.py` -- falls VFX-Presets/Definitionen
   angefasst wurden.
4. `node tools/test_combat_formula.js` -- falls eine neue/geänderte
   Formel-Mechanik betroffen ist, ggf. Testfall ergänzen.
5. `node tools/simulate_full_builds.js` -- RV-Check gegen die Zielbänder
   aus `Combat_Formula_v2.md`, wenn der Zauber Teil eines zu bewertenden
   Builds ist (Build-Liste im Skript anpassen).

## 10. Nicht tun

- Keine neue Mechanik-Vokabelliste parallel zu `combatFormula.js`/
  `spellEngine.js` pflegen (siehe Abschnitt 5).
- Keine neuen Schulen-IDs einführen, ohne alle drei Namens-Tabellen
  gleichzeitig zu aktualisieren (`VFX_SCHOOL_ID_MAP` in
  `data/vfx/schoolVfxAssets.js`, `SCHOOL_ICON_FOLDERS` in
  `tools/validate_icons.py`, `COMBAT_SCHOOLS` in
  `data/combatIdentity.js`) -- siehe CLAUDE.md, "Bekannte Stolperfallen".
- Keine Build-Archetyp-Namen im UI/in Tooltips anzeigen (Abschnitt 3).
