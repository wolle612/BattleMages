"""Generate Pixi spritesheet manifest for mind_pressure_projectile_sheet.png (6 frames)."""

from __future__ import annotations

import json
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
ASSET_DIR = ROOT / "assets" / "effects" / "projectiles" / "mind_pressure_arc"
SHEET_NAME = "mind_pressure_projectile_sheet.png"
JSON_NAME = "mind_pressure_projectile.json"
FRAME_COUNT = 6
VERSION = "1.0"


def build_manifest(frame_w: int, frame_h: int, sheet_w: int, sheet_h: int) -> dict:
    frames = {}
    anim_frames = []

    for index in range(FRAME_COUNT):
        name = f"mind_pressure_projectile_{index:02d}.png"
        x = index * frame_w
        frames[name] = {
            "frame": {"x": x, "y": 0, "w": frame_w, "h": frame_h},
            "rotated": False,
            "trimmed": False,
            "spriteSourceSize": {"x": 0, "y": 0, "w": frame_w, "h": frame_h},
            "sourceSize": {"w": frame_w, "h": frame_h},
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
            "size": {"w": sheet_w, "h": sheet_h},
            "scale": "1",
            "frameSize": {"w": frame_w, "h": frame_h},
            "frameCount": FRAME_COUNT,
            "styleKey": "mind_pressure_arc",
            "assetId": "psionic_projectile_mind_pressure_projectile",
            "school": "dream",
            "durationMs": 180,
            "animationNotes": (
                "6-frame agile psionic bolt cycle for Gedankenschlag flight"
            ),
        },
    }


def main() -> None:
    sheet_path = ASSET_DIR / SHEET_NAME
    if not sheet_path.exists():
        raise SystemExit(f"Missing sheet: {sheet_path}")

    with Image.open(sheet_path) as sheet:
        sheet_w, sheet_h = sheet.size

    if sheet_w % FRAME_COUNT != 0:
        raise SystemExit(
            f"Sheet width {sheet_w} is not divisible by {FRAME_COUNT} frames"
        )

    frame_w = sheet_w // FRAME_COUNT
    frame_h = sheet_h
    manifest = build_manifest(frame_w, frame_h, sheet_w, sheet_h)
    json_path = ASSET_DIR / JSON_NAME
    json_path.write_text(json.dumps(manifest, indent=2), encoding="utf-8")

    print(f"Saved {json_path.relative_to(ROOT)}")
    print(f"Frame size: {frame_w}x{frame_h}, frames: {FRAME_COUNT}")

    sync_script = ROOT / "tools" / "sync_vfx_manifests_js.py"
    if sync_script.exists():
        import subprocess
        import sys

        subprocess.run([sys.executable, str(sync_script)], check=True)


if __name__ == "__main__":
    main()
