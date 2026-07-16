#!/usr/bin/env python3
"""
Procedural pixel-art generator for mind_ring_burst v2 (Psionik impact VFX).

Art-polish pass: organic ring edge, subtle inner psionic geometry,
thickness evolution, frame-4 peak, dissolution in frames 7-8.
"""

from __future__ import annotations

import json
import math
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
OUTPUT_DIR = ROOT / "assets" / "effects" / "impact" / "mind_ring_burst"

FRAME_SIZE = 96
FRAME_COUNT = 8
SHEET_NAME = "mind_ring_burst_sheet.png"
JSON_NAME = "mind_ring_burst.json"

COLOR_CYAN = (57, 194, 255)
COLOR_ICE = (110, 200, 232)
COLOR_WHITE = (232, 244, 255)
COLOR_SILVER = (184, 212, 232)

# Expansion unchanged from v1
RING_OUTER_RADIUS = [8, 14, 20, 26, 32, 38, 42, 44]

# Thickness evolution: frames 1-3 strong, 4-5 peak mass, 6-8 thinning
RING_THICKNESS = [4, 5, 5, 6, 5, 3, 2, 1]

# Frame 4 (index 3) = visual peak brightness
FRAME_ALPHA = [165, 225, 245, 255, 245, 180, 90, 30]

# Dissolution gaps (degrees) for frames 7-8 (indices 6-7)
DISSOLVE_GAPS = {
    6: [(25, 48), (142, 162), (258, 278)],
    7: [(10, 35), (70, 95), (160, 188), (230, 255), (300, 328)],
}

CENTER = FRAME_SIZE // 2
PEAK_FRAME_INDEX = 3  # 1-based frame 4


def _blend(
    dst: list[tuple[int, int, int, int]],
    x: int,
    y: int,
    color: tuple[int, int, int],
    alpha: int,
) -> None:
    if not (0 <= x < FRAME_SIZE and 0 <= y < FRAME_SIZE) or alpha <= 0:
        return

    idx = y * FRAME_SIZE + x
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


def _angle_in_gap(angle_deg: float, gaps: list[tuple[int, int]]) -> bool:
    angle = angle_deg % 360
    for start, end in gaps:
        if start <= angle <= end:
            return True
    return False


def _organic_radius_offset(angle_deg: float, frame_index: int) -> float:
    """Subtle psionic irregularity — not a perfect UI circle."""
    rad = math.radians(angle_deg)
    phase = frame_index * 0.35
    return (
        math.sin(rad * 3 + phase) * 0.75
        + math.sin(rad * 5 - phase * 0.6) * 0.45
        + math.sin(rad * 7 + 1.1) * 0.3
    )


def _hex_corner_boost(angle_deg: float) -> float:
    """Six-fold symmetry hint for psionic geometry."""
    nearest_hex = round(angle_deg / 60) * 60
    delta = abs((angle_deg - nearest_hex + 180) % 360 - 180)
    if delta < 4:
        return 1.18
    if delta < 8:
        return 1.06
    return 1.0


def _draw_inner_psionic_field(
    buffer: list[tuple[int, int, int, int]],
    frame_index: int,
    outer_r: float,
    alpha_factor: int,
) -> None:
    """Very subtle inner geometry — visible only on close inspection."""
    if outer_r < 12 or alpha_factor < 70:
        return

    inner_strength = alpha_factor / 255
    if frame_index >= 6:
        inner_strength *= 0.45
    elif frame_index == PEAK_FRAME_INDEX:
        inner_strength *= 1.05

    base_alpha = int(24 * inner_strength)
    if base_alpha < 18:
        return

    max_inner = max(4, int(outer_r * 0.55))

    # Fine concentric psionic lines
    for ring_frac in (0.22, 0.34, 0.46):
        r = max_inner * ring_frac
        for angle_step in range(0, 360, 4):
            rad = math.radians(angle_step)
            x = CENTER + int(round(r * math.cos(rad)))
            y = CENTER + int(round(r * math.sin(rad)))
            if math.hypot(x - CENTER, y - CENTER) > max_inner:
                continue
            _blend(buffer, x, y, COLOR_SILVER, max(22, base_alpha))

    # Hexagon segment spokes (not a filled hex — only edge hints)
    hex_r = max_inner * 0.72
    for corner in range(6):
        angle = corner * 60 - 30
        rad = math.radians(angle)
        steps = int(hex_r)
        for step in range(2, steps, 2):
            x = CENTER + int(round(step * math.cos(rad)))
            y = CENTER + int(round(step * math.sin(rad)))
            if step < 4:
                continue
            _blend(buffer, x, y, COLOR_ICE, max(24, base_alpha + 2))

    # Hex corner vertices — crystalline junctions
    for corner in range(6):
        angle = corner * 60 - 30
        rad = math.radians(angle)
        vx = CENTER + int(round(hex_r * math.cos(rad)))
        vy = CENTER + int(round(hex_r * math.sin(rad)))
        _blend(buffer, vx, vy, COLOR_CYAN, max(28, base_alpha + 6))
        _blend(buffer, vx + 1, vy, COLOR_ICE, max(22, base_alpha + 2))

    # Tiny crystal refraction ticks between hex corners
    for corner in range(6):
        mid_angle = corner * 60
        rad = math.radians(mid_angle)
        tick_r = hex_r * 0.55
        tx = CENTER + int(round(tick_r * math.cos(rad)))
        ty = CENTER + int(round(tick_r * math.sin(rad)))
        _blend(buffer, tx, ty, COLOR_WHITE, max(20, int(base_alpha * 0.9)))
        _blend(buffer, tx, ty + 1, COLOR_ICE, max(18, int(base_alpha * 0.65)))


def _draw_dissolve_fragments(
    buffer: list[tuple[int, int, int, int]],
    frame_index: int,
    outer_r: float,
    alpha_factor: int,
) -> None:
    """Frames 7-8: energy breaks apart — not scale-only fade."""
    if frame_index < 6:
        return

    gaps = DISSOLVE_GAPS.get(frame_index, [])
    fragment_alpha = int(alpha_factor * 0.55)

    for gap_start, gap_end in gaps:
        mid_angle = (gap_start + gap_end) / 2
        rad = math.radians(mid_angle)
        for dist in (outer_r + 1, outer_r + 2):
            fx = CENTER + int(round(dist * math.cos(rad)))
            fy = CENTER + int(round(dist * math.sin(rad)))
            _blend(buffer, fx, fy, COLOR_CYAN, fragment_alpha)
            _blend(buffer, fx + 1, fy, COLOR_ICE, int(fragment_alpha * 0.7))

        # Small inward crystal shard at gap edge
        shard_r = outer_r - 1
        sx = CENTER + int(round(shard_r * math.cos(rad)))
        sy = CENTER + int(round(shard_r * math.sin(rad)))
        _blend(buffer, sx, sy, COLOR_WHITE, int(fragment_alpha * 0.65))

    if frame_index == 7:
        # Residual micro-fragments at hex corners
        for corner in range(6):
            angle = corner * 60
            rad = math.radians(angle)
            px = CENTER + int(round((outer_r + 2) * math.cos(rad)))
            py = CENTER + int(round((outer_r + 2) * math.sin(rad)))
            _blend(buffer, px, py, COLOR_ICE, int(fragment_alpha * 0.45))


def _plot_ring_pixels(
    buffer: list[tuple[int, int, int, int]],
    frame_index: int,
    outer_r: float,
    thickness: int,
    alpha_factor: int,
) -> None:
    gaps = DISSOLVE_GAPS.get(frame_index, [])
    peak_boost = 1.14 if frame_index == PEAK_FRAME_INDEX else 1.0
    outer_r_base = outer_r

    for angle_step in range(360):
        if gaps and _angle_in_gap(angle_step, gaps):
            continue

        wobble = _organic_radius_offset(angle_step, frame_index)
        local_outer = outer_r_base + wobble
        outer_r_int = int(round(local_outer))
        inner_r_int = max(1, int(round(local_outer - thickness)))

        hex_boost = _hex_corner_boost(angle_step)
        local_alpha = min(255, int(alpha_factor * hex_boost * peak_boost))

        rad = math.radians(angle_step)
        cos_a = math.cos(rad)
        sin_a = math.sin(rad)

        for ring_r in range(inner_r_int, outer_r_int + 1):
            x = CENTER + int(round(ring_r * cos_a))
            y = CENTER + int(round(ring_r * sin_a))
            dist = math.hypot(x - CENTER, y - CENTER)

            if dist < inner_r_int - 0.6 or dist > outer_r_int + 0.6:
                continue

            edge_boost = 1.0
            if abs(dist - outer_r_int) < 0.65:
                edge_boost = 1.22 if frame_index == PEAK_FRAME_INDEX else 1.14
            if abs(dist - inner_r_int) < 0.55:
                edge_boost = max(edge_boost, 1.08)

            color = COLOR_CYAN
            if ring_r == outer_r_int and local_alpha > 170:
                if frame_index == PEAK_FRAME_INDEX and angle_step % 18 == 0:
                    color = COLOR_WHITE
                elif angle_step % 30 == 0:
                    color = COLOR_WHITE
            elif ring_r <= inner_r_int + 1:
                color = COLOR_ICE

            pixel_alpha = min(255, int(local_alpha * edge_boost))
            _blend(buffer, x, y, color, pixel_alpha)

        # Crystalline facet ticks on outer edge (psionic, not generic circle)
        if alpha_factor > 100 and angle_step % 12 == 0:
            facet_x = CENTER + int(round((outer_r_int + 1) * cos_a))
            facet_y = CENTER + int(round((outer_r_int + 1) * sin_a))
            _blend(buffer, facet_x, facet_y, COLOR_ICE, int(local_alpha * 0.32))


def render_frame(index: int) -> Image.Image:
    pixels: list[tuple[int, int, int, int]] = [(0, 0, 0, 0)] * (FRAME_SIZE * FRAME_SIZE)

    outer_r = RING_OUTER_RADIUS[index]
    thickness = RING_THICKNESS[index]
    alpha = FRAME_ALPHA[index]

    _draw_inner_psionic_field(pixels, index, outer_r, alpha)
    _plot_ring_pixels(pixels, index, outer_r, thickness, alpha)
    _draw_dissolve_fragments(pixels, index, outer_r, alpha)

    return Image.frombytes(
        "RGBA",
        (FRAME_SIZE, FRAME_SIZE),
        bytes(channel for px in pixels for channel in px),
    )


def build_spritesheet() -> Image.Image:
    sheet = Image.new("RGBA", (FRAME_SIZE * FRAME_COUNT, FRAME_SIZE), (0, 0, 0, 0))
    for i in range(FRAME_COUNT):
        sheet.paste(render_frame(i), (i * FRAME_SIZE, 0))
    return sheet


def build_manifest() -> dict:
    frames = {}
    anim_frames = []

    for i in range(FRAME_COUNT):
        name = f"mind_ring_burst_{i:02d}.png"
        x = i * FRAME_SIZE
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
            "version": "2.0",
            "image": SHEET_NAME,
            "format": "RGBA8888",
            "size": {"w": FRAME_SIZE * FRAME_COUNT, "h": FRAME_SIZE},
            "scale": "1",
            "frameSize": FRAME_SIZE,
            "frameCount": FRAME_COUNT,
            "styleKey": "mind_ring_burst",
            "school": "dream",
            "durationMs": 140,
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
    print("mind_ring_burst v2.0 art-polish complete")


if __name__ == "__main__":
    main()
