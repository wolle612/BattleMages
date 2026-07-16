"""Generate the PixiJS manifest for the six-frame psionic cast sheet."""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ASSET_DIR = ROOT / "assets" / "effects" / "cast"
SHEET_NAME = "psionic_cast_mind_focus_hex.png"
JSON_NAME = "psionic_cast_mind_focus_hex.json"
FRAME_COUNT = 6
SOURCE_FRAME_WIDTH = 256

# The supplied sheet uses a 256x1024 canvas per frame. The visible cast
# animation occupies the same 256x190 region in every frame. Cropping only
# via manifest keeps the PNG untouched while retaining stable frame anchors.
CROP_Y = 390
CROP_HEIGHT = 190


def build_manifest() -> dict:
    frames = {}
    animation = []

    for index in range(FRAME_COUNT):
        name = f"psionic_cast_mind_focus_hex_{index:02d}.png"
        frames[name] = {
            "frame": {
                "x": index * SOURCE_FRAME_WIDTH,
                "y": CROP_Y,
                "w": SOURCE_FRAME_WIDTH,
                "h": CROP_HEIGHT,
            },
            "rotated": False,
            "trimmed": False,
            "spriteSourceSize": {
                "x": 0,
                "y": 0,
                "w": SOURCE_FRAME_WIDTH,
                "h": CROP_HEIGHT,
            },
            "sourceSize": {"w": SOURCE_FRAME_WIDTH, "h": CROP_HEIGHT},
            "anchor": {"x": 0.5, "y": 0.5},
        }
        animation.append(name)

    return {
        "frames": frames,
        "animations": {"play": animation},
        "meta": {
            "app": "BattleMages VFX Pipeline",
            "version": "1.0",
            "image": SHEET_NAME,
            "format": "RGBA8888",
            "size": {"w": SOURCE_FRAME_WIDTH * FRAME_COUNT, "h": 1024},
            "scale": "1",
            "frameSize": {"w": SOURCE_FRAME_WIDTH, "h": CROP_HEIGHT},
            "frameCount": FRAME_COUNT,
            "styleKey": "psionic_cast_mind_focus_hex",
            "assetId": "psionic_cast_mind_focus_hex",
            "school": "dream",
            "durationMs": 120,
            "animationNotes": (
                "focus → hex lattice ignition → core charge → "
                "stabilise → release → directed discharge"
            ),
        },
    }


def main() -> None:
    sheet_path = ASSET_DIR / SHEET_NAME

    if not sheet_path.exists():
        raise SystemExit(f"Missing sheet: {sheet_path}")

    manifest_path = ASSET_DIR / JSON_NAME
    manifest_path.write_text(
        json.dumps(build_manifest(), indent=2),
        encoding="utf-8",
    )

    print(f"Saved {manifest_path.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
