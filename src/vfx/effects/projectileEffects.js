function createVfxProjectileVisual(preset) {
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
            sprite.loop = true;
            sprite.animationSpeed = preset.animationSpeed || 0.45;
            applyVfxBlendMode(sprite, preset.blendMode);

            return sprite;
        }
    }

    const bolt =
        new PIXI.Graphics();

    drawVfxCircleGraphic(
        bolt,
        preset.size || 6,
        preset.color ?? 0xffffff,
        0.95,
        true
    );

    return bolt;
}

function lerpVfxValue(from, to, progress) {
    return from + (to - from) * progress;
}

function easeProjectileProgress(progress, ease) {
    if (ease === "smoothstep") {
        return progress * progress * (3 - 2 * progress);
    }

    return progress;
}

function getPsionicGlideScale(motion, progress) {
    const pulse =
        motion?.pulse;

    if (!pulse) {
        return 1;
    }

    const peakProgress =
        pulse.peakProgress ?? 0.5;

    if (progress <= peakProgress) {
        return lerpVfxValue(
            pulse.startScale ?? 1,
            pulse.peakScale ?? 1,
            progress / peakProgress
        );
    }

    return lerpVfxValue(
        pulse.peakScale ?? 1,
        pulse.endScale ?? 1,
        (progress - peakProgress) / (1 - peakProgress)
    );
}

function createProjectileTrail(motion, displayWidth) {
    if (!motion?.trail) {
        return null;
    }

    const trail =
        new PIXI.Graphics();

    applyVfxBlendMode(trail, "add");

    return {
        visual: trail,
        points: [],
        accumulatedDistance: 0,
        lastPosition: null,
        radius: Math.max(1, Math.min(3, displayWidth * 0.055))
    };
}

function drawProjectileTrailCircle(graphic, x, y, radius, color, alpha) {
    if (typeof graphic.circle === "function" && typeof graphic.fill === "function") {
        graphic.circle(x, y, radius);
        graphic.fill({ color, alpha });
        return;
    }

    graphic.beginFill(color, alpha);
    graphic.drawCircle(x, y, radius);
    graphic.endFill();
}

function updateProjectileTrail(trailState, position, motion) {
    if (!trailState || !motion?.trail) {
        return;
    }

    const trail =
        motion.trail;

    if (!trailState.lastPosition) {
        trailState.lastPosition = { ...position };
        trailState.points.push({ ...position });
    } else {
        const deltaX =
            position.x - trailState.lastPosition.x;
        const deltaY =
            position.y - trailState.lastPosition.y;

        trailState.accumulatedDistance +=
            Math.hypot(deltaX, deltaY);

        trailState.lastPosition = { ...position };

        if (trailState.accumulatedDistance >= trail.sampleDistance) {
            trailState.points.unshift({ ...position });
            trailState.accumulatedDistance = 0;
        }
    }

    let coveredLength = 0;

    for (
        let index = 1;
        index < trailState.points.length;
        index += 1
    ) {
        const newerPoint =
            trailState.points[index - 1];
        const olderPoint =
            trailState.points[index];

        coveredLength += Math.hypot(
            newerPoint.x - olderPoint.x,
            newerPoint.y - olderPoint.y
        );

        if (coveredLength > trail.lengthPixels) {
            trailState.points.length = index + 1;
            break;
        }
    }

    const pointCount =
        trailState.points.length;
    const graphic =
        trailState.visual;

    graphic.clear();

    if (pointCount === 0) {
        return;
    }

    const origin =
        trailState.points[0];

    graphic.position.set(origin.x, origin.y);

    for (let index = pointCount - 1; index >= 0; index -= 1) {
        const point =
            trailState.points[index];
        const age =
            pointCount > 1
                ? index / (pointCount - 1)
                : 1;
        const alpha =
            trail.alpha * (1 - age) * (1 - age);
        const radius =
            trailState.radius *
            lerpVfxValue(trail.minScale, 1, 1 - age);

        if (alpha > 0.01) {
            drawProjectileTrailCircle(
                graphic,
                point.x - origin.x,
                point.y - origin.y,
                radius,
                trail.color,
                alpha
            );
        }
    }
}

function destroyProjectileVisual(root, sprite, trailState) {
    if (!root || root.destroyed) {
        return;
    }

    if (sprite instanceof PIXI.AnimatedSprite) {
        sprite.stop();
    }

    if (trailState?.visual.parent) {
        trailState.visual.parent.removeChild(trailState.visual);
    }

    if (trailState?.visual && !trailState.visual.destroyed) {
        trailState.visual.destroy();
    }

    if (root.parent) {
        root.parent.removeChild(root);
    }

    root.destroy({ children: true });
}

function playProjectileEffect(projectileDefinition, anchors) {
    const preset =
        resolveVfxProjectilePreset(projectileDefinition);

    const layer =
        getVfxLayer("projectile");

    const fromAnchor =
        anchors?.[projectileDefinition?.from || "caster"];

    const toAnchor =
        anchors?.[projectileDefinition?.to || "target"];

    if (!layer || !fromAnchor || !toAnchor || !preset) {
        return createNoopVfxHandle();
    }

    const visual =
        createVfxProjectileVisual(preset);

    const isSpritesheetProjectile =
        visual instanceof PIXI.AnimatedSprite;
    const motion =
        resolveVfxProjectileMotionPreset(projectileDefinition, preset);

    const root =
        motion
            ? new PIXI.Container()
            : visual;

    if (isSpritesheetProjectile) {
        const displayWidth =
            preset.displayWidth || 64;
        const displayHeight =
            preset.displayHeight || 24;

        visual.width = displayWidth;
        visual.height = displayHeight;

        const angle =
            Math.atan2(
                toAnchor.y - fromAnchor.y,
                toAnchor.x - fromAnchor.x
            );

        visual.rotation = motion
            ? 0
            : angle;
        visual.gotoAndPlay(0);
    }

    let trailState = null;
    const baseScaleX = visual.scale.x;
    const baseScaleY = visual.scale.y;
    let baseAngle = 0;

    if (motion) {
        const displayWidth =
            preset.displayWidth || 64;

        trailState =
            createProjectileTrail(motion, displayWidth);

        root.addChild(visual);
        root.position.set(fromAnchor.x, fromAnchor.y);

        baseAngle =
            Math.atan2(
                toAnchor.y - fromAnchor.y,
                toAnchor.x - fromAnchor.x
            );
    } else {
        visual.position.set(fromAnchor.x, fromAnchor.y);
    }

    if (trailState) {
        layer.addChild(trailState.visual);
    }

    layer.addChild(root);

    renderVfxFrame();

    const distance =
        Math.hypot(
            toAnchor.x - fromAnchor.x,
            toAnchor.y - fromAnchor.y
        );

    const speed =
        projectileDefinition?.speed || preset.speed || 900;

    const duration =
        projectileDefinition?.duration ||
        Math.max(120, (distance / speed) * 1000);

    const cancelTween =
        runVfxTween(
            duration,
            progress => {
                const flightProgress =
                    easeProjectileProgress(progress, motion?.ease);
                const pathX =
                    fromAnchor.x +
                    (toAnchor.x - fromAnchor.x) * flightProgress;
                const pathY =
                    fromAnchor.y +
                    (toAnchor.y - fromAnchor.y) * flightProgress;

                if (motion) {
                    const wobble =
                        (motion.pathWobblePixels || 0) *
                        Math.sin(progress * Math.PI);
                    const angle =
                        Math.atan2(
                            toAnchor.y - fromAnchor.y,
                            toAnchor.x - fromAnchor.x
                        );
                    const position = {
                        x: pathX - Math.sin(angle) * wobble,
                        y: pathY + Math.cos(angle) * wobble
                    };
                    const scale =
                        getPsionicGlideScale(motion, progress);
                    const rotationOffset =
                        ((motion.rotationDegrees || 0) * Math.PI / 180) *
                        Math.sin(progress * Math.PI * 2);

                    root.position.set(position.x, position.y);
                    visual.scale.set(
                        baseScaleX * scale,
                        baseScaleY * scale
                    );
                    visual.rotation =
                        baseAngle + rotationOffset;
                    updateProjectileTrail(trailState, position, motion);
                } else {
                    visual.position.set(pathX, pathY);
                }

                root.alpha =
                    progress < 0.85
                        ? 1
                        : (1 - progress) / 0.15;
            },
            () => destroyProjectileVisual(root, visual, trailState)
        );

    return createVfxHandle(duration, () => {
        cancelTween();
        destroyProjectileVisual(root, visual, trailState);
    });
}

/*
 * Beam-Projektiltyp (siehe VFX Animation Mapping): der Strahl fliegt NICHT,
 * sondern verbindet Spieler- und Gegnerportrait sofort und vollstaendig. Das
 * Sprite Sheet wird auf die volle Distanz gestreckt (dynamische Laenge) und
 * dabei komplett durchanimiert (jeder Frame in Reihenfolge, feste Framerate
 * ueber preset.animationSpeed / den Pixi-Ticker).
 */
function playBeamEffect(projectileDefinition, anchors) {
    const preset =
        resolveVfxProjectilePreset(projectileDefinition);

    const layer =
        getVfxLayer("projectile");

    const fromAnchor =
        anchors?.[projectileDefinition?.from || "caster"];

    const toAnchor =
        anchors?.[projectileDefinition?.to || "target"];

    if (!layer || !fromAnchor || !toAnchor || !preset) {
        return createNoopVfxHandle();
    }

    const textures =
        preset.spritesheet
            ? getVfxSpritesheetAnimation(
                preset.spritesheet,
                preset.animation || "play"
            )
            : null;

    if (!textures || textures.length === 0) {
        return createNoopVfxHandle();
    }

    const sprite =
        new PIXI.AnimatedSprite(textures);

    sprite.anchor.set(0.5);
    sprite.loop = false;
    sprite.animationSpeed = preset.animationSpeed || 0.25;
    applyVfxBlendMode(sprite, preset.blendMode);

    const deltaX =
        toAnchor.x - fromAnchor.x;

    const deltaY =
        toAnchor.y - fromAnchor.y;

    const distance =
        Math.hypot(deltaX, deltaY);

    // Der Beam ueberlappt beide Portraits leicht, damit er sich sichtbar
    // vollstaendig von Portrait zu Portrait erstreckt statt nur zwischen den
    // Mittelpunkten zu enden.
    const length =
        distance + 56;

    const thickness =
        preset.displaySize || 96;

    sprite.width = length;
    sprite.height = thickness;
    sprite.rotation = Math.atan2(deltaY, deltaX);
    sprite.position.set(
        fromAnchor.x + deltaX / 2,
        fromAnchor.y + deltaY / 2
    );

    layer.addChild(sprite);
    sprite.gotoAndPlay(0);
    renderVfxFrame();

    const duration =
        projectileDefinition?.duration || preset.duration || 460;

    let disposed = false;

    const dispose = () => {
        if (disposed) {
            return;
        }

        disposed = true;
        sprite.stop();
        destroyVfxDisplayObject(sprite);
    };

    const cancelTimer =
        window.setTimeout(dispose, duration + 40);

    return createVfxHandle(duration, () => {
        window.clearTimeout(cancelTimer);
        dispose();
    });
}
