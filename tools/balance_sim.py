#!/usr/bin/env python3
"""Simplified combat simulator mirroring BattleMages impulse combat."""

import json
import math
import random
import re
from copy import deepcopy
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

PLAYER_HP = 120
BASE_CRIT = 0.05
CRIT_MULT = 2.0
VULN_MULT = 1.5

STARTERS = {
    "bone_fracture": {"damage": 30, "effects": ["deal_damage", "apply_vulnerable"], "school": "blood", "type": "Attack"},
    "organ_failure": {"damage": 30, "effects": ["deal_damage", "apply_vulnerable"], "school": "blood", "type": "Attack", "apply_vuln_if_vuln": True},
    "precision_strike": {"damage": 40, "vulnerable_bonus": 40, "effects": ["deal_damage"], "school": "shadow", "type": "Attack"},
    "shield_wall": {"shield": 30, "effects": ["gain_shield"], "school": "rune", "type": "Protection"},
    "shield_breaker": {"effects": ["deal_shield_damage"], "school": "rune", "type": "Attack", "consume_shield": True},
    "dark_blade": {"damage": 30, "crit_chance_bonus": 0.20, "effects": ["deal_damage"], "school": "shadow", "type": "Attack"},
    "shadow_grasp": {"damage": 20, "next_crit": True, "effects": ["deal_damage", "grant_next_spell_prep"], "school": "shadow", "type": "Attack"},
    "death_stroke": {"damage": 45, "crit_flat": 50, "effects": ["deal_damage"], "school": "shadow", "type": "Attack"},
    "rune_harmony": {"damage": 30, "crit_shield": 20, "effects": ["deal_damage"], "school": "rune", "type": "Attack"},
    "shadow_dance": {"damage": 25, "seq_after_attack": 2, "effects": ["deal_damage"], "school": "shadow", "type": "Attack"},
    "arcane_chain": {"damage": 35, "seq_diff_school": 35, "effects": ["deal_damage"], "school": "dream", "type": "Attack"},
    "purity": {"damage": 35, "seq_same_school": 35, "effects": ["deal_damage"], "school": "rune", "type": "Attack"},
}

ARCHETYPE_BUILDS = {
    "verwundbar": ["bone_fracture", "precision_strike", "organ_failure"],
    "schild": ["shield_wall", "shield_wall", "shield_breaker"],
    "krit": ["shadow_grasp", "death_stroke", "dark_blade"],
    "hybrid": ["bone_fracture", "arcane_chain", "dark_blade"],
    "sequenz": ["dark_blade", "shadow_dance", "purity"],
    "burst": ["bone_fracture", "precision_strike", "death_stroke"],
}

ENEMY_DATA = [
    {"id": "verirrter_novize", "hp": 120, "enc": 1, "tier": "Normal",
     "passive": {"every_nth_action": 2, "bonus": 10},
     "actions": [{"dmg": 25}, {"dmg": 25}]},
    {"id": "entstellter_adept", "hp": 150, "enc": 2, "tier": "Normal",
     "passive": {"no_vuln_shield": 10},
     "actions": [{"dmg": 28}, {"dmg": 35}, {"dmg": 28}]},
    {"id": "schattenlaeufer", "hp": 165, "enc": 3, "tier": "Normal",
     "passive": {"first_crit_reduce": 20},
     "actions": [{"dmg": 25}, {"dmg": 40}, {"dmg": 20, "hits": 2}]},
    {"id": "runenketzer", "hp": 280, "enc": 4, "tier": "Elite",
     "passive": {"start_shield": 40},
     "actions": [{"shield": 30}, {"dmg": 35}, {"dmg": 35}, {"dmg": 55}]},
    {"id": "wahnsinniges_orakel", "hp": 210, "enc": 5, "tier": "Normal",
     "passive": {"consec_dmg_shield": 15},
     "actions": [{"dmg": 30}, {"dmg": 45}, {"dmg": 30}]},
    {"id": "chaosgeborener", "hp": 230, "enc": 6, "tier": "Normal",
     "passive": {"anti_spike": 70, "penalty": 20},
     "actions": [{"dmg": 35}, {"dmg": 55}, {"dmg": 35}]},
    {"id": "seelenhueter", "hp": 420, "enc": 7, "tier": "Elite",
     "passive": {"heal_every": 4, "heal": 40},
     "actions": [{"dmg": 35}, {"dmg": 45}, {"shield": 35}, {"dmg": 70}]},
    {"id": "runenkonstrukt", "hp": 280, "enc": 8, "tier": "Normal",
     "passive": {"damage_cap": 40},
     "actions": [{"shield": 25}, {"dmg": 35}, {"shield": 25}]},
    {"id": "schattenbestie", "hp": 320, "enc": 9, "tier": "Normal",
     "passive": {"after_crit_bonus": 20},
     "actions": [{"dmg": 35}, {"dmg": 60}, {"dmg": 35}]},
    {"id": "fleischformer", "hp": 520, "enc": 10, "tier": "Elite",
     "passive": {"heal_after_rotation": 60},
     "actions": [{"dmg": 35}, {"heal": 70}, {"dmg": 35}, {"dmg": 70}]},
    {"id": "der_namenlose", "hp": 620, "enc": 11, "tier": "Elite",
     "passive": {"min_mechanics_shield": 20},
     "actions": [{"dmg": 40}, {"dmg": 40}, {"shield": 35}, {"dmg": 75}]},
    {"id": "erster_erzmagier", "hp": 900, "enc": 12, "tier": "Boss",
     "passive": {"boss": True},
     "actions": [{"dmg": 35}, {"dmg": 40}, {"dmg": 35}, {"dmg": 40}, {"dmg": 80}]},
]


def load_enemies_from_js():
    text = (ROOT / "data" / "enemies.js").read_text(encoding="utf-8")
    m = re.search(r"const rawEnemyDefinitions = (\[[\s\S]*?\]);", text)
    if m:
        return json.loads(m.group(1))
    return None


def parse_action_bar(enemy):
    actions = []
    for action in enemy.get("actionBar", []):
        dmg = 0
        shield = 0
        heal = 0
        hits = 1
        for eff in action.get("effects", []):
            if eff.get("id") == "deal_damage" and eff.get("target") == "player":
                dmg = eff.get("amount", 0)
                hits = eff.get("hitCount", 1)
            elif eff.get("id") == "gain_shield" and eff.get("target") == "enemy":
                shield = eff.get("amount", 0)
            elif eff.get("id") == "heal" and eff.get("target") == "enemy":
                heal = eff.get("amount", 0)
        if action.get("actionType") == "school_technique":
            avg = 38
            actions.append({"dmg": avg})
        else:
            actions.append({"dmg": dmg, "shield": shield, "heal": heal, "hits": hits})
    return actions


def is_attack(spell):
    return spell.get("type") == "Attack" or "deal_damage" in spell.get("effects", [])


def matches_sequence(context, spell):
    last = context.get("last_spell")
    if not last:
        return False
    if spell.get("seq_after_attack"):
        return is_attack(last)
    if spell.get("seq_diff_school"):
        return last.get("school") != spell.get("school")
    if spell.get("seq_same_school"):
        return last.get("school") == spell.get("school")
    return False


def roll_crit(cast):
    if cast.get("guaranteed_crit"):
        return True
    chance = BASE_CRIT + cast.get("crit_chance_bonus", 0)
    return random.random() < chance


def apply_player_shield(shield, dmg):
    if shield <= 0 or dmg <= 0:
        return shield, dmg
    absorbed = min(shield, dmg)
    return shield - absorbed, dmg - absorbed


def apply_enemy_shield(enemy_shield, dmg):
    if enemy_shield <= 0 or dmg <= 0:
        return enemy_shield, dmg
    blocked = min(enemy_shield, dmg)
    return enemy_shield - blocked, dmg - blocked


def cast_spell(context, spell_id):
    spell = deepcopy(STARTERS[spell_id])
    cast = {"crit_chance_bonus": spell.get("crit_chance_bonus", 0), "guaranteed_crit": False}
    s = context

    if s.get("next_crit"):
        cast["guaranteed_crit"] = True
        s["next_crit"] = False

    if spell.get("effects") == ["gain_shield"]:
        gain = spell.get("shield", 0)
        s["player_shield"] += gain
        s["mechanics"]["shield"] = True
        s["last_spell"] = spell
        return

    if spell.get("consume_shield"):
        dmg = s["player_shield"]
        es, dmg = apply_enemy_shield(s["enemy_shield"], dmg)
        s["enemy_shield"] = es
        s["enemy_hp"] -= apply_cap(s, dmg)
        s["player_shield"] = 0
        s["mechanics"]["shield"] = True
        s["last_spell"] = spell
        return

    hit_count = spell.get("seq_after_attack", 1) if matches_sequence(s, spell) else 1
    if hit_count > 1:
        s["mechanics"]["sequence"] = True

    enemy_vuln = s["enemy_vulnerable"]

    for hit in range(hit_count):
        dmg = spell.get("damage", 0)
        if spell.get("seq_diff_school") and matches_sequence(s, spell):
            dmg += spell["seq_diff_school"]
            s["mechanics"]["sequence"] = True
        if spell.get("seq_same_school") and matches_sequence(s, spell):
            dmg += spell["seq_same_school"]
            s["mechanics"]["sequence"] = True
        if enemy_vuln and spell.get("vulnerable_bonus"):
            dmg += spell["vulnerable_bonus"]
        if enemy_vuln:
            dmg = math.floor(dmg * VULN_MULT)
            s["vuln_bonus_applied"] = True
            enemy_vuln = False
            s["enemy_vulnerable"] = False

        is_crit = roll_crit(cast)
        if is_crit:
            dmg = math.floor(dmg * CRIT_MULT) + spell.get("crit_flat", 0)
            s["mechanics"]["crit"] = True
            if s.get("first_crit_reduce") and not s.get("first_crit_done"):
                dmg = max(0, dmg - s["first_crit_reduce"])
                s["first_crit_done"] = True
            if spell.get("crit_shield") and is_crit:
                s["player_shield"] += spell["crit_shield"]
                s["mechanics"]["shield"] = True

        es, final = apply_enemy_shield(s["enemy_shield"], dmg)
        s["enemy_shield"] = es
        final = apply_cap(s, final)
        if s.get("next_penalty"):
            final = max(0, final - s["next_penalty"])
            s["next_penalty"] = 0
        s["enemy_hp"] -= final
        if final > 0:
            s["consec_player_dmg"] += 1
        threshold = s.get("anti_spike")
        if threshold is not None and final > threshold:
            s["next_penalty"] = s.get("anti_penalty", 0)

    if "apply_vulnerable" in spell.get("effects", []):
        if not spell.get("apply_vuln_if_vuln") or s.get("vuln_bonus_applied"):
            s["enemy_vulnerable"] = True
            s["mechanics"]["vulnerable"] = True

    if spell.get("next_crit"):
        s["next_crit"] = True

    s["last_spell"] = spell
    s["vuln_bonus_applied"] = False


def apply_cap(s, dmg):
    cap = s.get("damage_cap")
    if cap is not None:
        return min(dmg, cap)
    return dmg


def enemy_impulse(s, enemy, action_idx):
    e = enemy
    runtime = s
    action = e["actions"][action_idx % len(e["actions"])]

    p = e.get("passive", {})
    if p.get("every_nth_action") and runtime["action_count"] % p["every_nth_action"] == 0:
        bonus = p.get("bonus", 0)
    else:
        bonus = 0

    if p.get("no_vuln_shield") and not runtime.get("vuln_since_action"):
        runtime["enemy_shield"] += p["no_vuln_shield"]

    if p.get("consec_dmg_shield") and runtime["consec_player_dmg"] >= 2:
        runtime["enemy_shield"] += p["consec_dmg_shield"]
        runtime["consec_player_dmg"] = 0

    if action.get("shield"):
        runtime["enemy_shield"] += action["shield"]
    if action.get("heal"):
        runtime["enemy_hp"] = min(e["hp"], runtime["enemy_hp"] + action["heal"])

    hits = action.get("hits", 1)
    base_dmg = action.get("dmg", 0) + bonus
    if runtime.get("pending_attack_bonus"):
        base_dmg += runtime["pending_attack_bonus"]
        runtime["pending_attack_bonus"] = 0

    for _ in range(hits):
        ps, taken = apply_player_shield(runtime["player_shield"], base_dmg)
        runtime["player_shield"] = ps
        runtime["player_hp"] -= taken
        if runtime.get("after_crit_bonus") and runtime.get("player_crit_taken"):
            runtime["pending_attack_bonus"] = runtime["after_crit_bonus"]
            runtime["player_crit_taken"] = False

    runtime["action_count"] += 1
    runtime["impulse_count"] += 1
    runtime["vuln_since_action"] = False

    if p.get("heal_every") and runtime["impulse_count"] % p["heal_every"] == 0:
        runtime["enemy_hp"] = min(e["hp"], runtime["enemy_hp"] + p["heal"])

    runtime["consec_player_dmg"] = 0


def simulate_fight(enemy, rotation, seed=None):
    if seed is not None:
        random.seed(seed)

    s = {
        "player_hp": PLAYER_HP,
        "player_shield": 0,
        "enemy_hp": enemy["hp"],
        "enemy_shield": enemy.get("passive", {}).get("start_shield", 0),
        "enemy_vulnerable": False,
        "last_spell": None,
        "next_crit": False,
        "action_count": 0,
        "impulse_count": 0,
        "consec_player_dmg": 0,
        "mechanics": {"vulnerable": False, "shield": False, "crit": False, "sequence": False},
        "first_crit_reduce": enemy.get("passive", {}).get("first_crit_reduce"),
        "first_crit_done": False,
        "damage_cap": enemy.get("passive", {}).get("damage_cap"),
        "anti_spike": enemy.get("passive", {}).get("anti_spike"),
        "anti_penalty": enemy.get("passive", {}).get("penalty", 0),
        "next_penalty": 0,
        "after_crit_bonus": enemy.get("passive", {}).get("after_crit_bonus"),
        "pending_attack_bonus": 0,
        "player_crit_taken": False,
        "vuln_since_action": False,
        "rounds": 0,
    }

    action_idx = 0
    max_rounds = 50

    while s["player_hp"] > 0 and s["enemy_hp"] > 0 and s["rounds"] < max_rounds:
        s["rounds"] += 1
        s["mechanics"] = {"vulnerable": False, "shield": False, "crit": False, "sequence": False}

        for spell_id in rotation:
            if s["enemy_hp"] <= 0 or s["player_hp"] <= 0:
                break
            cast_spell(s, spell_id)
            if s.get("vuln_bonus_applied"):
                s["vuln_since_action"] = True
            if s["enemy_hp"] <= 0 or s["player_hp"] <= 0:
                break
            enemy_impulse(s, enemy, action_idx)
            action_idx += 1

        p = enemy.get("passive", {})
        if p.get("heal_after_rotation"):
            s["enemy_hp"] = min(enemy["hp"], s["enemy_hp"] + p["heal_after_rotation"])
        if p.get("min_mechanics_shield"):
            count = sum(1 for v in s["mechanics"].values() if v)
            if count < 2:
                s["enemy_shield"] += p["min_mechanics_shield"]

    return {
        "victory": s["player_hp"] > 0 and s["enemy_hp"] <= 0,
        "rounds": s["rounds"],
        "player_hp": max(0, s["player_hp"]),
        "player_shield": s["player_shield"],
    }


def run_archetype_matrix(trials=200):
    results = {}
    for arch, rotation in ARCHETYPE_BUILDS.items():
        results[arch] = {}
        for enemy in ENEMY_DATA:
            wins = 0
            rounds = []
            for t in range(trials):
                r = simulate_fight(enemy, rotation, seed=t * 997 + hash(arch) % 1000)
                if r["victory"]:
                    wins += 1
                rounds.append(r["rounds"])
            results[arch][enemy["id"]] = {
                "win_rate": wins / trials,
                "avg_rounds": sum(rounds) / len(rounds),
                "enc": enemy["enc"],
                "tier": enemy["tier"],
            }
    return results


def enemy_dps_per_rotation(enemy):
    total = 0
    for action in enemy["actions"]:
        total += action.get("dmg", 0) * action.get("hits", 1)
    n = len(enemy["actions"])
    passive = enemy.get("passive", {})
    bonus = 0
    if passive.get("every_nth_action"):
        bonus = passive.get("bonus", 0) * (n // passive["every_nth_action"])
    return (total + bonus) / n * n


def main():
    random.seed(42)
    matrix = run_archetype_matrix(300)

    print("=== ARCHETYPE WIN RATES (starter 3-spell, no upgrades) ===")
    for arch, fights in matrix.items():
        print(f"\n{arch.upper()}:")
        for eid, data in sorted(fights.items(), key=lambda x: x[1]["enc"]):
            flag = "!" if data["win_rate"] < 0.5 else " "
            print(f"  {flag} E{data['enc']:2d} {eid:22s} win={data['win_rate']:.0%} avg_rounds={data['avg_rounds']:.1f}")

    print("\n=== ENEMY INCOMING DPS (3-spell rotation, rough) ===")
    for enemy in ENEMY_DATA:
        dps = enemy_dps_per_rotation(enemy)
        print(f"  E{enemy['enc']:2d} {enemy['id']:22s} ~{dps:.0f} dmg/rotation impulses={len(enemy['actions'])}")

    print("\n=== FIGHT 1 WORST CASE (3x dark_blade, no synergy) ===")
    worst = simulate_fight(ENEMY_DATA[0], ["dark_blade", "dark_blade", "dark_blade"], seed=1)
    print(worst)

    print("\n=== SHIELD BUILD FIGHT 4 (Runenketzer) ===")
    shield = simulate_fight(ENEMY_DATA[3], ARCHETYPE_BUILDS["schild"], seed=1)
    print(shield)


if __name__ == "__main__":
    main()
