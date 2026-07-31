# BattleMages — UI-/Umfang-Backlog

> Ergebnis der UI-/Umfang-Analyse vom 2026-07-24 (siehe Chat-Verlauf).
> Priorisierte Liste fehlender Struktur-Elemente, als Arbeitsgrundlage
> für spätere Sessions — noch nicht implementiert, teils bewusst nicht
> vollständig ausformuliert (siehe Meta-Progression).

## Ausgangsbefund

`src/state.js` hält aktuell 4 globale Variablen, keinerlei Persistenz
(kein `localStorage`, kein Save). Das ist die strukturelle Wurzel
hinter dem "es fehlt Umfang"-Gefühl — Namen, Statistiken, Fortschritt
brauchen alle eine Speicherschicht, die es noch nicht gibt.

Vergleich mit dem Genre (Slay the Spire, Hades, Balatro): keines
investiert in Namens-/Charaktereingabe — der Charakter ist fix. Der
tatsächliche Hebel ist überall derselbe: persistente
Meta-Progression + ein substanzieller Run-Abschluss-Screen. Daher die
Priorisierung unten.

## Priorisierte Liste

### 1. Persistenz-Grundlage — ✅ umgesetzt (2026-07-24)
- `localStorage`-basiert (`src/persistence.js`), degradiert sauber ohne
  Verfügbarkeit (Private-Mode etc.).
- Checkpoint statt Frame-genau: gespeichert wird der State direkt vor
  jedem Kampf (`showFightScreen()`), nie ein laufender Kampf selbst —
  passend zur Simulate-then-Replay-Architektur.
- Home-Screen zeigt bei vorhandenem Speicherstand einen
  "Weiterspielen"-Button.
- **Nebenfund**: `showFightScreen()` setzte nie selbst seinen
  App-Screen-Modus, verließ sich stillschweigend auf
  `showSpellSelection()` (zufällig CSS-kompatibel) — der neue direkte
  Home→Kampf-Sprung über "Weiterspielen" deckte das auf (kein
  Hintergrundbild, Scrollen blockiert). Robust gefixt: `showFightScreen()`
  setzt "game" jetzt selbst, unabhängig vom Aufrufer. Commit `317a184`.

### 2. Run-Recap-Screen (Sieg UND Niederlage) — ✅ umgesetzt (2026-07-27)
- Ersetzt `renderRunVictoryScreen`/Defeat-Overlay durch
  `renderRunRecapScreen()`: finale Rotation (inkl. Rang/Pfad), Anzahl
  überstandener Kämpfe, plus zwei run-weite Statistiken (höchster
  Einzelschaden, maximaler Widerstand). Werte kommen aus einem neuen,
  rein präsentationsseitigen Akkumulator (`runStats` in `state.js`),
  der nach jedem `simulateFight()`-Aufruf aus den ohnehin vorhandenen
  Kampf-Snapshots aktualisiert wird — keine neue Kampfmechanik.
- **Nebenfunde/Fixes unterwegs**:
  - `#spellTooltip` hatte in keinem Vorfahren `position: relative` und
    landete je nach Seiteninhalt außerhalb des sichtbaren Bereichs
    (zufällig unauffällig beim kurzen Reward-Screen, sichtbar kaputt
    beim längeren Recap-Screen). Fix: Tooltip ist jetzt Kind von
    `.reward-build-panel` (die selbst `position: relative` bekommen
    hat) — gilt für Reward- und Recap-Screen gleichermaßen.
  - Die readonly-Build-Panels (Reward "Dein Build", Recap) zeigten die
    volle Rang-III/V-Pfadvorschau in den Tooltips und sprengten damit
    die Höhe zusätzlich; dort über den bestehenden
    `showUpgradePreview:false`-Options-Pfad unterdrückt.
  - Checkpoint (`localStorage`) wurde erst beim Klick auf "Zurück zum
    Hauptmenü" gelöscht, nicht beim Erreichen des Recap-Screens selbst
    — ein Reload auf dem Recap-Screen bot fälschlich "Weiterspielen"
    für den gerade beendeten (auch verlorenen) Kampf an. Jetzt wird
    `clearRunState()` direkt beim Rendern des Recap-Screens aufgerufen.

### 3. Zwischen-Screen ("aktuelle Rotation") — ❌ verworfen (2026-07-27)
- Ursprüngliche Idee: kurzer Moment zwischen Kämpfen, der die eigene
  Rotation bewusst zeigt, statt Fight→Reward→nächster Fight ohne Pause
  durchzuhetzen.
- Verworfen: `showFightScreen()` rendert die volle, anpassbare Rotation
  bereits vor jedem Klick auf "Kämpfen" — ein eigener Zwischen-Screen
  würde nur wiederholen, was ohnehin schon sichtbar ist.

### 4. Lautstärke-/Mute-Kontrolle — zurückgestellt (2026-07-27)
- Sound existiert bereits (`src/vfx/soundBridge.js`), aber keinerlei
  Einstellmöglichkeit.
- Zurückgestellt, bis überhaupt reguläres SFX-/Musik-Material vorhanden
  ist — eine Lautstärke-Kontrolle für praktisch keinen Sound bringt
  aktuell keinen Mehrwert. Wieder aufgreifen, sobald Thema 3
  (Animation/Feedback) nennenswerten Sound-Content bringt.

### 5. Meta-Progression — Konzept steht, Schritt 1 umgesetzt (2026-07-27)

Ausformuliertes Konzept inkl. Genre-Vergleich (Slay the Spire, Balatro,
Hades u.a.) siehe `BattleMages_Meta_Progression_Concept_v1.md`. Schritt 1
(run-übergreifender Persistenz-Layer + Kompendium- + Statistik-Screen)
ist umgesetzt; die übrigen Bausteine (Archetyp-Tracker, alternative
Start-Loadouts, Legendary-Meilensteine, Herausforderungs-Modifikatoren,
Kosmetik) bleiben vorerst nur konzipiert. Ursprüngliche erste
Stoßrichtung, unten als Kontext belassen:

- **Was persistiert wird** (Kandidaten, nicht final): Anzahl
  abgeschlossener Runs, bester erreichter Fortschritt (welcher Kampf/
  Boss), evtl. eine einfache "gesehene Zauber"-Historie.
- **Wie sich das auf künftige Runs auswirkt** — bewusst OHNE
  Power-Progression (kein "stärker werden durch Meta-Fortschritt",
  das würde die sorgfältig kalibrierten RV-Zielbänder aus
  `Combat_Formula_v2.md` unterlaufen). Denkbare, machtneutrale
  Richtungen: neue Startzauber-Optionen freischalten (spielt direkt in
  die Startauswahl-Analyse aus Thema 1 hinein), kosmetische Extras,
  oder schlicht sichtbare Fortschritts-/Erfolgs-Anzeigen ohne
  mechanische Auswirkung.
- **Mögliche Verbindung zu Thema 1**: die Reward-Gewichtstabelle
  budgetiert bereits "Legendary"-Rarity (bis zu 18 % bei Kampf 8-12),
  obwohl aktuell kein einziger Legendary-Zauber existiert (siehe
  Spellpool-Analyse). Legendary-Zauber über Meta-Progression
  freizuschalten statt sie immer verfügbar zu machen, wäre eine
  Möglichkeit, zwei offene Fäden (fehlende Legendary-Inhalte +
  fehlende Meta-Progression) mit einer Lösung zu verbinden — nur eine
  Idee, keine Festlegung.

### 6. Großer UI-Optimierungscheck (inkl. Zauberanimationen) — größtenteils umgesetzt (2026-07-31)

- **Auftrag (2026-07-28)**: umfassende Durchsicht der bestehenden UI auf
  Optimierungspotenzial, explizit inklusive einer Überarbeitung der
  Zauberanimationen. Ob beides als ein gemeinsamer Durchgang oder als
  zwei getrennte Arbeitsschritte läuft, ist bewusst offengelassen —
  Entscheidung fällt erst, wenn der Umfangs-Check tatsächlich beginnt
  und sich zeigt, wie stark sich UI-Layout-Fragen und
  Animations-/Feedback-Fragen in der Praxis überschneiden.
- **Bereits vorbereitete Grundlage**: `BattleMages_Animation_Feedback_Backlog.md`
  enthält bereits eine vollständige, priorisierte Analyse der
  Zauberanimations-/Trefferfeedback-Lücken (Stand 2026-07-24, seither
  bewusst zurückgestellt). Diese Liste ist der naheliegende
  Ausgangspunkt für die Animations-Hälfte dieses Punktes, statt die
  Analyse doppelt zu machen — muss aber gegen den aktuellen Codestand
  gegengeprüft werden, da seither u. a. 15 neue Zauber und neue
  Meta-Progression-Screens (Kompendium, Statistik, Recap) dazukamen,
  die die ursprüngliche Analyse noch nicht kennt.
- **UI-Teil erledigt (2026-07-30/31)**: vollständiger Code-Audit +
  externe Vergleichsspiel-Recherche, siehe
  `docs/design/BattleMages_UI_Deep_Analysis_2026-07-30.md`. Umgesetzt:
  Design-Tokens (z-index-/Spacing-Skala), Tastatur-Alternative fürs
  Rotation-Reordering, Schulfarben im Tooltip, neuer Settings-Screen
  (Textgröße echt funktional), diverse Rarity-Farb-/Font-Bugfixes.
  **Wichtiger Nebenbefund**: dieser Punkt wurde ursprünglich auf einem
  parallel abgezweigten Worktree (`worktree-vfx-rework`) bearbeitet, der
  unabhängig fast identische Arbeit zu diesem Backlog-Punkt bereits
  einmal gemacht hatte (`238e538` vs. diese Serie oben) — Analyse wurde
  daraufhin auf `worktree-ui-tier1` (Basis: main) portiert, nur die
  tatsächlich neuen Beiträge übernommen. Nicht behandelt: echte
  Textur-Assets statt CSS-Gradient-„Stein“, Icon-v2-Pass für die
  restlichen 5 Schulen, Rarity-Frame-Neubewertung, Gegner-Portrait-/
  Hintergrund-Erweiterungen über die bestehenden 12 hinaus.
- **Animations-Teil erledigt (2026-07-31)**: `BattleMages_Animation_Feedback_Backlog.md`
  komplett abgearbeitet (Krit-Eskalation, Gegner-Angriffs-Lunge,
  Sieg/Niederlage-Portrait-Reaktion — Hit-Flash/-Shake existierten
  bereits, ohne dass die Backlog-Notiz das vermerkt hatte).
- **Status**: UI- und Animations-Teil abgeschlossen. Nicht behandelte
  Punkte siehe oben — eigene, spätere Entscheidung nötig, ob/wann.

## Bewusst zurückgestellt

- **Charakterauswahl/-Customization**: verworfen für jetzt. Später
  ggf. ein fester, benannter Protagonist (kein Auswahl-/
  Anpassungssystem) — deutlich kleinerer Umfang als eine echte
  Customization, aber auch das erst nach den Punkten 1-5.
- **Eigenen Namen eintragen**: ohne Persistenz ohnehin wirkungslos,
  daher an Punkt 1 gekoppelt und nicht separat priorisiert.
