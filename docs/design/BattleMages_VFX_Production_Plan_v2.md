# BattleMages -- VFX Production Plan v2.0

> Dieses Dokument ersetzt den alten assetbasierten Produktionsplan.

**Revisionshinweis (Juli 2026)**: Das ursprünglich hier beschriebene
Bibliotheksmodell (mehrere benannte Varianten pro Kategorie und Schule,
siehe "Verworfener Ansatz" unten) wurde nicht weiterverfolgt. Dieses
Dokument beschreibt ab sofort das tatsächlich implementierte und
verbindliche Zielmodell.

**Wichtige Regel**

Die VFX-Bibliothek wird **NICHT pro Zauber**, sondern **pro
Magieschule** aufgebaut.

Das aktuelle Spellbook mit den **35 Zaubern**
(`data/spellbookCore.js` + `data/spellbookPart2.js`) ist die einzige
gültige Referenz. Es werden keine veralteten Zauber oder Zaubernamen
verwendet.

------------------------------------------------------------------------

# Produktionsprinzip

Nicht:

35 Zauber x eigene Cast-/Projectile-/Impact-Animation

Sondern:

Eine gemeinsame VFX-Sprache pro Schule.

Jeder Zauber besteht aus genau drei Phasen (siehe
`docs/BattleMages_VFX_Animation_Mapping_v1.0.md`):

1.  **Cast** -- wird aus der Schule des Zaubers abgeleitet
2.  **Projektiltyp** -- die einzige Per-Zauber-Angabe
3.  **Impact** -- wird aus der Schule des Zaubers abgeleitet

------------------------------------------------------------------------

# Zielmodell der Bibliothek

Pro Schule existiert genau:

-   **1 Cast**-Sprite-Sheet
-   **1 Impact**-Sprite-Sheet
-   **3 Projektiltyp**-Sprite-Sheets (Beam, Explosion, Schnitt/Cut) --
    ein Sheet pro Typ und Schule

= 5 Sprite-Sheets pro Schule x 6 Schulen = **30 Sprite-Sheets**
insgesamt.

Zwei Kategorien sind bewusst **kein Sprite-Sheet**, sondern
eigenständig gelöst:

-   **Shield** -- eigenständige CSS/DOM-Portrait-Animation
    (`assets/effects/shield/portrait_shield_rise/`,
    `portraitRegistry.js`), kein PixiJS-Sheet.
-   **Particles** -- vollständig prozedural erzeugt (`PIXI.Graphics`
    in `src/vfx/effects/particleEffects.js`), keine Sprite-Sheets.
    `assets/effects/particles/` bleibt bewusst leer.

Jeder Zauber wird aus diesen Bausteinen zusammengesetzt, nicht aus
individuell benannten Varianten.

------------------------------------------------------------------------

# Verworfener Ansatz (nicht weiterverfolgen)

Eine frühere Version dieses Dokuments sah pro Schule eine
**Variantenbibliothek** vor:

-   2 Casts (Small / Heavy)
-   3 Projectiles (Small / Heavy / Beam)
-   3 Impacts (Small / Heavy / Burst)
-   2 Particle-Sprite-Sheets

(~10 individuell benannte Assets pro Schule, ~60 insgesamt, z. B.
`psionic_impact_mind_ring_burst`.)

Dieser Ansatz war ein früher Entwurf im Rahmen der
Psionik-Referenzschule und wurde **nicht weiterverfolgt**. Die
zugehörigen Pilot-Assets (`mind_pressure_arc`, `mind_ring_burst`,
`psionic_cast_mind_focus_hex`) wurden aus dem Projekt entfernt.
Verbindlich ist ausschließlich das Zielmodell oben.

------------------------------------------------------------------------

# Produktionsablauf (bereits abgeschlossen)

Die initiale Erstellung aller 30 Sprite-Sheets erfolgte **nicht**
schulweise nacheinander, sondern in einem Bulk-Durchlauf:

1.  Rohe Film-Strip-PNGs pro Schule/Kategorie unter `assets/effects/`
    ablegen.
2.  `tools/generate_school_vfx_manifests.py` ausführen: schneidet per
    Alpha-Kanal-Analyse den Bildrand, teilt den Streifen in die pro
    Kategorie/Schule konfigurierte Frame-Anzahl (`FRAME_COUNTS`) und
    schreibt sowohl die Pixi-`.json`-Manifeste als auch
    `data/vfx/schoolVfxAssets.js` neu (Presets + Manifest-Liste +
    Legacy-Schul-ID-Mapping).
3.  `tools/sync_vfx_manifests_js.py` ausführen: bündelt alle
    Manifest/PNG-Paare für den `file://`-Testfall in
    `data/vfx/spritesheetManifests.js` (rohes JSON) und
    `data/vfx/spritesheetTextures.js` (PNG als WebP-Data-URI).

Beide Skripte sind **wiederholbar** -- bei neuem/geändertem
Quellmaterial für eine Schule/Kategorie erneut ausführen, statt manuell
einzugreifen.

Sonderfall Psionik: `Psionic_Beam.png`/`Psionic_Impact.png` sind die
**originalen** Sprite-Sheets (aus dem Internet bezogen); die übrigen
fünf Schulen sind farblich abgeleitete (ChatGPT-recolorte) Versionen
mit identischem Frame-Layout. Das ist beabsichtigt, keine fehlerhafte
Generierung -- die native Pixelauflösung der beiden Dateien weicht
dadurch von den anderen Schulen ab, die Frame-Anzahl pro Kategorie
stimmt aber überein. Kein Regenerierungsbedarf.

------------------------------------------------------------------------

# Zauberzuweisung

Cast und Impact ergeben sich automatisch aus `spell.school`. Der
Projektiltyp ist die einzige Per-Zauber-Angabe und steht in
`SPELL_PROJECTILE_TYPES` (`data/vfx/spellVfxDefinitions.js`).

Ein per-Zauber-Override ist über `VFX_SPELL_DEFINITIONS`
(`data/vfx/spellVfxDefinitions.js`) möglich, aber standardmäßig
**leer** -- alle 35 Zauber laufen aktuell rein datengetrieben über die
Schul-Sheets.

Neue Assets werden **nur** erstellt, wenn:

-   eine neue Schule hinzukommt, oder
-   ein Signature-Zauber einen der fünf bestehenden Bausteine (Cast,
    Impact, Beam, Explosion, Cut) glaubwürdig nicht abdecken kann.

------------------------------------------------------------------------

# Workflow für neue/geänderte Assets

Für Einzelfälle (neue Schule, Ausnahme-Asset) gilt weiterhin:

1.  Cursor liest:

    -   BattleMages_VFX_Style_Guide.md
    -   BattleMages_VFX_Library.md
    -   BattleMages_VFX_Production_Pipeline.md
    -   BattleMages_VFX_Production_Plan_v2.md (dieses Dokument)

2.  Cursor erstellt Produktionsauftrag + Bildprompt für ChatGPT
    (Dateiname, Zielordner, technische Parameter, QA-Checkliste).

3.  ChatGPT erzeugt das Sprite Sheet.

4.  Asset wird unter `assets/effects/<kategorie>/` gespeichert.

5.  `tools/generate_school_vfx_manifests.py` und
    `tools/sync_vfx_manifests_js.py` erneut ausführen.

6.  Cursor prüft, integriert, testet mit
    `BattleMagesDev.previewSpell(...)`, aktualisiert
    `BattleMages_VFX_Library.md`.

------------------------------------------------------------------------

# Regel für Cursor

Cursor soll **niemals** pauschal für jeden Zauber neue VFX erstellen.

Standardannahme:

> Vorhandene Schul-Sheets wiederverwenden.

Neue Assets dürfen nur vorgeschlagen werden, wenn sie einen klaren
spielerischen oder visuellen Mehrwert bieten.

------------------------------------------------------------------------

# Aktueller Stand

Alle 6 Schulen (Biomantie, Schatten, Psionik, Verbotene Runenkunst,
Chaosmagie, Seelenmagie) haben produktive Cast-, Impact-, Beam-,
Explosion- und Cut-Sheets (30 Sprite-Sheets, generiert 2026-07-15 bis
2026-07-17). Alle 35 Zauber sind über `SPELL_PROJECTILE_TYPES`
zugeordnet, keine offenen `VFX_SPELL_DEFINITIONS`-Overrides nötig.
Details je Schule/Kategorie: `BattleMages_VFX_Library.md`.

Offen:

-   Sound (`soundBridge.js` ist aktuell ein bewusster No-Op-Stub, kein
    Audiosystem vorhanden).

Erledigt (2026-07-21): Die verwaisten Pilot-Presets
(`psionic_cast_mind_focus_hex`, `mind_pressure_arc`, `mind_ring_burst`,
`mind_motes_placeholder`) wurden aus `data/vfx/effectPresets.js`
entfernt, ebenso die zugehörigen 11 Pilot-Skripte/Preview-Seiten unter
`tools/`. `VFX_PROJECTILE_MOTION_PRESETS.psionic_glide` bleibt als
generischer, wiederverwendbarer Mechanismus erhalten.

------------------------------------------------------------------------

# Regressionsschutz

`tools/validate_vfx_assets.py` prüft bei Bedarf:

-   dass jeder Sprite-Sheet-Eintrag in `data/vfx/schoolVfxAssets.js`
    (Presets + Manifest-Liste) auf eine tatsächlich existierende Datei
    zeigt,
-   dass jeder Preset-Eintrag in `data/vfx/effectPresets.js` mit
    `spritesheet`-Angabe auf eine existierende Datei zeigt,
-   dass jeder Zauber in `SPELL_PROJECTILE_TYPES`
    (`data/vfx/spellVfxDefinitions.js`) einer bekannten Zauber-ID und
    einem gültigen Projektiltyp (`beam`/`cut`/`explosion`/
    `projectile`/`shield`) zugeordnet ist und kein Zauber fehlt.

Damit fällt zukünftiger Drift wie bei den entfernten
`mind_pressure_arc`/`mind_ring_burst`/`psionic_cast_mind_focus_hex`-
Presets sofort auf.

------------------------------------------------------------------------

# Nächste Schritte

-   Sound-Integration ist zurückgestellt, kein aktueller Sprint-Fokus.
