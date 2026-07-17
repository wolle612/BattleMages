function playCastEffect(castDefinition, anchors) {
    const preset =
        resolveVfxCastPreset(castDefinition);

    const layer =
        getVfxLayer("cast");

    const anchor =
        anchors?.caster;

    if (!layer || !anchor || !preset) {
        return createNoopVfxHandle();
    }

    const textures =
        preset.spritesheet
            ? getVfxSpritesheetAnimation(
                preset.spritesheet,
                preset.animation || "play"
            )
            : null;
    const isSpritesheetCast =
        textures && textures.length > 0;
    const visual =
        isSpritesheetCast
            ? new PIXI.AnimatedSprite(textures)
            : new PIXI.Graphics();

    // Basisskalierung fuer Sprite-Sheet-Casts: haelt das Seitenverhaeltnis der
    // (nicht-quadratischen) Frames und skaliert die groesste Kante auf
    // preset.displaySize. Der Pulse-Tween multipliziert nur relativ dazu.
    let castBaseScale = 0.9;

    if (isSpritesheetCast) {
        visual.anchor.set(0.5);
        visual.loop = false;
        visual.animationSpeed = preset.animationSpeed || 0.83;
        applyVfxBlendMode(visual, preset.blendMode);

        const nativeWidth =
            visual.texture?.width || preset.frameW || 96;

        const dims =
            getVfxSheetDisplayDims(preset);

        castBaseScale =
            nativeWidth > 0
                ? dims.w / nativeWidth
                : 0.9;
    }

    const isFill =
        preset.shape === "circle_fill";

    if (!isSpritesheetCast) {
        // Schul-Sheet-Presets (data/vfx/schoolVfxAssets.js) haben absichtlich
        // KEIN preset.color (sie sind reine Sprite-Sheet-Definitionen). Falls
        // ihr Sheet z. B. wegen eines Ladefehlers nicht verfuegbar ist, greift
        // hier ein neutraler Fallback statt eines undefined-Farbwerts.
        drawVfxCircleGraphic(
            visual,
            preset.radius || (isFill ? 10 : 22),
            preset.color ?? 0xffffff,
            isFill ? (preset.alpha ?? 0.82) : 0.9,
            isFill
        );
    }

    visual.position.set(anchor.x, anchor.y);
    visual.scale.set(
        isSpritesheetCast
            ? castBaseScale
            : (isFill ? 0.55 : 0.4)
    );
    visual.alpha =
        isSpritesheetCast
            ? 1
            : 0;

    layer.addChild(visual);

    if (isSpritesheetCast) {
        visual.gotoAndPlay(0);
    }

    renderVfxFrame();

    let disposed = false;

    const dispose = () => {
        if (disposed) {
            return;
        }

        disposed = true;

        if (isSpritesheetCast) {
            visual.stop();
        }

        destroyVfxDisplayObject(visual);
    };

    const duration =
        castDefinition?.duration || preset.duration || 220;

    const cancelTween =
        runVfxTween(
            duration,
            progress => {
                if (isSpritesheetCast) {
                    const pulse =
                        progress < 0.48
                            ? 0.98 + progress * 0.06
                            : 1.01 - (progress - 0.48) * 0.02;

                    visual.scale.set(castBaseScale * pulse);
                    visual.alpha =
                        progress < 0.93
                            ? 1
                            : (1 - progress) / 0.07;
                    return;
                }

                visual.alpha =
                    progress < 0.65
                        ? progress / 0.65
                        : (1 - progress) / 0.35;

                if (isFill) {
                    visual.scale.set(0.55 + progress * 0.35);
                } else {
                    visual.scale.set(0.4 + progress * 0.8);
                }
            },
            dispose
        );

    return createVfxHandle(duration, () => {
        cancelTween();
        dispose();
    });
}
