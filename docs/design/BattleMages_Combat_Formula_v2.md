```
BattleMages – Combat Formula v2 Status: Approved (Spellbook v2)
Update 2026-07-23: Schild -> Magischer Widerstand (Combat Condition
Engine), Präzision als deterministische Krit-Variante ergänzt.
Details: docs/specs/combat_condition_engine_roadmap.md
```

```
DESIGNZIEL
```

```
BattleMages wird nicht um einzelne Zauber balanciert. BattleMages wird
um vollständige 5-Zauber-Rotationen balanciert.
```

```
Das Ziel ist: Vorbereiten → Verstärken → Auszahlen → Neu beginnen.
```

```
------------------------------------------------------------------------
```

## `SPIELER` 

```
Lebenspunkte: 120
```

```
Volle Heilung zwischen Kämpfen.
```

```
------------------------------------------------------------------------
```

## `KAMPFDAUER` 

```
Normale Gegner: 3–5 Rotationen
```

```
Elite: 5–7 Rotationen
```

```
Boss: 8–12 Rotationen
```

```
------------------------------------------------------------------------
```

## `UNIVERSELLE MECHANIKEN` 

```
Magischer Widerstand (Update 2026-07-23, Combat Condition Engine) -
Kein Maximum, wird nie konsumiert (Ersatz für das alte, verbrauchbare
"Schild"). - Reduziert eingehenden Schaden prozentual mit abnehmendem
Grenznutzen: reductionPercent = Widerstand / (Widerstand + 40). 40
Widerstand ergibt 50 % Reduktion, jede weitere Investition bleibt
spürbar, nähert sich 100 % aber nur asymptotisch an. - Kernmechanik
für Defensive und Offensive (Schadensskalierung über
resistanceBonusDamagePercent-Werte).
```

```
Verwundbar - Erhöht den Schaden des nächsten Schadenszaubers um 50 %. -
Wird danach entfernt. - Nicht stackbar. - Nicht verlängerbar.
```

```
Krit - Grundkritchance: 5 % - Kritischer Treffer verursacht 200 %
Schaden. - Krit wird hauptsächlich über Zauber aufgebaut.
```

```
Präzision (Update 2026-07-23, Combat Condition Engine) - Deterministische
Variante von Krit: garantierter kritischer Treffer für den nächsten
gewirkten Zauber, kein Zufall. - Ersetzt bei Zaubern ohne eigenen
Krit-Payoff die frühere reine Selbst-Kritchance ("Option B"-Muster,
siehe Roadmap-Dokument). - Technisch dieselbe Next-Spell-Prep-
Infrastruktur wie andere Vorbereitungseffekte, kein eigener State.
```

```
------------------------------------------------------------------------
```

## `SEQUENZREGEL` 

```
Sequenz prüft ausschließlich den unmittelbar vorherigen Zauber.
```

```
Keine längeren Ketten.
```

```
------------------------------------------------------------------------
```

```
“NÄCHSTER ZAUBER”-REGEL
```

```
Vorbereitungseffekte gelten ausschließlich für den nächsten gewirkten
Zauber.
```

```
Keine Buff-Leiste. Keine langfristigen Effekte.
```

```
------------------------------------------------------------------------
```

## `SCHADENSREFERENZEN` 

```
Generator: ca. 20–30 Schaden
```

```
Motor: ca. 25–40 Schaden
```

```
Build-Enabler: ca. 30–55 Schaden
```

```
Diese Bereiche dienen nur als Referenz. Der tatsächliche Wert ergibt
sich aus dem Zauberbudget.
```

```
------------------------------------------------------------------------
```

## `WIDERSTANDREFERENZEN` 

```
(Update 2026-07-23: vormals "Schildreferenzen" -- Werte anhand des
tatsächlichen migrierten Spellbooks aktualisiert.)
```

```
Kleiner Widerstand: 20
```

```
Standard: 32
```

```
Groß: 50
```

```
------------------------------------------------------------------------
```

## `ZAUBERBUDGET` 

```
Generator: Budget 10
```

```
Motor: Budget 10–12
Build-Enabler: Budget 12–15
```

```
Typische Budgetkosten:
```

```
30 Schaden = 10 32 Magischer Widerstand = 10 Verwundbar = 5 +20 %
Kritchance (nächster Zauber) = 5 Präzision / garantierter Krit
(nächster Zauber) = 8 +30 % Kritschaden (nächster Zauber) = 4 +50 %
Widerstand-Schaden = 5 +30 Schaden gegen Verwundbar = 5
```

```
------------------------------------------------------------------------
```

## `UPGRADE-SYSTEM` 

```
Rang 1 Basiszauber
```

```
Rang 2 +20 % Hauptwert
```

```
Rang 3 Spezialisierung: Der Spieler wählt einen von zwei
Entwicklungspfaden.
```

```
Rang 4 +20 % auf den gewählten Pfad.
```

```
Rang 5 Vollendung des gewählten Pfades. Der Zauber erhält seine
endgültige Build-Identität.
```

```
------------------------------------------------------------------------
```

```
ROTATION VALUE (RV)
```

```
Nicht einzelne Zauber werden verglichen, sondern komplette Rotationen.
```

```
Zielwerte:
```

```
Durchschnittlicher Build: 160–190 Schaden
```

```
Synergischer Build: 220–260 Schaden
```

```
Perfekt optimierter Build: 300–360 Schaden
```

```
Ein perfekter Build soll etwa 70–90 % mehr Rotationswert erreichen als
ein durchschnittlicher Build. Dieser Vorteil entsteht ausschließlich
durch clevere Zauberkombinationen, Reihenfolge und Upgrades – nicht
```

## `durch einzelne übermächtige Karten.` 

```
------------------------------------------------------------------------
```

## `DESIGNREGELN` 

- `Schulen liefern Fantasy, nicht Mechaniken.` 

- `Jeder Zauber besitzt genau eine Hauptrolle.` 

- `Jeder Zauber besitzt einen sofort sichtbaren Effekt.` 

- `Vorbereitungseffekte betreffen ausschließlich den nächsten Zauber. -   Tooltips bleiben kurz.` 

- `Jeder Zauber eröffnet einen Build oder verbessert einen bestehenden spürbar.` 

- `Keine Karte darf eine andere vollständig ersetzen.` 

```
------------------------------------------------------------------------
```

## `PLAYTEST-ZIEL` 

```
Nach einer Niederlage soll der Spieler denken:
```

```
“Ich probiere beim nächsten Run einen anderen Build.”
```

```
Nicht:
```

```
“Dieser Zauber ist zu schwach.”
```

```
Das Kampfsystem wird über Rotationen und Buildqualität balanciert –
nicht über Einzelzauber.
```

