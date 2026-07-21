const activeVfxHandles = new Set();
let vfxPendingPlaybackCancel = null;

// Prueft, ob fuer eine Schule/Kategorie ein echtes Sprite-Sheet-Preset
// existiert (data/vfx/schoolVfxAssets.js). Fehlt es, wird der Schritt bewusst
// uebersprungen statt ein fremdes Sheet wiederzuverwenden.
//
// `school` ist die LEGACY-interne Schul-ID (data/combatIdentity.js
// COMBAT_SCHOOLS: blood/shadow/dream/rune/star/primal). Diese darf NICHT mit
// der neuen VFX-Schul-Benennung (biomancy/shadow/psionic/rune/chaos/soul)
// vermischt werden — VFX_SCHOOL_ID_MAP (data/vfx/schoolVfxAssets.js) ist die
// einzige Uebersetzungsstelle dafuer.
function resolveSchoolSheetStyle(category, school) {
    const vfxSchoolId =
        (typeof VFX_SCHOOL_ID_MAP !== "undefined" && VFX_SCHOOL_ID_MAP[school]) ||
        school;

    const styleKey =
        `school_${category}_${vfxSchoolId}`;

    if (
        typeof VFX_SCHOOL_SHEET_PRESETS !== "undefined" &&
        VFX_SCHOOL_SHEET_PRESETS[styleKey]
    ) {
        return styleKey;
    }

    return null;
}

// Baut die Projektilphase aus dem verbindlichen Projektiltyp (MD v1.0).
function buildVfxProjectilePhase(projectileType, school) {
    if (!projectileType) {
        return null;
    }

    if (projectileType === "beam") {
        const style =
            resolveSchoolSheetStyle("beam", school);

        return style
            ? { mode: "beam", style, from: "caster", to: "target" }
            : null;
    }

    if (projectileType === "cut" || projectileType === "explosion") {
        // Schnitt/Explosion fliegen nicht: sie erscheinen direkt auf dem Ziel.
        const style =
            resolveSchoolSheetStyle(projectileType, school);

        return style
            ? { mode: "onTarget", style }
            : null;
    }

    if (projectileType === "shield") {
        // Schild erscheint auf dem Portrait, das den Schild erhaelt. Nutzt die
        // bestehende Portrait-Schild-Animation (renderer/portraitRegistry) am
        // Impact-Zeitpunkt; keine Projektilbewegung, keine Doppelanimation.
        return { mode: "shield" };
    }

    if (projectileType === "projectile") {
        // Klassisches fliegendes Geschoss: aktuell existiert KEIN eigenes
        // Projektil-Sprite-Sheet. Die Phase wird uebersprungen (Hook: sobald
        // ein Asset vorliegt, hier { mode: "fly", style: ... } eintragen).
        return { mode: "fly", style: null };
    }

    return null;
}

// Datengetriebene Zauber-Definition: Cast + Impact aus der Schule,
// Projektiltyp aus SPELL_PROJECTILE_TYPES (MD v1.0). Keine per-Zauber-
// Hardcodierung ausserhalb dieser Daten.
function resolveSpellVfxDefinition(spellId) {
    const override =
        typeof VFX_SPELL_DEFINITIONS !== "undefined"
            ? VFX_SPELL_DEFINITIONS[spellId]
            : null;

    if (override && override.cast) {
        return override;
    }

    const spell =
        getSpellById(spellId);

    if (!spell) {
        return VFX_GENERIC_DEFAULT;
    }

    const school =
        spell.school;

    const castStyle =
        resolveSchoolSheetStyle("cast", school);

    const impactStyle =
        resolveSchoolSheetStyle("impact", school);

    const projectileType =
        typeof getSpellProjectileType === "function"
            ? getSpellProjectileType(spellId)
            : null;

    // Sicherheitsnetz fuer unbekannte/zukuenftige Schulen ohne Sheet-Presets:
    // faellt auf die prozeduralen Schul-Defaults zurueck, statt gar nichts zu
    // zeigen. Fuer alle 6 aktuellen Schulen ist dies unerreichbar, da deren
    // Sheets als Daten (nicht als Bild) immer vorhanden sind.
    if (!castStyle && !impactStyle) {
        return getVfxSchoolDefault(spell.school, spell.type);
    }

    const isAttack =
        projectileType && projectileType !== "shield";

    return {
        cast: castStyle ? { style: castStyle } : null,
        projectile: buildVfxProjectilePhase(projectileType, school),
        impact: impactStyle ? { style: impactStyle } : null,
        // Hook: Trails/Partikel sind bewusst noch leer, koennen spaeter je
        // Schule/Zauber ergaenzt werden, ohne die Choreografie zu aendern.
        particles: [],
        camera: isAttack ? { shake: "small" } : null,
        combatTiming: override?.combatTiming
    };
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

// Fuehrt einen einzelnen Render-Schritt fehlertolerant aus: ein Fehler in EINER
// Phase (z. B. ein defektes Sprite-Sheet) darf niemals die gesamte Cast ->
// Projektiltyp -> Impact-Kette (und damit den Schadenszeitpunkt) zum Stillstand
// bringen. Ohne dieses Netz wuerde eine synchron geworfene Exception die
// gesamte restliche Choreografie unbemerkt abbrechen.
function runVfxPhaseSafely(label, fn) {
    try {
        return fn();
    } catch (error) {
        console.warn(`[VFX] Fehler in Phase "${label}":`, error);
        return null;
    }
}

function playVfxImpactWave(definition, anchors, options = {}) {
    if (typeof options.onImpact === "function") {
        options.onImpact();
        options.onImpact = null;
    }

    if (definition.impact) {
        runVfxPhaseSafely("impact", () =>
            trackVfxHandle(playImpactEffect(definition.impact, anchors))
        );
    }

    if (definition.particles) {
        runVfxPhaseSafely("particles", () =>
            trackVfxHandle(playParticleEffect(definition.particles, anchors))
        );
    }

    if (definition.camera) {
        playCameraEffect(definition.camera);
    }

    if (definition.sound?.impact) {
        playVfxSound(definition.sound.impact);
    }
}

function estimateVfxCastDelay(definition) {
    if (!definition.cast) {
        return 0;
    }

    const castPreset =
        resolveVfxCastPreset(definition.cast);

    const castDuration =
        definition.cast.duration || castPreset?.duration || 300;

    // Strikte Reihenfolge (MD v1.0): der Projektiltyp startet erst NACH dem
    // vollstaendigen Cast. Kein bewusster Overlap, ausser ein Zauber setzt
    // explizit delayBeforeProjectile.
    return definition.cast.delayBeforeProjectile ??
        Math.round(castDuration);
}

function estimateVfxProjectilePhaseDuration(projectile, context) {
    if (!projectile) {
        return 40;
    }

    if (projectile.mode === "beam" && projectile.style) {
        return resolveVfxProjectilePreset(projectile)?.duration || 460;
    }

    if (projectile.mode === "onTarget" && projectile.style) {
        return resolveVfxImpactPreset(projectile)?.duration || 360;
    }

    if (projectile.mode === "shield") {
        return 60;
    }

    if (projectile.mode === "fly") {
        if (!projectile.style) {
            return 60;
        }
    } else if (!projectile.style) {
        return 60;
    }

    // Legacy/prozedurales fliegendes Projektil (Gegneraktionen, Fallback).
    const projectilePreset =
        resolveVfxProjectilePreset(projectile);

    const speed =
        projectile.speed || projectilePreset?.speed || 900;

    const anchors =
        buildVfxAnchors(context);

    let distance = 360;

    if (anchors.caster && anchors.target) {
        distance = Math.hypot(
            anchors.target.x - anchors.caster.x,
            anchors.target.y - anchors.caster.y
        );
    }

    return projectile.duration ??
        Math.max(120, Math.round((distance / speed) * 1000));
}

function estimateVfxImpactDelayMs(definition, context = {}, skipCast = false) {
    if (!definition) {
        return 0;
    }

    return Math.round(
        (skipCast ? 0 : estimateVfxCastDelay(definition)) +
        estimateVfxProjectilePhaseDuration(definition.projectile, context)
    );
}

// Spielt die mittlere Phase (Projektiltyp) und liefert die Dauer, nach der der
// Schul-Impact starten soll ("Nach Abschluss des Projektiltyps startet
// automatisch der Impact").
function playVfxProjectilePhase(projectile, anchors) {
    if (!projectile) {
        return 40;
    }

    if (projectile.mode === "beam" && projectile.style) {
        const handle = runVfxPhaseSafely("projectile:beam", () =>
            trackVfxHandle(playBeamEffect(projectile, anchors))
        );

        return handle?.durationMs || 460;
    }

    if (projectile.mode === "onTarget" && projectile.style) {
        // Schnitt/Explosion erscheinen direkt auf dem Ziel (kein Flug) und
        // werden wie ein Impact am Ziel-Anchor abgespielt.
        const handle = runVfxPhaseSafely("projectile:onTarget", () =>
            trackVfxHandle(
                playImpactEffect({ style: projectile.style }, anchors)
            )
        );

        return handle?.durationMs || 360;
    }

    if (projectile.mode === "shield") {
        // Kein PixiJS-Objekt: die Portrait-Schild-Animation laeuft ueber die
        // bestehende CSS-Pipeline (renderFloatingImpact) zum Impact-Zeitpunkt.
        return 60;
    }

    if (projectile.mode === "fly" && !projectile.style) {
        // Kein Projektil-Asset vorhanden -> Schritt uebersprungen.
        return 60;
    }

    if (!projectile.style) {
        return 60;
    }

    // Legacy/prozedurales fliegendes Projektil (Gegneraktionen, Fallback).
    const handle = runVfxPhaseSafely("projectile:fly", () =>
        trackVfxHandle(playProjectileEffect(projectile, anchors))
    );

    return handle?.durationMs || 200;
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

        // Phase 1 – Cast: erscheint sofort am wirkenden Charakter. Wird
        // uebersprungen, wenn dieser Moment die Fortsetzung desselben
        // Zauber-Casts ist (mehrere effects[] desselben Zaubers, siehe
        // combatVfxAdapter.js isContinuationOfSameSpellCast) – der
        // Beschwoerungs-Flash soll nur einmal pro Cast erscheinen.
        if (definition.cast && !options.skipCast) {
            runVfxPhaseSafely("cast", () =>
                trackVfxHandle(playCastEffect(definition.cast, anchors))
            );
        }

        if (definition.sound?.cast && !options.skipCast) {
            playVfxSound(definition.sound.cast);
        }

        const delayBeforeProjectile =
            options.skipCast
                ? 0
                : estimateVfxCastDelay(definition);

        // Phase 2 – Projektiltyp: startet nach Abschluss des Casts. Phase 3 –
        // Impact: startet nach Abschluss der Projektilphase, immer am Ziel und
        // synchron zum Schadenszeitpunkt (impactOptions.onImpact).
        timeline.schedule(delayBeforeProjectile, () => {
            if (definition.sound?.projectile) {
                playVfxSound(definition.sound.projectile);
            }

            const projectilePhaseMs =
                runVfxPhaseSafely("projectile", () =>
                    playVfxProjectilePhase(definition.projectile, anchors)
                ) || 60;

            timeline.schedule(projectilePhaseMs, () => {
                playVfxImpactWave(definition, anchors, impactOptions);
            });
        });

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
    styleKey = "school_impact_biomancy",
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
