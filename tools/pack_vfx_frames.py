#!/usr/bin/env python3
"""Pack N discrete, equal-size VFX frame PNGs into a school sprite sheet.

Counterpart to tools/generate_school_vfx_manifests.py's geometric strip
slicer, for frames that already come pre-separated (e.g. from PixelLab's
animate_image, which returns one PNG per frame instead of a single
continuous strip). Since the frames are already discrete, this tool does
a plain grid pack -- no alpha-band guessing, no strip-boundary bleed.

Writes both the sprite sheet PNG and its PixiJS TexturePacker-style JSON
manifest directly (same schema as the existing school sheets), so the
result is a drop-in replacement for a *_Cast.png/.json,
*_Explosion.png/.json or *_Impact.png/.json pair under assets/effects/.

Usage:
  py tools/pack_vfx_frames.py <frames_dir> <out_png> <out_json> \
      <style_key> <school> <category> <duration_ms>

<frames_dir> must contain frame_0.png, frame_1.png, ... in play order,
all the same size (as returned by animate_image: index 0 is the input
frame, the rest are generated).
"""
from __future__ import annotations

import argparse
import json
from pathlib import Path

from PIL import Image


def pack_frames(
    frames_dir: Path,
    out_png: Path,
    out_json: Path,
    style_key: str,
    school: str,
    category: str,
    duration_ms: int,
) -> float:
    frame_files = sorted(
        frames_dir.glob("frame_*.png"), key=lambda p: int(p.stem.split("_")[1])
    )
    if not frame_files:
        raise FileNotFoundError(f"No frame_*.png files found in {frames_dir}")

    images = [Image.open(f).convert("RGBA") for f in frame_files]
    count = len(images)
    width, height = images[0].size
    for image in images:
        if image.size != (width, height):
            raise ValueError(f"frame size mismatch: {image.size} vs {(width, height)}")

    sheet = Image.new("RGBA", (width * count, height), (0, 0, 0, 0))
    frames_meta = {}
    animation = []
    for index, image in enumerate(images):
        x = index * width
        sheet.paste(image, (x, 0))
        name = f"{style_key}_{index:02d}.png"
        frames_meta[name] = {
            "frame": {"x": x, "y": 0, "w": width, "h": height},
            "rotated": False,
            "trimmed": False,
            "spriteSourceSize": {"x": 0, "y": 0, "w": width, "h": height},
            "sourceSize": {"w": width, "h": height},
            "anchor": {"x": 0.5, "y": 0.5},
        }
        animation.append(name)

    out_png.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(out_png, optimize=True)

    animation_speed = round(count * 1000 / (60 * duration_ms), 4)

    manifest = {
        "frames": frames_meta,
        "animations": {"play": animation},
        "meta": {
            "app": "BattleMages VFX Pipeline",
            "version": "1.0",
            "image": out_png.name,
            "format": "RGBA8888",
            "size": {"w": width * count, "h": height},
            "scale": "1",
            "frameSize": {"w": width, "h": height},
            "frameCount": count,
            "styleKey": style_key,
            "school": school,
            "category": category,
            "durationMs": duration_ms,
        },
    }
    out_json.write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    return animation_speed


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("frames_dir", type=Path)
    parser.add_argument("out_png", type=Path)
    parser.add_argument("out_json", type=Path)
    parser.add_argument("style_key")
    parser.add_argument("school")
    parser.add_argument("category")
    parser.add_argument("duration_ms", type=int)
    args = parser.parse_args()

    animation_speed = pack_frames(
        args.frames_dir,
        args.out_png,
        args.out_json,
        args.style_key,
        args.school,
        args.category,
        args.duration_ms,
    )
    print(f"Packed -> {args.out_png}, {args.out_json}")
    print(f"animationSpeed={animation_speed}  (paste into data/vfx/schoolVfxAssets.js)")


if __name__ == "__main__":
    main()
