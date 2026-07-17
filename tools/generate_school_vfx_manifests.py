"""Generate PixiJS spritesheet manifests + preset data for the per-school VFX sheets.

Each school has one sheet per VFX category (cast / beam / cut / explosion / impact).
The sheets are uniform film-strips (one row for casts, one column for the rest).
This tool slices every sheet into uniform frame cells along the strip axis and trims
the cross axis to the shared content bounding box, so that:

  * every frame of the sprite animation is captured (no dropped/first-only frame),
  * all frames of one sheet share the same rect size (smooth, no scale pulsing),
  * the drawn content is centered on the anchor.

Outputs (regenerate any time the sheets change):
  * <sheet>.json  next to every PNG  (PixiJS spritesheet manifest)
  * data/vfx/schoolVfxAssets.js       (VFX_SCHOOL_SHEET_PRESETS + manifest list)

Run:  py tools/generate_school_vfx_manifests.py
"""

from __future__ import annotations

import json
import os
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]

# School id (internal legacy id, see data/combatIdentity.js COMBAT_SCHOOLS) -> sheet
# name prefix used by the art pipeline (asset file names, NEW naming scheme).
SCHOOL_PREFIX = {
    "blood": "Biomancy",
    "shadow": "Shadow",
    "dream": "Psionic",
    "rune": "Rune",
    "star": "Chaos",
    "primal": "Soul",
}

# Legacy school id -> canonical VFX school id (NEW naming scheme, lowercase). This is
# the ONLY place the legacy ids (blood/dream/star/primal) are translated. Every
# generated styleKey/meta.school below uses the NEW id, so the legacy ids never leak
# into the VFX layer (presets, manifests, effectManager.js).
SCHOOL_VFX_ID = {
    "blood": "biomancy",
    "shadow": "shadow",
    "dream": "psionic",
    "rune": "rune",
    "star": "chaos",
    "primal": "soul",
}

# Frame counts per sheet. Determined by alpha band analysis + visual confirmation
# (see tools/_frame_probe.py). These describe the ASSET, not any single spell.
FRAME_COUNTS = {
    "cast": {"blood": 6, "shadow": 6, "dream": 6, "rune": 6, "star": 6, "primal": 6},
    "beam": {"blood": 6, "shadow": 7, "dream": 7, "rune": 7, "star": 7, "primal": 7},
    "cut": {"blood": 9, "shadow": 9, "dream": 9, "rune": 9, "star": 9, "primal": 9},
    "explosion": {"blood": 6, "shadow": 7, "dream": 6, "rune": 6, "star": 6, "primal": 6},
    "impact": {"blood": 5, "shadow": 5, "dream": 5, "rune": 5, "star": 5, "primal": 6},
}

# category -> (folder, png suffix, playback pacing, on-screen target, blend)
CATEGORY = {
    "cast": {
        "folder": "assets/effects/cast",
        "suffix": "Cast",
        "duration_ms": 380,
        "display_size": 230,
        "blend": None,
    },
    "beam": {
        "folder": "assets/effects/projectiles/Beam",
        "suffix": "Beam",
        "duration_ms": 460,
        "display_size": 96,
        "blend": None,
    },
    "cut": {
        "folder": "assets/effects/projectiles/Schnitt",
        "suffix": "Cut",
        "duration_ms": 440,
        "display_size": 250,
        "blend": None,
    },
    "explosion": {
        "folder": "assets/effects/projectiles/Explosion",
        "suffix": "Explosion",
        "duration_ms": 460,
        "display_size": 270,
        "blend": None,
    },
    "impact": {
        "folder": "assets/effects/impact",
        "suffix": "Impact",
        "duration_ms": 380,
        "display_size": 210,
        "blend": None,
    },
}

ALPHA_THRESHOLD = 8
CROSS_PAD = 6


def content_extent(alpha: np.ndarray, axis: int) -> tuple[int, int]:
    """Min/max index (inclusive) along `axis` where any content exists."""
    present = (alpha > ALPHA_THRESHOLD).any(axis=axis)
    idx = np.where(present)[0]
    if idx.size == 0:
        return 0, alpha.shape[1 - axis] - 1
    return int(idx[0]), int(idx[-1])


def build_frames(width: int, height: int, count: int, cross_lo: int, cross_hi: int, vertical: bool):
    frames = []
    axis_len = height if vertical else width
    cross_start = cross_lo
    cross_size = cross_hi - cross_lo + 1
    for i in range(count):
        strip_start = round(i * axis_len / count)
        strip_end = round((i + 1) * axis_len / count)
        strip_size = strip_end - strip_start
        if vertical:
            rect = {"x": cross_start, "y": strip_start, "w": cross_size, "h": strip_size}
        else:
            rect = {"x": strip_start, "y": cross_start, "w": strip_size, "h": cross_size}
        frames.append(rect)
    return frames


def generate_sheet(category: str, school: str):
    cat = CATEGORY[category]
    prefix = SCHOOL_PREFIX[school]
    png_rel = f"{cat['folder']}/{prefix}_{cat['suffix']}.png"
    png_path = ROOT / png_rel
    if not png_path.exists():
        raise SystemExit(f"Missing sheet: {png_path}")

    im = Image.open(png_path).convert("RGBA")
    W, H = im.size
    alpha = np.array(im)[:, :, 3]
    vertical = H >= W
    count = FRAME_COUNTS[category][school]

    if vertical:
        lo, hi = content_extent(alpha, axis=0)  # trim x (columns)
    else:
        lo, hi = content_extent(alpha, axis=1)  # trim y (rows)
    cross_dim = W if vertical else H
    lo = max(0, lo - CROSS_PAD)
    hi = min(cross_dim - 1, hi + CROSS_PAD)

    frames = build_frames(W, H, count, lo, hi, vertical)

    vfx_school = SCHOOL_VFX_ID[school]
    style_key = f"school_{category}_{vfx_school}"
    frame_names = [f"{style_key}_{i:02d}.png" for i in range(count)]
    frames_dict = {}
    for name, rect in zip(frame_names, frames):
        frames_dict[name] = {
            "frame": rect,
            "rotated": False,
            "trimmed": False,
            "spriteSourceSize": {"x": 0, "y": 0, "w": rect["w"], "h": rect["h"]},
            "sourceSize": {"w": rect["w"], "h": rect["h"]},
            "anchor": {"x": 0.5, "y": 0.5},
        }

    frame_w = frames[0]["w"]
    frame_h = frames[0]["h"]
    duration = cat["duration_ms"]
    animation_speed = round(count * 1000 / (60 * duration), 4)

    manifest = {
        "frames": frames_dict,
        "animations": {"play": frame_names},
        "meta": {
            "app": "BattleMages VFX Pipeline",
            "version": "1.0",
            "image": f"{prefix}_{cat['suffix']}.png",
            "format": "RGBA8888",
            "size": {"w": W, "h": H},
            "scale": "1",
            "frameSize": {"w": frame_w, "h": frame_h},
            "frameCount": count,
            "styleKey": style_key,
            "school": vfx_school,
            "category": category,
            "durationMs": duration,
        },
    }

    json_rel = f"{cat['folder']}/{prefix}_{cat['suffix']}.json"
    (ROOT / json_rel).write_text(
        json.dumps(manifest, indent=2, ensure_ascii=False), encoding="utf-8"
    )

    preset = {
        "styleKey": style_key,
        "spritesheet": json_rel,
        "animation": "play",
        "frameW": frame_w,
        "frameH": frame_h,
        "frameCount": count,
        "displaySize": cat["display_size"],
        "animationSpeed": animation_speed,
        "duration": duration,
        "blendMode": cat["blend"],
    }
    return style_key, preset, json_rel


def main() -> None:
    presets = {}
    manifests = []
    for category in CATEGORY:
        for school in SCHOOL_PREFIX:
            style_key, preset, json_rel = generate_sheet(category, school)
            presets[style_key] = preset
            manifests.append(json_rel)

    presets_js = json.dumps(presets, indent=4, ensure_ascii=False)
    manifests_js = json.dumps(manifests, indent=4, ensure_ascii=False)
    school_map_js = json.dumps(SCHOOL_VFX_ID, indent=4, ensure_ascii=False)

    out = ROOT / "data" / "vfx" / "schoolVfxAssets.js"
    out.write_text(
        "/* Auto-generated by tools/generate_school_vfx_manifests.py "
        "\u2014 do not edit by hand. */\n"
        "/*\n"
        " * Per-school VFX sheet presets, one per category (cast/beam/cut/explosion/impact).\n"
        " * Style keys: school_<category>_<vfxSchool>, using the NEW school naming\n"
        " * (biomancy/shadow/psionic/rune/chaos/soul). Frame rects tile the full sprite\n"
        " * sheet so the COMPLETE animation is played, every frame in order.\n"
        " *\n"
        " * VFX_SCHOOL_ID_MAP translates the LEGACY internal school id (data/combatIdentity.js\n"
        " * COMBAT_SCHOOLS: blood/shadow/dream/rune/star/primal) to the canonical VFX school id\n"
        " * used above. This is the ONLY place that bridges old <-> new naming; the legacy ids\n"
        " * must never appear anywhere else in the VFX layer.\n"
        " */\n"
        f"const VFX_SCHOOL_ID_MAP = {school_map_js};\n\n"
        f"const VFX_SCHOOL_SHEET_PRESETS = {presets_js};\n\n"
        f"const VFX_SCHOOL_SHEET_MANIFESTS = {manifests_js};\n",
        encoding="utf-8",
    )

    print(f"Generated {len(manifests)} manifests + presets -> {out.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
