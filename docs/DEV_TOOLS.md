# BattleMages – Developer Tools

Version: 1.0  
Status: Entwicklungshilfe (nicht für Spieler)

---

## Zweck

Der Developer Mode beschleunigt das Testen von Zaubern, Gegnern, Animationen und UI während der Entwicklung.

Er ist vollständig vom normalen Spielfluss getrennt und wird **nur aktiv**, wenn du explizit `BattleMagesDev` aufrufst.

---

## Aktivierung

1. Dev-Skripte sind in `index.html` eingebunden (`src/dev/*`).
2. Öffne die Browser-Konsole (F12).
3. Rufe `BattleMagesDev` auf.

**Release deaktivieren:**

- `DEV_MODE_ENABLED = false` in `src/dev/devConfig.js`, **oder**
- Dev-Skripte aus `index.html` entfernen.

---

## API-Referenz

Alle Funktionen sind über `window.BattleMagesDev` erreichbar.

### `BattleMagesDev.previewSpell(spellId)`

**Wichtigste Funktion für VFX-Tests.**

Startet sofort einen Testkampf mit:

- Training Dummy als Gegner
- gewünschtem Zauber in Slot 1
- automatischem Kampfstart

```javascript
BattleMagesDev.previewSpell("mind_strike");
```

---

### `BattleMagesDev.startTestFight()`

Startet einen Testkampf mit aktuellem Loadout (oder Standard-Füllzaubern).

```javascript
BattleMagesDev.startTestFight();
```

---

### `BattleMagesDev.giveSpell(spellId)`

Fügt einen Zauber zur Rotation hinzu — ohne Reward-Screen.

```javascript
BattleMagesDev.giveSpell("chaos_eruption");
```

---

### `BattleMagesDev.replaceSpell(slot, spellId)`

Ersetzt einen Zauber direkt in einem Slot (1–5).

```javascript
BattleMagesDev.replaceSpell(1, "shadow_dance");
BattleMagesDev.replaceSpell(3, "soul_spark");
```

---

### `BattleMagesDev.setEnemy(enemyId)`

Wechselt den Gegner für Dev-Testkämpfe.

```javascript
BattleMagesDev.setEnemy("verirrter_novize");
BattleMagesDev.setEnemy("dev_training_dummy");
```

---

### `BattleMagesDev.resetFight()`

Bricht laufende Playback-Animationen ab und startet den Kampfbildschirm neu.

```javascript
BattleMagesDev.resetFight();
```

---

### `BattleMagesDev.setSpeed(multiplier)`

Ändert die Kampf-Playback-Geschwindigkeit.

```javascript
BattleMagesDev.setSpeed(0.5);  // langsam
BattleMagesDev.setSpeed(1);    // normal
BattleMagesDev.setSpeed(2);    // schnell
BattleMagesDev.setSpeed(4);    // sehr schnell
```

---

### `BattleMagesDev.fillHP()`

Setzt Spieler- und Gegner-HP auf dem Kampfbildschirm zurück.

```javascript
BattleMagesDev.fillHP();
```

---

### `BattleMagesDev.cleanup()`

Stellt den normalen Run-Zustand wieder her (Gegner-Slot 1, `currentFight`, Speed).

```javascript
BattleMagesDev.cleanup();
showHomeScreen();
```

---

### Hilfsfunktionen

```javascript
BattleMagesDev.listSpells();   // alle Zauber-IDs
BattleMagesDev.listEnemies();  // alle Gegner-IDs
BattleMagesDev.getSpeed();       // aktueller Speed-Multiplikator
BattleMagesDev.isEnabled();      // true wenn Dev Mode aktiv
```

---

## Developer Panel (F9)

Drücke **F9** für ein einfaches Overlay:

- Kampfgeschwindigkeit
- Gegner auswählen
- Zauber auswählen (Slot 1)
- HP zurücksetzen
- Kampf neu starten
- Testkampf starten

Funktionalität steht im Vordergrund — keine aufwendige UI.

---

## Typische Testabläufe

### VFX testen (5-Sekunden-Workflow)

```
BattleMagesDev.previewSpell("mind_strike")
        ↓
Animation ansehen
        ↓
BattleMagesDev.resetFight()
        ↓
BattleMagesDev.previewSpell("mind_barrier")
```

Mit erhöhter Geschwindigkeit:

```javascript
BattleMagesDev.setSpeed(2);
BattleMagesDev.previewSpell("bone_fracture");
```

---

### Zauber gegen echten Gegner testen

```javascript
BattleMagesDev.setEnemy("entstellter_adept");
BattleMagesDev.replaceSpell(1, "organ_failure");
BattleMagesDev.startTestFight();
```

---

### Loadout schnell aufbauen

```javascript
BattleMagesDev.giveSpell("shield_wall");
BattleMagesDev.giveSpell("precision_strike");
BattleMagesDev.replaceSpell(1, "death_stroke");
BattleMagesDev.startTestFight();
```

---

### Nach Schaden im Kampf

```javascript
BattleMagesDev.fillHP();      // HP-Balken zurücksetzen
BattleMagesDev.resetFight();  // komplett neu starten
```

---

## Architektur

| Datei | Rolle |
|-------|-------|
| `src/dev/devConfig.js` | Feature-Flag, Dummy-Gegner, Defaults |
| `src/dev/devTimings.js` | Playback-Speed ohne Renderer-Änderung |
| `src/dev/battleMagesDev.js` | Zentrale API (`BattleMagesDev`) |
| `src/dev/devPanel.js` | F9-Panel |

**Trennung vom Spiel:**

- Keine Änderungen an Kampflogik (`battleManager`, `spellEngine`, etc.)
- Dev nutzt bestehende globale Funktionen (`showFightScreen`, `simulateFight`, …)
- Testgegner wird temporär in Slot 0 eingesetzt und per `cleanup()` wiederhergestellt
- Speed wird über bestehende Timing-Konstanten skaliert
- Normales Spiel startet weiterhin über Home → Run — Dev greift nur bei explizitem API-Aufruf ein

---

## Qualitätskontrolle

- ✓ Kein Einfluss auf normalen Spielmodus (ohne `BattleMagesDev`-Aufruf)
- ✓ Keine doppelten Codepfade in der Kampflogik
- ✓ Keine neuen Abhängigkeiten in Core-Modulen
- ✓ Erweiterbar über `src/dev/battleMagesDev.js`
- ✓ Release-tauglich via `DEV_MODE_ENABLED` oder Script-Entfernung
