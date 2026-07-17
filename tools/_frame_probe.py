from PIL import Image
import glob, os
import numpy as np


def detect(p):
    im = Image.open(p).convert('RGBA')
    a = np.array(im)[:, :, 3]
    H, W = a.shape
    vert = H >= W
    axislen = H if vert else W
    # content presence per line, low threshold to catch faint fade frames
    prof = (a > 8).sum(axis=1) if vert else (a > 8).sum(axis=0)
    present = prof > (0.004 * (W if vert else H))  # need a few px of content
    # bands
    bands = []
    start = None
    for i, c in enumerate(present):
        if c and start is None:
            start = i
        elif not c and start is not None:
            bands.append([start, i - 1])
            start = None
    if start is not None:
        bands.append([start, len(present) - 1])
    if not bands:
        return vert, 0, []
    # merge bands whose gap is small relative to median band pitch
    # first pass: merge tiny gaps
    merge_gap = max(6, axislen // 80)
    merged = []
    for b in bands:
        if merged and b[0] - merged[-1][1] - 1 <= merge_gap:
            merged[-1][1] = b[1]
        else:
            merged.append(b[:])
    # drop bands smaller than min_band
    min_band = max(6, axislen // 120)
    merged = [m for m in merged if (m[1] - m[0] + 1) >= min_band]
    return vert, len(merged), merged


for f in ['assets/effects/cast',
          'assets/effects/projectiles/Beam',
          'assets/effects/projectiles/Schnitt',
          'assets/effects/projectiles/Explosion',
          'assets/effects/impact']:
    print('==== ' + f)
    for p in sorted(glob.glob(f + '/*.png')):
        vert, n, bands = detect(p)
        centers = [round((b[0] + b[1]) / 2) for b in bands]
        print(f'{os.path.basename(p):26s} {"V" if vert else "H"} N={n}  centers={centers}')
