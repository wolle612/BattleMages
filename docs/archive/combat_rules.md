# Battlemages – Combat Rules

Version: 1.0

Status: Final

> **STATUS: SUPERSEDED (Archiv)** — Alte Spec aus einem früheren Sprint, nicht
> im Runtime-Pfad. Maßgeblich: `docs/design/BattleMages_Combat_Formula_v2.md`.
> Siehe `docs/specs/architecture_design_audit_2026-07-21.md`.

---

# Zweck

Dieses Dokument definiert sämtliche globalen Kampfregeln.

Es beschreibt ausschließlich die Mechanik des Kampfs.

Keine Schule darf eigene Grundregeln einführen.

Alle Zauber greifen auf diese Regeln zurück.

---

# Kampfrhythmus

Ein Kampf besteht aus einzelnen Impulsen.

Ein Impuls beschreibt genau eine ausgeführte Aktion.

Beispiele:

- Spieler wirkt Zauber
- Gegner greift an
- Status löst aus
- Echo löst aus

Jeder Impuls wird vollständig abgeschlossen,
bevor der nächste beginnt.

---

# Reihenfolge eines Impulses

Jeder Impuls wird immer in derselben Reihenfolge abgearbeitet.

1.
Aktiver Zauber bestimmen

↓

2.
Kosten bezahlen

↓

3.
Direkte Effekte ausführen

↓

4.
Schaden berechnen

↓

5.
Schilde berücksichtigen

↓

6.
HP verändern

↓

7.
Status anwenden

↓

8.
Folgeeffekte auslösen

↓

9.
Kampflog erzeugen

↓

10.
Renderer aktualisieren

Diese Reihenfolge darf nicht verändert werden.

---

# Rotation

Die Rotation bestimmt die Reihenfolge der Zauber.

Sie basiert auf:

rotationOrder

Nach dem letzten Zauber beginnt die Rotation erneut.

Signature-Zauber überspringen ihre nächste Rotation,
falls ihr Cooldown aktiv ist.

---

# Rotation verändern

Zauber dürfen rotationOrder verändern.

Dabei gelten folgende Regeln:

- Änderungen wirken sofort.
- Die Actionbar aktualisiert sich unmittelbar.
- Die neue Reihenfolge bleibt bestehen,
bis sie erneut verändert wird.

---

# Schaden

Schaden besitzt folgende Reihenfolge:

1.
Schadensbonus

↓

2.
Schilddurchdringung

↓

3.
Schild

↓

4.
Leben

Schaden kann niemals negativ werden.

---

# Schild

Schild absorbiert Schaden,
bevor HP verloren gehen.

Schild kann maximal bis zum aktuellen Schildwert verbraucht werden.

Überschüssiger Schaden trifft anschließend HP.

Mehrere Schilde addieren sich.

---

# Heilung

Heilung kann HP niemals über das Maximum erhöhen.

Überschüssige Heilung verfällt.

---

# Buffs

Buffs besitzen:

- Auslöser
- Wirkung
- Dauer

Ein Buff endet sofort,
wenn seine Dauer abgelaufen ist.

Mehrere unterschiedliche Buffs können gleichzeitig aktiv sein.

Ob identische Buffs stapelbar sind,
entscheidet der jeweilige Buff.

---

# Debuffs

Debuffs folgen denselben Regeln wie Buffs.

Die Definition erfolgt zentral
in status_effects.md.

---

# Hybridkombination

Eine Hybridkombination entsteht,
wenn zwei unmittelbar aufeinanderfolgende Zauber
unterschiedlicher Schulen angehören.

Beispiel:

Blood → Rune

Rune → Dream

Star → Blood

Nicht:

Blood → Blood

---

# Runenkombination

Eine Runenkombination entsteht,
wenn zwei Runenzauber direkt hintereinander ausgeführt werden.

---

# Timing-Effekt

Ein Timing-Effekt ist eine temporäre Vorbereitung.

Es kann immer nur
ein aktiver Timing-Effekt existieren.

Ein Timing-Effekt wird normalerweise
beim nächsten passenden Sternenzauber verbraucht.

---

# Echo

Echo wiederholt einen Zauber automatisch.

Regeln:

- wirkt nach dem ursprünglichen Zauber
- verursacht standardmäßig 50 % Wirkung
- kann keine weiteren Echo-Effekte erzeugen
- löst keine Endlosschleifen aus

Echo übernimmt:

- Schaden
- Schild
- Status

sofern der jeweilige Zauber dies erlaubt.

---

# Momentum

Momentum besitzt Werte von

0 bis 5.

Momentum:

- bleibt bis Kampfende erhalten
- kann erhöht werden
- kann vollständig verbraucht werden

Momentum besitzt keine eigene Anzeige außerhalb des Statusbereichs.

---

# Wunde

Wunde ist ein globaler Debuff.

Die genaue Wirkung wird
in status_effects.md definiert.

Zauber dürfen ausschließlich prüfen:

enemy.hasStatus("wound")

Nicht:

eigene Wundensysteme.

---

# Trigger

Effekte werden immer vollständig abgearbeitet,
bevor der nächste Trigger beginnt.

Es gibt keine parallelen Trigger.

---

# Priorität

Falls mehrere Effekte gleichzeitig ausgelöst werden:

1.
aktiver Zauber

↓

2.
direkte Effekte

↓

3.
Status

↓

4.
Folgeeffekte

↓

5.
Renderer

---

# Renderer

Der Renderer berechnet niemals Gameplay.

Er liest ausschließlich den Combat Context.

Alle Animationen basieren auf:

actionQueue

Nicht auf eigener Logik.

---

# Gegner

Gegner folgen denselben Regeln
wie Spieler.

Sie besitzen:

- HP
- Schild
- Status
- Zauber
- Cooldowns
- Trigger

Es existieren keine Sonderregeln
nur für Gegner.

---

# Determinismus

Ein identischer Kampf
mit identischen Eingaben
muss immer dasselbe Ergebnis liefern.

Zufall darf ausschließlich dort eingesetzt werden,
wo dies explizit durch Design vorgesehen ist.

---

# Erweiterbarkeit

Neue Schulen,
Zauber,
Gegner
und Bossmechaniken

dürfen keine Änderungen
an diesen Grundregeln erfordern.

Neue Inhalte bauen ausschließlich
auf den hier definierten Regeln auf.