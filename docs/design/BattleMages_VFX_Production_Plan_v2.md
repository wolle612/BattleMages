# BattleMages -- VFX Production Plan v2.0

> Dieses Dokument ersetzt den alten assetbasierten Produktionsplan.

**Wichtige Regel**

Die VFX-Bibliothek wird **NICHT pro Zauber**, sondern **pro
Magieschule** aufgebaut.

Das Ziel ist maximale Wiederverwendung bei gleichzeitig hoher Qualität.

Das aktuelle Spellbook mit den **36 finalen Zaubern** ist die einzige
gültige Referenz. Es werden **keine veralteten Zauber oder Zaubernamen**
verwendet.

------------------------------------------------------------------------

# Produktionsprinzip

Nicht:

36 Zauber × Cast + Projectile + Impact + Particles

Sondern:

Eine gemeinsame VFX-Sprache pro Schule.

Jeder Zauber kombiniert vorhandene Bibliotheksassets.

------------------------------------------------------------------------

# Zielgröße der Bibliothek

Pro Schule:

-   2 Casts
-   3 Projectiles
-   3 Impacts
-   2 Particle-Effekte

≈ 10 wiederverwendbare Assets pro Schule.

Bei 6 Schulen entstehen ungefähr **60 hochwertige Assets** statt über
140 Einzelassets.

------------------------------------------------------------------------

# Produktionsreihenfolge

## Phase 1

Referenzzauber erstellen.

Der erste Referenzzauber (Gedankenschlag) definiert Qualität, Timing und
Stil.

Nach erfolgreicher Abnahme wird er eingefroren.

## Phase 2

Für jede Schule wird eine vollständige VFX-Bibliothek aufgebaut.

Empfohlene Reihenfolge:

1.  Psionik
2.  Biomantie
3.  Schatten
4.  Verbotene Runenkunst
5.  Chaosmagie
6.  Seelenmagie

------------------------------------------------------------------------

# Bibliothek pro Schule

## Casts

-   Small Cast (schneller Fokus)
-   Heavy Cast (starker Aufbau)

## Projectiles

-   Small Projectile
-   Heavy Projectile / Orb
-   Beam oder Signature-Projektil

## Impacts

-   Small Hit
-   Heavy Hit
-   Burst

## Particles

-   Small Residue
-   Heavy Residue

Diese Assets werden anschließend beliebig zwischen den Zaubern derselben
Schule kombiniert.

------------------------------------------------------------------------

# Zauberzuweisung

Nach Fertigstellung einer Schulbibliothek wird **jeder Zauber** des
Spellbooks einem bestehenden Satz von Assets zugeordnet.

Neue Assets werden **nur** erstellt wenn:

-   ein Signature-Zauber sie wirklich benötigt
-   die Bibliothek einen Effekt nicht glaubwürdig darstellen kann

------------------------------------------------------------------------

# Workflow

1.  Cursor liest:

    -   BattleMages_VFX_Style_Guide.md
    -   BattleMages_VFX_Library.md
    -   BattleMages_VFX_Production_Pipeline.md
    -   BattleMages_VFX_Production_Plan_v2.md

2.  Cursor bestimmt automatisch den **nächsten fehlenden
    Bibliothekseintrag**.

3.  Cursor erstellt:

    -   Produktionsauftrag
    -   Bildprompt für ChatGPT
    -   technische Parameter
    -   Dateiname
    -   Zielordner
    -   QA-Checkliste

4.  ChatGPT erzeugt das Sprite Sheet.

5.  Asset wird gespeichert.

6.  Cursor:

    -   prüft
    -   integriert
    -   testet mit BattleMagesDev.previewSpell(...)
    -   aktualisiert Library
    -   markiert den Bibliothekseintrag als erledigt
    -   schlägt automatisch den nächsten Asset-Typ vor

------------------------------------------------------------------------

# Regel für Cursor

Cursor soll **niemals** pauschal für jeden Zauber neue VFX erstellen.

Standardannahme:

> Vorhandene Bibliotheksassets wiederverwenden.

Neue Assets dürfen nur vorgeschlagen werden, wenn sie einen klaren
spielerischen oder visuellen Mehrwert bieten.

------------------------------------------------------------------------

# Aktueller Stand

## Referenzzauber

Gedankenschlag

-   Cast ✅
-   Projectile ✅
-   Impact ✅
-   Particles ✅

Status:

Reference Spell abgeschlossen.

------------------------------------------------------------------------

# Nächster Sprint

Start der Psionik-Bibliothek.

Cursor soll den nächsten fehlenden Bibliothekseintrag auswählen und
dafür automatisch den vollständigen Produktionsauftrag inklusive
ChatGPT-Bildprompt erzeugen.
