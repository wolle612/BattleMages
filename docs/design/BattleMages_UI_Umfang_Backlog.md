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

### 2. Run-Recap-Screen (Sieg UND Niederlage)
- Ersetzt den aktuellen Ein-Satz-Abschluss
  (`renderRunVictoryScreen`/Defeat-Overlay).
- Zeigt: finale Rotation (5 Zauber inkl. Rang/Pfad), Anzahl
  überstandener Kämpfe, ggf. welcher Build gespielt wurde.
- Größter Hebel fürs Spielgefühl bei überschaubarem Aufwand — baut
  direkt auf Punkt 1 auf (braucht keine neue Persistenz, nur Zugriff
  auf den bestehenden Run-State vor dem Reset).

### 3. Zwischen-Screen ("aktuelle Rotation")
- Kurzer Moment zwischen Kämpfen, der die eigene Rotation bewusst
  zeigt, statt Fight→Reward→nächster Fight ohne Pause durchzuhetzen.
- Kein neuer Mechanik-Inhalt, reine Präsentations-/Pacing-Ergänzung.

### 4. Lautstärke-/Mute-Kontrolle
- Sound existiert bereits (`src/vfx/soundBridge.js`), aber keinerlei
  Einstellmöglichkeit.
- Kleiner Umfang, aber eine Standard-Erwartung, die aktuell fehlt.

### 5. Meta-Progression (Grundgerüst, bewusst nicht ausformuliert)

Noch keine Entscheidung im Detail — nur eine erste konzeptionelle
Richtung, damit klar ist, worauf Punkt 1 (Persistenz) auslegen sollte:

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

## Bewusst zurückgestellt

- **Charakterauswahl/-Customization**: verworfen für jetzt. Später
  ggf. ein fester, benannter Protagonist (kein Auswahl-/
  Anpassungssystem) — deutlich kleinerer Umfang als eine echte
  Customization, aber auch das erst nach den Punkten 1-5.
- **Eigenen Namen eintragen**: ohne Persistenz ohnehin wirkungslos,
  daher an Punkt 1 gekoppelt und nicht separat priorisiert.
