function createVfxImpactVisual(preset) {
    if (preset.spritesheet) {
        const textures =
            getVfxSpritesheetAnimation(
                preset.spritesheet,
                preset.animation || "play"
            );

        if (textures && textures.length > 0) {
            const sprite =
                new PIXI.AnimatedSprite(textures);

            sprite.anchor.set(0.5);
            sprite.loop = false;
            sprite.animationSpeed = preset.animationSpeed || 0.55;
            applyVfxBlendMode(sprite, preset.blendMode);

            return sprite;
        }
    }

    if (preset.texture) {
        const sprite =
            new PIXI.Sprite(loadVfxTexture(preset.texture));

        sprite.anchor.set(0.5);
        sprite.width = preset.size || 44;
        sprite.height = preset.size || 44;

        return sprite;
    }

    const graphic =
        new PIXI.Graphics();

    drawVfxCircleGraphic(
        graphic,
        preset.radius || 18,
        preset.color,
        0.85,
        true
    );

    return graphic;
}

function playImpactEffect(impactDefinition, anchors) {
    const preset =
        resolveVfxImpactPreset(impactDefinition);

    const layer =
        getVfxLayer("impact");

    const anchor =
        anchors?.target;

    if (!layer || !anchor || !preset) {
        return createNoopVfxHandle();
    }

    const visual =
        createVfxImpactVisual(preset);

    const isSpritesheetImpact =
        visual instanceof PIXI.AnimatedSprite;

    const displaySize =
        preset.displaySize || 96;

    const scaleBase =
        isSpritesheetImpact
            ? 1
            : 0.35 * (impactDefinition?.scale || 1);

    visual.position.set(anchor.x, anchor.y);

    if (isSpritesheetImpact) {
        const size =
            displaySize * (impactDefinition?.scale || 1);

        visual.width = size;
        visual.height = size;
    } else {
        visual.scale.set(scaleBase);
    }

    layer.addChild(visual);

    renderVfxFrame();

    const duration =
        impactDefinition?.duration || preset.duration || 260;

    if (isSpritesheetImpact) {
        visual.gotoAndPlay(0);

        const cancelTimer =
            window.setTimeout(() => {
                destroyVfxDisplayObject(visual);
            }, duration);

        return createVfxHandle(duration, () => {
            window.clearTimeout(cancelTimer);
            visual.stop();
            destroyVfxDisplayObject(visual);
        });
    }

    const cancelTween =
        runVfxTween(
            duration,
            progress => {
                visual.alpha = 1 - progress;
                visual.scale.set(
                    scaleBase + progress * 1.1 * (impactDefinition?.scale || 1)
                );
            },
            () => destroyVfxDisplayObject(visual)
        );

    return createVfxHandle(duration, () => {
        cancelTween();
        destroyVfxDisplayObject(visual);
    });
}
