# BattleMages — Tiefgehende UI-Analyse & Änderungsvorschläge

> Ergebnis der UI-Deep-Dive-Analyse vom 2026-07-30, angefordert um die Game-UI
> "auf ein neues Level" zu heben. Basis: vollständiger Code-Audit
> (`style.css`, `renderer.js`, `index.html`, Assets, alle bestehenden
> UI-Docs) + externe Recherche zu 10 vergleichbaren Spielen, bewusst über
> die bisher nur für Meta-Progression herangezogenen Slay the Spire/Hades/
> Balatro hinaus. Nutzt den `game-ui-design`-Skill als fachliche Grundlage.
>
> **Status (Stand 2026-07-31): Tier 0 + Tier 1 vollständig umgesetzt,
> plus zwei der vier freigegebenen Tier-2/3-Asset-Vorschläge.** Diese
> Datei begann als reine Analyse/Empfehlung, wurde aber im selben
> Gespräch schrittweise mit Freigabe umgesetzt — siehe "Umsetzungsstand"
> unten für den aktuellen Stand und alle Korrekturen, die währenddessen
> nötig wurden. Tier 2/3 (übrige Asset-Vorschläge, echte Texturen,
> Icon-v2-Rollout) bleiben offen für eine spätere Session.

## Umsetzungsstand (2026-07-31)

**Wichtiger Hinweis zur Verlässlichkeit dieser Analyse**: bei der
Umsetzung stellten sich **drei** der ursprünglichen Befunde als veraltet
heraus, weil sie ungeprüft aus Dokumentation statt aus dem tatsächlichen
Code-/Dateizustand übernommen wurden:

1. **A.5 (Status-Views)**: `getPlayerStatusViews()` war entgegen
   `CLAUDE.md`s Angabe längst implementiert (2026-07-24) — korrigiert,
   Details siehe A.5 unten.
2. **Asset-Vorschlag "3 fehlende Zauber-Icons"**: `tools/validate_icons.py`
   zeigt `icons_missing: 0` — alle 56 Zauber haben bereits ein Icon,
   das war schon am 2026-07-29 (vor dieser Analyse) nachgezogen worden,
   ohne dass die Roadmap-Notiz aktualisiert wurde. Kein Handlungsbedarf,
   nichts generiert.
3. **Asset-Vorschlag "Widerstand-VFX per PixelLab"**: das Schild-Vorbild
   ist kein KI-generiertes Asset, sondern ein handgebautes prozedurales
   Python-Skript. Der tatsächliche Weg war ein neues Skript
   (`tools/generate_portrait_resistance_rise.py`), nicht PixelLab —
   siehe Tier-3-Abschnitt unten.

**Lehre für künftige Analysen dieser Art**: Docs/Roadmap-Einträge sind
eine Momentaufnahme, kein verlässlicher aktueller Zustand — vor jeder
Umsetzung den tatsächlichen Datei-/Validator-Zustand prüfen, nicht nur
zitieren.

**Tier 0 — abgeschlossen** (Rarity-Farb-Dopplung bereinigt, kaputte
Widerstand-VFX-Referenz zunächst deaktiviert).

**Tier 1 — abgeschlossen**, siehe Statusvermerke direkt in der
Tier-1-Liste unten (Design-Tokens, Tastatur-Reorder, Schulfarben,
Settings-Screen-Grundgerüst).

**Tier 3 (Asset-Produktion) — 1 von 2 freigegebenen Punkten
umgesetzt**: Widerstand-Portrait-VFX-Sprite fertig (3 Iterationen bis
zur Freigabe, siehe `tools/generate_portrait_resistance_rise.py`),
CSS-Referenz reaktiviert. Der zweite freigegebene Punkt (fehlende
Zauber-Icons) entfiel wie oben beschrieben.

**Vierte Korrektur, gravierendster Fund (2026-07-31)**: A.4 ("größter
struktureller Fund" — alle 12 Gegner + Spieler teilen sich je ein
generisches Platzhalter-Portrait, keine Pro-Kampf-Hintergründe) war
**keine fehlende Asset-Produktion**, sondern ein nicht gemergter
Branch-Stand. `worktree-vfx-rework` (dieser Branch) und `main` forkten
beide von `eb9c072` und liefen seither unabhängig auseinander — main
bekam u. a. individuelle Portraits für Spieler + alle 12 Gegner sowie
12 Pro-Kampf-Hintergründe (`416e060`/`6b121bd`/`cfa5c60`/`4327aac`),
dieser Branch nicht. Der zugehörige Code
(`portraitRegistry.js`/`setFightBackground()`/`data/enemies.js`) war
bereits vor dieser Session manuell unkommittiert in den Worktree
kopiert worden und erwies sich als byte-identisch mit main — nur die
Bilddateien fehlten. Per `git checkout main -- <pfade>` übernommen
(reine Binärdatei-Kopie, kein Code-Merge, kein Konfliktrisiko), siehe
Commit `366a5ee`. Damit ist A.4 vollständig gelöst, ohne dass neue
Asset-Produktion nötig war.

**Fünfte Korrektur, Auflösung der Branch-Frage (2026-07-31)**: die
oben offengelassene Frage wurde im selben Gespräch geklärt. Vergleich
von `238e538` gegen main's Teil-1-5-Serie zeigte: inhaltlich fast
identische Arbeit (gleiche Root-Causes, gleiche Fixes, teils
wortgleiche Messwerte), aber main's Version wurde bei jedem Schritt
live per Playwright/Browser verifiziert, `238e538` nicht. Zusatzfund:
`renderer.js`/`game.js` sind zwischen `238e538` und main's aktuellem
Stand **byte-identisch** — nur `style.css` unterscheidet sich
geringfügig. Entscheidung: main als Basis behalten, `238e538` als
redundant verworfen. **Diese gesamte Analyse-Session wurde daraufhin
auf einen neuen Branch `worktree-ui-tier1` (von main) portiert** — nur
die tatsächlich neuen Beiträge (Design-Tokens, Tastatur-Reorder,
Schulfarben, Settings-Screen) wurden dort neu aufgesetzt, siehe Commit
`0e84779` auf diesem Branch. Der Widerstand-VFX-Sprite (siehe oben)
wurde dabei verworfen, da main bereits eine eigene, funktionierende
Version hatte (einfacher schrumpfender Pfeil statt Steinplatten-Kragen)
— auf Nutzerwunsch beibehalten. Portrait-/Hintergrund-Assets waren auf
main ohnehin bereits vorhanden.

**Diese Datei selbst lag ursprünglich nur auf `worktree-vfx-rework`**
(jetzt vermutlich zu verwerfen, siehe unten) und wurde händisch auf
diesen Branch mitkopiert, damit die Dokumentation dort liegt, wo der
tatsächlich weiterverwendete Code lebt.

**Offen, nicht Teil dieser Analyse**: was mit `worktree-vfx-rework`
selbst geschehen soll (verwerfen, da vollständig redundant, oder als
Referenz behalten) — eine Aufräum-Entscheidung, keine UI-Design-Frage.

## Wie diese Analyse zu lesen ist

Teil A ist eine **harte, kritische Bestandsaufnahme** des Ist-Zustands —
nicht nur "was fehlt", sondern auch bewusst benannte Widersprüche und
Doku-vs-Code-Spannungen, die laut Projektregel nicht selbständig
aufgelöst werden dürfen. Teil B überträgt konkrete, extern validierte
Muster aus vergleichbaren Spielen auf die tatsächlichen BattleMages-
Screens. Teil C priorisiert alles in Tiers nach Aufwand/Wirkung. Teil D
listet offene Entscheidungen, die vor jeder Umsetzung eine Rückfrage
brauchen.

---

## Teil A — Kritische Bestandsaufnahme

### A.1 Das Fundament ist besser als der letzte Stand vermuten lässt

Bevor die Kritik: `style.css` hat bereits eine echte Token-Ebene für
Farben (`:root`, Zeile 1-159) und für Schlüsselmaße
(`--slot-size`, `--portrait-size`, `--hp-bar-height` etc.), es gibt ein
verbindliches Material-Guide-Dokument (Basalt/Bronze/Silber/Rune/
Pergament, explizite Verbotsliste gegen Glow/Neon/Gothic-Spikes), eine
gepflegte 22-Asset-9-Slice-Spezifikation mit Integrationsstatus-Tracking,
und die letzten beiden Commits (`238e538`, `3290de5`, beide heute)
haben den Kampf-Screen und Mobile-Layout gezielt und mit gemessenen
Ergebnissen (0px Scroll bei 390×844) verbessert. Das ist kein Team, das
bei UI nachlässig war — es ist ein Team, das schrittweise an einzelnen
Screens gearbeitet hat, ohne je einen system-weiten Konsistenz-Pass zu
machen. Genau diese Lücke ist der rote Faden der folgenden Punkte.

### A.2 Gebrochene Material-Metapher: drei Font-Systeme, zwei Button-Systeme

Der Material-Guide gibt eine einzige physische Metapher vor (Basalt-
Stein-Panels, Bronze-Fassungen). Tatsächlich verwendet die UI:

- **Cinzel** (Variable Font) nur für Screen-/Panel-Titel
- **Segoe UI** (System-Font-Stack) für praktisch allen restlichen Text
  — Tooltips, Karten, Buttons, Kampf-Log
- **Georgia/Palatino/Times** (dritter, komplett eigener Stack) nur für
  die Home-Screen-Menü-Buttons (`.home-menu-btn`, `style.css:3230`)

Drei Font-Familien ohne erkennbares System, plus zwei visuell getrennte
Button-Klassen (`.btn-primary/-secondary` vs. `.home-menu-btn--*`), die
zwar denselben 9-Slice-Rahmen-Mechanismus teilen, aber unterschiedlich
wirken. Das ist exakt das, was die externe Recherche (Teil B) als
stärksten "cheap vs. premium"-Indikator einstuft: **eine durchgehaltene
physische Metaphor ist der höchste Hebel**, und BattleMages bricht sie
an der ersten Stelle, die ein Spieler sieht (Home-Screen).

### A.3 Rarity-Farben sind an drei Stellen widersprüchlich definiert

`style.css` definiert `.rarity-common/-rare/-epic/-legendary` **drei
Mal** an nicht benachbarten Stellen mit unterschiedlichen Hex-Werten
(u. a. zwei verschiedene "Common"-Grautöne). Die zuletzt geladene
Definition (Sprint-G4-Override-Block) gewinnt kaskadenbedingt, die
beiden früheren Blöcke sind toter, aber weiterhin lesbarer Code, der
beim nächsten Edit versehentlich für die "aktuelle Wahrheit" gehalten
werden kann. **Das ist ein Fund, kein Vorschlag** — wird in Teil D als
Rückfrage aufgeführt, nicht eigenmächtig bereinigt.

### A.4 Zwei tote Assets werden von aktivem Code referenziert

- `style.css:1189` referenziert
  `assets/effects/resistance/portrait_resistance_rise/...` — dieser
  Ordner **existiert nicht**. Der heute (`238e538`) neu eingeführte
  Widerstands-Gewinn-VFX-Effekt zeigt seit seinem Release nie etwas an,
  ohne jede sichtbare Fehlermeldung (CSS-`background-image`-404 ist
  stumm).
- `renderer.js:216` (`setFightBackground`) erwartet
  `assets/backgrounds/fights/{enemyId}.png` — dieser Ordner **existiert
  nicht**. Alle 12 Encounter zeigen denselben generischen
  `battlemages_gamescreen.png`-Hintergrund.
- Zusätzlich: **alle 12 Gegner und der Spieler-Charakter teilen sich
  je ein einziges generisches Portrait-Bild** (`enemy.png`/
  `player.png`). Die Registry (`portraitRegistry.js`) ist technisch
  bereits auf Per-ID-Portraits vorbereitet (inkl. Fallback-Mechanik),
  nur die Kunst fehlt.

Das ist der größte einzelne Fund dieser Analyse: **das System für
visuelle Gegner-Identität ist vollständig gebaut, aber zu 0% mit Inhalt
gefüllt.** Bei 12 Encounters mit unterschiedlichen Mechaniken (laut
Game-Design: 8 normal/3 Elite/1 Boss mit je eigenem Gimmick) sieht der
Spieler visuell zwölfmal denselben Gegner. Das widerspricht dem
Kern-Designprinzip "Enemies skalieren über Mechanik, nicht über rohe
Zahlen" — die Mechanik ist da, aber die UI kommuniziert sie nicht als
eigene Identität.

### A.5 Korrektur: Status-Effekt-Sichtbarkeit ist NICHT der leere Stub, als der er zunächst gemeldet wurde

**Korrektur nach Gegenprüfung, siehe `docs/specs/combat_condition_engine_roadmap.md`
("Phase 4 (UI-Teil): Präzision-Status-UI — abgeschlossen 2026-07-24"):**
Der erste Entwurf dieses Dokuments übernahm ungeprüft die Aussage aus
`CLAUDE.md` ("Bekannte Stolperfallen"), `getPlayerStatusViews()`/
`getEnemyBuffViews()` gäben immer `[]` zurück, und stufte das Füllen
dieser Funktion als größten Einzelhebel der gesamten Analyse ein. **Das
ist falsch für `getPlayerStatusViews()`** — diese Funktion ist seit
2026-07-24 echt implementiert (`battleManager.js`) und liefert reale
Werte für Widerstand und Präzision. Auf Renderer-Seite existiert dafür
bereits eine dedizierte, bewusst gestaltete Lösung: ein gold-
pulsierender Glow-Ring ums Spieler-Portrait für Präzision
(`combatant-portrait-effect--precision`) und ein eigenes Eck-Badge mit
Hover-Tooltip für Widerstand (`#playerResistanceBadge`). Gegner-Schild
hat ebenfalls eine eigene, bereits verdrahtete Visualisierung (Schild-
Layer über der Gegner-HP-Leiste, `enemyShieldFill`) — kein Bezug zu
`getEnemyBuffViews()`.

Bemerkenswert: **ein generisches Chip-/Tray-System wurde für genau
diesen Zweck bereits gebaut und dem Nutzer gezeigt** — und explizit
abgelehnt ("sieht schlecht aus, generisches Rahmen-Asset, Größen passen
nicht", siehe Roadmap-Dokument) — zugunsten der jetzigen Portrait-Glow-
/Badge-Lösung. Der in Teil B zitierte Darkest-Dungeon-Befund
("großes, animiertes In-World-Icon statt kleiner Tray-Icons") beschreibt
damit tatsächlich ungefähr das Muster, das BattleMages bereits einsetzt
— keine neue Erkenntnis, sondern eine nachträgliche Bestätigung einer
bereits getroffenen und bereits umgesetzten Entscheidung.

**Was tatsächlich noch offen ist:** nur `getEnemyBuffViews()` bleibt ein
Stub (`[]`, kein `context`-Parameter). Das war laut Roadmap-Dokument
eine bewusste Scope-Entscheidung ("bewusst Stub, nicht Teil dieser
Aufgabe"), keine vergessene Baustelle. Aktuell existiert keine
Gegner-Buff-Mechanik, die diese Funktion befüllen müsste (Gegner-Schild
läuft über einen eigenen Pfad, s.o.) — sie zu füllen hieße aktuell,
eine Mechanik zu erfinden, die es noch nicht gibt. Kein
UI-Handlungsbedarf, bis eine tatsächliche Gegner-Buff-Mechanik entsteht.

**Konsequenz für CLAUDE.md**: der Abschnitt "Bekannte Stolperfallen" →
`getPlayerStatusViews()`/`getEnemyBuffViews()` ist damit veraltet
(beschreibt einen Zustand von vor 2026-07-24). Wird hier nur benannt,
nicht selbständig korrigiert — Doku-vs-Code-Widerspruch, Entscheidung
liegt beim Nutzer.

### A.6 Struktur-Debt, der die UI-Qualität indirekt limitiert

- `renderer.js`: **eine** 3497-Zeilen-Datei für alle Screens, alle
  Animationshelfer, alle Tooltip-Builder, das komplette Drag&Drop.
  `style.css`: **eine** 4948-Zeilen-Datei ohne Aufteilung. Das ist per
  CLAUDE.md-Architektur (kein Build-System) so vorgesehen, macht aber
  jede gezielte Änderung riskanter, weil Kontext fehlt.
- Keine Spacing-Skala: Hunderte px-Literale (`5px`…`28px`) ohne
  erkennbares Raster, während für Größen/Farben durchaus Tokens
  existieren. Inkonsistenz zwischen "haben wir hier investiert" und
  "haben wir dort nicht".
- Kein z-index-System: 8+ verschiedene literale z-index-Werte
  (3 bis 10000), jeweils nur relativ zu direkten Nachbarn gewählt, ohne
  Skala/Dokumentation — funktioniert aktuell nur, weil die
  Stacking-Kontexte noch flach sind.
- Nur **ein** echter Responsive-Breakpoint (720px). Der Bereich
  721–1339px bekommt keine strukturelle Anpassung, nur fluide
  Kartenbreiten auf dem Auswahl-Screen — auf Tablet-Größen (iPad
  Portrait ≈ 810px, Steam Deck 1280×800) bleibt der Kampf-Screen im
  vollen 3-Spalten-Desktop-Layout, bevor er bei exakt 720px abrupt
  umschaltet.
- Rotation-Reordering (Drag&Drop der 5 Zauber) nutzt ausschließlich
  Pointer-Events — **keine Tastatur-Alternative**. Laut Skill-Referenz
  (`sharp_edges.md`, "Controller Navigation Deadend") eine der
  kritischsten Zugänglichkeits-Lücken überhaupt, auch ohne dass
  BattleMages Controller-Support anstrebt: Tastaturnutzer sind
  betroffen.
- Keinerlei Einstellungs-/Optionsscreen: keine Lautstärke, kein
  Colorblind-Modus, keine Textgrößen-Option. Laut Skill-Referenz
  ("Colorblind Failure", Severity: critical) eine Standard-Erwartung an
  jedes moderne Spiel-UI, aktuell schlicht nicht vorhanden.
- Sichtbarer vs. Screenreader-Text im Kampf-Popup ist **umgekehrt**
  reichhaltig: Akteur/Wirkung/Detail-Text existiert im DOM nur als
  `sr-only`, sehende Spieler sehen nur Icon + Titel. Normalerweise ist
  es umgekehrt (Dekoration versteckt, Inhalt sichtbar) — hier bekommen
  sehende Spieler technisch weniger Information als vorhanden wäre.
- Icon-Konsistenz: nur die Biomantie-Schule hat den "Lesbarkeits-Limits
  v2"-Vereinfachungspass bekommen (laut Icon Design Guide + Architektur-
  Audit), die übrigen 5 Schulen sind noch v1 — sichtbare stilistische
  Uneinheitlichkeit zwischen Schulen, bereits bekannt, hier nur erneut
  gewichtet als Teil des Gesamtbildes.
- Repo-Hygiene (kein UI-Problem selbst, aber Kontext): volle
  Icon-Archive (`_archive_v1/`, `_archive_v2/`) und doppelte
  `enemy_actions/raw/`-Kopien liegen im aktiven `assets/`-Baum;
  `renderSpellReplaceScreen()` in `renderer.js` wirkt strukturell wie
  Legacy-Code aus einem älteren Reward-Flow.

### A.7 Eine bereits getroffene Design-Entscheidung steht im Widerspruch zu einer sichtbaren UI

Der Architektur-Audit vom 2026-07-21 hält fest: Build-Archetypen sollen
dem Spieler **unsichtbar** bleiben ("Option B", stilles
Reward-Gewichts-Bias statt UI). Der Compendium-Screen zeigt aber
bereits heute einen "Archetypen"-Tab mit Fortschrittsanzeige — die
einzige Stelle, an der Archetypen dem Spieler überhaupt begegnen. Das
wird hier **nur benannt, nicht aufgelöst** (siehe `CLAUDE.md`: nichts
ohne Rücksprache verändern, wenn eine Doku-vs-Code-Inkonsistenz
auffällt) — relevant, weil einer der Vorschläge in Teil B genau an
dieser Stelle ansetzen würde.

---

## Teil B — Übertragbare Muster aus vergleichbaren Spielen

Externe Recherche ging bewusst über Slay the Spire/Hades/Balatro
hinaus (dort bisher nur für Meta-Progression/Persistenz-Scope
verglichen, nicht für visuelles UI-Design). Herangezogen: Monster
Train, Wildfrost, Griftlands, Teamfight Tactics, Super Auto Pets,
Marvel Snap, Darkest Dungeon, Loop Hero, Book of Demons, Path of Exile
(nur als Tooltip-Ikonografie-Referenz). Die vollständigen Fundstellen
mit Quellenangaben liegen im Recherche-Rohbericht dieser Session vor;
hier nur die auf BattleMages gemappten, konkreten Übertragungen.

**Wichtigster Cross-Cutting-Befund, der A.2 extern bestätigt:** In
praktisch jedem untersuchten Spiel trägt **eine** konsequent
durchgehaltene physische Material-Metapher die "Premium"-Wirkung
(Marvel Snap: "Piano-Glas + projiziertes Licht als Hologramm" für
*jedes* UI-Element; Monster Train: Pergament/Zug-Relikt-Rahmen; Book of
Demons: Papercraft-Popup-Buch für die *gesamte* UI). BattleMages hat
mit dem Material-Guide (Basalt/Bronze/Rune) bereits die richtige Idee
— sie ist nur nicht konsequent durchgesetzt (A.2).

| BattleMages-Screen | Übertragbares Muster | Quelle | Warum es passt |
|---|---|---|---|
| Kampf-Screen — Status-Sichtbarkeit | Großes, animiertes In-World-Icon nahe der Figur statt kleiner Tray-Icon-Liste | Darkest Dungeon (DD1 vs. DD2-Regression als Negativ-Beleg) | **Bereits umgesetzt** (Präzision-Glow-Ring, Widerstand-Badge, 2026-07-24, siehe korrigiertes A.5) — externe Recherche bestätigt nachträglich eine bereits getroffene Entscheidung, kein offener Punkt |
| Kampf-Screen — Pacing | Kurze, straff getaktete Auflösung ohne Kamera-Spektakel; Langeweile wird über Kürze gelöst, nicht über Effekt-Dichte | Super Auto Pets, Teamfight Tactics | Strukturell die engste Analogie zu BattleMages: Spieler stellt zusammen, schaut dann zu, ohne Eingriff |
| Kampf-Screen — Schadenscodierung | Fixe, schultyp-gebundene Farbkonvention für Schadenszahlen, orthogonal zur Rarity-Farbe | Teamfight Tactics (Item-Farbfamilien je Schaden-Typ, unabhängig von Trait-Farbe) | Beantwortet direkt das im Code bereits bekannte Risiko dreier unsynchronisierter Schul-Namens-Tabellen — dasselbe Diszipdanplin-Problem existiert offenbar auch visuell in vergleichbaren Spielen und wird dort durch ein strikt einziges Farbsystem gelöst |
| Rotation-Builder (Zauberauswahl/Spellbar) | Sichtbare Schul-Synergie-Anzeige (Icon + Stufen-Balken je Schule, zeigt wie viele der 5 Zauber pro Schule) | Teamfight Tactics (Trait Tracker) | **Berührt A.7** — würde dem Spieler eine explizite Optimierungsachse zeigen, die laut Architektur-Audit bewusst unsichtbar bleiben soll. Nicht selbständig entscheidbar, siehe Teil D |
| Rotation-Builder — Mobile | Interaktive Elemente in die untere Bildschirmhälfte für Daumen-Reichweite; UI tritt zugunsten der Karten zurück | Marvel Snap | Konkrete, getestete Mobile-Regel für exakt dieselbe "Kit vor dem Ablauf zusammenstellen"-Situation |
| Reward-Karten-Screen | Seltenheit über gestufte physische Kartenbehandlung statt nur Farbe/Text (z. B. zunehmende Rahmen-Ornamentik pro Stufe) | Marvel Snap (Rarity-Stufen als Frame-Break/3D-Pop) | BattleMages hat bereits produzierte, aber 2026-07-08 zurückgestellte `rarity_frames`-Assets ("Frame-in-Frame"-Problem) — mit dem seither gewonnenen 9-Slice-Wissen ggf. neu bewertbar, nicht neu von Grund auf zu bauen |
| Reward-/Belohnungs-Moment | Dramaturgisches Budget auf seltene, diskrete Momente konzentrieren statt permanent im HUD | Darkest Dungeon (Affliction/Virtue-Vollbild-Einblendung) | Der Reward-Screen ist bereits der natürliche "große Moment" zwischen Kämpfen — passend zur bestehenden Linie, den Alltags-HUD ruhig zu halten |
| Spell-Tooltip | Inline-Farbcodierung von Schultyp-/Schlüsselbegriffen im Fließtext, an dieselbe Schulfarbe gekoppelt wie Icons/Karten | Path of Exile (Gem-Tooltips) | Billig umsetzbar, verstärkt vorhandenes Farbsystem statt ein neues zu erfinden |
| Compendium — Meta-Progression | Fortschritt als Rahmen-Ornamentik auf bereits bekannter Karte statt eigener Stats-Unterseite | Monster Train (Card Frames) | Spielt direkt in Punkt 5 des bestehenden `UI-/Umfang-Backlogs` ("Meta-Progression, bewusst nicht ausformuliert") — hier nur ein Vorschlag fürs WIE, nicht das WAS, das bleibt Spieldesign-Hoheit |

---

## Teil C — Priorisierung

### Tier 0 — Bugfixes, kein Design-Vorschlag nötig
1. Rarity-Farb-Redundanz auf eine Quelle konsolidieren (A.3)
2. Widerstands-VFX-Asset entweder produzieren oder Referenz/Feature
   temporär deaktivieren, statt eines still scheiternden Effekts (A.4)
3. `renderSpellReplaceScreen()` auf tatsächliche Nutzung prüfen, ggf.
   entfernen (A.6)

### Tier 1 — Günstig, hoher Hebel, kein neuer Kunst-Content nötig
*(Punkt 1 der Erstfassung — "Status-Views füllen" — entfällt, siehe
korrigiertes A.5: bereits umgesetzt. Reihenfolge unten entsprechend
nachgerückt.)*
1. **Design-Tokens — teilweise umgesetzt (2026-07-30):**
   - z-index-Skala: ✅ umgesetzt. 7 tatsächlich globale Layer
     (VFX-Canvas/-Flash, 3× Tooltip, Modal-Overlay, Drag-Klon) auf
     dokumentierte Tokens (`--z-vfx`, `--z-tooltip`, `--z-modal`,
     `--z-drag`) umgestellt. Die vielen lokalen `z-index:0-6` innerhalb
     isolierter Komponenten bewusst NICHT angefasst — sie konkurrieren
     mit nichts außerhalb ihrer eigenen Box, eine globale Skala wäre
     dort Überkonstruktion.
   - Font-System: ✅ Home-Menü-Buttons nutzten einen dritten, isolierten
     Font-Stack (Georgia), obwohl sie sich denselben 9-Slice-Rahmen mit
     `.btn` teilen, das nie einen eigenen `font-family` setzt. Override
     entfernt, folgt jetzt demselben System wie jeder andere Button.
   - Spacing-Skala: ⚠️ **nur Definitionen ergänzt** (`--space-1`…`-8`
     in `:root`), bewusst **nicht rückwirkend** auf die bestehenden
     Hunderte px-Literale angewendet. Ein blinder Gesamtdatei-Sweep
     ohne visuelle Verifikation (kein Browser-Test in dieser Session
     verfügbar) wäre ein zu großes Regressionsrisiko für ein
     CSS-Detail. Retrofit bleibt offener, separat zu beauftragender und
     visuell zu prüfender Schritt.
2. ✅ Tastatur-Alternative fürs Rotation-Reordering (A.6) — Pfeiltasten
   links/rechts auf fokussierter Zauberkarte, Fokus wandert mit der
   verschobenen Karte mit.
3. ✅ Farbcodierung der Schulzeile im Tooltip (Teil B) — kein
   bestehendes Farbsystem gefunden (nur Prosa-Farbschema im Icon
   Design Guide), 6 Akzenttöne daraus abgeleitet und mit Nutzer
   abgestimmt vor Umsetzung.
4. ✅ Grundgerüst Einstellungs-Screen — **Achtung, Konflikt mit
   vorheriger Entscheidung gefunden und mit Nutzer geklärt**: die
   Lautstärke-Kontrolle war am 2026-07-27 im UI-Umfang-Backlog explizit
   zurückgestellt ("kaum Sound-Content, kein Mehrwert"). Auf
   ausdrücklichen Nutzerwunsch trotzdem als klar markierter
   "Bald verfügbar"-Platzhalter mit aufgenommen (bewusste Revision der
   2026-07-27-Entscheidung, kein Übergehen). Textgröße ist echt
   funktional (persistiert, skaliert global über `--ui-text-scale`),
   Farbenblindheit-Modus ebenfalls nur Platzhalter (neue Engine wäre
   eigener, größerer Task).

**Hinweis zur Verifikation**: alle Tier-1-Änderungen sind
syntaxgeprüft (Node `--check`, CSS-Klammernbalance) und die
bestehenden, unabhängigen JS-Testsuiten laufen weiterhin grün (21/21,
28/28). Es gab in dieser Session **keinen Browser-Zugriff** zur
visuellen Verifikation — Tastatur-Reorder, Tooltip-Farben und der neue
Settings-Screen sind nicht am Bildschirm gegengeprüft worden.

### Tier 2 — Mittel, etwas Asset-Arbeit nötig
1. Icon-v2-Vereinfachungspass auf die verbleibenden 5 Schulen ausrollen
   (bereits bekannter, hier nur neu gewichteter Punkt)
2. Geparkte `rarity_frames`-Assets mit heutigem 9-Slice-Wissen neu
   bewerten (Teil B)
3. Schadens-Farbcodierung orthogonal zur Rarity-Farbe systematisieren
   (Teil B)

### Tier 3 — Groß, braucht echte Asset-Produktion und/oder
Spieldesign-Entscheidung
1. Per-Encounter-Portraits/-Hintergründe für alle 12 Gegner (A.4 —
   größter struktureller Fund, System ist fertig, Inhalt fehlt
   komplett)
2. Meta-Progression-Rahmen-System fürs Compendium (Teil B, hängt an
   noch offener Meta-Progression-Design-Entscheidung aus dem
   bestehenden Backlog)
3. Echte Textur-Assets statt CSS-Gradient-"Stein" (bereits in
   `sprint_g4_fantasy_ui_report.md` als nächster großer Hebel benannt,
   hier extern bestätigt)

---

## Teil D — Offene Fragen vor jeder Umsetzung

1. **Rarity-Farb-Bereinigung (A.3) und toter Code (A.6)**: reine
   Aufräumarbeit ohne Verhaltensänderung — trotzdem laut
   Projektregel nicht ohne Rücksprache. Freigabe für Tier 0 gewünscht?
2. **Schul-Synergie-Anzeige im Rotation-Builder** (Teil B) steht im
   Spannungsverhältnis zur getroffenen Entscheidung, Build-Archetypen
   dem Spieler unsichtbar zu halten (A.7). Das ist eine
   Spieldesign-Frage, keine UI-Detailfrage — soll das weiterverfolgt
   werden, verworfen werden, oder soll stattdessen die
   Compendium-Archetypen-Anzeige (die der Entscheidung bereits heute
   widerspricht) aufgelöst werden?
3. **Priorität/Reihenfolge**: Tier 1 (Status-Sichtbarkeit,
   Design-Tokens) als nächstes angehen, oder zuerst Tier 3.1
   (Gegner-Identität) trotz höherem Aufwand, weil es der sichtbarste
   Einzelfund ist?
4. Soll dieses Dokument wie die übrigen `docs/design/*.md`-Backlogs
   eingecheckt werden, oder vorerst nur als Diskussionsgrundlage im
   Arbeitsverzeichnis bleiben?
5. **Neu**: `CLAUDE.md` ("Bekannte Stolperfallen") behauptet weiterhin,
   `getPlayerStatusViews()`/`getEnemyBuffViews()` gäben immer `[]`
   zurück — das stimmt seit 2026-07-24 nicht mehr für
   `getPlayerStatusViews()` (siehe korrigiertes A.5). Soll dieser
   CLAUDE.md-Abschnitt aktualisiert werden?
