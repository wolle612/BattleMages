# Biomantie Icon Pilot v2 — Generation Prompts

## Workflow

1. v1-Quellen liegen unter `assets/icons/raw/reference_v2/_source_v1/`.
2. Prompt unten kopieren und mit Cursor CreateImage (Referenz: `_source_v1/`) erzeugen.
3. Freigegebenes Ergebnis als `{spell_id}_ref.png` nach `assets/icons/raw/reference_v2/` legen.
4. Review: `py tools/generate_icon_preview.py --batch biomancy --source v2`
5. Vergleich: `py tools/generate_icon_preview.py --batch biomancy --mode compare --left-source installed --right-source v2`
6. Install: `py tools/install_reference_icons.py --batch biomancy --source v2`

Lesbarkeits-Benchmark (procedural, nicht final): `_benchmark_procedural/`.

## Knochenbruch (`bone_fracture`)

**Motiv:** Broken femur-like bone wrapped in red muscle tissue with bone spikes at the fracture, same as reference.
**Behalten:** bone shape, muscle wrap, fracture spikes, blood accents, full biomancy look
**Streichen:** a few smallest flesh strands and extra micro-cracks only

```
BattleMages spell icon, Biomantie school, Knochenbruch. Motif: Broken femur-like bone wrapped in red muscle tissue with bone spikes at the fracture, same as reference. Palette: dark red, purple-red, bone white, flesh pink accents. Keep: bone shape, muscle wrap, fracture spikes, blood accents, full biomancy look. Remove: a few smallest flesh strands and extra micro-cracks only. Modern production-quality pixel art UI for a dark fantasy RPG. Medium-detail handcrafted pixel art with clear shapes, readable silhouettes, visible pixel structure and carefully placed pixel clusters. Every decorative element must remain readable at game scale. Favor bold forms over excessive detail. Handcrafted pixel art with crisp pixel clusters, visible pixel structure, consistent pixel density and clean pixel edges. Inspired by the atmosphere of an ancient forbidden mage academy. Heavy basalt stone, weathered bronze, engraved magical runes, monumental medieval fantasy architecture, restrained ornamentation, subtle age and wear, dramatic but readable lighting. No digital painting, no concept art brushwork, no photorealism, no smooth gradients, no glossy materials, no mobile game UI, no cartoon style, no anime, no neon. Orthographic front view, perfectly symmetrical, transparent background, game-ready asset. Moderate simplification only (~25% less detail than the reference): keep the same motif, colors, mood and overall composition, slightly bolder shapes and thicker key lines, remove only the smallest micro-textures and stray edge pixels. Still rich dark-fantasy pixel art, not abstract or minimalist. Readable at 48x48 pixels.
```

## Organversagen (`organ_failure`)

**Motiv:** Anatomical heart with vessels on top and dark crack lines, same as reference.
**Behalten:** heart anatomy, major vessels, crack lines, purple-red shading
**Streichen:** finest vein filigree and tiny surface noise only

```
BattleMages spell icon, Biomantie school, Organversagen. Motif: Anatomical heart with vessels on top and dark crack lines, same as reference. Palette: dark red, purple-red, bone white, flesh pink accents. Keep: heart anatomy, major vessels, crack lines, purple-red shading. Remove: finest vein filigree and tiny surface noise only. Modern production-quality pixel art UI for a dark fantasy RPG. Medium-detail handcrafted pixel art with clear shapes, readable silhouettes, visible pixel structure and carefully placed pixel clusters. Every decorative element must remain readable at game scale. Favor bold forms over excessive detail. Handcrafted pixel art with crisp pixel clusters, visible pixel structure, consistent pixel density and clean pixel edges. Inspired by the atmosphere of an ancient forbidden mage academy. Heavy basalt stone, weathered bronze, engraved magical runes, monumental medieval fantasy architecture, restrained ornamentation, subtle age and wear, dramatic but readable lighting. No digital painting, no concept art brushwork, no photorealism, no smooth gradients, no glossy materials, no mobile game UI, no cartoon style, no anime, no neon. Orthographic front view, perfectly symmetrical, transparent background, game-ready asset. Moderate simplification only (~25% less detail than the reference): keep the same motif, colors, mood and overall composition, slightly bolder shapes and thicker key lines, remove only the smallest micro-textures and stray edge pixels. Still rich dark-fantasy pixel art, not abstract or minimalist. Readable at 48x48 pixels.
```

## Blutgerinnsel (`blood_clot`)

**Motiv:** Large blood droplet with dark clot masses and vein-like lines inside, same as reference.
**Behalten:** teardrop shape, inner clots, main vein lines, glossy blood look
**Streichen:** smallest inner vein branches and excessive highlight specks only

```
BattleMages spell icon, Biomantie school, Blutgerinnsel. Motif: Large blood droplet with dark clot masses and vein-like lines inside, same as reference. Palette: dark red, purple-red, bone white, flesh pink accents. Keep: teardrop shape, inner clots, main vein lines, glossy blood look. Remove: smallest inner vein branches and excessive highlight specks only. Modern production-quality pixel art UI for a dark fantasy RPG. Medium-detail handcrafted pixel art with clear shapes, readable silhouettes, visible pixel structure and carefully placed pixel clusters. Every decorative element must remain readable at game scale. Favor bold forms over excessive detail. Handcrafted pixel art with crisp pixel clusters, visible pixel structure, consistent pixel density and clean pixel edges. Inspired by the atmosphere of an ancient forbidden mage academy. Heavy basalt stone, weathered bronze, engraved magical runes, monumental medieval fantasy architecture, restrained ornamentation, subtle age and wear, dramatic but readable lighting. No digital painting, no concept art brushwork, no photorealism, no smooth gradients, no glossy materials, no mobile game UI, no cartoon style, no anime, no neon. Orthographic front view, perfectly symmetrical, transparent background, game-ready asset. Moderate simplification only (~25% less detail than the reference): keep the same motif, colors, mood and overall composition, slightly bolder shapes and thicker key lines, remove only the smallest micro-textures and stray edge pixels. Still rich dark-fantasy pixel art, not abstract or minimalist. Readable at 48x48 pixels.
```

## Anatomie (`anatomy`)

**Motiv:** Full human skeleton seen from the front, skull, ribcage, spine, pelvis, upper arm and leg bones clearly visible as one complete body silhouette, with a few red organ accents in the torso.
**Behalten:** whole skeleton readable at a glance, biomancy horror mood, bone white with dark red organ hints
**Streichen:** individual rib cracks, fine vein lines, tiny blood specks, background clutter

```
BattleMages spell icon, Biomantie school, Anatomie. Motif: Full human skeleton seen from the front, skull, ribcage, spine, pelvis, upper arm and leg bones clearly visible as one complete body silhouette, with a few red organ accents in the torso. Palette: dark red, purple-red, bone white, flesh pink accents. Keep: whole skeleton readable at a glance, biomancy horror mood, bone white with dark red organ hints. Remove: individual rib cracks, fine vein lines, tiny blood specks, background clutter. Modern production-quality pixel art UI for a dark fantasy RPG. Medium-detail handcrafted pixel art with clear shapes, readable silhouettes, visible pixel structure and carefully placed pixel clusters. Every decorative element must remain readable at game scale. Favor bold forms over excessive detail. Handcrafted pixel art with crisp pixel clusters, visible pixel structure, consistent pixel density and clean pixel edges. Inspired by the atmosphere of an ancient forbidden mage academy. Heavy basalt stone, weathered bronze, engraved magical runes, monumental medieval fantasy architecture, restrained ornamentation, subtle age and wear, dramatic but readable lighting. No digital painting, no concept art brushwork, no photorealism, no smooth gradients, no glossy materials, no mobile game UI, no cartoon style, no anime, no neon. Orthographic front view, perfectly symmetrical, transparent background, game-ready asset. Moderate simplification only (~25% less detail than the reference): keep the same motif, colors, mood and overall composition, slightly bolder shapes and thicker key lines, remove only the smallest micro-textures and stray edge pixels. Still rich dark-fantasy pixel art, not abstract or minimalist. Readable at 48x48 pixels.
```

## Knochenpanzer (`bone_armor`)

**Motiv:** Bone rib-plate armor over dark flesh torso with red core, same as reference.
**Behalten:** bone plate armor, flesh underlayer, shoulder spikes, red chest core
**Streichen:** smallest muscle fiber lines and a few outer bone nicks only

```
BattleMages spell icon, Biomantie school, Knochenpanzer. Motif: Bone rib-plate armor over dark flesh torso with red core, same as reference. Palette: dark red, purple-red, bone white, flesh pink accents. Keep: bone plate armor, flesh underlayer, shoulder spikes, red chest core. Remove: smallest muscle fiber lines and a few outer bone nicks only. Modern production-quality pixel art UI for a dark fantasy RPG. Medium-detail handcrafted pixel art with clear shapes, readable silhouettes, visible pixel structure and carefully placed pixel clusters. Every decorative element must remain readable at game scale. Favor bold forms over excessive detail. Handcrafted pixel art with crisp pixel clusters, visible pixel structure, consistent pixel density and clean pixel edges. Inspired by the atmosphere of an ancient forbidden mage academy. Heavy basalt stone, weathered bronze, engraved magical runes, monumental medieval fantasy architecture, restrained ornamentation, subtle age and wear, dramatic but readable lighting. No digital painting, no concept art brushwork, no photorealism, no smooth gradients, no glossy materials, no mobile game UI, no cartoon style, no anime, no neon. Orthographic front view, perfectly symmetrical, transparent background, game-ready asset. Moderate simplification only (~25% less detail than the reference): keep the same motif, colors, mood and overall composition, slightly bolder shapes and thicker key lines, remove only the smallest micro-textures and stray edge pixels. Still rich dark-fantasy pixel art, not abstract or minimalist. Readable at 48x48 pixels.
```
