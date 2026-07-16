# Sprint G4 — Fantasy UI Art Pass (CSS Only)

**Status:** Abgeschlossen  
**Datum:** Juli 2026  
**Scope:** Ausschließlich `style.css` — keine HTML-, Gameplay- oder Asset-Änderungen

---

## 1. Verbesserte UI-Bereiche

| Bereich | Änderung |
|---------|----------|
| **Globale Tokens (`:root`)** | Dunklere Stein-/Bronze-Palette, mehrschichtige Schatten-Variablen (`--stone-face`, `--stone-inset`, `--rune-slot`) |
| **Body / Atmosphäre** | Tieferer radialer Hintergrund, weniger „Browser-Canvas“ |
| **Typografie** | `h1`, `.screen-title`, Panel-Labels — stärkere Hierarchie, Gold-Akzente, Letter-Spacing |
| **Panels** | Kampf-Panels, Spellbar, Battle-Header, How-to, Kampflog — massive Steinplatten mit Inset-Highlight |
| **Buttons** | `.btn-primary` / `.btn-secondary` — schwere Bronze-/Stein-Buttons, Hover leicht angehoben, Active eingedrückt; Glassmorphism entfernt |
| **Karten** | Starter-, Reward- und Zauberkarten — eingelassene Steinfläche; Seltenheit nur über Rahmenfarbe (gedämpft) |
| **Actionbar** | Runenleiste mit tiefen Slots; aktiver Slot hervorgehoben ohne Puls-Glow |
| **HP / Schild** | Kanal-artige Balken (rechteckig, tief eingelassen); Schild visuell hinter HP (z-index + Material) |
| **Portraits** | Ornamentale Bronzerahmen statt gestrichelter Rechtecke |
| **Tooltips** | Tafel-/Tomb-Look mit Bronze-Rand und mehrschichtigen Schatten |
| **Kampflog** | Chronik-Stil: Zeilenabstand, Rand-Akzente, Gold-Rundenüberschriften |
| **Reward-Screen** | Einheitliche Stein-Karten, eingelassene Upgrade-Zeilen, dezente Run-Marker |
| **Status-Chips** | Inset-Stein statt pillenförmiger Browser-Badges |
| **Animationen** | Aktiv-Slot-Puls und Actionbar-Reorder-Puls deaktiviert; Hover minimal |

---

## 2. Verwendete CSS-Techniken

- **Mehrfach-Background-Layer:** `--stone-face` kombiniert diagonale Highlights, feine Streifen (`repeating-linear-gradient`) und Basisverlauf für Materialwirkung
- **Token-basierte Schatten:** `--shadow-panel`, `--shadow-inset`, `--shadow-inset-deep`, `--shadow-highlight` für konsistente Tiefe
- **Inset + Outer Shadow:** Panels, Slots, Tooltips, HP-Kanal
- **Border-Highlights:** Bronze-Ränder (`--border-bronze`) mit innerem 1px-Dunkelring
- **Z-Index-Layering:** Schild (1) hinter HP-Füllung (2)
- **Gedämpfte Verläufe:** Vertikale Metall-/Stein-Gradienten statt flacher Farben oder Neon-Glows
- **Override-Block:** Konsolidierter G4-Abschnitt am Dateiende vor `@media`, um frühere Browser-Styles gezielt zu überschreiben
- **Typografie:** `letter-spacing`, `text-shadow`, `text-transform: uppercase` für RPG-Hierarchie ohne Schriftwechsel

---

## 3. Bereiche für künftige UI-Assets

Reines CSS liefert gute Basis, profitiert aber sichtbar von Pixel-Art-Chrome laut `docs/art_style.md`:

| Priorität | Asset-Typ | Grund |
|-----------|-----------|-------|
| **Hoch** | 9-Slice Panel-Rahmen | Echte Stein-/Bronze-Ecken wirken authentischer als CSS-Gradienten |
| **Hoch** | Actionbar-Slot-Frames | Runenleiste mit gravierten Rändern (HoMM3/Diablo) |
| **Mittel** | Button-Sprites (normal/hover/pressed) | Schwereres „physisches“ Klickgefühl |
| **Mittel** | Portrait-Rahmen pro Fraktion | Spieler vs. Gegner klarer als Farb-Border |
| **Mittel** | HP/Schild-Kanal-Hintergrund | Eingelassene Rille als Textur |
| **Niedrig** | Tooltip-Rahmen / Scroll-Kante | Zauberbuch-Illusion verstärken |
| **Niedrig** | Seltenheits-Rahmen-Sprites | Epic/Legendary ohne CSS-Farbschema |

Spell-Icons und Portraits sind bereits asset-basiert; dieser Sprint betrifft nur UI-Chrome.

---

## 4. Kritische Selbsteinschätzung

### Was gut gelungen ist

- Die Oberfläche wirkt **deutlich dunkler, schwerer und weniger „Web-App“**
- Einheitliche **Stein-/Bronze-Sprache** über Kampf, Rewards und Auswahl
- **Seltenheit über Rahmen** statt bunte Kartenhintergründe — aligned mit Art Style Guide
- **Glow/Puls reduziert** — näher an Diablo/Darkest-Dungeon-Disziplin

### Schwächen / Grenzen von CSS-only

- **Materialwirkung bleibt synthetisch:** Wiederholende 1px-Streifen simulieren Stein, ersetzen aber keine echte Textur
- **Ecken wirken noch zu geometrisch:** `--radius-sm: 3px` ist bewusst hart, aber ohne Corner-Ornamente fehlt „Handcrafted“-Charakter
- **Home-Menü** (`.home-menu-btn`) war bereits fantasy-nah — leichte stilistische Differenz zu `.btn` im Spiel (Home etwas reicher, In-Game etwas nüchterner)
- **Schulfarben in Kampflog-Akzenten** (blau/rot/lila links) bleiben funktional; insgesamt noch etwas modern-sättigungsbetont
- **Mobile:** Layout unverändert; Stein-Effekte skalieren, aber enge Actionbar bleibt scrollbar

### UX-Check (Starter, Tooltips, Rewards)

| Flow | Bewertung |
|------|-----------|
| **Starterauswahl** | Karten lesbar, Icon + Text klar; Steinrahmen + gedämpfte Seltenheit unterstützen Entscheidung ohne Ablenkung |
| **Tooltips** | Hierarchie (Name → Seltenheit → Schule → Text → Werte) gut lesbar; dunkle Tafel hebt sich vom Kampf ab |
| **Rewards** | Upgrade-Diff in Inset-Zeilen; Rahmen-Seltenheit konsistent mit Starter-Karten |
| **Konsistenz** | Actionbar-Slots, Kampf-Panels und Reward-Karten teilen `--stone-face` / `--rune-slot` — erkennbar eine Welt |

### Fazit

Die UI fühlt sich **nicht mehr wie ein typisches Browsergame** an, sondern wie ein **dunkles Indie-Fantasy-RPG im Browser**. Für den CSS-only-Rahmen ist das ein solides Maximum; der nächste qualitative Sprung kommt mit **9-Slice-UI-Frames** und **Slot-Rahmen-Assets**, nicht mit weiteren Gradienten.

---

## Geänderte Dateien

- `style.css` — `:root`-Tokens, Body, `h1`, Sprint-G4-Override-Block (~550 Zeilen)

## Nicht geändert

- HTML-Struktur
- JavaScript / Gameplay
- Icons, Gegner, Zauber
- Tooltip-Inhalte
