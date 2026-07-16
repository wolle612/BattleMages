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
-   Standardgröße Impact: 96×96 px pro Frame
-   Standardgröße Projectile: 64×24 px pro Frame
-   Standard: 8 Frames (abweichende Effekte begründen)
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

Referenz-Impact: mind_ring_burst

Referenz-Projectile: mind_pressure_arc (horizontaler Druckbogen,
Spitze rechts, dezenter Trail links)

------------------------------------------------------------------------

# Vertical-Slice-Timing (Gedankenschlag, v1)

Erprobte Werte fuer den ersten spielbaren Psionik-Vertical-Slice.
Diese Werte sind Referenz fuer kuenftige Schulen, keine harte Pflicht.

## Ablauf

Cast (120 ms) → Verzoegerung (90 ms) → Projectile (~920 px/s) → Impact
(140 ms) → Schadenszahl → Crit-Styling (falls vorhanden)

## Cast

-   Preset: `psionic_cast_mind_focus_hex`
-   6-Frame-Fokusaufbau mit gerichteter Entladung
-   Dauer: 120 ms
-   `delayBeforeProjectile`: 108 ms

## Projectile

-   Preset: `mind_pressure_arc`
-   Geschwindigkeit: 920 px/s (Lesbarkeit vor Tempo)
-   Animations-Loop waehrend Flug

## Impact

-   Preset: `mind_ring_burst`
-   Display-Scale: 0.92 (Portrait bleibt sichtbar)
-   Dauer: 140 ms

## Particles (Platzhalter)

-   Preset: `mind_motes_placeholder`
-   4 Lichtpunkte, Spread 22 px, Dauer 260 ms

## Presentation-Sync

-   Schadenszahl und Portrait-Hit **am Impact-Moment**, nicht beim
    Cast-Start (`onImpact`-Callback via EffectManager)
-   Crit: Klasse `floating-number--crit` bei `effectText ===
    "Kritischer Treffer"`

## Verbotene Vertical-Slice-Abweichungen

-   Keine Kamera-Shakes fuer Referenz-Angriffe
-   Keine Sonderpfade ausserhalb EffectManager / Timeline / Registry

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
