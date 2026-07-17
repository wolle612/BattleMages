# Reward System v2

Kurze Spec für Belohnungs-Slots nach Kampf. Zahlen im Code (`src/rewardSystem.js`) sind Source of Truth.

## Slot-Generierung

- Immer bis zu **3 Slots** (soweit Pools hergeben).
- Pro Slot Typ würfeln: **55 % Upgrade / 45 % Neuer Zauber**, wenn beide Pools nicht leer; sonst den verfügbaren Typ.
- **Soft-Guarantee** (nur Initial-Generierung, nicht beim Reroll):
  - Mindestens 1 Upgrade, wenn Upgrade-Pool > 0
  - Mindestens 1 Neuer Zauber, wenn Neu-Pool > 0
- Duplikate (gleiche Spell-ID in der Anzeige) werden ausgeschlossen.
- Upgrade kann `path_choice` sein (Rang 2 → 3).

## Reroll

- **1× pro Slot** pro Belohnungsbildschirm.
- Würfelt den **Typ neu** (gleiche 55/45-Logik).
- Soft-Guarantee gilt **nicht** für Rerolls.
- Fallback: gewünschter Typ leer → anderer Typ; beide leer → Option behalten.

## Schule-Affinität

- Schulen im aktuellen Build zählen.
- Multiplier **1.5×**, wenn der angebotene Zauber eine Schule aus dem Build teilt.
- Bestehende Shadow/Wound-Dependency-Gewichte bleiben.

## Start-Rang neuer Zauber

Maximal **Rang 2** (kein Pfad-Drop).

| fightIndex | Rang 1 | Rang 2 |
|------------|--------|--------|
| 0–2 | 95 % | 5 % |
| 3–6 | 80 % | 20 % |
| 7+ | 60 % | 40 % |

Neue Optionen tragen `startRank`; `initializeSpellProgress(spellId, startRank)` setzt den Rang.

## Seltenheit (unverändert)

Rarity-Gewichte skalieren weiter über `REWARD_RARITY_WEIGHTS_BY_PROGRESS` mit dem Fight-Index.
