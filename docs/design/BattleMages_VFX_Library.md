# BattleMages -- VFX Library

> Zentrale Referenz aller wiederverwendbaren VFX-Assets für BattleMages.
>
> Dieses Dokument enthält **keine Designregeln** (siehe
> `BattleMages_VFX_Style_Guide.md`), sondern ausschließlich die
> Asset-Bibliothek und deren Verwendung.

------------------------------------------------------------------------

# Namenskonvention

    <school>_<category>_<name>

Beispiele:

-   `psionic_impact_mind_ring_burst`
-   `psionic_projectile_mind_pressure_arc`
-   `shadow_cast_shadow_focus`
-   `biomancy_particles_bone_dust`

------------------------------------------------------------------------

# Ordnerstruktur

    assets/
    └── vfx/
        ├── cast/
        ├── projectile/
        ├── impact/
        ├── particles/
        ├── sounds/
        └── manifests/

------------------------------------------------------------------------

# Asset-Kategorien

## Cast

  ----------------------------------------------------------------------------------------------------
  Asset                         Schule    Status    Größe   Frames   Wiederverwendbar   Verwendet von
  ----------------------------- --------- --------- ------- -------- ------------------ --------------
  psionic_cast_mind_focus_hex   Psionik   ✅         96×71   6        Ja                 Gedankenschlag
                                         Referenz                                       

  ----------------------------------------------------------------------------------------------------

------------------------------------------------------------------------

## Projectile

  ---------------------------------------------------------------------------------------------------------------
  Asset                                  Schule    Status    Größe   Frames   Wiederverwendbar   Verwendet von
  -------------------------------------- --------- --------- ------- -------- ------------------ ----------------
  psionic_projectile_mind_pressure_arc   Psionik   ✅         64×24   8        Ja                 Gedankenschlag
                                             Referenz                                       

  ---------------------------------------------------------------------------------------------------------------

------------------------------------------------------------------------

### PixiJS Motion Presets

  --------------------------------------------------------------------------------------------------------------
  Preset          Schule    Status    Verwendet von   Bewegungsprofil
  --------------- --------- --------- --------------- ---------------------------------------------------------
  psionic_glide   Psionik   ✅         Gedankenschlag Smoothstep-Flug, 0.95→1.00→0.97 Puls, ±2° Hover, 1.4 px
                                                      Querdrift und dezenter, prozeduraler 30-px-Cyan-Trail
  --------------------------------------------------------------------------------------------------------------

`psionic_glide` ist ein reines PixiJS-Preset. Es verändert weder Sprite
Sheet noch PNG und kann über `motion: "psionic_glide"` von weiteren
Psionik-Projektil-Presets wiederverwendet werden.

------------------------------------------------------------------------

## Impact

  ----------------------------------------------------------------------------------------------------------
  Asset                            Schule    Status     Größe   Frames   Wiederverwendbar   Verwendet von
  -------------------------------- --------- ---------- ------- -------- ------------------ ----------------
  psionic_impact_mind_ring_burst   Psionik   ✅         96×96   8        Ja                 Gedankenschlag
                                             Referenz                                       

  ----------------------------------------------------------------------------------------------------------

------------------------------------------------------------------------

## Particles

  -------------------------------------------------------------------------------------------------------
  Asset                          Schule    Status    Größe   Frames   Wiederverwendbar   Verwendet von
  ------------------------------ --------- --------- ------- -------- ------------------ ----------------
  psionic_particles_mind_motes   Psionik   ⏳        --      --       Ja                 Gedankenschlag
                                           Geplant                                       

  -------------------------------------------------------------------------------------------------------

------------------------------------------------------------------------

## Sounds

  Asset             Schule    Status      Verwendung
  ----------------- --------- ----------- ------------
  psionic_cast_01   Psionik   🔲 Später   Cast
  psionic_hit_01    Psionik   🔲 Später   Impact

------------------------------------------------------------------------

# Zauber → Asset-Zuordnung

  ----------------------------------------------------------------------------------------------------------------------------------------------------------------------
  Zauber           Cast                          Projectile                             Impact                           Particles                      Sound
  ---------------- ----------------------------- -------------------------------------- -------------------------------- ------------------------------ ----------------
  Gedankenschlag   psionic_cast_mind_focus_hex   psionic_projectile_mind_pressure_arc   psionic_impact_mind_ring_burst   psionic_particles_mind_motes   psionic_hit_01

  ----------------------------------------------------------------------------------------------------------------------------------------------------------------------

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

## v1.5

-   `psionic_cast_mind_focus_hex` als 6-Frame-Spritesheet integriert.
-   Gedankenschlag nutzt eine dynamische 120-ms-Castphase vor dem
    `mind_pressure_arc`-Projectile.

## v1.4

-   Wiederverwendbares PixiJS-Motion-Preset `psionic_glide` für
    `psionic_projectile_mind_pressure_arc` integriert.
-   Kontrolliertes Pulsieren, maximal ±2° Rotation, 1.4-px-Querdrift,
    Smoothstep-Flug und prozeduraler 30-px-Trail ohne zusätzliche Assets.

## v1.3

-   Gedankenschlag VFX-Vertical-Slice integriert (Cast/Projectile/Impact-Sync)
-   Schadenszahl koppelt an Impact-Moment via `onImpact`-Callback

## v1.2

-   `psionic_projectile_mind_pressure_arc` Animation v2.0 (Polish, kein Redesign)
-   8-Frame-Energiezyklus: komprimieren → fokussieren → entfalten → stabilisieren → destabilisieren → Tail-Reform → partielle Auflösung → nahe Auflösung

## v1.1

-   Zweites Referenzasset `psionic_projectile_mind_pressure_arc` aufgenommen
-   Preset-Key: `mind_pressure_arc`
-   Pfad: `assets/effects/projectiles/mind_pressure_arc/`

## v1.0

-   Bibliothek angelegt
-   Psionik als Referenzschule
-   Erstes Referenzasset `psionic_impact_mind_ring_burst` aufgenommen
