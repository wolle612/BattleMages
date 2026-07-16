# BattleMages -- VFX Production Pipeline

> Standardisierter Produktionsprozess für alle Zauberanimationen in
> BattleMages.
>
> Dieses Dokument beschreibt **den Workflow**, nicht die Designregeln
> (`BattleMages_VFX_Style_Guide.md`) und nicht die Asset-Datenbank
> (`BattleMages_VFX_Library.md`).

------------------------------------------------------------------------

# Ziel

Jeder neue VFX wird nach demselben Ablauf entwickelt.

Dadurch bleiben:

-   Qualität
-   Lesbarkeit
-   Performance
-   Wiederverwendbarkeit
-   Dokumentation

über das gesamte Projekt konsistent.

------------------------------------------------------------------------

# Produktionsablauf

## Phase 1 -- Analyse

Vor jeder Produktion:

-   Relevante Projektdokumente lesen
-   Betroffene Zauber analysieren
-   Bestehende VFX Library prüfen
-   Vorhandene Assets bevorzugt wiederverwenden

**Keine neuen Assets erstellen, solange geeignete Assets existieren.**

------------------------------------------------------------------------

## Phase 2 -- Konzept

Für jeden Zauber definieren:

-   Cast
-   Projectile
-   Impact
-   Particles
-   Camera
-   Sound

Zusätzlich:

-   Reihenfolge
-   Timing
-   Dauer
-   Wiederverwendbarkeit

Ergebnis:

**Produktionsplan**

------------------------------------------------------------------------

## Phase 3 -- Assetplanung

Für jedes benötigte Asset festlegen:

-   Dateiname
-   Kategorie
-   Schule
-   Spritegröße
-   Frameanzahl
-   Transparenz
-   Wiederverwendbarkeit
-   Zielordner

Erst danach beginnt die Generierung.

------------------------------------------------------------------------

## Phase 4 -- Assetproduktion

Reihenfolge:

1.  Impact
2.  Projectile
3.  Cast
4.  Particles
5.  Sound

Jedes Asset wird einzeln produziert.

Keine Massenproduktion.

------------------------------------------------------------------------

## Phase 5 -- QA

### Technische QA

-   PNG mit Alphakanal
-   Transparenter Hintergrund
-   Keine Farbsäume
-   Korrekte Frameanzahl
-   Korrekte Größe
-   Keine abgeschnittenen Pixel

### PixiJS QA

-   Lädt korrekt
-   Keine Framefehler
-   Richtiger Pivot
-   NEAREST Scaling
-   Keine verschwommenen Pixel

### Gameplay QA

-   Sofort lesbar
-   Passendes Timing
-   Keine Überlagerung wichtiger UI
-   Wirkt auch nach vielen Wiederholungen angenehm

### Performance QA

-   Asset Caching
-   Object Pooling
-   Keine unnötigen Allokationen

------------------------------------------------------------------------

## Phase 6 -- Integration

Integration ausschließlich über die VFX Engine.

Combat-System enthält keine VFX-Logik.

Nach Integration:

-   Spieltest
-   Mehrfache Wiederholung
-   Feintuning

------------------------------------------------------------------------

## Phase 7 -- Dokumentation

Nach erfolgreicher QA:

### BattleMages_VFX_Library.md

Aktualisieren:

-   Neues Asset
-   Status
-   Verwendet von
-   Größe
-   Frames

### BattleMages_VFX_Style_Guide.md

Nur aktualisieren, wenn neue allgemeine Designregeln entstanden sind.

### BattleMages_VFX_Production_Pipeline.md

Nur aktualisieren, wenn sich der Workflow geändert hat.

------------------------------------------------------------------------

# Asset-Status

🧪 Experimental

Erster Test.

------------------------------------------------------------------------

🟡 Pilot

Erstmals im Spiel integriert.

------------------------------------------------------------------------

🟢 Approved

QA bestanden.

Für Wiederverwendung freigegeben.

------------------------------------------------------------------------

⭐ Reference

Referenzasset seiner Kategorie.

Qualitätsmaßstab.

------------------------------------------------------------------------

🔒 Locked

Darf nur mit triftigem Grund geändert werden.

------------------------------------------------------------------------

# Standard-Promptabschluss

Jeder zukünftige VFX-Prompt endet mit:

1.  QA durchführen.
2.  Gameplay bewerten.
3.  BattleMages_VFX_Library.md aktualisieren.
4.  Prüfen, ob Änderungen am Style Guide notwendig sind.
5.  Prüfen, ob Änderungen an der Production Pipeline notwendig sind.
6.  Abschlussbericht mit Produktionsfreigabe erstellen.

------------------------------------------------------------------------

# Definition of Done

Ein Asset gilt erst als abgeschlossen, wenn:

-   QA bestanden
-   Integration erfolgreich
-   Gameplay-Test bestanden
-   Dokumentation aktualisiert
-   Status mindestens **Approved**
-   Für Wiederverwendung geeignet

Erst danach darf das nächste Asset produziert werden.

------------------------------------------------------------------------

## Version

**v1.0**

Erstellt nach Abschluss der VFX-Architektur und Beginn der
Referenzproduktion von Gedankenschlag.
