# BattleMages UI Asset List

Version: 1.0

Dieses Dokument definiert sämtliche UI-Assets für BattleMages.

Zusammen mit dem `BattleMages_Assets_Master_Style_Prompt.md` bildet dieses Dokument die einzige Quelle für alle zukünftigen UI-Assets.

---

# Produktionsregeln

Für jedes Asset gilt:

- Transparenter Hintergrund (PNG)
- Orthografische Frontansicht
- Symmetrischer Aufbau (wenn sinnvoll)
- Produktionstauglich
- Pixel-Art gemäß Master Style
- Hohe Lesbarkeit in der tatsächlichen Spielgröße
- Keine unnötigen Verzierungen
- Materialien müssen konsistent bleiben
- Bronze, Basalt und Runen müssen auf allen Assets identisch wirken

---

# Produktionsreihenfolge

1. panel_frame.png
2. portrait_frame.png
3. spell_slot.png
4. spell_slot_active.png
5. spell_slot_cooldown.png
6. button_normal.png
7. button_hover.png
8. button_pressed.png
9. healthbar_frame.png
10. shieldbar_frame.png
11. tooltip_frame.png
12. reward_card.png
13. reward_card_hover.png
14. reward_card_selected.png
15. starter_card.png
16. combat_log_frame.png
17. combat_feedback_frame.png
18. status_slot.png
19. rarity_frames
20. header_panel.png
21. divider.png
22. corner_ornaments

---

# 01 — panel_frame.png

**Pfad**

assets/ui/panels/panel_frame.png

**Größe**

256×256

**Typ**

9-Slice Panel

**Verwendung**

- Spielerpanel
- Gegnerpanel
- Tooltip
- Kampflog
- Rewards
- Menüs
- Starterauswahl

**Design**

Massive Basaltplatte mit bronzener Einfassung.

Feine Risse.

Leicht verwittert.

Runengravuren ausschließlich in den vier Ecken.

Eingelassene Innenfläche.

Keine Verzierungen im skalierbaren Bereich.

---

# 02 — portrait_frame.png

**Pfad**

assets/ui/frames/portrait_frame.png

**Größe**

256×256

**Typ**

Portrait Frame

**Verwendung**

- Spieler
- Gegner
- Boss
- NPC

**Design**

Quadratischer bronzener Portraitrahmen.

Massiv.

Vier Runenplatten.

Kleines Kristallornament oben mittig.

Innen leicht eingelassen.

Alte Magierakademie.

Nicht glänzend.

---

# 03 — spell_slot.png

**Pfad**

assets/ui/actionbar/spell_slot.png

**Größe**

128×128

**Typ**

Actionbar Slot

**Verwendung**

Zauberleiste

**Design**

Massiver ausgefräster Steinblock.

Bronzerahmen.

Runengravuren.

Dunkle eingelassene Innenfläche.

Klare Lesbarkeit.

---

# 04 — spell_slot_active.png

**Pfad**

assets/ui/actionbar/spell_slot_active.png

**Größe**

128×128

**Typ**

Aktiver Slot

**Verwendung**

Aktueller Zauber

**Design**

Identisch zu spell_slot.

Warme, dezent leuchtende Runen.

Kein Neon.

Rahmen wirkt aktiviert.

---

# 05 — spell_slot_cooldown.png

**Pfad**

assets/ui/actionbar/spell_slot_cooldown.png

**Größe**

128×128

**Typ**

Cooldown Slot

**Verwendung**

Nicht verfügbarer Zauber

**Design**

Identisch zu spell_slot.

Runen erloschen.

Leicht graublau.

Dunklere Bronze.

---

# 06 — button_normal.png

**Pfad**

assets/ui/buttons/button_normal.png

**Größe**

512×128

**Typ**

Button

**Verwendung**

Alle Buttons

**Design**

Massive Steinplatte.

Bronzerahmen.

Metallbeschläge links und rechts.

Leichte Vertiefung.

Schwer.

Rechteckig.

---

# 07 — button_hover.png

**Design**

Identisch.

Runengravuren beginnen leicht zu glimmen.

Magie fließt subtil durch den Stein.

---

# 08 — button_pressed.png

**Design**

Identisch.

Optisch eingedrückt.

Schatten angepasst.

---

# 09 — healthbar_frame.png

**Pfad**

assets/ui/bars/healthbar_frame.png

**Größe**

512×64

**Typ**

Bar Frame

**Verwendung**

Lebensanzeige

**Design**

Steinerner Kanal.

Bronzerahmen.

Leichte Gravuren.

Keine großen Ornamente.

---

# 10 — shieldbar_frame.png

**Pfad**

assets/ui/bars/shieldbar_frame.png

**Größe**

512×64

**Typ**

Bar Frame

**Verwendung**

Schild

**Design**

Identisch.

Silber statt Bronze.

Runen.

Kristallgravuren.

---

# 11 — tooltip_frame.png

**Pfad**

assets/ui/tooltips/tooltip_frame.png

**Größe**

384×256

**Typ**

Tooltip

**Verwendung**

Alle Tooltips

**Design**

Steinerne Zaubertafel.

Dunkles Pergament.

Bronzerahmen.

Runenecken.

Innen ruhig.

Gut lesbar.

---

# 12 — reward_card.png

**Pfad**

assets/ui/cards/reward_card.png

**Größe**

512×768

**Typ**

Reward Card

**Verwendung**

Belohnungen

**Design**

Steinerne Zaubertafel.

Oben große Icon-Aussparung.

Darunter Name.

Beschreibung.

Upgradebereich.

Massive Steinoptik.

---

# 13 — reward_card_hover.png

**Design**

Identisch.

Runen beginnen leicht zu leuchten.

---

# 14 — reward_card_selected.png

**Design**

Identisch.

Goldene Magie fließt durch Gravuren.

Rahmen leicht heller.

---

# 15 — starter_card.png

**Pfad**

assets/ui/cards/starter_card.png

**Größe**

512×768

**Typ**

Starter Card

**Verwendung**

Zauberauswahl

**Design**

Schlichtere Version der Reward Card.

Kein Upgradebereich.

Soll sofort als Starterkarte erkennbar sein.

---

# 16 — combat_log_frame.png

**Pfad**

assets/ui/log/combat_log_frame.png

**Größe**

1024×512

**Typ**

Panel

**Verwendung**

Kampflog

**Design**

Steinerne Chronik.

Runensäulen links und rechts.

Innenfläche ruhig.

Optimiert für Text.

**Integrationsstatus**

Geparkt — Korrektur am Asset nötig, bevor die Integration abgeschlossen werden kann.

**Bekanntes Problem**

- Generiertes Asset ist **1536×1024** (Seitenverhältnis 3:2), Spezifikation verlangt **1024×512** (2:1, breit-flach).
- Im Spiel bleiben an allen Seiten **transparente Ränder** (Checkerboard) sichtbar: Der Rahmen füllt den Container nicht vollständig aus.
- Das Asset selbst wirkt bei korrektem Seitenverhältnis nicht verzerrt; das Problem ist die **Größen-/Proportions-Diskrepanz** zwischen UI-Container und Frame-Grafik.

**Bereits versuchte Integrationen (ohne Erfolg)**

1. `border-image` 9-Slice mit `fill`
2. Gestrecktes `::after`-Overlay (`background-size: 100% 100%`)
3. Aufgeteilte PNG-Teile (Säulen, Rails, Center) mit Grid/Absolute-Positioning
4. Container auf natives Seitenverhältnis verkleinert (360×240 px)
5. `align-self: center`, `flex-shrink: 0`, festes Aspect-Ratio

**Aktueller Workaround im Code**

- Panel: 360×240 px (`--combat-log-panel-height`, berechnete Breite aus 1536/1024)
- Frame per `::after`-Overlay; Innenfläche `#13161c`
- Slice-Dateien vorhanden, aber ungenutzt: `combat_log_pillar_left.png`, `_pillar_right.png`, `_rail_top.png`, `_rail_bottom.png`, `_center.png`

**Geplante Korrektur (Option C)**

Asset neu generieren in echten **breit-flachen** Maßen (z. B. 1024×512 oder 480×200), wenn die übrigen Kern-Assets fertig sind.

---

# 17 — combat_feedback_frame.png

**Pfad**

assets/ui/combat/combat_feedback_frame.png

**Größe**

1024×512

**Typ**

Combat Feedback

**Verwendung**

Zaubername

Schaden

Krit

**Design**

Uralter steinerner Altar.

Etwas imposanter.

Mehr Tiefe.

**Integrationsstatus**

Geparkt — Integration rückgängig gemacht (2026-07-08).

**Bekanntes Problem / Design-Entscheidung**

- Der generierte Altar-Rahmen passt visuell nicht zum Kampfzentrum.
- Ein separater Frame **innerhalb** des großen mittleren Feldes (`.effect-stage`) wirkt wie „Frame in Frame“ und ist konzeptionell nicht sinnvoll.
- Das Combat-Feedback-UI wird möglicherweise später komplett ersetzt; Frame-Integration daher zurückgestellt.

**Asset-Stand**

- Datei vorhanden: `assets/ui/combat/combat_feedback_frame.png`
- Tatsächliche Größe: **1536×1024** (Spezifikation: 1024×512)
- Generiert per Image-Tool (PixelLab-Limit erreicht)

**Nächster Schritt (offen)**

- Entscheiden, ob Combat Feedback ein eigenes UI-Konzept ohne Rahmen bekommt oder ob der mittlere Bereich selbst zum Feedback-Container wird.

---

# 18 — status_slot.png

**Pfad**

assets/ui/status/status_slot.png

**Größe**

96×96

**Typ**

Status Icon Frame

**Verwendung**

Statuseffekte

**Design**

Bronzene Runenplakette.

Leichte Einkerbung.

Keine einfache quadratische Form.

**Integrationsstatus**

Generiert und integriert (2026-07-08).

**Hinweis**

Tatsächliche Dateigröße: **1024×1024** (Spezifikation: 96×96). Anzeige über `--status-slot-size: 34px` mit `::before`-Overlay auf `.status-chip-icon`.

---

# 19 — rarity_frames

**Pfad**

assets/ui/rarity/

**Größe**

128×128

**Typ**

Rahmen

**Varianten**

Common

Rare

Epic

Legendary

**Design**

Immer dieselbe Grundform.

Nur Material unterscheidet sich.

Common

Dunkles Eisen.

Rare

Silber mit blauen Runen.

Epic

Dunkles Violett und Gold.

Legendary

Alte Bronze mit goldenen Gravuren.

**Integrationsstatus**

Geparkt — Integration rückgängig gemacht (2026-07-08).

**Bekanntes Problem**

- Rarity-Rahmen haben die Zauber-Icons **ersetzt** statt sie zu umrahmen.
- Rahmen erschien **innerhalb** des bestehenden Kartenframes (Reward/Starter) — „Frame in Frame“ / falsche Ebene.
- Konzeptionell unklar, ob Rarity den Icon-Slot, die ganze Karte oder einen separaten Indikator betreffen soll.

**Asset-Stand**

- Alle vier Varianten generiert unter `assets/ui/rarity/`
- Tatsächliche Größe je **1024×1024** (Spezifikation: 128×128)

**Nächster Schritt (offen)**

- Rarity-Frames ans Ende der Produktionsliste verschieben
- Vor erneuter Integration klären: Icon-Border vs. Karten-Akzent vs. separater Badge

---

# 20 — header_panel.png

**Pfad**

assets/ui/headers/header_panel.png

**Größe**

1024×128

**Typ**

Header

**Verwendung**

Menüüberschriften

**Design**

Steinernes Banner.

Mittig Platz für Titel.

Ornamentale Endstücke.

**Zweck (konzeptionell)**

Horizontales **Titel-Banner** für Menü-Überschriften. Der Rahmen ist nur Dekoration — **der Screen-Titel-Text** wird zentriert im Banner angezeigt:

| Screen | Element | Aktueller Titel |
|---|---|---|
| Belohnung | `.screen-title` | „Wähle eine Belohnung“ |
| Zauberauswahl | `.screen-title` | „Zauberauswahl“ |
| How to Play | `.screen-title` | „How to Play“ |

Nicht für `.battle-header` (Kampf-Fortschritt).

**Integrationsstatus**

Korrigiert und integriert (2026-07-08, v2).

**Korrektur**

- Neu generiert, horizontale Banner-Streifen extrahiert und auf **1024×128** (8:1) skaliert
- Integration auf `.screen-title` mit **nativem Seitenverhältnis** (48px Höhe → 384px Breite), kein Stretching

---

# 21 — divider.png

**Pfad**

assets/ui/dividers/divider.png

**Größe**

512×32

**Typ**

Divider

**Verwendung**

Bereichstrenner

**Design**

Horizontale bronzene Rune.

Keine einfache Linie.

**Integrationsstatus**

Generiert und integriert (2026-07-08).

**Hinweis**

Final **512×32** (16:1). Zauberleiste: `.spellbar-header::after` (11px). How-to-Play: `.ui-divider--section` + `.howto-subtitle::after`.

---

# 22 — corner_ornaments

**Pfad**

assets/ui/ornaments/

**Größe**

128×128

**Typ**

Ornaments

**Varianten**

Top Left

Top Right

Bottom Left

Bottom Right

**Verwendung**

Dekoration

**Design**

Kleine steinerne Eckornamente.

Bronze.

Runengravuren.

Sehr subtil.

Keine dominante Verzierung.

**Integrationsstatus**

Geparkt — Integration rückgängig gemacht (2026-07-08).

**Asset-Stand**

- Alle vier Varianten generiert unter `assets/ui/ornaments/`
- TR/BL/BR aus TL abgeleitet (spiegeln)

**Nächster Schritt (offen)**

- Nach Playtests entscheiden, auf welchen Screens Eckornamente sinnvoll sind (Home, Kampf, Menüs) und ob Größe/Intensität angepasst werden muss

---

# Abschlussregel

Alle Assets müssen sich wie Bestandteile desselben uralten Artefakts anfühlen.

Die Benutzeroberfläche von BattleMages soll wirken, als wäre sie direkt aus den Hallen einer verbotenen Magierakademie herausgebrochen worden.

Gameplay und Lesbarkeit stehen immer über Detailgrad und Ornamentik.