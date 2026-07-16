function createVfxParticlePoolKey(color, size) {
    return `particle-${color}-${size}`;
}

function playSingleParticleBurst(particleDefinition, anchors) {
    const preset =
        resolveVfxParticlePreset(particleDefinition);

    const layer =
        getVfxLayer("particle");

    const anchorKey =
        particleDefinition?.at || "target";

    const anchor =
        anchors?.[anchorKey] || anchors?.target;

    if (!layer || !anchor || !preset) {
        return createNoopVfxHandle();
    }

    const count =
        particleDefinition?.count || preset.count || 8;

    const duration =
        preset.duration || 340;

    const poolKey =
        createVfxParticlePoolKey(preset.color, preset.size || 3);

    const particles = [];

    for (let index = 0; index < count; index++) {
        const particle =
            acquireVfxPoolItem(poolKey, () => {
                const graphic =
                    new PIXI.Graphics();

                drawVfxCircleGraphic(
                    graphic,
                    preset.size || 3,
                    preset.color,
                    1,
                    true
                );

                return graphic;
            });

        particle.position.set(anchor.x, anchor.y);
        particle.alpha = 1;

        layer.addChild(particle);

        particles.push({
            particle,
            angle: Math.random() * Math.PI * 2,
            travel: (preset.spread || 36) * (0.6 + Math.random() * 0.4)
        });
    }

    renderVfxFrame();

    function releaseParticles() {
        particles.forEach(({ particle }) => {
            releaseVfxPoolItem(poolKey, particle);
        });
    }

    const cancelTween =
        runVfxTween(
            duration,
            progress => {
                particles.forEach(({ particle, angle, travel }) => {
                    particle.position.set(
                        anchor.x + Math.cos(angle) * travel * progress,
                        anchor.y + Math.sin(angle) * travel * progress
                    );

                    particle.alpha = 1 - progress;
                });
            },
            releaseParticles
        );

    return createVfxHandle(duration, () => {
        cancelTween();
        releaseParticles();
    });
}

function playParticleEffect(particleDefinitions, anchors) {
    const definitions =
        Array.isArray(particleDefinitions)
            ? particleDefinitions
            : [particleDefinitions];

    const handles =
        definitions
            .filter(Boolean)
            .map(definition => playSingleParticleBurst(definition, anchors));

    if (handles.length === 0) {
        return createNoopVfxHandle();
    }

    const maxDuration =
        Math.max(...handles.map(handle => handle.durationMs));

    return createVfxHandle(maxDuration, () => {
        handles.forEach(handle => handle.cancel());
    });
}
