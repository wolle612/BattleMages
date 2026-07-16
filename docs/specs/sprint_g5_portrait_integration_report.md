# Sprint G5 — Portrait Integration

**Status:** Abgeschlossen  
**Datum:** Juli 2026  
**Scope:** Portrait-Pfade, Rendering, Fallback — keine Gameplay-Änderungen

---

## 1. Geänderte Dateien

| Datei | Änderung |
|-------|----------|
| `src/portraitRegistry.js` | Datengetriebene Profile, Pfadauflösung, Fallback bei Ladefehler |
| `src/renderer.js` | `renderCombatantPortrait` nutzt `getCombatantPortraitSources` + `data-portrait-fallback` |
| `style.css` | `object-fit: contain`, zentrierte Darstellung |

**Unverändert:** Gameplay, Gegnerwerte, Zauber, Icons, Tooltips, HTML-Struktur.

**Assets (vom Nutzer bereitgestellt, nicht geändert):**

- `assets/portraits/player/player.png`
- `assets/portraits/enemies/enemy.png`

---

## 2. Portraitpfad-Erzeugung

Alle Pfade laufen über `PORTRAIT_PROFILES` in `portraitRegistry.js`:

```javascript
// Spieler
assets/portraits/player/player.png

// Gegner (primär)
assets/portraits/enemies/{entityId}.png
// entityId = enemy.id aus den Gegnerdaten
```

Ablauf:

1. Renderer ruft `getCombatantPortraitSources(type, entityId)` auf.
2. `getPortraitProfile(type)` liefert das Profil (`player`, `enemy`, …).
3. `resolvePortraitId(profile, entityId)` ermittelt die Datei-ID:
   - **Spieler:** fest `portraitId: "player"` — `entityId` wird ignoriert.
   - **Gegner:** `portraitIdFromEntity: true` → `entityId` (= `enemy.id`).
4. `buildPortraitPath(directory, portraitId)` → `{directory}/{portraitId}.png`.

Kampfaufrufe im Renderer:

- Spieler: `renderCombatantPortrait("player")`
- Gegner: `renderCombatantPortrait("enemy", viewModel.enemy.id)`

---

## 3. Fallback-Verhalten

| Schritt | Verhalten |
|---------|-----------|
| **1. Primär laden** | `<img src="…/{enemy.id}.png">` |
| **2. Fehler (`error`)** | Wenn `data-portrait-fallback` gesetzt → `src` auf `…/enemy.png` |
| **3. Fallback fehlgeschlagen** | Bild entfernt, Slot erhält `--placeholder` (leerer Rahmen) |
| **4. Bereits geladen, 0×0** | `error`-Event manuell auslösen → gleiche Kette |

Spieler haben keinen separaten Fallback (Primärpfad ist immer `player.png`).

Gegner-Fallback ist im Profil definiert:

```javascript
fallbackPortraitId: "enemy"
```

→ `assets/portraits/enemies/enemy.png`

Das Spiel wirft keinen Fehler bei fehlenden Dateien; schlimmstenfalls bleibt der Platzhalter-Rahmen sichtbar.

---

## 4. Neue Gegner-Portraits

**Ja.** Für einen individuellen Gegner genügt:

```
assets/portraits/enemies/{enemy.id}.png
```

Beispiel: Gegner mit `id: "schattenlaeufer"` → `assets/portraits/enemies/schattenlaeufer.png`.

- Existiert die Datei → sie wird angezeigt.
- Fehlt sie → automatisch `enemy.png`.
- **Kein Code-Change** im Renderer oder Registry nötig.

Vorbereitete Profile für spätere Erweiterungen (noch nicht im Renderer verwendet):

| Typ | Verzeichnis | Fallback-ID |
|-----|-------------|-------------|
| `boss` | `assets/portraits/enemies/` | `enemy` |
| `npc` | `assets/portraits/npcs/` | `npc` |
| `event` | `assets/portraits/events/` | `event` |

Neue Typen: Profil in `PORTRAIT_PROFILES` ergänzen, im Renderer `renderCombatantPortrait("npc", entity.id)` aufrufen.

---

## 5. Keine Hardcodes / Namensprüfungen

Bestätigt:

- **Keine** Prüfung von Gegnernamen (`enemy.name`).
- **Keine** `switch`-Statements.
- **Keine** Sonderfälle pro Gegner-ID.
- Pfadlogik ausschließlich über **Typ-Profil** + **`entityId`** aus Daten.

---

## CSS-Darstellung

```css
.combatant-portrait-image {
    object-fit: contain;
    object-position: center center;
}
```

Portraits sind vollständig sichtbar, nicht verzerrt, zentriert und füllen den Slot optimal innerhalb des Rahmens.
