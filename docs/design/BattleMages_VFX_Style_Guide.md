# BattleMages -- VFX Style Guide

## Ziel

Dieses Dokument definiert die verbindliche visuelle Sprache aller
Zauberanimationen in BattleMages. Es dient als Referenz für KI-Modelle
(Cursor, Claude, ChatGPT), Künstler und zukünftige Erweiterungen. Neue
VFX werden grundsätzlich aus wiederverwendbaren Bausteinen entwickelt
und müssen den hier definierten Regeln entsprechen.

------------------------------------------------------------------------

# Allgemeine Designregeln

## Stil

-   Dark-Fantasy Pixel Art
-   Transparenter Hintergrund
-   Keine Bloom- oder Motion-Blur-Effekte
-   Klare Lesbarkeit wichtiger als Spektakel
-   Ruhige, kontrollierte Animationen
-   Effekte dürfen den Spielfluss nicht unterbrechen

## Technische Standards

-   PNG mit Alphakanal
-   Sprite Sheets bevorzugt
-   Anzeigegröße je Kategorie einheitlich (Details/Tabelle je Schule:
    `BattleMages_VFX_Library.md`): Cast 230 px, Beam 96 px, Explosion
    270 px, Schnitt/Cut 250 px, Impact 210 px.
-   Frameanzahl je Kategorie schulweise leicht unterschiedlich (5--9
    Frames, siehe `FRAME_COUNTS` in
    `tools/generate_school_vfx_manifests.py` bzw. die Tabelle in
    `BattleMages_VFX_Library.md`) -- keine feste Standardzahl.
-   NEAREST-Scaling
-   Keine Farbsaum-Artefakte

## Animationsphilosophie

Jede Animation besteht möglichst aus wiederverwendbaren Modulen:

-   Cast
-   Projectile
-   Impact
-   Particles
-   Camera
-   Sound

Neue Zauber kombinieren vorhandene Module statt neue Spezialeffekte zu
benötigen.

------------------------------------------------------------------------

# VFX-Kategorien

## Cast

Zweck: Visualisiert das Wirken eines Zaubers.

Regeln: - 80--120 ms - nahe der Zauberquelle - klar erkennbar - keine
Dominanz gegenüber Projektil oder Impact

## Projectile

Zweck: Transportiert den Zauber zwischen Quelle und Ziel.

Regeln: - gut lesbar - konstante Flugrichtung - möglichst
wiederverwendbar - nur dezente Trails - Trail niemals heller als
Projektilkern - Standard 64×24 px, 8 Frames, ~200 ms Pulscyklus

## Impact

Zweck: Der wichtigste visuelle Moment eines Zaubers.

Regeln: - maximal 96×96 px - 8 Frames - klarer Energiehöhepunkt - kein
übermäßiger Glow - darf leicht in Portraitrahmen hineinragen

## Particles

Regeln: - sparsam einsetzen - ergänzen den Impact - niemals Hauptmotiv

## Camera

Nur für besondere Ereignisse:

-   Rare
-   Epic
-   Boss
-   Signature-Spells

Normale Angriffe verwenden standardmäßig keine Kameraeffekte.

------------------------------------------------------------------------

# Schulensprache

## Biomantie

Farben: Dunkelrot • Purpur • Knochenweiß

Sprache: Organisch, Knochen, Blut, Muskeln, lebendige Materie.

## Schatten

Farben: Schwarz • Dunkelgrau • kaltes Blau

Sprache: Schattenformen, Klingen, Silhouetten.

## Psionik

Farben: Cyan • Türkis • Eisblau • Weiß

Sprache: Mentale Energie, Hexagonmuster, Druckwellen, geometrische
Präzision, kontrollierte Instabilität, kristallartige Strukturen.

Referenz-Impact: `school_impact_psionic` (`Psionic_Impact.png`)

Referenz-Projectile (Beam): `school_beam_psionic` (`Psionic_Beam.png`)

------------------------------------------------------------------------

# Historische Notiz: Vertical-Slice-Timing (Gedankenschlag, Pilot)

Der erste spielbare Vertical-Slice (Gedankenschlag/Psionik) diente zur
Erprobung des Cast→Projectile→Impact-Ablaufs und ist inzwischen durch
das aktuelle Schul-Sheet-Modell ersetzt (siehe
`BattleMages_VFX_Production_Plan_v2.md`). Die damals verwendeten
Presets existieren nicht mehr, die konkreten Zeitwerte sind keine
gültige Referenz mehr. Erhalten gebliebene Prinzipien:

-   Schadenszahl und Portrait-Hit synchronisieren **am
    Impact-Moment**, nicht beim Cast-Start (`onImpact`-Callback via
    EffectManager) -- weiterhin gültig.
-   Keine Kamera-Shakes und keine Sonderpfade außerhalb
    EffectManager/Timeline/Registry für Standardangriffe -- weiterhin
    gültig.

------------------------------------------------------------------------

## Verbotene Runenkunst

Farben: Obsidian • Kupfer • Blutrot

Sprache: Glyphen, Monolithen, uralte Siegel.

## Chaosmagie

Farben: Giftgrün • Smaragd • Gelbgrün

Sprache: Instabile Energie, Explosionen, Fel-artige Flammen.

## Seelenmagie

Farben: Geisterweiß • Lavendel • Silber

Sprache: Ätherisch, schwebend, fließend.

------------------------------------------------------------------------

# Produktionspipeline

1.  Produktionsplanung
2.  Asset-Konzept
3.  Prompt-Erstellung
4.  Sprite-Sheet-Generierung
5.  QA-Prüfung
6.  PixiJS-Integration
7.  Gameplay-Test
8.  Freigabe
9.  Aufnahme in die VFX-Bibliothek

------------------------------------------------------------------------

# QA-Checkliste

## Technisch

-   PNG besitzt Alphakanal
-   Keine weißen Hintergründe
-   Keine Farbsäume
-   Richtige Framegröße
-   Richtige Frameanzahl
-   Gleichmäßige Frameabstände

## Integration

-   Lädt korrekt in PixiJS
-   Keine Frame-Sprünge
-   NEAREST-Scaling
-   Richtiger Pivot
-   Richtige Positionierung

## Gameplay

-   Sofort lesbar
-   Trefferpunkt eindeutig
-   Keine Überdeckung wichtiger UI
-   Animation endet sauber
-   Nach vielen Wiederholungen nicht störend

------------------------------------------------------------------------

# Designprinzip

BattleMages soll seine Wirkung nicht durch möglichst große oder laute
Effekte erzielen.

Die Qualität entsteht durch:

-   klare Silhouetten
-   konsistente Farbwelten
-   wiedererkennbare Schulensprachen
-   kontrolliertes Timing
-   hochwertige Wiederverwendbarkeit

Jeder neue Effekt muss sich in diese visuelle Sprache einfügen.
