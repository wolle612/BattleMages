#!/usr/bin/env python3
"""
Procedural pixel-art generator for psionic_projectile_mind_pressure_arc.

v2.0 — Animation polish only (form, palette, size unchanged).
Three simultaneous motion principles:
  1. Stable crystalline core pulse at the leading tip
  2. Outer energy layers drift with phase offset (upper / lower arc)
  3. Trail constantly rebuilds — never a static smear

8-frame narrative cycle (loops during flight):
  F1 compress → F2 core brightens → F3 lateral unfold → F4 max stability
  → F5 destabilize → F6 tail reform → F7 partial dissolve → F8 near dissolve
"""

from __future__ import annotations

import json
import math
from dataclasses import dataclass
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
OUTPUT_DIR = ROOT / "assets" / "effects" / "projectiles" / "mind_pressure_arc"

FRAME_W = 64
FRAME_H = 24
FRAME_COUNT = 8
SHEET_NAME = "mind_pressure_arc_sheet.png"
JSON_NAME = "mind_pressure_arc.json"
DURATION_MS = 200
VERSION = "2.0"

COLOR_CYAN = (57, 194, 255)
COLOR_ICE = (110, 200, 232)
COLOR_WHITE = (232, 244, 255)
COLOR_SILVER = (184, 212, 232)


@dataclass(frozen=True)
class FrameState:
    """Per-frame animation physics — outer layers move, core stays readable."""
    label: str
    compression: float       # arc height multiplier (1 = approved baseline)
    core_brightness: float   # tip / inner core intensity
    wing_spread: float       # lateral energy thickness at mid-body
    wave_phase: float        # vertical wave offset (max ±1 px)
    outer_drift: float       # upper/lower arc phase separation
    dissolution: float       # 0 = solid, 1 = nearly gone (outer layers only)
    trail_pattern: str       # rebuild key for trail geometry


# Narrative cycle — frame 4 (index 3) = maximum stability
FRAME_STATES: list[FrameState] = [
    FrameState("compress", 0.68, 0.58, 0.78, 0.0, 0.0, 0.06, "stub"),
    FrameState("core_bright", 0.74, 0.92, 0.84, 0.30, 0.18, 0.08, "rise"),
    FrameState("unfold", 0.90, 0.78, 1.22, 0.60, 0.40, 0.10, "fork"),
    FrameState("stable", 1.00, 1.00, 1.08, 0.85, 0.22, 0.03, "minimal"),
    FrameState("destabilize", 0.92, 0.88, 1.10, 1.10, 0.70, 0.20, "wave"),
    FrameState("tail_reform", 0.84, 0.80, 0.96, 1.40, 0.90, 0.26, "stagger"),
    FrameState("partial_break", 0.76, 0.72, 0.88, 1.60, 1.10, 0.42, "broken"),
    FrameState("near_dissolve", 0.68, 0.55, 0.72, 1.85, 1.30, 0.58, "wisp"),
]


def _blend(
    dst: list[tuple[int, int, int, int]],
    x: int,
    y: int,
    color: tuple[int, int, int],
    alpha: int,
) -> None:
    if not (0 <= x < FRAME_W and 0 <= y < FRAME_H) or alpha <= 0:
        return

    idx = y * FRAME_W + x
    dr, dg, db, da = dst[idx]

    if da == 0:
        dst[idx] = (color[0], color[1], color[2], alpha)
        return

    src_a = alpha / 255
    dst_a = da / 255
    out_a = src_a + dst_a * (1 - src_a)
    if out_a <= 0:
        return

    out_r = int((color[0] * src_a + dr * dst_a * (1 - src_a)) / out_a)
    out_g = int((color[1] * src_a + dg * dst_a * (1 - src_a)) / out_a)
    out_b = int((color[2] * src_a + db * dst_a * (1 - src_a)) / out_a)
    dst[idx] = (out_r, out_g, out_b, int(out_a * 255))


def _wave_offset(t: float, state: FrameState, layer_sign: float) -> float:
    """Subtle 1–2 px vertical wave — layer_sign separates upper (+) / lower (-)."""
    amp = 1.0 + state.dissolution * 0.4
    return (
        math.sin(t * math.pi * 2.2 + state.wave_phase + layer_sign * state.outer_drift)
        * amp
        * layer_sign
    )


def _arc_point(
    t: float,
    frame_index: int,
    state: FrameState,
    layer: str,
) -> tuple[float, float]:
    """Upper / lower pressure bow — same approved silhouette family."""
    t = max(0.0, min(1.0, t))
    x = 10 + t * 44

    if layer == "upper":
        base_height = 5.5 * state.compression
        wobble = math.sin(t * math.pi * 2 + frame_index * 0.35 + state.outer_drift) * 0.7
        wing = 0.0
        if 0.28 < t < 0.62:
            wing = math.sin((t - 0.28) / 0.34 * math.pi) * (state.wing_spread - 1.0) * 2.2
        y = 11 - math.sin(t * math.pi) * (base_height + wobble + wing)
        y += _wave_offset(t, state, 1.0)
    else:
        base_height = 3.2 * state.compression
        wobble = math.sin(t * math.pi * 1.5 - frame_index * 0.25 - state.outer_drift) * 0.55
        y = 13 + math.sin(t * math.pi) * (base_height + wobble)
        y += _wave_offset(t, state, -1.0)

    return x, y


def _dissolve_skip(t: float, frame_index: int, state: FrameState) -> bool:
    """Thin outer segments without breaking core readability."""
    if state.dissolution < 0.12:
        return False

    seed = math.sin(t * 17.3 + frame_index * 2.1 + state.wave_phase * 3.7)
    threshold = 0.15 + state.dissolution * 0.55

    if t > 0.78:
        return False
    if t < 0.22 and state.dissolution < 0.45:
        return False

    return seed > threshold


def _draw_trail(
    buffer: list[tuple[int, int, int, int]],
    frame_index: int,
    state: FrameState,
) -> None:
    """Trail rebuilds every frame — mental energy pulled along, never a static smear."""
    pattern = state.trail_pattern
    energy = state.core_brightness

    segments: list[tuple[int, int, int, tuple[int, int, int]]] = []

    if pattern == "stub":
        segments = [(12, 0, 22, COLOR_ICE), (10, -1, 18, COLOR_SILVER), (8, 1, 14, COLOR_ICE)]
    elif pattern == "rise":
        segments = [(13, 0, 24, COLOR_ICE), (11, -1, 20, COLOR_ICE), (9, 0, 16, COLOR_SILVER), (7, 1, 12, COLOR_ICE)]
    elif pattern == "fork":
        segments = [(14, -1, 22, COLOR_ICE), (12, 1, 20, COLOR_SILVER), (10, -1, 16, COLOR_ICE), (8, 2, 14, COLOR_ICE)]
    elif pattern == "minimal":
        segments = [(15, 0, 20, COLOR_ICE), (13, 0, 16, COLOR_SILVER)]
    elif pattern == "wave":
        segments = [(14, int(math.sin(state.wave_phase) * 1), 24, COLOR_ICE),
                    (11, int(math.sin(state.wave_phase + 1) * 1), 18, COLOR_SILVER),
                    (8, int(math.sin(state.wave_phase + 2) * 1), 14, COLOR_ICE)]
    elif pattern == "stagger":
        segments = [(13, 0, 26, COLOR_ICE), (10, -1, 20, COLOR_SILVER), (7, 1, 16, COLOR_ICE), (5, 0, 12, COLOR_ICE)]
    elif pattern == "broken":
        segments = [(14, 0, 22, COLOR_ICE), (11, -1, 16, COLOR_SILVER), (8, 1, 12, COLOR_ICE), (5, -1, 10, COLOR_ICE)]
    elif pattern == "wisp":
        segments = [(12, 0, 28, COLOR_ICE), (9, 1, 22, COLOR_SILVER), (6, -1, 16, COLOR_ICE), (4, 0, 12, COLOR_ICE), (2, 1, 8, COLOR_ICE)]

    for base_x, y_off, alpha_cap, color in segments:
        fade_base = energy * 0.30
        alpha = max(14, min(28, int(255 * fade_base * (alpha_cap / 255))))
        y = 12 + y_off + int(math.sin(base_x * 0.4 + frame_index * 0.5) * 0.5)
        _blend(buffer, base_x, y, color, alpha)
        if alpha > 16:
            _blend(buffer, base_x - 1, y, COLOR_SILVER, max(12, int(alpha * 0.55)))


def _draw_energy_facets(
    buffer: list[tuple[int, int, int, int]],
    frame_index: int,
    state: FrameState,
    lead_shift: int,
) -> None:
    """Micro-facets shift along the arc — detach and reabsorb without separate particles."""
    facet_count = 4 if state.dissolution < 0.25 else 6
    for f in range(facet_count):
        t = 0.35 + (f / max(facet_count - 1, 1)) * 0.48
        t += math.sin(state.wave_phase + f * 0.9) * 0.04
        t = max(0.2, min(0.82, t))

        x, y = _arc_point(t, frame_index, state, "upper")
        x += lead_shift

        drift = math.sin(f * 1.7 + state.wave_phase * 2 + frame_index * 0.4)
        offset_x = int(round(drift * (0.8 + state.dissolution * 1.2)))
        offset_y = int(round(math.cos(f * 1.3 + state.outer_drift) * (0.5 + state.dissolution)))

        alpha = min(200, int(180 * state.core_brightness * (0.55 + 0.45 * (1 - state.dissolution))))
        color = COLOR_WHITE if f % 2 == 0 else COLOR_CYAN

        _blend(buffer, int(round(x)) + offset_x, int(round(y)) - 2 + offset_y, color, alpha)

        if state.dissolution > 0.2 and f % 2 == 1:
            reabsorb_t = t - 0.06
            rx, ry = _arc_point(reabsorb_t, frame_index, state, "upper")
            rx += lead_shift
            _blend(buffer, int(round(rx)), int(round(ry)) - 1, COLOR_ICE, int(alpha * 0.45))


def _draw_stable_core(
    buffer: list[tuple[int, int, int, int]],
    state: FrameState,
    lead_shift: int,
) -> None:
    """Leading hex tip — always present, pulses brightness only."""
    tip_x = int(round(10 + 44 * 0.92 + lead_shift))
    tip_y = 11 + int(math.sin(state.wave_phase) * 0.5)
    bright = state.core_brightness

    core_size = 1 if bright < 0.7 else 2
    _blend(buffer, tip_x, tip_y, COLOR_WHITE, min(255, int(255 * bright)))
    _blend(buffer, tip_x + 1, tip_y, COLOR_CYAN, min(240, int(240 * bright)))
    _blend(buffer, tip_x, tip_y - 1, COLOR_ICE, min(180, int(200 * bright * 0.85)))

    if core_size > 1 and bright > 0.75:
        _blend(buffer, tip_x - 1, tip_y, COLOR_CYAN, min(200, int(220 * bright * 0.7)))
        _blend(buffer, tip_x + 1, tip_y - 1, COLOR_ICE, min(160, int(180 * bright * 0.6)))


def _draw_energy_flow(
    buffer: list[tuple[int, int, int, int]],
    frame_index: int,
    state: FrameState,
    lead_shift: int,
) -> None:
    """Traveling focus band — energy visibly working through the arc."""
    band_center = 0.22 + (frame_index / FRAME_COUNT) * 0.58
    band_width = 0.11

    steps = 36
    for i in range(steps):
        t = i / (steps - 1)
        if abs(t - band_center) > band_width:
            continue
        if t > 0.84:
            continue

        proximity = 1.0 - abs(t - band_center) / band_width
        x, y = _arc_point(t, frame_index, state, "upper")
        x += lead_shift

        alpha = min(220, int(200 * proximity * state.core_brightness))
        _blend(buffer, int(round(x)), int(round(y)) - 1, COLOR_WHITE, alpha)
        _blend(buffer, int(round(x)) + 1, int(round(y)), COLOR_CYAN, int(alpha * 0.75))


def _draw_arc_body(
    buffer: list[tuple[int, int, int, int]],
    frame_index: int,
    state: FrameState,
) -> None:
    lead_shift = int((state.core_brightness - 0.6) * 4)
    steps = 72

    for layer in ("upper", "lower"):
        step_stride = 1 if layer == "upper" else 2
        for i in range(0, steps, step_stride):
            t = i / (steps - 1)
            if _dissolve_skip(t, frame_index, state) and layer == "upper":
                continue

            x, y = _arc_point(t, frame_index, state, layer)
            x += lead_shift

            if layer == "upper":
                thickness = 2 if t < 0.35 else 3
                if t > 0.78:
                    thickness = 2
                if 0.28 < t < 0.62 and state.wing_spread > 1.05:
                    thickness += 1

                local = state.core_brightness * (0.78 + t * 0.22)
                if t > 0.72:
                    local *= 1.06

                core_alpha = min(255, int(255 * local * (1.0 - state.dissolution * 0.35)))
                if t > 0.82 and core_alpha > 150:
                    color = COLOR_WHITE
                elif t > 0.55:
                    color = COLOR_CYAN
                elif t < 0.4:
                    color = COLOR_ICE
                else:
                    color = COLOR_CYAN

                for dy in range(-thickness, thickness + 1):
                    for dx in range(-1, 2):
                        _blend(buffer, int(round(x)) + dx, int(round(y)) + dy, color, core_alpha)
            else:
                alpha = min(
                    200,
                    int(255 * state.core_brightness * 0.52 * (0.5 + t * 0.5) * (1.0 - state.dissolution * 0.4)),
                )
                _blend(buffer, int(round(x)), int(round(y)), COLOR_ICE, alpha)
                _blend(buffer, int(round(x)), int(round(y)) + 1, COLOR_SILVER, int(alpha * 0.6))

    _draw_energy_flow(buffer, frame_index, state, lead_shift)
    _draw_energy_facets(buffer, frame_index, state, lead_shift)
    _draw_stable_core(buffer, state, lead_shift)


def render_frame(index: int) -> Image.Image:
    state = FRAME_STATES[index]
    pixels: list[tuple[int, int, int, int]] = [(0, 0, 0, 0)] * (FRAME_W * FRAME_H)

    _draw_trail(pixels, index, state)
    _draw_arc_body(pixels, index, state)

    return Image.frombytes(
        "RGBA",
        (FRAME_W, FRAME_H),
        bytes(ch for px in pixels for ch in px),
    )


def build_spritesheet() -> Image.Image:
    sheet = Image.new("RGBA", (FRAME_W * FRAME_COUNT, FRAME_H), (0, 0, 0, 0))
    for i in range(FRAME_COUNT):
        sheet.paste(render_frame(i), (i * FRAME_W, 0))
    return sheet


def build_manifest() -> dict:
    frames = {}
    anim_frames = []

    for i in range(FRAME_COUNT):
        name = f"mind_pressure_arc_{i:02d}.png"
        x = i * FRAME_W
        frames[name] = {
            "frame": {"x": x, "y": 0, "w": FRAME_W, "h": FRAME_H},
            "rotated": False,
            "trimmed": False,
            "spriteSourceSize": {"x": 0, "y": 0, "w": FRAME_W, "h": FRAME_H},
            "sourceSize": {"w": FRAME_W, "h": FRAME_H},
            "anchor": {"x": 0.5, "y": 0.5},
        }
        anim_frames.append(name)

    return {
        "frames": frames,
        "animations": {"play": anim_frames},
        "meta": {
            "app": "BattleMages VFX Pipeline",
            "version": VERSION,
            "image": SHEET_NAME,
            "format": "RGBA8888",
            "size": {"w": FRAME_W * FRAME_COUNT, "h": FRAME_H},
            "scale": "1",
            "frameSize": {"w": FRAME_W, "h": FRAME_H},
            "frameCount": FRAME_COUNT,
            "styleKey": "mind_pressure_arc",
            "assetId": "psionic_projectile_mind_pressure_arc",
            "school": "dream",
            "durationMs": DURATION_MS,
            "animationNotes": (
                "v2.0 polish: compress→brighten→unfold→stable→destabilize→"
                "tail_reform→partial_break→near_dissolve"
            ),
        },
    }


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    sheet = build_spritesheet()
    sheet_path = OUTPUT_DIR / SHEET_NAME
    sheet.save(sheet_path, optimize=True)
    manifest = build_manifest()
    json_path = OUTPUT_DIR / JSON_NAME
    json_path.write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    print(f"Saved {sheet_path.relative_to(ROOT)}")
    print(f"Saved {json_path.relative_to(ROOT)}")
    print(f"psionic_projectile_mind_pressure_arc v{VERSION} complete")


if __name__ == "__main__":
    main()
