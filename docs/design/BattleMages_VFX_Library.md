# BattleMages -- VFX Library

> Zentrale Referenz aller produktiven VFX-Assets für BattleMages.
>
> Dieses Dokument enthält **keine Designregeln** (siehe
> `BattleMages_VFX_Style_Guide.md`), sondern ausschließlich die
> Asset-Bibliothek und deren Verwendung.

------------------------------------------------------------------------

# Zielmodell (verbindlich)

Pro Schule existiert genau **1 Cast**, **1 Impact** und je **1 Sheet**
für die drei Projektiltypen **Beam**, **Explosion** und
**Schnitt/Cut** -- macht 5 Sprite-Sheets x 6 Schulen = **30
Sprite-Sheets** insgesamt. Herleitung/Entscheidung dazu:
`BattleMages_VFX_Production_Plan_v2.md`.

**Shield** (CSS/DOM-Portrait-Animation) und **Particles** (rein
prozedural, `PIXI.Graphics`) sind bewusst keine Sprite-Sheets -- siehe
jeweilige Abschnitte unten.

Der frühere Plan einer benannten Variantenbibliothek pro Zauber
(Small/Heavy/Burst je Kategorie) wurde verworfen, siehe
`BattleMages_VFX_Production_Plan_v2.md` Abschnitt "Verworfener
Ansatz". Namen wie `psionic_impact_mind_ring_burst` aus älteren
Doku-Ständen existieren nicht mehr im Code.

------------------------------------------------------------------------

# Namenskonvention

    school_<category>_<vfxSchoolId>

Beispiele: `school_cast_biomancy`, `school_beam_psionic`,
`school_impact_soul`. Definiert in
`data/vfx/schoolVfxAssets.js` (`VFX_SCHOOL_SHEET_PRESETS`).

`<vfxSchoolId>` ist die VFX-Schul-ID (`biomancy` / `shadow` /
`psionic` / `rune` / `chaos` / `soul`), **nicht** die interne
Engine-Schul-ID (`blood` / `shadow` / `dream` / `rune` / `star` /
`primal` aus `data/combatIdentity.js`). Die Übersetzung übernimmt
`VFX_SCHOOL_ID_MAP` (`data/vfx/schoolVfxAssets.js`) -- das ist die
**einzige** Stelle, die beide Namensräume verbindet.

------------------------------------------------------------------------

# Ordnerstruktur

    assets/
    └── effects/
        ├── cast/                          <Schule>_Cast.png / .json
        ├── impact/                        <Schule>_Impact.png / .json
        ├── projectiles/
        │   ├── Beam/                      <Schule>_Beam.png / .json
        │   ├── Explosion/                 <Schule>_Explosion.png / .json
        │   └── Schnitt/                   <Schule>_Cut.png / .json
        ├── shield/
        │   └── portrait_shield_rise/      CSS/DOM-Portrait-Animation
        └── particles/                     bewusst leer (prozedural)

`<Schule>` = Biomancy / Shadow / Psionic / Rune / Chaos / Soul.

------------------------------------------------------------------------

# Asset-Übersicht

Alle Einträge Status ✅ (produktiv, generiert via
`tools/generate_school_vfx_manifests.py`, Stand 2026-07-17). Frame-/
Timing-Details je Preset: `data/vfx/schoolVfxAssets.js`.

## Cast (Anzeigegröße 230px, Dauer 380ms)

| Schule | Datei | Frames |
|---|---|---|
| Biomantie | `cast/Biomancy_Cast.png` | 6 |
| Schatten | `cast/Shadow_Cast.png` | 6 |
| Psionik | `cast/Psionic_Cast.png` | 6 |
| Verbotene Runenkunst | `cast/Rune_Cast.png` | 6 |
| Chaosmagie | `cast/Chaos_Cast.png` | 6 |
| Seelenmagie | `cast/Soul_Cast.png` | 6 |

## Beam (Anzeigegröße 96px, Dauer 460ms)

| Schule | Datei | Frames |
|---|---|---|
| Biomantie | `projectiles/Beam/Biomancy_Beam.png` | 6 |
| Schatten | `projectiles/Beam/Shadow_Beam.png` | 7 |
| Psionik | `projectiles/Beam/Psionic_Beam.png` | 7 (Original, siehe Hinweis unten) |
| Verbotene Runenkunst | `projectiles/Beam/Rune_Beam.png` | 7 |
| Chaosmagie | `projectiles/Beam/Chaos_Beam.png` | 7 |
| Seelenmagie | `projectiles/Beam/Soul_Beam.png` | 7 |

## Explosion (Anzeigegröße 270px, Dauer 460ms)

| Schule | Datei | Frames |
|---|---|---|
| Biomantie | `projectiles/Explosion/Biomancy_Explosion.png` | 6 |
| Schatten | `projectiles/Explosion/Shadow_Explosion.png` | 7 |
| Psionik | `projectiles/Explosion/Psionic_Explosion.png` | 6 |
| Verbotene Runenkunst | `projectiles/Explosion/Rune_Explosion.png` | 6 |
| Chaosmagie | `projectiles/Explosion/Chaos_Explosion.png` | 6 |
| Seelenmagie | `projectiles/Explosion/Soul_Explosion.png` | 6 |

## Schnitt / Cut (Anzeigegröße 250px, Dauer 440ms)

| Schule | Datei | Frames |
|---|---|---|
| Biomantie | `projectiles/Schnitt/Biomancy_Cut.png` | 9 |
| Schatten | `projectiles/Schnitt/Shadow_Cut.png` | 9 |
| Psionik | `projectiles/Schnitt/Psionic_Cut.png` | 9 |
| Verbotene Runenkunst | `projectiles/Schnitt/Rune_Cut.png` | 9 |
| Chaosmagie | `projectiles/Schnitt/Chaos_Cut.png` | 9 |
| Seelenmagie | `projectiles/Schnitt/Soul_Cut.png` | 9 |

## Impact (Anzeigegröße 210px, Dauer 380ms)

| Schule | Datei | Frames |
|---|---|---|
| Biomantie | `impact/Biomancy_Impact.png` | 5 |
| Schatten | `impact/Shadow_Impact.png` | 5 |
| Psionik | `impact/Psionic_Impact.png` | 5 (Original, siehe Hinweis unten) |
| Verbotene Runenkunst | `impact/Rune_Impact.png` | 5 |
| Chaosmagie | `impact/Chaos_Impact.png` | 5 |
| Seelenmagie | `impact/Soul_Impact.png` | 6 |

**Hinweis Psionik-Beam/-Impact**: Diese beiden Dateien sind die
originalen, aus dem Internet bezogenen Sprite-Sheets. Alle übrigen
Schulen sind ChatGPT-recolorte Versionen mit identischem
Frame-Layout, deshalb stimmt die Frame-Anzahl je Kategorie über alle
Schulen hinweg überein, auch wenn die native Pixelauflösung der
Psionik-Originale von den recolorten Varianten abweicht. Kein
Handlungsbedarf -- PixiJS skaliert seitenverhältnis-erhaltend auf die
jeweilige Anzeigegröße.

------------------------------------------------------------------------

# Shield

`assets/effects/shield/portrait_shield_rise/` -- keine PixiJS-Sprite-
Sheet-Integration, sondern eine eigenständige CSS/DOM-Animation auf
dem Portrait (`portraitRegistry.js`, `PORTRAIT_SHIELD_RISE_ASSET`,
aufgerufen aus `renderer.js` und `battleMagesDev.js`). Zauber mit
Projektiltyp `"shield"` (`SPELL_PROJECTILE_TYPES`) nutzen diese
Animation statt eines Pixi-Sheets.

------------------------------------------------------------------------

# Particles

Vollständig prozedural (`PIXI.Graphics`-Kreise in
`src/vfx/effects/particleEffects.js`, gepoolt über
`src/vfx/objectPool.js`). Es gibt bewusst keine Particle-Sprite-Sheets;
`assets/effects/particles/` bleibt leer. Farb-/Größen-Presets pro
Schule stehen in `data/vfx/effectPresets.js` (`VFX_PARTICLE_PRESETS`,
z. B. `sparks_blood`, `sparks_shadow`, ...).

------------------------------------------------------------------------

# Sound

Noch nicht implementiert. `src/vfx/soundBridge.js` ist ein bewusster
No-Op-Stub -- es existiert aktuell kein Audiosystem im Projekt. Die
Timeline (`src/vfx/timeline.js`) ruft die Hooks (`sound.cast`,
`sound.projectile`, `sound.impact`) aber bereits auf, damit eine
spätere Audio-Integration keine Choreografie-Änderung erfordert.

------------------------------------------------------------------------

# Zauber → Asset-Zuordnung

Es gibt keine manuell gepflegte Zauber-für-Zauber-Tabelle mehr. Cast
und Impact ergeben sich automatisch aus `spell.school` (über
`VFX_SCHOOL_ID_MAP` + die Presets oben). Der Projektiltyp ist die
einzige Per-Zauber-Angabe und steht in `SPELL_PROJECTILE_TYPES`
(`data/vfx/spellVfxDefinitions.js`) -- diese Datei ist die
verbindliche Quelle für die Zauber→Projektiltyp-Zuordnung aller 35
Zauber.

Per-Zauber-Overrides sind über `VFX_SPELL_DEFINITIONS` (ebenfalls
`data/vfx/spellVfxDefinitions.js`) möglich, aktuell aber **leer** --
kein Zauber benötigt derzeit eine Sonderbehandlung.

------------------------------------------------------------------------

# Asset-Lebenszyklus

    Konzept
        ↓
    Produktionsplanung
        ↓
    Prompt
        ↓
    Sprite Sheet
        ↓
    QA
        ↓
    PixiJS-Integration
        ↓
    Gameplay-Test
        ↓
    Freigabe
        ↓
    Bibliothek

Gilt weiterhin für Einzelfälle (neue Schule, Ausnahme-Asset), siehe
`BattleMages_VFX_Production_Plan_v2.md` Abschnitt "Workflow für
neue/geänderte Assets".

------------------------------------------------------------------------

# Status-Legende

-   ⏳ Geplant
-   🎨 In Produktion
-   🔍 QA
-   🧪 Integration
-   ✅ Freigegeben
-   ♻️ Wiederverwendbar
-   🔲 Später

------------------------------------------------------------------------

# Änderungsprotokoll

## v2.0 (2026-07-21)

-   Modellwechsel dokumentiert: Variantenbibliothek (Small/Heavy/Burst
    pro Zauber) verworfen, zugunsten von 1 Cast + 1 Impact + 3
    Projektiltyp-Sheets pro Schule (30 Sprite-Sheets gesamt).
-   Asset-Übersicht auf den tatsächlichen Stand aller 6 Schulen
    gebracht (zuvor nur Psionik/Gedankenschlag als Referenzzauber
    dokumentiert).
-   Klarstellung zu Psionik-Beam/-Impact: originale Sprite-Sheets,
    keine fehlerhafte Generierung.
-   Zauber→Asset-Tabelle durch Verweis auf die datengetriebene Quelle
    (`SPELL_PROJECTILE_TYPES`) ersetzt.

## v1.0 -- v1.5 (Historie, Psionik-Pilot)

-   v1.0: Bibliothek angelegt, Psionik als Referenzschule, erstes
    Referenzasset `psionic_impact_mind_ring_burst`.
-   v1.1: Zweites Referenzasset `psionic_projectile_mind_pressure_arc`.
-   v1.2: Animations-Polish (8-Frame-Energiezyklus).
-   v1.3: Vertical-Slice-Integration (Cast/Projectile/Impact-Sync,
    Schadenszahl an `onImpact`-Callback gekoppelt).
-   v1.4: Wiederverwendbares PixiJS-Motion-Preset `psionic_glide`.
-   v1.5: `psionic_cast_mind_focus_hex` als 6-Frame-Spritesheet
    integriert.

Die in v1.0--v1.5 benannten Pilot-Assets existieren nicht mehr im
Projekt (siehe "Verworfener Ansatz" oben) -- diese Historie bleibt nur
zu Dokumentationszwecken erhalten.
