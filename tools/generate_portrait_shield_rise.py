#!/usr/bin/env python3
"""
Procedural 8-bit portrait shield rise VFX — v3 (reference-informed).

Stylistic synthesis of reference/shield_ref1-3:
- ref1: crackling energy veins on a glowing magical barrier
- ref2: layered concave curved shield shells, bright rim, tall profile
- ref3: cyan-gold rim glow, wavy interior energy ripples, translucent core

Rendered as strict 8-bit pixel art with BattleMages gold shield palette.
"""

from __future__ import annotations

import json
import math
import random
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
OUTPUT_DIR = ROOT / "assets" / "effects" / "shield" / "portrait_shield_rise"

FRAME_SIZE = 128
FRAME_COUNT = 8
SHEET_NAME = "portrait_shield_rise_sheet.png"
JSON_NAME = "portrait_shield_rise.json"
PREVIEW_NAME = "portrait_shield_rise_preview_dark.png"

# Gold shield palette (UI #E8C547) + subtle magic-cyan rim accents (ref3)
COLOR_RIM_HI = (255, 244, 176)
COLOR_RIM_GOLD = (232, 197, 71)
COLOR_SHELL_MID = (176, 132, 42)
COLOR_SHELL_DEEP = (98, 72, 26)
COLOR_RIM_CYAN = (136, 228, 255)
COLOR_VEIN_HI = (255, 252, 220)
COLOR_VEIN_CORE = (255, 220, 108)
COLOR_VEIN_CYAN = (168, 240, 255)

RISE_PROGRESS = [0.08, 0.22, 0.36, 0.52, 0.68, 0.82, 0.93, 1.0]
FRAME_ALPHA = [150, 188, 214, 236, 255, 255, 246, 232]

VEIN_SEED = 20260716


def _blank_buffer() -> list[tuple[int, int, int, int]]:
    return [(0, 0, 0, 0)] * (FRAME_SIZE * FRAME_SIZE)


def _set_pixel(
    buffer: list[tuple[int, int, int, int]],
    x: int,
    y: int,
    color: tuple[int, int, int],
    alpha: int,
) -> None:
    if not (0 <= x < FRAME_SIZE and 0 <= y < FRAME_SIZE) or alpha <= 0:
        return

    idx = y * FRAME_SIZE + x
    existing = buffer[idx]
    src_a = alpha / 255
    dst_a = existing[3] / 255
    out_a = src_a + dst_a * (1 - src_a)

    if out_a <= 0:
        return

    out_r = int((color[0] * src_a + existing[0] * dst_a * (1 - src_a)) / out_a)
    out_g = int((color[1] * src_a + existing[1] * dst_a * (1 - src_a)) / out_a)
    out_b = int((color[2] * src_a + existing[2] * dst_a * (1 - src_a)) / out_a)
    buffer[idx] = (out_r, out_g, out_b, int(out_a * 255))


def _smoothstep(value: float) -> float:
    return value * value * (3 - 2 * value)


def _height_norm(y: float) -> float:
    return max(0.0, min(1.0, (116 - y) / 108))


def _left_outer_x(y: float) -> float:
    t = _height_norm(y)
    bow = math.sin(t * math.pi) * 12
    taper = (1 - t) ** 1.45
    return 20 - bow + taper * 6


def _left_mid_x(y: float) -> float:
    return _left_outer_x(y) + 3.2


def _left_inner_x(y: float) -> float:
    t = _height_norm(y)
    concave = math.sin(t * math.pi) ** 1.25 * 16
    tip_pull = (1 - t) ** 2.0 * 12
    return 38 + concave - tip_pull + t * 10


def _right_outer_x(y: float) -> float:
    return FRAME_SIZE - _left_outer_x(y)


def _right_mid_x(y: float) -> float:
    return FRAME_SIZE - _left_mid_x(y)


def _right_inner_x(y: float) -> float:
    return FRAME_SIZE - _left_inner_x(y)


def _point_on_left_shell(y: float, layer: int) -> float:
    if layer == 0:
        return _left_outer_x(y)
    if layer == 1:
        return _left_mid_x(y)
    return _left_inner_x(y)


def _point_on_right_shell(y: float, layer: int) -> float:
    if layer == 0:
        return _right_outer_x(y)
    if layer == 1:
        return _right_mid_x(y)
    return _right_inner_x(y)


def _shell_color(layer: int, edge: bool) -> tuple[tuple[int, int, int], int]:
    if layer == 0:
        return (COLOR_RIM_CYAN if edge else COLOR_RIM_HI, 255 if edge else 230)
    if layer == 1:
        return (COLOR_RIM_GOLD, 205)
    return (COLOR_SHELL_MID, 165)


def _build_energy_veins() -> list[list[tuple[int, int]]]:
    rng = random.Random(VEIN_SEED)
    veins: list[list[tuple[int, int]]] = []

    for side in ("left", "right"):
        for _ in range(10):
            y = rng.randint(104, 112)
            points: list[tuple[int, int]] = []

            while y > 18:
                if side == "left":
                    base_x = _left_inner_x(y)
                    x = int(base_x + rng.randint(0, 4))
                else:
                    base_x = _right_inner_x(y)
                    x = int(base_x - rng.randint(0, 4))

                points.append((x, int(y)))
                y -= rng.randint(2, 5)

                if rng.random() < 0.28:
                    x += 1 if side == "left" else -1
                    points.append((x, int(y)))

            if len(points) >= 4:
                veins.append(points)

    return veins


ENERGY_VEINS = _build_energy_veins()


def _build_wave_ripples() -> list[tuple[int, int, int, int]]:
    ripples: list[tuple[int, int, int, int]] = []

    for side_sign in (-1, 1):
        for wave_index in range(4):
            phase = wave_index * 1.4
            for y in range(24, 110, 2):
                t = _height_norm(y)
                center = 64 + side_sign * (18 + math.sin(t * math.pi) * 8 + wave_index * 2)
                x = int(center + math.sin(y * 0.22 + phase) * (2 + wave_index * 0.4))
                ripples.append((x, y, wave_index, side_sign))

    return ripples


WAVE_RIPPLES = _build_wave_ripples()


def _draw_shell_layers(
    buffer: list[tuple[int, int, int, int]],
    progress: float,
    alpha_scale: int,
    rise_y: float,
) -> None:
    for y in range(int(rise_y), 118):
        t = _height_norm(y)

        if y < 18 and abs(64 - 64) < 8:
            continue

        if y < 22 and abs(64) > 0:
            gap = 11 - (22 - y) * 0.45
            # open top between tips
            pass

        for layer in range(3):
            color, shade_alpha = _shell_color(layer, edge=(layer == 0))
            alpha = int(alpha_scale * shade_alpha / 255)

            lx = int(round(_point_on_left_shell(y, layer)))
            rx = int(round(_point_on_right_shell(y, layer)))

            _set_pixel(buffer, lx, y, color, alpha)
            _set_pixel(buffer, lx + 1, y, color, int(alpha * 0.82))
            _set_pixel(buffer, rx, y, color, alpha)
            _set_pixel(buffer, rx - 1, y, color, int(alpha * 0.82))

            if layer == 0:
                _set_pixel(buffer, lx - 1, y, COLOR_RIM_CYAN, int(alpha * 0.55))
                _set_pixel(buffer, rx + 1, y, COLOR_RIM_CYAN, int(alpha * 0.55))

        if y >= 110 and t < 0.08:
            for x in range(int(_left_inner_x(y)), int(_right_inner_x(y)) + 1):
                arch = math.sin((x - 44) / 40 * math.pi)
                if arch > 0.1:
                    _set_pixel(buffer, x, y, COLOR_RIM_GOLD, int(alpha_scale * arch * 0.7))


def _draw_tip_arcs(
    buffer: list[tuple[int, int, int, int]],
    progress: float,
    alpha_scale: int,
) -> None:
    if progress < 0.58:
        return

    left_tip = [(24, 12), (25, 10), (26, 9), (27, 8), (28, 9), (29, 10), (30, 12)]
    right_tip = [(98, 12), (99, 10), (100, 8), (101, 9), (102, 10), (103, 12)]

    for x, y in left_tip + right_tip:
        _set_pixel(buffer, x, y, COLOR_RIM_HI, alpha_scale)
        _set_pixel(buffer, x, y + 1, COLOR_RIM_GOLD, int(alpha_scale * 0.72))

    for x, y in [(27, 8), (101, 8)]:
        _set_pixel(buffer, x, y - 1, COLOR_RIM_CYAN, int(alpha_scale * 0.85))


def _draw_energy_veins(
    buffer: list[tuple[int, int, int, int]],
    frame_index: int,
    progress: float,
    alpha_scale: int,
    rise_y: float,
) -> None:
    if progress < 0.34:
        return

    flicker = frame_index % 3

    for vein_index, vein in enumerate(ENERGY_VEINS):
        if vein_index % 3 == flicker:
            continue

        for point_index, (x, y) in enumerate(vein):
            if y < rise_y:
                continue

            pulse = (point_index + frame_index + vein_index) % 4
            if pulse == 0:
                color, alpha = COLOR_VEIN_HI, 255
            elif pulse == 1:
                color, alpha = COLOR_VEIN_CORE, 220
            elif pulse == 2:
                color, alpha = COLOR_VEIN_CYAN, 185
            else:
                color, alpha = COLOR_SHELL_DEEP, 130

            _set_pixel(buffer, x, y, color, int(alpha_scale * alpha / 255))


def _draw_wave_ripples(
    buffer: list[tuple[int, int, int, int]],
    frame_index: int,
    progress: float,
    alpha_scale: int,
    rise_y: float,
) -> None:
    if progress < 0.46:
        return

    for x, y, wave_index, side_sign in WAVE_RIPPLES:
        if y < rise_y:
            continue

        if (x + frame_index + wave_index) % 5 == 0:
            color = COLOR_VEIN_CYAN if (frame_index + wave_index) % 2 == 0 else COLOR_VEIN_HI
            _set_pixel(buffer, x, y, color, int(alpha_scale * 0.75))


def _draw_inner_fade(
    buffer: list[tuple[int, int, int, int]],
    progress: float,
    alpha_scale: int,
    rise_y: float,
) -> None:
    if progress < 0.5:
        return

    for y in range(int(rise_y), 112, 3):
        left = int(_left_inner_x(y))
        right = int(_right_inner_x(y))
        span = right - left

        if span < 10:
            continue

        for step in range(1, 4):
            alpha = int(alpha_scale * (0.22 - step * 0.05))
            if alpha <= 0:
                continue

            _set_pixel(buffer, left + step, y, COLOR_SHELL_DEEP, alpha)
            _set_pixel(buffer, right - step, y, COLOR_SHELL_DEEP, alpha)


def render_frame(frame_index: int) -> Image.Image:
    buffer = _blank_buffer()
    progress = RISE_PROGRESS[frame_index]
    alpha_scale = FRAME_ALPHA[frame_index]
    rise_y = 116 - (116 - 8) * progress

    _draw_shell_layers(buffer, progress, alpha_scale, rise_y)
    _draw_inner_fade(buffer, progress, alpha_scale, rise_y)
    _draw_wave_ripples(buffer, frame_index, progress, alpha_scale, rise_y)
    _draw_energy_veins(buffer, frame_index, progress, alpha_scale, rise_y)
    _draw_tip_arcs(buffer, progress, alpha_scale)

    return Image.frombytes(
        "RGBA",
        (FRAME_SIZE, FRAME_SIZE),
        bytes(channel for px in buffer for channel in px),
    )


def build_spritesheet() -> Image.Image:
    sheet = Image.new("RGBA", (FRAME_SIZE * FRAME_COUNT, FRAME_SIZE), (0, 0, 0, 0))

    for index in range(FRAME_COUNT):
        sheet.paste(render_frame(index), (index * FRAME_SIZE, 0))

    return sheet


def build_preview(sheet: Image.Image) -> Image.Image:
    preview = Image.new("RGBA", (FRAME_SIZE * 2, FRAME_SIZE * 2), (26, 31, 46, 255))
    frame = sheet.crop(((FRAME_COUNT - 1) * FRAME_SIZE, 0, FRAME_COUNT * FRAME_SIZE, FRAME_SIZE))
    scaled = frame.resize((FRAME_SIZE * 2, FRAME_SIZE * 2), Image.NEAREST)
    preview.paste(scaled, (0, 0), scaled)
    return preview


def build_manifest() -> dict:
    frames = {}
    anim_frames = []

    for index in range(FRAME_COUNT):
        name = f"portrait_shield_rise_{index:02d}.png"
        x = index * FRAME_SIZE
        frames[name] = {
            "frame": {"x": x, "y": 0, "w": FRAME_SIZE, "h": FRAME_SIZE},
            "rotated": False,
            "trimmed": False,
            "spriteSourceSize": {"x": 0, "y": 0, "w": FRAME_SIZE, "h": FRAME_SIZE},
            "sourceSize": {"w": FRAME_SIZE, "h": FRAME_SIZE},
            "anchor": {"x": 0.5, "y": 0.5},
        }
        anim_frames.append(name)

    return {
        "frames": frames,
        "animations": {"play": anim_frames},
        "meta": {
            "app": "BattleMages VFX Pipeline",
            "version": "3.0",
            "image": SHEET_NAME,
            "format": "RGBA8888",
            "size": {"w": FRAME_SIZE * FRAME_COUNT, "h": FRAME_SIZE},
            "scale": "1",
            "frameSize": FRAME_SIZE,
            "frameCount": FRAME_COUNT,
            "styleKey": "portrait_shield_rise",
            "assetId": "portrait_shield_rise",
            "category": "shield",
            "durationMs": 640,
            "reference": "reference/shield_ref1.jpg, shield_ref2.jpg, shield_ref3.png",
            "animationNotes": "layered concave magic shell; rim glow, energy veins, wave ripples",
        },
    }


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    sheet = build_spritesheet()
    sheet_path = OUTPUT_DIR / SHEET_NAME
    sheet.save(sheet_path, optimize=True)

    preview = build_preview(sheet)
    preview_path = OUTPUT_DIR / PREVIEW_NAME
    preview.save(preview_path, optimize=True)

    manifest = build_manifest()
    json_path = OUTPUT_DIR / JSON_NAME
    json_path.write_text(json.dumps(manifest, indent=2), encoding="utf-8")

    print(f"Saved {sheet_path.relative_to(ROOT)}")
    print(f"Saved {preview_path.relative_to(ROOT)}")
    print(f"Saved {json_path.relative_to(ROOT)}")
    print("portrait_shield_rise v3.0 complete")


if __name__ == "__main__":
    main()
