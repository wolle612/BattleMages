# BattleMages – Enemy Design Document v3
**Status:** Production Ready  
**Purpose:** Master reference for enemy implementation, balancing and future content.

---

# 1. Design Philosophy

## Core Principle

Enemies do **not** exist to surprise the player.

Enemies exist to **test the player's build**.

Every encounter should answer one question:

> "Does this build solve this combat problem?"

The player should lose because of build decisions—not because of hidden mechanics or randomness.

---

# 2. Combat Goals

The enemy system follows the same philosophy as the Spellbook:

- Few mechanics
- High readability
- High strategic depth
- Predictable combat
- Build expression

Enemies should never overshadow the player's own engine.

---

# 3. Combat Structure

Every impulse:

1. Player casts the next spell in the fixed 5-slot rotation.
2. Enemy performs the next action in its visible action bar.

Both rotations loop independently.

The player never reacts manually during combat.
All strategy happens before combat through drafting, spell order and upgrades.

---

# 4. Enemy Anatomy

Every enemy contains exactly four layers.

## Passive

Permanent identity.

Example:
"Starts combat with 40 Shield."

---

## Action Bar

Visible sequence of 2–5 actions.

Normal: 2–3 actions

Elite: 4 actions

Boss: 5 actions

---

## Combat Identity

Defines what the enemy wants to accomplish.

Example:

"Punishes burst."

---

## Build Test

Defines what the player is expected to solve.

Examples:

- Vulnerable
- Shield
- Critical Hits
- Sequencing
- Sustained Damage
- Hybrid Builds

---

# 5. Difficulty Framework

## Normal

Purpose:
Teach one mechanic.

Complexity:
Low.

One build test.

---

## Elite

Purpose:
Combine two ideas.

Complexity:
Medium.

One stronger passive + longer action bar.

---

## Boss

Purpose:
Final exam.

Combines all core systems.

---

# 6. Difficulty Budget

## Early Normal

HP 120–170

Average Damage:
25–35

---

## Mid Normal

HP 200–320

Average Damage:
35–50

---

## Elite

HP 280–620

Average Damage:
35–70

---

## Boss

HP 900+

Average Damage:
35–80

---

# 7. Encounter Progression

Fight 1
Learning

Fight 2
Vulnerable

Fight 3
Critical Timing

Fight 4
Shield

Fight 5
Sequencing

Fight 6
Sustained Damage

Fight 7
Long Combat

Fight 8
Multi-hit

Fight 9
Burst Timing

Fight 10
Damage Race

Fight 11
Hybrid Builds

Fight 12
Complete Build Examination

---

# 8. Enemy Cards

## 1. Verirrter Novize

Role:
Tutorial Enemy

Combat Identity:
Simple attacker

Build Test:
Understanding rotations

HP:
120

Passive:
Instabile Magie
Every second attack gains +10 damage.

Action Bar:
1. Magic Bolt – 25 damage
2. Magic Bolt – 25 damage

Player Lesson:
Observe repeating enemy patterns.

---

## 2. Entstellter Adept

Combat Identity:
Rewards Vulnerable

Build Test:
Can the player consistently exploit Vulnerable?

HP:
150

Passive:
Biologische Anpassung
If no Vulnerable bonus was triggered since the Adept's previous action, gain 10 Shield.

Action Bar:
1. Slash – 28
2. Bone Strike – 35
3. Slash – 28

---

## 3. Schattenläufer

Combat Identity:
Anti-burst

Build Test:
Critical timing

HP:
165

Passive:
Lebender Schatten
First critical hit each combat deals 20 less damage.

Action Bar:
25 → 40 → 20+20

---

## 4. Runenketzer (Elite)

Combat Identity:
Shield Fortress

Build Test:
Shield removal

HP:
280

Passive:
Starts with 40 Shield.

Action Bar:
Shield +30
Attack 35
Attack 35
Rune Explosion 55

---

## 5. Wahnsinniges Orakel

Combat Identity:
Sequencing

Build Test:
Rotation planning

HP:
210

Passive:
After taking damage from two consecutive player spells, gain 15 Shield.

Action Bar:
30 → 45 → 30

---

## 6. Chaosgeborener

Combat Identity:
Anti-spike

Build Test:
Consistent DPS

HP:
230

Passive:
Hits above 70 damage reduce the next hit by 20 damage.

Action Bar:
35 → 55 → 35

---

## 7. Seelenhüter (Elite)

Combat Identity:
Attrition

Build Test:
Long fights

HP:
420

Passive:
Heal 40 HP every 4 impulses.

Action Bar:
35
45
Gain 35 Shield
70

---

## 8. Runenkonstrukt

Combat Identity:
Heavy Armor

Build Test:
Multiple hits

HP:
280

Passive:
Single hits cannot exceed 40 damage.

Action Bar:
Shield 25
Attack 35
Shield 25

---

## 9. Schattenbestie

Combat Identity:
Risk Management

Build Test:
When to crit

HP:
320

Passive:
After receiving a critical hit, next attack gains +20 damage.

Action Bar:
35
60
35

---

## 10. Fleischformer (Elite)

Combat Identity:
Damage Race

Build Test:
Burst window

HP:
520

Passive:
Heal 60 HP after every full player rotation.

Action Bar:
35
Heal 70
35
70

---

## 11. Der Namenlose (Elite)

Combat Identity:
Hybrid Check

Build Test:
Use multiple mechanics

HP:
620

Passive:
If the player failed to use at least two different core mechanics during the previous rotation, gain 20 Shield.

Action Bar:
40
40
Gain 35 Shield
75

---

## 12. Der Erste Erzmagier

Combat Identity:
Final Examination

Build Test:
Complete mastery

HP:
900

Passive:
Master of the Forbidden Schools

After every player rotation he cycles to the next school:

- Biomancy
- Shadow
- Psionics
- Forbidden Runes
- Chaos
- Soul Magic

Each school modifies one boss action.

Action Bar:

1. Arcane Bolt – 35
2. School Technique
3. Arcane Bolt – 35
4. School Technique
5. Grand Spell – 80

---

# 9. Enemy Creation Rules

Every future enemy must satisfy ALL of these:

- Tests exactly one gameplay concept.
- Has one readable passive.
- Has a short visible action bar.
- Never introduces a new global mechanic.
- Forces planning rather than reactions.
- Can be understood after one encounter.
- Encourages the player to rethink the build after defeat.

---

# 10. Success Criteria

The ideal player thought after losing is:

"I know why I lost."

followed by

"I can build differently."

Never:

"That enemy was unfair."

This is the defining design principle of BattleMages.
