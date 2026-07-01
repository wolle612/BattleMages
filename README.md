# Battlemages

## Projektübersicht

Battlemages ist ein rundenbasiertes 1vs1 Browser-Roguelite, dessen Kern auf Build-Entscheidungen, Zauberreihenfolge und Timing basiert.

Der Spieler stellt während eines Runs eine Zauberleiste aus fünf Zaubern zusammen, verbessert diese nach jedem Kampf und ordnet sie per Drag & Drop neu an.

Das Spiel setzt bewusst auf einfache Grundmechaniken mit hoher strategischer Tiefe. Neue Systeme oder Ressourcen sollen nur eingeführt werden, wenn sie das bestehende Design eindeutig verbessern.

---

# Maßgebliche Dokumente

Vor jeder größeren Änderung müssen folgende Dokumente berücksichtigt werden:

1. **Combat Design Document**

   * Zauber
   * Balancing
   * Gegner
   * Werte
   * Kampfsystem

2. **Game Design Document**

   * Gameplay
   * UI
   * Spielablauf
   * Progression
   * Features

3. **Technical Design Document**

   * Projektstruktur
   * Architektur
   * Datenmodelle
   * Implementierungsreihenfolge

Diese Dokumente gelten als Single Source of Truth.

---

# Kernprinzipien

Battlemages basiert auf folgenden Designentscheidungen:

* 1vs1 Kämpfe
* 12 Kämpfe pro Run
* Spieler besitzt 100 HP
* Zwischen Kämpfen vollständige Heilung
* Zauberleiste mit genau 5 Zaubern
* Feste Rotation
* Keine Mana-Ressource
* Keine zusätzlichen Klassenspezifischen Ressourcen
* Normale Zauber besitzen keine Cooldowns
* Signature-Zauber besitzen eine Erholungsphase von einer Rotation
* Jede Magieschule besitzt genau einen Signature-Zauber

---

# Projektstruktur

```
docs/
    Combat_Design_Document
    Game_Design_Document
    Technical_Design_Document

assets/
    images/
    icons/
    audio/

data/
    spells.json
    enemies.json
    upgrades.json
    schools.json

src/
    game.js
    combat.js
    spellEngine.js
    enemyEngine.js
    rewardSystem.js
    dragdrop.js
    renderer.js
    ui.js
    state.js
    save.js
```

---

# Entwicklungsprinzipien

Während der Entwicklung gelten folgende Regeln:

* Gameplay-Logik niemals im Renderer implementieren.
* Alle Zauber, Gegner und Upgrades sind datengetrieben.
* Keine Magic Numbers.
* Kleine, klar getrennte Systeme bevorzugen.
* Funktionen sollen möglichst nur eine Aufgabe besitzen.
* Neue Features niemals spontan hinzufügen.
* Bestehendes Design nicht eigenständig verändern.

---

# Arbeitsweise mit Cursor

Vor jeder Implementierung:

1. Dokumente lesen.
2. Aufgabe analysieren.
3. Technischen Plan erstellen.
4. Auf Freigabe warten.
5. Erst danach Code schreiben.

Cursor soll keine neuen Spielmechaniken oder Balanceentscheidungen erfinden.

Falls Informationen fehlen, sollen Rückfragen gestellt werden.

---

# Aktueller Entwicklungsstand

## Abgeschlossen

* Spielvision
* Kampfsystem
* Zauberdesign
* Magieschulen
* Hooks
* Zauberentwicklung Rang I–V
* Gegnerkonzept
* Balancing-Grundlagen
* Combat Design
* Game Design
* Technical Design

## Nächster Meilenstein

Vertical Slice

Enthalten:

* Hauptmenü
* Start eines Runs
* Vollständiger Kampf
* Belohnungsbildschirm
* Drag & Drop der Zauberleiste
* Mehrere Gegner
* Bosskampf
* Sieg- und Niederlagenbildschirm

Erst nach einem spielbaren Vertical Slice beginnt das eigentliche Zahlen-Balancing.

---

# Langfristige Ziele

Nach dem erfolgreichen Vertical Slice folgen:

* Erweiterte Gegner
* Weitere Zauber
* Zusätzliche Bosskämpfe
* Meta-Progression
* Achievements
* Daily Runs
* Weitere Magieschulen (optional)

Der Fokus liegt zunächst vollständig auf einem hervorragend funktionierenden Kernspiel.
