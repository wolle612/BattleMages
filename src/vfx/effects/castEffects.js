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

    if (isSpritesheetCast) {
        visual.anchor.set(0.5);
        visual.loop = false;
        visual.animationSpeed = preset.animationSpeed || 0.83;
        visual.width = preset.displayWidth || 96;
        visual.height = preset.displayHeight || 71;
        applyVfxBlendMode(visual, preset.blendMode);
    }

    const isFill =
        preset.shape === "circle_fill";

    if (!isSpritesheetCast) {
        drawVfxCircleGraphic(
            visual,
            preset.radius || (isFill ? 10 : 22),
            preset.color,
            isFill ? (preset.alpha ?? 0.82) : 0.9,
            isFill
        );
    }

    visual.position.set(anchor.x, anchor.y);
    visual.scale.set(
        isSpritesheetCast
            ? 0.9
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
                    const scale =
                        progress < 0.48
                            ? 0.88 + progress * 0.25
                            : 1 - (progress - 0.48) * 0.04;

                    visual.scale.set(scale);
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
