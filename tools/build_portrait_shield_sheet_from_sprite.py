#!/usr/bin/env python3
"""
Build portrait_shield_rise sprite sheet from the final shield source sprite.

Takes assets/effects/shield/sprite.png and produces an 8-frame bottom-up
build animation for portrait shield overlay integration.
"""

from __future__ import annotations

import json
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SOURCE_PATH = ROOT / "assets" / "effects" / "shield" / "sprite.png"
OUTPUT_DIR = ROOT / "assets" / "effects" / "shield" / "portrait_shield_rise"

FRAME_SIZE = 128
FRAME_COUNT = 8
SHEET_NAME = "portrait_shield_rise_sheet.png"
JSON_NAME = "portrait_shield_rise.json"
PREVIEW_NAME = "portrait_shield_rise_preview_dark.png"

RISE_PROGRESS = [0.08, 0.22, 0.36, 0.52, 0.68, 0.82, 0.93, 1.0]
FRAME_ALPHA = [140, 175, 205, 230, 255, 255, 248, 238]


def load_source_frame() -> Image.Image:
    if not SOURCE_PATH.exists():
        raise FileNotFoundError(f"Missing source sprite: {SOURCE_PATH}")

    source = Image.open(SOURCE_PATH).convert("RGBA")

    if source.size != (FRAME_SIZE, FRAME_SIZE):
        source = source.resize((FRAME_SIZE, FRAME_SIZE), Image.NEAREST)

    return source


def render_build_frame(source: Image.Image, frame_index: int) -> Image.Image:
    progress = RISE_PROGRESS[frame_index]
    alpha_scale = FRAME_ALPHA[frame_index]
    rise_y = int(FRAME_SIZE * (1 - progress))

    frame = Image.new("RGBA", (FRAME_SIZE, FRAME_SIZE), (0, 0, 0, 0))
    src_pixels = source.load()
    out_pixels = frame.load()

    for y in range(FRAME_SIZE):
        if y < rise_y:
            continue

        edge_band = y - rise_y <= 6
        row_strength = 1.0

        if edge_band and progress < 1.0:
            row_strength = 0.55 + (y - rise_y) / 6 * 0.45

        for x in range(FRAME_SIZE):
            red, green, blue, alpha = src_pixels[x, y]

            if alpha <= 0:
                continue

            strength = row_strength * alpha_scale / 255
            out_alpha = int(alpha * strength)

            if out_alpha <= 0:
                continue

            out_pixels[x, y] = (red, green, blue, out_alpha)

    return frame


def build_spritesheet(source: Image.Image) -> Image.Image:
    sheet = Image.new("RGBA", (FRAME_SIZE * FRAME_COUNT, FRAME_SIZE), (0, 0, 0, 0))

    for index in range(FRAME_COUNT):
        frame = render_build_frame(source, index)
        sheet.paste(frame, (index * FRAME_SIZE, 0))

    return sheet


def build_preview(sheet: Image.Image) -> Image.Image:
    preview = Image.new("RGBA", (FRAME_SIZE * 2, FRAME_SIZE * 2), (26, 31, 46, 255))
    final_frame = sheet.crop(
        ((FRAME_COUNT - 1) * FRAME_SIZE, 0, FRAME_COUNT * FRAME_SIZE, FRAME_SIZE)
    )
    scaled = final_frame.resize((FRAME_SIZE * 2, FRAME_SIZE * 2), Image.NEAREST)
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
            "version": "4.0",
            "image": SHEET_NAME,
            "format": "RGBA8888",
            "size": {"w": FRAME_SIZE * FRAME_COUNT, "h": FRAME_SIZE},
            "scale": "1",
            "frameSize": FRAME_SIZE,
            "frameCount": FRAME_COUNT,
            "styleKey": "portrait_shield_rise",
            "assetId": "portrait_shield_rise",
            "category": "shield",
            "sourceSprite": "assets/effects/shield/sprite.png",
            "durationMs": 640,
            "animationNotes": "bottom-up build from final runic green shield sprite",
        },
    }


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    source = load_source_frame()
    sheet = build_spritesheet(source)

    sheet_path = OUTPUT_DIR / SHEET_NAME
    sheet.save(sheet_path, optimize=True)

    preview = build_preview(sheet)
    preview_path = OUTPUT_DIR / PREVIEW_NAME
    preview.save(preview_path, optimize=True)

    manifest = build_manifest()
    json_path = OUTPUT_DIR / JSON_NAME
    json_path.write_text(json.dumps(manifest, indent=2), encoding="utf-8")

    print(f"Source: {SOURCE_PATH.relative_to(ROOT)} ({source.size[0]}x{source.size[1]} -> {FRAME_SIZE}x{FRAME_SIZE})")
    print(f"Saved {sheet_path.relative_to(ROOT)}")
    print(f"Saved {preview_path.relative_to(ROOT)}")
    print(f"Saved {json_path.relative_to(ROOT)}")
    print("portrait_shield_rise v4.0 sheet build complete")


if __name__ == "__main__":
    main()
