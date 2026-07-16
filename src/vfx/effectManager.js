const activeVfxHandles = new Set();
let vfxPendingPlaybackCancel = null;

function resolveSpellVfxDefinition(spellId) {
    const explicitDefinition =
        typeof VFX_SPELL_DEFINITIONS !== "undefined"
            ? VFX_SPELL_DEFINITIONS[spellId]
            : null;

    if (explicitDefinition) {
        return explicitDefinition;
    }

    const spell =
        getSpellById(spellId);

    if (!spell) {
        return VFX_GENERIC_DEFAULT;
    }

    return getVfxSchoolDefault(spell.school, spell.type);
}

function buildVfxAnchors(context) {
    const casterSide =
        context.caster === "enemy" ? "enemy" : "player";

    const targetSide =
        context.target === "enemy" ? "enemy" : "player";

    return {
        caster: resolveVfxAnchorPoint(casterSide),
        target: resolveVfxAnchorPoint(targetSide),
        stage: resolveVfxAnchorPoint("stage")
    };
}

function trackVfxHandle(handle, cleanupAfterMs) {
    if (!handle) {
        return handle;
    }

    activeVfxHandles.add(handle);

    const cleanupDelay =
        cleanupAfterMs ?? (handle.durationMs || 0) + 60;

    window.setTimeout(() => {
        activeVfxHandles.delete(handle);
    }, cleanupDelay);

    return handle;
}

function playVfxImpactWave(definition, anchors, options = {}) {
    if (typeof options.onImpact === "function") {
        options.onImpact();
        options.onImpact = null;
    }

    if (definition.impact) {
        trackVfxHandle(playImpactEffect(definition.impact, anchors));
    }

    if (definition.particles) {
        trackVfxHandle(playParticleEffect(definition.particles, anchors));
    }

    if (definition.camera) {
        playCameraEffect(definition.camera);
    }

    if (definition.sound?.impact) {
        playVfxSound(definition.sound.impact);
    }
}

function estimateVfxImpactDelayMs(definition, context = {}) {
    if (!definition) {
        return 0;
    }

    let delayMs = 0;

    if (definition.cast) {
        const castPreset =
            resolveVfxCastPreset(definition.cast);

        const castDuration =
            definition.cast.duration || castPreset?.duration || 200;

        delayMs +=
            definition.cast.delayBeforeProjectile ??
            castDuration * 0.6;
    }

    if (definition.projectile) {
        const projectilePreset =
            resolveVfxProjectilePreset(definition.projectile);

        const speed =
            definition.projectile.speed || projectilePreset?.speed || 900;

        const anchors =
            buildVfxAnchors(context);

        let distance = 360;

        if (anchors.caster && anchors.target) {
            distance = Math.hypot(
                anchors.target.x - anchors.caster.x,
                anchors.target.y - anchors.caster.y
            );
        }

        const flightMs =
            definition.projectile.duration ??
            Math.max(120, (distance / speed) * 1000);

        delayMs += flightMs;
    }

    return Math.round(delayMs);
}

function playVfxDefinition(definition, context = {}, options = {}) {
    if (!isVfxSupported() || !definition) {
        if (typeof options.onImpact === "function") {
            options.onImpact();
        }

        return null;
    }

    mountVfxStage();

    let aborted = false;

    if (vfxPendingPlaybackCancel) {
        vfxPendingPlaybackCancel();
    }

    vfxPendingPlaybackCancel = () => {
        aborted = true;
    };

    const startPlayback = () => {
        vfxPendingPlaybackCancel = null;

        if (aborted) {
            if (typeof options.onImpact === "function") {
                options.onImpact();
            }

            return null;
        }

        ensureVfxRendererActive();

        const anchors =
            buildVfxAnchors(context);

        if (!anchors.caster || !anchors.target) {
            if (typeof options.onImpact === "function") {
                options.onImpact();
            }

            return null;
        }

        const timeline =
            createVfxTimeline();

        const impactOptions = {
            onImpact: options.onImpact
        };

        let delayBeforeImpact = 0;

        if (definition.cast) {
            const castPreset =
                resolveVfxCastPreset(definition.cast);

            trackVfxHandle(playCastEffect(definition.cast, anchors));

            const castDuration =
                definition.cast.duration || castPreset?.duration || 200;

            delayBeforeImpact =
                definition.cast.delayBeforeProjectile ??
                castDuration * 0.6;
        }

        if (definition.sound?.cast) {
            playVfxSound(definition.sound.cast);
        }

        if (definition.projectile) {
            timeline.schedule(delayBeforeImpact, () => {
                const projectileHandle =
                    trackVfxHandle(
                        playProjectileEffect(definition.projectile, anchors)
                    );

                if (definition.sound?.projectile) {
                    playVfxSound(definition.sound.projectile);
                }

                timeline.schedule(projectileHandle.durationMs, () => {
                    playVfxImpactWave(definition, anchors, impactOptions);
                });
            });
        } else {
            timeline.schedule(delayBeforeImpact, () => {
                playVfxImpactWave(definition, anchors, impactOptions);
            });
        }

        const compositeHandle = {
            cancel() {
                timeline.cancel();
            }
        };

        trackVfxHandle(compositeHandle, 4000);

        renderVfxFrame();

        return compositeHandle;
    };

    preloadVfxCoreAssets()
        .catch(error => {
            console.warn("[VFX] Preload fehlgeschlagen:", error);

            return null;
        })
        .then(startPlayback);

    return {
        cancel() {
            aborted = true;
            vfxPendingPlaybackCancel = null;
        }
    };
}

function playSpellVfx(spellId, context = {}, options = {}) {
    return playVfxDefinition(
        resolveSpellVfxDefinition(spellId),
        context,
        options
    );
}

function playEnemyActionVfx(iconKey, context = {}, options = {}) {
    return playVfxDefinition(
        resolveEnemyActionVfxDefinition(iconKey),
        context,
        options
    );
}

function interruptAllVfx() {
    if (vfxPendingPlaybackCancel) {
        vfxPendingPlaybackCancel();
        vfxPendingPlaybackCancel = null;
    }

    activeVfxHandles.forEach(handle => handle.cancel());
    activeVfxHandles.clear();
}

function resetEffectManager() {
    interruptAllVfx();
    resetVfxPools();
    resetVfxAssetCache();
    clearVfxLayers();
}

function previewSpellVfx(spellId, context = { caster: "player", target: "enemy" }) {
    showVfxStage();

    return preloadVfxCoreAssets().then(() => {
        return playVfxDefinition(
            resolveSpellVfxDefinition(spellId),
            context
        );
    });
}

function previewEnemyActionVfx(iconKey, context = { caster: "enemy", target: "player" }) {
    showVfxStage();

    return playEnemyActionVfx(iconKey, context);
}

function previewImpactVfx(
    styleKey = "mind_ring_burst",
    context = { caster: "player", target: "enemy" }
) {
    showVfxStage();

    return preloadVfxCoreAssets().then(() => {
        return playVfxDefinition(
            { impact: { style: styleKey } },
            context
        );
    });
}

// Debug-Werkzeug fuer isoliertes VFX-Testen ohne echten Kampf, z. B. per
// Browser-Konsole: BattleMagesVfx.preview("bone_fracture")
window.BattleMagesVfx = {
    preview: previewSpellVfx,
    previewEnemyAction: previewEnemyActionVfx,
    previewImpact: previewImpactVfx,
    estimateImpactDelay: estimateVfxImpactDelayMs,
    interruptAll: interruptAllVfx,
    reset: resetEffectManager
};
